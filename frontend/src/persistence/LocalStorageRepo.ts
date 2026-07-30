import type { Repository } from './Repository'

export class LocalStorageRepo<T> implements Repository<T> {
  private key: string

  constructor(key: string) {
    this.key = `chess:${key}`
  }

  get(id: string): T | undefined {
    const raw = localStorage.getItem(`${this.key}:${id}`)
    if (!raw) return undefined
    try { return JSON.parse(raw) as T } catch { return undefined }
  }

  getAll(): T[] {
    const items: T[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(`${this.key}:`)) {
        const raw = localStorage.getItem(k)
        if (raw) {
          try { items.push(JSON.parse(raw)) } catch { /* skip */ }
        }
      }
    }
    return items
  }

  set(id: string, value: T): void {
    localStorage.setItem(`${this.key}:${id}`, JSON.stringify(value))
  }

  delete(id: string): void {
    localStorage.removeItem(`${this.key}:${id}`)
  }

  clear(): void {
    const toRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(`${this.key}:`)) toRemove.push(k)
    }
    toRemove.forEach((k) => localStorage.removeItem(k))
  }
}
