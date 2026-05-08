import { cn } from "@/lib/utils";
import type { Surah } from "@/types";

interface Props {
  surah: Surah;
}

export default function SurahHeader({ surah }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#21253a] to-[#1a1d27] border border-[#2d3250] p-6 mb-6 text-center relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-2 right-4 text-[120px] text-[#c9a84c] font-arabic leading-none select-none"
          style={{ fontFamily: "Amiri, serif" }}
          dir="rtl"
        >
          {surah.name}
        </div>
      </div>

      <div className="relative z-10">
        {/* Arabic name */}
        <h1
          className="text-4xl text-[#c9a84c] mb-2"
          style={{ fontFamily: "Amiri, serif" }}
          dir="rtl"
        >
          {surah.name}
        </h1>

        {/* English name */}
        <h2 className="text-xl font-semibold text-slate-100 mb-1">
          {surah.englishName}
        </h2>
        <p className="text-slate-300 text-sm mb-4">
          {surah.englishNameTranslation}
        </p>

        {/* Meta badges */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs border border-white/10">
            Surah {surah.number}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs border border-white/10">
            {surah.numberOfAyahs} Verses
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs",
              surah.revelationType === "Meccan"
                ? "bg-[#4caf82]/10 text-[#4caf82]"
                : "bg-[#5b8dee]/10 text-[#5b8dee]",
            )}
          >
            {surah.revelationType}
          </span>
        </div>
      </div>
    </div>
  );
}
