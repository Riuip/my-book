/* Rebuild the static site shell without a framework or third-party build tools.
 * Run from any directory: node tools/build-shell.mjs
 * Article bodies and tool scripts are never rewritten by this builder.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const orbit = require('../assets/js/orbit.js');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const write = (p,s) => fs.writeFileSync(path.join(root,p),s);
const nav = read('templates/navigation.tpl');
const footer = read('templates/footer.tpl');
const search = read('templates/search.tpl');
const homeTemplate = read('templates/home.tpl');
const toolMeta = {
  'base64.html':['grad','BASE64','转换一段文字，或用密码为它留一把钥匙。'],
  'gradient.html':['grad','01 / COLOUR STUDY','调出你的下一组灵感色。支持线性、径向和锥形渐变，完成后复制 CSS。'],
  'pomodoro.html':['pomo','02 / A LITTLE FOCUS','给自己一段完整的时间。选择专注或休息，让眼前这件事慢慢完成。'],
  'md-card.html':['mc','03 / WORDS, FRAMED','把笔记、摘录与小想法排成卡片。选一个主题，再带走你的作品。'],
  'lab.html':['lab','04 / A LOOK OUTSIDE','一座城市的温度、风与云。看看此刻的天气，也可以把它保存成卡片。'],
  'dna.html':['dna','05 / A WRITING PORTRAIT','从已经写下的文字出发，看看习惯、主题与节奏留下的指纹。']
};
const originalHome = read('index.html');
const birthdayPath = 'templates/birthday.tpl';
if (!fs.existsSync(path.join(root,birthdayPath))) {
  const found = originalHome.match(/<section class="birthday-stage"[\s\S]*?<\/section>/);
  if (!found) throw new Error('Birthday content missing; refusing to drop it.');
  write(birthdayPath,found[0]+'\n');
}
const home = homeTemplate.replace('{{pelican}}',read('templates/pelican.tpl')).replace('{{birthday}}',read(birthdayPath)).replace('{{orbit}}',orbit.paths(0).map(p=>`<path d="${p.d}" opacity="${p.opacity}"/>`).join('\n'));
const pages = fs.readdirSync(root).filter(p=>p.endsWith('.html')).concat('tools/image-generator.html');
for (const file of pages) {
  let html = read(file);
  const prefix = file.startsWith('tools/') ? '../' : '';
  const kind = file==='index.html'?'ed-home':file.startsWith('post-')?'ed-article':file==='others.html'?'ed-game':file.startsWith('tools/')?'ed-generator':toolMeta[file]?'ed-tool':'ed-index';
  html = html.replace(/<html\b([^>]*)>/,(_,attrs)=>'<html'+attrs.replace(/\sclass="[^"]*"/,'').replace(/\sdata-site-root="[^"]*"/,'').replace(/\sdata-design="[^"]*"/,'')+' class="edition" data-design="minimal" data-site-root="'+prefix+'">');
  html = html.replace(/<body\b([^>]*)>/,(_,attrs)=>{
    const cls=(attrs.match(/class="([^"]*)"/)||[])[1]||'';
    const list=cls.split(/\s+/).filter(c=>c&&!c.startsWith('ed-'));
    return '<body'+attrs.replace(/\sclass="[^"]*"/,'')+' class="'+[...list,kind].join(' ')+'">';
  });
  html = html.replace(/\s*<a class="ed-skip"[\s\S]*?<\/a>/,'');
  const pageNav = nav.replaceAll('{{root}}',prefix);
  if (/<nav class="nav"/.test(html)) html=html.replace(/<nav class="nav"[\s\S]*?<\/nav>/,pageNav.trim());
  else html=html.replace(/(<body\b[^>]*>)/,'$1\n'+pageNav);
  const pageFooter=footer.replaceAll('{{root}}',prefix);
  if (/<footer class="footer"/.test(html)) html=html.replace(/<footer class="footer"[\s\S]*?<\/footer>/,pageFooter.trim());
  else html=html.replace('</body>',pageFooter+'\n</body>');
  if (file!=='search.html'&&!html.includes('id="navSearchBox"')) html=html.replace('<footer class="footer"',search+'\n  <footer class="footer"');
  if (file==='index.html') {
    if (html.includes('<!-- edition-home-start -->')) html=html.replace(/<!-- edition-home-start -->[\s\S]*?<!-- edition-home-end -->/,home.trim());
    else html=html.replace(/<header class="hero\b[\s\S]*?(?=<footer class="footer")/,home+'\n  ');
    html=html.replace(/\s*<style>[\s\S]*?<\/style>/g,'');
    html=html.replace(/\s*<script src="assets\/js\/home-extras\.js[^>]*><\/script>/,'');
    html=html.replace(/\s*<script>\s*\(function \(\) \{\s*var el = document\.getElementById\('heroTypewriter'\);[\s\S]*?<\/script>/,'');
    html=html.replace(/\s*<script src="assets\/js\/orbit\.js[^>]*><\/script>/,'');
  }
  // Obsolete drawer navigation is consolidated into the shared menu and TOC.
  html=html.replace(/\s*<aside class="sidebar"[\s\S]*?<\/aside>/,'').replace(/\s*<div class="sidebar-backdrop"[^>]*><\/div>/,'');
  if (!html.slice(html.indexOf('<body')).includes('id="main-content"')) {
    if (file.startsWith('tools/')) {
      html=html.replace(/(<h1>)/,'<main class="ed-generator-main" id="main-content" tabindex="-1">\n$1');
      html=html.replace(/(<main class="ed-generator-main"[\s\S]*?)(?=<script|<footer class="footer")/,'$1</main>\n');
    } else {
      const bodyAt=html.indexOf('<body');
      html=html.slice(0,bodyAt)+html.slice(bodyAt).replace(/<(main|article|section)\b([^>]*class="(?:article|search-page|archive-page|tags-page|nf-stage|mario-world|[a-z]+-stage)\b[^>]*)>/, '<$1$2 id="main-content" tabindex="-1">');
    }
  }
  if (file.startsWith('post-')&&!html.includes('ed-article-back')) html=html.replace('<div class="article-hero__inner">','<div class="article-hero__inner">\n      <a class="ed-article-back" href="archive.html">← JOURNAL / 返回全部文章</a><br>');
  if (toolMeta[file]) {
    const [cls,label,description]=toolMeta[file];
    html=html.replace(new RegExp('(<span class="'+cls+'-eyebrow">)[\\s\\S]*?(</span>)'),'$1'+label+'$2');
    html=html.replace(new RegExp('(<p class="'+cls+'-sub">)[\\s\\S]*?(</p>)'),'$1'+description+'$2');
  }
  // Tool pages use the shared top navigation; no secondary pill menu.
  html=html.replace(/\s*<nav class="ed-studio-nav"[\s\S]*?<\/nav>/g,'');
  const titles={ 'archive.html':['THE COMPLETE INDEX / 01','文字存档'], 'tags.html':['FOLLOW A THREAD / 02','从兴趣出发'], 'search.html':['FIND A LITTLE SOMETHING / 03','找一篇，慢慢读。'] };
  if(titles[file])html=html.replace(/(<h1\b[^>]*>)[\s\S]*?(<\/h1>)/,'$1'+titles[file][1]+'$2');
  if (!html.includes('assets/css/edition.css')) html=html.replace('</head>','  <link rel="stylesheet" href="'+prefix+'assets/css/edition.css?v=1" />\n</head>');
  for (const [name,version] of [['main','19'],['posts-data','4'],['search','7']]) {
    if (!html.includes('assets/js/'+name+'.js')) html=html.replace('</body>','  <script src="'+prefix+'assets/js/'+name+'.js?v='+version+'"></script>\n</body>');
  }
  if (!html.includes('assets/js/edition.js')) html=html.replace('</body>','  <script src="'+prefix+'assets/js/edition.js?v=1" defer></script>\n</body>');
  html=html.replaceAll('search.js?v=6','search.js?v=7').replace(/edition.css\?v=\d+/g,'edition.css?v=5').replace(/edition.js\?v=[123]/g,'edition.js?v=4').replaceAll('liquid-optics.js?v=4','liquid-optics.js?v=5');
  html=html.replace(/<p class="ed-kicker">[\s\S]*?<\/p>/g,'').replace('← JOURNAL / 返回全部文章','‹ 返回全部文章');
  if (file.startsWith('tools/')&&!html.includes('assets/css/style.css')) html=html.replace(/(<style>)/,'<link rel="stylesheet" href="../assets/css/style.css?v=27" />\n$1');
  html=html.replace(/(<meta name="theme-color" content=")(?:#fbfbfd|#f2f2e9)/g,'$1#ffffff').replace(/(<meta name="theme-color" content=")(?:#000000|#111e19)/g,'$1#000000');
  if (file.startsWith('post-')) {
    // Rebuild one static reading layout; headings and TOC also work without JS.
    html = html.replace(/<!-- reading-layout-start -->\s*<div class="ed-reading-layout">\s*/g,'').replace(/\s*<\/div>\s*<!-- reading-layout-end -->/g,'');
    html = html.replace(/\s*<div class="toc-widget">[\s\S]*?<\/nav>\s*<\/div>/g,'');
    html = html.replace(/<article class="article"[\s\S]*?<\/article>/, body => {
      const entries = [];
      let index = 0;
      body = body.replace(/<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/g, (_,tag,attrs,label) => {
        const existing = attrs.match(/\bid="([^"]+)"/);
        let id = existing?.[1];
        if (!id) {
          do { id = 'section-' + (++index); } while (html.includes('id="'+id+'"'));
          attrs += ' id="'+id+'"';
        }
        entries.push('<li class="toc__item'+(tag==='h3'?' toc__item--sub':'')+'"><a class="toc__link" href="#'+id+'">'+label.replace(/<[^>]*>/g,'')+'</a></li>');
        return '<'+tag+attrs+'>'+label+'</'+tag+'>';
      });
      const toc = entries.length ? '<div class="toc-widget"><button type="button" class="toc-toggle" id="toc-toggle" aria-expanded="true" aria-controls="toc"><span>文章目录</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><nav class="toc" id="toc" aria-label="文章目录"><ul class="toc__list">'+entries.join('')+'</ul></nav></div>' : '';
      return '<!-- reading-layout-start -->\n<div class="ed-reading-layout">\n'+toc+'\n'+body+'\n</div>\n<!-- reading-layout-end -->';
    });
  }
  for (const [asset,version] of [['edition.css',7],['edition.js',5],['enhancements.js',5],['extras.js',7],['search.js',8],['copy-btn.js',2],['base64.css',3],['base64.js',2]]) {
    html = html.replace(new RegExp(asset.replace('.', '\\.')+'(?:\\?v=\\d+)?(?=["\\\'])','g'),asset+'?v='+version);
  }
  write(file,html.replace(/[ \t]+$/gm,''));
}
console.log('Rebuilt the minimal shell for '+pages.length+' pages.');
