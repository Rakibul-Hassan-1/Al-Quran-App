import { getAllSurahs } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";

export default async function SurahLayout({ children }: { children: React.ReactNode }) {
  const surahs = await getAllSurahs();

  return <MainLayout surahs={surahs}>{children}</MainLayout>;
}
