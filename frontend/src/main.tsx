import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ApiProvider } from './api/provider'
import { EngineProvider } from './engine/EngineProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider>
      <EngineProvider>
        <App />
      </EngineProvider>
    </ApiProvider>
  </StrictMode>,
)
