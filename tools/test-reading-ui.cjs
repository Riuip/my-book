/* DOM regression checks. Run with linkedom available in NODE_PATH (npm install --no-save linkedom).
 * These check behavior and static HTML contracts, not browser layout. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { parseHTML } = require('linkedom');
const root = path.resolve(__dirname, '..');
function page(file, mobile = false) {
  const { window } = parseHTML(fs.readFileSync(path.join(root, file), 'utf8'));
  const document = window.document;
  window.HTMLTextAreaElement.prototype.select = function () {};
  const callbacks = [], scrolls = [];
  Object.assign(window, {
    location: { pathname:'/' + file, href:'http://localhost/' + file, protocol:'http:', hostname:'localhost' },
    matchMedia: () => ({ matches:mobile, addEventListener() {} }),
    getComputedStyle: () => ({ getPropertyValue:()=>'64' }),
    localStorage: { getItem:()=>null, setItem() {} },
    setTimeout: fn => { callbacks.push(fn); return callbacks.length; }, clearTimeout() {},
    setInterval:()=>0, clearInterval() {}, requestAnimationFrame:()=>0, cancelAnimationFrame() {},
    scrollTo: o => scrolls.push(o), scrollBy: o => scrolls.push(o),
    pageYOffset:0, innerWidth:mobile?390:1440, innerHeight:844,
    history: { replaceState(_a,_b,url) { window.location.hash=url; } },
    MutationObserver:class { observe() {} }, ResizeObserver:class { observe() {} },
  });
  document.querySelectorAll('*').forEach(el => { el.getBoundingClientRect=()=>({top:500,bottom:550,left:0,right:300,width:300,height:50}); });
  const context = vm.createContext(window);
  function run(name) { vm.runInContext(fs.readFileSync(path.join(root,'assets/js',name),'utf8'),context,{filename:name}); }
  return { window, document, run, callbacks, scrolls };
}
(async () => {
  let p=page('index.html'); p.run('posts-data.js');
  p.window.WYQ_POSTS[0].title='同一链接的新标题'; p.run('edition.js');
  assert.equal(p.document.querySelector('#edFeatured h3').textContent,'同一链接的新标题');
  assert.equal(p.document.querySelectorAll('.ed-hero-name,.ed-feature-copy>p,.ed-note>p,.ed-tool-card>p,.ed-pelican figcaption>span').length,0);
  assert.equal(p.document.querySelectorAll('.ed-note').length,2);
  p=page('search.html'); p.run('posts-data.js');
  p.window.WYQ_POSTS.push({ title:'mark a <img src=x onerror=alert(1)>',desc:'mark a',body:'mark a',cat:'测试',url:'post-001.html',tags:[],date:'2026-09-13' });
  p.run('search.js');
  const input=p.document.querySelector('#searchPageInput');
  assert(input,'search input exists');
  input.value='IMAX'; input.dispatchEvent(new p.window.Event('input'));
  assert(p.document.querySelector('.search-result'));
  // Repeated/overlapping keywords cannot match markup inserted by a previous pass.
  input.value='a mark'; input.dispatchEvent(new p.window.Event('input'));
  assert.equal(p.document.querySelectorAll('mark mark').length,0);
  assert(p.document.querySelectorAll('.search-result mark').length>0);
  assert.equal(p.document.querySelectorAll('.search-result img').length,0);
  p=page('post-008.html',true); p.run('enhancements.js');
  let toggle=p.document.querySelector('#toc-toggle');
  assert.equal(toggle.getAttribute('aria-expanded'),'false'); toggle.click();
  assert.equal(toggle.getAttribute('aria-expanded'),'true');
  assert.equal(p.document.querySelectorAll('#toc .toc__list').length,1);
  const anchor=p.document.querySelector('.toc__link'); anchor.click();
  assert(p.window.location.hash); assert.equal(p.scrolls.at(-1).top,436);
  p=page('index.html'); p.run('main.js');
  const theme=p.document.documentElement.getAttribute('data-theme');
  p.document.querySelector('[data-theme-toggle]').click();
  assert.notEqual(p.document.documentElement.getAttribute('data-theme'),theme);
  p.run('extras.js');
  function key(k) { const e=new p.window.Event('keydown'); e.key=k; p.document.dispatchEvent(e); }
  key('g');key('t'); assert.equal(p.window.location.href,'tags.html');
  p=page('post-003.html'); p.run('copy-btn.js');
  const button=p.document.querySelector('.copy-btn');
  assert(button); p.document.execCommand=()=>false;
  Object.defineProperty(p.window.navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true});
  button.click(); await new Promise(resolve=>setImmediate(resolve));
  assert.equal(button.querySelector('.copy-btn__text').textContent,'复制失败');
  for (const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))) {
    p=page(file);
    const ids=[...p.document.querySelectorAll('[id]')].map(n=>n.id);
    assert.equal(new Set(ids).size,ids.length,file+' duplicate IDs');
    for (const link of p.document.querySelectorAll('a[href],link[href],[src]')) {
      const target=(link.getAttribute('src')||link.getAttribute('href')||'').split(/[?#]/)[0];
      if(target&&!/^(?:[a-z]+:|\/\/)/i.test(target)) assert(fs.existsSync(path.join(root,target)),file+': missing '+target);
    }
    for (const link of p.document.querySelectorAll('#toc a')) assert(p.document.getElementById(link.getAttribute('href').slice(1)),file+' missing heading');
  }
  console.log('PASS reading UI: home refresh/removals, search, mobile TOC/anchors, g t shortcut, failed clipboard fallback, page IDs and local targets');
})().catch(error=>{console.error(error);process.exitCode=1;});
