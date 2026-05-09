const CACHE_NAME = 'controle-aee-v2';
const urlsToCache = [
  '/Controle-AEE/',
  '/Controle-AEE/alunos/',
  '/Controle-AEE/calendario/',
  '/Controle-AEE/relatorios/',
  '/Controle-AEE/configuracoes/',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Limpa caches de versões anteriores ao ativar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => response || caches.match('/Controle-AEE/'))
    )
  );
});
