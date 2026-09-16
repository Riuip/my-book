# 统一界面与 Base64 密码加密

## 界面

按手机圈选反馈调整首屏：两行标题左对齐、降低字重，操作入口使用更小的黑白按钮；桌面将入口排在标题右下方，手机自然换到标题下。首页与“最近更新”保持同一背景，用内容宽度内的细线衔接，取消灰色区域造成的断层。近期记录改用轻量分隔行，工具和关于区域沿用同一间距、圆角与标题层级。

共享字体、主按钮、次按钮、深浅主题与工具标题由 `assets/css/edition.css` 维护；根变量提供内容宽度、页边距和圆角。全站 22 页继续由 `node tools/build-shell.mjs` 同步导航和资源版本。文章正文、导出画布配色与生日内容不受影响。

参考 [Apple](https://www.apple.com/) 与 [OpenAI](https://openai.com/) 的留白和文字层级，使用本站原有内容与图像。

## Base64

四种处理方式：解码、编码、密码加密、密码解密。保留中文、Emoji、URL-safe、可省略填充、二进制解码下载；加入确认密码、显隐密码、结果复用、处理中状态与错误反馈。切换模式、编辑输入或清空时，进行中的旧结果失效；离开页面清理表单，输入不进入 URL、网络请求或持久存储。

- 普通 Base64 仅编码，不提供密码保护。
- 密码加密仅处理文字，UTF-8 最多 1,000,000 字节；解码/解密输入最多 2,000,000 字符，确保最大明文输出仍能重新输入并解密。
- 加密密码至少 8 个 Unicode 字符，最多 1024 个 UTF-16 码元。密码中的空格不会被修剪。建议使用较长的独特密码；本站不能恢复遗忘的密码。
- 使用原生 Web Crypto，需要 HTTPS（本地开发的可信 localhost 也可）。没有 Web Crypto 时普通编解码仍可使用，密码功能显示明确提示。

### WYQ v1 密文格式

整个二进制封包最终使用标准 Base64 编码。固定格式避免不受信任的密文指定任意 KDF 工作量。

| 偏移 | 长度 | 内容 |
| --- | --- | --- |
| 0 | 4 字节 | `57 59 51 01`（WYQ 和版本 1） |
| 4 | 16 字节 | 随机 salt |
| 20 | 12 字节 | 随机 AES-GCM IV |
| 32 | 可变 | 密文，末尾含 16 字节认证标签 |

PBKDF2-HMAC-SHA-256，600,000 次迭代，派生 256 位不可导出的 AES 密钥；AES-GCM 的 `additionalData` 为完整 32 字节头部。每次加密重新生成 salt 与 IV。错误密码或对 salt、IV、密文、标签的修改都不会输出明文。版本不受支持、普通 Base64 误作密文、超长输入与 Unicode 损坏均有专门提示。

实现参考：[Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)、[AES-GCM 参数](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams)、[PBKDF2 工作因子](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)。格式和测试不等同于独立密码学审计。

## 验证

```sh
node tools/build-shell.mjs
node tools/test-base64.cjs
node tools/test-base64-crypto.cjs
node tools/test-reading-ui.cjs
```

密码测试使用 Node 的独立 AES-GCM/PBKDF2 API 交叉验证 Web Crypto 的输出，并覆盖中文/BOM、随机性、错误密码、头部与密文篡改、版本、长度边界及 1 MB 往返。

GitHub Actions 的浏览器验收覆盖 320/390/768/1440px 所有页面、深浅主题、目录、搜索、键盘、Base64 密码确认、加解密、清空、下载内容及异步旧结果丢弃。截图上传为 `reading-ui-screenshots`。本地预览浏览器受连接限制；该流程为 Chromium 验收，不代表真实 iPhone Safari 设备验收。

资源版本：`edition.css?v=7`、`base64.css?v=3`、`base64.js?v=2`；离线缓存 `wyq-v26-2026-09-16-unified`。
