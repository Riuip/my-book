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

## Liquid Glass 共享材质

所有 21 个 HTML 页面在页面布局样式之后加载 `assets/css/liquid-glass.css`。
卡片、控件、浮层、嵌套面板分别使用统一的透明度、边缘反光与阴影；新卡片组件应加入该文件的对应选择器组。

- 玻璃材质只由 CSS 管理；`main.js` 负责主题、菜单、导航隐藏和入场交互。
- `home-extras.js` 的时钟布局已移入 `style.css`，保留按时间变化的配色。
- 支持深浅主题、系统主题跟随、键盘焦点、减少动态效果、降低透明度和无背景模糊时的实色回退。
- 天气导出卡保持浅色读数；Markdown 导出主题、渐变预览及色板保留各自内容颜色。
- 新版本静态资源和 Service Worker 一起更新，避免旧缓存继续注入旧样式。
- 页面转场使用原生 CSS 渐进增强，普通导航、页内锚点、下载及组合键点击仍交给浏览器。

## 光学折射与弹性升级

`liquid-optics.css` / `liquid-optics.js` 在共享材质上增加独立背景折射、色散边缘、交互反光和触摸回弹。
采用原生实现，继续支持 GitHub Pages 的零构建部署。Safari / Firefox 保留 CSS 光学层，完整 SVG 背景折射只在 Chromium 路径启用。
实现边界、性能预算及参考项目见 [光学层说明](docs/liquid-optics.md)。

光学层仅用于导航、按钮和浮层，正文卡片保持清晰。详见 [材质实现](docs/liquid-optics.md) 和 [iPhone / Chromium 验收清单](docs/iphone-glass-checklist.md)。
