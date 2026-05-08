"use client";

import { useCallback } from "react";
import { useAudioStore } from "@/store";

// Global singleton — একটাই audio instance সবসময়
let globalAudio: HTMLAudioElement | null = null;

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

export function useAudio() {
  const {
    currentAyahId,
    isPlaying,
    isLoading,
    setCurrentAyah,
    setIsPlaying,
    setIsLoading,
    setAudio,
  } = useAudioStore();

  const stopAudio = useCallback(() => {
    killGlobalAudio();
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentAyah(null);
    setAudio(null);
  }, [setIsPlaying, setIsLoading, setCurrentAyah, setAudio]);

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
      setIsPlaying(false);
      setIsLoading(false);

      setCurrentAyah(ayahId);
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
        setIsPlaying(false);
        setCurrentAyah(null);
        globalAudio = null;
      };

      audio.onerror = () => {
        if (globalAudio !== audio) return;
        setIsLoading(false);
        setIsPlaying(false);
        setCurrentAyah(null);
        globalAudio = null;
        console.error("Audio failed:", audioUrl);
      };

      audio.src = audioUrl;
      audio.load();
      setAudio(audio);
    },
    [currentAyahId, isPlaying, setCurrentAyah, setIsLoading, setIsPlaying, setAudio]
  );

  const isThisAyahPlaying = useCallback(
    (ayahId: string) => currentAyahId === ayahId && isPlaying,
    [currentAyahId, isPlaying]
  );

  const isThisAyahLoading = useCallback(
    (ayahId: string) => currentAyahId === ayahId && isLoading,
    [currentAyahId, isLoading]
  );

  return {
    playAyah,
    stopAudio,
    isThisAyahPlaying,
    isThisAyahLoading,
    currentAyahId,
    isPlaying,
    isLoading,
  };
}
