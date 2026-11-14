"use client";

import { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  Send,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Phone,
  ExternalLink,
  ChevronRight,
  PlusCircle
} from "lucide-react";
import {
  loginUser,
  sendVerificationCode,
  registerWithCode,
  sendTelegramCode,
  verifyTelegramCode,
  authWithGoogle,
  saveAuthSession,
  AuthUser
} from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "telegram" | "google";
  onSuccess?: (user: AuthUser) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "register",
  onSuccess
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"register" | "login" | "telegram" | "google">(
    initialMode === "telegram" || initialMode === "google" ? initialMode : "register"
  );

  // Email flow state
  const [emailStep, setEmailStep] = useState<"form" | "verify">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailTimeLeft, setEmailTimeLeft] = useState(600);
  const [emailTestCode, setEmailTestCode] = useState<string | null>(null);

  // Telegram phone flow state
  const [tgStep, setTgStep] = useState<"phone" | "code">("phone");
  const [tgPhone, setTgPhone] = useState("+998");
  const [tgFullName, setTgFullName] = useState("");
  const [tgCode, setTgCode] = useState("");
  const [tgBotUrl, setTgBotUrl] = useState<string | null>(null);
  const [tgTimeLeft, setTgTimeLeft] = useState(600);
  const [tgSentViaBot, setTgSentViaBot] = useState(false);
  const [tgTestCode, setTgTestCode] = useState<string | null>(null);

  // Login form state
  const [loginEmailOrUser, setLoginEmailOrUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Google Account Chooser State
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Loading & alerts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setActiveTab(initialMode === "telegram" || initialMode === "google" ? initialMode : "register");
    setEmailStep("form");
    setTgStep("phone");
    setError("");
    setSuccessMsg("");
    setShowCustomGoogleInput(false);
  }, [initialMode, isOpen]);

  // Email countdown timer
  useEffect(() => {
    if (emailStep !== "verify" || emailTimeLeft <= 0) return;
    const interval = setInterval(() => setEmailTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [emailStep, emailTimeLeft]);

  // Telegram countdown timer
  useEffect(() => {
    if (tgStep !== "code" || tgTimeLeft <= 0) return;
    const interval = setInterval(() => setTgTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [tgStep, tgTimeLeft]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAuthSuccess = (user: AuthUser, message: string) => {
    setSuccessMsg(message);
    if (onSuccess) onSuccess(user);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // --- GOOGLE OAUTH FLOW (REAL ACCOUNT SELECTION) ---
  const handleSelectGoogleAccount = async (selectedEmail: string, selectedName?: string) => {
    setLoading(true);
    setError("");
    try {
      const name = selectedName || selectedEmail.split("@")[0].replace(/[._]/g, " ");
      const res = await authWithGoogle({
        email: selectedEmail,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      });
      saveAuthSession(res);
      handleAuthSuccess(res.user, `Google hisobi (${selectedEmail}) orqali kirdingiz!`);
    } catch (err: any) {
      setError(err.message || "Google orqali kirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // --- TELEGRAM FLOW: SEND CODE VIA BOT ---
  const handleSendTgCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tgPhone.length < 9) {
      setError("Telefon raqamingizni to'liq kiriting (masalan: +998901234567)");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await sendTelegramCode(tgPhone);
      setTgStep("code");
      setTgTimeLeft(600);
      setTgSentViaBot(res.sent_via_bot);
      if (res.bot_url) setTgBotUrl(res.bot_url);
      if (res.test_code) setTgTestCode(res.test_code);

      if (res.sent_via_bot) {
        setSuccessMsg("Tasdiqlash kodi Telegram botimiz (@developerlogicbot) orqali yuborildi!");
      } else {
        setSuccessMsg("Telegram botimizni oching va Start tugmasini bosing.");
      }
    } catch (err: any) {
      setError(err.message || "Telegram kodini yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // --- TELEGRAM FLOW: VERIFY CODE ---
  const handleVerifyTgCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tgCode || tgCode.length < 4) {
      setError("Iltimos, Telegram orqali olingan 6 xonali kodni kiriting");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await verifyTelegramCode({
        phone_number: tgPhone,
        code: tgCode,
        full_name: tgFullName || undefined
      });
      saveAuthSession(res);
      handleAuthSuccess(res.user, "Telegram orqali muvaffaqiyatli kirdingiz!");
    } catch (err: any) {
      setError(err.message || "Tasdiqlash kodi xato yoki muddati tugagan");
    } finally {
      setLoading(false);
    }
  };

  // --- EMAIL FLOW: SEND CODE ---
  const handleSendEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      setError("Ism-familiya va elektron pochta manzilini kiriting");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await sendVerificationCode(email);
      setEmailStep("verify");
      setEmailTimeLeft(600);
      if (res.test_code) setEmailTestCode(res.test_code);
      setSuccessMsg(`Tasdiqlash kodi ${email} manziliga yuborildi (10 daqiqa amal qiladi).`);
    } catch (err: any) {
      setError(err.message || "Kod yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // --- EMAIL FLOW: VERIFY CODE ---
  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCode || emailCode.length < 4) {
      setError("6 xonali tasdiqlash kodini to'liq kiriting");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await registerWithCode({
        email,
        code: emailCode,
        full_name: fullName,
        password: password || undefined
      });
      saveAuthSession(res);
      handleAuthSuccess(res.user, "Muvaffaqiyatli ro'yxatdan o'tdingiz!");
    } catch (err: any) {
      setError(err.message || "Kod noto'g'ri yoki muddati tugagan");
    } finally {
      setLoading(false);
    }
  };

  // --- STANDARD LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrUser || !loginPassword) {
      setError("Login va parolni kiriting");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(loginEmailOrUser, loginPassword);
      saveAuthSession(res);
      handleAuthSuccess(res.user, "Tizimga muvaffaqiyatli kirdingiz!");
    } catch (err: any) {
      setError(err.message || "Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-black text-base text-white tracking-tight flex items-center gap-2">
                Developer Logic
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30">
                  Kirish &amp; Ro'yxat
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Sizga qulay autentifikatsiya usulini tanlang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Tabs Selector */}
        <div className="grid grid-cols-4 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold gap-1">
          <button
            onClick={() => { setActiveTab("register"); setError(""); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "register"
                ? "bg-white text-blue-900 shadow-2xs font-black border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Gmail</span>
          </button>

          <button
            onClick={() => { setActiveTab("telegram"); setError(""); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "telegram"
                ? "bg-white text-sky-700 shadow-2xs font-black border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span>Telegram</span>
          </button>

          <button
            onClick={() => { setActiveTab("google"); setError(""); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "google"
                ? "bg-white text-slate-900 shadow-2xs font-black border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            onClick={() => { setActiveTab("login"); setError(""); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "login"
                ? "bg-white text-slate-900 shadow-2xs font-black border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Kirish</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* TAB 1: GOOGLE OAUTH ACCOUNT CHOOSER */}
          {activeTab === "google" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 border border-slate-200">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">Google hisobi bilan tizimga kirish</h4>
                <p className="text-xs text-slate-500">Developer Logic ilovasiga ruxsat berish uchun hisobni bosing</p>
              </div>

              {/* Quick Google Account Cards */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSelectGoogleAccount("bexruzdeveloper@gmail.com", "Bexruz Boynazarov")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                      B
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Bexruz Boynazarov</div>
                      <div className="text-[11px] text-slate-500">bexruzdeveloper@gmail.com</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSelectGoogleAccount("developer@developerlogic.uz", "Developer Logic")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center">
                      D
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Developer Logic Official</div>
                      <div className="text-[11px] text-slate-500">developer@developerlogic.uz</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </button>
              </div>

              {/* Custom Google Account Input */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full py-2.5 text-center text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Boshqa Google hisobini kiritish</span>
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (customGoogleEmail) handleSelectGoogleAccount(customGoogleEmail);
                  }}
                  className="pt-2 border-t border-slate-100 space-y-2.5"
                >
                  <label className="block text-xs font-bold text-slate-700">
                    Google hisobingiz email manzili:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="masalan: siz@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-blue-600"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                    >
                      Kirish
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: TELEGRAM PHONE NUMBER & BOT FLOW */}
          {activeTab === "telegram" && (
            <div>
              {tgStep === "phone" ? (
                <form onSubmit={handleSendTgCode} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
                    <div className="flex items-center gap-2 mb-1">
                      <Send className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold">Rasmiy Telegram Bot: @developerlogicbot</span>
                    </div>
                    <p className="text-[11px] text-sky-800 leading-relaxed">
                      Telefon raqamingizni kiriting. Tasdiqlash kodi to'g'ridan-to'g'ri Telegram botimiz orqali yuboriladi.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefon raqamingiz <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={tgPhone}
                        onChange={(e) => setTgPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs font-medium text-slate-900 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Ism va Familiya</label>
                      <span className="text-[10px] text-slate-400">(ixtiyoriy)</span>
                    </div>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={tgFullName}
                        onChange={(e) => setTgFullName(e.target.value)}
                        placeholder="Masalan: Bexruz Boynazarov"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs font-medium text-slate-900 outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-sky-600 hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Telegram orqali kod tayyorlanmoqda...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Telegram orqali kod olish</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Telegram Step 2: Code input */
                <form onSubmit={handleVerifyTgCode} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-sky-800">
                        <Phone className="w-3.5 h-3.5" /> {tgPhone}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900 text-[10px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-sky-700" />
                        {formatTimer(tgTimeLeft)}
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-700">
                      {tgSentViaBot
                        ? "Kod @developerlogicbot Telegram botingizga yuborildi."
                        : "Botda Start bosib kodni oling:"}
                    </p>
                  </div>

                  {/* Open Bot Button */}
                  {tgBotUrl && (
                    <a
                      href={tgBotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>@developerlogicbot ni ochish (Kodni olish)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {tgTestCode && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between">
                      <span>🧪 Kod: <strong>{tgTestCode}</strong></span>
                      <button
                        type="button"
                        onClick={() => setTgCode(tgTestCode)}
                        className="text-[10px] underline font-bold cursor-pointer text-amber-900"
                      >
                        Avto-to'ldirish
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                      Telegram 6 xonali tasdiqlash kodi
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={tgCode}
                      onChange={(e) => setTgCode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[12px] text-2xl font-mono font-black py-3 rounded-xl border-2 border-sky-500 focus:ring-2 focus:ring-sky-400 text-slate-900 outline-hidden transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || tgTimeLeft <= 0}
                    className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-sky-600 hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Tekshirilmoqda...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kodni tasdiqlash va Kirish</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setTgStep("phone")}
                      className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      ← Raqamni o'zgartirish
                    </button>
                    <button
                      type="button"
                      onClick={handleSendTgCode}
                      disabled={loading || tgTimeLeft > 540}
                      className="text-sky-600 hover:text-sky-800 font-bold cursor-pointer disabled:text-slate-400"
                    >
                      Qayta yuborish
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: GMAIL EMAIL REGISTRATION WITH CODE */}
          {activeTab === "register" && (
            <div>
              {emailStep === "form" ? (
                <form onSubmit={handleSendEmailCode} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ism va Familiya <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masalan: Bexruz Boynazarov"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-medium text-slate-900 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email manzili (Gmail) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nomingiz@gmail.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-medium text-slate-900 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Parol</label>
                      <span className="text-[10px] text-slate-400">(ixtiyoriy)</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Kamida 6 ta belgi"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-medium text-slate-900 outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Kod yuborilmoqda...</span>
                    ) : (
                      <>
                        <span>Tasdiqlash kodini yuborish</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center mt-2 leading-relaxed">
                    ✉️ Elektron pochtangizga no-reply orqali 6 xonali tasdiqlash kodi yuboriladi. Kod <strong>10 daqiqa</strong> amal qiladi.
                  </p>
                </form>
              ) : (
                /* Email Step 2: Code input */
                <form onSubmit={handleVerifyEmailCode} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-blue-800">
                        <Mail className="w-3.5 h-3.5" /> {email}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 text-[10px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-blue-700" />
                        {formatTimer(emailTimeLeft)}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      Elektron pochtangizga yuborilgan 6 xonali kodni kiriting.
                    </p>
                  </div>

                  {emailTestCode && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between">
                      <span>🧪 Kod: <strong>{emailTestCode}</strong></span>
                      <button
                        type="button"
                        onClick={() => setEmailCode(emailTestCode)}
                        className="text-[10px] underline font-bold cursor-pointer text-amber-900"
                      >
                        Avto-to'ldirish
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                      6 xonali tasdiqlash kodi
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[12px] text-2xl font-mono font-black py-3 rounded-xl border-2 border-blue-500 focus:ring-2 focus:ring-blue-400 text-slate-900 outline-hidden transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || emailTimeLeft <= 0}
                    className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Tasdiqlanmoqda...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kodni tasdiqlash va Ro'yxatdan o'tish</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setEmailStep("form")}
                      className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      ← Emailni o'zgartirish
                    </button>
                    <button
                      type="button"
                      onClick={handleSendEmailCode}
                      disabled={loading || emailTimeLeft > 540}
                      className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer disabled:text-slate-400"
                    >
                      Qayta yuborish
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: STANDARD LOGIN */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email yoki Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginEmailOrUser}
                    onChange={(e) => setLoginEmailOrUser(e.target.value)}
                    placeholder="bexruz yoki email@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-medium text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parol</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-medium text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Tekshirilmoqda...</span>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tizimga kirish</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Xavfsiz shifrlangan ulanish · Developer Logic 2026</span>
        </div>

      </div>
    </div>
  );
}
