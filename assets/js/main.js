/* =========================================================
   WYQ 专属博客 — minimal interactions
   - Theme toggle
   - Scroll reveal
   - Active nav / sidebar
   - Floating rounded nav + glass submenu
   - Smooth article details transitions
   ========================================================= */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- UI override styles ---------- */
  function injectUiStyle() {
    if ($('#floating-nav-style')) return;
    var style = document.createElement('style');
    style.id = 'floating-nav-style';
    style.textContent = [
      '.hero__actions{display:flex!important;justify-content:center!important;align-items:center!important;gap:22px!important;flex-wrap:wrap!important;margin:0 auto!important;}',
      '.hero__now{display:flex!important;justify-content:center!important;width:100%!important;margin:22px auto 0!important;clear:both!important;}',
      '.hero__now span{display:inline-flex!important;align-items:center!important;max-width:min(92vw,680px)!important;padding:8px 18px!important;border-radius:999px!important;background:rgba(255,255,255,.62)!important;color:var(--text-muted)!important;border:1px solid rgba(255,255,255,.55)!important;box-shadow:0 10px 30px rgba(0,0,0,.06)!important;backdrop-filter:saturate(180%) blur(18px)!important;-webkit-backdrop-filter:saturate(180%) blur(18px)!important;}',
      '.hero__now span::before{content:"";width:9px;height:9px;border-radius:999px;background:#34c759;margin-right:10px;box-shadow:0 0 0 6px rgba(52,199,89,.14);flex:0 0 auto;}',
      '[data-theme="dark"] .hero__now span{background:rgba(22,22,24,.58)!important;border-color:rgba(255,255,255,.10)!important;}',

      '.nav{top:12px!important;left:50%!important;right:auto!important;width:min(calc(100% - 18px),1360px)!important;height:56px!important;transform:translateX(-50%) translateY(0) scale(1)!important;opacity:1;filter:blur(0) saturate(100%) brightness(1);background:transparent!important;border-bottom:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:none;transition:transform .30s cubic-bezier(.16,.84,.28,1),opacity .20s ease,filter .20s ease!important;will-change:transform,opacity,filter;}',
      '.nav.nav--hiding{filter:blur(8px) saturate(180%) brightness(1.08);}',
      '.nav.nav--hidden{transform:translateX(-50%) translateY(-96px) scale(.985)!important;opacity:0;filter:blur(16px) saturate(240%) brightness(1.14);}',
      '.nav__inner{width:100%!important;max-width:none!important;height:100%!important;margin:0!important;padding:0 28px!important;border-radius:999px;background:rgba(251,251,253,.72);border:1px solid rgba(255,255,255,.58);box-shadow:0 14px 36px rgba(0,0,0,.10),inset 0 1px 0 rgba(255,255,255,.72);backdrop-filter:saturate(200%) blur(34px);-webkit-backdrop-filter:saturate(200%) blur(34px);pointer-events:auto;transform:translateZ(0);transition:background .3s ease,border-color .3s ease,box-shadow .3s ease,filter .2s ease,transform .2s ease;}',
      '.nav.nav--hiding .nav__inner{filter:blur(3px);transform:scale(.996);}',
      '.nav.nav--hidden .nav__inner{filter:blur(9px);transform:scale(.99);}',
      '[data-theme="dark"] .nav__inner{background:rgba(22,22,24,.66);border-color:rgba(255,255,255,.12);box-shadow:0 14px 38px rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.08);}',

      '.nav__menu{gap:8px!important;}',
      '.nav__has-sub{position:relative;}',
      '.nav__sub-toggle,.nav__search-btn,.nav__theme,.nav__sidebar-toggle,.nav__menu a{border-radius:999px!important;transition:background .2s ease,color .2s ease,transform .2s ease,box-shadow .2s ease!important;}',
      '.nav__sub-toggle,.nav__sidebar-toggle{padding:8px 13px!important;}',
      '.nav__has-sub:hover>.nav__sub-toggle,.nav__has-sub:focus-within>.nav__sub-toggle,.nav__has-sub.is-open>.nav__sub-toggle,.nav__menu a.active{background:rgba(255,255,255,.58)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.62);color:var(--text)!important;}',
      '.nav__menu a:hover,.nav__theme:hover,.nav__search-btn:hover,.nav__sub-toggle:hover,.nav__sidebar-toggle:hover{background:rgba(255,255,255,.52)!important;transform:translateY(-1px);}',
      '[data-theme="dark"] .nav__has-sub:hover>.nav__sub-toggle,[data-theme="dark"] .nav__has-sub:focus-within>.nav__sub-toggle,[data-theme="dark"] .nav__has-sub.is-open>.nav__sub-toggle,[data-theme="dark"] .nav__menu a.active,[data-theme="dark"] .nav__menu a:hover,[data-theme="dark"] .nav__theme:hover,[data-theme="dark"] .nav__search-btn:hover,[data-theme="dark"] .nav__sub-toggle:hover,[data-theme="dark"] .nav__sidebar-toggle:hover{background:rgba(255,255,255,.10)!important;box-shadow:none;}',

      '.nav__submenu{position:absolute!important;top:calc(100% + 12px)!important;right:0!important;left:auto!important;min-width:270px!important;padding:12px!important;border-radius:28px!important;background:rgba(251,251,253,.78)!important;border:1px solid rgba(255,255,255,.62)!important;box-shadow:0 24px 70px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.72)!important;backdrop-filter:saturate(200%) blur(32px)!important;-webkit-backdrop-filter:saturate(200%) blur(32px)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-8px) scale(.96)!important;transform-origin:90% 0;transition:opacity .22s ease,visibility .22s ease,transform .28s cubic-bezier(.2,.7,.2,1)!important;overflow:hidden!important;}',
      '.nav__submenu::before{content:"";position:absolute;left:0;right:0;top:-18px;height:18px;}',
      '.nav__has-sub:hover>.nav__submenu,.nav__has-sub:focus-within>.nav__submenu,.nav__has-sub.is-open>.nav__submenu{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0) scale(1)!important;}',
      '[data-theme="dark"] .nav__submenu{background:rgba(22,22,24,.78)!important;border-color:rgba(255,255,255,.13)!important;box-shadow:0 24px 70px rgba(0,0,0,.50),inset 0 1px 0 rgba(255,255,255,.08)!important;}',
      '.nav__submenu a{display:flex!important;align-items:center!important;gap:12px!important;padding:13px 14px!important;border-radius:18px!important;color:var(--text-soft)!important;background:transparent!important;transform:none!important;}',
      '.nav__submenu a:hover{color:var(--accent)!important;background:rgba(0,113,227,.12)!important;}',
      '[data-theme="dark"] .nav__submenu a:hover{background:rgba(41,151,255,.16)!important;}',
      '.nav__submenu__icon{width:21px!important;height:21px!important;opacity:.82;}',
      '.nav__submenu__sep{margin:10px 12px!important;border-color:rgba(0,0,0,.08)!important;}',
      '[data-theme="dark"] .nav__submenu__sep{border-color:rgba(255,255,255,.10)!important;}',

      '.nav-search{top:84px!important;width:min(calc(100% - 32px),900px)!important;max-width:none!important;border-radius:30px!important;background:rgba(251,251,253,.74)!important;border:1px solid rgba(255,255,255,.62)!important;box-shadow:0 28px 80px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.74)!important;backdrop-filter:saturate(200%) blur(34px)!important;-webkit-backdrop-filter:saturate(200%) blur(34px)!important;overflow:hidden;}',
      '[data-theme="dark"] .nav-search{background:rgba(22,22,24,.72)!important;border-color:rgba(255,255,255,.13)!important;box-shadow:0 28px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.08)!important;}',
      '.nav-search.is-open{transform:translateX(-50%) translateY(0) scale(1)!important;}',
      '.nav-search__inner{padding:20px 28px!important;gap:16px!important;border-bottom:1px solid rgba(0,0,0,.07)!important;}',
      '[data-theme="dark"] .nav-search__inner{border-bottom-color:rgba(255,255,255,.10)!important;}',
      '.nav-search__icon{width:25px!important;height:25px!important;}',
      '.nav-search__input{font-size:24px!important;letter-spacing:-.03em!important;}',
      '.nav-search__results{padding:14px!important;max-height:min(430px,55vh)!important;}',
      '.nav-search__hint,.nav-search__empty{padding:42px 16px!important;font-size:17px!important;}',
      '.nav-search__item{border-radius:18px!important;padding:16px 18px!important;transition:background .2s ease,transform .2s ease!important;}',
      '.nav-search__item:hover{background:rgba(255,255,255,.50)!important;transform:translateY(-1px);}',
      '[data-theme="dark"] .nav-search__item:hover{background:rgba(255,255,255,.08)!important;}',
      '.nav-search__item-cat{background:rgba(0,113,227,.10)!important;color:var(--accent)!important;}',
      '.nav-search__overlay{backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;background:rgba(255,255,255,.18)!important;}',
      '[data-theme="dark"] .nav-search__overlay{background:rgba(0,0,0,.26)!important;}',

      '.article details.details-anim{border-radius:18px!important;background:rgba(255,255,255,.30);backdrop-filter:saturate(180%) blur(18px);-webkit-backdrop-filter:saturate(180%) blur(18px);box-shadow:0 10px 30px rgba(0,0,0,.06);}',
      '[data-theme="dark"] .article details.details-anim{background:rgba(255,255,255,.04);box-shadow:0 10px 30px rgba(0,0,0,.28);}',
      '.article details.details-anim summary{transition:background .2s ease,color .2s ease,border-color .2s ease;}',
      '.article details.details-anim .prompt-content{box-sizing:border-box;overflow:hidden!important;transition:height .42s cubic-bezier(.2,.7,.2,1),opacity .28s ease,padding-top .42s cubic-bezier(.2,.7,.2,1),padding-bottom .42s cubic-bezier(.2,.7,.2,1)!important;will-change:height,opacity,padding;}',

      '@media(max-width:720px){.hero__sub{font-size:clamp(20px,7vw,30px)!important}.hero__actions{gap:14px!important}.hero__now{margin-top:18px!important}.nav{top:10px!important;width:calc(100% - 16px)!important;height:52px!important}.nav__inner{padding:0 14px!important}.nav__brand{font-size:17px}.nav__menu{gap:3px!important}.nav__menu a,.nav__sub-toggle{padding-left:8px!important;padding-right:8px!important}.nav__submenu{right:-8px!important;min-width:230px!important;border-radius:24px!important;}}',
      '@media(prefers-reduced-motion:reduce){.nav,.nav__inner,.nav__submenu,.article details.details-anim .prompt-content{transition:none!important;}}',
      '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){.nav__inner,.nav__submenu,.nav-search{background:rgba(251,251,253,.94)!important}[data-theme="dark"] .nav__inner,[data-theme="dark"] .nav__submenu,[data-theme="dark"] .nav-search{background:rgba(22,22,24,.94)!important}}'
    ].join('\n');
    document.head.appendChild(style);
  }
  injectUiStyle();

  /* ---------- Theme ---------- */
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

  /* ---------- Nav submenu click support ---------- */
  function closeSubmenus(except) {
    $all('.nav__has-sub.is-open').forEach(function (li) {
      if (li !== except) li.classList.remove('is-open');
    });
  }
  $all('[data-nav-sub-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var li = btn.closest('.nav__has-sub');
      if (!li) return;
      var willOpen = !li.classList.contains('is-open');
      closeSubmenus(li);
      li.classList.toggle('is-open', willOpen);
      showNav();
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__has-sub')) closeSubmenus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSubmenus();
  });

  /* ---------- Auto-hide nav ---------- */
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
      var lockedOpen = document.body.classList.contains('search-open') ||
        !!$('.nav__has-sub.is-open') ||
        ($('#sidebar') && $('#sidebar').classList.contains('is-open'));
      if (lockedOpen || y < 90 || y < lastY) showNav();
      else if (y > lastY && y > 120) hideNav();
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
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

  /* ---------- Active nav link ---------- */
  var file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $all('.nav__menu a[href]').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === file || (file === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Footer year ---------- */
  var yr = $('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Sidebar ---------- */
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

  /* ---------- Smooth details ---------- */
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
