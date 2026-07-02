/* =========================================================
   WYQ 专属博客 — stable interactions
   - Theme toggle
   - Scroll reveal
   - Floating nav
   - Native menu reparented to body for real backdrop blur
   - Smooth article details transitions
   ========================================================= */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function injectStyle() {
    if ($('#wyq-stable-ui-style')) return;
    var style = document.createElement('style');
    style.id = 'wyq-stable-ui-style';
    style.textContent = [
      '.hero__actions{display:flex!important;justify-content:center!important;align-items:center!important;gap:22px!important;flex-wrap:wrap!important;width:100%!important;margin:0 auto!important;float:none!important;}',
      '.hero__now{display:flex!important;justify-content:center!important;align-items:center!important;width:100%!important;max-width:none!important;margin:22px auto 0!important;padding:0!important;clear:both!important;background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border-radius:0!important;min-height:0!important;float:none!important;}',
      '.hero__now::before,.hero__now::after{content:none!important;display:none!important;}',
      '.hero__now span{display:inline-flex!important;align-items:center!important;width:auto!important;max-width:min(92vw,680px)!important;margin:0 auto!important;padding:8px 18px!important;border-radius:999px!important;background:rgba(255,255,255,.64)!important;color:var(--text-muted)!important;border:1px solid rgba(255,255,255,.58)!important;box-shadow:0 10px 30px rgba(0,0,0,.06)!important;backdrop-filter:saturate(180%) blur(18px)!important;-webkit-backdrop-filter:saturate(180%) blur(18px)!important;}',
      '.hero__now span::before{content:""!important;display:block!important;width:9px!important;height:9px!important;border-radius:999px!important;background:#34c759!important;margin-right:10px!important;box-shadow:0 0 0 6px rgba(52,199,89,.14)!important;flex:0 0 auto!important;}',

      '.hero__actions .btn--primary{position:relative!important;isolation:isolate!important;overflow:hidden!important;color:#fff!important;border:1px solid rgba(255,255,255,.70)!important;background:linear-gradient(112deg,#f4a8e7 0%,#f8c4ee 18%,#ffd9d0 36%,#fff7ca 56%,#f9e9a8 70%,#daf1ff 86%,#eadfff 100%)!important;background-size:240% 240%!important;box-shadow:0 16px 38px rgba(244,168,231,.18),0 9px 22px rgba(255,217,208,.18),0 7px 18px rgba(218,241,255,.16),inset 0 1px 0 rgba(255,255,255,.72),inset 0 -1px 0 rgba(0,0,0,.08)!important;text-shadow:0 1px 12px rgba(90,48,120,.24)!important;animation:wyqRainbowFlow 2.4s ease-in-out infinite!important;}',
      '.hero__actions .btn--primary::before{content:""!important;position:absolute!important;inset:1px!important;border-radius:inherit!important;background:linear-gradient(180deg,rgba(255,255,255,.58),rgba(255,255,255,.20) 42%,rgba(255,255,255,0) 66%)!important;mix-blend-mode:screen!important;z-index:-1!important;pointer-events:none!important;}',
      '.hero__actions .btn--primary::after{content:""!important;position:absolute!important;inset:-42% -28%!important;border-radius:inherit!important;background:linear-gradient(100deg,transparent 18%,rgba(255,255,255,.82) 36%,rgba(255,255,255,.25) 50%,transparent 66%)!important;transform:translateX(-120%) rotate(8deg)!important;z-index:0!important;pointer-events:none!important;animation:wyqRainbowShine 1.9s cubic-bezier(.2,.7,.2,1) infinite!important;}',
      '.hero__actions .btn--primary span,.hero__actions .btn--primary{z-index:1!important;}',
      '.hero__actions .btn--primary:hover{transform:translateY(-2px) scale(1.015)!important;box-shadow:0 20px 48px rgba(244,168,231,.24),0 11px 24px rgba(255,217,208,.22),0 0 0 1px rgba(255,255,255,.50),inset 0 1px 0 rgba(255,255,255,.76)!important;}',
      '.hero__actions .btn--primary:active{transform:translateY(0) scale(.99)!important;}',
      '@keyframes wyqRainbowFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
      '@keyframes wyqRainbowShine{0%,42%{transform:translateX(-120%) rotate(8deg);opacity:0}52%{opacity:.9}76%,100%{transform:translateX(120%) rotate(8deg);opacity:0}}',

      '.nav{top:12px!important;left:50%!important;right:auto!important;width:min(calc(100% - 18px),1360px)!important;height:56px!important;transform:translateX(-50%) translateY(0) scale(1)!important;opacity:1!important;filter:blur(0) saturate(100%) brightness(1)!important;background:transparent!important;border-bottom:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:none!important;overflow:visible!important;transition:transform .30s cubic-bezier(.16,.84,.28,1),opacity .20s ease,filter .20s ease!important;will-change:transform,opacity,filter;z-index:9999!important;}',
      '.nav.nav--hiding{filter:blur(8px) saturate(180%) brightness(1.08)!important;}',
      '.nav.nav--hidden{transform:translateX(-50%) translateY(-96px) scale(.985)!important;opacity:0!important;filter:blur(16px) saturate(240%) brightness(1.14)!important;}',
      '.nav__inner{width:100%!important;max-width:none!important;height:100%!important;margin:0!important;padding:0 28px!important;border-radius:999px!important;background:rgba(251,251,253,.72)!important;border:1px solid rgba(255,255,255,.58)!important;box-shadow:0 14px 36px rgba(0,0,0,.10),inset 0 1px 0 rgba(255,255,255,.72)!important;backdrop-filter:saturate(200%) blur(34px)!important;-webkit-backdrop-filter:saturate(200%) blur(34px)!important;pointer-events:auto!important;overflow:visible!important;}',
      '[data-theme="dark"] .nav__inner{background:rgba(22,22,24,.66)!important;border-color:rgba(255,255,255,.12)!important;box-shadow:0 14px 38px rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.08)!important;}',
      '.nav__menu{gap:8px!important;overflow:visible!important;}',
      '.nav__sub-toggle,.nav__search-btn,.nav__theme,.nav__menu a{border-radius:999px!important;transition:background .2s ease,color .2s ease,transform .2s ease,box-shadow .2s ease!important;}',
      '.nav__sub-toggle{padding:8px 13px!important;}',
      'details.nav__has-sub>summary.nav__sub-toggle{list-style:none!important;display:inline-flex!important;align-items:center!important;gap:4px!important;cursor:pointer!important;user-select:none!important;color:var(--text-soft)!important;}',
      'details.nav__has-sub>summary.nav__sub-toggle::-webkit-details-marker{display:none!important;}',
      'details.nav__has-sub.is-visible>summary.nav__sub-toggle,details.nav__has-sub[open]>summary.nav__sub-toggle,.nav__sub-toggle:hover{background:rgba(255,255,255,.58)!important;color:var(--text)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.62)!important;}',
      '[data-theme="dark"] details.nav__has-sub.is-visible>summary.nav__sub-toggle,[data-theme="dark"] details.nav__has-sub[open]>summary.nav__sub-toggle,[data-theme="dark"] .nav__sub-toggle:hover{background:rgba(255,255,255,.10)!important;box-shadow:none!important;}',
      'details.nav__has-sub .nav__sub-toggle__chevron{transition:transform .28s cubic-bezier(.2,.7,.2,1)!important;}',
      'details.nav__has-sub.is-visible .nav__sub-toggle__chevron,details.nav__has-sub[open] .nav__sub-toggle__chevron{transform:rotate(180deg)!important;}',

      '.nav-menu-portal{position:fixed!important;min-width:270px!important;padding:12px!important;border-radius:28px!important;background:rgba(245,250,255,.30)!important;border:1px solid rgba(255,255,255,.68)!important;box-shadow:0 28px 80px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.82)!important;backdrop-filter:blur(70px) saturate(230%) contrast(.92) brightness(1.08)!important;-webkit-backdrop-filter:blur(70px) saturate(230%) contrast(.92) brightness(1.08)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-14px) scale(.94)!important;transform-origin:90% 0!important;filter:blur(12px) saturate(160%) brightness(1.08)!important;transition:opacity .20s ease,visibility .20s ease,transform .30s cubic-bezier(.16,.84,.28,1),filter .26s ease!important;z-index:10020!important;overflow:hidden!important;isolation:isolate!important;}',
      '.nav-menu-portal::before{content:""!important;position:absolute!important;inset:0!important;z-index:0!important;background:rgba(255,255,255,.46)!important;backdrop-filter:blur(55px) saturate(220%)!important;-webkit-backdrop-filter:blur(55px) saturate(220%)!important;pointer-events:none!important;}',
      '.nav-menu-portal::after{content:""!important;position:absolute!important;inset:-45%!important;z-index:1!important;background:radial-gradient(circle at 18% 0%,rgba(0,113,227,.22),transparent 34%),radial-gradient(circle at 85% 10%,rgba(191,90,242,.18),transparent 36%),radial-gradient(circle at 50% 120%,rgba(90,200,250,.16),transparent 42%)!important;pointer-events:none!important;}',
      '.nav-menu-portal.is-visible{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0) scale(1)!important;filter:blur(0) saturate(100%) brightness(1)!important;}',
      '.nav-menu-portal.is-closing{opacity:0!important;visibility:visible!important;pointer-events:none!important;transform:translateY(-14px) scale(.94)!important;filter:blur(16px) saturate(190%) brightness(1.12)!important;}',
      '[data-theme="dark"] .nav-menu-portal{background:rgba(22,22,28,.34)!important;border-color:rgba(255,255,255,.14)!important;box-shadow:0 28px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.10)!important;}',
      '[data-theme="dark"] .nav-menu-portal::before{background:rgba(24,26,34,.54)!important;}',
      '.nav-menu-portal a{position:relative!important;z-index:2!important;display:flex!important;align-items:center!important;gap:12px!important;padding:13px 14px!important;border-radius:18px!important;color:var(--text-soft)!important;background:transparent!important;transition:background .18s ease,color .18s ease,transform .18s ease!important;}',
      '.nav-menu-portal a:hover{color:var(--accent)!important;background:rgba(0,113,227,.12)!important;transform:translateY(-1px)!important;}',
      '[data-theme="dark"] .nav-menu-portal a:hover{background:rgba(41,151,255,.16)!important;}',
      '.nav-menu-portal .nav__submenu__sep{position:relative!important;z-index:2!important;}',
      'body .nav details.nav__has-sub > .nav__submenu:not(.nav-menu-portal),body .nav details.nav__has-sub[open] > .nav__submenu:not(.nav-menu-portal),body .nav details.nav__has-sub.is-visible > .nav__submenu:not(.nav-menu-portal),body .nav .nav__submenu[aria-hidden="true"]{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:none!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}',

      '.nav-search{top:84px!important;width:min(calc(100% - 32px),900px)!important;max-width:none!important;border-radius:30px!important;background:rgba(251,251,253,.74)!important;border:1px solid rgba(255,255,255,.62)!important;box-shadow:0 28px 80px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.74)!important;backdrop-filter:saturate(200%) blur(34px)!important;-webkit-backdrop-filter:saturate(200%) blur(34px)!important;overflow:hidden!important;}',
      '[data-theme="dark"] .nav-search{background:rgba(22,22,24,.72)!important;border-color:rgba(255,255,255,.13)!important;}',
      '.nav-search.is-open{transform:translateX(-50%) translateY(0) scale(1)!important;}',

      '.article details.details-anim .prompt-content{box-sizing:border-box;overflow:hidden!important;transition:height .42s cubic-bezier(.2,.7,.2,1),opacity .28s ease,padding-top .42s cubic-bezier(.2,.7,.2,1),padding-bottom .42s cubic-bezier(.2,.7,.2,1)!important;will-change:height,opacity,padding;}',
      '@media(max-width:720px){.nav{top:10px!important;width:calc(100% - 16px)!important;height:52px!important}.nav__inner{padding:0 14px!important}.nav-menu-portal{min-width:230px!important;border-radius:24px!important}.hero__actions{gap:14px!important}.hero__now{margin-top:18px!important}}'
    ].join('\n');
    document.head.appendChild(style);
  }
  injectStyle();

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

  function initThemeToggle() {
    var themeBtn = $('[data-theme-toggle]');
    if (!themeBtn) return;
    themeBtn.addEventListener('click', function () {
      applyTheme((root.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark');
    });
  }

  function initReparentedMenus() {
    var detailsList = $all('details.nav__has-sub');
    if (!detailsList.length) return;
    var CLOSE_MS = 260;

    detailsList.forEach(function (details) {
      if (details.dataset.portalReady === '1') return;
      details.dataset.portalReady = '1';

      var summary = details.querySelector('summary');
      var menu = details.querySelector('.nav__submenu');
      if (!summary || !menu) return;

      var portal = menu.cloneNode(true);
      portal.classList.add('nav-menu-portal');
      portal.removeAttribute('style');
      portal.setAttribute('aria-hidden', 'true');
      document.body.appendChild(portal);
      menu.setAttribute('aria-hidden', 'true');
      menu.style.setProperty('display', 'none', 'important');
      menu.style.setProperty('visibility', 'hidden', 'important');
      menu.style.setProperty('opacity', '0', 'important');
      menu.style.setProperty('pointer-events', 'none', 'important');

      function positionPortal() {
        var rect = summary.getBoundingClientRect();
        var width = Math.max(270, portal.offsetWidth || 270);
        if (window.innerWidth <= 720) width = Math.max(230, Math.min(width, window.innerWidth - 24));
        portal.style.width = width + 'px';
        var left = rect.left + rect.width / 2 - width / 2;
        left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
        portal.style.left = left + 'px';
        portal.style.top = Math.round(rect.bottom + 12) + 'px';
        portal.style.transformOrigin = Math.max(20, Math.min(width - 20, rect.left + rect.width / 2 - left)) + 'px 0';
      }

      function close() {
        if (!details.classList.contains('is-visible')) return;
        details.classList.remove('is-visible');
        portal.classList.remove('is-visible');
        portal.classList.add('is-closing');
        portal.setAttribute('aria-hidden', 'true');
        window.setTimeout(function () {
          portal.classList.remove('is-closing');
          details.removeAttribute('open');
        }, CLOSE_MS);
      }

      function closeOthers() {
        detailsList.forEach(function (other) {
          if (other !== details && other._wyqCloseMenu) other._wyqCloseMenu();
        });
      }

      function open() {
        closeOthers();
        details.setAttribute('open', '');
        menu.style.setProperty('display', 'none', 'important');
        positionPortal();
        portal.classList.remove('is-closing');
        portal.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(function () {
          details.classList.add('is-visible');
          portal.classList.add('is-visible');
        });
      }

      details._wyqCloseMenu = close;

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (details.classList.contains('is-visible')) close();
        else open();
      }, true);

      portal.addEventListener('click', function (e) { e.stopPropagation(); });
      window.addEventListener('scroll', function () {
        if (details.classList.contains('is-visible')) positionPortal();
      }, { passive: true });
      window.addEventListener('resize', function () {
        if (details.classList.contains('is-visible')) positionPortal();
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('details.nav__has-sub') && !e.target.closest('.nav-menu-portal')) {
        detailsList.forEach(function (d) { if (d._wyqCloseMenu) d._wyqCloseMenu(); });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') detailsList.forEach(function (d) { if (d._wyqCloseMenu) d._wyqCloseMenu(); });
    });
  }

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
  function initAutoHideNav() {
    if (!nav) return;
    window.addEventListener('scroll', function () {
      var y = window.scrollY || 0;
      var menuOpen = !!$('.nav-menu-portal.is-visible');
      var lockedOpen = document.body.classList.contains('search-open') || menuOpen || ($('#sidebar') && $('#sidebar').classList.contains('is-open'));
      if (lockedOpen || y < 90 || y < lastY) showNav();
      else if (y > lastY && y > 120) hideNav();
      lastY = y;
    }, { passive: true });
  }

  function initReveal() {
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
  }

  function initActiveNav() {
    var file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $all('.nav__menu a[href]').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === file || (file === '' && href === 'index.html')) a.classList.add('active');
    });
  }

  function initFooterYear() {
    var yr = $('[data-year]');
    if (yr) yr.textContent = new Date().getFullYear();
  }

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

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    initThemeToggle();
    initReparentedMenus();
    initAutoHideNav();
    initReveal();
    initActiveNav();
    initFooterYear();
    enhanceArticleDetails();
  });
})();
