import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurah } from "@/lib/api";
import SurahReader from "@/components/surah/SurahReader";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface Props {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const id = parseInt(params.id);

  if (isNaN(id) || id < 1 || id > 114) {
    return {
      title: "Not Found",
    };
  }

  try {
    const surah = await getSurah(id);

    return {
      title: `${surah.englishName} (${surah.name}) - Quran`,
      description: `Read Surah ${surah.englishName}, the ${surah.englishNameTranslation}, with Arabic text and English translation.`,
    };
  } catch {
    return {
      title: "Quran",
    };
  }
}

export default async function SurahPage({ params }: Props) {
  const id = parseInt(params.id);

  if (isNaN(id) || id < 1 || id > 114) {
    notFound();
  }

  try {
    const surah = await getSurah(id);

    return <SurahReader surah={surah} />;
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <p className="text-[#9da3c0]">
            Failed to load surah. Please check your API connection.
          </p>

          <p className="text-sm text-[#5e6485]">
            Backend URL: {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>
      </div>
    );
  }
}