"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Sparkles, Plus, Search, Tag, Filter } from "lucide-react";
import { ProblemItem, upvoteProblem, createProblem } from "@/lib/api";

interface Props {
  initialProblems: ProblemItem[];
}

export default function ProblemsFeed({ initialProblems }: Props) {
  const [problems, setProblems] = useState<ProblemItem[]>(initialProblems);
  const [selectedTag, setSelectedTag] = useState<string>("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // New Problem Form
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = ["Barchasi", "FastAPI", "PostgreSQL", "Next.js", "Telegram Bot", "Async", "High-Load"];

  const filteredProblems = problems.filter((p) => {
    const matchesTag = selectedTag === "Barchasi" || (p.tags && p.tags.toLowerCase().includes(selectedTag.toLowerCase()));
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.content_markdown.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleUpvote = async (e: React.MouseEvent, problemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await upvoteProblem(problemId);
      setProblems(prev => prev.map(p => p.id === problemId ? { ...p, upvotes_count: res.upvotes_count } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Sarlavha va muammo tavsifi majburiy!");
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await createProblem({
        title: newTitle,
        content_markdown: newContent,
        tags: newTags,
        author_name: newAuthor || "Dasturchi"
      });
      setProblems([created, ...problems]);
      setShowModal(false);
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setNewAuthor("");
      alert("Muammo muvaffaqiyatli joylandi! Unga avtomatik SEO tavsifi biriktirildi.");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="problems-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-200">
              <MessageSquare className="w-3.5 h-3.5" />
              Dasturchilar Hamjamiyati (Dev Q&A)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Real Backend & Arxitektura Muammolari
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Dasturchilar duch kelgan murakkab xatoliklar, arxitektura to'siqlari va professional yechimlar doskasi.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Muammo Yozish</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  selectedTag === t
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Muammolarni qidirish..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
              Ushbu filtr bo'yicha hozircha muammolar topilmadi. Birinchi bo'lib o'z savolingizni qoldiring!
            </div>
          ) : (
            filteredProblems.map((p) => (
              <Link
                key={p.id || p.slug}
                href={`/problems/${p.slug}`}
                className="block p-5 sm:p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.status === "solved" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Yechildi
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Ochiq
                      </span>
                    )}

                    {p.meta_generated_by_ai && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200" title="Ushbu muammo Google va Yandex qidiruv tizimlariga AI orqali optimallashtirilgan">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" /> AI SEO
                      </span>
                    )}

                    {p.tags && p.tags.split(",").map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(p.created_at).toLocaleDateString("uz-UZ")}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition mb-2">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {p.effective_meta_description || p.content_markdown.replace(/[#*`]/g, "").slice(0, 200)}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      {p.solutions ? p.solutions.length : 0} ta yechim
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {p.view_count} ko'rildi
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleUpvote(e, p.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition font-bold text-slate-700 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{p.upvotes_count}</span>
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Modal for Creating Problem */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">
                  Yangi Backend & Arxitektura Muammosini Joylash
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProblem} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Muammo Sarlavhasi:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Masalan: FastAPI async sessionda connection pool limit oshib ketishi..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Muammoning To'liq Tavsifi & Kod (Markdown qo'llab-quvvatlanadi):
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Xatolik qanday yuz berdi? Kod qismi va stack trace..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Teglar (vergul bilan):
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="FastAPI, PostgreSQL, Async"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Ismingiz yoki Taxallus:
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Dasturchi"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                  >
                    Bekor Qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Saqlanmoqda..." : "Joylashtirish"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
