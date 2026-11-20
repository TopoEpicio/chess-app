// End-to-end check: load the real Analysis page against the live backend
// and confirm the board, opening card, eval bar and match header all render.
// Usage: start `npx vite preview --port 4173`, then `node scripts/verify-analysis-e2e.mjs`
import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })

const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:4173/analisi/26', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-testid="board-wrap"]', { timeout: 25000 })
await page.waitForTimeout(2500)

const box = async (sel) => {
  const el = page.locator(sel).first()
  if ((await el.count()) === 0) return null
  return await el.boundingBox()
}
const board = await box('[data-testid="board-wrap"]')
const evalBar = await box('[data-testid="eval-bar"]')
const evalTrack = await box('[data-testid="eval-bar-track"]')
const bodyText = await page.locator('body').innerText()

const report = {
  url: 'http://localhost:4173/analisi/26',
  board: board ? { w: board.width, h: board.height, square: Math.abs(board.width - board.height) < 2 } : null,
  evalBar: evalBar ? { w: evalBar.width, h: evalBar.height } : null,
  evalTrack: evalTrack ? { w: evalTrack.width, h: evalTrack.height } : null,
  checks: {
    openingCardVisible: /Opening:/.test(bodyText),
    italianDetected: /Italian|Gambetto|Queen|Queen's/.test(bodyText),
    matchHeaderVisible: bodyText.includes('Kramnik') && bodyText.includes('Kasparov'),
    resultVisible: /0-1|1-0|1\/2-1\/2/.test(bodyText),
    addOpeningVisible: /Add to openings/i.test(bodyText),
    studyFoldersVisible: /Study folders|Manage folders/i.test(bodyText),
    boardBesideEvalBar: !!(board && evalBar) && evalBar.x > board.x + board.width - 2,
    evalHeightMatchesBoard: !!(board && evalBar) && Math.abs(board.height - evalBar.height) < 4,
  },
  openingLine: (bodyText.match(/Opening:[^\n]*/) || [])[0] ?? null,
  consoleErrors: errors.slice(0, 8),
  bodySnippet: bodyText.slice(0, 500),
}
console.log(JSON.stringify(report, null, 2))
await page.screenshot({ path: 'scripts/analysis-e2e.png', fullPage: true })
await browser.close()