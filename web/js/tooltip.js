/* 自定义悬浮提示。
 *
 * 页面里一律用 `data-tip="..."` 而不是原生 `title`：原生那个延迟不可控、
 * 样式跟着系统走、深色主题下常常是白底黑字，和整套界面对不上。
 *
 * 这一份是共用的——教学页原先没有这段逻辑，于是那里的章节进度点退回了
 * 原生 title；老师面板又自己抄了一份。现在都用这里。
 */
(function () {
   "use strict";

   var DELAY = 350;
   var timer = null;
   var target = null;
   var node = null;

   function element() {
      if (node && document.body.contains(node)) return node;
      node = document.getElementById("tooltip");
      if (!node) {
         node = document.createElement("div");
         node.className = "tooltip";
         node.id = "tooltip";
         node.hidden = true;
         document.body.appendChild(node);
      }
      return node;
   }

   function show(host) {
      var text = host.dataset.tip;
      if (!text) return;
      var tip = element();
      tip.textContent = text;
      tip.hidden = false;
      var box = host.getBoundingClientRect();
      var own = tip.getBoundingClientRect();
      // 贴着触发元素居中；顶到视口边缘就往回收，超出下边就翻到上面
      var left = Math.min(Math.max(6, box.left + box.width / 2 - own.width / 2), window.innerWidth - own.width - 6);
      var top = box.bottom + 6 + own.height > window.innerHeight ? box.top - own.height - 6 : box.bottom + 6;
      tip.style.left = left + "px";
      tip.style.top = top + "px";
   }

   function hide() {
      clearTimeout(timer);
      target = null;
      var tip = document.getElementById("tooltip");
      if (tip) tip.hidden = true;
   }

   function visible() {
      var tip = document.getElementById("tooltip");
      return Boolean(tip && !tip.hidden);
   }

   document.addEventListener("mouseover", function (event) {
      var host = event.target.closest ? event.target.closest("[data-tip]") : null;
      if (!host) return;
      if (host === target) {
         /* 同一个元素的提示文字可能在悬浮期间变了（点了开关、状态翻转），
            这种时候要就地换成新文字，否则停留的还是上一个状态的说明。 */
         if (visible() && document.getElementById("tooltip").textContent !== host.dataset.tip) show(host);
         return;
      }
      hide();
      target = host;
      timer = setTimeout(function () { show(host); }, DELAY);
   });

   /* 点完之后不要留着旧提示：按钮多半刚改变了状态，那句说明已经过期。 */
   document.addEventListener("click", hide, true);
   document.addEventListener("mouseout", function (event) {
      if (target && !target.contains(event.relatedTarget)) hide();
   });
   // 焦点也给提示，键盘用户不该看不到
   document.addEventListener("focusin", function (event) {
      var host = event.target.closest ? event.target.closest("[data-tip]") : null;
      if (host) { hide(); target = host; show(host); }
   });
   document.addEventListener("focusout", hide);
   document.addEventListener("scroll", hide, true);
   window.addEventListener("resize", hide);
   document.addEventListener("keydown", function (event) { if (event.key === "Escape") hide(); });
})();
