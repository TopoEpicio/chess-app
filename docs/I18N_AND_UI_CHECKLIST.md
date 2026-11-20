# Frontend — What To Check and What To Add

Working document for closing out the three reported issues (eval bar size, dark theme /
English-default i18n, Analysis page not loading) and finishing the i18n conversion.

Companion files:

- `frontend/public/locales/en/common.json` — source of truth for all UI strings (English).
- `frontend/public/locales/it/common.json` — Italian mirror.
- `frontend/src/setupTests.ts` — global `react-i18next` mock used by the test suite.

---

## 0. Status snapshot

| Area | State | Verified? |
|---|---|---|
| Dark theme | Implemented via `.dark` class + CSS variables (`src/index.css`, `src/stores/themeStore.tsx`) | Confirmed working by user |
| Eval bar width | `evalWidth = 132`, column `width: 132` (`src/components/board/ChessBoard.tsx:164,175,198`) | Not visually verified |
| Board centering | Responsive layout in `ChessBoard.tsx:189-200` | Not visually verified |
| i18n conversion (pages/components) | Converted to `t()` across ~60 files | `npx tsc -b --noEmit` clean |
| Locale parity `en` vs `it` | 670 / 670 leaf keys, no diff | Verified by script |
| Locale parity `es` / `fr` | 321 / 670 keys — **incomplete** | Verified by script |
| Analysis page loads | **Suspected broken**: route param never reaches the page (see §2.4.1) | **Not verified in a running app** |
| Test suite | 41 files / 342 tests passing | Verified |

Commands used for the checks above (run from `frontend/`):

```bat
npx tsc -b --noEmit
npx vitest run
node locale_stats.cjs --details
node audit_i18n.cjs
node scan_italian2.cjs
node check_bare_keys.cjs
node check_placeholders.cjs
```

> The `.cjs` helper scripts are throwaway analysis tools. If you keep them, move them to
> `frontend/scripts/`; otherwise delete them after the checklist is closed.

---

## 1. How to run the app for manual verification

1. Backend (FastAPI) on `http://localhost:8003`, API base `http://localhost:8003/api`
   (hardcoded default in `src/api/fetch-client.ts:6`).
2. Frontend:

```bat
cd frontend
npm install
npm run dev
```

3. Open the app and, before testing, clear state that can mask bugs:

```js
// DevTools console
localStorage.removeItem('chess-theme')   // theme resets to "auto"
localStorage.removeItem('i18nextLng')    // language re-detected from navigator
```

4. Test at three widths: 1440 px, 1024 px, 768 px (board is `responsive` on Analysis,
   fixed `520px` in some places, and `Play`/`GameViewer` use their own containers).

---

## 2. What must be checked

### 2.1 Eval bar (132 px) and board centering

Acceptance criteria:

- [ ] Eval bar column measures **132 px** in DevTools on every page that shows it
      (Analysis, Play, GameViewer, Repertoire viewer, Puzzle solver if applicable).
- [ ] The bar uses the full column height (`w-full h-full`); the numeric eval, side label
      and depth text are stacked *below* the bar, never overlapping it.
- [ ] The board keeps a 1:1 aspect ratio and is not stretched by the eval column.
- [ ] The board + eval bar group is horizontally centred in its card/column with equal
      left/right gutters; no horizontal scrollbar at 768 px.
- [ ] With `showEval={false}`, the board re-centres (total width drops by `132 + 16`).
- [ ] Flipping the board swaps the bar colours but keeps the column at 132 px.

Code to inspect:

- `src/components/board/ChessBoard.tsx` — `evalWidth`, the two layout branches
  (`responsive` and fixed), and the `width: 132` inline style.
- `src/components/board/EvalBar.tsx` — root `div` must be `h-full w-full`; text block uses
  `text-lg` for the eval and `text-[10px]`/`text-[11px]` for label/depth.
- Page call sites: `src/pages/Analysis.tsx:517`, `src/pages/GameViewer.tsx`,
  `src/pages/Play.tsx:176`, `src/components/repertoire/RepertoireViewer.tsx`.

Known risk: `EvalBar` reads `t('analysis.whiteBetter')` / `t('analysis.blackBetter')`;
if either key is missing in a locale the bar shows the raw key (see §3.3).

### 2.2 Dark theme coverage

Mechanism: `document.documentElement.classList.toggle('dark')` (`themeStore.tsx:60-70`) +
CSS variables in `src/index.css` (`--color-bg`, `--color-surface`, `--color-text`,
`--color-border`, …). Anything styled with literal Tailwind colours instead of these
tokens will stay light in dark mode.

Per-route checklist (switch to Dark in Settings, then visit each route):

| Route | Page | What to look for |
|---|---|---|
| `/` | Home | cards, KPI text, hover states |
| `/gioca` | Play | game-over overlay, bot-thinking pill, move list |
| `/studio` | Studio | folder cards, context menu, all five modals |
| `/puzzle` | Puzzles | category tabs, puzzle cards, solver panel, bulk-import modal |
| `/partite` | Games | table rows, empty state |
| `/partite/:id` | GameViewer | board card, move list, buttons |
| `/analisi` | Analysis | header card, KPI row, tabs, engine lines, chart, coach panel |
| `/impostazioni` | Settings | every control |

- [ ] No white rectangles anywhere (modals, dropdowns, tooltips, toasts).
- [ ] Text remains readable on every surface (`--color-text` vs `--color-bg`).
- [ ] Focus rings and disabled states remain visible.
- [ ] `mode: auto` follows the OS and updates live when the OS theme changes.

**Files that still use hard-coded light-mode classes** (34 files; highest counts shown).
These are the primary dark-theme regressions to audit:

| File | Occurrences | Classes |
|---|---|---|
| `src/components/repertoire/OpeningLesson.tsx` | 37 | `bg-white`, `text-sage-*`, `bg-sage-*`, `border-sage-*`, `bg-green-*`, `bg-red-*` |
| `src/components/repertoire/RepertoireInfoPanel.tsx` | 30 | `bg-white`, `text-sage-*`, `border-sage-*`, `bg-green-*`, `bg-red-*` |
| `src/components/puzzles/ImportBulkModal.tsx` | 25 | `bg-white`, `text-sage-*`, `border-sage-*`, `text-green-*`, `text-red-*` |
| `src/components/repertoire/RepertoireTree.tsx` | 21 | `text-sage-*`, `bg-sage-*`, `bg-green-*`, `bg-red-*` |
| `src/components/repertoire/RepertoireBoardControls.tsx` | 20 | `bg-white`, `text-sage-*`, `bg-sage-*` |
| `src/components/analysis/UserOpeningButton.tsx` | 18 | `bg-white`, `text-sage-*`, `border-sage-*` |
| `src/sections/analysis/panelBody/analysisTab/EngineLines.tsx` | 17 | `bg-white`, `text-sage-*`, `bg-sage-*`, `text-red-*` |
| `src/components/analysis/StudyFolderDialog.tsx` | 15 | `bg-white`, `text-sage-*`, `border-sage-*` |
| `src/components/repertoire/RepertoireViewer.tsx` | 13 | `bg-white`, `text-sage-*` |
| `src/components/analysis/EducationalPanel.tsx` | 12 | `bg-white`, `text-sage-*` |
| `src/components/analysis/SearchDialog.tsx` | 12 | `bg-white`, `text-sage-*`, `border-sage-*` |
| `src/components/repertoire/RepertoireNodeEditor.tsx` | 12 | `bg-white`, `text-sage-*`, `border-sage-*` |
| `src/components/studio/UploadFileModal.tsx` | 12 | `bg-white`, `text-sage-*`, `border-sage-*` |
| `src/components/repertoire/RepertoireQuiz.tsx` | 11 | `bg-white`, `text-sage-*`, `bg-sage-*` |
| `src/sections/analysis/panelToolbar/index.tsx` | 11 | `text-sage-*`, `bg-sage-*` |
| `src/components/studio/FolderGrid.tsx` | 10 | `text-sage-*`, `bg-sage-*` |
| `src/components/studio/ResourceGrid.tsx` | 10 | `bg-white`, `text-sage-*` |
| `src/sections/analysis/panelHeader/index.tsx` | 6 | `text-sage-*`, `bg-sage-*` |
| plus 16 more with 1–8 occurrences | — | run `node scan_colors.cjs` for the full list |

Suggested mechanical replacements (one file at a time, then re-test):

```
bg-white / bg-white-pure  -> bg-[var(--color-surface)]
text-sage-900/800/700     -> text-[var(--color-text)]
text-sage-500/600         -> text-[var(--color-text-secondary)]
text-sage-400             -> text-[var(--color-text-muted)]
bg-sage-50/100            -> bg-[var(--color-bg)]
border-sage-100/200       -> border-[var(--color-border)]
text-red-500/600/700      -> text-[var(--color-danger)]
bg-red-50/100             -> bg-[var(--color-danger-light)]
text-green-*              -> text-[var(--color-success)]
bg-green-*                -> bg-[var(--color-success-light)]
```

### 2.3 English default + language switching

- [ ] With no `i18nextLng` in `localStorage` and an Italian browser, the UI starts in
      **English** (requirement) — currently `i18n.ts` uses `LanguageDetector` with
      `order: ['localStorage', 'navigator']`, so a first-time Italian user gets **Italian**.
      This contradicts "English as the source/default language". Decide and document:
      either keep detection (fallback English) or force `lng: 'en'` until the user chooses.
- [ ] Switching language in `/impostazioni` re-renders every visible string with no reload.
- [ ] The choice survives a reload (`localStorage` cache key `i18nextLng`).
- [ ] `document.documentElement.lang` follows the selected language (set in `App.tsx`).
- [ ] `<html lang="it">` in `frontend/index.html:2` is misleading for crawlers/AT — change to
      `en` (runtime overrides it, but the static value should not lie).
- [ ] Dates/numbers use `i18n.language` (currently only `RepertoireInfoPanel` does this).
- [ ] No raw key ever reaches the screen (search the UI for dotted strings like
      `analysis.foo`). See §3.3 for the three known bare-key bugs.

Language coverage:

| Locale | Keys present | Missing vs `en` | Status |
|---|---|---|---|
| `en` | 670 | 0 | source of truth |
| `it` | 670 | 0 | complete |
| `es` | 321 | 356 | **incomplete** — shows English fallback for most of the app |
| `fr` | 321 | 356 | **incomplete** — same |

`es`/`fr` also carry 7 stale keys that no longer exist in `en`:
`analysis.whiteAcpl`, `analysis.blackAcpl`, `analysis.whiteBlunders`,
`analysis.blackBlunders`, `analysis.moveList`, `games.result`, `games.noGamesYet`.

### 2.4 Analysis page "loads nothing"

#### 2.4.1 First suspect: the route parameter is dropped (high confidence)

`src/App.tsx:119-120`:

```tsx
<Route path="/analisi" element={<Analysis />} />
<Route path="/analisi/:gameId" element={<Analysis />} />
```

`Analysis` only accepts a prop (`src/pages/Analysis.tsx:99`):

```tsx
export function Analysis({ gameId, onBack }: { gameId?: number; onBack?: () => void })
```

There is **no `useParams()`** anywhere in the file. Since `App` renders `<Analysis />`
without props for both routes, `gameId` is always `undefined`; `currentGameId` falls back to
`localGameId` (also `undefined`). Consequences:

- The moves/result effects (`Analysis.tsx:145-165`) early-return on `if (!id)`, so nothing is
  fetched.
- The header renders placeholder values (`—`, `1–0`, `0 mosse`) and an empty board.
- `Home`/`Games` navigate with `window.location.href = '/analisi/<id>'` (`App.tsx:92,101`),
  i.e. a full page load of a route whose id is ignored — exactly the reported symptom.

Verify: open `/analisi/1` with the backend up; in DevTools → Network there should be **zero**
calls to `/api/analysis/1/moves`. If confirmed, the fix is one of:

```tsx
// Option A — read the param inside the page
import { useParams } from 'react-router-dom'
const { gameId: routeGameId } = useParams()
const numericId = routeGameId ? Number(routeGameId) : undefined
const currentGameId = gameId ?? numericId ?? localGameId

// Option B — pass the param at the route level
<Route path="/analisi/:gameId" element={<AnalysisRoute />} />
// AnalysisRoute: const { gameId } = useParams(); return <Analysis gameId={Number(gameId)} />
```

The same bug class exists for `/partite/:id` (`App.tsx:118` passes `gameId={0}` to
`GameViewer`), so GameViewer also needs the param wired.

#### 2.4.2 If the id is fixed, verify the data path

Backend endpoints used by the page (`src/api/fetch-client.ts`):

| Call | Endpoint | Used for |
|---|---|---|
| `api.analysis.getMoves(id)` | `GET /api/analysis/{id}/moves` | move list + FENs |
| `api.analysis.getAnalysisResult(id)` | `GET /api/analysis/{id}/analysis-result` | classifications, accuracy |
| `api.analysis.importPgn(pgn)` | `POST /api/analysis/import-pgn` | PGN import |
| `api.analysis.saveAnalysis(id, …)` | `POST /api/analysis/{id}/save-analysis` | persist engine analysis |

- [ ] `curl http://localhost:8003/api/analysis/1/moves` returns `200` + a JSON array.
- [ ] The array items expose the fields the UI reads: `fen`, `san`, `move_number`,
      `is_white`, `classification`, `played_eval` (see `src/types/analysis.ts` and
      `MoveTable.tsx`). A shape mismatch results in a blank move list without an error.
- [ ] `GET /api/analysis/{id}/analysis-result` returning `404` is tolerated (it is caught),
      but then Summary/Graph show zeros — confirm whether that is expected for an unanalysed
      game.
- [ ] CORS: the frontend origin (e.g. `http://localhost:5173`) must be allowed by the
      backend, otherwise every call fails with a console CORS error.
- [ ] Failure surfacing: `Analysis.tsx:157-164` sets `analysisError`, rendered at
      `Analysis.tsx:486-490`. Force a failure (stop the backend) and confirm a readable
      banner appears instead of a silent empty page.

#### 2.4.3 Engine-dependent UI

- [ ] `useUciEngine()` reaches `ready === true`. If not, `EvalBar` shows the loading
      animation and `EngineLines` shows the loading skeleton forever.
- [ ] `/stockfish.js` is served (declared in `frontend/index.html:29`; the worker requires
      `window.Stockfish`, see `src/engine/worker.ts:33-36`). A 404 here leaves `ready`
      false and `error` set.
- [ ] With the engine ready and a position selected, MultiPV lines render and the eval bar
      moves off 0.00.
- [ ] `engineError` is shown somewhere visible (currently only inside `EvalBar`).

#### 2.4.4 Graph tab

- [ ] The Graph tab renders `GraphTab` → `EvaluationChart` (`Analysis.tsx:650`), not a blank
      panel.
- [ ] The chart draws a line when `gameResult.moves` exists, and a "no data" state when it
      does not (currently it may render an empty SVG frame).

### 2.5 Regression smoke test (every route, both themes, both languages)

- [ ] `/` Home loads stats without errors (network 4xx is tolerated? confirm).
- [ ] `/gioca` Play: can start as White/Black, bot replies, resign shows the correct
      result text and icon (driven by `resultKind`, not string matching — `Play.tsx`).
- [ ] `/studio` Studio: folder navigation, breadcrumb, all five modals open/close, upload,
      link, YouTube.
- [ ] `/puzzle` Puzzles: category → subcategory → solver, filter, bulk import modal.
- [ ] `/partite` Games: list, open, analyse.
- [ ] `/partite/:id` GameViewer: loads the right game (see §2.4.1).
- [ ] `/analisi`, `/analisi/:id`: as above.
- [ ] `/impostazioni` Settings: language, theme, board theme, opacity, piece shadow,
      engine depth all persist after reload.
- [ ] No uncaught errors in the console on any route.
- [ ] No 404s in Network for `/locales/*/analysis.json` (see §4.2).

---

## 3. What has to be added

### 3.1 P0 — user-facing Italian still hard-coded

| File | Line(s) | Text | Suggested key(s) |
|---|---|---|---|
| `src/components/puzzles/ImportBulkModal.tsx` | 72-74 | `Importa blocchi multipli`, `Conferma importazione`, `Risultato importazione` | `puzzles.importBulkTitle`, `puzzles.importBulkPreviewTitle`, `puzzles.importBulkResultTitle` *(already exist)* |
| same | 77-79 | description strings with counts | `puzzles.importBulkDesc`, `puzzles.importBulkPreviewDesc` (`{ count }`), `puzzles.importBulkResultDesc` (`{ count }`) *(exist)* |
| same | 86 | textarea placeholder block | `puzzles.importBulkPlaceholder` *(exists)* |
| same | 101, 123, 127 | `Anteprima`, `Partita`, `Partita` | `puzzles.importPreviewCol`, `puzzles.importTypeGame` *(exist)* |
| same | 144-163 | `Puzzle importati`, `Partite importate`, `Duplicati saltati`, `Totale`, `Errori:` | `puzzles.importPuzzlesCount`, `puzzles.importGamesCount`, `puzzles.importSkippedCount`, `puzzles.importTotal`, `puzzles.importErrors` *(exist)* |
| same | 175-190 | `Annulla`, `Analisi...`, `Anteprima`, `Indietro`, `Importazione...`, `Conferma importazione`, `Chiudi` | `common.cancel`, `common.analyzing`, `common.preview`, `common.back`, `common.importing`, `puzzles.importBulkPreviewTitle`, `common.close` |
| `src/components/analysis/ArrowControls.tsx` | 25 | `Frecce sul tabellone` | `analysis.arrows.title` |
| same | 37-40 | 4 labels + 4 descriptions (`Miglior mossa`, `Seconda migliore`, `Terza migliore`, `Minacce avversarie` + descs) | `analysis.arrows.best.label/.desc`, `.second.*`, `.third.*`, `.threats.*` |
| same | 65-70 | help paragraph + active-threat sentence | `analysis.arrows.help`, `analysis.arrows.threatsActive` |
| `src/components/data-display/EngineLines.tsx` | 37 | `aria-label="Linee motore"` | `analysis.engineLines` |
| `src/components/repertoire/RepertoireViewer.tsx` | 190 | `confirm('Eliminare questo nodo e tutti i suoi figli?')` | `repertoire.confirmDeleteNode` |
| `src/pages/Analysis.tsx` | 472 | `{moves.length} mosse` | `analysis.movesCount` (`{{count}} moves`) |
| same | 494-495 | `subText="vs media 84%"`, `"vs media 85%"` | `analysis.vsAverage` (`vs average {{value}}%`) |
| same | 683 | `(consigliata)` | `analysis.recommendedTag` |
| same | 158, 163 | hard-coded English error text | `analysis.errorLoadMoves`, `analysis.errorLoadResult` (`{{error}}`) |
| `src/pages/Repertoire.tsx` | 28 | `Scegli un'apertura` | `repertoire.chooseOpening` |
| `src/sections/analysis/panelBody/analysisTab/EngineLines.tsx` | 146 | `title="Vai a questa posizione"` | `analysis.goToPosition` |
| `src/data/puzzleCategories.ts` | 29-88 | subcategory `name` + `desc` (≈60 strings, Italian) | `puzzles.sub.<key>.name` / `.desc` |
| same | 112-135 | `getThemeLabel()` Italian map | reuse `puzzles.<theme>` theme keys |
| same | 18-89 | category titles (`Phases of Play`, `Tactical Motifs`, `Checkmate`, `Mate Themes`) | `puzzles.cat.<key>.title` |
| `src/types/analysis.ts` | 73-90 | `CLASSIFICATION_META[*].label` (Italian; now unused by the UI) | delete the `label` field or annotate it as non-UI |
| `src/mocks/handlers.ts` | 78, 276 | mock explanation + `Le mie aperture` folder | dev-only; translate or leave with a comment |
| `frontend/index.html` | 2 | `lang="it"` | `lang="en"` |

For `puzzleCategories.ts` prefer a display-time lookup rather than mutating the data module:

```tsx
// in PuzzleSubcategoryGrid / Puzzles / PuzzleSolver
const title = t(`puzzles.cat.${category.key}.title`, category.title)
const name  = t(`puzzles.sub.${sub.key}.name`, sub.name)
const desc  = t(`puzzles.sub.${sub.key}.desc`, sub.desc)
```

That keeps `puzzleCategories.ts` as pure data and makes missing keys fall back to the
current text instead of rendering `puzzles.sub.foo.name`.

### 3.2 P1 — broken/missing keys

**(a) Bare keys that render literally** (verified by `check_bare_keys.cjs`):

| File | Line | Call | Fix |
|---|---|---|---|
| `src/components/puzzles/PuzzleSubcategoryGrid.tsx` | 35 | `t('back')` | `t('common.back')` |
| `src/pages/Puzzles.tsx` | 231 | `t('back')` | `t('common.back')` |
| `src/components/layout/StatusBar.tsx` | 51 | `t('export')` | `t('common.export')` |

**(b) Single-brace placeholders — i18next does not interpolate `{count}`** (verified by
`check_placeholders.cjs`). Users currently see the literal braces:

| Key | Current value |
|---|---|
| `games.clearFilters` | `Clear filters ({count})` |
| `home.lastGame` | `Last game: {date}` |
| `home.gamesCountPuzzle` | `{count} moves · {date}` |
| `home.puzzleMoves` | `{count} puzzle moves` |
| `home.endgamePuzzlesAvailable` | `{count} puzzles available` |
| `play.movesLabel` | `Moves ({count})` |

Change `{x}` → `{{x}}` in **both** `en` and `it`, then verify the Home/Play/Games screens show
the substituted numbers.

**(c) Plural keys confirmed present** — do not "fix" these audit warnings:

`analysis.variation_one/_other`, `analysis.opponentThreat_one/_other`,
`analysis.openingsCount_one/_other`, `common.resource_one/_other`,
`studio.folderCount_one/_other`. The audit script reports the base key as missing; that is
expected i18next behaviour.

**(d) Namespace without a file.** Nine files call `useTranslation(['common', 'analysis'])`:
`pages/Analysis.tsx`, `pages/Home.tsx`, `pages/Play.tsx`, `pages/GameViewer.tsx`,
`components/board/EvalBar.tsx`, `components/analysis/AccuracyMeter.tsx`,
`components/analysis/MoveClassificationTable.tsx`, `components/analysis/EvaluationChart.tsx`,
`sections/analysis/panelHeader/index.tsx`. Only
`common.json` exists, so the `analysis` namespace fetch 404s on every page load
(`/locales/en/analysis.json`). Harmless today because there is no `analysis.json`, but noisy.
Fix: use `useTranslation('common')` everywhere; keys already resolve as `common.analysis.*`.

### 3.3 P2 — complete `es` and `fr`

Both locales are ~53 % complete (321/670). Options:

1. Translate the 356 missing keys for each (recommended before shipping language choice).
2. Or temporarily remove `es`/`fr` from `supportedLngs` (`src/i18n.ts:12`) and from the
   Settings `locales` list (`src/pages/Settings.tsx:5-10`) so users cannot select a
   half-translated UI.

Also remove the 7 stale keys listed in §2.3 from both files.

### 3.4 P3 — hardcoded English that should be translatable

- `src/engine/analysisEngine.ts:221,227,230,241,299` — coach explanations are built as
  English sentences (`"Develops the … to …, an active square controlling the center."`).
  These are user-visible. Needs either i18n templates (`analysis.explain.develop`,
  `…push`, `…best`, `…worse`, `…principle`) or a documented "analysis text is English-only"
  decision.
- `src/pages/Analysis.tsx:158,163` — error banners (see §3.1).
- `src/pages/Analysis.tsx` KPI `subText` values (see §3.1).

### 3.5 P4 — polish / consistency

- Route paths are Italian (`/gioca`, `/partite`, `/analisi`, `/impostazioni`). Not a bug, but
  if the product is English-first consider English paths with redirects from the old ones.
- `navGroups` labels come from `t('nav.*')`; confirm every nav group label is translated
  (group headers exist in the sidebar component, not in `App.tsx`).
- `App.tsx` still passes `workspaceName="Personale"` (`App.tsx:110`); `Sidebar` defaults to
  `t('common.personal')` only when the prop is omitted. Remove the prop or translate it.
- `Settings.tsx` board theme options use `t('board.*')`; verify `board.default` vs
  `board.brown` are not duplicated in the select.

---

## 4. i18n conventions to follow when adding strings

### 4.1 File layout

- One file per language: `public/locales/<lng>/common.json`.
- **All sections are top-level keys inside `common.json`**: `app`, `nav`, `settings`,
  `board`, `common`, `home`, `play`, `puzzles`, `studio`, `games`, `analysis`, `repertoire`.
  There are no per-namespace files.
- Add new keys to `en` first, then mirror in `it` (and `es`/`fr` if you are keeping them).
- Keep lists sorted-ish and grouped by feature; avoid reordering existing keys (noisy diffs).

### 4.2 Why `t('analysis.foo')` works with one namespace

`i18n.ts` sets `ns: ['common']`, `defaultNS: 'common'`. `t('analysis.foo')` resolves to
`common.analysis.foo`. The two-namespace form (`useTranslation(['common', 'analysis'])`)
makes i18next try to load `analysis.json` — hence the 404. Use the single-namespace form.

### 4.3 Interpolation and plurals

- Always double braces: `{{count}}`, `{{date}}`, `{{name}}`.
- Pluralisation uses i18next suffixes: `key_one` / `key_other` (not `keyOne`/`keyMany`).
- Pass `count` (never `n`) so i18next picks the suffix: `t('common.resource', { count })`.
- Do not build sentences by concatenating translated fragments; add a full-sentence key with
  placeholders (grammar/word order differ per language).

### 4.4 What not to translate

- Opening/ECO names from `src/data/openings_merged_final.ts` and the generated dataset
  (proper names, e.g. "Sicilian Defense").
- `SAN` notation, FEN, PGN, UCI moves.
- Engine output (cp/mate values).
- Log/console strings and test data.

---

## 5. Tests, mocks and known noise

`src/setupTests.ts` mocks `react-i18next` globally and resolves keys against the bundled
**English** JSON (`require('../public/locales/en/common.json')`). Consequences:

- Component tests assert **English** strings. Any test still asserting Italian will fail
  (`SearchDialog`, `StudyFolderDialog`, `UserOpeningButton`, `EngineLines`, `CoachTab` were
  updated for this reason).
- The mock returns the key itself when it cannot resolve it, so a test can "pass" while the
  real app would show a raw key. Prefer assertions on user-visible text, and add a test that
  fails when a key is missing (the current `audit_i18n.cjs` covers static keys).
- `Settings.test.tsx` calls `i18n.use(initReactI18next).init()`, which is why the mock exports
  an `initReactI18next` stub.
- Expected stderr noise: `AggregateError: connect ECONNREFUSED ::1:3000` from components that
  fetch `/api` during render. It does not fail tests.

Current test status: **41 files / 342 tests passing**; `npx tsc -b --noEmit` clean.

Commands:

```bat
npx vitest run                                  :: full suite
npx vitest run src/pages/__tests__/Settings.test.tsx
npx tsc -b --noEmit
```

---

## 6. Definition of done

- [ ] Eval bar measured at 132 px on all board pages; board centred; verified at 1440/1024/768.
- [ ] Dark mode verified on all eight routes with no white patches.
- [ ] English is the default for a first-time user (or the detection behaviour is explicitly
      accepted and documented).
- [ ] `en` and `it` key sets identical; `es`/`fr` either complete or removed from the selector.
- [ ] No raw key or `{brace}` visible anywhere (`check_bare_keys.cjs` + `check_placeholders.cjs`
      clean).
- [ ] Analysis page loads a game from `/analisi/:id`, shows moves, header, KPI, tabs, graph,
      and surfaces backend errors.
- [ ] `scan_italian2.cjs` returns only data files/mocks (no UI components).
- [ ] `npx tsc -b --noEmit` clean; `npx vitest run` green.
- [ ] Helper `.cjs` scripts deleted from `frontend/` (or moved to `frontend/scripts/`).

---

## Appendix A — Commands and their expected output

| Command | What it reports | Target |
|---|---|---|
| `node locale_stats.cjs --details` | leaf-key counts per locale | `en`=670, `it`=670, missing 0 |
| `node audit_i18n.cjs` | static `t('…')` keys missing from locales; `en`↔`it` diff | only plural-base false positives; diff 0 |
| `node scan_italian2.cjs` | lines that look Italian in `src/` | only `data/`, `mocks/`, `types/analysis.ts` |
| `node scan_colors.cjs` | files with hard-coded colour classes | ideally 0 |
| `node check_bare_keys.cjs` | `t('x')` without a dot and not in the JSON | 0 |
| `node check_placeholders.cjs` | single-brace placeholders | 0 |

## Appendix B — Files converted to `t()` (already done)

Pages: `Analysis`, `Play`, `Puzzles`, `Games`, `GameViewer`, `Home`, `Studio`, `Settings`,
`App`.
Analysis UI: `EvaluationChart`, `MoveClassificationTable`, `AccuracyMeter`, `TabNav`,
`EngineLines`, `EducationalPanel`, `StudyFolderDialog`, `UserOpeningButton`, `SearchDialog`,
`PgnImporter`, `ArrowControls` (strings still Italian — see §3.1), `StatusBar`,
`ClassificationSummary`.
Board: `EvalBar`, `ChessBoard`.
Puzzles: `PuzzleSolver`, `PuzzleCard`, `PuzzleCategoryTabs`, `PuzzleSubcategoryGrid`,
`PuzzleList`, `ImportBulkModal` (strings still Italian — see §3.1).
Repertoire: `RepertoireSelector`, `RepertoireInfoPanel`, `RepertoireNodeEditor`,
`RepertoireQuiz`, `RepertoireTree`, `RepertoireBoardControls`, `RepertoireViewer`,
`OpeningLesson`.
Studio: `AddLinkModal`, `CreateFolderModal`, `Breadcrumb`, `FolderPickerModal`,
`UploadFileModal`, `FabMenu`, `ResourceGrid`, `FolderGrid`.
Layout: `Sidebar`, `TopBar`.
Engine: `analysisEngine` (partially — see §3.4).

## Appendix C — Known technical debt relevant to this checklist

1. **Route params ignored** for `/analisi/:gameId` and `/partite/:id` (§2.4.1). Highest-impact
   open bug.
2. **`es`/`fr` half-translated** while selectable in Settings (§2.3, §3.3).
3. **34 files with hard-coded light colours** (§2.2).
4. **Single-brace placeholders** in 6 keys (§3.2b).
5. **Three bare `t()` keys** rendering verbatim (§3.2a).
6. **`analysis.json` 404** from two-namespace `useTranslation` calls (§3.2d).
7. **`src/data/puzzleCategories.ts`** is the largest remaining Italian UI surface (§3.1).
8. **`src/types/analysis.ts` `CLASSIFICATION_META.label`** is dead Italian data that invites
   accidental reuse (§3.1).
9. **`src/components/studio/ContextMenu.tsx`** is not imported anywhere (dead code); its
   styling also uses hard-coded light colours. Delete it or wire it up (§3.5).
