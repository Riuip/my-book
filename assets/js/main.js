/* ============================================================
   Maison — Subtle interactions
   ============================================================ */
(function () {
  'use strict';

  // 1. Sticky nav appearance on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. Reveal-on-scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // 3. Highlight active nav link based on current pathname
  const path = window.location.pathname.replace(/\/index\.html$/, '/').toLowerCase();
  document.querySelectorAll('.nav__menu a').forEach((a) => {
    const href = a.getAttribute('href').toLowerCase();
    const normalized = href === 'index.html' ? '/' : href;
    if (
      (normalized === '/' && (path === '/' || path.endsWith('/my-book/') || path.endsWith('/'))) ||
      (normalized !== '/' && path.endsWith(normalized))
    ) {
      a.classList.add('active');
    }
  });

  // 4. Year in footer
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
