/* =========================================================
   WYQ 专属博客 — Search functionality
   - Desktop: animated expanding search box in nav
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
      var text = (post.title + ' ' + post.desc + ' ' + post.cat).toLowerCase();
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
      html += '<a class="search-result" href="' + r.url + '">';
      html += '<span class="search-result__cat">' + r.cat + '</span>';
      html += '<span class="search-result__title">' + highlightText(r.title, query) + '</span>';
      html += '<span class="search-result__desc">' + highlightText(r.desc, query) + '</span>';
      html += '<span class="search-result__date">' + r.date + '</span>';
      html += '</a>';
    }
    container.innerHTML = html;
  }

  function highlightText(text, query) {
    if (!query) return text;
    var keywords = query.trim().toLowerCase().split(/\s+/);
    var result = text;
    for (var i = 0; i < keywords.length; i++) {
      var kw = keywords[i];
      if (!kw) continue;
      var regex = new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    }
    return result;
  }

  /* ---------- Search Page logic ---------- */
  var pageInput = document.getElementById('searchPageInput');
  var pageResults = document.getElementById('searchPageResults');
  var pageClear = document.getElementById('searchPageClear');

  if (pageInput && pageResults) {
    // Read query from URL param
    var urlParams = new URLSearchParams(window.location.search);
    var initQuery = urlParams.get('q') || '';
    if (initQuery) {
      pageInput.value = initQuery;
      var initResults = searchPosts(initQuery);
      renderResults(initResults, pageResults, initQuery);
    }

    pageInput.addEventListener('input', function () {
      var q = pageInput.value;
      var results = searchPosts(q);
      renderResults(results, pageResults, q);
      toggleClear();
    });

    function toggleClear() {
      if (pageClear) {
        pageClear.style.display = pageInput.value ? 'flex' : 'none';
      }
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

  /* ---------- Desktop Nav Search (inline expanding) ---------- */
  var navSearchBtn = document.getElementById('navSearchBtn');
  var navSearchBox = document.getElementById('navSearchBox');
  var navSearchInput = document.getElementById('navSearchInput');
  var navSearchResults = document.getElementById('navSearchResults');
  var navSearchOverlay = document.getElementById('navSearchOverlay');

  if (navSearchBtn && navSearchBox) {
    // Check if mobile
    function isMobile() {
      return window.innerWidth <= 720;
    }

    navSearchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (isMobile()) {
        // Mobile: go to search page
        window.location.href = 'search.html';
        return;
      }
      // Desktop: toggle search box
      if (navSearchBox.classList.contains('is-open')) {
        closeNavSearch();
      } else {
        openNavSearch();
      }
    });

    function openNavSearch() {
      navSearchBox.classList.add('is-open');
      if (navSearchOverlay) navSearchOverlay.classList.add('is-open');
      document.body.classList.add('search-open');
      setTimeout(function () {
        if (navSearchInput) navSearchInput.focus();
      }, 200);
    }

    function closeNavSearch() {
      navSearchBox.classList.remove('is-open');
      if (navSearchOverlay) navSearchOverlay.classList.remove('is-open');
      document.body.classList.remove('search-open');
      if (navSearchInput) navSearchInput.value = '';
      if (navSearchResults) navSearchResults.innerHTML = '';
    }

    if (navSearchOverlay) {
      navSearchOverlay.addEventListener('click', closeNavSearch);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navSearchBox.classList.contains('is-open')) {
        closeNavSearch();
      }
    });

    if (navSearchInput && navSearchResults) {
      navSearchInput.addEventListener('input', function () {
        var q = navSearchInput.value;
        var results = searchPosts(q);
        renderNavResults(results, navSearchResults, q);
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
      html += '<a class="nav-search__item" href="' + r.url + '">';
      html += '<span class="nav-search__item-title">' + highlightText(r.title, query) + '</span>';
      html += '<span class="nav-search__item-cat">' + r.cat + '</span>';
      html += '</a>';
    }
    container.innerHTML = html;
  }

  /* ---------- Expose searchPosts for potential reuse ---------- */
  window.__wyqSearch = searchPosts;

})();
