# PWA / Apple Touch Icons

PNG 图标由 `tools/image-generator.html` 在浏览器里生成。

## 期望文件 (生成后放在这里)

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

在你生成 PNG 之前, manifest.json 里有一个 SVG 数据 URI 兜底, 站点不会因为缺图标而崩。
