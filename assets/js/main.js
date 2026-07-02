/* =========================================================
   WYQ 专属博客 — minimal interactions
   - Theme toggle (light / dark, persisted)
   - Scroll reveal
   - Footer year
   - Floating rounded nav + search glass UI
   - Smooth article details transitions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Floating rounded nav / glass search / animated details ---------- */
  function injectFloatingNavStyle() {
    if (document.getElementById('floating-nav-style')) return;
    var style = document.createElement('style');
    style.id = 'floating-nav-style';
    style.textContent = [
      '.nav{',
      '  top:12px!important;',
      '  left:50%!important;',
      '  right:auto!important;',
      '  width:min(calc(100% - 20px),1320px)!important;',
      '  height:56px!important;',
      '  transform:translateX(-50%) translateY(0)!important;',
      '  background:transparent!important;',
      '  border-bottom:0!important;',
      '  box-shadow:none!important;',
      '  backdrop-filter:none!important;',
      '  -webkit-backdrop-filter:none!important;',
      '  pointer-events:none;',
      '  transition:transform .34s cubic-bezier(.2,.7,.2,1), opacity .24s ease!important;',
      '  will-change:transform,opacity;',
      '}',
      '.nav.nav--hidden{',
      '  transform:translateX(-50%) translateY(-88px)!important;',
      '  opacity:.18;',
      '}',
      '.nav__inner{',
      '  width:100%!important;',
      '  max-width:none!important;',
      '  height:100%!important;',
      '  margin:0!important;',
      '  padding:0 26px!important;',
      '  border-radius:999px;',
      '  background:rgba(251,251,253,.72);',
      '  border:1px solid rgba(255,255,255,.58);',
      '  box-shadow:0 14px 36px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.72);',
      '  backdrop-filter:saturate(200%) blur(34px);',
      '  -webkit-backdrop-filter:saturate(200%) blur(34px);',
      '  pointer-events:auto;',
      '  transition:background .3s ease,border-color .3s ease,box-shadow .3s ease;',
      '}',
      '[data-theme="dark"] .nav__inner{',
      '  background:rgba(22,22,24,.66);',
      '  border-color:rgba(255,255,255,.12);',
      '  box-shadow:0 14px 38px rgba(0,0,0,.44), inset 0 1px 0 rgba(255,255,255,.08);',
      '}',
      '.nav__menu a:hover,.nav__theme:hover,.nav__search-btn:hover,.nav__sub-toggle:hover,.nav__sidebar-toggle:hover{',
      '  background:rgba(255,255,255,.52);',
      '}',
      '[data-theme="dark"] .nav__menu a:hover,[data-theme="dark"] .nav__theme:hover,[data-theme="dark"] .nav__search-btn:hover,[data-theme="dark"] .nav__sub-toggle:hover,[data-theme="dark"] .nav__sidebar-toggle:hover{',
      '  background:rgba(255,255,255,.10);',
      '}',
      '.nav-search{',
      '  top:82px!important;',
      '  width:min(calc(100% - 32px),860px)!important;',
      '  max-width:none!important;',
      '  border-radius:28px!important;',
      '  background:rgba(251,251,253,.74)!important;',
      '  border:1px solid rgba(255,255,255,.62)!important;',
      '  box-shadow:0 28px 80px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.74)!important;',
      '  backdrop-filter:saturate(200%) blur(34px)!important;',
      '  -webkit-backdrop-filter:saturate(200%) blur(34px)!important;',
      '  overflow:hidden;',
      '}',
      '[data-theme="dark"] .nav-search{',
      '  background:rgba(22,22,24,.72)!important;',
      '  border-color:rgba(255,255,255,.13)!important;',
      '  box-shadow:0 28px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)!important;',
      '}',
      '.nav-search.is-open{',
      '  transform:translateX(-50%) translateY(0) scale(1)!important;',
      '}',
      '.nav-search__inner{',
      '  padding:20px 28px!important;',
      '  gap:16px!important;',
      '  border-bottom:1px solid rgba(0,0,0,.07)!important;',
      '}',
      '[data-theme="dark"] .nav-search__inner{border-bottom-color:rgba(255,255,255,.10)!important;}',
      '.nav-search__icon{width:25px!important;height:25px!important;}',
      '.nav-search__input{font-size:24px!important;letter-spacing:-.03em!important;}',
      '.nav-search__results{padding:14px!important;max-height:min(430px,55vh)!important;}',
      '.nav-search__hint,.nav-search__empty{padding:42px 16px!important;font-size:17px!important;}',
      '.nav-search__item{border-radius:18px!important;padding:16px 18px!important;transition:background .2s ease, transform .2s ease!important;}',
      '.nav-search__item:hover{background:rgba(255,255,255,.50)!important;transform:translateY(-1px);}',
      '[data-theme="dark"] .nav-search__item:hover{background:rgba(255,255,255,.08)!important;}',
      '.nav-search__item-cat{background:rgba(0,113,227,.10)!important;color:var(--accent)!important;}',
      '.nav-search__overlay{',
      '  backdrop-filter:blur(10px)!important;',
      '  -webkit-backdrop-filter:blur(10px)!important;',
      '  background:rgba(255,255,255,.18)!important;',
      '}',
      '[data-theme="dark"] .nav-search__overlay{background:rgba(0,0,0,.26)!important;}',
      '.article details.details-anim{',
      '  border-radius:18px!important;',
      '  background:rgba(255,255,255,.30);',
      '  backdrop-filter:saturate(180%) blur(18px);',
      '  -webkit-backdrop-filter:saturate(180%) blur(18px);',
      '  box-shadow:0 10px 30px rgba(0,0,0,.06);',
      '}',
      '[data-theme="dark"] .article details.details-anim{background:rgba(255,255,255,.04);box-shadow:0 10px 30px rgba(0,0,0,.28);}',
      '.article details.details-anim summary{',
      '  transition:background .2s ease,color .2s ease,border-color .2s ease;',
      '}',
      '.article details.details-anim summary::marker{font-size:.9em;}',
      '.article details.details-anim .prompt-content{',
      '  box-sizing:border-box;',
      '  overflow:hidden!important;',
      '  transition:height .42s cubic-bezier(.2,.7,.2,1), opacity .28s ease, padding-top .42s cubic-bezier(.2,.7,.2,1), padding-bottom .42s cubic-bezier(.2,.7,.2,1)!important;',
      '  will-change:height,opacity,padding;',
      '}',
      '@media(max-width:720px){',
      '  .nav{top:10px!important;width:calc(100% - 16px)!important;height:52px!important;}',
      '  .nav__inner{padding:0 14px!important;}',
      '  .nav__brand{font-size:17px;}',
      '  .nav__menu a,.nav__sub-toggle{padding-left:8px!important;padding-right:8px!important;}',
      '}',
      '@media(prefers-reduced-motion:reduce){',
      '  .nav,.article details.details-anim .prompt-content{transition:none!important;}',
      '}',
      '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){',
      '  .nav__inner,.nav-search{background:rgba(251,251,253,.94)!important;}',
      '  [data-theme="dark"] .nav__inner,[data-theme="dark"] .nav-search{background:rgba(22,22,24,.94)!important;}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }
  injectFloatingNavStyle();

  function initAutoHideNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var lastY = window.scrollY || 0;
    var ticking = false;

    function update() {
      var y = window.scrollY || 0;
      var goingDown = y > lastY + 6;
      var goingUp = y < lastY - 6;
      var lockedOpen = document.body.classList.contains('search-open') ||
        (document.getElementById('sidebar') && document.getElementById('sidebar').classList.contains('is-open'));

      if (lockedOpen || y < 90 || goingUp) {
        nav.classList.remove('nav--hidden');
      } else if (goingDown && y > 130) {
        nav.classList.add('nav--hidden');
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }
  initAutoHideNav();

  function enhanceArticleDetails() {
    var detailsList = document.querySelectorAll('.article details');
    if (!detailsList.length) return;

    Array.prototype.forEach.call(detailsList, function (details) {
      if (details.dataset.wyqAnimated === '1') return;
      var summary = details.querySelector('summary');
      var content = details.querySelector('.prompt-content');
      if (!summary || !content) return;

      details.dataset.wyqAnimated = '1';
      details.classList.add('details-anim');

      var cs = window.getComputedStyle(content);
      var naturalPadTop = cs.paddingTop || '16px';
      var naturalPadBottom = cs.paddingBottom || '16px';

      if (!details.open) {
        content.style.height = '0px';
        content.style.opacity = '0';
        content.style.paddingTop = '0px';
        content.style.paddingBottom = '0px';
      }

      function openDetails() {
        if (details.dataset.animating === '1') return;
        details.dataset.animating = '1';
        details.open = true;
        content.style.overflow = 'hidden';
        content.style.height = '0px';
        content.style.opacity = '0';
        content.style.paddingTop = '0px';
        content.style.paddingBottom = '0px';

        window.requestAnimationFrame(function () {
          content.style.paddingTop = naturalPadTop;
          content.style.paddingBottom = naturalPadBottom;
          var targetHeight = content.scrollHeight;
          content.style.height = targetHeight + 'px';
          content.style.opacity = '1';
        });

        var onEnd = function (e) {
          if (e.target !== content || e.propertyName !== 'height') return;
          content.removeEventListener('transitionend', onEnd);
          content.style.height = 'auto';
          content.style.overflowY = 'auto';
          details.dataset.animating = '0';
        };
        content.addEventListener('transitionend', onEnd);
      }

      function closeDetails() {
        if (details.dataset.animating === '1') return;
        details.dataset.animating = '1';
        content.style.overflow = 'hidden';
        content.style.height = content.getBoundingClientRect().height + 'px';
        content.style.paddingTop = naturalPadTop;
        content.style.paddingBottom = naturalPadBottom;
        content.style.opacity = '1';

        window.requestAnimationFrame(function () {
          content.style.height = '0px';
          content.style.paddingTop = '0px';
          content.style.paddingBottom = '0px';
          content.style.opacity = '0';
        });

        var onEnd = function (e) {
          if (e.target !== content || e.propertyName !== 'height') return;
          content.removeEventListener('transitionend', onEnd);
          details.open = false;
          details.dataset.animating = '0';
        };
        content.addEventListener('transitionend', onEnd);
      }

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (details.open) closeDetails();
        else openDetails();
      });
    });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(enhanceArticleDetails);

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
    var nav = document.querySelector('.nav');
    if (nav) nav.classList.remove('nav--hidden');
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
