/*
 * 运行时文件的单次恢复只保存“修改前”，当前文件本身就是第二个 slot。
 * 这个小模块没有 DOM 和存储依赖，避免编辑弹窗、运行结果与同步回调各自
 * 复制一段略有不同的 slot 逻辑。
 */
(function (root) {
   'use strict';

   function clone(value) { return JSON.parse(JSON.stringify(value)); }

   function contentOf(file) {
      return file.kind === 'records'
         ? { kind: 'records', recordType: file.recordType || '', records: clone(file.records || []) }
         : { kind: 'text', lines: clone(file.lines || []) };
   }

   function sameContent(left, right) {
      return JSON.stringify(contentOf(left)) === JSON.stringify(contentOf(right));
   }

   function applyContent(file, content) {
      var next = content && content.kind === 'records'
         ? { kind: 'records', recordType: content.recordType || '', records: clone(content.records || []) }
         : { kind: 'text', lines: clone(content && content.lines || []) };
      file.kind = next.kind;
      if (next.kind === 'records') {
         file.recordType = next.recordType;
         file.records = next.records;
         delete file.lines;
      } else {
         file.lines = next.lines;
         delete file.recordType;
         delete file.records;
      }
   }

   function replace(file, content, slots) {
      var candidate = { kind: content && content.kind, recordType: content && content.recordType, records: content && content.records, lines: content && content.lines };
      if (sameContent(file, candidate)) return false;
      slots[file.id] = { previous: contentOf(file) };
      applyContent(file, content);
      return true;
   }

   function restore(file, slots) {
      var slot = slots[file.id];
      if (!slot || !slot.previous) return false;
      applyContent(file, slot.previous);
      delete slots[file.id];
      return true;
   }

   function captureChanges(beforeFiles, afterFiles, slots) {
      var beforeById = {};
      beforeFiles.forEach(function (file) { beforeById[file.id] = file; });
      afterFiles.forEach(function (file) {
         var before = beforeById[file.id];
         if (before && !sameContent(before, file)) slots[file.id] = { previous: contentOf(before) };
      });
   }

   root.CAIERuntimeFileRestore = {
      contentOf: contentOf,
      sameContent: sameContent,
      replace: replace,
      restore: restore,
      captureChanges: captureChanges,
      clear: function (slots, fileId) { delete slots[fileId]; },
      has: function (slots, fileId) { return Boolean(slots[fileId] && slots[fileId].previous); }
   };
})(typeof window === 'undefined' ? globalThis : window);
