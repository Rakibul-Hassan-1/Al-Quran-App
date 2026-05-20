import type { ApiResponse, SearchApiResponse, Surah, SurahMeta } from "@/types";

// function resolveApiUrl() {
//   const envUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

//   if (process.env.NODE_ENV !== "production") {
//     return "http://localhost:3001";
//   }

//   return envUrl || "http://localhost:3001";
// }

function resolveApiUrl() {
  const envUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

  // Production OR CI build
  if (envUrl) {
    return envUrl;
  }

  // Local development only
  return "http://localhost:3001";
}

const API_URL = resolveApiUrl();

async function fetchApi<T>(path: string): Promise<T> {
  const url = new URL(path, `${API_URL}/`).toString();

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    // next: { revalidate: 3600 }, // Cache 1 hour for SSG
    cache: "no-store",
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
  limit = 20,
): Promise<SearchApiResponse> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
  });
  return fetchApi<SearchApiResponse>(`/api/search?${params}`);
}

export function getAudioUrl(globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
}
