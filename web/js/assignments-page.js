/* 学生的作业页。
 *
 * 作业原来只出现在账户浮层里：入口隐蔽、只有分数没有评语，而且点进去之后
 * 和普通课程练习长得一样，分不清哪些是老师布置的。这一页把这三件事一次解决。
 *
 * 只读服务端数据，不碰本地工作副本，也不启动同步——同步由学习页和编辑器负责。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;
   var course = (window.CAIETeaching && window.CAIETeaching.course) || { chapters: [] };

   function esc(value) {
      return String(value == null ? "" : value)
         .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
   }

   function when(timestamp) {
      if (!timestamp) return "";
      var date = new Date(timestamp);
      var pad = function (n) { return String(n).padStart(2, "0"); };
      return (date.getMonth() + 1) + "月" + date.getDate() + "日 " + pad(date.getHours()) + ":" + pad(date.getMinutes());
   }

   /** 题号 → 它在课程里的位置和标题，用来拼做题页的链接并显示题名。 */
   function locate(taskId) {
      for (var c = 0; c < course.chapters.length; c += 1) {
         var chapter = course.chapters[c];
         for (var i = 0; i < chapter.sections.length; i += 1) {
            var section = chapter.sections[i];
            var hit = (section.blocks || []).filter(function (block) {
               return block.kind === "task" && block.id === taskId;
            })[0];
            if (hit) return { chapterId: chapter.id, stepId: section.id, title: hit.title };
         }
         var big = chapter.chapterTasks.filter(function (task) { return task.id === taskId; })[0];
         if (big) return { chapterId: chapter.id, stepId: "chapterTask", title: big.title };
      }
      return null;
   }

   function gate(title, body, actions) {
      $("hwGate").hidden = false;
      $("hwList").hidden = true;
      $("gateTitle").textContent = title;
      $("gateBody").textContent = body;
      $("gateActions").innerHTML = (actions || []).map(function (action) {
         return '<a class="btn ' + (action.primary ? "btn-primary" : "btn-ghost") + ' fixed-btn wide" href="' +
            esc(action.href) + '">' + esc(action.label) + "</a>";
      }).join("");
   }

   function render(assignments, submissions) {
      $("hwGate").hidden = true;
      $("hwList").hidden = false;
      if (!assignments.length) {
         $("hwList").innerHTML =
            '<div class="hw-gate"><h1>还没有作业</h1><p class="muted">老师布置之后会出现在这里。</p></div>';
         $("assignmentSummary").textContent = "";
         $("statusLine").textContent = "没有作业";
         return;
      }

      var now = Date.now();
      var totalTasks = 0;
      var doneTasks = 0;

      $("hwList").innerHTML = assignments.map(function (item) {
         var mine = submissions[item.id] || {};
         var overdue = item.dueAt && item.dueAt < now;
         var tasks = item.items || [];
         var finished = tasks.filter(function (entry) { return mine[entry.id]; }).length;
         totalTasks += tasks.length;
         doneTasks += finished;

         var rows = tasks.map(function (entry) {
            // 条目可能是课程题目，也可能是老师自己写的纯文本题
            var custom = entry.kind === "custom";
            var taskId = entry.id;
            var found = custom ? { title: entry.title } : locate(taskId);
            var sub = mine[taskId];
            var state = !sub ? "todo" : sub.graded ? "graded" : "done";
            var label = !sub ? "未交"
               : sub.graded ? (sub.teacherScore === null ? "老师已阅" : "老师给了 " + sub.teacherScore + " 分")
               : "已交，等老师批";
            // 课程题带上来源，做题页的返回才会回到作业而不是课文
            var link = custom
               ? "custom-task.html?a=" + encodeURIComponent(item.id) + "&i=" + encodeURIComponent(taskId)
               : found ? "task.html?c=" + found.chapterId + "&s=" + encodeURIComponent(found.stepId) +
                 "&t=" + encodeURIComponent(taskId) + "&from=assignments"
               : null;
            /* 评语单独占一行，不挤在状态旁边——它是学生最该读到的东西。 */
            var comment = sub && sub.teacherComment
               ? '<div class="hw-comment"><span class="hw-comment-from">老师评语</span>' + esc(sub.teacherComment) + "</div>"
               : "";
            /* 学生得看得到自己到底交了什么——否则「已交」只是一句空话，
               也没法对照老师的评语看是哪儿写错了。 */
            var answer = sub && sub.answerContent
               ? '<details class="hw-answer"><summary>我交的代码（' + when(sub.submittedAt) + "）</summary>" +
                 '<pre class="hw-answer-code mono"></pre></details>'
               : "";
            return '<div class="hw-task">' +
               '<span class="hw-task-id">' + esc(custom ? "自出题" : taskId) + "</span>" +
               '<span class="hw-task-name">' + esc(found ? found.title : "（这道题当前课程里找不到）") + "</span>" +
               '<span class="hw-task-actions">' +
               '<span class="hw-state" data-state="' + state + '">' + esc(label) + "</span>" +
               (link ? '<a class="btn btn-ghost small fixed-btn" href="' + esc(link) + '">' + (sub ? "再做一次" : "去做题") + "</a>" : "") +
               "</span></div>" + answer + comment;
         }).join("");

         return '<section class="hw-card">' +
            '<div class="hw-head"><span class="hw-title">' + esc(item.title) + "</span>" +
            '<span class="hw-due" data-late="' + Boolean(overdue) + '">' +
            (item.dueAt ? (overdue ? "已过截止 · " : "截止 ") + when(item.dueAt) : "不限时间") + "</span></div>" +
            '<div class="hw-progress">共 ' + tasks.length + " 道，已交 " + finished + " 道" +
            (overdue ? "　现在提交算迟交，但仍然可以交" : "") + "</div>" +
            rows + "</section>";
      }).join("");

      /* 代码用 textContent 填，不走 innerHTML：学生写的是代码，里面的尖括号
         和引号必须原样显示，也绝不能当成标记解析。 */
      var codeBlocks = document.querySelectorAll(".hw-answer-code");
      var index = 0;
      assignments.forEach(function (item) {
         var mine = submissions[item.id] || {};
         (item.items || []).forEach(function (entry) {
            var sub = mine[entry.id];
            if (!sub || !sub.answerContent) return;
            if (codeBlocks[index]) codeBlocks[index].textContent = sub.answerContent;
            index += 1;
         });
      });

      $("assignmentSummary").textContent = assignments.length + " 份";
      $("statusLine").textContent = "共 " + totalTasks + " 道题，已交 " + doneTasks + " 道";
   }

   async function boot() {
      if (!CLIENT.available()) {
         gate("云端功能暂未连接", "作业需要连接云端才能查看。编辑器、课程和做题都不受影响。",
            [{ label: "去学习", primary: true, href: "learn.html" }]);
         return;
      }
      await CLIENT.restore();
      if (!AUTH.isSignedIn()) {
         gate("请先登录", "作业是老师布置给你的，登录之后才能看到。",
            [{ label: "去登录", primary: true, href: "login.html?next=assignments.html" }]);
         return;
      }
      if (AUTH.user().role !== "student") {
         gate("这一页是给学生的", "当前登录的是" + AUTH.roleLabel() + "。老师在班级面板里布置和批改作业。",
            [{ label: "班级面板", primary: true, href: "classes.html" }]);
         return;
      }

      var assignments = await CLIENT.assignments(true);
      var submissions = {};
      // 每份作业取自己的提交，按题号只留最近一次（服务端已按时间倒序）
      await Promise.all(assignments.map(async function (item) {
         try {
            var data = await CLIENT.request("/api/assignments/" + encodeURIComponent(item.id) + "/submissions");
            var byTask = {};
            (data.submissions || []).forEach(function (row) { if (!byTask[row.taskId]) byTask[row.taskId] = row; });
            submissions[item.id] = byTask;
         } catch (error) { submissions[item.id] = {}; }
      }));
      render(assignments, submissions);
   }

   if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { void boot(); });
   else void boot();
})();
