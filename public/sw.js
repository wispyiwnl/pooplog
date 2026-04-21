// Service Worker de PoopLog — cachea el app shell para funcionar offline.
// Para forzar actualización en clientes instalados, bumpea CACHE (v1 → v2).

const CACHE = "pooplog-v1";
const SHELL = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./favicon.png",
  "./manifest.json",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Supabase y fuentes externas: siempre ir a red (no cachear).
  if (url.hostname.includes("supabase.co") || url.hostname.includes("googleapis.com") || url.hostname.includes("gstatic.com") || url.hostname.includes("jsdelivr.net")) {
    return;
  }

  // config.js: no cachear — siempre fresco desde red, con fallback a caché si no hay conexión.
  if (url.pathname.endsWith("/config.js")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // App shell: cache-first.
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
