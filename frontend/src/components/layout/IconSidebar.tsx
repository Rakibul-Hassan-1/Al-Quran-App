"use client";

import { cn } from "@/lib/utils";
import { useThemeStore, useUIStore } from "@/store";
import {
  Bookmark,
  BookOpen,
  List,
  Moon,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";

export default function IconSidebar() {
  const {
    toggleSurahSidebar,
    toggleSearch,
    toggleSettingsPanel,
    toggleBookmarks,
  } = useUIStore();
  const { isDark, toggle } = useThemeStore();

  const topItems = [
    { icon: List, label: "Surah List", action: toggleSurahSidebar },
    { icon: Search, label: "Search", action: toggleSearch },
    { icon: Bookmark, label: "Bookmarks", action: toggleBookmarks },
  ];

  const bottomItems = [
    { icon: Settings, label: "Font Settings", action: toggleSettingsPanel },
    {
      icon: isDark ? Sun : Moon,
      label: isDark ? "Light Mode" : "Dark Mode",
      action: toggle,
    },
  ];

  return (
    <aside className="w-14 flex-shrink-0 bg-[#1a1d27] border-r border-[#2d3250] flex flex-col items-center py-4 z-30">
      {/* Logo */}
      <div className="mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#a07830] flex items-center justify-center">
          <BookOpen size={18} className="text-white" />
        </div>
      </div>

      {/* Top nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {topItems.map((item) => (
          <SidebarButton key={item.label} item={item} />
        ))}
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <SidebarButton key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarButton({
  item,
}: {
  item: {
    icon: React.ElementType;
    label: string;
    action?: () => void;
    href?: string;
  };
}) {
  const Icon = item.icon;

  const button = (
    <button
      onClick={item.action}
      title={item.label}
      className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center",
        "text-[#5e6485] hover:text-[#e8e8f0] hover:bg-[#2a2f47]",
        "transition-all duration-150 group relative",
      )}
    >
      <Icon size={20} />
      <span className="absolute left-12 bg-[#21253a] text-[#e8e8f0] text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-[#2d3250]">
        {item.label}
      </span>
    </button>
  );

  if (item.href) return <Link href={item.href}>{button}</Link>;
  return button;
}
