/* =========================================================
   WYQ 专属博客 — Enhanced Features
   - Reading progress bar
   - Table of Contents (TOC)
   - Back to top button
   - Dark mode transition animation
   - Share buttons
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Reading Progress Bar ---------- */
  var progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Table of Contents (TOC) ---------- */
  var tocContainer = document.getElementById('toc');
  var article = document.querySelector('.article');

  if (tocContainer && article) {
    var headings = article.querySelectorAll('h2, h3');
    if (headings.length > 0) {
      var tocList = document.createElement('ul');
      tocList.className = 'toc__list';

      Array.prototype.forEach.call(headings, function (heading, index) {
        // Add id to heading for anchor links
        if (!heading.id) {
          heading.id = 'heading-' + index;
        }

        var li = document.createElement('li');
        li.className = 'toc__item' + (heading.tagName === 'H3' ? ' toc__item--sub' : '');

        var a = document.createElement('a');
        a.className = 'toc__link';
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.setAttribute('data-target', heading.id);

        a.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.getElementById(this.getAttribute('data-target'));
          if (target) {
            var offset = target.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        });

        li.appendChild(a);
        tocList.appendChild(li);
      });

      tocContainer.appendChild(tocList);

      // TOC toggle
      var tocToggle = document.getElementById('toc-toggle');
      if (tocToggle) {
        tocToggle.addEventListener('click', function () {
          tocContainer.classList.toggle('is-collapsed');
          tocToggle.classList.toggle('is-collapsed');
        });
      }

      // Highlight active heading in TOC on scroll
      var tocLinks = tocContainer.querySelectorAll('.toc__link');
      function updateActiveToc() {
        var scrollPos = window.pageYOffset + 100;
        var currentActive = null;

        Array.prototype.forEach.call(headings, function (heading) {
          if (heading.offsetTop <= scrollPos) {
            currentActive = heading.id;
          }
        });

        Array.prototype.forEach.call(tocLinks, function (link) {
          if (link.getAttribute('data-target') === currentActive) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
      window.addEventListener('scroll', updateActiveToc, { passive: true });
      updateActiveToc();
    } else {
      // No headings, hide TOC
      var tocWidget = document.querySelector('.toc-widget');
      if (tocWidget) tocWidget.style.display = 'none';
    }
  }

  /* ---------- Back to Top Button ---------- */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    function toggleBackToTop() {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Dark Mode Transition Animation ---------- */
  var themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    // Replace the simple toggle with an animated one
    var originalClick = null;

    themeToggle.addEventListener('click', function (e) {
      // Add transition overlay animation
      var overlay = document.createElement('div');
      overlay.className = 'theme-transition-overlay';

      // Get button position for radial animation origin
      var rect = themeToggle.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;

      overlay.style.setProperty('--tx', x + 'px');
      overlay.style.setProperty('--ty', y + 'px');

      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      overlay.style.background = isDark ? '#fbfbfd' : '#000000';

      document.body.appendChild(overlay);

      // Trigger animation
      requestAnimationFrame(function () {
        overlay.classList.add('is-active');
      });

      // Remove overlay after animation
      setTimeout(function () {
        overlay.classList.add('is-fading');
        setTimeout(function () {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 400);
      }, 500);
    });
  }

  /* ---------- Share Buttons ---------- */
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
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.583.631.272.827.978.442 1.574zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.134.8-1.751-.154-3.652-2.161-4.194z"/><path d="M17.737 13.497c.136-.395.074-.886-.213-1.406-.287-.52-.73-.904-1.164-.957l-.165-.011c-.069-.002-.13.003-.193.012-.272.052-.367.253-.216.474.083.121.19.22.282.336.208.25.353.537.416.84.039.185.028.354-.035.526-.04.108-.002.18.103.208.13.037.255.024.376-.025.19-.076.373-.218.523-.422l.006-.009c.071-.105.202-.348.28-.566zm1.014-2.093c-.343-.56-.862-.913-1.418-1.014a1.434 1.434 0 0 0-.385-.034c-.296.026-.387.232-.213.468a1.66 1.66 0 0 0 .312.29c.442.33.725.757.818 1.245.034.177.023.354-.025.528-.04.144.015.222.164.232.118.009.237-.018.348-.073.355-.177.634-.504.762-.912.12-.38.11-.81-.12-1.21-.043-.078-.083-.151-.12-.218a2.66 2.66 0 0 0-.123-.302z"/><path d="M20.535 11.482a4.624 4.624 0 0 0-2.36-2.082c-.6-.247-1.21-.345-1.828-.3-.282.022-.521.11-.53.383-.009.217.182.354.416.39.187.028.378.05.562.098.693.176 1.243.545 1.636 1.104.263.374.41.793.448 1.25.015.185.057.328.244.375.156.039.307.001.433-.096.341-.26.567-.624.667-1.049.04-.171.057-.35.059-.534a3.037 3.037 0 0 0-.147-1.039l.002.001c.063-.165-.017-.3-.102-.501z"/></svg>',
        url: 'https://service.weibo.com/share/share.php?url=' + pageUrl + '&title=' + pageTitle
      },
      {
        name: '复制链接',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
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
          if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(function () {
              btn.classList.add('is-copied');
              var label = btn.querySelector('.share-btn__label');
              label.textContent = '已复制!';
              setTimeout(function () {
                btn.classList.remove('is-copied');
                label.textContent = item.name;
              }, 2000);
            });
          } else {
            // Fallback
            var input = document.createElement('input');
            input.value = window.location.href;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            btn.classList.add('is-copied');
            var label = btn.querySelector('.share-btn__label');
            label.textContent = '已复制!';
            setTimeout(function () {
              btn.classList.remove('is-copied');
              label.textContent = item.name;
            }, 2000);
          }
        });
      } else {
        btn.addEventListener('click', function () {
          window.open(item.url, '_blank', 'width=600,height=400');
        });
      }

      shareContainer.appendChild(btn);
    });
  }

})();
