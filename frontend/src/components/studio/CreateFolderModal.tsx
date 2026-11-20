import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  onCreate: (name: string, description: string) => void
}

export function CreateFolderModal({ onClose, onCreate }: Props) {
  const { t } = useTranslation('common')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim(), description.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white-pure rounded-box shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">{t('studio.newFolder')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">{t('studio.name')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder={t('studio.folderNameExample')}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">{t('studio.description')} <span className="text-sage-400">({t('studio.optional')})</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-sage-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder={t('studio.descriptionPlaceholder')}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">{t('common.cancel')}</button>
            <button type="submit" disabled={!name.trim()} className="btn-primary flex-1">{t('common.create')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
