/* 编辑器、文件管理、真实语言诊断与格式化、阶段 4 真实运行 */
(function () {
'use strict';

const $ = function (id) { return document.getElementById(id); };
const STORE_KEY = 'caie9618.editor.v1';
const PROJECTS_KEY = 'seedtocode.projects.v1';
/*
 * 课文文件有自己的项目。
 * 在这之前它们是落进「当时正好打开的那个项目」的——在「考前刷题」里点课文的
 * 「在编辑器中打开」，课文文件就进了「考前刷题」，跟自己写的代码混在一起。
 * 这个名字对用户保留：新建和重命名都不允许用，不管这个项目当下存不存在。
 * 否则改完名就把名字释放了，可以再建一个同名的，之后课文文件该进哪个就说不清。
 */
const LESSON_PROJECT_NAME = '课文文件';
function normalizeProjectName(value) { return String(value == null ? '' : value).trim().toLowerCase(); }
function isReservedProjectName(value) { return normalizeProjectName(value) === normalizeProjectName(LESSON_PROJECT_NAME); }
function isLessonProject(project) { return !!(project && project.lesson); }
const STORAGE = window.CAIEStorage;
const LANGUAGE = window.LANGUAGE_ADAPTER;
const RUNTIME = window.CAIERuntime;

/* ---------------- 状态 ---------------- */
const defaultSettings = {
   theme: 'light', fontSize: 14, lineNumbers: true,
   arrowConvert: true, autoIndent: true, autoPair: true, lint: false,
   runtimeProfile: 'core-2027',
   // 归档的课文文件默认不显示在列表里
   showArchivedLessons: false
};

let state = {
   docs: [], activeId: null, runtimeFiles: [], settings: Object.assign({}, defaultSettings)
};
let projects = [];
let currentProjectId = 'project-default';

let diagnostics = [];
let run = { active: false, controller: null, pending: false, fileTouched: false };
let traceRun = null;

/* ---------------- 持久化 ---------------- */
function clone(x) { return JSON.parse(JSON.stringify(x)); }

function newRuntimeFileId() {
   if (window.crypto && typeof window.crypto.randomUUID === 'function') return 'rf-' + window.crypto.randomUUID();
   return 'rf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
}

/* 演示文件的 id 只适合出厂项目；每个新项目都必须拥有自己的文件命名空间。 */
function runtimeFilesForNewProject() {
   return clone(SAMPLES.runtimeFiles).map(function (file) {
      var copy = clone(file);
      copy.id = newRuntimeFileId();
      return copy;
   });
}

function load() {
   const registry = STORAGE.get(PROJECTS_KEY, null);
   if (registry && Array.isArray(registry.projects) && registry.projects.length) {
      projects = registry.projects;
      currentProjectId = registry.activeProjectId || projects[0].id;
      const current = projects.find(function (p) { return p.id === currentProjectId; }) || projects[0];
      currentProjectId = current.id;
      state = {
         docs: current.docs || [],
         activeId: current.activeId || (current.docs && current.docs[0] && current.docs[0].id),
         runtimeFiles: current.runtimeFiles || clone(SAMPLES.runtimeFiles),
         settings: Object.assign({}, defaultSettings, registry.settings || {})
      };
      return;
   }
   let saved = STORAGE.get(STORE_KEY, null);
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
   projects = [{ id: currentProjectId, name: '我的项目', docs: clone(state.docs), activeId: state.activeId, runtimeFiles: clone(state.runtimeFiles) }];
   persistProjects();
}

function persist() {
   STORAGE.set(STORE_KEY, state);
   persistProjects();
}

/* 把眼前这份 state 写回它所属的项目。落盘和「算出有哪些改动要同步」都要先经过它，
   否则 projects 里还是上一次的样子。 */
function flushStateIntoProjects() {
   const current = projects.find(function (p) { return p.id === currentProjectId; });
   if (!current) return;
   current.docs = clone(state.docs);
   current.activeId = state.activeId;
   current.runtimeFiles = clone(state.runtimeFiles);
}

function persistProjects() {
   flushStateIntoProjects();
   STORAGE.set(PROJECTS_KEY, { schemaVersion: 1, activeProjectId: currentProjectId, settings: clone(state.settings), projects: projects });
   // 未登录时这一步什么都不做；同步永远排在本地保存之后，失败也不回头影响本地。
   if (window.SyncEngine) window.SyncEngine.noteLocalChange();
}

function projectName() {
   const p = projects.find(function (x) { return x.id === currentProjectId; });
   return p ? p.name : '我的项目';
}

function renderProjectLabel() {
   const label = $('projectNameLabel');
   if (label) label.textContent = projectName();
   const list = $('projectPickerList');
   if (list) list.innerHTML = projects.map(function (p) {
      // 名字和勾各占一个槽位：勾靠右对齐，名字再长也只是自己被省略号截断，不会把勾挤掉
      var current = p.id === currentProjectId;
      return '<button class="project-picker-item' + (current ? ' current' : '') +
         '" data-project-id="' + escapeHtml(p.id) + '"' + (current ? ' aria-current="true"' : '') + '>' +
         '<span class="project-picker-name">' + escapeHtml(p.name) + '</span>' +
         (isLessonProject(p) ? '<span class="project-picker-tag">课文</span>' : '') +
         '<span class="project-picker-check">' + (current ? '✓' : '') + '</span></button>';
   }).join('');
   syncProjectActionState();
}

/* 课文项目不能改名，两个入口的「重命名」都置灰，不要等点下去才弹提示 */
function syncProjectActionState() {
   const lesson = isLessonProject(projects.find(function (p) { return p.id === currentProjectId; }));
   const picker = document.querySelector('[data-project-action="rename"]');
   if (picker) picker.disabled = lesson;
   const menu = document.querySelector('[data-action="renameProject"]');
   if (menu) menu.disabled = lesson;
}

function switchProject(id) {
   const next = projects.find(function (p) { return p.id === id; });
   if (!next || next.id === currentProjectId) return;
   persistProjects();
   currentProjectId = next.id;
   state.docs = clone(next.docs || []);
   state.runtimeFiles = clone(next.runtimeFiles || []);
   state.activeId = next.activeId || (state.docs[0] && state.docs[0].id);
   if (!state.docs.length) {
      const doc = { id: 'doc-' + Date.now(), name: 'Main.pseudocode', source: '// Main.pseudocode\n', updatedAt: Date.now() };
      state.docs = [doc]; state.activeId = doc.id;
   }
   persist();
   code.value = activeDoc().source;
   $('docName').value = activeDoc().name;
   renderProjectLabel(); renderFiles(); renderRuntimeFiles(); renderEditor(); runLint(); resetRunPanel();
}

/**
 * 认 `lesson` 标记而不是认名字：名字虽然禁止改，但这条改动之前的数据里
 * 可能已经有人手建了一个叫「课文文件」的普通项目，按名字认到就顺手补上标记，
 * 不然会并排出现两个同名项目。
 */
function lessonProject() {
   return projects.find(isLessonProject)
      || projects.find(function (p) { return isReservedProjectName(p.name); })
      || null;
}

/** 懒创建：第一次真有课文文件要放进来时才建，没用过课程的人列表里不会多一个空项目。 */
function ensureLessonProject() {
   const existing = lessonProject();
   if (existing) { existing.lesson = true; existing.name = LESSON_PROJECT_NAME; return existing; }
   const project = {
      id: 'project-lesson-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name: LESSON_PROJECT_NAME,
      lesson: true,
      docs: [],
      activeId: null,
      runtimeFiles: runtimeFilesForNewProject()
   };
   projects.push(project);
   return project;
}

/** projects 被直接改过之后，把当前项目的内容重新读回 state。 */
function syncStateFromCurrentProject() {
   const current = projects.find(function (p) { return p.id === currentProjectId; }) || projects[0];
   currentProjectId = current.id;
   state.docs = clone(current.docs || []);
   state.runtimeFiles = clone(current.runtimeFiles || []);
   state.activeId = current.activeId || (state.docs[0] && state.docs[0].id);
}

/**
 * 一次性搬迁：把这条改动之前散落在各个普通项目里的课文文件收拢到课文项目。
 * 不做的话它们会一直留在原处，和新进来的课文文件分两地，谁也说不清哪份是哪份。
 */
function migrateLessonDocsIntoLessonProject() {
   const strays = projects.filter(function (p) {
      return !isLessonProject(p) && (p.docs || []).some(function (d) { return d.lesson; });
   });
   if (!strays.length) return false;

   const lesson = ensureLessonProject();
   lesson.docs = lesson.docs || [];
   strays.forEach(function (project) {
      const keep = [];
      (project.docs || []).forEach(function (doc) {
         if (!doc.lesson) { keep.push(doc); return; }
         // 同一段课文代码在多个项目里各打开过一次，这里只留一份
         const duplicate = lesson.docs.find(function (d) {
            return d.origin === doc.origin && normalizeProjectName(d.name) === normalizeProjectName(doc.name);
         });
         if (duplicate) return;
         doc.name = uniqueName(lesson.docs, doc.name, true);
         lesson.docs.push(doc);
      });
      project.docs = keep;
      // 搬空了的项目补一个空白文件：编辑器依赖 activeDoc() 一定有值
      if (!project.docs.length) {
         project.docs = [{ id: 'doc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), name: 'Main.pseudocode', source: '// Main.pseudocode\n', updatedAt: Date.now() }];
      }
      if (!project.docs.some(function (d) { return d.id === project.activeId; })) {
         project.activeId = project.docs[0].id;
      }
   });
   if (!lesson.activeId || !lesson.docs.some(function (d) { return d.id === lesson.activeId; })) {
      lesson.activeId = lesson.docs[0] && lesson.docs[0].id;
   }
   return true;
}

function createProject(name) {
   const project = {
      id: 'project-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name: name,
      docs: [{ id: 'doc-' + Date.now(), name: 'Main.pseudocode', source: '// Main.pseudocode\n', updatedAt: Date.now() }],
      activeId: null,
      runtimeFiles: runtimeFilesForNewProject()
   };
   project.activeId = project.docs[0].id;
   projects.push(project);
   persist();
   switchProject(project.id);
}

/**
 * 「切换项目」原先是弹一个输入框，让人把眼前就列着的项目名再精确打一遍，
 * 打错还要报「请输入已有项目名称」——侧栏里本来就有一个点一下就能选的列表。
 * 菜单项现在只负责把那个列表打开，两个入口共用同一份 UI，不再有第二套切换方式。
 */
function openProjectPicker() {
   announcePopover('projects');
   // 侧栏收起来的时候列表不可见，先展开
   $('sidebar').classList.remove('collapsed');
   renderProjectLabel();
   $('projectPicker').hidden = false;
   $('projectSwitcher').setAttribute('aria-expanded', 'true');
   // 键盘进来的人要能直接在列表里走，所以焦点落到当前项而不是触发按钮
   const current = $('projectPicker').querySelector('.project-picker-item.current')
      || $('projectPicker').querySelector('.project-picker-item');
   (current || $('projectSwitcher')).focus();
}

function closeProjectPicker() {
   $('projectPicker').hidden = true;
   $('projectSwitcher').setAttribute('aria-expanded', 'false');
}

/* 「课文文件」是保留名：不管这个项目当下存不存在都不让占，先于重名检查报错。 */
function validateNewProjectName(value) {
   if (isReservedProjectName(value)) return '「' + LESSON_PROJECT_NAME + '」是保留名称，课文带过来的文件专用。';
   return projects.some(function (p) { return normalizeProjectName(p.name) === normalizeProjectName(value); }) ? '已存在同名项目。' : null;
}

function renameCurrentProject() {
   const project = projects.find(function (p) { return p.id === currentProjectId; });
   // 课文项目本身不能改名：改完就把保留名释放了，之后课文文件该进哪个项目说不清
   if (isLessonProject(project)) { toast('「' + LESSON_PROJECT_NAME + '」是课文专用项目，不能改名。'); return; }
   askText({ title: '重命名项目', desc: '项目名称只用于本地识别，不会改变代码文件名。', value: projectName(), validate: function (value) {
      if (isReservedProjectName(value)) return '「' + LESSON_PROJECT_NAME + '」是保留名称，课文带过来的文件专用。';
      return projects.some(function (p) { return p.id !== currentProjectId && normalizeProjectName(p.name) === normalizeProjectName(value); }) ? '已存在同名项目。' : null;
   } }).then(function (name) {
      if (!name) return;
      const target = projects.find(function (p) { return p.id === currentProjectId; });
      if (target) { target.name = name; persist(); renderProjectLabel(); }
   });
}

function deleteCurrentProject() {
   if (projects.length <= 1) { toast('至少需要保留一个项目。'); return; }
   askConfirm({ title: '删除当前项目', body: '项目“' + projectName() + '”中的代码文件和运行时文件都会被删除，且无法撤销。', okLabel: '删除' }).then(function (ok) {
      if (!ok) return;
      const removed = currentProjectId;
      projects = projects.filter(function (p) { return p.id !== removed; });
      const next = projects[0];
      currentProjectId = next.id;
      state.docs = clone(next.docs || []); state.runtimeFiles = clone(next.runtimeFiles || []); state.activeId = next.activeId || (state.docs[0] && state.docs[0].id);
      persist();
      code.value = activeDoc().source; $('docName').value = activeDoc().name;
      renderProjectLabel(); renderFiles(); renderRuntimeFiles(); renderEditor(); runLint(); resetRunPanel(); toast('项目已删除。');
   });
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
   syncCodeWidth();
   renderGutter(lines.length);
   renderLineMarks();
   renderFindMarks();
   renderSelectionMarks();
   updateCursor();
}

/*
 * textarea 必须和高亮层一样宽。
 *
 * 它是绝对定位、宽度只有容器那么大、而且 overflow:hidden——长行时它会**自己**在
 * 内部横向滚动（scrollLeft 变大），而高亮层不滚，横向滚动是外层 .editor-scroll 在做。
 * 两层就此错位：实测一行长代码，textarea.scrollLeft 已经到 715，外层还是 0，
 * 高亮层里那段文字在屏幕 x=956（可视区只到 340），而选区矩形画在 x=0。
 * 表现就是「选中的范围对，显示的位置错」，光标也会停在右边缘不动。
 *
 * 高度早就同步成「行数 × 行高」了，宽度以前漏了这一步。把 textarea 撑到内容那么宽，
 * 它就永远不需要自己滚，横向滚动全部交给外层，两层自然锁在一起。
 */
function syncCodeWidth() {
   const pre = $('highlight');
   const area = $('codeArea');
   if (!pre || !area) return;
   code.style.width = Math.max(pre.scrollWidth, area.clientWidth) + 'px';
   // 之前可能已经自己滚出去了，收回来
   if (code.scrollLeft !== 0) code.scrollLeft = 0;
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
/*
 * 中文输入法在选定候选字之前会把拼音显示在光标处。那串字**在 code.value 里**，
 * 但它是由 textarea 自己那层文字渲染的，而 `#code` 为了让语法着色层透出来设了
 * `color: transparent`，所以直接看是一片空白。
 *
 * 第一版的做法是合成期间把两层对调（显出 textarea、藏掉着色层）。拼音是看见了，
 * 但整篇代码同时退回无样式的纯文本——关键字没颜色、注释不再倾斜，每打一个中文
 * 全文闪一次，比原来的毛病还难受。
 *
 * 现在的做法：**让着色层自己把正在打的拼音画出来**。合成期间照常重画高亮层
 * （见上面 input 处理里的那一段），textarea 保持透明，语法颜色一个都不丢。
 * 代价是输入法给合成串加的下划线看不见——那是 textarea 那层的装饰，换不过来；
 * 但字是实实在在显示出来的，候选窗也照常跟着光标。
 */
function setComposing(on) {
   composing = on;
}

/*
 * 宽度是写成 px 的，所以容器一变就得重新同步：窗口缩放、收起/展开侧栏和结果面板、
 * 拖动分隔条都会改变可用宽度。不补这一下，textarea 会保持旧宽度，长行又会回到
 * 自己内部横向滚动的老样子。
 */
window.addEventListener('resize', syncCodeWidth);
if (window.ResizeObserver) {
   try { new ResizeObserver(syncCodeWidth).observe($('codeArea')); } catch (e) { /* 不支持就算了，resize 事件兜底 */ }
}

/*
 * 上一版还留了一条「退回对调图层」的兜底：万一某个环境不把合成串放进 `code.value`，
 * 着色层就画不出拼音，只好显出 textarea、藏起着色层。但那条路一旦被触发，就是
 * 使用者报的那个现象——**整篇代码退回无样式纯文本**。与其赌平台行为，不如把这个
 * 依赖彻底去掉：合成串在不在 value 里都不要紧，`compositionupdate` 本来就把它放在
 * `ev.data` 里，我们自己拼一份预览交给着色层画。这样任何环境下都既看得见拼音、
 * 又保住语法颜色，不存在「哪条路都不好」的选择。
 */
let compositionBase = null;   // 合成开始前的完整内容
let compositionAt = 0;        // 合成串的插入点

code.addEventListener('compositionstart', function () {
   setComposing(true);
   compositionBase = code.value;
   compositionAt = code.selectionStart;
});

/* 有些输入法在合成期间不发 input，只发 compositionupdate，两个都接上 */
code.addEventListener('compositionupdate', function (ev) {
   if (!composing) return;
   if (compositionBase === null || code.value !== compositionBase) {
      // 合成串已经进了 value，照常重画就是
      renderEditor();
      return;
   }
   /* 这个环境不把合成串放进 value：自己拼出「加上正在打的拼音之后」的样子给着色层。
      只动着色层和宽度，不碰 code.value——碰了会打断输入法。 */
   const preview = compositionBase.slice(0, compositionAt) + (ev.data || '') + compositionBase.slice(compositionAt);
   highlight.innerHTML = LANG.highlight(preview);
   syncCodeWidth();
});

code.addEventListener('compositionend', function () {
   setComposing(false);
   compositionBase = null;
   onEdit();
});

code.addEventListener('input', function () {
   /*
    * 合成期间（中文拼音还没选定候选字）只重画，不做诊断、保存和同步——
    * 那些等 compositionend 再一次做完。重画是必须的：正在打的拼音就在 code.value 里，
    * 高亮层不跟着更新，屏幕上就什么都没有（textarea 自己那层是透明的）。
    */
   if (composing) { renderEditor(); return; }
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

   // 课文文件现在自己就是一个项目，再在里面套一层「课文文件」分组等于把同一个名字说两遍，
   // 而且那层分组唯一还在做事的只有归档开关——开关挪到面板头，列表拉平。
   $('fileList').innerHTML = ownDocs().map(docRow).join('') + visibleLessons.map(docRow).join('');
   renderArchivedToggle(archived.length);
   // 课文项目里的文件都是课文带过来的，不是自己攒的代码库：不该能往里导入别的文件。
   const onLessonProject = isLessonProject(projects.find(function (p) { return p.id === currentProjectId; }));
   const importBtn = $('importDocBtn');
   if (importBtn) importBtn.hidden = onLessonProject;

   $('docName').value = activeDoc().name;
   $('docName').readOnly = !!activeDoc().lesson;
   $('docName').title = activeDoc().lesson ? '课文带过来的文件不能改名' : '';
}

/** 归档只服务课文文件，所以入口只在课文项目里给；别的项目连这个按钮都不该看见。 */
function renderArchivedToggle(archivedCount) {
   const btn = $('archivedToggle');
   if (!btn) return;
   const onLessonProject = isLessonProject(projects.find(function (p) { return p.id === currentProjectId; }));
   btn.hidden = !onLessonProject || !archivedCount;
   if (btn.hidden) return;
   btn.textContent = state.settings.showArchivedLessons ? '隐藏已归档' : '已归档 ' + archivedCount;
   btn.dataset.tip = state.settings.showArchivedLessons
      ? '把已归档的课文文件重新收起来'
      : '显示 ' + archivedCount + ' 个已归档的课文文件';
}

$('archivedToggle').addEventListener('click', function () {
   state.settings.showArchivedLessons = !state.settings.showArchivedLessons;
   renderFiles();
   savePrefs();
});

$('fileList').addEventListener('click', function (ev) {
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
         save();
         toast('已删除 ' + removed.name, '撤销', function () {
            state.docs.splice(index, 0, removed);
            openDoc(removed.id);
            save();
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
   // 切换文件本身不是「改了内容」，只是换了当前打开哪个——不该让「保存中…」跟着闪一下。
   savePrefs();
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
         save();
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
   resetTrace('本机运行后在这里显示逐步追踪。');
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

/* trace 是本次本机运行的临时视图：页面不把它写入项目或同步数据。 */
function resetTrace(message) {
   traceRun = null;
   /* 表可能正被移在二级界面里。二级界面**开着**的时候不要把它抽走——新的一次运行
      就在那个大窗口里接着画，这正是使用者打开它的理由；关掉时自然会移回去。
      只有在二级界面已经关了的情况下才需要归位（那说明是别的路径把表留在了那边）。
      目前从界面上启动不了「弹窗开着的同时开始运行」（运行快捷键绑在编辑器上，
      而遮罩挡住了运行按钮），但这一段不依赖那个巧合成立。 */
   if ($('traceDialog').hidden) restoreTraceTable();
   $('traceTable').querySelector('thead').innerHTML = '';
   $('traceTable').querySelector('tbody').innerHTML = '';
   $('traceWrap').hidden = true;
   $('traceEmpty').textContent = message || '本机运行后在这里显示逐步追踪。';
   $('traceEmpty').hidden = false;
   setTraceStatus('');
   setTraceExpandEnabled(false);
}

/* 追踪表的状态只有一句话，但它要出现在两个地方（调试面板底部、二级界面标题栏）。
   写入点只留这一个——两处各写各的，迟早说出两句不一样的话。 */
function setTraceStatus(text) {
   $('traceStatus').textContent = text;
   $('traceDialogStatus').textContent = text;
}

/* 追踪表的二级界面。
 *
 * 表格本体是**移动**进去的同一个 <table> 节点，不是复制一份：
 *   - 运行途中还在往这张表里追加行（appendTraceRow 按 id 找表），复制出来的那一份
 *     从此不再更新；
 *   - 两份渲染逻辑迟早分叉，这个仓库已经吃过这个亏；
 *   - makeTraceRow 在构建每一行时会把 traceRun.values 往前推一格（这是它记住「上一次
 *     的值」的方式），所以整表重画一遍并不等价——得先把状态倒回去，那正是最容易错的
 *     一类代码。移动节点完全绕开这件事。
 * 关掉时移回调试面板，两边看到的永远是同一张表。
 */
function traceTableInDialog() {
   return $('traceTable').parentElement === $('traceDialogWrap');
}

function restoreTraceTable() {
   if (traceTableInDialog()) $('traceWrap').appendChild($('traceTable'));
}

function openTraceDialog() {
   // 按钮在没有内容时是 aria-disabled 的；这里把原因说出来，而不是按下去没反应
   if (!traceRun) { toast('还没有可以看的追踪表，先运行一次。'); return; }
   $('traceDialogWrap').appendChild($('traceTable'));
   showDialog('traceDialog');
}

/* 有没有可看的内容，决定「放大」能不能点。 */
function setTraceExpandEnabled(on) {
   $('traceExpand').setAttribute('aria-disabled', String(!on));
   $('traceExpand').dataset.tip = on ? '在大窗口里看这张表' : '运行一次之后才有追踪表可看';
}

function traceHeadCell(column) {
   const th = document.createElement('th');
   // 过程/函数里的局部变量要标出是谁的，否则主程序的 I 和过程里的 I 在表头上分不开。
   // 递归时 scopeLabel 自带 `#2` 这样的层次后缀。
   if (column.scopeLabel) {
      const scope = document.createElement('span');
      scope.className = 'trace-scope';
      scope.textContent = column.scopeLabel + '.';
      th.appendChild(scope);
   }
   th.appendChild(document.createTextNode(column.name));
   return th;
}

/* 运行途中长出来的列：表头就地追加，已经画出的行补空白格。
   空白按契约本来就是「尚未声明或不在作用域」——对那些行来说这是实话，不是占位。 */
function addTraceColumns(added) {
   if (!traceRun || !added || added.length === 0) return;
   const head = $('traceTable').querySelector('thead tr');
   added.forEach(function (column) {
      traceRun.plan.columns.push(column);
      traceRun.values[column.variableId] = { declared: false, initialized: false };
      if (head) head.appendChild(traceHeadCell(column));
   });
   const body = $('traceTable').querySelector('tbody');
   Array.prototype.forEach.call(body.querySelectorAll('tr[data-trace-row]'), function (tr) {
      added.forEach(function () { tr.appendChild(document.createElement('td')); });
   });
   const omitted = body.querySelector('[data-trace-omitted] td');
   if (omitted) omitted.colSpan = 4 + traceRun.plan.columns.length;
}

function startTrace(plan) {
   traceRun = { plan: { columns: (plan.columns || []).slice() }, rows: [], tail: [], values: {}, truncated: null, selected: null };
   (plan.columns || []).forEach(function (column) {
      traceRun.values[column.variableId] = { declared: false, initialized: false };
   });
   const columns = plan.columns || [];
   const head = document.createElement('tr');
   ['步骤', '源码', '动作', '输出'].forEach(function (text) {
      const th = document.createElement('th');
      th.textContent = text;
      head.appendChild(th);
   });
   columns.forEach(function (column) { head.appendChild(traceHeadCell(column)); });
   $('traceTable').querySelector('thead').innerHTML = '';
   $('traceTable').querySelector('thead').appendChild(head);
   $('traceTable').querySelector('tbody').innerHTML = '';
   $('traceEmpty').hidden = true;
   $('traceWrap').hidden = false;
   setTraceStatus('追踪中…');
   setTraceExpandEnabled(true);
}

function traceValueText(value) { return value && value.initialized ? value.displayValue : '未赋值'; }
function traceState(trace, variableId) { return trace.values[variableId] || { declared: false, initialized: false }; }

function makeTraceRow(row) {
   const tr = document.createElement('tr');
   tr.dataset.traceRow = String(row.step);
   const line = row.range && row.range.start ? row.range.start.line : 1;
   function cell(text, className, label) {
      const td = document.createElement('td');
      td.className = className || '';
      td.textContent = text;
      if (label) td.setAttribute('aria-label', label);
      tr.appendChild(td);
      return td;
   }
   cell(String(row.step), 'trace-step');
   cell('第 ' + line + ' 行', 'trace-source');
   /* 动作列在放大视图里是定宽的，长一点的（`RETURN BubbleSort` 这类）会被省略号截掉。
      给它挂上完整文字的悬浮提示，截断就不再等于丢信息。短的不挂——每一行都弹一个
      提示只会碍事。 */
   const action = cell(row.label || '', 'trace-action');
   if ((row.label || '').length > 12) action.dataset.tip = row.label;
   cell(row.output || '', 'trace-output');
   (traceRun.plan.columns || []).forEach(function (column) {
      const declaration = (row.declarations || []).find(function (item) { return item.variableId === column.variableId; });
      const write = (row.writes || []).find(function (item) { return item.variableId === column.variableId; });
      const state = traceState(traceRun, column.variableId);
      let text = '';
      let className = '';
      let label = '';
      if (declaration) {
         state.declared = true;
         state.initialized = declaration.value.initialized;
         text = traceValueText(declaration.value);
         if (!declaration.value.initialized) className = 'trace-unassigned';
      } else if (write) {
         state.declared = true;
         state.initialized = write.after.initialized;
         text = traceValueText(write.after);
         if (write.sameValue) {
            className = 'trace-same-write';
            label = write.name + ' 写入 ' + text + '，值未改变';
         }
         if (write.origin) {
            className = className ? className + ' trace-byref' : 'trace-byref';
            // 数组元素格是主程序建的，形参侧拿不到自己的名字（`origin.name` 会等于列名），
            // 这时就别再念一遍「参数 Numbers[1]」——那是句废话。
            const via = write.origin.name === write.name ? '' : ' 参数 ' + write.origin.name;
            label = write.name + ' 在 ' + write.origin.routine + ' 里经 BYREF' + via + ' 写入 ' + text
               + (write.sameValue ? '，值未改变' : '');
         }
      } else if (state.declared) {
         text = state.initialized ? '-' : '未赋值';
         if (!state.initialized) className = 'trace-unassigned';
      }
      cell(text, className, label);
   });
   tr.addEventListener('click', function () {
      const previous = $('traceTable').querySelector('tr.is-selected');
      if (previous) previous.classList.remove('is-selected');
      tr.classList.add('is-selected');
      traceRun.selected = row.step;
      renderLineMarks(line);
   });
   return tr;
}

function appendTraceRow(row) {
   if (!traceRun) return;
   traceRun.rows.push(row);
   $('traceTable').querySelector('tbody').appendChild(makeTraceRow(row));
}

function traceSink() {
   return {
      started: startTrace,
      columns: addTraceColumns,
      row: appendTraceRow,
      truncated: function (info) {
         if (!traceRun) return;
         traceRun.truncated = info;
         const omitted = document.createElement('tr');
         omitted.className = 'trace-omitted';
         omitted.dataset.traceOmitted = 'true';
         const td = document.createElement('td');
         td.colSpan = 4 + (traceRun.plan.columns || []).length;
         td.textContent = '后续步骤将在运行结束后显示';
         omitted.appendChild(td);
         $('traceTable').querySelector('tbody').appendChild(omitted);
         setTraceStatus('记录超过 ' + info.head + ' 步，正在保留最后 ' + info.tailCapacity + ' 步。');
      },
      tail: function (info) {
         if (!traceRun) return;
         traceRun.tail = info.rows || [];
         (info.stateBefore || []).forEach(function (state) {
            traceRun.values[state.variableId] = { declared: state.declared, initialized: state.initialized };
         });
         const omitted = $('traceTable').querySelector('[data-trace-omitted]');
         if (omitted) {
            omitted.querySelector('td').textContent = '已省略 ' + info.skipped + ' 步';
         }
         /* 运行时一并传回尾部开始前的列状态，重放时不会猜测被省略段的写入。 */
         (traceRun.tail || []).forEach(function (row) { appendTraceRow(row); });
      },
      finished: function (info) {
         if (!traceRun) return;
         const state = info.status === 'completed' ? '已结束' : info.status === 'stopped' ? '已停止' : '出错';
         setTraceStatus(state + ' · 共 ' + info.semanticSteps + ' 步'
            + (info.truncated ? ' · 已截断显示' : '')
            + (info.columnsOmitted ? ' · ' + info.columnsOmitted + ' 个变量超出列上限未显示' : ''));
      }
   };
}

function setStatus(text, cls) {
   $('runStatus').textContent = text;
   $('runStatus').className = 'run-status' + (cls ? ' ' + cls : '');
}

function startRun() {
   if (run.active) return;
   showTab('output');
   $('console').innerHTML = '';
   resetTrace('正在建立本机追踪…');
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
      profile: state.settings.runtimeProfile,
      onEvent: handleRuntimeEvent,
      trace: { sink: traceSink(), scope: 'full' },
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

/* ---------------- 语法检测开关 ----------------
 * 两个入口：顶栏那一个，和「更多 → 设置」里那一个。窄屏（≤600px）顶栏那一个
 * 会让位给运行 / 更多 / 账户，设置里那一个是它唯一的出口，所以两处必须同源——
 * 谁被点都走这里，改完把两个开关的 aria-checked 一起刷新。
 */
function setLintEnabled(on) {
   state.settings.lint = on;
   $('lintToggle').setAttribute('aria-checked', String(on));
   $('setLint').setAttribute('aria-checked', String(on));
   savePrefs();
   runLint();
   if (on) showTab('problems');
}
['lintToggle', 'setLint'].forEach(function (id) {
   $(id).addEventListener('click', function () {
      setLintEnabled(this.getAttribute('aria-checked') !== 'true');
   });
});

/* ---------------- 查找替换 ---------------- */
let matches = [], matchIndex = -1, charWidth = 0;

/*
 * 选区和查找高亮不是浏览器画的——`#code::selection` 被设成透明（原生选区会盖住
 * 下面的语法着色层），矩形由我们自己摆。原来算横坐标用的是「列数 × 单字符宽度」，
 * 在纯 ASCII 行上没问题，一旦行内有中文（等宽字体里占两格）或 Tab（跳到下一个
 * 制表位）就整段偏出去：实测一行 6 个汉字，矩形左边就差了 45px，而选中的范围
 * 本身是对的——看起来就是「选中位置不对但选对了」。
 *
 * 改成量高亮层。它和 textarea 共用字体、字号、行高和 padding，而且正是用户眼睛
 * 看到的那一层，用 Range 在它上面取矩形，按定义就对得齐，也不必再分别处理宽字符、
 * Tab、连字各自的规则。纵向仍用 行号 × 行高 算——那部分本来就是对的，而且
 * getClientRects 给的是字形顶端（比行盒顶端低 2.5px 左右），直接用反而会偏。
 *
 * charWidth 保留作兜底：高亮层还没渲染、或者它的文本长度和 code.value 对不上时
 * （理论上不该发生），退回旧算法总比不画强。
 */

/*
 * 第 lineIndex 行、第 column 列在高亮层里落在哪个文本节点上。
 *
 * **按行定位，不按全文字符数**。高亮器给每一行包一个 `<span class="hl-line">`，
 * 空行里还会塞一个零宽空格（`\u200b`，否则空行没有高度）。所以高亮层的纯文本
 * 比 `code.value` 长——每有一个空行就多一个字符。按全文字符走的话，从第一个
 * 空行开始后面全部错位。
 *
 * 这个坑之前是用「两边长度相等才测量」的守卫挡住的，结果更糟：**任何含空行的
 * 文档都会判定为不同步，整段选区渲染退回按列数推算的老算法**——也就是最早那个
 * 中文/Tab 会偏的 bug。实测使用者用默认的 Main.pseudocode 选一行中文注释：
 * 着色层和 textarea 都量得 221px，我画出来却是 143px（17 个字符 × 8.4px 的
 * ASCII 单字宽），正是兜底分支的产物。而我自己每次测试都手写没有空行的内容，
 * 所以从来没触发过——教训是别拿构造的输入代替真实文档。
 */
function locateInHighlight(lineIndex, column) {
   const lineEl = highlight.children[lineIndex];
   if (!lineEl) return null;
   const walker = document.createTreeWalker(lineEl, NodeFilter.SHOW_TEXT);
   let pos = 0, node, last = null;
   while ((node = walker.nextNode())) {
      last = node;
      const len = node.nodeValue.length;
      if (column <= pos + len) return { node: node, offset: column - pos };
      pos += len;
   }
   return last ? { node: last, offset: last.nodeValue.length } : null;
}

/** 高亮层的行数和源码对不上才算不同步——长度不再参与判断，见上面的注释。 */
function highlightInSync() {
   return highlight.children.length === code.value.split('\n').length;
}

/**
 * 第 lineIndex 行上 [fromCol, toCol) 这段文字在 origin 坐标系里的横向范围。
 * 同一行内可能落在多个 token span 上，取它们的并集。
 */
function measureSpan(lineIndex, fromCol, toCol, origin) {
   const a = locateInHighlight(lineIndex, fromCol);
   const b = locateInHighlight(lineIndex, toCol);
   if (!a || !b) return null;
   const range = document.createRange();
   try {
      range.setStart(a.node, a.offset);
      range.setEnd(b.node, b.offset);
   } catch (e) {
      return null;
   }
   const rects = range.getClientRects();
   if (!rects.length) {
      // 空的一段（例如只选中了行尾的换行）：取塌缩位置，宽度交给调用方兜底
      const caret = range.getBoundingClientRect();
      return { left: caret.left - origin.left, width: 0 };
   }
   let left = Infinity, right = -Infinity;
   for (let i = 0; i < rects.length; i++) {
      left = Math.min(left, rects[i].left);
      right = Math.max(right, rects[i].right);
   }
   return { left: left - origin.left, width: right - left };
}

/* 等宽字体的字符宽度：测量不可用时的兜底 */
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
   /* 原点取一次就够：下面这一串只读不写，浏览器不会因此反复重排。 */
   const origin = box.getBoundingClientRect();
   const canMeasure = highlightInSync();
   let html = '';
   starts.forEach(function (lineStart, lineIndex) {
      const lineEnd = lineIndex + 1 < starts.length ? starts[lineIndex + 1] - 1 : code.value.length;
      if (end <= lineStart || start > lineEnd) return;
      const segmentStart = Math.max(start, lineStart);
      const segmentEnd = Math.min(end, lineEnd);
      const includesNewline = lineIndex + 1 < starts.length && end > lineEnd;
      const span = canMeasure
         ? measureSpan(lineIndex, segmentStart - lineStart, segmentEnd - lineStart, origin)
         : null;
      let left, width;
      if (span) {
         left = span.left;
         // 选到了行尾的换行时留一小段，表示这一行的换行也在选区里
         width = Math.max(includesNewline ? 6 : 2, span.width);
      } else {
         const col = segmentStart - lineStart;
         const chars = Math.max(includesNewline ? 1 : 0, segmentEnd - segmentStart);
         left = 16 + col * charWidth;
         width = Math.max(2, chars * charWidth);
      }
      html += '<div class="sm" style="top:' + (lineIndex * lh) + 'px;left:'
         + left.toFixed(1) + 'px;width:' + width.toFixed(1) + 'px"></div>';
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
   const origin = box.getBoundingClientRect();
   const canMeasure = highlightInSync();
   let html = '';
   matches.slice(0, 500).forEach(function (off, i) {
      let ln = 0;
      // starts 递增，线性扫描足够（单文档规模）
      for (let k = starts.length - 1; k >= 0; k--) { if (starts[k] <= off) { ln = k; break; } }
      // 和选区同一个道理：命中的词或它前面的文字里有中文/Tab 时，按列数推算会偏
      const col = off - starts[ln];
      const span = canMeasure ? measureSpan(ln, col, col + q.length, origin) : null;
      const left = span ? span.left : 16 + col * charWidth;
      const width = span ? Math.max(2, span.width) : Math.max(2, q.length * charWidth);
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
   announcePopover('snippets');
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
   if (!ev.target.closest('.project-switcher-wrap')) closeProjectPicker();
});

/* ---------------- 更多菜单 ---------------- */

/* 同一时刻只留一个浮层：打开前先广播，别的浮层（账户浮层）听见就收起来；
   也听别人的广播，别人开我就关。两边的按钮都 stopPropagation，
   光靠「点外面就关」收不到对方那一次点击。 */
function announcePopover(id) {
   document.dispatchEvent(new CustomEvent('ui:popover-open', { detail: { id } }));
}
document.addEventListener('ui:popover-open', function (ev) {
   if (!ev.detail || ev.detail.id !== 'more') $('moreMenu').hidden = true;
   if (!ev.detail || ev.detail.id !== 'snippets') $('snippetPop').hidden = true;
   if (!ev.detail || ev.detail.id !== 'projects') closeProjectPicker();
});
$('moreBtn').addEventListener('click', function (ev) {
   ev.stopPropagation();
   const opening = $('moreMenu').hidden;
   if (opening) announcePopover('more');
   $('moreMenu').hidden = !opening;
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
   if (a === 'newProject') askText({ title: '新建项目', desc: '项目之间的代码文件和运行时文件彼此独立。', value: '未命名项目', validate: validateNewProjectName }).then(function (name) { if (name) createProject(name); });
   if (a === 'switchProject') { ev.stopPropagation(); $('snippetPop').hidden = true; openProjectPicker(); }
   if (a === 'renameProject') renameCurrentProject();
   if (a === 'deleteProject') deleteCurrentProject();
   if (a === 'settings') { syncSettingsUI(); showDialog('settingsDialog'); }
   if (a === 'resetRuntime') {
      state.runtimeFiles = clone(SAMPLES.runtimeFiles);
      renderRuntimeFiles();
      renderHandles([]);
      save();
      toast('运行环境已重置为初始文件');
   }
   if (a === 'cloudRun') requestCloudRun();
   if (a === 'about') showDialog('aboutDialog');
});

$('projectSwitcher').addEventListener('click', function (ev) {
   ev.stopPropagation();
   const picker = $('projectPicker');
   const open = picker.hidden;
   picker.hidden = !open;
   this.setAttribute('aria-expanded', String(open));
   if (open) renderProjectLabel();
});
$('projectPicker').addEventListener('click', function (ev) {
   const item = ev.target.closest('[data-project-id]');
   if (item) { switchProject(item.dataset.projectId); closeProjectPicker(); return; }
   const action = ev.target.closest('[data-project-action]');
   if (!action) return;
   closeProjectPicker();
   if (action.dataset.projectAction === 'new') $('moreMenu').querySelector('[data-action="newProject"]').click();
   if (action.dataset.projectAction === 'rename') renameCurrentProject();
   if (action.dataset.projectAction === 'delete') deleteCurrentProject();
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
         save();
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
   $('setLint').setAttribute('aria-checked', String(!!state.settings.lint));
   Array.prototype.forEach.call($('setRuntimeProfile').children, function (b) {
      b.setAttribute('aria-checked', String(b.dataset.value === state.settings.runtimeProfile));
   });
}

$('setRuntimeProfile').addEventListener('click', function (ev) {
   const b = ev.target.closest('button[data-value]');
   if (!b) return;
   state.settings.runtimeProfile = b.dataset.value === 'advanced-2027' ? 'advanced-2027' : 'core-2027';
   syncSettingsUI();
   savePrefs();
});

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
      STORAGE.remove(STORE_KEY);
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
   // Esc、点遮罩、点 ✕ 三条路都汇到这里，所以移回表格只需要写在这一个地方
   restoreTraceTable();
   $('overlay').hidden = true;
   document.querySelectorAll('.dialog').forEach(function (d) { d.hidden = true; });
   dialogValidate = null;
   if (dialogResolve) {
      const done = dialogResolve;
      dialogResolve = null;
      done(null);
   }
}
$('traceExpand').addEventListener('click', openTraceDialog);
$('overlay').addEventListener('click', closeDialogs);
document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeDialogs); });
document.addEventListener('keydown', function (ev) {
   if (ev.key === 'Escape') { closeDialogs(); $('snippetPop').hidden = true; $('moreMenu').hidden = true; closeProjectPicker(); }
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

/* ---------------- 云端：项目同步与云端运行 ----------------
 *
 * 这一段只做两件事：把本地项目的样子交给 SyncEngine，以及在已有的运行面板里
 * 多提供一次「在云端跑」。本地编辑、本地保存和本地运行的代码路径一行没动——
 * 云端不可用、没登录、断网，上面那些照常工作。
 */
const CLOUD = window.CloudClient;
const SYNC = window.SyncEngine;
const CLOUD_COPY_TAG = '云端副本';

function cloudUuid() {
   if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
   return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
}

/* 运行时文件传上去的是「内容」，id 和文件名走同步实体自己的字段，不重复放一份。 */
function runtimeContentOf(file) {
   return file.kind === 'records'
      ? { kind: 'records', recordType: file.recordType || '', records: clone(file.records || []) }
      : { kind: 'text', lines: clone(file.lines || []) };
}

function runtimeFileFrom(id, name, content) {
   const value = content && typeof content === 'object' ? content : {};
   return value.kind === 'records'
      ? { id: id, name: name, kind: 'records', recordType: typeof value.recordType === 'string' ? value.recordType : '', records: Array.isArray(value.records) ? value.records : [] }
      : { id: id, name: name, kind: 'text', lines: Array.isArray(value.lines) ? value.lines : [] };
}

function cloudFilesOf(project) {
   const files = (project.docs || []).map(function (doc) {
      return { id: doc.id, kind: 'source', name: doc.name, content: typeof doc.source === 'string' ? doc.source : '' };
   });
   (project.runtimeFiles || []).forEach(function (file) {
      files.push({ id: file.id, kind: 'runtime', name: file.name, content: runtimeContentOf(file) });
   });
   return files;
}

/*
 * 这个项目是不是「出厂默认、一个字没改过」。
 *
 * 编辑器首次加载就会自动建一个带示例文件的默认项目，所以哪怕全新的浏览器
 * 也「有 1 个项目」。登录时把它当成「未登录时留下的内容」去问要不要并入，
 * 对什么都没做过的人就是纯粹的噪音——所以内容与出厂样例完全一致时跳过。
 * 只要动过一个字、改过项目名、加删过文件，就不再是出厂状态，照常询问。
 */
function matchesSampleSet(project, sample) {
   const docs = project.docs || [];
   if (docs.length !== sample.docs.length) return false;
   const sameDocs = sample.docs.every(function (item, index) {
      const doc = docs[index];
      return doc && doc.id === item.id && doc.name === item.name && doc.source === item.source;
   });
   if (!sameDocs) return false;
   const runtimeFiles = project.runtimeFiles || [];
   if (runtimeFiles.length !== sample.runtimeFiles.length) return false;
   return sample.runtimeFiles.every(function (item, index) {
      return JSON.stringify(runtimeFiles[index]) === JSON.stringify(item);
   });
}

function isPristineProject(project) {
   if (project.name !== '我的项目') return false;
   /* 出厂样例改过版本；老浏览器里存的是旧的那一份，同样是「没动过」。
      认不出旧快照的话，这些人一登录就会被问一次要不要并入自己什么都没做过的内容。 */
   const sets = [{ docs: SAMPLES.docs, runtimeFiles: SAMPLES.runtimeFiles }].concat(SAMPLES.legacy || []);
   return sets.some(function (sample) { return matchesSampleSet(project, sample); });
}

/* 同步只看代码文件和运行时文件。当前打开的是哪个项目、哪个文件、滚到哪里、
   主题、字号这些是这台设备的事，一律不上传。 */
function cloudCollect() {
   flushStateIntoProjects();
   return projects.map(function (project) {
      return {
         id: project.id,
         name: project.name,
         pristine: isPristineProject(project),
         files: cloudFilesOf(project)
      };
   });
}

/*
 * pull 和冲突处理都直接改 projects。改完必须尽快回流到 state 并落盘：
 * state 才是编辑器眼前那一份，下一次保存会用 state 覆盖 projects——
 * 只改 projects 不回流，新加进来的文件（包括冲突副本）会在下一次保存时被抹掉。
 * 用 0ms 定时器把一次 pull 里的多次改动并成一遍重画。
 */
let cloudNeedsRender = false;
let cloudRenderTimer = null;

function cloudScheduleRender() {
   cloudNeedsRender = true;
   if (cloudRenderTimer) return;
   cloudRenderTimer = setTimeout(function () { cloudRenderTimer = null; cloudAfterPull(); }, 0);
}

function cloudProjectById(id) {
   return projects.find(function (project) { return project.id === id; }) || null;
}

function cloudApplyProject(project) {
   if (cloudProjectById(project.id)) return;
   projects.push({ id: project.id, name: project.name, docs: [], activeId: null, runtimeFiles: [] });
   cloudScheduleRender();
}

function cloudRenameProject(id, name) {
   const project = cloudProjectById(id);
   if (!project || isLessonProject(project) || isReservedProjectName(name)) return;
   project.name = name;
   cloudScheduleRender();
}

/* 另一台设备删掉的项目也在这里消失，但本地至少保留一个：
   编辑器的每一条路径都假设当前项目存在。 */
function cloudRemoveProject(id) {
   if (projects.length <= 1) return false;
   const index = projects.findIndex(function (project) { return project.id === id; });
   if (index < 0) return true;
   projects.splice(index, 1);
   if (currentProjectId === id) currentProjectId = projects[0].id;
   cloudScheduleRender();
   return true;
}

function cloudApplyFile(projectId, file) {
   const project = cloudProjectById(projectId);
   if (!project) return;
   if (file.kind === 'runtime') {
      project.runtimeFiles = project.runtimeFiles || [];
      const existingRuntime = project.runtimeFiles.find(function (item) { return item.id === file.id; });
      const next = runtimeFileFrom(file.id, file.name, file.content);
      if (existingRuntime) Object.assign(existingRuntime, next);
      else project.runtimeFiles.push(next);
   } else {
      project.docs = project.docs || [];
      const existingDoc = project.docs.find(function (item) { return item.id === file.id; });
      if (existingDoc) {
         existingDoc.name = file.name;
         existingDoc.source = typeof file.content === 'string' ? file.content : '';
         existingDoc.updatedAt = Date.now();
      } else {
         project.docs.push({ id: file.id, name: file.name, source: typeof file.content === 'string' ? file.content : '', updatedAt: Date.now() });
      }
   }
   cloudScheduleRender();
}

function cloudRemoveFile(projectId, fileId) {
   const project = cloudProjectById(projectId);
   if (!project) return true;
   project.docs = (project.docs || []).filter(function (doc) { return doc.id !== fileId; });
   project.runtimeFiles = (project.runtimeFiles || []).filter(function (file) { return file.id !== fileId; });
   cloudScheduleRender();
   return true;
}

/*
 * 编辑器出厂就带着这几份演示文件，每台设备上的 id 和内容都一模一样。
 * 一个字都没改过的演示文件不是「本地那一份」，只是出厂内容——
 * 这时直接采用云端那一版，而不是在它旁边再摆一个副本；
 * 否则每台新设备第一次登录都会凭空多出四五个「（云端副本）」。
 */
function isUntouchedSample(fileId, localFile) {
   if (!localFile) return false;
   /* 出厂样例换过一版，老设备上存的还是旧的那一份；旧的那一份同样是没动过的出厂内容。 */
   const sets = [{ docs: SAMPLES.docs, runtimeFiles: SAMPLES.runtimeFiles }].concat(SAMPLES.legacy || []);
   return sets.some(function (set) {
      const sample = set.docs.concat(set.runtimeFiles).find(function (item) { return item.id === fileId; });
      if (!sample) return false;
      return localFile.kind === 'source'
         ? localFile.content === sample.source
         : JSON.stringify(localFile.content) === JSON.stringify(runtimeContentOf(sample));
   });
}

/*
 * 冲突副本：本地那一份一个字都不动，服务端那一份作为同一个项目里的新文件出现。
 * 用的是现有的命名规则（重名自动编号）和现有的项目体系，没有另开一套比较界面。
 * 返回 true 表示「本地那一份只是没动过的出厂内容，已经直接采用云端版本」。
 */
function cloudAddConflictCopy(projectId, localFileId, serverFile) {
   const project = cloudProjectById(projectId);
   if (!project) return false;
   const localFile = cloudFilesOf(project).find(function (file) { return file.id === localFileId; });
   if (isUntouchedSample(localFileId, localFile)) {
      cloudApplyFile(projectId, { id: localFileId, kind: serverFile.kind, name: serverFile.name, content: serverFile.content });
      return true;
   }
   if (serverFile.kind === 'runtime') {
      project.runtimeFiles = project.runtimeFiles || [];
      const dot = serverFile.name.lastIndexOf('.');
      const base = stripExt(serverFile.name) + '（' + CLOUD_COPY_TAG + '）' + (dot > 0 ? serverFile.name.slice(dot) : '.txt');
      const copy = runtimeFileFrom('rf-' + cloudUuid(), uniqueName(project.runtimeFiles, base), serverFile.content);
      project.runtimeFiles.push(copy);
   } else {
      project.docs = project.docs || [];
      const wanted = ensureExt(stripExt(serverFile.name) + '（' + CLOUD_COPY_TAG + '）');
      project.docs.push({
         id: 'doc-' + cloudUuid(),
         name: uniqueName(project.docs, wanted, true),
         source: typeof serverFile.content === 'string' ? serverFile.content : '',
         updatedAt: Date.now()
      });
   }
   cloudScheduleRender();
   toast('云端有一份不同的「' + serverFile.name + '」，已作为副本放进当前项目。');
   return false;
}

/*
 * pull 改过 projects 之后，把当前项目重新读回 state 并重画。
 *
 * 这里可以放心整份重读：pull 只在「本地这一份没被改过」时才写本地
 * （内容一致、本地没有、或者还是原封不动的出厂演示文件）；
 * 本地真的改过的文件走的是冲突副本那条路，不会被碰。
 * 编辑器要求「总有一个可编辑的文件」，所以空项目要补一个。
 */
function cloudAfterPull() {
   if (cloudRenderTimer) { clearTimeout(cloudRenderTimer); cloudRenderTimer = null; }
   if (!cloudNeedsRender) return;
   cloudNeedsRender = false;
   const openId = state.activeId;
   syncStateFromCurrentProject();
   if (!state.docs.length) {
      const blank = { id: 'doc-' + Date.now(), name: 'Main.pseudocode', source: '// Main.pseudocode\n', updatedAt: Date.now() };
      state.docs = [blank];
      state.activeId = blank.id;
   } else {
      state.activeId = state.docs.some(function (doc) { return doc.id === openId; }) ? openId : state.docs[0].id;
   }
   code.value = activeDoc().source;
   $('docName').value = activeDoc().name;
   renderProjectLabel();
   renderFiles();
   renderRuntimeFiles();
   renderEditor();
   runLint();
   persistProjects();
}

if (SYNC) {
   SYNC.useProjects({
      collect: cloudCollect,
      findProject: cloudProjectById,
      findFile: function (projectId, fileId) {
         const project = cloudProjectById(projectId);
         if (!project) return null;
         return cloudFilesOf(project).find(function (file) { return file.id === fileId; }) || null;
      },
      applyProject: cloudApplyProject,
      renameProject: cloudRenameProject,
      removeProject: cloudRemoveProject,
      applyFile: cloudApplyFile,
      removeFile: cloudRemoveFile,
      addConflictCopy: cloudAddConflictCopy,
      afterPull: cloudAfterPull
   });
}

/* ---------------- 云端运行 ---------------- */

let cloudRunInputs = [];
let cloudRunBusy = false;

function cloudRunAvailable() {
   return Boolean(CLOUD && CLOUD.available() && window.AuthStore && window.AuthStore.isSignedIn());
}

/*
 * 同一台设备换账号后，旧账号的项目仍可本地编辑和运行，但绝不能把它的
 * 快照发送到当前账号的云端。游客自己留下的项目也要先明确选择「并入」。
 */
function cloudRunHoldMessage() {
   const hold = SYNC && SYNC.pendingHold ? SYNC.pendingHold() : null;
   if (hold && hold.fromGuest) {
      return '这是登录前保留在本机的项目。请先在账户面板选择「并入」，再使用云端运行。';
   }
   return '这是这台设备上一位用户留下的项目，默认只能本地运行。如果它其实是你的，可以在账户面板选择「并入项目」。';
}

function cloudRunBlockedByProjectHold() {
   return Boolean(SYNC && SYNC.isProjectHeld && SYNC.isProjectHeld(currentProjectId));
}

/*
 * 快照取自编辑器内存里的当前内容，不等同步完成，也不让服务端按 projectId 回读文件：
 * 本地改到 revision 12、云端还停在 11 的时候，跑的必须是眼前这一版。
 * projectId 只用于归属和权限。
 */
function cloudRunSnapshot() {
   flushStateIntoProjects();
   const entry = activeDoc();
   const files = state.docs.map(function (doc) {
      return { id: doc.id, kind: 'source', name: doc.name, content: doc.id === entry.id ? code.value : (doc.source || '') };
   });
   state.runtimeFiles.forEach(function (file) {
      files.push({ id: file.id, kind: 'runtime', name: file.name, content: runtimeContentOf(file) });
   });
   return { entryFileId: entry.id, files: files };
}

function needsInputs(source) {
   return /(^|\n)\s*INPUT\b/.test(source);
}

function requestCloudRun() {
   if (run.active || cloudRunBusy) return;
   if (!CLOUD || !CLOUD.available()) { toast('云端功能暂未连接。'); return; }
   if (!cloudRunAvailable()) { toast('登录后可使用云端运行'); return; }
   if (cloudRunBlockedByProjectHold()) { toast(cloudRunHoldMessage()); return; }
   if (!needsInputs(code.value)) { startCloudRun([]); return; }
   $('cloudRunInputs').value = cloudRunInputs.join('\n');
   $('cloudRunError').textContent = '';
   showDialog('cloudRunDialog');
   $('cloudRunInputs').focus();
}

$('cloudRunStart').addEventListener('click', function () {
   const raw = $('cloudRunInputs').value;
   cloudRunInputs = raw === '' ? [] : raw.replace(/\r\n?/g, '\n').split('\n');
   closeDialogs();
   startCloudRun(cloudRunInputs);
});

async function startCloudRun(inputs) {
   // 输入弹窗打开后可能发生过切换账号等状态变化，因此在发送前再守一次。
   if (cloudRunBlockedByProjectHold()) { toast(cloudRunHoldMessage()); return; }
   const snapshot = cloudRunSnapshot();
   cloudRunBusy = true;
   run = { active: true, controller: null, pending: false, fileTouched: false };
   showTab('output');
   $('console').innerHTML = '';
   resetTrace('云端运行不产生追踪记录；点「运行」在本机运行可查看逐步追踪。');
   $('runBtn').disabled = true;
   setStatus('云端运行中…', 'running');
   println('已提交到云端运行（使用编辑器中的当前内容）。', 'sys');

   try {
      const projectId = await SYNC.ensureProject(currentProjectId, projectName());
      const result = await CLOUD.request('/api/runs', {
         method: 'POST',
         body: {
            projectId: projectId,
            requestId: cloudUuid(),
            runtimeVersion: 'web-1',
            profile: state.settings.runtimeProfile,
            inputs: inputs,
            snapshot: snapshot
         }
      });
      renderCloudRunResult(result);
   } catch (error) {
      failCloudRun(error);
   } finally {
      cloudRunBusy = false;
      $('runBtn').disabled = false;
   }
}

/* 输出、变量、错误和虚拟文件变更全部走现有的那一套渲染，不另起一套结果页面。 */
function renderCloudRunResult(result) {
   (result.outputs || []).forEach(function (line) { println(line); });
   if (result.error) {
      const line = result.error.range && result.error.range.start ? result.error.range.start.line : 1;
      println('运行时错误 ' + result.error.code + '（行 ' + line + '）：' + runtimeMessage(result.error), 'err');
      setStatus('运行时错误 · 行 ' + line, 'error');
   } else if (result.status !== 'completed') {
      setStatus('云端运行未正常结束', 'error');
   }
   if (result.status === 'completed' && result.virtualFiles) {
      // 先写回本地工作副本（finishRun 负责），再由保存触发同步队列。
      run.fileTouched = true;
   }
   finishRun(result);
   if (result.error && result.error.messageKey === 'runtime.input.exhausted') {
      println('云端运行不能中途等待输入，请一次把输入补齐后重试。', 'sys');
   }
}

function failCloudRun(error) {
   const code = error && error.code;
   if (code === 'SERVER_BUSY') {
      // 额度、限流和排队过载对使用者是同一件事，不暴露任何内部数字。
      println('服务器繁忙，请稍后再试。', 'sys');
      setStatus('服务器繁忙', 'error');
      toast('服务器繁忙，请稍后再试。');
   } else if (CLOUD && CLOUD.isTooLarge(error)) {
      println(error.message, 'err');
      setStatus('文件过大', 'error');
      toast('文件过大：' + error.message);
   } else if (code === 'UNAUTHENTICATED') {
      println('登录后可使用云端运行。', 'sys');
      setStatus('未登录', 'error');
      toast('登录后可使用云端运行');
   } else if (code === 'LOCAL_PROJECT_HELD') {
      println('这个项目只保留在本机，未发送到云端。', 'sys');
      setStatus('仅本地运行', 'error');
      toast(cloudRunHoldMessage());
   } else if (code === 'OFFLINE') {
      println('网络暂时不可用，云端运行没有开始。本地运行不受影响。', 'sys');
      setStatus('网络不可用', 'error');
   } else {
      println((error && error.message) || '云端运行没有成功。', 'err');
      setStatus('云端运行失败', 'error');
   }
   // 云端失败不碰本地文件，也不影响之后的本地运行。
   run.active = false;
   run.controller = null;
   run.pending = false;
   $('runBtn').hidden = false;
   $('stopBtn').hidden = true;
   setInputWaiting(false);
}

function syncCloudRunMenuState() {
   const item = document.querySelector('[data-action="cloudRun"]');
   if (!item) return;
   const ready = cloudRunAvailable();
   item.querySelector('kbd').textContent = ready ? '' : (CLOUD && CLOUD.available() ? '需登录' : '未连接');
}

if (CLOUD) {
   CLOUD.subscribe(syncCloudRunMenuState);
   syncCloudRunMenuState();
}

/* ---------------- 启动 ---------------- */
load();
// 旧数据里课文文件散落在各个普通项目，收拢到课文项目；改过才需要写回
if (migrateLessonDocsIntoLessonProject()) { syncStateFromCurrentProject(); persistProjects(); }

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

   // 先把当前项目的状态落盘，再整个切到课文项目去——课文文件不进用户自己的项目
   persistProjects();
   const lesson = ensureLessonProject();
   lesson.docs = lesson.docs || [];

   const wanted = ensureExt(payload.name || 'FromLesson');
   const existing = lesson.docs.find(function (d) {
      return d.lesson && d.origin === payload.source && normalizeProjectName(d.name) === normalizeProjectName(wanted);
   });
   if (existing) {
      existing.archived = false;
      lesson.activeId = existing.id;
   } else {
      lesson.docs.push({
         id: 'doc-' + Date.now(),
         name: uniqueName(lesson.docs, wanted, true),
         source: payload.source,
         origin: payload.source,
         lesson: true,
         lessonLabel: payload.label || '来自课文',
         updatedAt: Date.now()
      });
      lesson.activeId = lesson.docs[lesson.docs.length - 1].id;
   }

   currentProjectId = lesson.id;
   syncStateFromCurrentProject();
   persistProjects();
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
renderProjectLabel();
$('saveState').textContent = '已保存';
code.focus();
})();
