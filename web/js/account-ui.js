/* 账户入口。各页共用一份，自己往现有顶栏右侧插一个按钮和一个下拉面板，
 * 不动任何已有版式。
 *
 * 登录表单不在这里：身份选择加上学生的「登录 / 首次激活」，字段各不相同，
 * 挤在 300px 的浮层里每一层都要靠猜，所以整套搬去了 login.html。
 * 未登录时点这个按钮直接过去，登录成功再跳回原来那一页。
 * 这个浮层只负责已登录之后的事：我是谁、同步到哪一步、作业、班级面板、退出。
 *
 * 登录从来不是使用编辑器的前提：未登录、未配置 API、断网，页面照常工作，
 * 这里只是多出或少掉一个入口。
 */
(function () {
   "use strict";

   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;
   var ENGINE = window.SyncEngine;
   var QUEUE = window.SyncQueue;

   var root = null;
   var button = null;
   var panel = null;
   var noteTimer = null;

   function el(html) {
      var wrap = document.createElement("div");
      wrap.innerHTML = html.trim();
      return wrap.firstElementChild;
   }

   /*
    * 判断当前在哪一页。两种形状都要认：线上地址栏是无后缀的 `/teacher`，
    * 而双击本地文件时是 `.../web/classes.html`。
    */
   function onPage(name) {
      var last = window.location.pathname.split("/").pop() || "";
      return last === name || last === name + ".html";
   }

   /** 回到当前页要用的链接。带后缀的形式在两种协议下都能回得来。 */
   function currentPageHref() {
      var last = window.location.pathname.split("/").pop() || "";
      var page = last.replace(/\.html$/, "");
      if (!/^[A-Za-z0-9._-]+$/.test(page)) return "";
      return page + ".html" + window.location.search;
   }

   function escapeHtml(value) {
      return String(value == null ? "" : value)
         .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
   }

   function note(text, state) {
      var box = panel.querySelector(".account-note");
      if (!box) return;
      box.textContent = text || "";
      box.dataset.state = state || "";
      if (noteTimer) clearTimeout(noteTimer);
      if (state === "ok" && text) noteTimer = setTimeout(function () { note("", ""); }, 8000);
   }

   /* ---------------- 面板内容 ---------------- */

   /*
    * 未登录时这个浮层不再承载任何表单。
    * 身份选择（老师 / 个人 / 学生）加上学生的「登录 / 首次激活」，
    * 字段各不相同，塞进 300px 宽的浮层里每一层都要靠猜；那些都搬去 login.html 了。
    * 这里只留一句话和一个入口。
    */
   function renderSignedOut() {
      return (
         "<h4>登录后可在另一台设备继续</h4>" +
         '<p class="account-meta">不登录也能完整使用本地编辑、学习、做题和本地运行。</p>' +
         '<div class="account-actions">' +
         '<button class="btn btn-primary small fixed-btn wide" data-account-action="goLogin">去登录</button>' +
         "</div>"
      );
   }

   function renderSignedIn() {
      return (
         '<div class="account-identity">' + escapeHtml(AUTH.label()) + "</div>" +
         '<div class="account-meta">' + escapeHtml(AUTH.roleLabel()) + "</div>" +
         "<hr>" +
         '<div data-account-assignments></div>' +
         holdNotice() +
         '<ul class="account-blocked" data-account-blocked hidden></ul>' +
         /* 状态文字和两个按钮排在同一行：分两行的话，左边一句话、右边两个按钮，
            中间那块空白会把视线拉成一道斜线。 */
         '<div class="account-actions account-footer">' +
         '<span class="account-status-line" data-account-status></span>' +
         '<button class="btn btn-ghost small fixed-btn" data-account-action="syncNow">立即同步</button>' +
         '<button class="btn small fixed-btn" data-account-action="logout">退出登录</button>' +
         "</div>" +
         '<div class="account-note" data-state=""></div>'
      );
   }

   /*
    * 这台设备上有登录之前就存在的项目或学习进度时给一条说明。
    *
    * 未登录时攒下的，可以一键并入这个账号；
    * 上一位登录用户留下的，不问也不并——那是别人的东西，
    * 而完成状态一旦记进账号就撤不回来，老师还看得见。
    * 两种情况下本地内容都原样留着，照常能编辑、能运行。
    */
   function holdNotice() {
      var hold = ENGINE.pendingHold();
      if (!hold || hold.asked) return "";
      var parts = [];
      if (hold.projects) parts.push(hold.projects + " 个项目");
      if (hold.progress) parts.push(hold.progress + " 节已完成");
      if (hold.drafts) parts.push(hold.drafts + " 份题目草稿");
      if (!parts.length) return "";
      var summary = escapeHtml(parts.join("、"));
      if (!hold.fromGuest) {
         return '<p class="account-meta">这台设备上有上一位登录用户留下的内容（' + summary +
            "），不会并入你的账号，也不会被删除。</p><hr>";
      }
      return '<p class="account-meta">这台设备上有未登录时留下的内容（' + summary + "）。要并入这个账号吗？</p>" +
         '<div class="account-actions">' +
         '<button class="btn btn-ghost small fixed-btn" data-account-action="keepOut">不并入</button>' +
         '<button class="btn btn-primary small fixed-btn" data-account-action="adopt">并入</button>' +
         "</div><hr>";
   }

   /*
    * 学生的作业清单。放在账户面板里而不是课程页：面板是浮层，
    * 每一页都有，加在这里不动任何既有版式，也不会让游客和老师多看到东西。
    * 题号直接链到做题页，点进去就是平时做题的那一套。
    */
   /*
    * 浮层只给一条入口和一句概览：作业有自己的页面（assignments.html），
    * 评语、每道题的状态、去做题的链接都在那边。塞回这个 300px 的浮层里，
    * 就是使用者说的「入口隐蔽、只看得到分数、看不到评语」。
    */
   function renderAssignments(list) {
      var box = panel.querySelector("[data-account-assignments]");
      if (!box) return;
      if (!list || !list.length) { box.innerHTML = ""; return; }
      var pending = 0;
      list.forEach(function (item) {
         var mine = assignmentGrades[item.id] || {};
         (item.items || []).forEach(function (entry) { if (!mine[entry.id]) pending += 1; });
      });
      box.innerHTML = "<h4>我的作业</h4>" +
         '<p class="account-meta">' + list.length + " 份作业" + (pending ? "，还有 " + pending + " 道没交" : "，都交了") + "</p>" +
         '<div class="account-row"><a class="btn btn-primary small fixed-btn wide" href="assignments.html">打开作业</a></div><hr>';
   }

   /* 每份作业里「哪道题老师批过、给了几分」。批改结果学生看不到的话，打分就白打了。 */
   var assignmentGrades = {};

   async function loadGrades(list) {
      await Promise.all((list || []).map(async function (item) {
         try {
            var data = await CLIENT.request("/api/assignments/" + encodeURIComponent(item.id) + "/submissions");
            var byTask = {};
            // 服务端按提交时间倒序，第一条就是最新的那次
            (data.submissions || []).forEach(function (row) {
               if (!byTask[row.taskId]) byTask[row.taskId] = row;
            });
            assignmentGrades[item.id] = byTask;
         } catch (error) { /* 看不到成绩不影响作业清单本身 */ }
      }));
   }

   function formatDate(timestamp) {
      var date = new Date(timestamp);
      var pad = function (n) { return String(n).padStart(2, "0"); };
      return (date.getMonth() + 1) + "月" + date.getDate() + "日 " + pad(date.getHours()) + ":" + pad(date.getMinutes());
   }

   /** 题号 → 做题页需要的章号和推进步骤，和课程数据保持一致。 */
   function taskLocation(taskId) {
      var course = window.CAIETeaching && window.CAIETeaching.course;
      if (!course) return null;
      for (var c = 0; c < course.chapters.length; c += 1) {
         var chapter = course.chapters[c];
         for (var i = 0; i < chapter.sections.length; i += 1) {
            var section = chapter.sections[i];
            var hit = (section.blocks || []).filter(function (block) {
               return block.kind === "task" && block.id === taskId;
            })[0];
            if (hit) return { chapterId: chapter.id, stepId: section.id };
         }
         if (chapter.chapterTasks.some(function (task) { return task.id === taskId; })) {
            return { chapterId: chapter.id, stepId: "chapterTask" };
         }
      }
      return null;
   }

   function renderUnconfigured() {
      return (
         "<h4>云端功能暂未连接</h4>" +
         '<p class="account-meta">这里暂时用不了账号功能，登录、跨设备继续和云端运行都不可用。' +
         "本地编辑、保存、学习、做题和本地运行不受影响。</p>"
      );
   }

   function renderPanel() {
      if (!panel) return;
      if (!CLIENT.available()) panel.innerHTML = renderUnconfigured();
      else if (AUTH.isSignedIn()) panel.innerHTML = renderSignedIn();
      else panel.innerHTML = renderSignedOut();
      refreshStatusLine();
   }

   function statusText(status) {
      if (!status) return "";
      if (status.state === "offline") return "网络暂时不可用，恢复后会自动重试。";
      if (status.state === "paused") return "同步已暂停，重新登录后继续。";
      if (status.pending) return status.state === "syncing" ? "正在同步 " + status.pending + " 项改动…" : "有 " + status.pending + " 项改动待同步。";
      if (status.state === "syncing") return "正在同步…";
      if (status.lastError && status.lastError.tooLarge) return "文件过大，这一项没有同步。";
      if (status.lastError) return "上一次同步没有成功，稍后会重试。";
      return status.lastPullAt ? "已同步。" : "已登录。";
   }

   function refreshStatusLine() {
      if (!panel) return;
      var status = ENGINE.status();
      var line = panel.querySelector("[data-account-status]");
      if (line) line.textContent = statusText(status);
      var list = panel.querySelector("[data-account-blocked]");
      if (list) {
         var blocked = status.blocked || [];
         list.hidden = blocked.length === 0;
         list.innerHTML = blocked.map(function (item) {
            var reason = item.code === "FILE_TOO_LARGE" || item.code === "PROJECT_TOO_LARGE" || item.code === "PROJECT_FILE_LIMIT"
               ? "文件过大" : item.message;
            return "<li>" + escapeHtml(item.label) + "：" + escapeHtml(reason) + "</li>";
         }).join("");
      }
      refreshButton(status);
   }

   function refreshButton(status) {
      if (!button) return;
      if (!CLIENT.available()) {
         button.dataset.state = "off";
         button.querySelector(".account-btn-text").textContent = "账户";
         button.setAttribute("data-tip", "云端功能暂未连接");
         return;
      }
      if (!AUTH.isSignedIn()) {
         button.dataset.state = "out";
         button.querySelector(".account-btn-text").textContent = "登录";
         button.setAttribute("data-tip", "登录后可在另一台设备继续");
         return;
      }
      var state = status && (status.state === "syncing" || status.pending) ? "syncing"
         : status && status.state === "offline" ? "offline" : "in";
      button.dataset.state = state;
      button.querySelector(".account-btn-text").textContent = AUTH.label();
      button.setAttribute("data-tip", AUTH.roleLabel() + " · " + statusText(status));
   }

   function open() {
      renderPanel();
      // 作业是异步取的，先把面板画出来，拿到再补上去，不让入口卡住。
      void CLIENT.assignments().then(async function (list) {
         if (!panel.hidden) renderAssignments(list);
         await loadGrades(list);
         if (!panel.hidden) renderAssignments(list);
      });
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
      var first = panel.querySelector("input");
      if (first) first.focus();
   }

   function close() {
      if (!panel || panel.hidden) return;
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
   }

   /* ---------------- 动作 ---------------- */

   async function guard(fn, pendingText) {
      note(pendingText || "处理中…", "");
      try {
         await fn();
      } catch (error) {
         if (error && error.code === "OFFLINE") note("网络暂时不可用，请稍后再试。", "error");
         else if (error && error.code === "NOT_CONFIGURED") note("云端功能暂未连接。", "error");
         else note((error && error.message) || "操作失败，请稍后再试。", "error");
      }
   }

   function afterSignIn() {
      renderPanel();
      ENGINE.start();
      void ENGINE.pull();
      refreshStatusLine();
   }

   /** 去登录页，并记下当前这一页，登完直接回来。 */
   function goToLogin() {
      var next = currentPageHref();
      window.location.href = "login.html" + (next ? "?next=" + encodeURIComponent(next) : "");
   }

   var ACTIONS = {
      goLogin: function () { goToLogin(); },
      adopt: function () {
         if (ENGINE.adoptLocalData()) note("已并入，正在同步。", "ok");
         renderPanel();
      },
      keepOut: function () {
         ENGINE.keepLocalDataOut();
         note("这些内容只留在本机。", "ok");
         renderPanel();
      },
      syncNow: function () {
         ENGINE.start();
         void ENGINE.pull();
         note("已开始同步。", "ok");
      },
      logout: function () {
         void guard(async function () {
            await CLIENT.logout();
            close();
            renderPanel();
            refreshButton(ENGINE.status());
            note("已退出登录。", "ok");
         }, "正在退出…");
      }
   };

   /* ---------------- 邮箱链接回跳 ---------------- */

   async function consumeAuthTokenFromUrl() {
      var params = new URLSearchParams(window.location.search);
      var token = params.get("authToken");
      if (!token) return false;
      // 先把 token 从地址栏抹掉再做任何别的事：它是一次性凭据，
      // 留在 URL 里会进历史记录、被复制、被 referrer 带走。
      params.delete("authToken");
      var search = params.toString();
      try {
         window.history.replaceState(null, "", window.location.pathname + (search ? "?" + search : "") + window.location.hash);
      } catch (e) { /* 个别浏览器在本地文件下不允许改地址栏 */ }
      try {
         await CLIENT.verifyEmailToken(token);
         return true;
      } catch (error) {
         /* 以前这里一声不吭地 return false：人点了邮件里的「验证」，落到编辑器，
            成功和失败长得一模一样，只能自己猜。链接 15 分钟过期、而且一次性，
            过期是常事——送回登录页，把原因说清楚。 */
         if (error && error.code === "OFFLINE") return false;
         window.location.replace("login.html?verify=expired");
         return false;
      }
   }


   /* ---------------- 主导航 ---------------- */

   /*
    * 四个一级目的地。以前它们是散在各页顶栏右侧的普通链接，和「运行」「语法检测」
    * 这些「对当前内容做什么」的控件混在一条线上，顺序纯属历史堆积；老师的班级入口
    * 更是埋在账户浮层里两层深。
    *
    * 现在统一成品牌右边的一组分段控件：左边回答「去哪儿」，右边只留「对这份东西做
    * 什么」。当前页是浮起来的那一枚，而且渲染成 span 不是 a——点它没反应，比点它
    * 重新加载一遍诚实。
    *
    * 做题页（task / custom-task）不放这组：它们是沉浸式子页，左上角的「‹ 返回课文」
    * 「‹ 我的作业」就是它们的导航，做题时不该再鼓励切走。
    */
   var NAV_FIXED = [
      { id: "lab", label: "实验室", href: "lab.html" },
      { id: "learn", label: "学习", href: "learn.html" }
   ];
   var NAV_BY_ROLE = {
      student: { id: "assignments", label: "作业", href: "assignments.html" },
      teacher: { id: "classes", label: "班级", href: "classes.html" }
   };

   function navItemHtml(item, current) {
      if (item.id === current) {
         return '<span class="topnav-item is-current" aria-current="page">' + escapeHtml(item.label) + "</span>";
      }
      return '<a class="topnav-item" href="' + item.href + '">' + escapeHtml(item.label) + "</a>";
   }

   function renderNav() {
      var host = document.getElementById("topNav");
      if (!host) return;
      var user = AUTH.user();
      var role = user ? NAV_BY_ROLE[user.role] : null;
      var current = ["lab", "learn", "assignments", "classes"].filter(onPage)[0] || "";

      /* 身份相关的那一枚（作业 / 班级）是登录之后才知道的。空着不画的话，
         /auth/me 一回来整条顶栏就会往右挪一截。所以槽位常驻：没有对应身份时
         放一枚同样宽度的隐形项（「作业」和「班级」都是两个字，宽度天然一致）。 */
      var roleHtml = role
         ? navItemHtml(role, current)
         : '<span class="topnav-item is-blank" aria-hidden="true">作业</span>';

      var next = '<span class="topnav-sep" aria-hidden="true"></span><div class="topnav-group">' +
         NAV_FIXED.map(function (item) { return navItemHtml(item, current); }).join("") +
         roleHtml + "</div>";
      if (host.innerHTML !== next) host.innerHTML = next;
   }

   /* ---------------- 装配 ---------------- */

   function mount() {
      var host = document.querySelector(".topbar-right");
      if (!host || document.getElementById("accountBtn")) return;
      root = el('<div class="account-wrap"></div>');
      button = el(
         '<button id="accountBtn" class="btn btn-ghost fixed-btn account-btn" aria-haspopup="true" aria-expanded="false">' +
         '<span class="account-dot"></span><span class="account-btn-text">登录</span></button>'
      );
      // 刻意不复用 .menu：那条规则会把里面的 .btn 全部拉平成菜单项。
      panel = el('<div class="account-panel" id="accountPanel" hidden></div>');
      root.appendChild(button);
      root.appendChild(panel);
      // 永远挂到最右：顶栏右侧从左到右是「状态 → 主操作 → 更多 → 我是谁」，
      // 身份在最末是全站惯例，其他页面本来就是这个位置。
      host.appendChild(root);

      button.addEventListener("click", function (event) {
         event.stopPropagation();
         // 未登录时没有什么可看的，直接去登录页，少一次「点开再点一下」。
         if (CLIENT.available() && !AUTH.isSignedIn()) { goToLogin(); return; }
         if (panel.hidden) open(); else close();
      });
      panel.addEventListener("click", function (event) {
         event.stopPropagation();
         var action = event.target.closest("[data-account-action]");
         if (action && ACTIONS[action.dataset.accountAction]) ACTIONS[action.dataset.accountAction]();
      });
      document.addEventListener("click", function (event) {
         if (!event.target.closest(".account-wrap")) close();
      });

      AUTH.subscribe(function () { renderNav(); if (!panel.hidden) renderPanel(); refreshButton(ENGINE.status()); });
      CLIENT.subscribe(function () { if (!panel.hidden) renderPanel(); refreshButton(ENGINE.status()); });
      ENGINE.onStatus(function () { if (!panel.hidden) refreshStatusLine(); else refreshButton(ENGINE.status()); });
      QUEUE.subscribe(function () { if (!panel.hidden) refreshStatusLine(); });
      renderNav();
      refreshButton(ENGINE.status());
   }

   async function boot() {
      mount();
      if (!CLIENT.available()) { refreshButton(null); return; }
      var verified = await consumeAuthTokenFromUrl();
      if (!verified) await CLIENT.restore();
      renderNav();
      refreshButton(ENGINE.status());
      if (AUTH.isSignedIn()) {
         // 只有登录之后才启动队列和同步；游客这两个模块完全不跑。
         ENGINE.start();
         void ENGINE.pull();
      }
      if (!panel.hidden) renderPanel();
   }

   if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { void boot(); });
   else void boot();
})();
