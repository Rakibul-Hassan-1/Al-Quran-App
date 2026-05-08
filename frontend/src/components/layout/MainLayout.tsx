"use client";

import { useUIStore } from "@/store";
import type { SurahMeta } from "@/types";
import IconSidebar from "./IconSidebar";
import SurahSidebar from "./SurahSidebar";
import SettingsPanel from "../settings/SettingsPanel";
import SearchPanel from "../search/SearchPanel";

interface Props {
  surahs: SurahMeta[];
  children: React.ReactNode;
}

export default function MainLayout({ surahs, children }: Props) {
  const { isSurahSidebarOpen, isSettingsPanelOpen, isSearchOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      {/* Left icon sidebar */}
      <IconSidebar />

      {/* Surah list sidebar */}
      <SurahSidebar surahs={surahs} />

      {/* Main content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSurahSidebarOpen ? "ml-0" : "ml-0"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Right panels */}
      {isSettingsPanelOpen && <SettingsPanel />}
      {isSearchOpen && <SearchPanel />}

      {/* Mobile overlay */}
      <MobileOverlay />
    </div>
  );
}

function MobileOverlay() {
  const { isSurahSidebarOpen, setSurahSidebarOpen } = useUIStore();

  if (!isSurahSidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-20 lg:hidden"
      onClick={() => setSurahSidebarOpen(false)}
    />
  );
}
