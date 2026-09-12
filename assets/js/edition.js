/* The journal's small enhancements. Reading and navigation work without this. */
(function () {
  'use strict';
  var root = document.documentElement;
  var base = root.getAttribute('data-site-root') || '';
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  function ready() {
    var posts = window.WYQ_POSTS || [];
    document.querySelectorAll('[data-post-count]').forEach(function (node) { node.textContent = String(posts.length); });
    if (posts.length) document.querySelectorAll('[data-latest-post]').forEach(function (a) { a.href = base + posts[0].url; });
    var clock = document.getElementById('edLocalTime');
    var clockTimer;
    function tick() {
      if (!clock) return;
      var now = new Date();
      clock.textContent = now.toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit', hour12:false });
      clock.dateTime = now.toISOString();
    }
    function resumeClock() {
      clearInterval(clockTimer);
      if (clock && !document.hidden) { tick(); clockTimer = setInterval(tick, 30000); }
    }
    resumeClock();
    if (clock) document.addEventListener('visibilitychange', resumeClock);

    var svg = document.getElementById('edOrbit');
    var group = document.getElementById('edOrbitLines');
    var button = document.getElementById('edOrbitNext');
    var title = document.getElementById('edOrbitName');
    if (svg && group && button && window.WYQ_ORBIT) {
      var mode = 0, frame = 0, point = null;
      button.addEventListener('click', function () {
        mode = (mode + 1) % window.WYQ_ORBIT.names.length;
        var fragment = document.createDocumentFragment();
        window.WYQ_ORBIT.paths(mode).forEach(function (line) {
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', line.d); path.setAttribute('opacity', line.opacity); fragment.appendChild(path);
        });
        group.replaceChildren(fragment);
        title.textContent = '0' + (mode + 1) + ' / ' + window.WYQ_ORBIT.names[mode];
        svg.setAttribute('aria-label', '由细线构成的' + window.WYQ_ORBIT.names[mode] + '雕塑');
      });
      var art = svg.closest('.ed-art');
      function reset() {
        cancelAnimationFrame(frame); frame = 0; point = null;
        svg.style.removeProperty('--orbit-rx'); svg.style.removeProperty('--orbit-ry');
      }
      art.addEventListener('pointermove', function (event) {
        if (motion.matches || event.pointerType !== 'mouse') return;
        point = { x:event.clientX, y:event.clientY };
        if (frame) return;
        frame = requestAnimationFrame(function () {
          frame = 0;
          if (!point) return;
          var rect = art.getBoundingClientRect();
          svg.style.setProperty('--orbit-rx', ((point.x - rect.left) / rect.width * 8 - 4).toFixed(2) + 'deg');
          svg.style.setProperty('--orbit-ry', (4 - (point.y - rect.top) / rect.height * 8).toFixed(2) + 'deg');
        });
      }, { passive:true });
      art.addEventListener('pointerleave', reset);
      art.addEventListener('pointercancel', reset);
      window.addEventListener('blur', reset);
      document.addEventListener('visibilitychange', function () { if (document.hidden) reset(); });
      if (motion.addEventListener) motion.addEventListener('change', reset);
    }
    // Keep the static cover selection fresh when the single post index changes.
    var feature = document.getElementById('edFeatured');
    if (feature && posts[0] && feature.getAttribute('href') !== posts[0].url) {
      var p = posts[0];
      feature.href = p.url;
      feature.querySelector('h3').textContent = p.title;
      feature.querySelector('.ed-feature-copy > p').textContent = p.desc;
      feature.querySelector('.ed-feature-meta').textContent = '最近一篇 / ' + p.cat + '　' + p.date;
      var img = feature.querySelector('img');
      img.src = p.ogImage || 'assets/og/default.svg'; img.alt = p.title + '封面';
      feature.querySelector('.ed-feature-image small').textContent = '文章封面';
    }
    var notes = document.getElementById('edNotes');
    if (notes && posts.length > 1) {
      var selected = posts.slice(1, 3);
      var oldLinks = notes.querySelectorAll('.ed-note');
      var changed = selected.some(function (post, i) { return !oldLinks[i] || oldLinks[i].getAttribute('href') !== post.url; });
      if (changed) {
        var list = document.createDocumentFragment();
        selected.forEach(function (post) {
          var link = document.createElement('a'); link.className = 'ed-note'; link.href = post.url;
          var meta = document.createElement('div'); meta.className = 'ed-note-meta'; meta.textContent = 'N° ' + post.num + ' / ' + post.cat + '　' + post.date;
          var heading = document.createElement('h3'); heading.textContent = post.title;
          var description = document.createElement('p'); description.textContent = post.desc;
          var tail = document.createElement('div'); tail.className = 'ed-note-tail'; tail.textContent = (post.tags || []).join(' · ') + '　↗';
          link.append(meta, heading, description, tail); list.appendChild(link);
        });
        notes.replaceChildren(list);
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
