"use client";

import { useState } from "react";
import { DollarSign, Clock, Layers, ArrowUpRight, Check, Shield } from "lucide-react";
import { ServiceItem } from "@/lib/api";

interface Props {
  services: ServiceItem[];
}

export default function ServicesPricingTable({ services }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const categories = [
    { key: "all", label: "Barcha Xizmatlar" },
    { key: "core_system", label: "Asosiy Tizimlar" },
    { key: "integration", label: "Integratsiyalar" },
    { key: "optimization", label: "Optimallashtirish" },
    { key: "cloud", label: "Cloud & DevOps" },
  ];

  const filtered = activeTab === "all" 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              Shaffof Narxlar & Integratsiyalar Matritsasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mavjud Xizmatlar, Modullar va Bajarish Muddatlari
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Hech qanday yashirin to'lovlarsiz. Har bir servis arxitekturasi va narxi qat'iy belgilangan.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveTab(c.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  activeTab === c.key
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.key || item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.category.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ${item.price_min} – ${item.price_max}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-1.5">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.duration_estimate}
                </span>
                <a
                  href={`https://t.me/bexruzdeveloper?text=${encodeURIComponent(`Assalomu alaykum Bexruz, "${item.name}" xizmati bo'yicha buyurtma bermoqchiman.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                >
                  Buyurtma <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Guarantee Box */}
        <div className="mt-8 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Kafolatlangan Texnik Sifat:</span>
              <span className="text-slate-600">
                Har bir loyiha SOLID prinsiplari, avtomatik testlar va 1 oylik kafolatlangan texnik qo'llab-quvvatlash bilan topshiriladi.
              </span>
            </div>
          </div>
          <a
            href="https://t.me/bexruzdeveloper"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
          >
            Bexruz bilan Bog'lanish
          </a>
        </div>

      </div>
    </section>
  );
}
