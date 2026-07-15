/* =========================================================
   WYQ 专属博客 — Minimal Service Worker
   - 静态资源 stale-while-revalidate
   - 跨源资源 (giscus/prism cdn) 直接通过网络
   ========================================================= */
'use strict';

var VERSION = 'wyq-v4-2026-07-15';
var CORE = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/css/prism-wyq.css',
  './assets/js/main.js',
  './assets/js/enhancements.js',
  './assets/js/posts-data.js',
  './assets/js/extras.js',
  './assets/js/search.js',
  './assets/js/copy-btn.js',
  './assets/js/view-transitions.js',
  './lab.html',
  './dna.html',
  './others.html',
  './gradient.html',
  './pomodoro.html',
  './md-card.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      // Best-effort: ignore failures so install never blocks
      return Promise.all(CORE.map(function (u) {
        return c.add(u).catch(function () { /* ignore */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  // Don't intercept cross-origin (giscus, prismjs cdn etc.)
  if (url.origin !== self.location.origin) return;

  // Skip RSS / sitemap so freshness is preserved
  if (/\.(xml|txt)$/.test(url.pathname)) return;

  // Stale-while-revalidate
  e.respondWith(
    caches.open(VERSION).then(function (cache) {
      return cache.match(req).then(function (cached) {
        var net = fetch(req).then(function (resp) {
          if (resp && resp.ok && resp.type === 'basic') {
            cache.put(req, resp.clone());
          }
          return resp;
        }).catch(function () { return cached; });
        return cached || net;
      });
    })
  );
});
