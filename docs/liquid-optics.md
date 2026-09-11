# Liquid Glass 光学层

效果参考：[WXperia/liquid-glass-vue](https://github.com/WXperia/liquid-glass-vue)，检视版本 `73b4d6a4414b2d2a6e72bba7e67a8313e35db480`（1.0.9）。该项目的 package.json 标注 MIT；本次为原生 JavaScript/CSS 独立实现，没有复制或打包其 Vue 组件、位移图片或 shader 文件。

## 实现

- `assets/js/liquid-optics.js` 为现有元素增加不可交互、对辅助技术隐藏的装饰层，不包裹、移动或修改正文内容。
- Canvas 根据每个圆角矩形的实际宽高生成法线位移图；中央保持中性，只在 8–24px 的边缘区域折射。RGB 三个通道采用略有不同的位移强度，形成轻微色散。
- Chromium 中 SVG filter 仅用于背景层。装饰层裁切在圆角内，内容文本及图标不经滤镜。
- Safari、iOS 浏览器和 Firefox 使用 CSS 背景模糊、随交互变化的反光、双色光学边缘及相同的触控弹性。它们不被标记为支持 SVG 背景折射；CSS 语法支持检查不足以证明完整渲染支持。
- 控件用独立 translate / scale 属性驱动有限时长的弹簧，不覆盖导航、弹窗、入场动画已有的 transform；pointercancel、失焦和后台切换均释放按压状态。
- 仅在尺寸改变时生成位移图，最多保留 16 份缓存；同时启用最多 6 个桌面或 3 个粗指针设备的可见滤镜。嵌套控件共享父玻璃背景，避免重复模糊。
- IntersectionObserver / ResizeObserver 管理可见性和尺寸；MutationObserver 接入动态文章、搜索结果和菜单，并回收移除的元素。
- 天气卡、博客 DNA 和 Markdown 导出内容不插入光学层，保留可导出图像的背景与配色；其外围操作控件仍应用新材质。
- 减少动态效果时停用弹簧，降低透明度/提高对比度时使用实色；强制色彩及打印模式移除装饰层。

## 检查范围

检查脚本语法、CSS 解析与选择器、全站资源引用、位移图数值及事件生命周期。
这不等同于浏览器视觉验收，也不代表已在真实 iPhone 上验证折射效果。
