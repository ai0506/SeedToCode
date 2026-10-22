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
 *
 * 另外：提交按钮要一眼看得见（这一页真正要办的事是交上去，不是运行），而且当
 * 眼前这份代码和上次交的**一模一样**时要把「不用再交」说出来并把按钮禁掉——
 * 不说的话学生会一遍遍点，老师那边就堆出一串内容相同的版本。
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
      // 按钮在这两种情况下已经是 aria-disabled 的；这里把原因说出来，而不是按下去没反应
      if (!source.trim()) { println("还没写任何代码，先写点东西再提交。", "sys"); return; }
      if (source === submittedSourceOf(itemId)) {
         println("这一份和你上次交的一模一样，不用再交一遍。", "sys");
         return;
      }
      $("ctSubmit").disabled = true;
      var task = itemId;
      try {
         await CLIENT.request("/api/assignments/" + encodeURIComponent(assignmentId) + "/submissions", {
            method: "POST",
            body: { taskId: task, answerContent: source, clientVersion: "web-1" }
         });
         println("已提交给老师。可以继续修改，改完再交一次会留下新的记录。", "sys");
         $("ctSaveState").textContent = "已保存";
         /* 切换条和提交按钮要立刻跟上：提交完还显示「未交」，学生会以为没成功、
            又交一遍——这正是要避免的那件事。本地先把「上次交的」换成刚交的这一份
            （按钮随即变成禁用的「已提交」），再顺手把服务端那一份拉回来核一次。 */
         /* 整条换掉，不是在旧的那条上改几个字段：刚交上去的这一份**还没被批**，
            而旧的那条带着 graded / teacherScore / teacherComment。留着它们，界面会在
            服务端那一份回来之前的一瞬间说「已批改 72 分」——说的是上一份的事。 */
         mySubmissions[task] = {
            taskId: task,
            answerContent: source,
            submittedAt: Date.now(),
            graded: false,
            teacherScore: null,
            teacherComment: null
         };
         renderSubmitState();
         renderSwitch();
         void loadSubmissions();
      } catch (error) {
         println("提交失败：" + ((error && error.message) || "请稍后再试"), "err");
      } finally { $("ctSubmit").disabled = false; }
   }

   /* ---------------- 提交状态 ---------------- */

   /* 切换条那一格上的字。只有这一份——按钮那边和切换条那边各写一份，迟早说出两句
      互相矛盾的话。 */
   var STATE_LABEL = { empty: "未交", todo: "未交", dirty: "已改", sent: "已交", graded: "已批" };

   /**
    * 眼前这份代码和某道题上次交上去的那一份是不是**一模一样**。
    *
    * 逐字节比，不做任何归一化（不去尾空格、不吃末尾空行）。因为界面上要说出口的
    * 那句话是「和你上次交的一样」——一旦归一化，存在服务端的那一份和屏幕上这一份
    * 就可能真的不同，而我们却在说它们一样。宁可把一个空格也算成改动：那至少是真的。
    */
   function submittedSourceOf(task) {
      var sub = mySubmissions[task];
      return sub && typeof sub.answerContent === "string" ? sub.answerContent : null;
   }

   function draftOf(task) {
      if (task === itemId) return $("ctCode").value;
      var draft = STORAGE.get(draftKey(task), null);
      return typeof draft === "string" ? draft : "";
   }

   /**
    * 一道题此刻处于四种状态之一。切换条和提交按钮用的是同一份判定——
    * 两处各算一遍迟早会说出两句互相矛盾的话。
    *   empty   还没写
    *   todo    写了，没交过
    *   dirty   交过，但现在这份和交上去的不一样
    *   sent    交过，而且一个字都没改
    *   graded  老师已经批了（且没再改过）
    */
   function stateOf(task) {
      var submitted = submittedSourceOf(task);
      var current = draftOf(task);
      var sub = mySubmissions[task];
      if (submitted === null) return current.trim() ? "todo" : "empty";
      if (current !== submitted) return "dirty";
      return sub && sub.graded ? "graded" : "sent";
   }

   /**
    * 提交按钮和它旁边那个三字槽位。
    *
    * 内容和上次交的一模一样时按钮**禁掉**：再交一遍不会多出任何东西，只会在老师
    * 那边堆一条内容相同的记录。完整的一句话放在 data-tip 里——这一行放不下整句，
    * 而三个字说不清「为什么不能点」。
    */
   function renderSubmitState() {
      var state = stateOf(itemId);
      var button = $("ctSubmit");
      var slot = $("ctSubmitState");
      var text = { empty: "", todo: "未提交", dirty: "有改动", sent: "已交过", graded: "已批改" }[state];
      slot.textContent = text;
      slot.dataset.state = state;
      button.textContent = state === "dirty" ? "重新提交" : state === "sent" || state === "graded" ? "已提交" : "提交";
      /*
       * 用 aria-disabled 而不是原生 disabled。原生 disabled 的按钮不派发鼠标事件，
       * 于是 data-tip 永远弹不出来——而这里最该读到的恰恰是「为什么不能点」那一句。
       * 点击由 submit() 自己挡（它会把原因打到运行结果里），所以按下去不是没反应。
       */
      button.setAttribute("aria-disabled", String(state === "empty" || state === "sent" || state === "graded"));
      button.dataset.tip =
         state === "empty" ? "先写点东西再提交"
         : state === "dirty" ? "改过了。交上去会在老师那里留下新的一份"
         : state === "todo" ? "交给老师。之后还能改，改完再交一次"
         : "这一份和你上次交的一模一样，不用再交一遍";

      /* 切换条上当前这一题的那一格也要跟着走。不整条重画（那是每敲一个字重建一次
         innerHTML），只改这一格的字和状态——否则按钮说「有改动」、切换条还说「已交」，
         同一屏上两句话互相打架。 */
      var chip = $("ctSwitch").querySelector('[data-task="' + (window.CSS && CSS.escape ? CSS.escape(itemId) : itemId) + '"] .ct-switch-state');
      if (chip) {
         chip.textContent = STATE_LABEL[state];
         chip.dataset.state = state;
      }
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
         /* 和提交按钮用同一份判定（stateOf）：两处各算一遍，迟早会说出两句
            互相矛盾的话。「已改」是这里新增的一格——学生一眼就看出哪道题
            改过还没交，不用挨个点进去试。 */
         var state = stateOf(entry.id);
         var label = STATE_LABEL[state];
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
      renderSubmitState();
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
         renderSubmitState();
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
      var dueText = assignment.dueAt
         ? (assignment.dueAt < Date.now() ? "已过截止，现在提交算迟交" : "截止 " + new Date(assignment.dueAt).toLocaleString())
         : "不限时间";
      /* 截止信息只在这里出现，窄屏顶栏又放不下：两处写同一份，CSS 按宽度只显示一处。 */
      $("ctDue").textContent = dueText;
      $("ctDueInline").textContent = dueText;

      /* 行号、着色、三空格缩进、`<-` 转 `←` 一次装好——和课程题目同一份实现。 */
      editor = CODE.attach($("ctCode"), { gutter: $("ctGutter"), highlight: document.querySelector(".mini-code .mini-highlight") });
      $("ctCode").addEventListener("input", function () {
         scheduleSave();
         // 改一个字就可能从「已交过」变成「有改动」，这一句必须跟着每一次输入走
         renderSubmitState();
      });

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
