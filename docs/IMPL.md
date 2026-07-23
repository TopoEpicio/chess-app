# Piano Implementazione — Sezione Analisi V2

## Stato attuale (Fase 1-2 complete ✅)

### Moduli già implementati
| Modulo | File | Test |
|--------|------|------|
| math utilities | `src/lib/math.ts` | 18 |
| win probability (lichess) | `src/engine/helpers/winPercentage.ts` | 9 |
| Stockfish output parser | `src/engine/helpers/parseResults.ts` | 12 |
| chess helpers (material, sacrifice, UCI) | `src/engine/helpers/chess.ts` | 10 |
| move classification (10 livelli) | `src/engine/helpers/moveClassification.ts` | 6 |
| accuracy (lichess formula) | `src/engine/helpers/accuracy.ts` | 4 |
| ELO estimation | `src/engine/helpers/estimateElo.ts` | 5 |
| Tipi eval (PositionEval, GameEval, ecc.) | `src/types/eval.ts` | — |
| Tipi MoveClassification aggiornati | `src/types/analysis.ts` | — |
| Openings stub | `src/data/openings.ts` | — |

---

## Fase 3 — UciEngine + Worker Pool

### Obiettivo
Copiare `UciEngine.ts` da Chesskit adattandolo al nostro ambiente Stockfish WASM.

### Dipendenze
- `src/types/eval.ts` ✅
- `src/engine/helpers/parseResults.ts` ✅
- `src/engine/helpers/chess.ts` ✅

### Cosa creare

#### `src/engine/worker.ts`
Adattatore universale per creare worker engine (WASM o Web Worker).

```typescript
export interface EngineWorker {
  isReady: boolean
  onMessage: ((msg: string) => void) | null
  postMessage(msg: string): void
  terminate(): void
}

export function getEngineWorker(path: string): EngineWorker
// Se path include ".wasm" → crea StockfishWasmAdapter
// Se path include ".js" → crea Web Worker nativo
```

**Implementazione StockfishWasmAdapter:**
```typescript
// Crea istanza Stockfish WASM via script Stockfish
// Incapsula in interfaccia EngineWorker
// postMessage invia 'uci'/'isready'/'position'/'go' al worker
// onMessage riceve output Stockfish e lo inoltra
```

**Dettagli critici:**
- Il WASM Stockfish non supporta `UCI_Elo` — `setElo()` deve essere un no-op o lanciare warning
- `customEngineInit` può configurare `setoption name` aggiuntivi per WASM
- `multiPv` va settato via `setoption name MultiPV value N`

#### `src/engine/UciEngine.ts`
Copiato da Chesskit `src/lib/engine/uciEngine.ts` con modifiche:
- Rimosso `import { getEngineWorker, sendCommandsToWorker } from "./worker"` → importa dal nostro `worker.ts`
- `addNewWorker()` invece di creare `new Worker()`, chiama `getEngineWorker(this.enginePath)`
- `sendCommandsToWorker` funzione helper che invia comandi seriali e raccoglie output fino a `finalMessage`

```typescript
export class UciEngine {
  private constructor(
    private engineName: string,
    private enginePath: string,
    private customEngineInit?: (worker: EngineWorker) => Promise<void>,
  ) {}

  static async create(engineName: string, enginePath: string, customEngineInit?): Promise<UciEngine>

  // Metodi pubblici
  evaluateGame(params: EvaluateGameParams): Promise<GameEval>
  evaluatePositionWithUpdate(params: EvaluatePositionWithUpdateParams): Promise<PositionEval>
  getEngineNextMove(fen: string, elo: number, depth?: number): Promise<string | undefined>
  shutdown(): void
  stopAllCurrentJobs(): Promise<void>
  getIsReady(): boolean
}
```

**Metodo `evaluateGame()`:**
1. Setta `multiPv`, `workersNb`
2. Mappa tutte le FEN in parallelo con `Promise.all`
3. Per ogni FEN:
   - Se scacco matto/stallo → eval immediato
   - Altrimenti → `this.evaluatePosition(fen, depth)`
4. Post-processing: `getMovesClassification()`, `computeAccuracy()`, `computeEstimatedElo()`
5. Restituisce `GameEval`

**Metodo `evaluatePositionWithUpdate()`:**
1. Tenta Lichess cloud eval (opzionale, stub per ora)
2. Se insufficiente → chiama engine locale con `sendCommands` e throttle 60ms
3. Chiama `setPartialEval()` a ogni update throttlato

**Worker pool:**
- `acquireWorker()` / `releaseWorker()` pattern
- Se nessun worker disponibile, job in coda (`workerQueue`)
- `workersNb` default = `Math.max(1, Math.floor(navigator.hardwareConcurrency / 2))`

### Test

#### `src/engine/__tests__/UciEngine.test.ts`
```typescript
describe('UciEngine', () => {
  it('creates engine and becomes ready')
  it('evaluatePosition returns PositionEval with lines')
  it('evaluatePositionWithUpdate returns partial updates')
  it('evaluateGame returns GameEval with classification + accuracy')
  it('stopAllCurrentJobs resolves pending jobs')
  it('getEngineNextMove returns valid UCI move')
  it('handles mate positions')
  it('handles stalemate positions')
  it('worker pool queues jobs when all busy')
  it('shutdown terminates all workers')
})
```

**Mock worker:** I test usano un `MockWorker` che risponde a comandi UCI con dati precotti invece di chiamare Stockfish reale, per velocità e affidabilità CI.

### Verifica nel browser
1. Console: `const engine = await UciEngine.create('stockfish', '/stockfish.js')`
2. `engine.getIsReady()` → `true`
3. `engine.evaluatePositionWithUpdate({ fen: 'start', multiPv: 3 })` → `PositionEval`
4. DevTools → rete: nessuna chiamata esterna
5. Performance tab: worker pool attivo

---

## Fase 4 — Jotai Atoms + useCurrentPosition

### Obiettivo
Introdurre Jotai per stato reattivo e creare `useCurrentPosition` hook.

### Dipendenze
- `npm install jotai`
- `src/engine/UciEngine.ts` (Fase 3)
- `src/types/eval.ts` ✅

### Cosa creare

#### `src/sections/analysis/states.ts`
```typescript
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const gameEvalAtom = atom<GameEval | undefined>(undefined)
export const gameAtom = atom(new Chess())
export const boardAtom = atom(new Chess())
export const currentPositionAtom = atom<CurrentPosition>({})

export const boardOrientationAtom = atom(true)
export const showBestMoveArrowAtom = atom(true)
export const showPlayerMoveIconAtom = atom(true)

export const engineDepthAtom = atom(14)
export const engineMultiPvAtom = atom(3)
export const engineWorkersNbAtom = atomWithStorage('engineWorkersNb', 2)
export const evaluationProgressAtom = atom(0)

export const savedEvalsAtom = atom<SavedEvals>({})

export const selectedTabAtom = atom<'analysis' | 'graph' | 'classification' | 'coach'>('analysis')
export const arrowConfigAtom = atom<ArrowConfig>(DEFAULT_ARROW_CONFIG)
```

#### `src/sections/analysis/hooks/useCurrentPosition.ts`
Copiato da Chesskit `src/sections/analysis/hooks/useCurrentPosition.ts`:
1. Legge `boardAtom`, `gameEvalAtom`, `gameAtom`, `savedEvalsAtom`, `engineDepthAtom`, `engineMultiPvAtom`
2. Calcola `currentPosition`:
   - `lastMove` dall'history del board
   - Se board è sottoinsieme della partita → cerca eval corrispondente in `gameEval`
   - Matcha openings dal db
3. Se nessun eval disponibile e engine pronto:
   - Controlla `savedEvals[fen]` (cache sessione)
   - Se cache miss → `engine.evaluatePositionWithUpdate()`
   - Salva in `savedEvals`
   - Recupera anche posizione precedente per classificazione
4. Cleanup: `engine.stopAllCurrentJobs()` alla smontatura

#### Modifiche a `EngineProvider.tsx`
- Da RIMUOVERE dopo migrazione — sostituito da Jotai manager
- Transizione: mantenere entrambi finché Analysis.tsx non è migrato

### Test
```typescript
describe('useCurrentPosition', () => {
  it('returns current position with lastMove from board history')
  it('looks up eval from gameEval when board matches game history')
  it('calls evaluatePositionWithUpdate when no eval available')
  it('uses cached eval from savedEvals')
  it('detects opening from fen match')
  it('stops engine jobs on unmount')
})
```

### Verifica nel browser
1. `<pre>{JSON.stringify(useAtomValue(currentPositionAtom))}</pre>` in Analysis.tsx
2. Naviga mosse → `currentPosition` si aggiorna live
3. Carica partita analizzata → nessuna chiamata engine
4. Partita nuova → engine parte e eval arriva

---

## Fase 5 — Board Redesign (Opzione A)

### Obiettivo
Riscrivere `ChessBoard` per accettare `MoveAnalysisData` e decidere internamente frecce, colori, icone.

### Dipendenze
- Fase 4 (Jotai atoms: `arrowConfigAtom`, `showBestMoveArrowAtom`)
- `src/types/analysis.ts` (MoveAnalysisData, MoveClassification) ✅

### Modifiche a `src/components/board/ChessBoard.tsx`

**Nuova interfaccia:**
```tsx
interface ChessBoardProps {
  position: string
  moveData?: MoveAnalysisData
  classification?: MoveClassification
  lastMoveUci?: string
  orientation?: 'white' | 'black'
  onSquareClick?: (square: string) => void
  onRightClick?: (square: string) => void
  onPieceDrop?: (from: string, to: string) => boolean
  highlightedSquares?: Record<string, React.CSSProperties>
}
```

**Comportamento interno:**
- Legge `arrowConfigAtom` e `showBestMoveArrowAtom` da Jotai
- Se `moveData.best_move_uci` e `arrowConfig.showBestMove` → freccia verde
- Se `moveData.second_move_uci` e `arrowConfig.showSecondBest` → freccia blu
- Se `moveData.third_move_uci` e `arrowConfig.showThirdBest` → freccia viola
- Se `classification` non è 'best' → colore sulla casa di destinazione
- Se `classification` è 'splendid', 'brilliant', 'perfect' → icona `!!`
- Se `classification` è 'blunder' → icona `??`
- Right-click su casa → evidenziazione persistente (gestita internamente)

**Cosa rimuovere:**
- `ArrowControls.tsx` — sostituito da logica interna + `arrowConfigAtom`
- `InteractiveBoard` — fuso in ChessBoard

### Nuovo componente: `src/components/board/SquareRenderer.tsx`

Overlay SVG su scacchiera per:
- Icone classificazione su casa di destinazione
- Colore di sfondo su ultima mossa
- Highlight da right-click

```tsx
interface SquareRendererProps {
  squares: { square: string; style: React.CSSProperties }[]
  icons: { square: string; icon: string; color: string }[]
  rightClickSquares: Record<string, React.CSSProperties>
  boardWidth: number
}
```

### Test
```typescript
describe('ChessBoard', () => {
  it('renders board with correct orientation')
  it('shows green arrow for best move')
  it('shows red arrow for threat when showThreats is true')
  it('colors destination square based on classification')
  it('shows !! icon for splendid move')
  it('shows ?? icon for blunder')
  it('highlights square on right-click')
  it('removes highlight on second right-click')
  it('supports piece drag and drop')
})
```

### Verifica nel browser
1. Carica partita analizzata → frecce verdi sulle mosse migliori
2. Tab frecce → attiva/disattiva → frecce appaiono/scompaiono
3. Mossa blunder → casa rossa + icona `??`
4. Mossa brillante → icona `!!`
5. Right-click su casa → si evidenzia

---

## Fase 6 — Ristrutturare Analysis.tsx

### Obiettivo
Da 406 linee monolitiche a orchestratore di moduli.

### Dipendenze
- Fase 4 (Jotai atoms)
- Fase 5 (Board)
- Tutti i moduli engine (Fase 1-3)
- Componenti UI esistenti (TabNav, EvaluationChart, MoveClassificationTable, ProgressBar, PgnImporter)
- Componenti nuovi (panelBody tabs di Fase 9-10, per ora stub)

### Nuova struttura file

```
src/sections/analysis/
├── panelHeader/
│   └── index.tsx         — Info partita, bottoni Analizza/Salva/Import
├── panelToolbar/
│   └── index.tsx         — Navigazione mosse, flip, save/export
└── panelBody/
    ├── analysisTab/
    │   └── index.tsx     — Accuratezza, engine lines, classificazione corrente
    ├── graphTab/
    │   └── index.tsx     — EvaluationChart con ReferenceLine (Fase 8)
    ├── classificationTab/
    │   └── index.tsx     — Recap navigabile (Fase 10)
    └── coachTab/
        └── index.tsx     — Spiegazioni NLP, pattern tattici (nostro)
```

### Logica da spostare

| Logica attuale in Analysis.tsx | Nuovo modulo |
|------------------------------|-------------|
| `handleImport()` | `panelHeader/index.tsx` |
| `saveAnalysis()` | `panelBody/analysisTab/index.tsx` |
| `createPuzzleFromPosition()` | `panelBody/coachTab/index.tsx` |
| Navigazione mosse | `panelToolbar/index.tsx` |
| `startAnalysis()` | `states.ts` + `useCurrentPosition.ts` |
| `useEffect` auto-analysis | `useCurrentPosition.ts` |
| `useEffect` arrows | Interno a ChessBoard (Fase 5) |
| `analysisResult` state | `currentPositionAtom.eval` |
| `gameResult` state | `gameEvalAtom` |
| `arrowConfig` state | `arrowConfigAtom` |
| `selectedTab` state | `selectedTabAtom` |
| `arrows` state | Interno a ChessBoard |

### Analysis.tsx finale (orchestratore, ~100 linee)

```tsx
export function Analysis({ gameId, onBack }) {
  return (
    <AnalysisLayout>
      <PanelHeader />
      <BoardSection>
        <EvaluationBar />
        <ChessBoard />
      </BoardSection>
      <PanelToolbar />
      <TabNav />
      <PanelBody />
    </AnalysisLayout>
  )
}
```

### Test
- Test di integrazione: render pagina, click bottoni, navigazione tab
- Ogni modulo testato singolarmente
- Regression test: tutti i 139+ test esistenti devono passare

### Verifica nel browser
Checklist completa:
- [ ] Import PGN → partita caricata
- [ ] Analizza Partita → progress bar → risultati
- [ ] Navigazione mosse → board si aggiorna
- [ ] Salva Analisi → toast verde
- [ ] Cambio tab → ogni tab mostra dati corretti
- [ ] Puzzle generation → funziona
- [ ] Flip board → board ruota
- [ ] Download PGN → file scaricato

---

## Fase 7 — Aperture

### Obiettivo
Db aperture completo + riconoscimento + ricerca + cartelle studio.

### Dipendenze
- `src/data/openings.ts` stub ✅ (da popolare)
- Fase 6 (useCurrentPosition per match automatico)
- IndexedDB per persistenza utente

### 7a — Popolare db aperture

#### `src/data/openings.ts`
Da Chesskit: ~500 aperture con `{ name, fen, variations }`. Formato:

```typescript
export interface Opening {
  id: string           // "italian-game"
  name: string         // "Italian Game: Two Knights Defense"
  fen: string          // FEN board-only (senza metadati)
  eco?: string         // "C50"
  variations: {
    name: string       // "Italian Game: Two Knights Defense - 5.d3"
    moves: string[]    // ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6"]
    fen: string
  }[]
}
```

**Ricerca da effettuare:**
- Estrarre le ~500 aperture da Chesskit via GitHub API (scaricare il file `src/data/openings/`)
- Convertire nel nostro formato
- Verificare che i FEN matchino correttamente con `chess.js`

### 7b — Riconoscimento automatico
In `useCurrentPosition.ts`:

```typescript
for (const move of boardHistory.slice().reverse()) {
  const moveFen = move.after.split(' ')[0]
  const opening = openings.find(o => o.fen === moveFen)
  if (opening) {
    currentPosition.opening = opening.name
    break
  }
}
```

Se matcha → `currentPosition.opening` viene popolato → `panelHeader` mostra nome apertura → `moveClassification` etichetta come `Opening`.

### 7c — Ricerca

```typescript
export function searchOpenings(query: string): Opening[] {
  const q = query.toLowerCase()
  return openings.filter(o =>
    o.name.toLowerCase().includes(q) ||
    o.variations.some(v => v.name.toLowerCase().includes(q))
  )
}
```

Componente `SearchDialog`:
- Input text con debounce
- Risultati cliccabili → naviga alla posizione FEN corrispondente
- Mostra nome apertura, ECO code, variazione

### 7d — Aggiunta utente
- Bottone "Aggiungi alle aperture" in panelHeader
- Controllo: FEN già presente? → redirect con messaggio
- Salva in IndexedDB → `userOpenings[]`

### 7e — Cartelle studio

```typescript
interface StudyFolder {
  id: string
  name: string
  description?: string
  openingIds: string[]
  createdAt: string
}
```

Persistenza: IndexedDB tramite libreria `idb` (npm) o `localforage`.

### Test
```typescript
describe('openings', () => {
  it('matches opening by FEN')
  it('search returns results by name and variation')
  it('search is case-insensitive')
  it('adds user opening to IndexedDB')
  it('detects duplicate FEN on add')
  it('CRUD study folders')
  it('folder contains correct openings')
})
```

---

## Fase 8 — Grafico Interattivo

### Obiettivo
Migliorare `EvaluationChart.tsx` con ReferenceLine, click navigation, dots colorati.

### Dipendenze
- Fase 6 (useCurrentPosition per posizione corrente)
- `moveClassification` per colori dots

### Modifiche a `src/components/analysis/EvaluationChart.tsx`
- Nuova prop: `onMoveClick?: (index: number) => void`
- Nuova prop: `currentMoveIndex?: number` — posizione corrente

**ReferenceLine verticale:**
```tsx
{currentMoveIndex !== undefined && (
  <line
    x1={x(currentMoveIndex)} y1={0}
    x2={x(currentMoveIndex)} y2={height}
    stroke="#666" strokeWidth={1} strokeDasharray="4,4"
  />
)}
```

**Dots colorati:**
Ogni punto dati con `classification != 'best'` ha un dot colorato:
```tsx
<circle
  cx={x(index)} cy={y(score)}
  r={4} fill={CLASSIFICATION_META[classification].color}
  onClick={() => onMoveClick?.(index)}
  style={{ cursor: 'pointer' }}
/>
```

**Tooltip migliorato:**
- Mostra: numero mossa, giocatore, valutazione, classificazione
- Click sul tooltip → naviga

### Test
```typescript
describe('EvaluationChart', () => {
  it('renders evaluation line')
  it('shows reference line at current position')
  it('click on data point triggers onMoveClick')
  it('shows colored dots for non-best moves')
  it('hover tooltip shows classification')
})
```

---

## Fase 9 — Engine Lines Interattive

### Obiettivo
Mostrare fino a 6 linee MultiPV con valutazione, profondità, PV cliccabile.

### Dipendenze
- Fase 4 (currentPositionAtom.lines)
- Fase 6 (analysisTab layout)

### Componente: `src/sections/analysis/panelBody/analysisTab/EngineLines.tsx`
```tsx
interface EngineLinesProps {
  lines: LineEval[]
  multiPv: number         // quante linee mostrare (da engineMultiPvAtom)
  onMoveClick?: (fen: string) => void   // naviga a posizione
}
```

**Per ogni linea:**
```
#1  +0.54  depth 18  e4  e5  Nf3  Nc6  Bc4
#2  +0.30  depth 18  d4  d5  Nf3  Nf6
#3  +0.20  depth 16  Nf3  Nf6  Bc4  e6
```

- Numero linea (#1, #2, #3)
- Valutazione (cp o mate) con colore (verde se >0, rosso se <0)
- Profondità
- Sequenza mosse in SAN (convertite da UCI via chess.js)
- Ogni mossa cliccabile → naviga la board a quella posizione
- Skeleton loader mentre engine pensa

### Conversione UCI → SAN
```typescript
function movesUciToSan(fen: string, uciMoves: string[]): string[] {
  const game = new Chess(fen)
  return uciMoves.map(uci => {
    const move = game.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci[4],
    })
    return move.san
  })
}
```

### Test
```typescript
describe('EngineLines', () => {
  it('renders lines with evaluation and depth')
  it('formats PV as SAN strings')
  it('handles 1, 3, 6 lines')
  it('click on PV move triggers onMoveClick')
  it('shows skeleton while loading')
  it('highlights current move in PV')
})
```

---

## Fase 10 — Classification Recap Navigabile

### Obiettivo
Tabella riepilogativa per tipo di classificazione con click per navigare.

### Dipendenze
- Fase 6 (classificationTab layout)
- `gameEvalAtom.positions` (con classification)

### Componente: `src/sections/analysis/panelBody/classificationTab/ClassificationRecap.tsx`

```tsx
interface ClassificationRecapProps {
  positions: PositionEval[]
  onNavigateToMove: (moveIndex: number) => void
}
```

**Layout tabella:**
| Classificazione | Simbolo | Bianco | Nero |
|----------------|---------|--------|------|
| Splendid       | !!      | 1      | 0    |
| Blunder        | ??      | 0      | 2    |
| Mistake        | ?       | 1      | 1    |
| ...            |         |        |      |

Click su "2" di Blunder/Nero → naviga alla prima mossa blunder del nero
Click di nuovo → naviga alla seconda

**Logica navigazione:**
```typescript
function navigateToClassification(
  classification: string,
  player: 'white' | 'black',
  positions: PositionEval[],
  currentIndex: number,
): number | null {
  const isWhite = player === 'white'
  const startSearch = currentIndex === -1 ? 1 : currentIndex + 1

  for (let i = startSearch; i < positions.length; i++) {
    if (positions[i].moveClassification === classification) {
      const isWhiteMove = (i - 1) % 2 === 0
      if ((isWhite && isWhiteMove) || (!isWhite && !isWhiteMove)) {
        return i
      }
    }
  }
  // Wrap around
  for (let i = 1; i < startSearch; i++) {
    if (positions[i].moveClassification === classification) { ... }
  }
  return null
}
```

### Test
```typescript
describe('ClassificationRecap', () => {
  it('shows correct counts per player')
  it('click on count navigates to first occurrence')
  it('click again navigates to next')
  it('wraps around after last occurrence')
  it('handles empty positions')
})
```

---

## Fase 11 — Coach Tab (Feature Uniche)

### Obiettivo
Integrare spiegazioni NLP, pattern tattici, minacce, concetti, puzzle generation nel tab "Coach".

### Dipendenze
- `src/engine/analysisEngine.ts` (già esistente)
- `currentPositionAtom` (per dati posizione corrente)
- Fase 6 (coachTab layout)

### Componente: `src/sections/analysis/panelBody/coachTab/index.tsx`

```tsx
export function CoachTab() {
  const currentPosition = useAtomValue(currentPositionAtom)
  const { engine } = useEngineContext()

  const explanation = useMemo(() => {
    if (!currentPosition.eval) return null
    return generateExplanation({
      multiPv: currentPosition.eval.lines,
      fen: board.fen(),
    })
  }, [currentPosition])

  if (!explanation) return <LoadingSkeleton />

  return (
    <div>
      <TopMoveExplanation move={explanation.topMove} />
      <AlternativesList alternatives={explanation.alternatives} />
      <ThreatsList threats={explanation.threats} />
      <TacticalPatterns patterns={explanation.tacticalPatterns} />
      <KeyConcepts concepts={explanation.keyConcepts} />
      <CreatePuzzleButton fen={board.fen()} />
    </div>
  )
}
```

### Miglioramenti proposti:
- Aggiungere concetti legati alla classificazione corrente (es. "Blunder: in posizioni simili, controlla sempre i pezzi sospesi")
- Arricchire spiegazioni con dati da `currentPosition.classification`
- Puzzle generation: leggere da `currentPositionAtom` invece che da `useState`

### Test
```typescript
describe('CoachTab', () => {
  it('renders explanation for current position')
  it('shows tactical patterns when detected')
  it('shows threats when detected')
  it('shows key concepts')
  it('create puzzle button opens dialog')
  it('handles missing eval gracefully')
})
```

---

## Riepilogo Ordine Implementazione

| Fase | Cosa | Effort | Test | Vedi nel sito? |
|------|------|--------|------|---------------|
| 1-2 | ✅ COMPLETATO | 0 | 64 test | ❌ |
| **3** | **UciEngine + worker pool** | **4h** | **8-10** | **✅ Console debug** |
| **4** | **Jotai atoms + useCurrentPosition** | **3h** | **5-6** | **✅ DevTools** |
| **5** | **Board redesign (Opzione A)** | **5h** | **8-10** | **✅ Board stessa** |
| **6** | **Ristrutturare Analysis.tsx** | **6h** | **5-7** | **✅ Pagina intera** |
| 7 | Aperture db + ricerca + cartelle | 4h | 6-8 | ✅ Aperture page |
| 8 | Grafico interattivo | 2h | 4-5 | ✅ Grafico |
| 9 | Engine lines interattive | 3h | 5-6 | ✅ Tab Analisi |
| 10 | Classification recap navigabile | 2h | 5-6 | ✅ Tab Class. |
| 11 | Coach tab (feature uniche) | 2h | 4-5 | ✅ Tab Coach |

**Fasi 3-6 sono bloccanti** (fondamenta per tutto il resto).
**Fasi 7-11 sono parallele** tra loro (dipendono solo dalla Fase 6).

---

## Note tecniche importanti

### Worker Stockfish WASM
La nostra attuale implementazione (`StockfishWasmAdapter`) usa un singolo worker WASM. Per il worker pool multiplo:
- Ogni worker è un'istanza separata di `Stockfish()` (lo script WASM)
- Il browser supporta più istanze Stockfish in parallelo (ognuna usa un thread separato via Web Worker)
- `workersNb` default = `hardwareConcurrency / 2` (metà core disponibili)

### API Lichess Cloud Eval (futuro)
Stub lasciato in `evaluatePositionWithUpdate()`:
```typescript
const lichessEvalPromise = getLichessEval(fen, multiPv)
// Se eval lichess ha abbastanza linee e profondità → usa quello
// Altrimenti → engine locale
```
`getLichessEval` da implementare in Fase 9+ (non bloccante).

### Cache savedEvals
- `savedEvalsAtom` è un semplice oggetto `{ [fen]: PositionEval }`
- Non persiste a reload pagina
- Lo scopo è evitare ricalcoli durante navigazione nella stessa sessione
- I dati persistenti arrivano dal backend (`saveAnalysis()` / `getAnalysisResult()`)

### Integrazione con backend attuale
- `saveAnalysis()` → invia `GameEval.positions` + `Accuracy` + `EstimatedElo`
- `getAnalysisResult()` → riempie `gameEvalAtom`
- Compatibilità: il backend deve accettare i nuovi campi (`opening`, `moveClassification` come stringa, `estimatedElo`)
