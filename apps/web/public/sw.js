const CACHE_NAME = 'fluxoo-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Mensagem para disparar sync manual quando voltar online (opcional)
self.addEventListener('message', (event) => {
    if (event.data.type === 'SYNC_NOW') {
        console.log('SW: Sincronizando dados offline...');
    }
});
