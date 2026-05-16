/* =========================================================
   WYQ 专属博客 — Homepage extras
   - "Now" line under hero (rotating one-liner)
   - "Desk view" row: 正在读 / 正在写 / 正在听
   - Featured-post hero card (auto from posts-data.js)
   - Mood groups linking to category filters
   - Footer easter-egg counters (posts / chars / days)
   Loaded ONLY on the homepage. Safe no-op if elements missing.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 0. Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }

  // main.js's IntersectionObserver only watches nodes present at first paint,
  // so we run our own for anything we mount dynamically.
  var _io = null;
  function observeReveal(nodes) {
    if (!nodes || !nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nodes, function (n) { n.classList.add('in'); });
      return;
    }
    if (!_io) {
      _io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            _io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    Array.prototype.forEach.call(nodes, function (n) { _io.observe(n); });
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (attrs[k] != null) node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  /* ---------- 1. "Now" rotating line ---------- */
  // Hand-curated. Picks one per visit (deterministic by day-of-year so the
  // same line shows up for the whole day — feels more like a real status
  // than a random refresh).
  var NOW_LINES = [
    '这周在重读《置身事内》, 顺手把博客的日期 bug 修了。',
    '在折腾一个浏览器插件, 顺便给自己的写作习惯也提个速。',
    '最近在研究怎么让 AI 写出更像人话的文字 —— 越完美越假。',
    '泡了一杯热茶, 在写一篇没什么主题但很想写的东西。',
    '把昨晚梦到的几句台词记下来了, 总觉得能用上。',
    '在听一段下雨的白噪音, 顺手整理几张旧照片。',
    '今天什么都不想做, 只想看看窗外的云。',
    '把博客侧边的图标重新画了一遍, 满意。',
    '学新东西最舒服的时刻 —— 看懂了, 但还没开始写代码。',
    '在想 “慢” 这个词。慢不是磨蹭, 是允许自己留白。'
  ];

  function pickNowLine() {
    var d = new Date();
    var doy = Math.floor(
      (d - new Date(d.getFullYear(), 0, 0)) / 86400000
    );
    return NOW_LINES[doy % NOW_LINES.length];
  }

  function mountNow() {
    var slot = $('#nowLine');
    if (!slot) return;
    slot.textContent = pickNowLine();
  }

  /* ---------- 2. Desk view (正在读 / 正在写 / 正在听) ---------- */
  // These are intentionally hand-edited. Update freely.
  var DESK_ITEMS = [
    {
      icon: '📖',
      label: '正在读',
      title: '《置身事内》',
      sub: '兰小欢 · 第二遍',
      href: null
    },
    {
      icon: '✍︎',
      label: '正在写',
      title: 'AI 提示词收藏',
      sub: '持续更新, 已 4 套模板',
      href: 'post-006.html'
    },
    {
      icon: '♪',
      label: '正在听',
      title: '《Wish You Were Here》',
      sub: 'Pink Floyd, 1975',
      href: null
    }
  ];

  function mountDesk() {
    var root = $('#deskRow');
    if (!root) return;
    DESK_ITEMS.forEach(function (item, i) {
      var card = el('div', {
        class: 'desk-card reveal',
        'data-delay': String((i % 4) + 1)
      }, [
        el('div', { class: 'desk-card__icon', text: item.icon }),
        el('div', { class: 'desk-card__label', text: item.label }),
        el('div', { class: 'desk-card__title', text: item.title }),
        el('div', { class: 'desk-card__sub', text: item.sub })
      ]);
      if (item.href) {
        var link = el('a', { class: 'desk-card__link', href: item.href, 'aria-label': item.label + ': ' + item.title });
        card.appendChild(link);
      }
      root.appendChild(card);
    });
    // Reveal them ourselves — main.js snapshots .reveal nodes at first paint.
    observeReveal(root.querySelectorAll('.reveal'));
  }

  /* ---------- 3. Featured post + mood groups ---------- */
  // catKey -> accent color (CSS variable token name). Falls back to brand blue.
  var CAT_ACCENT = {
    tech: { from: '#0071e3', to: '#2997ff', label: '技术' },
    life: { from: '#34c759', to: '#5ac8fa', label: '生活' },
    meta: { from: '#af52de', to: '#ff375f', label: '杂谈' }
  };

  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    if (p.length !== 3) return iso;
    return p[0] + ' 年 ' + parseInt(p[1], 10) + ' 月 ' + parseInt(p[2], 10) + ' 日';
  }

  function mountFeatured() {
    var slot = $('#featuredPost');
    if (!slot || !window.WYQ_POSTS || !window.WYQ_POSTS.length) return;

    var p = window.WYQ_POSTS[0]; // newest
    var accent = CAT_ACCENT[p.catKey] || CAT_ACCENT.tech;

    var card = el('a', {
      class: 'featured reveal',
      href: p.url,
      style: '--c-from:' + accent.from + ';--c-to:' + accent.to + ';'
    });

    // Backdrop layer (uses og image if available)
    var bg = el('div', { class: 'featured__bg' });
    if (p.ogImage) {
      bg.style.backgroundImage =
        "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55) 100%), url('" + p.ogImage + "')";
    }
    card.appendChild(bg);

    // Foreground
    var fg = el('div', { class: 'featured__fg' });
    fg.appendChild(el('div', { class: 'featured__eyebrow', text: '本周新文 · ' + accent.label }));
    fg.appendChild(el('h2', { class: 'featured__title', text: p.title }));
    fg.appendChild(el('p', { class: 'featured__desc', text: p.desc }));

    var meta = el('div', { class: 'featured__meta' });
    meta.appendChild(el('span', { class: 'featured__date', text: fmtDate(p.date) }));
    meta.appendChild(el('span', { class: 'featured__cta', text: '阅读全文 →' }));
    fg.appendChild(meta);

    card.appendChild(fg);
    slot.appendChild(card);
    observeReveal([card]);
  }

  // Mood groups — playful labels grouped by tag/cat
  var MOOD_GROUPS = [
    {
      key: 'late-night',
      icon: '🌙',
      title: '深夜想说的话',
      desc: '一些没头没尾的、随手记下的想法。',
      href: 'tags.html#meta',
      tint: '#5e5ce6'
    },
    {
      key: 'weekend',
      icon: '☕',
      title: '周末长文',
      desc: '泡杯茶慢慢看, 不赶时间的那种。',
      href: 'archive.html',
      tint: '#ff9500'
    },
    {
      key: 'tinker',
      icon: '🔧',
      title: '折腾笔记',
      desc: '工具、代码、AI、奇怪的小项目。',
      href: 'tags.html#tech',
      tint: '#0071e3'
    }
  ];

  function mountMoods() {
    var root = $('#moodGroups');
    if (!root) return;
    MOOD_GROUPS.forEach(function (m, i) {
      var node = el('a', {
        class: 'mood reveal',
        'data-delay': String((i % 4) + 1),
        href: m.href,
        style: '--mood-tint:' + m.tint
      }, [
        el('div', { class: 'mood__icon', text: m.icon }),
        el('div', { class: 'mood__body' }, [
          el('div', { class: 'mood__title', text: m.title }),
          el('div', { class: 'mood__desc', text: m.desc })
        ]),
        el('div', { class: 'mood__arrow', text: '→' })
      ]);
      root.appendChild(node);
    });
    observeReveal(root.querySelectorAll('.reveal'));
  }

  /* ---------- 4. Footer counters (easter egg) ---------- */
  function mountCounters() {
    var slot = $('#siteCounters');
    if (!slot || !window.WYQ_POSTS) return;
    var posts = window.WYQ_POSTS;
    var totalChars = 0;
    var oldest = null;
    posts.forEach(function (p) {
      totalChars += (p.body || '').length + (p.title || '').length + (p.desc || '').length;
      if (!oldest || p.date < oldest) oldest = p.date;
    });
    var days = 0;
    if (oldest) {
      var d0 = new Date(oldest);
      var d1 = new Date();
      days = Math.max(1, Math.round((d1 - d0) / 86400000));
    }
    // Round chars down to nearest 100 — feels honest, not over-precise.
    var roundedChars = Math.floor(totalChars / 100) * 100;
    slot.innerHTML =
      '已写 <b>' + posts.length + '</b> 篇 · ' +
      '约 <b>' + roundedChars.toLocaleString() + '</b> 字 · ' +
      '坚持了 <b>' + days + '</b> 天';
  }

  /* ---------- Boot ---------- */
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    mountNow();
    mountDesk();
    mountFeatured();
    mountMoods();
    mountCounters();
  });
})();
