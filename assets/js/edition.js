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

    var ride = document.getElementById('pelicanRide');
    // A cached older SVG can safely remain static while its HTML refreshes.
    if (ride && ['pelicanToggle','pelicanNearLeg','pelicanFarLeg','pelicanNearFoot','pelicanFarFoot','pelicanCrank','pelicanRearWheel','pelicanFrontWheel'].every(function (id) { return document.getElementById(id); })) {
      var toggle = document.getElementById('pelicanToggle');
      var near = document.getElementById('pelicanNearLeg'), far = document.getElementById('pelicanFarLeg');
      var crank = document.getElementById('pelicanCrank');
      var nearFoot = document.getElementById('pelicanNearFoot'), farFoot = document.getElementById('pelicanFarFoot');
      var rear = document.getElementById('pelicanRearWheel'), front = document.getElementById('pelicanFrontWheel');
      var phase = 0, animation = 0, last = 0, inView = !('IntersectionObserver' in window), paused = false;
      // Both legs bend forward; feet stay planted on horizontal pedals.
      // Hip-to-ankle distance remains below the two 42px segments for the entire turn.
      function leg(node, shoe, angle) {
        var hip = {x:224,y:174};
        var pedal = {x:247 + 18 * Math.cos(angle),y:238 + 18 * Math.sin(angle)};
        var ankle = {x:pedal.x-4,y:pedal.y-6};
        var dx = ankle.x - hip.x, dy = ankle.y - hip.y, d = Math.hypot(dx,dy);
        var bend = Math.sqrt(Math.max(0,42 * 42 - d * d / 4));
        var knee = {x:(hip.x+ankle.x)/2+dy/d*bend,y:(hip.y+ankle.y)/2-dx/d*bend};
        node.setAttribute('d','M'+hip.x+' '+hip.y+' L'+knee.x.toFixed(2)+' '+knee.y.toFixed(2)+' L'+ankle.x.toFixed(2)+' '+ankle.y.toFixed(2));
        shoe.setAttribute('transform','translate('+pedal.x.toFixed(2)+' '+pedal.y.toFixed(2)+')');
      }
      function draw() {
        var degrees = phase * 180 / Math.PI;
        leg(far,farFoot,phase); leg(near,nearFoot,phase + Math.PI);
        crank.setAttribute('transform','rotate('+degrees.toFixed(2)+' 247 238)');
        rear.setAttribute('transform','rotate('+(degrees*1.6).toFixed(2)+' 153 240)');
        front.setAttribute('transform','rotate('+(degrees*1.6).toFixed(2)+' 345 240)');
      }
      function running() { return inView && !paused && !motion.matches && !document.hidden; }
      function step(now) {
        animation = 0;
        if (!running()) { last = 0; return; }
        if (last) phase = (phase + Math.min(now-last,64) / 2100 * Math.PI * 2) % (Math.PI * 20);
        last = now; draw(); animation = requestAnimationFrame(step);
      }
      function sync() {
        cancelAnimationFrame(animation); animation = 0; last = 0;
        toggle.hidden = motion.matches;
        if (running()) animation = requestAnimationFrame(step);
      }
      toggle.addEventListener('click',function(){
        paused = !paused; toggle.setAttribute('aria-pressed',String(paused));
        toggle.textContent = paused ? '播放动画' : '暂停动画'; sync();
      });
      document.addEventListener('visibilitychange',sync);
      if (motion.addEventListener) motion.addEventListener('change',sync);
      if ('IntersectionObserver' in window) {
        var rideObserver = new IntersectionObserver(function(entries){ inView = entries[0].isIntersecting; sync(); },{threshold:0.05});
        rideObserver.observe(ride);
      }
      draw(); sync();
    }

    // Keep the static cover selection fresh when the single post index changes.
    var feature = document.getElementById('edFeatured');
    if (feature && posts[0]) {
      var p = posts[0];
      feature.href = base + p.url;
      feature.querySelector('h3').textContent = p.title;
      feature.querySelector('.ed-feature-meta').textContent = '最近一篇 / ' + p.cat + '　' + p.date;
      var img = feature.querySelector('img');
      var nextImage = base + (p.ogImage || 'assets/og/default.svg');
      if (img.getAttribute('src') !== nextImage) feature.querySelector('.ed-feature-image small').textContent = '文章封面';
      img.src = nextImage; img.alt = p.title + '封面';
    }
    var notes = document.getElementById('edNotes');
    if (notes && posts.length) {
      var selected = posts.slice(1, 3);
      var list = document.createDocumentFragment();
      selected.forEach(function (post) {
        var link = document.createElement('a'); link.className = 'ed-note'; link.href = base + post.url;
        var meta = document.createElement('div'); meta.className = 'ed-note-meta'; meta.textContent = post.cat + '　' + post.date;
        var heading = document.createElement('h3'); heading.textContent = post.title;
        var tail = document.createElement('div'); tail.className = 'ed-note-tail'; tail.textContent = (post.tags || []).join(' · ') + '　›';
        link.append(meta, heading, tail); list.appendChild(link);
      });
      notes.replaceChildren(list);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
