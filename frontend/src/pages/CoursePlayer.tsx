import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Chess } from 'chess.js'
import { Chessboard } from '../components/board/ThemedBoard'
import { getCourse } from '../data/courses'
import { useCourseTree } from '../hooks/useCourseTree'
import { useCourseProgress } from '../hooks/useCourseProgress'
import type { Course, Module, Lesson } from '../domain/course/types'
import { ArrowLeft, Check, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'

type TFunction = ReturnType<typeof useTranslation>['t']

interface Props {
  courseId: string
  onBack: () => void
}

export function CoursePlayer({ courseId, onBack }: Props) {
  const { t } = useTranslation()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0)
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0)
  const [modulesExpanded, setModulesExpanded] = useState<Record<string, boolean>>({})
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null)

  const { progress, completeLesson, setCurrentLesson, isLessonCompleted } = useCourseProgress(courseId)

  useEffect(() => {
    getCourse(courseId).then((c) => {
      setCourse(c)
      setModulesExpanded(
        Object.fromEntries(c.modules.map((m) => [m.id, true])),
      )
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [courseId])

  const tree = course?.tree
  const lesson = course?.modules[currentModuleIdx]?.lessons[currentLessonIdx]
  const initialNodeId = lesson?.type === 'guess-move' ? lesson.nodeId : undefined

  const { state, navigateForward, navigateBack, resetToRoot, navigateToNode } = useCourseTree(
    tree ?? { rootId: '', nodes: {} },
    initialNodeId,
  )

  useEffect(() => {
    if (!lesson) return
    if (lesson.type === 'guess-move') {
      navigateToNode(lesson.nodeId)
    } else if (lesson.type === 'theory' || lesson.type === 'quiz') {
      resetToRoot()
    }
  }, [lesson])

  const handleLessonSelect = useCallback((modIdx: number, lesIdx: number) => {
    setCurrentModuleIdx(modIdx)
    setCurrentLessonIdx(lesIdx)
    setGuessResult(null)
    const les = course?.modules[modIdx]?.lessons[lesIdx]
    if (les) setCurrentLesson(les.id)
  }, [course, setCurrentLesson])

  const handleMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    const game = new Chess(state.currentFen)
    const result = game.move(move)
    if (!result) return

    const san = result.san
    const nextId = navigateForward(san)
    if (nextId === null) return

    if (lesson?.type === 'guess-move') {
      const node = tree?.nodes[lesson.nodeId]
      const acceptedMoves = node?.childrenIds
        .map((cid) => tree?.nodes[cid]?.move)
        .filter(Boolean) as string[]

      if (acceptedMoves?.includes(san)) {
        setGuessResult('correct')
        completeLesson(lesson.id)
      } else {
        setGuessResult('incorrect')
      }
    }
  }, [state.currentFen, navigateForward, lesson, tree, completeLesson])

  const handleResetPosition = useCallback(() => {
    if (lesson?.type === 'guess-move') {
      navigateToNode(lesson.nodeId)
    } else {
      resetToRoot()
    }
    setGuessResult(null)
  }, [lesson, navigateToNode, resetToRoot])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-sage-500 border-t-transparent" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1">
          <ArrowLeft size={16} /> {t('studio.back')}
        </button>
        <p className="text-sage-700">{t('course.not_found')}</p>
      </div>
    )
  }

  const currentModule = course.modules[currentModuleIdx]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 mb-4 flex items-center gap-1">
        <ArrowLeft size={16} /> {t('studio.back')}
      </button>

      <div className="flex gap-6">
        {/* Left: module/lesson sidebar */}
        <div className="w-64 shrink-0">
          <h1 className="text-xl font-bold mb-1">{course.title}</h1>
          <p className="text-sm text-sage-600 mb-4">{course.description}</p>

          {course.modules.map((mod, mi) => (
            <div key={mod.id} className="mb-2">
              <button
                onClick={() => setModulesExpanded((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))}
                className="flex items-center gap-1 w-full text-left text-sm font-semibold text-sage-800 py-1.5 px-2 rounded hover:bg-sage-100"
              >
                {modulesExpanded[mod.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {mod.title}
              </button>

              {modulesExpanded[mod.id] && (
                <div className="ml-4 space-y-0.5">
                  {mod.lessons.map((les, li) => (
                    <button
                      key={les.id}
                      onClick={() => handleLessonSelect(mi, li)}
                      className={`flex items-center gap-1.5 w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                        currentModuleIdx === mi && currentLessonIdx === li
                          ? 'bg-sage-500 text-white'
                          : 'text-sage-700 hover:bg-sage-100'
                      }`}
                    >
                      {isLessonCompleted(les.id) ? (
                        <Check size={12} className="text-green-600 shrink-0" />
                      ) : (
                        <span className="w-3 shrink-0" />
                      )}
                      <LessonIcon type={les.type} />
                      {les.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-sage-200">
            <p className="text-xs text-sage-500">
              {t('course.progress')}: {progress.completedLessons.length} / {course.modules.reduce((s, m) => s + m.lessons.length, 0)}
            </p>
          </div>
        </div>

        {/* Center: chessboard */}
        <div className="shrink-0" style={{ width: 340 }}>
          <div style={{ width: 340, aspectRatio: '1/1' }}>
            <Chessboard
              options={{
                id: 'course-board',
                position: state.currentFen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' ? undefined : state.currentFen,
                onPieceDrop: ({ sourceSquare, targetSquare }) => {
                  if (!targetSquare) return false
                  handleMove({ from: sourceSquare, to: targetSquare })
                  return true
                },
                boardOrientation: course.side === 'black' ? 'black' : 'white',
              }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={navigateBack} disabled={!state.canGoBack} className="text-xs px-3 py-1 rounded bg-sage-100 text-sage-700 disabled:opacity-30">
              {t('studio.back')}
            </button>
            <button onClick={handleResetPosition} className="text-xs px-3 py-1 rounded bg-sage-100 text-sage-700 flex items-center gap-1">
              <RotateCcw size={12} /> {t('course.reset')}
            </button>
          </div>
          <div className="mt-2 text-xs text-sage-500">
            {state.moveHistory.length > 0 && (
              <span>
                {t('course.moves')}: {state.moveHistory.map((m, i) =>
                  `${i % 2 === 0 ? Math.floor(i / 2) + 1 + '.' : ''}${m}`
                ).join(' ')}
              </span>
            )}
          </div>
        </div>

        {/* Right: lesson content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{lesson?.title}</h2>
            <p className="text-xs text-sage-500">
              {currentModule?.title} &middot; {lesson?.type === 'theory' ? t('course.theory') : lesson?.type === 'guess-move' ? t('course.guess_move') : lesson?.type === 'quiz' ? t('course.quiz') : t('course.model_game')}
            </p>
          </div>

          {lesson?.type === 'theory' && (
            <TheoryView content={lesson.content} />
          )}

          {lesson?.type === 'guess-move' && (
            <GuessMoveView
              t={t}
              result={guessResult}
              onReset={handleResetPosition}
              legalMoves={state.legalMoves}
            />
          )}

          {lesson?.type === 'quiz' && (
            <QuizView
              t={t}
              lesson={lesson}
              onComplete={() => completeLesson(lesson.id)}
            />
          )}

          {state.children.length > 0 && lesson?.type !== 'guess-move' && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-sage-700 mb-2">{t('course.reachable_positions')}:</p>
              <div className="flex flex-wrap gap-1">
                {state.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => navigateToNode(child.id)}
                    className="text-xs px-2 py-1 rounded bg-sage-100 text-sage-700 hover:bg-sage-200"
                  >
                    {child.move}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LessonIcon({ type }: { type: string }) {
  return <span className="text-xs opacity-60">{type === 'theory' ? 'T' : type === 'guess-move' ? '?' : type === 'quiz' ? 'Q' : '♟'}</span>
}

function TheoryView({ content }: { content: string }) {
  return (
    <div className="mb-4 p-4 bg-white rounded-box shadow-sm text-sm text-sage-800 leading-relaxed whitespace-pre-line">
      {content}
    </div>
  )
}

function GuessMoveView({ t, result, onReset, legalMoves }: { t: TFunction; result: 'correct' | 'incorrect' | null; onReset: () => void; legalMoves: string[] }) {
  return (
    <div className="p-4 bg-white rounded-box shadow-sm">
      <p className="text-sm font-medium text-sage-800 mb-2">{t('course.your_turn')}</p>
      {result === 'correct' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-2">
          <p className="text-sm text-green-800 font-medium">{t('course.correct')}</p>
        </div>
      )}
      {result === 'incorrect' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-2">
          <p className="text-sm text-red-800 font-medium">{t('course.incorrect_try_again')}</p>
          <button onClick={onReset} className="mt-2 text-xs px-3 py-1 rounded bg-sage-100 text-sage-700">
            {t('course.try_again')}
          </button>
        </div>
      )}
      {!result && (
        <div className="flex flex-wrap gap-1">
          {legalMoves.slice(0, 8).map((m) => (
            <span key={m} className="text-xs px-2 py-0.5 bg-sage-50 text-sage-500 rounded">
              {m}
            </span>
          ))}
          {legalMoves.length > 8 && (
            <span className="text-xs text-sage-400">+{legalMoves.length - 8} {t('course.more')}</span>
          )}
        </div>
      )}
    </div>
  )
}

function QuizView({ t, lesson, onComplete }: { t: TFunction; lesson: Lesson; onComplete: () => void }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  if (lesson.type !== 'quiz') return null

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIdx(idx)
  }

  const handleSubmit = () => {
    setAnswered(true)
    if (lesson.options[selectedIdx!]?.correct) {
      onComplete()
    }
  }

  return (
    <div className="p-4 bg-white rounded-box shadow-sm">
      <p className="text-sm font-medium text-sage-800 mb-3">{lesson.question}</p>
      <div className="space-y-1.5">
        {lesson.options.map((opt, i) => {
          let bg = 'bg-sage-50 hover:bg-sage-100'
          if (answered) {
            if (opt.correct) bg = 'bg-green-50 border border-green-300'
            else if (i === selectedIdx) bg = 'bg-red-50 border border-red-300'
          } else if (i === selectedIdx) {
            bg = 'bg-sage-200 border border-sage-400'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`block w-full text-left text-sm px-3 py-2 rounded ${bg} transition-colors`}
            >
              {opt.text}
              {answered && opt.correct && <span className="ml-2 text-green-600">✓</span>}
              {answered && i === selectedIdx && !opt.correct && <span className="ml-2 text-red-600">✗</span>}
            </button>
          )
        })}
      </div>
      {!answered && selectedIdx !== null && (
        <button onClick={handleSubmit} className="mt-3 text-sm px-4 py-1.5 rounded bg-sage-500 text-white hover:bg-sage-600">
          {t('course.submit')}
        </button>
      )}
      {answered && (
        <p className="mt-3 text-sm text-sage-600">
          {lesson.options[selectedIdx!]?.correct ? t('course.correct_answer') : t('course.incorrect_answer')}
        </p>
      )}
    </div>
  )
}
