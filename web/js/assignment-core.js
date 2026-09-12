"use strict";
var CAIEAssignment = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/assignment/src/index.ts
  var index_exports = {};
  __export(index_exports, {
    WEEKDAY_LABELS: () => WEEKDAY_LABELS,
    dueLabel: () => dueLabel,
    emptyDraft: () => emptyDraft,
    endOfDay: () => endOfDay,
    fillableItems: () => fillableItems,
    firstIncomplete: () => firstIncomplete,
    isLate: () => isLate,
    monthGrid: () => monthGrid,
    parseDraft: () => parseDraft,
    sameDay: () => sameDay,
    serializeDraft: () => serializeDraft,
    shiftMonth: () => shiftMonth,
    tally: () => tally
  });
  var WEEKDAY_LABELS = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"];
  function pad(value) {
    return String(value).padStart(2, "0");
  }
  function endOfDay(year, month, day) {
    return new Date(year, month, day, 23, 59, 59, 0).getTime();
  }
  function sameDay(timestamp, year, month, day) {
    if (!timestamp) return false;
    const date = new Date(timestamp);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
  }
  function dueLabel(timestamp) {
    if (!timestamp) return "\u4E0D\u9650\u65F6\u95F4";
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${WEEKDAY_LABELS[date.getDay()]}`;
  }
  function monthGrid(year, month, today = /* @__PURE__ */ new Date()) {
    void today;
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - offset);
    const cells = [];
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
      cells.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        outside: date.getMonth() !== month || date.getFullYear() !== year,
        stamp: endOfDay(date.getFullYear(), date.getMonth(), date.getDate())
      });
    }
    return cells;
  }
  function shiftMonth(year, month, delta) {
    const total = year * 12 + month + delta;
    return { year: Math.floor(total / 12), month: (total % 12 + 12) % 12 };
  }
  function emptyDraft() {
    return { title: "", dueAt: null, legacy: [], items: [] };
  }
  function serializeDraft(state) {
    return JSON.stringify({
      title: state.title,
      dueAt: state.dueAt,
      legacy: state.legacy,
      items: state.items.map((item) => ({
        id: item.id,
        title: item.title,
        prompt: item.prompt,
        guidance: item.guidance
      }))
    });
  }
  function parseDraft(text) {
    if (!text) return null;
    let raw;
    try {
      raw = JSON.parse(text);
    } catch {
      return null;
    }
    if (!raw || typeof raw !== "object") return null;
    const box = raw;
    const items = Array.isArray(box.items) ? box.items : [];
    return {
      title: typeof box.title === "string" ? box.title : "",
      dueAt: typeof box.dueAt === "number" ? box.dueAt : null,
      legacy: Array.isArray(box.legacy) ? box.legacy.filter((x) => typeof x === "string") : [],
      items: items.map((entry) => {
        const row = entry && typeof entry === "object" ? entry : {};
        return {
          id: typeof row.id === "string" ? row.id : null,
          title: typeof row.title === "string" ? row.title : "",
          prompt: typeof row.prompt === "string" ? row.prompt : "",
          guidance: typeof row.guidance === "string" ? row.guidance : ""
        };
      })
    };
  }
  function fillableItems(items) {
    return items.filter((item) => Boolean(item.title || item.prompt || item.guidance));
  }
  function firstIncomplete(items) {
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      if (!item.title) return { index, item, missing: "title" };
      if (!item.prompt) return { index, item, missing: "prompt" };
    }
    return null;
  }
  function isLate(assignment, submission) {
    if (!assignment || !submission) return false;
    const due = assignment.dueAt;
    if (!due) return false;
    return submission.submittedAt > due;
  }
  function tally(studentIds, taskIds, has) {
    const perTask = taskIds.map(() => 0);
    const perStudent = studentIds.map(() => 0);
    let submitted = 0;
    studentIds.forEach((studentId, studentIndex) => {
      taskIds.forEach((taskId, taskIndex) => {
        if (!has(studentId, taskId)) return;
        perTask[taskIndex] += 1;
        perStudent[studentIndex] += 1;
        submitted += 1;
      });
    });
    return { perTask, perStudent, submitted, total: studentIds.length * taskIds.length };
  }
  return __toCommonJS(index_exports);
})();
