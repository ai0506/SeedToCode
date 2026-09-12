/* CloudClient：唯一一处知道「怎么跟服务端说话」的地方。
 *
 * 只做四件事：定位 API、发请求、把各种失败归一成一种错误、维护会话状态。
 * 业务层拿到的永远是 CloudError，不需要再去分辨 fetch 抛的 TypeError、
 * HTML 404 页面和服务端的 JSON 错误体。
 *
 * 同源约定：第一版只认页面自己的 origin——认证在 /auth/*，其余在 /api/*。
 * 这样 HttpOnly 会话 cookie 天然可用，不需要为跨域 cookie 做任何放宽。
 * 用 file:// 直接打开页面、或者这个站点前面没有挂 API 时，
 * CloudClient 会停在「未配置」，本地编辑、学习和本地运行一概不受影响。
 */
(function () {
   "use strict";

   var AUTH = window.AuthStore;

   var UNKNOWN = "unknown";        // 还没问过
   var CONFIGURED = "configured";  // 这个 origin 后面确实有 API
   var ABSENT = "absent";          // 纯静态托管，没有云端

   var configuration = UNKNOWN;
   var listeners = [];
   var restoring = null;

   function CloudError(code, message, status, extra) {
      this.name = "CloudError";
      this.code = code;
      this.message = message;
      this.status = status || 0;
      this.server = extra && extra.server !== undefined ? extra.server : null;
      this.extra = extra || {};
   }
   CloudError.prototype = Object.create(Error.prototype);
   CloudError.prototype.constructor = CloudError;

   /** 这些错误再试多少次都是同一个结果，重试只会把队列卡死。 */
   var TERMINAL_CODES = [
      "NOT_CONFIGURED", "UNAUTHENTICATED", "FORBIDDEN", "NOT_FOUND",
      "INVALID_REQUEST", "INVALID_ID", "INVALID_REVISION", "INVALID_FILE_NAME",
      "INVALID_FILE_KIND", "INVALID_FILE_CONTENT", "INVALID_PROJECT_NAME",
      "INVALID_PROGRESS", "INVALID_POSITION", "INVALID_DRAFT", "INVALID_SNAPSHOT",
      "FILE_TOO_LARGE", "PROJECT_TOO_LARGE", "PROJECT_FILE_LIMIT", "SNAPSHOT_TOO_LARGE",
      "ACCOUNT_PROJECT_LIMIT", "ACCOUNT_STORAGE_LIMIT",
      "NAME_CONFLICT", "OPERATION_ID_REUSED", "SYNC_CONFLICT", "SERVER_DATA_INVALID"
   ];

   var TOO_LARGE_CODES = ["FILE_TOO_LARGE", "PROJECT_TOO_LARGE", "PROJECT_FILE_LIMIT", "SNAPSHOT_TOO_LARGE"];

   function isTerminal(error) { return TERMINAL_CODES.indexOf(error.code) >= 0; }
   function isTooLarge(error) { return TOO_LARGE_CODES.indexOf(error.code) >= 0; }

   function origin() {
      var protocol = window.location.protocol;
      if (protocol !== "http:" && protocol !== "https:") return null;
      return window.location.origin;
   }

   function setConfiguration(next) {
      if (configuration === next) return;
      configuration = next;
      emit();
   }

   function emit() {
      var snapshot = session();
      listeners.slice().forEach(function (fn) {
         try { fn(snapshot); } catch (e) { /* 订阅者自己的问题不往外扩散 */ }
      });
   }

   function session() {
      return {
         configuration: configuration,
         user: AUTH.user(),
         signedIn: AUTH.isSignedIn()
      };
   }

   async function request(path, options) {
      var opts = options || {};
      var base = origin();
      if (!base) throw new CloudError("NOT_CONFIGURED", "云端功能暂未连接。", 0);
      if (configuration === ABSENT && !opts.probe) throw new CloudError("NOT_CONFIGURED", "云端功能暂未连接。", 0);

      var init = {
         method: opts.method || "GET",
         // 会话是 HttpOnly cookie，必须带上；页面自己看不到也改不了它。
         credentials: "include",
         headers: { accept: "application/json" }
      };
      if (opts.body !== undefined) {
         init.headers["content-type"] = "application/json";
         init.body = JSON.stringify(opts.body);
      }
      if (opts.signal) init.signal = opts.signal;

      var response;
      try {
         response = await fetch(base + path, init);
      } catch (e) {
         throw new CloudError("OFFLINE", "网络暂时不可用，稍后会自动重试。", 0);
      }

      var text = "";
      try { text = await response.text(); } catch (e) { text = ""; }
      var data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }

      /*
       * 服务端的每一条响应都是带 code 的 JSON。拿到别的东西有两种可能：
       * 这个 origin 前面根本没有 API（静态托管返回的是 404 的 HTML 页面），
       * 或者 API 在、但这一次崩了（比如 500 带一段纯文本）。
       * 只有在「还没成功说过话」的时候才判定为未配置；
       * 已经确认过有 API，就当成一次可以重试的失败，不能把云端整个关掉。
       */
      var looksLikeApi = data !== null && typeof data === "object";
      if (!looksLikeApi) {
         if (configuration !== CONFIGURED) {
            setConfiguration(ABSENT);
            throw new CloudError("NOT_CONFIGURED", "云端功能暂未连接。", response.status);
         }
         throw new CloudError("SERVER_ERROR", "服务暂时不可用，稍后会自动重试。", response.status);
      }
      setConfiguration(CONFIGURED);

      if (!response.ok) {
         var code = typeof data.code === "string" ? data.code : "SERVER_ERROR";
         var message = typeof data.message === "string" ? data.message : "请求失败，请稍后再试。";
         if (code === "UNAUTHENTICATED" && AUTH.isSignedIn() && !opts.probe) {
            // 会话已经失效：本地内容一点都不动，只是回到未登录状态。
            AUTH.clear();
            emit();
         }
         throw new CloudError(code, message, response.status, data);
      }
      return data;
   }

   /* ---------------- 会话 ---------------- */

   async function restore() {
      if (restoring) return restoring;
      restoring = (async function () {
         try {
            var data = await request("/auth/me", { probe: true });
            AUTH.set(data.user);
         } catch (error) {
            if (error.code === "OFFLINE") {
               // 断网时保留上一次的公开身份：本地照常用，联网后再核对。
               return session();
            }
            AUTH.clear();
         }
         emit();
         return session();
      })();
      try { return await restoring; } finally { restoring = null; }
   }

   async function registerEmail(email, role, password) {
      return request("/auth/email/register", { method: "POST", body: { email: email, role: role, password: password } });
   }

   /* 登录不带 role：账号自己知道自己是老师还是个人学习者。
      以前带了，选错身份就会被当成密码错误，而且没有任何线索。 */
   async function loginEmail(email, password) {
      var data = await request("/auth/email/login", { method: "POST", body: { email: email, password: password } });
      AUTH.set(data.user);
      emit();
      return data.user;
   }

   async function verifyEmailToken(token) {
      var data = await request("/auth/email/verify", { method: "POST", body: { token: token } });
      AUTH.set(data.user);
      emit();
      return data.user;
   }

   async function activateStudent(username, activationCode, password) {
      var data = await request("/auth/student/activate", {
         method: "POST",
         body: { username: username, activationCode: activationCode, password: password }
      });
      forgetAssignments();
      AUTH.set(data.user);
      emit();
      return data.user;
   }

   /** 学生凭老师念的班级码自己注册，不需要邮箱，注册完直接是登录态。 */
   async function registerStudent(joinCode, displayName, username, password) {
      var data = await request("/auth/student/register", {
         method: "POST",
         body: { joinCode: joinCode, displayName: displayName, username: username, password: password }
      });
      forgetAssignments();
      AUTH.set(data.user);
      emit();
      return data.user;
   }

   async function loginStudent(username, password) {
      var data = await request("/auth/student/login", {
         method: "POST",
         body: { username: username, password: password }
      });
      forgetAssignments();
      AUTH.set(data.user);
      emit();
      return data.user;
   }

   async function logout() {
      try { await request("/auth/logout", { method: "POST" }); } catch (e) { /* 本地照样退出 */ }
      forgetAssignments();
      AUTH.clear();
      emit();
   }

   /*
    * 学生的班级作业。做题页要判断「这道题是不是作业」，账户面板要列出来，
    * 两边都需要同一份数据，所以在这里缓存一次，别让每个页面各拉各的。
    * 非学生角色、未登录或接口不可用时一律是空数组，调用方不需要分情况。
    */
   var assignmentsCache = null;
   var assignmentsLoading = null;

   async function assignments(force) {
      var user = AUTH.user();
      if (!user || user.role !== "student") return [];
      if (assignmentsCache && !force) return assignmentsCache;
      if (assignmentsLoading) return assignmentsLoading;
      assignmentsLoading = (async function () {
         try {
            var data = await request("/api/assignments");
            assignmentsCache = data.assignments || [];
         } catch (error) {
            assignmentsCache = assignmentsCache || [];
         }
         return assignmentsCache;
      })();
      try { return await assignmentsLoading; } finally { assignmentsLoading = null; }
   }

   function forgetAssignments() { assignmentsCache = null; }

   window.CloudClient = {
      CloudError: CloudError,
      assignments: assignments,
      forgetAssignments: forgetAssignments,
      isTerminal: isTerminal,
      isTooLarge: isTooLarge,
      /** 页面能不能跟云端说话。'unknown' 表示还没问过。 */
      configuration: function () { return configuration; },
      available: function () { return Boolean(origin()) && configuration !== ABSENT; },
      session: session,
      subscribe: function (fn) {
         listeners.push(fn);
         return function () { listeners = listeners.filter(function (item) { return item !== fn; }); };
      },
      request: request,
      restore: restore,
      registerEmail: registerEmail,
      loginEmail: loginEmail,
      verifyEmailToken: verifyEmailToken,
      activateStudent: activateStudent,
      registerStudent: registerStudent,
      loginStudent: loginStudent,
      logout: logout
   };

   if (!origin()) setConfiguration(ABSENT);
})();
