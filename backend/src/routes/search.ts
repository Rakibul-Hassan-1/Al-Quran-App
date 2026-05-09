import { Hono } from "hono";
import { loadQuranData } from "../data/quran";
import type { SearchResult } from "../types";

export const searchRoutes = new Hono();

// GET /api/search?q=query&limit=20&page=1
searchRoutes.get("/", async (c) => {
  const query = c.req.query("q")?.trim();
  const limit = Math.min(parseInt(c.req.query("limit") || "20"), 50);
  const page = Math.max(parseInt(c.req.query("page") || "1"), 1);

  if (!query || query.length < 2) {
    return c.json(
      {
        success: false,
        error: "Query must be at least 2 characters",
      },
      400,
    );
  }

  try {
    const data = await loadQuranData();
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    for (const surah of data.surahs) {
      for (const ayah of surah.ayahs) {
        const matchesArabic = ayah.text.includes(query);
        const matchesTranslation = ayah.translation
          .toLowerCase()
          .includes(queryLower);
        const matchesBangla = ayah.banglaTranslation
          ? ayah.banglaTranslation.toLowerCase().includes(queryLower)
          : false;

        if (matchesArabic || matchesTranslation || matchesBangla) {
          results.push({
            surahNumber: surah.number,
            surahName: surah.name,
            surahEnglishName: surah.englishName,
            ayahNumber: ayah.number,
            numberInQuran: ayah.numberInQuran,
            text: ayah.text,
            translation: ayah.translation,
            banglaTranslation: ayah.banglaTranslation,
            audioUrl: ayah.audioUrl,
          });
        }
      }
    }

    const total = results.length;
    const offset = (page - 1) * limit;
    const paginated = results.slice(offset, offset + limit);

    return c.json({
      success: true,
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: "Search failed" }, 500);
  }
});
