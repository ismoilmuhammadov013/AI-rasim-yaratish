import React from 'react';
import {
  X,
  History,
  Download,
  Trash2,
  ExternalLink,
  Sparkles,
  RotateCw,
  Clock,
} from 'lucide-react';
import { GeneratedImage } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedImage[];
  onSelectImage: (img: GeneratedImage) => void;
  onDeleteImage: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectImage,
  onDeleteImage,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const handleDownload = (img: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const link = document.createElement('a');
      link.href = img.url;
      const cleanPrompt = img.prompt
        .slice(0, 30)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      link.download = `tasvir_ai_${cleanPrompt || 'history'}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">
              Rasmlar Tarixi ({history.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of generated images */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-zinc-500">
              <Clock className="mb-2 h-10 w-10 text-zinc-600" />
              <p className="text-sm font-medium text-zinc-400">
                Hozircha tarix bo‘sh
              </p>
              <p className="mt-1 text-xs">
                Yaratilgan tasvirlar avtomatik shu yerda saqlanadi
              </p>
            </div>
          ) : (
            history.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  onSelectImage(img);
                  onClose();
                }}
                className="group relative flex cursor-pointer gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2.5 transition-all hover:border-indigo-500/50 hover:bg-zinc-900"
              >
                {/* Thumbnail */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-950">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Info & Prompt */}
                <div className="flex flex-1 flex-col justify-between overflow-hidden">
                  <div>
                    <p className="line-clamp-2 text-xs font-medium text-zinc-200">
                      "{img.prompt}"
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>Nisbat: {img.aspectRatio}</span>
                      <span>•</span>
                      <span>{new Date(img.createdAt).toLocaleTimeString('uz-UZ')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDownload(img, e)}
                      className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      title="Yuklab olish"
                    >
                      <Download className="h-3 w-3" />
                      Yuklab olish
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(img.id);
                      }}
                      className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400"
                      title="O'chirish"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-zinc-800 pt-3">
            <button
              type="button"
              onClick={onClearHistory}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-800 py-2 text-xs text-zinc-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Tarixni tozalash</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
