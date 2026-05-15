/* =========================================================
   WYQ 专属博客 — minimal interactions
   - Theme toggle (light / dark, persisted)
   - Scroll reveal
   - Footer year
   ========================================================= */
(function () {
  'use strict';

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
})();
