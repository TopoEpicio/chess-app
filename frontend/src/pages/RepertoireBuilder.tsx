import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Chess } from 'chess.js'
import { Chessboard } from '../components/board/ThemedBoard'
import { ArrowLeft, Check, Plus, Save, Trash2, RotateCcw, Undo } from 'lucide-react'
import { api } from '../api/client'
import type { StudyResource, ResourceType } from '../types'

interface Props {
  onBack: () => void
}

export function RepertoireBuilder({ onBack }: Props) {
  const { t } = useTranslation()
  const [game, setGame] = useState(() => new Chess())
  const [position, setPosition] = useState<string>('start')
  const [moves, setMoves] = useState<string[]>([])
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [openingId, setOpeningId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  const handleMove = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
    if (!targetSquare) return false
    
    // Try to make the move
    const tempGame = new Chess(position)
    const result = tempGame.move({ from: sourceSquare, to: targetSquare })
    if (!result) return false
    
    // Update state
    setGame(tempGame)
    setPosition(tempGame.fen())
    setMoves([...moves, result.san])
    return true
  }, [moves, position])

  const handleReset = useCallback(() => {
    setGame(new Chess())
    setPosition('start')
    setMoves([])
  }, [])

  const handleUndo = useCallback(() => {
    if (moves.length === 0) return
    setMoves(moves.slice(0, -1))
    // Replay all moves except last
    const tempGame = new Chess()
    for (const san of moves.slice(0, -1)) {
      tempGame.move({ san })
    }
    setGame(tempGame)
    setPosition(tempGame.fen())
  }, [moves])

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      setSaveError(t('repertoire.builder.enter_name'))
      return
    }
    
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    
    try {
      // Create a PGN from the moves
      const pgn = `[Event "Custom Repertoire"]
[Site "Chess App"]
[Date "${new Date().toISOString().split('T')[0]}"]
[Round "-"
[White "White"]
[Black "Black"]
[Result "*"

${moves.map((move, index) => {
      const moveNumber = Math.floor(index / 2) + 1
      const isWhiteMove = index % 2 === 0
      const prefix = isWhiteMove ? `${moveNumber}. ` : ''
      return `${prefix}${move}`
    }).join(' ')} *
`
      
      const resourceData = {
        type: 'opening' as ResourceType,
        name,
        description: description || `Custom repertoire with ${moves.length} moves`,
        url: null,
        fileName: null,
        fileSize: null,
        openingId: null, // Will be set by backend if needed
      }
      
      const response = await api.study.createResource(resourceData)
      const resourceId = response.id
      
      // TODO: Save the PGN/moves somewhere (would need backend endpoint)
      // For now, we'll just create the resource
      
      setSaveSuccess(true)
      setIsSaving(false)
      
      // Auto-close after success
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (error) {
      console.error('Failed to save repertoire:', error)
      setSaveError(t('repertoire.builder.save_failed'))
      setIsSaving(false)
    }
  }, [name, description, moves, onBack, t])

  if (isSaving) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-sage-500 border-t-transparent" />
          <span>{t('repertoire.builder.saving')}</span>
        </div>
      </div>
    )
  }

  if (saveSuccess) {
    return (
      <div className="flex items-center justify-center h-64 text-green-600">
        <div className="text-center">
          <Check size={32} />
          <p className="mt-2">{t('repertoire.builder.saved')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{t('repertoire.builder.title')}</h1>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-sm text-sage-600 hover:text-sage-900">
              <ArrowLeft size={16} /> {t('studio.back')}
            </button>
            <button onClick={handleReset} className="text-sm text-sage-600 hover:text-sage-900">
              <RotateCcw size={16} /> {t('repertoire.builder.reset')}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {saveError}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Left: Controls */}
          <div className="col-span-3 bg-white rounded-box shadow-sm p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-sage-700 mb-2">{t('repertoire.builder.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('repertoire.builder.enter_name')}
                className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-sage-700 mb-2">{t('repertoire.builder.description')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('repertoire.builder.enter_description')}
                className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 h-24 resize-y"
              />
            </div>
            
            <div className="mb-6">
              <button onClick={handleSave} disabled={isSaving || !name.trim()} className="w-full bg-sage-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-sage-600 disabled:opacity-50">
                {isSaving ? t('repertoire.builder.saving') : t('repertoire.builder.save')}
              </button>
            </div>
            
            <div className="mb-4">
              <button onClick={handleUndo} disabled={moves.length === 0} className="w-full bg-white text-sage-700 py-2 px-4 rounded-lg border border-sage-200 text-sm hover:bg-sage-50">
                <Undo size={16} className="mr-2" /> {t('repertoire.builder.undo')}
              </button>
            </div>
            
            <div className="text-xs text-sage-500">
              <p className="mb-1">{t('repertoire.builder.moves_played')}: <span className="font-medium">{moves.length}</span></p>
              <p>{t('repertoire.builder.current_position')}:</p>
              <p className="font-mono text-sage-800 bg-sage-50 p-2 rounded">{position}</p>
            </div>
          </div>

          {/* Center: Chessboard */}
          <div className="col-span-6 flex items-center justify-center">
            <div className="relative">
              <Chessboard
                options={{
                  id: 'repertoire-board',
                  position,
                  onPieceDrop: handleMove,
                  boardOrientation: 'white',
                }}
              />
              {moves.length > 0 && (
                <div className="absolute inset-0 flex items-end justify-end p-2">
                  <div className="text-xs text-sage-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
                    {moves.map((move, index) => {
                      const moveNumber = Math.floor(index / 2) + 1
                      const isWhiteMove = index % 2 === 0
                      const prefix = isWhiteMove ? `${moveNumber}. ` : ''
                      return <span key={index} className="mx-0.5">{prefix}{move}{!isWhiteMove && index < moves.length - 1 ? ' ' : ''}</span>
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Stats & Preview */}
          <div className="col-span-3 bg-white rounded-box shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{t('repertoire.builder.preview')}</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Plus size={14} className="mr-2 text-sage-500" />
                  <span>{t('repertoire.builder.new_repertoire')}</span>
                </div>
                <div className="flex items-center">
                  <Save size={14} className="mr-2 text-sage-500" />
                  <span>{t('repertoire.builder.save_to_library')}</span>
                </div>
                <div className="flex items-center">
                  <Trash2 size={14} className="mr-2 text-sage-500" />
                  <span>{t('repertoire.builder.discard_changes')}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-sage-200">
              <h3 className="text-lg font-semibold mb-2">{t('repertoire.builder.stats')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('repertoire.builder.moves')}</span>
                  <span className="font-medium">{moves.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('repertoire.builder.ply')}</span>
                  <span className="font-medium">{moves.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('repertoire.builder.fullmoves')}</span>
                  <span className="font-medium">{Math.floor(moves.length / 2) + (moves.length % 2 === 1 ? 1 : 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}