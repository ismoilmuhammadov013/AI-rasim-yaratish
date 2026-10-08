import React, { useEffect } from 'react';
import { X, Download, Copy, Check, Maximize } from 'lucide-react';
import { GeneratedImage } from '../types';

interface FullscreenModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  image,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `tasvir_ai_fullscreen_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all"
    >
      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-indigo-500"
        >
          <Download className="h-4 w-4" />
          <span>Yuklab olish</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/80 text-zinc-300 backdrop-blur-md transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main image container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] max-w-[92vw] flex-col items-center justify-center overflow-hidden rounded-2xl"
      >
        <img
          src={image.url}
          alt={image.prompt}
          referrerPolicy="no-referrer"
          className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
        />

        {/* Bottom prompt caption bar */}
        <div className="mt-3 flex w-full max-w-2xl items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-300 backdrop-blur-md">
          <p className="line-clamp-2 pr-3 font-medium">"{image.prompt}"</p>
          <button
            type="button"
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Nusxalandi</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Nusxa olish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
