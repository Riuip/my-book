/* =========================================================
   WYQ 专属博客 — Tags page renderer
   Reads from window.WYQ_POSTS and renders:
     - Tag cloud (with live counts; 0-count entries hidden)
     - Per-category article list (groups with 0 articles are skipped)
   Also wires up the "filter by category" interaction.
   ========================================================= */
(function () {
  'use strict';

  var POSTS = window.WYQ_POSTS || [];
  var cloudEl = document.getElementById('tagCloud');
  var listEl  = document.getElementById('tagsList');
  if (!cloudEl || !listEl) return;

  // Display order of categories (matches sidebar)
  var CATS = [
    { key: 'all',      label: '全部' },
    { key: 'life',     label: '生活' },
    { key: 'thoughts', label: '思考' },
    { key: 'travel',   label: '旅行' },
    { key: 'tech',     label: '技术' },
    { key: 'meta',     label: '起步' }
  ];

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Build counts
  var counts = { all: POSTS.length };
  POSTS.forEach(function (p) {
    counts[p.catKey] = (counts[p.catKey] || 0) + 1;
  });

  // Render tag cloud — skip 0-count categories (except "全部")
  var cloudHtml = '';
  CATS.forEach(function (c) {
    var n = counts[c.key] || 0;
    if (c.key !== 'all' && n === 0) return;
    var active = c.key === 'all' ? ' is-active' : '';
    cloudHtml += '<a class="tag-cloud__item' + active + '" data-tag="' + c.key + '" href="#' + c.key + '">' +
                 escHtml(c.label) +
                 '<span class="tag-cloud__count">' + n + '</span></a>';
  });
  cloudEl.innerHTML = cloudHtml;

  // Render per-category sections — skip empty.
  // NOTE: don't use the .reveal class here — main.js snapshots .reveal nodes
  // on initial load via IntersectionObserver, so dynamically-rendered
  // sections would never receive the .in class and stay invisible (opacity:0).
  var listHtml = '';
  CATS.forEach(function (c) {
    if (c.key === 'all') return;
    var posts = POSTS.filter(function (p) { return p.catKey === c.key; });
    if (!posts.length) return;
    listHtml +=
      '<section class="tags-section" data-cat="' + c.key + '">' +
        '<div class="tags-section__header">' +
          '<span class="tags-section__dot"></span>' +
          '<h2 class="tags-section__title">' + escHtml(c.label) + '</h2>' +
          '<span class="tags-section__count">' + posts.length + ' 篇文章</span>' +
        '</div>';
    posts.forEach(function (p) {
      listHtml +=
        '<a class="tags-article" href="' + escHtml(p.url) + '">' +
          '<span class="tags-article__num">N&deg; ' + escHtml(p.num) + '</span>' +
          '<span class="tags-article__title">' + escHtml(p.title) + '</span>' +
          '<span class="tags-article__date">' + escHtml(p.date.replace(/-/g, ' · ')) + '</span>' +
        '</a>';
    });
    listHtml += '</section>';
  });
  listEl.innerHTML = listHtml;

  // Wire up filter
  var tagItems = cloudEl.querySelectorAll('.tag-cloud__item');
  var sections = listEl.querySelectorAll('.tags-section');

  Array.prototype.forEach.call(tagItems, function (tag) {
    tag.addEventListener('click', function (e) {
      e.preventDefault();
      var cat = this.getAttribute('data-tag');

      Array.prototype.forEach.call(tagItems, function (t) { t.classList.remove('is-active'); });
      this.classList.add('is-active');

      Array.prototype.forEach.call(sections, function (sec) {
        if (cat === 'all' || sec.getAttribute('data-cat') === cat) {
          sec.style.display = '';
        } else {
          sec.style.display = 'none';
        }
      });

      // Update URL hash without scrolling
      try { history.replaceState(null, '', '#' + cat); } catch (e) {}
    });
  });

  // Honor hash on load (e.g. /tags.html#tech)
  var hash = (window.location.hash || '').replace('#', '');
  if (hash) {
    var found = cloudEl.querySelector('.tag-cloud__item[data-tag="' + hash + '"]');
    if (found) found.click();
  }
})();
