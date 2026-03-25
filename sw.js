const CACHE_NAME = 'p3-reg-v5'; // 每次修改 index.html 后，把 v5 改成 v6
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 安装时强制缓存所有资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // 强制跳过等待，立即生效
});

// 激活时清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 核心修复：拦截请求，优先使用缓存（实现秒开）
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // 如果缓存有，直接返回（秒开）；否则去联网下载
      return response || fetch(e.request);
    })
  );
});
