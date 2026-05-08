"use client";

import { useFontStore } from "@/store";
import type { Surah } from "@/types";
import { cn } from "@/lib/utils";
import AyahCard from "./AyahCard";
import SurahHeader from "./SurahHeader";

interface Props {
  surah: Surah;
}

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
// Surah 1 (Al-Fatiha) and Surah 9 (At-Tawbah) do not have bismillah header
const NO_BISMILLAH = [1, 9];

export default function SurahReader({ surah }: Props) {
  const { arabicFont, arabicFontSize, translationFontSize } = useFontStore();

  return (
    <div className="animate-fade-in">
      <SurahHeader surah={surah} />

      {/* Bismillah */}
      {!NO_BISMILLAH.includes(surah.number) && (
        <div className="text-center my-6">
          <p
            className={cn("arabic-font-" + arabicFont, "text-[#c9a84c]")}
            style={{ fontSize: `${arabicFontSize + 4}px`, fontFamily: arabicFont === "amiri" ? "Amiri, serif" : arabicFont === "scheherazade" ? "'Scheherazade New', serif" : "Amiri, serif" }}
            dir="rtl"
          >
            {BISMILLAH}
          </p>
        </div>
      )}

      {/* Ayah list */}
      <div className="space-y-0">
        {surah.ayahs.map((ayah) => (
          <AyahCard
            key={`${surah.number}:${ayah.number}`}
            ayah={ayah}
            arabicFont={arabicFont}
            arabicFontSize={arabicFontSize}
            translationFontSize={translationFontSize}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t border-[#2d3250]">
        {surah.number > 1 && (
          <a
            href={`/surah/${surah.number - 1}`}
            className="flex items-center gap-2 text-sm text-[#9da3c0] hover:text-[#c9a84c] transition-colors"
          >
            ← Previous Surah
          </a>
        )}
        <div className="flex-1" />
        {surah.number < 114 && (
          <a
            href={`/surah/${surah.number + 1}`}
            className="flex items-center gap-2 text-sm text-[#9da3c0] hover:text-[#c9a84c] transition-colors"
          >
            Next Surah →
          </a>
        )}
      </div>
    </div>
  );
}
