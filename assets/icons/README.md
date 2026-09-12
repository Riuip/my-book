# PWA / Apple Touch Icons

4 个 PNG 图标已随仓库提交；源设计在 `tools/image-generator.html` 的 `makeIconSVG` 中。Apple 图标使用完整不透明底色，由 iOS 裁切圆角；字标留有安全边距。

## 已提供文件

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `icon-192.png` | 192×192 | PWA standard |
| `icon-512.png` | 512×512 | PWA standard |
| `icon-maskable-512.png` | 512×512 | PWA maskable (Android adaptive icon) |
| `apple-touch-icon.png` | 180×180 | iOS Safari 加到主屏幕 |

## 生成步骤

1. 本地启一个静态服务器: `python3 -m http.server 8080` (在仓库根目录运行)
2. 浏览器打开 <http://localhost:8080/tools/image-generator.html>
3. 点 "下载所有图标 (PNG)" 或 "打包成 ZIP 下载"
4. 把生成的 PNG 放进 `assets/icons/`
5. 提交并 push

manifest.json 同时保留 SVG 数据 URI 兜底。更新图标时请同步修改 Service Worker 版本。
