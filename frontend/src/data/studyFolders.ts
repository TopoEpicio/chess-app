import { openDB, type IDBPDatabase } from 'idb'

export interface StudyFolder {
  id?: number
  name: string
  description?: string
  openingIds: number[]
  createdAt: string
}

const DB_NAME = 'chess-app-study-folders'
const STORE_NAME = 'folders'

let dbPromise: Promise<IDBPDatabase> | null = null
let dbInstance: IDBPDatabase | null = null

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
        }
      },
    }).then((db) => {
      dbInstance = db
      return db
    })
  }
  return dbPromise
}

/** @internal - only for testing */
export function __resetDbForTest(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
  dbPromise = null
}

export async function createFolder(data: { name: string; description?: string }): Promise<StudyFolder> {
  const db = await getDb()
  const id = await db.add(STORE_NAME, {
    name: data.name,
    description: data.description ?? '',
    openingIds: [],
    createdAt: new Date().toISOString(),
  })
  return (await db.get(STORE_NAME, id)) as StudyFolder
}

export async function listFolders(): Promise<StudyFolder[]> {
  const db = await getDb()
  return (await db.getAll(STORE_NAME)) as StudyFolder[]
}

export async function updateFolder(id: number, data: { name?: string; description?: string }): Promise<StudyFolder> {
  const db = await getDb()
  const existing = await db.get(STORE_NAME, id)
  if (!existing) throw new Error(`Folder ${id} not found`)
  const updated = { ...existing, ...data }
  await db.put(STORE_NAME, updated)
  return (await db.get(STORE_NAME, id)) as StudyFolder
}

export async function deleteFolder(id: number): Promise<void> {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}

export async function addOpeningToFolder(folderId: number, openingId: number): Promise<void> {
  const db = await getDb()
  const folder = await db.get(STORE_NAME, folderId)
  if (!folder) throw new Error(`Folder ${folderId} not found`)
  if (!folder.openingIds.includes(openingId)) {
    folder.openingIds.push(openingId)
    await db.put(STORE_NAME, folder)
  }
}

export async function removeOpeningFromFolder(folderId: number, openingId: number): Promise<void> {
  const db = await getDb()
  const folder = await db.get(STORE_NAME, folderId)
  if (!folder) throw new Error(`Folder ${folderId} not found`)
  folder.openingIds = folder.openingIds.filter((id: number) => id !== openingId)
  await db.put(STORE_NAME, folder)
}
