"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Sparkles, Send, ArrowLeft, Globe, Search, ShieldCheck } from "lucide-react";
import { ProblemItem, addSolution, upvoteProblem, upvoteSolution } from "@/lib/api";

interface Props {
  initialProblem: ProblemItem;
}

export default function ProblemDetailClient({ initialProblem }: Props) {
  const [problem, setProblem] = useState<ProblemItem>(initialProblem);
  const [solutionAuthor, setSolutionAuthor] = useState("");
  const [solutionContent, setSolutionContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeSerpTab, setActiveSerpTab] = useState<"google" | "yandex">("google");

  const handleUpvoteProblem = async () => {
    try {
      const res = await upvoteProblem(problem.id);
      setProblem(prev => ({ ...prev, upvotes_count: res.upvotes_count }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpvoteSolution = async (solutionId: string) => {
    try {
      const res = await upvoteSolution(solutionId);
      setProblem(prev => ({
        ...prev,
        solutions: prev.solutions.map(s => s.id === solutionId ? { ...s, upvotes_count: res.upvotes_count } : s)
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionContent.trim()) {
      alert("Yechim matni majburiy!");
      return;
    }
    setSubmitting(true);
    try {
      const newSol = await addSolution(problem.id, {
        author_name: solutionAuthor || "Dasturchi",
        content_markdown: solutionContent
      });
      setProblem(prev => ({
        ...prev,
        solutions: [...prev.solutions, newSol]
      }));
      setSolutionContent("");
      setSolutionAuthor("");
      alert("Yechimingiz qabul qilindi!");
    } catch (e) {
      console.error(e);
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  const metaTitle = problem.effective_meta_title || `${problem.title} | DevBexruz Q&A`;
  const metaDesc = problem.effective_meta_description || problem.content_markdown.replace(/[#*`]/g, "").slice(0, 160);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition">Bosh Sahifa</Link>
          <span>/</span>
          <Link href="/problems" className="hover:text-blue-600 transition">Muammolar (Q&A)</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{problem.title}</span>
        </div>

        {/* Problem Main Card */}
        <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          
          {/* Status & Meta Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              {problem.status === "solved" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Muammo Yechildi
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                  Ochiq Muammo
                </span>
              )}

              {problem.meta_generated_by_ai && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200" title="Ushbu sahifa qidiruv tizimlariga AI orqali optimallashtirilgan">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Google & Yandex AI SEO
                </span>
              )}

              {problem.tags && problem.tags.split(",").map((t, idx) => (
                <span key={idx} className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  #{t.trim()}
                </span>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Sana: {new Date(problem.created_at).toLocaleDateString("uz-UZ")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-6">
            {problem.title}
          </h1>

          {/* Problem Body */}
          <div className="text-sm text-slate-700 leading-relaxed space-y-4 mb-8 whitespace-pre-wrap">
            {problem.content_markdown}
          </div>

          {/* Upvote & View Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-medium">
                <Eye className="w-4 h-4 text-slate-400" /> {problem.view_count} ko'rildi
              </span>
              <span className="flex items-center gap-1 font-medium">
                <MessageSquare className="w-4 h-4 text-slate-400" /> {problem.solutions?.length || 0} ta yechim
              </span>
            </div>

            <button
              onClick={handleUpvoteProblem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-bold text-slate-700 transition cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Ovoz berish ({problem.upvotes_count})</span>
            </button>
          </div>
        </article>


        {/* Solutions List */}
        <section className="space-y-6 mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Berilgan Yechimlar ({problem.solutions?.length || 0})
            </h2>
          </div>

          {problem.solutions && problem.solutions.length > 0 ? (
            problem.solutions.map((sol) => (
              <div
                key={sol.id}
                className={`rounded-xl p-6 transition ${
                  sol.is_accepted
                    ? "bg-white border-2 border-emerald-500 shadow-sm"
                    : "bg-white border border-slate-200"
                }`}
              >
                {sol.is_accepted && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Eng Yaxshi & Qabul Qilingan Yechim
                  </div>
                )}

                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sol.author_name}</span>
                    {sol.author_name.includes("Bexruz") && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-extrabold uppercase">
                        Architect
                      </span>
                    )}
                  </div>
                  <span>{new Date(sol.created_at).toLocaleDateString("uz-UZ")}</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 whitespace-pre-wrap mb-4 font-mono">
                  {sol.content_markdown}
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleUpvoteSolution(sol.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Foydali ({sol.upvotes_count})</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
              Bu muammoga hali yechim qoldirilmagan. Birinchi bo'lib yechim taklif qiling!
            </div>
          )}
        </section>

        {/* Add Solution Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            O'z Yechimingizni Taqdim Eting:
          </h3>

          <form onSubmit={handleAddSolution} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ismingiz yoki Taxallus:
              </label>
              <input
                type="text"
                value={solutionAuthor}
                onChange={(e) => setSolutionAuthor(e.target.value)}
                placeholder="Masalan: Azizbek Backend"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Yechim Matni & Kod Namunasi:
              </label>
              <textarea
                rows={5}
                required
                value={solutionContent}
                onChange={(e) => setSolutionContent(e.target.value)}
                placeholder="Qanday qilib bu muammoni to'g'ri hal qilish mumkin? Qadamlar va kod namunasi..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Yuborilmoqda..." : "Yechimni Saqlash"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
