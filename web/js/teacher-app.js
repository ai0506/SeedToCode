/* 老师面板：班级、学生、教学进度、章末大题提交。
 *
 * 这一页完全靠服务端接口，没有本地工作副本，所以和编辑器/教学页不一样：
 * 云端不可用时它没有可退的本地状态，只会落到一条说明上——但它也绝不会
 * 影响别的页面，编辑、学习、做题和本地运行都在各自的页面里照常工作。
 *
 * 权限不靠前端隐藏按钮：每个接口在服务端都会再校验一次归属，
 * 这里只是不去画老师看不到的东西。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;
   var course = (window.CAIETeaching && window.CAIETeaching.course) || { chapters: [] };
   /* 迟交判定和提交汇总在 packages/assignment 里（js/assignment-core.js 打成全局），
      那边有测试；这里不留副本，副本会和被测的那一份悄悄分叉。 */
   var CORE = window.CAIEAssignment;

   var classes = [];
   var currentClassId = null;
   var students = [];
   var progressRows = [];
   var submissions = [];
   var taskFilter = "";
   var submissionScope = "latest";
   var loading = false;
   var assignments = [];
   var openAssignmentId = null;      // 展开查看提交的那一份作业
   var assignmentSubmissions = [];
   /* 和服务端 MAX_CLASSES_PER_TEACHER 对齐。前端只负责提前把按钮灰掉并说明原因，
      真正的拦截在服务端——前端隐藏按钮从来不算限制。 */
   var MAX_CLASSES = 5;

   /* 布置作业在 assign.html，回来时要落回原处：哪个班、哪个标签、展开的是哪份作业。
      只在首次载入时用一次，之后页内切换以实际操作为准。 */
   var entry = (function () {
      var query = new URLSearchParams(window.location.search);
      return {
         classId: query.get("class") || "",
         tab: query.get("tab") || "",
         assignmentId: query.get("a") || ""
      };
   })();

   /* ---------------- 文本 ---------------- */

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

   /** 章内的推进步骤，和教学页一致：小节依次，章末大题在最后。 */
   function stepsOf(chapter) {
      return chapter.sections.map(function (section) { return section.id; })
         .concat(chapter.chapterTasks.length ? ["chapterTask"] : []);
   }

   var chapterTasks = (function () {
      var out = [];
      course.chapters.forEach(function (chapter) {
         chapter.chapterTasks.forEach(function (task) {
            out.push({ id: task.id, chapterId: chapter.id, label: "第 " + chapter.id + " 章 · " + task.id });
         });
      });
      return out;
   })();

   /* ---------------- 提示与对话框（不使用浏览器原生交互界面） ---------------- */

   var toastTimer = null;
   /** 带撤销按钮时停留久一些，和编辑器删代码文件那一条是同一个节奏。 */
   function toast(message, actionLabel, action) {
      var box = $("toast");
      var button = $("toastAction");
      $("toastText").textContent = message;
      button.hidden = !actionLabel;
      button.textContent = actionLabel || "";
      button.onclick = actionLabel ? function () { box.hidden = true; action(); } : null;
      box.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { box.hidden = true; }, actionLabel ? 6000 : 2600);
   }

   var dialogResolve = null;

   function showDialog(id) { $("overlay").hidden = false; $(id).hidden = false; }

   function closeDialogs() {
      $("overlay").hidden = true;
      Array.prototype.forEach.call(document.querySelectorAll(".dialog"), function (node) { node.hidden = true; });
      if (dialogResolve) {
         var done = dialogResolve;
         dialogResolve = null;
         done(null);
      }
   }

   function askConfirm(options) {
      return new Promise(function (resolve) {
         dialogResolve = resolve;
         $("confirmTitle").textContent = options.title || "确认";
         $("confirmBody").textContent = options.body || "";
         $("confirmOk").textContent = options.okLabel || "确定";
         showDialog("confirmDialog");
      });
   }

   /** 激活码只在这一刻出现一次，之后服务端只存哈希，谁也读不回来。 */
   function showActivationCode(title, description, code) {
      $("codeTitle").textContent = title;
      $("codeDesc").textContent = description;
      $("codeValue").value = code;
      $("codeHint").textContent = "";
      showDialog("codeDialog");
      $("codeValue").focus();
      $("codeValue").select();
   }

   /* ---------------- 门禁 ---------------- */

   /* 门禁原来只有一段文字，一个出口都没有：走错的人只能自己想办法离开。
      现在按当前身份给下一步。 */
   function gate(title, body, actions) {
      $("teacherGate").hidden = false;
      $("teacherPanels").hidden = true;
      $("gateTitle").textContent = title;
      $("gateBody").textContent = body;
      $("gateActions").innerHTML = (actions || []).map(function (action) {
         return '<a class="btn ' + (action.primary ? "btn-primary" : "btn-ghost") + ' fixed-btn wide" href="' +
            esc(action.href) + '">' + esc(action.label) + "</a>";
      }).join("");
      $("classList").innerHTML = "";
      $("newClassBtn").disabled = true;
      $("refreshBtn").disabled = true;
   }

   function ungate() {
      $("teacherGate").hidden = true;
      $("teacherPanels").hidden = false;
      $("newClassBtn").disabled = false;
      $("refreshBtn").disabled = false;
   }

   function checkAccess() {
      if (!CLIENT.available()) {
         gate("云端功能暂未连接", "这里暂时用不了账号功能，班级、学生和提交记录都读不出来。实验室、课程和本地运行不受影响。",
            [{ label: "去学习", primary: true, href: "learn.html" }, { label: "去实验室", href: "lab.html" }]);
         return false;
      }
      if (!AUTH.isSignedIn()) {
         gate("请先登录", "班级数据属于老师账号。以老师身份登录后，这里会显示你的班级。",
            [{ label: "去登录", primary: true, href: "login.html?next=classes.html" }]);
         return false;
      }
      if (AUTH.user().role !== "teacher") {
         var student = AUTH.user().role === "student";
         gate("这个页面是给老师的",
            "当前登录的是" + AUTH.roleLabel() + "。" +
            (student ? "你的作业在「作业」那一页，学习和做题在「学习」里。" : "学习和做题都在「学习」里。"),
            student
               ? [{ label: "去作业", primary: true, href: "assignments.html" }, { label: "去学习", href: "learn.html" }]
               : [{ label: "去学习", primary: true, href: "learn.html" }, { label: "去实验室", href: "lab.html" }]);
         return false;
      }
      ungate();
      return true;
   }

   /* ---------------- 取数 ---------------- */

   function setLoading(on, label) {
      loading = on;
      $("refreshState").textContent = on ? (label || "载入中…") : "";
      $("refreshBtn").disabled = on;
   }

   async function loadClasses() {
      var data = await CLIENT.request("/api/classes");
      classes = data.classes || [];
      // 从 assign.html 回来时带着班级 id，优先落在那个班上
      if (entry.classId && classes.some(function (item) { return item.id === entry.classId; })) {
         currentClassId = entry.classId;
         entry.classId = "";
      }
      if (!classes.length) currentClassId = null;
      else if (!classes.some(function (item) { return item.id === currentClassId; })) currentClassId = classes[0].id;
      renderClasses();
   }

   async function loadClassDetail() {
      if (!currentClassId) {
         students = []; progressRows = []; submissions = [];
         renderAll();
         return;
      }
      var id = encodeURIComponent(currentClassId);
      // 三份数据一起取：任何一份失败都不该让另外两份空着。
      var results = await Promise.allSettled([
         CLIENT.request("/api/classes/" + id + "/students"),
         CLIENT.request("/api/classes/" + id + "/progress"),
         CLIENT.request("/api/classes/" + id + "/practice-submissions" + (taskFilter ? "?taskId=" + encodeURIComponent(taskFilter) : "")),
         CLIENT.request("/api/classes/" + id + "/assignments")
      ]);
      // 取完之后班级可能已经被切走了，这一份就作废，不要盖掉新班级的数据。
      if (currentClassId !== decodeURIComponent(id)) return;
      students = results[0].status === "fulfilled" ? (results[0].value.students || []) : [];
      progressRows = results[1].status === "fulfilled" ? (results[1].value.progress || []) : [];
      submissions = results[2].status === "fulfilled" ? (results[2].value.submissions || []) : [];
      assignments = results[3].status === "fulfilled" ? (results[3].value.assignments || []) : [];
      // 从 assign.html 回来时带着作业 id，直接展开它的提交情况
      var wanted = "";
      if (entry.assignmentId && assignments.some(function (item) { return item.id === entry.assignmentId; })) {
         wanted = entry.assignmentId;
      }
      entry.assignmentId = "";
      // 换班级时不要还停在上一个班的某份作业详情里
      if (!assignments.some(function (item) { return item.id === openAssignmentId; })) {
         openAssignmentId = null;
         assignmentSubmissions = [];
      }
      var failed = results.filter(function (item) { return item.status === "rejected"; });
      if (failed.length) toast(describeError(failed[0].reason));
      renderAll();
      if (wanted) await openAssignment(wanted);
   }

   function describeError(error) {
      if (!error) return "读取失败，请稍后再试。";
      if (error.code === "OFFLINE") return "网络暂时不可用，请稍后再试。";
      if (error.code === "NOT_CONFIGURED") return "云端功能暂未连接。";
      if (error.code === "UNAUTHENTICATED") return "登录状态已失效，请重新登录。";
      return error.message || "读取失败，请稍后再试。";
   }

   async function refresh(label) {
      if (!checkAccess()) return;
      setLoading(true, label);
      try {
         await loadClasses();
         await loadClassDetail();
      } catch (error) {
         if (error && error.code === "UNAUTHENTICATED") { checkAccess(); return; }
         toast(describeError(error));
      } finally {
         setLoading(false);
      }
   }

   /* ---------------- 渲染 ---------------- */

   function currentClass() {
      return classes.filter(function (item) { return item.id === currentClassId; })[0] || null;
   }

   function renderClasses() {
      $("classList").innerHTML = classes.map(function (item) {
         return '<li data-class-id="' + esc(item.id) + '"' + (item.id === currentClassId ? ' class="active"' : "") + ">" +
            '<span class="fname" data-tip="' + esc(item.name) + '">' + esc(item.name) + "</span></li>";
      }).join("");
      var full = classes.length >= MAX_CLASSES;
      $("newClassBtn").disabled = full;
      $("newClassBtn").setAttribute("data-tip", full ? "最多 " + MAX_CLASSES + " 个班级" : "新建班级");
      var active = currentClass();
      renderJoinLock(active);
      $("classTitle").textContent = active ? active.name : "";
      $("classMeta").textContent = active && active.joinCode ? "班级码 " + active.joinCode : "";
      // 班级码现在有实际用途了：念给学生，他们自己注册就进班
      $("classMeta").setAttribute("data-tip", active && active.joinCode
         ? "把这个码念给学生，他们在登录页选「学生 → 有班级码」就能自己注册并加入本班"
         : "");
      $("statusClass").textContent = active ? active.name : "未选择班级";
   }

   /* 班级码流出去之后收不回来，这个开关是唯一的止血手段，所以状态要一眼看得出。 */
   function renderJoinLock(active) {
      var button = $("joinLockBtn");
      button.hidden = !active;
      if (!active) return;
      var locked = Boolean(active.joinLocked);
      button.setAttribute("aria-pressed", String(locked));
      $("joinLockText").textContent = locked ? "已锁定" : "可加入";
      button.setAttribute("data-tip", locked
         ? "已锁定：学生不能再用班级码注册进班。你自己创建学生不受影响，已经在班里的学生也不受影响。点一下重新开放。"
         : "可加入：知道班级码的人都能自己注册进这个班。码发出去收不回，发现不对就点一下锁上。");
   }

   function renderAll() {
      renderClasses();
      renderStudents();
      renderProgress();
      renderSubmissions();
      renderAssignments();
      $("badgeAssignments").textContent = assignments.length ? String(assignments.length) : "";
      $("badgeStudents").textContent = students.length ? String(students.length) : "";
      $("badgeSubmissions").textContent = submissions.length ? String(submissions.length) : "";
      $("statusCount").textContent = students.length ? students.length + " 名学生" : "";
   }

   function emptyBox(text) {
      return '<div class="teacher-empty">' + esc(text) + "</div>";
   }

   function renderStudents() {
      if (!currentClassId) { $("studentsBody").innerHTML = emptyBox("先在左边新建一个班级。"); return; }
      if (!students.length) { $("studentsBody").innerHTML = emptyBox("这个班还没有学生。点「添加学生」创建第一个账号。"); return; }
      $("studentsBody").innerHTML =
         '<table class="data-table"><thead><tr>' +
         "<th>姓名</th><th>用户名</th><th>账号状态</th><th></th>" +
         "</tr></thead><tbody>" +
         students.map(function (student) {
            var pending = student.accountStatus === "pending_activation";
            return "<tr>" +
               "<td>" + esc(student.displayName) + "</td>" +
               '<td class="mono">' + esc(student.username) + "</td>" +
               '<td><span class="state-chip" data-state="' + (pending ? "pending" : "active") + '">' +
               (pending ? "待激活" : "已激活") + "</span></td>" +
               '<td class="actions">' +
               '<button class="btn btn-ghost small fixed-btn" data-rename="' + esc(student.id) + '">改名</button>' +
               '<button class="btn btn-ghost small fixed-btn" data-reset="' + esc(student.id) + '">重置激活码</button></td>' +
               "</tr>";
         }).join("") +
         "</tbody></table>";
   }

   /**
    * 进度矩阵。服务端按 (学生 × 进度行) 返回扁平数据，这里按学生聚合，
    * 每一格是「这个学生在这一章完成了几步 / 这一章共几步」。
    * 章末大题算一步，和教学页的推进顺序一致。
    */
   function renderProgress() {
      if (!currentClassId) { $("progressBody").innerHTML = emptyBox("先在左边新建一个班级。"); return; }
      if (!students.length) { $("progressBody").innerHTML = emptyBox("这个班还没有学生。"); return; }

      var chapters = course.chapters;
      var totalSteps = chapters.reduce(function (sum, chapter) { return sum + stepsOf(chapter).length; }, 0);
      $("progressHint").textContent = "已发布 " + chapters.length + " 章，共 " + totalSteps + " 步";

      var byStudent = {};
      students.forEach(function (student) {
         byStudent[student.id] = { student: student, done: {}, updatedAt: 0 };
      });
      progressRows.forEach(function (row) {
         var entry = byStudent[row.studentId];
         if (!entry || !row.progress || !row.progress.completed) return;
         entry.done[row.progress.chapterId + "/" + row.progress.sectionId] = true;
         if (row.progress.updatedAt > entry.updatedAt) entry.updatedAt = row.progress.updatedAt;
      });

      var head = '<th class="who">学生</th><th class="total">完成</th>' +
         chapters.map(function (chapter) {
            return '<th data-tip="第 ' + chapter.id + " 章 · " + esc(chapter.title) + '">' + chapter.id + "</th>";
         }).join("") + "<th>最近活动</th>";

      var body = students.map(function (student) {
         var entry = byStudent[student.id];
         var studentTotal = 0;
         /* 每一小节一个方块，而不是只给一个 x/y：老师要看的是「哪一节卡住了」，
            汇总数字答不了这个问题。章末大题用一个星形方块收尾。 */
         var cells = chapters.map(function (chapter) {
            var steps = stepsOf(chapter);
            var done = 0;
            var squares = steps.map(function (step, index) {
               var complete = Boolean(entry.done[chapter.id + "/" + step]);
               if (complete) done += 1;
               var isTask = step === "chapterTask";
               var label = isTask ? "章末大题" : step;
               // 格子里写上节号（章末大题用 ★），不用再靠数第几个来对位置
               return '<span class="sec-box' + (isTask ? " star" : "") + '"' +
                  ' data-done="' + (complete ? "yes" : "no") + '"' +
                  ' data-tip="' + esc(label + (complete ? " · 已完成" : " · 未完成")) + '">' +
                  (isTask ? "★" : index + 1) + "</span>";
            }).join("");
            studentTotal += done;
            return '<td class="cell chapter-cell" data-done="' + (done === 0 ? "none" : done === steps.length ? "all" : "some") + '">' +
               '<span class="sec-row">' + squares + "</span></td>";
         }).join("");
         return "<tr>" +
            '<td class="who"><span class="who-name">' + esc(student.displayName) + '</span><span class="who-id">' + esc(student.username) + "</span></td>" +
            '<td class="total">' + studentTotal + "/" + totalSteps + "</td>" +
            cells +
            "<td>" + when(entry.updatedAt) + "</td>" +
            "</tr>";
      }).join("");

      $("progressBody").innerHTML =
         '<div class="matrix-wrap"><table class="matrix"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
   }

   function renderSubmissions() {
      if (!currentClassId) { $("submissionsBody").innerHTML = emptyBox("先在左边新建一个班级。"); return; }
      var rows = submissions.slice();
      if (submissionScope === "latest") {
         // 每人每题只留最近一次。服务端已按提交时间倒序，第一条就是最新的。
         var seen = {};
         rows = rows.filter(function (item) {
            var key = item.studentId + "/" + item.taskId;
            if (seen[key]) return false;
            seen[key] = true;
            return true;
         });
      }
      if (!rows.length) {
         $("submissionsBody").innerHTML = emptyBox(
            taskFilter ? "这个班还没有人提交过这道题。" : "这个班还没有章末大题提交。学生每按一次「提交」都会留下一条记录。"
         );
         return;
      }
      $("submissionsBody").innerHTML =
         '<table class="data-table"><thead><tr>' +
         "<th>学生</th><th>题号</th><th>结果</th><th>分数</th><th>提交时间</th><th></th>" +
         "</tr></thead><tbody>" +
         rows.map(function (item) {
            return "<tr>" +
               "<td>" + esc(item.displayName || item.username || "—") + "</td>" +
               '<td class="mono">' + esc(item.taskId) + "</td>" +
               '<td><span class="state-chip" data-state="' + (item.serverPassed ? "passed" : "failed") + '">' +
               (item.serverPassed ? "通过" : "未通过" + (item.failedLayer ? " · " + esc(item.failedLayer) : "")) + "</span></td>" +
               '<td class="num">' + item.serverScore + "</td>" +
               "<td>" + when(item.submittedAt) + "</td>" +
               '<td class="actions"><button class="btn btn-ghost small fixed-btn" data-answer="' + esc(item.id) + '">查看代码</button></td>' +
               "</tr>";
         }).join("") +
         "</tbody></table>";
   }

   /* ---------------- 作业 ---------------- */

   function dueLabel(dueAt) {
      if (!dueAt) return "不限时间";
      return "截止 " + when(dueAt);
   }

   /**
    * 迟交＝提交时间晚于当前截止时间。现算而不是提交时写死：
    * 老师改了截止时间，之前那些提交的迟交与否也应当跟着变。
    */
   var isLate = CORE.isLate;

   function renderAssignments() {
      $("backToAssignments").hidden = !openAssignmentId;
      $("editAssignmentBtn").hidden = !openAssignmentId;
      $("deleteAssignmentBtn").hidden = !openAssignmentId;
      $("newAssignmentBtn").hidden = Boolean(openAssignmentId);
      if (openAssignmentId && currentClassId) { renderAssignmentDetail(); return; }
      /* 详情是左右两栏、各自滚动的，列表是一条一条往下排——两种模式对容器的
         要求不一样，退回列表时要把容器恢复成普通的纵向滚动。 */
      $("assignmentsScroll").dataset.mode = "list";
      $("assignmentsBody").dataset.activeCol = "";
      if (!currentClassId) {
         $("assignmentSubTitle").textContent = "班级作业";
         $("assignmentsBody").innerHTML = emptyBox("先在左边新建一个班级。");
         return;
      }
      $("assignmentSubTitle").textContent = "班级作业";
      if (!assignments.length) {
         $("assignmentsBody").innerHTML = emptyBox("这个班还没有作业。点「布置作业」自己写题发给全班。");
         return;
      }
      var now = Date.now();
      $("assignmentsBody").innerHTML = '<ul class="assign-list">' + assignments.map(function (item) {
         var overdue = item.dueAt && item.dueAt < now;
         return '<li data-assignment-id="' + esc(item.id) + '">' +
            '<span class="assign-title">' + esc(item.title) + "</span>" +
            /* 原来这里逐条列 `自出题 自出题`，一个字的信息都没有。题名在详情里看，
               列表上只需要知道有几道。 */
            '<span class="assign-tasks">' + (item.items || []).length + " 道题</span>" +
            '<span class="assign-meta assign-due" data-state="' + (overdue ? "over" : "") + '">' + esc(dueLabel(item.dueAt)) + "</span>" +
            "</li>";
      }).join("") + "</ul>";
   }

   /**
    * 一份作业的详情。左右两栏，吃满屏幕的横向空间：
    *
    * 左边是这份作业**本身**——每道题的题面和提示原文。在这之前老师根本没有
    * 地方看自己出的是什么题：列表行上只显示「自出题 自出题」，想看题面只能点
    * 「编辑」进出题页，那是编辑态，看一眼就有误改的风险。批改时要对照题面看
    * 学生写得对不对，这一栏就是为那件事在的。
    *
    * 右边是提交矩阵：学生 × 题目，每人每题只看最近一次（服务端已按时间倒序，
    * 第一条就是最新的），没交的也列出来——老师最关心的往往正是那一格。
    * 题目一多，光有格子数不出「哪道题最多人没交」，所以行尾和表尾各加一道汇总。
    *
    * 点左边某道题，右边对应那一列高亮：题目多到要横向滚时，这是唯一能把
    * 「这道题」和「它那一列」对上的办法。
    */
   function renderAssignmentDetail() {
      var assignment = assignments.filter(function (item) { return item.id === openAssignmentId; })[0];
      if (!assignment) { openAssignmentId = null; renderAssignments(); return; }
      $("assignmentSubTitle").textContent = assignment.title + " · " + dueLabel(assignment.dueAt);

      var latest = {};
      assignmentSubmissions.forEach(function (item) {
         var key = item.studentId + "/" + item.taskId;
         if (!latest[key]) latest[key] = item;
      });
      var tasks = assignment.items || [];
      // 每道题交了几个人 / 每个学生交了几道，左栏、行尾和表尾都要用
      var counts = CORE.tally(
         students.map(function (student) { return student.id; }),
         tasks.map(function (entry) { return entry.id; }),
         function (studentId, taskId) { return Boolean(latest[studentId + "/" + taskId]); }
      );
      var perTask = counts.perTask;

      $("assignmentsScroll").dataset.mode = "detail";
      $("assignmentsBody").innerHTML =
         '<div class="assign-detail">' +
         assignmentAside(assignment, tasks, perTask, counts) +
         '<div class="ad-main">' + assignmentMatrix(assignment, tasks, counts, latest) + "</div>" +
         "</div>";
   }

   function taskLabel(entry) {
      return entry.kind === "custom" ? (entry.title || "自出题") : entry.id;
   }

   /** 左栏：这份作业出了什么题。题面和提示按原文显示，换行照旧。 */
   function assignmentAside(assignment, tasks, perTask, counts) {
      var overdue = assignment.dueAt && assignment.dueAt < Date.now();

      var head =
         '<div class="ad-meta">' +
         '<div class="ad-due" data-state="' + (overdue ? "over" : "") + '">' + esc(dueLabel(assignment.dueAt)) +
         (overdue ? "（现在提交算迟交，但仍然可以交）" : "") + "</div>" +
         '<div class="ad-stat">' + tasks.length + " 道题 · " + students.length + " 名学生 · 已交 " +
         counts.submitted + "/" + counts.total + " 份</div></div>";

      if (!tasks.length) return '<aside class="ad-side">' + head + emptyBox("这份作业里没有题目。") + "</aside>";

      var list = tasks.map(function (entry, index) {
         var custom = entry.kind === "custom";
         /* 题面和提示都是老师自己敲的文字，一律 textContent 语义（这里先转义再放进
            innerHTML），换行交给 CSS 的 pre-wrap——绝不能当标记解析。 */
         var prompt = custom
            ? '<div class="ad-task-prompt">' + esc(entry.prompt || "") + "</div>"
            : '<div class="ad-task-prompt muted">这是课程里的题目（旧数据），题面在课程里。</div>';
         var guidance = custom && entry.guidance
            ? '<div class="ad-task-guidance"><span class="ad-g-head">提示</span>' + esc(entry.guidance) + "</div>"
            : "";
         return '<article class="ad-task" data-col="' + index + '" tabindex="0" role="button" ' +
            'aria-label="第 ' + (index + 1) + ' 题 ' + esc(taskLabel(entry)) + '，点一下高亮右边对应的那一列">' +
            '<div class="ad-task-head">' +
            '<span class="ad-task-no">第 ' + (index + 1) + " 题</span>" +
            '<span class="ad-task-name">' + esc(taskLabel(entry)) + "</span>" +
            '<span class="ad-task-count">' + perTask[index] + "/" + students.length + "</span>" +
            "</div>" + prompt + guidance + "</article>";
      }).join("");

      return '<aside class="ad-side">' + head + '<div class="ad-task-list">' + list + "</div></aside>";
   }

   /** 右栏：学生 × 题目。行尾一列「这个学生交了几道」，表尾一行「这道题交了几个人」。 */
   function assignmentMatrix(assignment, tasks, counts, latest) {
      if (!students.length) return emptyBox("这个班还没有学生。");
      if (!tasks.length) return emptyBox("这份作业里没有题目。");

      var head = '<th class="who">学生</th>' +
         tasks.map(function (entry, index) {
            var label = taskLabel(entry);
            /* 列头两行定高：上行是题号（滚到哪一列都还知道是第几题），
               下行是题名，超出省略号，完整题名交给悬浮提示。 */
            return '<th class="task-col" data-col="' + index + '" data-tip="' + esc(label) + '">' +
               '<span class="tc-no">第 ' + (index + 1) + " 题</span>" +
               '<span class="tc-name">' + esc(label) + "</span></th>";
         }).join("") +
         '<th class="done-col">已交</th><th class="when-col">最近提交</th>';

      var body = students.map(function (student, studentIndex) {
         var newest = 0;
         var done = counts.perStudent[studentIndex];
         var cells = tasks.map(function (entry, index) {
            var item = latest[student.id + "/" + entry.id];
            if (!item) return '<td class="cell" data-col="' + index + '">未交</td>';
            if (item.submittedAt > newest) newest = item.submittedAt;
            // 迟交只是标出来，不改变判分，也从来没有拦过提交。
            var late = isLate(assignment, item);
            /*
             * 只显示老师给的分。自动判分不再出现在这里——学生可以无限重传，
             * 做题页又会指出哪个用例没过，肯掉头改的人必然迭代到满分，
             * 所以那个数字只区分「做完了」和「放弃了」，摆成分数反而先入为主。
             * 代码跑通与否降级成一个小圆点，不占分数的位置。
             */
            var mark = item.graded
               ? '<span class="score-chip" data-graded="true">' + (item.teacherScore === null ? "已阅" : item.teacherScore) + "</span>"
               : '<span class="score-chip" data-graded="false">待批</span>';
            var runDot = '<span class="run-dot" data-ok="' + (item.serverPassed ? "yes" : "no") + '"' +
               ' data-tip="' + (item.serverPassed ? "代码跑通了全部用例" : "有用例没跑通") + '（仅供参考，不是成绩）"></span>';
            return '<td class="cell" data-col="' + index + '"><button class="btn btn-ghost small fixed-btn" data-assignment-answer="' + esc(item.id) + '">' +
               mark + runDot + (late ? '<span class="state-chip late-chip" data-state="late">迟交</span>' : "") +
               "</button></td>";
         }).join("");
         return "<tr>" +
            '<td class="who"><span class="who-name">' + esc(student.displayName) + '</span><span class="who-id">' + esc(student.username) + "</span></td>" +
            cells +
            '<td class="done-col total" data-full="' + (done === tasks.length ? "yes" : "no") + '">' + done + "/" + tasks.length + "</td>" +
            '<td class="when-col">' + when(newest) + "</td></tr>";
      }).join("");

      var foot = '<tr><td class="who">每题已交</td>' +
         counts.perTask.map(function (count, index) {
            return '<td class="cell total" data-col="' + index + '" data-full="' + (count === students.length ? "yes" : "no") + '">' +
               count + "/" + students.length + "</td>";
         }).join("") +
         '<td class="done-col total">' + counts.submitted + "/" + counts.total + "</td>" +
         '<td class="when-col"></td></tr>';

      return '<div class="matrix-wrap"><table class="matrix assign-matrix"><thead><tr>' + head +
         "</tr></thead><tbody>" + body + "</tbody><tfoot>" + foot + "</tfoot></table></div>";
   }

   /** 左边点了哪道题，右边那一列就亮起来。只改底色，不动任何几何。 */
   function highlightColumn(index) {
      var body = $("assignmentsBody");
      var next = String(index);
      var already = body.dataset.activeCol === next;
      body.dataset.activeCol = already ? "" : next;
      Array.prototype.forEach.call(body.querySelectorAll("[data-col]"), function (node) {
         node.dataset.active = !already && node.dataset.col === next ? "yes" : "no";
      });
   }

   async function openAssignment(assignmentId) {
      openAssignmentId = assignmentId;
      assignmentSubmissions = [];
      renderAssignments();
      setLoading(true, "载入中…");
      try {
         var data = await CLIENT.request(
            "/api/classes/" + encodeURIComponent(currentClassId) + "/assignments/" + encodeURIComponent(assignmentId) + "/submissions"
         );
         if (openAssignmentId !== assignmentId) return; // 已经切走了
         assignmentSubmissions = data.submissions || [];
         renderAssignments();
      } catch (error) {
         toast(describeError(error));
      } finally { setLoading(false); }
   }

   async function toggleJoinLock() {
      var active = currentClass();
      if (!active) return;
      var next = !active.joinLocked;
      try {
         var data = await CLIENT.request("/api/classes/" + encodeURIComponent(active.id) + "/join-lock", {
            method: "PUT",
            body: { locked: next }
         });
         // 就地更新这一个班，不整页刷新——开关要跟手
         active.joinLocked = data.class.joinLocked;
         renderJoinLock(active);
         toast(next ? "已锁定，学生不能再用班级码进班。" : "已开放，学生可以用班级码进班。");
      } catch (error) { toast(describeError(error)); }
   }

   async function removeAssignment() {
      var assignment = assignments.filter(function (item) { return item.id === openAssignmentId; })[0];
      if (!assignment) return;
      var submitted = assignmentSubmissions.length;
      var ok = await askConfirm({
         title: "删除作业",
         body: "确定删除「" + assignment.title + "」？学生将不再看到它，也不能再提交。" +
            (submitted ? "已经交上来的 " + submitted + " 条记录会保留。" : "") +
            "删除后可在提示中撤销。",
         okLabel: "删除"
      });
      if (!ok) return;
      var classId = currentClassId;
      var assignmentId = assignment.id;
      try {
         await CLIENT.request(
            "/api/classes/" + encodeURIComponent(classId) + "/assignments/" + encodeURIComponent(assignmentId),
            { method: "DELETE" }
         );
         openAssignmentId = null;
         assignmentSubmissions = [];
         await refresh("删除中…");
         /*
          * 删除本来就是 tombstone，所以撤销是真的把它恢复回来，
          * 而不是「先不删、等提示消失再删」——后者在这几秒里关掉页面就永远删不掉了。
          */
         toast("已删除作业 " + assignment.title, "撤销", function () {
            void restoreAssignment(classId, assignmentId, assignment.title);
         });
      } catch (error) { toast(describeError(error)); }
   }

   async function restoreAssignment(classId, assignmentId, title) {
      try {
         await CLIENT.request(
            "/api/classes/" + encodeURIComponent(classId) + "/assignments/" + encodeURIComponent(assignmentId) + "/restore",
            { method: "POST" }
         );
         // 撤销期间可能已经切到别的班，别把那个班的数据刷成这个班的
         if (currentClassId === classId) await refresh("恢复中…");
         toast("已恢复作业 " + title);
      } catch (error) { toast(describeError(error)); }
   }

   function renderTaskFilter() {
      $("taskFilter").innerHTML = '<option value="">全部题号</option>' +
         chapterTasks.map(function (task) {
            return '<option value="' + esc(task.id) + '"' + (task.id === taskFilter ? " selected" : "") + ">" + esc(task.label) + "</option>";
         }).join("");
   }

   /* ---------------- 动作 ---------------- */

   function openClassDialog() {
      if (classes.length >= MAX_CLASSES) { toast("最多只能创建 " + MAX_CLASSES + " 个班级。"); return; }
      $("classNameInput").value = "";
      $("classDialogError").textContent = "";
      showDialog("classDialog");
      $("classNameInput").focus();
   }

   async function createClass() {
      var name = $("classNameInput").value.trim();
      if (!name) { $("classDialogError").textContent = "请输入班级名称。"; return; }
      try {
         var data = await CLIENT.request("/api/classes", { method: "POST", body: { name: name } });
         closeDialogs();
         currentClassId = data.class.id;
         await refresh("新建中…");
         toast("班级「" + data.class.name + "」已创建，班级码 " + data.class.joinCode);
      } catch (error) { $("classDialogError").textContent = describeError(error); }
   }

   var renamingStudentId = null;   // 非空表示这个弹窗在改姓名，而不是加新学生

   function openStudentDialog(student) {
      if (!currentClassId) { toast("先选择一个班级。"); return; }
      renamingStudentId = student ? student.id : null;
      // 用户名不能改，改姓名时连同它的说明一起隐藏，免得让人以为能动
      $("studentUsernameField").hidden = Boolean(student);
      $("studentDialogTitle").textContent = student ? "修改姓名" : "添加学生";
      $("studentDialogOk").textContent = student ? "保存" : "添加";
      $("studentUsernameInput").value = "";
      $("studentNameInput").value = student ? student.displayName : "";
      $("studentDialogError").textContent = "";
      showDialog("studentDialog");
      (student ? $("studentNameInput") : $("studentUsernameInput")).focus();
   }

   async function submitStudentDialog() {
      var displayName = $("studentNameInput").value.trim();
      if (!displayName) { $("studentDialogError").textContent = "请输入姓名。"; return; }
      if (renamingStudentId) {
         try {
            await CLIENT.request(
               "/api/classes/" + encodeURIComponent(currentClassId) + "/students/" + encodeURIComponent(renamingStudentId),
               { method: "PUT", body: { displayName: displayName } }
            );
            closeDialogs();
            await refresh("保存中…");
            toast("姓名已改为 " + displayName);
         } catch (error) { $("studentDialogError").textContent = describeError(error); }
         return;
      }
      var username = $("studentUsernameInput").value.trim();
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{2,31}$/.test(username)) {
         $("studentDialogError").textContent = "用户名需为 3–32 位字母、数字或 . _ - ，且以字母或数字开头。";
         return;
      }
      try {
         var data = await CLIENT.request("/api/classes/" + encodeURIComponent(currentClassId) + "/students", {
            method: "POST",
            body: { username: username, displayName: displayName }
         });
         closeDialogs();
         await refresh("创建中…");
         showActivationCode(
            "学生已创建",
            "把用户名「" + data.student.username + "」和下面这个激活码交给学生。激活码只显示这一次，" +
            "学生首次登录时用它设置自己的密码；忘了可以随时重置，但旧的会立刻失效。",
            data.activationCode
         );
      } catch (error) { $("studentDialogError").textContent = describeError(error); }
   }

   async function resetActivation(studentId) {
      var student = students.filter(function (item) { return item.id === studentId; })[0];
      if (!student) return;
      var ok = await askConfirm({
         title: "重置激活码",
         body: "「" + student.displayName + "」当前的登录会话、密码和旧激活码都会立刻失效，需要用新激活码重新设置密码。",
         okLabel: "重置"
      });
      if (!ok) return;
      try {
         var data = await CLIENT.request(
            "/api/classes/" + encodeURIComponent(currentClassId) + "/students/" + encodeURIComponent(studentId) + "/reset-activation",
            { method: "POST" }
         );
         await refresh("重置中…");
         showActivationCode(
            "新的激活码",
            "把它交给「" + student.displayName + "」。只显示这一次，旧的密码和激活码已经失效。",
            data.activationCode
         );
      } catch (error) { toast(describeError(error)); }
   }

   function openAnswer(submissionId) {
      var item = submissions.filter(function (row) { return row.id === submissionId; })[0]
         || assignmentSubmissions.filter(function (row) { return row.id === submissionId; })[0];
      if (!item) return;
      var parentAssignment = assignments.filter(function (row) { return row.id === openAssignmentId; })[0];
      var lateMark = isLate(parentAssignment, item) ? " · 迟交" : "";
      $("answerTitle").textContent = (item.displayName || item.username || "学生") + " · " + item.taskId + lateMark;
      $("answerMeta").textContent = when(item.submittedAt) + "　成绩由你给，下面的代码是学生提交的原文。";

      // 只有班级作业的提交能打分；章末大题那一栏是学生自己的练习记录，不评分
      var gradable = Boolean(openAssignmentId) && assignmentSubmissions.some(function (row) { return row.id === item.id; });
      $("gradeBox").hidden = !gradable;
      $("gradeSave").hidden = !gradable;
      gradingSubmissionId = gradable ? item.id : null;
      if (gradable) {
         $("gradeScore").value = item.teacherScore === null || item.teacherScore === undefined ? "" : String(item.teacherScore);
         $("gradeComment").value = item.teacherComment || "";
         $("gradeError").textContent = "";
         /* 只说「跑通了没有」，不给数字：给了数字就会被当成分数参考，而它并不是。
            这一条的用处仅仅是省掉老师逐份手跑一遍代码。 */
         $("gradeAuto").textContent = item.serverPassed ? "代码跑通了全部用例" : "有用例没跑通";
         $("gradeAuto").dataset.ok = item.serverPassed ? "yes" : "no";
         $("gradeState").textContent = item.graded ? "已于 " + when(item.gradedAt) + " 评分" : "尚未评分";
      } else {
         $("gradeState").textContent = item.serverPassed ? "代码跑通了全部用例" : "有用例没跑通";
      }
      var code = item.answerContent || "";
      var highlighted = null;
      if (window.LANG && typeof window.LANG.highlight === "function") {
         try { highlighted = window.LANG.highlight(code); } catch (e) { highlighted = null; }
      }
      if (highlighted) $("answerCode").innerHTML = highlighted;
      else $("answerCode").textContent = code;
      showDialog("answerDialog");
   }

   var gradingSubmissionId = null;

   async function saveGrade() {
      if (!gradingSubmissionId) return;
      var raw = $("gradeScore").value.trim();
      var comment = $("gradeComment").value.trim();
      var score = null;
      if (raw !== "") {
         if (!/^\d{1,3}$/.test(raw) || Number(raw) > 100) { $("gradeError").textContent = "分数需为 0–100 的整数。"; return; }
         score = Number(raw);
      }
      if (score === null && !comment) { $("gradeError").textContent = "填个分数或写句评语。"; return; }
      try {
         var data = await CLIENT.request(
            "/api/classes/" + encodeURIComponent(currentClassId) + "/submissions/" + encodeURIComponent(gradingSubmissionId) + "/grade",
            { method: "PUT", body: { score: score, comment: comment || null } }
         );
         // 就地更新这一条，不整页刷新——批改是连着做的，刷新会打断
         assignmentSubmissions.forEach(function (row) {
            if (row.id !== gradingSubmissionId) return;
            row.teacherScore = data.submission.teacherScore;
            row.teacherComment = data.submission.teacherComment;
            row.gradedAt = data.submission.gradedAt;
            row.graded = true;
         });
         closeDialogs();
         renderAssignments();
         toast(score === null ? "已记下评语。" : "已评 " + score + " 分。");
      } catch (error) { $("gradeError").textContent = describeError(error); }
   }

   /* ---------------- 事件 ---------------- */

   function selectTab(name) {
      Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (node) {
         node.classList.toggle("active", node.dataset.tab === name);
      });
      Array.prototype.forEach.call(document.querySelectorAll(".tab-panel"), function (panel) {
         panel.classList.toggle("active", panel.id === "panel-" + name);
      });
   }

   function wire() {
      $("classList").addEventListener("click", function (event) {
         var row = event.target.closest("li[data-class-id]");
         if (!row || row.dataset.classId === currentClassId) return;
         currentClassId = row.dataset.classId;
         renderClasses();
         void (async function () {
            setLoading(true, "载入中…");
            try { await loadClassDetail(); } catch (error) { toast(describeError(error)); } finally { setLoading(false); }
         })();
      });

      $("gradeSave").addEventListener("click", function () { void saveGrade(); });
      $("gradeScore").addEventListener("keydown", function (e) { if (e.key === "Enter") $("gradeSave").click(); });
      $("joinLockBtn").addEventListener("click", function () { void toggleJoinLock(); });
      $("newClassBtn").addEventListener("click", openClassDialog);
      $("classDialogOk").addEventListener("click", function () { void createClass(); });
      $("classNameInput").addEventListener("keydown", function (e) { if (e.key === "Enter") $("classDialogOk").click(); });
      $("addStudentBtn").addEventListener("click", function () { openStudentDialog(null); });
      $("studentDialogOk").addEventListener("click", function () { void submitStudentDialog(); });
      ["studentUsernameInput", "studentNameInput"].forEach(function (id) {
         $(id).addEventListener("keydown", function (e) { if (e.key === "Enter") $("studentDialogOk").click(); });
      });
      $("refreshBtn").addEventListener("click", function () { void refresh("刷新中…"); });

      $("studentsBody").addEventListener("click", function (event) {
         var rename = event.target.closest("[data-rename]");
         if (rename) {
            openStudentDialog(students.filter(function (s) { return s.id === rename.dataset.rename; })[0]);
            return;
         }
         var button = event.target.closest("[data-reset]");
         if (button) void resetActivation(button.dataset.reset);
      });

      $("submissionsBody").addEventListener("click", function (event) {
         var button = event.target.closest("[data-answer]");
         if (button) openAnswer(button.dataset.answer);
      });

      $("assignmentsBody").addEventListener("click", function (event) {
         var task = event.target.closest(".ad-task");
         if (task) { highlightColumn(Number(task.dataset.col)); return; }
         var answer = event.target.closest("[data-assignment-answer]");
         if (answer) { openAnswer(answer.dataset.assignmentAnswer); return; }
         var row = event.target.closest("li[data-assignment-id]");
         if (row) void openAssignment(row.dataset.assignmentId);
      });

      // 左栏的题目卡是可聚焦的，键盘上回车/空格要和点击等效
      $("assignmentsBody").addEventListener("keydown", function (event) {
         if (event.key !== "Enter" && event.key !== " ") return;
         var task = event.target.closest(".ad-task");
         if (!task) return;
         event.preventDefault();
         highlightColumn(Number(task.dataset.col));
      });

      $("backToAssignments").addEventListener("click", function () {
         openAssignmentId = null;
         assignmentSubmissions = [];
         renderAssignments();
      });

      /* 布置和编辑都走 assign.html：出题要写好几段长文本，弹窗装不下。
         这一页的状态（哪个班、哪个标签、展开的是哪份作业）由查询串带过去再带回来。 */
      $("newAssignmentBtn").addEventListener("click", function () {
         if (!currentClassId) { toast("先选择一个班级。"); return; }
         window.location.href = "assign.html?class=" + encodeURIComponent(currentClassId);
      });
      $("editAssignmentBtn").addEventListener("click", function () {
         if (!currentClassId || !openAssignmentId) return;
         window.location.href = "assign.html?class=" + encodeURIComponent(currentClassId) +
            "&a=" + encodeURIComponent(openAssignmentId);
      });
      $("deleteAssignmentBtn").addEventListener("click", function () { void removeAssignment(); });

      $("submissionScope").addEventListener("click", function (event) {
         var button = event.target.closest("button[data-scope]");
         if (!button || button.dataset.scope === submissionScope) return;
         submissionScope = button.dataset.scope;
         Array.prototype.forEach.call($("submissionScope").children, function (node) {
            node.setAttribute("aria-checked", String(node.dataset.scope === submissionScope));
         });
         renderSubmissions();
      });

      $("taskFilter").addEventListener("change", function () {
         taskFilter = this.value;
         void (async function () {
            setLoading(true, "筛选中…");
            try { await loadClassDetail(); } catch (error) { toast(describeError(error)); } finally { setLoading(false); }
         })();
      });

      Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (tab) {
         tab.addEventListener("click", function () { selectTab(tab.dataset.tab); });
      });

      $("toggleClasses").addEventListener("click", function () { $("classSidebar").classList.toggle("collapsed"); });

      $("confirmOk").addEventListener("click", function () {
         var done = dialogResolve;
         dialogResolve = null;
         closeDialogs();
         if (done) done(true);
      });
      $("codeCopy").addEventListener("click", function () {
         $("codeValue").select();
         var copied = false;
         // 剪贴板在不安全来源和部分浏览器里不可用，复制不了就让人自己选中。
         try { copied = document.execCommand("copy"); } catch (e) { copied = false; }
         $("codeHint").textContent = copied ? "已复制。" : "复制失败，请手动选中上面的激活码。";
      });
      $("overlay").addEventListener("click", closeDialogs);
      Array.prototype.forEach.call(document.querySelectorAll("[data-close]"), function (button) {
         button.addEventListener("click", closeDialogs);
      });
      document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeDialogs(); });

      // 账户入口里换了人（登录、退出、会话失效）就整页重新判定一次。
      AUTH.subscribe(function () { void refresh("载入中…"); });
      CLIENT.subscribe(function () { if (!checkAccess()) return; });
   }

   /* ---------------- 启动 ---------------- */

   function boot() {
      wire();
      renderTaskFilter();
      renderAll();
      if (entry.tab) selectTab(entry.tab);
      /* assign.html 布置成功之后要说一句话，但那是另一个页面，只能托 sessionStorage 带过来。
         读完就删，刷新一次不该再弹第二遍。 */
      try {
         var message = window.sessionStorage.getItem("caie.flash");
         if (message) {
            window.sessionStorage.removeItem("caie.flash");
            toast(message);
         }
      } catch (e) { /* 隐私模式下没有 sessionStorage，少一句提示而已 */ }
      // account-ui 会先恢复会话；它改完 AuthStore 之后上面的订阅会再跑一次。
      if (checkAccess()) void refresh("载入中…");
   }

   if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
   else boot();
})();
