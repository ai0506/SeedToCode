/* SyncEngine：pull / push / 冲突。本地永远是工作副本，云端只是另一份。
 *
 * 三条不让步的规则：
 *  1. 本地内容从不因为同步而被悄悄替换。版本对不上时保留本地，把服务端那一份
 *     变成看得见的冲突副本，由使用者自己比对。
 *  2. 队列里的每一条操作都只记「哪个文件」，内容在真正发送前才从本地读——
 *     排队期间又改了几次，传上去的也是最后那一版。
 *  3. 任何网络失败、会话失效或接口不可用都只是「这次没传上去」，
 *     本地编辑、保存和本地运行照常。
 *
 * 页面通过 useProjects / useTeaching 注册适配器：编辑器页只有项目，
 * 教学页只有课程数据。没注册的领域直接跳过，游客不启动这个模块。
 */
(function () {
   "use strict";

   var STORAGE = window.CAIEStorage;
   var CLIENT = window.CloudClient;
   var QUEUE = window.SyncQueue;
   var AUTH = window.AuthStore;
   var KEY = STORAGE.key.syncMeta;

   /* 服务端认的小节号：`2.3` / `2.3.1`，外加章末大题的 `chapterTask`。
      章末大题也要跨设备同步，并且要进入老师可见的班级进度。 */
   var SECTION_PATTERN = /^(?:[0-9]+\.[0-9]+(?:\.[0-9]+)?|chapterTask)$/;
   var MAX_CONFLICT_ROUNDS = 3;

   var projectsAdapter = null;
   var teachingAdapter = null;
   var running = false;
   var busy = false;
   var timer = null;
   var pulling = null;
   var collectTimer = null;
   var conflictRounds = {};
   /* account：服务端在每次拉取时顺带回的账户用量。只在接近上限时才拿来提示，
   平时不显示——界面空间紧张，不值得常驻一个「云端空间」展位。 */
var status = { state: "idle", pending: 0, blocked: [], lastPullAt: 0, lastError: null, account: null };
   var statusListeners = [];

   function uuid() {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
      return "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
   }

   /** 只用来判断「内容变了没有」，不是安全摘要。 */
   function hashOf(value) {
      var text = typeof value === "string" ? value : JSON.stringify(value);
      var hash = 5381;
      for (var i = 0; i < text.length; i += 1) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
      return String(hash >>> 0) + ":" + text.length;
   }

   /* ---------------- 同步元数据 ---------------- */

   function emptyMeta(userId) {
      return {
         schemaVersion: 1,
         userId: userId || null,
         projects: {},
         files: {},
         teaching: { progress: {}, drafts: {}, position: null },
         /*
          * hold：登录这个账号之前就已经在这台设备上的内容。
          *
          * 它们一律不上传。同一台机器上换个人登录（教室里很常见），
          * 上一位留下的项目和完成状态不能进新登录这位的账号——
          * 完成状态是单调的，一旦记上就撤不回来，老师还看得见。
          * 本地这些内容一个字都不动，照常能编辑、能运行，只是不往云端走。
          *
          * previousOwner 为 null 表示这批内容是未登录时攒下的。那种情况下
          * 账户面板会问一次「要不要并入这个账号」，答应了才解除 hold。
          */
         hold: { previousOwner: null, asked: false, projects: {}, files: {}, progress: {}, drafts: {} },
         lastPullAt: 0
      };
   }

   var meta = (function () {
      var saved = STORAGE.get(KEY, null);
      if (!saved || typeof saved !== "object" || saved.schemaVersion !== 1) return emptyMeta(null);
      saved.projects = saved.projects || {};
      saved.files = saved.files || {};
      saved.teaching = saved.teaching || { progress: {}, drafts: {}, position: null };
      saved.teaching.progress = saved.teaching.progress || {};
      saved.teaching.drafts = saved.teaching.drafts || {};
      saved.hold = saved.hold || { previousOwner: null, asked: false, projects: {}, files: {}, progress: {}, drafts: {} };
      /* v1 的 files 曾经以 fileId 为键；迁移到 projectId/fileId，避免旧元数据
         把两个项目中同名 id 合并成一份。无法判断归属的旧条目保留到首次发现文件时处理。

         这段每次载入都会跑，所以**必须幂等**。原来它无条件加前缀，第二次载入就把
         已经是 `项目/文件` 的键变成 `项目/项目/文件`，第三次再长一截。后果不是显性的
         报错：键一旦对不上，syncLocalProjects 里的 seenFiles 就再也匹配不到 meta.files，
         于是**每个本地还在的文件都被判成「已删」**，每次载入都排队推一条 tombstone；
         同时那些文件又被当成没见过的新文件整份重传。实测一次刷新就是 5 条无效 DELETE
         加全量重传，服务端 revision 被白白推高。删除请求只是碰巧被 revision 校验挡成
         409——同一批里的 PUT 先把版本号顶上去了——这是运气，不是设计。 */
      var migratedFiles = {};
      Object.keys(saved.files).forEach(function (legacyId) {
         var entry = saved.files[legacyId];
         var key;
         if (legacyId.indexOf("/") < 0) {
            // 真正的旧键：裸 fileId
            key = entry && entry.projectId ? fileKey(entry.projectId, legacyId) : legacyId;
         } else if (entry && entry.projectId) {
            /* 已经是新形状。顺带修掉此前被重复加前缀的键：真正的 fileId 是最后一段，
               归属以 entry.projectId 为准。正常键经过这一步原样不变。 */
            key = fileKey(entry.projectId, legacyId.slice(legacyId.lastIndexOf("/") + 1));
         } else {
            key = legacyId;
         }
         migratedFiles[key] = entry;
      });
      saved.files = migratedFiles;
      return saved;
   })();

   function saveMeta() { STORAGE.set(KEY, meta); }

   /**
    * 换人登录时，把此刻已经在本地的内容整批挂起。
    * 挂起只影响「要不要上传」，不影响本地读写，也不删除任何东西。
    * 分项目和教学两边各算一次，谁的适配器先到位就先算谁的。
    */
   function captureProjectHold(snapshot) {
      if (!meta.hold.needsProjects) return;
      meta.hold.needsProjects = false;
      snapshot.forEach(function (project) {
         /* 出厂默认、一个字没改过的项目不算「登录前留下的内容」：
            那是编辑器自己建的起始状态，拿它去问「要不要并入」纯属噪音。 */
         if (project.pristine) return;
         meta.hold.projects[project.id] = true;
         (project.files || []).forEach(function (file) { meta.hold.files[fileKey(project.id, file.id)] = true; });
      });
   }

   function captureTeachingHold() {
      if (!meta.hold.needsTeaching) return;
      meta.hold.needsTeaching = false;
      if (teachingAdapter.listCompleted) {
         teachingAdapter.listCompleted().forEach(function (item) {
            meta.hold.progress[item.chapterId + "/" + item.sectionId] = true;
         });
      }
      if (teachingAdapter.listDrafts) {
         teachingAdapter.listDrafts().forEach(function (draft) {
            meta.hold.drafts[draft.chapterId + "/" + draft.taskId] = true;
         });
      }
   }

   function holdIsEmpty(hold) {
      if (!hold) return true;
      /* 「还没算完」只在对应适配器确实存在时才算数：编辑器页没有教学适配器，
         教学那一半永远算不出来，不能因此一直报告「可能还有内容」。 */
      if (hold.needsProjects && projectsAdapter) return false;
      if (hold.needsTeaching && teachingAdapter) return false;
      return !Object.keys(hold.projects).length && !Object.keys(hold.files).length
         && !Object.keys(hold.progress).length && !Object.keys(hold.drafts).length;
   }

   function bindUser(userId) {
      if (meta.userId === userId) { QUEUE.bind(userId); saveMeta(); return; }
      var previousOwner = meta.userId;
      meta = emptyMeta(userId);
      /*
       * 这里只记下「要挂起，上一位是谁」。真正有哪些内容要挂起，等到第一次比对时再算：
       * 登录可能发生在页面注册项目/教学适配器之前，那个时刻去问适配器会得到空集合，
       * 挂起也就形同虚设。
       */
      meta.hold.previousOwner = previousOwner;
      meta.hold.needsProjects = true;
      meta.hold.needsTeaching = true;
      QUEUE.bind(userId);
      saveMeta();
   }

   /* ---------------- 状态广播 ---------------- */

   function setStatus(patch) {
      Object.keys(patch).forEach(function (name) { status[name] = patch[name]; });
      status.pending = QUEUE.size();
      status.blocked = QUEUE.blocked();
      statusListeners.slice().forEach(function (fn) {
         try { fn(Object.assign({}, status)); } catch (e) { /* 忽略订阅者异常 */ }
      });
   }

   /* ---------------- 本地 → 队列 ---------------- */

   /**
    * 把本地项目的当前样子和上次同步的记录比一遍，差异进队列。
    * 删除也从这里得出：元数据里有、本地已经没有的文件就是被删掉的，
    * 于是会以带 revision 的 tombstone 上传，而不是等下一次 pull 把它复活。
    */
   function syncLocalProjects() {
      if (!projectsAdapter || !AUTH.isSignedIn()) return;
      var snapshot = projectsAdapter.collect() || [];
      captureProjectHold(snapshot);
      var seenProjects = {};
      var seenFiles = {};

      snapshot.forEach(function (project) {
         seenProjects[project.id] = true;
         // 登录之前就在这台设备上的内容：本地照常用，但不进这个账号。
         if (meta.hold.projects[project.id]) {
            (project.files || []).forEach(function (file) { seenFiles[fileKey(project.id, file.id)] = true; });
            return;
         }
         var entry = meta.projects[project.id];
         if (!entry) {
            meta.projects[project.id] = { serverId: serverProjectId(project.id), revision: null, name: project.name };
            QUEUE.enqueue("project.put", "project:" + project.id, { projectId: project.id, name: project.name });
         } else if (entry.name !== project.name || entry.revision === null) {
            entry.name = project.name;
            QUEUE.enqueue("project.put", "project:" + project.id, { projectId: project.id, name: project.name });
         }

         (project.files || []).forEach(function (file) {
            var key = fileKey(project.id, file.id);
            seenFiles[key] = true;
            if (meta.hold.files[key] || meta.hold.files[file.id]) return;
            var hash = hashOf(file.content);
            var known = meta.files[key];
            if (!known && meta.files[file.id] && !meta.files[file.id].projectId) {
               known = meta.files[file.id];
               delete meta.files[file.id];
               known.projectId = project.id;
               known.serverId = serverFileId(project.id, file.id);
               known.revision = null;
               meta.files[key] = known;
            }
            if (!known) {
               meta.files[key] = { serverId: serverFileId(project.id, file.id), projectId: project.id, revision: null, hash: null };
               known = meta.files[key];
            }
            if (known.projectId !== project.id) known.projectId = project.id;
            if (known.hash !== hash || known.revision === null) {
               QUEUE.enqueue("file.put", "file:" + project.id + ":" + file.id, {
                  projectId: project.id, fileId: file.id, name: file.name
               });
            }
         });
      });

      Object.keys(meta.files).forEach(function (key) {
         var known = meta.files[key];
         if (key.indexOf("/") < 0) { delete meta.files[key]; return; }
         var fileId = key.slice(key.indexOf("/") + 1);
         if (seenFiles[key]) return;
         if (!known || known.revision === null) { delete meta.files[key]; return; }
         QUEUE.enqueue("file.delete", "file:" + known.projectId + ":" + fileId, {
            projectId: known.projectId, fileId: fileId
         });
      });

      Object.keys(meta.projects).forEach(function (projectId) {
         if (seenProjects[projectId]) return;
         var known = meta.projects[projectId];
         if (!known || known.revision === null) { delete meta.projects[projectId]; return; }
         QUEUE.enqueue("project.delete", "project:" + projectId, { projectId: projectId });
      });

      saveMeta();
      setStatus({});
   }

   function syncLocalTeaching() {
      if (!teachingAdapter || !AUTH.isSignedIn()) return;
      captureTeachingHold();
      if (teachingAdapter.listCompleted) {
         teachingAdapter.listCompleted().forEach(function (item) {
            if (!SECTION_PATTERN.test(item.sectionId)) return;
            var key = item.chapterId + "/" + item.sectionId;
            if (meta.teaching.progress[key] || meta.hold.progress[key]) return;
            QUEUE.enqueue("progress.put", "progress:" + key, { chapterId: item.chapterId, sectionId: item.sectionId });
         });
      }
      if (teachingAdapter.listDrafts) {
         teachingAdapter.listDrafts().forEach(function (draft) {
            var key = draft.chapterId + "/" + draft.taskId;
            if (meta.hold.drafts[key]) return;
            var known = meta.teaching.drafts[key];
            var hash = hashOf(draft.source);
            if (known && known.hash === hash) return;
            QUEUE.enqueue("draft.put", "draft:" + key, { chapterId: draft.chapterId, taskId: draft.taskId });
         });
      }
      saveMeta();
      setStatus({});
   }

   /* ---------------- 队列 → 服务端 ---------------- */

   /*
    * 本地项目 id 里有 `project-default` 这种所有人都一样的常量，
    * 而服务端的项目 id 是全局的：直接拿本地 id 当服务端 id，
    * 第二个用户就会一直撞在第一个用户已经占住的那一条上，而且永远撞。
    * 所以服务端 id 里带上当前用户的短哈希：同一个人换设备算出的还是同一个，
    * 不同的人一定不同。哈希只用来分配 id，不承载任何身份信息。
    */
   function serverProjectId(projectId) {
      var owner = meta.userId || AUTH.userId() || "anonymous";
      return projectId + "." + shortHash(owner);
   }

   function shortHash(value) {
      var hash = 2166136261;
      for (var i = 0; i < value.length; i += 1) {
         hash ^= value.charCodeAt(i);
         hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
      }
      return hash.toString(36);
   }

   function projectEntry(projectId) {
      if (!meta.projects[projectId]) meta.projects[projectId] = { serverId: serverProjectId(projectId), revision: null, name: "" };
      return meta.projects[projectId];
   }

   /* 服务端的 project_files.id 是全局主键，不是「项目内唯一」：
      `doc-main` 这种出厂就固定的 id 被一个用户占掉之后，别人再也建不出来。
      和项目 id 同样处理——带上用户短哈希，同一个人跨设备算出的仍然是同一个。 */
   function fileKey(projectId, fileId) { return projectId + "/" + fileId; }

   function serverFileId(projectId, fileId) {
      var owner = meta.userId || AUTH.userId() || "anonymous";
      return projectId + "." + fileId + "." + shortHash(owner);
   }

   function fileEntry(projectId, fileId) {
      var key = fileKey(projectId, fileId);
      if (!meta.files[key]) meta.files[key] = { serverId: serverFileId(projectId, fileId), projectId: projectId, revision: null, hash: null };
      return meta.files[key];
   }

   async function send(operation) {
      var payload = operation.payload || {};
      if (operation.kind === "project.put") return sendProjectPut(operation, payload);
      if (operation.kind === "project.delete") return sendProjectDelete(operation, payload);
      if (operation.kind === "file.put") return sendFilePut(operation, payload);
      if (operation.kind === "file.delete") return sendFileDelete(operation, payload);
      if (operation.kind === "progress.put") return sendProgress(operation, payload);
      if (operation.kind === "position.put") return sendPosition(operation, payload);
      if (operation.kind === "draft.put") return sendDraft(operation, payload);
      if (operation.kind === "submission.post") return sendSubmission(operation, payload);
      if (operation.kind === "assignment.post") return sendAssignmentSubmission(operation, payload);
      return { done: true };
   }

   async function sendProjectPut(operation, payload) {
      var local = (projectsAdapter && projectsAdapter.findProject) ? projectsAdapter.findProject(payload.projectId) : null;
      if (!local) return { done: true };
      var entry = projectEntry(payload.projectId);
      var result = await CLIENT.request("/api/projects/" + encodeURIComponent(entry.serverId), {
         method: "PUT",
         body: { operationId: operation.operationId, expectedRevision: entry.revision, name: local.name }
      });
      entry.revision = result.project.revision;
      entry.name = local.name;
      saveMeta();
      return { done: true };
   }

   async function sendProjectDelete(operation, payload) {
      var entry = meta.projects[payload.projectId];
      if (!entry || entry.revision === null) { delete meta.projects[payload.projectId]; saveMeta(); return { done: true }; }
      await CLIENT.request("/api/projects/" + encodeURIComponent(entry.serverId), {
         method: "DELETE",
         body: { operationId: operation.operationId, expectedRevision: entry.revision }
      });
      delete meta.projects[payload.projectId];
      Object.keys(meta.files).forEach(function (key) {
         if (meta.files[key].projectId === payload.projectId) delete meta.files[key];
      });
      saveMeta();
      return { done: true };
   }

   async function sendFilePut(operation, payload) {
      var local = (projectsAdapter && projectsAdapter.findFile) ? projectsAdapter.findFile(payload.projectId, payload.fileId) : null;
      // 排队期间被删掉了：删除操作自己会排进来，这一条直接作废。
      if (!local) return { done: true };
      var project = projectEntry(payload.projectId);
      var entry = fileEntry(payload.projectId, payload.fileId);
      var result = await CLIENT.request(
         "/api/projects/" + encodeURIComponent(project.serverId) + "/files/" + encodeURIComponent(entry.serverId),
         {
            method: "PUT",
            body: {
               operationId: operation.operationId,
               expectedRevision: entry.revision,
               kind: local.kind,
               name: local.name,
               content: local.content,
               deviceId: STORAGE.deviceId()
            }
         }
      );
      entry.revision = result.file.revision;
      entry.hash = hashOf(local.content);
      entry.projectId = payload.projectId;
      saveMeta();
      return { done: true };
   }

   async function sendFileDelete(operation, payload) {
      var key = fileKey(payload.projectId, payload.fileId);
      var entry = meta.files[key];
      if (!entry || entry.revision === null) { delete meta.files[key]; saveMeta(); return { done: true }; }
      var project = meta.projects[payload.projectId];
      if (!project) { delete meta.files[key]; saveMeta(); return { done: true }; }
      await CLIENT.request(
         "/api/projects/" + encodeURIComponent(project.serverId) + "/files/" + encodeURIComponent(entry.serverId),
         {
            method: "DELETE",
            body: { operationId: operation.operationId, expectedRevision: entry.revision, deviceId: STORAGE.deviceId() }
         }
      );
      delete meta.files[key];
      saveMeta();
      return { done: true };
   }

   async function sendProgress(operation, payload) {
      // 只往「已完成」这个方向合并：completed 永远是 true，绝不上传 false。
      await CLIENT.request(
         "/api/teaching/progress/" + encodeURIComponent(payload.chapterId) + "/" + encodeURIComponent(payload.sectionId),
         { method: "PUT", body: { completed: true } }
      );
      meta.teaching.progress[payload.chapterId + "/" + payload.sectionId] = true;
      saveMeta();
      return { done: true };
   }

   async function sendPosition(operation, payload) {
      // 只有章号和小节号。scrollTop 是这台设备的事，既不上传也不恢复。
      var result = await CLIENT.request("/api/teaching/position", {
         method: "PUT",
         body: { chapterId: payload.chapterId, sectionId: payload.sectionId }
      });
      meta.teaching.position = {
         chapterId: result.position.chapterId,
         sectionId: result.position.sectionId,
         revision: result.position.revision,
         updatedAt: result.position.updatedAt
      };
      saveMeta();
      return { done: true };
   }

   async function sendDraft(operation, payload) {
      var source = teachingAdapter && teachingAdapter.readDraft
         ? teachingAdapter.readDraft(payload.chapterId, payload.taskId)
         : null;
      if (source == null) return { done: true };
      var key = payload.chapterId + "/" + payload.taskId;
      var known = meta.teaching.drafts[key] || { revision: null, hash: null };
      var result = await CLIENT.request(
         "/api/practice-drafts/" + encodeURIComponent(payload.chapterId) + "/" + encodeURIComponent(payload.taskId),
         {
            method: "PUT",
            body: {
               operationId: operation.operationId,
               expectedRevision: known.revision,
               source: source,
               deviceId: STORAGE.deviceId()
            }
         }
      );
      meta.teaching.drafts[key] = { revision: result.draft.revision, hash: hashOf(source) };
      saveMeta();
      return { done: true };
   }

   /*
    * 提交记录是这一刻按下「提交」的那一份，不是「这道题现在写成什么样」——
    * 所以它是队列里唯一把内容放进 payload 的操作。别的操作在发送前重新读本地，
    * 这一条如果那样做，排队期间又改了几笔就会把改后的内容记成当时的提交。
    * entity 按 submissionId 唯一，因此同一道题的多次提交不会互相顶掉。
    */
   async function sendSubmission(operation, payload) {
      var result = await CLIENT.request(
         "/api/practice-submissions/" + encodeURIComponent(payload.chapterId) + "/" + encodeURIComponent(payload.taskId),
         {
            method: "POST",
            body: {
               submissionId: payload.submissionId,
               answerContent: payload.source,
               deviceId: STORAGE.deviceId(),
               clientVersion: payload.clientVersion
            }
         }
      );
      return { done: true, submission: result.submission };
   }

   /*
    * 班级作业的提交。和个人提交一样把内容放进 payload：记的是按下「提交」
    * 那一刻的那一份。服务端只收答案内容，分数由它用已发布题目重新判。
    * entity 按 submissionId 唯一，同一道题交多次不会互相顶掉。
    */
   async function sendAssignmentSubmission(operation, payload) {
      var result = await CLIENT.request("/api/assignments/" + encodeURIComponent(payload.assignmentId) + "/submissions", {
         method: "POST",
         body: {
            taskId: payload.taskId,
            answerContent: payload.source,
            clientVersion: payload.clientVersion
         }
      });
      return { done: true, submission: result.submission };
   }

   /* ---------------- 冲突 ---------------- */

   function bumpConflict(entity) {
      conflictRounds[entity] = (conflictRounds[entity] || 0) + 1;
      return conflictRounds[entity] <= MAX_CONFLICT_ROUNDS;
   }

   async function resolveConflict(operation, error) {
      var payload = operation.payload || {};
      if (!bumpConflict(operation.entity)) return false;

      if (operation.kind === "project.put") {
         // 项目这一层只有名字。采用服务端版本号后把本地名字再写一次，
         // 代码内容不受影响，也就不需要副本。
         var projectServer = error.server;
         var entry = projectEntry(payload.projectId);
         if (projectServer && projectServer.deletedAt) {
            /* 另一台设备删掉了这个项目，本地这一份还在。
               tombstone 保持原样，本地项目换一个新的服务端 id 重新建；
               它名下的文件也要跟着改到新项目下，否则会一直往一条已删的记录里写。 */
            entry.serverId = uuid();
            entry.revision = null;
            Object.keys(meta.files).forEach(function (key) {
               if (meta.files[key].projectId !== payload.projectId) return;
               meta.files[key].serverId = serverFileId(payload.projectId, key.slice(key.indexOf("/") + 1));
               meta.files[key].revision = null;
               meta.files[key].hash = null;
            });
            saveMeta();
            QUEUE.enqueue("project.put", operation.entity, payload);
            return true;
         }
         entry.revision = projectServer && typeof projectServer.revision === "number" ? projectServer.revision : null;
         saveMeta();
         QUEUE.enqueue("project.put", operation.entity, payload);
         return true;
      }

      if (operation.kind === "project.delete") {
         delete meta.projects[payload.projectId];
         saveMeta();
         return false;
      }

      if (operation.kind === "file.delete") {
         // 服务端那边已经是 tombstone，或者版本对不上。删除意图已经达成或已作废。
         delete meta.files[fileKey(payload.projectId, payload.fileId)];
         saveMeta();
         return false;
      }

      if (operation.kind === "file.put") return resolveFileConflict(operation, error);
      if (operation.kind === "draft.put") return resolveDraftConflict(operation, error);
      return false;
   }

   async function resolveFileConflict(operation, error) {
      var payload = operation.payload;
      var entry = fileEntry(payload.projectId, payload.fileId);
      var server = error.server;

      if (!server) {
         // 服务端没有这个文件，我们却带了版本号：元数据过期，改成新建。
         entry.revision = null;
         saveMeta();
         QUEUE.enqueue("file.put", operation.entity, payload);
         return true;
      }
      if (server.deletedAt) {
         /* 另一台设备把它删了，但本地这一份还有内容。
            删除意图照样尊重——旧的 fileId 保持 tombstone，
            本地内容换一个新的服务端 id 重新建，不去复活已删除的那条记录。 */
         entry.serverId = uuid();
         entry.revision = null;
         entry.hash = null;
         saveMeta();
         QUEUE.enqueue("file.put", operation.entity, payload);
         return true;
      }

      // 真正的版本冲突：先把服务端那一版完整取回来，作为看得见的副本落到本地。
      var project = projectEntry(payload.projectId);
      var serverContent = null;
      try {
         var fetched = await CLIENT.request(
            "/api/projects/" + encodeURIComponent(project.serverId) + "/files/" + encodeURIComponent(entry.serverId)
         );
         serverContent = fetched.file;
      } catch (e) { serverContent = null; }
      if (!serverContent) {
         /* 拿不到服务端那一份就绝不继续推：那会把另一台设备的内容无声盖掉。
            版本号保持不动，这条操作稍后重来。 */
         conflictRounds[operation.entity] = 0;
         QUEUE.enqueue("file.put", operation.entity, payload);
         QUEUE.retryLater(QUEUE.list()[QUEUE.list().length - 1].operationId);
         return true;
      }

      var adoptedServer = projectsAdapter && projectsAdapter.addConflictCopy
         && projectsAdapter.addConflictCopy(payload.projectId, payload.fileId, serverContent) === true;
      entry.revision = server.revision;
      if (adoptedServer) {
         // 本地那一份只是没动过的出厂内容，已经换成云端版本，没有要推上去的东西。
         entry.hash = hashOf(serverContent.content);
         saveMeta();
         return true;
      }
      saveMeta();
      // 本地内容依旧是本地的：采用服务端版本号之后原样再推一次。
      QUEUE.enqueue("file.put", operation.entity, payload);
      return true;
   }

   async function resolveDraftConflict(operation, error) {
      var payload = operation.payload;
      var key = payload.chapterId + "/" + payload.taskId;
      var server = error.server;
      if (!server) {
         meta.teaching.drafts[key] = { revision: null, hash: null };
         saveMeta();
         QUEUE.enqueue("draft.put", operation.entity, payload);
         return true;
      }
      if (teachingAdapter && teachingAdapter.addDraftConflict) {
         teachingAdapter.addDraftConflict(payload.chapterId, payload.taskId, server.source, server.revision);
      }
      meta.teaching.drafts[key] = { revision: server.revision, hash: null };
      saveMeta();
      QUEUE.enqueue("draft.put", operation.entity, payload);
      return true;
   }

   /* ---------------- 推送循环 ---------------- */

   function schedule(delay) {
      if (!running) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { timer = null; void pushOnce(); }, delay === undefined ? 250 : delay);
   }

   async function pushOnce() {
      if (!running || busy || !AUTH.isSignedIn()) return;
      var operation = QUEUE.next();
      if (!operation) {
         setStatus({ state: "idle" });
         if (QUEUE.size()) schedule(5000);
         return;
      }
      busy = true;
      QUEUE.markInFlight(operation.operationId);
      setStatus({ state: "syncing" });
      try {
         await send(operation);
         conflictRounds[operation.entity] = 0;
         QUEUE.done(operation.operationId);
         setStatus({ lastError: null });
      } catch (error) {
         await handleFailure(operation, error);
      } finally {
         busy = false;
         QUEUE.clearInFlight();
         if (running) schedule(QUEUE.next() ? 120 : 4000);
      }
   }

   async function handleFailure(operation, error) {
      var code = error && error.code;
      if (code === "OFFLINE") {
         QUEUE.retryLater(operation.operationId);
         setStatus({ state: "offline", lastError: null });
         return;
      }
      if (code === "UNAUTHENTICATED" || code === "NOT_CONFIGURED") {
         // 会话没了或接口不在：待传的改动原样留着，等下次登录继续。
         QUEUE.retryLater(operation.operationId);
         setStatus({ state: "paused", lastError: null });
         stop();
         return;
      }
      if (code === "SYNC_CONFLICT") {
         var handled = false;
         try { handled = await resolveConflict(operation, error); } catch (e) { handled = false; }
         QUEUE.done(operation.operationId);
         setStatus({ lastError: handled ? null : { code: code, message: error.message } });
         return;
      }
      if (code === "NOT_FOUND" && (operation.kind === "file.put" || operation.kind === "file.delete")) {
         // 项目还没在服务端建起来：补一条项目写入，文件这条稍后重试。
         QUEUE.enqueue("project.put", "project:" + operation.payload.projectId, {
            projectId: operation.payload.projectId,
            name: (projectsAdapter && projectsAdapter.findProject
               && (projectsAdapter.findProject(operation.payload.projectId) || {}).name) || "我的项目"
         });
         QUEUE.retryLater(operation.operationId);
         return;
      }
      if (CLIENT.isTerminal(error)) {
         QUEUE.block(operation.operationId, code, error.message);
         setStatus({ lastError: { code: code, message: error.message, tooLarge: CLIENT.isTooLarge(error) } });
         return;
      }
      var retryAfterSeconds = Number(error && error.extra && error.extra.retryAfterSeconds);
      QUEUE.retryLater(operation.operationId, retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 0);
      setStatus({ state: "idle", lastError: { code: code || "SERVER_ERROR", message: (error && error.message) || "同步暂时失败。" } });
   }

   /* ---------------- 拉取 ---------------- */

   async function pullProjects() {
      if (!projectsAdapter) return;
      var data = await CLIENT.request("/api/projects");
      var pendingDeletes = {};
      QUEUE.list().forEach(function (op) {
         if (op.kind === "project.delete") pendingDeletes["project:" + op.payload.projectId] = true;
         if (op.kind === "file.delete") pendingDeletes["file:" + op.payload.projectId + ":" + op.payload.fileId] = true;
      });
      var localById = {};
      (projectsAdapter.collect() || []).forEach(function (project) {
         localById[project.id] = project;
         (project.files || []).forEach(function (file) { file.projectId = project.id; });
      });
      var serverIdToLocal = {};
      Object.keys(meta.projects).forEach(function (localId) { serverIdToLocal[meta.projects[localId].serverId] = localId; });
      var serverFileToLocal = {};
      Object.keys(meta.files).forEach(function (key) {
         var entry = meta.files[key];
         serverFileToLocal[entry.serverId] = key;
      });

      if (data.account) setStatus({ account: data.account });

      (data.projects || []).forEach(function (project) {
         var localProjectId = serverIdToLocal[project.id] || project.id;
         if (pendingDeletes["project:" + localProjectId]) return;
         if (project.deletedAt) {
            // 服务端的删除是带 revision 的 tombstone：本地这一份没改过才跟着删。
            var knownProject = meta.projects[localProjectId];
            if (knownProject && localById[localProjectId] && knownProject.revision !== null
               && knownProject.revision < project.revision && projectsAdapter.removeProject
               && projectsAdapter.removeProject(localProjectId)) {
               delete meta.projects[localProjectId];
               Object.keys(meta.files).forEach(function (key) {
                  if (meta.files[key].projectId === localProjectId) delete meta.files[key];
               });
            }
            return;
         }
         var known = meta.projects[localProjectId];
         var local = localById[localProjectId];
         if (!local) {
            if (!projectsAdapter.applyProject) return;
            projectsAdapter.applyProject({ id: localProjectId, name: project.name });
            local = { id: localProjectId, name: project.name, files: [] };
            localById[localProjectId] = local;
         } else if (known && known.revision !== null && known.revision < project.revision
            && local.name !== project.name && projectsAdapter.renameProject) {
            projectsAdapter.renameProject(localProjectId, project.name);
            local.name = project.name;
         }
         meta.projects[localProjectId] = {
            serverId: project.id,
            revision: project.revision,
            name: known && known.name !== undefined && local.name !== project.name ? known.name : project.name
         };

         (project.files || []).forEach(function (file) {
            var mappedKey = serverFileToLocal[file.id] || fileKey(localProjectId, file.id);
            var localFileId = mappedKey.slice(mappedKey.indexOf("/") + 1);
            if (pendingDeletes["file:" + localProjectId + ":" + localFileId]) return;
            var knownFile = meta.files[mappedKey];
            var localFile = (local.files || []).filter(function (item) { return item.id === localFileId; })[0];

            if (file.deletedAt) {
               if (!localFile || !knownFile || knownFile.revision === null) return;
               var unchanged = knownFile.hash !== null && knownFile.hash === hashOf(localFile.content);
               if (unchanged && knownFile.revision < file.revision && projectsAdapter.removeFile) {
                  projectsAdapter.removeFile(localProjectId, localFileId);
                  delete meta.files[mappedKey];
               }
               // 本地改过：内容留着，推送时会在新的服务端 id 下重建，不复活已删的那条。
               return;
            }

            var serverHash = hashOf(file.content);
            if (!localFile) {
               if (knownFile && knownFile.revision !== null) return; // 本地删过，等 tombstone 上传
               if (!projectsAdapter.applyFile) return;
               projectsAdapter.applyFile(localProjectId, {
                  id: localFileId, kind: file.kind, name: file.name, content: file.content
               });
               meta.files[mappedKey] = { serverId: file.id, projectId: localProjectId, revision: file.revision, hash: serverHash };
               return;
            }

            var localHash = hashOf(localFile.content);
            if (localHash === serverHash) {
               meta.files[mappedKey] = { serverId: file.id, projectId: localProjectId, revision: file.revision, hash: serverHash };
               return;
            }
            if (knownFile && knownFile.revision !== null && knownFile.hash === localHash) {
               /* 上次同步之后本地这一份一个字都没动过，两边没有分叉：
                  这是另一台设备的更新，直接跟上就行，不是冲突。 */
               if (projectsAdapter.applyFile) {
                  projectsAdapter.applyFile(localProjectId, {
                     id: localFileId, kind: file.kind, name: file.name, content: file.content
                  });
               }
               meta.files[mappedKey] = { serverId: file.id, projectId: localProjectId, revision: file.revision, hash: serverHash };
               return;
            }
            if (knownFile && knownFile.revision === file.revision) {
               // 本地领先一步：保持原样，等推送。
               return;
            }
            // 两边都动过：本地这一份原封不动，服务端那一份落成看得见的副本。
            var adopted = projectsAdapter.addConflictCopy
               && projectsAdapter.addConflictCopy(localProjectId, localFileId, file) === true;
            meta.files[mappedKey] = {
               serverId: file.id, projectId: localProjectId, revision: file.revision,
               hash: adopted ? serverHash : null
            };
         });
      });
      saveMeta();
      if (projectsAdapter.afterPull) projectsAdapter.afterPull();
   }

   async function pullTeaching() {
      if (!teachingAdapter) return;
      if (teachingAdapter.applyCompleted) {
         var progress = await CLIENT.request("/api/teaching/progress");
         var completed = (progress.progress || []).filter(function (item) { return item.completed; });
         completed.forEach(function (item) { meta.teaching.progress[item.chapterId + "/" + item.sectionId] = true; });
         // 单调合并：只会把「还没完成」变成「已完成」，不会反向回退。
         teachingAdapter.applyCompleted(completed.map(function (item) {
            return { chapterId: item.chapterId, sectionId: item.sectionId };
         }));
      }
      if (teachingAdapter.applyPosition) {
         var positionData = await CLIENT.request("/api/teaching/position");
         var position = positionData.position;
         if (position) {
            /* 用服务端自己的 revision 判断新旧，不比本地时间戳：
               页面一打开就会存一次当前位置，本地时间永远是「刚刚」，
               那样服务端的位置就再也追不上了。
               这台设备还没同步过位置，或者上次同步之后别处又翻了页，才跟过去。 */
            var lastSeen = meta.teaching.position;
            if (!lastSeen || position.revision > lastSeen.revision) {
               // 只给章号和小节号，scrollTop 由这台设备自己决定。
               teachingAdapter.applyPosition({ chapterId: position.chapterId, sectionId: position.sectionId });
            }
            meta.teaching.position = {
               chapterId: position.chapterId, sectionId: position.sectionId,
               revision: position.revision, updatedAt: position.updatedAt
            };
         }
      }
      if (teachingAdapter.applyDraft) {
         var drafts = await CLIENT.request("/api/practice-drafts");
         (drafts.drafts || []).forEach(function (draft) {
            var key = draft.chapterId + "/" + draft.taskId;
            var local = teachingAdapter.readDraft ? teachingAdapter.readDraft(draft.chapterId, draft.taskId) : null;
            var known = meta.teaching.drafts[key];
            var serverHash = hashOf(draft.source);
            if (local == null) {
               teachingAdapter.applyDraft(draft.chapterId, draft.taskId, draft.source);
               meta.teaching.drafts[key] = { revision: draft.revision, hash: serverHash };
               return;
            }
            if (hashOf(local) === serverHash) {
               meta.teaching.drafts[key] = { revision: draft.revision, hash: serverHash };
               return;
            }
            if (known && known.revision !== null && known.hash === hashOf(local) && teachingAdapter.replaceDraft) {
               // 上次同步之后本地没改过：另一台设备写的新版本，直接跟上。
               teachingAdapter.replaceDraft(draft.chapterId, draft.taskId, draft.source);
               meta.teaching.drafts[key] = { revision: draft.revision, hash: serverHash };
               return;
            }
            if (known && known.revision === draft.revision) return; // 本地领先，等推送
            if (teachingAdapter.addDraftConflict) {
               teachingAdapter.addDraftConflict(draft.chapterId, draft.taskId, draft.source, draft.revision);
            }
            meta.teaching.drafts[key] = { revision: draft.revision, hash: null };
         });
      }
      saveMeta();
      if (teachingAdapter.afterPull) teachingAdapter.afterPull();
   }

   async function pull() {
      if (!AUTH.isSignedIn()) return;
      if (pulling) return pulling;
      pulling = (async function () {
         setStatus({ state: "syncing" });
         try {
            // 先把本地的改动排进队列再拉：否则刚删掉的文件会被这一次 pull 领回来。
            syncLocalProjects();
            syncLocalTeaching();
            await pullProjects();
            await pullTeaching();
            meta.lastPullAt = Date.now();
            saveMeta();
            setStatus({ state: "idle", lastPullAt: meta.lastPullAt, lastError: null });
            // pull 可能又建了冲突副本或新文件，再比一遍。
            syncLocalProjects();
            syncLocalTeaching();
         } catch (error) {
            if (error && error.code === "OFFLINE") setStatus({ state: "offline" });
            else if (error && (error.code === "UNAUTHENTICATED" || error.code === "NOT_CONFIGURED")) setStatus({ state: "paused" });
            else setStatus({ state: "idle", lastError: { code: (error && error.code) || "SERVER_ERROR", message: (error && error.message) || "同步暂时失败。" } });
         }
      })();
      try { await pulling; } finally { pulling = null; schedule(200); }
   }

   function start() {
      if (!AUTH.isSignedIn() || !CLIENT.available()) return;
      bindUser(AUTH.userId());
      if (running) { schedule(200); return; }
      running = true;
      setStatus({ state: "idle" });
      schedule(200);
   }

   function stop() {
      running = false;
      if (timer) { clearTimeout(timer); timer = null; }
   }

   window.addEventListener("online", function () { if (running) schedule(300); });

   window.SyncEngine = {
      // 教学页的进度/草稿和阅读位置分别由两个文件注册，所以是合并而不是替换。
      useProjects: function (adapter) { projectsAdapter = Object.assign(projectsAdapter || {}, adapter); },
      useTeaching: function (adapter) { teachingAdapter = Object.assign(teachingAdapter || {}, adapter); },
      start: start,
      stop: stop,
      isRunning: function () { return running; },
      pull: pull,
      /**
       * 本地存盘之后调用：算出差异、排队、尽快推送。
       * 每次保存都要把所有项目的所有文件算一遍哈希，所以压一下频率；
       * 本地保存本身不等这里，落盘早就完成了。
       */
      noteLocalChange: function () {
         if (!running) return;
         if (collectTimer) clearTimeout(collectTimer);
         collectTimer = setTimeout(function () {
            collectTimer = null;
            syncLocalProjects();
            syncLocalTeaching();
            schedule(200);
         }, 400);
      },
      noteProgress: function (chapterId, sectionId) {
         if (!running || !SECTION_PATTERN.test(String(sectionId))) return;
         var key = chapterId + "/" + sectionId;
         // 登录之后自己完成的这一节，就是这个账号的事，不再受挂起影响。
         if (meta.hold.progress[key]) { delete meta.hold.progress[key]; saveMeta(); }
         if (meta.teaching.progress[key]) return;
         QUEUE.enqueue("progress.put", "progress:" + key, { chapterId: chapterId, sectionId: sectionId });
         schedule(400);
      },
      notePosition: function (chapterId, sectionId) {
         if (!running || !SECTION_PATTERN.test(String(sectionId))) return;
         QUEUE.enqueue("position.put", "position", { chapterId: chapterId, sectionId: sectionId });
         schedule(1500);
      },
      noteDraft: function (chapterId, taskId) {
         if (!running) return;
         var draftKey = chapterId + "/" + taskId;
         if (meta.hold.drafts[draftKey]) { delete meta.hold.drafts[draftKey]; saveMeta(); }
         QUEUE.enqueue("draft.put", "draft:" + chapterId + "/" + taskId, { chapterId: chapterId, taskId: taskId });
         schedule(600);
      },
      /**
       * 按下「提交」的那一刻记一条不可变的提交记录。分数不上传：
       * 服务端会用已发布的题目重新判分，客户端算出的结果只用于当场展示。
       * 入队即返回，判题和界面一点都不等它。
       */
      /**
       * 交一份班级作业。服务端重新判分，客户端不上传分数。
       * 排队即返回，判题界面一点都不等它；断网时留在队列里，恢复后补交。
       */
      noteAssignmentSubmission: function (assignmentId, taskId, source, clientVersion) {
         if (!running) return null;
         var submissionId = uuid();
         QUEUE.enqueue("assignment.post", "assignment-submission:" + submissionId, {
            submissionId: submissionId,
            assignmentId: assignmentId,
            taskId: taskId,
            source: source,
            clientVersion: clientVersion || null
         });
         schedule(300);
         return submissionId;
      },
      noteSubmission: function (chapterId, taskId, source, clientVersion) {
         if (!running) return null;
         var submissionId = uuid();
         QUEUE.enqueue("submission.post", "submission:" + submissionId, {
            submissionId: submissionId,
            chapterId: chapterId,
            taskId: taskId,
            source: source,
            clientVersion: clientVersion || null
         });
         schedule(300);
         return submissionId;
      },
      /**
       * 云端运行要求 projectId 是服务端上一个真实存在、属于当前用户的项目——
       * 它只用于归属和权限，执行内容仍然完全以请求里的快照为准。
       * 这里只保证「项目这条记录在」，不等文件同步完成。
       */
      ensureProject: async function (localProjectId, name) {
         /*
          * hold 不只是「不要同步」：云端运行也会把不可变快照交给服务端。
          * 若允许它穿过这里，上一位用户的代码会在新账号名下被传输、计费，
          * 即使最终不写进 project_files 也已经违反了本机账号隔离。
          */
         if (meta.hold && (meta.hold.needsProjects || meta.hold.projects[localProjectId])) {
            var heldError = new Error("这个本地项目尚未归入当前账号，不能使用云端运行。");
            heldError.code = "LOCAL_PROJECT_HELD";
            throw heldError;
         }
         var entry = projectEntry(localProjectId);
         if (entry.revision !== null) return entry.serverId;
         var operationId = uuid();
         try {
            var result = await CLIENT.request("/api/projects/" + encodeURIComponent(entry.serverId), {
               method: "PUT",
               body: { operationId: operationId, expectedRevision: null, name: name || entry.name || "我的项目" }
            });
            entry.revision = result.project.revision;
            entry.name = name || entry.name;
            saveMeta();
            return entry.serverId;
         } catch (error) {
            if (error && error.code === "SYNC_CONFLICT" && error.server && !error.server.deletedAt) {
               // 已经存在（多半是另一台设备建的），直接沿用它的版本号。
               entry.revision = error.server.revision;
               saveMeta();
               return entry.serverId;
            }
            if (error && error.code === "SYNC_CONFLICT" && error.server && error.server.deletedAt) {
               // 那个项目已被删除：本地这一份换一个服务端 id 重新建，不去复活 tombstone。
               entry.serverId = uuid();
               entry.revision = null;
               saveMeta();
               throw error;
            }
            throw error;
         }
      },
      /**
       * 这台设备上有没有「登录前就存在、因此没有上传」的内容。
       * previousOwner 为 null 表示那是未登录时攒下的，可以问一次要不要并入；
       * 是另一个用户 id 时不问也不并——那是别人的东西。
       */
      pendingHold: function () {
         var hold = meta.hold;
         if (holdIsEmpty(hold)) return null;
         return {
            previousOwner: hold.previousOwner,
            fromGuest: hold.previousOwner === null,
            asked: hold.asked,
            projects: Object.keys(hold.projects).length,
            files: Object.keys(hold.files).length,
            progress: Object.keys(hold.progress).length,
            drafts: Object.keys(hold.drafts).length
         };
      },
      /** 当前项目是否因账号隔离而只能留在本机。 */
      isProjectHeld: function (localProjectId) {
         // 刚登录时必须先完成一次本地项目盘点，空集合不等于没有旧内容。
         return Boolean(meta.hold && (meta.hold.needsProjects || meta.hold.projects[localProjectId]));
      },
      /** 把本机已有内容并入当前账号。只有「未登录时攒下的」才允许。 */
      adoptLocalData: function () {
         if (!meta.hold || meta.hold.previousOwner !== null) return false;
         meta.hold = { previousOwner: null, asked: true, needsProjects: false, needsTeaching: false, projects: {}, files: {}, progress: {}, drafts: {} };
         saveMeta();
         syncLocalProjects();
         syncLocalTeaching();
         schedule(300);
         return true;
      },
      /** 不并入：本地内容原样留着，只是永远不进这个账号。 */
      keepLocalDataOut: function () {
         if (!meta.hold) return;
         meta.hold.asked = true;
         saveMeta();
         setStatus({});
      },
      status: function () { return Object.assign({}, status, { pending: QUEUE.size(), blocked: QUEUE.blocked() }); },
      onStatus: function (fn) {
         statusListeners.push(fn);
         return function () { statusListeners = statusListeners.filter(function (item) { return item !== fn; }); };
      },
      /** 退出登录：本地内容原样保留，只丢掉「同步到哪一步」的记录。 */
      reset: function () {
         stop();
         meta = emptyMeta(null);
         saveMeta();
         QUEUE.bind(null);
         conflictRounds = {};
         setStatus({ state: "idle", lastError: null, lastPullAt: 0 });
      }
   };

   QUEUE.subscribe(function () { setStatus({}); });
})();
