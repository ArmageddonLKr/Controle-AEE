const CACHE_NAME = 'controle-aee-v6';
const urlsToCache = [
  '/Controle-AEE/',
  '/Controle-AEE/alunos/',
  '/Controle-AEE/alunos/novo/',
  '/Controle-AEE/alunos/perfil/',
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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navegações (HTML): REDE PRIMEIRO — garante que atualizações do site
  // apareçam já na primeira recarga; o cache só entra quando estiver offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        fetch(event.request)
          .then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() =>
            cache.match(event.request).then((cached) => cached || cache.match('/Controle-AEE/'))
          )
      )
    );
    return;
  }

  // Demais arquivos (CSS/JS/imagens): stale-while-revalidate.
  // Os chunks do Next têm hash no nome, então servir do cache é seguro.
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
