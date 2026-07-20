import type { DailyStats, Opening, StudyResource } from '../types'

export function normalizeStats(raw: unknown): DailyStats {
  const r = raw as Record<string, unknown>
  return {
    date: (r.stat_date ?? r.date) as string,
    puzzlesSolved: (r.puzzles_solved ?? r.puzzlesSolved ?? 0) as number,
    puzzlesCorrect: (r.puzzles_correct ?? r.puzzlesCorrect ?? 0) as number,
    repertoireReviewed: (r.repertoire_reviewed ?? r.repertoireReviewed ?? 0) as number,
    repertoireAccuracy: (r.repertoire_accuracy ?? r.repertoireAccuracy ?? 0) as number,
    gamesAnalyzed: (r.games_analyzed ?? r.gamesAnalyzed ?? 0) as number,
    streakDays: (r.streak_days ?? r.streakDays ?? 0) as number,
  }
}

export function normalizeOpening(raw: unknown): Opening {
  const r = raw as Record<string, unknown>
  return {
    id: String(r.id),
    name: r.name as string,
    side: (r.side ?? 'white') as 'white' | 'black',
    startingFen: (r.starting_fen ?? r.startingFen ?? 'start') as string,
    startingNodeId: (r.starting_node_id ?? r.startingNodeId) != null
      ? String(r.starting_node_id ?? r.startingNodeId) : null,
    ecoCode: (r.eco_code ?? r.ecoCode ?? null) as string | null,
    colorCode: (r.color_code ?? r.colorCode ?? 'green') as 'green' | 'yellow' | 'red',
    nodeCount: (r.node_count ?? r.nodeCount ?? 0) as number,
    createdAt: (r.created_at ?? r.createdAt ?? '') as string,
  }
}

export function normalizeStudyResource(raw: unknown): StudyResource {
  const r = raw as Record<string, unknown>
  return {
    id: r.id as number,
    type: r.type as StudyResource['type'],
    name: r.name as string,
    description: (r.description ?? '') as string,
    url: (r.url ?? null) as string | null,
    fileName: (r.file_name ?? r.fileName ?? null) as string | null,
    fileSize: (r.file_size ?? r.fileSize ?? null) as number | null,
    openingId: (r.opening_id ?? r.openingId ?? null) as number | null,
    createdAt: (r.created_at ?? r.createdAt ?? '') as string,
  }
}
