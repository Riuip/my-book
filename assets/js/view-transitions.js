(function(){
'use strict';
function home(){var n=(location.pathname.split('/').pop()||'').toLowerCase();return n===''||n==='index.html';}
function svgFilter(){
 if(!home()||document.getElementById('wyq-liquid-displace-svg'))return;
 var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),defs=document.createElementNS(ns,'defs'),f=document.createElementNS(ns,'filter'),t=document.createElementNS(ns,'feTurbulence'),a=document.createElementNS(ns,'animate'),d=document.createElementNS(ns,'feDisplacementMap'),b=document.createElementNS(ns,'feGaussianBlur'),m=document.createElementNS(ns,'feColorMatrix');
 svg.id='wyq-liquid-displace-svg';svg.setAttribute('width','0');svg.setAttribute('height','0');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
 f.id='wyqNavGlassDisplace';f.setAttribute('x','-12%');f.setAttribute('y','-32%');f.setAttribute('width','124%');f.setAttribute('height','164%');f.setAttribute('color-interpolation-filters','sRGB');
 t.setAttribute('type','fractalNoise');t.setAttribute('baseFrequency','0.010 0.052');t.setAttribute('numOctaves','2');t.setAttribute('seed','7');t.setAttribute('result','noise');
 a.setAttribute('attributeName','baseFrequency');a.setAttribute('dur','8s');a.setAttribute('values','0.010 0.052;0.016 0.038;0.012 0.062;0.010 0.052');a.setAttribute('repeatCount','indefinite');t.appendChild(a);
 d.setAttribute('in','SourceGraphic');d.setAttribute('in2','noise');d.setAttribute('scale','13');d.setAttribute('xChannelSelector','R');d.setAttribute('yChannelSelector','G');d.setAttribute('result','displaced');
 b.setAttribute('in','displaced');b.setAttribute('stdDeviation','0.18');b.setAttribute('result','softened');m.setAttribute('in','softened');m.setAttribute('type','saturate');m.setAttribute('values','1.12');
 f.appendChild(t);f.appendChild(d);f.appendChild(b);f.appendChild(m);defs.appendChild(f);svg.appendChild(defs);document.body.appendChild(svg);
}
function css(){
 if(!home()||document.getElementById('wyq-liquid-home-nav'))return;
 var s=document.createElement('style');s.id='wyq-liquid-home-nav';s.textContent=[
 '.nav{overflow:visible!important}',
 '.nav__inner{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:rgba(248,252,255,.46)!important;border:1px solid rgba(255,255,255,.74)!important;box-shadow:0 20px 56px rgba(24,52,90,.13),0 7px 20px rgba(24,52,90,.08),inset 0 1px 1px rgba(255,255,255,.92),inset 0 -1px 1px rgba(30,60,95,.10),inset 0 0 0 1px rgba(255,255,255,.22)!important;backdrop-filter:blur(34px) saturate(185%) brightness(1.06) contrast(.96)!important;-webkit-backdrop-filter:blur(34px) saturate(185%) brightness(1.06) contrast(.96)!important}',
 '.nav__inner::before{content:""!important;position:absolute!important;inset:-14px!important;z-index:0!important;border-radius:inherit!important;background:radial-gradient(circle at 10% 16%,rgba(255,255,255,.62) 0 8%,rgba(255,255,255,.22) 20%,transparent 38%),radial-gradient(circle at 84% 86%,rgba(120,175,255,.16),transparent 36%),linear-gradient(145deg,rgba(255,255,255,.20),rgba(255,255,255,.06) 48%,rgba(170,215,255,.12))!important;filter:url(#wyqNavGlassDisplace) saturate(110%)!important;pointer-events:none!important}',
 '.nav__inner::after{content:""!important;position:absolute!important;inset:1px!important;z-index:1!important;border-radius:inherit!important;background:linear-gradient(180deg,rgba(255,255,255,.48) 0%,rgba(255,255,255,.14) 35%,rgba(255,255,255,0) 66%),radial-gradient(ellipse at 50% 116%,rgba(255,255,255,.24),transparent 54%)!important;box-shadow:inset 16px 16px 30px rgba(255,255,255,.16),inset -18px -16px 34px rgba(40,82,130,.07)!important;filter:url(#wyqNavGlassDisplace)!important;pointer-events:none!important}',
 '.nav__brand,.nav__menu,.nav__menu>li{position:relative!important;z-index:2!important}',
 '.nav__menu a,.nav__sub-toggle,.nav__search-btn,.nav__theme{background:transparent!important;border-color:transparent!important;border-width:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;filter:none!important;text-shadow:none!important;color:var(--text-soft)!important;transform:none!important;overflow:visible!important}',
 '.nav__menu a::before,.nav__menu a::after,.nav__sub-toggle::before,.nav__sub-toggle::after,.nav__search-btn::before,.nav__search-btn::after,.nav__theme::before,.nav__theme::after{content:none!important;display:none!important;background:none!important;box-shadow:none!important;filter:none!important}',
 '.nav__menu a:hover,.nav__sub-toggle:hover,.nav__search-btn:hover,.nav__theme:hover,details.nav__has-sub.is-visible>summary.nav__sub-toggle,details.nav__has-sub[open]>summary.nav__sub-toggle{background:transparent!important;border-color:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;color:var(--text)!important;transform:none!important}',
 '.nav__search-btn,.nav__theme{width:42px!important;height:42px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}',
 '.nav__search-btn svg,.nav__theme svg{width:21px!important;height:21px!important;opacity:.88!important;filter:none!important}',
 '[data-theme="dark"] .nav__inner{background:rgba(24,26,34,.44)!important;border-color:rgba(255,255,255,.16)!important}',
 '[data-theme="dark"] .nav__menu a,[data-theme="dark"] .nav__sub-toggle,[data-theme="dark"] .nav__search-btn,[data-theme="dark"] .nav__theme{background:transparent!important;color:rgba(245,245,247,.82)!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}'
 ].join('\n');document.head.appendChild(s);
}
setTimeout(function(){svgFilter();css();},0);
if(!document.startViewTransition)return;
document.addEventListener('click',function(e){var l=e.target.closest('a[href]');if(!l)return;var u=new URL(l.href,location.origin);if(u.origin!==location.origin||l.hasAttribute('download')||l.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();document.startViewTransition(function(){location.href=u.href;});});
})();