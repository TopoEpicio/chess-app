import type { PuzzleTheme } from './types.ts'

const BASE_DIFFICULTY: Record<string, number> = {
  hanging_piece: 2,
  fork: 3,
  skewer: 4,
  pin: 5,
  double_attack: 4,
  checkmate: 6,
}

export class DifficultyCalculator {
  static calculate(theme: PuzzleTheme | string, solutionLength: number, hasCapture: boolean): number {
    let base = BASE_DIFFICULTY[theme] ?? 3
    if (solutionLength >= 6) {
      base += 4
    } else if (solutionLength >= 4) {
      base += 2
    }
    if (hasCapture) {
      base += 1
    }
    return Math.max(1, Math.min(10, base))
  }
}
