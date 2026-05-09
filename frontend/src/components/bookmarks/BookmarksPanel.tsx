"use client";

import { useAppSettingsStore, useBookmarkStore, useUIStore } from "@/store";
import { Bookmark, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookmarksPanel() {
  const router = useRouter();
  const { setBookmarksOpen } = useUIStore();
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarkStore();
  const showBangla = useAppSettingsStore((s) => s.showBanglaTranslation);
  const banglaPrimary = useAppSettingsStore((s) => s.banglaPrimary);

  function goToBookmark(surahNumber: number, id: string) {
    const targetHash = `#ayah-card-${id.replace(":", "-")}`;
    const targetPath = `/surah/${surahNumber}`;

    if (
      window.location.pathname === targetPath &&
      window.location.hash === targetHash
    ) {
      window.dispatchEvent(
        new CustomEvent("bookmark-jump", {
          detail: { targetId: targetHash.slice(1) },
        }),
      );
      setBookmarksOpen(false);
      return;
    }

    router.push(`${targetPath}${targetHash}`);
    setBookmarksOpen(false);
  }

  return (
    <aside className="w-80 flex-shrink-0 bg-[#1a1d27] border-l border-[#2d3250] flex flex-col animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b border-[#2d3250]">
        <div>
          <h2 className="text-[#e8e8f0] font-semibold text-sm">Bookmarks</h2>
          <p className="text-xs text-[#5e6485] mt-1">
            {bookmarks.length} saved ayah{bookmarks.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearBookmarks}
            title="Clear all bookmarks"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e6485] hover:text-[#ff9b9b] hover:bg-[#2a2f47]"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setBookmarksOpen(false)}
            title="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {bookmarks.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center text-[#5e6485] text-sm px-6 text-center">
            <Bookmark size={26} className="mb-2 opacity-40" />
            <p>No bookmarks yet</p>
            <p className="text-xs mt-1">
              Tap the bookmark icon on any ayah to save it here.
            </p>
          </div>
        ) : (
          bookmarks.map((item) => (
            <div key={item.id} className="border-b border-[#2d3250]">
              <button
                onClick={() => goToBookmark(item.surahNumber, item.id)}
                className="w-full text-left p-4 hover:bg-[#2a2f47] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#c9a84c] font-medium">
                    {item.surahEnglishName} {item.surahNumber}:{item.ayahNumber}
                  </span>
                </div>
                <p
                  className="text-[#e8e8f0] text-sm mb-1 text-right line-clamp-2"
                  dir="rtl"
                  style={{ fontFamily: "Amiri, serif", lineHeight: "2" }}
                >
                  {item.text}
                </p>
                <div>
                  {banglaPrimary && item.banglaTranslation ? (
                    <>
                      <p className="text-[#9da3c0] text-xs line-clamp-2 leading-relaxed">
                        {item.banglaTranslation}
                      </p>
                      {showBangla && (
                        <p className="text-[#9da3c0] text-xs line-clamp-2 leading-relaxed mt-1">
                          {item.translation}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-[#9da3c0] text-xs line-clamp-2 leading-relaxed">
                        {item.translation}
                      </p>
                      {showBangla && item.banglaTranslation ? (
                        <p className="text-[#9da3c0] text-xs line-clamp-2 leading-relaxed mt-1">
                          {item.banglaTranslation}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </button>
              <div className="px-4 pb-3">
                <button
                  onClick={() => removeBookmark(item.id)}
                  className="text-xs text-[#5e6485] hover:text-[#ff9b9b] transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
