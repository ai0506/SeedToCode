/* SyncQueue：把「还没传上去的改动」写在本地，刷新和关页面都不丢。
 *
 * 队列里放的是完整的写操作，不是增量补丁——所以同一个文件的多次修改
 * 可以直接合并成最后一条，重放也不会把内容拼错。
 *
 * 每条操作带自己的 operationId：服务端按它去重，所以「已经写进去了但响应没收到」
 * 的那一次重试不会写第二遍。expectedRevision 不在入队时确定，
 * 由 SyncEngine 在真正发送前从同步元数据里取，否则排队期间拿到的新版本号会作废。
 */
(function () {
   "use strict";

   var STORAGE = window.CAIEStorage;
   var KEY = STORAGE.key.syncQueue;
   var MAX_OPERATIONS = 2000;

   function uuid() {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
      return "op-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
   }

   function emptyState(userId) {
      return { schemaVersion: 1, userId: userId || null, operations: [], blocked: [] };
   }

   var state = (function () {
      var saved = STORAGE.get(KEY, null);
      if (!saved || typeof saved !== "object" || !Array.isArray(saved.operations)) return emptyState(null);
      return {
         schemaVersion: 1,
         userId: typeof saved.userId === "string" ? saved.userId : null,
         operations: saved.operations.filter(function (op) { return op && typeof op.operationId === "string"; }),
         blocked: Array.isArray(saved.blocked) ? saved.blocked : []
      };
   })();

   var inFlight = null;
   var listeners = [];

   function persist() {
      STORAGE.set(KEY, state);
      listeners.slice().forEach(function (fn) {
         try { fn(summary()); } catch (e) { /* 忽略订阅者异常 */ }
      });
   }

   function summary() {
      return { pending: state.operations.length, blocked: state.blocked.slice(), userId: state.userId };
   }

   window.SyncQueue = {
      /**
       * 绑定当前用户。换了人就整份丢掉：上一位的待传改动不能记在这一位账上，
       * 服务端也会因为归属不符直接拒绝。
       */
      bind: function (userId) {
         if (state.userId === userId) return;
         state = emptyState(userId);
         inFlight = null;
         persist();
      },
      userId: function () { return state.userId; },
      summary: summary,
      size: function () { return state.operations.length; },
      list: function () { return state.operations.slice(); },
      blocked: function () { return state.blocked.slice(); },

      /**
       * 入队。同一个 entity 上还没发出去的旧操作直接被顶掉——
       * 内容是全量的，留着旧的既浪费一次往返，也可能把更早的内容写回去。
       */
      enqueue: function (kind, entity, payload) {
         if (!state.userId) return null;
         var operation = {
            operationId: uuid(),
            kind: kind,
            entity: entity,
            payload: payload || {},
            attempts: 0,
            createdAt: Date.now(),
            nextAttemptAt: 0
         };
         state.operations = state.operations.filter(function (op) {
            return op.entity !== entity || op.operationId === inFlight;
         });
         state.blocked = state.blocked.filter(function (item) { return item.entity !== entity; });
         state.operations.push(operation);
         if (state.operations.length > MAX_OPERATIONS) state.operations = state.operations.slice(-MAX_OPERATIONS);
         persist();
         return operation;
      },

      /** 取下一条可以发的操作；退避期内的先跳过。 */
      next: function (now) {
         var at = now || Date.now();
         for (var i = 0; i < state.operations.length; i += 1) {
            if (state.operations[i].nextAttemptAt <= at) return state.operations[i];
         }
         return null;
      },

      markInFlight: function (operationId) { inFlight = operationId; },
      clearInFlight: function () { inFlight = null; },

      done: function (operationId) {
         inFlight = null;
         var before = state.operations.length;
         state.operations = state.operations.filter(function (op) { return op.operationId !== operationId; });
         if (state.operations.length !== before) persist();
      },

      /** 可重试失败：指数退避；服务端若给出窗口结束时间，绝不提前重试。 */
      retryLater: function (operationId, minimumDelayMs) {
         inFlight = null;
         var operation = state.operations.filter(function (op) { return op.operationId === operationId; })[0];
         if (!operation) return;
         operation.attempts += 1;
         var delay = Math.max(
            Math.min(5 * 60 * 1000, 1000 * Math.pow(2, Math.min(8, operation.attempts))),
            Number(minimumDelayMs) || 0
         );
         operation.nextAttemptAt = Date.now() + delay;
         persist();
      },

      /**
       * 不可能靠重试解决的失败（文件过大、重名等）：从队列里拿掉，
       * 但留下一条可见记录——本地内容一个字都不动，只是这一项没有同步上去。
       */
      block: function (operationId, code, message) {
         inFlight = null;
         var operation = state.operations.filter(function (op) { return op.operationId === operationId; })[0];
         state.operations = state.operations.filter(function (op) { return op.operationId !== operationId; });
         if (operation) {
            state.blocked = state.blocked.filter(function (item) { return item.entity !== operation.entity; });
            state.blocked.push({
               entity: operation.entity,
               kind: operation.kind,
               label: operation.payload && operation.payload.name ? operation.payload.name : operation.entity,
               code: code,
               message: message,
               at: Date.now()
            });
            if (state.blocked.length > 50) state.blocked = state.blocked.slice(-50);
         }
         persist();
      },

      clearBlocked: function () {
         if (!state.blocked.length) return;
         state.blocked = [];
         persist();
      },

      subscribe: function (fn) {
         listeners.push(fn);
         return function () { listeners = listeners.filter(function (item) { return item !== fn; }); };
      }
   };
})();
