/* 独立登录页的逻辑。
 *
 * 只依赖 CloudClient 和 AuthStore，不碰同步引擎——登录成功之后跳回来源页，
 * 由那一页照常启动同步。这样这一页既不需要知道项目和课程数据，
 * 也不会在登录瞬间触发一轮同步。
 *
 * 三步：intent（登录 / 注册）→ role（学生 / 老师 / 个人学习者）→ 表单。
 * 每次换屏都走 transition()，卡片高度做一次很短的过渡，新内容淡入；
 * 不这样的话卡片会在两屏之间忽大忽小地跳。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;

   var intent = null;          // login | register
   var role = null;            // student | teacher | learner
   var studentReg = "activate"; // activate | join，仅学生注册时有意义
   var busy = false;

   var ROLE_NAMES = { student: "学生", teacher: "老师", learner: "个人学习者" };
   var INTENT_NAMES = { login: "登录", register: "注册" };

   var REDUCED_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   var STEP_MS = 170;

   /*
    * 登录后回到哪一页。只接受同目录下的 `xxx.html`，
    * 绝不接受带协议或主机的值——那是开放重定向。
    */
   function nextPage() {
      var raw = new URLSearchParams(window.location.search).get("next") || "";
      // 无后缀和带后缀两种都接受：线上来的是 `/learn`，本地文件来的是 `learn.html`
      return /^[A-Za-z0-9._-]+(\.html)?(\?[^#]*)?$/.test(raw) && raw.indexOf("..") < 0 ? raw : "lab.html";
   }

   function goNext() { window.location.href = nextPage(); }

   /* ---------------- 高度过渡 ---------------- */

   /*
    * 把一次会改变卡片高度的改动包起来：先量旧高度，做改动，再量新高度，
    * 然后只在这两个值之间过渡一次。改动本身是同步完成的，动画纯粹是补间，
    * 中途不接受第二次调用叠加（后一次会接着当前高度继续走）。
    */
   var clearHeight = null;
   function transition(mutate) {
      var host = $("loginSteps");
      if (!host || REDUCED_MOTION) { mutate(); return; }
      var from = host.getBoundingClientRect().height;
      if (clearHeight) { clearTimeout(clearHeight); clearHeight = null; }
      host.style.height = "";
      mutate();
      var to = host.getBoundingClientRect().height;
      if (Math.abs(to - from) < 0.5) return;
      host.style.height = from + "px";
      void host.offsetHeight;            // 强制回流，否则两次赋值会被合并成一次
      host.style.transition = "height " + STEP_MS + "ms ease";
      host.style.height = to + "px";
      clearHeight = setTimeout(function () {
         // 过渡完就把高度交还给内容，否则表单里出现错误行时撑不开
         host.style.transition = "";
         host.style.height = "";
         clearHeight = null;
      }, STEP_MS + 20);
   }

   /* 新出现的那一屏淡入一下，告诉人「这是换了一屏」，而不是原地替换了文字 */
   function markEntering(element) {
      if (!element || REDUCED_MOTION) return;
      element.classList.remove("is-entering");
      void element.offsetWidth;
      element.classList.add("is-entering");
   }

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

   function setError(id, message) {
      var field = $(id);
      if (field.textContent === (message || "")) return;
      transition(function () { field.textContent = message || ""; });
   }

   function clearErrors() {
      ["emailError", "studentError", "activateError", "registerError"].forEach(function (id) {
         $(id).textContent = "";
      });
   }

   function describe(error) {
      if (!error) return "操作失败，请稍后再试。";
      if (error.code === "OFFLINE") return "网络暂时不可用，请稍后再试。";
      if (error.code === "NOT_CONFIGURED") return "云端功能暂未连接。";
      if (error.code === "EMAIL_NOT_CONFIGURED") return "邮箱验证暂未配置，请联系管理员。";
      if (error.code === "CLASS_JOIN_LOCKED") return "这个班级暂时不能加入，跟老师确认一下。";
      return error.message || "操作失败，请稍后再试。";
   }

   /* ---------------- 渲染 ---------------- */

   var STEPS = ["intentStep", "roleStep", "emailForm", "studentLoginForm", "studentRegisterStep"];

   function currentStep() {
      if (!intent) return "intentStep";
      if (!role) return "roleStep";
      if (role === "student") return intent === "login" ? "studentLoginForm" : "studentRegisterStep";
      return "emailForm";
   }

   function render(options) {
      var step = currentStep();
      var previous = STEPS.filter(function (id) { return !$(id).hidden; })[0];

      transition(function () {
         STEPS.forEach(function (id) { $(id).hidden = id !== step; });

         $("loginTitle").textContent = intent ? INTENT_NAMES[intent] : "账号";
         $("loginLead").hidden = Boolean(intent);
         $("chosenRow").hidden = !intent;
         /* 标题已经写着「登录 / 注册」，这行只补身份。第二步还没选身份，
            那就不要留一条空的色块在那儿——退成一行光秃秃的「上一步」。 */
         if (intent) {
            $("chosenName").textContent = role ? ROLE_NAMES[role] : "";
            $("chosenRow").classList.toggle("is-bare", !role);
         }

         if (step === "emailForm") renderEmailForm();
         if (step === "studentRegisterStep") renderStudentRegister();
         clearErrors();
      });

      if (previous !== step) markEntering($(step));
      if (options && options.focus === false) return;
      var focus = { emailForm: "loginEmail", studentLoginForm: "studentUsername" }[step]
         || (step === "studentRegisterStep" ? (studentReg === "join" ? "registerJoinCode" : "activateUsername") : null);
      // preventScroll：卡片正在做高度过渡，聚焦时别再把页面滚一下
      if (focus) try { $(focus).focus({ preventScroll: true }); } catch (e) { $(focus).focus(); }
   }

   function renderEmailForm() {
      var registering = intent === "register";
      $("emailPasswordLabel").textContent = registering ? "设置密码" : "密码";
      // 「至少 10 个字符」是注册时的要求，登录时摆在那里像在提示别人的密码规则
      $("emailPassword").placeholder = registering ? "至少 10 个字符" : "";
      $("emailPassword").autocomplete = registering ? "new-password" : "current-password";
      $("emailSubmit").textContent = registering ? "注册并发送验证邮件" : "登录";
      $("emailHint").innerHTML = registering
         ? '注册后要打开邮箱里的验证链接，验证完成才算注册成功。已经有账号了？<button type="button" class="login-link" data-go="login">去登录</button>'
         : '还没有账号？<button type="button" class="login-link" data-go="register">去注册</button>';
   }

   function renderStudentRegister() {
      var joining = studentReg === "join";
      $("studentActivateForm").hidden = joining;
      $("studentJoinForm").hidden = !joining;
      Array.prototype.forEach.call($("studentRegisterStep").querySelectorAll("[data-student-reg]"), function (tab) {
         var on = tab.dataset.studentReg === studentReg;
         tab.classList.toggle("login-choice-active", on);
         tab.setAttribute("aria-selected", String(on));
      });
   }

   function renderSignedIn() {
      $("loginFlow").hidden = true;
      $("loginLead").hidden = true;
      $("loginTitle").textContent = "账号";
      showNotice("你已经登录为 " + AUTH.label() + "（" + AUTH.roleLabel() + "）。", "ok", [
         { label: "继续", primary: true, onClick: goNext },
         {
            label: "换个账号",
            onClick: function () {
               void CLIENT.logout().then(function () {
                  $("loginFlow").hidden = false;
                  hideNotice();
                  intent = null;
                  role = null;
                  studentReg = "activate";
                  render({ focus: false });
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
         [{ label: "去实验室", primary: true, onClick: function () { window.location.href = "lab.html"; } }]
      );
   }

   /* ---------------- 提交 ---------------- */

   /* 提交期间除了禁用按钮，还要把文字换掉——只灰一下看不出「已经在发了」 */
   function lock(on, form) {
      busy = on;
      var button = form.querySelector(".login-submit");
      if (!button) return;
      button.disabled = on;
      if (on) {
         button.dataset.idleLabel = button.textContent;
         button.textContent = "处理中…";
      } else if (button.dataset.idleLabel) {
         button.textContent = button.dataset.idleLabel;
         delete button.dataset.idleLabel;
      }
   }

   $("emailForm").addEventListener("submit", function (event) {
      event.preventDefault();
      if (busy) return;
      var email = $("loginEmail").value.trim();
      var password = $("emailPassword").value;
      if (!email || !password) { setError("emailError", "请输入邮箱和密码。"); return; }
      if (intent === "register" && password.length < 10) { setError("emailError", "密码至少 10 个字符。"); return; }
      setError("emailError", "");
      lock(true, this);
      var form = this;
      var registering = intent === "register";
      var action = registering ? CLIENT.registerEmail(email, role, password) : CLIENT.loginEmail(email, password);
      void action.then(function (result) {
         if (!registering) { goNext(); return; }
         $("loginFlow").hidden = true;
         $("loginLead").hidden = true;
         var devToken = result && result.developmentToken;
         showNotice(
            devToken ? "注册验证链接已生成（开发环境）。点击下方完成验证。" : "验证邮件已经发到 " + email + "。请打开邮件中的链接完成注册，链接 15 分钟内有效。",
            "ok",
            devToken
               ? [{ label: "完成验证", primary: true, onClick: function () { window.location.href = "lab.html?authToken=" + encodeURIComponent(devToken); } }]
               : [{ label: "先去实验室", onClick: function () { window.location.href = "lab.html"; } }]
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

   $("studentJoinForm").addEventListener("submit", function (event) {
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

   document.addEventListener("click", function (event) {
      var target = event.target;

      var intentCard = target.closest("[data-intent]");
      if (intentCard) { intent = intentCard.dataset.intent; render(); return; }

      var roleCard = target.closest("[data-role]");
      if (roleCard) { role = roleCard.dataset.role; render(); return; }

      // 表单里的「去注册 / 去登录」：只换 intent，身份和已经填的邮箱都留着
      var jump = target.closest("[data-go]");
      if (jump) { intent = jump.dataset.go; render(); return; }

      var tab = target.closest("[data-student-reg]");
      if (tab) {
         if (tab.dataset.studentReg === studentReg) return;
         studentReg = tab.dataset.studentReg;
         transition(function () { renderStudentRegister(); clearErrors(); });
         return;
      }

      /* 密码显示/隐藏。密码至少 10 位，盲打错一个字符只会得到一句「密码不对」。 */
      var reveal = target.closest("[data-reveal]");
      if (reveal) {
         var input = $(reveal.dataset.reveal);
         if (!input) return;
         var show = input.type === "password";
         input.type = show ? "text" : "password";
         reveal.textContent = show ? "隐藏" : "显示";
         reveal.setAttribute("aria-pressed", String(show));
         reveal.setAttribute("aria-label", show ? "隐藏密码" : "显示密码");
         input.focus();
      }
   });

   $("stepBack").addEventListener("click", function () {
      if (role) role = null; else intent = null;
      render({ focus: false });
   });

   // 卡片列表里用方向键移动焦点；回车和空格本来就能按下按钮，不用另外接
   document.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      var list = event.target.closest ? event.target.closest(".role-list") : null;
      if (!list) return;
      var options = Array.prototype.slice.call(list.children);
      var here = options.indexOf(event.target.closest(".role-option"));
      if (here < 0) return;
      event.preventDefault();
      var step = (event.key === "ArrowRight" || event.key === "ArrowDown") ? 1 : -1;
      options[(here + step + options.length) % options.length].focus();
   });

   async function boot() {
      // 带 next 的话，「先不登录」也回到那一页，别把人甩回编辑器
      $("skipLogin").href = nextPage();
      /* 邮件里的验证链接失效时会把人送回这里。直接落在「注册」那一步：
         重新注册一次就是重发链接，正是他现在要做的事。 */
      if (new URLSearchParams(window.location.search).get("verify") === "expired") {
         intent = "register";
         showNotice("验证链接无效或已过期——链接只在 15 分钟内有效，而且只能用一次。重新注册一次就会发一封新的给你。", "");
      }
      render({ focus: false });
      if (!CLIENT.available()) { renderUnconfigured(); return; }
      await CLIENT.restore();
      if (AUTH.isSignedIn()) { renderSignedIn(); return; }
      if (!CLIENT.available()) { renderUnconfigured(); return; }
   }

   void boot();
})();
