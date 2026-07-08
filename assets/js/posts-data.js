/* =========================================================
   WYQ 专属博客 — Single Source of Truth for posts
   被 search.js / extras.js / archive.html 共享
   日期降序排列 (最新在前)
   ========================================================= */
(function () {
  'use strict';

  var POSTS = [
    {
      num: '07',
      title: '99% 必考知识点汇总 1',
      desc: '机械基础复习知识点汇总：力学基础与传动计算、轴的分类与应用、常用应力公式、单剪与双剪区分。',
      url: 'post-007.html',
      ogImage: 'assets/og/default.svg',
      date: '2026-07-08',
      cat: '技术',
      catKey: 'tech',
      tags: ['机械基础', '复习', '公式'],
      body: '机械基础复习知识点汇总：力学基础与传动计算、变形与材料属性、齿轮分度圆与中心距公式、轴的分类、正应力、剪应力、线应变、单剪与双剪区分。'
    },
    {
      num: '06',
      title: 'AI 提示词收藏: 4 套实用 Prompt 模板',
      desc: '持续更新的 AI 提示词收藏。包含：元提示词工程师、全能中文助理、论文科普、论文降重 4 套完整模板。',
      url: 'post-006.html',
      ogImage: 'assets/og/post-006.svg',
      date: '2026-05-15',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '提示词', '工具'],
      body: 'AI 提示词收藏，包含多套实用 Prompt 模板。'
    },
    {
      num: '05',
      title: '如何去除 AI 味: 完美 = 不完美',
      desc: '一篇关于如何让 AI 写出更自然文字的思考。核心观点：接受不完美才是完美。附完整提示词模板。',
      url: 'post-005.html',
      ogImage: 'assets/og/post-005.svg',
      date: '2026-05-15',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '写作', '思考'],
      body: '关于如何让 AI 写出更自然文字的思考。'
    },
    {
      num: '04',
      title: 'AI 大模型能力测试: 21 道数学与专业题实测',
      desc: '一份专门用来测试 AI 大模型推理能力的题集, 涵盖组合几何、数列、解析几何、逻辑推理、工程类等 21 道题。',
      url: 'post-004.html',
      ogImage: 'assets/og/post-004.svg',
      date: '2026-05-15',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '测评', '数学'],
      body: 'AI 大模型推理能力测试题集。'
    },
    {
      num: '03',
      title: 'Web-Omni: 我做了一个 17 合 1 的浏览器插件',
      desc: 'Web-Omni 是我做的一个 Chrome 浏览器插件, 把 17 个常用工具集成在一起。本文讲讲它的功能、架构和实现思路。',
      url: 'post-003.html',
      ogImage: 'assets/og/post-003.svg',
      date: '2026-05-15',
      cat: '技术',
      catKey: 'tech',
      tags: ['浏览器插件', '开源', 'Manifest V3'],
      body: 'Web-Omni 浏览器插件功能、架构和实现思路。'
    },
    {
      num: '02',
      title: '胃寒怎么办: 日常调理与食疗建议',
      desc: '关于胃寒的日常调理建议: 饮食、起居、运动, 以及几个简单的食疗小方。',
      url: 'post-002.html',
      ogImage: 'assets/og/post-002.svg',
      date: '2026-05-15',
      cat: '生活',
      catKey: 'life',
      tags: ['养生', '食疗', '健康'],
      body: '胃寒的日常调理建议。'
    },
    {
      num: '01',
      title: '欢迎 & 这个博客是怎么搭出来的',
      desc: 'WYQ 专属博客的第一篇文章 —— 介绍这个博客, 并附上一份从零搭建静态个人博客的详细教程。',
      url: 'post-001.html',
      ogImage: 'assets/og/post-001.svg',
      date: '2026-05-15',
      cat: '起步',
      catKey: 'meta',
      tags: ['博客', 'GitHub Pages', '教程'],
      body: '介绍博客并记录静态个人博客的搭建过程。'
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

  function getNeighbors(url) {
    var i = findIndexByUrl(url);
    if (i < 0) return { prev: null, next: null };
    return {
      prev: POSTS[i + 1] || null,
      next: POSTS[i - 1] || null
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
      var hay = (p.title + ' ' + p.desc + ' ' + p.cat + ' ' + (p.tags || []).join(' ') + ' ' + (p.body || '')).toLowerCase();
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
