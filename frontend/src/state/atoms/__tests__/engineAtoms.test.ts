import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'jotai'
import {
  engineStatusAtom,
  engineErrorAtom,
  gameAnalysisProgressAtom,
  gameAnalysisResultsAtom,
  positionEvaluationAtom,
  positionAnalysisProgressAtom,
  engineBestMoveAtom,
  engineDepthAtom,
  engineMultiPvAtom,
  engineSkillLevelAtom,
  arrowConfigAtom,
  setEngineStatusAtom,
  setEngineErrorAtom,
  setGameAnalysisProgressAtom,
  setGameAnalysisResultsAtom,
  setPositionEvaluationAtom,
  setPositionAnalysisProgressAtom,
  setEngineBestMoveAtom,
  resetGameAnalysisAtom,
  resetPositionAnalysisAtom,
} from '../engineAtoms'
import type { PositionEval, GameEval } from '../../types/eval'

const samplePositionEval: PositionEval = {
  lines: [
    {
      pv: ['e2e4', 'e7e5'],
      depth: 18,
      multiPv: 1,
      cp: 20,
    },
  ],
}

const sampleGameEval: GameEval = {
  positions: [
    { lines: [{ pv: [], depth: 0, multiPv: 1, cp: 0 }] },
    { lines: [{ pv: ['e2e4'], depth: 10, multiPv: 1, cp: 20 }] },
  ],
  accuracy: { white: 95, black: 90 },
  estimatedElo: { white: 1800, black: 1700 },
  settings: { engine: 'stockfish', date: '2024-01-01', depth: 16, multiPv: 3 },
}

describe('engineAtoms', () => {
  describe('basic atom defaults', () => {
    it('engineStatusAtom starts as idle', () => {
      const store = createStore()
      expect(store.get(engineStatusAtom)).toBe('idle')
    })

    it('engineErrorAtom starts as null', () => {
      const store = createStore()
      expect(store.get(engineErrorAtom)).toBeNull()
    })

    it('gameAnalysisProgressAtom starts at 0', () => {
      const store = createStore()
      expect(store.get(gameAnalysisProgressAtom)).toBe(0)
    })

    it('gameAnalysisResultsAtom starts as null', () => {
      const store = createStore()
      expect(store.get(gameAnalysisResultsAtom)).toBeNull()
    })

    it('positionEvaluationAtom starts as null', () => {
      const store = createStore()
      expect(store.get(positionEvaluationAtom)).toBeNull()
    })

    it('positionAnalysisProgressAtom starts at 0', () => {
      const store = createStore()
      expect(store.get(positionAnalysisProgressAtom)).toBe(0)
    })

    it('engineBestMoveAtom starts as undefined', () => {
      const store = createStore()
      expect(store.get(engineBestMoveAtom)).toBeUndefined()
    })

    it('engineDepthAtom starts at 16', () => {
      const store = createStore()
      expect(store.get(engineDepthAtom)).toBe(16)
    })

    it('engineMultiPvAtom starts at 3', () => {
      const store = createStore()
      expect(store.get(engineMultiPvAtom)).toBe(3)
    })

    it('engineSkillLevelAtom starts at 20', () => {
      const store = createStore()
      expect(store.get(engineSkillLevelAtom)).toBe(20)
    })

    it('arrowConfigAtom starts with default config', () => {
      const store = createStore()
      const config = store.get(arrowConfigAtom)
      expect(config.showBestMove).toBe(true)
      expect(config.showSecondBest).toBe(false)
      expect(config.showThirdBest).toBe(false)
      expect(config.showThreats).toBe(false)
    })
  })

  describe('setEngineStatusAtom', () => {
    it('updates engine status', () => {
      const store = createStore()
      store.set(setEngineStatusAtom, 'analyzing')
      expect(store.get(engineStatusAtom)).toBe('analyzing')
    })

    it('can transition to error and back', () => {
      const store = createStore()
      store.set(setEngineStatusAtom, 'error')
      expect(store.get(engineStatusAtom)).toBe('error')
      store.set(setEngineStatusAtom, 'idle')
      expect(store.get(engineStatusAtom)).toBe('idle')
    })
  })

  describe('setEngineErrorAtom', () => {
    it('sets error message', () => {
      const store = createStore()
      store.set(setEngineErrorAtom, 'Engine crashed')
      expect(store.get(engineErrorAtom)).toBe('Engine crashed')
    })

    it('clears error with null', () => {
      const store = createStore()
      store.set(setEngineErrorAtom, 'Engine crashed')
      store.set(setEngineErrorAtom, null)
      expect(store.get(engineErrorAtom)).toBeNull()
    })
  })

  describe('setGameAnalysisProgressAtom', () => {
    it('sets progress value', () => {
      const store = createStore()
      store.set(setGameAnalysisProgressAtom, 50)
      expect(store.get(gameAnalysisProgressAtom)).toBe(50)
    })

    it('clamps to 0-100 range', () => {
      const store = createStore()
      store.set(setGameAnalysisProgressAtom, -10)
      expect(store.get(gameAnalysisProgressAtom)).toBe(0)
      store.set(setGameAnalysisProgressAtom, 150)
      expect(store.get(gameAnalysisProgressAtom)).toBe(100)
    })
  })

  describe('setGameAnalysisResultsAtom', () => {
    it('sets results and sets progress to 100', () => {
      const store = createStore()
      store.set(setGameAnalysisProgressAtom, 50)
      store.set(setGameAnalysisResultsAtom, sampleGameEval)
      expect(store.get(gameAnalysisResultsAtom)).toBe(sampleGameEval)
      expect(store.get(gameAnalysisProgressAtom)).toBe(100)
    })

    it('setting null results keeps progress unchanged', () => {
      const store = createStore()
      store.set(setGameAnalysisProgressAtom, 50)
      store.set(setGameAnalysisResultsAtom, null)
      expect(store.get(gameAnalysisResultsAtom)).toBeNull()
      expect(store.get(gameAnalysisProgressAtom)).toBe(50)
    })
  })

  describe('setPositionEvaluationAtom', () => {
    it('sets position evaluation', () => {
      const store = createStore()
      store.set(setPositionEvaluationAtom, samplePositionEval)
      expect(store.get(positionEvaluationAtom)).toBe(samplePositionEval)
    })

    it('clears evaluation with null', () => {
      const store = createStore()
      store.set(setPositionEvaluationAtom, samplePositionEval)
      store.set(setPositionEvaluationAtom, null)
      expect(store.get(positionEvaluationAtom)).toBeNull()
    })
  })

  describe('setPositionAnalysisProgressAtom', () => {
    it('sets progress value', () => {
      const store = createStore()
      store.set(setPositionAnalysisProgressAtom, 75)
      expect(store.get(positionAnalysisProgressAtom)).toBe(75)
    })

    it('clamps to 0-100 range', () => {
      const store = createStore()
      store.set(setPositionAnalysisProgressAtom, -5)
      expect(store.get(positionAnalysisProgressAtom)).toBe(0)
      store.set(setPositionAnalysisProgressAtom, 200)
      expect(store.get(positionAnalysisProgressAtom)).toBe(100)
    })
  })

  describe('setEngineBestMoveAtom', () => {
    it('sets best move', () => {
      const store = createStore()
      store.set(setEngineBestMoveAtom, 'e2e4')
      expect(store.get(engineBestMoveAtom)).toBe('e2e4')
    })

    it('clears best move with undefined', () => {
      const store = createStore()
      store.set(setEngineBestMoveAtom, 'e2e4')
      store.set(setEngineBestMoveAtom, undefined)
      expect(store.get(engineBestMoveAtom)).toBeUndefined()
    })
  })

  describe('resetGameAnalysisAtom', () => {
    it('resets all game analysis state', () => {
      const store = createStore()
      store.set(setGameAnalysisProgressAtom, 50)
      store.set(setGameAnalysisResultsAtom, sampleGameEval)
      store.set(setEngineStatusAtom, 'completed')
      store.set(setEngineErrorAtom, 'some error')

      store.set(resetGameAnalysisAtom)

      expect(store.get(gameAnalysisProgressAtom)).toBe(0)
      expect(store.get(gameAnalysisResultsAtom)).toBeNull()
      expect(store.get(engineStatusAtom)).toBe('idle')
      expect(store.get(engineErrorAtom)).toBeNull()
    })
  })

  describe('resetPositionAnalysisAtom', () => {
    it('resets all position analysis state', () => {
      const store = createStore()
      store.set(setPositionEvaluationAtom, samplePositionEval)
      store.set(setPositionAnalysisProgressAtom, 80)
      store.set(setEngineBestMoveAtom, 'e2e4')

      store.set(resetPositionAnalysisAtom)

      expect(store.get(positionEvaluationAtom)).toBeNull()
      expect(store.get(positionAnalysisProgressAtom)).toBe(0)
      expect(store.get(engineBestMoveAtom)).toBeUndefined()
    })
  })
})
