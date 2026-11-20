import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StudyFolderDialog } from '../../../components/analysis/StudyFolderDialog'

interface PanelHeaderProps {
  onBack?: () => void
  gameId?: number
  onImportPgn: () => void
  importMsg: string
}

export function PanelHeader({ onBack, gameId, onImportPgn, importMsg }: PanelHeaderProps) {
  const { t } = useTranslation('common')
  return (
    <>
      {onBack && (
        <button onClick={onBack} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4 flex items-center gap-1">
          <ArrowLeft size={16} className="inline-block" /> {t('analysis.back')}
        </button>
      )}
      {gameId !== undefined && <p className="text-sm text-[var(--color-text-muted)] mb-4">Analysis #{gameId}</p>}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('analysis.title')}</h1>
        <p className="text-sm text-[var(--color-text-muted)]">{t('analysis.analyzeWithStockfish')}</p>
      </div>
      {importMsg && (
        <div className="mb-4 text-sm text-[var(--color-text-muted)] bg-[var(--color-surface)] rounded-lg p-2 text-center border border-[var(--color-border)]">{importMsg}</div>
      )}
      <div className="mb-4">
        <button className="btn-primary w-full" onClick={onImportPgn}>{t('games.importPgn')}</button>
      </div>
    </>
  )
}