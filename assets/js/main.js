/* =========================================================
   WYQ 专属博客 — interactions
   - Theme toggle (light / dark, persisted)
   - Search + category filter
   - Scroll reveal
   - Optional Giscus comments
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Theme ---------- */
  const STORAGE_KEY = 'wyq-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    // If Giscus is already loaded, switch its theme too
    const frame = document.querySelector('iframe.giscus-frame');
    if (frame) {
      try {
        frame.contentWindow.postMessage(
          { giscus: { setConfig: { theme: theme === 'dark' ? 'dark' : 'light' } } },
          'https://giscus.app'
        );
      } catch (_) {}
    }
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

  /* ---------- 2. Search + category filter ---------- */
  const cards = Array.from(document.querySelectorAll('[data-category]'));
  const empty = document.querySelector('[data-empty]');
  const chips = document.querySelectorAll('[data-filter]');
  const searchInput = document.getElementById('search');

  let activeCategory = 'all';
  let activeQuery = '';

  function normalize(s) {
    return (s || '').toString().toLowerCase().trim();
  }

  function applyFilters() {
    let visible = 0;
    const q = normalize(activeQuery);
    cards.forEach((card) => {
      const matchCat = activeCategory === 'all' || card.dataset.category === activeCategory;
      const haystack = normalize(
        (card.dataset.title || '') + ' ' +
        (card.dataset.excerpt || '') + ' ' +
        (card.textContent || '')
      );
      const matchQuery = q === '' || haystack.indexOf(q) !== -1;
      const show = matchCat && matchQuery;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) {
      if (visible === 0 && cards.length > 0) {
        empty.removeAttribute('hidden');
      } else {
        empty.setAttribute('hidden', '');
      }
    }
  }

  if (chips.length) {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        activeCategory = chip.dataset.filter;
        applyFilters();
      });
    });
  }

  if (searchInput) {
    let t;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => {
        activeQuery = e.target.value;
        applyFilters();
      }, 80);
    });
  }

  if (cards.length) applyFilters();

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

  /* ---------- 6. Giscus comments (optional) ---------- */
  /*
   * 启用步骤：
   *   1. 在你的仓库 (Riuip/my-book) 的 Settings → General 里开启 "Discussions"。
   *   2. 安装 GitHub App: https://github.com/apps/giscus
   *   3. 访问 https://giscus.app 配置：
   *        - Repository: Riuip/my-book
   *        - 选 "Announcements" 分类（或任意分类）
   *      它会给你 4 个 ID：repoId / categoryId 等。
   *   4. 把下面 GISCUS.enabled 改为 true，并把 4 个 ID 填进来。
   *   5. 推送后, post-welcome.html / post-template.html 等文章页就会出现评论区。
   *
   * 不启用也完全不影响博客其它功能，只是文章页底部不显示评论。
   */
  const GISCUS = {
    enabled: false,                              // ← 配置好后改 true
    repo: 'Riuip/my-book',
    repoId: 'YOUR_REPO_ID',                      // ← 填
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',              // ← 填
    mapping: 'pathname',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'zh-CN'
  };

  const container = document.getElementById('giscus-container');
  if (container && GISCUS.enabled) {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', GISCUS.repo);
    script.setAttribute('data-repo-id', GISCUS.repoId);
    script.setAttribute('data-category', GISCUS.category);
    script.setAttribute('data-category-id', GISCUS.categoryId);
    script.setAttribute('data-mapping', GISCUS.mapping);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', GISCUS.reactionsEnabled);
    script.setAttribute('data-emit-metadata', GISCUS.emitMetadata);
    script.setAttribute('data-input-position', GISCUS.inputPosition);
    script.setAttribute('data-theme', root.getAttribute('data-theme') || 'light');
    script.setAttribute('data-lang', GISCUS.lang);
    container.appendChild(script);
  }
})();
