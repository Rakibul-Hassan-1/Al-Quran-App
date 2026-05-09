"use client";

import { cn } from "@/lib/utils";
import { useAppSettingsStore, useFontStore, useUIStore } from "@/store";
import type { ArabicFont } from "@/types";
import { RotateCcw, X } from "lucide-react";

const FONTS: {
  id: ArabicFont;
  label: string;
  sample: string;
  fontFamily: string;
}[] = [
  {
    id: "amiri",
    label: "Amiri",
    sample: "بِسْمِ اللَّهِ",
    fontFamily: "Amiri, serif",
  },
  {
    id: "scheherazade",
    label: "Scheherazade New",
    sample: "بِسْمِ اللَّهِ",
    fontFamily: "'Scheherazade New', serif",
  },
  {
    id: "kfgq",
    label: "KFGQPC",
    sample: "بِسْمِ اللَّهِ",
    fontFamily: "KFGQPC, Amiri, serif",
  },
];

export default function SettingsPanel() {
  const { setSettingsPanelOpen } = useUIStore();
  const {
    arabicFont,
    arabicFontSize,
    translationFontSize,
    setArabicFont,
    setArabicFontSize,
    setTranslationFontSize,
    reset,
  } = useFontStore();
  const { showBanglaTranslation, setShowBanglaTranslation } =
    useAppSettingsStore();

  return (
    <aside className="w-72 flex-shrink-0 bg-[#1a1d27] border-l border-[#2d3250] flex flex-col animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d3250]">
        <h2 className="text-[#e8e8f0] font-semibold text-sm">Font Settings</h2>
        <div className="flex gap-1">
          <button
            onClick={reset}
            title="Reset to defaults"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47]"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setSettingsPanelOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Arabic Font Selection */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5e6485] mb-3">
            Arabic Font
          </h3>
          <div className="space-y-2">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => setArabicFont(font.id)}
                className={cn(
                  "w-full rounded-xl p-3 border text-right transition-all",
                  arabicFont === font.id
                    ? "border-[#c9a84c] bg-[#c9a84c]/10"
                    : "border-[#2d3250] hover:border-[#5e6485] bg-[#0f1117]",
                )}
              >
                <div
                  className="text-xl text-[#e8e8f0] mb-1"
                  style={{ fontFamily: font.fontFamily }}
                  dir="rtl"
                >
                  {font.sample}
                </div>
                <div className="text-xs text-left text-[#5e6485]">
                  {font.label}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Bangla Translation Toggle */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5e6485]">
              Bangla Translation
            </h3>
            <div className="flex items-center gap-3">
              <label className="text-xs text-[#9da3c0]">Show</label>
              <input
                type="checkbox"
                checked={showBanglaTranslation}
                onChange={(e) => setShowBanglaTranslation(e.target.checked)}
                className="w-5 h-5 accent-[#c9a84c]"
              />
            </div>
          </div>
          <p className="text-xs text-[#5e6485]">
            Toggle display of Bangla translations in verse view and bookmarks.
          </p>
        </section>

        {/* Arabic Font Size */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5e6485]">
              Arabic Size
            </h3>
            <span className="text-xs text-[#9da3c0] bg-[#2d3250] px-2 py-0.5 rounded">
              {arabicFontSize}px
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={48}
            step={2}
            value={arabicFontSize}
            onChange={(e) => setArabicFontSize(Number(e.target.value))}
            className="w-full accent-[#c9a84c] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#5e6485] mt-1">
            <span>Small</span>
            <span>Large</span>
          </div>
          {/* Preview */}
          <p
            className="mt-3 text-right text-[#e8e8f0] bg-[#0f1117] rounded-lg p-3"
            style={{
              fontSize: `${arabicFontSize}px`,
              fontFamily:
                arabicFont === "amiri"
                  ? "Amiri, serif"
                  : arabicFont === "scheherazade"
                    ? "'Scheherazade New', serif"
                    : "Amiri, serif",
              lineHeight: 2,
            }}
            dir="rtl"
          >
            الْحَمْدُ لِلَّهِ
          </p>
        </section>

        {/* Translation Font Size */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5e6485]">
              Translation Size
            </h3>
            <span className="text-xs text-[#9da3c0] bg-[#2d3250] px-2 py-0.5 rounded">
              {translationFontSize}px
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={24}
            step={1}
            value={translationFontSize}
            onChange={(e) => setTranslationFontSize(Number(e.target.value))}
            className="w-full accent-[#c9a84c] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#5e6485] mt-1">
            <span>Small</span>
            <span>Large</span>
          </div>
          {/* Preview */}
          <p
            className="mt-3 text-[#9da3c0] bg-[#0f1117] rounded-lg p-3"
            style={{ fontSize: `${translationFontSize}px`, lineHeight: 1.6 }}
          >
            In the name of Allah, the Entirely Merciful, the Especially
            Merciful.
          </p>
        </section>
      </div>
    </aside>
  );
}
