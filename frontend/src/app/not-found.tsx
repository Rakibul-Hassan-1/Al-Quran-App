import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p
          className="text-6xl text-[#c9a84c]"
          style={{ fontFamily: "Amiri, serif" }}
          dir="rtl"
        >
          ٤٠٤
        </p>
        <h1 className="text-2xl font-semibold text-[#e8e8f0]">Page Not Found</h1>
        <p className="text-[#9da3c0]">The page you are looking for does not exist.</p>
        <Link
          href="/surah/1"
          className="inline-block mt-4 px-6 py-2.5 bg-[#c9a84c] text-[#0f1117] rounded-lg font-semibold hover:bg-[#e8c96c] transition-colors"
        >
          Go to Al-Fatiha
        </Link>
      </div>
    </div>
  );
}
