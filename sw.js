const CACHE_NAME = 'controle-aee-v1';
const urlsToCache = [
  '/Controle-AEE/',
  '/Controle-AEE/alunos/',
  '/Controle-AEE/calendario/',
  '/Controle-AEE/relatorios/',
  '/Controle-AEE/configuracoes/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('/Controle-AEE/'));
    })
  );
});
