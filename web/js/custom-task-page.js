/* 老师自出题的做题页。
 *
 * 和课程题目最大的不同：没有测试用例，所以不判分、不给对错反馈。
 * 学生写完自己点运行看结果，成绩由老师批改——这正是"系统只提供运行不提供判分"。
 * 提示是可选的，老师写了就显示。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;
   var RUNTIME = window.CAIERuntime;
   var STORAGE = window.CAIEStorage;

   var assignmentId = null;
   var itemId = null;
   var run = { active: false, controller: null, pending: false };
   var saveTimer = null;

   function query(name) {
      return new URLSearchParams(window.location.search).get(name);
   }

   /* 草稿按「作业 + 题目」存在本机，换页不丢。和课程题目的草稿分开放，互不干扰。 */
   function draftKey() { return "seedtocode.customdraft." + assignmentId + "." + itemId; }

   function missing(title, body) {
      $("ctMissing").hidden = false;
      $("split").hidden = true;
      $("ctMissingTitle").textContent = title;
      $("ctMissingBody").textContent = body;
   }

   function println(text, cls) {
      var span = document.createElement("span");
      if (cls) span.className = cls;
      span.textContent = text + "\n";
      $("ctConsole").appendChild(span);
      $("ctConsole").scrollTop = $("ctConsole").scrollHeight;
   }

   function setInputWaiting(waiting) {
      $("ctInputRow").hidden = !waiting;
      if (waiting) { $("ctInput").value = ""; $("ctInput").focus(); }
   }

   function finishRun() {
      run.active = false;
      run.controller = null;
      run.pending = false;
      $("ctRun").hidden = false;
      $("ctStop").hidden = true;
      setInputWaiting(false);
   }

   function startRun() {
      if (run.active) return;
      $("ctConsole").innerHTML = "";
      run = { active: true, controller: null, pending: false };
      $("ctRun").hidden = true;
      $("ctStop").hidden = false;

      // 运行前仍然拦阻断错误——跑不起来的代码直接报错，比跑一半更清楚
      var diagnostics = window.LANGUAGE_ADAPTER ? window.LANGUAGE_ADAPTER.diagnose($("ctCode").value) : [];
      var blocking = diagnostics.filter(function (item) { return item.severity === "error"; });
      if (blocking.length) {
         println("运行前检查发现 " + blocking.length + " 处阻断错误：", "err");
         blocking.slice(0, 5).forEach(function (item) { println("  行 " + item.line + "：" + item.message, "err"); });
         finishRun();
         return;
      }

      var controller = RUNTIME.executeSource($("ctCode").value, {
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
      var value = $("ctInput").value;
      var accepted = run.controller.provideInput(value);
      if (!accepted.accepted) { println(window.runtimeMessage(accepted), "err"); return; }
      println("> " + value, "in");
      run.pending = false;
      setInputWaiting(false);
   }

   function scheduleSave() {
      $("ctSaveState").textContent = "保存中";
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
         STORAGE.set(draftKey(), $("ctCode").value);
         $("ctSaveState").textContent = "已保存";
      }, 400);
   }

   async function submit() {
      var source = $("ctCode").value;
      if (!source.trim()) { println("还没写任何代码，先写点东西再提交。", "sys"); return; }
      $("ctSubmit").disabled = true;
      try {
         await CLIENT.request("/api/assignments/" + encodeURIComponent(assignmentId) + "/submissions", {
            method: "POST",
            body: { taskId: itemId, answerContent: source, clientVersion: "web-1" }
         });
         println("已提交给老师。可以继续修改，再提交一次会留下新的记录。", "sys");
         $("ctSaveState").textContent = "已提交";
      } catch (error) {
         println("提交失败：" + ((error && error.message) || "请稍后再试"), "err");
      } finally { $("ctSubmit").disabled = false; }
   }

   /** 老师批过就把分数和评语摆在作答区顶上。 */
   function renderFeedback(submissions) {
      var latest = null;
      submissions.forEach(function (row) {
         if (row.taskId !== itemId || !row.graded) return;
         if (!latest || row.submittedAt > latest.submittedAt) latest = row;
      });
      if (!latest) return;
      $("ctFeedback").hidden = false;
      $("ctFeedback").innerHTML =
         '<div class="task-feedback-head">老师已批改' +
         (latest.teacherScore === null ? "" : '<span class="task-feedback-score">' + latest.teacherScore + " 分</span>") +
         "</div>" + (latest.teacherComment ? '<div class="task-feedback-body"></div>' : "");
      if (latest.teacherComment) $("ctFeedback").querySelector(".task-feedback-body").textContent = latest.teacherComment;
   }

   async function boot() {
      assignmentId = query("a");
      itemId = query("i");
      if (!assignmentId || !itemId) { missing("链接不完整", "从「我的作业」里点进来。"); return; }
      if (!CLIENT.available()) { missing("云端功能暂未连接", "作业需要连接云端才能打开。"); return; }
      await CLIENT.restore();
      if (!AUTH.isSignedIn() || AUTH.user().role !== "student") {
         missing("请先以学生身份登录", "这道题是老师布置给学生的。");
         return;
      }

      var list = await CLIENT.assignments(true);
      var assignment = list.filter(function (item) { return item.id === assignmentId; })[0];
      var item = assignment && (assignment.items || []).filter(function (entry) { return entry.id === itemId; })[0];
      if (!item || item.kind !== "custom") { missing("没有找到这道题", "它可能已经被老师删掉了。"); return; }

      $("ctAssignment").textContent = assignment.title;
      $("ctDue").textContent = assignment.dueAt
         ? (assignment.dueAt < Date.now() ? "已过截止，现在提交算迟交" : "截止 " + new Date(assignment.dueAt).toLocaleString())
         : "不限时间";
      $("ctTitle").textContent = item.title || "作业题";
      $("ctPrompt").textContent = item.prompt || "";
      if (item.guidance) {
         $("ctGuidance").hidden = false;
         $("ctGuidanceBody").textContent = item.guidance;
      }

      var draft = STORAGE.get(draftKey(), null);
      $("ctCode").value = typeof draft === "string" ? draft : "";
      $("ctSaveState").textContent = draft ? "已保存" : "";

      try {
         var data = await CLIENT.request("/api/assignments/" + encodeURIComponent(assignmentId) + "/submissions");
         renderFeedback(data.submissions || []);
      } catch (error) { /* 看不到批改不影响做题 */ }
   }

   $("ctRun").addEventListener("click", startRun);
   $("ctStop").addEventListener("click", function () { if (run.controller) run.controller.stop(); });
   $("ctSubmit").addEventListener("click", function () { void submit(); });
   $("ctSend").addEventListener("click", submitInput);
   $("ctInput").addEventListener("keydown", function (event) { if (event.key === "Enter") submitInput(); });
   $("ctCode").addEventListener("input", scheduleSave);

   void boot();
})();
