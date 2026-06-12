const CACHE_NAME = 'controle-aee-v4';
const urlsToCache = [
  '/Controle-AEE/',
  '/Controle-AEE/alunos/',
  '/Controle-AEE/calendario/',
  '/Controle-AEE/relatorios/',
  '/Controle-AEE/configuracoes/',
  '/Controle-AEE/manifest.json',
];

// Instala e já assume o controle sem esperar a aba fechar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Assume controle de todas as abas abertas imediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate: serve do cache, atualiza em segundo plano
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const network = fetch(event.request)
          .then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);

        return cached || network;
      })
    )
  );
});
