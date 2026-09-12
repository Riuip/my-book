const assert = require('node:assert/strict');
const decode = require('../assets/js/base64.js');
for (const text of ['Hello, WYQ!', '你好，WYQ！', '鹈鹕 🚲', '<script>alert(1)</script>', '\uFEFF保留 BOM', 'a\u0000b']) {
  const b64 = Buffer.from(text).toString('base64');
  assert.equal(decode(b64).text, text);
  assert.equal(decode(b64.replace(/=/g, '')).text, text);
  assert.equal(decode(b64.replace(/\+/g, '-').replace(/\//g, '_')).text, text);
  assert.equal(decode(b64.match(/.{1,4}/g).join(' \n')).text, text);
}
assert.equal(decode('5L2g5aW977yMV1lR77yB').text, '你好，WYQ！');
assert.deepEqual([...decode('-_8=').bytes], [251,255]);
assert.equal(decode('/w==').text, null);
for (const value of ['', '  \n', 'A', 'A===', '=AAA', 'TQ=', 'TQ===', 'TQ==x', 'T!Q=', 'TR==', 'data:text/plain;base64,TQ==', 'A'.repeat(2000001)]) {
  assert.throws(() => decode(value), undefined, value.slice(0,30));
}
assert.equal(decode('TQ==').text, 'M');
assert.equal(decode('TWE=').text, 'Ma');
console.log('PASS Base64: Unicode, emoji, URL-safe, omitted padding, whitespace, binary, invalid inputs and size limit');
