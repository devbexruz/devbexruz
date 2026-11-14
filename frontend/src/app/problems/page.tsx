import ProblemsClientWrapper from "./ProblemsClientWrapper";
import { fetchProblems } from "@/lib/api";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Dasturchilar Hamjamiyati (Dev Q&A) — Real Muammolar & Yechimlar | DevBexruz",
  description: "FastAPI, PostgreSQL, Docker, Next.js va AI integratsiyasidagi murakkab xatoliklar, arxitektura to'siqlari va professional yechimlar markazi.",
  keywords: ["Dev Q&A", "Dasturchilar forumi", "FastAPI xatolik", "PostgreSQL optimallashtirish", "O'zbek dasturchilari"],
};

export default async function ProblemsPage() {
  const problems = await fetchProblems();

  return (
    <div className="bg-slate-50 min-h-screen">
      <ProblemsClientWrapper initialProblems={problems} />
    </div>
  );
}
