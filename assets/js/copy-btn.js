/* =========================================================
   Copy Button — adds copy buttons to:
   1. All <pre> code blocks (copies the code text)
   2. Quiz table rows with .q-copy class (copies question + answer)
   ========================================================= */
(function () {
  'use strict';

  // Helper: create a copy button element
  function createCopyBtn() {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', '复制');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span class="copy-btn__text">复制</span>';
    return btn;
  }

  // Helper: show "已复制" feedback
  function showCopied(btn) {
    btn.classList.add('is-copied');
    var textEl = btn.querySelector('.copy-btn__text');
    if (textEl) textEl.textContent = '已复制';
    setTimeout(function () {
      btn.classList.remove('is-copied');
      if (textEl) textEl.textContent = '复制';
    }, 2000);
  }

  // Copy text to clipboard
  function copyText(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showCopied(btn);
      });
    } else {
      // Fallback for older browsers
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopied(btn);
    }
  }

  // 1. Add copy buttons to all <pre> blocks
  var pres = document.querySelectorAll('.article pre');
  Array.prototype.forEach.call(pres, function (pre) {
    var wrapper = document.createElement('div');
    wrapper.className = 'pre-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    var btn = createCopyBtn();
    wrapper.appendChild(btn);
    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      var text = code ? code.textContent : pre.textContent;
      copyText(text, btn);
    });
  });

  // 2. Add copy buttons to quiz table rows
  var quizRows = document.querySelectorAll('.quiz-table tbody tr');
  Array.prototype.forEach.call(quizRows, function (row) {
    var cells = row.querySelectorAll('td');
    if (cells.length < 4) return;

    var td = document.createElement('td');
    td.className = 'q-copy-cell';
    var btn = createCopyBtn();
    btn.querySelector('.copy-btn__text').textContent = '复制';
    td.appendChild(btn);
    row.appendChild(td);

    btn.addEventListener('click', function () {
      var num = cells[0].textContent.trim();
      var type = cells[1].textContent.trim();
      var question = cells[2].textContent.trim();
      var answer = cells[3].textContent.trim();
      var text = '第' + num + '题 [' + type + ']\n' + question + '\n答案: ' + answer;
      copyText(text, btn);
    });
  });

  // Add header cell for copy column if quiz table exists
  var quizThead = document.querySelector('.quiz-table thead tr');
  if (quizThead && quizRows.length > 0) {
    var th = document.createElement('th');
    th.textContent = '操作';
    quizThead.appendChild(th);
  }
})();
