/* =========================================================
   WYQ 专属博客 — 一揽子增强 (Wave 1 + Wave 2)
   - 自动阅读时长 (替换 hero meta 中含"分钟阅读"的占位)
   - 上一篇 / 下一篇 自动渲染 (article-foot)
   - 相关文章卡片 (评论上方)
   - 代码块语言标签 + 长代码折叠
   - 图片灯箱 (Lightbox)
   - 键盘快捷键 + 帮助面板
   - 主题色 (accent) 切换 (持久化)
   - PWA service worker 注册
   ========================================================= */
(function () {
  'use strict';

  var API = window.WYQ_POSTS_API;
  var POSTS = window.WYQ_POSTS || [];

  function currentFile() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }
  var FILE = currentFile();
  var IS_ARTICLE = /^post-\d+\.html$/.test(FILE);

  /* =========================================================
     1. 自动阅读时长
     ========================================================= */
  (function readingTime() {
    if (!IS_ARTICLE) return;
    var article = document.querySelector('.article');
    var meta = document.querySelector('.article-hero__meta');
    if (!article || !meta) return;

    var text = article.textContent || '';
    // Chinese chars vs English words
    var cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    var en = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b[a-zA-Z]+\b/g) || []).length;
    // 中文 ~400 字/分钟, 英文 ~220 词/分钟
    var minutes = Math.max(1, Math.round(cn / 400 + en / 220));

    // Prefer a dedicated marker class for robustness; fall back to text match.
    var marker = meta.querySelector('[data-reading-time]');
    if (marker) {
      marker.textContent = '约 ' + minutes + ' 分钟阅读';
    } else {
      var spans = meta.querySelectorAll('span');
      Array.prototype.forEach.call(spans, function (s) {
        var t = (s.textContent || '').trim();
        if (/分钟阅读/.test(t)) {
          s.textContent = '约 ' + minutes + ' 分钟阅读';
        }
      });
    }
  })();

  /* =========================================================
     2. 上一篇 / 下一篇 (article-foot 自动重写)
     3. 相关文章卡片
     ========================================================= */
  (function prevNextRelated() {
    if (!IS_ARTICLE || !API) return;

    var foot = document.querySelector('.article-foot');
    var neighbors = API.getNeighbors(FILE);

    if (foot) {
      // Replace existing buttons with auto-resolved neighbor links.
      // Keep visual structure: two .btn--ghost on the row, plus a "返回主页" centered above.
      foot.innerHTML = '';
      foot.classList.add('article-foot--auto');

      // Row 1: prev / home / next
      var row = document.createElement('div');
      row.className = 'article-foot__row';

      var prevEl;
      if (neighbors.prev) {
        prevEl = document.createElement('a');
        prevEl.className = 'pn-card pn-card--prev';
        prevEl.href = neighbors.prev.url;
        prevEl.innerHTML =
          '<span class="pn-card__dir">&lsaquo; 上一篇</span>' +
          '<span class="pn-card__title">' + escapeHtml(neighbors.prev.title) + '</span>';
      } else {
        prevEl = document.createElement('span');
        prevEl.className = 'pn-card pn-card--placeholder';
        prevEl.innerHTML = '<span class="pn-card__dir">已是最早</span>';
      }
      row.appendChild(prevEl);

      var nextEl;
      if (neighbors.next) {
        nextEl = document.createElement('a');
        nextEl.className = 'pn-card pn-card--next';
        nextEl.href = neighbors.next.url;
        nextEl.innerHTML =
          '<span class="pn-card__dir">下一篇 &rsaquo;</span>' +
          '<span class="pn-card__title">' + escapeHtml(neighbors.next.title) + '</span>';
      } else {
        nextEl = document.createElement('span');
        nextEl.className = 'pn-card pn-card--placeholder';
        nextEl.innerHTML = '<span class="pn-card__dir">已是最新</span>';
      }
      row.appendChild(nextEl);
      foot.appendChild(row);

      // Row 2: home + write
      var row2 = document.createElement('div');
      row2.className = 'article-foot__row article-foot__row--actions';
      row2.innerHTML =
        '<a class="btn btn--ghost" href="index.html" style="color:var(--text-soft);">&lsaquo; 返回主页</a>' +
        '<a class="btn btn--ghost" href="archive.html">浏览所有文章</a>' +
        '<a class="btn btn--ghost" href="mailto:wyq200707@qq.com">写信给 WYQ</a>';
      foot.appendChild(row2);
    }

    // Related posts — insert before .comments-section
    var related = API.getRelated(FILE, 3);
    var commentsEl = document.querySelector('.comments-section');
    if (related.length && commentsEl) {
      var section = document.createElement('section');
      section.className = 'related-section';
      section.innerHTML = '<div class="related-section__title">你可能还喜欢</div>';
      var grid = document.createElement('div');
      grid.className = 'related-grid';
      related.forEach(function (p) {
        var a = document.createElement('a');
        a.className = 'related-card';
        a.href = p.url;
        a.innerHTML =
          '<span class="related-card__cat">' + escapeHtml(p.cat) + '</span>' +
          '<span class="related-card__title">' + escapeHtml(p.title) + '</span>' +
          '<span class="related-card__desc">' + escapeHtml(p.desc) + '</span>' +
          '<span class="related-card__date">' + p.date.replace(/-/g, ' · ') + '</span>';
        grid.appendChild(a);
      });
      section.appendChild(grid);
      commentsEl.parentNode.insertBefore(section, commentsEl);
    }
  })();

  /* =========================================================
     4. 代码块: 语言标签 + 超过 24 行时折叠
     ========================================================= */
  (function codeEnhance() {
    var pres = document.querySelectorAll('.article pre');
    Array.prototype.forEach.call(pres, function (pre) {
      var code = pre.querySelector('code');
      if (!code) return;

      // Detect language from class
      var lang = '';
      var m = (code.className || '').match(/language-([\w-]+)/);
      if (m) lang = m[1];
      if (!lang || lang === 'plaintext') {
        // Best-effort fallback already done in enhancements.js; show "code" if still nothing
        lang = lang || 'code';
      }
      var label = friendlyLang(lang);

      var wrapper = pre.parentNode;
      // Mount label + fold control on the .pre-wrapper (created by copy-btn.js)
      // copy-btn.js wraps pre in .pre-wrapper. Wait until it ran by deferring.
      function mount() {
        var w = pre.parentNode;
        if (!w || !w.classList || !w.classList.contains('pre-wrapper')) {
          // pre is not yet wrapped — create wrapper ourselves so we can host UI.
          w = document.createElement('div');
          w.className = 'pre-wrapper';
          pre.parentNode.insertBefore(w, pre);
          w.appendChild(pre);
        }

        // Language label (top-left)
        if (!w.querySelector('.code-lang-label')) {
          var lbl = document.createElement('span');
          lbl.className = 'code-lang-label';
          lbl.textContent = label;
          w.appendChild(lbl);
        }

        // Folding for long blocks
        var rawText = code.textContent || '';
        var lineCount = rawText.split('\n').length;
        if (lineCount > 24 && !w.classList.contains('pre-wrapper--foldable')) {
          w.classList.add('pre-wrapper--foldable');
          w.classList.add('is-folded');

          var btn = document.createElement('button');
          btn.className = 'code-fold-btn';
          btn.type = 'button';
          btn.innerHTML = '<span class="code-fold-btn__expand">展开 ' + lineCount + ' 行</span>' +
                          '<span class="code-fold-btn__collapse">收起</span>';
          btn.addEventListener('click', function () {
            w.classList.toggle('is-folded');
          });
          w.appendChild(btn);
        }
      }
      // Defer to next tick so copy-btn.js has had a chance to wrap
      setTimeout(mount, 0);
    });
  })();

  function friendlyLang(l) {
    var map = {
      js: 'JavaScript', javascript: 'JavaScript',
      ts: 'TypeScript', typescript: 'TypeScript',
      py: 'Python', python: 'Python',
      sh: 'Shell', bash: 'Bash', zsh: 'Zsh',
      html: 'HTML', markup: 'HTML', xml: 'XML',
      css: 'CSS', scss: 'SCSS', less: 'Less',
      json: 'JSON', yaml: 'YAML', toml: 'TOML',
      md: 'Markdown', markdown: 'Markdown',
      go: 'Go', rust: 'Rust', java: 'Java',
      c: 'C', cpp: 'C++', csharp: 'C#',
      sql: 'SQL', plaintext: 'TEXT', code: 'CODE'
    };
    var key = (l || '').toLowerCase();
    return map[key] || (key ? key.toUpperCase() : 'CODE');
  }

  /* =========================================================
     5. 图片灯箱
     ========================================================= */
  (function lightbox() {
    var imgs = document.querySelectorAll('.article img');
    if (!imgs.length) return;

    // Build overlay lazily
    var overlay = null;
    function getOverlay() {
      if (overlay) return overlay;
      overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML =
        '<button class="lightbox__close" aria-label="关闭">&times;</button>' +
        '<img class="lightbox__img" alt="" />' +
        '<div class="lightbox__caption"></div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.classList.contains('lightbox__close')) {
          close();
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
      });
      return overlay;
    }
    function open(src, alt) {
      var ov = getOverlay();
      var img = ov.querySelector('.lightbox__img');
      var cap = ov.querySelector('.lightbox__caption');
      img.src = src;
      img.alt = alt || '';
      cap.textContent = alt || '';
      cap.style.display = alt ? 'block' : 'none';
      ov.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      if (!overlay) return;
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    Array.prototype.forEach.call(imgs, function (img) {
      img.classList.add('is-zoomable');
      img.addEventListener('click', function () {
        open(img.currentSrc || img.src, img.alt);
      });
    });
  })();

  /* =========================================================
     6. 键盘快捷键 + 帮助面板
     ========================================================= */
  (function keyboardShortcuts() {
    var inSeq = false;
    var seqTimer = null;

    document.addEventListener('keydown', function (e) {
      // Ignore when typing in inputs
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // ? → help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        toggleHelp();
        return;
      }

      // / → focus search
      if (e.key === '/') {
        e.preventDefault();
        var btn = document.getElementById('navSearchBtn');
        if (btn) {
          btn.click();
        } else {
          window.location.href = 'search.html';
        }
        return;
      }

      // t → toggle theme
      if (e.key === 't' || e.key === 'T') {
        var tt = document.querySelector('[data-theme-toggle]');
        if (tt) { e.preventDefault(); tt.click(); }
        return;
      }

      // j / k → scroll down/up
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.4, behavior: 'smooth' });
        return;
      }
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.4, behavior: 'smooth' });
        return;
      }

      // g h → home, g a → archive, g t → tags
      if (inSeq) {
        clearTimeout(seqTimer);
        inSeq = false;
        if (e.key === 'h') { window.location.href = 'index.html'; return; }
        if (e.key === 'a') { window.location.href = 'archive.html'; return; }
        if (e.key === 't') { window.location.href = 'tags.html'; return; }
        return;
      }
      if (e.key === 'g' || e.key === 'G') {
        inSeq = true;
        seqTimer = setTimeout(function () { inSeq = false; }, 1200);
        return;
      }
    });

    function toggleHelp() {
      var existing = document.getElementById('kbd-help');
      if (existing) {
        existing.classList.toggle('is-open');
        return;
      }
      var el = document.createElement('div');
      el.id = 'kbd-help';
      el.className = 'kbd-help is-open';
      el.innerHTML =
        '<div class="kbd-help__panel" role="dialog" aria-label="键盘快捷键">' +
          '<div class="kbd-help__title">键盘快捷键</div>' +
          '<ul class="kbd-help__list">' +
            row('/', '打开搜索') +
            row('t', '切换日 / 夜主题') +
            row('j', '向下滚动') +
            row('k', '向上滚动') +
            row('g h', '回到主页') +
            row('g a', '前往归档') +
            row('g t', '前往分类') +
            row('?', '显示 / 隐藏此面板') +
            row('Esc', '关闭弹窗') +
          '</ul>' +
          '<div class="kbd-help__foot">按 Esc 或点击空白处关闭</div>' +
        '</div>';
      document.body.appendChild(el);
      el.addEventListener('click', function (e) {
        if (e.target === el) el.classList.remove('is-open');
      });
      document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') {
          el.classList.remove('is-open');
        }
      });
    }
    function row(keys, label) {
      var ks = keys.split(' ').map(function (k) {
        return '<kbd>' + escapeHtml(k) + '</kbd>';
      }).join(' ');
      return '<li><span class="kbd-help__keys">' + ks + '</span><span class="kbd-help__label">' + escapeHtml(label) + '</span></li>';
    }
  })();

  /* =========================================================
     7. 主题色切换器 (accent color picker)
     ========================================================= */
  (function accentPicker() {
    var ACCENT_KEY = 'wyq-accent';
    var COLORS = [
      { key: 'blue',   light: '#0071e3', dark: '#2997ff', label: '蓝' },
      { key: 'orange', light: '#ff6b35', dark: '#ff8a3d', label: '橘' },
      { key: 'purple', light: '#8b5cf6', dark: '#a78bfa', label: '紫' },
      { key: 'green',  light: '#10b981', dark: '#34d399', label: '绿' },
      { key: 'pink',   light: '#ec4899', dark: '#f472b6', label: '粉' }
    ];

    function applyAccent(key) {
      var c = COLORS.find(function (x) { return x.key === key; }) || COLORS[0];
      var root = document.documentElement;
      root.style.setProperty('--accent-light', c.light);
      root.style.setProperty('--accent-dark', c.dark);
      // Use the right one based on theme
      var isDark = root.getAttribute('data-theme') === 'dark';
      root.style.setProperty('--accent', isDark ? c.dark : c.light);
      root.style.setProperty('--accent-hover', isDark ? c.dark : c.light);
      root.style.setProperty('--accent-soft', hexToRgba(isDark ? c.dark : c.light, 0.12));
      root.setAttribute('data-accent', key);
    }
    function hexToRgba(hex, a) {
      var h = hex.replace('#', '');
      var r = parseInt(h.substring(0, 2), 16);
      var g = parseInt(h.substring(2, 4), 16);
      var b = parseInt(h.substring(4, 6), 16);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    // Init from localStorage
    var saved = null;
    try { saved = localStorage.getItem(ACCENT_KEY); } catch (e) {}
    if (saved) applyAccent(saved);

    // Re-apply on theme change so light/dark variants swap correctly
    // Only when the user has actually picked an accent — otherwise leave the
    // theme defaults alone so dark mode keeps its lighter blue.
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.attributeName === 'data-theme') {
          var current = document.documentElement.getAttribute('data-accent');
          if (current) applyAccent(current);
        }
      });
    });
    mo.observe(document.documentElement, { attributes: true });

    // Build picker UI — small fixed button bottom-left
    var btn = document.createElement('button');
    btn.className = 'accent-picker-btn';
    btn.setAttribute('aria-label', '切换主题色');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="13.5" cy="6.5" r="2.5"/>' +
        '<circle cx="17.5" cy="10.5" r="2.5"/>' +
        '<circle cx="8.5" cy="7.5" r="2.5"/>' +
        '<circle cx="6.5" cy="12.5" r="2.5"/>' +
        '<path d="M12 2a10 10 0 1 0 10 10c0-1.5-.5-2-2-2h-2a2 2 0 0 1-2-2v-2c0-1.5-.5-2-2-2z"/>' +
      '</svg>';
    document.body.appendChild(btn);

    var panel = document.createElement('div');
    panel.className = 'accent-picker-panel';
    var html = '<div class="accent-picker-panel__title">主题色</div><div class="accent-picker-swatches">';
    COLORS.forEach(function (c) {
      html += '<button class="accent-swatch" data-accent-key="' + c.key + '" ' +
              'style="background:' + c.light + ';" ' +
              'aria-label="' + c.label + '"></button>';
    });
    html += '</div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('is-open');
      // Mark active swatch
      var current = document.documentElement.getAttribute('data-accent') || 'blue';
      Array.prototype.forEach.call(panel.querySelectorAll('.accent-swatch'), function (sw) {
        sw.classList.toggle('is-active', sw.getAttribute('data-accent-key') === current);
      });
    });
    panel.addEventListener('click', function (e) {
      var sw = e.target.closest('.accent-swatch');
      if (!sw) return;
      var key = sw.getAttribute('data-accent-key');
      applyAccent(key);
      try { localStorage.setItem(ACCENT_KEY, key); } catch (err) {}
      panel.classList.remove('is-open');
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('is-open');
      }
    });
  })();

  /* =========================================================
     8. PWA service worker 注册
     ========================================================= */
  (function pwa() {
    if (!('serviceWorker' in navigator)) return;
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* silent */ });
    });
  })();

  /* =========================================================
     Utils
     ========================================================= */
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();



/* =========================================================
   NAV SUBMENU — reparented to <body> so backdrop-filter works
   independently of .nav's own backdrop-filter (which creates
   an isolation context that blocks child blur).
   Hover + click toggle; top border aligns with nav bottom.
   ========================================================= */
(function navSubmenu() {
  'use strict';
  var toggles = document.querySelectorAll('[data-nav-sub-toggle]');
  if (!toggles.length) return;

  var CLOSE_DELAY = 120; // ms grace period when cursor leaves

  // Mark parent toggle as active if any submenu link matches current page
  var file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // For each toggle, move its submenu to <body> and wire up interactions
  Array.prototype.forEach.call(toggles, function (t) {
    var parent = t.parentElement; // .nav__has-sub
    var sub = parent.querySelector('.nav__submenu');
    if (!sub) return;

    // Move submenu to body so it's outside .nav's backdrop-filter context
    document.body.appendChild(sub);

    // Check if current page matches any link in submenu
    var links = sub.querySelectorAll('a[href]');
    var hasActive = false;
    Array.prototype.forEach.call(links, function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === file) hasActive = true;
    });
    if (hasActive) t.classList.add('active');

    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-haspopup', 'true');

    var closeTimer = null;

    function position() {
      var nav = document.querySelector('.nav');
      var navRect = nav.getBoundingClientRect();
      var rect = t.getBoundingClientRect();
      var subWidth = sub.offsetWidth || 220;
      var left = rect.left + rect.width / 2 - subWidth / 2;
      if (left < 12) left = 12;
      if (left + subWidth > window.innerWidth - 12) left = window.innerWidth - 12 - subWidth;
      sub.style.left = left + 'px';
      // Align submenu top border with nav bottom border (overlap 1px)
      sub.style.top = (navRect.bottom - 1) + 'px';
    }

    function open() {
      clearTimeout(closeTimer);
      closeTimer = null;
      position();
      sub.classList.add('is-open');
      t.setAttribute('aria-expanded', 'true');
    }

    function close() {
      sub.classList.remove('is-open');
      t.setAttribute('aria-expanded', 'false');
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(close, CLOSE_DELAY);
    }

    // Only enable hover-to-open on devices with a real cursor.
    // On touch devices the synthetic mouseenter+click sequence used to fight
    // the click toggle, making the menu need two taps to open and impossible
    // to close from the toggle. (matchMedia is checked at attach time AND
    // re-checked inside the handlers so a hybrid device that switches modes
    // still behaves correctly.)
    var hoverMQ = window.matchMedia
      ? window.matchMedia('(hover: hover) and (pointer: fine)')
      : null;
    function canHover() {
      return hoverMQ ? hoverMQ.matches : true;
    }

    parent.addEventListener('mouseenter', function () { if (canHover()) open(); });
    parent.addEventListener('mouseleave', function () { if (canHover()) scheduleClose(); });
    sub.addEventListener('mouseenter', function () {
      if (!canHover()) return;
      clearTimeout(closeTimer);
      closeTimer = null;
    });
    sub.addEventListener('mouseleave', function () { if (canHover()) scheduleClose(); });

    // Click / tap toggle — primary interaction on touch, also works on
    // desktop for keyboard / a11y users. We listen for both pointerdown
    // (immediate, for touch) and click as a fallback. To prevent both
    // firing on the same tap we mark a short "just handled" window.
    var lastToggleAt = 0;
    function toggleMenu(e) {
      var now = Date.now();
      if (now - lastToggleAt < 350) return; // de-dupe pointer + click
      lastToggleAt = now;
      e.preventDefault();
      e.stopPropagation();
      if (sub.classList.contains('is-open')) {
        close();
      } else {
        open();
      }
    }
    t.addEventListener('click', toggleMenu);

    // Keyboard
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); t.focus(); }
    });

    // Reposition on scroll/resize while open
    window.addEventListener('scroll', function () {
      if (sub.classList.contains('is-open')) position();
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (sub.classList.contains('is-open')) position();
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__has-sub') && !sub.contains(e.target)) {
        close();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  });
})();
