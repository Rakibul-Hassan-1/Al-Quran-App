import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArabicNumerals(num: number): string {
  return num
    .toString()
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

export function formatVerseNumber(num: number): string {
  return `﴿${toArabicNumerals(num)}﴾`;
}
