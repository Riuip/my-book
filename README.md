# WYQ 专属博客

苹果官网风的极简个人博客。**主页 = 个人介绍**，文章使用独立的模板页。

- ✅ 大字 Hero「WYQ 专属博客」
- ✅ 暗 / 亮主题切换（自动跟随系统，记忆偏好）
- ✅ 主页：个人介绍 + 个人资料（更新：一周一更 / 联络：wyq200707@qq.com）+ 跳转博客按钮
- ✅ 文章详情页模板（苹果风排版）
- ✅ 完全静态，零依赖，零构建

## 文件结构

```
my-book/
├── index.html              # 主页（介绍 + 跳转博客按钮）
├── post-template.html      # 文章详情页模板（苹果风）
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

## 写一篇新文章

```bash
cp post-template.html post-001.html
```

打开 `post-001.html` 修改：

| 位置 | 改成 |
|---|---|
| `<title>` | `你的文章标题 — WYQ 专属博客` |
| `.article-hero__tag` | 分类（如：生活 / 思考 / 旅行 / 技术） |
| `.article-hero__title` | 文章标题 |
| `.article-hero__meta` | 日期 / 阅读时长 |
| `<article class="article">` | 正文内容 |

**正文支持的元素：**
`p` / `p.lead`（大字引言）/ `h2` / `h3` / `ul` / `ol` / `blockquote` / `code` / `pre` / `a` / `hr`

写好后想让别人能从主页找到，把 `index.html` 里 "查看文章" 按钮的 `href` 改成 `post-001.html` 即可。

## 本地预览

```bash
python3 -m http.server 8000
```
