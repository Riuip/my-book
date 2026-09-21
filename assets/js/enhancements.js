/* WYQ blog enhancements */
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
    var shareLinks = [
      {
        name: 'Twitter',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        url: 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle
      },
      {
        name: '微博',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443z"/></svg>',
        url: 'https://service.weibo.com/share/share.php?url=' + pageUrl + '&title=' + pageTitle
      },
      {
        name: '复制链接',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
        action: 'copy'
      }
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
