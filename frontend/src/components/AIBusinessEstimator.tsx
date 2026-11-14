"use client";

import { useState } from "react";
import { Sparkles, Calculator, CheckCircle2, ArrowRight, Clock, DollarSign, Send, ShieldCheck, RefreshCw } from "lucide-react";
import { estimateBusinessSolution, submitLeadInquiry, BusinessEstimateResponse } from "@/lib/api";

export default function AIBusinessEstimator() {
  const [problemText, setProblemText] = useState("");
  const [businessType, setBusinessType] = useState("E-Commerce / Xizmat");
  const [contactName, setContactName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [estimate, setEstimate] = useState<BusinessEstimateResponse | null>(null);

  const quickPrompts = [
    { label: "🛍️ Telegram Do'kon & To'lov", text: "Menda kiyim-kechak do'konim bor, Telegramda 20 ming mijoz bor. Buyurtmalarni qo'lda olamiz, savat, Payme/Click to'lov va avtomatlashtirilgan hisob-kitob kerak." },
    { label: "⚡ Server Sekinlashuvi (High-load)", text: "PostgreSQL bazamizda ma'lumotlar ko'payib, API so'rovlari 4-5 soniyagacha qotib qolyapti. Bazani chuqur optimallashtirish va tezlashtirish zarur." },
    { label: "🤖 AI Yordamchi & RAG Boti", text: "Kompaniyamizning ichki hujjatlari va xizmatlari asosida mijozlar savollariga 24/7 javob beruvchi aqlli sun'iy intellekt bot tizimi kerak." },
    { label: "📊 Custom CRM & Workflow", text: "Menejerlar mijozlarni yo'qotib qo'ymoqda. Lidlar kelishi, statuslar konveyeri va xabarnomalar avtomatik ishlaydigan CRM tizimi zarur." }
  ];

  const handleEstimate = async () => {
    if (!problemText.trim() || problemText.length < 10) {
      alert("Iltimos, biznesingizdagi muammoni kamida 1-2 gapda yozing.");
      return;
    }
    setLoading(true);
    try {
      const res = await estimateBusinessSolution({
        problem_description: problemText,
        business_type: businessType,
        contact_name: contactName,
        contact_info: contactInfo
      });
      setEstimate(res);
      setSubmittedSuccess(false);
    } catch (err) {
      console.error(err);
      alert("Smeta hisoblashda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendToBexruz = async () => {
    if (!contactInfo.trim()) {
      const input = prompt("Iltimos, siz bilan bog'lanish uchun Telegram username yoki telefon raqamingizni kiriting:");
      if (!input) return;
      setContactInfo(input);
    }

    setSubmittingLead(true);
    try {
      await submitLeadInquiry({
        client_name: contactName || "Hurmatli Mijoz",
        client_contact: contactInfo || "@foydalanuvchi",
        business_type: businessType,
        problem_description: problemText,
        estimated_solution_json: JSON.stringify(estimate)
      });
      setSubmittedSuccess(true);
      
      // Open Telegram chat with prefilled message
      const msg = encodeURIComponent(
        `Assalomu alaykum Bexruz! Saytingizdagi AI Smeta Generatori orqali loyiham bo'yicha tahlil oldim:\n\n` +
        `📝 Muammo: ${problemText.slice(0, 120)}...\n` +
        `💰 Taxminiy smeta: $${estimate?.total_price_min} - $${estimate?.total_price_max}\n` +
        `⏱️ Muddat: ${estimate?.total_duration_estimate}\n\n` +
        `Ushbu loyihani siz bilan muhokama qilmoqchiman.`
      );
      window.open(`https://t.me/bexruzdeveloper?text=${msg}`, "_blank");
    } catch (e) {
      console.error(e);
      window.open(`https://t.me/bexruzdeveloper`, "_blank");
    } finally {
      setSubmittingLead(false);
    }
  };

  return (
    <section id="ai-estimator" className="py-12 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            AI Biznes Maslahatchi & Smeta Generatori
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Biznesingizdagi Muammoni Yozing — AI Darhol Yechim va Narxni Hisoblab Beradi
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Bexruz Boynazarovning amaldagi xizmatlar matritsasi va shaffof narxlariga asoslangan 
            texnik arxitektura, kutilayotgan biznes ROI va aniq byudjet hisob-kitobi.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          
          {/* Quick Prompts */}
          <div className="mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Tayyor misollar orqali sinab ko'ring:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProblemText(p.text)}
                  className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-slate-700 font-medium transition cursor-pointer text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Biznesingizdagi muammo yoki yaratmoqchi bo'lgan tizimingizni yozing:
            </label>
            <textarea
              rows={4}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Masalan: Bizda o'quv markazi bor, o'quvchilar to'lovlarini va dars jadvalini qo'lda daftarda yuritayapmiz. Telegram bot orqali ota-onalarga xabar borishi, Click/Payme integratsiyasi va admin panel kerak..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 bg-white"
            />
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ismingiz (ixtiyoriy):
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Masalan: Sardor Aliyev"
                className="w-full text-xs p-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telegram yoki Telefon raqamingiz:
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="@username yoki +998 90 123 45 67"
                className="w-full text-xs p-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Barcha narxlar va muddatlar Bexruzning kafolatlangan xizmatlar matritsasiga asoslangan.
            </div>
            <button
              onClick={handleEstimate}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>AI Tahlil Qilmoqda & Smeta Hisoblanmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Yechim & Smeta Olish</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Commercial Proposal Result Card */}
        {estimate && (
          <div className="bg-white rounded-xl border-2 border-amber-300 shadow-md p-6 sm:p-8 animate-fadeIn">
            
            {/* Proposal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Rasmiy Tijoriy Taklifnoma (Commercial Proposal)
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1.5">
                  Tavsiya Etilgan Tizim Arxitekturasi & Smeta
                </h3>
              </div>
              
              <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200 px-4 py-2.5 rounded-lg">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Taxminiy Byudjet</span>
                  <div className="text-lg font-black text-slate-900">
                    ${estimate.total_price_min} – ${estimate.total_price_max}
                  </div>
                </div>
                <div className="h-8 w-px bg-amber-200"></div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bajarish Muddati</span>
                  <div className="text-sm font-bold text-amber-800">
                    {estimate.total_duration_estimate}
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis & Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Muammo Tahlili va Diagnostikasi
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {estimate.problem_diagnosis}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Tavsiya Etilayotgan Arxitektura
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {estimate.recommended_architecture}
                </p>
              </div>
            </div>

            {/* Selected Services Breakdown */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Tanlangan Asosiy Modullar & Integratsiyalar ({estimate.selected_services.length} ta)
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {estimate.selected_services.map((svc, i) => (
                  <div key={i} className="p-3.5 bg-white hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {svc.name}
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                          {svc.category}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{svc.reason}</p>
                    </div>
                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {svc.duration}
                      </span>
                      <span className="font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {svc.price_estimate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables & Business ROI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 mb-6 text-xs">
              <div>
                <h4 className="font-bold text-emerald-950 mb-2">
                  ✅ Loyiha Yakunida Siz Nimalarni Qo'lga Kiritasiz:
                </h4>
                <ul className="space-y-1.5 text-emerald-900">
                  {estimate.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-emerald-950 mb-2">
                  📈 Kutilayotgan Biznes Foydasi (ROI):
                </h4>
                <p className="text-emerald-900 leading-relaxed font-medium">
                  {estimate.business_roi}
                </p>
                <div className="mt-3 text-[11px] text-emerald-800 bg-white/70 p-2 rounded border border-emerald-200">
                  💡 Barcha tizimlar Bexruz Boynazarov nazorati ostida SOLID va High-load standartlarida topshiriladi.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              {submittedSuccess ? (
                <div className="text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Arizangiz qabul qilindi! Bexruz siz bilan tez orada bog'lanadi.
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  Ushbu taklifnoma avtomatik tarzda saqlanadi va Telegram orqali yuboriladi.
                </div>
              )}

              <button
                onClick={handleSendToBexruz}
                disabled={submittingLead}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Ushbu Yechimni Bexruz bilan Telegramda Boshlash</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
