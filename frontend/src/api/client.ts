import { FetchApiClient } from './fetch-client.ts'
import type { ApiClient } from './interface.ts'

export const api: ApiClient = new FetchApiClient()
export type { ApiClient }
export { FetchApiClient } from './fetch-client.ts'
export { MockApiClient } from './mock-client.ts'
export { ApiProvider, useApi } from './provider.tsx'
