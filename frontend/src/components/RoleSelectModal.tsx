"use client";

import { useState, useEffect } from "react";
import { Building2, Code2, Check, ArrowRight, X, Sparkles, ShieldCheck, Cpu, Layers } from "lucide-react";
import { getAuthSession, updateUserRole } from "@/lib/api";

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected?: (role: "business" | "developer") => void;
}

export default function RoleSelectModal({ isOpen, onClose, onRoleSelected }: RoleSelectModalProps) {
  const [selectedRole, setSelectedRole] = useState<"business" | "developer">("business");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("devbexruz_user_role") as "business" | "developer" | null;
      if (saved) {
        setSelectedRole(saved);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("devbexruz_user_role", selectedRole);
        window.dispatchEvent(new CustomEvent("role-changed", { detail: selectedRole }));
      }
      const session = getAuthSession();
      if (session.token) {
        await updateUserRole(selectedRole).catch(() => {});
      }
      if (onRoleSelected) {
        onRoleSelected(selectedRole);
      }
      onClose();
      window.location.href = selectedRole === "business" ? "/dashboard/business" : "/dashboard/developer";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Platformani moslashtirish</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Sizga qanday yo'nalish qiziq?
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Platformadagi xizmatlar, narxlar va arxitektura tahlillarini aynan sizning maqsadingizga qarab moslaymiz.
          </p>
        </div>

        {/* 2 Big Choice Cards */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Business */}
          <div
            onClick={() => setSelectedRole("business")}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 relative flex flex-col justify-between ${
              selectedRole === "business"
                ? "border-amber-500 bg-amber-50/40 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            {selectedRole === "business" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}

            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7" />
              </div>

              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-md">
                Tadbirkorlar &amp; Biznes egalari
              </span>

              <h3 className="text-xl font-bold text-slate-900 mt-2">
                🏢 Biznesmenman
              </h3>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Kompaniyamda sotuv, ombor, mijozlar yoki kassa jarayonlarini avtomatlashtirish kerak.
              </p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>AI Smeta: Loyiha narxi va muddati tahlili</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>CRM, Telegram Bot va 1C integratsiyasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>POS, chek printer, uskunalar ulanishi</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>1 oylik bepul kafolatli texnik ko'mak</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <span className={`text-xs font-bold inline-flex items-center gap-1 ${
                selectedRole === "business" ? "text-amber-700" : "text-slate-500"
              }`}>
                {selectedRole === "business" ? "Tanlandi" : "Ushbu profilni tanlash"}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Developer */}
          <div
            onClick={() => setSelectedRole("developer")}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 relative flex flex-col justify-between ${
              selectedRole === "developer"
                ? "border-blue-600 bg-blue-50/40 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            {selectedRole === "developer" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}

            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Code2 className="w-7 h-7" />
              </div>

              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                Muhandislar &amp; Dasturchilar
              </span>

              <h3 className="text-xl font-bold text-slate-900 mt-2">
                💻 Dasturchiman
              </h3>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Yuqori yuklamali backend arxitekturasi, FastAPI, PostgreSQL va real xatolar yechimi qiziq.
              </p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Dev Q&amp;A: Murakkab arxitektura muammolari</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Gemini AI orqali muammo diagnostikasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>FastAPI, PostgreSQL, Redis, Docker amaliyoti</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Bexruz Boynazarov bilan professional munozara</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <span className={`text-xs font-bold inline-flex items-center gap-1 ${
                selectedRole === "developer" ? "text-blue-700" : "text-slate-500"
              }`}>
                {selectedRole === "developer" ? "Tanlandi" : "Ushbu profilni tanlash"}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Rolni istalgan payt tepa menyudagi tugma orqali o'zgartirishingiz mumkin.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition"
            >
              Keyinroq tanlash
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-xl text-white transition shadow-sm ${
                selectedRole === "business"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saqlanmoqda..." : "Profilni Tasdiqlash"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
