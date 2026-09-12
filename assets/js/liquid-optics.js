/* Optical glass, progressively enhanced for the existing static site.
 * Independently implemented rounded-rectangle lens maps and spring dynamics.
 * Effect reference: WXperia/liquid-glass-vue (see docs/liquid-optics.md).
 * SVG displacement only touches a decorative backdrop, never readable content.
 */
(function () {
  'use strict';
  if (window.WYQ_OPTICS) return;
  var root = document.documentElement;
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var reducedTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
  var highContrast = matchMedia('(prefers-contrast: more)');
  var forcedColors = matchMedia('(forced-colors: active)');
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  var ua = navigator.userAgent;
  // Syntax detection alone cannot confirm backdrop displacement rendering.
  // WebKit/Firefox retain the polished CSS lens; they never get a broken filter.
  var chromium = /(?:Chrome|Chromium|Edg|OPR)\//.test(ua) && !/(?:CriOS|FxiOS|EdgiOS)/.test(ua);
  var backdrop = CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
  var readingSurfaces = '.tile,.desk-card,.featured,a.mood,.limited-card__inner,.pn-card:not(.pn-card--placeholder),.related-card,.search-result,.tags-article,.archive-item,.grad-panel,.mc-editor,.mc-card-wrap,.pomo-set,.pomo-stat,.cinema-fact,.cinema-callout,.asset-generator .card';
  var controls = '.btn,.btn-pill,.grad-btn,.mc-btn,.pomo-btn,.wc-action-btn,.home-mini-link,.share-btn,.copy-btn,.code-fold-btn,.tag-cloud__item,.mc-chip,.grad-add,.sound-toggle,.back-to-top,.toc-toggle,.accent-picker-btn,.mario-button,.asset-generator button,.nav__menu a,.nav__menu button,.nav__sub-toggle,.nav-search__close,.search-page__clear,.nav__brand';
  var floating = '.nav__menu,.nav__brand,.nav__submenu,.nav-search,.toc,.accent-picker-panel,.kbd-help__panel,.city-panel';
  var selector = controls + ',' + floating;
  var primary = '.btn--primary,.btn-pill--primary,.grad-btn:not(.grad-btn--ghost),.mc-btn:not(.mc-btn--ghost),.pomo-btn:not(.pomo-btn--ghost),.asset-generator button:not(.secondary)';
  var states = new WeakMap(), all = new Set(), moving = new Set();
  var svg, defs, observer, resizeObserver, intersectionObserver;
  var id = 0, geometryFrame = 0, animationFrame = 0, previousTime = 0;
  var mapCache = new Map();
  var ns = 'http://www.w3.org/2000/svg';
  var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
  var opaque = function () { return reducedTransparency.matches || highContrast.matches || forcedColors.matches || !backdrop; };

  // Signed distance to a rounded rectangle, with an inward-facing edge normal.
  // Neutral channels at the center preserve the scene; only the bevel refracts.
  function lensMap(width, height, radius) {
    var ratio = Math.min(1, 512 / width, 384 / height);
    var w = Math.max(2, Math.round(width * ratio));
    var h = Math.max(2, Math.round(height * ratio));
    var r = clamp(radius, 0, Math.min(width, height) / 2);
    var key = [width, height, r, w, h].join(':');
    if (mapCache.has(key)) return mapCache.get(key);
    var canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    var context = canvas.getContext('2d');
    if (!context) return null;
    var image = context.createImageData(w, h);
    var edge = clamp(Math.min(width, height) * .22, 8, 24);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var px = (x + .5) / w * width - width / 2;
        var py = (y + .5) / h * height - height / 2;
        var qx = Math.abs(px) - (width / 2 - r);
        var qy = Math.abs(py) - (height / 2 - r);
        var ax = Math.max(qx, 0), ay = Math.max(qy, 0);
        var corner = Math.hypot(ax, ay);
        var distance = -(corner + Math.min(Math.max(qx, qy), 0) - r);
        var nx = 0, ny = 0, bend = 0;
        if (distance >= 0 && distance < edge) {
          if (corner > .001) { nx = ax / corner * Math.sign(px); ny = ay / corner * Math.sign(py); }
          else if (qx > qy) nx = Math.sign(px);
          else ny = Math.sign(py);
          var t = distance / edge;
          bend = Math.pow(Math.sin(Math.PI * t), .8);
        }
        var i = (y * w + x) * 4;
        image.data[i] = Math.round(128 - nx * bend * 116);
        image.data[i + 1] = Math.round(128 - ny * bend * 116);
        image.data[i + 2] = 128;
        image.data[i + 3] = 255;
      }
    }
    context.putImageData(image, 0, 0);
    var result = canvas.toDataURL('image/png');
    if (mapCache.size >= 16) mapCache.delete(mapCache.keys().next().value);
    mapCache.set(key, result);
    return result;
  }
  function element(tag, attributes) {
    var node = document.createElementNS(ns, tag);
    Object.keys(attributes || {}).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    return node;
  }
  function dropFilter(state) {
    state.warp.style.removeProperty('backdrop-filter');
    if (state.filter) state.filter.remove();
    state.filter = null; state.geometry = '';
  }
  function attachFilter(state, box, style) {
    var radius = parseFloat(style.borderTopLeftRadius) || 0;
    if (style.borderTopLeftRadius.indexOf('%') !== -1) radius = Math.min(box.width, box.height) * radius / 100;
    var key = [Math.round(box.width), Math.round(box.height), Math.round(radius)].join(':');
    if (state.geometry === key && state.filter) return;
    var url;
    try { url = lensMap(box.width, box.height, radius); } catch (e) { return; }
    if (!url) return;
    dropFilter(state);
    var name = 'wyq-lens-' + (++id);
    var filter = element('filter', { id:name, filterUnits:'userSpaceOnUse', primitiveUnits:'userSpaceOnUse', x:'0', y:'0', width:box.width, height:box.height, 'color-interpolation-filters':'sRGB' });
    filter.appendChild(element('feImage', { x:'0', y:'0', width:box.width, height:box.height, href:url, preserveAspectRatio:'none', result:'lens' }));
    var strength = state.control ? 22 : state.node.matches('.nav__menu') ? 30 : 16;
    // Run the lens on the backdrop input. Filtering the tinted span's own
    // SourceGraphic (v1) produced a grey plate, not refracted page content.
    // A single displacement preserves alpha and avoids RGB screen blending.
    filter.appendChild(element('feDisplacementMap', { in:'SourceGraphic', in2:'lens', scale:strength,
      xChannelSelector:'R', yChannelSelector:'G' }));
    defs.appendChild(filter);
    var blur = state.node.matches('.nav__menu,.nav__brand') ? 8 : state.control ? 4 : 16;
    state.warp.style.setProperty('backdrop-filter', 'url(#' + name + ') blur(' + blur + 'px) saturate(1.3)');
    state.filter = filter; state.geometry = key;
  }
  function rebuild() {
    geometryFrame = 0;
    var enabled = chromium && !opaque() && !document.hidden;
    var limit = finePointer.matches ? 4 : 2;
    var candidates = [];
    all.forEach(function (state) {
      if (!state.node.isConnected) { destroy(state); return; }
      if (!state.node.contains(state.frame)) state.node.prepend(state.frame);
      var nested = state.node.parentElement && state.node.parentElement.closest('.lg-host,' + readingSurfaces);
      if (state.node.classList.contains('lg-nested') !== !!nested) state.node.classList.toggle('lg-nested', !!nested);
      if (!enabled || !state.visible || nested || state.node.matches(':disabled')) { dropFilter(state); return; }
      var style = getComputedStyle(state.node);
      var rect = state.node.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= innerHeight || (state.node.checkVisibility && !state.node.checkVisibility({ checkOpacity:true, checkVisibilityCSS:true }))) { dropFilter(state); return; }
      var box = { top:rect.top, width:state.node.offsetWidth, height:state.node.offsetHeight };
      if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) < .05 || box.width < 4 || box.height < 4) { dropFilter(state); return; }
      candidates.push({ state:state, box:box, style:style });
    });
    candidates.sort(function (a,b) {
      var priority = function (c) { return c.state.node.matches('.nav__menu') ? -3 : c.state.node.matches(floating) ? -2 : -1; };
      return priority(a) - priority(b) || a.box.top - b.box.top;
    });
    candidates.forEach(function (candidate, index) {
      if (index < limit) attachFilter(candidate.state, candidate.box, candidate.style);
      else dropFilter(candidate.state);
    });
    root.dataset.liquidEngine = enabled ? 'svg' : opaque() ? 'opaque' : 'css';
  }
  function scheduleGeometry() {
    if (!geometryFrame) geometryFrame = requestAnimationFrame(rebuild);
  }
  function mount(node) {
    if (states.has(node) || node.closest('.lg-optics, .mc-card, .weather-card, .dna-card, .birthday-stage')) return;
    // Never animate disabled placeholders or replace a form field's native UI.
    if (node.matches('.pn-card--placeholder, input, textarea, select')) return;
    var frame = document.createElement('span');
    frame.className = 'lg-optics'; frame.setAttribute('aria-hidden','true'); frame.inert = true;
    var warp = document.createElement('span'); warp.className = 'lg-warp'; frame.appendChild(warp);
    var style = getComputedStyle(node);
    if (style.position === 'static') node.classList.add('lg-static');
    var control = node.matches(controls);
    node.classList.add('lg-host');
    if (control) node.classList.add('lg-control');
    if (node.matches(primary)) node.classList.add('lg-primary');
    if (node.matches(floating)) node.classList.add('lg-floating');
    node.prepend(frame);
    var state = { node:node, frame:frame, warp:warp, control:control, filter:null, geometry:'', visible:false,
      values:[0,0,1,1], velocity:[0,0,0,0], target:[0,0,1,1], pressed:false };
    states.set(node,state); all.add(state);
    if (intersectionObserver) intersectionObserver.observe(node);
    else state.visible = true;
    if (resizeObserver) resizeObserver.observe(node);
  }
  function scan(parent) {
    if (parent.nodeType !== 1 && parent.nodeType !== 9) return;
    if (parent.nodeType === 1 && parent.closest('.lg-optics')) return;
    if (parent.matches && parent.matches(selector)) mount(parent);
    parent.querySelectorAll(selector).forEach(mount);
  }
  function destroy(state) {
    dropFilter(state); moving.delete(state); all.delete(state); states.delete(state.node);
    if (intersectionObserver) intersectionObserver.unobserve(state.node);
    if (resizeObserver) resizeObserver.unobserve(state.node);
    state.frame.remove();
    state.node.classList.remove('lg-host','lg-static','lg-control','lg-primary','lg-floating','lg-nested');
    ['--lg-dx','--lg-dy','--lg-sx','--lg-sy','--lg-hot','--lg-press','--lg-x','--lg-y','--lg-angle'].forEach(function (name) { state.node.style.removeProperty(name); });
  }
  function reset(state) {
    state.pressed = false; state.target = [0,0,1,1];
    state.node.style.removeProperty('--lg-press');
    state.node.style.removeProperty('--lg-hot');
    animate(state);
  }
  function animate(state) {
    if (reducedMotion.matches || opaque() || document.hidden) {
      state.values = [0,0,1,1]; state.velocity = [0,0,0,0];
      state.node.style.removeProperty('--lg-dx'); state.node.style.removeProperty('--lg-dy');
      state.node.style.removeProperty('--lg-sx'); state.node.style.removeProperty('--lg-sy');
      moving.delete(state); return;
    }
    moving.add(state);
    if (!animationFrame) { previousTime = 0; animationFrame = requestAnimationFrame(step); }
  }
  function step(now) {
    animationFrame = 0;
    var dt = previousTime ? Math.min((now - previousTime) / 1000, 1 / 30) : 1 / 60;
    previousTime = now;
    moving.forEach(function (state) {
      var settled = true;
      for (var i = 0; i < 4; i++) {
        var force = 300 * (state.target[i] - state.values[i]) - 24 * state.velocity[i];
        state.velocity[i] += force * dt; state.values[i] += state.velocity[i] * dt;
        if (Math.abs(state.target[i] - state.values[i]) > .0003 || Math.abs(state.velocity[i]) > .003) settled = false;
      }
      ['--lg-dx','--lg-dy','--lg-sx','--lg-sy'].forEach(function (name,i) {
        state.node.style.setProperty(name, state.values[i].toFixed(4) + (i < 2 ? 'px' : ''));
      });
      if (settled || !state.node.isConnected) moving.delete(state);
    });
    if (moving.size) animationFrame = requestAnimationFrame(step);
  }
  function stateFrom(event) {
    if (!event.target || !event.target.closest) return null;
    var host = event.target.closest('.lg-host');
    return host && !host.matches(':disabled, [aria-disabled="true"]') ? states.get(host) : null;
  }
  function point(state, event) {
    var rect = state.node.getBoundingClientRect();
    var x = clamp((event.clientX - rect.left) / Math.max(rect.width,1),0,1);
    var y = clamp((event.clientY - rect.top) / Math.max(rect.height,1),0,1);
    state.node.style.setProperty('--lg-x',(x*100).toFixed(1)+'%');
    state.node.style.setProperty('--lg-y',(y*100).toFixed(1)+'%');
    state.node.style.setProperty('--lg-angle',(115 + (x-.5)*60 + (y-.5)*30).toFixed(1)+'deg');
    state.node.style.setProperty('--lg-hot','1');
    if (state.control && !state.pressed) {
      state.target = [(x-.5)*1.5,(y-.5),1 + Math.abs(x-.5)*.02,1 + Math.abs(y-.5)*.02];
      animate(state);
    }
  }
  function ready() {
    svg = element('svg', { width:'0', height:'0', 'aria-hidden':'true', focusable:'false' });
    svg.classList.add('lg-definitions'); defs = element('defs'); svg.appendChild(defs); document.body.appendChild(svg);
    if ('IntersectionObserver' in window) intersectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { var state=states.get(entry.target); if (state) state.visible=entry.isIntersecting; });
      scheduleGeometry();
    }, { rootMargin:'40px' });
    if ('ResizeObserver' in window) resizeObserver = new ResizeObserver(scheduleGeometry);
    scan(document);
    observer = new MutationObserver(function (records) {
      var removed = false, changed = false;
      records.forEach(function (record) {
        if (record.target.closest && record.target.closest('.lg-optics, .lg-definitions')) return;
        if (record.type === 'attributes') {
          // Only open/close and theme changes need geometry work, not our own classes.
          if (record.attributeName === 'aria-hidden' || record.attributeName === 'data-theme' || record.attributeName === 'open' || record.attributeName === 'class') changed = true;
          return;
        }
        record.addedNodes.forEach(function (node) { if (node.nodeType === 1 && !node.matches('.lg-optics,.lg-definitions')) { scan(node); changed = true; } });
        record.removedNodes.forEach(function (node) { if (node.nodeType === 1 && !node.matches('.lg-optics,.lg-definitions')) removed = true; });
      });
      if (removed) all.forEach(function (state) {
        if (!state.node.isConnected) destroy(state);
        else if (!state.node.contains(state.frame)) { state.node.prepend(state.frame); changed = true; }
      });
      if (changed || removed) scheduleGeometry();
    });
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-hidden','open','class']});
    var themeObserver = new MutationObserver(scheduleGeometry);
    themeObserver.observe(root,{attributes:true,attributeFilter:['data-theme','data-birthday']});
    var latestPointer, pointerFrame = 0, hovered;
    document.addEventListener('pointermove',function (event) {
      if (!finePointer.matches || reducedMotion.matches || opaque()) return;
      latestPointer={target:event.target,clientX:event.clientX,clientY:event.clientY};
      if (!pointerFrame) pointerFrame=requestAnimationFrame(function () {
        pointerFrame=0;
        var state=stateFrom(latestPointer);
        if (hovered && hovered!==state) reset(hovered);
        hovered=state;
        if (state) point(state,latestPointer);
      });
    },{passive:true});
    document.addEventListener('pointerout',function (event) { if (!event.relatedTarget && hovered) { reset(hovered); hovered=null; } },{passive:true});
    document.addEventListener('pointerdown',function (event) {
      if (event.button !== 0) return;
      var state=stateFrom(event); if (!state || !state.control || opaque()) return;
      if (!reducedMotion.matches) point(state,event);
      state.pressed=true; state.target=[0,1,1.035,.93]; state.node.style.setProperty('--lg-press','1'); animate(state);
    },{passive:true});
    function release() { all.forEach(function (state) { if (state.pressed) reset(state); }); }
    document.addEventListener('pointerup',release,{passive:true});
    document.addEventListener('pointercancel',release,{passive:true});
    window.addEventListener('blur',function () { all.forEach(reset); });
    document.addEventListener('focusin',function (event) { var state=stateFrom(event); if(state)state.node.style.setProperty('--lg-hot','1'); });
    document.addEventListener('focusout',function (event) { var state=stateFrom(event); if(state)reset(state); });
    document.addEventListener('visibilitychange',function () {
      if(document.hidden){cancelAnimationFrame(animationFrame);animationFrame=0;all.forEach(reset);moving.clear();}
      scheduleGeometry();
    });
    window.addEventListener('resize',scheduleGeometry,{passive:true});
    document.addEventListener('transitionend',function (event) {
      if (event.propertyName === 'opacity' || event.propertyName === 'visibility') scheduleGeometry();
    });
    document.addEventListener('animationend',scheduleGeometry);
    [reducedMotion,reducedTransparency,highContrast,forcedColors,finePointer].forEach(function (query) {
      if(query.addEventListener)query.addEventListener('change',function () { all.forEach(reset);scheduleGeometry(); });
    });
    window.WYQ_OPTICS = { refresh:function () { scan(document); scheduleGeometry(); } };
    scheduleGeometry();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
