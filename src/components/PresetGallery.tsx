import React, { useState } from 'react';
import { Sparkles, Layers, ArrowRight, Wand2 } from 'lucide-react';
import { PRESET_PROMPTS } from '../data/constants';
import { PresetPrompt } from '../types';

interface PresetGalleryProps {
  onSelectPreset: (preset: PresetPrompt) => void;
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');

  const categories = [
    'Barchasi',
    'O‘zbekiston & Kelajak',
    'Avtomobillar & Tabiat',
    'Fantastika',
    'Portret & Madaniyat',
    'Kosmos & Fantastika',
  ];

  const filteredPresets =
    selectedCategory === 'Barchasi'
      ? PRESET_PROMPTS
      : PRESET_PROMPTS.filter((p) => p.categoryUz === selectedCategory);

  return (
    <section id="preset-gallery" className="mt-12 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-bold text-white sm:text-xl">
              Ilhomlanish uchun Tayyor Promptlar
            </h3>
          </div>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Istalgan namunani tanlang va bir zumda professional rasm yarating
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-zinc-800/70 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of presets */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-4 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-zinc-900 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div>
              {preset.sampleImageUrl && (
                <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
                  <img
                    src={preset.sampleImageUrl}
                    alt={preset.titleUz}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                  {preset.sampleBadgeUz}
                </span>
                <span className="text-[10px] font-medium text-zinc-500">
                  {preset.aspectRatio}
                </span>
              </div>

              <h4 className="mt-2.5 text-sm font-bold text-zinc-200 group-hover:text-white">
                {preset.titleUz}
              </h4>

              <p className="mt-1 line-clamp-2 text-xs text-zinc-400 leading-relaxed">
                "{preset.prompt}"
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3">
              <span className="text-[11px] font-medium text-purple-400">
                Uslub: {preset.style}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Sinab ko‘rish</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
