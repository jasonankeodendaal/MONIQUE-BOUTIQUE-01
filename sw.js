
const CACHE_NAME = 'findara-bridge-v4';
const urlsToCache = [
  '/',
  '/index.html'
];

self.addEventListener('install', event => {
  // Force immediate activation
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Claim all clients immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Bypass cache for Supabase (Realtime/Auth) and Chrome extensions
  if (
    event.request.method !== 'GET' || 
    url.href.includes('supabase.co') || 
    url.protocol.startsWith('chrome-extension')
  ) {
    return;
  }

  // 2. Network-First Strategy for EVERYTHING
  // We want the absolute latest version of the hero content and settings
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If we got a valid response, update the cache and return it
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache only if network is completely unavailable
        return caches.match(event.request);
      })
  );
});
