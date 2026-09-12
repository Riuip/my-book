  <!-- edition-home-start -->
  <main id="main-content" tabindex="-1">
    <header class="ed-cover">
      <canvas class="birthday-fireworks" id="birthdayFireworks" aria-hidden="true"></canvas>
      <div class="ed-wrap">
        <div class="ed-cover-top"><span><b>WYQ /</b> A PERSONAL JOURNAL</span><span>EST. 2026　·　保持好奇</span></div>
        <div class="ed-hero" id="defaultHero" aria-hidden="false">
          <div class="ed-hero-copy">
            <p class="ed-kicker"><span>●</span> LIFE, THOUGHTS & LITTLE EXPERIMENTS</p>
            <h1>保持好奇，<br><em>慢慢记录。</em></h1>
            <p class="ed-hero-english">Notes on living & making.</p>
            <p class="ed-hero-lead">你好，我是 WYQ。<br>把生活里的小发现、脑海中的想法，<br>还有那些忍不住动手的实验，留在这里。</p>
            <div class="ed-hero-actions"><a class="btn btn--primary" href="#journal">翻开这本日常　↘</a><a class="ed-text-link" href="#studio">去实验室走走 <span>↗</span></a></div>
          </div>
          <figure class="ed-art" aria-label="可切换形态的线条观测装置">
            <span class="ed-art-label ed-art-label--top">OBJECT / 001</span><span class="ed-art-label ed-art-label--right">CURIOSITY IN MOTION</span>
            <svg class="ed-orbit" id="edOrbit" viewBox="0 0 520 520" role="img" aria-label="由细线构成的环流雕塑">
              <defs><linearGradient id="edOrbitInk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--ed-orbit-light)"/><stop offset=".5" style="stop-color:var(--ed-orbit)"/><stop offset="1" style="stop-color:var(--ed-orange)"/></linearGradient></defs>
              <g class="ed-art-grid"><circle cx="260" cy="260" r="220"/><circle cx="260" cy="260" r="192" stroke-dasharray="1 10"/><path d="M32 260h26m404 0h26M260 32v26m0 404v26M85 85l12 12m326 326 12 12M85 435l12-12M423 97l12-12"/></g>
              <g id="edOrbitLines" fill="none" stroke="url(#edOrbitInk)" stroke-width="1.1">{{orbit}}</g>
              <circle cx="459" cy="354" r="5" fill="var(--ed-orange)"/>
            </svg>
            <span class="ed-art-stamp" aria-hidden="true">好奇<br>未完</span>
            <figcaption class="ed-art-caption"><p><strong id="edOrbitName" aria-live="polite">01 / 环流</strong>轻触箭头，换一种形态</p><button class="btn btn--ghost ed-orbit-next" id="edOrbitNext" type="button" aria-label="切换观察图形">↗</button></figcaption>
          </figure>
        </div>
        {{birthday}}
        <div class="ed-colophon"><p><span class="ed-status-dot"></span>此刻，留一点时间给自己。</p><p><span data-post-count>8</span> 篇记录 / 6 个小实验</p><a href="#journal">继续往下 <span>↓</span></a></div>
      </div>
    </header>

    <section class="ed-section ed-wrap" id="journal" aria-labelledby="journal-title">
      <div class="ed-section-head"><div><p class="ed-kicker"><span>01</span> THE JOURNAL</p><h2 id="journal-title">最近，写下这些。</h2></div><a class="ed-text-link" href="archive.html">全部文章 <span>↗</span></a></div>
      <div class="ed-reading-grid">
        <a class="ed-feature" id="edFeatured" href="post-008.html">
          <div class="ed-feature-image"><img src="assets/images/meiah-imax-screen-illustration.png" alt="IMAX 影厅示意图" width="1672" height="941" loading="lazy"><small>影厅示意图</small></div>
          <div class="ed-feature-copy"><div class="ed-feature-meta"><span>最近一篇 / 影视</span><span>2026.08.02</span></div><h3>广州白云美亚 IMAX：<br>影厅与选座指南</h3><p>一块大银幕，一次认真挑选的位置。记录影厅配置，也聊聊怎样选一个舒服的座位。</p><div class="ed-feature-tail"><span>阅读这篇记录</span><b aria-hidden="true">↗</b></div></div>
        </a>
        <div class="ed-note-stack" id="edNotes">
          <a class="ed-note" href="post-007.html"><div class="ed-note-meta"><span>N° 07 / 学习笔记</span><span>2026.07.08</span></div><h3>99% 必考知识点汇总 1</h3><p>把机械基础的力学、传动、轴与应力公式，整理成一份可以反复翻阅的复习笔记。</p><div class="ed-note-tail"><span>机械基础 · 复习 · 公式</span><span aria-hidden="true">↗</span></div></a>
          <a class="ed-note" href="post-006.html"><div class="ed-note-meta"><span>N° 06 / 技术与工具</span><span>2026.05.15</span></div><h3>AI 提示词收藏：<br>4 套实用 Prompt 模板</h3><p>从中文助理到论文科普，把用得顺手的提示词留下来，慢慢补全自己的工具箱。</p><div class="ed-note-tail"><span>AI · 提示词 · 工具</span><span aria-hidden="true">↗</span></div></a>
        </div>
      </div>
    </section>

    <section class="ed-section ed-studio-section" id="studio" aria-labelledby="studio-title">
      <div class="ed-wrap">
        <div class="ed-section-head"><div><p class="ed-kicker"><span>02</span> THE LITTLE STUDIO</p><h2 id="studio-title">让想法，动起来。</h2></div><p class="ed-studio-lead">一些出于好奇做出来的小工具。<br>挑一个，留几分钟给动手尝试的快乐。</p></div>
        <div class="ed-tool-grid">
          <a class="ed-tool-card" href="gradient.html"><div class="ed-tool-art ed-tool-art--gradient" aria-hidden="true"><small>01 / COLOUR</small></div><div class="ed-tool-caption"><h3>渐变实验室</h3><span aria-hidden="true">↗</span></div><p>调一组颜色，带走一段 CSS。</p></a>
          <a class="ed-tool-card" href="pomodoro.html"><div class="ed-tool-art ed-tool-art--focus" aria-hidden="true"><small>02 / FOCUS</small><div class="ed-mini-dial">25:00</div></div><div class="ed-tool-caption"><h3>极简番茄钟</h3><span aria-hidden="true">↗</span></div><p>接下来的 25 分钟，只做一件事。</p></a>
          <a class="ed-tool-card" href="md-card.html"><div class="ed-tool-art ed-tool-art--card" aria-hidden="true"><small>03 / WORDS</small><div class="ed-mini-page">Aa<i></i><i></i><i></i></div></div><div class="ed-tool-caption"><h3>Markdown 卡片</h3><span aria-hidden="true">↗</span></div><p>给一段文字，找一个好看的容器。</p></a>
          <a class="ed-tool-card" href="lab.html"><div class="ed-tool-art ed-tool-art--weather" aria-hidden="true"><small>04 / OUTSIDE</small><div class="ed-mini-weather"><span></span>24°</div></div><div class="ed-tool-caption"><h3>天气卡片</h3><span aria-hidden="true">↗</span></div><p>看看天气，再决定今天怎么走。</p></a>
          <a class="ed-tool-card" href="dna.html"><div class="ed-tool-art ed-tool-art--dna" aria-hidden="true"><small>05 / PATTERNS</small><div class="ed-mini-dna"><i style="--h:23px"></i><i style="--h:40px"></i><i style="--h:67px"></i><i style="--h:91px"></i><i style="--h:73px"></i><i style="--h:49px"></i><i style="--h:24px"></i><i style="--h:37px"></i><i style="--h:62px"></i><i style="--h:81px"></i></div></div><div class="ed-tool-caption"><h3>博客 DNA</h3><span aria-hidden="true">↗</span></div><p>从字里行间，认出写作的指纹。</p></a>
          <a class="ed-tool-card" href="others.html"><div class="ed-tool-art ed-tool-art--game" aria-hidden="true"><small>06 / PLAY</small><div class="ed-mini-game">+<b>··</b></div></div><div class="ed-tool-caption"><h3>马里奥世界</h3><span aria-hidden="true">↗</span></div><p>暂时放下正事，闯一小会儿关。</p></a>
        </div>
      </div>
    </section>

    <section class="ed-section ed-wrap ed-about" id="about" aria-labelledby="about-title">
      <div><p class="ed-kicker"><span>03</span> A NOTE FROM WYQ</p><h2 id="about-title">一个人的角落，<br>也欢迎你坐坐。</h2><p>我喜欢记录，也喜欢慢慢地把生活整理成可以被回头翻阅的样子。这里是我的私人空间，没有焦虑的算法，也没有刻意的曝光，只是把那些值得留下的瞬间安放在文字里。</p><div class="ed-about-links"><a class="ed-text-link" href="mailto:wyq200707@qq.com">写信给我 <span>↗</span></a><a class="ed-text-link" href="https://github.com/Riuip" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a><a class="ed-text-link" href="feed.xml">订阅 RSS <span>↗</span></a></div></div>
      <div><dl class="ed-desk"><div><dt>READING</dt><dd>《置身事内》<small>兰小欢 · 第二遍</small></dd></div><div><dt>MAKING</dt><dd><a href="post-006.html">AI 提示词收藏 ↗</a><small>持续更新 · 已收录 4 套模板</small></dd></div><div><dt>LISTENING</dt><dd>Wish You Were Here<small>Pink Floyd · 1975</small></dd></div></dl><p class="ed-desk-note"><span class="ed-status-dot"></span>你的此刻 <time id="edLocalTime">--:--</time>　/　不必着急。</p></div>
    </section>
  </main>
  <!-- edition-home-end -->
