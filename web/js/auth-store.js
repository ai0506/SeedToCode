/* AuthStore：只保存「当前是谁」这一条公开会话状态。
 *
 * 登录凭据一律不进这里：会话 token 由服务端写在 HttpOnly cookie 里，
 * 页面既读不到也不需要读。这里存的是 /auth/me 返回的公开字段，
 * 目的只有两个：刷新后能先把账户入口画成已登录再去核对，
 * 以及让同步层知道本地队列属于哪个用户——换了人就不能继续用上一个人的队列。
 */
(function () {
   "use strict";

   var STORAGE = window.CAIEStorage;
   var KEY = STORAGE.key.session;

   function sanitize(user) {
      if (!user || typeof user !== "object") return null;
      if (typeof user.id !== "string" || !user.id) return null;
      return {
         id: user.id,
         role: user.role === "teacher" || user.role === "student" || user.role === "learner" ? user.role : "learner",
         email: typeof user.email === "string" ? user.email : null,
         username: typeof user.username === "string" ? user.username : null
      };
   }

   var cached = (function () {
      var saved = STORAGE.get(KEY, null);
      return saved && typeof saved === "object" ? sanitize(saved.user) : null;
   })();

   var listeners = [];

   function emit() {
      listeners.slice().forEach(function (fn) {
         try { fn(cached); } catch (e) { /* 一个订阅者出错不能拖垮其他人 */ }
      });
   }

   window.AuthStore = {
      /** 当前公开身份；未登录或还没核对过时为 null。 */
      user: function () { return cached; },
      userId: function () { return cached ? cached.id : null; },
      isSignedIn: function () { return Boolean(cached); },
      set: function (user) {
         var next = sanitize(user);
         var changed = JSON.stringify(next) !== JSON.stringify(cached);
         cached = next;
         if (next) STORAGE.set(KEY, { user: next, updatedAt: Date.now() });
         else STORAGE.remove(KEY);
         if (changed) emit();
         return cached;
      },
      clear: function () { return window.AuthStore.set(null); },
      subscribe: function (fn) {
         listeners.push(fn);
         return function () { listeners = listeners.filter(function (item) { return item !== fn; }); };
      },
      /** 显示名：学生看用户名，邮箱用户看邮箱。 */
      label: function () {
         if (!cached) return "";
         return cached.username || cached.email || cached.id;
      },
      roleLabel: function () {
         if (!cached) return "";
         return cached.role === "teacher" ? "老师" : cached.role === "student" ? "学生" : "个人学习者";
      }
   };
})();
