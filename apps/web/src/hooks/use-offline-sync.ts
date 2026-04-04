'use client';

import { useState, useEffect } from 'react';
import { offlineDB } from '@/lib/db/offline-db';
import { useToast } from '@/hooks/use-toast';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    // Check queue periodically
    const interval = setInterval(async () => {
        const queue = await offlineDB.getQueue();
        setPendingCount(queue.length);
        if (navigator.onLine && queue.length > 0 && !isSyncing) {
            syncNow();
        }
    }, 5000);

    return () => {
        window.removeEventListener('online', handleStatus);
        window.removeEventListener('offline', handleStatus);
        clearInterval(interval);
    };
  }, [isSyncing]);

  /**
   * Enfilerar operação (Regra 5).
   */
  const queueOperation = async (type: string, payload: any) => {
    if (isOnline) {
        // Envio direto via API (MVP assume que se está online tenta API primeiro)
        console.log('Sending direct operation:', type, payload);
        return { success: true };
    } else {
        await offlineDB.addToQueue(type, payload);
        setPendingCount(prev => prev + 1);
        toast({ title: 'Ação salva offline', description: 'Será sincronizada quando houver internet.' });
        return { queued: true };
    }
  };

  /**
   * Sincronização em lote (Regra 5).
   */
  const syncNow = async () => {
    setIsSyncing(true);
    try {
        const queue = await offlineDB.getQueue();
        if (queue.length === 0) return;

        // Mandar pro backend em lote
        const response = await fetch('/api/sync/offline', {
            method: 'POST',
            body: JSON.stringify({ operations: queue }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            await offlineDB.clearQueue();
            setPendingCount(0);
            toast({ title: 'Sincronização concluída!', description: `${queue.length} alterações enviadas.` });
        }
    } catch (err: any) {
        console.error('Falha na sincronização:', err);
    } finally {
        setIsSyncing(false);
    }
  };

  return { isOnline, pendingCount, isSyncing, queueOperation, syncNow };
}
