"use client";

import { useAudio } from "@/hooks/useAudio";
import { getSurah } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useFontStore } from "@/store";
import type { Surah } from "@/types";
import { useEffect, useState } from "react";
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
  const { currentAyahId, isPlaying, isLoading } = useAudio();
  const [poppedAyahId, setPoppedAyahId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAyahId || (!isPlaying && !isLoading)) return;

    const targetId = `ayah-card-${currentAyahId.replace(":", "-")}`;
    const ayahElement = document.getElementById(targetId);
    if (!ayahElement) return;

    ayahElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [currentAyahId, isPlaying, isLoading]);

  // Client-side refresh: re-fetch the surah at runtime so newly-attached
  // fields (e.g. banglaTranslation) from the API are available without
  // rebuilding SSG pages.
  const [surahData, setSurahData] = useState<Surah>(surah);
  useEffect(() => {
    let mounted = true;
    async function refresh() {
      try {
        const fresh = await getSurah(surah.number);
        if (mounted) setSurahData(fresh);
      } catch (e) {
        // silently ignore — keep server-rendered data
        // console.warn("Failed to refresh surah data:", e);
      }
    }

    refresh();
    return () => {
      mounted = false;
    };
  }, [surah.number]);

  useEffect(() => {
    let popupTimer: ReturnType<typeof setTimeout> | null = null;

    function popAyahByElementId(elementId: string) {
      const ayahElement = document.getElementById(elementId);
      if (!ayahElement) return;

      ayahElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      const parts = elementId.replace("ayah-card-", "").split("-");
      const surahNumber = Number(parts[0]);
      const ayahNumber = Number(parts[1]);
      if (Number.isNaN(surahNumber) || Number.isNaN(ayahNumber)) return;
      if (surahNumber !== surah.number) return;

      const nextId = `${surahNumber}:${ayahNumber}`;
      setPoppedAyahId(nextId);
      if (popupTimer) clearTimeout(popupTimer);
      popupTimer = setTimeout(() => {
        setPoppedAyahId((current) => (current === nextId ? null : current));
      }, 1400);
    }

    function handleHashFocus() {
      if (!window.location.hash.startsWith("#ayah-card-")) return;
      const elementId = decodeURIComponent(window.location.hash.slice(1));
      popAyahByElementId(elementId);
    }

    function handleBookmarkJump(event: Event) {
      const customEvent = event as CustomEvent<{ targetId?: string }>;
      if (!customEvent.detail?.targetId) return;
      popAyahByElementId(customEvent.detail.targetId);
    }

    handleHashFocus();
    window.addEventListener("hashchange", handleHashFocus);
    window.addEventListener(
      "bookmark-jump",
      handleBookmarkJump as EventListener,
    );

    return () => {
      window.removeEventListener("hashchange", handleHashFocus);
      window.removeEventListener(
        "bookmark-jump",
        handleBookmarkJump as EventListener,
      );
      if (popupTimer) clearTimeout(popupTimer);
    };
  }, [surah.number]);

  return (
    <div className="animate-fade-in">
      <SurahHeader surah={surah} />

      {/* Bismillah */}
      {!NO_BISMILLAH.includes(surah.number) && (
        <div className="text-center my-6">
          <p
            className={cn("arabic-font-" + arabicFont, "text-[#c9a84c]")}
            style={{
              fontSize: `${arabicFontSize + 4}px`,
              fontFamily:
                arabicFont === "amiri"
                  ? "Amiri, serif"
                  : arabicFont === "scheherazade"
                    ? "'Scheherazade New', serif"
                    : "Amiri, serif",
            }}
            dir="rtl"
          >
            {BISMILLAH}
          </p>
        </div>
      )}

      {/* Ayah list */}
      <div className="space-y-0">
        {(surahData.ayahs || surah.ayahs).map((ayah) => {
          const ayahId = `${surah.number}:${ayah.number}`;
          return (
            <AyahCard
              key={ayahId}
              cardId={`ayah-card-${ayahId.replace(":", "-")}`}
              isActive={currentAyahId === ayahId && (isPlaying || isLoading)}
              isPopped={poppedAyahId === ayahId}
              ayah={ayah}
              arabicFont={arabicFont}
              arabicFontSize={arabicFontSize}
              translationFontSize={translationFontSize}
              surahName={surah.name}
              surahEnglishName={surah.englishName}
            />
          );
        })}
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
