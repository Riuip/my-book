/* WYQ blog enhancements — compact */
(function () {
  'use strict';
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  var progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var content = document.querySelector('.article');
      var start = content ? content.getBoundingClientRect().top + scrollTop : 0;
      var end = content ? start + content.offsetHeight : document.documentElement.scrollHeight;
      var distance = Math.max(1, end - start - window.innerHeight);
      var progress = (scrollTop - start) / distance * 100;
      progressBar.style.width = Math.max(0, Math.min(progress, 100)) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    function toggleBackToTop() {
      backToTop.classList.toggle('is-visible', window.pageYOffset > 400);
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });
  }

  var shareContainer = document.getElementById('share-buttons');
  if (shareContainer) {
    var pageUrl = encodeURIComponent(window.location.href);
    var pageTitle = encodeURIComponent(document.title);
    var I = {
      tw: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
      wb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443z"/></svg>',
      fg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4zm4-12H8c-2.21 0-4 1.79-4 4s1.79 4 4 4h4v-8zm0-8H8C5.79 4 4 5.79 4 8s1.79 4 4 4h4V4zm4 0h-4v8h4c2.21 0 4-1.79 4-4s-1.79-4-4-4zm0 8h-4v8h4c2.21 0 4-1.79 4-4s-1.79-4-4-4z"/></svg>',
      dr: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm7.98 6.9a10.02 10.02 0 0 1 1.7 5.35c-.25-.05-2.75-.56-5.27-.24-.05-.12-.1-.24-.15-.36-.14-.34-.3-.68-.46-1.01 2.8-1.14 4.08-2.78 4.18-3.74zM12 1.98c2.4 0 4.6.86 6.32 2.29-.09.8-1.17 2.2-3.83 3.2-1.76-3.24-3.72-5.9-3.94-6.2A9.97 9.97 0 0 1 12 1.98z"/></svg>',
      be: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.039 3-5.198 3-3.179 0-5.528-1.95-5.528-5.31 0-3.504 2.444-5.69 5.628-5.69 3.075 0 4.951 1.91 5.372 4.724H24c-.105-4.446-3.273-7.034-7.276-7.034-4.728 0-8.224 3.449-8.224 8.331 0 5.064 3.42 8.316 8.228 8.316 3.782 0 6.594-2.197 7.204-5.337h-3.206zM9.5 15.5c0 2.485-2.015 4.5-4.5 4.5S.5 17.985.5 15.5 2.515 11 5 11s4.5 2.015 4.5 4.5z"/></svg>',
      cp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    };
    var shareLinks = [
      { name: 'Twitter', icon: I.tw, url: 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle },
      { name: '微博', icon: I.wb, url: 'https://service.weibo.com/share/share.php?url=' + pageUrl + '&title=' + pageTitle },
      { name: 'Figma', icon: I.fg, url: 'https://www.figma.com' },
      { name: 'Dribbble', icon: I.dr, url: 'https://dribbble.com' },
      { name: 'Behance', icon: I.be, url: 'https://www.behance.net' },
      { name: '复制链接', icon: I.cp, action: 'copy' }
    ];
    shareLinks.forEach(function (item) {
      var btn = document.createElement('button');
      btn.className = 'share-btn';
      btn.setAttribute('aria-label', '分享到 ' + item.name);
      btn.innerHTML = '<span class="share-btn__icon">' + item.icon + '</span><span class="share-btn__label">' + item.name + '</span>';
      if (item.action === 'copy') {
        btn.addEventListener('click', function () {
          var done = function () {
            btn.classList.add('is-copied');
            var label = btn.querySelector('.share-btn__label');
            label.textContent = '已复制!';
            setTimeout(function () { btn.classList.remove('is-copied'); label.textContent = item.name; }, 2000);
          };
          if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).then(done);
          else done();
        });
      } else {
        btn.addEventListener('click', function () { window.open(item.url, '_blank', 'width=600,height=400'); });
      }
      shareContainer.appendChild(btn);
    });
  }
})();
