import { ArrowLeft, Check, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Chess } from 'chess.js'
import { Chessboard } from '../components/board/ThemedBoard'
import { getCourse } from '../data/courses'
import { useCourseTree } from '../hooks/useCourseTree'
import { useCourseProgress } from '../hooks/useCourseProgress'
import type { Course, Module, Lesson } from '../domain/course/types'
import type { Locale } from '../data/courseTranslations'
import { getCourseTranslation } from '../data/courseTranslations'

type TFunction = ReturnType<typeof useTranslation>['t']

interface Props {
  courseId: string
  onBack: () => void
}

export function CoursePlayer({ courseId, onBack }: Props) {
  const { t, i18n } = useTranslation()
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

  const handleModuleSelect = useCallback((mi: number) => {
    setCurrentModuleIdx(mi)
    setCurrentLessonIdx(0)
    setModulesExpanded((prev) => ({ ...prev, [course?.modules[mi]?.id || '']: true }))
    setGuessResult(null)
  }, [course])

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

  const translatedCourse = course ? getCourseTranslation(course.id, i18n.language as Locale) : null

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
  const translatedLesson = translatedCourse?.modules[currentModuleIdx]?.lessons[currentLessonIdx]

  return (
    <div className="flex h-screen flex-col bg-sage-50">
      {/* Main: Board (hero) + Content panel */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* Board — fills available space */}
        <div className="flex-1 min-w-0 flex items-center justify-center overflow-hidden p-4">
          <div style={{ aspectRatio: '1', height: '100%', maxWidth: '100%' }}>
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
        </div>

        {/* Right panel — lesson content */}
        <div className="w-[380px] shrink-0 flex flex-col border-l border-sage-200 bg-white">
          {/* Back button */}
          <div className="px-4 py-2 border-b border-sage-200 shrink-0">
            <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900 flex items-center gap-1">
              <ArrowLeft size={16} /> {t('studio.back')}
           </button>
         </div>

          {/* Lesson header */}
          <div className="px-4 py-3 border-b border-sage-200 shrink-0">
            <h2 className="text-sm font-semibold text-sage-800">{translatedLesson?.title || lesson?.title}</h2>
            <p className="text-xs text-sage-500 mt-1">
              {currentModule?.title} &middot; {lesson?.type === 'theory' ? t('course.theory') : lesson?.type === 'guess-move' ? t('course.guess_move') : lesson?.type === 'quiz' ? t('course.quiz') : t('course.model_game')}
           </p>
         </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3">
            {lesson?.type === 'theory' && (
              <TheoryView content={translatedLesson?.content || lesson.content} />
            )}

            {lesson?.type === 'guess-move' && (
              <GuessMoveView
                t={t}
                result={guessResult}
                onReset={handleResetPosition}
                legalMoves={state.legalMoves}
                hints={translatedLesson?.hints || lesson.hints}
              />
            )}

            {lesson?.type === 'quiz' && (
              <QuizView
                t={t}
                lesson={lesson}
                translatedLesson={translatedLesson}
                onComplete={() => completeLesson(lesson.id)}
              />
            )}

            {state.children.length > 0 && lesson?.type !== 'guess-move' && (
              <div>
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

            {/* Move history */}
            {state.moveHistory.length > 0 && (
              <div className="text-xs text-sage-500">
                {state.moveHistory.map((m, i) =>
                  `${i % 2 === 0 ? Math.floor(i / 2) + 1 + '.' : ''}${m}`
                ).join(' ')}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="px-4 py-3 border-t border-sage-200 shrink-0 space-y-2 bg-sage-50">
            <div className="flex gap-2">
              <button onClick={navigateBack} disabled={!state.canGoBack} className="text-xs px-3 py-1.5 rounded bg-sage-100 text-sage-700 disabled:opacity-30 hover:bg-sage-200">
                {t('studio.back')}
             </button>
              <button onClick={handleResetPosition} className="text-xs px-3 py-1.5 rounded bg-sage-100 text-sage-700 flex items-center gap-1 hover:bg-sage-200">
                <RotateCcw size={12} /> {t('course.reset')}
             </button>
           </div>
            <p className="text-xs text-sage-500">
              {t('course.progress')}: {progress.completedLessons.length} / {course.modules.reduce((s, m) => s + m.lessons.length, 0)}
           </p>
         </div>

          {/* Module accordion */}
          <div className="border-t border-sage-200 shrink-0 max-h-[280px] overflow-y-auto bg-white">
            {course.modules.map((mod, mi) => {
              const isOpen = modulesExpanded[mod.id] ?? false
              const modTranslated = translatedCourse?.modules[mi]?.title || mod.title
              return (
                <div key={mod.id} className="border-b border-sage-100 last:border-b-0">
                  <button
                    onClick={() => setModulesExpanded((prev) => ({ ...prev, [mod.id]: !isOpen }))}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                      currentModuleIdx === mi
                        ? 'bg-sage-50 text-sage-800'
                        : 'text-sage-700 hover:bg-sage-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="opacity-60">{mi + 1}.</span>
                      {modTranslated}
                   </span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                 </button>
                  {isOpen && (
                    <div className="pb-2">
                      {mod.lessons.map((les, li) => {
                        const lesTranslated = translatedCourse?.modules[mi]?.lessons[li]?.title || les.title
                        const isCurrent = currentModuleIdx === mi && currentLessonIdx === li
                        const completed = isLessonCompleted(les.id)
                        return (
                          <button
                            key={les.id}
                            onClick={() => handleLessonSelect(mi, li)}
                            className={`w-full flex items-center gap-2 pl-9 pr-4 py-1.5 text-left text-xs transition-colors ${
                              isCurrent
                                ? 'bg-sage-500 text-white font-medium'
                                : 'text-sage-600 hover:bg-sage-50'
                            }`}
                          >
                            {completed && <Check size={10} className={isCurrent ? 'text-white' : 'text-green-600'} />}
                            <span className="opacity-60">{li + 1}</span>
                            <span className="truncate">{lesTranslated}</span>
                         </button>
                        )
                      })}
                   </div>
                  )}
               </div>
              )
            })}
         </div>
       </div>
      </div>
    </div>
  )
}

function TheoryView({ content }: { content: string }) {
  return (
    <div className="p-4 bg-sage-50 rounded-lg text-sm text-sage-800 leading-relaxed whitespace-pre-line border border-sage-200">
      {content}
    </div>
  )
}

function GuessMoveView({ t, result, onReset, legalMoves, hints }: { t: TFunction; result: 'correct' | 'incorrect' | null; onReset: () => void; legalMoves: string[]; hints?: string[] }) {
  return (
    <div className="p-4 bg-sage-50 rounded-lg border border-sage-200">
      <p className="text-sm font-medium text-sage-800 mb-2">{t('course.your_turn')}</p>
      {result === 'correct' && (
        <div className="p-3 bg-green-50 border border-green-300 rounded-lg mb-2">
          <p className="text-sm text-green-800 font-medium">{t('course.correct')}</p>
        </div>
      )}
      {result === 'incorrect' && (
        <div className="p-3 bg-red-50 border border-red-300 rounded-lg mb-2">
          <p className="text-sm text-red-800 font-medium">{t('course.incorrect_try_again')}</p>
          <button onClick={onReset} className="mt-2 text-xs px-3 py-1 rounded bg-sage-100 text-sage-700 hover:bg-sage-200">
            {t('course.try_again')}
          </button>
        </div>
      )}
      {!result && (
        <div className="space-y-2">
          {hints && hints.length > 0 && (
            <div className="text-xs text-sage-600 space-y-1">
              {hints.map((hint, i) => (
                <p key={i}>💡 {hint}</p>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {legalMoves.slice(0, 8).map((m) => (
              <span key={m} className="text-xs px-2 py-0.5 bg-sage-100 text-sage-600 rounded">
                {m}
              </span>
            ))}
            {legalMoves.length > 8 && (
              <span className="text-xs text-sage-400">+{legalMoves.length - 8} {t('course.more')}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function QuizView({ t, lesson, translatedLesson, onComplete }: { t: TFunction; lesson: Lesson; translatedLesson?: { question?: string; options?: { text: string; correct?: boolean }[] }; onComplete: () => void }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  if (lesson.type !== 'quiz') return null

  const question = translatedLesson?.question || lesson.question
  const options = translatedLesson?.options || lesson.options

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIdx(idx)
  }

  const handleSubmit = () => {
    setAnswered(true)
    if (options[selectedIdx!]?.correct) {
      onComplete()
    }
  }

  return (
    <div className="p-4 bg-sage-50 rounded-lg border border-sage-200">
      <p className="text-sm font-medium text-sage-800 mb-3">{question}</p>
      <div className="space-y-1.5">
        {options.map((opt, i) => {
          let bg = 'bg-white hover:bg-sage-100 border border-sage-200'
          if (answered) {
            if (opt.correct) bg = 'bg-green-50 border border-green-400'
            else if (i === selectedIdx) bg = 'bg-red-50 border border-red-400'
          } else if (i === selectedIdx) {
            bg = 'bg-sage-100 border border-sage-400'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`block w-full text-left text-sm px-3 py-2 rounded ${bg} text-sage-800 transition-colors`}
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
          {options[selectedIdx!]?.correct ? t('course.correct_answer') : t('course.incorrect_answer')}
        </p>
      )}
    </div>
  )
}
