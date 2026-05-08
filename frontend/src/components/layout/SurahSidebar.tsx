"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useUIStore } from "@/store";
import type { SurahMeta } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  surahs: SurahMeta[];
}

export default function SurahSidebar({ surahs }: Props) {
  const { isSurahSidebarOpen, setSurahSidebarOpen } = useUIStore();
  const [filter, setFilter] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const filtered = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(filter.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(filter.toLowerCase()) ||
      s.name.includes(filter) ||
      String(s.number).includes(filter)
  );

  const currentId = pathname?.split("/surah/")?.[1];

  function handleSelect(id: number) {
    router.push(`/surah/${id}`);
    // Close on mobile
    if (window.innerWidth < 1024) {
      setSurahSidebarOpen(false);
    }
  }

  return (
    <aside
      className={cn(
        "w-72 flex-shrink-0 bg-[#1a1d27] border-r border-[#2d3250] flex flex-col",
        "transition-all duration-300 overflow-hidden",
        // Desktop: inline; Mobile: fixed overlay
        "lg:relative lg:translate-x-0",
        "fixed top-0 left-14 bottom-0 z-30 lg:z-auto",
        isSurahSidebarOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full lg:w-0"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#2d3250]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#e8e8f0] font-semibold text-sm tracking-wide uppercase">
            Surahs
          </h2>
          <button
            onClick={() => setSurahSidebarOpen(false)}
            className="lg:hidden text-[#5e6485] hover:text-[#e8e8f0] p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6485]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter surahs..."
            className="w-full bg-[#0f1117] border border-[#2d3250] rounded-lg pl-9 pr-3 py-2 text-sm text-[#e8e8f0] placeholder-[#5e6485] focus:outline-none focus:border-[#c9a84c]"
          />
        </div>
      </div>

      {/* Surah List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((surah) => {
          const isActive = currentId === String(surah.number);
          return (
            <button
              key={surah.number}
              onClick={() => handleSelect(surah.number)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left",
                "hover:bg-[#2a2f47] transition-colors",
                isActive && "bg-[#21253a] border-r-2 border-[#c9a84c]"
              )}
            >
              {/* Number badge */}
              <span
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                  isActive
                    ? "bg-[#c9a84c] text-[#0f1117]"
                    : "bg-[#2d3250] text-[#9da3c0]"
                )}
              >
                {surah.number}
              </span>

              {/* Names */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-medium truncate", isActive ? "text-[#e8e8f0]" : "text-[#9da3c0]")}>
                    {surah.englishName}
                  </span>
                  <span
                    className="text-base font-arabic text-[#c9a84c] ml-2 flex-shrink-0"
                    style={{ fontFamily: "Amiri, serif" }}
                    dir="rtl"
                  >
                    {surah.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#5e6485]">{surah.englishNameTranslation}</span>
                  <span className="text-xs text-[#5e6485]">·</span>
                  <span className="text-xs text-[#5e6485]">{surah.numberOfAyahs} verses</span>
                  <span className="text-xs text-[#5e6485]">·</span>
                  <span
                    className={cn(
                      "text-xs",
                      surah.revelationType === "Meccan" ? "text-[#4caf82]" : "text-[#5b8dee]"
                    )}
                  >
                    {surah.revelationType}
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-[#5e6485] text-sm">
            No surahs found
          </div>
        )}
      </div>
    </aside>
  );
}
