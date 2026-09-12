/* WYQ interactions. Visual materials live in assets/css/liquid-glass.css. */
(function () {
  'use strict';
  var root = document.documentElement;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  var preference;
  try { preference = localStorage.getItem('wyq-theme'); } catch (e) { /* Optional storage. */ }
  if (preference !== 'light' && preference !== 'dark') preference = null;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-label', theme === 'dark' ? '切换浅色主题' : '切换深色主题');
    });
  }
  applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));
  if (systemTheme.addEventListener) systemTheme.addEventListener('change', function (event) {
    if (!preference) applyTheme(event.matches ? 'dark' : 'light');
  });

  function initMenus() {
    var menus = [];
    document.querySelectorAll('.nav__has-sub').forEach(function (details, index) {
      var toggle = details.querySelector('summary, [data-nav-sub-toggle]');
      var panel = details.querySelector('.nav__submenu');
      if (!toggle || !panel) return;
      // Move the original panel so IDs and later content updates stay unique.
      panel.classList.add('nav-menu-portal');
      panel.id = panel.id || 'nav-menu-' + index;
      panel.setAttribute('aria-hidden', 'true');
      panel.inert = true;
      document.body.appendChild(panel);
      toggle.setAttribute('aria-controls', panel.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-haspopup', 'menu');
      var links = Array.from(panel.querySelectorAll('a[href]'));
      var currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
      links.forEach(function (link) {
        if ((link.getAttribute('href') || '').toLowerCase() === currentFile) {
          toggle.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
      var closeTimer, hoverTimer;
      var hover = window.matchMedia('(hover: hover) and (pointer: fine)');
      function position() {
        var rect = toggle.getBoundingClientRect();
        var viewport = window.visualViewport;
        var left = viewport ? viewport.offsetLeft : 0;
        var top = viewport ? viewport.offsetTop : 0;
        var viewportWidth = viewport ? viewport.width : innerWidth;
        var viewportHeight = viewport ? viewport.height : innerHeight;
        var safe = getComputedStyle(root);
        var safeLeft = parseFloat(safe.getPropertyValue('--safe-left')) || 0;
        var safeRight = parseFloat(safe.getPropertyValue('--safe-right')) || 0;
        var minLeft = left + safeLeft + 12;
        var maxRight = left + viewportWidth - safeRight - 12;
        var width = Math.min(280, maxRight - minLeft);
        panel.style.width = width + 'px';
        panel.style.left = Math.max(minLeft, Math.min(rect.left + rect.width / 2 - width / 2, maxRight - width)) + 'px';
        var panelTop = Math.max(top + 12, Math.min(rect.bottom + 12, top + viewportHeight - 120));
        panel.style.top = Math.round(panelTop) + 'px';
        panel.style.maxHeight = Math.max(40, top + viewportHeight - panelTop - 12) + 'px';
      }
      function close(restoreFocus) {
        clearTimeout(closeTimer);
        clearTimeout(hoverTimer);
        details.classList.remove('is-visible');
        panel.classList.remove('is-visible');
        toggle.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        panel.inert = true;
        if (restoreFocus) toggle.focus();
        closeTimer = setTimeout(function () { details.open = false; }, motion.matches ? 0 : 180);
      }
      function open(focusIndex) {
        menus.forEach(function (menu) { if (menu.details !== details) menu.close(false); });
        clearTimeout(closeTimer);
        clearTimeout(hoverTimer);
        details.open = true;
        position();
        panel.inert = false;
        panel.setAttribute('aria-hidden', 'false');
        details.classList.add('is-visible');
        panel.classList.add('is-visible');
        toggle.setAttribute('aria-expanded', 'true');
        if (typeof focusIndex === 'number' && links[focusIndex]) links[focusIndex].focus();
      }
      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        details.classList.contains('is-visible') ? close(false) : open();
      });
      toggle.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          open(event.key === 'ArrowDown' ? 0 : links.length - 1);
        } else if (event.key === 'Tab' && !event.shiftKey && details.classList.contains('is-visible')) {
          event.preventDefault(); open(0);
        }
      });
      panel.addEventListener('keydown', function (event) {
        var current = links.indexOf(document.activeElement);
        var target;
        if (event.key === 'ArrowDown') target = (current + 1) % links.length;
        if (event.key === 'ArrowUp') target = (current + links.length - 1) % links.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = links.length - 1;
        if (target !== undefined && links[target]) { event.preventDefault(); links[target].focus(); }
        if (event.key === 'Tab' && event.shiftKey && current === 0) { event.preventDefault(); close(true); }
        else if (event.key === 'Tab' && !event.shiftKey && current === links.length - 1) {
          // Return to the toggle before the browser advances in document order.
          close(true);
        }
      });
      function scheduleClose() {
        if (hover.matches) hoverTimer = setTimeout(function () { close(false); }, 160);
      }
      details.addEventListener('mouseenter', function () { if (hover.matches) open(); });
      details.addEventListener('mouseleave', scheduleClose);
      panel.addEventListener('mouseenter', function () { clearTimeout(hoverTimer); });
      panel.addEventListener('mouseleave', scheduleClose);
      panel.addEventListener('click', function (event) { if (event.target.closest('a')) close(false); });
      menus.push({ details: details, panel: panel, close: close, position: position });
    });
    document.addEventListener('click', function (event) {
      menus.forEach(function (menu) {
        if (!menu.details.contains(event.target) && !menu.panel.contains(event.target)) menu.close(false);
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') menus.forEach(function (menu) {
        if (menu.details.classList.contains('is-visible')) menu.close(true);
      });
    });
    document.addEventListener('focusin', function (event) {
      menus.forEach(function (menu) {
        if (!menu.details.contains(event.target) && !menu.panel.contains(event.target)) menu.close(false);
      });
    });
    var pending = false;
    function reposition() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        menus.forEach(function (menu) { if (menu.details.open) menu.position(); });
      });
    }
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition);
    if (window.visualViewport) {
      visualViewport.addEventListener('resize', reposition, { passive:true });
      visualViewport.addEventListener('scroll', reposition, { passive:true });
    }
  }

  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var last = scrollY, pending = false;
    function measureNav() {
      var top = parseFloat(getComputedStyle(nav).top) || 0;
      root.style.setProperty('--nav-clearance', Math.ceil(nav.offsetHeight + top + 16) + 'px');
    }
    measureNav();
    if ('ResizeObserver' in window) new ResizeObserver(measureNav).observe(nav);
    window.addEventListener('resize', measureNav, { passive:true });
    nav.addEventListener('focusin', function () { nav.classList.remove('nav--hidden'); });
    window.addEventListener('scroll', function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var y = scrollY;
        var locked = nav.contains(document.activeElement) || document.body.classList.contains('search-open') ||
          document.querySelector('.nav__submenu.is-open, .nav-menu-portal.is-visible, .sidebar.is-open');
        if (locked || y < 120 || y < last - 3) nav.classList.remove('nav--hidden');
        else if (y > last + 3) nav.classList.add('nav--hidden');
        last = y;
      });
    }, { passive: true });
  }

  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (motion.matches || !('IntersectionObserver' in window)) {
      nodes.forEach(function (node) { node.classList.add('in'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  function ready() {
    applyTheme(root.getAttribute('data-theme'));
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(preference);
        try { localStorage.setItem('wyq-theme', preference); } catch (e) { /* Optional storage. */ }
      });
    });
    initMenus(); initNav(); initReveal();
    document.querySelectorAll('[data-year]').forEach(function (node) { node.textContent = new Date().getFullYear(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
