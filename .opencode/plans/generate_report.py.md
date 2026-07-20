```python
import os, sys
TEMP = os.environ.get('TEMP', r'C:\Users\LORENZ~1.FIL\AppData\Local\Temp')
OUT = os.path.join(TEMP, 'opencode', 'architecture-review-20260720_102433.html')

HTML = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Architecture Review — Chess Trainer</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  .badge-s { background: #ef4444; color: white; padding: 2px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
  .badge-e { background: #f59e0b; color: white; padding: 2px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
  .badge-sp { background: #6b7280; color: white; padding: 2px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
  .ba { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  @media (max-width: 768px) { .ba { grid-template-columns: 1fr; } }
  .mb { border: 2px solid #cbd5e1; border-radius: 8px; padding: 0.75rem; background: white; font-size: 0.8rem; }
  .md { border-color: #22c55e; background: #f0fdf4; }
  .ms { border-color: #ef4444; background: #fef2f2; }
  .mdead { border-color: #6b7280; background: #f3f4f6; opacity: 0.6; }
</style>
</head>
<body class="bg-slate-50"><div class="max-w-6xl mx-auto px-4 py-8">
<div class="mb-10"><h1 class="text-3xl font-bold text-slate-800">Chess Trainer — Architecture Review</h1><p class="text-slate-500 mt-2">Backend (Python/FastAPI) + Frontend (React/TypeScript) + Shared packages</p><p class="text-slate-400 text-sm">2026-07-20</p></div>
<div class="bg-white rounded-xl shadow-sm border p-6 mb-8"><h2 class="text-xl font-semibold mb-4">Executive Summary</h2><p class="text-slate-600 mb-4">The codebase has significant <b>duplication</b> and <b>shallow modules</b>. The same domain logic exists in 2-4 copies across backend Python, frontend TypeScript, and the shared package.</p><div class="grid grid-cols-3 gap-4 text-center"><div class="bg-red-50 rounded-lg p-3"><span class="text-2xl font-bold text-red-600">3</span><br><span class="text-sm">critical duplications</span></div><div class="bg-amber-50 rounded-lg p-3"><span class="text-2xl font-bold text-amber-600">6</span><br><span class="text-sm">high-priority issues</span></div><div class="bg-slate-50 rounded-lg p-3"><span class="text-2xl font-bold text-slate-600">5</span><br><span class="text-sm">dead code modules</span></div></div></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-s mb-4">STRONG</span><h2 class="text-2xl font-bold mb-2">1. Puzzle Generation — 2x identical Python implementations</h2><p class="mb-2"><b>Files:</b> <code>services/puzzle_generator.py</code> (429 lines), <code>domain/adapters/heuristic_generator.py</code> (408 lines), <code>chess_domain/patterns.py</code> (48 lines partial copy)</p><p class="mb-2"><b>Problem:</b> Two files with ~95% identical algorithms. The older one in services/ is bypassed by the router. Deletion test: both can be deleted with zero functional loss.</p><p class="mb-4"><b>Solution:</b> Delete services/puzzle_generator.py, route all consumers through domain/adapters/heuristic_generator.py.</p><div class="ba"><div><h4 class="text-sm font-semibold text-red-600 mb-2">Before</h4><div class="mb ms"><b>services/puzzle_generator.py</b><br><span class="text-xs">429 lines</span></div><div class="text-center text-slate-400 text-sm py-1">95% identical</div><div class="mb ms"><b>adapters/heuristic_generator.py</b><br><span class="text-xs">408 lines</span></div></div><div><h4 class="text-sm font-semibold text-green-600 mb-2">After</h4><div class="mb md"><b>adapters/heuristic_generator.py</b><br><span class="text-xs">SINGLE generator</span></div><div class="mb mdead"><b><s>services/puzzle_generator.py</s></b><br><span class="text-xs">deleted (-429 lines)</span></div></div></div><p class="mt-2 text-sm"><b>Benefits:</b> Leverage, Locality.</p></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-s mb-4">STRONG</span><h2 class="text-2xl font-bold mb-2">2. Stockfish Engine — 2x parallel integrations</h2><p class="mb-2"><b>Files:</b> <code>stockfish-adapter.ts</code>, <code>useStockfish.ts</code> (274 lines), <code>useEngine.ts</code> (dead), <code>interface.ts</code></p><p class="mb-2"><b>Problem:</b> EngineAdapter interface exists but every consumer bypasses it. 6+ components import useStockfish directly. Every board creates its own Stockfish instance.</p><p class="mb-4"><b>Solution:</b> Delete useStockfish.ts, wire stockfish-adapter.ts into useEngine.ts, inject EngineAdapter via context.</p><div class="ba"><div><h4 class="text-sm font-semibold text-red-600 mb-2">Before</h4><div class="mb">Consumer</div><div class="text-center text-xs text-slate-400">imports</div><div class="mb ms"><b>useStockfish.ts</b><br><span class="text-xs">274 lines, re-implements UCI</span></div><div class="text-center text-xs text-slate-400">ignores</div><div class="mb mdead"><b>stockfish-adapter.ts</b></div></div><div><h4 class="text-sm font-semibold text-green-600 mb-2">After</h4><div class="mb">Consumer</div><div class="text-center text-xs text-slate-400">depends on</div><div class="mb md"><b>EngineAdapter</b></div><div class="text-center text-xs text-slate-400">implemented by</div><div class="mb">stockfish-adapter.ts</div></div></div><p class="mt-2 text-sm"><b>Benefits:</b> Seam, Locality, Testability.</p></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-s mb-4">STRONG</span><h2 class="text-2xl font-bold mb-2">3. Business Logic in Routers</h2><p class="mb-2"><b>Files:</b> <code>routers/study.py</code> (337 lines), <code>routers/analysis.py</code>, <code>routers/openings.py</code>, <code>main.py</code> lifespan</p><p class="mb-2"><b>Problem:</b> Routers mix HTTP with business logic. Untestable without ASGI stack.</p><p class="mb-4"><b>Solution:</b> Extract services/study_service.py, services/opening_service.py, startup.py.</p><p class="text-sm"><b>Benefits:</b> Testability, Locality, Seam.</p></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-e mb-4">WORTH EXPLORING</span><h2 class="text-2xl font-bold mb-2">4. TacticalMoment — 4 definitions</h2><p class="mb-2"><b>Files:</b> chess_domain/types.py, domain/protocols.py, services/puzzle_generator.py, packages/chess-domain/types.ts</p><p class="mb-2"><b>Problem:</b> Four definitions with type drift. Typed enums defined but unused.</p><p class="mb-4"><b>Solution:</b> Import from chess_domain/types.py everywhere.</p></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-s mb-4">STRONG</span><h2 class="text-2xl font-bold mb-2">5. API Client — Provider bypassed</h2><p class="mb-2"><b>Files:</b> api/client.ts (singleton), api/provider.tsx (dead), api/mock-client.ts (unused)</p><p class="mb-2"><b>Problem:</b> Clean seam exists but every store/page uses concrete singleton.</p><p class="mb-4"><b>Solution:</b> Wire ApiProvider. DI into stores.</p><p class="text-sm"><b>Benefits:</b> Testability, Seam.</p></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-e mb-4">WORTH EXPLORING</span><h2 class="text-2xl font-bold mb-2">6. Move Navigation — 3x implementations</h2><p class="mb-2"><b>Files:</b> Analysis.tsx, GameViewer.tsx, RepertoireBoardControls.tsx, OpeningLesson.tsx, RepertoireQuiz.tsx</p><p class="mb-2"><b>Problem:</b> Navigation + pair rendering in 3+ components. buildPath duplicated.</p><p class="mb-4"><b>Solution:</b> Extract useMoveNavigation hook, MovePairGrid, shared buildPath.</p></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-e mb-4">WORTH EXPLORING</span><h2 class="text-2xl font-bold mb-2">7. Frontend duplicates backend domain</h2><p class="mb-2"><b>Files:</b> engine/analysisEngine.ts (351 lines), packages/chess-domain/, backend/app/chess_domain/</p><p class="mb-2"><b>Problem:</b> analysisEngine.ts reimplements tactical detection from backend.</p><p class="mb-4"><b>Solution:</b> Move to backend API or complete shared package.</p></div>

<div class="bg-white rounded-xl shadow-sm border p-6 mb-6"><span class="badge-sp mb-4">SPECULATIVE</span><h2 class="text-2xl font-bold mb-2">8. Dead Code — ~800 lines</h2><table class="w-full text-sm"><thead><tr class="border-b"><th>Module</th><th>Lines</th><th>Status</th></tr></thead><tbody>
<tr class="border-b"><td>middleware/metrics.py</td><td>157</td><td style="color:red">Never registered</td></tr>
<tr class="border-b"><td>engine/useEngine.ts</td><td>34</td><td style="color:red">Never imported</td></tr>
<tr class="border-b"><td>engine/explanation/*</td><td>45</td><td style="color:red">Never consumed</td></tr>
<tr class="border-b"><td>api/provider.tsx</td><td>11</td><td style="color:red">Never used</td></tr>
<tr class="border-b"><td>api/mock-client.ts</td><td>89</td><td style="color:#f59e0b">Not used in tests</td></tr>
<tr class="border-b"><td>services/puzzle_generator.py</td><td>429</td><td style="color:#f59e0b">Superseded</td></tr>
<tr class="border-b"><td>chess_domain/patterns.py</td><td>48</td><td style="color:#f59e0b">Not imported</td></tr>
</tbody></table></div>

<div class="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 mb-6"><h2 class="text-2xl font-bold text-white mb-2">Top Recommendation</h2><p class="text-slate-300 mb-4">Order for maximum impact:</p><div class="space-y-3"><div class="flex items-start gap-3 bg-white/10 rounded-lg p-3"><span class="bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 rounded-full">1</span><div><h3 class="font-semibold text-white">Delete services/puzzle_generator.py</h3><p class="text-sm text-slate-300">429 lines of dead duplicate code. Zero risk.</p></div></div><div class="flex items-start gap-3 bg-white/10 rounded-lg p-3"><span class="bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 rounded-full">2</span><div><h3 class="font-semibold text-white">Remove useStockfish.ts, wire EngineAdapter</h3><p class="text-sm text-slate-300">Eliminates largest frontend duplication.</p></div></div><div class="flex items-start gap-3 bg-white/10 rounded-lg p-3"><span class="bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 rounded-full">3</span><div><h3 class="font-semibold text-white">Route API client through ApiProvider</h3><p class="text-sm text-slate-300">Makes stores testable.</p></div></div><div class="flex items-start gap-3 bg-white/10 rounded-lg p-3"><span class="bg-amber-500 text-white w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 rounded-full">4</span><div><h3 class="font-semibold text-white">Extract useMoveNavigation hook</h3><p class="text-sm text-slate-300">High leverage, medium effort.</p></div></div></div></div>
<div class="text-center text-slate-400 text-sm mt-8">Architecture review — no files modified.</div>
</div></body></html>
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(HTML)
print(f'Written to {OUT}')
```
