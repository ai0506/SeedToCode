/* 批改作业。
 *
 * 在这之前批改是班级面板里的一个弹框：一次只看一份提交，看完关掉、回矩阵、点下一格。
 * 批一个班三十份就要开关三十次弹框，而且弹框里既没有题面也不能运行——想知道这段
 * 代码到底跑出什么，只能自己复制到实验室里去。
 *
 * 这一页把批改需要的东西一次摆齐：左边学生、中间题面 + 学生的代码 + 运行结果、
 * 右边打分，顶上一条题目切换。学生和题目都能直接切换，一路批到底不用回列表。
 *
 * 运行是**本地**运行：老师看的是学生交上来的原文，在这儿改几行试跑不会回传给学生，
 * 也不会写进任何提交记录。这一点必须在界面上说出来，否则老师不敢动那段代码。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;
   var RUNTIME = window.CAIERuntime;
   var CODE = window.CAIECodeInput;
   /* 迟交判定在 packages/assignment 里（js/assignment-core.js 打成全局），那边有测试。 */
   var CORE = window.CAIEAssignment;

   var classId = null;
   var assignmentId = null;
   var assignment = null;
   var students = [];
   var submissions = [];          // 这份作业的全部提交，服务端按时间倒序
   var latest = {};               // studentId/taskId → 最近一次提交
   var taskId = null;
   var studentId = null;
   var editor = null;
   var originalSource = "";       // 学生交上来的原文，「复原」用
   var run = { active: false, controller: null, pending: false };

   function esc(value) {
      return String(value == null ? "" : value)
         .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
   }

   function when(timestamp) {
      if (!timestamp) return "—";
      var date = new Date(timestamp);
      var pad = function (n) { return String(n).padStart(2, "0"); };
      var sameYear = date.getFullYear() === new Date().getFullYear();
      return (sameYear ? "" : date.getFullYear() + "-") +
         pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
   }

   function query(name) {
      return new URLSearchParams(window.location.search).get(name);
   }

   var toastTimer = null;
   function toast(message) {
      var box = $("toast");
      $("toastText").textContent = message;
      box.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { box.hidden = true; }, 2600);
   }

   function gate(title, body, actions) {
      $("gGate").hidden = false;
      $("gMain").hidden = true;
      $("gateTitle").textContent = title;
      $("gateBody").textContent = body;
      $("gateActions").innerHTML = (actions || []).map(function (action) {
         return '<a class="btn ' + (action.primary ? "btn-primary" : "btn-ghost") + ' fixed-btn wide" href="' +
            esc(action.href) + '">' + esc(action.label) + "</a>";
      }).join("");
   }

   function describeError(error) {
      return (error && error.message) || "请稍后再试。";
   }

   function tasks() {
      return (assignment && assignment.items) || [];
   }

   function taskLabel(entry) {
      return entry.kind === "custom" ? (entry.title || "自出题") : entry.id;
   }

   function currentSubmission() {
      return latest[studentId + "/" + taskId] || null;
   }

   /* ---------------- 运行 ---------------- */

   function println(text, cls) {
      var span = document.createElement("span");
      if (cls) span.className = cls;
      span.textContent = text + "\n";
      $("gConsole").appendChild(span);
      $("gConsole").scrollTop = $("gConsole").scrollHeight;
   }

   function setInputWaiting(waiting) {
      $("gInputRow").hidden = !waiting;
      if (waiting) { $("gInput").value = ""; $("gInput").focus(); }
   }

   function finishRun() {
      run.active = false;
      run.controller = null;
      run.pending = false;
      $("gRun").hidden = false;
      $("gStop").hidden = true;
      setInputWaiting(false);
   }

   function startRun() {
      if (run.active) return;
      if (!$("gCode").value.trim()) { toast("这里没有代码可以运行。"); return; }
      $("gConsole").innerHTML = "";
      run = { active: true, controller: null, pending: false };
      $("gRun").hidden = true;
      $("gStop").hidden = false;

      /* 学生的代码本来就可能跑不起来——那正是要看的东西之一，所以不拦，
         只把阻断错误先列出来再停，省得老师对着一片空白的输出猜。 */
      var diagnostics = window.LANGUAGE_ADAPTER ? window.LANGUAGE_ADAPTER.diagnose($("gCode").value) : [];
      var blocking = diagnostics.filter(function (item) { return item.severity === "error"; });
      if (blocking.length) {
         println("这段代码有 " + blocking.length + " 处阻断错误，跑不起来：", "err");
         blocking.slice(0, 5).forEach(function (item) { println("  行 " + item.line + "：" + item.message, "err"); });
         finishRun();
         return;
      }

      var controller = RUNTIME.executeSource($("gCode").value, {
         onEvent: function (event) {
            if (event.type === "output-written") println(event.data.text);
            if (event.type === "input-requested") { run.pending = true; setInputWaiting(true); }
            if (event.type === "input-accepted") setInputWaiting(false);
            if (event.type === "runtime-error") {
               var error = event.data.error;
               println("运行时错误 " + error.code + "（行 " + error.range.start.line + "）：" + window.runtimeMessage(error), "err");
            }
            if (event.type === "run-stopped") println("运行已被停止。", "sys");
         }
      });
      run.controller = controller;
      controller.result.then(function (result) {
         if (result.status === "completed") println("运行结束 · " + result.steps + " 步", "sys");
         finishRun();
      });
   }

   function submitInput() {
      if (!run.active || !run.pending || !run.controller) return;
      var value = $("gInput").value;
      var accepted = run.controller.provideInput(value);
      if (!accepted.accepted) { println(window.runtimeMessage(accepted), "err"); return; }
      println("> " + value, "in");
      run.pending = false;
      setInputWaiting(false);
   }

   /* ---------------- 画界面 ---------------- */

   /** 一道题批到哪儿了：交了几个、还有几个没批。题目切换条和顶栏都用它。 */
   function taskStats(id) {
      var submitted = 0;
      var pending = 0;
      students.forEach(function (student) {
         var item = latest[student.id + "/" + id];
         if (!item) return;
         submitted += 1;
         if (!item.graded) pending += 1;
      });
      return { submitted: submitted, pending: pending, total: students.length };
   }

   function renderTasks() {
      var list = tasks();
      if (list.length < 2) { $("gTasks").hidden = true; $("gTasks").innerHTML = ""; return; }
      $("gTasks").hidden = false;
      $("gTasks").innerHTML = list.map(function (entry, index) {
         var stats = taskStats(entry.id);
         return '<button class="g-task-item" data-task="' + esc(entry.id) + '"' +
            ' aria-current="' + (entry.id === taskId ? "true" : "false") + '">' +
            '<span class="g-task-no">第 ' + (index + 1) + " 题</span>" +
            '<span class="g-task-name">' + esc(taskLabel(entry)) + "</span>" +
            '<span class="g-task-state" data-pending="' + (stats.pending > 0) + '">' +
            (stats.pending ? stats.pending + " 份待批" : "已批完") + "</span>" +
            "</button>";
      }).join("");
   }

   /**
    * 左栏学生列表。每一行只回答一个问题：这个人这道题是什么状态。
    * 「未交」也要列出来——老师最关心的往往正是那一格。
    */
   function renderStudents() {
      var stats = taskStats(taskId);
      $("gSideCount").textContent = stats.submitted + "/" + stats.total + " 已交";
      $("gStudents").innerHTML = students.map(function (student) {
         var item = latest[student.id + "/" + taskId];
         var state = !item ? "todo" : item.graded ? "graded" : "pending";
         var label = !item ? "未交"
            : item.graded ? (item.teacherScore === null || item.teacherScore === undefined ? "已阅" : item.teacherScore + " 分")
            : "待批";
         var late = item && CORE.isLate(assignment, item);
         return '<li><button class="g-student" data-student="' + esc(student.id) + '"' +
            ' aria-current="' + (student.id === studentId ? "true" : "false") + '">' +
            '<span class="g-student-who"><span class="g-student-name">' + esc(student.displayName) + "</span>" +
            '<span class="g-student-id">' + esc(student.username) + "</span></span>" +
            '<span class="g-student-state" data-state="' + state + '">' + esc(label) + "</span>" +
            (late ? '<span class="state-chip late-chip" data-state="late">迟</span>' : '<span class="state-chip late-slot"></span>') +
            "</button></li>";
      }).join("");
   }

   /** 顶栏那一句「这份作业还剩多少没批」。 */
   function renderProgress() {
      var pending = 0;
      var graded = 0;
      tasks().forEach(function (entry) {
         var stats = taskStats(entry.id);
         pending += stats.pending;
         graded += stats.submitted - stats.pending;
      });
      $("gProgress").textContent = pending ? "还有 " + pending + " 份待批" : graded ? "全部批完" : "还没有人交";
   }

   /**
    * 右栏顶上那块「这一份是什么情况」。
    *
    * 三行永远都在：提交 / 自动检查 / 批改。没有提交时值写「未交」和「—」，而不是
    * 换成一句话——换掉就等于让整个右栏在切学生时上下跳一次。每个值只占一行，
    * 完整说明交给悬浮提示。
    *
    * 自动判分只在**课程题目**上有：老师自己出的题没有测试用例，服务端也从来没有
    * 跑过它（submitAssignment 里 custom 一路直接跳过判分）。原来这里不管三七二十一
    * 都写「有用例没跑通」——一句凭空捏造的坏消息，老师照着它扣分就成了冤枉。
    * 所以先看 autoGraded：没有自动结果就明说没有，不猜。
    */
   function renderMeta() {
      var item = currentSubmission();
      var late = item && CORE.isLate(assignment, item);
      var autoState = !item ? "none" : item.autoGraded ? (item.serverPassed ? "yes" : "no") : "none";
      var autoShort = !item ? "—"
         : item.autoGraded
            ? (item.serverPassed ? "跑通了全部用例" : "有用例没跑通")
            : "没有测试用例";
      var autoTip = !item ? "还没有提交，没有可检查的内容"
         : item.autoGraded
            ? (item.serverPassed ? "代码跑通了全部用例" : "有用例没跑通") + "。仅供参考，不是成绩。"
            : "这道题是你自己出的，没有测试用例，系统从来没有判过它的分";
      $("gMeta").innerHTML =
         '<div class="g-meta-row"><span class="g-meta-k">提交</span><span class="g-meta-v" data-tip="' +
         (item ? esc(when(item.submittedAt)) + (late ? "（迟交）" : "") : "还没有提交") + '">' +
         (item ? esc(when(item.submittedAt)) + (late ? " · 迟交" : "") : "未交") + "</span></div>" +
         '<div class="g-meta-row"><span class="g-meta-k">自动检查</span><span class="g-meta-v" data-auto="' +
         autoState + '" data-tip="' + esc(autoTip) + '">' + esc(autoShort) + "</span></div>" +
         '<div class="g-meta-row"><span class="g-meta-k">批改</span><span class="g-meta-v">' +
         (!item ? "—" : item.graded ? "已于 " + esc(when(item.gradedAt)) + " 评分" : "尚未评分") + "</span></div>";
      $("gNote").textContent = item ? "" : "这个学生还没有交这道题，没有可以批改的内容。";
   }

   /**
    * 中间那一栏：题面 + 这个学生交的代码。
    *
    * 代码用共用编辑器（js/code-input.js）画，和学生写它时看到的是同一种颜色、
    * 同一套行号——批改时指「第 12 行」，两边数出来才是同一行。
    */
   function renderSubmission() {
      var entry = tasks().filter(function (row) { return row.id === taskId; })[0];
      var item = currentSubmission();
      var student = students.filter(function (row) { return row.id === studentId; })[0];

      $("gTaskName").textContent = entry ? taskLabel(entry) : "";
      $("gPrompt").textContent = entry && entry.prompt
         ? entry.prompt
         : "这是课程里的题目，题面在课程页里。";
      $("gGuidance").hidden = !(entry && entry.guidance);
      $("gGuidanceBody").textContent = (entry && entry.guidance) || "";

      $("gCodeWho").textContent = student ? student.displayName + " 的作答" : "学生的作答";
      originalSource = item ? (item.answerContent || "") : "";
      $("gCode").value = originalSource;
      if (editor) editor.repaint();
      $("gConsole").innerHTML = "";
      if (run.active && run.controller) run.controller.stop();

      var late = item && CORE.isLate(assignment, item);
      $("gSubmittedAt").textContent = item ? "提交于 " + when(item.submittedAt) + (late ? " · 迟交" : "") : "还没有提交";
      $("gRun").disabled = !item;
      $("gRestore").disabled = !item;

      renderMeta();

      $("gScore").value = item && item.teacherScore !== null && item.teacherScore !== undefined ? String(item.teacherScore) : "";
      $("gComment").value = (item && item.teacherComment) || "";
      $("gScore").disabled = !item;
      $("gComment").disabled = !item;
      $("gSave").disabled = !item;
      $("gError").textContent = "";
      $("gSavedState").textContent = "";
   }

   function renderAll() {
      renderTasks();
      renderStudents();
      renderProgress();
      renderSubmission();
   }

   /* ---------------- 切换 ---------------- */

   /** 地址栏跟着走：刷新、收藏、把链接发给同事，落到的都得是眼前这一份。 */
   function syncUrl() {
      var url = new URL(window.location.href);
      url.searchParams.set("class", classId);
      url.searchParams.set("a", assignmentId);
      url.searchParams.set("i", taskId);
      url.searchParams.set("s", studentId);
      window.history.replaceState(null, "", url.toString());
      $("backLink").href = "classes.html?class=" + encodeURIComponent(classId) +
         "&tab=assignments&a=" + encodeURIComponent(assignmentId);
   }

   function select(nextTask, nextStudent) {
      taskId = nextTask;
      studentId = nextStudent;
      syncUrl();
      renderAll();
   }

   /** 下一个还没批的学生；都批完了就按名单顺序走下一个。 */
   function step(delta) {
      var index = students.map(function (row) { return row.id; }).indexOf(studentId);
      if (index < 0) return;
      if (delta > 0) {
         for (var i = index + 1; i < students.length; i += 1) {
            var item = latest[students[i].id + "/" + taskId];
            if (item && !item.graded) { select(taskId, students[i].id); return; }
         }
      }
      var next = index + delta;
      if (next < 0 || next >= students.length) {
         toast(delta > 0 ? "这道题已经到名单末尾了。" : "已经是名单第一个了。");
         return;
      }
      select(taskId, students[next].id);
   }

   /* ---------------- 打分 ---------------- */

   async function saveGrade() {
      var item = currentSubmission();
      if (!item) return;
      var raw = $("gScore").value.trim();
      var comment = $("gComment").value.trim();
      var score = null;
      if (raw !== "") {
         if (!/^\d{1,3}$/.test(raw) || Number(raw) > 100) { $("gError").textContent = "分数需为 0–100 的整数。"; return; }
         score = Number(raw);
      }
      if (score === null && !comment) { $("gError").textContent = "填个分数或写句评语。"; return; }
      $("gError").textContent = "";
      $("gSave").disabled = true;
      try {
         var data = await CLIENT.request(
            "/api/classes/" + encodeURIComponent(classId) + "/submissions/" + encodeURIComponent(item.id) + "/grade",
            { method: "PUT", body: { score: score, comment: comment || null } }
         );
         // 就地更新这一条，不整页重拉——批改是连着做的，重拉会打断
         item.teacherScore = data.submission.teacherScore;
         item.teacherComment = data.submission.teacherComment;
         item.gradedAt = data.submission.gradedAt;
         item.graded = true;
         renderTasks();
         renderStudents();
         renderProgress();
         $("gSavedState").textContent = "已保存";
         /* 「批改」那一行要跟着变成「已于 … 评分」。整块重画，不去按下标改第三行——
            下标和 DOM 结构绑死，改一次版式就悄悄指错行。 */
         renderMeta();
         toast(score === null ? "已记下评语。" : "已评 " + score + " 分。");
      } catch (error) {
         $("gError").textContent = describeError(error);
      } finally { $("gSave").disabled = false; }
   }

   /* ---------------- 载入 ---------------- */

   function indexSubmissions() {
      latest = {};
      submissions.forEach(function (item) {
         var key = item.studentId + "/" + item.taskId;
         if (!latest[key]) latest[key] = item;   // 服务端按时间倒序，第一条就是最新的
      });
   }

   async function load() {
      var results = await Promise.all([
         CLIENT.request("/api/classes/" + encodeURIComponent(classId) + "/students"),
         CLIENT.request("/api/classes/" + encodeURIComponent(classId) + "/assignments"),
         CLIENT.request("/api/classes/" + encodeURIComponent(classId) + "/assignments/" + encodeURIComponent(assignmentId) + "/submissions")
      ]);
      students = results[0].students || [];
      assignment = (results[1].assignments || []).filter(function (item) { return item.id === assignmentId; })[0] || null;
      submissions = results[2].submissions || [];
      indexSubmissions();
   }

   async function refresh() {
      $("gRefresh").disabled = true;
      try {
         await load();
         if (!assignment) { gate("这份作业不在了", "它可能已经被删掉了。", [{ label: "回班级", primary: true, href: $("backLink").href }]); return; }
         renderAll();
         toast("已刷新。");
      } catch (error) { toast(describeError(error)); }
      finally { $("gRefresh").disabled = false; }
   }

   async function boot() {
      classId = query("class");
      assignmentId = query("a");
      if (!classId || !assignmentId) {
         gate("链接不完整", "从班级面板的作业详情里点某一格进来。", [{ label: "回班级", primary: true, href: "classes.html" }]);
         return;
      }
      if (!CLIENT.available()) {
         gate("云端功能暂未连接", "批改需要连接云端。编辑器、课程和本地运行不受影响。",
            [{ label: "去实验室", primary: true, href: "lab.html" }]);
         return;
      }
      await CLIENT.restore();
      if (!AUTH.isSignedIn()) {
         gate("请先登录", "批改作业需要以老师身份登录。",
            [{ label: "去登录", primary: true, href: "login.html?next=classes.html" }]);
         return;
      }
      if (AUTH.user().role !== "teacher") {
         gate("这一页是给老师的", "当前登录的是" + AUTH.roleLabel() + "。作业在「我的作业」里。",
            [{ label: "我的作业", primary: true, href: "assignments.html" }, { label: "去学习", href: "learn.html" }]);
         return;
      }

      try {
         await load();
      } catch (error) {
         gate("打不开这份作业", describeError(error), [{ label: "回班级", primary: true, href: "classes.html" }]);
         return;
      }
      if (!assignment) {
         gate("这份作业不在了", "它可能已经被删掉了。", [{ label: "回班级", primary: true, href: "classes.html" }]);
         return;
      }
      if (!tasks().length) {
         gate("这份作业里没有题目", "先在班级面板里编辑它。", [{ label: "回班级", primary: true, href: "classes.html" }]);
         return;
      }
      if (!students.length) {
         gate("这个班还没有学生", "先在班级面板里添加学生。", [{ label: "回班级", primary: true, href: "classes.html" }]);
         return;
      }

      $("gAssignment").textContent = assignment.title;
      $("gDue").textContent = assignment.dueAt
         ? (assignment.dueAt < Date.now() ? "已过截止 · " : "截止 ") + when(assignment.dueAt)
         : "不限时间";

      // 链接里指定的题和学生优先；指不到就落到第一题、第一个人
      var wantedTask = query("i");
      var wantedStudent = query("s");
      taskId = tasks().some(function (row) { return row.id === wantedTask; }) ? wantedTask : tasks()[0].id;
      studentId = students.some(function (row) { return row.id === wantedStudent; }) ? wantedStudent : students[0].id;

      /* 学生的代码用共用编辑器画：和学生写它时同一种颜色、同一套行号——
         批改时说「第 12 行」，两边数出来才是同一行。 */
      editor = CODE.attach($("gCode"), {
         gutter: $("gGutter"),
         highlight: document.querySelector(".mini-code .mini-highlight")
      });

      syncUrl();
      renderAll();
   }

   $("gRun").addEventListener("click", startRun);
   $("gStop").addEventListener("click", function () { if (run.controller) run.controller.stop(); });
   $("gSend").addEventListener("click", submitInput);
   $("gInput").addEventListener("keydown", function (event) { if (event.key === "Enter") submitInput(); });
   $("gRestore").addEventListener("click", function () {
      $("gCode").value = originalSource;
      if (editor) editor.repaint();
      toast("已复原成学生交上来的原文。");
   });
   $("gSave").addEventListener("click", function () { void saveGrade(); });
   $("gScore").addEventListener("keydown", function (event) { if (event.key === "Enter") $("gSave").click(); });
   $("gRefresh").addEventListener("click", function () { void refresh(); });
   $("gPrev").addEventListener("click", function () { step(-1); });
   $("gNext").addEventListener("click", function () { step(1); });
   $("gTasks").addEventListener("click", function (event) {
      var hit = event.target.closest("[data-task]");
      if (hit && hit.dataset.task !== taskId) select(hit.dataset.task, studentId);
   });
   $("gStudents").addEventListener("click", function (event) {
      var hit = event.target.closest("[data-student]");
      if (hit && hit.dataset.student !== studentId) select(taskId, hit.dataset.student);
   });

   void boot();
})();
