/* =========================================================
   WYQ 专属博客 — Single Source of Truth for posts
   被 search.js / extras.js / archive.html 共享
   日期降序排列 (最新在前)
   ========================================================= */
(function () {
  'use strict';

  var POSTS = [
    {
      num: '06',
      title: 'AI 提示词收藏: 4 套实用 Prompt 模板',
      desc: '持续更新的 AI 提示词收藏。包含：元提示词工程师、全能中文助理、论文科普、论文降重 4 套完整模板。',
      url: 'post-006.html',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '提示词', '工具']
    },
    {
      num: '05',
      title: '如何去除 AI 味: 完美 = 不完美',
      desc: '一篇关于如何让 AI 写出更自然文字的思考。核心观点：接受不完美才是完美。附完整提示词模板。',
      url: 'post-005.html',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '写作', '思考']
    },
    {
      num: '04',
      title: 'AI 大模型能力测试: 21 道数学与专业题实测',
      desc: '一份专门用来测试 AI 大模型推理能力的题集, 涵盖组合几何、数列、解析几何、逻辑推理、工程类等 21 道题。',
      url: 'post-004.html',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '测评', '数学']
    },
    {
      num: '03',
      title: 'Web-Omni: 我做了一个 17 合 1 的浏览器插件',
      desc: 'Web-Omni 是我做的一个 Chrome 浏览器插件, 把 17 个常用工具集成在一起。本文讲讲它的功能、架构和实现思路。',
      url: 'post-003.html',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['浏览器插件', '开源', 'Manifest V3']
    },
    {
      num: '02',
      title: '胃寒怎么办: 日常调理与食疗建议',
      desc: '关于胃寒的日常调理建议: 饮食、起居、运动, 以及几个简单的食疗小方。',
      url: 'post-002.html',
      date: '2026-05-22',
      cat: '生活',
      catKey: 'life',
      tags: ['养生', '食疗', '健康']
    },
    {
      num: '01',
      title: '欢迎 & 这个博客是怎么搭出来的',
      desc: 'WYQ 专属博客的第一篇文章 —— 介绍这个博客, 并附上一份从零搭建静态个人博客的详细教程。',
      url: 'post-001.html',
      date: '2026-05-15',
      cat: '起步',
      catKey: 'meta',
      tags: ['博客', 'GitHub Pages', '教程']
    }
  ];

  /* ---------- Helpers ---------- */
  function currentFile() {
    var f = (window.location.pathname.split('/').pop() || '').toLowerCase();
    return f || 'index.html';
  }

  function findIndexByUrl(url) {
    var u = (url || currentFile()).toLowerCase();
    for (var i = 0; i < POSTS.length; i++) {
      if (POSTS[i].url.toLowerCase() === u) return i;
    }
    return -1;
  }

  // POSTS is sorted newest-first.
  // "Next post" (in chronological reading order) = the OLDER one we wrote afterwards…
  // Convention used by existing pages: post-001 → next: post-002 (older→newer publish order
  // is reversed across the site; 001 is actually the FIRST published).
  // Looking at content: post-001 is 2026-05-15 (oldest), the existing footer on
  // post-001 links to post-002 as "下一篇" → so "next" means newer-in-time.
  // In our newest-first array: newer post is at lower index, older at higher index.
  function getNeighbors(url) {
    var i = findIndexByUrl(url);
    if (i < 0) return { prev: null, next: null };
    // prev = older (later in array), next = newer (earlier in array)
    return {
      prev: POSTS[i + 1] || null, // older
      next: POSTS[i - 1] || null  // newer
    };
  }

  function getRelated(url, max) {
    max = max || 3;
    var i = findIndexByUrl(url);
    if (i < 0) return [];
    var cur = POSTS[i];
    var sameCat = [];
    var others = [];
    for (var k = 0; k < POSTS.length; k++) {
      if (k === i) continue;
      if (POSTS[k].catKey === cur.catKey) sameCat.push(POSTS[k]);
      else others.push(POSTS[k]);
    }
    var combined = sameCat.concat(others);
    return combined.slice(0, max);
  }

  function searchPosts(query) {
    if (!query || !query.trim()) return [];
    var q = query.trim().toLowerCase();
    var keywords = q.split(/\s+/);
    var results = [];
    for (var i = 0; i < POSTS.length; i++) {
      var p = POSTS[i];
      var hay = (p.title + ' ' + p.desc + ' ' + p.cat + ' ' + (p.tags || []).join(' ')).toLowerCase();
      var match = true;
      for (var k = 0; k < keywords.length; k++) {
        if (hay.indexOf(keywords[k]) === -1) { match = false; break; }
      }
      if (match) results.push(p);
    }
    return results;
  }

  /* ---------- Expose ---------- */
  window.WYQ_POSTS = POSTS;
  window.WYQ_POSTS_API = {
    currentFile: currentFile,
    findIndexByUrl: findIndexByUrl,
    getNeighbors: getNeighbors,
    getRelated: getRelated,
    searchPosts: searchPosts
  };
})();
