/**
 * Temporary DICOM file storage for cross-page transfer.
 * Uses an in-memory cache (fast, for SPA navigation) backed by IndexedDB (survives page reload).
 */

interface StoredFile {
  name: string;
  arrayBuffer: ArrayBuffer;
}

const DB_NAME = "radiometric-preview";
const STORE_NAME = "dicom-files";
const DB_VERSION = 1;

// In-memory cache for instant access during SPA navigation
let memoryCache: StoredFile[] | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeDicomFiles(files: StoredFile[]): Promise<void> {
  memoryCache = files;

  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  for (const file of files) {
    store.add({ name: file.name, data: file.arrayBuffer });
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadDicomFiles(): Promise<StoredFile[]> {
  if (memoryCache) return memoryCache;

  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();

  const rows = await new Promise<{ name: string; data: ArrayBuffer }[]>(
    (resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }
  );
  db.close();

  const files = rows.map((r) => ({ name: r.name, arrayBuffer: r.data }));
  memoryCache = files;
  return files;
}

export async function clearDicomFiles(): Promise<void> {
  memoryCache = null;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Ignore cleanup errors
  }
}
