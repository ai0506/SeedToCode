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
   /* 作答框的输入约定（三空格缩进、`<-` 转 `←`、行号、着色）在 js/code-input.js 里，
      课程题、作业题和老师批改页共用同一份实现。 */
   var CODE = window.CAIECodeInput;

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
      return window.CAIEStorage.get(key, {});
   }
   function writeStore(key, value) {
      window.CAIEStorage.set(key, value);
   }

   var progress = readStore(PROGRESS_KEY);

   /* 云端只在登录后才有；没有 SyncEngine、没登录、断网，下面这些调用都是空转，
      本地做题、存草稿、记进度一律照旧。 */
   function sync() { return window.SyncEngine || null; }

   /* 提交记录里附带的客户端版本，只用于排查「这份答案是哪一版页面交的」。 */
   var CLIENT_VERSION = "web-1";

   /** 这道题属于哪些还在进行中的作业。未登录、不是学生或云端不可用时为空。 */
   var assignmentsForTask = {};

   function noteAssignmentsFor(taskId, root) {
      var client = window.CloudClient;
      if (!client || !client.available()) return;
      void client.assignments().then(async function (list) {
         var mine = (list || []).filter(function (item) {
            return (item.items || []).some(function (entry) { return entry.kind === "task" && entry.id === taskId; });
         });
         assignmentsForTask[taskId] = mine;
         if (!mine.length) return;
         markAssignmentBadge(taskId);
         // 老师批过的话，把分数和评语直接摆到作答区顶上——
         // 学生本来要点开右上角浮层才看得到分，还看不到评语。
         await showTeacherFeedback(mine, taskId, root);
      });
   }

   async function showTeacherFeedback(list, taskId, root) {
      var client = window.CloudClient;
      var latest = null;
      for (var i = 0; i < list.length; i += 1) {
         try {
            var data = await client.request("/api/assignments/" + encodeURIComponent(list[i].id) + "/submissions");
            (data.submissions || []).forEach(function (row) {
               if (row.taskId !== taskId || !row.graded) return;
               if (!latest || row.submittedAt > latest.submittedAt) latest = row;
            });
         } catch (error) { /* 看不到批改不影响做题 */ }
      }
      if (!latest || !root) return;
      var slot = $(".task-feedback", root);
      if (!slot) {
         slot = document.createElement("div");
         slot.className = "task-feedback";
         var body = $(".mini-editor", root) || root.firstElementChild;
         if (body && body.parentNode) body.parentNode.insertBefore(slot, body);
         else root.insertBefore(slot, root.firstChild);
      }
      slot.innerHTML =
         '<div class="task-feedback-head">老师已批改' +
         (latest.teacherScore === null ? "" : '<span class="task-feedback-score">' + latest.teacherScore + " 分</span>") +
         "</div>" +
         (latest.teacherComment ? '<div class="task-feedback-body"></div>' : "");
      if (latest.teacherComment) $(".task-feedback-body", slot).textContent = latest.teacherComment;
   }

   function submitToAssignments(taskId, source) {
      var list = assignmentsForTask[taskId];
      if (!list || !list.length || !sync()) return;
      list.forEach(function (item) {
         sync().noteAssignmentSubmission(item.id, taskId, source, CLIENT_VERSION);
      });
   }

   /*
    * 做题页顶部那条「作业」标记：只在这道题确实是作业时出现。
    * 过了截止时间也照样能交——只是标成迟交，让学生自己心里有数。
    * 服务端不拦，这里也不拦；拦住只会让已经晚了的人干脆不交。
    */
   function markAssignmentBadge(taskId) {
      var slot = document.querySelector("[data-assignment-slot]");
      if (!slot) return;
      var list = assignmentsForTask[taskId] || [];
      if (!list.length) { slot.textContent = ""; slot.hidden = true; return; }
      var now = Date.now();
      var overdue = list.filter(function (item) { return item.dueAt && item.dueAt < now; });
      slot.hidden = false;
      slot.dataset.state = overdue.length === list.length ? "late" : "";
      if (list.length > 1) {
         slot.textContent = "作业 · " + list.length + " 份" + (overdue.length ? "（" + overdue.length + " 份已过截止）" : "");
         return;
      }
      slot.textContent = "作业 · " + list[0].title + (overdue.length ? " · 已过截止，现在提交算迟交" : "");
   }

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
         // 只往「已完成」这一个方向合并，永远不会上传「未完成」。
         if (sync()) sync().noteProgress(chapterId, sectionId);
      },
      /** 云端拿回来的完成状态：只加不减。 */
      mergeCompleted: function (items) {
         var changed = false;
         items.forEach(function (item) {
            var key = Progress.keyFor(item.chapterId, item.sectionId);
            if (progress[key] === true) return;
            progress[key] = true;
            changed = true;
         });
         if (changed) writeStore(PROGRESS_KEY, progress);
         return changed;
      },
      list: function () {
         return Object.keys(progress).filter(function (key) { return progress[key] === true; }).map(function (key) {
            var parts = key.split("/");
            return { chapterId: Number(parts[0]), sectionId: parts.slice(1).join("/") };
         });
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
         if (sync()) sync().noteDraft(chapterId, taskId);
      },
      clear: function (chapterId, taskId) {
         var all = readStore(ANSWER_KEY);
         delete all[Answers.keyFor(chapterId, taskId)];
         writeStore(ANSWER_KEY, all);
      },
      /** 本地这道题还没有草稿时，才采用云端那一份。 */
      adopt: function (chapterId, taskId, code) {
         var all = readStore(ANSWER_KEY);
         var key = Answers.keyFor(chapterId, taskId);
         if (typeof all[key] === "string") return false;
         all[key] = code;
         writeStore(ANSWER_KEY, all);
         return true;
      },
      list: function () {
         var all = readStore(ANSWER_KEY);
         return Object.keys(all).filter(function (key) { return typeof all[key] === "string"; }).map(function (key) {
            var parts = key.split("/");
            return { chapterId: Number(parts[0]), taskId: parts.slice(1).join("/"), source: all[key] };
         });
      }
   };

   /*
    * 草稿冲突：两台设备写了同一道题的同一版之后的不同内容。
    * 本地那一份原样留着，云端那一份单独存成可恢复草稿——
    * 作答区顶上会多一行提示，由学生自己决定要不要换过去。绝不自动覆盖。
    */
   var DraftConflicts = {
      all: function () {
         var value = window.CAIEStorage.get(window.CAIEStorage.key.draftConflicts, {});
         return value && typeof value === "object" ? value : {};
      },
      get: function (chapterId, taskId) {
         var item = DraftConflicts.all()[Answers.keyFor(chapterId, taskId)];
         return item && typeof item.source === "string" ? item : null;
      },
      record: function (chapterId, taskId, source, revision) {
         if (typeof source !== "string") return;
         var all = DraftConflicts.all();
         all[Answers.keyFor(chapterId, taskId)] = { source: source, revision: revision, at: Date.now() };
         window.CAIEStorage.set(window.CAIEStorage.key.draftConflicts, all);
      },
      clear: function (chapterId, taskId) {
         var all = DraftConflicts.all();
         delete all[Answers.keyFor(chapterId, taskId)];
         window.CAIEStorage.set(window.CAIEStorage.key.draftConflicts, all);
      }
   };

   if (window.SyncEngine) {
      window.SyncEngine.useTeaching({
         listCompleted: Progress.list,
         applyCompleted: function (items) {
            if (Progress.mergeCompleted(items)) document.dispatchEvent(new CustomEvent("teaching-progress-merged"));
         },
         listDrafts: Answers.list,
         readDraft: Answers.get,
         applyDraft: function (chapterId, taskId, source) {
            if (Answers.adopt(chapterId, taskId, source)) {
               document.dispatchEvent(new CustomEvent("teaching-draft-adopted", { detail: { chapterId: chapterId, taskId: taskId } }));
            }
         },
         replaceDraft: function (chapterId, taskId, source) {
            var all = readStore(ANSWER_KEY);
            all[Answers.keyFor(chapterId, taskId)] = source;
            writeStore(ANSWER_KEY, all);
            document.dispatchEvent(new CustomEvent("teaching-draft-adopted", { detail: { chapterId: chapterId, taskId: taskId } }));
         },
         addDraftConflict: function (chapterId, taskId, source, revision) {
            DraftConflicts.record(chapterId, taskId, source, revision);
            document.dispatchEvent(new CustomEvent("teaching-draft-conflict", { detail: { chapterId: chapterId, taskId: taskId } }));
         }
      });
   }

   /* ---------------- 特征名 ---------------- */

   // 学生看到的是这里的名字，不是特征 ID。FEATURE_IDS 里的每一项都要有一条——
   // 漏一条，界面上就会冒出 `select.case-otherwise` 这样的内部标识。
   var FEATURE_LABELS = {
      "io.input": "INPUT",
      "io.output": "OUTPUT",
      "io.output-variable": "OUTPUT 变量",
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
   /* 与 packages/teaching-content/src/types.ts 的 executionProfileOf 保持一致：省略即 core-2027。 */
   function executionProfileOf(chapter) {
      return (chapter && chapter.executionProfile) || "core-2027";
   }

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
         // 题面、输入、输出三处都会写成多行（题目里给一段结构化英语、给一份输出格式），
         // 换行要照留。原来只有「输出」那一处做了替换，另外两处的换行被 HTML 折成了空格。
         '<p class="task-statement">' + inline(task.statement).replace(/\n/g, "<br>") + "</p>" +
         '<dl class="spec-grid"><dt>输入</dt><dd>' + inline(task.ioSpec.input).replace(/\n/g, "<br>") + "</dd>" +
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

   /* 行号、着色和输入约定都在 js/code-input.js（全局 CAIECodeInput）里，
      作业题页和老师批改页用的是同一份——这里不留副本。 */
   var gutterHtml = CODE.gutterHtml;
   var hl = CODE.highlight;

   function renderWorkspace(task) {
      var lockedLines = lockedLineCount(task);
      // 锁定片段也带行号：不然学生看到作答区从第 3 行开始会以为出了错，
      // 而诊断报的正是把锁定行算进去之后的行号。
      var locked = lockedLines
         ? '<div class="mini-editor-locked"><span class="locked-note">已准备好，不需要改</span>' +
           '<div class="mini-editor-body locked-body"><div class="mini-gutter" aria-hidden="true">' +
           gutterHtml(1, lockedLines) + '</div><pre class="mini-highlight"><code>' +
           hl(task.lockedStarterCode.replace(/\n+$/, "")) + "</code></pre></div></div>"
         : "";
      return (
         // 云端草稿与本地不一致时才会有内容；平时是一个空的、不占位的槽。
         '<div class="draft-conflict" data-draft-conflict hidden></div>' +
         '<div class="mini-editor">' +
         '<div class="mini-editor-head"><span>你的作答</span><span class="spacer"></span>' +
         '<span class="save-slot" data-state="idle"></span>' +
         '<span class="small muted">三空格缩进 · <code class="mono">&lt;-</code> 自动转 <code class="mono">←</code></span></div>' +
         locked +
         '<div class="mini-editor-body"><div class="mini-gutter" aria-hidden="true"></div>' +
         '<div class="mini-code"><pre class="mini-highlight" aria-hidden="true"><code></code></pre>' +
         '<textarea spellcheck="false" wrap="off" placeholder="从这里继续写…" data-line-offset="' +
         lockedLines + '"></textarea></div></div></div>' +
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
      // 通过≠没毛病：像 OUTPUT "Score: 64" 这种整句写死、刚好和这一次的期望输出撞上的写法，
      // 判题只看文字对不上，看不出「读的是引号还是变量」，所以这条提醒在通过时也要给，不能只在没通过时才说。
      var codeNote = codeNoteHtml(result.codeNotes);
      var coverage = "";
      if (task.suggestedFeatures) {
         coverage = '<div class="coverage">' + task.suggestedFeatures.map(function (f) {
            var used = result.usedFeatures && result.usedFeatures.indexOf(f) >= 0;
            return '<span class="cov ' + (used ? "used" : "missed") + '">' + (used ? "✓ " : "") +
               featureLabel(f) + "</span>";
         }).join("") + "</div>";
      }
      setVerdict(verdict, "pass", "通过", "全部通过", tally + coverage + style + codeNote + ahead, [1, 1, 1, 1]);
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
      var highlight = $(".mini-code .mini-highlight", root);
      var saveSlot = $(".save-slot", root);
      // 只统计「跑到用例这一层还没过」的次数：语法错误的提交不算，
      // 因为那时学生根本还没开始对付数据。
      var failedRuns = 0;
      var saveTimer = null;

      // 这道题是不是老师布置的作业：异步问一次，拿到了再标记，问不到就当不是。
      noteAssignmentsFor(task.id, root);

      wireHints(root);

      if (!textarea) return { textarea: null };

      var saved = opts.chapterId != null ? Answers.get(opts.chapterId, task.id) : null;
      textarea.value = saved != null ? saved : (task.starterCode || "");

      /*
       * 云端那一份和本地不一样时只多出一行提示，本地作答一个字都不动。
       * 要不要换成云端那一版，由学生自己按——没有自动合并，也没有弹窗。
       */
      /* 云端草稿是在这一页打开之后才到的。只有学生还一个字没写（作答区仍是起始代码）
         才把它填进来——已经动手写了就绝不替换。 */
      var pristine = saved == null;
      var suppressSave = false;
      document.addEventListener("teaching-draft-adopted", function (event) {
         var detail = event.detail || {};
         if (detail.chapterId !== opts.chapterId || detail.taskId !== task.id) return;
         if (!pristine || textarea.value !== (task.starterCode || "")) return;
         var adopted = Answers.get(opts.chapterId, task.id);
         if (adopted == null) return;
         textarea.value = adopted;
         // 内容就是刚从云端拿到的那一份，没有要写回去的东西，只是让行号和着色跟上。
         suppressSave = true;
         textarea.dispatchEvent(new Event("input", { bubbles: true }));
         suppressSave = false;
      });

      var conflictSlot = $("[data-draft-conflict]", root);
      function renderDraftConflict() {
         if (!conflictSlot || opts.chapterId == null) return;
         var conflict = DraftConflicts.get(opts.chapterId, task.id);
         if (!conflict) { conflictSlot.hidden = true; conflictSlot.innerHTML = ""; return; }
         conflictSlot.hidden = false;
         conflictSlot.innerHTML =
            '<span class="draft-conflict-text">这道题在另一台设备上也改过，云端那一份和这里不一样。本地这一份已经保留。</span>' +
            '<span class="spacer"></span>' +
            '<button class="btn btn-ghost small fixed-btn" data-draft-use>用云端那一份</button>' +
            '<button class="btn btn-ghost small fixed-btn" data-draft-dismiss>保留本地</button>';
      }
      if (conflictSlot) {
         conflictSlot.addEventListener("click", function (event) {
            if (opts.chapterId == null) return;
            if (event.target.closest("[data-draft-use]")) {
               var conflict = DraftConflicts.get(opts.chapterId, task.id);
               if (conflict) {
                  textarea.value = conflict.source;
                  textarea.dispatchEvent(new Event("input", { bubbles: true }));
                  Answers.set(opts.chapterId, task.id, conflict.source);
               }
            }
            DraftConflicts.clear(opts.chapterId, task.id);
            renderDraftConflict();
         });
         document.addEventListener("teaching-draft-conflict", function (event) {
            var detail = event.detail || {};
            if (detail.chapterId === opts.chapterId && detail.taskId === task.id) renderDraftConflict();
         });
         renderDraftConflict();
      }

      /* 行号、着色层、三空格缩进、`<-` 转 `←`（含粘贴）一次装好，
         实现在 js/code-input.js，和作业题页、老师批改页同一份。 */
      CODE.attach(textarea, { gutter: gutter, highlight: highlight, lineOffset: lockedLineCount(task) });

      function markSaved() {
         if (!saveSlot) return;
         saveSlot.dataset.state = "saved";
         saveSlot.textContent = "已保存";
      }

      function scheduleSave() {
         if (opts.chapterId == null || suppressSave) return;
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

      // 箭头转换和粘贴归一化由 CODE.attach 负责；这里只管草稿。
      textarea.addEventListener("compositionend", function () { scheduleSave(); });
      textarea.addEventListener("input", function () {
         if (!suppressSave) pristine = false;
         scheduleSave();
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
            taughtFeatures: opts.taughtFeatures || [],
            /*
             * 执行档按章定。省掉它就退回 core-2027，A Level 的枚举、集合、指针和类
             * 会在预检就被拒（RT1106），学生看到的是「跑不起来」而不是「答错了」。
             */
            execute: { profile: opts.executionProfile || "core-2027" }
         });
         if (result.failedLayer === "L2") failedRuns += 1;
         /*
          * 章末大题的每一次提交都留一条记录，老师看得到。
          * 只送答案内容，不送这里算出来的 passed —— 服务端会重新判一遍，
          * 客户端的结果只用于眼前这一屏。入队即走，判题结果照常立刻显示；
          * 未登录、断网或云端未配置时这一步是空转，做题完全不受影响。
          */
         if (task.kind === "chapterTask" && opts.chapterId != null && sync()) {
            sync().noteSubmission(opts.chapterId, task.id, source, CLIENT_VERSION);
         }
         /*
          * 这道题如果是老师布置的作业，同一次「提交」还要交一份作业提交。
          * 和上面那条一样只送答案内容：服务端会用已发布题目重新判分，
          * 这里算出来的 passed 只用于眼前这一屏，不作为老师看到的成绩。
          * 排进队列就返回，断网时也不会拦住判题。
          */
         submitToAssignments(task.id, source);
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
      draftConflicts: DraftConflicts,
      locate: locate,
      taughtFeaturesFor: taughtFeaturesFor,
      executionProfileOf: executionProfileOf,
      stepIdFor: stepIdFor,
      renderStatement: renderStatement,
      renderWorkspace: renderWorkspace,
      wire: wire
   };
})();
