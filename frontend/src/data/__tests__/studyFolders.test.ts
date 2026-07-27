import { describe, it, expect, beforeEach } from 'vitest'
import {
  createFolder,
  listFolders,
  updateFolder,
  deleteFolder,
  addOpeningToFolder,
  removeOpeningFromFolder,
  __resetDbForTest,
} from '../studyFolders'
import { deleteDB } from 'idb'

describe('studyFolders', () => {
  beforeEach(async () => {
    __resetDbForTest()
    await deleteDB('chess-app-study-folders')
  })

  it('creates a folder and returns it with id', async () => {
    const folder = await createFolder({ name: 'My Openings', description: 'Personal collection' })
    expect(folder.id).toBeGreaterThan(0)
    expect(folder.name).toBe('My Openings')
    expect(folder.description).toBe('Personal collection')
    expect(folder.openingIds).toEqual([])
    expect(folder.createdAt).toBeTruthy()
  })

  it('lists all folders', async () => {
    await createFolder({ name: 'Folder A' })
    await createFolder({ name: 'Folder B' })
    const all = await listFolders()
    expect(all).toHaveLength(2)
    expect(all.map((f) => f.name).sort()).toEqual(['Folder A', 'Folder B'])
  })

  it('updates folder name and description', async () => {
    const folder = await createFolder({ name: 'Old Name', description: 'Old desc' })
    const updated = await updateFolder(folder.id!, { name: 'New Name', description: 'New desc' })
    expect(updated.name).toBe('New Name')
    expect(updated.description).toBe('New desc')
    const all = await listFolders()
    expect(all).toHaveLength(1)
    expect(all[0].name).toBe('New Name')
  })

  it('deletes a folder', async () => {
    const f1 = await createFolder({ name: 'Folder A' })
    const f2 = await createFolder({ name: 'Folder B' })
    await deleteFolder(f1.id!)
    const all = await listFolders()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(f2.id)
  })

  it('adds opening to folder', async () => {
    const folder = await createFolder({ name: 'My Openings' })
    await addOpeningToFolder(folder.id!, 1)
    await addOpeningToFolder(folder.id!, 2)
    const all = await listFolders()
    expect(all).toHaveLength(1)
    expect(all[0].openingIds).toEqual([1, 2])
  })

  it('removes opening from folder', async () => {
    const folder = await createFolder({ name: 'My Openings' })
    await addOpeningToFolder(folder.id!, 1)
    await addOpeningToFolder(folder.id!, 2)
    await addOpeningToFolder(folder.id!, 3)
    await removeOpeningFromFolder(folder.id!, 2)
    const all = await listFolders()
    expect(all[0].openingIds).toEqual([1, 3])
  })

  it('handles concurrent create and list without "Database closed" errors', async () => {
    const [folder1, list1, folder2, list2] = await Promise.all([
      createFolder({ name: 'A' }),
      listFolders(),
      createFolder({ name: 'B' }),
      listFolders(),
    ])
    expect(folder1.name).toBe('A')
    expect(folder2.name).toBe('B')
    expect(list1.some((f) => f.name === 'A')).toBe(true)
    expect(list2.some((f) => f.name === 'B')).toBe(true)
  })

  it('handles empty folder list', async () => {
    const all = await listFolders()
    expect(all).toEqual([])
  })
})
