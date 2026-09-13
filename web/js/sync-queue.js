/* SyncQueue v2：本地持久化 outbox。
 *
 * 队列本身绝不按长度静默截断。可折叠状态只淘汰同一实体已经被更新的旧 generation；
 * 章末题和作业提交属于不可变事件，永远保留到服务端确认或明确进入可处理状态。
 *
 * 账号切换也不会删除另一账号的队列。当前页面只读取已绑定账号的分桶，避免 A 的
 * 操作在 B 登录时被发送；A 回来后仍能继续自己的重试。旧 v1 队列在首次读取时只做
 * 结构迁移，发送中的记录会恢复为 queued，因为页面关闭时并不知道请求是否已到达，
 * 服务端以 operationId 幂等处理这一次重放。
 */
(function () {
   "use strict";

   var STORAGE = window.CAIEStorage;
   var KEY = STORAGE.key.syncQueue;
   var SCHEMA_VERSION = 2;
   var EVENT_KINDS = { "submission.post": true, "assignment.post": true };

   function uuid() {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
      return "op-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
   }

   function emptyState() { return { schemaVersion: SCHEMA_VERSION, buckets: {} }; }

   function emptyBucket(userId) {
      return { ownerId: userId, operations: [], blocked: [], generations: {} };
   }

   function isEvent(kind) { return EVENT_KINDS[kind] === true; }

   function normaliseOperation(value, ownerId, generation) {
      if (!value || typeof value.operationId !== "string" || !value.operationId) return null;
      var state = value.state;
      /* in_flight 不能跨刷新持有。重放同一个 operationId 是安全的。 */
      if (state === "in_flight") state = "queued";
      if (state !== "queued" && state !== "retry_at") state = "queued";
      return {
         operationId: value.operationId,
         ownerId: ownerId,
         kind: typeof value.kind === "string" ? value.kind : "unknown",
         entity: typeof value.entity === "string" ? value.entity : "unknown:" + value.operationId,
         payload: value.payload && typeof value.payload === "object" ? value.payload : {},
         generation: Number.isSafeInteger(value.generation) && value.generation > 0 ? value.generation : generation,
         immutable: value.immutable === true || isEvent(value.kind),
         state: state,
         attempts: Number.isSafeInteger(value.attempts) && value.attempts >= 0 ? value.attempts : 0,
         createdAt: Number(value.createdAt) || Date.now(),
         nextAttemptAt: Number(value.nextAttemptAt) || 0
      };
   }

   function normaliseBucket(ownerId, raw) {
      var bucket = emptyBucket(ownerId);
      var source = raw && typeof raw === "object" ? raw : {};
      var suppliedGenerations = source.generations && typeof source.generations === "object" ? source.generations : {};
      Object.keys(suppliedGenerations).forEach(function (entity) {
         var value = suppliedGenerations[entity];
         if (Number.isSafeInteger(value) && value > 0) bucket.generations[entity] = value;
      });
      (Array.isArray(source.operations) ? source.operations : []).forEach(function (item) {
         var next = (bucket.generations[item && item.entity] || 0) + 1;
         var operation = normaliseOperation(item, ownerId, next);
         if (!operation) return;
         bucket.generations[operation.entity] = Math.max(bucket.generations[operation.entity] || 0, operation.generation);
         bucket.operations.push(operation);
      });
      bucket.blocked = (Array.isArray(source.blocked) ? source.blocked : []).filter(function (item) {
         return item && typeof item.entity === "string";
      }).map(function (item) {
         return {
            entity: item.entity,
            kind: typeof item.kind === "string" ? item.kind : "unknown",
            label: typeof item.label === "string" ? item.label : item.entity,
            code: typeof item.code === "string" ? item.code : "SERVER_ERROR",
            message: typeof item.message === "string" ? item.message : "同步需要处理。",
            generation: Number.isSafeInteger(item.generation) && item.generation > 0 ? item.generation : (bucket.generations[item.entity] || 1),
            at: Number(item.at) || Date.now()
         };
      });
      return bucket;
   }

   function migrate(saved) {
      if (!saved || typeof saved !== "object") return emptyState();
      if (saved.schemaVersion === SCHEMA_VERSION && saved.buckets && typeof saved.buckets === "object") {
         var state = emptyState();
         Object.keys(saved.buckets).forEach(function (ownerId) {
            if (ownerId) state.buckets[ownerId] = normaliseBucket(ownerId, saved.buckets[ownerId]);
         });
         return state;
      }
      /* v1 只有一个 userId + operations 分桶；不能识别归属的旧记录不发送。 */
      var migrated = emptyState();
      if (typeof saved.userId === "string" && saved.userId) {
         migrated.buckets[saved.userId] = normaliseBucket(saved.userId, saved);
      }
      return migrated;
   }

   var state = migrate(STORAGE.get(KEY, null));
   var activeUserId = null;
   var inFlight = null;
   var listeners = [];

   function activeBucket() {
      if (!activeUserId) return null;
      if (!state.buckets[activeUserId]) state.buckets[activeUserId] = emptyBucket(activeUserId);
      return state.buckets[activeUserId];
   }

   function persist() {
      STORAGE.set(KEY, state);
      listeners.slice().forEach(function (fn) {
         try { fn(summary()); } catch (e) { /* 忽略订阅者异常 */ }
      });
   }

   function summary() {
      var bucket = activeBucket();
      return { pending: bucket ? bucket.operations.length : 0, blocked: bucket ? bucket.blocked.slice() : [], userId: activeUserId };
   }

   function nextGeneration(bucket, entity) {
      var generation = (bucket.generations[entity] || 0) + 1;
      bucket.generations[entity] = generation;
      return generation;
   }

   function hasNewerOperation(bucket, operation) {
      return bucket.operations.some(function (item) {
         return item.entity === operation.entity && item.generation > operation.generation;
      });
   }

   window.SyncQueue = {
      /** 只切换当前账号视图；不删除其他账号的持久化 outbox。 */
      bind: function (userId) {
         activeUserId = typeof userId === "string" && userId ? userId : null;
         inFlight = null;
         if (activeUserId) activeBucket();
         persist();
      },
      userId: function () { return activeUserId; },
      summary: summary,
      size: function () { var bucket = activeBucket(); return bucket ? bucket.operations.length : 0; },
      list: function () { var bucket = activeBucket(); return bucket ? bucket.operations.slice() : []; },
      blocked: function () { var bucket = activeBucket(); return bucket ? bucket.blocked.slice() : []; },

      /**
       * 可折叠状态只移除尚未发送的旧 generation；发送中的请求保留，响应回写时由
       * operationId/generation 区分。不可变事件从不按 entity 合并。
       */
      enqueue: function (kind, entity, payload) {
         var bucket = activeBucket();
         if (!bucket) return null;
         var immutable = isEvent(kind);
         var operation = {
            operationId: uuid(), ownerId: activeUserId, kind: kind, entity: entity, payload: payload || {},
            generation: nextGeneration(bucket, entity), immutable: immutable, state: "queued",
            attempts: 0, createdAt: Date.now(), nextAttemptAt: 0
         };
         if (!immutable) {
            bucket.operations = bucket.operations.filter(function (item) {
               return item.entity !== entity || item.state === "in_flight";
            });
         }
         /* 新 generation 已经具备恢复路径，过期的需要处理记录不再遮住状态。 */
         bucket.blocked = bucket.blocked.filter(function (item) { return item.entity !== entity; });
         bucket.operations.push(operation);
         persist();
         return operation;
      },

      /** 只取当前账号、已到重试时间且未在飞的操作。 */
      next: function (now) {
         var bucket = activeBucket();
         if (!bucket) return null;
         var at = now || Date.now();
         for (var i = 0; i < bucket.operations.length; i += 1) {
            var operation = bucket.operations[i];
            if (operation.state !== "in_flight" && operation.nextAttemptAt <= at) return operation;
         }
         return null;
      },

      markInFlight: function (operationId) {
         var bucket = activeBucket();
         if (!bucket) return;
         var operation = bucket.operations.filter(function (item) { return item.operationId === operationId; })[0];
         if (!operation) return;
         operation.state = "in_flight";
         inFlight = operationId;
         persist();
      },
      clearInFlight: function () {
         var bucket = activeBucket();
         if (bucket && inFlight) {
            var operation = bucket.operations.filter(function (item) { return item.operationId === inFlight; })[0];
            if (operation && operation.state === "in_flight") operation.state = "queued";
         }
         inFlight = null;
      },

      done: function (operationId) {
         var bucket = activeBucket();
         inFlight = null;
         if (!bucket) return;
         var before = bucket.operations.length;
         bucket.operations = bucket.operations.filter(function (item) { return item.operationId !== operationId; });
         if (bucket.operations.length !== before) persist();
      },

      /** 可重试失败：指数退避；服务端若给出窗口结束时间，绝不提前重试。 */
      retryLater: function (operationId, minimumDelayMs) {
         var bucket = activeBucket();
         inFlight = null;
         if (!bucket) return;
         var operation = bucket.operations.filter(function (item) { return item.operationId === operationId; })[0];
         if (!operation) return;
         operation.attempts += 1;
         var delay = Math.max(Math.min(5 * 60 * 1000, 1000 * Math.pow(2, Math.min(8, operation.attempts))), Number(minimumDelayMs) || 0);
         operation.nextAttemptAt = Date.now() + delay;
         operation.state = "retry_at";
         persist();
      },

      /** 永久失败若已经被更新 generation 取代，旧失败不能再遮住新状态。 */
      block: function (operationId, code, message) {
         var bucket = activeBucket();
         inFlight = null;
         if (!bucket) return;
         var operation = bucket.operations.filter(function (item) { return item.operationId === operationId; })[0];
         bucket.operations = bucket.operations.filter(function (item) { return item.operationId !== operationId; });
         if (operation && !hasNewerOperation(bucket, operation)) {
            bucket.blocked = bucket.blocked.filter(function (item) { return item.entity !== operation.entity; });
            bucket.blocked.push({
               entity: operation.entity, kind: operation.kind,
               label: operation.payload && operation.payload.name ? operation.payload.name : operation.entity,
               code: code, message: message, generation: operation.generation, at: Date.now()
            });
         }
         persist();
      },

      clearBlocked: function () {
         var bucket = activeBucket();
         if (!bucket || !bucket.blocked.length) return;
         bucket.blocked = [];
         persist();
      },

      subscribe: function (fn) {
         listeners.push(fn);
         return function () { listeners = listeners.filter(function (item) { return item !== fn; }); };
      }
   };
})();
