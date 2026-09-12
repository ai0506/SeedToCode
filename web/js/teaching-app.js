/* 教学页：把 packages/teaching-content 的内容数据渲染成小节页，并接上真实的语言与运行引擎。
 *
 * 依赖的全局：
 *   CAIETeaching      内容数据（已去掉参考解）
 *   CAIEExercise      判题（特征提取 / 输出比对 / 分层编排）
 *   LANGUAGE_ADAPTER  中文诊断
 *   LANG              语法着色
 *   window.runtimeMessage  运行时错误中文文案
 *
 * 布局稳定性契约与模板一致：反馈只用 background/color/box-shadow/opacity；
 * 会变的文字进常驻固定高度槽位；新内容只在已读内容之后出现。
 */
(function () {
   "use strict";

   var $ = function (s, r) { return (r || document).querySelector(s); };
   var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

   var T = window.TEACHING_TASK;
   var course = window.CAIETeaching.course;
   var chapter = course.chapters[0];
   var homeExpanded = {};
   var tocExpanded = {};

   /* ---------------- 进度：存在本地，刷新不丢 ---------------- */

   /* 进度这一份由 teaching-task.js 持有：独立做题页 task.html 写的是同一份，
      学生在那边做完题回到这里，目录进度点和完成度必须已经对上。 */
   var POSITION_KEY = "caie.teaching.position.v1";
   /* 关卡答过没有，也要记下来。只记进度点是不够的：学生答完选择题去做题，
      回来时这一节又缩回了关卡之前的样子，得再答一遍才能看到后面的内容。 */
   var GATES_KEY = "caie.teaching.gates.v1";
   var passedGates = (function () {
      try {
         var value = window.CAIEStorage.get(GATES_KEY, {});
         return value && typeof value === "object" ? value : {};
      } catch (e) { return {}; }
   })();
   /* 正在照着记录把关卡重放一遍。重放期间不滚动、不跳转——那是学生自己点的时候才该做的事。 */
   var restoring = false;

   function gateKey(gateId) { return chapter.id + "/" + gateId; }

   function rememberGate(gateId) {
      if (!gateId || passedGates[gateKey(gateId)]) return;
      passedGates[gateKey(gateId)] = true;
      window.CAIEStorage.set(GATES_KEY, passedGates);
   }

   function gateWasPassed(gateId) { return Boolean(gateId && passedGates[gateKey(gateId)]); }
   var savedPosition = (function () {
      try {
         var value = window.CAIEStorage.get(POSITION_KEY, null);
         return value && Number.isInteger(Number(value.chapterId)) && typeof value.sectionId === "string" &&
            Number.isFinite(Number(value.scrollTop)) && Number(value.scrollTop) >= 0 ? value : null;
      } catch (e) { return null; }
   })();

   function isDoneFor(targetChapter, sectionId) { return T.progress.isDone(targetChapter.id, sectionId); }
   function isDone(sectionId) { return isDoneFor(chapter, sectionId); }
   function setDone(sectionId) { T.progress.setDone(chapter.id, sectionId); }

   function savePosition(sectionId, scrollTop) {
      if (!sectionId) return;
      var moved = !savedPosition || savedPosition.chapterId !== chapter.id || savedPosition.sectionId !== sectionId;
      var value = {
         chapterId: chapter.id,
         sectionId: sectionId,
         scrollTop: Math.max(0, Math.round(Number(scrollTop) || 0)),
         updatedAt: Date.now()
      };
      savedPosition = value;
      window.CAIEStorage.set(POSITION_KEY, value);
      /* 上传的只有章号和小节号。scrollTop 留在这台设备：
         两块屏幕宽窄不同，同一个像素位置本来就不是同一段内容。
         滚动会不停触发这个函数，所以只有换了小节才值得往上传。 */
      if (moved && window.SyncEngine) window.SyncEngine.notePosition(chapter.id, sectionId);
   }

   function saveCurrentPosition() {
      var current = $(".section-doc:not([hidden])");
      var scroll = $("#readerScroll");
      if (current && scroll) savePosition(current.dataset.section, scroll.scrollTop);
   }

   function chapterSteps(targetChapter) {
      return targetChapter.sections.map(function (section) { return section.id; }).concat(targetChapter.chapterTasks.length ? ["chapterTask"] : []);
   }

   function completedSteps(targetChapter) {
      return chapterSteps(targetChapter).filter(function (id) { return isDoneFor(targetChapter, id); }).length;
   }

   /** 全课程 23 章；已写好的只有 course.chapters 里的这些。 */
   var CHAPTER_PLAN = [
      { id: 1, title: "算法、伪代码与书写规范", level: "AS" },
      { id: 2, title: "变量与数据类型", level: "AS" },
      { id: 3, title: "表达式与运算符", level: "AS" },
      { id: 4, title: "选择", level: "AS" },
      { id: 5, title: "三种循环", level: "AS" },
      { id: 6, title: "循环的选择与嵌套", level: "AS" },
      { id: 7, title: "字符串与内置函数", level: "AS" },
      { id: 8, title: "一维数组", level: "AS" },
      { id: 9, title: "二维数组", level: "AS" },
      { id: 10, title: "线性查找与冒泡排序", level: "AS" },
      { id: 11, title: "记录", level: "AS" },
      { id: 12, title: "过程", level: "AS" },
      { id: 13, title: "函数", level: "AS" },
      { id: 14, title: "文本文件", level: "AS" },
      { id: 15, title: "抽象数据类型入门", level: "AS" },
      { id: 16, title: "综合：从问题到完整程序", level: "AS" },
      { id: 17, title: "自定义数据类型", level: "A" },
      { id: 18, title: "进阶搜索排序与算法比较", level: "A" },
      { id: 19, title: "递归", level: "A" },
      { id: 20, title: "进阶抽象数据类型", level: "A" },
      { id: 21, title: "进阶文件处理", level: "A" },
      { id: 22, title: "面向对象伪代码", level: "A" },
      { id: 23, title: "异常处理与范式概览", level: "A" }
    ];

   /* ---------------- 基础工具 ---------------- */

   // 转义与行内标记（`code` / **bold**）与题目页共用一份，免得两边的正文渲染走样
   var esc = T.esc;
   var inline = T.inline;
   var plainText = T.plainText;

   function alertLike(text) {
      var box = $(".quiz-feedback");
      if (box) { box.dataset.state = "wrong"; box.textContent = text; }
   }

   function el(html) {
      var wrap = document.createElement("div");
      wrap.innerHTML = html.trim();
      return wrap.firstElementChild;
   }

   function codeCard(code, options) {
      var opts = options || {};
      var lines = code.split("\n");
      var gutter = lines.map(function (_, i) { return "<span>" + (i + 1) + "</span>"; }).join("");
      var body = lines
         .map(function (line, i) {
            var cls = "ln" + (opts.badLines && opts.badLines.indexOf(i + 1) >= 0 ? " bad" : "");
            var attrs = opts.lineAttrs ? opts.lineAttrs(i + 1) : "";
            return '<span class="' + cls + '" data-line="' + (i + 1) + '"' + attrs + ">" +
               (opts.plain ? esc(line) || "&#8203;" : highlightLine(line)) + "</span>";
         })
         .join("");
      return (
         '<div class="code-card">' +
         (opts.head ? '<div class="code-card-head">' + opts.head + "</div>" : "") +
         '<div class="code-body"><div class="code-gutter">' + gutter + "</div>" +
         '<pre class="code-lines' + (opts.codeClass ? " " + opts.codeClass : "") + '">' + body + "</pre></div></div>"
      );
   }

   function highlightLine(line) {
      // LANG.highlight 按整段返回带 .hl-line 包裹的结果，这里只取单行内容
      var html = window.LANG.highlight(line);
      return html.replace(/^<span class="hl-line">/, "").replace(/<\/span>$/, "") || "&#8203;";
   }

   /* ---------------- 目录 ---------------- */

   function renderToc() {
      $("#tocChapters").innerHTML = course.chapters.map(function (item) {
         var expanded = Object.prototype.hasOwnProperty.call(tocExpanded, item.id)
            ? tocExpanded[item.id]
            : item.id === chapter.id;
         var sections = item.sections.map(function (section) {
            return (
               '<li><button class="toc-link" data-open-chapter="' + item.id + '" data-open-section="' + section.id + '">' +
               '<span class="sn">' + section.id + "</span>" +
               '<span class="st">' + inline(section.title) + "</span>" +
               '<span class="dot-state" data-dot-chapter="' + item.id + '" data-dot="' + section.id + '"></span></button></li>'
            );
         }).join("") +
            (item.chapterTasks.length ? '<li><button class="toc-link kind-task" data-open-chapter="' + item.id + '" data-open-section="chapterTask">' +
            '<span class="sn">★</span><span class="st">章末大题</span>' +
            '<span class="dot-state" data-dot-chapter="' + item.id + '" data-dot="chapterTask"></span></button></li>' : '');
         return (
            '<div class="toc-chapter' + (expanded ? " open" : "") + '" data-toc-chapter="' + item.id + '">' +
            '<button class="toc-ch-head" data-toggle-toc-chapter="' + item.id + '" aria-expanded="' + expanded + '">' +
            '<span class="caret">›</span><span class="toc-num">' + item.id + "</span>" +
            '<span class="toc-ch-name">' + inline(item.title) + '</span><span class="dot-state" data-chapter-status="' + item.id + '"></span></button>' +
            '<ul class="toc-sections">' + sections + "</ul></div>"
         );
      }).join("");
   }

   /* ---------------- 各类内容块 ---------------- */

   function renderExplanation(block) {
      var paragraphs = block.paragraphs.map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("");
      var callouts = (block.callouts || [])
         .map(function (callout) {
            var label = callout.source === "CAIE"
               ? '<span class="origin-tag caie">CAIE 规定</span>'
               : callout.source === "convention"
                  ? '<span class="origin-tag conv">通行写法</span>'
                  : '<span class="origin-tag rt">编辑器约定</span>';
            var title = callout.source === "convention" ? "写法" : "规则";
            return (
               '<div class="callout callout-rule' + (callout.source === "convention" ? " callout-convention" : "") + '">' +
               '<div class="callout-head"><strong>' + title + "</strong>" + label + "</div>" +
               inline(callout.text).replace(/\n/g, "<br>") + "</div>"
            );
         })
         .join("");
      return '<section class="block" data-el="explanation">' + paragraphs + callouts + "</section>";
   }

   function renderExample(block) {
      var head =
         '<span class="mono">' + esc(block.fileName) + "</span><span class=\"spacer\"></span>" +
         '<button class="btn small" data-open-editor="' + esc(block.code) +
         '" data-open-name="' + esc(block.fileName.replace(/\.pseudocode$/i, "")) +
         '" data-open-label="' + esc("来自 " + plainText(block.title)) + '">在编辑器中打开</button>';
      var annots = block.annotations
         .map(function (a) {
            var label = a.fromLine === a.toLine ? "第 " + a.fromLine + " 行" : a.fromLine + "–" + a.toLine + " 行";
            return (
               '<li data-range="' + a.fromLine + "-" + a.toLine + '">' +
               '<span class="annot-range">' + label + "</span><span>" + inline(a.text) + "</span></li>"
            );
         })
         .join("");
      var run = "";
      if (block.transcript && block.transcript.length) {
         // 按真实发生顺序显示：先出现的提问在上，输入穿插在中间。
         // 不能简单地「先列输入再列输出」——那正好和程序的执行顺序相反。
         run =
            '<div class="samplerun"><div class="samplerun-head">示例运行</div><pre>' +
            block.transcript.map(function (entry) {
               return entry.kind === "input"
                  ? '<span class="in-line">&gt; ' + esc(entry.text) + "</span>"
                  : esc(entry.text);
            }).join("\n") +
            "</pre>" +
            (block.transcript.some(function (e) { return e.kind === "input"; })
               ? '<div class="samplerun-note">带 <span class="in-line">&gt;</span> 的那行是你输入的，其余是程序显示的。</div>'
               : "") +
            "</div>";
      } else if (block.sampleRun) {
         run =
            '<div class="samplerun"><div class="samplerun-head">示例运行</div><pre>' +
            esc(block.sampleRun.outputs.join("\n")) + "</pre></div>";
      }
      return (
         '<section class="block" data-el="example"><h3>' + inline(block.title) + "</h3>" +
         codeCard(block.code, { head: head }) +
         '<ul class="annots">' + annots + "</ul>" + run + "</section>"
      );
   }

   function renderComparison(block) {
      var panes = block.panes
         .map(function (pane) {
            var isPseudo = pane.language === "pseudocode";
            var codeClass = isPseudo ? ""
               : pane.language === "natural" ? " is-natural"
               : pane.language === "diagram" ? " is-diagram"
               : " is-other";
            var code = isPseudo
               ? pane.code.split("\n").map(highlightLine).join("\n")
               : esc(pane.code);
            return (
               '<div class="compare-pane' + (isPseudo ? " is-pseudocode" : "") +
               (pane.language === "diagram" ? " is-diagram" : "") + '">' +
               '<div class="compare-head">' + inline(pane.label) + "</div>" +
               '<pre class="compare-code' + codeClass + '">' + code + "</pre>" +
               '<div class="compare-note">' + inline(pane.note) + "</div></div>"
            );
         })
         .join("");
      return (
         '<section class="block" data-el="comparison"><h3>' + inline(block.title) + "</h3>" +
         (block.intro ? "<p>" + inline(block.intro) + "</p>" : "") +
         // 四栏及以上时改成两栏排：760px 的正文宽度切成四份只剩 247px，
         // 一行 48 个字符的伪代码在里面横向滚动，读起来比换行还难。
         '<div class="compare' + (block.panes.length >= 4 ? " cols-2" : "") + '">' + panes + "</div></section>"
      );
   }

   function renderCounterExample(block) {
      var label = { error: "阻断错误", caie: "CAIE 规范", hint: "建议" };
      var cases = block.cases.map(function (item) {
         var expected = item.expectDiagnostics || [];
         var bad = expected.map(function (d) { return d.line; });
         if (item.expectRuntimeError) bad.push(item.expectRuntimeError.line);
         var diags = expected.map(function (d) {
            var origin = d.severity === "hint"
               ? '<span class="origin-tag rt">编辑器约定</span>'
               : '<span class="origin-tag caie">CAIE 规定</span>';
            return (
               '<li class="sev-' + d.severity + '">' +
               '<div class="problem-msg"><span class="sev-chip">' + label[d.severity] + "</span>" +
               inline(d.text) + "</div>" +
               '<div class="problem-meta"><span>第 ' + d.line + " 行</span>" + origin + "</div></li>"
            );
         });
         if (item.expectRuntimeError) {
            diags.push('<li class="sev-error"><div class="problem-msg"><span class="sev-chip">运行时错误</span>' + inline(item.expectRuntimeError.text) + '</div><div class="problem-meta"><span>第 ' + item.expectRuntimeError.line + ' 行</span><span class="origin-tag rt">编辑器约定</span></div></li>');
         }
         return (
            (item.title ? "<h4>" + inline(item.title) + "</h4>" : "") +
            codeCard(item.code, {
               head: '<span class="spacer"></span><span class="chip" style="height:16px;font-size:10px;background:var(--danger-soft);color:var(--danger);border-color:transparent">故意写错</span>',
               badLines: bad
            }) +
            "<p>" + inline(item.note) + "</p>" +
            '<ul class="expect-diags">' + diags.join("") + "</ul>"
         );
      }).join("");
      return (
         '<section class="block" data-el="counterExample"><h3>' + inline(block.title) + "</h3>" +
         cases + "</section>"
      );
   }

   /* ---------------- 关卡 ---------------- */

   var GATE_FOOT =
      '<div class="gate-foot">' +
      '<span class="gate-note" data-gate-note>答对后继续下面的内容。</span>' +
      '<span class="gate-slot"><button class="btn btn-primary" data-gate-next disabled>继续 ↓</button></span></div>';

   function renderQuiz(block, gateId) {
      var head =
         '<div class="quiz-head"><span class="chip">理解检查</span>' +
         '<span class="quiz-kind">' + block.type + "</span></div>";
      var prompt = '<p class="quiz-prompt">' + inline(block.prompt) + "</p>";
      var body = "";
      var idle = "";

      if (block.type === "single-choice" || block.type === "true-false") {
         body =
            (block.code ? codeCard(block.code) : "") +
            '<ul class="options">' +
            block.options
               .map(function (option, index) {
                  return (
                     "<li><button class=\"opt\" data-key=\"" + esc(option.key) + '" data-correct="' +
                     (option.correct ? "true" : "false") + '" data-why="' + esc(option.explanation) + '">' +
                     '<span class="opt-key">' + esc(option.key) + "</span>" +
                     '<span class="opt-body"><span class="opt-label">' + inline(option.label) + "</span></span>" +
                     "</button></li>"
                  );
               })
               .join("") +
            "</ul>";
         idle = "选一个答案。选错不要紧——会告诉你错在哪，然后你可以再选。";
      } else if (block.type === "click-line") {
         var code = block.lines.map(function (line) { return line.code; }).join("\n");
         body = codeCard(code, {
            codeClass: "clickable-code",
            lineAttrs: function (n) {
               var line = block.lines[n - 1];
               return (line.answer ? ' data-answer="true"' : "") + ' data-why="' + esc(line.explanation) + '"';
            }
         });
         idle = "点一行代码。点错了会说明那一行为什么没问题，然后你可以再点。";
      } else {
         var template = block.template;
         var rendered = template
            .split("\n")
            .map(function (line) {
               return line.replace(/__(\d+)__/g, function (_, index) {
                  var blank = block.blanks.filter(function (b) { return String(b.index) === index; })[0];
                  return '<span class="blank" data-blank="' + index + '" data-answer="' +
                     esc(blank ? blank.answer : "") + '">　</span>';
               });
            })
            .map(function (line) {
               return '<span class="ln">' + line.replace(/(^|>)([^<]+)/g, function (m, lead, text) {
                  return lead + highlightLine(text);
               }) + "</span>";
            })
            .join("");
         body =
            '<div class="code-card"><div class="code-body">' +
            '<div class="code-gutter">' + template.split("\n").map(function (_, i) {
               return "<span>" + (i + 1) + "</span>";
            }).join("") + "</div>" +
            '<pre class="code-lines">' + rendered + "</pre></div></div>" +
            '<div class="bank">' +
            block.bank
               .map(function (item) {
                  return '<button class="bank-item" data-why="' + esc(item.explanation) + '">' +
                     esc(item.word) + "</button>";
               })
               .join("") +
            "</div>";
         idle = "点一个空，再点下面的候选词。填错会说明为什么，然后那个空会清空让你重填。";
      }

      return (
         '<section class="block" data-el="quiz · ' + block.type + '">' +
         '<div class="quiz" data-quiz="' + block.type + '" data-gate="' + gateId + '">' +
         head + prompt + body +
         '<div class="quiz-feedback" data-state="idle">' + idle + "</div>" +
         GATE_FOOT +
         "</div></section>"
      );
   }

   function feedback(quiz, state, html) {
      var box = $(".quiz-feedback", quiz);
      box.dataset.state = state;
      box.innerHTML = html;
      box.scrollTop = 0;
   }

   function solve(quiz, analysisHTML) {
      quiz.classList.add("solved");
      rememberGate(quiz.dataset.gate);
      quiz.dataset.analysis = analysisHTML || "";
      $("[data-gate-next]", quiz).disabled = false;
      $("[data-gate-note]", quiz).textContent = "答对了。点「继续」看完整解析和后面的内容。";
   }

   function wireQuiz(quiz) {
      var type = quiz.dataset.quiz;

      if (type === "single-choice" || type === "true-false") {
         var opts = $$(".opt", quiz);
         opts.forEach(function (opt) {
            opt.addEventListener("click", function () {
               if (quiz.classList.contains("solved") || opt.classList.contains("tried")) return;
               if (opt.dataset.correct !== "true") {
                  opt.classList.add("tried");
                  feedback(quiz, "wrong",
                     '<span class="why-tag no">' + esc(opt.dataset.key) + " 不对</span>" +
                     inline(opt.dataset.why) + "<br>再选一个。");
                  return;
               }
               opt.classList.add("is-correct");
               feedback(quiz, "right",
                  '<span class="why-tag ok">' + esc(opt.dataset.key) + " 正确</span>" + inline(opt.dataset.why));
               solve(quiz,
                  '<div class="quiz-analysis-head">全部选项解析</div><ul class="analysis-list">' +
                  opts.map(function (o) {
                     return '<li class="' + (o.dataset.correct === "true" ? "is-correct" : "") + '">' +
                        '<span class="analysis-key">' + esc(o.dataset.key) + "</span><span>" +
                        inline(o.dataset.why) + "</span></li>";
                  }).join("") + "</ul>");
            });
         });
         return;
      }

      if (type === "click-line") {
         var lines = $$(".clickable-code .ln", quiz);
         lines.forEach(function (ln) {
            ln.addEventListener("click", function () {
               if (quiz.classList.contains("solved") || ln.classList.contains("tried")) return;
               if (ln.dataset.answer !== "true") {
                  ln.classList.add("tried");
                  feedback(quiz, "wrong",
                     '<span class="why-tag no">第 ' + esc(ln.dataset.line) + " 行没问题</span>" +
                     inline(ln.dataset.why) + "<br>再点一行。");
                  return;
               }
               ln.classList.add("is-answer");
               feedback(quiz, "right",
                  '<span class="why-tag ok">第 ' + esc(ln.dataset.line) + " 行</span>" + inline(ln.dataset.why));
               solve(quiz,
                  '<div class="quiz-analysis-head">逐行解析</div><ul class="analysis-list">' +
                  lines.map(function (l) {
                     return '<li class="' + (l.dataset.answer === "true" ? "is-correct" : "") + '">' +
                        '<span class="analysis-key">' + esc(l.dataset.line) + "</span><span>" +
                        inline(l.dataset.why) + "</span></li>";
                  }).join("") + "</ul>");
            });
         });
         return;
      }

      // fill-blank
      var blanks = $$(".blank", quiz);
      var bank = $$(".bank-item", quiz);
      var active = null;
      function setActive(b) {
         blanks.forEach(function (o) { o.classList.remove("active"); });
         active = b || null;
         if (b) b.classList.add("active");
      }
      blanks.forEach(function (b) {
         b.addEventListener("click", function () {
            if (quiz.classList.contains("solved") || b.classList.contains("right")) return;
            setActive(b);
         });
      });
      bank.forEach(function (item) {
         item.addEventListener("click", function () {
            if (quiz.classList.contains("solved")) return;
            if (!active) { feedback(quiz, "idle", "先点一个空，再点候选词。"); return; }
            var target = active;
            var word = item.textContent.trim();
            if (word !== target.dataset.answer) {
               target.textContent = word;
               target.classList.add("wrong");
               feedback(quiz, "wrong",
                  '<span class="why-tag no">' + esc(word) + " 不对</span>" + inline(item.dataset.why) +
                  "<br>这个空清空了，再选一个。");
               setActive(null);
               setTimeout(function () {
                  target.textContent = "　";
                  target.classList.remove("wrong", "filled");
               }, 900);
               return;
            }
            target.textContent = word;
            target.classList.add("filled", "right");
            item.classList.add("used");
            setActive(null);
            var done = blanks.every(function (x) { return x.classList.contains("right"); });
            if (!done) {
               feedback(quiz, "right",
                  '<span class="why-tag ok">' + esc(word) + " 正确</span>" + inline(item.dataset.why) +
                  "<br>还有空没填。");
               return;
            }
            feedback(quiz, "right", '<span class="why-tag ok">都填对了</span>' + inline(item.dataset.why));
            solve(quiz,
               '<div class="quiz-analysis-head">全部候选解析</div><ul class="analysis-list">' +
               bank.map(function (o) {
                  var word = o.textContent.trim();
                  var right = blanks.some(function (x) { return x.dataset.answer === word; });
                  return '<li class="' + (right ? "is-correct" : "") + '">' +
                     '<span class="analysis-key">' + (right ? "✓" : "×") + "</span><span><b class=\"mono\">" +
                     esc(word) + "</b>　" + inline(o.dataset.why) + "</span></li>";
               }).join("") + "</ul>");
         });
      });
   }

   /* ---------------- 伪代码题：课文里只放入口 ---------------- */

   /*
    * 题目本身搬去了独立的做题页 task.html：那里题面和作答区左右并排，
    * 写代码时不用再为了看一眼输入输出往上翻。
    * 课文里留下的是这张入口卡——它要足够大、足够明确，
    * 让学生知道「题在另一页，点这里过去」，而不是以为这一节没有题。
    */
   function renderTaskEntry(task, isChapterTask, targetChapter, stepId) {
      var done = isDoneFor(targetChapter, stepId);
      var href = "task.html?c=" + targetChapter.id +
         "&s=" + encodeURIComponent(stepId) + "&t=" + encodeURIComponent(task.id);
      var counts = task.tests.length + " 组用例";
      var meta = [counts, task.hints.length + " 条提示"]
         .concat(isChapterTask ? ["用得上第 1–" + targetChapter.id + " 章的全部内容"] : [])
         .map(function (text) { return '<span class="chip">' + esc(text) + "</span>"; })
         .join("");

      return (
         '<section class="block" data-el="' + (isChapterTask ? "chapterTask" : "task") + '">' +
         '<div class="task-entry" data-task-entry="' + esc(task.id) +
         '" data-entry-chapter="' + targetChapter.id + '" data-entry-step="' + esc(stepId) + '">' +
         '<div class="te-head">' +
         '<span class="chip" style="background:var(--accent-soft);color:var(--accent);border-color:transparent">' +
         (isChapterTask ? "章末大题" : "伪代码题") + "</span>" +
         '<span class="te-title">' + inline(task.title) + "</span>" +
         '<span class="spacer"></span>' +
         '<span class="te-state" data-state="' + (done ? "done" : "todo") + '">' +
         (done ? "✓ 已通过" : "未通过") + "</span></div>" +
         '<div class="te-body">' +
         '<p class="te-statement">' + inline(task.statement).replace(/\n/g, "<br>") + "</p>" +
         '<div class="te-meta">' + meta + "</div>" +
         '<div class="te-go">' +
         '<a class="btn btn-primary te-btn" href="' + href + '">打开做题页 ›</a>' +
         '<span class="te-note">先读清题目要求，再开始作答；完成后可以回到这一节继续复习。</span></div></div></div></section>'
      );
   }

   /** 从做题页回来时重画入口卡的状态——localStorage 已经变了，页面还停在旧样子。 */
   function refreshTaskEntries() {
      $$("[data-task-entry]").forEach(function (card) {
         var entryChapter = course.chapters.filter(function (item) {
            return item.id === Number(card.dataset.entryChapter);
         })[0];
         if (!entryChapter) return;
         var done = isDoneFor(entryChapter, card.dataset.entryStep);
         var state = $(".te-state", card);
         state.dataset.state = done ? "done" : "todo";
         state.textContent = done ? "✓ 已通过" : "未通过";
      });
   }

   function markSectionDone(id) {
      setDone(id);
      refreshProgressUI();
   }

   /** 目录进度点、顶栏完成度、主页卡片，都从同一份 progress 重画。 */
   function refreshProgressUI() {
      var current = ($(".section-doc:not([hidden])") || {}).dataset;
      var currentId = current ? current.section : null;
      var steps = chapterSteps(chapter);

      $$(".dot-state[data-dot-chapter]").forEach(function (dot) {
         var dotChapter = course.chapters.filter(function (item) {
            return item.id === Number(dot.dataset.dotChapter);
         })[0];
         if (!dotChapter) return;
         var isCurrentStep = dotChapter.id === chapter.id && dot.dataset.dot === currentId;
         var finished = isDoneFor(dotChapter, dot.dataset.dot);
         dot.classList.toggle("done", finished);
         dot.classList.toggle("doing", !finished && isCurrentStep);
      });
      $$(".dot-state[data-chapter-status]").forEach(function (dot) {
         var statusChapter = course.chapters.filter(function (item) {
            return item.id === Number(dot.dataset.chapterStatus);
         })[0];
         if (!statusChapter) return;
         var statusDone = completedSteps(statusChapter);
         var statusTotal = chapterSteps(statusChapter).length;
         dot.classList.toggle("done", statusDone === statusTotal);
         dot.classList.toggle("doing", statusDone > 0 && statusDone < statusTotal);
      });

      var done = steps.filter(isDone).length;
      $("#progressFill").style.width = Math.round((done / steps.length) * 100) + "%";
      $("#progressNum").textContent = done + "/" + steps.length;

      $$(".ch-card.live").forEach(function (card) {
         var cardChapter = course.chapters.filter(function (item) {
            return item.id === Number(card.dataset.chapter);
         })[0];
         if (!cardChapter) return;
         var cardSteps = chapterSteps(cardChapter);
         var cardDone = completedSteps(cardChapter);
         $$(".ch-dot", card).forEach(function (dot) {
            dot.classList.toggle("done", isDoneFor(cardChapter, dot.dataset.step));
         });
         var cardStatus = $(".ch-status", card);
         if (cardStatus) {
            // 主页只在启动时渲染一次，做完章末大题回到主页时这一行不重画就还停在旧数字上。
            cardStatus.textContent =
               (cardDone === 0 ? "未开始" : cardDone >= cardSteps.length ? "已完成" : "进行中") +
               "　" + cardDone + " / " + cardSteps.length;
         }
         var resume = $("[data-resume]", card);
         if (resume) {
            resume.dataset.openSection = firstUnfinishedFor(cardChapter);
            resume.textContent = cardDone === 0 ? "开始学习" : cardDone >= cardSteps.length ? "重看一遍" : "继续";
         }
      });
      var homeBar = $(".home-progress-bar span");
      if (homeBar) {
         homeBar.style.width = Math.round((done / steps.length) * 100) + "%";
         $(".home-progress-num").textContent = "Chapter " + chapter.id + "：" + done + " / " + steps.length;
      }
      refreshTaskEntries();
   }

   /* ---------------- 组装小节 ---------------- */

   function renderBlock(block, sectionId) {
      switch (block.kind) {
         case "explanation": return renderExplanation(block);
         case "example": return renderExample(block);
         case "comparison": return renderComparison(block);
         case "counterExample": return renderCounterExample(block);
         case "task": return renderTaskEntry(block, false, chapter, sectionId);
         case "draft": return renderDraft(block);
         default: return "";
      }
   }

   function renderDraft(block) {
      var lines = block.markdown.split("\n");
      var html = [];
      var inCode = false;
      var codeLines = [];
      var codeLang = "";
      function flushCode() {
         if (!inCode) return;
         html.push('<pre class="draft-code' + (codeLang ? ' lang-' + esc(codeLang) : '') + '">' + esc(codeLines.join("\n")) + '</pre>');
         inCode = false; codeLines = []; codeLang = "";
      }
      var paragraph = [];
      function flushParagraph() {
         if (paragraph.length) { html.push('<p>' + inline(paragraph.join(" ")) + '</p>'); paragraph = []; }
      }
      for (var i = 0; i < lines.length; i += 1) {
         var line = lines[i];
         var fence = line.match(/^```(.*)$/);
         if (fence) { if (inCode) flushCode(); else { flushParagraph(); inCode = true; codeLang = fence[1].trim().toLowerCase(); } continue; }
         if (inCode) { codeLines.push(line); continue; }
         if (/^---+$/.test(line.trim())) { flushParagraph(); html.push('<hr>'); continue; }
         if (/^#{1,3} /.test(line)) { flushParagraph(); var level = line.match(/^(#+)/)[1].length; html.push('<h' + (level + 1) + '>' + inline(line.slice(level + 1)) + '</h' + (level + 1) + '>'); continue; }
         if (/^> /.test(line)) { flushParagraph(); html.push('<blockquote>' + inline(line.slice(2)) + '</blockquote>'); continue; }
         if (/^- /.test(line)) { flushParagraph(); html.push('<p class="draft-list-item">' + inline(line.slice(2)) + '</p>'); continue; }
         if (/^\|/.test(line)) { flushParagraph(); html.push('<pre class="draft-table">' + esc(line) + '</pre>'); continue; }
         if (!line.trim()) { flushParagraph(); continue; }
         paragraph.push(line.trim());
      }
      flushCode(); flushParagraph();
      return '<section class="block draft-block"><div class="draft-banner">草稿阅读版 · 保留原文 · 尚未接入判题</div><div class="draft-markdown">' + html.join("") + '</div></section>';
   }

   function renderSection(section, index) {
      var head =
         '<div class="crumb"><span>' + (chapter.level === "AS" ? "AS Level" : "A Level") + "</span>" +
         '<span class="dot">·</span><span>Chapter ' + chapter.id + "　" + inline(chapter.title) + "</span>" +
         '<span class="dot">·</span><span>第 ' + (index + 1) + " 节 / 共 " + chapter.sections.length + " 节</span></div>" +
         '<h1 class="sec-title">' + section.id + "　" + inline(section.title) + "</h1>" +
         '<div class="sec-meta"><span class="chip level-' + chapter.level.toLowerCase() + '">' + chapter.level + "</span>" +
         section.syllabus.map(function (s) { return '<span class="chip mono">' + esc(s) + "</span>"; }).join("") +
         '<span class="chip">约 ' + section.estimatedMinutes + " 分钟</span></div>";

      // 关卡把本节切成若干段：关卡之后的内容在答对并点「继续」之前不渲染
      var parts = [];
      var current = [];
      var gateIndex = 0;
      section.blocks.forEach(function (block) {
         if (block.kind === "quiz") {
            gateIndex += 1;
            current.push(renderQuiz(block, section.id + "-g" + gateIndex));
            parts.push({ gate: section.id + "-g" + gateIndex, html: current.join("") });
            current = [];
            return;
         }
         current.push(renderBlock(block, section.id));
      });
      if (current.length) parts.push({ gate: null, html: current.join("") });

      var html = head + (parts[0] ? parts[0].html : "");
      for (var i = 1; i < parts.length; i += 1) {
         html +=
            '<div class="gated" data-unlock="' + parts[i - 1].gate + '" hidden>' +
            '<div class="unlock-mark">继续</div>' + parts[i].html + "</div>";
      }
      return '<article class="section-doc" data-section="' + section.id + '" hidden>' + html + "</article>";
   }

   function renderHomePage() {
      var total = chapterSteps(chapter).length;
      var done = completedSteps(chapter);

      // 版式参照页加载的是占位章（不在正式大纲里），把它临时并进来，免得主页空着
      var plan0 = CHAPTER_PLAN.some(function (p) { return p.id === chapter.id; })
         ? CHAPTER_PLAN
         : [{ id: chapter.id, title: chapter.title, level: chapter.level }].concat(CHAPTER_PLAN);

      var asCards = [];
      var aCards = [];
      plan0.forEach(function (plan) {
         var liveChapter = course.chapters.filter(function (item) { return item.id === plan.id; })[0];
         var live = Boolean(liveChapter);
         var liveTotal = live ? chapterSteps(liveChapter).length : 0;
         var liveDone = live ? completedSteps(liveChapter) : 0;
         var status = !live ? "" : liveDone === 0 ? "未开始" : liveDone >= liveTotal ? "已完成" : "进行中";
         var expanded = live && homeExpanded[liveChapter.id] === true;
         var dots = live
            ? liveChapter.sections.map(function (section) {
                 return '<span class="ch-dot' + (isDoneFor(liveChapter, section.id) ? " done" : "") + '" data-step="' + section.id + '" data-tip="' +
                    esc(section.id + " " + plainText(section.title)) + '"></span>';
              }).join("") + (liveChapter.chapterTasks.length ? '<span class="ch-dot star' + (isDoneFor(liveChapter, "chapterTask") ? " done" : "") + '" data-step="chapterTask" data-tip="章末大题"></span>' : "")
            : "";
         var action = live
            ? '<button class="btn btn-primary" data-resume data-open-chapter="' + liveChapter.id + '" data-open-section="' + firstUnfinishedFor(liveChapter) + '">' +
              (liveDone === 0 ? "开始学习" : liveDone >= liveTotal ? "重看一遍" : "继续") + "</button>"
            : '<span class="chip">尚未上线</span>';
         var body = live
            ? '<button class="ch-body ch-open" data-toggle-home-chapter="' + liveChapter.id + '" aria-expanded="' + expanded + '" aria-label="展开或收起 Chapter ' + liveChapter.id + "　" + esc(plainText(liveChapter.title)) + '">' +
              '<span class="ch-title"><span class="caret">›</span>' + inline(plan.title) + '</span><span class="ch-dots">' + dots + '</span><span class="ch-status">' + status + "　" + liveDone + " / " + liveTotal + "</span></button>"
            : '<span class="ch-body"><span class="ch-title">' + inline(plan.title) + "</span></span>";
         var children = live
            ? '<ul class="ch-subsections">' + liveChapter.sections.map(function (section) {
               return '<li><button class="ch-sub-link" data-open-chapter="' + liveChapter.id + '" data-open-section="' + section.id + '">' +
                  '<span>' + section.id + '</span><span>' + inline(section.title) + '</span></button></li>';
              }).join("") + (liveChapter.chapterTasks.length ? '<li><button class="ch-sub-link kind-task" data-open-chapter="' + liveChapter.id + '" data-open-section="chapterTask"><span>★</span><span>章末大题</span></button></li>' : '') + '</ul>'
            : "";
         var card = (
            '<li class="ch-card-wrap' + (expanded ? " open" : "") + '"><div class="ch-card' + (live ? " live" : "") + '"' + (live ? ' data-chapter="' + liveChapter.id + '"' : "") + ">" +
            '<span class="ch-num">' + plan.id + "</span>" +
            body +
            '<span class="chip level-' + plan.level.toLowerCase() + '">' + plan.level + "</span>" +
            '<span class="ch-action">' + action + "</span></div>" + children + "</li>"
         );
         (plan.id <= 16 ? asCards : aCards).push(card);
      });

      return (
         '<article class="section-doc home" data-section="home" hidden>' +
         '<div class="crumb"><span>CAIE 9618</span><span class="dot">·</span><span>伪代码</span></div>' +
         '<h1 class="sec-title">课程主页</h1>' +
         '<p class="home-lead">按顺序往下学就行。每一节结束会有一道理解检查，答对了才继续；每章最后有一道综合题。</p>' +
         '<div class="home-progress"><div class="home-progress-bar"><span style="width:' +
         Math.round((done / total) * 100) + '%"></span></div>' +
         '<span class="home-progress-num">Chapter ' + chapter.id + "：" + done + " / " + total + "</span></div>" +
         '<h3 class="home-head">AS Level<span class="muted small">　Chapter 1–16</span></h3>' +
         '<ul class="ch-list">' + asCards.join("") + "</ul>" +
         '<h3 class="home-head">A Level<span class="muted small">　Chapter 17–23</span></h3>' +
         '<ul class="ch-list">' + aCards.join("") + "</ul>" +
         "</article>"
      );
   }

   function firstUnfinished() {
      for (var i = 0; i < chapter.sections.length; i += 1) {
         if (!isDone(chapter.sections[i].id)) return chapter.sections[i].id;
      }
      return chapter.chapterTasks.length ? (isDone("chapterTask") ? chapter.sections[0].id : "chapterTask") : chapter.sections[0].id;
   }

   function renderChapterTaskPage() {
      if (!chapter.chapterTasks.length) return "";
      var task = chapter.chapterTasks[0];
      var head =
         '<div class="crumb"><span>' + (chapter.level === "AS" ? "AS Level" : "A Level") + "</span>" +
         '<span class="dot">·</span><span>Chapter ' + chapter.id + "　" + inline(chapter.title) + "</span></div>" +
         '<h1 class="sec-title">章末大题</h1>' +
         '<div class="sec-meta"><span class="chip level-' + chapter.level.toLowerCase() + '">' + chapter.level + "</span>" +
         '<span class="chip">用得上第 1–' + chapter.id + " 章的全部内容</span></div>";
      return '<article class="section-doc" data-section="chapterTask" hidden>' + head +
         renderTaskEntry(task, true, chapter, "chapterTask") + "</article>";
   }

   /* ---------------- 导航 ---------------- */

   /** 导航顺序。没有章末大题的章（概念章）不该多出一步空白的「章末大题」页。 */
   function orderOf(targetChapter) {
      return ["home"].concat(chapterSteps(targetChapter));
   }

   var order = orderOf(chapter);

   function firstUnfinishedFor(targetChapter) {
      for (var i = 0; i < targetChapter.sections.length; i += 1) {
         if (!isDoneFor(targetChapter, targetChapter.sections[i].id)) return targetChapter.sections[i].id;
      }
      return targetChapter.chapterTasks.length ? (isDoneFor(targetChapter, "chapterTask") ? targetChapter.sections[0].id : "chapterTask") : targetChapter.sections[0].id;
   }

   function openChapter(id, targetSection) {
      var nextChapter = course.chapters.filter(function (item) { return item.id === Number(id); })[0];
      if (!nextChapter) return;
      chapter = nextChapter;
      tocExpanded[chapter.id] = true;
      order = orderOf(chapter);
      renderCurrentChapter();
      if (targetSection) show(targetSection);
   }

   /**
    * 地址栏上不留东西。
    *
    * `?c=4&s=4.2` 只是做题页回来时用一次的「去哪一节」指令，用完就该擦掉——
    * 否则人已经翻到别处、甚至回了主页，它还挂在那儿，刷新一下又被带回去。
    * 擦掉之后刷新仍然回得到原处：位置记在本地（`caie.teaching.position.v1`），
    * 不靠地址栏。
    */
   function clearUrlParams() {
      if (!window.history || !window.history.replaceState) return;
      if (!location.search) return;
      try {
         window.history.replaceState(null, "", location.pathname);
      } catch (e) {
         /* 某些浏览器在 file:// 下不允许改地址栏；不影响页面本身 */
      }
   }

   function show(id, restoreScrollTop) {
      clearUrlParams();
      $$("[data-section]").forEach(function (node) { node.hidden = node.dataset.section !== id; });
      $$(".toc-link").forEach(function (b) {
         var active = b.dataset.goto === id ||
            (Number(b.dataset.openChapter) === chapter.id && b.dataset.openSection === id);
         b.classList.toggle("current", active);
      });

      var index = order.indexOf(id);
      var prev = order[index - 1];
      var next = order[index + 1];
      var prevBtn = $("#navPrev");
      var nextBtn = $("#navNext");
      prevBtn.disabled = !prev;
      nextBtn.disabled = !next;
      prevBtn.innerHTML = prev
         ? '<span class="nav-kicker">‹ 上一节</span><span class="nav-title">' + inline(labelOf(prev)) + "</span>"
         : '<span class="nav-kicker">上一节</span><span class="nav-title">没有了</span>';
      nextBtn.innerHTML = next
         ? '<span class="nav-kicker">下一节 ›</span><span class="nav-title">' + inline(labelOf(next)) + "</span>"
         : '<span class="nav-kicker">本章</span><span class="nav-title">到此结束</span>';
      prevBtn.dataset.goto = prev || "";
      nextBtn.dataset.goto = next || "";

      var isHome = id === "home";
      var isTask = id === "chapterTask";
      var section = chapter.sections.filter(function (s) { return s.id === id; })[0];

      $("#footProgress").textContent = isHome
         ? "全部 23 章 · 已上线 " + course.chapters.length + " 章"
         : isTask
            ? "Chapter " + chapter.id + " · 章末大题"
            : "Chapter " + chapter.id + " · 第 " + index + " / " + chapter.sections.length + " 节";
      $("#ltCh").textContent = isHome ? "CAIE 9618 伪代码" : "Chapter " + chapter.id + " · " + plainText(chapter.title);
      $("#ltSec").textContent = isHome ? "课程主页" : isTask ? "章末大题" : section.id + "　" + plainText(section.title);
      $("#statusSection").textContent = isHome
         ? "课程主页"
         : isTask ? "Chapter " + chapter.id + " 章末大题" : "Chapter " + section.id;
      $("#statusSyllabus").textContent = isHome ? "" : (isTask ? chapter.syllabus : section.syllabus).join(" / ");

      if (isHome) $("#reader").insertAdjacentHTML("afterbegin", "");
      refreshProgressUI();
      var readerScroll = $("#readerScroll");
      readerScroll.scrollTop = Number.isFinite(Number(restoreScrollTop)) ? Math.max(0, Number(restoreScrollTop)) : 0;
      savePosition(id, readerScroll.scrollTop);
   }

   function labelOf(id) {
      if (id === "home") return "课程主页";
      if (id === "chapterTask") return "章末大题";
      var section = chapter.sections.filter(function (s) { return s.id === id; })[0];
      return section.id + " " + section.title;
   }

   /* ---------------- 启动 ---------------- */

   function renderCurrentChapter(initialSection, initialScrollTop) {
      renderToc();
      $("#reader").innerHTML =
         renderHomePage() + chapter.sections.map(renderSection).join("") + renderChapterTaskPage();

      $$(".quiz").forEach(wireQuiz);
      $$("[data-gate-next]").forEach(function (btn) {
         var quizNode = btn.closest(".quiz");
         if (!$('.gated[data-unlock="' + quizNode.dataset.gate + '"]')) {
            var here = btn.closest("[data-section]").dataset.section;
            var next = order[order.indexOf(here) + 1];
            btn.textContent = next ? "下一节 ›" : "回到主页 ›";
         }
         btn.addEventListener("click", function () {
            if (btn.disabled) return;
            var quiz = btn.closest(".quiz");
            var block = $('.gated[data-unlock="' + quiz.dataset.gate + '"]');
            btn.disabled = true;
            btn.textContent = "已继续";
            if (!block) {
               // 关卡就是本节最后一块内容：直接进入下一节
               if (restoring) return;
               var here = btn.closest("[data-section]").dataset.section;
               var next = order[order.indexOf(here) + 1];
               markSectionDone(here);
               show(next || "home");
               return;
            }
            if (quiz.dataset.analysis && !$(".quiz-analysis", block)) {
               var box = document.createElement("div");
               box.className = "quiz-analysis unlocked";
               box.innerHTML = quiz.dataset.analysis;
               block.insertBefore(box, block.firstChild);
            }
            block.hidden = false;
            if (!restoring) block.scrollIntoView({ behavior: "smooth", block: "start" });
            $$(".quiz", block).forEach(wireQuiz);
            refreshTaskEntries();
            // 关卡后面还有内容，但如果剩下的全是说明性文字（没有下一个 quiz，也没有伪代码题入口），
            // 那这一节其实已经没有别的东西要学生互动了——2.5 就是这样：quiz 后面挂着 example/counterExample，
            // 原来只有「quiz 是本节最后一块内容」才会标完成，这种「quiz 后面还有静态尾巴」的节永远标不成已完成。
            if (!restoring && !block.querySelector(".quiz") && !block.querySelector("[data-task-entry]")) {
               var hereTail = btn.closest("[data-section]").dataset.section;
               markSectionDone(hereTail);
            }
         });
      });

      // 注释条 hover 高亮对应行
      $$(".annots").forEach(function (list) {
         var card = list.previousElementSibling;
         var lines = $$(".ln", card);
         $$("li", list).forEach(function (li) {
            var range = (li.dataset.range || "").split("-").map(Number);
            var targets = lines.filter(function (ln) {
               var n = Number(ln.dataset.line);
               return n >= range[0] && n <= range[1];
            });
            li.addEventListener("mouseenter", function () { targets.forEach(function (t) { t.classList.add("hl"); }); });
            li.addEventListener("mouseleave", function () { targets.forEach(function (t) { t.classList.remove("hl"); }); });
         });
      });

      restorePassedGates();
      show(initialSection || "home", initialScrollTop);
   }

   /**
    * 把记录在案的关卡照着重放一遍：选对那一项、点「继续」。
    *
    * 走的是和学生自己点时完全相同的代码路径，所以解析、解锁、题目入口都会照常出现——
    * 不需要另写一套「恢复用」的渲染，也就不会和真实路径慢慢分叉。
    * 关卡解锁出来的内容里可能还有下一个关卡，所以要一轮一轮来，直到没有可重放的为止。
    */
   function restorePassedGates() {
      restoring = true;
      try {
         for (var round = 0; round < 8; round += 1) {
            var pending = $$(".quiz").filter(function (quiz) {
               return !quiz.classList.contains("solved") && gateWasPassed(quiz.dataset.gate);
            });
            if (!pending.length) break;
            pending.forEach(replayQuiz);
         }
      } finally {
         restoring = false;
      }
      backfillCompletedTailSections();
   }

   /**
    * 补一遍「关卡后面只剩静态尾巴」的完成判定（见上面点击处理器里同一条规则的注释）。
    *
    * 那条规则只在学生刚答对、真实点「继续」时跑一次；而重放走的是同一个点击处理器，
    * 却又特地用 `restoring` 把这条判定挡住了——原因是它旁边那条「关卡就是本节最后一块
    * 内容」的分支在恢复时不该顺手把学生带去下一节，两条规则当时图省事共用了一个开关。
    * 结果是：只要学生在「静态尾巴」这条规则上线之前就已经答对过 2.5 这类小节的关卡，
    * 存档里就只留了「关卡通过」、没留「本节完成」，以后每次重新打开都还是重放一遍、
    * 永远补不上这个 done。开完关卡重放后单独再扫一遍所有小节：全部关卡都已解开
    * 且没有还没做的题目入口，就直接标完成，不牵扯导航，所以不需要顾虑 `restoring`。
    */
   function backfillCompletedTailSections() {
      var changed = false;
      chapter.sections.forEach(function (section) {
         if (isDoneFor(chapter, section.id)) return;
         var root = $('[data-section="' + section.id + '"]');
         if (!root) return;
         var quizzes = $$(".quiz", root);
         if (!quizzes.length) return;
         if (quizzes.some(function (quiz) { return !quiz.classList.contains("solved"); })) return;
         if (root.querySelector("[data-task-entry]")) return;
         setDone(section.id);
         changed = true;
      });
      if (changed) refreshProgressUI();
   }

   function replayQuiz(quiz) {
      var type = quiz.dataset.quiz;
      if (type === "single-choice" || type === "true-false") {
         var right = $$(".opt", quiz).filter(function (opt) { return opt.dataset.correct === "true"; })[0];
         if (right) right.click();
      } else if (type === "click-line") {
         var answer = $$(".clickable-code .ln", quiz).filter(function (ln) { return ln.dataset.answer === "true"; })[0];
         if (answer) answer.click();
      } else {
         // fill-blank：先点空，再点对应的候选词，一个空一个空来
         $$(".blank", quiz).forEach(function (blank) {
            if (blank.classList.contains("right")) return;
            blank.click();
            var word = $$(".bank-item", quiz).filter(function (item) {
               return item.textContent.trim() === blank.dataset.answer;
            })[0];
            if (word) word.click();
         });
      }
      if (!quiz.classList.contains("solved")) return;
      var next = $("[data-gate-next]", quiz);
      if (next && !next.disabled) next.click();
   }

   /** `teaching.html?c=1&s=1.2`：做题页做完之后带着落点回来，不能只按上次的滚动位置恢复。 */
   function requestedLocation() {
      var search = window.location.search.replace(/^\?/, "");
      if (!search) return null;
      var params = {};
      search.split("&").forEach(function (pair) {
         if (!pair) return;
         var parts = pair.split("=");
         params[decodeURIComponent(parts[0])] = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));
      });
      var target = course.chapters.filter(function (item) { return item.id === Number(params.c); })[0];
      if (!target) return null;
      return { chapter: target, sectionId: params.s || "home" };
   }

   /* 人只要自己翻过页或滚动过，云端的阅读位置就不再插手：
      把正在看的内容抽走比少同步一次更糟。
      开头这一小段不算：首次渲染和位置恢复本身就会触发一次滚动，
      那不是人翻的页。 */
   var navigatedThisSession = false;
   var bootedAt = Date.now();
   var SETTLE_MS = 1200;

   function currentSectionId() {
      var current = $(".section-doc:not([hidden])");
      return current ? current.dataset.section : null;
   }

   function boot() {
      var requested = requestedLocation();
      if (requested) navigatedThisSession = true;
      var resumeChapter = requested ? requested.chapter : (savedPosition && course.chapters.filter(function (item) {
         return item.id === Number(savedPosition.chapterId);
      })[0]);
      if (resumeChapter) {
         chapter = resumeChapter;
         tocExpanded[chapter.id] = true;
         order = orderOf(chapter);
      }
      var resumeSection = requested
         ? (order.indexOf(requested.sectionId) >= 0 ? requested.sectionId : "home")
         : (resumeChapter && order.indexOf(savedPosition.sectionId) >= 0 ? savedPosition.sectionId : "home");
      var resumeScrollTop = !requested && resumeChapter && resumeSection === savedPosition.sectionId
         ? Number(savedPosition.scrollTop)
         : 0;
      renderCurrentChapter(resumeSection, resumeScrollTop);

      $("#readerScroll").addEventListener("scroll", function () {
         if (Date.now() - bootedAt > SETTLE_MS) navigatedThisSession = true;
         saveCurrentPosition();
      }, { passive: true });

      /* 做题页在另一个文档里改了进度。回到这一页时（前进后退、切回标签页、
         或者做题页开在另一个标签里）必须重新读一遍，否则页面还停在旧状态。 */
      function syncProgressFromStorage() {
         T.progress.reload();
         refreshProgressUI();
      }
      window.addEventListener("pageshow", syncProgressFromStorage);
      window.addEventListener("focus", syncProgressFromStorage);
      document.addEventListener("visibilitychange", function () {
         if (!document.hidden) syncProgressFromStorage();
      });
      window.addEventListener("storage", function (event) {
         if (!event.key || event.key === "caie.teaching.progress.v1") syncProgressFromStorage();
      });

      /* 云端把另一台设备上已完成的小节合并进来之后，目录进度点和完成度要跟着变。
         合并是单调的：只会多出「已完成」，不会把这里已经完成的退回去。 */
      document.addEventListener("teaching-progress-merged", function () { refreshProgressUI(); });

      if (window.SyncEngine) {
         window.SyncEngine.useTeaching({
            readPosition: function () { return savedPosition; },
            /*
             * 另一台设备读到哪儿了。只认章号和小节号，滚动位置从 0 开始——
             * 它从来不上传，也就没有可恢复的值。
             * 已经自己翻过页就不再打断：跳走会把人从正在看的内容上带离。
             */
            applyPosition: function (position) {
               if (navigatedThisSession) return;
               var target = course.chapters.filter(function (item) { return item.id === Number(position.chapterId); })[0];
               if (!target) return;
               if (target.id === chapter.id && position.sectionId === currentSectionId()) return;
               if (orderOf(target).indexOf(position.sectionId) < 0) return;
               openChapter(String(target.id), position.sectionId);
            }
         });
      }

      document.addEventListener("click", function (e) {
         var homeToggle = e.target.closest("[data-toggle-home-chapter]");
         if (homeToggle) {
            var homeChapterId = Number(homeToggle.dataset.toggleHomeChapter);
            homeExpanded[homeChapterId] = !homeExpanded[homeChapterId];
            var homeCard = homeToggle.closest(".ch-card-wrap");
            if (homeCard) homeCard.classList.toggle("open", homeExpanded[homeChapterId]);
            homeToggle.setAttribute("aria-expanded", String(homeExpanded[homeChapterId]));
            return;
         }
         var tocToggle = e.target.closest("[data-toggle-toc-chapter]");
         if (tocToggle) {
            var tocChapterId = Number(tocToggle.dataset.toggleTocChapter);
            var currentlyOpen = tocToggle.closest(".toc-chapter").classList.contains("open");
            tocExpanded[tocChapterId] = !currentlyOpen;
            renderToc();
            refreshProgressUI();
            return;
         }
         var openChapterButton = e.target.closest("[data-open-chapter]");
         if (openChapterButton) {
            navigatedThisSession = true;
            saveCurrentPosition();
            openChapter(openChapterButton.dataset.openChapter, openChapterButton.dataset.openSection);
            if (window.innerWidth < 900) $("#toc").classList.add("collapsed");
            return;
         }
         var link = e.target.closest("[data-goto]");
         if (link && link.dataset.goto) {
            navigatedThisSession = true;
            saveCurrentPosition();
            show(link.dataset.goto);
            // 窄屏时目录是盖在正文上的浮层，选完就让开
            if (window.innerWidth < 900) $("#toc").classList.add("collapsed");
            return;
         }
         var open = e.target.closest("[data-open-editor]");
         if (open) {
            // localStorage 而不是 sessionStorage：直接双击 HTML 打开时两个页面不共享 session
            try {
               localStorage.setItem("caie.teaching.handoff", JSON.stringify({
                  source: open.dataset.openEditor,
                  name: open.dataset.openName || "FromLesson",
                  label: open.dataset.openLabel || "来自课文"
               }));
            } catch (err) {
               alertLike("这个浏览器不让页面之间传数据，请手动把代码复制到编辑器里。");
               return;
            }
            window.location.href = "index.html";
         }
      });

      $("#toggleToc").addEventListener("click", function () { $("#toc").classList.toggle("collapsed"); });
      var labels = $("#elLabelToggle");
      labels.addEventListener("click", function () {
         var on = labels.getAttribute("aria-checked") === "true";
         labels.setAttribute("aria-checked", on ? "false" : "true");
         document.documentElement.setAttribute("data-el-labels", on ? "off" : "on");
      });

      var wasNarrow = window.innerWidth < 900;
      if (wasNarrow) $("#toc").classList.add("collapsed");
      window.addEventListener("resize", function () {
         var narrow = window.innerWidth < 900;
         if (narrow && !wasNarrow) $("#toc").classList.add("collapsed");
         wasNarrow = narrow;
      });
   }

   document.addEventListener("DOMContentLoaded", boot);
})();
