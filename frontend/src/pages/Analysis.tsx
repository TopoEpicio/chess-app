import { useState, useEffect, useRef } from 'react';
import { ChessBoard } from '../components/board/ChessBoard';
import { PgnImporter } from '../components/analysis/PgnImporter';
import { ProgressBar } from '../components/analysis/ProgressBar';
import { TabNav } from '../components/analysis/TabNav';
import { ArrowControls } from '../components/analysis/ArrowControls';
import { api } from '../api/client';
import { findOpeningByFen } from '../data/openings';
import { Chess } from 'chess.js';
import { DifficultyCalculator } from '@chess-app/chess-domain';
import { useUciEngine } from '../engine/useUciEngine';
import { generateExplanation } from '../engine/analysisEngine';
import type { AnalysisExplanation, GameAnalysisResult, ArrowConfig, MoveAnalysisData } from '../types/analysis';
import { DEFAULT_ARROW_CONFIG } from '../types/analysis';
import { analyzeGameMoves, calculateAccuracy, countClassifications } from '../engine/gameAnalysisService';
import { useMoveNavigation, type MoveItem } from '../engine/useMoveNavigation';
import { AnalysisLayout } from '../sections/analysis/AnalysisLayout';
import { PanelHeader } from '../sections/analysis/panelHeader';
import { PanelToolbar } from '../sections/analysis/panelToolbar';
import { AnalysisTab } from '../sections/analysis/panelBody/analysisTab';
import { GraphTab } from '../sections/analysis/panelBody/graphTab';
import { ClassificationTab } from '../sections/analysis/panelBody/classificationTab';
import { CoachTab } from '../sections/analysis/panelBody/coachTab';

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
  const { currentIndex, goToMove, goNext, goPrev, canPrev, canNext } = useMoveNavigation(moves);
  const [generating, setGenerating] = useState(false);
  const [puzzleMsg, setPuzzleMsg] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [localGameId, setLocalGameId] = useState<number | undefined>(gameId);
  const [openingName, setOpeningName] = useState<string | undefined>();
  const [openingEco, setOpeningEco] = useState<string | undefined>();
  const [exploring, setExploring] = useState(false);
  const { bestMove, deepAnalyze, ready, evalInfo, error: engineError, analyze } = useUciEngine();
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
      const startFen = gameRef.current.fen();
      setFen(startFen);
      const opening = findOpeningByFen(startFen);
      setOpeningName(opening?.name);
      setOpeningEco(opening?.eco);
      return;
    }
    const storedFen = moves[currentIndex]?.fen;
    if (storedFen) {
      try {
        gameRef.current.load(storedFen);
        setFen(storedFen);
        const opening = findOpeningByFen(storedFen);
        setOpeningName(opening?.name);
        setOpeningEco(opening?.eco);
        return;
      } catch {}
    }
    gameRef.current.reset();
    const resetFen = gameRef.current.fen();
    setFen(resetFen);
    const opening = findOpeningByFen(resetFen);
    setOpeningName(opening?.name);
    setOpeningEco(opening?.eco);
  }, [currentIndex, moves]);

  useEffect(() => {
    if (fen !== undefined && ready) {
      analyze(fen);
    }
  }, [fen, ready, analyze]);

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
      if (moves.length > 0) {
        setExploring(true);
      }
    } catch {}
  };

  const handleGoToMove = (index: number) => {
    goToMove(index);
    setExploring(false);
  };

  const handleGoPrev = () => {
    goPrev();
    setExploring(false);
  };

  const handleGoNext = () => {
    goNext();
    setExploring(false);
  };

  const playBotMove = async () => {
    if (playingBot || !ready || fen === undefined) return;
    setPlayingBot(true);
    const currentFen = gameRef.current.fen();
    await bestMove(currentFen);
    setPlayingBot(false);
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PanelHeader
        onBack={onBack}
        gameId={gameId}
        onImportPgn={() => setShowPgnImport(true)}
        importMsg={importMsg}
        openingName={openingName}
        fen={fen}
        eco={openingEco}
      />

      <AnalysisLayout
        board={
          <div className="space-y-4">
            <ChessBoard
              boardWidth={520}
              showEval
              position={fen}
              boardOrientation={boardFlipped ? 'black' : 'white'}
              onMove={handleMove}
              moveData={gameResult?.moves?.[currentIndex] ?? null}
              evalInfo={evalInfo}
              engineReady={ready}
              engineError={engineError}
            />
            <PanelToolbar
              currentIndex={currentIndex}
              totalMoves={moves.length}
              canPrev={canPrev}
              canNext={canNext}
              onPrev={handleGoPrev}
              onNext={handleGoNext}
              boardFlipped={boardFlipped}
              onFlip={() => setBoardFlipped(f => !f)}
              exploring={exploring}
              onReset={() => { goToMove(currentIndex); setExploring(false); }}
            />
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-sage-500 mb-2">Azioni</div>
              <div className="space-y-2">
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
              {saveMsg && <div className="mt-2 text-sm text-green-700 bg-green-50 rounded-lg p-2 text-center">{saveMsg}</div>}
              {puzzleMsg && <div className="mt-2 text-sm text-green-700 bg-green-50 rounded-lg p-2 text-center">{puzzleMsg}</div>}
            </div>
          </div>
        }
        sidePanel={
          <>
            <ProgressBar progress={analysisProgress} />
            <TabNav selected={selectedTab} onSelect={setSelectedTab} />
            {selectedTab === 'summary' && (
              <AnalysisTab
                onStartAnalysis={startAnalysis}
                canStart={ready}
                onSaveAnalysis={saveAnalysis}
                hasGameResult={!!gameResult}
                whiteAccuracy={gameResult?.white_accuracy ?? null}
                blackAccuracy={gameResult?.black_accuracy ?? null}
                movesCount={analysisMoves.length}
                status={gameResult?.status ?? ''}
              />
            )}
            {selectedTab === 'graph' && (
              <GraphTab
                moves={analysisMoves}
                currentMoveIndex={currentIndex}
                onMoveClick={(i) => handleGoToMove(i)}
              />
            )}
            {selectedTab === 'moves' && (
              <ClassificationTab
                moves={analysisMoves}
                classificationCounts={gameResult?.total_classification_counts}
                currentIndex={currentIndex}
                onMoveSelect={(i) => handleGoToMove(i)}
              />
            )}
            {selectedTab === 'arrows' && (
              <ArrowControls config={arrowConfig} onChange={setArrowConfig} />
            )}
            {selectedTab === 'coach' && <CoachTab analysis={analysisResult} engineReady={ready} />}
          </>
        }
      />

      {showPgnImport && (
        <PgnImporter onImport={handleImport} onClose={() => setShowPgnImport(false)} />
      )}
    </div>
  );
}
