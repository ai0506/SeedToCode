/* 布置 / 编辑一份班级作业。
 *
 * 这一页原来是 classes.html 里的 #assignDialog。出题是要坐下来写的事：
 * 一份作业可以有好几道题，每道题有题面和提示两段长文本，弹窗那点高度装不下，
 * 写到第三题时第一题已经滚出视野，也看不出整份作业长什么样。独立成页之后
 * 左边是大纲、右边是正文，改哪一题一眼能找到。
 *
 * 三条和别处不同的约定：
 *
 * 1. items 数组是唯一的事实来源，但**不**在每次按键时重画卡片——重画会打断
 *    正在输入的那个框。改法是：需要用到数据之前先 readItems() 从 DOM 读回来；
 *    增删题目时只动那一张卡片的 DOM，其余原样留着。
 *
 * 2. 离开不拦截（FRONTEND_RULES 第 2.3 条）。内容一直往 localStorage 的草稿里存，
 *    回来接着写，所以关掉页面没有代价，也就不需要 beforeunload 那种拦不住又难看的东西。
 *
 * 3. 截止日期用自己画的选择器，不用原生 input[type=date]——原生那个各家浏览器
 *    长得都不一样，也不跟随主题。
 */
(function () {
   "use strict";

   var $ = function (id) { return document.getElementById(id); };
   var CLIENT = window.CloudClient;
   var AUTH = window.AuthStore;

   var params = new URLSearchParams(window.location.search);
   var classId = params.get("class") || "";
   var assignmentId = params.get("a") || "";

   var classInfo = null;
   /* 老师自己写的题。纯文本，没有判题数据——学生写完自己跑，成绩由老师给。 */
   var items = [];
   /* 旧作业里从课程勾选的题目。不再支持新增，但编辑时要原样带着：
      直接丢掉的话，学生已经交在那些题上的答案就和这份作业脱钩了。 */
   var legacy = [];
   var dueAt = null;             // 时间戳，或 null 表示不限时间
   var baseline = "";            // 服务端（或空作业）的初始快照，用来判断有没有改动
   var uid = 0;
   var submitting = false;
   var focusedKey = null;        // 大纲里当前高亮的那一条

   /* ---------------- 提示与对话框（不使用浏览器原生交互界面） ---------------- */

   var toastTimer = null;
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

   function closeDialogs() {
      $("overlay").hidden = true;
      Array.prototype.forEach.call(document.querySelectorAll(".dialog"), function (node) { node.hidden = true; });
      if (dialogResolve) {
         var done = dialogResolve;
         dialogResolve = null;
         done(false);
      }
   }

   function askConfirm(options) {
      return new Promise(function (resolve) {
         dialogResolve = resolve;
         $("confirmTitle").textContent = options.title || "确认";
         $("confirmBody").textContent = options.body || "";
         $("confirmOk").textContent = options.okLabel || "确定";
         $("overlay").hidden = false;
         $("confirmDialog").hidden = false;
      });
   }

   function describeError(error) {
      if (!error) return "操作失败，请稍后再试。";
      if (error.code === "OFFLINE") return "网络暂时不可用，请稍后再试。";
      if (error.code === "NOT_CONFIGURED") return "云端功能暂未连接。";
      if (error.code === "UNAUTHENTICATED") return "登录状态已失效，请重新登录。";
      return error.message || "操作失败，请稍后再试。";
   }

   function fail(message) { $("assignError").textContent = message || ""; }

   /* ---------------- 门禁 ---------------- */

   function gate(title, body, actions) {
      $("assignMain").hidden = true;
      $("assignGate").hidden = false;
      $("gateTitle").textContent = title;
      $("gateBody").textContent = body;
      var host = $("gateActions");
      host.innerHTML = "";
      (actions || []).forEach(function (action) {
         var link = document.createElement("a");
         link.className = "btn " + (action.primary ? "btn-primary" : "btn-ghost") + " fixed-btn wide";
         link.href = action.href;
         link.textContent = action.label;
         host.appendChild(link);
      });
   }

   /* ---------------- 返回 ---------------- */

   /** 回到班级面板，并让它落在这个班的作业标签上（编辑的话再打开这份作业）。 */
   function classesUrl(keepAssignment) {
      var query = "?class=" + encodeURIComponent(classId) + "&tab=assignments";
      if (keepAssignment && assignmentId) query += "&a=" + encodeURIComponent(assignmentId);
      return "classes.html" + query;
   }

   /** 成功之后要在班级面板上说一句话，但那是另一个页面，只能托 sessionStorage 带过去。 */
   function flash(message) {
      try { window.sessionStorage.setItem("caie.flash", message); } catch (e) { /* 隐私模式下没有就算了 */ }
   }

   function goBack(keepAssignment) {
      window.location.href = classesUrl(keepAssignment);
   }

   /* ---------------- 日期 ---------------- */

   var WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

   function pad(n) { return String(n).padStart(2, "0"); }

   /** 截止时间按当天结束算：老师选「今天」应当是今天下班前都还能交。 */
   function endOfDay(year, month, day) {
      return new Date(year, month, day, 23, 59, 59, 0).getTime();
   }

   function dueLabel(timestamp) {
      if (!timestamp) return "不限时间";
      var date = new Date(timestamp);
      return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) +
         " " + WEEK[date.getDay()];
   }

   function renderDue() {
      $("dueText").textContent = dueLabel(dueAt);
      $("dueText").dataset.empty = dueAt ? "no" : "yes";
      $("dueClear").disabled = !dueAt;
   }

   /* 月格永远 6 行 42 格，换月时浮层高度不变。 */
   var dpYear = 0;
   var dpMonth = 0;

   function sameDay(timestamp, year, month, day) {
      if (!timestamp) return false;
      var date = new Date(timestamp);
      return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
   }

   function renderPicker() {
      $("dpMonth").textContent = dpYear + " 年 " + (dpMonth + 1) + " 月";
      var first = new Date(dpYear, dpMonth, 1);
      // 一周从周一起算，和表头对齐；getDay() 的周日是 0，要挪到末位
      var offset = (first.getDay() + 6) % 7;
      var start = new Date(dpYear, dpMonth, 1 - offset);
      var today = new Date();
      var grid = $("dpGrid");
      grid.innerHTML = "";
      for (var i = 0; i < 42; i += 1) {
         var date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
         var button = document.createElement("button");
         button.type = "button";
         button.className = "dp-day";
         button.textContent = String(date.getDate());
         button.dataset.outside = date.getMonth() === dpMonth ? "no" : "yes";
         button.dataset.today = sameDay(today.getTime(), date.getFullYear(), date.getMonth(), date.getDate()) ? "yes" : "no";
         button.setAttribute("aria-pressed",
            String(sameDay(dueAt, date.getFullYear(), date.getMonth(), date.getDate())));
         button.setAttribute("aria-label",
            date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月 " + date.getDate() + " 日");
         button.dataset.stamp = String(endOfDay(date.getFullYear(), date.getMonth(), date.getDate()));
         grid.appendChild(button);
      }
   }

   function pickerOpen() { return !$("datePicker").hidden; }

   function openPicker() {
      var base = dueAt ? new Date(dueAt) : new Date();
      dpYear = base.getFullYear();
      dpMonth = base.getMonth();
      renderPicker();
      var picker = $("datePicker");
      picker.hidden = false;
      $("dueTrigger").setAttribute("aria-expanded", "true");
      // 定位在触发按钮下方，放不下就翻到上方；两侧留 8px，窄屏也不会顶出视口
      var anchor = $("dueTrigger").getBoundingClientRect();
      var box = picker.getBoundingClientRect();
      var left = Math.min(Math.max(8, anchor.left), window.innerWidth - box.width - 8);
      var top = anchor.bottom + 6;
      if (top + box.height > window.innerHeight - 8) top = Math.max(8, anchor.top - box.height - 6);
      picker.style.left = left + "px";
      picker.style.top = top + "px";
   }

   function closePicker() {
      $("datePicker").hidden = true;
      $("dueTrigger").setAttribute("aria-expanded", "false");
   }

   function setDue(timestamp) {
      dueAt = timestamp;
      renderDue();
      renderOutline();
      scheduleDraft();
   }

   /* ---------------- 题目 ---------------- */

   function blank() { return { key: "k" + (uid += 1), id: null, title: "", prompt: "", guidance: "" }; }

   function cardOf(key) { return $("itemCards").querySelector('[data-key="' + key + '"]'); }

   /** 把界面上填的内容读回 items——用到数据之前一律先走这一步。 */
   function readItems() {
      items.forEach(function (item) {
         var card = cardOf(item.key);
         if (!card) return;
         item.title = card.querySelector(".item-title").value.trim();
         item.prompt = card.querySelector(".item-prompt").value.trim();
         item.guidance = card.querySelector(".item-guidance").value.trim();
      });
   }

   function buildCard(item) {
      var card = document.createElement("article");
      card.className = "assign-card";
      card.dataset.key = item.key;

      var head = document.createElement("div");
      head.className = "card-head";
      var no = document.createElement("span");
      no.className = "card-no";
      head.appendChild(no);
      var title = document.createElement("input");
      title.className = "text-field item-title";
      title.spellcheck = false;
      title.autocomplete = "off";
      title.placeholder = "题目标题，例如「统计及格人数」";
      title.value = item.title || "";
      title.setAttribute("aria-label", "题目标题");
      head.appendChild(title);
      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "icon-btn small item-remove";
      remove.textContent = "✕";
      remove.setAttribute("aria-label", "删除这道题");
      remove.dataset.remove = item.key;
      head.appendChild(remove);
      card.appendChild(head);

      var body = document.createElement("div");
      body.className = "card-body";

      var promptLabel = document.createElement("div");
      promptLabel.className = "item-label";
      promptLabel.appendChild(document.createTextNode("题目内容（学生看到的题面）"));
      body.appendChild(promptLabel);
      var prompt = document.createElement("textarea");
      prompt.className = "item-area item-prompt";
      prompt.spellcheck = false;
      prompt.placeholder = "按普通文字写就行，换行会原样显示。";
      prompt.value = item.prompt || "";
      prompt.setAttribute("aria-label", "题目内容");
      body.appendChild(prompt);

      var guidanceLabel = document.createElement("div");
      guidanceLabel.className = "item-label";
      guidanceLabel.appendChild(document.createTextNode("提示"));
      var hint = document.createElement("span");
      hint.className = "item-hint";
      hint.textContent = "可选，留空就不显示给学生";
      guidanceLabel.appendChild(hint);
      body.appendChild(guidanceLabel);
      var guidance = document.createElement("textarea");
      guidance.className = "item-area item-guidance";
      guidance.spellcheck = false;
      guidance.placeholder = "想给的思路提示。";
      guidance.value = item.guidance || "";
      guidance.setAttribute("aria-label", "提示");
      body.appendChild(guidance);

      card.appendChild(body);
      return card;
   }

   function renderItems() {
      var host = $("itemCards");
      host.innerHTML = "";
      items.forEach(function (item) { host.appendChild(buildCard(item)); });
      renumber();
      renderOutline();
   }

   /** 题号写在卡片和大纲里，增删之后要跟着重排。 */
   function renumber() {
      items.forEach(function (item, index) {
         var card = cardOf(item.key);
         if (card) card.querySelector(".card-no").textContent = "第 " + (index + 1) + " 题";
      });
   }

   function renderOutline() {
      var list = $("outlineList");
      list.innerHTML = "";

      var meta = document.createElement("li");
      meta.className = "meta" + (focusedKey === "meta" ? " active" : "");
      meta.dataset.key = "meta";
      var metaNo = document.createElement("span");
      metaNo.className = "ao-no";
      metaNo.textContent = "信息";
      meta.appendChild(metaNo);
      var metaName = document.createElement("span");
      metaName.className = "ao-name";
      var titleValue = $("assignTitle").value.trim();
      metaName.textContent = titleValue || "未命名作业";
      metaName.dataset.empty = titleValue ? "no" : "yes";
      meta.appendChild(metaName);
      list.appendChild(meta);

      items.forEach(function (item, index) {
         var row = document.createElement("li");
         row.dataset.key = item.key;
         if (focusedKey === item.key) row.className = "active";
         var no = document.createElement("span");
         no.className = "ao-no";
         no.textContent = String(index + 1);
         row.appendChild(no);
         var name = document.createElement("span");
         name.className = "ao-name";
         var card = cardOf(item.key);
         var live = card ? card.querySelector(".item-title").value.trim() : (item.title || "");
         name.textContent = live || "未命名题目";
         name.dataset.empty = live ? "no" : "yes";
         row.appendChild(name);
         list.appendChild(row);
      });

      var parts = [items.length + " 道题"];
      if (legacy.length) parts.push("另有 " + legacy.length + " 道课程题");
      $("outlineCount").textContent = parts.join(" · ");
   }

   function renderLegacy() {
      $("legacyCard").hidden = !legacy.length;
      var host = $("legacyList");
      host.innerHTML = "";
      legacy.forEach(function (taskId, index) {
         var chip = document.createElement("span");
         chip.className = "legacy-chip";
         chip.appendChild(document.createTextNode(taskId));
         var remove = document.createElement("button");
         remove.type = "button";
         remove.dataset.legacyRemove = String(index);
         remove.setAttribute("aria-label", "移除 " + taskId);
         remove.textContent = "✕";
         chip.appendChild(remove);
         host.appendChild(chip);
      });
      renderOutline();
   }

   function addItem() {
      readItems();
      var item = blank();
      items.push(item);
      $("itemCards").appendChild(buildCard(item));
      renumber();
      renderOutline();
      var card = cardOf(item.key);
      card.scrollIntoView({ block: "nearest" });
      card.querySelector(".item-title").focus();
      scheduleDraft();
   }

   async function removeItem(key) {
      readItems();
      var index = items.findIndex(function (row) { return row.key === key; });
      if (index < 0) return;
      var item = items[index];
      var written = Boolean(item.title || item.prompt || item.guidance);
      // 空白的那一条没什么可确认的，直接删；写过内容的才拦一下
      if (written) {
         var ok = await askConfirm({
            title: "删除这道题",
            body: "「" + (item.title || "未命名题目") + "」会从这份作业里移除。" +
               (assignmentId ? "学生之前交在这道题上的答案仍然保留，只是不再属于这份作业。" : ""),
            okLabel: "删除"
         });
         if (!ok) return;
      }
      var card = cardOf(key);
      if (card) card.remove();
      items.splice(index, 1);
      renumber();
      renderOutline();
      scheduleDraft();
      /*
       * 确认弹窗管的是「别手滑」，撤销管的是「确认完才发现删错了」——两件事。
       * 删除本来就还没提交到服务端，撤销就是把这条原样插回原来的位置：
       * item 连 id 一起留着，恢复之后学生已经交在这道题上的答案照样认得它。
       */
      toast("已删除「" + (item.title || "未命名题目") + "」", "撤销", function () {
         restoreItem(item, index);
      });
   }

   function restoreItem(item, index) {
      readItems();
      var at = Math.min(index, items.length);
      items.splice(at, 0, item);
      var card = buildCard(item);
      var after = items[at + 1] ? cardOf(items[at + 1].key) : null;
      $("itemCards").insertBefore(card, after);
      renumber();
      renderOutline();
      scheduleDraft();
      card.scrollIntoView({ block: "nearest" });
   }

   /* ---------------- 草稿 ---------------- */

   function draftKey() {
      return "caie.assignDraft." + classId + "." + (assignmentId || "new");
   }

   /*
    * 回收站。清草稿的三条路（放弃修改、布置成功、改回服务端版本）都不真删，
    * 先把那一份挪到这里。理由很直接：上一版里「接回草稿」的提示条上挂着一个
    * 一点就把内容抹光、且没有退路的按钮，人一手滑写了半天的题就没了。
    * 与其逐条去堵抹除路径，不如让「抹掉」这件事本身可逆——东西还在，只是挪了地方。
    */
   function trashKey() { return "caie.assignTrash." + classId + "." + (assignmentId || "new"); }

   var TRASH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

   function readTrash() {
      try {
         var raw = window.localStorage.getItem(trashKey());
         if (!raw) return null;
         var box = JSON.parse(raw);
         if (!box || !box.data || !box.at) return null;
         // 太久以前的不再提：那时候写的东西，人早就不记得了，提出来只会碍事
         if (Date.now() - box.at > TRASH_TTL_MS) return null;
         return box;
      } catch (e) { return null; }
   }

   /** 用来存草稿，也用来和 baseline 比对判断「改过没有」。 */
   function snapshot() {
      readItems();
      return JSON.stringify({
         title: $("assignTitle").value.trim(),
         dueAt: dueAt,
         legacy: legacy,
         items: items.map(function (item) {
            return { id: item.id, title: item.title, prompt: item.prompt, guidance: item.guidance };
         })
      });
   }

   function applySnapshot(text) {
      var data = JSON.parse(text);
      $("assignTitle").value = data.title || "";
      dueAt = data.dueAt || null;
      legacy = Array.isArray(data.legacy) ? data.legacy.slice() : [];
      items = (data.items || []).map(function (row) {
         return { key: "k" + (uid += 1), id: row.id || null, title: row.title || "", prompt: row.prompt || "", guidance: row.guidance || "" };
      });
      if (!items.length) items.push(blank());
      renderDue();
      renderLegacy();
      renderItems();
   }

   var draftTimer = null;
   /*
    * 明确丢弃过（放弃修改、提交成功）之后就不许再写回去。
    * 没有这个闸门时，clearDraft() 清掉的东西会被离开页面时的那次补存原样写回来——
    * 「放弃修改」等于没放弃，布置成功之后再点「布置作业」还会冒出上一份的内容。
    * 只要人又动了一下（scheduleDraft），闸门就重新打开：那是新的一次编辑。
    */
   var draftCleared = false;

   function scheduleDraft() {
      draftCleared = false;
      clearTimeout(draftTimer);
      draftTimer = setTimeout(saveDraft, 500);
   }

   function saveDraft() {
      if (draftCleared) return;
      var current = snapshot();
      var changed = current !== baseline;
      $("discardBtn").disabled = !changed;
      try {
         if (!changed) {
            window.localStorage.removeItem(draftKey());
            window.localStorage.removeItem(draftKey() + ".at");
            $("draftState").textContent = "";
            return;
         }
         window.localStorage.setItem(draftKey(), current);
         window.localStorage.setItem(draftKey() + ".at", String(Date.now()));
         var now = new Date();
         $("draftState").textContent = "草稿已存 " + pad(now.getHours()) + ":" + pad(now.getMinutes());
      } catch (e) {
         // 存不进去（隐私模式、配额满）不影响写作业本身，只是回来时接不上
         $("draftState").textContent = "草稿存不下来";
      }
   }

   /** 把还在防抖里等着的那次存盘立刻做掉。 */
   function flushDraft() {
      clearTimeout(draftTimer);
      saveDraft();
   }

   /**
    * 清掉草稿。reason 说明是怎么清的，决定下次进来要不要提「还能找回」：
    * discarded / reverted 是人主动丢的，值得留一条退路；submitted 是已经交出去了，
    * 内容在服务端好好待着，再提一句只会多余。
    */
   function clearDraft(reason) {
      draftCleared = true;
      clearTimeout(draftTimer);
      try {
         var current = window.localStorage.getItem(draftKey());
         if (current) {
            window.localStorage.setItem(trashKey(), JSON.stringify({
               data: current, at: Date.now(), reason: reason || "cleared"
            }));
         }
         window.localStorage.removeItem(draftKey());
         window.localStorage.removeItem(draftKey() + ".at");
      } catch (e) { /* 没存上也就没得清 */ }
   }

   /* ---------------- 草稿提示条 ---------------- */

   /* 只在进页面时出现一次。做完动作原地换成结果文字、不收起来——
      收起来会让下面整叠卡片往上跳一格。 */
   function showNotice(text, actionLabel, handler) {
      $("draftNotice").hidden = false;
      $("draftNotice").dataset.kind = actionLabel ? "todo" : "done";
      $("draftNoticeText").textContent = text;
      var button = $("draftNoticeAction");
      button.hidden = !actionLabel;
      button.dataset.spent = "no";
      button.textContent = actionLabel || "";
      button.onclick = actionLabel ? function () { handler(); } : null;
   }

   function settleNotice(text) {
      $("draftNotice").dataset.kind = "done";
      $("draftNoticeText").textContent = text;
      /* 按钮不收起来，只是淡出：收起来会让这一条变窄、文字重排，下面的卡片跟着跳。 */
      $("draftNoticeAction").dataset.spent = "yes";
      $("draftNoticeAction").onclick = null;
   }

   function stamp(at) {
      var date = new Date(at);
      return (date.getMonth() + 1) + " 月 " + date.getDate() + " 日 " +
         pad(date.getHours()) + ":" + pad(date.getMinutes());
   }

   /* ---------------- 取数与提交 ---------------- */

   async function loadClass() {
      var data = await CLIENT.request("/api/classes");
      classInfo = (data.classes || []).filter(function (item) { return item.id === classId; })[0] || null;
      return classInfo;
   }

   async function loadAssignment() {
      var data = await CLIENT.request("/api/classes/" + encodeURIComponent(classId) + "/assignments");
      return (data.assignments || []).filter(function (item) { return item.id === assignmentId; })[0] || null;
   }

   async function submit() {
      if (submitting) return;
      readItems();
      fail("");

      var title = $("assignTitle").value.trim();
      if (!title) {
         fail("请填写作业标题。");
         $("assignTitle").focus();
         return;
      }
      // 完全空白的题不算数：新建时会预置一条空的，老师没填就当没加
      var filled = items.filter(function (item) { return item.title || item.prompt || item.guidance; });
      if (!filled.length && !legacy.length) {
         fail("至少写一道题。");
         return;
      }
      var bad = filled.filter(function (item) { return !item.title || !item.prompt; })[0];
      if (bad) {
         fail("第 " + (filled.indexOf(bad) + 1) + " 道题还缺标题或题目内容。");
         var card = cardOf(bad.key);
         if (card) {
            card.scrollIntoView({ block: "center" });
            card.querySelector(bad.title ? ".item-prompt" : ".item-title").focus();
         }
         return;
      }

      // 旧的课程题排在前面保持原顺序，自己写的题跟在后面
      var ordered = legacy.map(function (taskId) { return { kind: "task", taskId: taskId }; })
         .concat(filled.map(function (item) {
            return { kind: "custom", id: item.id, title: item.title, prompt: item.prompt, guidance: item.guidance || null };
         }));

      submitting = true;
      $("submitBtn").disabled = true;
      $("draftState").textContent = assignmentId ? "保存中…" : "布置中…";
      try {
         if (assignmentId) {
            await CLIENT.request(
               "/api/classes/" + encodeURIComponent(classId) + "/assignments/" + encodeURIComponent(assignmentId),
               { method: "PUT", body: { title: title, dueAt: dueAt, items: ordered } }
            );
         } else {
            await CLIENT.request("/api/classes/" + encodeURIComponent(classId) + "/assignments", {
               method: "POST",
               body: { title: title, dueAt: dueAt, items: ordered }
            });
         }
         clearDraft("submitted");
         flash(assignmentId ? "作业「" + title + "」已更新。" : "作业「" + title + "」已布置给全班。");
         goBack(true);
      } catch (error) {
         submitting = false;
         $("submitBtn").disabled = false;
         $("draftState").textContent = "";
         fail(describeError(error));
      }
   }

   /** 把界面改回服务端那一版。这是会抹掉当前内容的动作，所以要问一次，
       并且被抹掉的那份进回收站，下次进来还找得回。 */
   async function revertToServer(pristine) {
      var ok = await askConfirm({
         title: "改回服务端的版本",
         body: "下面这份没保存完的修改会被换掉，换成这份作业当前在服务端的内容。" +
            "换掉的那份会先留在本地，下次进来还能找回。",
         okLabel: "改回去"
      });
      if (!ok) return;
      clearDraft("reverted");
      applySnapshot(pristine);
      $("draftState").textContent = "";
      $("discardBtn").disabled = true;
      settleNotice("已改回服务端的版本，刚才那份留在本地，下次还能找回。");
   }

   async function discard() {
      var ok = await askConfirm({
         title: assignmentId ? "放弃这次修改" : "放弃这份作业",
         body: assignmentId
            ? "这次改动会全部丢掉，回到班级面板；作业本身保持原样。"
            : "已经写的题目会全部丢掉，回到班级面板；这份作业不会被布置。",
         okLabel: "放弃"
      });
      if (!ok) return;
      clearDraft("discarded");
      goBack(true);
   }

   /* ---------------- 事件 ---------------- */

   function focusCard(key) {
      focusedKey = key;
      Array.prototype.forEach.call($("outlineList").children, function (node) {
         node.classList.toggle("active", node.dataset.key === key);
      });
      Array.prototype.forEach.call(document.querySelectorAll(".assign-card"), function (card) {
         card.dataset.focus = "no";
      });
      var target = key === "meta" ? $("metaCard") : cardOf(key);
      if (!target) return;
      target.dataset.focus = "yes";
      target.scrollIntoView({ block: "start", behavior: "smooth" });
      var field = target.querySelector(key === "meta" ? "#assignTitle" : ".item-title");
      if (field) field.focus();
   }

   function wire() {
      $("addItemBtn").addEventListener("click", addItem);
      $("addItemSide").addEventListener("click", addItem);
      $("submitBtn").addEventListener("click", function () { void submit(); });
      $("discardBtn").addEventListener("click", function () { void discard(); });

      $("itemCards").addEventListener("click", function (event) {
         var remove = event.target.closest("[data-remove]");
         if (remove) void removeItem(remove.dataset.remove);
      });

      /* 标题改一个字就同步到大纲。只改 textContent，宽度是定的、超出省略号，
         所以这一列不会跟着内容抖。 */
      $("itemCards").addEventListener("input", function (event) {
         if (event.target.classList.contains("item-title")) renderOutline();
         scheduleDraft();
      });
      /* 点进哪张卡片，大纲就跟到哪一条——反过来点大纲也能跳。 */
      $("itemCards").addEventListener("focusin", function (event) {
         var card = event.target.closest(".assign-card");
         if (!card || focusedKey === card.dataset.key) return;
         focusedKey = card.dataset.key;
         renderOutline();
      });
      $("metaCard").addEventListener("focusin", function () {
         if (focusedKey === "meta") return;
         focusedKey = "meta";
         renderOutline();
      });

      $("assignTitle").addEventListener("input", function () {
         renderOutline();
         scheduleDraft();
      });

      $("outlineList").addEventListener("click", function (event) {
         var row = event.target.closest("li[data-key]");
         if (row) focusCard(row.dataset.key);
      });

      $("legacyList").addEventListener("click", function (event) {
         var remove = event.target.closest("[data-legacy-remove]");
         if (!remove) return;
         legacy.splice(Number(remove.dataset.legacyRemove), 1);
         renderLegacy();
         scheduleDraft();
      });

      $("dueTrigger").addEventListener("click", function () {
         if (pickerOpen()) closePicker(); else openPicker();
      });
      $("dueClear").addEventListener("click", function () { setDue(null); closePicker(); });
      $("dpPrev").addEventListener("click", function () {
         dpMonth -= 1;
         if (dpMonth < 0) { dpMonth = 11; dpYear -= 1; }
         renderPicker();
      });
      $("dpNext").addEventListener("click", function () {
         dpMonth += 1;
         if (dpMonth > 11) { dpMonth = 0; dpYear += 1; }
         renderPicker();
      });
      $("dpToday").addEventListener("click", function () {
         var now = new Date();
         setDue(endOfDay(now.getFullYear(), now.getMonth(), now.getDate()));
         closePicker();
      });
      $("dpNone").addEventListener("click", function () { setDue(null); closePicker(); });
      $("dpGrid").addEventListener("click", function (event) {
         var day = event.target.closest(".dp-day");
         if (!day) return;
         setDue(Number(day.dataset.stamp));
         closePicker();
      });
      document.addEventListener("mousedown", function (event) {
         if (!pickerOpen()) return;
         if (event.target.closest("#datePicker") || event.target.closest("#dueTrigger")) return;
         closePicker();
      });
      /* 浮层是 fixed 定位的，页面一滚就和触发按钮脱节了，直接收起来最诚实。 */
      $("sheetScroll").addEventListener("scroll", function () { if (pickerOpen()) closePicker(); });
      window.addEventListener("resize", function () { if (pickerOpen()) closePicker(); });

      $("overlay").addEventListener("click", closeDialogs);
      Array.prototype.forEach.call(document.querySelectorAll("[data-close]"), function (button) {
         button.addEventListener("click", closeDialogs);
      });
      $("confirmOk").addEventListener("click", function () {
         var done = dialogResolve;
         dialogResolve = null;
         closeDialogs();
         if (done) done(true);
      });
      document.addEventListener("keydown", function (event) {
         if (event.key !== "Escape") return;
         if (pickerOpen()) { closePicker(); return; }
         closeDialogs();
      });
      /* 离开之前把最后几个字也存进草稿——防抖还没到点就切走的情况。
         pagehide 在部分平台（尤其是移动端直接杀进程）并不总会到，所以页面一转入
         后台就先存一次；两处都走 saveDraft，丢弃过的不会被写回（见 draftCleared）。 */
      window.addEventListener("pagehide", flushDraft);
      document.addEventListener("visibilitychange", function () {
         if (document.visibilityState === "hidden") flushDraft();
      });
   }

   /* ---------------- 启动 ---------------- */

   async function boot() {
      wire();
      $("backBtn").href = classesUrl(true);

      if (!CLIENT.available()) {
         gate("云端功能暂未连接", "布置作业需要连接云端。实验室、课程和本地运行不受影响。",
            [{ label: "去学习", primary: true, href: "learn.html" }, { label: "去实验室", href: "lab.html" }]);
         return;
      }
      await CLIENT.restore();
      if (!AUTH.isSignedIn()) {
         gate("请先登录", "作业属于老师账号。以老师身份登录后再回到这里。",
            [{ label: "去登录", primary: true, href: "login.html?next=" + encodeURIComponent("assign.html" + window.location.search) }]);
         return;
      }
      if (AUTH.user().role !== "teacher") {
         var student = AUTH.user().role === "student";
         gate("这个页面是给老师的",
            "当前登录的是" + AUTH.roleLabel() + "。" +
            (student ? "你的作业在「作业」那一页。" : "学习和做题都在「学习」里。"),
            student
               ? [{ label: "去作业", primary: true, href: "assignments.html" }, { label: "去学习", href: "learn.html" }]
               : [{ label: "去学习", primary: true, href: "learn.html" }, { label: "去实验室", href: "lab.html" }]);
         return;
      }
      if (!classId) {
         gate("没有指定班级", "布置作业要先知道是给哪个班的。回到班级面板，选好班级再点「布置作业」。",
            [{ label: "去班级", primary: true, href: "classes.html" }]);
         return;
      }

      try {
         if (!await loadClass()) {
            gate("找不到这个班级", "它可能已经被删除，或者不属于当前登录的账号。",
               [{ label: "去班级", primary: true, href: "classes.html" }]);
            return;
         }
      } catch (error) {
         gate("读取失败", describeError(error), [{ label: "去班级", primary: true, href: "classes.html" }]);
         return;
      }

      var existing = null;
      if (assignmentId) {
         try { existing = await loadAssignment(); } catch (error) {
            gate("读取失败", describeError(error), [{ label: "去班级", primary: true, href: classesUrl(false) }]);
            return;
         }
         if (!existing) {
            gate("找不到这份作业", "它可能已经被删除了。回到班级面板看看现在还有哪些作业。",
               [{ label: "去班级", primary: true, href: classesUrl(false) }]);
            return;
         }
      }

      $("assignGate").hidden = true;
      $("assignMain").hidden = false;
      $("pageTitle").textContent = existing ? "编辑作业" : "布置作业";
      $("pageClass").textContent = classInfo.name;
      $("submitBtn").textContent = existing ? "保存" : "布置";
      document.title = (existing ? "编辑作业" : "布置作业") + " · SeedToCode";

      if (existing) {
         $("assignTitle").value = existing.title || "";
         dueAt = existing.dueAt || null;
         (existing.items || []).forEach(function (entry) {
            if (entry.kind === "custom") {
               items.push({
                  key: "k" + (uid += 1), id: entry.id, title: entry.title || "",
                  prompt: entry.prompt || "", guidance: entry.guidance || ""
               });
            } else legacy.push(entry.id);
         });
      }
      if (!items.length) items.push(blank());
      renderDue();
      renderLegacy();
      renderItems();
      baseline = snapshot();
      $("discardBtn").disabled = true;

      /*
       * 上次写到一半没提交的，原样接回来，并在正文顶上说清楚接回的是什么、什么时候存的。
       *
       * 这里有过一个吃掉内容的 bug：原来是一条 6 秒就消失的提示条，上面挂着一个
       * 叫「用原来的内容」的按钮，一点就把接回来的东西全部清空、连本地那份一起删，
       * 没有任何退路；而且新建作业时「原来的内容」其实是**空白**，那个标签读起来
       * 却像「保留我写的」。现在：
       *   - 新建作业不再提供任何抹除按钮——空白没有什么可回退的；
       *   - 编辑已有作业时那个动作叫「改回服务端的版本」，说的是它真正做的事，
       *     并且要过一次确认；
       *   - 真按下去了，被替换掉的草稿也只是挪进回收站，下次进来还能找回。
       */
      var saved = null;
      try { saved = window.localStorage.getItem(draftKey()); } catch (e) { saved = null; }
      var savedAt = null;
      try { savedAt = Number(window.localStorage.getItem(draftKey() + ".at")) || null; } catch (e) { savedAt = null; }

      if (saved && saved !== baseline) {
         var pristine = baseline;
         try {
            applySnapshot(saved);
            $("draftState").textContent = "已接回上次的草稿";
            $("discardBtn").disabled = false;
            var when = savedAt ? "（" + stamp(savedAt) + "）" : "";
            if (existing) {
               showNotice("上次没保存完的修改" + when + "，不是作业当前的内容。",
                  "改回服务端的版本", function () { void revertToServer(pristine); });
            } else {
               showNotice("上次没写完的内容" + when + "，接着写就行。");
            }
            $("assignTitle").focus();
            return;
         } catch (e) {
            // 草稿坏了就当没有，别把整页卡在这儿；坏的那份也留进回收站，不直接扔
            clearDraft("broken");
         }
      }

      /* 没有草稿可接的时候，才提回收站里那份——人主动丢掉或改回服务端版本之后，
         发现丢错了还有一次机会。已经布置出去的不提：内容在服务端好好待着。 */
      var trash = readTrash();
      if (trash && trash.reason !== "submitted" && trash.data !== baseline) {
         showNotice(stamp(trash.at) + " 丢掉的那份内容还留着。",
            "找回", function () {
               try {
                  applySnapshot(trash.data);
                  scheduleDraft();
                  settleNotice("已找回 " + stamp(trash.at) + " 丢掉的那份内容。");
               } catch (e) { settleNotice("那份内容已经读不出来了，抱歉。"); }
            });
      }

      $("assignTitle").focus();
   }

   if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { void boot(); });
   else void boot();
})();
