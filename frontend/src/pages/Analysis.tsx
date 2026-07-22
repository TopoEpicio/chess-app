import { useState, useEffect, useRef } from 'react';
import { InteractiveBoard } from '../components/board/ChessBoard';
import { PgnImporter } from '../components/analysis/PgnImporter';
import { EducationalPanel } from '../components/analysis/EducationalPanel';
import { EvaluationChart } from '../components/analysis/EvaluationChart';
import { MoveClassificationTable } from '../components/analysis/MoveClassificationTable';
import { ArrowControls } from '../components/analysis/ArrowControls';
import { ProgressBar } from '../components/analysis/ProgressBar';
import { TabNav } from '../components/analysis/TabNav';
import { api } from '../api/client';
import { Chess } from 'chess.js';
import { DifficultyCalculator } from '@chess-app/chess-domain';
import { useEngineAdapter } from '../engine/EngineProvider';
import { generateExplanation } from '../engine/analysisEngine';
import type { AnalysisExplanation, GameAnalysisResult, ArrowConfig, MoveAnalysisData } from '../types/analysis';
import { DEFAULT_ARROW_CONFIG } from '../types/analysis';
import { analyzeGameMoves, calculateAccuracy, countClassifications } from '../engine/gameAnalysisService';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { useMoveNavigation, type MoveItem } from '../engine/useMoveNavigation';

export function Analysis({ gameId, onBack }: { gameId?: number; onBack?: () => void }) {
  const [showPgnImport, setShowPgnImport] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [fen, setFen] = useState<string | undefined>();
  const [playingBot, setPlayingBot] = useState(false);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [moves, setMoves] = useState<MoveItem[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisExplanation | null>(null);
  const [gameResult, setGameResult] = useState<GameAnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'summary' | 'graph' | 'moves' | 'arrows' | 'coach'>('summary');
  const [arrowConfig, setArrowConfig] = useState<ArrowConfig>(DEFAULT_ARROW_CONFIG);
  const [arrows, setArrows] = useState<{ startSquare: string; endSquare: string; color: string }[]>([]);
  const [highlightedSquares, setHighlightedSquares] = useState<Record<string, React.CSSProperties>>({});
  const { currentIndex, goToMove, goNext, goPrev, canPrev, canNext } = useMoveNavigation(moves);
  const [generating, setGenerating] = useState(false);
  const [puzzleMsg, setPuzzleMsg] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [localGameId, setLocalGameId] = useState<number | undefined>(gameId);
  const { bestMove: getBestMove, deepAnalyze, ready } = useEngineAdapter();
  const gameRef = useRef(new Chess());
  const loadingMoves = useRef(false);
  const analyzing = useRef(false);

  const currentGameId = gameId ?? localGameId;

  useEffect(() => {
    setLocalGameId(gameId);
  }, [gameId]);

  useEffect(() => {
    const id = currentGameId;
    if (!id || loadingMoves.current) return;
    loadingMoves.current = true;
    api.analysis.getMoves(id).then(data => {
      const loaded = data as MoveItem[];
      setMoves(loaded);
      if (loaded.length > 0) {
        gameRef.current.reset();
        setFen(gameRef.current.fen());
      }
    }).catch(console.error).finally(() => { loadingMoves.current = false; });
    api.analysis.getAnalysisResult?.(id).then(data => {
      setGameResult(data as GameAnalysisResult);
    }).catch(() => {});
  }, [currentGameId]);

  useEffect(() => {
    if (currentIndex === -1) {
      gameRef.current.reset();
      setFen(gameRef.current.fen());
      return;
    }
    const storedFen = moves[currentIndex]?.fen;
    if (storedFen) {
      try {
        gameRef.current.load(storedFen);
        setFen(storedFen);
        return;
      } catch {}
    }
    gameRef.current.reset();
    setFen(gameRef.current.fen());
  }, [currentIndex, moves]);

  useEffect(() => {
    if (gameResult) return;
    if (fen === undefined || !ready) {
      setAnalysisResult(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const multiPv = await deepAnalyze(fen, 3, 10);
        const result = generateExplanation({ multiPv, fen });
        setAnalysisResult(result);
      } catch {
        setAnalysisResult(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [fen, ready, deepAnalyze, gameResult]);

  const startAnalysis = async () => {
    if (!fen || !ready || analyzing.current) return;
    analyzing.current = true;
    setAnalysisProgress(0);

    try {
      if (moves.length > 0) {
        const analyzedMoves = await analyzeGameMoves(moves, (fen, pv) => deepAnalyze(fen, pv, 10), (p) => {
          setAnalysisProgress(Math.round((p.currentMove / p.totalMoves) * 100));
        });
        const acc = calculateAccuracy(analyzedMoves);
        const counts = countClassifications(analyzedMoves);

        if (currentGameId) {
          try {
            await api.analysis.saveAnalysis(currentGameId, {
              moves: analyzedMoves,
              white_accuracy: acc.whiteAccuracy,
              black_accuracy: acc.blackAccuracy,
              white_cpl: acc.whiteCpl,
              black_cpl: acc.blackCpl,
            });
            const data = await api.analysis.getAnalysisResult(currentGameId);
            setGameResult(data as GameAnalysisResult);
          } catch {}
        }
      } else {
        const multiPv = await deepAnalyze(fen, 3, 10);
        const result = generateExplanation({ multiPv, fen });
        setAnalysisResult(result);
      }
    } finally {
      setAnalysisProgress(100);
      analyzing.current = false;
    }
  };

  const saveAnalysis = async () => {
    if (!gameResult || !currentGameId) return;
    const analysisMovesData = gameResult?.moves ?? [];
    const acc = calculateAccuracy(analysisMovesData);
    try {
      await api.analysis.saveAnalysis(currentGameId, {
        moves: analysisMovesData,
        white_accuracy: acc.whiteAccuracy,
        black_accuracy: acc.blackAccuracy,
        white_cpl: acc.whiteCpl,
        black_cpl: acc.blackCpl,
      });
      const data = await api.analysis.getAnalysisResult(currentGameId);
      setGameResult(data as GameAnalysisResult);
      setSaveMsg('Analisi salvata con successo');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Errore durante il salvataggio');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleMove = ({ from, to, promotion }: { from: string; to: string; promotion?: string }) => {
    try {
      gameRef.current.move({ from, to, promotion });
      setFen(gameRef.current.fen());
      goToMove(-1);
    } catch {}
  };

  const playBotMove = async () => {
    if (playingBot || !ready || fen === undefined) return;
    setPlayingBot(true);
    const currentFen = gameRef.current.fen();
    getBestMove(currentFen, () => { setPlayingBot(false); });
  };

  const handleImport = async (pgn: string) => {
    try {
      const res: any = await api.analysis.importPgn(pgn);
      if (res.id) {
        setLocalGameId(res.id);
        setImportMsg(res.duplicate ? 'Partita già presente' : 'PGN importata con successo!');
      } else {
        setImportMsg(res.duplicate ? 'Partita già presente' : 'Errore durante l\'importazione');
      }
      setTimeout(() => setImportMsg(''), 3000);
    } catch {
      setImportMsg('Errore durante l\'importazione');
      setTimeout(() => setImportMsg(''), 3000);
    }
    setShowPgnImport(false);
  };

  const createPuzzleFromPosition = async () => {
    if (!fen || !analysisResult) return;
    const bestMove = analysisResult.topMove.san;
    if (!bestMove) {
      setPuzzleMsg('Nessuna mossa da usare come soluzione');
      setTimeout(() => setPuzzleMsg(''), 3000);
      return;
    }
    const patterns = analysisResult.tacticalPatterns;
    const theme = patterns.length > 0 ? patterns[0].type : 'fork';
    const solution = [bestMove, ...analysisResult.topMove.followUp.split(' ').filter(Boolean)];
    try {
      await api.puzzles.create({
        fen,
        solution: solution.length > 0 ? solution : [bestMove],
        theme,
        difficulty: DifficultyCalculator.calculate(theme, solution.length, solution.some(s => s.includes('x'))),
        source: 'manual',
        source_game_id: currentGameId ?? null,
      });
      setPuzzleMsg('Puzzle creato con successo!');
      setTimeout(() => setPuzzleMsg(''), 3000);
    } catch {
      setPuzzleMsg('Errore nella creazione del puzzle');
      setTimeout(() => setPuzzleMsg(''), 3000);
    }
  };

  const generateAllPuzzles = async () => {
    if (!currentGameId) return;
    setGenerating(true);
    try {
      const result = await api.puzzles.generateFromGame(gameId);
      setPuzzleMsg(`Generati ${result.length} puzzle dalla partita!`);
      setTimeout(() => setPuzzleMsg(''), 4000);
    } catch {
      setPuzzleMsg('Errore nella generazione dei puzzle');
      setTimeout(() => setPuzzleMsg(''), 3000);
    }
    setGenerating(false);
  };

  const resetBoard = () => {
    gameRef.current.reset();
    setFen(undefined);
    goToMove(-1);
  };

  const analysisMoves: MoveAnalysisData[] = gameResult?.moves ?? [];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={startAnalysis}
                disabled={!ready}
                className="btn-primary px-4 py-2 rounded text-sm"
              >
                Analizza Partita
              </button>
              {gameResult && (
                <button onClick={saveAnalysis} className="btn-ghost px-4 py-2 rounded text-sm">
                  Salva analisi
                </button>
              )}
            </div>
            {gameResult && (
              <div className="text-sm text-sage-700 space-y-2 bg-white rounded-box p-4 shadow-sm">
                <div><strong>Precisione Bianco:</strong> {gameResult.white_accuracy?.toFixed(1) ?? 'N/A'}%</div>
                <div><strong>Precisione Nero:</strong> {gameResult.black_accuracy?.toFixed(1) ?? 'N/A'}%</div>
                <div><strong>Mosse analizzate:</strong> {gameResult.moves.length}</div>
                <div><strong>Stato:</strong> {gameResult.status}</div>
              </div>
            )}
          </div>
        );
      case 'graph':
        return (
          <div className="space-y-4">
            <EvaluationChart moves={analysisMoves} />
          </div>
        );
      case 'moves':
        return (
          <div className="space-y-4">
            <MoveClassificationTable
              moves={analysisMoves}
              classificationCounts={gameResult?.total_classification_counts}
              currentIndex={currentIndex}
              onMoveSelect={(i) => goToMove(i)}
            />
          </div>
        );
      case 'arrows':
        return (
          <div className="space-y-4">
            <ArrowControls config={arrowConfig} onChange={setArrowConfig} />
          </div>
        );
      case 'coach':
        return <EducationalPanel analysis={analysisResult} engineReady={ready} />;
      default:
        return null;
    }
  };

  const renderBoard = () => (
    <div className="space-y-4">
      <InteractiveBoard
        boardWidth={520}
        showEval
        fen={fen}
        boardOrientation={boardFlipped ? 'black' : 'white'}
        onMove={handleMove}
        arrows={arrows}
        highlightedSquares={highlightedSquares}
      />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToMove(currentIndex - 1)}
            disabled={!canPrev}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              canPrev ? 'bg-sage-500 text-white hover:bg-sage-700' : 'bg-sage-100 text-sage-400 cursor-not-allowed'
            }`}
          >
            &larr; Precedente
          </button>
          <span className="text-sm text-sage-700">
            {currentIndex + 1} / {moves.length}
          </span>
          <button
            onClick={() => goToMove(currentIndex + 1)}
            disabled={!canNext}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              canNext ? 'bg-sage-500 text-white hover:bg-sage-700' : 'bg-sage-100 text-sage-400 cursor-not-allowed'
            }`}
          >
            Successiva &rarr;
          </button>
        </div>
        <button
          onClick={() => setBoardFlipped(f => !f)}
          className="px-3 py-1 rounded-box text-sm font-medium transition-colors bg-sage-100 hover:bg-sage-200"
          title="Capovolgi scacchiera"
        >
          <RotateCw size={16} className="inline-block" />
        </button>
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="mt-6 space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">Azioni</div>
      <div className="space-y-2">
        <button className="btn-primary w-full" onClick={() => setShowPgnImport(true)}>Importa PGN</button>
        <button className="btn-ghost w-full text-sm" onClick={resetBoard}>Nuova posizione</button>
        <button className="btn-ghost w-full text-sm" onClick={playBotMove} disabled={playingBot || !ready || fen === undefined}>
          {playingBot ? 'Bot sta pensando...' : 'Gioca contro bot'}
        </button>
        {fen && analysisResult && (
          <button className="btn-ghost w-full text-sm text-amber-700 border border-amber-300 hover:bg-amber-50" onClick={createPuzzleFromPosition}>
            Crea puzzle da questa posizione
          </button>
        )}
        {currentGameId && moves.length > 0 && (
          <button className="btn-ghost w-full text-sm text-amber-700 border border-amber-300 hover:bg-amber-50" onClick={generateAllPuzzles} disabled={generating}>
            {generating ? 'Generazione in corso...' : 'Genera tutti i puzzle'}
          </button>
        )}
      </div>
      {importMsg && <div className="mt-2 text-sm text-sage-700 bg-sage-50 rounded-lg p-2 text-center">{importMsg}</div>}
      {saveMsg && <div className="mt-2 text-sm text-green-700 bg-green-50 rounded-lg p-2 text-center">{saveMsg}</div>}
      {puzzleMsg && <div className="mt-2 text-sm text-green-700 bg-green-50 rounded-lg p-2 text-center">{puzzleMsg}</div>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {onBack && (
        <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1">
          <ArrowLeft size={16} className="inline-block" /> Torna indietro
        </button>
      )}
      {gameId && <p className="text-sm text-sage-700 mb-4">Analisi partita #{gameId}</p>}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analisi</h1>
        <p className="text-sm text-sage-700">Analisi con Stockfish, spiegazioni e note del coach</p>
      </div>

      <div style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
        <div style={{ display: 'table-cell', width: 636, verticalAlign: 'top', paddingRight: 24 }} className="space-y-4">
          {renderBoard()}
          {renderActions()}
        </div>
        <div style={{ display: 'table-cell', verticalAlign: 'top' }} className="space-y-4">
          <ProgressBar progress={analysisProgress} />
          <TabNav selected={selectedTab} onSelect={setSelectedTab} />
          {renderTabContent()}
        </div>
      </div>

      {showPgnImport && (
        <PgnImporter onImport={handleImport} onClose={() => setShowPgnImport(false)} />
      )}
    </div>
  );
}