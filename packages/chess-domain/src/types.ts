export const PUZZLE_THEMES = [
  "fork", "pin", "skewer", "double_attack",
  "checkmate", "hanging_piece", "discovered_attack",
] as const
export type PuzzleTheme = typeof PUZZLE_THEMES[number]

export const GAME_PHASES = [
  "opening", "middlegame", "endgame",
] as const
export type GamePhase = typeof GAME_PHASES[number]

export interface TacticalMoment {
  fenBefore: string
  winningMoveSan: string
  theme: PuzzleTheme
  solution: string[]
  difficulty: number
  phase: GamePhase
}
