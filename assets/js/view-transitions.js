/* =========================================================
   View Transitions — Smooth page navigation
   Uses the View Transitions API (Chrome 111+, Edge 111+).
   ========================================================= */
(function () {
  'use strict';

  function isHomePage() {
    var name = (window.location.pathname.split('/').pop() || '').toLowerCase();
    return name === '' || name === 'index.html';
  }

  function injectNavDisplacementFilter() {
    if (!isHomePage()) return;
    if (document.getElementById('wyq-liquid-displace-svg')) return;

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'wyq-liquid-displace-svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';

    var defs = document.createElementNS(svgNS, 'defs');
    var filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', 'wyqNavGlassDisplace');
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-30%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '160%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    var turbulence = document.createElementNS(svgNS, 'feTurbulence');
    turbulence.setAttribute('type', 'fractalNoise');
    turbulence.setAttribute('baseFrequency', '0.010 0.055');
    turbulence.setAttribute('numOctaves', '2');
    turbulence.setAttribute('seed', '7');
    turbulence.setAttribute('result', 'noise');

    var animate = document.createElementNS(svgNS, 'animate');
    animate.setAttribute('attributeName', 'baseFrequency');
    animate.setAttribute('dur', '7s');
    animate.setAttribute('values', '0.010 0.055;0.018 0.040;0.012 0.065;0.010 0.055');
    animate.setAttribute('repeatCount', 'indefinite');
    turbulence.appendChild(animate);

    var displacement = document.createElementNS(svgNS, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic');
    displacement.setAttribute('in2', 'noise');
    displacement.setAttribute('scale', '16');
    displacement.setAttribute('xChannelSelector', 'R');
    displacement.setAttribute('yChannelSelector', 'G');
    displacement.setAttribute('result', 'displaced');

    var blur = document.createElementNS(svgNS, 'feGaussianBlur');
    blur.setAttribute('in', 'displaced');
    blur.setAttribute('stdDeviation', '0.22');
    blur.setAttribute('result', 'softened');

    var matrix = document.createElementNS(svgNS, 'feColorMatrix');
    matrix.setAttribute('in', 'softened');
    matrix.setAttribute('type', 'saturate');
    matrix.setAttribute('values', '1.18');

    filter.appendChild(turbulence);
    filter.appendChild(displacement);
    filter.appendChild(blur);
    filter.appendChild(matrix);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }

  function injectHomepageLiquidGlassNav() {
    if (!isHomePage()) return;
    if (document.getElementById('wyq-liquid-home-nav')) return;

    var style = document.createElement('style');
    style.id = 'wyq-liquid-home-nav';
    style.textContent = [
      '.nav{overflow:visible!important;}',
      '.nav__inner{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:rgba(255,255,255,.14)!important;border:1px solid rgba(255,255,255,.78)!important;box-shadow:0 28px 80px rgba(24,52,90,.20),0 8px 24px rgba(24,52,90,.10),inset 0 1px 1px rgba(255,255,255,.92),inset 0 -1px 1px rgba(30,60,95,.13),inset 0 0 0 1px rgba(255,255,255,.28)!important;backdrop-filter:blur(46px) saturate(210%) brightness(1.09) contrast(.92)!important;-webkit-backdrop-filter:blur(46px) saturate(210%) brightness(1.09) contrast(.92)!important;}',
      '.nav__inner::before{content:""!important;position:absolute!important;inset:-12px!important;z-index:-2!important;border-radius:inherit!important;background:radial-gradient(circle at 8% 16%,rgba(255,255,255,.92) 0 8%,rgba(255,255,255,.32) 20%,transparent 36%),radial-gradient(circle at 82% 86%,rgba(120,175,255,.20),transparent 34%),linear-gradient(145deg,rgba(255,255,255,.34),rgba(255,255,255,.07) 46%,rgba(170,215,255,.15))!important;filter:url(#wyqNavGlassDisplace) saturate(116%)!important;pointer-events:none!important;}',
      '.nav__inner::after{content:""!important;position:absolute!important;inset:1px!important;z-index:-1!important;border-radius:inherit!important;background:linear-gradient(180deg,rgba(255,255,255,.62) 0%,rgba(255,255,255,.18) 34%,rgba(255,255,255,0) 64%),radial-gradient(ellipse at 50% 115%,rgba(255,255,255,.42),transparent 52%)!important;box-shadow:inset 18px 18px 34px rgba(255,255,255,.24),inset -20px -18px 38px rgba(40,82,130,.10)!important;filter:url(#wyqNavGlassDisplace)!important;pointer-events:none!important;}',
      '.nav__brand,.nav__menu,.nav__menu>li{position:relative!important;z-index:2!important;}',
      '.nav__brand{color:rgba(22,24,28,.88)!important;text-shadow:0 1px 1px rgba(255,255,255,.62)!important;}',
      '.nav__brand .dot{background:rgba(0,113,227,.92)!important;box-shadow:0 0 0 3px rgba(0,113,227,.12),0 2px 8px rgba(0,113,227,.28)!important;}',
      '.nav__menu a,.nav__sub-toggle,.nav__search-btn,.nav__theme{position:relative!important;isolation:isolate!important;overflow:hidden!important;border-radius:999px!important;background:rgba(255,255,255,.08)!important;border:1px solid rgba(255,255,255,0)!important;color:rgba(32,34,38,.78)!important;text-shadow:0 1px 1px rgba(255,255,255,.54)!important;backdrop-filter:blur(18px) saturate(170%) brightness(1.08)!important;-webkit-backdrop-filter:blur(18px) saturate(170%) brightness(1.08)!important;transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .28s ease,border-color .28s ease,background .28s ease,color .22s ease!important;}',
      '.nav__menu a::before,.nav__sub-toggle::before,.nav__search-btn::before,.nav__theme::before{content:""!important;position:absolute!important;inset:0!important;z-index:-2!important;border-radius:inherit!important;background:radial-gradient(circle at 32% 18%,rgba(255,255,255,.78),rgba(255,255,255,.20) 28%,transparent 48%),linear-gradient(145deg,rgba(255,255,255,.24),rgba(255,255,255,.04) 55%,rgba(130,190,255,.10))!important;pointer-events:none!important;}',
      '.nav__menu a::after,.nav__sub-toggle::after,.nav__search-btn::after,.nav__theme::after{content:""!important;position:absolute!important;inset:1px!important;z-index:-1!important;border-radius:inherit!important;background:linear-gradient(170deg,rgba(255,255,255,.58),rgba(255,255,255,.16) 32%,rgba(255,255,255,0) 62%)!important;box-shadow:inset 5px 7px 12px rgba(255,255,255,.25),inset -6px -8px 16px rgba(42,76,120,.08)!important;pointer-events:none!important;}',
      '.nav__menu a:hover,.nav__sub-toggle:hover,.nav__search-btn:hover,.nav__theme:hover,details.nav__has-sub.is-visible>summary.nav__sub-toggle,details.nav__has-sub[open]>summary.nav__sub-toggle{background:rgba(255,255,255,.23)!important;border-color:rgba(255,255,255,.70)!important;color:rgba(12,14,18,.90)!important;box-shadow:0 12px 30px rgba(24,52,90,.16),inset 0 1px 1px rgba(255,255,255,.80),inset 0 -1px 1px rgba(40,70,110,.10)!important;transform:translateY(-1px)!important;}',
      '.nav__menu a:active,.nav__sub-toggle:active,.nav__search-btn:active,.nav__theme:active{transform:translateY(0) scale(.96)!important;box-shadow:0 6px 18px rgba(24,52,90,.12),inset 0 2px 10px rgba(42,70,110,.12),inset 0 1px 1px rgba(255,255,255,.70)!important;}',
      '.nav__search-btn,.nav__theme{width:42px!important;height:42px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;}',
      '.nav__search-btn svg,.nav__theme svg{position:relative!important;z-index:1!important;width:19px!important;height:19px!important;opacity:.86!important;filter:drop-shadow(0 1px 1px rgba(255,255,255,.72)) drop-shadow(0 4px 8px rgba(0,0,0,.10))!important;}',
      '.nav__sub-toggle__chevron{filter:drop-shadow(0 1px 1px rgba(255,255,255,.55))!important;}',
      '[data-theme="dark"] .nav__inner{background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.20)!important;box-shadow:0 28px 80px rgba(0,0,0,.52),0 8px 24px rgba(0,0,0,.28),inset 0 1px 1px rgba(255,255,255,.18),inset 0 -1px 1px rgba(0,0,0,.34),inset 0 0 0 1px rgba(255,255,255,.06)!important;}',
      '[data-theme="dark"] .nav__inner::before{background:radial-gradient(circle at 8% 16%,rgba(255,255,255,.30) 0 8%,rgba(255,255,255,.10) 20%,transparent 36%),radial-gradient(circle at 82% 86%,rgba(90,160,255,.24),transparent 34%),linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.04) 46%,rgba(80,120,180,.14))!important;}',
      '[data-theme="dark"] .nav__inner::after{background:linear-gradient(180deg,rgba(255,255,255,.20) 0%,rgba(255,255,255,.06) 34%,rgba(255,255,255,0) 64%),radial-gradient(ellipse at 50% 115%,rgba(255,255,255,.12),transparent 52%)!important;box-shadow:inset 18px 18px 34px rgba(255,255,255,.07),inset -20px -18px 38px rgba(0,0,0,.18)!important;}',
      '[data-theme="dark"] .nav__brand{color:rgba(245,245,247,.92)!important;text-shadow:0 1px 1px rgba(0,0,0,.28)!important;}',
      '[data-theme="dark"] .nav__menu a,[data-theme="dark"] .nav__sub-toggle,[data-theme="dark"] .nav__search-btn,[data-theme="dark"] .nav__theme{background:rgba(255,255,255,.05)!important;color:rgba(245,245,247,.82)!important;text-shadow:0 1px 1px rgba(0,0,0,.24)!important;}',
      '[data-theme="dark"] .nav__menu a::before,[data-theme="dark"] .nav__sub-toggle::before,[data-theme="dark"] .nav__search-btn::before,[data-theme="dark"] .nav__theme::before{background:radial-gradient(circle at 32% 18%,rgba(255,255,255,.28),rgba(255,255,255,.10) 28%,transparent 48%),linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.03) 55%,rgba(90,150,255,.13))!important;}',
      '[data-theme="dark"] .nav__menu a::after,[data-theme="dark"] .nav__sub-toggle::after,[data-theme="dark"] .nav__search-btn::after,[data-theme="dark"] .nav__theme::after{background:linear-gradient(170deg,rgba(255,255,255,.24),rgba(255,255,255,.08) 32%,rgba(255,255,255,0) 62%)!important;box-shadow:inset 5px 7px 12px rgba(255,255,255,.09),inset -6px -8px 16px rgba(0,0,0,.16)!important;}',
      '[data-theme="dark"] .nav__menu a:hover,[data-theme="dark"] .nav__sub-toggle:hover,[data-theme="dark"] .nav__search-btn:hover,[data-theme="dark"] .nav__theme:hover,[data-theme="dark"] details.nav__has-sub.is-visible>summary.nav__sub-toggle,[data-theme="dark"] details.nav__has-sub[open]>summary.nav__sub-toggle{background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.22)!important;color:rgba(255,255,255,.96)!important;box-shadow:0 12px 30px rgba(0,0,0,.34),inset 0 1px 1px rgba(255,255,255,.20),inset 0 -1px 1px rgba(0,0,0,.24)!important;}',
      '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.nav__inner{background:rgba(255,255,255,.78)!important}.nav__menu a,.nav__sub-toggle,.nav__search-btn,.nav__theme{background:rgba(255,255,255,.55)!important}[data-theme="dark"] .nav__inner{background:rgba(28,30,38,.82)!important}[data-theme="dark"] .nav__menu a,[data-theme="dark"] .nav__sub-toggle,[data-theme="dark"] .nav__search-btn,[data-theme="dark"] .nav__theme{background:rgba(255,255,255,.08)!important}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  setTimeout(function () {
    injectNavDisplacementFilter();
    injectHomepageLiquidGlassNav();
  }, 0);

  if (!document.startViewTransition) return;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (link.hasAttribute('download')) return;
    if (link.target === '_blank') return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;

    e.preventDefault();
    document.startViewTransition(function () {
      window.location.href = url.href;
    });
  });
})();