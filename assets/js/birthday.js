/* WYQ annual birthday mode — July 16, UTC+8 */
(function () {
  'use strict';

  var UTC8_OFFSET = 8 * 60 * 60 * 1000;
  var MAX_TIMER_DELAY = 6 * 60 * 60 * 1000;
  var SHOW_DURATION = 8000;
  var BURST_DELAYS = [0, 700, 1600, 2700, 3900, 5300];
  var STORAGE_PREFIX = 'wyq-birthday-fireworks-';

  var root = document.documentElement;
  var defaultHero = null;
  var birthdayStage = null;
  var canvas = null;
  var cake = null;
  var replayButton = null;
  var wishStatus = null;
  var initialWishStatus = '';
  var context = null;

  var currentActive = false;
  var previewAutoPlayed = false;
  var boundaryTimer = 0;
  var autoplayTimer = 0;
  var animationFrame = 0;
  var showEndTime = 0;
  var burstTimers = [];
  var particles = [];
  var canvasWidth = 0;
  var canvasHeight = 0;
  var resizeObserver = null;
  var resizeFrame = 0;

  function getBirthdayValues() {
    var values = [];
    var search = window.location.search || '';

    try {
      var params = new URLSearchParams(search);
      if (typeof params.getAll === 'function') {
        values = params.getAll('birthday');
      } else if (params.has('birthday')) {
        values = [params.get('birthday')];
      }
    } catch (error) {
      search.replace(/(?:^|[?&])birthday=([^&]*)/gi, function (_, value) {
        try {
          values.push(decodeURIComponent(value.replace(/\+/g, ' ')));
        } catch (decodeError) {
          values.push(value);
        }
        return _;
      });
    }

    return values.map(function (value) {
      return String(value || '').toLowerCase();
    });
  }

  var birthdayValues = getBirthdayValues();
  var forceOff = birthdayValues.indexOf('off') !== -1;
  var forcePreview = birthdayValues.indexOf('preview') !== -1;

  function toTimestamp(value) {
    if (typeof value === 'undefined') return Date.now();
    if (value instanceof Date) return value.getTime();
    return new Date(value).getTime();
  }

  function utc8Parts(value) {
    var timestamp = toTimestamp(value);
    if (!isFinite(timestamp)) return null;
    var shifted = new Date(timestamp + UTC8_OFFSET);
    return {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate()
    };
  }

  function isActiveAt(value) {
    var parts = utc8Parts(value);
    return !!parts && parts.month === 7 && parts.day === 16;
  }

  function shouldBeActive(value) {
    if (forceOff) return false;
    if (forcePreview) return true;
    return isActiveAt(value);
  }

  function isMotionLimited() {
    var reduced = false;
    try {
      reduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (error) {}

    var connection = navigator.connection ||
      navigator.mozConnection || navigator.webkitConnection;
    return !!(reduced || (connection && connection.saveData));
  }

  function isNarrowDevice() {
    try {
      return window.matchMedia &&
        window.matchMedia('(max-width: 720px), (pointer: coarse)').matches;
    } catch (error) {
      return window.innerWidth <= 720;
    }
  }

  function cacheDom() {
    defaultHero = document.getElementById('defaultHero');
    birthdayStage = document.getElementById('birthdayStage');
    canvas = document.getElementById('birthdayFireworks');
    cake = document.getElementById('birthdayCake');
    replayButton = document.getElementById('birthdayReplay');
    wishStatus = document.getElementById('birthdayWishStatus');
    initialWishStatus = wishStatus ? wishStatus.textContent : '';

    if (canvas) {
      canvas.setAttribute('aria-hidden', 'true');
      context = canvas.getContext && canvas.getContext('2d');
    }
  }

  function syncVisibility(active) {
    if (active) root.setAttribute('data-birthday', 'active');
    else root.removeAttribute('data-birthday');

    if (defaultHero) defaultHero.setAttribute('aria-hidden', active ? 'true' : 'false');
    if (birthdayStage) birthdayStage.setAttribute('aria-hidden', active ? 'false' : 'true');
  }

  function clearCanvas() {
    if (!context || !canvas) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function stopFireworks() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    burstTimers.forEach(function (timer) {
      window.clearTimeout(timer);
    });
    burstTimers = [];
    showEndTime = 0;
    particles = [];
    clearCanvas();
  }

  function resizeCanvas() {
    if (!canvas || !context || !currentActive) return;

    var rect = canvas.getBoundingClientRect();
    var width = Math.max(1, Math.round(rect.width || canvas.clientWidth || 1));
    var height = Math.max(1, Math.round(rect.height || canvas.clientHeight || 1));
    var pixelCapRatio = Math.sqrt(2200000 / Math.max(1, width * height));
    var ratio = Math.max(0.1, Math.min(window.devicePixelRatio || 1, 1.5, pixelCapRatio));

    canvasWidth = width;
    canvasHeight = height;
    var pixelWidth = Math.round(width * ratio);
    var pixelHeight = Math.round(height * ratio);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function randomBetween(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function createBurst() {
    if (!context || !currentActive || document.hidden) return;

    resizeCanvas();
    if (canvasWidth <= 1 || canvasHeight <= 1) return;

    var narrow = isNarrowDevice();
    var particleLimit = narrow ? 140 : 260;
    var desiredCount = narrow ? 28 : 46;
    var count = Math.max(0, Math.min(desiredCount, particleLimit - particles.length));
    var originX = randomBetween(canvasWidth * 0.12, canvasWidth * 0.88);
    var originY = randomBetween(canvasHeight * 0.12, canvasHeight * 0.58);
    var hues = [18, 42, 195, 214, 278, 318, 342];
    var baseHue = hues[Math.floor(Math.random() * hues.length)];

    for (var index = 0; index < count; index += 1) {
      var angle = (Math.PI * 2 * index / count) + randomBetween(-0.09, 0.09);
      var speed = randomBetween(narrow ? 1.4 : 1.7, narrow ? 4.2 : 5.1);
      var life = randomBetween(1050, 1850);
      particles.push({
        x: originX,
        y: originY,
        previousX: originX,
        previousY: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: randomBetween(0.025, 0.055),
        drag: randomBetween(0.975, 0.989),
        born: performance.now(),
        life: life,
        hue: baseHue + randomBetween(-12, 12),
        size: randomBetween(1.1, narrow ? 2.1 : 2.6)
      });
    }
  }

  function drawFrame(now) {
    animationFrame = 0;
    if (!currentActive || document.hidden || !context || !canvas) {
      stopFireworks();
      return;
    }

    resizeCanvas();
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.globalCompositeOperation = 'lighter';

    var alive = [];
    particles.forEach(function (particle) {
      var age = now - particle.born;
      if (age >= particle.life) return;

      particle.previousX = particle.x;
      particle.previousY = particle.y;
      particle.vx *= particle.drag;
      particle.vy = particle.vy * particle.drag + particle.gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;

      var alpha = Math.max(0, 1 - age / particle.life);
      context.beginPath();
      context.moveTo(particle.previousX, particle.previousY);
      context.lineTo(particle.x, particle.y);
      context.lineWidth = particle.size;
      context.lineCap = 'round';
      context.strokeStyle = 'hsla(' + particle.hue + ', 96%, 68%, ' + alpha + ')';
      context.stroke();
      alive.push(particle);
    });
    particles = alive;
    context.globalCompositeOperation = 'source-over';

    if (now < showEndTime || particles.length) {
      animationFrame = window.requestAnimationFrame(drawFrame);
    } else {
      stopFireworks();
    }
  }

  function replay() {
    if (!currentActive || !canvas || !context || isMotionLimited() || document.hidden) {
      stopFireworks();
      return false;
    }

    stopFireworks();
    resizeCanvas();
    showEndTime = performance.now() + SHOW_DURATION;
    BURST_DELAYS.forEach(function (delay) {
      burstTimers.push(window.setTimeout(createBurst, delay));
    });
    animationFrame = window.requestAnimationFrame(drawFrame);
    return true;
  }

  function sessionKey(value) {
    var parts = utc8Parts(value);
    return STORAGE_PREFIX + (parts ? parts.year : new Date().getUTCFullYear());
  }

  function scheduleAutoplay(now) {
    if (document.hidden || isMotionLimited()) return;

    if (forcePreview) {
      if (previewAutoPlayed) return;
      previewAutoPlayed = true;
    } else {
      var key = sessionKey(now);
      try {
        if (window.sessionStorage.getItem(key) === '1') return;
        window.sessionStorage.setItem(key, '1');
      } catch (error) {}
    }

    window.clearTimeout(autoplayTimer);
    autoplayTimer = window.setTimeout(function () {
      autoplayTimer = 0;
      if (currentActive) replay();
    }, 320);
  }

  function millisecondsToNextUtc8Midnight(now) {
    var shifted = new Date(now + UTC8_OFFSET);
    var nextMidnightShifted = Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate() + 1
    );
    return Math.max(250, nextMidnightShifted - (now + UTC8_OFFSET) + 40);
  }

  function scheduleRefresh(now) {
    window.clearTimeout(boundaryTimer);
    var delay = Math.min(MAX_TIMER_DELAY, millisecondsToNextUtc8Midnight(now));
    boundaryTimer = window.setTimeout(refresh, delay);
  }

  function refresh() {
    var now = Date.now();
    var active = shouldBeActive(now);
    var wasActive = currentActive;
    currentActive = active;
    syncVisibility(active);

    if (!active) {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      stopFireworks();
      if (cake) {
        cake.classList.remove('is-wished');
        cake.setAttribute('aria-pressed', 'false');
      }
      if (wishStatus) wishStatus.textContent = initialWishStatus;
    } else {
      resizeCanvas();
      if (!wasActive || forcePreview) scheduleAutoplay(now);
    }

    scheduleRefresh(now);
    return active;
  }

  function makeWish() {
    if (!currentActive) return;
    if (cake) {
      cake.classList.add('is-wished');
      cake.setAttribute('aria-pressed', 'true');
    }
    if (wishStatus) wishStatus.textContent = '愿望已收到 ✨';
    replay();
  }

  function handleResize() {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(function () {
      resizeFrame = 0;
      resizeCanvas();
    });
  }

  function initResizeTracking() {
    if (!canvas) return;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(birthdayStage || canvas);
    } else {
      window.addEventListener('resize', handleResize, { passive: true });
    }
  }

  function init() {
    cacheDom();
    initResizeTracking();

    if (cake) cake.addEventListener('click', makeWish);
    if (replayButton) replayButton.addEventListener('click', replay);

    window.addEventListener('pageshow', refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopFireworks();
      else refresh();
    });

    refresh();
  }

  var isLocalhost = /^(localhost|127(?:\.\d+){3}|\[?::1\]?|.+\.localhost)$/i
    .test(window.location.hostname);
  if (isLocalhost || forcePreview) {
    window.WYQBirthdayTest = {
      isActiveAt: isActiveAt,
      refresh: refresh,
      replay: replay
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
