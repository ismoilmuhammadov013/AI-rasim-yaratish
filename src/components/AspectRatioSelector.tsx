import React from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../data/constants';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  selectedRatio,
  onSelectRatio,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-md">
      <div className="mb-3.5">
        <h3 className="text-sm font-semibold text-zinc-100">
          Tomonlar nisbati (Format)
        </h3>
        <p className="text-xs text-zinc-400">
          Rasmingiz qanday o‘lchamda yaratilishini belgilang
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {ASPECT_RATIOS.map((item) => {
          const isSelected = selectedRatio === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectRatio(item.id)}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'border-zinc-800/80 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80 hover:text-zinc-200'
              }`}
            >
              {/* Visual shape box preview */}
              <div className="mb-2 flex h-8 w-8 items-center justify-center">
                <div
                  className={`rounded-sm border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500/30'
                      : 'border-zinc-600 bg-zinc-800/40'
                  }`}
                  style={{
                    width: `${item.iconWidth}px`,
                    height: `${item.iconHeight}px`,
                  }}
                />
              </div>

              <span className="text-xs font-bold text-zinc-100">
                {item.label}
              </span>
              <span className="mt-0.5 text-[10px] text-zinc-400">
                {item.subLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
