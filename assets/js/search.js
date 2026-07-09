/* =========================================================
   WYQ 专属博客 — Search functionality
   - Desktop: fixed floating search panel in nav
   - Mobile: redirect to dedicated search page
   - Full-text search across post titles, descriptions, tags
   ========================================================= */
(function () {
  'use strict';

  function injectNavSearchFix() {
    var old = document.getElementById('wyq-nav-search-fix');
    if (old) old.remove();

    var style = document.createElement('style');
    style.id = 'wyq-nav-search-fix';
    style.textContent = [
      'html body .nav-search__overlay#navSearchOverlay{',
      '  display:none!important;position:fixed!important;inset:0!important;',
      '  z-index:10040!important;background:rgba(0,0,0,.25)!important;',
      '  backdrop-filter:blur(6px)!important;-webkit-backdrop-filter:blur(6px)!important;',
      '}',
      'html body.search-open .nav-search__overlay#navSearchOverlay,html body .nav-search__overlay#navSearchOverlay.is-open{display:block!important;}',
      'html body .nav-search#navSearchBox{',
      '  display:none!important;position:fixed!important;top:84px!important;right:24px!important;left:auto!important;bottom:auto!important;',
      '  z-index:10050!important;width:min(420px,calc(100vw - 48px))!important;max-width:calc(100vw - 48px)!important;',
      '  padding:18px!important;border-radius:24px!important;border:1px solid var(--line)!important;',
      '  background:color-mix(in srgb,var(--bg-elev) 92%,transparent)!important;',
      '  box-shadow:var(--shadow-lg)!important;backdrop-filter:blur(28px) saturate(160%)!important;-webkit-backdrop-filter:blur(28px) saturate(160%)!important;',
      '  isolation:isolate!important;overflow:hidden!important;color:var(--text)!important;',
      '}',
      'html body.search-open .nav-search#navSearchBox,html body .nav-search#navSearchBox.is-open{display:block!important;}',
      'html body .nav-search#navSearchBox .nav-search__inner{display:flex!important;align-items:center!important;gap:10px!important;position:relative!important;z-index:2!important;}',
      'html body .nav-search#navSearchBox .nav-search__input{width:100%!important;border:1px solid var(--line)!important;border-radius:14px!important;background:var(--bg-tint)!important;color:var(--text)!important;font:inherit!important;padding:11px 12px!important;outline:none!important;}',
      'html body .nav-search#navSearchBox .nav-search__results{margin-top:14px!important;max-height:320px!important;overflow:auto!important;color:var(--text-muted)!important;font-size:14px!important;position:relative!important;z-index:2!important;}',
      'html body .nav-search#navSearchBox .nav-search__hint,html body .nav-search#navSearchBox .nav-search__empty{text-align:center!important;padding:18px 8px!important;color:var(--text-muted)!important;}',
      'html body .nav-search#navSearchBox .nav-search__item{display:block!important;padding:12px 10px!important;border-radius:14px!important;color:var(--text)!important;text-decoration:none!important;background:transparent!important;}',
      'html body .nav-search#navSearchBox .nav-search__item:hover{background:var(--accent-soft)!important;color:var(--text)!important;}',
      'html body .nav-search#navSearchBox .nav-search__item-title{display:block!important;font-weight:600!important;margin-bottom:4px!important;}',
      'html body .nav-search#navSearchBox .nav-search__item-snippet,html body .nav-search#navSearchBox .nav-search__item-cat{display:block!important;color:var(--text-muted)!important;font-size:12px!important;}',
      '@media(max-width:720px){html body .nav-search#navSearchBox{top:76px!important;right:12px!important;width:calc(100vw - 24px)!important;max-width:calc(100vw - 24px)!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  injectNavSearchFix();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavSearchFix);
  }
  setTimeout(injectNavSearchFix, 160);
  setTimeout(injectNavSearchFix, 720);
  setTimeout(injectNavSearchFix, 1400);

  /* ---------- Posts index — use shared data source if present ---------- */
  var POSTS = window.WYQ_POSTS || [];

  /* ---------- Search function ---------- */
  function searchPosts(query) {
    if (window.WYQ_POSTS_API && typeof window.WYQ_POSTS_API.searchPosts === 'function') {
      return window.WYQ_POSTS_API.searchPosts(query);
    }
    if (!query || !query.trim()) return [];
    var q = query.trim().toLowerCase();
    var keywords = q.split(/\s+/);
    var results = [];
    for (var i = 0; i < POSTS.length; i++) {
      var post = POSTS[i];
      var text = (post.title + ' ' + post.desc + ' ' + post.cat + ' ' + (post.tags || []).join(' ') + ' ' + (post.body || '')).toLowerCase();
      var match = true;
      for (var k = 0; k < keywords.length; k++) {
        if (text.indexOf(keywords[k]) === -1) {
          match = false;
          break;
        }
      }
      if (match) results.push(post);
    }
    return results;
  }

  /* ---------- Body snippet around first matched keyword ---------- */
  function bodySnippet(body, query, len) {
    if (!body || !query) return '';
    len = len || 90;
    var keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var lower = body.toLowerCase();
    var hitAt = -1;
    for (var i = 0; i < keywords.length; i++) {
      var idx = lower.indexOf(keywords[i]);
      if (idx !== -1) { hitAt = idx; break; }
    }
    if (hitAt === -1) return body.slice(0, len) + (body.length > len ? '…' : '');
    var start = Math.max(0, hitAt - Math.floor(len / 3));
    var end = Math.min(body.length, start + len);
    var prefix = start > 0 ? '…' : '';
    var suffix = end < body.length ? '…' : '';
    return prefix + body.slice(start, end) + suffix;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightText(text, query) {
    if (!query) return text;
    var keywords = query.trim().toLowerCase().split(/\s+/);
    var result = text;
    for (var i = 0; i < keywords.length; i++) {
      var kw = keywords[i];
      if (!kw) continue;
      var regex = new RegExp('(' + escapeRegExp(kw) + ')', 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    }
    return result;
  }

  /* ---------- Render results ---------- */
  function renderResults(results, container, query) {
    if (!container) return;
    if (!query || !query.trim()) {
      container.innerHTML = '<p class="search-page__hint">输入关键词开始搜索所有文章</p>';
      return;
    }
    if (results.length === 0) {
      container.innerHTML = '<p class="search-page__empty">没有找到相关文章 😢</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var snippet = r.body ? bodySnippet(r.body, query, 100) : '';
      html += '<a class="search-result" href="' + r.url + '">';
      html += '<span class="search-result__cat">' + r.cat + '</span>';
      html += '<span class="search-result__title">' + highlightText(r.title, query) + '</span>';
      html += '<span class="search-result__desc">' + highlightText(r.desc, query) + '</span>';
      if (snippet) html += '<span class="search-result__snippet">' + highlightText(snippet, query) + '</span>';
      html += '<span class="search-result__date">' + r.date + '</span>';
      html += '</a>';
    }
    container.innerHTML = html;
  }

  /* ---------- Search Page logic ---------- */
  var pageInput = document.getElementById('searchPageInput');
  var pageResults = document.getElementById('searchPageResults');
  var pageClear = document.getElementById('searchPageClear');

  if (pageInput && pageResults) {
    var urlParams = new URLSearchParams(window.location.search);
    var initQuery = urlParams.get('q') || '';
    if (initQuery) {
      pageInput.value = initQuery;
      renderResults(searchPosts(initQuery), pageResults, initQuery);
    }

    pageInput.addEventListener('input', function () {
      var q = pageInput.value;
      renderResults(searchPosts(q), pageResults, q);
      toggleClear();
    });

    function toggleClear() {
      if (pageClear) pageClear.style.display = pageInput.value ? 'flex' : 'none';
    }
    toggleClear();

    if (pageClear) {
      pageClear.addEventListener('click', function () {
        pageInput.value = '';
        renderResults([], pageResults, '');
        toggleClear();
        pageInput.focus();
      });
    }
  }

  /* ---------- Desktop Nav Search ---------- */
  var navSearchBtn = document.getElementById('navSearchBtn');
  var navSearchBox = document.getElementById('navSearchBox');
  var navSearchInput = document.getElementById('navSearchInput');
  var navSearchResults = document.getElementById('navSearchResults');
  var navSearchOverlay = document.getElementById('navSearchOverlay');

  if (navSearchBtn && navSearchBox) {
    function isMobile() { return window.innerWidth <= 720; }

    navSearchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (isMobile()) {
        window.location.href = 'search.html';
        return;
      }
      if (navSearchBox.classList.contains('is-open')) closeNavSearch();
      else openNavSearch();
    });

    function openNavSearch() {
      injectNavSearchFix();
      navSearchBox.classList.add('is-open');
      if (navSearchOverlay) navSearchOverlay.classList.add('is-open');
      document.body.classList.add('search-open');
      setTimeout(function () { if (navSearchInput) navSearchInput.focus(); }, 160);
    }

    function closeNavSearch() {
      navSearchBox.classList.remove('is-open');
      if (navSearchOverlay) navSearchOverlay.classList.remove('is-open');
      document.body.classList.remove('search-open');
      if (navSearchInput) navSearchInput.value = '';
      if (navSearchResults) navSearchResults.innerHTML = '<p class="nav-search__hint">输入关键词搜索文章...</p>';
    }

    if (navSearchOverlay) navSearchOverlay.addEventListener('click', closeNavSearch);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navSearchBox.classList.contains('is-open')) closeNavSearch();
    });

    if (navSearchInput && navSearchResults) {
      navSearchInput.addEventListener('input', function () {
        var q = navSearchInput.value;
        renderNavResults(searchPosts(q), navSearchResults, q);
      });
    }
  }

  function renderNavResults(results, container, query) {
    if (!container) return;
    if (!query || !query.trim()) {
      container.innerHTML = '<p class="nav-search__hint">输入关键词搜索文章...</p>';
      return;
    }
    if (results.length === 0) {
      container.innerHTML = '<p class="nav-search__empty">没有找到相关文章</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var snippet = r.body ? bodySnippet(r.body, query, 70) : '';
      html += '<a class="nav-search__item" href="' + r.url + '">';
      html += '<span class="nav-search__item-title">' + highlightText(r.title, query) + '</span>';
      if (snippet) html += '<span class="nav-search__item-snippet">' + highlightText(snippet, query) + '</span>';
      html += '<span class="nav-search__item-cat">' + r.cat + '</span>';
      html += '</a>';
    }
    container.innerHTML = html;
  }

  window.__wyqSearch = searchPosts;
})();
