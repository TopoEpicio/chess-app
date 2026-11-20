import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock react-i18next so `t()` works in jsdom tests without the HTTP backend.
// Looks up keys directly from the bundled English translation JSON.
const enTranslations = require('../public/locales/en/common.json')
const itTranslations = require('../public/locales/it/common.json')
const t = (key: string) => {
  const parts = key.split('.')
  let val: any = enTranslations
  for (const p of parts) {
    if (val == null || typeof val !== 'object') return key
    val = val[p]
  }
  return typeof val === 'string' ? val : key
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t, i18n: { language: 'en', changeLanguage: () => Promise.resolve() } }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: (instance: any) => {
      instance.resources = {
        en: { common: enTranslations.common, analysis: enTranslations.analysis },
        it: { common: itTranslations.common, analysis: itTranslations.analysis },
      }
      instance.options.ns = ['common', 'analysis']
      instance.options.defaultNS = 'common'
      instance.language = 'en'
      instance.isInitialized = true
      instance.isInitializedInstance = true
    },
  },
}))

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

// Use fake-indexeddb for in-memory IndexedDB in tests
import 'fake-indexeddb/auto'

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn().mockReturnValue('mock-uuid-' + Math.random().toString(36).substr(2, 9)),
  },
  writable: true,
})
