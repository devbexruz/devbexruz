"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Globe, RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight, Search, BarChart3, Layers } from "lucide-react";
import { fetchProblems, fetchSeoStats, generateProblemSeo, batchGenerateSeo, ProblemItem } from "@/lib/api";

export default function SeoAdminPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [stats, setStats] = useState<{ total_problems: number; ai_optimized_count: number; fallback_count: number; ai_coverage_percentage: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchLimit, setBatchLimit] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      const [probs, st] = await Promise.all([
        fetchProblems(),
        fetchSeoStats()
      ]);
      setProblems(probs);
      setStats(st);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSingleGenerate = async (problemId: string) => {
    setProcessingId(problemId);
    try {
      const result = await generateProblemSeo(problemId);
      setSuccessMessage(`"${result.meta_title}" muvaffaqiyatli saqlandi!`);
      await loadData();
    } catch (e) {
      console.error(e);
      alert("SEO generatsiyada xatolik yuz berdi.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleBatchGenerate = async () => {
    setBatchLoading(true);
    try {
      const results = await batchGenerateSeo(batchLimit, false);
      setSuccessMessage(`Eng mashhur ${results.length} ta muammo uchun AI SEO meta teglari yangilandi!`);
      await loadData();
    } catch (e) {
      console.error(e);
      alert("Batch generatsiyada xatolik yuz berdi.");
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Qidiruv Tizimlari Boshqaruvi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Google & Yandex AI SEO Meta Teglar Markazi
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Dasturchilar qoldirgan muammolarni qidiruvchilar niyatiga (Search Intent) moslashtirib,
              Google va Yandex da eng yuqori o'rinlarda chiqishini ta'minlovchi avtomatlashgan SEO vositasi.
            </p>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Yangilash
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage("")} className="text-emerald-700 hover:text-emerald-950">✕</button>
          </div>
        )}

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jami Muammolar</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{stats.total_problems} ta</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-2xs bg-amber-50/20">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">AI SEO Optimallashgan</span>
              <div className="text-2xl font-black text-amber-700 mt-1">{stats.ai_optimized_count} ta</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Standart Fallback (Oddiy)</span>
              <div className="text-2xl font-black text-slate-700 mt-1">{stats.fallback_count} ta</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-2xs bg-blue-50/20">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">AI Qamrov Foizi</span>
              <div className="text-2xl font-black text-blue-700 mt-1">{stats.ai_coverage_percentage}%</div>
            </div>
          </div>
        )}

        {/* Batch Action Banner */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Eng Mashhur Top-K Muammolarga AI Meta Generatsiya Qilish
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Ko'p ko'rilgan va eng faol muammolarni avtomatik saralab, Search-Intent tahlili asosida Title, Description va Keywords'ni yangilaydi.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-semibold">Miqdori:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={batchLimit}
                onChange={(e) => setBatchLimit(Number(e.target.value))}
                className="w-16 p-1.5 rounded-md border border-slate-300 text-center font-bold text-slate-900 text-xs"
              />
            </div>

            <button
              onClick={handleBatchGenerate}
              disabled={batchLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {batchLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Generatsiya qilinmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Batch Generatsiya Boshlash</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Barcha Muammolar va Ularning SEO Holati
            </h3>
            <span className="text-xs text-slate-400">Jami: {problems.length} ta yozuv</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Muammo & Slug</th>
                  <th className="py-3 px-4">SEO Holati</th>
                  <th className="py-3 px-4">Qidiruv Title (Meta Title)</th>
                  <th className="py-3 px-4 text-center">Ko'rish / Upvote</th>
                  <th className="py-3 px-4 text-right">Harakat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                      <Link href={`/problems/${p.slug}`} className="hover:text-blue-600 transition flex items-center gap-1 group">
                        <span className="truncate">{p.title}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </Link>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">
                        /problems/{p.slug}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {p.meta_generated_by_ai ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" /> AI Bilan Yaratilgan
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Oddiy Fallback
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-sm">
                      <p className="line-clamp-1 font-medium">
                        {p.effective_meta_title || p.title}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {p.effective_meta_description || p.content_markdown.slice(0, 100)}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      {p.view_count} / {p.upvotes_count}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSingleGenerate(p.id)}
                        disabled={processingId === p.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-800 text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        {processingId === p.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-amber-600" />
                        )}
                        <span>AI SEO Generatsiya</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
