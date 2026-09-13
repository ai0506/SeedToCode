/* 作答框的输入约定，一份实现。
 *
 * 这套东西原来只长在 `teaching-task.js` 的闭包里，于是「老师自出题」那一页的作答框
 * 就是一个光秃秃的 textarea：打 `<-` 不变箭头、按 Tab 跳到下一个按钮、没有行号也没有
 * 颜色。同一个学生在课程题里养成的手感，一到作业题就全部失效——而作业恰好是要交给
 * 老师看的那一份。
 *
 * 所以把它抽成共用的一份：课程题目、作业题、老师批改页看到的都是同一个编辑器。
 * 不留副本——副本会和被用的那一份悄悄分叉（仓库里已经吃过这个亏）。
 *
 * 这里只管「怎么输入」，不管判题、不管草稿、不管提交，那些是各页自己的事。
 */
(function () {
   "use strict";

   var INDENT = "   ";   // CAIE 伪代码一级缩进＝三空格

   function esc(value) {
      return String(value == null ? "" : value)
         .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
   }

   /**
    * 作答框和课文里的示例代码必须长得一样——学生照着有颜色的例子写，
    * 写出来的却是一片灰字，会以为自己写的不是同一种东西。
    * 高亮器缺席时退回纯转义，作答框绝不能因为着色失败就变成空白。
    */
   function hl(source) {
      var text = String(source == null ? "" : source);
      if (window.LANG && typeof window.LANG.highlight === "function") {
         try { return window.LANG.highlight(text); } catch (error) { /* 退回纯文本 */ }
      }
      return esc(text);
   }

   /* ---------------- `<-` → `←` ---------------- */

   /** 引号里和注释里的 `<-` 是字面文字，不能改写。 */
   function isInLiteralOrComment(line, column) {
      var quote = null;
      for (var i = 0; i < column; i += 1) {
         var character = line[i];
         if (quote) {
            if (character === quote) quote = null;
            continue;
         }
         if (character === '"' || character === "'") { quote = character; continue; }
         if (character === "/" && line[i + 1] === "/") return true;
      }
      return quote !== null;
   }

   function convertTrailingAsciiArrow(textarea) {
      var end = textarea.selectionStart;
      if (end < 2 || textarea.value.slice(end - 2, end) !== "<-") return false;
      var lineStart = textarea.value.lastIndexOf("\n", end - 1) + 1;
      var line = textarea.value.slice(lineStart, end);
      if (isInLiteralOrComment(line, end - 2 - lineStart)) return false;
      textarea.setRangeText("←", end - 2, end, "end");
      // setRangeText 不会派发 input 事件，着色层和行号槽都只在 input 事件里重绘：
      // 不补发一次，画面还停在转换前的「<-」，而真实光标已经站到只有一个字符的
      // 「←」后面，视觉上就成了「卡在 < 和 - 中间」，得等下一次真实按键才会重绘对齐。
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
   }

   function convertAsciiArrowsInPastedCode(text) {
      return text.split("\n").map(function (line) {
         var output = "";
         var quote = null;
         for (var i = 0; i < line.length; i += 1) {
            var character = line[i];
            if (quote) {
               output += character;
               if (character === quote) quote = null;
               continue;
            }
            if (character === '"' || character === "'") { quote = character; output += character; continue; }
            if (character === "/" && line[i + 1] === "/") { output += line.slice(i); break; }
            if (character === "<" && line[i + 1] === "-") { output += "←"; i += 1; continue; }
            output += character;
         }
         return output;
      }).join("\n");
   }

   /* ---------------- 编辑 ---------------- */

   /* 和主编辑器一样走 execCommand：直接赋值 value 会清空浏览器的撤销栈，
      Tab 缩进之后就再也 Ctrl+Z 不回去了。 */
   function applyEdit(textarea, start, end, text, caret) {
      textarea.focus();
      textarea.setSelectionRange(start, end);
      var ok = false;
      try {
         ok = text === ""
            ? document.execCommand("delete")
            : document.execCommand("insertText", false, text);
      } catch (e) { ok = false; }
      if (!ok) {
         textarea.value = textarea.value.slice(0, start) + text + textarea.value.slice(end);
         textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      var pos = caret === undefined ? start + text.length : caret;
      textarea.setSelectionRange(pos, pos);
   }

   /** Tab / Shift+Tab / 行首退格：全部按三空格的停靠点走，与主编辑器一致。 */
   function wireIndenting(textarea) {
      function lineInfo() {
         var s = textarea.selectionStart;
         var start = textarea.value.lastIndexOf("\n", s - 1) + 1;
         var end = textarea.value.indexOf("\n", s);
         if (end === -1) end = textarea.value.length;
         return { start: start, end: end, text: textarea.value.slice(start, end) };
      }

      textarea.addEventListener("keydown", function (event) {
         if (event.isComposing || event.keyCode === 229) return;

         if (event.key === "Tab") {
            event.preventDefault();
            var s = textarea.selectionStart;
            var e = textarea.selectionEnd;
            if (s !== e && textarea.value.slice(s, e).indexOf("\n") >= 0) {
               var blockStart = textarea.value.lastIndexOf("\n", s - 1) + 1;
               var blockEnd = textarea.value.indexOf("\n", e);
               if (blockEnd === -1) blockEnd = textarea.value.length;
               var original = textarea.value.slice(blockStart, blockEnd);
               var block = original.split("\n").map(function (line) {
                  if (!event.shiftKey) return INDENT + line;
                  var lead = (line.match(/^ */) || [""])[0].length;
                  return lead ? line.slice(((lead - 1) % 3) + 1) : line;
               }).join("\n");
               if (block === original) return;
               applyEdit(textarea, blockStart, blockEnd, block);
               textarea.setSelectionRange(blockStart, blockStart + block.length);
               return;
            }
            if (event.shiftKey) {
               var li = lineInfo();
               var lead2 = (li.text.match(/^ */) || [""])[0].length;
               if (lead2 > 0) {
                  var cut = ((lead2 - 1) % 3) + 1;
                  applyEdit(textarea, li.start, li.start + cut, "", Math.max(li.start, s - cut));
               }
               return;
            }
            applyEdit(textarea, s, e, INDENT);
            return;
         }

         if (event.key === "Enter") {
            // 只延续当前缩进，不自动补结束符——作答框没有主编辑器的结构感知。
            var info = lineInfo();
            var indent = (info.text.match(/^ */) || [""])[0];
            if (!indent) return;
            event.preventDefault();
            applyEdit(textarea, textarea.selectionStart, textarea.selectionEnd, "\n" + indent);
            return;
         }

         if (event.key === "Backspace" && textarea.selectionStart === textarea.selectionEnd) {
            var caret = textarea.selectionStart;
            var row = lineInfo();
            var column = caret - row.start;
            if (column > 0 && /^ +$/.test(row.text.slice(0, column))) {
               event.preventDefault();
               applyEdit(textarea, caret - (((column - 1) % 3) + 1), caret, "");
            }
         }
      });
   }

   /* ---------------- 行号与着色 ---------------- */

   function gutterHtml(from, to) {
      var html = "";
      for (var i = from; i <= to; i += 1) html += "<span>" + i + "</span>";
      return html;
   }

   /**
    * 行号槽。诊断按行号说话，作答框没有行号等于让学生自己数。
    * offset 是锁定片段的行数——编号必须和提交上去的整段源码对齐，
    * 否则「第 5 行」指到的位置和学生数出来的差好几行。
    */
   function wireGutter(textarea, gutter, offset) {
      var from = (offset || 0) + 1;
      function paint() {
         var count = textarea.value.split("\n").length;
         if (gutter.childElementCount === count) return;
         gutter.innerHTML = gutterHtml(from, (offset || 0) + count);
      }
      textarea.addEventListener("input", paint);
      textarea.addEventListener("scroll", function () { gutter.scrollTop = textarea.scrollTop; }, { passive: true });
      paint();
      return paint;
   }

   /**
    * 着色层垫在透明 textarea 底下，两层的字体、行高、内边距和换行方式必须逐项一致，
    * 否则光标会和看到的字错位。两层都不换行（textarea 上是 wrap="off"），
    * 所以横向滚动也要跟着同步，不然长行一划出去颜色就掉队了。
    */
   function wireHighlight(textarea, layer) {
      var code = layer.querySelector("code") || layer;
      var last = null;
      function paint() {
         if (textarea.value === last) return;
         last = textarea.value;
         // 末行是空行时补一个零宽字符，不然着色层会比 textarea 矮一行、滚动量对不上
         code.innerHTML = hl(last) + (/\n$/.test(last) ? "\u200b" : "");
      }
      function sync() {
         layer.scrollTop = textarea.scrollTop;
         layer.scrollLeft = textarea.scrollLeft;
      }
      textarea.addEventListener("input", function () { paint(); sync(); });
      textarea.addEventListener("scroll", sync, { passive: true });
      paint();
      return paint;
   }

   /* ---------------- 对外 ---------------- */

   /**
    * 把一个 textarea 变成「写伪代码用的」输入框。
    *
    * options.gutter / options.highlight 缺省时那一层就不装，其余照常——
    * 调用方只有一个裸 textarea 时也能拿到 Tab 缩进和箭头转换。
    * options.lineOffset 是行号起算前已经有多少行（锁定片段）。
    *
    * 返回 { repaint }：外部直接改写 `textarea.value` 之后调一次，
    * 行号和着色层才会跟上（赋值 value 不会派发 input 事件）。
    */
   function attach(textarea, options) {
      var opts = options || {};
      var painters = [];
      if (opts.gutter) painters.push(wireGutter(textarea, opts.gutter, opts.lineOffset || 0));
      if (opts.highlight) painters.push(wireHighlight(textarea, opts.highlight));
      if (opts.readOnly) {
         // 只读时不接管任何按键：批改页看学生交的原文，改不动才是对的
         return { repaint: repaint };
      }
      wireIndenting(textarea);

      var composing = false;
      textarea.addEventListener("compositionstart", function () { composing = true; });
      textarea.addEventListener("compositionend", function () { composing = false; });
      textarea.addEventListener("input", function () {
         // 中文合成期间不转换：合成串里的 `<-` 还不是最终文字
         if (!composing) convertTrailingAsciiArrow(textarea);
      });
      textarea.addEventListener("paste", function (event) {
         var clipboard = event.clipboardData || window.clipboardData;
         var text = clipboard && clipboard.getData("text");
         if (!text || text.indexOf("<-") < 0) return;
         var converted = convertAsciiArrowsInPastedCode(text.replace(/\r\n?/g, "\n"));
         if (converted === text) return;
         event.preventDefault();
         textarea.setRangeText(converted, textarea.selectionStart, textarea.selectionEnd, "end");
         // 同样不会自动派发 input 事件，着色层和行号槽要靠这一下补发才会跟着粘贴内容重绘
         textarea.dispatchEvent(new Event("input", { bubbles: true }));
      });

      function repaint() {
         painters.forEach(function (paint) { paint(); });
      }
      return { repaint: repaint };
   }

   window.CAIECodeInput = {
      INDENT: INDENT,
      highlight: hl,
      gutterHtml: gutterHtml,
      attach: attach,
      applyEdit: applyEdit,
      wireIndenting: wireIndenting,
      wireGutter: wireGutter,
      wireHighlight: wireHighlight,
      convertTrailingAsciiArrow: convertTrailingAsciiArrow,
      convertAsciiArrowsInPastedCode: convertAsciiArrowsInPastedCode
   };
})();
