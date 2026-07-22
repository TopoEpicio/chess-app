import { useMemo } from 'react'
import { useTheme } from '../../stores/themeStore'
import { BOARD_COLORS } from './boardColors'

export function useBoardStyles() {
  const { boardTheme, squareOpacity, pieceShadow } = useTheme()
  const colors = BOARD_COLORS[boardTheme] ?? BOARD_COLORS.default

  return useMemo(() => ({
    darkSquareStyle: {
      backgroundColor: colors.dark,
      opacity: squareOpacity,
    },
    lightSquareStyle: {
      backgroundColor: colors.light,
      opacity: squareOpacity,
    },
    boardStyle: {
      borderRadius: '8px',
      boxShadow: pieceShadow
        ? '0 4px 16px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)'
        : '0 2px 12px rgba(45, 53, 39, 0.08)',
    },
  }), [boardTheme, squareOpacity, pieceShadow])
}
