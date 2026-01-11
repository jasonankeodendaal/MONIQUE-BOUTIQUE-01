
const CACHE_NAME = 'affiliate-bridge-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // CRITICAL STABILITY FIX:
  // 1. Ignore non-GET requests (POST, PUT, DELETE, etc.)
  // 2. Ignore Supabase URLS (API calls should never be cached by SW)
  // 3. Ignore Chrome extensions or other protocols
  if (
    event.request.method !== 'GET' || 
    url.href.includes('supabase.co') || 
    url.protocol.startsWith('chrome-extension')
  ) {
    return;
  }

  // Strategy: Stale-While-Revalidate for assets, Network-First for HTML
  const isHTML = event.request.headers.get('accept')?.includes('text/html');

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If HTML, try network first, fallback to cache
      if (isHTML) {
        return fetch(event.request)
          .then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => cachedResponse || Promise.reject('Offline'));
      }

      // If Asset (JS/CSS/Image), return cache if present, else fetch
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        // Only cache valid responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(error => {
        // If fetch fails (offline) and not in cache, just fail gracefully
        console.log('Fetch failed:', error);
      });
    })
  );
});
