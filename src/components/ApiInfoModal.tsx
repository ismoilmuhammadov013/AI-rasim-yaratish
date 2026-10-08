import React from 'react';
import { X, Key, ShieldCheck, Cpu, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';

interface ApiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiInfoModal: React.FC<ApiInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Google Gemini API & Model Ma'lumotlari
              </h3>
              <p className="text-[11px] text-zinc-400">
                Arxitektura va xavfsiz kalit boshqaruvi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3.5 text-xs text-zinc-300">
          {/* Models used */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
            <h4 className="flex items-center gap-1.5 font-semibold text-zinc-100">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>Ishlatilayotgan AI Modellari</span>
            </h4>
            <ul className="mt-2 space-y-1.5 text-zinc-400">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                <span>
                  <strong className="text-zinc-200">gemini-3.1-flash-lite-image</strong>: Rasmlarni yuqori tezlikda generatsiya qilish uchun asosiy Google modeli.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                <span>
                  <strong className="text-zinc-200">gemini-nano-banana-2.1</strong>: Ultra 2K sifatli tasvirlar uchun ilg'or model.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-zinc-200">gemini-3.8-flash</strong>: Foydalanuvchi qisqa promptlarini fotorealistik boyitish (Prompt Assistant) uchun.
                </span>
              </li>
            </ul>
          </div>

          {/* Secure API Key Management */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
            <h4 className="flex items-center gap-1.5 font-semibold text-zinc-100">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Xavfsizlik: Maxfiy Kalitlar Frontendga Chiqmaydi</span>
            </h4>
            <p className="mt-1.5 text-zinc-400 leading-relaxed">
              Ilovada barcha AI so'rovlari to'liq server-side (<code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">server.ts</code>) orqali yuboriladi. Brauzerda hech qanday API kalit saqlanmaydi va oshkor etilmaydi.
            </p>
          </div>

          {/* Billing / Paid Tier Notice */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
            <h4 className="flex items-center gap-1.5 font-semibold text-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Google Image Modeli va To‘lov (Billing)</span>
            </h4>
            <p className="mt-1.5 text-amber-300/90 leading-relaxed">
              Google AI Studio qoidalariga ko‘ra, tasvir yaratuvchi modellar (<code className="rounded bg-amber-900/50 px-1 text-amber-200">gemini-3.1-flash-lite-image</code>) bepul tarifda 0 kvotaga ega. Tasvir yaratish uchun AI Studio hisobingizda <strong>Billing (Pay-as-you-go)</strong> ulangan API kaliti kerak.
            </p>
            <div className="mt-2 text-zinc-400">
              Kalitni o'rnatish joyi: <strong>AI Studio chap paneli &gt; Settings &gt; Secrets &gt; GEMINI_API_KEY</strong>.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-zinc-800 pt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
};
