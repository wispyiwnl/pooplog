// Service Worker de PoopLog.
//
// Estrategia: network-first para el app shell (HTML/CSS/JS). Así los usuarios
// siempre reciben la versión desplegada más reciente cuando tienen internet,
// y solo usan la caché como fallback offline. Evita el problema de "usuarios
// atrapados con código viejo" típico de cache-first.
//
// Si cambias esta estrategia, bumpea CACHE (v2 → v3) para invalidar las cachés
// viejas de clientes ya instalados.

const CACHE = "pooplog-v2";
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

  // Externos (Supabase, fuentes, CDN): siempre red, sin cache.
  if (
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("gstatic.com") ||
    url.hostname.includes("jsdelivr.net")
  ) {
    return;
  }

  // App shell: network-first con fallback a caché.
  // Si hay red, fetch fresco y actualizar caché en segundo plano.
  // Si no hay red, devolver lo que esté en caché.
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return response;
      })
      .catch(() => caches.match(e.request)),
  );
});
