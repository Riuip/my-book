> 当前界面已按用户反馈改为黑白简约风，详见 [设计说明](docs/minimal-design.md)。

# WYQ / Minimal

WYQ 的个人网站。黑白灰界面、清晰的大标题、内容图片与蓝色操作入口，记录生活与动手实验。

- 8 篇文章、归档、分类与全文搜索。
- 渐变、番茄钟、Markdown 卡片、天气、博客 DNA 和游戏入口。
- 深浅主题、手机布局、键盘导航、减少动态效果和材质回退。
- 纯静态页面；线上不依赖框架或构建服务。

## 维护界面

全站导航、页脚和首页模板在 `templates/`。修改后用 Node 同步 21 个页面：

```sh
node tools/build-shell.mjs
```

视觉规则在 `assets/css/edition.css`，最新文章与时钟由 `assets/js/edition.js` 维护。原有文章、工具脚本和导出主题保持独立。详情见 [设计与维护说明](docs/minimal-design.md)。

## 发布文章

复制 `post-template.html` 为新的文章文件（例如 `post-009.html`），更新标题、描述、分享元数据、日期、分类和正文。再把条目加入 `assets/js/posts-data.js` 的 `POSTS` 数组，保持日期倒序；归档、搜索、分类和首页最新文章会使用这份索引。

## 本地查看

```sh
python3 -m http.server 8000
```

浏览器打开首页，或打开 `tools/layout-review.html` 检查 320–1280 CSS 像素的布局。响应式预览不代表原生 iPhone Safari 验证。

## 部署与验证

GitHub Pages 从 `main` 的根目录发布：[线上网站](https://riuip.github.io/my-book/)。更改共享资源时同步 HTML 引用版本和 `sw.js` 缓存版本。

当前简约版只对顶栏使用 CSS 模糊，并提供实色回退；全站停用 SVG 折射和按钮弹性。

- [简约设计与验收](docs/minimal-design.md)
- [光学层说明](docs/liquid-optics.md)
- [iPhone / Chromium 简短验收清单](docs/iphone-glass-checklist.md)
