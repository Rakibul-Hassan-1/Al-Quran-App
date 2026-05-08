import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quran - Read, Listen, Understand",
  description: "Read the Holy Quran with Arabic text, English translation, and audio recitation.",
  keywords: ["Quran", "Koran", "Islam", "Arabic", "Translation", "Recitation"],
};

export const viewport: Viewport = {
  themeColor: "#0f1117",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0f1117] text-[#e8e8f0] antialiased">
        {children}
      </body>
    </html>
  );
}