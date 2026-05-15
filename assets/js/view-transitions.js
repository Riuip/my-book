/* =========================================================
   View Transitions — Smooth page navigation
   Uses the View Transitions API (Chrome 111+, Edge 111+).
   For unsupported browsers, normal navigation occurs.
   ========================================================= */
(function () {
  'use strict';

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
