/* 独立做题页 task.html 的页面逻辑。
 *
 * 只负责三件事：从查询串找到那道题、把左右两栏摆好、做完之后把进度写回去。
 * 题面、作答区、判题一律由 js/teaching-task.js 提供，和课文页是同一份实现。
 *
 * 进度写的是课文页那一份 localStorage（caie.teaching.progress.v1），
 * 所以做完这里，课文的目录进度点、章节完成度、主页卡片都会跟着变。
 */
(function () {
   "use strict";

   var $ = function (s, r) { return (r || document).querySelector(s); };
   var T = window.TEACHING_TASK;
   var course = window.CAIETeaching.course;

   var SPLIT_KEY = "caie.task.split.v1";
   var MIN_PANE = 320;

   function query() {
      var out = {};
      var search = window.location.search.replace(/^\?/, "");
      if (!search) return out;
      search.split("&").forEach(function (pair) {
         if (!pair) return;
         var parts = pair.split("=");
         out[decodeURIComponent(parts[0])] = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));
      });
      return out;
   }

   /** 章内的推进顺序，和课文页的一致：小节依次，章末大题在最后。 */
   function stepsOf(chapter) {
      return chapter.sections.map(function (section) { return section.id; })
         .concat(chapter.chapterTasks.length ? ["chapterTask"] : []);
   }

   function labelOf(chapter, stepId) {
      if (stepId === "chapterTask") return "章末大题";
      var section = chapter.sections.filter(function (s) { return s.id === stepId; })[0];
      return section ? section.id + " " + section.title : stepId;
   }

   function lessonHref(chapter, stepId) {
      return "teaching.html?c=" + chapter.id + (stepId ? "&s=" + encodeURIComponent(stepId) : "");
   }

   /* ---------------- 左右分栏的宽度 ---------------- */

   function wireSplit(split, handle) {
      var stored = Number(localStorage.getItem(SPLIT_KEY));
      if (Number.isFinite(stored) && stored >= MIN_PANE) {
         split.style.setProperty("--left-w", stored + "px");
      }

      function clampTo(x) {
         var rect = split.getBoundingClientRect();
         var width = Math.round(x - rect.left);
         var max = rect.width - MIN_PANE - handle.offsetWidth;
         return Math.max(MIN_PANE, Math.min(width, Math.max(MIN_PANE, max)));
      }

      function setWidth(width) {
         split.style.setProperty("--left-w", width + "px");
         try { localStorage.setItem(SPLIT_KEY, String(width)); } catch (e) { /* 无痕模式等 */ }
      }

      handle.addEventListener("pointerdown", function (event) {
         event.preventDefault();
         handle.setPointerCapture(event.pointerId);
         split.classList.add("resizing");
         function move(moveEvent) { setWidth(clampTo(moveEvent.clientX)); }
         function up() {
            split.classList.remove("resizing");
            handle.removeEventListener("pointermove", move);
            handle.removeEventListener("pointerup", up);
         }
         handle.addEventListener("pointermove", move);
         handle.addEventListener("pointerup", up);
      });

      // 键盘也能调：分隔条本身是可聚焦的 separator
      handle.addEventListener("keydown", function (event) {
         var step = event.shiftKey ? 48 : 16;
         if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
         event.preventDefault();
         var current = $("#paneLeft").getBoundingClientRect().width;
         setWidth(clampTo(split.getBoundingClientRect().left + current +
            (event.key === "ArrowRight" ? step : -step)));
      });
   }

   /* ---------------- 启动 ---------------- */

   function boot() {
      var params = query();
      var taskId = params.t || "";
      var found = taskId ? T.locate(course, params.c || null, taskId) : null;

      if (!found) {
         $("#split").hidden = true;
         $("#splitHandle").hidden = true;
         $("#taskState").hidden = true;
         $("#missing").hidden = false;
         $("#ltSec").textContent = "题目不存在";
         return;
      }

      var chapter = found.chapter;
      var task = found.task;
      var stepId = found.isChapterTask ? "chapterTask" : found.section.id;
      var kicker = found.isChapterTask ? "章末大题" : "伪代码题";

      document.title = task.title + " · CAIE 9618 伪代码";
      $("#paneKicker").textContent = kicker;
      $("#paneSource").textContent = found.isChapterTask
         ? "Chapter " + chapter.id + " 全章"
         : found.section.id + "　" + found.section.title;
      $("#taskTitle").textContent = task.title;
      $("#ltCh").textContent = "Chapter " + chapter.id + " · " + chapter.title;
      $("#ltSec").textContent = kicker + "　" + task.title;
      $("#statusLevel").textContent = chapter.level === "AS" ? "AS Level" : "A Level";
      $("#statusSection").textContent = found.isChapterTask
         ? "Chapter " + chapter.id + " 章末大题"
         : "Chapter " + found.section.id;
      $("#statusSyllabus").textContent = (found.isChapterTask ? chapter.syllabus : found.section.syllabus).join(" / ");
      $("#backToLesson").href = lessonHref(chapter, stepId);

      $("#statement").innerHTML = T.renderStatement(task, found.isChapterTask);
      $("#workspace").innerHTML = T.renderWorkspace(task);

      var stateChip = $("#taskState");
      function paintState(done) {
         stateChip.dataset.state = done ? "done" : "todo";
         stateChip.textContent = done ? "✓ 已通过" : "未通过";
      }
      paintState(T.progress.isDone(chapter.id, stepId));

      T.wire(document.body, task, {
         chapterId: chapter.id,
         taskId: task.id,
         taughtFeatures: T.taughtFeaturesFor(chapter, task.id),
         onPass: function () {
            T.progress.setDone(chapter.id, stepId);
            paintState(true);
            showNextStep(chapter, stepId);
         }
      });

      wireSplit($("#split"), $("#splitHandle"));
   }

   /** 通过之后给一条明确的去处：回到这一节，或直接进下一节。 */
   function showNextStep(chapter, stepId) {
      var slot = $(".next-step");
      if (!slot) return;
      var steps = stepsOf(chapter);
      var next = steps[steps.indexOf(stepId) + 1];
      slot.innerHTML =
         '<span class="next-mark">✓</span>' +
         '<span class="next-text">做完了，进度已经记回课文。</span>' +
         '<span class="spacer"></span>' +
         '<a class="btn" href="' + lessonHref(chapter, stepId) + '">回到这一节</a>' +
         (next
            ? '<a class="btn btn-primary" href="' + lessonHref(chapter, next) + '">下一节：' +
              T.esc(labelOf(chapter, next)) + " ›</a>"
            : '<a class="btn btn-primary" href="teaching.html">回到课程主页 ›</a>');
      slot.hidden = false;
      slot.scrollIntoView({ behavior: "smooth", block: "nearest" });
   }

   document.addEventListener("DOMContentLoaded", boot);
})();
