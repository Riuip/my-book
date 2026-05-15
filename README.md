# Maison · 个人札记

> 一份奢华、安静、低饱和的个人博客。深黑底色 + 香槟金点缀 + 衬线优雅排版。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deploy-c9a961)](#部署到-github-pages)

## 设计

- **配色**：Obsidian (`#0b0b0d`) · Champagne Gold (`#c9a961`) · Ivory (`#f4efe6`)
- **字体**：Playfair Display（衬线）+ Cormorant Garamond（斜体）+ Inter（正文）
- **风格**：大量留白、金色细线点缀、首字母下沉、滚动渐入动画
- **完全静态**：纯 HTML/CSS/JS，无构建步骤，无依赖

## 文件结构

```
my-book/
├── index.html              # 首页（Hero + 文章列表 + 引言）
├── about.html              # 关于页
├── post-kyoto.html         # 文章 · 在京都的清晨
├── post-pen.html           # 文章 · 关于一只旧钢笔的记忆
├── post-solitude.html      # 文章 · 论独处的奢侈
├── assets/
│   ├── css/style.css       # 全部样式
│   └── js/main.js          # 滚动渐入与导航交互
└── .nojekyll               # 关闭 GitHub Pages 的 Jekyll 处理
```

## 部署到 GitHub Pages

1. 仓库已在 GitHub 上：[Riuip/my-book](https://github.com/Riuip/my-book)
2. 进入仓库 **Settings → Pages**
3. **Source** 选择 `Deploy from a branch`
4. **Branch** 选择 `main`，目录选择 `/ (root)`，点击 **Save**
5. 等待 1–2 分钟，访问地址：

   ```
   https://riuip.github.io/my-book/
   ```

## 本地预览

任意一种方式即可：

```bash
# Python
python3 -m http.server 8000

# 或 Node
npx serve .
```

然后访问 <http://localhost:8000>。

## 写新文章

复制任意一篇 `post-*.html`，修改：

1. `<title>` 与文章标题
2. 文章日期、分类、阅读时长
3. 正文（`.article__body` 内）

然后在 `index.html` 的 `.posts` 区域，加一张新的 `<article class="post-card">` 卡片并指向新文件即可。

---

© Crafted with patience & taste.
