/* 编辑器、文件管理、真实语言诊断与格式化、阶段 4 真实运行 */
(function () {
'use strict';

const $ = function (id) { return document.getElementById(id); };
const STORE_KEY = 'caie9618.editor.v1';
const LANGUAGE = window.LANGUAGE_ADAPTER;
const RUNTIME = window.CAIERuntime;

/* ---------------- 状态 ---------------- */
const defaultSettings = {
   theme: 'light', fontSize: 14, lineNumbers: true,
   arrowConvert: true, autoIndent: true, autoPair: true, lint: false,
   // 课文文件分组：默认展开；归档的默认不显示
   lessonGroupOpen: true, showArchivedLessons: false
};

let state = {
   docs: [], activeId: null, runtimeFiles: [], settings: Object.assign({}, defaultSettings)
};

let diagnostics = [];
let run = { active: false, controller: null, pending: false, fileTouched: false };

/* ---------------- 持久化 ---------------- */
function clone(x) { return JSON.parse(JSON.stringify(x)); }

function load() {
   let saved = null;
   try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { saved = null; }
   if (saved && saved.docs && saved.docs.length) {
      state = {
         docs: saved.docs,
         activeId: saved.activeId || saved.docs[0].id,
         runtimeFiles: saved.runtimeFiles || clone(SAMPLES.runtimeFiles),
         settings: Object.assign({}, defaultSettings, saved.settings || {})
      };
   } else {
      state.docs = clone(SAMPLES.docs);
      state.runtimeFiles = clone(SAMPLES.runtimeFiles);
      state.activeId = state.docs[0].id;
   }
}

function persist() {
   try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}

/* 设置与偏好的写入：不属于文档修改，不改变「已保存 / 保存中」状态 */
function savePrefs() { persist(); }

let saveTimer = null;
function save(immediate) {
   $('saveState').textContent = '保存中…';
   $('saveState').classList.add('saving');
   clearTimeout(saveTimer);
   saveTimer = setTimeout(function () {
      persist();
      $('saveState').textContent = '已保存';
      $('saveState').classList.remove('saving');
   }, immediate ? 0 : 450);
}

function activeDoc() {
   return state.docs.find(function (d) { return d.id === state.activeId; }) || state.docs[0];
}

/* ---------------- 编辑器 ---------------- */
const code = $('code');
const highlight = $('highlight').querySelector('code');
const gutter = $('gutter');

function lineHeight() {
   return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--editor-line-height'), 10);
}

function renderEditor() {
   const src = code.value;
   highlight.innerHTML = LANG.highlight(src);
   const lines = src.split('\n');
   code.style.height = (lines.length * lineHeight()) + 'px';
   renderGutter(lines.length);
   renderLineMarks();
   renderFindMarks();
   renderSelectionMarks();
   updateCursor();
}

function renderGutter(count) {
   const cur = currentLine();
   const byLine = {};
   if (state.settings.lint) {
      const rank = { error: 3, caie: 2, hint: 1 };
      diagnostics.forEach(function (d) {
         if (!byLine[d.line] || rank[d.severity] > rank[byLine[d.line]]) byLine[d.line] = d.severity;
      });
   }
   let html = '';
   for (let i = 1; i <= count; i++) {
      const mk = byLine[i] ? '<span class="mk ' + byLine[i] + '"></span>' : '';
      html += '<span class="gl' + (i === cur ? ' cur' : '') + '">' + mk + i + '</span>';
   }
   gutter.innerHTML = html;
   gutter.classList.toggle('hidden', !state.settings.lineNumbers);
}

function renderLineMarks(runningLine) {
   const box = $('lineMarks');
   const lh = lineHeight();
   let html = '';
   if (state.settings.lint) {
      const seen = {};
      diagnostics.forEach(function (d) {
         if (d.severity === 'hint') return;
         if (seen[d.line] === 'error') return;
         seen[d.line] = d.severity;
      });
      Object.keys(seen).forEach(function (ln) {
         html += '<div class="lm ' + seen[ln] + '" style="top:' + ((ln - 1) * lh) + 'px"></div>';
      });
   }
   if (runningLine) html += '<div class="lm running" style="top:' + ((runningLine - 1) * lh) + 'px"></div>';
   box.innerHTML = html;
}

function currentLine() {
   return code.value.slice(0, code.selectionStart).split('\n').length;
}

function updateCursor() {
   const before = code.value.slice(0, code.selectionStart).split('\n');
   const ln = before.length, col = before[before.length - 1].length + 1;
   $('cursorPos').textContent = '行 ' + ln + '，列 ' + col;
   $('activeLine').style.top = ((ln - 1) * lineHeight() + 10) + 'px';
   Array.prototype.forEach.call(gutter.children, function (el, i) {
      el.classList.toggle('cur', i + 1 === ln);
   });
}

function scrollCaretIntoView() {
   const ln = currentLine();
   const scroll = $('editorScroll');
   const top = (ln - 1) * lineHeight();
   if (top < scroll.scrollTop) scroll.scrollTop = Math.max(0, top - 20);
   else if (top > scroll.scrollTop + scroll.clientHeight - 60) scroll.scrollTop = top - scroll.clientHeight + 80;
}

function setSelection(start, end) {
   code.focus();
   code.setSelectionRange(start, end === undefined ? start : end);
   updateCursor();
   scrollCaretIntoView();
}

/*
 * 所有对代码的程序化修改都要经过 applyEdit：
 * 直接给 textarea.value 赋值会清空浏览器自带的撤销栈，
 * 导致 Tab、自动缩进、自动配对、格式化、修复、替换全都无法 Ctrl+Z。
 * execCommand 是目前唯一能把修改写进原生撤销历史的方式。
 */
let programmaticEdit = false;

function applyEdit(start, end, text, caret) {
   code.focus();
   code.setSelectionRange(start, end);
   programmaticEdit = true;
   let ok = false;
   try {
      ok = text === ''
         ? document.execCommand('delete')
         : document.execCommand('insertText', false, text);
   } catch (e) { ok = false; }
   programmaticEdit = false;
   if (!ok) {
      // 退路：撤销栈会断，但至少内容正确
      code.value = code.value.slice(0, start) + text + code.value.slice(end);
      onEdit();
   }
   const pos = caret === undefined ? start + text.length : caret;
   code.setSelectionRange(pos, pos);
   updateCursor();
   scrollCaretIntoView();
}

function insertText(text, caretOffsetFromEnd) {
   const s = code.selectionStart, e = code.selectionEnd;
   applyEdit(s, e, text, s + text.length - (caretOffsetFromEnd || 0));
}

/* 判断某列是否落在字符串、字符字面量或注释中：← 转换与自动配对都要避开 */
function inLiteralOrComment(lineText, col) {
   let q = null;
   for (let i = 0; i < col; i++) {
      const c = lineText[i];
      if (q) { if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === '/' && lineText[i + 1] === '/') return true;
   }
   return q !== null;
}

function lineInfo() {
   const s = code.selectionStart;
   const start = code.value.lastIndexOf('\n', s - 1) + 1;
   let end = code.value.indexOf('\n', s);
   if (end === -1) end = code.value.length;
   return { start: start, end: end, text: code.value.slice(start, end), before: code.value.slice(start, s) };
}

const OPENERS = [
   { re: /^\s*IF\b.*\bTHEN\s*$/i, close: 'ENDIF' },
   { re: /^\s*(?:PUBLIC\s+|PRIVATE\s+)?PROCEDURE\b/i, close: 'ENDPROCEDURE' },
   { re: /^\s*(?:PUBLIC\s+|PRIVATE\s+)?FUNCTION\b/i, close: 'ENDFUNCTION' },
   { re: /^\s*WHILE\b/i, close: 'ENDWHILE' },
   { re: /^\s*CASE\s+OF\b/i, close: 'ENDCASE' },
   { re: /^\s*TYPE\s+[A-Za-z_]\w*\s*$/i, close: 'ENDTYPE' },
   { re: /^\s*CLASS\b/i, close: 'ENDCLASS' },
   { re: /^\s*REPEAT\s*$/i, close: 'UNTIL <condition>' },
   { re: /^\s*FOR\b/i, close: 'NEXT' },
   { re: /^\s*ELSE\s*$/i, close: null }
];

code.addEventListener('keydown', function (ev) {
   // 输入法合成期间不要接管任何按键，否则中文注释会被打断
   if (ev.isComposing || ev.keyCode === 229) return;

   const mod = ev.ctrlKey || ev.metaKey;

   if (mod && ev.key === 'f') { ev.preventDefault(); openFind(); return; }
   if (mod && ev.key === 'b') { ev.preventDefault(); toggleSidebar(); return; }
   if (mod && ev.key === 's') { ev.preventDefault(); save(true); toast('已保存到浏览器本地'); return; }
   if (mod && ev.key === 'Enter') { ev.preventDefault(); startRun(); return; }
   if (mod && ev.code === 'Space') { ev.preventDefault(); openSnippets(); return; }
   if (mod && ev.altKey && (ev.key === 'f' || ev.key === 'F' || ev.code === 'KeyF')) { ev.preventDefault(); formatSource(); return; }

   if (ev.key === 'Tab') {
      ev.preventDefault();
      const s = code.selectionStart, e = code.selectionEnd;
      if (s !== e && code.value.slice(s, e).indexOf('\n') >= 0) {
         indentSelection(ev.shiftKey);
      } else if (ev.shiftKey) {
         const li = lineInfo();
         const lead = (li.text.match(/^ */) || [''])[0].length;
         if (lead > 0) {
            // 退到上一个三空格停靠点，而不是固定删三个
            const cut = ((lead - 1) % 3) + 1;
            applyEdit(li.start, li.start + cut, '', Math.max(li.start, s - cut));
         }
      } else {
         insertText(CAIE.INDENT);
      }
      return;
   }

   if (ev.key === 'Enter' && state.settings.autoIndent) {
      const li = lineInfo();
      const indent = (li.text.match(/^ */) || [''])[0];
      const opener = OPENERS.find(function (o) { return o.re.test(li.text); });
      ev.preventDefault();
      if (opener && li.before.trim() === li.text.trim()) {
         const inner = indent + CAIE.INDENT;
         if (opener.close) {
            let closer = opener.close;
            if (closer === 'NEXT') {
               const m = li.text.match(/FOR\s+([A-Za-z_]\w*)/i);
               closer = m ? 'NEXT ' + m[1] : 'NEXT';
            }
            const rest = code.value.slice(li.end);
            const already = new RegExp('^\\s*\\n\\s*' + closer.split(' ')[0], 'i').test(rest);
            const tail = already ? '' : '\n' + indent + closer;
            insertText('\n' + inner + tail, tail.length);
         } else {
            insertText('\n' + inner);
         }
      } else {
         insertText('\n' + indent);
      }
      return;
   }

   const PAIRS = { '(': ')', '[': ']', '"': '"', "'": "'" };

   if (ev.key === 'Backspace' && code.selectionStart === code.selectionEnd) {
      const s = code.selectionStart;
      const li = lineInfo();
      const col = s - li.start;
      const before = li.text.slice(0, col);
      // 行首缩进区域内：一次退回一个三空格层级
      if (col > 0 && /^ +$/.test(before)) {
         ev.preventDefault();
         const cut = ((col - 1) % 3) + 1;
         applyEdit(s - cut, s, '');
         return;
      }
      // 光标夹在成对符号中间：两边一起删
      if (state.settings.autoPair) {
         const prev = code.value[s - 1], next = code.value[s];
         if (prev && PAIRS[prev] === next) {
            ev.preventDefault();
            applyEdit(s - 1, s + 1, '');
            return;
         }
      }
   }

   if (state.settings.autoPair && PAIRS[ev.key]) {
      const s = code.selectionStart, e = code.selectionEnd;
      if (s !== e) {
         // 有选区时用符号包裹选中的内容，而不是把它替换掉
         ev.preventDefault();
         const sel = code.value.slice(s, e);
         applyEdit(s, e, ev.key + sel + PAIRS[ev.key]);
         // 包裹后保持原来的选区，方便继续替换或再包一层
         code.setSelectionRange(s + 1, s + 1 + sel.length);
         updateCursor();
         return;
      }
      const next = code.value[s];
      const li = lineInfo();
      // 右侧紧跟单词或数字时不自动补全，避免把已有内容括进去
      const shouldClose = next === undefined || /[\s)\],:]/.test(next);
      const quoting = ev.key === '"' || ev.key === "'";
      if (shouldClose && !(quoting && inLiteralOrComment(li.text, s - li.start))) {
         ev.preventDefault();
         insertText(ev.key + PAIRS[ev.key], 1);
         return;
      }
   }

   if (state.settings.autoPair && [')', ']', '"', "'"].indexOf(ev.key) >= 0
      && code.selectionStart === code.selectionEnd
      && code.value[code.selectionStart] === ev.key) {
      ev.preventDefault();
      setSelection(code.selectionStart + 1);
      return;
   }
});

function indentSelection(remove) {
   const s = code.selectionStart, e = code.selectionEnd;
   const start = code.value.lastIndexOf('\n', s - 1) + 1;
   let end = code.value.indexOf('\n', e);
   if (end === -1) end = code.value.length;
   const block = code.value.slice(start, end).split('\n').map(function (l) {
      if (!remove) return CAIE.INDENT + l;
      const lead = (l.match(/^ */) || [''])[0].length;
      if (!lead) return l;
      return l.slice(((lead - 1) % 3) + 1);
   }).join('\n');
   if (block === code.value.slice(start, end)) return;
   applyEdit(start, end, block);
   code.setSelectionRange(start, start + block.length);
   updateCursor();
}

let composing = false;
code.addEventListener('compositionstart', function () { composing = true; });
code.addEventListener('compositionend', function () { composing = false; onEdit(); });

code.addEventListener('input', function () {
   if (composing) return;
   if (!programmaticEdit && state.settings.arrowConvert) {
      const pos = code.selectionStart;
      if (code.value.slice(pos - 2, pos) === '<-') {
         const li = lineInfo();
         // 字符串与注释里的 <- 保持原样
         if (!inLiteralOrComment(li.text, pos - 2 - li.start)) {
            applyEdit(pos - 2, pos, '←');
            return;
         }
      }
   }
   onEdit();
});

/* 粘贴：制表符按 CAIE 规则转成三空格，并统一换行 */
code.addEventListener('paste', function (ev) {
   const raw = (ev.clipboardData || window.clipboardData);
   if (!raw) return;
   const text = raw.getData('text');
   if (text == null) return;
   const norm = text.replace(/\r\n?/g, '\n').replace(/\t/g, CAIE.INDENT);
   if (norm === text) return;
   ev.preventDefault();
   applyEdit(code.selectionStart, code.selectionEnd, norm);
});

['click', 'keyup', 'select'].forEach(function (evt) {
   code.addEventListener(evt, function () {
      updateCursor();
      renderGutter(code.value.split('\n').length);
   });
});

let lintTimer = null;
function onEdit() {
   const doc = activeDoc();
   doc.source = code.value;
   doc.updatedAt = Date.now();
   renderEditor();
   save();
   clearTimeout(lintTimer);
   lintTimer = setTimeout(runLint, 250);
}

/* ---------------- 诊断 ---------------- */
function runLint() {
   diagnostics = LANGUAGE.diagnose(code.value);
   renderProblems();
   renderGutter(code.value.split('\n').length);
   renderLineMarks();
}

let problemFilter = 'all';

function renderProblems() {
   const on = state.settings.lint;
   document.documentElement.setAttribute('data-lint', on ? 'on' : 'off');
   const list = $('problemList'), empty = $('problemsEmpty');
   const badge = $('tabProblemBadge'), count = $('problemCount');

   if (!on) {
      list.innerHTML = '';
      empty.hidden = false;
      empty.textContent = '语法检测已关闭。写作时不显示任何诊断。';
      $('problemSummary').hidden = true;
      setBadge(badge, 0);
      count.textContent = '0';
      count.className = 'problem-count is-empty';
      return;
   }
   const counts = { error: 0, caie: 0, hint: 0 };
   diagnostics.forEach(function (d) { counts[d.severity]++; });
   count.textContent = diagnostics.length;
   count.className = 'problem-count' + (diagnostics.length === 0 ? ' is-clean' : '');
   setBadge(badge, counts.error);

   $('problemSummary').hidden = false;
   $('pcAll').textContent = diagnostics.length;
   $('pcError').textContent = counts.error;
   $('pcCaie').textContent = counts.caie;
   $('pcHint').textContent = counts.hint;
   Array.prototype.forEach.call($('problemSummary').children, function (b) {
      b.classList.toggle('is-on', b.dataset.filter === problemFilter);
   });

   if (!diagnostics.length) {
      list.innerHTML = '';
      empty.hidden = false;
      empty.textContent = '没有发现问题。';
      return;
   }

   const shown = diagnostics
      .map(function (d, i) { return { d: d, i: i }; })
      .filter(function (x) { return problemFilter === 'all' || x.d.severity === problemFilter; });

   if (!shown.length) {
      list.innerHTML = '';
      empty.hidden = false;
      empty.textContent = '当前筛选下没有条目。';
      return;
   }
   empty.hidden = true;
   const icons = { error: '✕', caie: '!', hint: 'i' };
   const names = { error: '阻断错误', caie: 'CAIE 规范', hint: '建议' };
   list.innerHTML = shown.map(function (x) {
      const d = x.d;
      return '<li class="sev-' + d.severity + '" data-i="' + x.i + '">' +
         '<span class="sev-icon">' + icons[d.severity] + '</span>' +
         '<div><div class="problem-msg">' + escapeHtml(d.message) + '</div>' +
         '<div class="problem-meta">' +
         '<span class="sev-chip">' + names[d.severity] + '</span>' +
         '<span>行 ' + d.line + '，列 ' + d.col + '</span>' +
         '<span class="origin-tag ' + (d.origin === 'CAIE' ? 'caie' : 'rt') + '">' + d.origin + '</span>' +
         '<span>' + escapeHtml(d.ruleId || d.code || '') + '</span>' +
         (d.fix ? '<button class="fix-btn" data-fix="' + x.i + '">修复</button>' : '') +
         '</div></div></li>';
   }).join('');
}

$('problemSummary').addEventListener('click', function (ev) {
   const b = ev.target.closest('[data-filter]');
   if (!b) return;
   problemFilter = b.dataset.filter;
   renderProblems();
});

$('problemList').addEventListener('click', function (ev) {
   const fixBtn = ev.target.closest('[data-fix]');
   if (fixBtn) { ev.stopPropagation(); applyFix(diagnostics[+fixBtn.dataset.fix]); return; }
   const li = ev.target.closest('li[data-i]');
   if (li) jumpTo(diagnostics[+li.dataset.i]);
});

function lineStartOffset(line) {
   const lines = code.value.split('\n');
   let off = 0;
   for (let i = 0; i < line - 1 && i < lines.length; i++) off += lines[i].length + 1;
   return off;
}

function jumpTo(d) {
   if (!d) return;
   setSelection(Number.isInteger(d.startOffset) ? d.startOffset : lineStartOffset(d.line) + (d.col - 1));
}

function applyFix(d) {
   if (!d || !d.fix) return;
   const f = d.fix;
   const off = Number.isInteger(f.startOffset) ? f.startOffset : lineStartOffset(f.line) + (f.col - 1);
   const end = Number.isInteger(f.endOffset) ? f.endOffset : off + f.length;
   applyEdit(off, end, f.text);
   runLint();
   toast('已应用修复');
}

/* ---------------- 格式化 ---------------- */
function formatSource() {
   const result = LANGUAGE.format(code.value);
   const next = result.formattedSource;
   if (next !== code.value) {
      const caret = code.selectionStart;
      applyEdit(0, code.value.length, next, Math.min(caret, next.length));
   }
   runLint();
   toast(result.safeMode === 'token-only'
      ? '存在阻断语法错误，仅应用了安全格式修复'
      : (result.changed ? '已按 CAIE 规范格式化' : '代码格式已符合规范'));
}

/* ---------------- 代码文件面板 ---------------- */
function ownDocs() { return state.docs.filter(function (d) { return !d.lesson; }); }
function lessonDocs() { return state.docs.filter(function (d) { return d.lesson; }); }

function docRow(d) {
   const tip = d.lesson ? (d.lessonLabel || '来自课文') + '：' + d.name : d.name;
   const actions = d.lesson
      ? '<button class="icon-btn small" data-act="restore" data-tip="恢复成课文里的原始内容" aria-label="恢复原始">↺</button>' +
        '<button class="icon-btn small" data-act="' + (d.archived ? 'unarchive' : 'archive') + '" data-tip="' +
        (d.archived ? '取消归档，重新显示在列表里' : '归档：从列表里收起来') + '" aria-label="' +
        (d.archived ? '取消归档' : '归档') + '">' + (d.archived ? '↩' : '×') + '</button>'
      : '<button class="icon-btn small" data-act="rename" data-tip="重命名" aria-label="重命名">✎</button>' +
        '<button class="icon-btn small" data-act="delete" data-tip="删除" aria-label="删除">✕</button>';
   return '<li data-id="' + d.id + '"' + (d.id === state.activeId ? ' class="active"' : '') +
      (d.archived ? ' data-archived="true"' : '') + '>' +
      '<span class="fname" data-tip="' + escapeHtml(tip) + '">' + escapeHtml(d.name) + '</span>' +
      '<span class="row-actions">' + actions + '</span></li>';
}

function renderFiles() {
   const lessons = lessonDocs();
   const archived = lessons.filter(function (d) { return d.archived; });
   const visibleLessons = state.settings.showArchivedLessons
      ? lessons
      : lessons.filter(function (d) { return !d.archived; });

   let html = ownDocs().map(docRow).join('');

   if (lessons.length) {
      const open = state.settings.lessonGroupOpen !== false;
      html +=
         '<li class="file-group' + (open ? ' open' : '') + '" data-group="lesson">' +
         '<button class="file-group-head" data-act="toggle-lesson">' +
         '<span class="caret">›</span><span class="file-group-name">课文文件</span>' +
         '<span class="file-group-count">' + visibleLessons.length + '</span></button>' +
         (archived.length
            ? '<button class="file-group-archived" data-act="toggle-archived">' +
              (state.settings.showArchivedLessons ? '隐藏已归档' : '已归档 ' + archived.length) + '</button>'
            : '') +
         '</li>';
      if (open) html += visibleLessons.map(docRow).join('');
   }

   $('fileList').innerHTML = html;
   $('docName').value = activeDoc().name;
   $('docName').readOnly = !!activeDoc().lesson;
   $('docName').title = activeDoc().lesson ? '课文带过来的文件不能改名' : '';
}

$('fileList').addEventListener('click', function (ev) {
   const groupAct = ev.target.closest('[data-act="toggle-lesson"], [data-act="toggle-archived"]');
   if (groupAct) {
      if (groupAct.dataset.act === 'toggle-lesson') {
         state.settings.lessonGroupOpen = state.settings.lessonGroupOpen === false;
      } else {
         state.settings.showArchivedLessons = !state.settings.showArchivedLessons;
      }
      renderFiles();
      savePrefs();
      return;
   }
   const li = ev.target.closest('li[data-id]');
   if (!li) return;
   const doc = state.docs.find(function (d) { return d.id === li.dataset.id; });
   const act = ev.target.closest('[data-act]');
   if (act && (act.dataset.act === 'archive' || act.dataset.act === 'unarchive')) {
      doc.archived = act.dataset.act === 'archive';
      if (doc.archived && state.activeId === doc.id) {
         const fallback = state.docs.find(function (d) { return d.id !== doc.id && !d.archived; });
         if (fallback) openDoc(fallback.id);
      }
      renderFiles();
      save();
      if (doc.archived) {
         toast('已归档 ' + doc.name, '撤销', function () {
            doc.archived = false;
            renderFiles();
            save();
         });
      }
      return;
   }
   if (act && act.dataset.act === 'restore') {
      askConfirm({
         title: '恢复原始内容',
         body: '把「' + doc.name + '」恢复成课文里的那段代码？你在这个文件里做的改动会丢失。',
         okLabel: '恢复'
      }).then(function (ok) {
         if (!ok) return;
         doc.source = doc.origin;
         if (state.activeId === doc.id) { code.value = doc.source; renderEditor(); runLint(); }
         save();
         toast('已恢复成课文里的原始内容');
      });
      return;
   }
   if (act && doc.lesson && (act.dataset.act === 'rename' || act.dataset.act === 'delete')) {
      toast('课文带过来的文件不能改名或删除；可以用 ↺ 恢复原始内容');
      return;
   }
   if (act && act.dataset.act === 'rename') {
      askText({
         title: '重命名代码文件',
         desc: '文件名会自动补上 .pseudocode 后缀。',
         value: doc.name,
         validate: function (v) {
            return nameTaken(state.docs, ensureExt(v), doc.id, true) ? DOC_DUP_MSG : null;
         }
      })
         .then(function (name) {
            if (!name) return;
            doc.name = ensureExt(name);
            renderFiles();
            save();
         });
      return;
   }
   if (act && act.dataset.act === 'delete') {
      if (state.docs.length === 1) { toast('至少保留一个代码文件'); return; }
      askConfirm({
         title: '删除代码文件',
         body: '确定删除「' + doc.name + '」？删除后可在提示中撤销，关闭提示后无法恢复。',
         okLabel: '删除'
      }).then(function (ok) {
         if (!ok) return;
         const removed = doc, index = state.docs.indexOf(doc);
         state.docs.splice(index, 1);
         if (state.activeId === removed.id) state.activeId = state.docs[0].id;
         openDoc(state.activeId);
         toast('已删除 ' + removed.name, '撤销', function () {
            state.docs.splice(index, 0, removed);
            openDoc(removed.id);
         });
      });
      return;
   }
   openDoc(doc.id);
});

function ensureExt(name) {
   return /\.(pseudocode|txt)$/i.test(name) ? name : name + '.pseudocode';
}

function stripExt(name) {
   const dot = String(name).lastIndexOf('.');
   return dot > 0 ? String(name).slice(0, dot) : String(name);
}

/*
 * 文件名一律不区分大小写比较。
 * byBase = true 时连后缀一起忽略：代码文件里 Main.pseudocode 与 Main.txt 是同一份文档，
 * 不允许同时存在。运行时数据文件按全名比较，因为伪代码里用 "Names.txt" 这样的完整字面量打开文件，
 * Names.txt 和 Names.dat 是两个不同的文件。
 */
function nameKey(name, byBase) {
   return (byBase ? stripExt(name) : String(name)).toLowerCase();
}

function nameTaken(list, name, excludeId, byBase) {
   const key = nameKey(name, byBase);
   return list.some(function (x) { return x.id !== excludeId && nameKey(x.name, byBase) === key; });
}

/* 导入等自动流程使用：Main.pseudocode → Main (2).pseudocode */
function uniqueName(list, name, byBase) {
   if (!nameTaken(list, name, null, byBase)) return name;
   const dot = name.lastIndexOf('.');
   const base = dot > 0 ? name.slice(0, dot) : name;
   const ext = dot > 0 ? name.slice(dot) : '';
   for (let i = 2; i < 1000; i++) {
      const candidate = base + ' (' + i + ')' + ext;
      if (!nameTaken(list, candidate, null, byBase)) return candidate;
   }
   return base + '-' + Date.now() + ext;
}

const DOC_DUP_MSG = '已存在同名代码文件（.pseudocode 与 .txt 视为同一个名字）。';

function openDoc(id) {
   state.activeId = id;
   const doc = activeDoc();
   code.value = doc.source;
   $('docName').value = doc.name;
   renderFiles();
   renderEditor();
   runLint();
   resetRunPanel();
   save();
}

$('newDocBtn').addEventListener('click', function () {
   askText({
      title: '新建代码文件',
      desc: '文件名会自动补上 .pseudocode 后缀。',
      value: uniqueName(state.docs, 'Untitled.pseudocode', true),
      validate: function (v) {
         return nameTaken(state.docs, ensureExt(v), null, true) ? DOC_DUP_MSG : null;
      }
   })
      .then(function (name) {
         if (!name) return;
         const doc = { id: 'doc-' + Date.now(), name: ensureExt(name), source: '// ' + ensureExt(name) + '\n', updatedAt: Date.now() };
         state.docs.push(doc);
         openDoc(doc.id);
      });
});

$('docName').addEventListener('input', function (ev) {
   if (ev.isComposing || ev.keyCode === 229) return;
   sanitizeNameInput($('docName'));
});
$('docName').addEventListener('compositionend', function () {
   sanitizeNameInput($('docName'));
});
$('docName').addEventListener('change', function () {
   const doc = activeDoc();
   const next = ensureExt($('docName').value.trim() || 'Untitled');
   if (next.toLowerCase() === doc.name.toLowerCase()) { doc.name = next; renderFiles(); save(); return; }
   if (nameTaken(state.docs, next, doc.id, true)) {
      $('docName').value = doc.name;
      toast('已存在同名代码文件（不区分后缀），名称未更改');
      return;
   }
   doc.name = next;
   renderFiles();
   save();
});

/* ---------------- 运行（阶段 4 真实解释器） ---------------- */
function resetRunPanel() {
   $('console').innerHTML = '';
   $('runStatus').textContent = '尚未运行。点击「运行」查看输出。';
   $('runStatus').className = 'run-status';
   setInputWaiting(false);
   $('varTable').hidden = true;
   $('stackBox').hidden = true;
   $('varsEmpty').hidden = false;
   renderLineMarks();
   renderHandles([]);
}

function println(text, cls) {
   const el = document.createElement('span');
   el.className = (cls || 'out') + '-line';
   el.textContent = text;
   $('console').appendChild(el);
   $('console').scrollTop = $('console').scrollHeight;
}

function setStatus(text, cls) {
   $('runStatus').textContent = text;
   $('runStatus').className = 'run-status' + (cls ? ' ' + cls : '');
}

function startRun() {
   if (run.active) return;
   showTab('output');
   $('console').innerHTML = '';
   run = { active: true, controller: null, pending: false, fileTouched: false };
   $('runBtn').hidden = true;
   $('stopBtn').hidden = false;

   const diags = LANGUAGE.diagnose(code.value);
   const blocking = diags.filter(function (d) { return d.severity === 'error'; });
   if (blocking.length) {
      diagnostics = diags;
      renderProblems();
      renderGutter(code.value.split('\n').length);
      renderLineMarks();
      setStatus('运行已停止：存在 ' + blocking.length + ' 个阻断错误', 'error');
      println('运行前检查发现阻断错误：', 'err');
      blocking.slice(0, 5).forEach(function (d) { println('  行 ' + d.line + '：' + d.message, 'err'); });
      if (!state.settings.lint) println('（语法检测处于关闭状态，因此只显示阻断运行的错误。）', 'sys');
      finishRun({ status: 'preflight-error' });
      showTab('problems');
      return;
   }

   setStatus('运行中…', 'running');
   const controller = RUNTIME.executeSource(code.value, {
      onEvent: handleRuntimeEvent,
      virtualFiles: clone(state.runtimeFiles)
   });
   run.controller = controller;
   controller.result.then(finishRun);
}

$('inputSend').addEventListener('click', submitInput);
$('inputBox').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') submitInput(); });
function submitInput() {
   if (!run.active || !run.pending || !run.controller) return;
   const value = $('inputBox').value;
   const result = run.controller.provideInput(value);
   if (!result.accepted) {
      toast(runtimeMessage(result));
      $('inputBox').focus();
      $('inputBox').select();
      return;
   }
   println('> ' + value, 'in');
   run.pending = false;
   setInputWaiting(false);
}

$('stopBtn').addEventListener('click', function () {
   if (run.controller) run.controller.stop();
});
$('runBtn').addEventListener('click', startRun);

function handleRuntimeEvent(event) {
   const line = event.range && event.range.start ? event.range.start.line : 1;
   if (event.type === 'statement-entered' || event.type === 'condition-checked') renderLineMarks(line);
   if (event.type === 'variable-declared' || event.type === 'variable-changed') {
      renderRuntimeVariables(event.data.variables || [], event.data.stack);
   }
   if (event.type === 'frame-entered' || event.type === 'frame-exited') {
      renderRuntimeVariables(event.data.variables || [], event.data.stack);
   }
   if (event.type === 'file-opened' || event.type === 'file-position-changed' ||
      event.type === 'file-written' || event.type === 'file-closed') {
      renderHandles(event.data.handles || []);
      if (event.type === 'file-written' || event.data.changed) run.fileTouched = true;
   }
   if (event.type === 'output-written') println(event.data.text);
   if (event.type === 'input-requested') {
      run.pending = true;
      setStatus('等待输入 · ' + event.data.variable + ' : ' + event.data.type, 'running');
      setInputWaiting(true, event.data.variable);
   }
   if (event.type === 'input-accepted') setStatus('运行中…', 'running');
   if (event.type === 'runtime-error') {
      const error = event.data.error;
      println('运行时错误 ' + error.code + '（行 ' + error.range.start.line + '）：' + runtimeMessage(error), 'err');
      setStatus('运行时错误 · 行 ' + error.range.start.line, 'error');
   }
   if (event.type === 'run-stopped') {
      println('运行已被用户停止。', 'sys');
      setStatus('已停止', 'error');
   }
}

function finishRun(result) {
   const fileTouched = run.fileTouched;
   run.active = false;
   run.controller = null;
   run.pending = false;
   $('runBtn').hidden = false;
   $('stopBtn').hidden = true;
   setInputWaiting(false);
   renderHandles([]);
   renderLineMarks();
   if (result.variables) renderRuntimeVariables(result.variables);
   if (result.status === 'completed') {
      if (result.virtualFiles) {
         state.runtimeFiles = clone(result.virtualFiles);
         renderRuntimeFiles();
         save(true);
      }
      setStatus('运行结束 · 活动用时 ' + Math.round(result.activeTimeMs) + ' ms · ' + result.steps + ' 步 · 状态 正常', 'done');
   } else if (fileTouched && result.fileChangesCommitted === false) {
      println('本次运行的虚拟文件改动未提交，文件已恢复到运行前状态。', 'sys');
   }
}

function renderRuntimeVariables(variables, stack) {
   renderVars(variables.map(function (variable) {
      return {
         name: variable.name,
         kind: variable.kind === 'constant' ? 'CONSTANT' : variable.kind === 'loop-variable' ? '循环变量' : '变量',
         type: variable.type,
         value: variable.displayValue
      };
   }), stack || ['<main>']);
}

function renderVars(vars, stack) {
   const tbl = $('varTable');
   tbl.hidden = false;
   $('varsEmpty').hidden = true;
   tbl.querySelector('tbody').innerHTML = vars.map(function (v) {
      return '<tr><td>' + escapeHtml(v.name) + '</td><td>' + escapeHtml(v.kind) + '</td><td>' +
         escapeHtml(v.type) + '</td><td>' + escapeHtml(String(v.value)) + '</td></tr>';
   }).join('');
   if (stack) {
      $('stackBox').hidden = false;
      $('stackList').innerHTML = stack.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('');
   }
}

/* ---------------- 运行时虚拟文件 ---------------- */
function renderRuntimeFiles() {
   $('rtFileList').innerHTML = state.runtimeFiles.map(function (f) {
      const size = f.kind === 'text' ? (f.lines || []).length + ' 行' : (f.records || []).length + ' 记录';
      return '<li data-id="' + f.id + '">' +
         '<span class="fname" data-tip="' + escapeHtml(f.name) + '">' + escapeHtml(f.name) + '</span>' +
         '<span class="rt-kind">' + (f.kind === 'text' ? 'TEXT' : 'RANDOM') + '</span>' +
         '<span class="rt-size">' + size + '</span>' +
         '<button class="icon-btn small" data-act="view" data-tip="查看或编辑内容" aria-label="查看内容">⋯</button>' +
         '<button class="icon-btn small" data-act="del" data-tip="删除" aria-label="删除">✕</button>' +
         '</li>';
   }).join('');
}

$('rtFileList').addEventListener('click', function (ev) {
   const li = ev.target.closest('li[data-id]');
   if (!li) return;
   const f = state.runtimeFiles.find(function (x) { return x.id === li.dataset.id; });
   const act = ev.target.closest('[data-act]');
   if (!act) { openRuntimeFile(f); return; }
   if (act.dataset.act === 'del') {
      askConfirm({
         title: '删除运行时文件',
         body: '确定删除「' + f.name + '」？该文件的内容会一并丢失，且无法撤销。',
         okLabel: '删除'
      }).then(function (ok) {
         if (!ok) return;
         state.runtimeFiles = state.runtimeFiles.filter(function (x) { return x.id !== f.id; });
         renderRuntimeFiles();
         save();
         toast('已删除运行时文件 ' + f.name);
      });
      return;
   }
   openRuntimeFile(f);
});

function renderFilePreview(f) {
   const box = $('filePreview');
   const rows = f.kind === 'text' ? (f.lines || []) : (f.records || []);
   $('fileDialogCount').textContent = f.kind === 'text'
      ? rows.length + ' 行'
      : rows.length + ' 条记录（位置从 1 开始）';
   if (!rows.length) {
      box.innerHTML = '<div class="pv-empty">文件为空。切换到「编辑」可以写入内容。</div>';
      return;
   }
   box.innerHTML = rows.map(function (row, i) {
      const text = f.kind === 'text' ? row : JSON.stringify(row);
      const empty = text === '' ? ' empty' : '';
      return '<div class="pv"><span class="pv-no">' + (i + 1) + '</span>' +
         '<span class="pv-val' + empty + '">' + (text === '' ? '（空行）' : escapeHtml(text)) + '</span></div>';
   }).join('');
}

function setFileMode(mode) {
   Array.prototype.forEach.call($('fileMode').children, function (b) {
      b.setAttribute('aria-checked', String(b.dataset.value === mode));
   });
   $('filePreview').hidden = mode !== 'preview';
   $('fileDialogBody').hidden = mode !== 'edit';
   $('fileDialogSave').hidden = mode !== 'edit';
}

$('fileMode').addEventListener('click', function (ev) {
   const b = ev.target.closest('button[data-value]');
   if (b) setFileMode(b.dataset.value);
});

function openRuntimeFile(f) {
   $('fileDialogTitle').textContent = f.name;
   $('fileDialogMeta').textContent = f.kind === 'text'
      ? '文本文件 · 每行一条记录 · 由 READFILE / WRITEFILE 访问'
      : '随机文件 · 记录类型 ' + (f.recordType || '未指定') + ' · 每行一条 JSON 记录 · 1-based 位置（Editor Runtime 约定）';
   $('fileDialogBody').value = f.kind === 'text'
      ? (f.lines || []).join('\n')
      : (f.records || []).map(function (r) { return JSON.stringify(r); }).join('\n');
   $('fileDialogError').textContent = '';
   renderFilePreview(f);
   setFileMode('preview');
   $('fileDialogSave').onclick = function () {
      const raw = $('fileDialogBody').value;
      if (f.kind === 'text') {
         f.lines = raw === '' ? [] : raw.split('\n');
      } else {
         try {
            f.records = raw.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return JSON.parse(l); });
         } catch (e) {
            $('fileDialogError').textContent = '每行必须是一个合法的 JSON 记录对象。';
            return;
         }
      }
      renderRuntimeFiles();
      renderFilePreview(f);
      setFileMode('preview');
      save();
      toast('已保存 ' + f.name);
   };
   showDialog('fileDialog');
}

$('newRuntimeFile').addEventListener('click', function () {
   askText({
      title: '新建运行时文件',
      desc: '.txt 建立文本文件，.dat 建立随机文件。',
      value: uniqueName(state.runtimeFiles, 'Data.txt'),
      validate: function (v) {
         return nameTaken(state.runtimeFiles, v) ? '已存在同名运行时文件。' : null;
      }
   })
      .then(function (name) {
         if (!name) return;
         const isRandom = /\.dat$/i.test(name);
         state.runtimeFiles.push(isRandom
            ? { id: 'rf-' + Date.now(), name: name, kind: 'records', recordType: '', records: [] }
            : { id: 'rf-' + Date.now(), name: name, kind: 'text', lines: [] });
         renderRuntimeFiles();
         save();
      });
});

function renderHandles(handles) {
   const tb = $('handleTable').querySelector('tbody');
   tb.innerHTML = handles.map(function (h) {
      return '<tr><td>' + escapeHtml(h.name) + '</td><td>' + h.mode + '</td><td>' + h.position + '</td></tr>';
   }).join('');
   $('handleTable').hidden = handles.length === 0;
   $('handleEmpty').hidden = handles.length > 0;
}

/* ---------------- 标签与面板 ---------------- */
document.querySelectorAll('.tab').forEach(function (t) {
   t.addEventListener('click', function () { showTab(t.dataset.tab); });
});
function showTab(name) {
   $('results').classList.remove('collapsed');
   document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === name); });
   document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.toggle('active', p.id === 'panel-' + name); });
}
$('toggleResults').addEventListener('click', function () { $('results').classList.toggle('collapsed'); });
function toggleSidebar() { $('sidebar').classList.toggle('collapsed'); }
$('toggleFiles').addEventListener('click', toggleSidebar);

/* ---------------- 语法检测开关 ---------------- */
$('lintToggle').addEventListener('click', function () {
   const on = this.getAttribute('aria-checked') !== 'true';
   this.setAttribute('aria-checked', String(on));
   state.settings.lint = on;
   savePrefs();
   runLint();
   if (on) showTab('problems');
});

/* ---------------- 查找替换 ---------------- */
let matches = [], matchIndex = -1, charWidth = 0;

/* 等宽字体的字符宽度：用于在编辑器里自行绘制匹配高亮 */
function measureCharWidth() {
   const probe = document.createElement('span');
   probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;'
      + 'font-family:var(--font-mono);font-size:var(--editor-font-size);line-height:var(--editor-line-height);';
   probe.textContent = 'M'.repeat(50);
   $('codeArea').appendChild(probe);
   charWidth = probe.getBoundingClientRect().width / 50;
   probe.remove();
}

function lineStarts() {
   const arr = [0];
   const v = code.value;
   for (let i = 0; i < v.length; i++) if (v[i] === '\n') arr.push(i + 1);
   return arr;
}

function renderSelectionMarks() {
   const box = $('selectionMarks');
   if (document.activeElement !== code || code.selectionStart === code.selectionEnd || !charWidth) {
      box.innerHTML = '';
      return;
   }
   const start = Math.min(code.selectionStart, code.selectionEnd);
   const end = Math.max(code.selectionStart, code.selectionEnd);
   const starts = lineStarts();
   const lh = lineHeight();
   let html = '';
   starts.forEach(function (lineStart, lineIndex) {
      const lineEnd = lineIndex + 1 < starts.length ? starts[lineIndex + 1] - 1 : code.value.length;
      if (end <= lineStart || start > lineEnd) return;
      const segmentStart = Math.max(start, lineStart);
      const segmentEnd = Math.min(end, lineEnd);
      const col = segmentStart - lineStart;
      const includesNewline = lineIndex + 1 < starts.length && end > lineEnd;
      const chars = Math.max(includesNewline ? 1 : 0, segmentEnd - segmentStart);
      html += '<div class="sm" style="top:' + (lineIndex * lh) + 'px;left:'
         + (16 + col * charWidth).toFixed(1) + 'px;width:' + Math.max(2, chars * charWidth).toFixed(1) + 'px"></div>';
   });
   box.innerHTML = html;
}

document.addEventListener('selectionchange', renderSelectionMarks);
code.addEventListener('select', renderSelectionMarks);
code.addEventListener('keyup', renderSelectionMarks);
code.addEventListener('mouseup', renderSelectionMarks);
code.addEventListener('blur', renderSelectionMarks);

function renderFindMarks() {
   const box = $('findMarks');
   if ($('findBar').hidden || !matches.length || !charWidth) { box.innerHTML = ''; return; }
   const q = $('findInput').value;
   const starts = lineStarts();
   const lh = lineHeight();
   let html = '';
   matches.slice(0, 500).forEach(function (off, i) {
      let ln = 0;
      // starts 递增，线性扫描足够（单文档规模）
      for (let k = starts.length - 1; k >= 0; k--) { if (starts[k] <= off) { ln = k; break; } }
      const col = off - starts[ln];
      const left = 16 + col * charWidth;
      const width = Math.max(2, q.length * charWidth);
      html += '<div class="fm' + (i === matchIndex ? ' current' : '') + '" style="top:' + (ln * lh)
         + 'px;left:' + left.toFixed(1) + 'px;width:' + width.toFixed(1) + 'px"></div>';
   });
   box.innerHTML = html;
}

function scrollMatchIntoView() {
   if (matchIndex < 0) return;
   const starts = lineStarts();
   const off = matches[matchIndex];
   let ln = 0;
   for (let k = starts.length - 1; k >= 0; k--) { if (starts[k] <= off) { ln = k; break; } }
   const scroll = $('editorScroll');
   const top = ln * lineHeight();
   if (top < scroll.scrollTop) scroll.scrollTop = Math.max(0, top - 20);
   else if (top > scroll.scrollTop + scroll.clientHeight - 60) scroll.scrollTop = top - scroll.clientHeight + 80;
}

function openFind() {
   $('findBar').hidden = false;
   $('findInput').focus();
   $('findInput').select();
   doFind();
}
$('findClose').addEventListener('click', function () {
   $('findBar').hidden = true;
   matches = [];
   matchIndex = -1;
   renderFindMarks();
   code.focus();
});
$('findInput').addEventListener('input', doFind);
$('findNext').addEventListener('click', function () { step(1); });
$('findPrev').addEventListener('click', function () { step(-1); });
$('findInput').addEventListener('keydown', function (ev) {
   if (ev.key === 'Enter') { ev.preventDefault(); step(ev.shiftKey ? -1 : 1); }
   if (ev.key === 'Escape') { $('findBar').hidden = true; code.focus(); }
});
function doFind() {
   const q = $('findInput').value;
   matches = [];
   if (q) {
      const hay = code.value.toLowerCase(), needle = q.toLowerCase();
      let i = hay.indexOf(needle);
      while (i !== -1) { matches.push(i); i = hay.indexOf(needle, i + Math.max(1, needle.length)); }
   }
   matchIndex = matches.length ? 0 : -1;
   updateFindCount();
   renderFindMarks();
   scrollMatchIntoView();
   // 注意：不调用 setSelection，否则焦点会被编辑器抢走，后续按键写进代码
}
function step(dir) {
   if (!matches.length) return;
   matchIndex = (matchIndex + dir + matches.length) % matches.length;
   updateFindCount();
   renderFindMarks();
   scrollMatchIntoView();
}
function updateFindCount() {
   $('findCount').textContent = (matches.length ? matchIndex + 1 : 0) + ' / ' + matches.length;
}
$('replaceOne').addEventListener('click', function () {
   if (matchIndex < 0) return;
   const q = $('findInput').value, r = $('replaceInput').value;
   const at = matches[matchIndex];
   const keep = matchIndex;
   applyEdit(at, at + q.length, r);
   doFind();
   if (matches.length) {
      matchIndex = Math.min(keep, matches.length - 1);
      updateFindCount();
      renderFindMarks();
      scrollMatchIntoView();
   }
   $('findInput').focus();
});
$('replaceAll').addEventListener('click', function () {
   const q = $('findInput').value, r = $('replaceInput').value;
   if (!q) return;
   const n = matches.length;
   const next = code.value.split(q).join(r);
   applyEdit(0, code.value.length, next);
   doFind();
   $('findInput').focus();
   toast('已替换 ' + n + ' 处');
});

/* ---------------- 结构模板 ---------------- */
function openSnippets() {
   $('snippetList').innerHTML = CAIE.SNIPPETS.map(function (s, i) {
      return '<li data-i="' + i + '">' + escapeHtml(s.label) + '</li>';
   }).join('');
   $('snippetPop').hidden = false;
}
$('snippetList').addEventListener('click', function (ev) {
   const li = ev.target.closest('li[data-i]');
   if (!li) return;
   insertSnippet(CAIE.SNIPPETS[+li.dataset.i]);
   $('snippetPop').hidden = true;
});
function insertSnippet(sn) {
   const li = lineInfo();
   const indent = (li.text.match(/^ */) || [''])[0];
   const caretMark = sn.body.indexOf('@@');
   const body = sn.body.replace('@@', '');
   const text = body.split('\n').map(function (l, i) { return i === 0 ? l : indent + l; }).join('\n');
   code.focus();
   const s = code.selectionStart;
   const prefix = li.before.trim() === '' ? '' : '\n' + indent;
   applyEdit(s, code.selectionEnd, prefix + text, s + prefix.length + Math.max(0, caretMark));
}
document.addEventListener('click', function (ev) {
   if (!ev.target.closest('#snippetPop') && !ev.target.closest('[data-action="snippets"]')) $('snippetPop').hidden = true;
   if (!ev.target.closest('.menu-wrap')) $('moreMenu').hidden = true;
});

/* ---------------- 更多菜单 ---------------- */
$('moreBtn').addEventListener('click', function (ev) {
   ev.stopPropagation();
   $('moreMenu').hidden = !$('moreMenu').hidden;
});
$('moreMenu').addEventListener('click', function (ev) {
   const btn = ev.target.closest('[data-action]');
   if (!btn) return;
   $('moreMenu').hidden = true;
   const a = btn.dataset.action;
   if (a === 'format') formatSource();
   if (a === 'snippets') openSnippets();
   if (a === 'find') openFind();
   if (a === 'import') pickFiles('source');
   if (a === 'downloadPseudocode') downloadText(withExt(activeDoc().name, '.pseudocode'), code.value);
   if (a === 'downloadTxt') downloadText(withExt(activeDoc().name, '.txt'), code.value);
   if (a === 'exportAll') exportAll();
   if (a === 'settings') { syncSettingsUI(); showDialog('settingsDialog'); }
   if (a === 'resetRuntime') {
      state.runtimeFiles = clone(SAMPLES.runtimeFiles);
      renderRuntimeFiles();
      renderHandles([]);
      save();
      toast('运行环境已重置为演示数据');
   }
   if (a === 'about') showDialog('aboutDialog');
});

let importTarget = 'source';

function pickFiles(target) {
   importTarget = target;
   const input = $('importInput');
   input.accept = target === 'runtime' ? '.txt,.dat' : '.pseudocode,.txt';
   input.click();
}

$('importDocBtn').addEventListener('click', function () { pickFiles('source'); });
$('importRuntimeBtn').addEventListener('click', function () { pickFiles('runtime'); });

$('importInput').addEventListener('change', function () {
   importFiles(Array.prototype.slice.call(this.files), importTarget);
   this.value = '';
});

function readAsText(file) {
   return new Promise(function (resolve) {
      const reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result)); };
      reader.onerror = function () { resolve(null); };
      reader.readAsText(file);
   });
}

/* target: 'source' 导入为 .pseudocode 代码文件；'runtime' 导入为运行时数据文件 */
function importFiles(files, target) {
   const accepted = files.filter(function (f) {
      return target === 'runtime'
         ? /\.(txt|dat)$/i.test(f.name)
         : /\.(pseudocode|txt)$/i.test(f.name);
   });
   const skipped = files.length - accepted.length;
   if (!accepted.length) {
      toast(skipped ? '只支持 ' + (target === 'runtime' ? '.txt / .dat' : '.pseudocode / .txt') + ' 文件' : '没有可导入的文件');
      return;
   }
   Promise.all(accepted.map(readAsText)).then(function (texts) {
      let lastDocId = null, renamed = 0;
      accepted.forEach(function (file, i) {
         const text = texts[i];
         if (text === null) return;
         if (target === 'runtime') {
            const isRandom = /\.dat$/i.test(file.name);
            let records = [];
            if (isRandom) {
               try {
                  records = text.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return JSON.parse(l); });
               } catch (e) { records = []; }
            }
            const rtName = uniqueName(state.runtimeFiles, file.name);
            if (rtName !== file.name) renamed++;
            state.runtimeFiles.push(isRandom
               ? { id: 'rf-' + Date.now() + '-' + i, name: rtName, kind: 'records', recordType: '', records: records }
               : { id: 'rf-' + Date.now() + '-' + i, name: rtName, kind: 'text', lines: text === '' ? [] : text.split('\n') });
         } else {
            const docName = uniqueName(state.docs, ensureExt(file.name), true);
            if (docName !== ensureExt(file.name)) renamed++;
            const doc = { id: 'doc-' + Date.now() + '-' + i, name: docName, source: text, updatedAt: Date.now() };
            state.docs.push(doc);
            lastDocId = doc.id;
         }
      });
      if (target === 'runtime') {
         renderRuntimeFiles();
         showTab('files');
         save();
      } else if (lastDocId) {
         openDoc(lastDocId);
      }
      const n = accepted.length;
      toast('已导入 ' + n + ' 个文件'
         + (renamed ? '，其中 ' + renamed + ' 个重名已自动编号' : '')
         + (skipped ? '，跳过 ' + skipped + ' 个不支持的文件' : ''));
   });
}

/* ---------------- 拖拽导入 ---------------- */
let dragDepth = 0;

function dropTargetFrom(ev) {
   const el = document.elementFromPoint(ev.clientX, ev.clientY);
   if (!el) return 'ask';
   if (el.closest('#results')) return 'runtime';
   if (el.closest('#sidebar')) return 'source';
   return 'ask';   // 编辑器等其他区域：落下后再问
}

const DROP_TEXT = {
   source: ['松开以导入为代码文件', '支持 .pseudocode 与 .txt，导入后出现在左侧代码文件列表。'],
   runtime: ['松开以导入为运行时数据文件', '.txt 作为文本文件，.dat 按每行一条 JSON 记录读取。'],
   ask: ['松开后选择导入方式', '拖到左侧＝代码文件，拖到右侧＝运行时数据文件；放在这里会先询问。']
};

function setDropUI(active, target) {
   const overlay = $('dropOverlay');
   if (!active) {
      overlay.classList.remove('show');
      overlay.hidden = true;
      $('results').classList.remove('drop-zone-active');
      $('sidebar').classList.remove('drop-zone-active');
      return;
   }
   overlay.hidden = false;
   // 强制一次样式计算，保证 opacity 过渡生效
   void overlay.offsetWidth;
   overlay.classList.add('show');
   $('dropTitle').textContent = DROP_TEXT[target][0];
   $('dropHint').textContent = DROP_TEXT[target][1];
   $('results').classList.toggle('drop-zone-active', target === 'runtime');
   $('sidebar').classList.toggle('drop-zone-active', target === 'source');
}

function hasFiles(ev) {
   return ev.dataTransfer && Array.prototype.indexOf.call(ev.dataTransfer.types || [], 'Files') >= 0;
}

window.addEventListener('dragenter', function (ev) {
   if (!hasFiles(ev)) return;
   ev.preventDefault();
   dragDepth++;
   setDropUI(true, dropTargetFrom(ev));
});
window.addEventListener('dragover', function (ev) {
   if (!hasFiles(ev)) return;
   ev.preventDefault();
   ev.dataTransfer.dropEffect = 'copy';
   if (dragDepth > 0) setDropUI(true, dropTargetFrom(ev));
});
window.addEventListener('dragleave', function (ev) {
   if (!hasFiles(ev)) return;
   dragDepth = Math.max(0, dragDepth - 1);
   if (dragDepth === 0) setDropUI(false);
});
window.addEventListener('drop', function (ev) {
   if (!hasFiles(ev)) return;
   ev.preventDefault();
   const target = dropTargetFrom(ev);
   const files = Array.prototype.slice.call(ev.dataTransfer.files);
   dragDepth = 0;
   setDropUI(false);
   if (target !== 'ask') { importFiles(files, target); return; }
   askImportKind(files).then(function (kind) {
      if (kind) importFiles(files, kind);
   });
});

/* 落在编辑器上时无法判断意图，弹二级窗口让用户选 */
function askImportKind(files) {
   return new Promise(function (resolve) {
      dialogResolve = resolve;
      $('choiceTitle').textContent = files.length > 1 ? '导入 ' + files.length + ' 个文件' : '导入文件';
      $('choiceDesc').textContent = '这些文件要作为编写的伪代码，还是作为程序运行时用 OPENFILE 读写的数据文件？';
      $('choiceList').innerHTML = files.map(function (f) {
         return '<div>' + escapeHtml(f.name) + '</div>';
      }).join('');
      showDialog('choiceDialog');
      $('choiceSource').focus();
   });
}

['choiceSource', 'choiceRuntime'].forEach(function (id) {
   $(id).addEventListener('click', function () {
      const done = dialogResolve;
      dialogResolve = null;
      closeDialogs();
      if (done) done(id === 'choiceSource' ? 'source' : 'runtime');
   });
});

/* 换后缀但保留原文件名：Main.pseudocode ↔ Main.txt */
function withExt(name, ext) {
   const dot = name.lastIndexOf('.');
   return (dot > 0 ? name.slice(0, dot) : name) + ext;
}

function downloadText(name, text) {
   const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
   const a = document.createElement('a');
   a.href = URL.createObjectURL(blob);
   a.download = name;
   a.click();
   setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}
function exportAll() {
   const bundle = state.docs.map(function (d) {
      return '===== ' + d.name + ' =====\n' + d.source;
   }).join('\n\n');
   downloadText('pseudocode-export.txt', bundle);
}

/* ---------------- 设置 ---------------- */
const FONT_MIN = 12, FONT_MAX = 20;
const SWITCH_SETTINGS = [
   { id: 'setLineNumbers', key: 'lineNumbers', rerender: true },
   { id: 'setArrow', key: 'arrowConvert', rerender: false },
   { id: 'setAutoIndent', key: 'autoIndent', rerender: false },
   { id: 'setAutoPair', key: 'autoPair', rerender: false }
];

function syncSettingsUI() {
   Array.prototype.forEach.call($('setTheme').children, function (b) {
      b.setAttribute('aria-checked', String(b.dataset.value === state.settings.theme));
   });
   const fs = state.settings.fontSize;
   $('fontSizeVal').textContent = fs + ' px';
   Array.prototype.forEach.call($('setFontSize').querySelectorAll('button'), function (b) {
      const next = fs + (+b.dataset.step);
      b.disabled = next < FONT_MIN || next > FONT_MAX;
   });
   SWITCH_SETTINGS.forEach(function (sw) {
      $(sw.id).setAttribute('aria-checked', String(!!state.settings[sw.key]));
   });
   $('lintToggle').setAttribute('aria-checked', String(!!state.settings.lint));
}

$('setTheme').addEventListener('click', function (ev) {
   const b = ev.target.closest('button[data-value]');
   if (!b) return;
   state.settings.theme = b.dataset.value;
   applyTheme();
   syncSettingsUI();
   savePrefs();
});

$('setFontSize').addEventListener('click', function (ev) {
   const b = ev.target.closest('button[data-step]');
   if (!b || b.disabled) return;
   const next = state.settings.fontSize + (+b.dataset.step);
   if (next < FONT_MIN || next > FONT_MAX) return;
   state.settings.fontSize = next;
   applyFont();
   renderEditor();
   syncSettingsUI();
   savePrefs();
});

SWITCH_SETTINGS.forEach(function (sw) {
   $(sw.id).addEventListener('click', function () {
      const on = this.getAttribute('aria-checked') !== 'true';
      this.setAttribute('aria-checked', String(on));
      state.settings[sw.key] = on;
      if (sw.rerender) renderEditor();
      savePrefs();
   });
});
$('clearData').addEventListener('click', function () {
   askConfirm({
      title: '清除本地项目数据',
      body: '所有代码文件、运行时数据文件与设置都会被删除，且无法撤销。',
      okLabel: '清除'
   }).then(function (ok) {
      if (!ok) return;
      localStorage.removeItem(STORE_KEY);
      location.reload();
   });
});

function applyTheme() {
   const t = state.settings.theme;
   const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
   document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
function applyFont() {
   const fs = state.settings.fontSize;
   document.documentElement.style.setProperty('--editor-font-size', fs + 'px');
   document.documentElement.style.setProperty('--editor-line-height', Math.round(fs * 1.6) + 'px');
   measureCharWidth();
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
   if (state.settings.theme === 'system') applyTheme();
});

/* ---------------- 对话框与提示 ---------------- */
function showDialog(id) { $('overlay').hidden = false; $(id).hidden = false; }
function closeDialogs() {
   $('overlay').hidden = true;
   document.querySelectorAll('.dialog').forEach(function (d) { d.hidden = true; });
   dialogValidate = null;
   if (dialogResolve) {
      const done = dialogResolve;
      dialogResolve = null;
      done(null);
   }
}
$('overlay').addEventListener('click', closeDialogs);
document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeDialogs); });
document.addEventListener('keydown', function (ev) {
   if (ev.key === 'Escape') { closeDialogs(); $('snippetPop').hidden = true; $('moreMenu').hidden = true; }
});

let toastTimer = null;
function toast(msg, actionLabel, action) {
   const el = $('toast'), btn = $('toastAction');
   $('toastText').textContent = msg;
   btn.hidden = !actionLabel;
   btn.textContent = actionLabel || '';
   btn.onclick = actionLabel ? function () { el.hidden = true; action(); } : null;
   el.hidden = false;
   clearTimeout(toastTimer);
   toastTimer = setTimeout(function () { el.hidden = true; }, actionLabel ? 6000 : 2200);
}

/* ---------------- 自定义 Modal：替代 prompt / confirm ---------------- */
let dialogResolve = null;

let dialogValidate = null;

function askText(opts) {
   return new Promise(function (resolve) {
      dialogResolve = resolve;
      dialogValidate = opts.validate || null;
      $('promptTitle').textContent = opts.title;
      $('promptDesc').textContent = opts.desc || '';
      $('promptError').textContent = '';
      $('promptInput').value = opts.value || '';
      showDialog('promptDialog');
      $('promptInput').focus();
      $('promptInput').select();
   });
}

function commitPrompt() {
   const v = $('promptInput').value.trim();
   if (!v) { $('promptError').textContent = '名称不能为空。'; return; }
   if (/[\\/:*?"<>|]/.test(v)) { $('promptError').textContent = '名称不能包含 \\ / : * ? " < > | 等字符。'; return; }
   if (dialogValidate) {
      const err = dialogValidate(v);
      if (err) { $('promptError').textContent = err; return; }
   }
   dialogValidate = null;
   const done = dialogResolve;
   dialogResolve = null;
   closeDialogs();
   if (done) done(v);
}
/*
 * 文件名非法字符：Windows 保留符号 + 控制字符，输入时直接过滤掉，不等到提交才报错。
 * 中文拼音输入法在候选词「选中」提交前处于合成（composition）状态，此时若用 el.value
 * 强行改写内容，会打断合成，导致正在输入的文字从输入框里消失。所以合成期间跳过过滤，
 * 等 compositionend 之后再统一清理一次。
 */
function sanitizeNameInput(el) {
   const cleaned = el.value.replace(/[\\/:*?"<>|\x00-\x1f]/g, '');
   if (cleaned === el.value) return false;
   const pos = el.selectionStart;
   const before = el.value.slice(0, pos).replace(/[\\/:*?"<>|\x00-\x1f]/g, '').length;
   el.value = cleaned;
   el.setSelectionRange(before, before);
   return true;
}

$('promptOk').addEventListener('click', commitPrompt);
$('promptInput').addEventListener('keydown', function (ev) {
   if (ev.key === 'Enter') { ev.preventDefault(); commitPrompt(); }
});
$('promptInput').addEventListener('input', function (ev) {
   $('promptError').textContent = '';
   if (ev.isComposing || ev.keyCode === 229) return;
   if (sanitizeNameInput($('promptInput'))) {
      $('promptError').textContent = '名称不能包含 \\ / : * ? " < > | 等字符。';
   }
});
$('promptInput').addEventListener('compositionend', function () {
   if (sanitizeNameInput($('promptInput'))) {
      $('promptError').textContent = '名称不能包含 \\ / : * ? " < > | 等字符。';
   }
});

function askConfirm(opts) {
   return new Promise(function (resolve) {
      dialogResolve = resolve;
      $('confirmTitle').textContent = opts.title;
      $('confirmBody').textContent = opts.body;
      $('confirmOk').textContent = opts.okLabel || '确定';
      showDialog('confirmDialog');
      $('confirmOk').focus();
   });
}
$('confirmOk').addEventListener('click', function () {
   const done = dialogResolve;
   dialogResolve = null;
   closeDialogs();
   if (done) done(true);
});

/* ---------------- 自定义 Tooltip：替代浏览器默认 title ---------------- */
const tooltipEl = $('tooltip');
let tipTimer = null, tipTarget = null;

function showTip(el) {
   const text = el.getAttribute('data-tip');
   if (!text) return;
   tipTarget = el;
   tooltipEl.textContent = text;
   tooltipEl.hidden = false;
   const r = el.getBoundingClientRect();
   const w = tooltipEl.offsetWidth, h = tooltipEl.offsetHeight;
   let left = r.left + r.width / 2 - w / 2;
   left = Math.max(6, Math.min(left, window.innerWidth - w - 6));
   let top = r.bottom + 6;
   if (top + h > window.innerHeight - 6) top = r.top - h - 6;
   tooltipEl.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';
   tooltipEl.classList.add('show');
}

function hideTip() {
   clearTimeout(tipTimer);
   tipTarget = null;
   tooltipEl.classList.remove('show');
   tooltipEl.hidden = true;
}

document.addEventListener('mouseover', function (ev) {
   const el = ev.target.closest('[data-tip]');
   if (!el || el === tipTarget) return;
   clearTimeout(tipTimer);
   tipTimer = setTimeout(function () { showTip(el); }, 350);
});
document.addEventListener('mouseout', function (ev) {
   const el = ev.target.closest('[data-tip]');
   if (el) hideTip();
});
document.addEventListener('mousedown', hideTip);
window.addEventListener('blur', hideTip);

/* ---------------- 固定槽位辅助 ---------------- */
function setBadge(el, n) {
   el.textContent = n > 0 ? String(n) : '';
   el.classList.toggle('on', n > 0);
}

function setInputWaiting(waiting, variable, suggest) {
   const row = $('inputRow'), box = $('inputBox'), btn = $('inputSend');
   row.dataset.waiting = waiting ? 'true' : 'false';
   $('inputLabel').textContent = waiting ? 'INPUT ' + variable : 'INPUT';
   box.disabled = !waiting;
   btn.disabled = !waiting;
   box.value = '';
   box.placeholder = waiting
      ? (suggest ? '例如 ' + suggest : '输入后按 Enter')
      : '运行到 INPUT 时在此输入';
   if (waiting) box.focus();
}

function escapeHtml(s) {
   return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---------------- 启动 ---------------- */
load();

/*
 * 教学页的「在编辑器中打开」。
 * 用 localStorage 而不是 sessionStorage：直接双击 HTML 打开时（file:// 协议），
 * 两个页面的 sessionStorage 互相看不见，交接会静默失败。
 *
 * 带过来的文件标记为 lesson：不能删、不能改名，但可以随时恢复成原始内容。
 * 它是课文里的那段代码，不是用户自己的文件，混在一起会分不清。
 */
(function handoffFromTeaching() {
   var raw;
   try { raw = localStorage.getItem('caie.teaching.handoff'); } catch (e) { raw = null; }
   if (!raw) return;
   try { localStorage.removeItem('caie.teaching.handoff'); } catch (e) { /* 忽略 */ }

   var payload;
   try { payload = JSON.parse(raw); } catch (e) { payload = { source: raw }; }
   if (!payload || !payload.source) return;

   const wanted = ensureExt(payload.name || 'FromLesson');
   const existing = state.docs.find(function (d) {
      return d.lesson && d.origin === payload.source && d.name.toLowerCase() === wanted.toLowerCase();
   });
   if (existing) { existing.archived = false; state.activeId = existing.id; return; }

   const doc = {
      id: 'doc-' + Date.now(),
      name: uniqueName(state.docs, wanted, true),
      source: payload.source,
      origin: payload.source,
      lesson: true,
      lessonLabel: payload.label || '来自课文',
      updatedAt: Date.now()
   };
   state.docs.push(doc);
   state.activeId = doc.id;
})();

applyTheme();
applyFont();
measureCharWidth();
syncSettingsUI();
showTab('output');
renderFiles();
renderRuntimeFiles();
renderHandles([]);
code.value = activeDoc().source;
renderEditor();
runLint();
$('saveState').textContent = '已保存';
code.focus();
})();
