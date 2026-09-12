/* =========================================================
   WYQ 专属博客 — Search functionality
   - Desktop: fixed floating search panel in nav
   - Mobile: redirect to dedicated search page
   - Full-text search across post titles, descriptions, tags
   ========================================================= */
(function () {
  'use strict';

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

  if (navSearchBtn && !navSearchBox) {
    navSearchBtn.addEventListener('click', function () { window.location.href = 'search.html'; });
  }
  if (navSearchBtn && navSearchBox) {
    navSearchBtn.setAttribute('aria-expanded', 'false');
    navSearchBtn.setAttribute('aria-controls', navSearchBox.id);
    navSearchBox.setAttribute('aria-hidden', 'true');
    navSearchBox.setAttribute('aria-modal', 'true');
    navSearchBox.inert = true;
    var focusTimer, inertBackground = [];
    var closeButton = document.createElement('button');
    closeButton.type = 'button'; closeButton.className = 'nav-search__close';
    closeButton.setAttribute('aria-label', '关闭搜索'); closeButton.textContent = '×';
    navSearchBox.querySelector('.nav-search__inner').appendChild(closeButton);
    closeButton.addEventListener('click', closeNavSearch);
    // An iPhone in landscape must still use the full search page.
    function isMobile() { return window.innerWidth <= 720 || matchMedia('(pointer: coarse)').matches; }
    function positionSearch() {
      if (!navSearchBox.classList.contains('is-open')) return;
      if (isMobile()) { closeNavSearch(); return; }
      var viewport = window.visualViewport;
      var top = viewport ? viewport.offsetTop : 0;
      var height = viewport ? viewport.height : innerHeight;
      var nav = document.querySelector('.nav');
      var preferred = nav ? nav.getBoundingClientRect().bottom + 12 : top + 84;
      var panelTop = Math.max(top + 12, Math.min(preferred, top + height - 180));
      navSearchBox.style.top = panelTop + 'px';
      navSearchBox.style.maxHeight = Math.max(80, top + height - panelTop - 12) + 'px';
    }
    window.addEventListener('resize', positionSearch, { passive:true });
    if (window.visualViewport) {
      visualViewport.addEventListener('resize', positionSearch, { passive:true });
      visualViewport.addEventListener('scroll', positionSearch, { passive:true });
    }

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
      clearTimeout(focusTimer);
      navSearchBox.inert = false;
      inertBackground = Array.from(document.body.children).filter(function (node) {
        return node !== navSearchBox && node !== navSearchOverlay && !node.inert;
      });
      inertBackground.forEach(function (node) { node.inert = true; });
      navSearchBox.classList.add('is-open');
      navSearchBtn.setAttribute('aria-expanded', 'true');
      navSearchBox.setAttribute('aria-hidden', 'false');
      if (navSearchOverlay) navSearchOverlay.classList.add('is-open');
      document.body.classList.add('search-open');
      positionSearch();
      focusTimer = setTimeout(function () { if (navSearchInput && !navSearchBox.inert) navSearchInput.focus(); }, 160);
    }

    function closeNavSearch() {
      clearTimeout(focusTimer);
      navSearchBox.inert = true;
      inertBackground.forEach(function (node) { node.inert = false; });
      inertBackground = [];
      navSearchBox.classList.remove('is-open');
      navSearchBtn.setAttribute('aria-expanded', 'false');
      navSearchBox.setAttribute('aria-hidden', 'true');
      navSearchBtn.focus();
      if (navSearchOverlay) navSearchOverlay.classList.remove('is-open');
      document.body.classList.remove('search-open');
      if (navSearchInput) navSearchInput.value = '';
      if (navSearchResults) navSearchResults.innerHTML = '<p class="nav-search__hint">输入关键词搜索文章...</p>';
    }

    navSearchBox.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      var focusable = Array.from(navSearchBox.querySelectorAll('input,button,a[href]')).filter(function (node) { return !node.disabled; });
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
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
