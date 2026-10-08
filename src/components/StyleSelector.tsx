import React from 'react';
import {
  Camera,
  Film,
  Sparkles,
  Boxes,
  Palette,
  PenTool,
  Wand2,
  Zap,
  Square,
  Brush,
  Check,
} from 'lucide-react';
import { STYLE_OPTIONS } from '../data/constants';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  // Icon mapper helper
  const renderIcon = (iconName: string, isSelected: boolean) => {
    const props = {
      className: `h-5 w-5 ${isSelected ? 'text-indigo-400' : 'text-zinc-400'}`,
    };
    switch (iconName) {
      case 'Camera':
        return <Camera {...props} />;
      case 'Film':
        return <Film {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Boxes':
        return <Boxes {...props} />;
      case 'Palette':
        return <Palette {...props} />;
      case 'PenTool':
        return <PenTool {...props} />;
      case 'Wand2':
        return <Wand2 {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Square':
        return <Square {...props} />;
      case 'Brush':
        return <Brush {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-md">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Tasvir uslubi (Stil)
          </h3>
          <p className="text-xs text-zinc-400">
            Rasmingiz qaysi badiiy ko‘rinishda bo‘lishini tanlang
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-gradient-to-b from-indigo-500/15 to-purple-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/80'
              }`}
            >
              {/* Header inside card */}
              <div className="flex w-full items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isSelected ? 'bg-indigo-500/20' : 'bg-zinc-900'
                  }`}
                >
                  {renderIcon(style.iconName, isSelected)}
                </div>
                {isSelected ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white shadow-sm">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                ) : (
                  <span className="rounded bg-zinc-800/60 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                    {style.tag}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-2.5">
                <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                  {style.nameUz}
                </div>
                <div className="mt-0.5 line-clamp-2 text-[10px] text-zinc-400">
                  {style.descUz}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
