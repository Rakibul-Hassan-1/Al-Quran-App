"use client";

import { useThemeStore, useUIStore } from "@/store";
import type { SurahMeta } from "@/types";
import {
  BookOpen,
  Bookmark,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import BookmarksPanel from "../bookmarks/BookmarksPanel";
import SearchPanel from "../search/SearchPanel";
import SettingsPanel from "../settings/SettingsPanel";
import IconSidebar from "./IconSidebar";
import SurahSidebar from "./SurahSidebar";

interface Props {
  surahs: SurahMeta[];
  children: React.ReactNode;
}

export default function MainLayout({ surahs, children }: Props) {
  const { isSettingsPanelOpen, isSearchOpen, isBookmarksOpen } = useUIStore();
  const activeRightPanel = isSettingsPanelOpen
    ? "settings"
    : isSearchOpen
      ? "search"
      : isBookmarksOpen
        ? "bookmarks"
        : null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      {/* Left icon sidebar — hidden on mobile */}
      <div className="hidden lg:flex flex-shrink-0">
        <IconSidebar />
      </div>

      {/* Surah list sidebar */}
      <SurahSidebar surahs={surahs} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Mobile top header */}
        <MobileHeader />

        <div className="max-w-3xl mx-auto w-full px-4 py-6">{children}</div>
      </main>

      {/* Right panels */}
      {activeRightPanel === "settings" && <SettingsPanel />}
      {activeRightPanel === "search" && <SearchPanel />}
      {activeRightPanel === "bookmarks" && <BookmarksPanel />}

      {/* Mobile overlay */}
      <MobileOverlay />
    </div>
  );
}

function MobileHeader() {
  const {
    toggleSurahSidebar,
    toggleSearch,
    toggleSettingsPanel,
    toggleBookmarks,
  } = useUIStore();
  const { isDark, toggle } = useThemeStore();

  return (
    <header className="lg:hidden relative z-50 flex items-center justify-between px-4 py-3 bg-[#1a1d27] border-b border-[#2d3250] flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSurahSidebar}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1a1d27] border border-[#2d3250] text-[#9da3c0] hover:text-[#e8e8f0] hover:bg-[#2a2f47] transition-colors"
          aria-label="Open surah list"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#a07830] flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="text-[#e8e8f0] font-semibold text-sm">Al-Quran</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleSearch}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1a1d27] border border-[#2d3250] text-[#9da3c0] hover:text-[#e8e8f0] hover:bg-[#2a2f47] transition-colors"
        >
          <Search size={18} />
        </button>
        <button
          onClick={toggleSettingsPanel}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1a1d27] border border-[#2d3250] text-[#9da3c0] hover:text-[#e8e8f0] hover:bg-[#2a2f47] transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        <button
          onClick={toggleBookmarks}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1a1d27] border border-[#2d3250] text-[#9da3c0] hover:text-[#e8e8f0] hover:bg-[#2a2f47] transition-colors"
          title="Bookmarks"
        >
          <Bookmark size={18} />
        </button>
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1a1d27] border border-[#2d3250] text-[#9da3c0] hover:text-[#e8e8f0] hover:bg-[#2a2f47] transition-colors"
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

function MobileOverlay() {
  const { isSurahSidebarOpen, setSurahSidebarOpen } = useUIStore();
  if (!isSurahSidebarOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 z-30 lg:hidden"
      onClick={() => setSurahSidebarOpen(false)}
    />
  );
}
