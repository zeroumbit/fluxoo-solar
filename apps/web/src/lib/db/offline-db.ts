// lib/db/offline-db.ts

export class OfflineDB {
  private dbName = 'fluxoo_offline_v1';
  private storeName = 'sync_queue';

  /**
   * Inicializa o IndexedDB (Regra 5).
   */
  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
           db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addToQueue(type: string, payload: any) {
     const db = await this.getDB();
     const tx = db.transaction(this.storeName, 'readwrite');
     const store = tx.objectStore(this.storeName);
     store.add({ 
        type, 
        payload, 
        timestamp: new Date().toISOString(),
        status: 'PENDING' 
     });
     return new Promise((res) => tx.oncomplete = () => res(true));
  }

  async getQueue() {
     const db = await this.getDB();
     const tx = db.transaction(this.storeName, 'readonly');
     const store = tx.objectStore(this.storeName);
     return new Promise<any[]>((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
     });
  }

  async clearQueue() {
     const db = await this.getDB();
     const tx = db.transaction(this.storeName, 'readwrite');
     const store = tx.objectStore(this.storeName);
     store.clear();
  }
}

export const offlineDB = new OfflineDB();
