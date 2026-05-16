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
      ogImage: 'assets/og/post-006.svg',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '提示词', '工具'],
      body: "这里收集了我日常使用的、经过验证有效的 AI 提示词模板。每个模板都可以直接复制粘贴到对应的 AI 工具中使用。点击标题展开查看完整内容。 持续更新中 — 有好用的新 Prompt 会不断补充进来。 1. 元提示词工程师 (Alpha-Prompt) 用 AI 来帮你生成更好的提示词。它会以专家顾问的角色，通过对话引导你一步步构建出高质量的 Prompt。 适用场景 ：当你不知道怎么写提示词、或者想把一个粗糙的想法升级为专业级 Prompt 时使用。 点击展开完整提示词 <System_Instruction> <Core_Identity> 你不再只是通用AI助手，你的身份是【元提示词工程师 Alpha-Prompt】。你是世界顶级的提示词工程专家与架构师，你的交互风格兼具【专家的严谨】与【顾问的灵动】。你的核心使命不是执行僵硬的流程，而是通过富有启发性的对话，与用户共同创作出兼具艺术感与工程美的提示词。 </Core_Identity> <Prime_Directive> 你的首要原则是【对话的艺术，而非僵硬的流程】。你必须避免模板化的、可预测的提问，更要杜绝自说自话的独白。你的每一次交互，都应是真诚的双向沟通。你的价值体现在，你能否像一位真正的专家那样，通过灵活的沟通，激发用户的灵感，并共同将构想塑造为杰作。 </Prime_Directive> <Operating_Protocol> <Mental_Model> <Phase>Diagnosis and Inquiry</Phase> <Phase>Collaborative Construction</Phase> <Phase>Final Generation and Explanation</Phase> </Mental_Model> <Final_Deliverable> 在流程的最后，你必须交付【设计"
    },
    {
      num: '05',
      title: '如何去除 AI 味: 完美 = 不完美',
      desc: '一篇关于如何让 AI 写出更自然文字的思考。核心观点：接受不完美才是完美。附完整提示词模板。',
      url: 'post-005.html',
      ogImage: 'assets/og/post-005.svg',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '写作', '思考'],
      body: "先说结论： 完美 = 不完美，接受不完美才是完美。 本文整理自 linux.do 社区帖子 ，经编辑后转载于此，方便自己查看与分享。 问题：为什么 AI 生成的文字总是\"AI 味\"太浓？ 一直以来，我们给 AI 的提示词都是让它扮演\"某某领域多年经验的专家\"，给一大堆 guideline、专业术语、期望生成的样式。在专业领域或许有用，但对于 AI 写作来说，大部分人都遇到过这个问题 — 生成的文字\"赛博\"\"量子\"味太浓，说不清楚哪里不对，就是不像人写的。 造成\"AI 味\"的几个原因 训练激励机制偏差 — AI 训练时为了讨好人类评分者。人类常用的平实词汇，AI 的训练分数不高；反而是那些\"高大上\"的、不常见的词，评分者更容易认为表现好。久而久之，AI 越来越偏爱输出那些华丽但不自然的词。 \"完成任务\"心态 — AI 训练的目的是帮助人类快速高效地完成任务。但文学创作的本质讲究起承转合、节奏、伏笔。即使加了一堆限制条件，AI 生成的文章仍然有一种\"想赶紧交差\"的感觉，平铺直叙居多。 缺少事件感 — 太多修饰性描写，太少\"正在发生\"的东西。读起来像散文而不像故事。 核心思路：不要让 AI 扮演完美的角色 所谓\"AI 味太浓\"，本质上是不是就是 过于追求完美 — 完美到不像人写出来的？ 没有一个大作家像 AI 一样什么都懂、记忆力超群、有丰富的数据库。人都是有缺点的。过于完美，本身就是错的。 “不完美，才像人。” 顺着这个思路，我尝试了一种完全不同的提示词策略 — 不让 AI 扮演专家，而是让它扮演一个 不太会写小说的普通人 。 提示词演进过程 第一版 问题 ：AI 改成了第一人称叙事，违背了第三人称叙事的原则。 第二版（修正视角） 效果 ：文笔自然了很多，还是完全由 AI 生成（未人工干预），已经比之前好不少。 最终总结的完整提示词模板 1. 核心写作心态 2. 节奏控制指令 "
    },
    {
      num: '04',
      title: 'AI 大模型能力测试: 21 道数学与专业题实测',
      desc: '一份专门用来测试 AI 大模型推理能力的题集, 涵盖组合几何、数列、解析几何、逻辑推理、工程类等 21 道题。',
      url: 'post-004.html',
      ogImage: 'assets/og/post-004.svg',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['AI', '测评', '数学'],
      body: "这是我整理的一份 AI 大模型推理能力测试题集 ，共 21 道题，涵盖组合几何、数列、解析几何、逻辑推理、布尔代数、物理、单片机等多个领域。这些题目专门用来检验 AI 模型在数学推理、逻辑判断和专业知识方面的真实水平。 “一个模型能不能真正‘思考’，看它做题就知道了。” 关于这份题集 这份题集的设计初衷是： 用不能靠记忆和模板解决的题目，测试 AI 模型的深层推理能力 。 覆盖面广 ：从纯数学（组合、几何、数论）到工程应用（单片机定时器、SVM、LED 段码） 难度不低 ：大部分是竞赛级或大学专业课级别 答案明确 ：每道题都有唯一确定的答案，方便判断对错 防止死记 ：许多题需要多步推理，不是简单的知识检索能解决的 你可以拿这份题去测试任何大模型（ChatGPT、Claude、Gemini、DeepSeek 等），看看它们各自能答对几道。 完整题目与答案 下面是全部 21 道题。每题标注了题型和标准答案。 # 题型 题目 答案 1 组合几何 求具有如下性质的最小正整数 n：将正 n 边形的每一个顶点任意染上红、黄、蓝三种颜色之一，那么这 n 个顶点中一定存在四个同色点，它们是一个等腰梯形的顶点。 17 2 组合几何 在面积为 1 的矩形 ABCD 中（包括边界）有 5 个点，其中任意三点不共线。求以这 5 个点为顶点的所有三角形中，面积不大于 1/4 的三角形的个数的最小值。 2 3 排列组合 将 6 个数 2, 0, 1, 9, 20, 19 按任意次序排成一行，拼成一个 8 位数（首位不为 0），则产生的不同的 8 位数的个数为？ 498 4 数列 设实数列 {x_n} 满足：x_0=0, x_2=√[3]{2}·x_1, x_3 是正整数，且 x_{n+1} = (1/√[3]{4})x_n + √[3]{4}x_{n-1} + (1/2)x_{n-2} (n≥2)。问"
    },
    {
      num: '03',
      title: 'Web-Omni: 我做了一个 17 合 1 的浏览器插件',
      desc: 'Web-Omni 是我做的一个 Chrome 浏览器插件, 把 17 个常用工具集成在一起。本文讲讲它的功能、架构和实现思路。',
      url: 'post-003.html',
      ogImage: 'assets/og/post-003.svg',
      date: '2026-05-29',
      cat: '技术',
      catKey: 'tech',
      tags: ['浏览器插件', '开源', 'Manifest V3'],
      body: "这一篇, 我想跟你聊聊我自己做的一个开源项目 — Web-Omni (网页全能王) 。 它是一个浏览器扩展, 把 17 个我自己最常用的“网页小工具”都揉到了同一个插件里。 下面是它的功能、架构, 以及实现过程中我踩过的一些坑。 一、它是个什么 简单说, 就是一个 Chrome 浏览器扩展。装上以后, 你的浏览器会多出一组以前需要装十几个插件、 或者完全没人做的功能。Manifest V3, 体积不大, 没有任何远程后端, 不收集任何数据 — 所有计算都在你自己的浏览器里发生。 名字 : Web-Omni (网页全能王) 当前版本 : v1.1 (插件 manifest 内为 4.0.0) 开源协议 : GitHub 仓库开源 下载 : github.com/Riuip/web-Omni-/releases “不为做一个完美的产品, 只为把自己最常重复的操作, 变成一次安装。” 二、它能做什么 — 17 个内置功能 Web-Omni 由一个 后台 + 17 个独立的 content script 组成。 每个脚本对应一个“功能模块”, 互相不依赖, 想用哪个就用哪个。 1. 视觉控制类 visual-dictator — 自定义页面字号、字体、行高、颜色 immersive-modding — 沉浸阅读模式, 一键去除花花绿绿的干扰 sticky-killer — 一键清除粘性导航条、悬浮广告、回到顶部按钮 element-pip — 把页面任意元素“摘下来”做成画中画悬浮窗 2. 数据与自动化 data-harvester — 一键抓取页面表格 / 列表为 CSV / JSON automation-geek — 录制和回放点击, 用于重复性操作 ecommerce-scraper — 电商页商品信息提取 price-comparator — 多平台价格比较 dom-mo"
    },
    {
      num: '02',
      title: '胃寒怎么办: 日常调理与食疗建议',
      desc: '关于胃寒的日常调理建议: 饮食、起居、运动, 以及几个简单的食疗小方。',
      url: 'post-002.html',
      ogImage: 'assets/og/post-002.svg',
      date: '2026-05-22',
      cat: '生活',
      catKey: 'life',
      tags: ['养生', '食疗', '健康'],
      body: "天气一凉, 胃寒的人就会有体会 — 喝口冷饮像一道凉风穿过胃, 吃完一阵就胀胀的, 早上起床还会有点反酸。 这一篇, 我把自己这些年摸索出来的 日常调理小方法 整理一下, 希望对同样被胃寒困扰的你, 有那么一点点用。 温馨提示: 这篇文章是日常生活经验分享, 不能替代医生的诊断和处方 。 如果你的症状很严重、持续超过两周、或伴随消瘦、便血、呕血、剧烈腹痛等情况, 请及时去正规医院就诊, 听医生的话。 一、先认识一下“胃寒” “胃寒”是中医里的概念, 通俗地说, 就是脾胃的“火力”有点弱, 处理冷的、生的、油腻的东西会比较吃力。它不是某种具体的疾病, 更像是一种身体“偏冷”的状态。 常见的不舒服感觉 大多数胃寒的人, 会有以下一种或几种体感: 稍微吃一点凉的、喝一口冰水, 胃马上就不舒服 胃口一般, 吃一点点就饱, 饱了还胀 胃里隐隐作痛, 用热水袋捂一捂会舒服很多 早上起床容易反酸、嗳气 大便偏稀、不成形, 容易拉肚子 手脚冷, 怕冷, 舌头偏白偏淡 如果上面这些你中了一半以上, 那你大概率确实是“胃偏寒”的体质, 可以从下面几个方面慢慢调。 “胃寒不是一两天形成的, 它需要的不是‘治’, 而是‘养’。” 二、饮食上, 记住四个字: 温、熟、软、慢 1. 温 — 戒掉所有冷的 这是最重要的一条, 也是最难做到的一条。 不喝 冰水、冰可乐、冰奶茶、冰咖啡, 哪怕是夏天 不吃 刚从冰箱拿出来的水果、酸奶, 至少放回常温再吃 水尽量喝 温水 或者 热水 , 早上起床第一杯尤其重要 夏天尽量不吃冰激凌、冷面、冷沙拉 冷饮对胃寒的人, 就像往一台快烧完的小火炉里浇凉水 — 火苗会一下子矮下去, 之后要花很久才能再旺起来。 2. 熟 — 少生冷, 多熟食 蔬菜尽量做熟了再吃, 凉拌菜少吃 水果如果实在想吃, 选温性的: 苹果、桂圆、樱桃、葡萄 少吃: 西瓜、梨、柿子、火龙果、香瓜 — "
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
      body: "你好, 欢迎来到 WYQ 专属博客 。 这是这里的第一篇文章 — 我会先介绍这个博客本身, 然后把 从零开始搭建这种静态个人博客的全部步骤 详细写下来, 让任何对编程一无所知的朋友, 也能照着做出一个属于自己的、免费、可全球访问的网站。 一、关于这个博客 这个博客是我的个人空间, 不为流量, 不为变现, 只为留下一些可以回头翻阅的文字。 它的设计灵感来自苹果官网 — 大字标题、毛玻璃顶栏、圆角卡片、柔和阴影, 以及那种\"留白即奢侈\"的克制感。 它有哪些功能 苹果官网风的视觉语言 — SF 字体栈、`#0071e3` 主蓝、巨型 Hero 标题。 暗 / 亮主题切换 — 自动跟随系统, 也可以点右上角图标手动切换, 选择会被记住。 主页只放介绍 — Hero、关于我、个人资料、跳转文章按钮, 不在首页堆文章。 独立的文章详情页 — 苹果风排版, 引言段加大、二级标题清晰、引用块带蓝色侧边线。 完全静态 — 没有数据库, 没有后端, 没有构建步骤, 一份 HTML 改完就能上线。 它用了哪些\"技术\" 只有最朴素的三样东西: HTML / CSS / JavaScript 。 没有 React, 没有 Vue, 没有 Next.js, 也没有 Tailwind。 托管在 GitHub Pages , 永久免费、自带 HTTPS、全球加速。 “最适合你的工具, 是你能完全掌控的那个。” 二、搭建教程: 从零到上线 下面这份教程, 假设你 从未写过代码 。我会把每一步都说清楚。 从注册账号到博客上线, 大约需要 30 分钟 。 你需要的东西 一台能上网的电脑（Windows / Mac / Linux 都行） 一个邮箱（用来注册 GitHub 账号） 一颗愿意慢慢来的心 第 1 步: 注册一个 GitHub 账号 github.com/signup 用邮箱注册一个账号。 记下你的 用"
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
