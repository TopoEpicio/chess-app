import type { MoveClassification } from '../../types/analysis'
import { CLASSIFICATION_META } from '../../types/analysis'

interface SquareStylesInput {
  lastMoveUci?: string
  classification?: MoveClassification
  rightClickHighlights?: Record<string, React.CSSProperties>
}

type SquareStyles = Record<string, React.CSSProperties>

export function getSquareStyles(input: SquareStylesInput): SquareStyles {
  const styles: SquareStyles = {}

  if (input.lastMoveUci) {
    const from = input.lastMoveUci.slice(0, 2)
    const to = input.lastMoveUci.slice(2, 4)
    if (from) {
      styles[from] = { backgroundColor: 'rgba(255, 255, 0, 0.3)' }
    }
    if (to) {
      const classificationColor = input.classification
        ? CLASSIFICATION_META[input.classification]?.color
        : undefined
      styles[to] = {
        backgroundColor: classificationColor
          ? hexToRgba(classificationColor, 0.5)
          : 'rgba(255, 255, 0, 0.3)',
      }
    }
  }

  if (input.rightClickHighlights) {
    Object.assign(styles, input.rightClickHighlights)
  }

  return styles
}

interface ClassificationIcon {
  square: string
  icon: string
  color: string
}

export function getClassificationIcons(input: {
  classification?: MoveClassification
  lastMoveUci?: string
}): ClassificationIcon[] {
  if (!input.classification || !input.lastMoveUci) return []

  const meta = CLASSIFICATION_META[input.classification]
  if (!meta?.symbol) return []

  const to = input.lastMoveUci.slice(2, 4)
  if (!to) return []

  return [{ square: to, icon: meta.symbol, color: meta.color }]
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
