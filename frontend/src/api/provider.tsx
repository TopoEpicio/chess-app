import { createContext, useContext, type ReactNode } from 'react'
import type { ApiClient } from './interface.ts'
import { FetchApiClient } from './fetch-client.ts'

const ApiContext = createContext<ApiClient>(new FetchApiClient())

interface ApiProviderProps {
  children: ReactNode
  client?: ApiClient
}

export function ApiProvider({ children, client }: ApiProviderProps) {
  return (
    <ApiContext.Provider value={client ?? new FetchApiClient()}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApi(): ApiClient {
  return useContext(ApiContext)
}
