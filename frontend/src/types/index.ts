export interface Ayah {
  number: number;
  numberInQuran: number;
  text: string;
  translation: string;
  banglaTranslation?: string;
  surahNumber: number;
  page?: number;
  juz?: number;
  audioUrl: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
  ayahs: Ayah[];
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  numberInQuran: number;
  text: string;
  translation: string;
  banglaTranslation?: string;
  audioUrl: string;
}

export interface SearchMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface SearchApiResponse {
  success: boolean;
  data: SearchResult[];
  meta: SearchMeta;
}

export type ArabicFont = "amiri" | "kfgq" | "scheherazade";

export interface FontSettings {
  arabicFont: ArabicFont;
  arabicFontSize: number;
  translationFontSize: number;
}

export interface AudioState {
  currentAyahId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
}
