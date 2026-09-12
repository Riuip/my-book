/* UTF-8 and binary Base64 decoding, entirely in the browser. */
(function () {
  'use strict';
  function decode(input) {
    if (input.length > 2000000) throw new Error('内容过长，请控制在 200 万个字符以内。');
    var source = input.replace(/\s/g, '');
    if (!source) throw new Error('请先输入 Base64 内容。');
    if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(source)) throw new Error('包含无效字符。请粘贴 Base64 本身，不含网址或 data: 前缀。');
    var standard = source.replace(/-/g, '+').replace(/_/g, '/');
    var bare = standard.replace(/=+$/, '');
    if (bare.length % 4 === 1 || (standard.includes('=') && standard.length % 4 !== 0)) {
      throw new Error('Base64 长度或末尾的 = 不正确，请检查是否复制完整。');
    }
    var binary;
    try { binary = atob(bare); } catch (_) { throw new Error('无法解码，请检查 Base64 是否完整。'); }
    if (btoa(binary).replace(/=+$/, '') !== bare) throw new Error('Base64 末尾数据不完整或不规范，请检查原文。');
    var bytes = Uint8Array.from(binary, function (c) { return c.charCodeAt(0); });
    var text = null;
    try { text = new TextDecoder('utf-8', { fatal:true, ignoreBOM:true }).decode(bytes); } catch (_) { /* Binary remains downloadable. */ }
    return { bytes:bytes, text:text };
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = decode; return; }
  var form = document.getElementById('b64Form');
  if (!form) return;
  var input = document.getElementById('b64Input'), output = document.getElementById('b64Output');
  var status = document.getElementById('b64Status'), size = document.getElementById('b64Size');
  var copy = document.getElementById('b64Copy'), download = document.getElementById('b64Download');
  var result = null;
  function report(message, error) { status.textContent = message; status.dataset.error = String(!!error); }
  function invalidate() {
    result = null; output.value = ''; size.textContent = ''; copy.disabled = true; download.disabled = true;
    input.removeAttribute('aria-invalid'); report('');
  }
  input.addEventListener('input', invalidate);
  form.addEventListener('submit', function (event) {
    event.preventDefault(); invalidate();
    try {
      result = decode(input.value);
      output.value = result.text === null ? '' : result.text;
      size.textContent = result.bytes.length.toLocaleString() + ' 字节';
      copy.disabled = result.text === null; download.disabled = false;
      report(result.text === null ? '解码成功。内容不是 UTF-8 文本，可下载原始文件。' : '解码成功，可以复制或下载结果。');
    } catch (error) { input.setAttribute('aria-invalid','true'); report(error.message, true); }
  });
  document.getElementById('b64Clear').addEventListener('click', function () { input.value = ''; invalidate(); input.focus(); });
  document.getElementById('b64Example').addEventListener('click', function () {
    input.value = '5L2g5aW977yMV1lR77yB'; form.requestSubmit();
  });
  copy.addEventListener('click', async function () {
    if (!result || result.text === null) return;
    var current = result;
    try {
      await navigator.clipboard.writeText(current.text);
      if (result === current) report('已复制。');
    } catch (_) {
      if (result !== current) return;
      output.focus(); output.select(); report('已选中结果，请长按或使用系统复制。');
    }
  });
  download.addEventListener('click', function () {
    if (!result) return;
    var url = URL.createObjectURL(new Blob([result.bytes], {type:result.text === null ? 'application/octet-stream' : 'text/plain;charset=utf-8'}));
    var link = document.createElement('a'); link.href = url; link.download = result.text === null ? 'decoded.bin' : 'decoded.txt';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
    report('已发起下载。');
  });
})();
