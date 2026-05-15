# WYQ 专属博客

苹果官网风格的个人博客 · 暗/亮主题切换 · 文章分类筛选 · 完全静态。

## 设计

- **风格**：Apple 官网灵感（大字标题、毛玻璃顶栏、圆角卡片、柔和阴影、SF 字体栈）
- **主题**：浅色 / 深色两套，自动跟随系统，可手动切换并记忆偏好
- **筛选**：全部 / 生活 / 思考 / 旅行 / 技术
- **零依赖**：纯 HTML / CSS / JS，无构建步骤

## 文件结构

```
my-book/
├── index.html              # 首页（Hero「WYQ专属博客」+ 分类筛选 + 文章网格）
├── about.html              # 关于页
├── assets/
│   ├── css/style.css       # 主题变量 + 全部样式
│   └── js/main.js          # 主题切换 / 筛选 / 滚动渐入
├── .nojekyll               # 关闭 Jekyll 处理
└── README.md
```

## 部署到 GitHub Pages（免费）

1. 仓库 **Settings → Pages**
2. **Source** 选 `Deploy from a branch`
3. **Branch** 选 `main`，目录 `/ (root)`，**Save**
4. 1–2 分钟后访问：`https://riuip.github.io/my-book/`

## 本地预览

```bash
python3 -m http.server 8000
# 或
npx serve .
```

## 写新文章

1. 复制任何一个文章页作为模板（或新建一个 `post-xxx.html`）。
2. 打开 `index.html`，找到 `POST CARD TEMPLATE` 注释，复制下面的代码块到 `.posts` 内：

```html
<a class="post-card reveal" data-category="life" href="post-xxx.html">
  <span class="post-card__tag">生活</span>
  <h3 class="post-card__title">文章标题</h3>
  <p class="post-card__excerpt">摘要……</p>
  <div class="post-card__meta">
    <span>2026 · 05 · 15</span>
    <span class="dot"></span>
    <span>3 分钟阅读</span>
  </div>
</a>
```

3. `data-category` 可选值：`life` / `thoughts` / `travel` / `tech`。
4. 删除 `<div class="empty" data-empty>...</div>` 即可（或不删，有文章时它会自动隐藏）。
