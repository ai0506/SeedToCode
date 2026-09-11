/* 伪代码题的公共实现：题面、作答区、判题、进度与草稿。
 *
 * 两个页面共用这一份，所以判题口径不可能走样：
 *   web/js/teaching-app.js   课文页——只渲染「去做题」的入口卡，不再内嵌作答区
 *   web/js/task-page.js      独立做题页 task.html——左题面 / 右作答，左右各自滚动
 *
 * 依赖的全局：CAIEExercise、LANGUAGE_ADAPTER、CAIETeaching（由页面先行加载）。
 *
 * 布局稳定性契约与课文页一致：反馈只用 background/color/box-shadow/opacity；
 * 会变的文字进常驻固定高度槽位。
 */
(function () {
   "use strict";

   var $ = function (s, r) { return (r || document).querySelector(s); };
   var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

   var REVEAL_AFTER = 3;   // 同一题连续失败这么多次之后，才揭示具体用例
   var INDENT = "   ";     // CAIE 伪代码一级缩进＝三空格

   /* ---------------- 文本 ---------------- */

   function esc(t) {
      return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) {
         return c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;";
      });
   }

   // 正文只允许两种行内标记：`code` 与 **bold**
   function inline(text) {
      return esc(text)
         .replace(/`([^`]+)`/g, '<code class="mono">$1</code>')
         .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
   }

   // 纯文本场景（title/aria-label 属性、textContent）：标记符号渲染不出标签，直接去掉
   function plainText(text) {
      return String(text == null ? "" : text)
         .replace(/`([^`]+)`/g, "$1")
         .replace(/\*\*([^*]+)\*\*/g, "$1");
   }

   /* ---------------- 进度：两个页面读写同一份 ---------------- */

   var PROGRESS_KEY = "caie.teaching.progress.v1";
   var ANSWER_KEY = "caie.teaching.answers.v1";

   function readStore(key) {
      try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; }
      catch (e) { return {}; }
   }
   function writeStore(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 无痕模式等 */ }
   }

   var progress = readStore(PROGRESS_KEY);

   var Progress = {
      keyFor: function (chapterId, sectionId) { return chapterId + "/" + sectionId; },
      /** 从 localStorage 重新读一遍。做题页改了进度之后，课文页靠这个对齐。 */
      reload: function () { progress = readStore(PROGRESS_KEY); return progress; },
      isDone: function (chapterId, sectionId) {
         return progress[Progress.keyFor(chapterId, sectionId)] === true;
      },
      setDone: function (chapterId, sectionId) {
         progress[Progress.keyFor(chapterId, sectionId)] = true;
         writeStore(PROGRESS_KEY, progress);
      }
   };

   /* ---------------- 草稿：换页不丢代码 ---------------- */

   /* 入口卡和做题页分处两个文档，学生写到一半退回课文再进来是常态，
      所以作答内容必须落盘，而且两边认同一个键。 */
   var Answers = {
      keyFor: function (chapterId, taskId) { return chapterId + "/" + taskId; },
      get: function (chapterId, taskId) {
         var all = readStore(ANSWER_KEY);
         var value = all[Answers.keyFor(chapterId, taskId)];
         return typeof value === "string" ? value : null;
      },
      set: function (chapterId, taskId, code) {
         var all = readStore(ANSWER_KEY);
         all[Answers.keyFor(chapterId, taskId)] = code;
         writeStore(ANSWER_KEY, all);
      },
      clear: function (chapterId, taskId) {
         var all = readStore(ANSWER_KEY);
         delete all[Answers.keyFor(chapterId, taskId)];
         writeStore(ANSWER_KEY, all);
      }
   };

   /* ---------------- 特征名 ---------------- */

   // 学生看到的是这里的名字，不是特征 ID。FEATURE_IDS 里的每一项都要有一条——
   // 漏一条，界面上就会冒出 `select.case-otherwise` 这样的内部标识。
   var FEATURE_LABELS = {
      "io.input": "INPUT",
      "io.output": "OUTPUT",
      "decl.variable": "DECLARE",
      "decl.constant": "CONSTANT",
      "decl.array-1d": "一维数组声明",
      "decl.array-2d": "二维数组声明",
      "decl.record-type": "记录类型",
      "decl.enum": "枚举类型",
      "decl.pointer": "指针类型",
      "decl.set": "集合类型",
      "decl.class": "类定义",
      "type.integer": "INTEGER",
      "type.real": "REAL",
      "type.char": "CHAR",
      "type.string": "STRING",
      "type.boolean": "BOOLEAN",
      "type.date": "DATE",
      "literal.integer": "整数字面量",
      "literal.real": "实数字面量",
      "literal.char": "字符字面量",
      "literal.string": "字符串字面量",
      "literal.boolean": "布尔字面量",
      "literal.date": "日期字面量",
      "assign.simple": "赋值 ←",
      "expr.function-call": "函数调用",
      "array.index": "数组下标",
      "array.index-2d": "二维下标",
      "record.field-access": "记录字段",
      "op.arithmetic": "四则运算",
      "op.div": "DIV",
      "op.mod": "MOD",
      "op.concat": "字符串连接 &",
      "op.relational": "比较运算",
      "op.and": "AND",
      "op.or": "OR",
      "op.not": "NOT",
      "select.if": "IF",
      "select.if-else": "IF … ELSE",
      "select.nested-if": "嵌套 IF",
      "select.case": "CASE",
      "select.case-otherwise": "OTHERWISE",
      "select.case-range": "CASE 范围标签",
      "loop.for": "FOR",
      "loop.for-step": "STEP",
      "loop.while": "WHILE",
      "loop.repeat": "REPEAT",
      "loop.nested": "嵌套循环",
      "routine.procedure": "PROCEDURE",
      "routine.function": "FUNCTION",
      "routine.call": "CALL",
      "routine.return": "RETURN",
      "param.byval": "BYVAL",
      "param.byref": "BYREF",
      "builtin.length": "LENGTH",
      "builtin.mid": "MID",
      "builtin.right": "RIGHT",
      "builtin.lcase": "LCASE",
      "builtin.ucase": "UCASE",
      "builtin.int": "INT",
      "builtin.rand": "RAND",
      "builtin.eof": "EOF",
      "file.open-read": "OPENFILE … READ",
      "file.open-write": "OPENFILE … WRITE",
      "file.open-append": "OPENFILE … APPEND",
      "file.open-random": "OPENFILE … RANDOM",
      "file.read": "READFILE",
      "file.write": "WRITEFILE",
      "file.close": "CLOSEFILE",
      "file.seek": "SEEK",
      "file.getrecord": "GETRECORD",
      "file.putrecord": "PUTRECORD",
      "oop.new": "NEW",
      "oop.inherits": "INHERITS",
      "oop.super": "SUPER",
      "oop.method-call": "方法调用",
      "misc.comment": "注释"
   };
   function featureLabel(feature) {
      return FEATURE_LABELS[feature] || feature;
   }

   /* ---------------- 在课程数据里定位一道题 ---------------- */

   /** 返回 { chapter, section, task, isChapterTask }；找不到返回 null。 */
   function locate(course, chapterId, taskId) {
      var chapters = course.chapters.filter(function (item) {
         return chapterId == null || item.id === Number(chapterId);
      });
      for (var c = 0; c < chapters.length; c += 1) {
         var chapter = chapters[c];
         for (var s = 0; s < chapter.sections.length; s += 1) {
            var section = chapter.sections[s];
            var found = section.blocks.filter(function (block) {
               return block.kind === "task" && block.id === taskId;
            })[0];
            if (found) return { chapter: chapter, section: section, task: found, isChapterTask: false };
         }
         var big = chapter.chapterTasks.filter(function (task) { return task.id === taskId; })[0];
         if (big) return { chapter: chapter, section: null, task: big, isChapterTask: true };
      }
      return null;
   }

   /** 学完这道题所在小节为止，学生总共学过的特征；章末大题用全章最后一节的。 */
   function taughtFeaturesFor(chapter, taskId) {
      for (var i = 0; i < chapter.sections.length; i += 1) {
         var section = chapter.sections[i];
         var has = section.blocks.some(function (block) {
            return block.kind === "task" && block.id === taskId;
         });
         if (has) return section.taughtFeatures;
      }
      return chapter.sections[chapter.sections.length - 1].taughtFeatures;
   }

   /** 做完这道题算哪一步完成：小节题算它所在的小节，章末大题算 chapterTask。 */
   function stepIdFor(chapter, taskId) {
      var found = locate({ chapters: [chapter] }, chapter.id, taskId);
      if (!found) return null;
      return found.isChapterTask ? "chapterTask" : found.section.id;
   }

   /* ---------------- 题面（左栏） ---------------- */

   function constraintsHtml(task, isChapterTask) {
      var cons = "";
      if (task.constraints) {
         var items = []
            .concat((task.constraints.require || []).map(function (c) {
               return { badge: "必须用", cls: "req", feature: c.feature, reason: c.reason };
            }))
            .concat((task.constraints.forbid || []).map(function (c) {
               return { badge: "不能用", cls: "ban", feature: c.feature, reason: c.reason };
            }));
         cons =
            "<dt>约束</dt><dd><ul class=\"cons-list\">" +
            items.map(function (c) {
               return '<li><span class="cons-badge ' + c.cls + '">' + c.badge + "</span>" +
                  '<span><code class="mono">' + featureLabel(c.feature) + "</code>　" +
                  '<span class="cons-reason">— ' + inline(c.reason) + "</span></span></li>";
            }).join("") +
            "</ul></dd>";
      }
      var suggested = isChapterTask && task.suggestedFeatures
         ? '<dt>建议用到</dt><dd><div class="coverage">' +
           task.suggestedFeatures.map(function (f) {
              return '<span class="cov" data-feature="' + f + '">' + featureLabel(f) + "</span>";
           }).join("") +
           '</div><p class="muted small" style="margin:8px 0 0">写得对就算过；没用到的只会提一下，不影响通过。</p></dd>'
         : "";
      return cons + suggested;
   }

   /**
    * 题面。两个页面共用，所以入口卡上看到的题目描述和做题页上的逐字相同。
    * options.compact 只留题干和输入输出，用于课文页的入口卡预览。
    */
   function renderStatement(task, isChapterTask, options) {
      var opts = options || {};
      var examples = opts.compact ? "" : task.examples
         .map(function (example) {
            return (
               '<div class="io-sample">' +
               "<div><h4>示例输入</h4><pre>" + esc(example.inputs.join("\n") || "（不需要输入）") + "</pre></div>" +
               "<div><h4>示例输出</h4><pre>" + esc(example.outputs.join("\n")) + "</pre></div></div>"
            );
         })
         .join("");

      var hints = opts.compact ? "" : '<div class="hints">' + task.hints
         .map(function (hint, index) {
            if (index === 0) {
               return '<div class="hint-row" data-open="true"><span class="hint-n">提示 1</span>' +
                  '<span class="hint-text">' + inline(hint) + "</span></div>";
            }
            return (
               '<div class="hint-row" data-open="false"><span class="hint-n">提示 ' + (index + 1) + "</span>" +
               '<span class="hint-text">' + inline(hint) + "</span>" +
               '<span class="hint-open"><button class="btn small" style="width:100%" data-act="open-hint">展开</button></span></div>'
            );
         })
         .join("") + "</div>";

      return (
         '<p class="task-statement">' + inline(task.statement) + "</p>" +
         '<dl class="spec-grid"><dt>输入</dt><dd>' + inline(task.ioSpec.input) + "</dd>" +
         "<dt>输出</dt><dd>" + inline(task.ioSpec.output).replace(/\n/g, "<br>") + "</dd>" +
         (opts.compact ? "" : constraintsHtml(task, isChapterTask)) + "</dl>" +
         examples + hints
      );
   }

   /* ---------------- 作答区（右栏） ---------------- */

   /** 锁定片段拼在学生答案之前，所以它占掉的行号也要算进去。 */
   function lockedLineCount(task) {
      var locked = task.lockedStarterCode;
      if (!locked || !locked.trim()) return 0;
      return locked.replace(/\n+$/, "").split("\n").length;
   }

   function gutterHtml(from, to) {
      var html = "";
      for (var i = from; i <= to; i += 1) html += "<span>" + i + "</span>";
      return html;
   }

   function renderWorkspace(task) {
      var lockedLines = lockedLineCount(task);
      // 锁定片段也带行号：不然学生看到作答区从第 3 行开始会以为出了错，
      // 而诊断报的正是把锁定行算进去之后的行号。
      var locked = lockedLines
         ? '<div class="mini-editor-locked"><span>已准备好，不需要改：</span>' +
           '<div class="mini-editor-body locked-body"><div class="mini-gutter" aria-hidden="true">' +
           gutterHtml(1, lockedLines) + '</div><pre>' +
           esc(task.lockedStarterCode.replace(/\n+$/, "")) + "</pre></div></div>"
         : "";
      return (
         '<div class="mini-editor">' +
         '<div class="mini-editor-head"><span>你的作答</span><span class="spacer"></span>' +
         '<span class="save-slot" data-state="idle"></span>' +
         '<span class="small muted">三空格缩进 · <code class="mono">&lt;-</code> 自动转 <code class="mono">←</code></span></div>' +
         locked +
         '<div class="mini-editor-body"><div class="mini-gutter" aria-hidden="true"></div>' +
         '<textarea spellcheck="false" placeholder="从这里继续写…" data-line-offset="' + lockedLines +
         '"></textarea></div></div>' +
         '<div class="task-actions">' +
         '<button class="btn btn-primary fixed-btn wide" data-act="submit">提交</button>' +
         '<button class="btn fixed-btn" data-act="reset">重置</button>' +
         '<span class="spacer"></span><span class="attempt-slot"></span></div>' +
         '<div class="verdict" hidden>' +
         '<div class="verdict-head"><span class="vtitle"></span><span class="spacer"></span>' +
         '<span class="small vlayer"></span></div>' +
         '<div class="verdict-layers"><div class="layers">' +
         '<div class="layer"><span class="lstate">·</span>语法</div>' +
         '<div class="layer"><span class="lstate">·</span>题目要求</div>' +
         '<div class="layer"><span class="lstate">·</span>运行结果</div>' +
         '<div class="layer"><span class="lstate">·</span>书写规范</div>' +
         "</div></div>" +
         '<div class="verdict-scroll"></div></div>' +
         '<div class="next-step" hidden></div>'
      );
   }

   /* ---------------- 作答框的输入约定 ---------------- */

   /**
    * 作答框和主编辑器遵守相同的赋值输入约定。
    * 只转换刚输入的 `<-`，并且绝不改写字符串、字符字面量或注释里的文字。
    */
   function isInLiteralOrComment(line, column) {
      var quote = null;
      for (var i = 0; i < column; i += 1) {
         var character = line[i];
         if (quote) {
            if (character === quote) quote = null;
            continue;
         }
         if (character === '"' || character === "'") { quote = character; continue; }
         if (character === "/" && line[i + 1] === "/") return true;
      }
      return quote !== null;
   }

   function convertTrailingAsciiArrow(textarea) {
      var end = textarea.selectionStart;
      if (end < 2 || textarea.value.slice(end - 2, end) !== "<-") return false;
      var lineStart = textarea.value.lastIndexOf("\n", end - 1) + 1;
      var line = textarea.value.slice(lineStart, end);
      if (isInLiteralOrComment(line, end - 2 - lineStart)) return false;
      textarea.setRangeText("←", end - 2, end, "end");
      return true;
   }

   function convertAsciiArrowsInPastedCode(text) {
      return text.split("\n").map(function (line) {
         var output = "";
         var quote = null;
         for (var i = 0; i < line.length; i += 1) {
            var character = line[i];
            if (quote) {
               output += character;
               if (character === quote) quote = null;
               continue;
            }
            if (character === '"' || character === "'") { quote = character; output += character; continue; }
            if (character === "/" && line[i + 1] === "/") { output += line.slice(i); break; }
            if (character === "<" && line[i + 1] === "-") { output += "←"; i += 1; continue; }
            output += character;
         }
         return output;
      }).join("\n");
   }

   /* 和主编辑器一样走 execCommand：直接赋值 value 会清空浏览器的撤销栈，
      Tab 缩进之后就再也 Ctrl+Z 不回去了。 */
   function applyEdit(textarea, start, end, text, caret) {
      textarea.focus();
      textarea.setSelectionRange(start, end);
      var ok = false;
      try {
         ok = text === ""
            ? document.execCommand("delete")
            : document.execCommand("insertText", false, text);
      } catch (e) { ok = false; }
      if (!ok) {
         textarea.value = textarea.value.slice(0, start) + text + textarea.value.slice(end);
         textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      var pos = caret === undefined ? start + text.length : caret;
      textarea.setSelectionRange(pos, pos);
   }

   /** Tab / Shift+Tab / 行首退格：全部按三空格的停靠点走，与主编辑器一致。 */
   function wireIndenting(textarea) {
      function lineInfo() {
         var s = textarea.selectionStart;
         var start = textarea.value.lastIndexOf("\n", s - 1) + 1;
         var end = textarea.value.indexOf("\n", s);
         if (end === -1) end = textarea.value.length;
         return { start: start, end: end, text: textarea.value.slice(start, end) };
      }

      textarea.addEventListener("keydown", function (event) {
         if (event.isComposing || event.keyCode === 229) return;

         if (event.key === "Tab") {
            event.preventDefault();
            var s = textarea.selectionStart;
            var e = textarea.selectionEnd;
            if (s !== e && textarea.value.slice(s, e).indexOf("\n") >= 0) {
               var blockStart = textarea.value.lastIndexOf("\n", s - 1) + 1;
               var blockEnd = textarea.value.indexOf("\n", e);
               if (blockEnd === -1) blockEnd = textarea.value.length;
               var original = textarea.value.slice(blockStart, blockEnd);
               var block = original.split("\n").map(function (line) {
                  if (!event.shiftKey) return INDENT + line;
                  var lead = (line.match(/^ */) || [""])[0].length;
                  return lead ? line.slice(((lead - 1) % 3) + 1) : line;
               }).join("\n");
               if (block === original) return;
               applyEdit(textarea, blockStart, blockEnd, block);
               textarea.setSelectionRange(blockStart, blockStart + block.length);
               return;
            }
            if (event.shiftKey) {
               var li = lineInfo();
               var lead2 = (li.text.match(/^ */) || [""])[0].length;
               if (lead2 > 0) {
                  var cut = ((lead2 - 1) % 3) + 1;
                  applyEdit(textarea, li.start, li.start + cut, "", Math.max(li.start, s - cut));
               }
               return;
            }
            applyEdit(textarea, s, e, INDENT);
            return;
         }

         if (event.key === "Enter") {
            // 只延续当前缩进，不自动补结束符——作答区没有主编辑器的结构感知。
            var info = lineInfo();
            var indent = (info.text.match(/^ */) || [""])[0];
            if (!indent) return;
            event.preventDefault();
            applyEdit(textarea, textarea.selectionStart, textarea.selectionEnd, "\n" + indent);
            return;
         }

         if (event.key === "Backspace" && textarea.selectionStart === textarea.selectionEnd) {
            var caret = textarea.selectionStart;
            var row = lineInfo();
            var column = caret - row.start;
            if (column > 0 && /^ +$/.test(row.text.slice(0, column))) {
               event.preventDefault();
               applyEdit(textarea, caret - (((column - 1) % 3) + 1), caret, "");
            }
         }
      });
   }

   /**
    * 行号槽。诊断按行号说话，作答区没有行号等于让学生自己数。
    * offset 是锁定片段的行数——编号必须和提交上去的整段源码对齐，
    * 否则「第 5 行」指到的位置和学生数出来的差好几行。
    */
   function wireGutter(textarea, gutter, offset) {
      var from = (offset || 0) + 1;
      function paint() {
         var count = textarea.value.split("\n").length;
         if (gutter.childElementCount === count) return;
         gutter.innerHTML = gutterHtml(from, offset + count);
      }
      textarea.addEventListener("input", paint);
      textarea.addEventListener("scroll", function () { gutter.scrollTop = textarea.scrollTop; }, { passive: true });
      paint();
   }

   /* ---------------- 判题结果 ---------------- */

   function setVerdict(verdict, state, title, layer, html, layers) {
      verdict.dataset.state = state;
      $(".vtitle", verdict).textContent = title;
      $(".vlayer", verdict).textContent = layer;
      $(".verdict-scroll", verdict).innerHTML = html;
      $(".verdict-scroll", verdict).scrollTop = 0;
      var nodes = $$(".layer", verdict);
      layers.forEach(function (value, index) {
         nodes[index].className = "layer " + (value === 1 ? "ok" : value === -1 ? "fail" : "skip");
         $(".lstate", nodes[index]).textContent = value === 1 ? "✓" : value === -1 ? "!" : "·";
      });
   }

   function diagnosticList(diagnostics) {
      var label = { error: "阻断错误", caie: "CAIE 规范", hint: "建议" };
      return '<ul class="expect-diags">' + diagnostics.map(function (d) {
         var adapted = window.LANGUAGE_ADAPTER.adaptOne ? window.LANGUAGE_ADAPTER.adaptOne(d) : d;
         var origin = d.origin === "CAIE"
            ? '<span class="origin-tag caie">CAIE 规定</span>'
            : '<span class="origin-tag rt">编辑器约定</span>';
         return '<li class="sev-' + d.severity + '">' +
            '<div class="problem-msg"><span class="sev-chip">' + label[d.severity] + "</span>" +
            esc(adapted.message || d.messageKey) + "</div>" +
            '<div class="problem-meta"><span>第 ' + d.range.start.line + " 行</span>" + origin + "</div></li>";
      }).join("") + "</ul>";
   }

   /**
    * 语法合法、但多半不是本意的写法。
    * 目前只有一条：变量名被写进了引号里——这段代码没毛病，只是它会原样显示那几个字母。
    */
   function codeNoteHtml(notes) {
      if (!notes || !notes.length) return "";
      return notes.map(function (note) {
         if (note.kind !== "variable-in-string") return "";
         var names = note.names.map(function (n) { return '<code class="mono">' + esc(n) + "</code>"; }).join("、");
         return (
            '<div class="code-note"><span class="code-note-head">第 ' + note.line + " 行</span>" +
            "引号里的内容会**原样**显示。" + names +
            " 写在引号里就只是这几个字母本身，不会变成读进来的值。要显示它的值，得把它放到引号外面，用逗号隔开：<br>" +
            '<code class="mono">OUTPUT "Hello, ", ' + esc(note.names[0]) + "</code></div>"
         );
      }).join("").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
   }

   /**
    * 程序跑到一半停了：把停在哪一行、为什么停直接说出来。
    * 这说的是学生自己的代码，不泄露判题用的数据。
    * 原来这里只说「先看看错误提示」，而界面上根本没有那个提示。
    */
   function runtimeErrorHtml(failed) {
      if (!failed || !failed.runtimeError) return "";
      var text = window.runtimeMessage ? window.runtimeMessage(failed.runtimeError) : failed.runtimeError.messageKey;
      return (
         '<div class="code-note"><span class="code-note-head">第 ' + failed.runtimeError.line + " 行</span>" +
         esc(text) + "</div>"
      );
   }

   /** 输出对不上时，指出该往哪个方向查——「输出不符」这四个字帮不了任何人。 */
   function diffAdvice(failed) {
      if (failed.status === "input-exhausted") return "程序要的输入比题目给的多——检查是不是多读了一次。";
      if (failed.status === "error") return "程序没跑完就停了——停下来的那一行和原因在下面。";
      if (failed.status === "stopped") return "程序没能正常结束，检查一下是不是停不下来。";
      switch (failed.diffKind) {
         case "line-count":
            return "输出的行数和要求的不一样——数一数题目要求显示几行。";
         case "literal":
            return "输出中的文字部分不符合要求——检查是否漏掉了文字或双引号，以及文字的大小写、空格和单复数。";
         case "data":
            return "引号里的文字没问题，但显示出来的数据不对——检查是不是用错了变量、把顺序弄反了，或者漏了一项。";
         default:
            return "这一行和要求的对不上，看起来是漏了一部分或者多了一部分——对照题目里写的输出格式检查。";
      }
   }

   function renderVerdict(verdict, result, failedRuns, task, onPass) {
      if (result.failedLayer === "L0") {
         setVerdict(verdict, "l0", "先改掉语法错误", "语法",
            diagnosticList(result.diagnostics) +
            '<p class="muted small" style="margin:10px 0 0">先把这里改到能跑起来，再看结果对不对。</p>',
            [-1, 0, 0, 0]);
         return;
      }

      if (result.failedLayer === "L1") {
         var unmet = result.constraintResults.filter(function (item) { return !item.satisfied; });
         setVerdict(verdict, "l1", "能跑，但没按这一节的要求写", "题目要求",
            '<ul class="cons-list">' + unmet.map(function (item) {
               return '<li><span class="cons-badge ' + (item.kind === "forbid" ? "ban" : "req") + '">' +
                  (item.kind === "forbid" ? "不能用" : "必须用") + "</span><span><code class=\"mono\">" +
                  featureLabel(item.feature) + '</code> — <span style="color:var(--no)">' +
                  (item.kind === "forbid" ? "用到了" : "没有用到") + "</span><br>" +
                  '<span class="cons-reason">' + inline(item.reason) + "</span></span></li>";
            }).join("") + "</ul>",
            [1, -1, 0, 0]);
         return;
      }

      var passed = result.testResults.filter(function (item) { return item.passed; }).length;
      var total = result.testResults.length;
      var tally =
         '<div class="test-tally"><span>通过</span><span class="tally-bar">' +
         '<span class="tally-fill" style="width:' + (total ? Math.round((passed / total) * 100) : 0) + '%"></span>' +
         '</span><span class="tally-num">' + passed + " / " + total + "</span></div>";

      if (!result.passed) {
         var failed = result.testResults.filter(function (item) { return !item.passed; })[0];
         var body = tally +
            '<div class="case-hint"><span class="lead">没通过的情况</span>' + esc(failed.caseHint) + "</div>";
         body += '<p class="reveal-note">' + diffAdvice(failed) + "</p>";
         body += runtimeErrorHtml(failed);
         body += codeNoteHtml(result.codeNotes);
         if (failedRuns >= REVEAL_AFTER) {
            body +=
               '<div class="diffbox"><div><h5>期望输出</h5><pre>' + esc(failed.expected.join("\n")) +
               "</pre></div><div><h5>你的输出</h5><pre>" + esc(failed.actual.join("\n")) + "</pre></div></div>" +
               '<p class="reveal-note">输入：' + esc(failed.inputs.join(" / ") || "（无）") + "</p>";
            setVerdict(verdict, "l2r", "看一下这组数据", "运行结果", body, [1, 1, -1, 0]);
         } else {
            setVerdict(verdict, "l2", "还有情况没有覆盖到", "运行结果", body, [1, 1, -1, 0]);
         }
         return;
      }

      var style = result.styleNotes.length
         ? '<div class="style-notes"><div class="style-notes-head"><span>另外有 ' + result.styleNotes.length +
           " 处可以写得更规范，不影响通过</span></div>" + diagnosticList(result.styleNotes) + "</div>"
         : '<p class="muted small" style="margin-top:10px">书写规范上也没有可挑的。</p>';
      var ahead = result.aheadFeatures.length
         ? '<p class="reveal-note">你用到了 ' + result.aheadFeatures.map(featureLabel).join("、") +
           "——写得没问题，只是本章还没讲到它。</p>"
         : "";
      var coverage = "";
      if (task.suggestedFeatures) {
         coverage = '<div class="coverage">' + task.suggestedFeatures.map(function (f) {
            var used = result.usedFeatures && result.usedFeatures.indexOf(f) >= 0;
            return '<span class="cov ' + (used ? "used" : "missed") + '">' + (used ? "✓ " : "") +
               featureLabel(f) + "</span>";
         }).join("") + "</div>";
      }
      setVerdict(verdict, "pass", "通过", "全部通过", tally + coverage + style + ahead, [1, 1, 1, 1]);
      if (onPass) onPass(result);
   }

   /* ---------------- 接线 ---------------- */

   /**
    * 把一块 renderWorkspace 的 DOM 接上引擎。
    * options: { chapterId, taskId, taughtFeatures, onPass(result) }
    * root 里还可以包含 renderStatement 产出的提示行，一并接上。
    */
   function wire(root, task, options) {
      var opts = options || {};
      var textarea = $("textarea", root);
      var verdict = $(".verdict", root);
      // 锁定片段自己也有一条行号槽，别把学生作答区的行号画到那上面去
      var gutter = $(".mini-editor-body:not(.locked-body) .mini-gutter", root);
      var saveSlot = $(".save-slot", root);
      // 只统计「跑到用例这一层还没过」的次数：语法错误的提交不算，
      // 因为那时学生根本还没开始对付数据。
      var failedRuns = 0;
      var composing = false;
      var saveTimer = null;

      wireHints(root);

      if (!textarea) return { textarea: null };

      var saved = opts.chapterId != null ? Answers.get(opts.chapterId, task.id) : null;
      textarea.value = saved != null ? saved : (task.starterCode || "");

      if (gutter) wireGutter(textarea, gutter, lockedLineCount(task));
      wireIndenting(textarea);

      function markSaved() {
         if (!saveSlot) return;
         saveSlot.dataset.state = "saved";
         saveSlot.textContent = "已保存";
      }

      function scheduleSave() {
         if (opts.chapterId == null) return;
         if (saveSlot) { saveSlot.dataset.state = "saving"; saveSlot.textContent = "保存中"; }
         clearTimeout(saveTimer);
         saveTimer = setTimeout(function () {
            Answers.set(opts.chapterId, task.id, textarea.value);
            markSaved();
         }, 400);
      }

      function sourceWithLockedStarter() {
         // 去掉锁定片段末尾的换行再拼：多留一个空行，学生数出来的行号就和提示里的对不上了。
         return [task.lockedStarterCode, textarea.value]
            .filter(function (part) { return part && part.trim(); })
            .map(function (part) { return part.replace(/\n+$/, ""); })
            .join("\n");
      }

      textarea.addEventListener("compositionstart", function () { composing = true; });
      textarea.addEventListener("compositionend", function () { composing = false; scheduleSave(); });
      textarea.addEventListener("input", function () {
         if (!composing) convertTrailingAsciiArrow(textarea);
         scheduleSave();
      });
      textarea.addEventListener("paste", function (event) {
         var clipboard = event.clipboardData || window.clipboardData;
         var text = clipboard && clipboard.getData("text");
         if (!text || text.indexOf("<-") < 0) return;
         var converted = convertAsciiArrowsInPastedCode(text.replace(/\r\n?/g, "\n"));
         if (converted === text) return;
         event.preventDefault();
         textarea.setRangeText(converted, textarea.selectionStart, textarea.selectionEnd, "end");
      });

      $("[data-act='reset']", root).addEventListener("click", function () {
         textarea.value = task.starterCode || "";
         textarea.dispatchEvent(new Event("input", { bubbles: true }));
         verdict.hidden = true;
         var slot = root.querySelector(".next-step");
         if (slot) slot.hidden = true;
      });

      $("[data-act='submit']", root).addEventListener("click", async function () {
         var source = sourceWithLockedStarter();
         $(".attempt-slot", root).textContent = "";
         verdict.hidden = false;
         setVerdict(verdict, "l2", "正在评测…", "运行结果", "<p class=\"muted small\">跑用例中…</p>", [0, 0, 0, 0]);

         var result = await window.CAIEExercise.grade({
            source: source,
            constraints: task.constraints,
            tests: task.tests,
            taughtFeatures: opts.taughtFeatures || []
         });
         if (result.failedLayer === "L2") failedRuns += 1;
         renderVerdict(verdict, result, failedRuns, task, function (passResult) {
            if (opts.onPass) opts.onPass(passResult);
         });
         // 语法错误、诊断列表这些反馈都长在作答区底部，提交按钮又在滚动区顶部附近——
         // 不主动滚下去的话，很多学生根本看不到判题结果已经出来了。
         verdict.scrollIntoView({ behavior: "smooth", block: "end" });
      });

      return { textarea: textarea, verdict: verdict };
   }

   function wireHints(root) {
      var openHint = function (row) {
         var btn = $("[data-act='open-hint']", row);
         row.dataset.open = "true";
         if (btn) { btn.disabled = true; btn.textContent = "已开"; }
      };
      $$(".hint-row[data-open='false']", root).forEach(function (row) {
         $(".hint-text", row).addEventListener("click", function () { openHint(row); });
         var btn = $("[data-act='open-hint']", row);
         if (btn) btn.addEventListener("click", function () { openHint(row); });
      });
   }

   window.TEACHING_TASK = {
      esc: esc,
      inline: inline,
      plainText: plainText,
      featureLabel: featureLabel,
      progress: Progress,
      answers: Answers,
      locate: locate,
      taughtFeaturesFor: taughtFeaturesFor,
      stepIdFor: stepIdFor,
      renderStatement: renderStatement,
      renderWorkspace: renderWorkspace,
      wire: wire
   };
})();
