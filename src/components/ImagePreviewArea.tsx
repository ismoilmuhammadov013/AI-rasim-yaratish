import React, { useState, useEffect } from 'react';
import {
  Download,
  Maximize2,
  RotateCw,
  Edit3,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  Eye,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { GeneratedImage } from '../types';
import { LOADING_MESSAGES_UZ, PRESET_PROMPTS } from '../data/constants';

interface ImagePreviewAreaProps {
  currentImages: GeneratedImage[];
  selectedImageIndex: number;
  onSelectImageIndex: (index: number) => void;
  isGenerating: boolean;
  errorInfo: { error: string; code?: string; actionUz?: string } | null;
  onRegenerate: () => void;
  onEditPrompt: (prompt: string) => void;
  onResetNew: () => void;
  onOpenFullscreen: (img: GeneratedImage) => void;
  onSelectPreset: (preset: (typeof PRESET_PROMPTS)[0]) => void;
  onOpenApiInfo: () => void;
}

export const ImagePreviewArea: React.FC<ImagePreviewAreaProps> = ({
  currentImages,
  selectedImageIndex,
  onSelectImageIndex,
  isGenerating,
  errorInfo,
  onRegenerate,
  onEditPrompt,
  onResetNew,
  onOpenFullscreen,
  onSelectPreset,
  onOpenApiInfo,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Rotate loading tips during generation
  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES_UZ.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const activeImage = currentImages[selectedImageIndex] || currentImages[0];

  // Direct download handler
  const handleDownload = (img: GeneratedImage) => {
    try {
      const link = document.createElement('a');
      link.href = img.url;
      const cleanPrompt = img.prompt
        .slice(0, 30)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      link.download = `tasvir_ai_${cleanPrompt || 'generated'}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download error:', e);
      window.open(img.url, '_blank');
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-4 shadow-xl sm:p-6 backdrop-blur-md">
      {/* Top status & header */}
      <div className="mb-4 flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Natija Ko‘rinishi
            </h3>
            <span className="text-[11px] text-zinc-400">
              {isGenerating
                ? 'Tasvir yaratilmoqda...'
                : activeImage
                ? 'Muvaffaqiyatli yaratildi'
                : 'Tayyor tasvir kutilyapti'}
            </span>
          </div>
        </div>

        {activeImage && !isGenerating && (
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tayyor
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* 1. LOADING STATE */}
        {isGenerating && (
          <div className="relative flex min-h-[380px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-indigo-500/30 bg-zinc-950/90 p-8 sm:min-h-[460px]">
            {/* Glowing background halo */}
            <div className="absolute -inset-24 -z-10 rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse-glow" />

            {/* Spinner */}
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-purple-500 animate-spin" />
              <Sparkles className="h-9 w-9 text-indigo-400 animate-pulse" />
            </div>

            {/* Dynamic Status Text */}
            <h4 className="text-center text-base font-bold text-white sm:text-lg">
              Sun'iy intellekt tasvir yaratmoqda
            </h4>
            <p className="mt-2 text-center text-xs text-indigo-300 transition-all duration-300 sm:text-sm">
              {LOADING_MESSAGES_UZ[loadingMsgIndex]}
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1 text-[11px] text-zinc-400">
              <Clock className="h-3 w-3 text-indigo-400" />
              <span>Odatda 4-10 soniya vaqt oladi</span>
            </div>
          </div>
        )}

        {/* 2. ERROR STATE */}
        {!isGenerating && errorInfo && (
          <div className="flex min-h-[360px] w-full flex-col items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center sm:min-h-[440px]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30">
              <AlertCircle className="h-7 w-7" />
            </div>

            <h4 className="text-base font-bold text-rose-200 sm:text-lg">
              {errorInfo.code === 'QUOTA_EXCEEDED'
                ? 'API Kvota Cheklovi (Paid Model)'
                : errorInfo.code === 'SAFETY_BLOCKED'
                ? 'Xavfsizlik Cheklovi'
                : 'Tasvir Yaratishda Xatolik'}
            </h4>

            <p className="mt-2 max-w-md text-xs text-zinc-300 sm:text-sm">
              {errorInfo.error}
            </p>

            {errorInfo.actionUz && (
              <p className="mt-2 max-w-md text-xs text-rose-300 font-medium">
                👉 {errorInfo.actionUz}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={onRegenerate}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-indigo-500"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Qayta urinish</span>
              </button>

              <button
                type="button"
                onClick={onOpenApiInfo}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-700"
              >
                <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>API & Kalit Ko‘rsatmasi</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectPreset(PRESET_PROMPTS[0])}
                className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-900/40"
                title="Tayyor namunaviy tasvirni yuklash"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Namunani ko‘rish</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. GENERATED IMAGE DISPLAY */}
        {!isGenerating && !errorInfo && activeImage && (
          <div className="space-y-4">
            {/* Main Picture Frame */}
            <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-center shadow-2xl">
              <img
                src={activeImage.url}
                alt={activeImage.prompt}
                referrerPolicy="no-referrer"
                className="max-h-[540px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              />

              {/* Floating Quick Action Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-end gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => onOpenFullscreen(activeImage)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900/80 text-white backdrop-blur-md transition-colors hover:bg-zinc-800"
                    title="To'liq ekranda ko'rish"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(activeImage)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white backdrop-blur-md transition-colors hover:bg-indigo-500"
                    title="Yuklab olish"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>

                <div className="pointer-events-auto">
                  <p className="line-clamp-2 text-xs text-zinc-200 font-medium drop-shadow">
                    "{activeImage.prompt}"
                  </p>
                </div>
              </div>
            </div>

            {/* Multiple Images Selector if count > 1 */}
            {currentImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {currentImages.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => onSelectImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      idx === selectedImageIndex
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Variant ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] font-bold text-white">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ACTION TOOLBAR REQUIRED IN USER PROMPT:
                - Download button
                - Regenerate button
                - Edit prompt button
                - Generate another image button
                - Full-screen preview */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Download */}
                <button
                  type="button"
                  onClick={() => handleDownload(activeImage)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:from-indigo-500 hover:to-purple-500"
                  title="Tasvirni to'liq sifatda yuklab olish"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Yuklab olish</span>
                </button>

                {/* Regenerate */}
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  title="Aynan shu prompt bilan qayta yaratish"
                >
                  <RotateCw className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Qayta yaratish</span>
                </button>

                {/* Edit prompt */}
                <button
                  type="button"
                  onClick={() => onEditPrompt(activeImage.prompt)}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  title="Ushbu promptni tahrirlash"
                >
                  <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                  <span>Promptni tahrirlash</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy prompt */}
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(activeImage.prompt)}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                  title="Promptdan nusxa olish"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Nusxa olish</span>
                    </>
                  )}
                </button>

                {/* Full-screen preview */}
                <button
                  type="button"
                  onClick={() => onOpenFullscreen(activeImage)}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  title="To'liq ekranda ko'rish"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-pink-400" />
                  <span>To‘liq ekran</span>
                </button>

                {/* Generate another image */}
                <button
                  type="button"
                  onClick={onResetNew}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  title="Yangi rasm yaratish"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Yangi rasm</span>
                </button>
              </div>
            </div>

            {/* Image Details Card */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Model: {activeImage.modelUsed || 'gemini-3.1-flash-lite-image'}</span>
                <span>Nisbat: {activeImage.aspectRatio}</span>
                <span>Vaqt: {new Date(activeImage.createdAt).toLocaleTimeString('uz-UZ')}</span>
              </div>
              <p className="text-zinc-300 font-medium line-clamp-3">
                "{activeImage.prompt}"
              </p>
            </div>
          </div>
        )}

        {/* 4. INITIAL EMPTY STATE WITH STARTER INSPIRATIONS */}
        {!isGenerating && !errorInfo && !activeImage && (
          <div className="flex min-h-[380px] w-full flex-col justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-center sm:min-h-[460px]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
              <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
            </div>

            <h4 className="text-base font-bold text-zinc-100 sm:text-lg">
              Tasvir Yaratishga Tayyormisiz?
            </h4>
            <p className="mx-auto mt-1 max-w-md text-xs text-zinc-400 sm:text-sm">
              Chap tomonda xohlagan g‘oyangizni yozing yoki quyidagi tayyor g‘oyalardan birini sinab ko‘ring:
            </p>

            {/* Quick Starter Cards */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-left">
              {PRESET_PROMPTS.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2.5 transition-all hover:border-indigo-500/50 hover:bg-zinc-900"
                >
                  <div>
                    {preset.sampleImageUrl && (
                      <div className="mb-2 h-24 w-full overflow-hidden rounded-lg bg-zinc-950">
                        <img
                          src={preset.sampleImageUrl}
                          alt={preset.titleUz}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                        {preset.sampleBadgeUz}
                      </span>
                      <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-indigo-400 transition-all" />
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-zinc-200 group-hover:text-white">
                      {preset.titleUz}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-zinc-400">
                      {preset.prompt}
                    </p>
                  </div>
                  <span className="mt-2 text-[10px] text-zinc-500">
                    Format: {preset.aspectRatio}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
