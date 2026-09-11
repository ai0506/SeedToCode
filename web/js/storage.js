"use strict";
var CAIEStorageModule = (() => {
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

  // packages/storage/src/browser.ts
  var browser_exports = {};
  __export(browser_exports, {
    BrowserStorage: () => BrowserStorage
  });

  // packages/storage/src/types.ts
  var STORAGE_SCHEMA_VERSION = 1;
  var STORAGE_DB_NAME = "caie9618.local";

  // packages/storage/src/migration.ts
  var now = () => Date.now();
  var id = (prefix, index) => `${prefix}-${index + 1}`;
  function migrateLegacyState(editor, teaching = {}) {
    const timestamp = now();
    const docs = Array.isArray(editor.docs) ? editor.docs : [];
    const projectId = "project-default";
    const files = docs.map((doc, index) => ({
      schemaVersion: STORAGE_SCHEMA_VERSION,
      updatedAt: Number(doc.updatedAt) || timestamp,
      id: typeof doc.id === "string" && doc.id ? doc.id : id("file", index),
      projectId,
      kind: "source",
      name: typeof doc.name === "string" ? doc.name : `Main-${index + 1}.pseudocode`,
      content: typeof doc.source === "string" ? doc.source : "",
      revision: 1,
      ...doc.archived ? { deleted: true } : {}
    }));
    const runtimeFiles = Array.isArray(editor.runtimeFiles) ? editor.runtimeFiles : [];
    runtimeFiles.forEach((file, index) => files.push({
      schemaVersion: STORAGE_SCHEMA_VERSION,
      updatedAt: timestamp,
      id: typeof file.id === "string" && file.id ? file.id : id("runtime", index),
      projectId,
      kind: "runtime",
      name: typeof file.name === "string" ? file.name : `Data-${index + 1}.txt`,
      content: file,
      revision: 1
    }));
    const firstFile = files.find((file) => file.id === editor.activeId) ?? files[0];
    const project = { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: projectId, name: "\u6211\u7684\u9879\u76EE", ...firstFile ? { activeFileId: firstFile.id } : {} };
    const preferences = { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: "default", value: { ...editor.settings ?? {} } };
    const teachingProgress = Object.entries(teaching.gates ?? {}).filter(([, complete]) => complete === true).map(([key]) => {
      const [chapter, ...section] = key.split("/");
      return { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: key, chapterId: Number(chapter), sectionId: section.join("/"), completed: true };
    });
    const position = teaching.position && typeof teaching.position.sectionId === "string" ? { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: "default", chapterId: Number(teaching.position.chapterId), sectionId: teaching.position.sectionId } : void 0;
    const practiceDrafts = Object.entries(teaching.answers ?? {}).map(([key, source]) => {
      const [chapter, ...task] = key.split("/");
      return { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: key, chapterId: Number(chapter), taskId: task.join("/"), source };
    });
    return { projects: [project], files, preferences, ...position ? { teachingPosition: position } : {}, teachingProgress, practiceDrafts };
  }

  // packages/storage/src/indexeddb.ts
  var STORE_NAMES = [
    "projects",
    "files",
    "preferences",
    "teachingPosition",
    "teachingProgress",
    "practiceDrafts",
    "syncQueue",
    "meta"
  ];
  function openStorageDatabase(name = STORAGE_DB_NAME) {
    if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB is unavailable"));
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, STORAGE_SCHEMA_VERSION);
      request.onerror = () => reject(request.error ?? new Error("Unable to open storage database"));
      request.onupgradeneeded = () => {
        const database = request.result;
        for (const store of STORE_NAMES) {
          if (!database.objectStoreNames.contains(store)) database.createObjectStore(store, { keyPath: "id" });
        }
        request.transaction?.objectStore("meta").put({ id: "schema", schemaVersion: STORAGE_SCHEMA_VERSION });
      };
      request.onsuccess = () => resolve(request.result);
    });
  }
  async function getDeviceId(database) {
    const current = await readMeta(database, "device");
    if (current?.deviceId) return current.deviceId;
    const deviceId = crypto.randomUUID();
    await writeMeta(database, { id: "device", deviceId });
    return deviceId;
  }
  function readMeta(database, id2) {
    return new Promise((resolve, reject) => {
      const request = database.transaction("meta", "readonly").objectStore("meta").get(id2);
      request.onerror = () => reject(request.error ?? new Error("Unable to read storage metadata"));
      request.onsuccess = () => resolve(request.result);
    });
  }
  function writeMeta(database, value) {
    return new Promise((resolve, reject) => {
      const request = database.transaction("meta", "readwrite").objectStore("meta").put(value);
      request.onerror = () => reject(request.error ?? new Error("Unable to write storage metadata"));
      request.onsuccess = () => resolve();
    });
  }

  // packages/storage/src/browser.ts
  var LEGACY_KEYS = {
    editor: "caie9618.editor.v1",
    progress: "caie.teaching.progress.v1",
    gates: "caie.teaching.gates.v1",
    position: "caie.teaching.position.v1",
    answers: "caie.teaching.answers.v1"
  };
  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
    } catch {
      return fallback;
    }
  }
  function mirrorEditor(editor, teaching) {
    void openStorageDatabase().then(async (database) => {
      await getDeviceId(database);
      const snapshot = migrateLegacyState(editor, teaching);
      const transaction = database.transaction(["projects", "files", "preferences", "teachingPosition", "teachingProgress", "practiceDrafts"], "readwrite");
      for (const project of snapshot.projects) transaction.objectStore("projects").put(project);
      for (const file of snapshot.files) transaction.objectStore("files").put(file);
      transaction.objectStore("preferences").put(snapshot.preferences);
      if (snapshot.teachingPosition) transaction.objectStore("teachingPosition").put(snapshot.teachingPosition);
      for (const progress of snapshot.teachingProgress) transaction.objectStore("teachingProgress").put(progress);
      for (const draft of snapshot.practiceDrafts) transaction.objectStore("practiceDrafts").put(draft);
    }).catch(() => {
    });
  }
  var BrowserStorage = {
    key: LEGACY_KEYS,
    get(key, fallback) {
      return read(key, fallback);
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        return;
      }
      if (key === LEGACY_KEYS.editor || key === LEGACY_KEYS.progress || key === LEGACY_KEYS.gates || key === LEGACY_KEYS.position || key === LEGACY_KEYS.answers) {
        mirrorEditor(read(LEGACY_KEYS.editor, {}), {
          gates: read(LEGACY_KEYS.gates, {}),
          position: read(LEGACY_KEYS.position, null),
          answers: read(LEGACY_KEYS.answers, {})
        });
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
      }
    }
  };
  if (typeof window !== "undefined") window.CAIEStorage = BrowserStorage;
  return __toCommonJS(browser_exports);
})();
