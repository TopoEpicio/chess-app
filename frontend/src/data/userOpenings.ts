import { openDB, type IDBPDatabase } from 'idb'

export interface UserOpening {
  id?: number
  name: string
  fen: string
  eco?: string
  variationName?: string
  createdAt: string
}

const DB_NAME = 'chess-app-user-openings'
const STORE_NAME = 'openings'

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
        store.createIndex('fen', 'fen', { unique: false })
      }
    },
  })
}

export async function saveUserOpening(opening: Omit<UserOpening, 'id' | 'createdAt'>): Promise<UserOpening> {
  const db = await getDb()
  try {
    const id = await db.add(STORE_NAME, {
      ...opening,
      createdAt: new Date().toISOString(),
    })
    const saved = await db.get(STORE_NAME, id)
    return saved as UserOpening
  } finally {
    db.close()
  }
}

export async function listUserOpenings(): Promise<UserOpening[]> {
  const db = await getDb()
  try {
    return (await db.getAll(STORE_NAME)) as UserOpening[]
  } finally {
    db.close()
  }
}

export async function isDuplicateFen(fen: string): Promise<boolean> {
  const db = await getDb()
  try {
    const existing = await db.getFromIndex(STORE_NAME, 'fen', fen)
    return existing !== undefined
  } finally {
    db.close()
  }
}

export async function deleteUserOpening(id: number): Promise<void> {
  const db = await getDb()
  try {
    await db.delete(STORE_NAME, id)
  } finally {
    db.close()
  }
}
