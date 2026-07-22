export const BOARD_COLORS: Record<string, { light: string; dark: string }> = {
  default: { light: '#edeed7', dark: '#7a9a6a' },
  blue: { light: '#dee8f0', dark: '#6a8aaa' },
  green: { light: '#d8e8d8', dark: '#5a8a5a' },
  brown: { light: '#e8dcc8', dark: '#8a7a5a' },
}

export type BoardTheme = keyof typeof BOARD_COLORS
