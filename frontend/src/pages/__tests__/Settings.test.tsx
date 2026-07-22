import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ApiProvider } from '../../api/provider.tsx'
import { ThemeProvider } from '../../stores/themeStore.tsx'
import { EngineConfigProvider } from '../../stores/engineStore'
import { MockApiClient } from '../../api/mock-client.ts'
import { Settings } from '../Settings.tsx'

beforeAll(() => {
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    resources: {
      en: {
        common: {
          'settings.title': 'Settings',
          'settings.language': 'Language',
          'settings.theme': 'Theme',
          'settings.board': 'Board',
          'settings.light': 'Light',
          'settings.dark': 'Dark',
          'settings.auto': 'Auto',
          'board.default': 'Default',
          'board.blue': 'Blue',
          'board.green': 'Green',
          'board.brown': 'Brown',
          'board.opacity': 'Square opacity',
          'board.pieceShadow': 'Piece shadow',
        },
      },
    },
    interpolation: { escapeValue: false },
  })
})

function renderSettings(client: MockApiClient) {
  return render(
    <ApiProvider client={client}>
      <ThemeProvider>
        <EngineConfigProvider>
          <Settings />
        </EngineConfigProvider>
      </ThemeProvider>
    </ApiProvider>,
  )
}

describe('Settings page', () => {
  it('renders language, theme, and board sections', async () => {
    const client = new MockApiClient()
    renderSettings(client)

    expect(await screen.findByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Theme')).toBeInTheDocument()
    expect(screen.getByText('Board')).toBeInTheDocument()
  })

  it('shows current locale from settings', async () => {
    const client = new MockApiClient()
    client.setSettings({
      i18n: { default_locale: 'it', supported_locales: ['it', 'en'] },
      theme: { default_theme: 'dark', default_board_theme: 'blue' },
      board: { square_opacity: 0.8, piece_shadow: false },
    })
    renderSettings(client)

    expect(await screen.findByText('Board')).toBeInTheDocument()
  })
})
