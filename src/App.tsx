/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Wand2, ArrowUp, RefreshCw, Layers } from 'lucide-react';
import { Header } from './components/Header';
import { PromptSection } from './components/PromptSection';
import { StyleSelector } from './components/StyleSelector';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ImagePreviewArea } from './components/ImagePreviewArea';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FullscreenModal } from './components/FullscreenModal';
import { ApiInfoModal } from './components/ApiInfoModal';
import { PresetGallery } from './components/PresetGallery';
import { AspectRatio, CreativityLevel, GeneratedImage, PresetPrompt, QualityLevel } from './types';

const STORAGE_KEY = 'tasvir_ai_history_v1';

export default function App() {
  // Main generation parameters state
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('photorealistic');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<QualityLevel>('standard');
  const [creativity, setCreativity] = useState<CreativityLevel>('balanced');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);

  // Output and generation state
  const [currentImages, setCurrentImages] = useState<GeneratedImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorInfo, setErrorInfo] = useState<{
    error: string;
    code?: string;
    actionUz?: string;
  } | null>(null);

  // History state
  const [history, setHistory] = useState<GeneratedImage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isApiInfoOpen, setIsApiInfoOpen] = useState<boolean>(false);
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImage | null>(null);

  const promptInputRef = useRef<HTMLDivElement>(null);

  // Sync history with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Handle Generate Image request
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      setErrorInfo(null);

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim(),
          style: selectedStyle,
          aspectRatio: selectedRatio,
          quality,
          creativity,
          numberOfImages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorInfo({
          error: data.error || "Rasm yaratishda xatolik yuz berdi.",
          code: data.code,
          actionUz: data.actionUz,
        });
        return;
      }

      if (data.images && data.images.length > 0) {
        const newImages: GeneratedImage[] = data.images.map((img: any) => ({
          ...img,
          style: selectedStyle,
          quality,
          creativity,
        }));

        setCurrentImages(newImages);
        setSelectedImageIndex(0);

        // Prepend to history
        setHistory((prev) => [...newImages, ...prev]);
      } else {
        setErrorInfo({
          error: "Model tasvir qaytarmadi. Iltimos, boshqa so'zlar bilan urinib ko'ring.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorInfo({
        error: "Server bilan aloqa uzildi. Iltimos, internetingizni tekshiring.",
        actionUz: "Bir ozdan so'ng qayta urinib ko'ring.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate with current prompt
  const handleRegenerate = () => {
    handleGenerate();
  };

  // Edit prompt: populate and scroll to input
  const handleEditPrompt = (promptText: string) => {
    setPrompt(promptText);
    promptInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    const textarea = document.getElementById('prompt-input');
    textarea?.focus();
  };

  // Reset to create another new image
  const handleResetNew = () => {
    setCurrentImages([]);
    setErrorInfo(null);
    setPrompt('');
    promptInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    const textarea = document.getElementById('prompt-input');
    textarea?.focus();
  };

  // Select Preset Prompt
  const handleSelectPreset = (preset: PresetPrompt) => {
    setPrompt(preset.prompt);
    setSelectedStyle(preset.style);
    setSelectedRatio(preset.aspectRatio);
    setErrorInfo(null);
    if (preset.sampleImageUrl) {
      const sampleImg: GeneratedImage = {
        id: `sample_${preset.id}`,
        url: preset.sampleImageUrl,
        prompt: preset.prompt,
        style: preset.style,
        aspectRatio: preset.aspectRatio,
        quality: 'standard',
        creativity: 'balanced',
        createdAt: new Date().toISOString(),
        modelUsed: 'gemini-3.1-flash-lite-image',
      };
      setCurrentImages([sampleImg]);
      setSelectedImageIndex(0);
    }
    promptInputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // History operations
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (confirm("Haqiqatan ham barcha yaratilgan rasmlar tarixini o'chirmoqchimisiz?")) {
      setHistory([]);
    }
  };

  const handleScrollToPresets = () => {
    document.getElementById('preset-gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* App Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenApiInfo={() => setIsApiInfoOpen(true)}
        onScrollToPresets={handleScrollToPresets}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero Banner / Introduction */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Eng yangi Google Gemini Image Generation texnologiyasi</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tasavvuringizni{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Haqiqiy San‘atga
            </span>{' '}
            Aylantiring
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            O'zbek tilida so'zlarni kiriting, AI yordamchisi bilan boyiting va yuqori aniqlikdagi fotorealistik yoki badiiy suratlarni yarating.
          </p>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* LEFT COLUMN: CONTROLS & PROMPTS (7 cols on lg) */}
          <div ref={promptInputRef} className="space-y-5 lg:col-span-7">
            {/* 1. Prompt Input & AI Assistant */}
            <PromptSection
              prompt={prompt}
              onChangePrompt={setPrompt}
              negativePrompt={negativePrompt}
              onChangeNegativePrompt={setNegativePrompt}
              creativity={creativity}
              onChangeCreativity={setCreativity}
              quality={quality}
              onChangeQuality={setQuality}
              numberOfImages={numberOfImages}
              onChangeNumberOfImages={setNumberOfImages}
              selectedStyle={selectedStyle}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />

            {/* 2. Style Selector */}
            <StyleSelector
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
            />

            {/* 3. Aspect Ratio Selector */}
            <AspectRatioSelector
              selectedRatio={selectedRatio}
              onSelectRatio={setSelectedRatio}
            />

            {/* 4. Primary Generate Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:shadow-indigo-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* Button shine animation */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Tasvir yaratilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-amber-300 transition-transform group-hover:rotate-12" />
                    <span>Rasm Yaratish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: PREVIEW AREA & ACTIONS (5 cols on lg) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <ImagePreviewArea
              currentImages={currentImages}
              selectedImageIndex={selectedImageIndex}
              onSelectImageIndex={setSelectedImageIndex}
              isGenerating={isGenerating}
              errorInfo={errorInfo}
              onRegenerate={handleRegenerate}
              onEditPrompt={handleEditPrompt}
              onResetNew={handleResetNew}
              onOpenFullscreen={(img) => setFullscreenImage(img)}
              onSelectPreset={handleSelectPreset}
              onOpenApiInfo={() => setIsApiInfoOpen(true)}
            />
          </div>
        </div>

        {/* Preset Gallery Section */}
        <PresetGallery onSelectPreset={handleSelectPreset} />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 font-semibold text-zinc-400">
              <span>TasvirAI © {new Date().getFullYear()}</span>
              <span>•</span>
              <span className="text-zinc-500">Barcha huquqlar himoyalangan</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500">
              <span>Google Gemini API</span>
              <span>•</span>
              <span>React 19 & Tailwind CSS</span>
              <span>•</span>
              <button
                onClick={() => setIsApiInfoOpen(true)}
                className="text-indigo-400 hover:underline"
              >
                API Sozlamalari
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectImage={(img) => {
          setCurrentImages([img]);
          setSelectedImageIndex(0);
          setErrorInfo(null);
        }}
        onDeleteImage={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Fullscreen Preview Modal */}
      <FullscreenModal
        image={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />

      {/* API & Billing Info Modal */}
      <ApiInfoModal
        isOpen={isApiInfoOpen}
        onClose={() => setIsApiInfoOpen(false)}
      />
    </div>
  );
}
