/* =========================================================
   WYQ 专属博客 — Minimal Service Worker
   - 静态资源 stale-while-revalidate
   - 跨源资源 (giscus/prism cdn) 直接通过网络
   ========================================================= */
'use strict';

var VERSION = 'wyq-v6-2026-07-16-full-birthday';
var CORE = [
  './',
  './index.html',
  './assets/css/style.css?v=25',
  './assets/css/prism-wyq.css',
  './assets/js/main.js?v=16',
  './assets/js/enhancements.js?v=2',
  './assets/js/posts-data.js?v=3',
  './assets/js/extras.js?v=5',
  './assets/js/search.js?v=3',
  './assets/js/copy-btn.js',
  './assets/js/view-transitions.js?v=1',
  './assets/js/home-extras.js?v=1',
  './assets/js/birthday.js?v=1',
  './404.html',
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

  // Keep page navigations fresh so date-gated homepage features arrive on time.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      caches.open(VERSION).then(function (cache) {
        return fetch(req).then(function (resp) {
          if (resp && resp.ok && resp.type === 'basic') {
            cache.put(req, resp.clone());
          }
          return resp;
        }).catch(function () {
          return cache.match(req, { ignoreSearch: true }).then(function (cached) {
            if (cached) return cached;
            if (/\/$/.test(url.pathname)) return cache.match('./index.html');
            return cache.match('./404.html');
          });
        });
      })
    );
    return;
  }

  // Static resources: stale-while-revalidate.
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
