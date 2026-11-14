"use client";

import React, { useState } from "react";
import { AlertTriangle, X, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import { submitReport } from "@/lib/api";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "problem" | "solution" | "comment";
  targetId: string;
  itemTitleOrSnippet?: string;
  onReportSuccess: (targetType: "problem" | "solution" | "comment", targetId: string) => void;
}

const REPORT_REASONS = [
  { key: "spam", label: "Spam yoki noo'rin reklama" },
  { key: "harassment", label: "Haqorat yoki shaxsiyatga tegish" },
  { key: "offensive", label: "Noo'rin yoki taqiqlangan kontent" },
  { key: "incorrect", label: "Zararli yoki xavfli kod / dezinformatsiya" },
  { key: "other", label: "Boshqa sabab" },
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  itemTitleOrSnippet,
  onReportSuccess,
}: ReportModalProps) {
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      await submitReport({
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details.trim() || undefined,
      });

      setSubmitted(true);
      // Immediately notify parent component to soft-hide the reported item
      onReportSuccess(targetType, targetId);

      setTimeout(() => {
        setSubmitted(false);
        setDetails("");
        onClose();
      }, 1600);
    } catch (err: any) {
      setErrorMessage(err.message || "Shikoyat yuborishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const getTargetLabel = () => {
    if (targetType === "problem") return "Muammo / Maqola";
    if (targetType === "solution") return "Yechim";
    return "Sharh / Izoh";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Shikoyat Qilish (Report)</h3>
            <p className="text-xs text-slate-500">{getTargetLabel()} ustidan shikoyat yuborish</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Shikoyatingiz qabul qilindi!</h4>
            <p className="text-xs text-slate-500">
              Kontent darhol ko'rinishdan olib tashlandi va moderator tekshiruviga yuborildi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {itemTitleOrSnippet && (
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 italic line-clamp-2">
                "{itemTitleOrSnippet}"
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Shikoyat sababini tanlang:
              </label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.key}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                      reason === r.key
                        ? "border-red-500 bg-red-50/50 text-red-900 font-medium"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      value={r.key}
                      checked={reason === r.key}
                      onChange={() => setReason(r.key)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qo'shimcha izoh (ixtiyoriy):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Nima uchun bu kontent qoidalarga zidligini tushuntiring..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-hidden"
              />
            </div>

            <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                Shikoyat yuborilgan zahoti ushbu kontent sahifadan yashiriladi va admin panelga tekshiruv uchun tushadi.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <span>Shikoyatni yuborish</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
