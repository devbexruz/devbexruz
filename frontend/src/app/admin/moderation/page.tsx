"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  ShieldAlert,
  CheckCircle,
  Trash2,
  CornerDownRight,
  User,
  Clock,
  Filter,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { ReportItem, fetchAdminReports, reviewAdminReport } from "@/lib/api";

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminReports(statusFilter === "all" ? undefined : statusFilter);
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reportId: string, action: "restore" | "delete") => {
    const confirmMsg =
      action === "restore"
        ? "Ushbu xabarni tiklashni tasdiqlaysizmi? U yana ommaga ko'rinadigan bo'ladi."
        : "Ushbu xabarni butunlay o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi!";
    if (!confirm(confirmMsg)) return;

    setActionLoadingId(reportId);
    try {
      await reviewAdminReport(reportId, action);
      alert(action === "restore" ? "Xabar tiklandi!" : "Xabar butunlay o'chirildi!");
      loadReports();
    } catch (err: any) {
      alert(err.message || "Amalni bajarishda xatolik");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-red-600" />
              Shikoyatlar va Moderatsiya
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Foydalanuvchilar shikoyat qilgan xabarlar, yechimlar va sharhlar darhol yashirilgan.
              Bu yerda ularni tekshirib, tiklash yoki butunlay o'chirishni hal qiling.
            </p>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "pending"
                  ? "bg-white text-red-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kutilmoqda (Pending)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("restored")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "restored"
                  ? "bg-white text-emerald-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tiklandi (Restored)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("deleted")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "deleted"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              O'chirildi (Deleted)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "all"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi
            </button>
          </div>
        </div>

        {/* Reports Feed */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Shikoyatlar yuklanmoqda...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Ushbu bo'limda shikoyatlar yo'q</h3>
            <p className="text-xs text-slate-500 mt-1">
              Barcha shikoyatlar ko'rib chiqilgan yoki hozircha yangi shikoyatlar kelib tushmagan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 transition hover:border-slate-300"
              >
                {/* Top Details Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        report.status === "pending"
                          ? "bg-red-100 text-red-700"
                          : report.status === "restored"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {report.status === "pending"
                        ? "Moderatsiya kutilmoqda"
                        : report.status === "restored"
                        ? "Tiklandi"
                        : "O'chirildi"}
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {report.target_type === "problem"
                        ? "Muammo"
                        : report.target_type === "solution"
                        ? "Yechim"
                        : "Sharh / Izoh"}
                    </span>

                    <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Sabab: {report.reason}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(report.created_at).toLocaleString("uz-UZ", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Reporter and Target Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl mb-3">
                  <div>
                    <span className="text-slate-500 font-medium">Shikoyat qilgan shaxs:</span>{" "}
                    <span className="font-bold text-slate-900">{report.reporter_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Xabar muallifi:</span>{" "}
                    <span className="font-bold text-slate-900">
                      {report.target_author || "Noma'lum"}
                    </span>
                  </div>
                  {report.problem_title && (
                    <div className="md:col-span-2">
                      <span className="text-slate-500 font-medium">Tegishli mavzu:</span>{" "}
                      <span className="font-bold text-blue-600">{report.problem_title}</span>
                    </div>
                  )}
                  {report.details && (
                    <div className="md:col-span-2 text-slate-600 italic">
                      <span className="font-medium text-slate-500 not-italic">
                        Shikoyatchi izohi:
                      </span>{" "}
                      "{report.details}"
                    </div>
                  )}
                </div>

                {/* Hierarchy context: Parent content if replying to something */}
                {report.parent_content && (
                  <div className="mb-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs">
                    <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mb-1">
                      <CornerDownRight className="w-3.5 h-3.5 text-amber-600" />
                      Qaysi xabarga javob berilgan (Yuqori kontekst):
                    </div>
                    <p className="text-slate-700 italic line-clamp-2">"{report.parent_content}"</p>
                  </div>
                )}

                {/* Target Content (The Reported Message) */}
                <div className="mb-4 p-3.5 bg-red-50/30 rounded-xl border border-red-200 text-xs text-slate-900">
                  <div className="text-[11px] font-bold text-red-700 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Shikoyat tushgan va ayni paytda yashirilgan kontent:
                  </div>
                  <div className="font-mono bg-white p-3 rounded-lg border border-red-100 whitespace-pre-wrap leading-relaxed text-slate-800">
                    {report.target_content || "(Kontent topilmadi)"}
                  </div>
                </div>

                {/* Actions */}
                {report.status === "pending" && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleReview(report.id, "restore")}
                      disabled={actionLoadingId === report.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Xabarni Tiklash (Restore)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview(report.id, "delete")}
                      disabled={actionLoadingId === report.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Butunlay O'chirish (Delete)</span>
                    </button>
                  </div>
                )}

                {report.status !== "pending" && (
                  <div className="text-right text-[11px] text-slate-400 italic">
                    {report.reviewed_by && `Moderator: ${report.reviewed_by}`}
                    {report.reviewed_at &&
                      ` (${new Date(report.reviewed_at).toLocaleDateString("uz-UZ")})`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
