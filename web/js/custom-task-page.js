/* 老师自出题的做题页。
 *
 * 和课程题目最大的不同：没有测试用例，所以不判分、不给对错反馈。
 * 学生写完自己点运行看结果，成绩由老师批改——这正是"系统只提供运行不提供判分"。
 * 提示是可选的，老师写了就显示。
 *
 * 两件事和课程题目必须一样，否则学生在两处养成的手感会互相打架：
 *   1. 作答框是同一个编辑器（js/code-input.js）：三空格缩进、`<-` 自动转 `←`、
 *      行号、语法着色。原来这里是一个裸 textarea，Tab 直接跳走了焦点。
 *   2. 一份作业里的题可以就地切换，不必退回作业列表再点进来。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;
   var RUNTIME = window.CAIERuntime;
   var STORAGE = window.CAIEStorage;
   var CODE = window.CAIECodeInput;

   var assignmentId = null;
   var itemId = null;
   var assignment = null;          // 当前这份作业（含全部题目）
   var mySubmissions = {};         // taskId → 我最近一次提交
   var editor = null;              // CODE.attach 的句柄，换题后要重画行号和着色
   var run = { active: false, controller: null, pending: false };
   var saveTimer = null;

   function esc(value) {
      return String(value == null ? "" : value)
         .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
   }

   function query(name) {
      return new URLSearchParams(window.location.search).get(name);
   }

   /* 草稿按「作业 + 题目」存在本机，换页不丢。和课程题目的草稿分开放，互不干扰。 */
   function draftKey(task) { return "seedtocode.customdraft." + assignmentId + "." + (task || itemId); }

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
      var task = itemId;
      saveTimer = setTimeout(function () {
         STORAGE.set(draftKey(task), $("ctCode").value);
         // 存的时候还在这道题上才改文案，否则「已保存」说的是另一道题
         if (task === itemId) $("ctSaveState").textContent = "已保存";
      }, 400);
   }

   async function submit() {
      var source = $("ctCode").value;
      if (!source.trim()) { println("还没写任何代码，先写点东西再提交。", "sys"); return; }
      $("ctSubmit").disabled = true;
      var task = itemId;
      try {
         await CLIENT.request("/api/assignments/" + encodeURIComponent(assignmentId) + "/submissions", {
            method: "POST",
            body: { taskId: task, answerContent: source, clientVersion: "web-1" }
         });
         println("已提交给老师。可以继续修改，再提交一次会留下新的记录。", "sys");
         $("ctSaveState").textContent = "已提交";
         /* 切换条上的「已交」要立刻跟上：提交完还显示「未交」，学生会以为没成功
            又交一遍。本地先记下，再顺手把服务端那一份拉回来（拿不到也不影响）。 */
         mySubmissions[task] = mySubmissions[task] || { taskId: task, submittedAt: Date.now(), graded: false };
         mySubmissions[task].submittedAt = Date.now();
         renderSwitch();
         void loadSubmissions();
      } catch (error) {
         println("提交失败：" + ((error && error.message) || "请稍后再试"), "err");
      } finally { $("ctSubmit").disabled = false; }
   }

   /** 老师批过就把分数和评语摆在作答区顶上。 */
   function renderFeedback() {
      var latest = mySubmissions[itemId];
      var box = $("ctFeedback");
      if (!latest || !latest.graded) { box.hidden = true; box.innerHTML = ""; return; }
      box.hidden = false;
      box.innerHTML =
         '<div class="task-feedback-head">老师已批改' +
         (latest.teacherScore === null || latest.teacherScore === undefined
            ? "" : '<span class="task-feedback-score">' + latest.teacherScore + " 分</span>") +
         "</div>" + (latest.teacherComment ? '<div class="task-feedback-body"></div>' : "");
      if (latest.teacherComment) box.querySelector(".task-feedback-body").textContent = latest.teacherComment;
   }

   /**
    * 左栏顶上的题目切换条。
    *
    * 一份作业往往不止一道题，原来换一道题得退回作业列表再点进来。这里直接列出
    * 全部题目，并把每道题交没交、批没批标在上面——学生最关心的就是「还剩哪几道」。
    * 只有一道题时整条不出现：一个永远只有一个选项的切换器只是噪音。
    */
   function renderSwitch() {
      var tasks = (assignment.items || []).filter(function (entry) { return entry.kind === "custom"; });
      $("ctCounter").textContent = tasks.length > 1
         ? "第 " + (tasks.map(function (t) { return t.id; }).indexOf(itemId) + 1) + " / " + tasks.length + " 题"
         : "";
      if (tasks.length < 2) { $("ctSwitch").hidden = true; $("ctSwitch").innerHTML = ""; return; }
      $("ctSwitch").hidden = false;
      $("ctSwitch").innerHTML = tasks.map(function (entry, index) {
         var sub = mySubmissions[entry.id];
         var state = !sub ? "todo" : sub.graded ? "graded" : "done";
         var label = !sub ? "未交" : sub.graded ? "已批" : "已交";
         return '<button class="ct-switch-item" data-task="' + esc(entry.id) + '"' +
            ' aria-current="' + (entry.id === itemId ? "true" : "false") + '">' +
            '<span class="ct-switch-no">第 ' + (index + 1) + " 题</span>" +
            '<span class="ct-switch-name">' + esc(entry.title || "作业题") + "</span>" +
            '<span class="ct-switch-state" data-state="' + state + '">' + label + "</span>" +
            "</button>";
      }).join("");
   }

   /** 切到某一道题。草稿、反馈、控制台都要跟着换——换题不清空控制台会让人以为那是新题跑出来的。 */
   function selectTask(nextId) {
      var item = (assignment.items || []).filter(function (entry) { return entry.id === nextId; })[0];
      if (!item || item.kind !== "custom") return;
      // 切走之前先把当前这道题的草稿落盘，别等防抖那 400ms
      clearTimeout(saveTimer);
      if (itemId) STORAGE.set(draftKey(itemId), $("ctCode").value);
      if (run.active && run.controller) run.controller.stop();

      itemId = nextId;
      /* 地址栏跟着换：刷新、收藏、把链接发给同学，落到的都得是眼前这道题。
         用 replaceState 不留历史——浏览器的「后退」应当回到作业列表。 */
      var url = new URL(window.location.href);
      url.searchParams.set("i", nextId);
      window.history.replaceState(null, "", url.toString());

      $("ctTitle").textContent = item.title || "作业题";
      $("ctPrompt").textContent = item.prompt || "";
      $("ctGuidance").hidden = !item.guidance;
      $("ctGuidanceBody").textContent = item.guidance || "";
      document.querySelector(".task-pane-left .pane-scroll").scrollTop = 0;

      var draft = STORAGE.get(draftKey(nextId), null);
      $("ctCode").value = typeof draft === "string" ? draft : "";
      if (editor) editor.repaint();
      $("ctSaveState").textContent = draft ? "已保存" : "";
      $("ctConsole").innerHTML = "";
      renderFeedback();
      renderSwitch();
   }

   async function loadSubmissions() {
      try {
         var data = await CLIENT.request("/api/assignments/" + encodeURIComponent(assignmentId) + "/submissions");
         // 服务端按时间倒序，每题第一条就是最近一次
         var byTask = {};
         (data.submissions || []).forEach(function (row) { if (!byTask[row.taskId]) byTask[row.taskId] = row; });
         mySubmissions = byTask;
         renderFeedback();
         renderSwitch();
      } catch (error) { /* 看不到自己的提交记录不影响做题 */ }
   }

   async function boot() {
      assignmentId = query("a");
      var wanted = query("i");
      if (!assignmentId || !wanted) { missing("链接不完整", "从「我的作业」里点进来。"); return; }
      if (!CLIENT.available()) { missing("云端功能暂未连接", "作业需要连接云端才能打开。"); return; }
      await CLIENT.restore();
      if (!AUTH.isSignedIn() || AUTH.user().role !== "student") {
         missing("请先以学生身份登录", "这道题是老师布置给学生的。");
         return;
      }

      var list = await CLIENT.assignments(true);
      assignment = list.filter(function (item) { return item.id === assignmentId; })[0];
      var item = assignment && (assignment.items || []).filter(function (entry) { return entry.id === wanted; })[0];
      if (!item || item.kind !== "custom") { missing("没有找到这道题", "它可能已经被老师删掉了。"); return; }

      $("ctAssignment").textContent = assignment.title;
      $("ctDue").textContent = assignment.dueAt
         ? (assignment.dueAt < Date.now() ? "已过截止，现在提交算迟交" : "截止 " + new Date(assignment.dueAt).toLocaleString())
         : "不限时间";

      /* 行号、着色、三空格缩进、`<-` 转 `←` 一次装好——和课程题目同一份实现。 */
      editor = CODE.attach($("ctCode"), { gutter: $("ctGutter"), highlight: document.querySelector(".mini-code .mini-highlight") });
      $("ctCode").addEventListener("input", scheduleSave);

      selectTask(wanted);
      await loadSubmissions();
   }

   $("ctRun").addEventListener("click", startRun);
   $("ctStop").addEventListener("click", function () { if (run.controller) run.controller.stop(); });
   $("ctSubmit").addEventListener("click", function () { void submit(); });
   $("ctSend").addEventListener("click", submitInput);
   $("ctInput").addEventListener("keydown", function (event) { if (event.key === "Enter") submitInput(); });
   $("ctSwitch").addEventListener("click", function (event) {
      var hit = event.target.closest("[data-task]");
      if (hit && hit.dataset.task !== itemId) selectTask(hit.dataset.task);
   });

   void boot();
})();
