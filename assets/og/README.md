# Open Graph Images

每篇文章一张 1200×630 OG 图，社交分享 (微信 / Twitter / Telegram / Discord) 时显示。

## 文件清单

| 文件 | 用途 |
|------|------|
| `default.svg` / `default.png` | 站点级兜底 (首页、归档、tags 等用) |
| `post-001.svg` / `post-001.png` | post-001 专属 |
| `post-002.svg` / `post-002.png` | post-002 专属 |
| `post-003.svg` / `post-003.png` | post-003 专属 |
| `post-004.svg` / `post-004.png` | post-004 专属 |
| `post-005.svg` / `post-005.png` | post-005 专属 |
| `post-006.svg` / `post-006.png` | post-006 专属 |

## SVG 与 PNG 的关系

- 仓库现在已经有 SVG 文件 — 大多数现代平台 (Twitter, Discord, Telegram, Slack) 都直接支持 SVG OG 图。
- 微信、LinkedIn 较保守, 对 SVG 支持不稳定。建议为这些平台生成 PNG。
- 站点 `<head>` 里同时挂了 PNG 和 SVG 两个 og:image — 平台会自动挑能识别的那个。

## 生成 PNG 的方法

1. 本地起一个静态服务器: `python3 -m http.server 8080`
2. 浏览器访问 <http://localhost:8080/tools/image-generator.html>
3. 点 "下载所有 OG 图 (PNG)" 或 "打包成 ZIP 下载"
4. 把 PNG 放进 `assets/og/` (与 SVG 同名, 例如 `post-001.png`)
5. 提交并 push

## 新增文章时

1. 复制一份 `assets/og/post-006.svg` -> `post-007.svg`
2. 修改里面的标题、副标题、编号文字
3. 在 `tools/image-generator.html` 的 OG_FILES 数组里加一行
4. 浏览器里重新生成 PNG
