const CACHE_NAME = 'formfiller-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './privacy.html',
  './assets/chrome.svg',
  './assets/firefox.svg',
  './assets/safari.svg',
  './assets/icons/icon16.png',
  './assets/icons/icon32.png',
  './assets/icons/icon48.png',
  './assets/demo-en.webm',
  './assets/demo-ja.webm',
  './assets/demo-vi.webm',
  './assets/captions-en.vtt'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request).then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
