"use client";

import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import type { Surah } from "@/types";
import { Loader2, Pause, Play } from "lucide-react";
import ToggleBN from "./ToggleBN";

interface Props {
  surah: Surah;
}

export default function SurahHeader({ surah }: Props) {
  const { playSurah, isThisSurahPlaying, isThisSurahLoading } = useAudio();
  const isSurahPlaying = isThisSurahPlaying(surah.number);
  const isSurahLoading = isThisSurahLoading(surah.number);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#21253a] to-[#1a1d27] border border-[#2d3250] p-6 mb-6 text-center relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-2 right-4 text-[120px] text-[#c9a84c] font-arabic leading-none select-none"
          style={{ fontFamily: "Amiri, serif" }}
          dir="rtl"
        >
          {surah.name}
        </div>
      </div>

      <div className="relative z-10">
        {/* Arabic name */}
        <h1
          className="text-4xl text-[#c9a84c] mb-2"
          style={{ fontFamily: "Amiri, serif" }}
          dir="rtl"
        >
          {surah.name}
        </h1>

        {/* English name */}
        <h2 className="text-xl font-semibold text-slate-100 mb-1">
          {surah.englishName}
        </h2>
        <p className="text-slate-300 text-sm mb-4">
          {surah.englishNameTranslation}
        </p>

        <div className="flex items-center justify-center gap-2 mb-5">
          <button
            onClick={() => playSurah(surah.number, surah.ayahs)}
            className={cn(
              "mx-auto mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
              isSurahPlaying
                ? "bg-[#c9a84c] border-[#c9a84c] text-[#0f1117]"
                : "bg-[#1a1d27] border-[#2d3250] text-[#e8e8f0] hover:bg-[#2a2f47]",
            )}
            title={isSurahPlaying ? "Pause whole surah" : "Play whole surah"}
          >
            {isSurahLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isSurahPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
            <span className="text-sm font-medium">
              {isSurahPlaying ? "Pause Surah" : "Play Full Surah"}
            </span>
          </button>

          <ToggleBN />
        </div>

        {/* Meta badges */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs border border-white/10">
            Surah {surah.number}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs border border-white/10">
            {surah.numberOfAyahs} Verses
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs",
              surah.revelationType === "Meccan"
                ? "bg-[#4caf82]/10 text-[#4caf82]"
                : "bg-[#5b8dee]/10 text-[#5b8dee]",
            )}
          >
            {surah.revelationType}
          </span>
        </div>
      </div>
    </div>
  );
}
