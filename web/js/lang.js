/* 轻量语法高亮；诊断与格式化由 language-engine.js 提供。 */
window.LANG = (function () {
  'use strict';
  const C = window.CAIE;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const TOKEN_RE = new RegExp([
    '(\\/\\/[^\\n]*)',
    '("(?:[^"\\\\]|\\\\.)*"?)',
    "('(?:[^'\\\\]|\\\\.)*'?)",
    '(\\b\\d+\\.\\d+\\b|\\b\\d+\\b)',
    '(←|<-|<>|>=|<=|[+\\-*/=<>&^])',
    '([A-Za-z_][A-Za-z0-9_]*)'
  ].join('|'), 'g');

  function highlightLine(line) {
    let out = '';
    let last = 0;
    let match;
    TOKEN_RE.lastIndex = 0;
    while ((match = TOKEN_RE.exec(line)) !== null) {
      if (match.index > last) out += esc(line.slice(last, match.index));
      const text = esc(match[0]);
      if (match[1]) out += '<span class="tk-comment">' + text + '</span>';
      else if (match[2]) out += '<span class="tk-string">' + text + '</span>';
      else if (match[3]) out += '<span class="tk-char">' + text + '</span>';
      else if (match[4]) out += '<span class="tk-number">' + text + '</span>';
      else if (match[5]) out += '<span class="tk-op">' + text + '</span>';
      else {
        const word = match[6];
        if (C.isType(word) && word === word.toUpperCase()) out += '<span class="tk-type">' + text + '</span>';
        else if (C.isKeyword(word) && word === word.toUpperCase()) out += '<span class="tk-keyword">' + text + '</span>';
        else if (C.isBuiltin(word) && word === word.toUpperCase()) out += '<span class="tk-builtin">' + text + '</span>';
        else if (C.isKeyword(word) || C.isType(word)) out += '<span class="tk-keyword-lower">' + text + '</span>';
        else out += '<span class="tk-ident">' + text + '</span>';
      }
      last = match.index + match[0].length;
    }
    if (last < line.length) out += esc(line.slice(last));
    return out;
  }

  function highlight(source) {
    return source.split('\n').map(function (line) {
      return '<span class="hl-line">' + (highlightLine(line) || '​') + '</span>';
    }).join('\n');
  }

  return { highlight: highlight };
})();
