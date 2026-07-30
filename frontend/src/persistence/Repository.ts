export interface Repository<T> {
  get(id: string): T | undefined
  getAll(): T[]
  set(id: string, value: T): void
  delete(id: string): void
  clear(): void
}
