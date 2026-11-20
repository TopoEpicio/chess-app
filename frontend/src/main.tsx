import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App'
import { ApiProvider } from './api/provider'
import { ThemeProvider } from './stores/themeStore'
import { EngineConfigProvider } from './stores/engineStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider>
      <ThemeProvider>
        <EngineConfigProvider>
          <App />
        </EngineConfigProvider>
      </ThemeProvider>
    </ApiProvider>
  </StrictMode>,
)
