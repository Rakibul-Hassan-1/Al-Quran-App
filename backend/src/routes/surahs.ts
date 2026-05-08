import { Hono } from "hono";
import { loadQuranData, getSurahList } from "../data/quran";

export const surahRoutes = new Hono();

// GET /api/surahs - List all surahs (metadata only, fast)
surahRoutes.get("/", (c) => {
  const surahs = getSurahList();
  return c.json({ success: true, data: surahs, count: surahs.length });
});

// GET /api/surahs/:id - Full surah with all ayahs
surahRoutes.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id) || id < 1 || id > 114) {
    return c.json({ success: false, error: "Invalid surah number. Must be 1–114." }, 400);
  }

  try {
    const data = await loadQuranData();
    const surah = data.surahs.find((s) => s.number === id);

    if (!surah) {
      return c.json({ success: false, error: "Surah not found" }, 404);
    }

    return c.json({ success: true, data: surah });
  } catch (error) {
    return c.json({ success: false, error: "Failed to load surah" }, 500);
  }
});

// GET /api/surahs/:surahId/ayahs/:ayahNumber
surahRoutes.get("/:surahId/ayahs/:ayahNumber", async (c) => {
  const surahId = parseInt(c.req.param("surahId"));
  const ayahNumber = parseInt(c.req.param("ayahNumber"));

  if (isNaN(surahId) || isNaN(ayahNumber)) {
    return c.json({ success: false, error: "Invalid parameters" }, 400);
  }

  try {
    const data = await loadQuranData();
    const surah = data.surahs.find((s) => s.number === surahId);

    if (!surah) {
      return c.json({ success: false, error: "Surah not found" }, 404);
    }

    const ayah = surah.ayahs.find((a) => a.number === ayahNumber);

    if (!ayah) {
      return c.json({ success: false, error: "Ayah not found" }, 404);
    }

    return c.json({ success: true, data: ayah });
  } catch (error) {
    return c.json({ success: false, error: "Failed to load ayah" }, 500);
  }
});
