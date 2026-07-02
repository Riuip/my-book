/* =========================================================
   WYQ 专属博客 — minimal interactions
   - Theme toggle (light / dark, persisted)
   - Scroll reveal
   - Footer year
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Floating rounded nav ---------- */
  function injectFloatingNavStyle() {
    if (document.getElementById('floating-nav-style')) return;
    var style = document.createElement('style');
    style.id = 'floating-nav-style';
    style.textContent = [
      '.nav{',
      '  top:12px!important;',
      '  left:50%!important;',
      '  right:auto!important;',
      '  width:min(calc(100% - 32px),1180px)!important;',
      '  height:54px!important;',
      '  transform:translateX(-50%)!important;',
      '  background:transparent!important;',
      '  border-bottom:0!important;',
      '  box-shadow:none!important;',
      '  backdrop-filter:none!important;',
      '  -webkit-backdrop-filter:none!important;',
      '  pointer-events:none;',
      '}',
      '.nav__inner{',
      '  width:100%!important;',
      '  max-width:none!important;',
      '  height:100%!important;',
      '  margin:0!important;',
      '  padding:0 24px!important;',
      '  border-radius:999px;',
      '  background:rgba(251,251,253,.72);',
      '  border:1px solid rgba(255,255,255,.56);',
      '  box-shadow:0 12px 34px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.70);',
      '  backdrop-filter:saturate(200%) blur(32px);',
      '  -webkit-backdrop-filter:saturate(200%) blur(32px);',
      '  pointer-events:auto;',
      '  transition:background .3s ease,border-color .3s ease,box-shadow .3s ease;',
      '}',
      '[data-theme="dark"] .nav__inner{',
      '  background:rgba(22,22,24,.66);',
      '  border-color:rgba(255,255,255,.12);',
      '  box-shadow:0 12px 38px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.08);',
      '}',
      '.nav__menu a:hover,.nav__theme:hover,.nav__search-btn:hover,.nav__sub-toggle:hover{',
      '  background:rgba(255,255,255,.52);',
      '}',
      '[data-theme="dark"] .nav__menu a:hover,[data-theme="dark"] .nav__theme:hover,[data-theme="dark"] .nav__search-btn:hover,[data-theme="dark"] .nav__sub-toggle:hover{',
      '  background:rgba(255,255,255,.10);',
      '}',
      '@media(max-width:720px){',
      '  .nav{top:10px!important;width:calc(100% - 20px)!important;height:50px!important;}',
      '  .nav__inner{padding:0 14px!important;}',
      '  .nav__brand{font-size:17px;}',
      '  .nav__menu a,.nav__sub-toggle{padding-left:8px!important;padding-right:8px!important;}',
      '}',
      '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){',
      '  .nav__inner{background:rgba(251,251,253,.92);}',
      '  [data-theme="dark"] .nav__inner{background:rgba(22,22,24,.92);}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }
  injectFloatingNavStyle();

  /* ---------- Theme ---------- */
  var STORAGE_KEY = 'wyq-theme';
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  // Initial theme
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
      return;
    }
    var prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  })();

  // Theme toggle button
  var themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Sync with system if user hasn't explicitly chosen
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var listener = function (e) {
      var saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) {}
      if (saved !== 'light' && saved !== 'dark') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', listener);
    else if (mq.addListener) mq.addListener(listener);
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  }

  /* ---------- Active nav link ---------- */
  var file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var navLinks = document.querySelectorAll('.nav__menu a[href]');
  Array.prototype.forEach.call(navLinks, function (a) {
    var href = a.getAttribute('href').toLowerCase();
    if (href === file || (file === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Footer year ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Sidebar (article navigation drawer) ---------- */
  var sidebar = document.getElementById('sidebar');
  var backdrop = document.getElementById('sidebar-backdrop');
  var sidebarToggle = document.querySelector('[data-sidebar-toggle]');
  var sidebarClose = document.querySelector('[data-sidebar-close]');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  // Highlight current article in sidebar
  if (sidebar) {
    var sidebarLinks = sidebar.querySelectorAll('.sidebar__item');
    Array.prototype.forEach.call(sidebarLinks, function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === file) a.classList.add('is-active');
    });
  }

  /* ---------- Sidebar category filter ---------- */
  if (sidebar) {
    var chips = sidebar.querySelectorAll('[data-cat-filter]');
    var groups = sidebar.querySelectorAll('.sidebar__group');
    var emptyMsg = sidebar.querySelector('[data-sidebar-empty]');

    function applyCatFilter(cat) {
      var anyVisible = false;
      Array.prototype.forEach.call(groups, function (g) {
        var gCat = g.getAttribute('data-cat');
        if (cat === 'all' || cat === gCat) {
          g.hidden = false;
          // Count real article items (skip "暂无文章" placeholder)
          var hasItem = g.querySelector('.sidebar__item');
          if (hasItem) anyVisible = true;
        } else {
          g.hidden = true;
        }
      });

      // Auto-scroll to active group when picking a single category
      if (cat !== 'all') {
        var activeGroup = sidebar.querySelector('.sidebar__group[data-cat="' + cat + '"]');
        if (activeGroup) activeGroup.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        // Reset scroll to top when going back to "all"
        var listEl = sidebar.querySelector('.sidebar__list');
        if (listEl) listEl.scrollTop = 0;
      }

      if (emptyMsg) {
        if (cat !== 'all' && !anyVisible) emptyMsg.classList.add('is-shown');
        else emptyMsg.classList.remove('is-shown');
      }
    }

    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function () {
        Array.prototype.forEach.call(chips, function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        applyCatFilter(chip.getAttribute('data-cat-filter'));
      });
    });
  }
})();
