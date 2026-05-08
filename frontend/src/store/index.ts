"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ArabicFont, FontSettings } from "@/types";

// ── Font Settings Store ────────────────────────────────────────
interface FontStore extends FontSettings {
  setArabicFont: (font: ArabicFont) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  reset: () => void;
}

const DEFAULT_FONT_SETTINGS: FontSettings = {
  arabicFont: "amiri",
  arabicFontSize: 28,
  translationFontSize: 16,
};

export const useFontStore = create<FontStore>()(
  persist(
    (set) => ({
      ...DEFAULT_FONT_SETTINGS,
      setArabicFont: (font) => set({ arabicFont: font }),
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setTranslationFontSize: (size) => set({ translationFontSize: size }),
      reset: () => set(DEFAULT_FONT_SETTINGS),
    }),
    { name: "quran-font-settings" }
  )
);

// ── Audio Store ────────────────────────────────────────────────
interface AudioStore {
  currentAyahId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  audio: HTMLAudioElement | null;
  setCurrentAyah: (id: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setAudio: (audio: HTMLAudioElement | null) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentAyahId: null,
  isPlaying: false,
  isLoading: false,
  audio: null,
  setCurrentAyah: (id) => set({ currentAyahId: id }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setAudio: (audio) => set({ audio }),
}));

// ── UI Store ───────────────────────────────────────────────────
interface UIStore {
  isSurahSidebarOpen: boolean;
  isSettingsPanelOpen: boolean;
  isSearchOpen: boolean;
  toggleSurahSidebar: () => void;
  setSurahSidebarOpen: (open: boolean) => void;
  toggleSettingsPanel: () => void;
  setSettingsPanelOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSurahSidebarOpen: true,
  isSettingsPanelOpen: false,
  isSearchOpen: false,
  toggleSurahSidebar: () => set((s) => ({ isSurahSidebarOpen: !s.isSurahSidebarOpen })),
  setSurahSidebarOpen: (open) => set({ isSurahSidebarOpen: open }),
  toggleSettingsPanel: () =>
    set((s) => ({
      isSettingsPanelOpen: !s.isSettingsPanelOpen,
      isSearchOpen: false,
    })),
  setSettingsPanelOpen: (open) => set({ isSettingsPanelOpen: open }),
  toggleSearch: () =>
    set((s) => ({
      isSearchOpen: !s.isSearchOpen,
      isSettingsPanelOpen: false,
    })),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
