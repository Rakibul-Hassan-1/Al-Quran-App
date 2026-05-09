"use client";

import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import { useAppSettingsStore, useBookmarkStore } from "@/store";
import type { ArabicFont, Ayah } from "@/types";
import { Bookmark, Check, Copy, Loader2, Pause, Play } from "lucide-react";
import { useState } from "react";

interface Props {
  ayah: Ayah;
  arabicFont: ArabicFont;
  arabicFontSize: number;
  translationFontSize: number;
  surahName: string;
  surahEnglishName: string;
  cardId?: string;
  isActive?: boolean;
  isPopped?: boolean;
}

export default function AyahCard({
  ayah,
  arabicFont,
  arabicFontSize,
  translationFontSize,
  surahName,
  surahEnglishName,
  cardId,
  isActive = false,
  isPopped = false,
}: Props) {
  const { playAyah, isThisAyahPlaying, isThisAyahLoading } = useAudio();
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const [copied, setCopied] = useState(false);

  const ayahId = `${ayah.surahNumber}:${ayah.number}`;
  const playing = isThisAyahPlaying(ayahId);
  const loading = isThisAyahLoading(ayahId);
  const bookmarked = isBookmarked(ayahId);
  const showBangla = useAppSettingsStore((s) => s.showBanglaTranslation);
  const banglaPrimary = useAppSettingsStore((s) => s.banglaPrimary);

  const arabicFontFamily =
    arabicFont === "amiri"
      ? "Amiri, serif"
      : arabicFont === "scheherazade"
        ? "'Scheherazade New', serif"
        : "Amiri, serif";

  async function handleCopy() {
    const primaryIsBangla = banglaPrimary && ayah.banglaTranslation;
    const primaryText = primaryIsBangla
      ? ayah.banglaTranslation!
      : ayah.translation;
    const secondaryText = showBangla
      ? primaryIsBangla
        ? ayah.translation
        : ayah.banglaTranslation
      : undefined;

    let copyText = `${ayah.text}\n\n${primaryText}\n[Quran ${ayah.surahNumber}:${ayah.number}]`;
    if (secondaryText)
      copyText = `${ayah.text}\n\n${primaryText}\n\nOther: ${secondaryText}\n[Quran ${ayah.surahNumber}:${ayah.number}]`;

    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleBookmark() {
    toggleBookmark({
      id: ayahId,
      surahNumber: ayah.surahNumber,
      surahName,
      surahEnglishName,
      ayahNumber: ayah.number,
      text: ayah.text,
      translation: ayah.translation,
      banglaTranslation: ayah.banglaTranslation,
    });
  }

  return (
    <div
      id={cardId}
      className={cn(
        "group rounded-lg transition-all duration-300",
        isActive
          ? "bg-gradient-to-r from-[#2b3047] to-[#22283b] border border-[#3f476b] px-4 py-5 shadow-[0_0_0_1px_rgba(201,168,76,0.2)]"
          : "border-b border-[#2d3250] py-5 px-2 hover:bg-[#1a1d27]/50",
        isPopped && "ayah-pop-highlight",
      )}
    >
      {/* Verse number row */}
      <div className="flex items-center justify-between mb-4">
        {/* Verse badge */}
        <div
          className={cn(
            "verse-badge text-[11px]",
            isActive && "border-[#c9a84c] text-[#f2d98f]",
          )}
        >
          {ayah.number}
        </div>

        {/* Action buttons */}
        <div
          className={cn(
            "flex items-center gap-2 transition-opacity",
            isActive
              ? "opacity-100"
              : "opacity-100 md:opacity-0 md:group-hover:opacity-100",
          )}
        >
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
            onClick={handleBookmark}
            title={bookmarked ? "Remove bookmark" : "Add bookmark"}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border transition-colors",
              bookmarked
                ? "bg-[#c9a84c]/15 border-[#c9a84c]/60 text-[#f2d98f]"
                : "bg-[#1a1d27] border-[#2d3250] text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47]",
            )}
          >
            <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
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
        className={cn(
          "leading-loose text-right mb-4",
          isActive ? "text-[#fff2cc]" : "text-[#e8e8f0]",
        )}
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

      {/* Translation (primary/secondary based on settings) */}
      {(() => {
        const primaryIsBangla = banglaPrimary && ayah.banglaTranslation;
        const primaryText = primaryIsBangla
          ? ayah.banglaTranslation!
          : ayah.translation;
        const secondaryText = showBangla
          ? primaryIsBangla
            ? ayah.translation
            : ayah.banglaTranslation
          : undefined;

        return (
          <div>
            <p
              className={cn(
                "leading-relaxed",
                isActive ? "text-[#e3e7fa]" : "text-[#9da3c0]",
              )}
              style={{ fontSize: `${translationFontSize}px` }}
            >
              {primaryText}
            </p>
            {secondaryText ? (
              <p
                className={cn(
                  "leading-relaxed mt-2 text-sm",
                  isActive ? "text-[#e3e7fa]/90" : "text-[#9da3c0]/80",
                )}
                style={{
                  fontSize: `${Math.max(12, translationFontSize - 2)}px`,
                }}
              >
                {secondaryText}
              </p>
            ) : null}
          </div>
        );
      })()}
    </div>
  );
}
