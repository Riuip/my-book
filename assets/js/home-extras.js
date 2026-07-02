/* =========================================================
   WYQ 专属博客 — Homepage extras
   - Now line under hero
   - Desk view row
   - Featured-post card
   - Mood groups
   - Live time card
   - Footer counters
   Loaded ONLY on the homepage. Safe no-op if elements missing.
   ========================================================= */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }

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

  function pad(n) { return n < 10 ? '0' + n : String(n); }

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
    var doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    return NOW_LINES[doy % NOW_LINES.length];
  }

  function mountNow() {
    var slot = $('#nowLine');
    if (slot) slot.textContent = pickNowLine();
  }

  var DESK_ITEMS = [
    { icon: '📖', label: '正在读', title: '《置身事内》', sub: '兰小欢 · 第二遍', href: null },
    { icon: '✍︎', label: '正在写', title: 'AI 提示词收藏', sub: '持续更新, 已 4 套模板', href: 'post-006.html' },
    { icon: '♪', label: '正在听', title: '《Wish You Were Here》', sub: 'Pink Floyd, 1975', href: null }
  ];

  function mountDesk() {
    var root = $('#deskRow');
    if (!root || root.children.length) return;
    DESK_ITEMS.forEach(function (item, i) {
      var card = el('div', { class: 'desk-card reveal', 'data-delay': String((i % 4) + 1) }, [
        el('div', { class: 'desk-card__icon', text: item.icon }),
        el('div', { class: 'desk-card__label', text: item.label }),
        el('div', { class: 'desk-card__title', text: item.title }),
        el('div', { class: 'desk-card__sub', text: item.sub })
      ]);
      if (item.href) {
        card.appendChild(el('a', { class: 'desk-card__link', href: item.href, 'aria-label': item.label + ': ' + item.title }));
      }
      root.appendChild(card);
    });
    observeReveal(root.querySelectorAll('.reveal'));
  }

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
    if (!slot || slot.children.length || !window.WYQ_POSTS || !window.WYQ_POSTS.length) return;
    var p = window.WYQ_POSTS[0];
    var accent = CAT_ACCENT[p.catKey] || CAT_ACCENT.tech;
    var card = el('a', {
      class: 'featured reveal',
      href: p.url,
      style: '--c-from:' + accent.from + ';--c-to:' + accent.to + ';'
    });
    var bg = el('div', { class: 'featured__bg' });
    if (p.ogImage) {
      bg.style.backgroundImage = "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55) 100%), url('" + p.ogImage + "')";
    }
    var fg = el('div', { class: 'featured__fg' }, [
      el('div', { class: 'featured__eyebrow', text: '本周新文 · ' + accent.label }),
      el('h2', { class: 'featured__title', text: p.title }),
      el('p', { class: 'featured__desc', text: p.desc })
    ]);
    fg.appendChild(el('div', { class: 'featured__meta' }, [
      el('span', { class: 'featured__date', text: fmtDate(p.date) }),
      el('span', { class: 'featured__cta', text: '阅读全文 →' })
    ]));
    card.appendChild(bg);
    card.appendChild(fg);
    slot.appendChild(card);
    observeReveal([card]);
  }

  var MOOD_GROUPS = [
    { icon: '🌙', title: '深夜想说的话', desc: '一些没头没尾的、随手记下的想法。', href: 'tags.html#meta', tint: '#5e5ce6' },
    { icon: '☕', title: '周末长文', desc: '泡杯茶慢慢看, 不赶时间的那种。', href: 'archive.html', tint: '#ff9500' },
    { icon: '🔧', title: '折腾笔记', desc: '工具、代码、AI、奇怪的小项目。', href: 'tags.html#tech', tint: '#0071e3' }
  ];

  function mountMoods() {
    var root = $('#moodGroups');
    if (!root || root.children.length) return;
    MOOD_GROUPS.forEach(function (m, i) {
      root.appendChild(el('a', {
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
      ]));
    });
    observeReveal(root.querySelectorAll('.reveal'));
  }

  function injectTimeCardStyle() {
    if ($('#time-card-style')) return;
    var style = el('style', { id: 'time-card-style' });
    style.textContent = [
      '#liveTimeCard.tile--time{',
      '  --time-a:rgba(235,246,255,.86);',
      '  --time-b:rgba(255,255,255,.90);',
      '  --time-glow:rgba(0,113,227,.22);',
      '  --time-glow-2:rgba(191,90,242,.14);',
      '  --time-accent:#0071e3;',
      '  --time-accent-2:#ff3b30;',
      '  --time-text:#1d1d1f;',
      '  --time-muted:#7a7f8a;',
      '  position:relative;overflow:hidden;min-height:318px;display:flex;flex-direction:column;justify-content:space-between;',
      '  background:linear-gradient(135deg,var(--time-b),var(--time-a))!important;',
      '  transition:background .85s ease,color .45s ease,box-shadow .35s ease,transform .3s ease;',
      '}',
      '#liveTimeCard.tile--time::before{content:"";position:absolute;right:-84px;top:-98px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,var(--time-glow),var(--time-glow-2) 48%,transparent 70%);pointer-events:none;transition:background .85s ease,transform .85s ease;}',
      '#liveTimeCard.tile--time::after{content:"";position:absolute;left:42px;bottom:42px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,var(--time-glow),transparent 68%);opacity:.34;filter:blur(2px);pointer-events:none;transition:background .85s ease,opacity .85s ease,transform .85s ease;}',
      '#liveTimeCard.time--morning{--time-a:rgba(255,239,196,.88);--time-b:rgba(220,245,255,.92);--time-glow:rgba(255,188,85,.34);--time-glow-2:rgba(94,196,255,.18);--time-accent:#ff9f0a;--time-accent-2:#007aff;}',
      '#liveTimeCard.time--day{--time-a:rgba(215,238,255,.88);--time-b:rgba(255,255,255,.94);--time-glow:rgba(0,113,227,.23);--time-glow-2:rgba(90,200,250,.18);--time-accent:#0071e3;--time-accent-2:#ff3b30;}',
      '#liveTimeCard.time--evening{--time-a:rgba(244,220,255,.90);--time-b:rgba(255,232,207,.92);--time-glow:rgba(255,149,0,.30);--time-glow-2:rgba(191,90,242,.22);--time-accent:#bf5af2;--time-accent-2:#ff9500;}',
      '#liveTimeCard.time--night{--time-a:rgba(25,32,66,.94);--time-b:rgba(55,38,83,.92);--time-glow:rgba(105,130,255,.34);--time-glow-2:rgba(191,90,242,.22);--time-accent:#7aa7ff;--time-accent-2:#bf5af2;--time-text:#f5f5f7;--time-muted:#c3c8da;border-color:rgba(255,255,255,.12)!important;box-shadow:0 18px 48px rgba(32,30,70,.32)!important;}',
      '#liveTimeCard.time--night::after{opacity:.55;transform:translate(24px,-14px) scale(1.16);}',
      '#liveTimeCard.time--morning::before{transform:translate(-12px,10px) scale(1.06);}',
      '#liveTimeCard.time--evening::before{transform:translate(-20px,18px) scale(1.12);}',
      '#liveTimeCard .tile__eyebrow{color:var(--time-muted)!important;transition:color .45s ease;}',
      '.time-card__body{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:16px;margin-top:4px;text-align:center;}',
      '.time-clock{position:relative;width:138px;height:138px;border-radius:50%;background:rgba(255,255,255,.58);border:1px solid rgba(0,0,0,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.78),0 18px 42px rgba(0,0,0,.08);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:background .85s ease,border-color .45s ease,box-shadow .45s ease;}',
      '#liveTimeCard.time--night .time-clock{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 18px 42px rgba(0,0,0,.28);}',
      '.time-clock__ring{position:absolute;inset:10px;border-radius:50%;border:1px solid rgba(0,0,0,.06);transition:border-color .45s ease;}',
      '#liveTimeCard.time--night .time-clock__ring{border-color:rgba(255,255,255,.16);}',
      '.time-clock__tick{position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(29,29,31,.38);transition:background .45s ease;}',
      '#liveTimeCard.time--night .time-clock__tick{background:rgba(255,255,255,.58);}',
      '.time-clock__tick--12{top:15px;left:50%;transform:translateX(-50%);}',
      '.time-clock__tick--3{top:50%;right:15px;transform:translateY(-50%);}',
      '.time-clock__tick--6{bottom:15px;left:50%;transform:translateX(-50%);}',
      '.time-clock__tick--9{top:50%;left:15px;transform:translateY(-50%);}',
      '.time-clock__hand{position:absolute;left:50%;bottom:50%;border-radius:999px;transform-origin:50% 100%;transform:translateX(-50%) rotate(0deg);background:var(--time-text);box-shadow:0 2px 8px rgba(0,0,0,.16);transition:background .45s ease;}',
      '.time-clock__hand--hour{width:5px;height:35px;}',
      '.time-clock__hand--minute{width:3px;height:49px;background:var(--time-accent);}',
      '.time-clock__hand--second{width:2px;height:53px;background:var(--time-accent-2);}',
      '.time-clock__dot{position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;background:var(--time-accent);border:2px solid rgba(255,255,255,.92);transform:translate(-50%,-50%);box-shadow:0 3px 10px var(--time-glow);transition:background .45s ease,box-shadow .45s ease;}',
      '.time-card__digital{font-size:36px;line-height:1;font-weight:700;letter-spacing:-.04em;font-variant-numeric:tabular-nums;color:var(--time-text);transition:color .45s ease;}',
      '.time-card__date{margin-top:8px;font-size:13px;color:var(--time-muted);transition:color .45s ease;}',
      '.time-card__zone{display:inline-flex;align-items:center;gap:6px;margin-top:2px;padding:7px 12px;border-radius:999px;font-size:12px;color:var(--time-muted);background:color-mix(in srgb,var(--time-accent) 10%,transparent);border:1px solid color-mix(in srgb,var(--time-accent) 18%,transparent);transition:color .45s ease,background .45s ease,border-color .45s ease;}',
      '@media(max-width:720px){#liveTimeCard.tile--time{min-height:288px}.time-clock{width:126px;height:126px}.time-card__digital{font-size:32px}}',
      '[data-theme="dark"] #liveTimeCard:not(.time--night) .time-clock{background:rgba(30,32,38,.58);border-color:rgba(255,255,255,.10);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 18px 42px rgba(0,0,0,.28);}',
      '[data-theme="dark"] #liveTimeCard:not(.time--night) .time-clock__ring{border-color:rgba(255,255,255,.08);}',
      '[data-theme="dark"] #liveTimeCard:not(.time--night) .time-clock__tick{background:rgba(245,245,247,.45);}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function timeMood(hour) {
    if (hour >= 5 && hour < 11) return { key: 'morning', text: '清晨光线 · 实时更新' };
    if (hour >= 11 && hour < 17) return { key: 'day', text: '白天模式 · 实时更新' };
    if (hour >= 17 && hour < 21) return { key: 'evening', text: '傍晚暖光 · 实时更新' };
    return { key: 'night', text: '夜间星光 · 实时更新' };
  }

  function mountTimeCard() {
    var root = $('#about .tiles');
    if (!root || $('#liveTimeCard')) return;
    injectTimeCardStyle();

    var clock = el('div', { class: 'time-clock', 'aria-hidden': 'true' }, [
      el('span', { class: 'time-clock__ring' }),
      el('span', { class: 'time-clock__tick time-clock__tick--12' }),
      el('span', { class: 'time-clock__tick time-clock__tick--3' }),
      el('span', { class: 'time-clock__tick time-clock__tick--6' }),
      el('span', { class: 'time-clock__tick time-clock__tick--9' }),
      el('span', { class: 'time-clock__hand time-clock__hand--hour', id: 'timeClockHour' }),
      el('span', { class: 'time-clock__hand time-clock__hand--minute', id: 'timeClockMinute' }),
      el('span', { class: 'time-clock__hand time-clock__hand--second', id: 'timeClockSecond' }),
      el('span', { class: 'time-clock__dot' })
    ]);

    var zone = el('div', { id: 'timeCardZone', class: 'time-card__zone', text: '本地时间 · 实时更新' });
    var card = el('article', { id: 'liveTimeCard', class: 'tile tile--time reveal', 'data-delay': '2' }, [
      el('div', { class: 'tile__eyebrow', text: '现在时间' }),
      el('div', { class: 'time-card__body' }, [
        clock,
        el('div', { class: 'time-card__text' }, [
          el('div', { id: 'timeCardDigital', class: 'time-card__digital', text: '--:--:--' }),
          el('div', { id: 'timeCardDate', class: 'time-card__date', text: '正在读取本地时间' })
        ]),
        zone
      ])
    ]);

    var cta = root.querySelector('.tile--accent');
    if (cta) root.insertBefore(card, cta);
    else root.appendChild(card);
    observeReveal([card]);

    var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var hourHand = $('#timeClockHour');
    var minuteHand = $('#timeClockMinute');
    var secondHand = $('#timeClockSecond');
    var digital = $('#timeCardDigital');
    var dateLine = $('#timeCardDate');
    var zoneLine = $('#timeCardZone');
    var currentMood = '';

    function tick() {
      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();
      var s = now.getSeconds();
      var mood = timeMood(h);
      if (mood.key !== currentMood) {
        card.classList.remove('time--morning', 'time--day', 'time--evening', 'time--night');
        card.classList.add('time--' + mood.key);
        currentMood = mood.key;
      }
      if (zoneLine) zoneLine.textContent = mood.text;
      if (digital) digital.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
      if (dateLine) dateLine.textContent = now.getFullYear() + ' 年 ' + (now.getMonth() + 1) + ' 月 ' + now.getDate() + ' 日 · ' + week[now.getDay()];
      if (hourHand) hourHand.style.transform = 'translateX(-50%) rotate(' + ((h % 12) * 30 + m * 0.5) + 'deg)';
      if (minuteHand) minuteHand.style.transform = 'translateX(-50%) rotate(' + (m * 6 + s * 0.1) + 'deg)';
      if (secondHand) secondHand.style.transform = 'translateX(-50%) rotate(' + (s * 6) + 'deg)';
    }
    tick();
    window.setInterval(tick, 1000);
  }

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
      days = Math.max(1, Math.round((new Date() - new Date(oldest)) / 86400000));
    }
    slot.innerHTML = '已写 <b>' + posts.length + '</b> 篇 · 约 <b>' + (Math.floor(totalChars / 100) * 100).toLocaleString() + '</b> 字 · 坚持了 <b>' + days + '</b> 天';
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    mountNow();
    mountDesk();
    mountFeatured();
    mountMoods();
    mountTimeCard();
    mountCounters();
  });
})();
