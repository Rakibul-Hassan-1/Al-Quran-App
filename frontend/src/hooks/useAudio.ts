"use client";

import { useAudioStore } from "@/store";
import type { Ayah } from "@/types";
import { useCallback } from "react";

// Global singleton — একটাই audio instance সবসময়
let globalAudio: HTMLAudioElement | null = null;
let globalPlaylist: Array<{ ayahId: string; audioUrl: string }> = [];
let globalPlaylistIndex = -1;

function killGlobalAudio() {
  if (globalAudio) {
    globalAudio.oncanplay = null;
    globalAudio.onended = null;
    globalAudio.onerror = null;
    globalAudio.onpause = null;
    globalAudio.onplay = null;
    globalAudio.pause();
    globalAudio.src = "";
    globalAudio.load(); // force browser to release
    globalAudio = null;
  }
}

function clearPlaylist() {
  globalPlaylist = [];
  globalPlaylistIndex = -1;
}

export function useAudio() {
  const {
    currentAyahId,
    currentSurahNumber,
    playbackMode,
    isPlaying,
    isLoading,
    setCurrentAyah,
    setCurrentSurahNumber,
    setPlaybackMode,
    setIsPlaying,
    setIsLoading,
    setAudio,
  } = useAudioStore();

  const stopAudio = useCallback(() => {
    killGlobalAudio();
    clearPlaylist();
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentAyah(null);
    setCurrentSurahNumber(null);
    setPlaybackMode(null);
    setAudio(null);
  }, [
    setIsPlaying,
    setIsLoading,
    setCurrentAyah,
    setCurrentSurahNumber,
    setPlaybackMode,
    setAudio,
  ]);

  const playPlaylistTrack = useCallback(
    async (index: number, surahNumber: number) => {
      const track = globalPlaylist[index];
      if (!track) {
        stopAudio();
        return;
      }

      killGlobalAudio();
      globalPlaylistIndex = index;

      setCurrentAyah(track.ayahId);
      setCurrentSurahNumber(surahNumber);
      setPlaybackMode("surah");
      setIsLoading(true);
      setIsPlaying(false);

      const audio = new Audio();
      audio.preload = "auto";
      globalAudio = audio;

      audio.oncanplay = async () => {
        if (globalAudio !== audio) return;
        setIsLoading(false);
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      };

      audio.onended = () => {
        if (globalAudio !== audio) return;

        const nextIndex = globalPlaylistIndex + 1;
        if (nextIndex < globalPlaylist.length) {
          void playPlaylistTrack(nextIndex, surahNumber);
          return;
        }

        stopAudio();
      };

      audio.onerror = () => {
        if (globalAudio !== audio) return;
        setIsLoading(false);
        setIsPlaying(false);

        // Skip failed ayah and continue the playlist.
        const nextIndex = globalPlaylistIndex + 1;
        if (nextIndex < globalPlaylist.length) {
          void playPlaylistTrack(nextIndex, surahNumber);
          return;
        }

        stopAudio();
        console.error("Audio failed:", track.audioUrl);
      };

      audio.src = track.audioUrl;
      audio.load();
      setAudio(audio);
    },
    [
      setAudio,
      setCurrentAyah,
      setCurrentSurahNumber,
      setIsLoading,
      setIsPlaying,
      setPlaybackMode,
      stopAudio,
    ],
  );

  const playAyah = useCallback(
    async (ayahId: string, audioUrl: string) => {
      // Same ayah — toggle play/pause
      if (currentAyahId === ayahId && globalAudio) {
        if (isPlaying) {
          globalAudio.pause();
          setIsPlaying(false);
        } else {
          try {
            await globalAudio.play();
            setIsPlaying(true);
          } catch {
            setIsPlaying(false);
          }
        }
        return;
      }

      // নতুন ayah — আগেরটা পুরোপুরি বন্ধ করো
      killGlobalAudio();
      clearPlaylist();
      setIsPlaying(false);
      setIsLoading(false);

      const surahNumberPart = Number(ayahId.split(":")[0]);
      setCurrentAyah(ayahId);
      setCurrentSurahNumber(
        Number.isNaN(surahNumberPart) ? null : surahNumberPart,
      );
      setPlaybackMode("ayah");
      setIsLoading(true);

      const audio = new Audio();
      audio.preload = "auto";
      globalAudio = audio; // set globally immediately

      audio.oncanplay = async () => {
        if (globalAudio !== audio) return; // stale — discard
        setIsLoading(false);
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      };

      audio.onended = () => {
        if (globalAudio !== audio) return;
        stopAudio();
      };

      audio.onerror = () => {
        if (globalAudio !== audio) return;
        stopAudio();
        console.error("Audio failed:", audioUrl);
      };

      audio.src = audioUrl;
      audio.load();
      setAudio(audio);
    },
    [
      currentAyahId,
      isPlaying,
      setCurrentAyah,
      setCurrentSurahNumber,
      setIsLoading,
      setIsPlaying,
      setPlaybackMode,
      setAudio,
      stopAudio,
    ],
  );

  const playSurah = useCallback(
    async (surahNumber: number, ayahs: Ayah[]) => {
      if (!ayahs.length) return;

      // Same surah — toggle play/pause
      if (
        playbackMode === "surah" &&
        currentSurahNumber === surahNumber &&
        globalAudio
      ) {
        if (isPlaying) {
          globalAudio.pause();
          setIsPlaying(false);
        } else {
          try {
            await globalAudio.play();
            setIsPlaying(true);
          } catch {
            setIsPlaying(false);
          }
        }
        return;
      }

      globalPlaylist = ayahs.map((ayah) => ({
        ayahId: `${ayah.surahNumber}:${ayah.number}`,
        audioUrl: ayah.audioUrl,
      }));

      void playPlaylistTrack(0, surahNumber);
    },
    [
      currentSurahNumber,
      isPlaying,
      playbackMode,
      playPlaylistTrack,
      setIsPlaying,
    ],
  );

  const isThisAyahPlaying = useCallback(
    (ayahId: string) => currentAyahId === ayahId && isPlaying,
    [currentAyahId, isPlaying],
  );

  const isThisAyahLoading = useCallback(
    (ayahId: string) => currentAyahId === ayahId && isLoading,
    [currentAyahId, isLoading],
  );

  const isThisSurahPlaying = useCallback(
    (surahNumber: number) =>
      playbackMode === "surah" &&
      currentSurahNumber === surahNumber &&
      isPlaying,
    [currentSurahNumber, isPlaying, playbackMode],
  );

  const isThisSurahLoading = useCallback(
    (surahNumber: number) =>
      playbackMode === "surah" &&
      currentSurahNumber === surahNumber &&
      isLoading,
    [currentSurahNumber, isLoading, playbackMode],
  );

  return {
    playAyah,
    playSurah,
    stopAudio,
    isThisAyahPlaying,
    isThisAyahLoading,
    isThisSurahPlaying,
    isThisSurahLoading,
    currentAyahId,
    isPlaying,
    isLoading,
  };
}
