"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Newspaper, ShieldCheck, ArrowRight, BarChart3, CheckCircle2, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { fetchSeoStats, fetchAdminBlogs } from "@/lib/api";

export default function AdminDashboardPage() {
  const [seoStats, setSeoStats] = useState<any>(null);
  const [blogCount, setBlogCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [seo, blogs] = await Promise.all([
          fetchSeoStats().catch(() => null),
          fetchAdminBlogs().catch(() => []),
        ]);
        if (seo) setSeoStats(seo);
        if (blogs) setBlogCount(blogs.length);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Xush kelibsiz, Bexruz Boynazarov!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            DeveloperLogic Platform Boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            AI SEO metama'lumotlarini optimallashtirish, yangi maqolalar va karyera xabarlarini joylash, hamda platforma tizim holatini to'liq nazorat qiling.
          </p>
        </div>

        {/* Quick Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: AI SEO Engine */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  AI SEO Avtomatlashtirish
                </h2>
                {seoStats && (
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {seoStats.ai_coverage_percentage}% qamrov
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-4">
                Google va Yandex uchun muammolarning sarlavhasi, qidiruv niyati (search-intent) va meta tavsiflarini Gemini AI orqali yakka yoki ommaviy generatsiya qiling.
              </p>

              {seoStats && (
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center mb-4">
                  <div>
                    <div className="text-xs text-slate-400">Jami</div>
                    <div className="text-base font-black text-slate-900">{seoStats.total_problems}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">AI Tayyor</div>
                    <div className="text-base font-black text-emerald-600">{seoStats.ai_optimized_count}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Oddiy</div>
                    <div className="text-base font-black text-slate-600">{seoStats.fallback_count}</div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/admin/seo"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition"
            >
              <span>SEO Boshqaruviga o'tish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Blog & Career Management */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-200">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Blog &amp; Karyera Yangiliklari
                </h2>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {blogCount} ta maqola
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-4">
                O'z muhandislik tajribangiz, Forward Deployed faoliyatingiz, tizimlar arxitekturasi va shaxsiy blog postlaringizni boshqaring.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>"Men haqimda" sahifasida avtomatik ko'rinadi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Markdown va kod bloklarini qo'llab-quvvatlaydi</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin/blogs"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition"
            >
              <span>Bloglarni Boshqarish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
