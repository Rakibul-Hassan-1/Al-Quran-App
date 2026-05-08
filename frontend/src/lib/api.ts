import type { ApiResponse, SearchApiResponse, Surah, SurahMeta } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }, // Cache 1 hour for SSG
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getAllSurahs(): Promise<SurahMeta[]> {
  const res = await fetchApi<ApiResponse<SurahMeta[]>>("/api/surahs");
  return res.data;
}

export async function getSurah(id: number): Promise<Surah> {
  const res = await fetchApi<ApiResponse<Surah>>(`/api/surahs/${id}`);
  return res.data;
}

export async function searchAyahs(
  query: string,
  page = 1,
  limit = 20
): Promise<SearchApiResponse> {
  const params = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
  return fetchApi<SearchApiResponse>(`/api/search?${params}`);
}

export function getAudioUrl(globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
}
