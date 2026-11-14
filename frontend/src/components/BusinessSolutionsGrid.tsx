"use client";

import { useState } from "react";
import { 
  Building2, Bot, Globe, Smartphone, Cpu, Workflow, 
  CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Zap, 
  BarChart3, RefreshCw, Printer, CreditCard, ChevronRight
} from "lucide-react";

interface SolutionItem {
  id: string;
  category: string;
  title: string;
  badge: string;
  badgeColor: string;
  shortDesc: string;
  metrics: string;
  capabilities: string[];
  mockupType: "crm" | "telegram" | "web" | "mobile" | "hardware" | "integrations";
}

const SOLUTIONS: SolutionItem[] = [
  {
    id: "crm",
    category: "01. Savdo & Boshqaruv",
    title: "Maxsus CRM & Ombor Tizimlari",
    badge: "Biznesni 100% Shaffof Boshqarish",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    shortDesc: "Kompaniyangiz ehtiyojlariga moslashtirilgan mijozlar bazasi, savdo voronkasi, ombor qoldiqlari va xodimlar KPI nazorati.",
    metrics: "+45% savdo konversiyasi, 0 ta yo'qotilgan buyurtma",
    capabilities: [
      "Mijozlar bilan aloqa tarixi va buyurtmalar voronkasi",
      "Real-vaqtdagi ombor qoldiqlari va tovar hisobi",
      "Xodimlarning sotuv rejasi va avtomatik KPI hisobi",
      "Rahbar uchun moliyaviy grafiklar va lahzalik hisobotlar"
    ],
    mockupType: "crm"
  },
  {
    id: "telegram",
    category: "02. E-Commerce & Botlar",
    title: "Telegram Bot & Web Mini App",
    badge: "O'zbekistondagi Eng Tez Savdo Kanali",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    shortDesc: "Telegram ichida to'liq ishlovchi internet do'kon, kuryerlar tizimi, Click / Payme / Uzum to'lovlari va 24/7 avto-javoblar.",
    metrics: "3x tezkor buyurtma olish, 24/7 avtomatik sotuv",
    capabilities: [
      "Telegram Mini App: Chiroyli mobil interfeys va savat",
      "Click, Payme va Uzum Bank orqali lahzalik to'lov",
      "Kuryerlar uchun geo-lokatsiya va buyurtma yetkazish paneli",
      "Avtomatik SMS va Telegram cheklari generatsiyasi"
    ],
    mockupType: "telegram"
  },
  {
    id: "web",
    category: "03. Veb & SaaS",
    title: "Web Platformalar & Admin Panellar",
    badge: "Yuqori Yuklamali Cloud Arxitektura",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    shortDesc: "Next.js va FastAPI asosidagi ultra-tezkor veb platformalar, korporativ portallar va xizmat ko'rsatish tizimlari.",
    metrics: "99.9% uptime, <100ms API javob tezligi",
    capabilities: [
      "Rolli ruxsatlar tizimi (Direktor, Menejer, Kassir, Auditor)",
      "Interaktiv analitika va Excel/PDF eksport",
      "Asinxron backend va xavfsiz JWT autentifikatsiya",
      "Mobil va planshetlar uchun to'liq moslashuvchan dizayn"
    ],
    mockupType: "web"
  },
  {
    id: "mobile",
    category: "04. Mobil Ilovalar",
    title: "iOS & Android Mobil Ilovalar",
    badge: "Flutter & Native Texnologiyalar",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    shortDesc: "Xodimlar (kassirlar, agentlar, kuryerlar) hamda mijozlar uchun qulay, oflayn rejimda ham ishlovchi mobil dasturlar.",
    metrics: "Offline-first sync, bir lahzada keshdan yuklanish",
    capabilities: [
      "Bitta kod bazasidan iOS va Android uchun ilovalar",
      "Internet uzilganda ham lokal bazada to'xtovsiz ishlash",
      "Push-bildirishnomalar va mijozlar shaxsiy kabineti",
      "Kamera orqali shtrix-kod va QR skanerlash"
    ],
    mockupType: "mobile"
  },
  {
    id: "hardware",
    category: "05. Qurilmalar & POS",
    title: "Hard Qurilmalar & Kassa Integratsiyasi",
    badge: "Fiskal Qurilmalar & Uskunalar",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    shortDesc: "POS terminallar, chek printerlar, shtrix-kod skanerlar, turniketlar va elektron tarozilarni to'g'ridan-to'g'ri dasturga ulash.",
    metrics: "0 ta adashgan chek, uzluksiz kassa oqimi",
    capabilities: [
      "ESC/POS chek printerlar bilan bevosita soket orqali aloqa",
      "Shtrix-kod va 2D DataMatrix (markirovka) skanerlari",
      "Elektron tarozilardan og'irlikni avtomatik kiritish",
      "Turniket va RFID o'tkazish punktlari integratsiyasi"
    ],
    mockupType: "hardware"
  },
  {
    id: "integrations",
    category: "06. Tashqi Tizimlar",
    title: "1C, Soliq, Bank & SMS Integratsiyalari",
    badge: "Tizimlararo To'liq Sinxronizatsiya",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    shortDesc: "1C Enterprise, Soliq / Didox / E-Factura, O'zbekiston banklari API va SMS shlyuzlarini yagona ekotizimga birlashtirish.",
    metrics: "Qo'lda kiritishdan 100% xalos bo'lish",
    capabilities: [
      "1C OData & REST API orqali ikki tomonlama avto-sync",
      "Soliq qo'mitasi va Didox orqali avtomatik fiskal chek",
      "Bank hisob-kitoblaridan to'lovlarni avto-qabul qilish",
      "PlayMobile, Eskiz va boshqa SMS provayderlar ulanishi"
    ],
    mockupType: "integrations"
  }
];

export default function BusinessSolutionsGrid() {
  const [activeTab, setActiveTab] = useState<string>("crm");
  const activeSolution = SOLUTIONS.find((s) => s.id === activeTab) || SOLUTIONS[0];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200" id="business-solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Biznes Egalari Uchun Kompleks Yechimlar</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Biznesingiz uchun nima kerak?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Qo'lda bajariladigan qiyin ishlarni, qog'ozbozlik va adashishlarni avtomatlashtiring. 
            Har bir modul <strong>Bexruz Boynazarov</strong> tomonidan yuqori yuklamali arxitektura va 1 oylik kafolatlangan ko'mak bilan yetkazib beriladi.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {SOLUTIONS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.id === "crm" && <Building2 className="w-4 h-4 text-emerald-500" />}
                {item.id === "telegram" && <Bot className="w-4 h-4 text-blue-500" />}
                {item.id === "web" && <Globe className="w-4 h-4 text-indigo-500" />}
                {item.id === "mobile" && <Smartphone className="w-4 h-4 text-purple-500" />}
                {item.id === "hardware" && <Cpu className="w-4 h-4 text-amber-500" />}
                {item.id === "integrations" && <Workflow className="w-4 h-4 text-rose-500" />}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Solution Card */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${activeSolution.badgeColor}`}>
                  {activeSolution.badge}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {activeSolution.category}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activeSolution.title}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed">
                {activeSolution.shortDesc}
              </p>

              {/* Capabilities checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeSolution.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              {/* Metric Callout */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Kutilayotgan Natija (ROI):
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-blue-900">
                    {activeSolution.metrics}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Kafolatli yetkazish</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#estimator"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ushbu yo'nalishda AI Smeta hisoblash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#services"
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
                >
                  <span>Aniq narxlar matritsasi</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Right Visual Graphic Column */}
            <div className="lg:col-span-5">
              <div className="w-full bg-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                {/* Visual Representation based on active solution */}
                {activeSolution.mockupType === "crm" && (
                  <div className="space-y-4 font-mono text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <BarChart3 className="w-4 h-4" />
                        <span>CRM DASHBOARD LIVE</span>
                      </div>
                      <span className="text-[10px] text-slate-500">FastAPI + PostgreSQL</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block">Bugungi Savdo:</span>
                        <span className="text-base font-bold text-white">$4,850</span>
                        <span className="text-[10px] text-emerald-400 block mt-0.5">+24% o'sish</span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block">Yangi Lidlar:</span>
                        <span className="text-base font-bold text-white">48 ta</span>
                        <span className="text-[10px] text-blue-400 block mt-0.5">Avtomatik taqsimlandi</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Savdo Voronkasi Statuslari:</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-300">
                          <span>Yangi murojaat</span>
                          <span className="font-bold text-white">100% (48)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-blue-500" />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-300">
                          <span>Tijoriy taklif / Smeta</span>
                          <span className="font-bold text-white">72% (34)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-[72%] h-full bg-amber-500" />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-300">
                          <span>To'lov &amp; Shartnoma</span>
                          <span className="font-bold text-emerald-400">46% (22)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-[46%] h-full bg-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSolution.mockupType === "telegram" && (
                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-blue-400 font-bold">
                        <Bot className="w-4 h-4" />
                        <span>@developerlogicbot &amp; WebApp</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-200 space-y-2">
                      <p className="text-[11px] font-mono text-slate-400">Mijoz: &quot;Buyurtma bermoqchiman&quot;</p>
                      <div className="bg-blue-950/70 border border-blue-800/50 p-2.5 rounded-lg text-[11px] space-y-1.5">
                        <p className="font-bold text-white">🛍 Xush kelibsiz! Katalogimizdan tanlang:</p>
                        <div className="flex gap-1.5">
                          <span className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-bold">📱 WebApp Ochish</span>
                          <span className="px-2 py-1 rounded bg-slate-700 text-slate-200 text-[10px]">💳 Click / Payme</span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/50 text-[10px] text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>To'lov qabul qilindi: 450,000 UZS (Fiskal chek yuborildi)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSolution.mockupType === "web" && (
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                        <Globe className="w-4 h-4" /> SaaS Admin Panel
                      </span>
                      <span className="text-[10px] text-slate-500">Next.js 15 + Tailwind</span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>API RESPONSE TIME:</span>
                        <span className="text-emerald-400 font-bold">28ms</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>ACTIVE SESSIONS:</span>
                        <span className="text-white font-bold">1,240 ta faol foydalanuvchi</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>DATABASE ENGINE:</span>
                        <span className="text-blue-400 font-bold">PostgreSQL AsyncPool</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSolution.mockupType === "mobile" && (
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-purple-400 font-bold flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4" /> Flutter Mobile Engine
                      </span>
                      <span className="text-[10px] text-emerald-400">Offline-Ready</span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2 text-slate-300">
                      <p className="text-[10px] text-slate-400">Lokal SQLite Kesh: 2,400 tovar</p>
                      <p className="text-[10px] text-emerald-400">⚡ Tarmoqsiz to'liq savdo qilish imkoni</p>
                      <p className="text-[10px] text-blue-300">🔄 Internet paydo bo'lganda avto-sinxron</p>
                    </div>
                  </div>
                )}

                {activeSolution.mockupType === "hardware" && (
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Printer className="w-4 h-4" /> Kassa &amp; POS Uskunalar
                      </span>
                      <span className="text-[10px] text-slate-400">ESC/POS Raw Socket</span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Chek printer (80mm):</span>
                        <span className="text-emerald-400 font-bold">Ulangan (0.2s)</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">2D QR Markirovka skaner:</span>
                        <span className="text-emerald-400 font-bold">Faol</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Elektron tarozi (RS-232):</span>
                        <span className="text-amber-400 font-bold">1.450 kg</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSolution.mockupType === "integrations" && (
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <RefreshCw className="w-4 h-4" /> 1C &amp; Soliq Integratsiyasi
                      </span>
                      <span className="text-[10px] text-emerald-400">Bidirectional Sync</span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">1C OData API:</span>
                        <span className="text-emerald-400 font-bold">Sinxron (har 5 soniya)</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Soliq Didox E-Factura:</span>
                        <span className="text-blue-400 font-bold">Avto-fiskallash</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Bank tranzaksiyalari:</span>
                        <span className="text-emerald-400 font-bold">100% moslik</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Quick-Access Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              onClick={() => setActiveTab(sol.id)}
              className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                activeTab === sol.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-blue-500/20"
                  : "bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                    activeTab === sol.id ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-600"
                  }`}>
                    {sol.category}
                  </span>
                  {activeTab === sol.id ? (
                    <span className="text-[10px] font-bold text-amber-400">Faol ko'rinish</span>
                  ) : null}
                </div>

                <h4 className="text-lg font-bold tracking-tight mb-2">
                  {sol.title}
                </h4>

                <p className={`text-xs leading-relaxed ${
                  activeTab === sol.id ? "text-slate-300" : "text-slate-600"
                }`}>
                  {sol.shortDesc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100/10 flex items-center justify-between text-xs font-bold">
                <span className={activeTab === sol.id ? "text-blue-300" : "text-blue-600"}>
                  Batafsil ko'rish
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
