<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — chess-app</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
      .shallow { background: linear-gradient(135deg, #fef3c7, #fde68a); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header class="border-b border-slate-200 pb-6">
        <h1 class="text-3xl font-bold">Architecture review — chess-app</h1>
        <p class="text-sm text-slate-500 mt-1">24 July 2026</p>
        <div class="flex flex-wrap gap-3 mt-4 text-xs">
          <span class="px-2 py-1 border border-slate-300 rounded">Module = solid box</span>
          <span class="px-2 py-1 border border-slate-300 border-dashed rounded">Seam = dashed line</span>
          <span class="px-2 py-1 border border-red-400 rounded text-red-600">Leakage = red arrow</span>
          <span class="px-2 py-1 text-white deep rounded">Deep = dark fill</span>
          <span class="px-2 py-1 text-amber-800 shallow rounded">Shallow = amber fill</span>
        </div>
      </header>

      <section id="candidates" class="space-y-10">

        <!-- CANDIDATE 1 -->
        <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-xl font-bold">Consolidate the Analysis orchestration into a state module</h2>
            <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-emerald-600">Strong</span>
          </div>

          <div class="font-mono text-sm text-slate-600 space-y-0.5">
            <div>frontend/src/pages/Analysis.tsx</div>
            <div>frontend/src/sections/analysis/panelBody/graphTab/index.tsx</div>
            <div>frontend/src/sections/analysis/panelBody/classificationTab/index.tsx</div>
            <div>frontend/src/sections/analysis/panelBody/coachTab/index.tsx</div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Before</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart TD
                  subgraph A["Analysis.tsx - 369 lines, 19 state vars"]
                    S1[useState moves] --> S2[useState fen]
                    S2 --> S3[useState analysisResult]
                    S3 --> S4[useState gameResult]
                    S4 --> S5[useState selectedTab]
                    S5 --> S6[useState arrowConfig]
                    S6 --> S7[useState openingName]
                    S7 --> S8[useState saveMsg]
                    S8 --> S9[useState boardFlipped]
                    S9 --> S10[useState analysisProgress]
                  end
                  T1[TabNav] -. prop-drill .-> S5
                  T2[GraphTab] -. prop-drill .-> S4
                  T3[ClassificationTab] -. prop-drill .-> S4
                  T4[CoachTab] -. prop-drill .-> S3
                  W1[graphTab/index.tsx] -. delete .-> T2
                  W2[classificationTab/index.tsx] -. delete .-> T3
                  W3[coachTab/index.tsx] -. delete .-> T4
                  class W1,W2,W3 shallow</pre>
              </div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">After</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  subgraph P["Analysis.tsx - thin orchestrator"]
                    O[useAnalysisState hook]
                  end
                  O --> T1[TabNav]
                  O --> T2[GraphTab]
                  O --> T3[ClassificationTab]
                  O --> T4[CoachTab]
                  subgraph D["useAnalysisState - deep module"]
                    A[(moves / currentIndex)]
                    B[(analysisResult / gameResult)]
                    C[(selectedTab / arrowConfig)]
                    D[(engine state)]
                    E[startAnalysis / saveAnalysis]
                  end
                  O -.-> D
                  style D fill:#0f172a,stroke-width:3px,color:#fff</pre>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-semibold text-slate-700">Problem</h4>
              <p class="text-slate-600">Analysis.tsx is shallow: its interface IS its implementation. 19 variables and 9 handlers mean every caller must understand the entire file to add a tab or a data dependency.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Solution</h4>
              <p class="text-slate-600">Extract a <code>useAnalysisState</code> hook — one interface with cohesive read/write accessors. Analysis.tsx drops to a 50-line delegator. The 3 pass-through wrappers merge into their shared components.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Wins</h4>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600">
                <li><strong>Locality</strong>: state logic concentrates in one module</li>
                <li><strong>Leverage</strong>: one hook serves all tab components</li>
                <li><strong>Test surface</strong>: test the hook, not the page</li>
                <li>Delete 3 pass-through wrappers (deletion test passes)</li>
                <li>Add a tab without touching Analysis.tsx</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- CANDIDATE 2 -->
        <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-xl font-bold">Delete the dead UciEngine — one adapter for the engine seam</h2>
            <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-emerald-600">Strong</span>
          </div>

          <div class="font-mono text-sm text-slate-600 space-y-0.5">
            <div>frontend/src/engine/UciEngine.ts (350 lines)</div>
            <div>frontend/src/engine/worker.ts (120 lines)</div>
            <div>frontend/src/engine/stockfish-adapter.ts (244 lines)</div>
            <div>frontend/src/engine/interface.ts (20 lines)</div>
            <div>frontend/src/engine/__tests__/UciEngine.test.ts</div>
            <div>frontend/src/engine/__tests__/worker.test.ts</div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Before</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  subgraph P["Production"]
                    A[StockfishWasmAdapter] --> B[EngineProvider]
                    B --> C[useEngineAdapter]
                    C --> D[Analysis.tsx]
                  end
                  subgraph O["Orphan - never imported"]
                    E[UciEngine 350 lines]
                    F[worker.ts 120 lines]
                    G[Web Workers]
                    E --> F --> G
                  end
                  style E fill:#fef3c7,stroke:#f59e0b
                  style F fill:#fef3c7,stroke:#f59e0b
                  linkStyle 4,5 stroke:#dc2626,stroke-width:2px,stroke-dasharray:5 5</pre>
              </div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">After</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  A[StockfishWasmAdapter] --> I[EngineAdapter interface]
                  I --> B[EngineProvider]
                  B --> C[useEngineAdapter]
                  C --> D[Analysis.tsx]
                  M[MockEngineAdapter] -. test .-> I
                  style I fill:#0f172a,stroke-width:3px,color:#fff</pre>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-semibold text-slate-700">Problem</h4>
              <p class="text-slate-600">Two parallel systems both talk to Stockfish through completely different interfaces. UciEngine (350 lines, worker pool) is the old approach. StockfishWasmAdapter (244 lines, reactive polling) is the new one. The old system is dead code — never imported, never called, but still maintained and tested.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Solution</h4>
              <p class="text-slate-600">Delete UciEngine.ts, worker.ts, and their tests. The EngineAdapter interface already defines the seam. StockfishWasmAdapter and MockEngineAdapter are the two adapters that prove it's real.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Wins</h4>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600">
                <li><strong>Locality</strong>: one engine module, one adapter per runtime</li>
                <li>Delete ~470 lines of dead code + 2 test files</li>
                <li>No confusion about which system to extend</li>
                <li>Tests that survive focus on the interface, not the implementation</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- CANDIDATE 3 -->
        <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-xl font-bold">Unify the backend seam pattern — one service per aggregate</h2>
            <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-amber-500">Worth exploring</span>
          </div>

          <div class="font-mono text-sm text-slate-600 space-y-0.5">
            <div>backend/app/routers/analysis.py (direct DB)</div>
            <div>backend/app/routers/openings.py (direct DB)</div>
            <div>backend/app/routers/repertoire.py (direct DB)</div>
            <div>backend/app/routers/stats.py (direct DB)</div>
            <div>backend/app/routers/nav.py (direct DB)</div>
            <div>backend/app/routers/puzzles.py (repository pattern)</div>
            <div>backend/app/routers/study.py (service pattern)</div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Before — three patterns</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  subgraph R["Routers"]
                    RA[analysis router]
                    RO[openings router]
                    RR[repertoire router]
                    RS[stats router]
                    RN[nav router]
                    RP[puzzles router]
                    RST[study router]
                  end
                  subgraph P["Seam placement"]
                    DA[direct DB queries]
                    DO[direct DB queries]
                    DR[direct DB queries]
                    DS[direct DB queries]
                    DN[direct DB queries]
                    RPZ[SqlAlchemyRepository]
                    SS[StudyService]
                  end
                  RA --> DA
                  RO --> DO
                  RR --> DR
                  RS --> DS
                  RN --> DN
                  RP --> RPZ
                  RST --> SS
                  style DA fill:#fef3c7
                  style DO fill:#fef3c7
                  style DR fill:#fef3c7
                  style DS fill:#fef3c7
                  style DN fill:#fef3c7</pre>
              </div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">After — one pattern</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  subgraph R2["Routers - thin"]
                    RA2[analysis router]
                    RO2[openings router]
                    RR2[repertoire router]
                    RS2[stats router]
                    RN2[nav router]
                    RP2[puzzles router]
                    RST2[study router]
                  end
                  subgraph S2["Service per aggregate"]
                    SGA[GameAnalysisService]
                    SOS[OpeningService]
                    SRS[RepertoireService]
                    SSS[StatsService]
                    SNS[NavService]
                    SPS[PuzzleService]
                    SSU[StudyService]
                  end
                  RA2 --> SGA
                  RO2 --> SOS
                  RR2 --> SRS
                  RS2 --> SSS
                  RN2 --> SNS
                  RP2 --> SPS
                  RST2 --> SSU
                  style S2 fill:#0f172a,stroke-width:3px,color:#fff</pre>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-semibold text-slate-700">Problem</h4>
              <p class="text-slate-600">5 of 8 routers bypass the service layer and query SQLAlchemy directly. 1 uses a repository, 1 uses a service class, 5 use nothing. The seam is arbitrary. analysis.py is the most complex router yet has no abstraction.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Solution</h4>
              <p class="text-slate-600">Pull direct DB queries from the 5 routers into service classes following StudyService as the template. Routers become 5-line delegators.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Wins</h4>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600">
                <li><strong>Seam</strong>: one pattern, not three</li>
                <li><strong>Locality</strong>: all GameAnalysis queries behind one service</li>
                <li><strong>Test surface</strong>: unit-test business logic without HTTP</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- CANDIDATE 4 -->
        <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-xl font-bold">Remove orphaned engine atoms — dead interface from a retired design</h2>
            <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-slate-500">Speculative</span>
          </div>

          <div class="font-mono text-sm text-slate-600 space-y-0.5">
            <div>frontend/src/state/atoms/engineAtoms.ts (13 atoms, 85 lines)</div>
            <div>frontend/src/state/atoms/__tests__/engineAtoms.test.ts</div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Before — parallel state systems</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  subgraph J["Jotai atoms - 13 atoms, 0 consumers"]
                    A[engineStatusAtom]
                    B[engineErrorAtom]
                    C[gameAnalysisProgressAtom]
                    D[gameAnalysisResultsAtom]
                    E[positionEvaluationAtom]
                    F[arrowConfigAtom]
                  end
                  subgraph H["EngineProvider hook - real source of truth"]
                    G[usePollAdapter]
                    H[ready]
                    I[error]
                    J[evalInfo]
                  end
                  subgraph Prod["Production"]
                    K[ArrowControls] --> F
                    L[ChessBoard] --> F
                    M[Analysis.tsx] --> H
                    M --> I
                    M --> J
                  end
                  linkStyle 0,1,2,3,4 stroke:#dc2626,stroke-dasharray:5 5</pre>
              </div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">After — one source of truth</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  U[useEngineAdapter] --> R[ready]
                  U --> E[error]
                  U --> VI[evalInfo]
                  U --> A[analyze / deepAnalyze]
                  AC[ArrowControls] --> ATC[arrowConfigAtom]
                  CB[ChessBoard] --> ATC
                  style U fill:#0f172a,stroke-width:3px,color:#fff</pre>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-semibold text-slate-700">Problem</h4>
              <p class="text-slate-600">engineAtoms.ts defines 13 atoms but none are consumed by the useEngineAdapter() hook or Analysis.tsx. The hook uses a polling adapter, not Jotai. 11 of 13 atoms are dead — only arrowConfigAtom is actually read.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Solution</h4>
              <p class="text-slate-600">Delete all orphaned atoms and their writable counterparts. Keep only arrowConfigAtom.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Wins</h4>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600">
                <li><strong>Locality</strong>: engine state has one path</li>
                <li>Delete ~85 lines of dead code + test file</li>
                <li>No ambiguous choice between atom and hook</li>
                <li><strong>Interface shrinks</strong>: 2 atoms instead of 13</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- CANDIDATE 5 -->
        <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-xl font-bold">Break up the heuristic puzzle generator — pluggable detection strategies</h2>
            <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-amber-500">Worth exploring</span>
          </div>

          <div class="font-mono text-sm text-slate-600 space-y-0.5">
            <div>backend/app/domain/adapters/heuristic_generator.py (408 lines)</div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Before — monolithic generator</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart TD
                  GEN[generate_moments] --> KWM[generate_key_moments]
                  KWM --> DET[_detect_patterns 200+ lines]
                  DET --> PIN[pins detection]
                  DET --> FRK[forks detection]
                  DET --> SKW[skewers detection]
                  DET --> HNG[hanging pieces]
                  DET --> DBL[double attacks]
                  DET --> CHM[checkmates]
                  style DET fill:#fef3c7,stroke:#f59e0b</pre>
              </div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">After — strategy per pattern</div>
              <div class="border rounded-lg p-3 bg-white flex justify-center">
                <pre class="mermaid">flowchart LR
                  INT[PuzzleGenerator interface]
                  COMP[CompositeGenerator]
                  FK[ForkDetector]
                  PN[PinDetector]
                  SK[SkewerDetector]
                  HP[HangingPieceDetector]
                  DA[DoubleAttackDetector]
                  CM[CheckmateDetector]
                  INT --> COMP
                  COMP --> FK
                  COMP --> PN
                  COMP --> SK
                  COMP --> HP
                  COMP --> DA
                  COMP --> CM
                  style INT fill:#0f172a,stroke-width:3px,color:#fff</pre>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-semibold text-slate-700">Problem</h4>
              <p class="text-slate-600">_detect_patterns is a 200+ line function handling 7 pattern types in one monolithic block. Each pattern uses its own heuristics but shares no interface.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Solution</h4>
              <p class="text-slate-600">Define a PatternDetector protocol. Split each pattern into its own adapter class. HeuristicPuzzleGenerator becomes a CompositeGenerator.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-700">Wins</h4>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600">
                <li><strong>Locality</strong>: fork bugs stay in ForkDetector</li>
                <li><strong>Seam</strong>: PatternDetector interface is a real seam</li>
                <li><strong>Test surface</strong>: unit-test a single pattern in isolation</li>
              </ul>
            </div>
          </div>
        </article>

      </section>

      <!-- TOP RECOMMENDATION -->
      <section id="top-recommendation" class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 space-y-3">
        <h2 class="text-xl font-bold text-indigo-900">Top recommendation</h2>
        <p class="text-indigo-800">
          <strong>Candidate #2 — Delete the dead UciEngine.</strong>
        </p>
        <p class="text-indigo-700 text-sm">
          Strongest signal (deletion test), clearest before/after (one engine interface instead of two), immediate leverage: 470 fewer lines, one adapter-based seam to test through, no ambiguity about which engine system to extend. After that, tackle <strong>Candidate #1</strong> to improve locality on the page developers touch most often.
        </p>
      </section>

    </main>
  </body>
</html>