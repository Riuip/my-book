# WYQ 专属博客

苹果官网风格的个人博客。**主页 = 个人介绍**，博客文章在独立的 `/blog.html`。

- ✅ Apple 风视觉（SF 字体栈、毛玻璃顶栏、巨型 Hero、圆角 Tile、柔和阴影）
- ✅ 暗 / 亮主题切换（自动跟随系统，记忆偏好）
- ✅ 文章搜索 + 分类筛选（生活 / 思考 / 旅行 / 技术）
- ✅ Apple 风文章详情页模板
- ✅ RSS 订阅 (`rss.xml`)
- ✅ 评论系统（Giscus，可选启用）
- ✅ 完全静态，零依赖，零构建

## 文件结构

```
my-book/
├── index.html              # 主页（个人介绍 + Tiles + 跳转博客按钮）
├── blog.html               # 博客列表（搜索 + 分类筛选）
├── post-welcome.html       # 第一篇文章「欢迎访问我的博客」
├── post-template.html      # 文章模板，复制后改名即可
├── rss.xml                 # RSS 订阅源
├── assets/
│   ├── css/style.css
│   └── js/main.js
├── .nojekyll
└── README.md
```

## 部署到 GitHub Pages（免费）

仓库 **Settings → Pages** → Source 选 `Deploy from a branch` →
Branch 选 `main` + `/ (root)` → Save，等 1–2 分钟后访问：
**https://riuip.github.io/my-book/**

## 写新文章（3 步）

### ① 复制模板

```bash
cp post-template.html post-xxx.html
```

修改 `post-xxx.html` 里：
- `<title>`、`article-hero__title`、`article-hero__tag`、`article-hero__meta`
- `<article class="article">` 内的正文（支持 `p`/`p.lead`/`h2`/`h3`/`ul`/`blockquote`/`code`/`pre`/`a`/`hr`）

### ② 在 `blog.html` 加一张卡片

打开 `blog.html`，在 `.posts` 内加：

```html
<a class="post-card reveal" data-category="life"
   data-title="文章标题"
   data-excerpt="文章摘要……"
   href="post-xxx.html">
  <span class="post-card__tag">生活</span>
  <h3 class="post-card__title">文章标题</h3>
  <p class="post-card__excerpt">文章摘要……</p>
  <div class="post-card__meta">
    <span>2026 · 05 · 22</span>
    <span class="dot"></span>
    <span>3 分钟阅读</span>
  </div>
</a>
```

`data-category` 可选：`life` / `thoughts` / `travel` / `tech`。
`data-title` 与 `data-excerpt` 用于搜索匹配。

### ③ 在 `rss.xml` 加一条

把 `rss.xml` 注释里的 `<item>` 模板复制到第一条 item 上方，填好。

---

## 启用 Giscus 评论（可选）

1. **仓库 Settings → General → Features → 勾选 Discussions**
2. 安装 GitHub App: <https://github.com/apps/giscus>
3. 打开 <https://giscus.app>，按表单配置（Repository 填 `Riuip/my-book`），它会输出 4 个 ID
4. 编辑 `assets/js/main.js`，找到 `GISCUS` 配置块：
   - `enabled` 改成 `true`
   - 填入 `repoId` 和 `categoryId`
5. 推送即可，所有文章页底部出现评论区，自动跟随明暗主题

## 本地预览

```bash
python3 -m http.server 8000
# 或
npx serve .
```
