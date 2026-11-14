"use client";

import { Briefcase, Terminal, ArrowRight, Sparkles, Shield, Cpu, Zap, Code2, Users } from "lucide-react";

interface Props {
  activeMode: "business" | "developer";
  setActiveMode: (mode: "business" | "developer") => void;
}

export default function HeroGateway({ activeMode, setActiveMode }: Props) {
  return (
    <section className="relative pt-12 pb-16 bg-white overflow-hidden border-b border-slate-200">
      {/* Subtle clean background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Founder Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Bexruz Boynazarov — Senior Systems Architect & Product Engineer</span>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner max-w-md w-full">
            <button
              onClick={() => setActiveMode("business")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === "business"
                  ? "bg-white text-slate-900 shadow-sm border border-amber-300/80 ring-1 ring-amber-400/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className={`w-4 h-4 ${activeMode === "business" ? "text-amber-600" : "text-slate-400"}`} />
              <span>💼 BIZNESMEN</span>
              {activeMode === "business" && (
                <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-extrabold uppercase">
                  Founder & AI
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMode("developer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === "developer"
                  ? "bg-white text-slate-900 shadow-sm border border-blue-300/80 ring-1 ring-blue-400/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Terminal className={`w-4 h-4 ${activeMode === "developer" ? "text-blue-600" : "text-slate-400"}`} />
              <span>👨‍💻 DASTURCHIMAN</span>
              {activeMode === "developer" && (
                <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-extrabold uppercase">
                  Q&A Jamiyat
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Hero Content based on active mode */}
        {activeMode === "business" ? (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-5">
              Biznesingizdagi Rutin Jarayonlarni <span className="text-amber-700 underline decoration-amber-300 underline-offset-6">Avtomatlashtiring</span> & Yuqori Yuklamali Tizim Quring
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Bexruz Boynazarov — 6 yillik tajribaga ega Tizim Arxitektori va Product Engineer. 
              E-Commerce, Telegram botlar, to'lov tizimlari, AI yordamchilar va CRM jarayonlarini 
              shaffof narxlar hamda qat'iy muddatlarda ishlab chiqish.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#ai-estimator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Smeta va Arxitekturani Hisoblash</span>
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition"
              >
                <span>Xizmatlar & Narxlar Jadvali</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">40%</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Latency Drop (Tezlashish)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">99.9%</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tizim Barqarorligi (Uptime)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">6 Yil</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Muhandislik Tajribasi</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">100%</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Shaffof Narxlar</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-5">
              Real Backend, High-Load va <span className="text-blue-600 underline decoration-blue-300 underline-offset-6">Tizim Arxitekturasi</span> Muammolari Markazi
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              O'zbekiston dasturchilari uchun professional Q&A hamjamiyati. FastAPI, PostgreSQL, Docker, Async tizimlar 
              va AI integratsiyasidagi murakkab to'siqlarni birgalikda tahlil qilamiz. 
              Har bir muammo Google va Yandex qidiruv tizimlariga AI orqali optimallashtiriladi.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#problems-section"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-98"
              >
                <Terminal className="w-4 h-4" />
                <span>Muammolar Doskasini Ko'rish</span>
              </a>
              <a
                href="/admin/seo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI SEO Boshqaruvi</span>
              </a>
            </div>

            {/* Developer Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-blue-600">AI SEO</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Google & Yandex Snippet</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">JSON-LD</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">QAPage Rich Schema</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">SOLID</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Clean Architecture</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">O'zMU</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Amaliy Matematika</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
