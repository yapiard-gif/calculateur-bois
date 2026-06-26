const CACHE_NAME = 'calc-bois-ec5-v2';
const FILES_TO_CACHE = [
  '/calculateur-bois/',
  '/calculateur-bois/index.html',
  '/calculateur-bois/manifest.json',
  '/calculateur-bois/icon-192.png',
  '/calculateur-bois/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Pages HTML → réseau en priorité, cache en fallback (offline)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  // Autres assets (icônes, manifest) → cache normal
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
