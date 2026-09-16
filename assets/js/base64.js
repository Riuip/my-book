/* UTF-8 Base64 and password encryption. No network requests or persistent input storage.
 * WYQ v1: 4-byte magic/version + 16-byte salt + 12-byte IV + AES-GCM ciphertext/tag.
 * The 32-byte header is authenticated; v1 fixes PBKDF2-SHA-256 at 600,000 iterations.
 */
(function () {
  'use strict';
  var MAX_INPUT = 2000000, MAX_TEXT_BYTES = 1000000;
  var MAGIC = new Uint8Array([87, 89, 81, 1]);
  var encoder = new TextEncoder();
  function toBase64(bytes) {
    var chunks = [];
    for (var i = 0; i < bytes.length; i += 8192) chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, i + 8192)));
    return btoa(chunks.join(''));
  }
  function decode(input) {
    if (input.length > MAX_INPUT) throw new Error('内容过长，请控制在 200 万个字符以内。');
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
  function textBytes(input) {
    if (!input.length) throw new Error('请先输入要处理的文字。');
    if (input.length > MAX_INPUT) throw new Error('内容过长，请缩短后重试。');
    var bytes = encoder.encode(input);
    if (bytes.length > MAX_TEXT_BYTES) throw new Error('文字的 UTF-8 大小不能超过 1 MB，请缩短后重试。');
    if (new TextDecoder('utf-8', { ignoreBOM:true }).decode(bytes) !== input) throw new Error('文字包含不完整的 Unicode 字符，请检查原文。');
    return bytes;
  }
  function encode(input) { return toBase64(textBytes(input)); }
  function webCrypto() {
    if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('密码功能需要支持 Web Crypto 的浏览器，请通过 HTTPS 打开本站。');
    return crypto;
  }
  function validatePassword(password, encrypting) {
    if (!password || (encrypting && Array.from(password).length < 8)) throw new Error(encrypting ? '请设置至少 8 个字符的密码。' : '请输入加密时使用的密码。');
    if (password.length > 1024) throw new Error('密码不能超过 1024 个字符。');
  }
  async function deriveKey(password, salt, usage) {
    var api = webCrypto();
    var material = await api.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    return api.subtle.deriveKey({ name:'PBKDF2', hash:'SHA-256', salt:salt, iterations:600000 }, material,
      { name:'AES-GCM', length:256 }, false, [usage]);
  }
  async function encrypt(input, password) {
    var bytes = textBytes(input);
    validatePassword(password, true);
    var api = webCrypto();
    var header = new Uint8Array(32);
    header.set(MAGIC);
    api.getRandomValues(header.subarray(4, 20));
    api.getRandomValues(header.subarray(20, 32));
    var key = await deriveKey(password, header.subarray(4, 20), 'encrypt');
    var encrypted = await api.subtle.encrypt({ name:'AES-GCM', iv:header.subarray(20), additionalData:header, tagLength:128 }, key, bytes);
    var envelope = new Uint8Array(header.length + encrypted.byteLength);
    envelope.set(header); envelope.set(new Uint8Array(encrypted), header.length);
    return toBase64(envelope);
  }
  async function decrypt(input, password) {
    validatePassword(password, false);
    webCrypto();
    var envelope = decode(input).bytes;
    if (envelope.length < 49 || envelope[0] !== MAGIC[0] || envelope[1] !== MAGIC[1] || envelope[2] !== MAGIC[2]) {
      throw new Error('这不是本站生成的密码密文。普通 Base64 请使用“解码”。');
    }
    if (envelope[3] !== 1) throw new Error('暂不支持此密文版本，请使用生成它的工具版本。');
    if (envelope.length > MAX_TEXT_BYTES + 48) throw new Error('密文过长，请检查是否粘贴了多段内容。');
    var header = envelope.subarray(0, 32);
    var key = await deriveKey(password, header.subarray(4, 20), 'decrypt');
    var plain;
    try {
      plain = await webCrypto().subtle.decrypt({ name:'AES-GCM', iv:header.subarray(20), additionalData:header, tagLength:128 }, key, envelope.subarray(32));
    } catch (_) { throw new Error('解密失败：密码不正确，或密文已损坏。'); }
    try { return new TextDecoder('utf-8', { fatal:true, ignoreBOM:true }).decode(plain); }
    catch (_) { throw new Error('解密内容不是有效的 UTF-8 文字。'); }
  }
  // Preserve the existing CommonJS decoder entry point for regression checks.
  if (typeof module !== 'undefined' && module.exports) {
    decode.encode = encode; decode.encrypt = encrypt; decode.decrypt = decrypt;
    module.exports = decode; return;
  }
  var form = document.getElementById('b64Form');
  if (!form) return;
  var input = document.getElementById('b64Input'), output = document.getElementById('b64Output');
  var status = document.getElementById('b64Status'), size = document.getElementById('b64Size');
  var copy = document.getElementById('b64Copy'), download = document.getElementById('b64Download');
  var reuse = document.getElementById('b64Reuse'), submit = document.getElementById('b64Submit');
  var password = document.getElementById('b64Password'), confirmation = document.getElementById('b64Confirm');
  var reveal = document.getElementById('b64Reveal'), example = document.getElementById('b64Example');
  var modes = Array.from(form.querySelectorAll('[name="b64Mode"]'));
  var mode = 'decode', result = null, revision = 0, busy = false;
  var config = {
    decode: { input:'输入 Base64', output:'解码结果', action:'解码', placeholder:'粘贴 Base64 内容…', hint:'支持中文、URL-safe 格式、空格和换行；末尾的 = 可省略。', outputHint:'按 UTF-8 显示文字；二进制内容可下载为原始文件。', next:'encode' },
    encode: { input:'输入文字', output:'Base64 编码', action:'编码', placeholder:'输入需要编码的文字…', hint:'支持中文与 Emoji，最多 1 MB 的 UTF-8 文字。Base64 编码不提供保密保护。', outputHint:'标准 Base64 编码，可在“解码”中还原。', next:'decode' },
    encrypt: { input:'输入文字', output:'加密结果', action:'加密', placeholder:'写下需要用密码保护的文字…', hint:'最多 1 MB 的 UTF-8 文字。每次加密都会生成不同的密文。', outputHint:'保存完整密文，并妥善保管密码；忘记密码无法恢复。', next:'decrypt' },
    decrypt: { input:'输入密文', output:'解密结果', action:'解密', placeholder:'粘贴在这里生成的完整 Base64 密文…', hint:'仅支持本站“密码加密”生成的密文；普通 Base64 请切换到“解码”。', outputHint:'密码正确且密文完整时，才能还原原文。', next:'encrypt' }
  };
  function report(message, error) { status.textContent = message; status.dataset.error = String(!!error); }
  function invalidate() {
    revision++; result = null; output.value = ''; size.textContent = '';
    copy.disabled = true; download.disabled = true; reuse.disabled = true;
    [input, password, confirmation].forEach(function (field) { field.removeAttribute('aria-invalid'); });
    report('');
  }
  function concealPassword() {
    password.type = confirmation.type = 'password';
    reveal.textContent = '显示密码'; reveal.setAttribute('aria-pressed', 'false');
  }
  function changeMode(next) {
    mode = next; invalidate();
    password.value = confirmation.value = ''; concealPassword();
    var settings = config[mode], encrypted = mode === 'encrypt' || mode === 'decrypt';
    modes.forEach(function (radio) { radio.checked = radio.value === mode; });
    document.getElementById('b64InputLabel').textContent = settings.input;
    document.getElementById('b64OutputLabel').textContent = settings.output;
    document.getElementById('b64Hint').textContent = settings.hint;
    document.getElementById('b64OutputHint').textContent = settings.outputHint;
    input.placeholder = settings.placeholder;
    output.placeholder = '结果会出现在这里';
    document.getElementById('b64CryptoFields').hidden = !encrypted;
    document.getElementById('b64ConfirmField').hidden = mode !== 'encrypt';
    password.disabled = !encrypted; confirmation.disabled = mode !== 'encrypt';
    password.autocomplete = mode === 'encrypt' ? 'new-password' : 'off';
    submit.textContent = busy ? '处理中…' : settings.action;
    submit.disabled = busy;
    if (encrypted) { try { webCrypto(); } catch (error) { report(error.message, true); } }
  }
  modes.forEach(function (radio) { radio.addEventListener('change', function () { changeMode(radio.value); }); });
  [input, password, confirmation].forEach(function (field) { field.addEventListener('input', invalidate); });
  reveal.addEventListener('click', function () {
    var showing = password.type === 'password';
    password.type = confirmation.type = showing ? 'text' : 'password';
    reveal.textContent = showing ? '隐藏密码' : '显示密码'; reveal.setAttribute('aria-pressed', String(showing));
  });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (busy) return;
    invalidate();
    var currentRevision = revision, currentMode = mode;
    if (mode === 'encrypt' || mode === 'decrypt') {
      try { validatePassword(password.value, mode === 'encrypt'); }
      catch (error) { password.setAttribute('aria-invalid','true'); report(error.message,true); password.focus(); return; }
      if (mode === 'encrypt' && password.value !== confirmation.value) {
        confirmation.setAttribute('aria-invalid','true'); report('两次输入的密码不一致，请重新确认。', true); confirmation.focus(); return;
      }
    }
    busy = true; submit.disabled = true; example.disabled = true;
    submit.textContent = '处理中…'; form.setAttribute('aria-busy', 'true');
    report(mode === 'encrypt' || mode === 'decrypt' ? '正在本地处理，请稍候…' : '正在转换…');
    try {
      var nextResult;
      if (mode === 'decode') nextResult = decode(input.value);
      else {
        var text = mode === 'encode' ? encode(input.value) : mode === 'encrypt' ? await encrypt(input.value, password.value) : await decrypt(input.value, password.value);
        nextResult = { text:text, bytes:encoder.encode(text) };
      }
      // Editing, clearing or changing mode while Web Crypto runs discards its stale result.
      if (currentRevision !== revision) return;
      result = nextResult; result.mode = currentMode;
      output.value = result.text === null ? '' : result.text;
      size.textContent = result.bytes.length.toLocaleString() + ' 字节';
      copy.disabled = reuse.disabled = result.text === null; download.disabled = false;
      report(result.text === null ? '解码成功。内容不是 UTF-8 文本，可下载原始文件。' : config[currentMode].action + '成功，可以复制或下载结果。');
    } catch (error) {
      if (currentRevision !== revision) return;
      input.setAttribute('aria-invalid','true'); report(error.message, true);
    } finally {
      busy = false; submit.disabled = false; example.disabled = false;
      submit.textContent = config[mode].action; form.removeAttribute('aria-busy');
    }
  });
  function clear() { input.value = ''; password.value = confirmation.value = ''; concealPassword(); invalidate(); }
  document.getElementById('b64Clear').addEventListener('click', function () { clear(); input.focus(); });
  example.addEventListener('click', function () {
    clear();
    if (mode === 'decrypt') changeMode('encrypt');
    input.value = mode === 'decode' ? '5L2g5aW977yMV1lR77yB' : '你好，WYQ！\n记录生活，也探索更多。';
    if (mode === 'encrypt') { report('示例文字已填入。请设置自己的密码，再点击加密。'); password.focus(); }
    else form.requestSubmit();
  });
  reuse.addEventListener('click', function () {
    if (!result || result.text === null) return;
    var value = result.text, next = config[result.mode].next;
    changeMode(next); input.value = value;
    if (next === 'encrypt' || next === 'decrypt') password.focus(); else input.focus();
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
    var filenames = { decode:result.text === null ? 'decoded.bin' : 'decoded.txt', encode:'base64.txt', encrypt:'encrypted.wyq.txt', decrypt:'decrypted.txt' };
    var link = document.createElement('a'); link.href = url; link.download = filenames[result.mode];
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
    report('已发起下载。');
  });
  window.addEventListener('pagehide', clear);
  changeMode('decode');
})();
