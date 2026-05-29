const CACHE_NAME = 'controle-aee-v2'; // Incrementei a versão do cache
const urlsToCache = [
  '/Controle-AEE/',
  '/Controle-AEE/alunos/',
  '/Controle-AEE/calendario/',
  '/Controle-AEE/relatorios/',
  '/Controle-AEE/configuracoes/',
  '/Controle-AEE/manifest.json',
];

// Evento de Instalação: baixa e armazena os assets principais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache aberto');
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de Fetch: implementa a estratégia Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Se a requisição for bem sucedida, atualizamos o cache
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // Retorna o cacheado (stale) primeiro, enquanto a rede (revalidate) acontece.
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Evento de Ativação: limpa caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
