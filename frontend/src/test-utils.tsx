import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Create a test QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

interface TestWrapperProps {
  children: ReactNode
  queryClient?: QueryClient
}

export function TestWrapper({
  children,
  queryClient = createTestQueryClient(),
}: TestWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: ReactNode,
  options: RenderWithProvidersOptions = {}
) {
  const { queryClient, ...renderOptions } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper queryClient={queryClient}>{children}</TestWrapper>
    ),
    ...renderOptions,
  })
}

// Re-export everything from RTL
export * from '@testing-library/react'