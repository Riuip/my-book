# Liquid Glass 光学层

视觉参考：[WXperia/liquid-glass-vue](https://github.com/WXperia/liquid-glass-vue)，检视版本 `73b4d6a4414b2d2a6e72bba7e67a8313e35db480`。实现是独立的原生 JavaScript/CSS，没有复制 Vue 组件、位移图片或 shader。

## 材质分工

- 正文、列表及工具编辑区使用清晰的浅色/深色卡片，不挂光学装饰，不做背景模糊。
- 导航、按钮和浮层才使用光学层。导航拆为独立 WYQ 圆形主页按钮与紧凑胶囊；布局容器本身不挂光学层。子控件共享玻璃底，选中/展开项有清楚的状态；高光与圆角边缘在 Safari 也存在。
- 普通首页使用安静的浅珍珠色/深墨色背景、清晰中性标题，减弱大面积高光，让透明边缘和悬浮层次更突出；生日主题保留独立背景。按压轻微横向展开、纵向压缩后回弹，触控区域至少 44px。
- Safari、iOS UA 和 Firefox 使用 CSS 模糊、透色、反光和触控弹性。它们不启用 SVG 位移，也不被声称具有原生 iOS 26 的背景折射。
- Chromium 在装饰层的 `backdrop-filter` 中运行 SVG 位移，随后轻微模糊和饱和；正文不经过滤镜。v1 的普通 `filter` 会处理着色层本身，本轮移除了它及造成灰底的三通道 screen 合成。

## 生命周期与回退

Canvas 按真实圆角尺寸生成 8–24px 的边缘位移图，中央保持中性。缓存含真实几何尺寸，最多 16 份；最多 4 个精细指针或 2 个粗指针可见 SVG 滤镜。嵌套控件不重复模糊，正文每秒时钟文本更新不会触发光学重建。

弹簧使用独立 translate / scale，不覆盖组件原有 transform。pointercancel、失焦、后台及偏好变化均复位；节点移除时清理装饰、观察器与样式，重新挂载不会重复。

减少动态效果时停用弹簧与程序平滑滚动；降低透明度/提高对比度时使用实色，强制颜色/打印移除装饰。天气、DNA 和 Markdown 导出图内部不插入光学层。

资源版本：`liquid-glass.css?v=2`、`liquid-optics.css?v=4`、`liquid-optics.js?v=3`、`search.js?v=6`；缓存为 `wyq-v12-2026-09-12-compact-glass`。同步更新 HTML 与 `sw.js`，禁止只改资源内容而遗漏版本。

优先验收页面、操作步骤和验证边界见 [iPhone Safari / Chromium 验收清单](iphone-glass-checklist.md)。模拟测试不代表真机像素或性能验收。
