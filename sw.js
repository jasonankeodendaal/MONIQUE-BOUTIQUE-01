
const CACHE_NAME = 'affiliate-bridge-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // CRITICAL: Filter out API calls.
  // 1. Do not touch requests that are not GET (like Login POSTs or Database INSERTs)
  // 2. Do not touch requests to external domains (like supabase.co)
  const url = new URL(event.request.url);
  
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return; // Let the browser handle this request normally
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found, else fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
