"use client";

import { cn } from "@/lib/utils";
import { useAppSettingsStore } from "@/store";

export default function ToggleBN() {
  const banglaPrimary = useAppSettingsStore((s) => s.banglaPrimary);
  const setBanglaPrimary = useAppSettingsStore((s) => s.setBanglaPrimary);

  return (
    <button
      onClick={() => setBanglaPrimary(!banglaPrimary)}
      className={cn(
        "inline-flex items-center justify-center px-3 py-2 rounded-lg border text-sm",
        banglaPrimary
          ? "bg-[#c9a84c] border-[#c9a84c] text-[#0f1117]"
          : "bg-[#1a1d27] border-[#2d3250] text-[#e8e8f0] hover:bg-[#2a2f47]",
      )}
      title={
        banglaPrimary ? "Showing Bangla" : "Show Bangla instead of English"
      }
    >
      BN
    </button>
  );
}
