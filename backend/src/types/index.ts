export interface Ayah {
  number: number;
  numberInQuran: number;
  text: string;
  translation: string;
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

export interface QuranData {
  surahs: Surah[];
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  numberInQuran: number;
  text: string;
  translation: string;
  audioUrl: string;
}
