/* 独立登录页的逻辑。
 *
 * 只依赖 CloudClient 和 AuthStore，不碰同步引擎——登录成功之后跳回来源页，
 * 由那一页照常启动同步。这样这一页既不需要知道项目和课程数据，
 * 也不会在登录瞬间触发一轮同步。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;

   var role = null;            // student | teacher | learner
   var confirmedRole = null;   // 点过「继续」之后才算定下来
   /* pick = 还没说自己手上有什么；选完才进对应的表单。 */
   var studentMode = "pick";   // pick | login | activate | register
   var busy = false;

   var ROLE_NAMES = { student: "学生", teacher: "老师", learner: "个人学习者" };

   /*
    * 登录后回到哪一页。只接受同目录下的 `xxx.html`，
    * 绝不接受带协议或主机的值——那是开放重定向。
    */
   function nextPage() {
      var raw = new URLSearchParams(window.location.search).get("next") || "";
      // 无后缀和带后缀两种都接受：线上来的是 `/teaching`，本地文件来的是 `teaching.html`
      return /^[A-Za-z0-9._-]+(\.html)?(\?[^#]*)?$/.test(raw) && raw.indexOf("..") < 0 ? raw : "index.html";
    }

   function goNext() { window.location.href = nextPage(); }

   /* ---------------- 状态 ---------------- */

   function showNotice(text, state, actions) {
      var box = $("loginNotice");
      box.hidden = false;
      box.dataset.state = state || "";
      $("loginNoticeText").textContent = text;
      $("loginNoticeActions").innerHTML = "";
      (actions || []).forEach(function (action) {
         var button = document.createElement("button");
         button.className = "btn " + (action.primary ? "btn-primary" : "btn-ghost") + " fixed-btn wide";
         button.textContent = action.label;
         button.addEventListener("click", action.onClick);
         $("loginNoticeActions").appendChild(button);
      });
   }

   function hideNotice() { $("loginNotice").hidden = true; }

   function setError(id, message) { $(id).textContent = message || ""; }

   function clearErrors() {
      ["emailError", "studentError", "activateError", "registerError"].forEach(function (id) { setError(id, ""); });
   }

   function describe(error) {
      if (!error) return "操作失败，请稍后再试。";
      if (error.code === "OFFLINE") return "网络暂时不可用，请稍后再试。";
      if (error.code === "NOT_CONFIGURED") return "云端功能暂未连接。";
      if (error.code === "EMAIL_NOT_CONFIGURED") return "邮箱登录暂未配置，请联系管理员。";
      if (error.code === "CLASS_JOIN_LOCKED") return "这个班级暂时不能加入，跟老师确认一下。";
      return error.message || "操作失败，请稍后再试。";
   }

   /* ---------------- 渲染 ---------------- */

   /*
    * 两步：先选身份，点「继续」之后三张卡收起来，只留这个身份要填的东西。
    * 三种身份的字段完全不同，同屏显示只会让人先猜自己在看哪一套。
    */
   function renderRole() {
      Array.prototype.forEach.call($("roleList").children, function (option) {
         option.setAttribute("aria-checked", String(option.dataset.role === role));
      });
      $("roleContinue").disabled = !role;

      var picked = confirmedRole;
      $("roleStep").hidden = Boolean(picked);
      $("chosenRow").hidden = !picked;
      if (picked) $("chosenName").textContent = ROLE_NAMES[picked];

      var isEmail = picked === "teacher" || picked === "learner";
      $("emailForm").hidden = !isEmail;
      $("studentPathStep").hidden = !(picked === "student" && studentMode === "pick");
      $("studentLoginForm").hidden = !(picked === "student" && studentMode === "login");
      $("studentActivateForm").hidden = !(picked === "student" && studentMode === "activate");
      $("studentRegisterForm").hidden = !(picked === "student" && studentMode === "register");
      clearErrors();
      if (!picked) return;
      var focus = isEmail ? $("loginEmail")
         : studentMode === "activate" ? $("activateUsername")
         : studentMode === "register" ? $("registerJoinCode")
         : studentMode === "login" ? $("studentUsername") : null;
      if (focus) focus.focus();
   }

   function renderSignedIn() {
      $("loginFlow").hidden = true;
      $("loginLead").hidden = true;
      showNotice("你已经登录为 " + AUTH.label() + "（" + AUTH.roleLabel() + "）。", "ok", [
         { label: "继续", primary: true, onClick: goNext },
         {
            label: "换个账号",
            onClick: function () {
               void CLIENT.logout().then(function () {
                  $("loginFlow").hidden = false;
                  $("loginLead").hidden = false;
                  hideNotice();
                  role = null;
                  confirmedRole = null;
                  renderRole();
               });
            }
         }
      ]);
   }

   function renderUnconfigured() {
      $("loginFlow").hidden = true;
      $("loginLead").hidden = true;
      showNotice(
         "云端功能暂未连接，现在无法登录。编辑器、课程、做题和本地运行都不受影响，可以直接使用。",
         "",
         [{ label: "去编辑器", primary: true, onClick: function () { window.location.href = "index.html"; } }]
      );
   }

   /* ---------------- 提交 ---------------- */

   function lock(on, form) {
      busy = on;
      var button = form.querySelector(".login-submit");
      if (button) button.disabled = on;
   }

   $("emailForm").addEventListener("submit", function (event) {
      event.preventDefault();
      if (busy) return;
      var email = $("loginEmail").value.trim();
      if (!email) { setError("emailError", "请输入邮箱。"); return; }
      setError("emailError", "");
      lock(true, this);
      var form = this;
      void CLIENT.startEmailLogin(email, confirmedRole).then(function () {
         $("loginFlow").hidden = true;
         $("loginLead").hidden = true;
         // 不论这个邮箱能不能登录都是同一句话：否则这一页就成了「查这个邮箱注册过没有」的工具。
         showNotice(
            "如果这个邮箱可以登录，登录链接已经发出。打开邮件点链接即可，链接 15 分钟内有效。",
            "ok",
            [{ label: "先去编辑器", onClick: function () { window.location.href = "index.html"; } }]
         );
      }).catch(function (error) {
         setError("emailError", describe(error));
      }).finally(function () { lock(false, form); });
   });

   $("studentLoginForm").addEventListener("submit", function (event) {
      event.preventDefault();
      if (busy) return;
      var username = $("studentUsername").value.trim();
      var password = $("studentPassword").value;
      if (!username || !password) { setError("studentError", "请输入用户名和密码。"); return; }
      setError("studentError", "");
      lock(true, this);
      var form = this;
      void CLIENT.loginStudent(username, password)
         .then(goNext)
         .catch(function (error) { setError("studentError", describe(error)); })
         .finally(function () { lock(false, form); });
   });

   $("studentActivateForm").addEventListener("submit", function (event) {
      event.preventDefault();
      if (busy) return;
      var username = $("activateUsername").value.trim();
      var code = $("activateCode").value.trim();
      var password = $("activatePassword").value;
      if (!username || !code || !password) { setError("activateError", "请填写用户名、激活码和新密码。"); return; }
      if (password.length < 10) { setError("activateError", "密码至少 10 个字符。"); return; }
      setError("activateError", "");
      lock(true, this);
      var form = this;
      void CLIENT.activateStudent(username, code, password)
         .then(goNext)
         .catch(function (error) { setError("activateError", describe(error)); })
         .finally(function () { lock(false, form); });
   });

   $("studentRegisterForm").addEventListener("submit", function (event) {
      event.preventDefault();
      if (busy) return;
      var joinCode = $("registerJoinCode").value.trim();
      var displayName = $("registerDisplayName").value.trim();
      var username = $("registerUsername").value.trim();
      var password = $("registerPassword").value;
      if (!joinCode || !displayName || !username || !password) { setError("registerError", "四项都要填。"); return; }
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{2,31}$/.test(username)) {
         setError("registerError", "用户名需为 3–32 位字母、数字或 . _ - 。");
         return;
      }
      if (password.length < 10) { setError("registerError", "密码至少 10 个字符。"); return; }
      setError("registerError", "");
      lock(true, this);
      var form = this;
      void CLIENT.registerStudent(joinCode, displayName, username, password)
         .then(goNext)
         .catch(function (error) { setError("registerError", describe(error)); })
         .finally(function () { lock(false, form); });
   });

   /* ---------------- 接线 ---------------- */

   $("roleList").addEventListener("click", function (event) {
      var option = event.target.closest("[data-role]");
      if (!option) return;
      role = option.dataset.role;
      studentMode = "pick";
      renderRole();
   });

   // 双击卡片等于选中并继续，省一次点击
   $("roleList").addEventListener("dblclick", function (event) {
      if (event.target.closest("[data-role]") && role) $("roleContinue").click();
   });

   $("roleContinue").addEventListener("click", function () {
      if (!role) return;
      confirmedRole = role;
      renderRole();
   });

   $("changeRole").addEventListener("click", function () {
      confirmedRole = null;
      renderRole();
   });

   document.addEventListener("click", function (event) {
      var toggle = event.target.closest("[data-student-mode]");
      if (!toggle) return;
      studentMode = toggle.dataset.studentMode;
      renderRole();
   });

   async function boot() {
      // 带 next 的话，「先不登录」也回到那一页，别把人甩回编辑器
      $("skipLogin").href = nextPage();
      renderRole();
      if (!CLIENT.available()) { renderUnconfigured(); return; }
      await CLIENT.restore();
      if (AUTH.isSignedIn()) { renderSignedIn(); return; }
      if (!CLIENT.available()) { renderUnconfigured(); return; }
   }

   void boot();
})();
