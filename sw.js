/* Service worker (audit E-06 / E-07 / E-08) — network-first, versioned cache.
   - Page navigations: network first; offline -> cached copy of that page, else the cached home page.
   - Assets (css/js/images/video): network first; offline -> cached copy only. A failed asset is NEVER
     answered with HTML (that used to make a missing image/video receive the home page).
   - Never caches query-string requests, cross-origin requests, non-GET or non-OK responses.
   - Bump CACHE when releasing so old caches are dropped on activate. */
var CACHE = 'mfm-v3-2026-10';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.add(new Request('/', { cache: 'reload' })); }).catch(function () {}));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function put(req, res) {
  if (res && res.ok && res.type === 'basic' && res.status === 200) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
  }
  return res;
}
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.indexOf('/.netlify/') === 0 || url.pathname.indexOf('/admin') === 0) return;
  if (req.headers.has('range')) return;            /* media byte ranges: let the browser handle them */
  var isPage = req.mode === 'navigate';
  if (url.search && !isPage) return;               /* versioned assets live in the HTTP cache */
  e.respondWith(
    fetch(req).then(function (res) { return url.search ? res : put(req, res); }).catch(function () {
      return caches.match(req, { ignoreSearch: isPage }).then(function (hit) {
        if (hit) return hit;
        if (isPage) return caches.match('/').then(function (home) { return home || Response.error(); });
        return Response.error();
      });
    })
  );
});
