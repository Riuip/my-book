/* =========================================================
   WYQ 专属博客 — minimal interactions
   Stable patch: hero status layout + clickable glass menus + nav autohide
   ========================================================= */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function injectUiStyle() {
    if ($('#wyq-stable-ui-style')) return;
    var style = document.createElement('style');
    style.id = 'wyq-stable-ui-style';
    style.textContent = [
      '/* hero layout fix */',
      '.hero__actions{display:flex!important;justify-content:center!important;align-items:center!important;gap:22px!important;flex-wrap:wrap!important;width:100%!important;margin:0 auto!important;float:none!important;}',
      '.hero__now{display:flex!important;justify-content:center!important;align-items:center!important;width:100%!important;max-width:none!important;margin:22px auto 0!important;padding:0!important;clear:both!important;background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border-radius:0!important;min-height:0!important;float:none!important;}',
      '.hero__now::before,.hero__now::after{content:none!important;display:none!important;}',
      '.hero__now span{display:inline-flex!important;align-items:center!important;width:auto!important;max-width:min(92vw,680px)!important;margin:0 auto!important;padding:8px 18px!important;border-radius:999px!important;background:rgba(255,255,255,.64)!important;color:var(--text-muted)!important;border:1px solid rgba(255,255,255,.58)!important;box-shadow:0 10px 30px rgba(0,0,0,.06)!important;backdrop-filter:saturate(180%) blur(18px)!important;-webkit-backdrop-filter:saturate(180%) blur(18px)!important;}',
      '.hero__now span::before{content:""!important;display:block!important;width:9px!important;height:9px!important;border-radius:999px!important;background:#34c759!important;margin-right:10px!important;box-shadow:0 0 0 6px rgba(52,199,89,.14)!important;flex:0 0 auto!important;}',
      '[data-theme="dark"] .hero__now span{background:rgba(22,22,24,.58)!important;border-color:rgba(255,255,255,.10)!important;}',

      '/* floating nav */',
      '.nav{top:12px!important;left:50%!important;right:auto!important;width:min(calc(100% - 18px),1360px)!important;height:56px!important;transform:translateX(-50%) translateY(0) scale(1)!important;opacity:1!important;filter:blur(0) saturate(100%) brightness(1)!important;background:transparent!important;border-bottom:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:none!important;overflow:visible!important;transition:transform .30s cubic-bezier(.16,.84,.28,1),opacity .20s ease,filter .20s ease!important;will-change:transform,opacity,filter;z-index:9999!important;}',
      '.nav.nav--hiding{filter:blur(8px) saturate(180%) brightness(1.08)!important;}',
      '.nav.nav--hidden{transform:translateX(-50%) translateY(-96px) scale(.985)!important;opacity:0!important;filter:blur(16px) saturate(240%) brightness(1.14)!important;}',
      '.nav__inner{width:100%!important;max-width:none!important;height:100%!important;margin:0!important;padding:0 28px!important;border-radius:999px!important;background:rgba(251,251,253,.72)!important;border:1px solid rgba(255,255,255,.58)!important;box-shadow:0 14px 36px rgba(0,0,0,.10),inset 0 1px 0 rgba(255,255,255,.72)!important;backdrop-filter:saturate(200%) blur(34px)!important;-webkit-backdrop-filter:saturate(200%) blur(34px)!important;pointer-events:auto!important;overflow:visible!important;}',
      '[data-theme="dark"] .nav__inner{background:rgba(22,22,24,.66)!important;border-color:rgba(255,255,255,.12)!important;box-shadow:0 14px 38px rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.08)!important;}',
      '.nav__menu{gap:8px!important;overflow:visible!important;}',
      '.nav__has-sub{position:relative!important;overflow:visible!important;}',
      '.nav__sub-toggle,.nav__search-btn,.nav__theme,.nav__sidebar-toggle,.nav__menu a{border-radius:999px!important;transition:background .2s ease,color .2s ease,transform .2s ease,box-shadow .2s ease!important;}',
      '.nav__sub-toggle,.nav__sidebar-toggle{padding:8px 13px!important;}',
      '.nav__has-sub:hover>.nav__sub-toggle,.nav__has-sub:focus-within>.nav__sub-toggle,.nav__has-sub.is-open>.nav__sub-toggle,.nav__sub-toggle[aria-expanded="true"]{background:rgba(255,255,255,.58)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.62)!important;color:var(--text)!important;}',
      '[data-theme="dark"] .nav__has-sub:hover>.nav__sub-toggle,[data-theme="dark"] .nav__has-sub:focus-within>.nav__sub-toggle,[data-theme="dark"] .nav__has-sub.is-open>.nav__sub-toggle,[data-theme="dark"] .nav__sub-toggle[aria-expanded="true"]{background:rgba(255,255,255,.10)!important;box-shadow:none!important;}',

      '/* glass submenu, forced visible when clicked */',
      '.nav__submenu{display:block!important;position:absolute!important;top:calc(100% + 12px)!important;right:0!important;left:auto!important;min-width:270px!important;padding:12px!important;border-radius:28px!important;background:rgba(251,251,253,.82)!important;border:1px solid rgba(255,255,255,.62)!important;box-shadow:0 24px 70px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.72)!important;backdrop-filter:saturate(200%) blur(32px)!important;-webkit-backdrop-filter:saturate(200%) blur(32px)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-8px) scale(.96)!important;transform-origin:90% 0!important;transition:opacity .22s ease,visibility .22s ease,transform .28s cubic-bezier(.2,.7,.2,1)!important;overflow:hidden!important;z-index:10020!important;}',
      '.nav__submenu::before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:-20px!important;height:20px!important;display:block!important;}',
      '.nav__has-sub:hover>.nav__submenu,.nav__has-sub:focus-within>.nav__submenu,.nav__has-sub.is-open>.nav__submenu,.nav__sub-toggle[aria-expanded="true"]+.nav__submenu{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0) scale(1)!important;}',
      '[data-theme="dark"] .nav__submenu{background:rgba(22,22,24,.82)!important;border-color:rgba(255,255,255,.13)!important;box-shadow:0 24px 70px rgba(0,0,0,.50),inset 0 1px 0 rgba(255,255,255,.08)!important;}',
      '.nav__submenu a{display:flex!important;align-items:center!important;gap:12px!important;padding:13px 14px!important;border-radius:18px!important;color:var(--text-soft)!important;background:transparent!important;transform:none!important;}',
      '.nav__submenu a:hover{color:var(--accent)!important;background:rgba(0,113,227,.12)!important;}',
      '[data-theme="dark"] .nav__submenu a:hover{background:rgba(41,151,255,.16)!important;}',
      '.nav__submenu__icon{width:21px!important;height:21px!important;opacity:.82!important;}',
      '.nav__submenu__sep{margin:10px 12px!important;border-color:rgba(0,0,0,.08)!important;}',
      '[data-theme="dark"] .nav__submenu__sep{border-color:rgba(255,255,255,.10)!important;}',

      '/* search glass */',
      '.nav-search{top:84px!important;width:min(calc(100% - 32px),900px)!important;max-width:none!important;border-radius:30px!important;background:rgba(251,251,253,.74)!important;border:1px solid rgba(255,255,255,.62)!important;box-shadow:0 28px 80px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.74)!important;backdrop-filter:saturate(200%) blur(34px)!important;-webkit-backdrop-filter:saturate(200%) blur(34px)!important;overflow:hidden!important;}',
      '[data-theme="dark"] .nav-search{background:rgba(22,22,24,.72)!important;border-color:rgba(255,255,255,.13)!important;}',
      '.nav-search.is-open{transform:translateX(-50%) translateY(0) scale(1)!important;}',
      '.nav-search__inner{padding:20px 28px!important;gap:16px!important;border-bottom:1px solid rgba(0,0,0,.07)!important;}',
      '.nav-search__input{font-size:24px!important;letter-spacing:-.03em!important;}',

      '/* smooth details */',
      '.article details.details-anim .prompt-content{box-sizing:border-box;overflow:hidden!important;transition:height .42s cubic-bezier(.2,.7,.2,1),opacity .28s ease,padding-top .42s cubic-bezier(.2,.7,.2,1),padding-bottom .42s cubic-bezier(.2,.7,.2,1)!important;will-change:height,opacity,padding;}',

      '@media(max-width:720px){.hero__sub{font-size:clamp(20px,7vw,30px)!important}.hero__actions{gap:14px!important}.hero__now{margin-top:18px!important}.nav{top:10px!important;width:calc(100% - 16px)!important;height:52px!important}.nav__inner{padding:0 14px!important}.nav__brand{font-size:17px!important}.nav__menu{gap:3px!important}.nav__menu a,.nav__sub-toggle{padding-left:8px!important;padding-right:8px!important}.nav__submenu{right:-8px!important;min-width:230px!important;border-radius:24px!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  injectUiStyle();

  /* Theme */
  var STORAGE_KEY = 'wyq-theme';
  var root = document.documentElement;
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === 'light' || saved === 'dark') applyTheme(saved);
    else applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  })();
  var themeBtn = $('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme((root.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark');
    });
  }

  /* Clickable nav submenus */
  function setMenuState(li, open) {
    if (!li) return;
    var btn = li.querySelector('[data-nav-sub-toggle]');
    var menu = li.querySelector('.nav__submenu');
    li.classList.toggle('is-open', !!open);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menu) {
      if (open) {
        menu.style.setProperty('display', 'block', 'important');
        menu.style.setProperty('opacity', '1', 'important');
        menu.style.setProperty('visibility', 'visible', 'important');
        menu.style.setProperty('pointer-events', 'auto', 'important');
        menu.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
        menu.style.setProperty('z-index', '10020', 'important');
      } else {
        menu.style.removeProperty('display');
        menu.style.removeProperty('opacity');
        menu.style.removeProperty('visibility');
        menu.style.removeProperty('pointer-events');
        menu.style.removeProperty('transform');
        menu.style.removeProperty('z-index');
      }
    }
  }
  function closeSubmenus(except) {
    $all('.nav__has-sub').forEach(function (li) {
      if (li !== except) setMenuState(li, false);
    });
  }
  $all('[data-nav-sub-toggle]').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var li = btn.closest ? btn.closest('.nav__has-sub') : btn.parentNode;
      var willOpen = !li.classList.contains('is-open');
      closeSubmenus(li);
      setMenuState(li, willOpen);
      showNav();
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav__has-sub')) closeSubmenus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSubmenus();
  });

  /* Auto-hide nav */
  var nav = $('.nav');
  var lastY = window.scrollY || 0;
  var hideTimer = null;
  function showNav() {
    if (!nav) return;
    clearTimeout(hideTimer);
    nav.classList.remove('nav--hidden', 'nav--hiding');
  }
  function hideNav() {
    if (!nav || nav.classList.contains('nav--hidden')) return;
    nav.classList.add('nav--hiding');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      nav.classList.add('nav--hidden');
      nav.classList.remove('nav--hiding');
    }, 90);
  }
  if (nav) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY || 0;
      var lockedOpen = document.body.classList.contains('search-open') || !!$('.nav__has-sub.is-open') || ($('#sidebar') && $('#sidebar').classList.contains('is-open'));
      if (lockedOpen || y < 90 || y < lastY) showNav();
      else if (y > lastY && y > 120) hideNav();
      lastY = y;
    }, { passive: true });
  }

  /* Scroll reveal */
  var reveals = $all('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Active nav link */
  var file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $all('.nav__menu a[href]').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === file || (file === '' && href === 'index.html')) a.classList.add('active');
  });

  /* Footer year */
  var yr = $('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Sidebar */
  var sidebar = $('#sidebar');
  var backdrop = $('#sidebar-backdrop');
  var sidebarToggle = $('[data-sidebar-toggle]');
  var sidebarClose = $('[data-sidebar-close]');
  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    showNav();
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
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) closeSidebar();
  });
  if (sidebar) {
    $all('.sidebar__item', sidebar).forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === file) a.classList.add('is-active');
    });
    var chips = $all('[data-cat-filter]', sidebar);
    var groups = $all('.sidebar__group', sidebar);
    var emptyMsg = $('[data-sidebar-empty]', sidebar);
    function applyCatFilter(cat) {
      var anyVisible = false;
      groups.forEach(function (g) {
        var show = cat === 'all' || cat === g.getAttribute('data-cat');
        g.hidden = !show;
        if (show && g.querySelector('.sidebar__item')) anyVisible = true;
      });
      if (emptyMsg) emptyMsg.classList.toggle('is-shown', cat !== 'all' && !anyVisible);
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        applyCatFilter(chip.getAttribute('data-cat-filter'));
      });
    });
  }

  /* Smooth details */
  function enhanceArticleDetails() {
    $all('.article details').forEach(function (details) {
      if (details.dataset.wyqAnimated === '1') return;
      var summary = details.querySelector('summary');
      var content = details.querySelector('.prompt-content');
      if (!summary || !content) return;
      details.dataset.wyqAnimated = '1';
      details.classList.add('details-anim');
      var cs = window.getComputedStyle(content);
      var padTop = cs.paddingTop || '16px';
      var padBottom = cs.paddingBottom || '16px';
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
        requestAnimationFrame(function () {
          content.style.paddingTop = padTop;
          content.style.paddingBottom = padBottom;
          content.style.height = content.scrollHeight + 'px';
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
        content.style.paddingTop = padTop;
        content.style.paddingBottom = padBottom;
        content.style.opacity = '1';
        requestAnimationFrame(function () {
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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceArticleDetails);
  else enhanceArticleDetails();
})();
