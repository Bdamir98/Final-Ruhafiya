const CACHE_NAME = 'ruhafiya-v2-performance';
const STATIC_CACHE_URLS = [
  '/',
  '/favicon.png',
  '/logo.png',
  '/manifest.json'
];

const CACHE_STRATEGIES = {
  images: 'cache-first',
  static: 'cache-first',
  api: 'network-first',
  pages: 'stale-while-revalidate'
};

// Install event - Optimized
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Enhanced fetch handler with performance optimizations
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for specific domains)
  if (!url.origin.includes(self.location.origin) && 
      !url.hostname.includes('img.youtube.com') &&
      !url.hostname.includes('fonts.googleapis.com')) {
    return;
  }

  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Helper functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(request.url);
}

function isStaticAsset(request) {
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(request.url) ||
         request.url.includes('_next/static/');
}

function isApiRequest(request) {
  return request.url.includes('/api/');
}

// Cache-first strategy for images
function handleImageRequest(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(request)
        .then((fetchResponse) => {
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return fetchResponse;
        })
        .catch(() => {
          // Return a fallback image if network fails
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">Image unavailable</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        });
    });
}

// Cache-first strategy for static assets
function handleStaticAsset(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(request)
        .then((fetchResponse) => {
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return fetchResponse;
        });
    });
}

// Network-first strategy for API requests
function handleApiRequest(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      return response;
    })
    .catch(() => {
      return caches.match(request);
    });
}

// Stale-while-revalidate strategy for pages
function handlePageRequest(request) {
  return caches.match(request)
    .then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return networkResponse;
        });
      
      return cachedResponse || fetchPromise;
    });
}