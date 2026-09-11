import { STORAGE_DB_NAME, STORAGE_SCHEMA_VERSION } from "./types.js";

export const STORE_NAMES = [
  "projects",
  "files",
  "preferences",
  "teachingPosition",
  "teachingProgress",
  "practiceDrafts",
  "syncQueue",
  "meta"
] as const;

export type StorageMeta = {
  id: "schema" | "device";
  schemaVersion?: number;
  deviceId?: string;
};

export function openStorageDatabase(name = STORAGE_DB_NAME): Promise<IDBDatabase> {
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

export async function getDeviceId(database: IDBDatabase): Promise<string> {
  const current = await readMeta(database, "device");
  if (current?.deviceId) return current.deviceId;
  const deviceId = crypto.randomUUID();
  await writeMeta(database, { id: "device", deviceId });
  return deviceId;
}

function readMeta(database: IDBDatabase, id: StorageMeta["id"]): Promise<StorageMeta | undefined> {
  return new Promise((resolve, reject) => {
    const request = database.transaction("meta", "readonly").objectStore("meta").get(id);
    request.onerror = () => reject(request.error ?? new Error("Unable to read storage metadata"));
    request.onsuccess = () => resolve(request.result as StorageMeta | undefined);
  });
}

function writeMeta(database: IDBDatabase, value: StorageMeta): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = database.transaction("meta", "readwrite").objectStore("meta").put(value);
    request.onerror = () => reject(request.error ?? new Error("Unable to write storage metadata"));
    request.onsuccess = () => resolve();
  });
}
