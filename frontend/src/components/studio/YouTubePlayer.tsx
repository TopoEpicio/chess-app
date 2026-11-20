import { getYouTubeEmbedUrl } from '../../utils/youtube'
import { X } from 'lucide-react'

interface Props {
  url: string
  title: string
  onClose: () => void
}

export function YouTubePlayer({ url, title, onClose }: Props) {
  const embedUrl = getYouTubeEmbedUrl(url)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white-pure rounded-box shadow-xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-sage-100">
          <h3 className="font-semibold text-sm truncate">{title}</h3>
          <button onClick={onClose} className="text-sage-500 hover:text-sage-700"><X size={20} className="inline-block" /></button>
        </div>
        {embedUrl ? (
          <>
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="p-3 border-t border-sage-100 text-center">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                Apri su YouTube ↗
              </a>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-sage-500">
            <p>URL YouTube non valido</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-2 inline-block">
              Apri nel browser
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
