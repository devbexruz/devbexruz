"use client";

import { useState } from "react";
import { Sparkles, X, Check, ArrowRight, AlertCircle, Loader2, Cpu, Tag, ExternalLink } from "lucide-react";
import { aiPolishProblem, ProblemAIPolishResult, getAuthSession } from "@/lib/api";
import Link from "next/link";

interface NewProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemCreated?: (problem: ProblemAIPolishResult) => void;
}

export default function NewProblemModal({ isOpen, onClose, onProblemCreated }: NewProblemModalProps) {
  const [authorName, setAuthorName] = useState("");
  const [contact, setContact] = useState("");
  const [rawProblem, setRawProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProblemAIPolishResult | null>(null);

  // Pre-fill author name from session if available
  const handleOpen = () => {
    const session = getAuthSession();
    if (session.user && !authorName) {
      setAuthorName(session.user.full_name || session.user.username);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawProblem.trim() || rawProblem.trim().length < 10) {
      setError("Iltimos, muammoni kamida 10 ta belgidan iborat qilib yozing");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await aiPolishProblem({
        author_name: authorName.trim() || "Anonim Mehmon",
        contact: contact.trim() || undefined,
        raw_problem: rawProblem.trim(),
        publish_immediately: true,
      });
      setResult(res);
      if (onProblemCreated) {
        onProblemCreated(res);
      }
    } catch (err: any) {
      setError(err.message || "AI orqali tahlil qilishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setRawProblem("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Gemini 2.5 Flash AI</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Yangi muammo yozish &amp; AI tahlili
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Muammoni qanday bo'lsa shunday, oddiy so'zlar bilan yozing. Gemini AI uni tizimlashtirib, professional IT arxitektura va yechim shakliga keltiradi!
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            /* Result Success View */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Muammo Gemini AI tomonidan muvaffaqiyatli tahlil qilindi va saqlandi!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Arxitektura tahlili, sabablar va amaliy qadamlar tayyor.
                  </p>
                </div>
              </div>

              {/* Polished Card Preview */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                {result.category && (
                  <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                    {result.category}
                  </span>
                )}
                
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {result.title}
                </h3>

                {result.problem_summary && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Mohiyat:</strong> {result.problem_summary}
                  </p>
                )}

                {result.recommended_architecture && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                    <strong className="text-blue-900 flex items-center gap-1.5 mb-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-600" /> Tavsiya etilgan arxitektura:
                    </strong>
                    {result.recommended_architecture}
                  </div>
                )}

                {result.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.tags.split(",").map((t, i) => (
                      <span key={i} className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                {result.slug && (
                  <Link
                    href={`/problems/${result.slug}`}
                    onClick={onClose}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <span>Muammoni to'liq ko'rish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Yana boshqa muammo yozish
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ismingiz yoki Kompaniya <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Masalan: Sardorbek yoki Oqtepa Lavash"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Aloqa (Telegram yoki Telefon)
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="@username yoki +998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Muammoingizni oddiy so'zlar bilan yozing <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Kamida 10 ta belgi
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  value={rawProblem}
                  onChange={(e) => setRawProblem(e.target.value)}
                  placeholder="Masalan: Bizda optom do'kon bor, telegramdan kelgan zakazlar bilan 1C dagi ombor qoldig'i to'g'ri kelmayapti. Har kuni tovar adashib mijozlar norozi bo'lmoqda. Cheklar ham kechikib chiqmoqda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Feature info bullets */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px] leading-relaxed">
                  <p><strong>Gemini 2.5 Flash avtomatik tarzda:</strong></p>
                  <p>• Muammoning tub mohiyati va biznesga zararini aniqlaydi</p>
                  <p>• Asosiy texnik sabab (root cause) va stekni belgilaydi</p>
                  <p>• Bosqichma-bosqich arxitektura yechimini generatsiya qiladi</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini AI tahlil qilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI orqali tahlil qilish &amp; Chiqarish</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
