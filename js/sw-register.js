/* Service-worker registration on every page (audit E-07). Kept separate from page scripts. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
}
