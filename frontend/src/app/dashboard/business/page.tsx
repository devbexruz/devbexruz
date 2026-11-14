"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Sparkles,
  Bot,
  Database,
  Smartphone,
  Cpu,
  ArrowRight,
  Send,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import AIBusinessEstimator from "@/components/AIBusinessEstimator";
import NotificationPermissionPrompt from "@/components/NotificationPermissionPrompt";
import { getAuthSession, updateUserRole } from "@/lib/api";

export default function BusinessDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const session = getAuthSession();
    if (session.user) {
      setCurrentUser(session.user);
    }
  }, []);

  const handleSwitchToDeveloper = async () => {
    try {
      await updateUserRole("developer");
      window.location.href = "/dashboard/developer";
    } catch {
      window.location.href = "/dashboard/developer";
    }
  };

  const businessSolutions = [
    {
      title: "Telegram Bot & Do'konlar",
      icon: Bot,
      color: "from-sky-500 to-blue-600",
      description: "Payme/Click to'lov integratsiyasi, avtomatlashtirilgan savat, 24/7 mijozlar bilan muloqot va AI yordamchi botlar.",
      tag: "Ommabop",
    },
    {
      title: "Maxsus CRM & ERP Tizimlari",
      icon: Database,
      color: "from-indigo-500 to-purple-600",
      description: "Lidlar oqimi, xodimlar samaradorligi, savdo voronkasi va avtomatik hisobotlar uchun maxsus CRM tizimlari.",
      tag: "Boshqaruv",
    },
    {
      title: "Web & Mobile Ilovalar",
      icon: Smartphone,
      color: "from-emerald-500 to-teal-600",
      description: "Yuqori tezlikdagi Next.js va FastAPI veb-saytlar, iOS va Android mobil ilovalari.",
      tag: "Tezkor",
    },
    {
      title: "Hard Qurilmalar & Apparat Integratsiyasi",
      icon: Cpu,
      color: "from-amber-500 to-orange-600",
      description: "Kassa apparatlari, shtrix-kod skanerlar, termoprinterlar, elektron tarozi va IoT uskunalarini veb tizimga ulash.",
      tag: "Uskunalar",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner / Hero for Business Owner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Briefcase className="w-3.5 h-3.5" /> Biznes Boshqaruv Paneli
                </span>
                <span className="text-xs text-slate-400">
                  IT Yechimlar, Smeta va Avtomatlashtirish
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Xush kelibsiz, {currentUser?.full_name || currentUser?.username || "Hurmatli Biznes Egasi"}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Biznesingizni avtomatlashtirish, CRM, Telegram botlar yoki apparat qurilmalari integratsiyasi
                uchun AI yordamida smeta hisoblang va bevosita dasturchi bilan bog'laning.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSwitchToDeveloper}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition"
              >
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Dasturchi rejimiga o'tish</span>
              </button>

              <Link
                href="/about"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 shadow-xs transition"
              >
                <span>Bexruz Haqida & Blog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-8">
        {/* Web Push Notification Permission Prompt */}
        <NotificationPermissionPrompt />

        {/* Business Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {businessSolutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sol.color} text-white flex items-center justify-center shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {sol.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {sol.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {sol.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* AI Business Estimator Tool */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Kalkulyator
              </span>
              <span className="text-xs text-slate-500">Gemini AI tahlili</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Biznesingiz Muammosini Yozing — AI Smeta & Arxitekturani Hisoblaydi
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Qanday tizim yoki avtomatlashtirish kerakligini yozing, sun'iy intellekt kerakli xizmatlar, narx oralig'i va muddatni bir necha soniyada aniqlaydi.
            </p>
          </div>

          <AIBusinessEstimator />
        </div>

        {/* Direct Contact Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800/40">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-300 bg-blue-800/60 px-2.5 py-0.5 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Shaxsiy Konsultatsiya
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              Loyihangiz bo'yicha to'g'ridan-to'g'ri Bexruz Boynazarov bilan gaplashmoqchimisiz?
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
              G'oya, texnik topshiriq yoki mavjud tizimni tekshirish bo'yicha bepul dastlabki konsultatsiya oling.
            </p>
          </div>

          <a
            href="https://t.me/bexruz_boynazarov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-950 hover:bg-blue-50 rounded-xl font-bold text-xs shadow-md transition shrink-0"
          >
            <Send className="w-4 h-4 text-blue-600" />
            <span>Telegramda Bog'lanish</span>
          </a>
        </div>
      </div>
    </div>
  );
}
