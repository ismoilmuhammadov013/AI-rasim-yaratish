import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Dices,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { CreativityLevel, QualityLevel } from '../types';
import { PRESET_PROMPTS } from '../data/constants';

interface PromptSectionProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  negativePrompt: string;
  onChangeNegativePrompt: (val: string) => void;
  creativity: CreativityLevel;
  onChangeCreativity: (val: CreativityLevel) => void;
  quality: QualityLevel;
  onChangeQuality: (val: QualityLevel) => void;
  numberOfImages: number;
  onChangeNumberOfImages: (val: number) => void;
  selectedStyle: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  onChangePrompt,
  negativePrompt,
  onChangeNegativePrompt,
  creativity,
  onChangeCreativity,
  quality,
  onChangeQuality,
  numberOfImages,
  onChangeNumberOfImages,
  selectedStyle,
  isGenerating,
  onGenerate,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedData, setEnhancedData] = useState<{
    original: string;
    enhanced: string;
    explanation: string;
  } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);

  // Quick chips for negative prompt
  const negativeChips = [
    'xira tasvir',
    'deformatsiya',
    'ortiqcha qo‘l/barmoqlar',
    'past sifat',
    'suv belgisi (watermark)',
    'yomon anatomiya',
    'kesilgan kadr',
  ];

  // AI Prompt Enhancement Feature
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;

    try {
      setIsEnhancing(true);
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
        }),
      });

      const data = await res.json();
      if (res.ok && data.enhancedPrompt) {
        setEnhancedData({
          original: prompt.trim(),
          enhanced: data.enhancedPrompt,
          explanation: data.explanationUz || 'Prompt mukammal detallar bilan boyitildi.',
        });
        onChangePrompt(data.enhancedPrompt);
      } else {
        alert(data.error || 'Promptni boyitishda xatolik yuz berdi');
      }
    } catch (err: any) {
      console.error(err);
      alert('Promptni boyitishda tarmoq xatosi.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Restore original prompt
  const handleRestoreOriginal = () => {
    if (enhancedData?.original) {
      onChangePrompt(enhancedData.original);
      setEnhancedData(null);
    }
  };

  // Pick a random creative idea from presets
  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * PRESET_PROMPTS.length);
    const chosen = PRESET_PROMPTS[randomIndex];
    onChangePrompt(chosen.prompt);
    setEnhancedData(null);
  };

  const handleAddNegativeChip = (chip: string) => {
    if (!negativePrompt.includes(chip)) {
      const updated = negativePrompt.trim()
        ? `${negativePrompt.trim()}, ${chip}`
        : chip;
      onChangeNegativePrompt(updated);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-4 shadow-xl sm:p-6 backdrop-blur-md">
      {/* Title & Tools bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="prompt-input" className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Wand2 className="h-4 w-4 text-indigo-400" />
          <span>Tasvir tavsifi (Prompt)</span>
          <span className="text-xs font-normal text-zinc-500">
            — Qanday rasm ko‘rmoqchisiz?
          </span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRandomPrompt}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
            title="Tasodifiy g'oya tanlash"
          >
            <Dices className="h-3.5 w-3.5 text-amber-400" />
            <span>Tasodifiy g‘oya</span>
          </button>

          {prompt && (
            <button
              type="button"
              onClick={() => {
                onChangePrompt('');
                setEnhancedData(null);
              }}
              className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
              title="Tozalash"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder="Rasm g'oyangizni batafsil yozing... (Masalan: Tog' cho'qqisida turgan qizil superkar, oltin quyosh botishi, kinematik yorug'lik)"
          rows={3}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 text-sm text-zinc-100 placeholder-zinc-500 shadow-inner transition-all focus:border-indigo-500/80 focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-base resize-none"
        />

        {/* Character count */}
        <div className="absolute bottom-2.5 right-3 text-[11px] text-zinc-500">
          {prompt.length} belgi
        </div>
      </div>

      {/* Action Row Under Textarea */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
        {/* AI Prompt Assistant Button */}
        <button
          type="button"
          onClick={handleEnhancePrompt}
          disabled={!prompt.trim() || isEnhancing || isGenerating}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-pink-950/60 px-3.5 py-2 text-xs font-semibold text-purple-200 shadow-sm transition-all hover:border-purple-500/60 hover:from-indigo-900/60 hover:to-purple-900/60 disabled:cursor-not-allowed disabled:opacity-50"
          title="Qisqa promptni fotorealistik va professional detallar bilan boyitish"
        >
          <Sparkles className={`h-4 w-4 text-purple-300 transition-transform group-hover:scale-110 ${isEnhancing ? 'animate-spin' : ''}`} />
          <span>
            {isEnhancing ? 'AI promptni boyitmoqda...' : 'AI Yordamchisi: Promptni boyitish'}
          </span>
          <span className="hidden rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-300 sm:inline">
            Tavsiya
          </span>
        </button>

        {/* Advanced Controls Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
          <span>Qo‘shimcha sozlamalar</span>
          {showAdvanced ? (
            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          )}
        </button>
      </div>

      {/* AI Enhanced Notification Banner */}
      {enhancedData && (
        <div className="mt-3.5 rounded-xl border border-purple-500/30 bg-purple-950/30 p-3 text-xs text-purple-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
              <div>
                <p className="font-semibold text-purple-100">
                  Prompt sun'iy intellekt tomonidan boyitildi!
                </p>
                <p className="mt-0.5 text-purple-300/80">
                  {enhancedData.explanation}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRestoreOriginal}
              className="flex-shrink-0 text-[11px] underline text-purple-400 hover:text-purple-300"
            >
              Asliga qaytarish
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="mt-4 space-y-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition-all">
          {/* Negative Prompt */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="negative-prompt"
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                <span>Inkor prompt (Chiqarib tashlanadigan detallar)</span>
              </label>
              <span className="text-[11px] text-zinc-500">Ixtiyoriy</span>
            </div>
            <input
              id="negative-prompt"
              type="text"
              value={negativePrompt}
              onChange={(e) => onChangeNegativePrompt(e.target.value)}
              placeholder="Masalan: xira, deformatsiya, past sifat, ortiqcha barmoqlar, suv belgisi"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-rose-500/60 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
            />

            {/* Quick Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {negativeChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleAddNegativeChip(chip)}
                  className="rounded-md border border-zinc-800/80 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Creativity & Detail Level */}
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                Detallashuv darajasi
              </label>
              <select
                value={creativity}
                onChange={(e) => onChangeCreativity(e.target.value as CreativityLevel)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="balanced">Muvozanatli (Tavsiya)</option>
                <option value="ultra_detail">Yuqori detallashuv (Mikro-faktura)</option>
                <option value="hyper_realistic">Giper-realistik (NatGeo darajasi)</option>
              </select>
            </div>

            {/* Quality Level */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                Sifat darajasi
              </label>
              <select
                value={quality}
                onChange={(e) => onChangeQuality(e.target.value as QualityLevel)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="standard">Standart HD (Tezkor)</option>
                <option value="high">Yuqori sifat (Tiniq)</option>
                <option value="ultra">Ultra 2K (Maksimal)</option>
              </select>
            </div>

            {/* Number of Images */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                Rasmlar soni
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChangeNumberOfImages(num)}
                    className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                      numberOfImages === num
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {num} ta
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
