/* =========================================================
   WYQ 专属博客 — interactions
   - Theme toggle (light / dark, persisted)
   - Category filter
   - Scroll reveal
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Theme ---------- */
  const STORAGE_KEY = 'wyq-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  }

  function initTheme() {
    let saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  initTheme();

  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Sync with system if user hasn't explicitly chosen
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      let saved;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
      if (saved !== 'light' && saved !== 'dark') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', listener);
    else if (mq.addListener) mq.addListener(listener);
  }

  /* ---------- 2. Category filter ---------- */
  const chips = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  const empty = document.querySelector('[data-empty]');

  function applyFilter(category) {
    let visible = 0;
    cards.forEach((card) => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (empty) empty.style.display = visible === 0 ? '' : 'none';
  }

  if (chips.length) {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        applyFilter(chip.dataset.filter);
      });
    });
    // Set initial state
    const initial = document.querySelector('[data-filter].is-active');
    applyFilter(initial ? initial.dataset.filter : 'all');
  }

  /* ---------- 3. Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- 4. Active nav link ---------- */
  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__menu a[href]').forEach((a) => {
    const href = a.getAttribute('href').toLowerCase();
    if (href === file || (file === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- 5. Footer year ---------- */
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
