"use client";

import { useState, useCallback, useRef } from "react";
import { Search, X, Loader2, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchAyahs } from "@/lib/api";
import { useUIStore } from "@/store";
import type { SearchResult } from "@/types";
import { cn } from "@/lib/utils";

export default function SearchPanel() {
  const { setSearchOpen } = useUIStore();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const timerRef = useRef<NodeJS.Timeout>();

  const doSearch = useCallback(async (q: string, p = 1) => {
    if (q.length < 2) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchAyahs(q, p);
      setResults(res.data);
      setTotal(res.meta.total);
      setPage(p);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(val), 400);
  }

  function goToAyah(r: SearchResult) {
    router.push(`/surah/${r.surahNumber}#ayah-${r.ayahNumber}`);
    setSearchOpen(false);
  }

  return (
    <aside className="w-80 flex-shrink-0 bg-[#1a1d27] border-l border-[#2d3250] flex flex-col animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-[#2d3250]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#e8e8f0] font-semibold text-sm">Search Quran</h2>
          <button
            onClick={() => setSearchOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6485]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Search in Arabic or English..."
            className="w-full bg-[#0f1117] border border-[#2d3250] rounded-lg pl-9 pr-9 py-2.5 text-sm text-[#e8e8f0] placeholder-[#5e6485] focus:outline-none focus:border-[#c9a84c]"
          />
          {loading && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a84c] animate-spin" />
          )}
        </div>

        {searched && !loading && (
          <p className="text-xs text-[#5e6485] mt-2">
            {total} result{total !== 1 ? "s" : ""} for "{query}"
          </p>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!searched && (
          <div className="flex flex-col items-center justify-center h-48 text-[#5e6485] text-sm">
            <Search size={32} className="mb-2 opacity-30" />
            <p>Search by Arabic text or English translation</p>
          </div>
        )}

        {searched && results.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-[#5e6485] text-sm">
            <p>No results found</p>
          </div>
        )}

        {results.map((r) => (
          <button
            key={`${r.surahNumber}:${r.ayahNumber}`}
            onClick={() => goToAyah(r)}
            className="w-full p-4 border-b border-[#2d3250] text-left hover:bg-[#2a2f47] transition-colors"
          >
            {/* Meta */}
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={12} className="text-[#c9a84c]" />
              <span className="text-xs text-[#c9a84c] font-medium">
                {r.surahEnglishName} {r.surahNumber}:{r.ayahNumber}
              </span>
            </div>

            {/* Arabic snippet */}
            <p
              className="text-[#e8e8f0] text-sm mb-1 text-right line-clamp-2"
              dir="rtl"
              style={{ fontFamily: "Amiri, serif", fontSize: "16px", lineHeight: "2" }}
            >
              {r.text}
            </p>

            {/* Translation snippet */}
            <p className="text-[#9da3c0] text-xs line-clamp-2 leading-relaxed">
              {r.translation}
            </p>
          </button>
        ))}

        {/* Load more */}
        {results.length > 0 && results.length < total && (
          <button
            onClick={() => doSearch(query, page + 1)}
            className="w-full py-3 text-sm text-[#c9a84c] hover:bg-[#2a2f47] transition-colors"
          >
            Load more results
          </button>
        )}
      </div>
    </aside>
  );
}
