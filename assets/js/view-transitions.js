/* =========================================================
   View Transitions — Smooth page navigation
   Uses the View Transitions API (Chrome 111+, Edge 111+).
   ========================================================= */
(function () {
  'use strict';

  function injectLiquidGlassThemeButton() {
    if (document.getElementById('wyq-liquid-theme-button')) return;
    var style = document.createElement('style');
    style.id = 'wyq-liquid-theme-button';
    style.textContent = [
      '.nav__theme{position:relative!important;width:42px!important;height:42px!important;border-radius:999px!important;overflow:hidden!important;isolation:isolate!important;color:rgba(29,29,31,.78)!important;background:rgba(255,255,255,.16)!important;border:1px solid rgba(255,255,255,.82)!important;box-shadow:0 18px 42px rgba(25,55,90,.18),0 5px 14px rgba(25,55,90,.10),inset 0 1px 1px rgba(255,255,255,.92),inset 0 -1px 1px rgba(30,60,95,.12),inset 0 0 0 1px rgba(255,255,255,.30)!important;backdrop-filter:blur(30px) saturate(190%) brightness(1.08) contrast(.94)!important;-webkit-backdrop-filter:blur(30px) saturate(190%) brightness(1.08) contrast(.94)!important;transform:translateZ(0)!important;transition:transform .32s cubic-bezier(.2,.8,.2,1),box-shadow .32s ease,border-color .32s ease,background .32s ease!important;}',
      '.nav__theme::before{content:""!important;position:absolute!important;inset:0!important;z-index:-2!important;border-radius:inherit!important;background:radial-gradient(circle at 30% 16%,rgba(255,255,255,.96) 0 12%,rgba(255,255,255,.38) 25%,transparent 44%),radial-gradient(circle at 72% 78%,rgba(80,145,255,.18),transparent 42%),linear-gradient(145deg,rgba(255,255,255,.34),rgba(255,255,255,.06) 52%,rgba(160,205,255,.16))!important;pointer-events:none!important;}',
      '.nav__theme::after{content:""!important;position:absolute!important;inset:2px!important;z-index:-1!important;border-radius:inherit!important;background:linear-gradient(160deg,rgba(255,255,255,.78) 0%,rgba(255,255,255,.24) 20%,rgba(255,255,255,0) 46%),radial-gradient(ellipse at 50% 112%,rgba(255,255,255,.52),transparent 50%)!important;box-shadow:inset 6px 8px 16px rgba(255,255,255,.36),inset -8px -10px 18px rgba(45,85,128,.10)!important;pointer-events:none!important;}',
      '.nav__theme svg{position:relative!important;z-index:1!important;width:19px!important;height:19px!important;opacity:.86!important;filter:drop-shadow(0 1px 1px rgba(255,255,255,.72)) drop-shadow(0 4px 8px rgba(0,0,0,.10))!important;}',
      '.nav__theme:hover{background:rgba(255,255,255,.24)!important;border-color:rgba(255,255,255,.96)!important;transform:translateY(-1px) scale(1.045)!important;box-shadow:0 24px 58px rgba(25,55,90,.22),0 8px 18px rgba(25,55,90,.12),inset 0 1px 1px rgba(255,255,255,.96),inset 0 -1px 1px rgba(30,60,95,.14),inset 0 0 0 1px rgba(255,255,255,.36)!important;}',
      '.nav__theme:active{transform:translateY(0) scale(.96)!important;box-shadow:0 10px 26px rgba(25,55,90,.16),inset 0 2px 10px rgba(42,70,110,.12),inset 0 1px 1px rgba(255,255,255,.82)!important;}',
      '[data-theme="dark"] .nav__theme{color:rgba(245,245,247,.88)!important;background:rgba(255,255,255,.10)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 18px 48px rgba(0,0,0,.46),inset 0 1px 1px rgba(255,255,255,.20),inset 0 -1px 1px rgba(0,0,0,.32),inset 0 0 0 1px rgba(255,255,255,.08)!important;}',
      '[data-theme="dark"] .nav__theme::before{background:radial-gradient(circle at 30% 16%,rgba(255,255,255,.42) 0 12%,rgba(255,255,255,.15) 25%,transparent 44%),radial-gradient(circle at 72% 78%,rgba(90,160,255,.24),transparent 42%),linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.04) 52%,rgba(80,120,180,.16))!important;}',
      '[data-theme="dark"] .nav__theme::after{background:linear-gradient(160deg,rgba(255,255,255,.28) 0%,rgba(255,255,255,.10) 22%,rgba(255,255,255,0) 52%),radial-gradient(ellipse at 50% 112%,rgba(255,255,255,.16),transparent 54%)!important;box-shadow:inset 6px 8px 16px rgba(255,255,255,.10),inset -8px -10px 18px rgba(0,0,0,.18)!important;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  setTimeout(injectLiquidGlassThemeButton, 0);

  // Only enable if the browser supports View Transitions
  if (!document.startViewTransition) return;

  // Intercept same-origin link clicks for SPA-like transitions
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var url = new URL(link.href, window.location.origin);

    // Only intercept same-origin, non-anchor, non-download links
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