/* eslint-disable no-restricted-globals */
// 简化版 PWA Service Worker：
// - install 阶段预缓存应用壳（index.html / manifest / 图标）
// - fetch 阶段对同源 GET 采用 cache-first；未命中则网络并写入缓存
// - 保证“至少首访在线后，再次打开可离线可用”

const CACHE_VERSION = 'v1';
const CACHE_NAME = `travel-planner-${CACHE_VERSION}`;

const BASE = self.registration.scope; // e.g. https://user.github.io/repo/

const PRECACHE_URLS = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}favicon.svg`,
  `${BASE}icons.svg`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => {
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))).then(() => {
      self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const req = event.request;
  const url = new URL(req.url);

  // 只缓存同源请求；第三方 CDN 走浏览器默认行为
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      // 未命中：网络获取并写入缓存
      return fetch(req)
        .then((res) => {
          if (!res || !res.ok) return res;
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, clone).catch(() => {});
          });
          return res;
        })
        .catch(() => {
          // 离线兜底：导航请求尝试回退到 index.html
          if (req.mode === 'navigate') {
            return caches.match(`${BASE}index.html`) || caches.match(BASE);
          }
          return undefined;
        });
    })
  );
});

