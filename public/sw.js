// Service worker: приложение открывается и без интернета (после первого запуска).
const V = 'mw-v1';
const SHELL = ['/', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ok = url.origin === location.origin || /(^|\.)(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!ok) return;

  // страницы: сначала сеть, при отсутствии — из кэша
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/')));
    return;
  }
  // остальное (js, css, картинки, шрифты): из кэша + тихое обновление
  e.respondWith(
    caches.open(V).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req)
        .then((r) => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; })
        .catch(() => hit);
      return hit || net;
    }),
  );
});
