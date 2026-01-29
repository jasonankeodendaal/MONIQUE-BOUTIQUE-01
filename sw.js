
const CACHE_NAME = 'affiliate-bridge-v2';
const urlsToCache = [
  '/',
  '/index.html',
  // Removed explicit manifest reference from strict cache list to prevent 404 installation failures
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Use addAll inside a try-catch equivalent to ensure the SW installs even if one file is missing
        return cache.addAll(urlsToCache).catch(err => {
           console.warn('SW: Failed to cache some core assets', err);
        });
      })
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

  if (
    event.request.method !== 'GET' || 
    url.href.includes('supabase.co') || 
    url.protocol.startsWith('chrome-extension')
  ) {
    return;
  }

  const isHTML = event.request.headers.get('accept')?.includes('text/html');

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
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

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(error => {
        // console.log('Fetch failed:', error);
      });
    })
  );
});