"use client";

import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import type { ArabicFont, Ayah } from "@/types";
import { Check, Copy, Loader2, Pause, Play } from "lucide-react";
import { useState } from "react";

interface Props {
  ayah: Ayah;
  arabicFont: ArabicFont;
  arabicFontSize: number;
  translationFontSize: number;
}

export default function AyahCard({
  ayah,
  arabicFont,
  arabicFontSize,
  translationFontSize,
}: Props) {
  const { playAyah, isThisAyahPlaying, isThisAyahLoading } = useAudio();
  const [copied, setCopied] = useState(false);

  const ayahId = `${ayah.surahNumber}:${ayah.number}`;
  const playing = isThisAyahPlaying(ayahId);
  const loading = isThisAyahLoading(ayahId);

  const arabicFontFamily =
    arabicFont === "amiri"
      ? "Amiri, serif"
      : arabicFont === "scheherazade"
        ? "'Scheherazade New', serif"
        : "Amiri, serif";

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `${ayah.text}\n\n${ayah.translation}\n[Quran ${ayah.surahNumber}:${ayah.number}]`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "group border-b border-[#2d3250] py-5 px-2 hover:bg-[#1a1d27]/50 rounded-lg transition-colors",
        playing && "bg-[#1a1d27]/80 border-l-2 border-l-[#c9a84c] pl-3",
      )}
    >
      {/* Verse number row */}
      <div className="flex items-center justify-between mb-4">
        {/* Verse badge */}
        <div className="verse-badge text-[11px]">{ayah.number}</div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            title="Copy verse"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1a1d27] border border-[#2d3250] text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47] transition-colors"
          >
            {copied ? (
              <Check size={14} className="text-[#4caf82]" />
            ) : (
              <Copy size={14} />
            )}
          </button>

          <button
            onClick={() => playAyah(ayahId, ayah.audioUrl)}
            title={playing ? "Pause" : "Play recitation"}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border transition-colors",
              playing
                ? "bg-[#c9a84c] border-[#c9a84c] text-[#0f1117]"
                : "bg-[#1a1d27] border-[#2d3250] text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47]",
            )}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : playing ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <p
        className="text-[#e8e8f0] leading-loose text-right mb-4"
        dir="rtl"
        lang="ar"
        style={{
          fontSize: `${arabicFontSize}px`,
          fontFamily: arabicFontFamily,
          lineHeight: "2.4",
        }}
      >
        {ayah.text}
      </p>

      {/* Translation */}
      <p
        className="text-[#9da3c0] leading-relaxed"
        style={{ fontSize: `${translationFontSize}px` }}
      >
        {ayah.translation}
      </p>
    </div>
  );
}
