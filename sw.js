self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('todo-v1').then((cache) => 
  cache.addAll([
    '/', '/index.html', '/style.css', '/app.js', '/manifest.json'
    // Icons optional
  ].filter(url => url)) // Safe
).catch(err => console.log('Cache optional', err))

    // caches.open('todo-v1').then((cache) => cache.addAll([
    //   '/', '/index.html', '/style.css', '/app.js', '/icon-192.png', '/icon-512.png'
    // ])),
  );
});

self.addEventListener('fetch', (e) => {
  // Skip service worker for manifest.json and ws connections
  if (e.request.url.includes('manifest.json') || e.request.url.includes('/ws')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
    .catch(err => {
      console.log('Fetch failed for:', e.request.url);
      return fetch(e.request);
    })
  );
});
