/* Cross-check the versioned Web Crypto format with Node's independent crypto API. */
const assert = require('node:assert/strict');
const { pbkdf2Sync, createCipheriv, createDecipheriv } = require('node:crypto');
const codec = require('../assets/js/base64.js');
(async () => {
  const password = '测试 密码 🔐 keep spaces ';
  for (const text of ['你好，WYQ！🚲', '\uFEFF保留 BOM\u0000\n换行', '<script>alert(1)</script>', ' \t\n']) {
    assert.equal(codec.encode(text), Buffer.from(text).toString('base64'));
    const encrypted = await codec.encrypt(text, password);
    assert.equal(await codec.decrypt(encrypted, password), text);
    assert.equal(await codec.decrypt(encrypted.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),password), text);
    assert.equal(await codec.decrypt(encrypted.match(/.{1,64}/g).join('\n'),password), text);
    const bytes = Buffer.from(encrypted,'base64');
    assert.deepEqual([...bytes.subarray(0,4)],[87,89,81,1]);
    const key = pbkdf2Sync(password,bytes.subarray(4,20),600000,32,'sha256');
    const decipher = createDecipheriv('aes-256-gcm',key,bytes.subarray(20,32));
    decipher.setAAD(bytes.subarray(0,32)); decipher.setAuthTag(bytes.subarray(-16));
    assert.equal(Buffer.concat([decipher.update(bytes.subarray(32,-16)),decipher.final()]).toString('utf8'),text);
  }
  // A separately produced vector validates decryption without relying on our encrypt().
  const header = Buffer.concat([Buffer.from([87,89,81,1]),Buffer.alloc(16,7),Buffer.alloc(12,9)]);
  const cipher = createCipheriv('aes-256-gcm',pbkdf2Sync(password,header.subarray(4,20),600000,32,'sha256'),header.subarray(20));
  cipher.setAAD(header);
  const body = Buffer.concat([cipher.update('独立格式向量','utf8'),cipher.final()]);
  assert.equal(await codec.decrypt(Buffer.concat([header,body,cipher.getAuthTag()]).toString('base64'),password),'独立格式向量');
  const first = await codec.encrypt('同样的文字',password), second = await codec.encrypt('同样的文字',password);
  const bytes = Buffer.from(first,'base64'), next = Buffer.from(second,'base64');
  assert.notEqual(first,second);
  assert.notDeepEqual(bytes.subarray(4,20),next.subarray(4,20));
  assert.notDeepEqual(bytes.subarray(20,32),next.subarray(20,32));
  await assert.rejects(codec.decrypt(first,password.trim()),/解密失败/);
  for (const offset of [4,20,32,bytes.length-1]) {
    const altered = Buffer.from(bytes); altered[offset] ^= 1;
    await assert.rejects(codec.decrypt(altered.toString('base64'),password),/解密失败/);
  }
  await assert.rejects(codec.decrypt(bytes.subarray(0,-1).toString('base64'),password),/解密失败/);
  await assert.rejects(codec.decrypt(codec.encode('普通文字'),password),/不是本站/);
  await assert.rejects(codec.decrypt('!',password),/无效字符/);
  await assert.rejects(codec.decrypt('A'.repeat(2000001),password),/过长/);
  const unsupported = Buffer.from(bytes); unsupported[3] = 2;
  await assert.rejects(codec.decrypt(unsupported.toString('base64'),password),/版本/);
  for (const weak of ['', '1234567']) await assert.rejects(codec.encrypt('text',weak),/至少 8/);
  await assert.rejects(codec.encrypt('text','a'.repeat(1025)),/1024/);
  await assert.rejects(codec.decrypt(first,''),/请输入/);
  assert.throws(()=>codec.encode('\ud800'),/Unicode/);
  assert.throws(()=>codec.encode('中'.repeat(333334)),/1 MB/);
  assert.throws(()=>codec.encode(''),/先输入/);
  const max = 'a'.repeat(1000000), packed = await codec.encrypt(max,password);
  assert(packed.length < 2000000,'maximum plaintext must fit in decrypt input');
  assert.equal((await codec.decrypt(packed,password)).length,max.length);
  await assert.rejects(codec.encrypt(max+'a',password),/1 MB/);
  console.log('PASS crypto: independent AES-GCM interoperability, Unicode/BOM, random salt/IV, wrong passwords, authenticated tampering, versions and size boundaries');
})().catch(error=>{console.error(error);process.exitCode=1;});
