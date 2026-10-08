import React from 'react';
import { Sparkles, History, HelpCircle, Layers, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenApiInfo: () => void;
  onScrollToPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenApiInfo,
  onScrollToPresets,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-white" />
            <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 opacity-30 blur-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Tasvir<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                O‘zbekcha
              </span>
            </div>
            <p className="hidden text-xs text-zinc-400 sm:block">
              Google Gemini sun'iy intellekti asosidagi tasvir generatori
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onScrollToPresets}
            className="hidden items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white md:flex"
            title="Namuna promptlar to'plami"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>Namuna Promptlar</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            title="Yaratilgan rasmlar tarixi"
          >
            <History className="h-3.5 w-3.5 text-purple-400" />
            <span>Tarix</span>
            {historyCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-500/30 px-1 text-[10px] font-bold text-purple-300">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenApiInfo}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            title="API va model haqida ma'lumot"
          >
            <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">API & Qo‘llanma</span>
          </button>
        </div>
      </div>
    </header>
  );
};
