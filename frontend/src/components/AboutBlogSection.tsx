"use client";

import { useState } from "react";
import { Newspaper, Clock, Tag, BookOpen, X, Sparkles, User, Calendar, ArrowRight } from "lucide-react";
import { BlogPostItem } from "@/lib/api";

interface Props {
  blogs: BlogPostItem[];
}

export default function AboutBlogSection({ blogs }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [activePost, setActivePost] = useState<BlogPostItem | null>(null);

  const categories = [
    "Barchasi",
    "Karyera & Falsafa",
    "Muhandislik Yo'li",
    "AI & Innovatsiya",
    "Yangiliklar & E'lonlar"
  ];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory === "Barchasi") return true;
    return b.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <section id="blog-section" className="mb-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
            <Newspaper className="w-3.5 h-3.5 text-blue-600" />
            <span>Karyera, Blog &amp; Yangiliklar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Muhandislik Fikrlari &amp; Karyera Postlari
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Tizimlar arxitekturasi, Forward Deployed Engineer roli, Agentic Coding va amaliy tajribalarim haqida shaxsiy maqolalarim.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedCategory === c
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white text-slate-500 text-xs">
          Ushbu kategoriya bo'yicha hozircha maqolalar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {post.read_time}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>

                {post.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.split(",").slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span className="text-[11px] text-slate-400 font-normal">
                  {new Date(post.created_at).toLocaleDateString("uz-UZ")}
                </span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Batafsil o'qish <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {activePost.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {activePost.read_time}
                </span>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-900">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                {activePost.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {activePost.author_name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(activePost.created_at).toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-blue-950 leading-relaxed font-medium">
                <strong>Mohiyat:</strong> {activePost.summary}
              </div>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {activePost.content_markdown}
              </div>

              {activePost.tags && (
                <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                  {activePost.tags.split(",").map((t, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                DeveloperLogic Platform · Shaxsiy Blog
              </span>
              <button
                onClick={() => setActivePost(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
