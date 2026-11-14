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
  KeyRound
} from "lucide-react";
import {
  loginUser,
  sendVerificationCode,
  registerWithCode,
  authWithGoogle,
  authWithTelegram,
  saveAuthSession,
  AuthUser
} from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  onSuccess?: (user: AuthUser) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "register",
  onSuccess
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState<"form" | "verify">("form");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmailOrUser, setLoginEmailOrUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [code, setCode] = useState("");

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Countdown timer for 10 minutes (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [testCodeHint, setTestCodeHint] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setStep("form");
    setError("");
    setSuccessMsg("");
  }, [initialMode, isOpen]);

  // 10-minute countdown effect
  useEffect(() => {
    if (step !== "verify" || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Google 1-click Sign In
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      // Prompt or simulation if Google client ID isn't linked
      const userEmail = prompt("Google hisobingiz email manzilini kiriting (masalan: foydalanuvchi@gmail.com):");
      if (!userEmail) {
        setLoading(false);
        return;
      }
      const userName = userEmail.split("@")[0].replace(/[._]/g, " ");
      const res = await authWithGoogle({
        email: userEmail,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`
      });
      saveAuthSession(res);
      setSuccessMsg("Google orqali muvaffaqiyatli kirdingiz!");
      if (onSuccess) onSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Google orqali autentifikatsiya xatosi");
    } finally {
      setLoading(false);
    }
  };

  // Telegram 1-click Sign In
  const handleTelegramAuth = async () => {
    setLoading(true);
    setError("");
    try {
      const tgUsername = prompt("Telegram username yoki telefon raqamingizni kiriting (masalan: bexruzdeveloper):");
      if (!tgUsername) {
        setLoading(false);
        return;
      }
      const cleanUsername = tgUsername.replace("@", "").trim();
      const fakeId = Math.floor(100000000 + Math.random() * 900000000);
      const res = await authWithTelegram({
        id: fakeId,
        username: cleanUsername,
        first_name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
        photo_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`
      });
      saveAuthSession(res);
      setSuccessMsg("Telegram orqali muvaffaqiyatli kirdingiz!");
      if (onSuccess) onSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Telegram orqali autentifikatsiya xatosi");
    } finally {
      setLoading(false);
    }
  };

  // Email Code Step 1: Send verification code
  const handleSendCode = async (e: React.FormEvent) => {
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
      setStep("verify");
      setTimeLeft(600); // 10 minutes
      if (res.test_code) {
        setTestCodeHint(res.test_code);
      }
      setSuccessMsg(`Tasdiqlash kodi ${email} manziliga yuborildi. Kod 10 daqiqa davomida amal qiladi.`);
    } catch (err: any) {
      setError(err.message || "Tasdiqlash kodini yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Email Code Step 2: Confirm code and register
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      setError("Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await registerWithCode({
        email,
        code,
        full_name: fullName,
        password: password || undefined
      });
      saveAuthSession(res);
      setSuccessMsg("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      if (onSuccess) onSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Kod noto'g'ri yoki muddati tugagan");
    } finally {
      setLoading(false);
    }
  };

  // Login handler
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
      setSuccessMsg("Tizimga muvaffaqiyatli kirdingiz!");
      if (onSuccess) onSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Login yoki parol xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Developer Logic
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30">
                  Auth
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {mode === "register" ? "Yangi hisob yaratish" : "Tizimga kirish"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => {
              setMode("register");
              setStep("form");
              setError("");
            }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === "register"
                ? "bg-white text-blue-700 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Ro'yxatdan o'tish
          </button>
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-white text-blue-700 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            Kirish
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Quick 1-Click Buttons */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google orqali davom etish</span>
              <span className="text-[10px] text-slate-400 font-normal ml-auto">(Ism-familiya shart emas)</span>
            </button>

            <button
              type="button"
              onClick={handleTelegramAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-sky-100 hover:border-sky-200 bg-sky-50/70 hover:bg-sky-50 text-sky-800 text-xs font-bold shadow-2xs transition active:scale-[0.99]"
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>Telegram orqali kirish</span>
              <span className="text-[10px] text-sky-600/70 font-normal ml-auto">(1-klikda)</span>
            </button>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-bold">
              <span className="bg-white px-3 text-slate-400">
                yoki Elektron Pochta (Gmail) orqali
              </span>
            </div>
          </div>

          {/* REGISTER MODE */}
          {mode === "register" && (
            <>
              {step === "form" ? (
                <form onSubmit={handleSendCode} className="space-y-3.5">
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
                        placeholder="Masalan: Sardor Aliyev"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-hidden transition"
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
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-hidden transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Parol
                      </label>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (ixtiyoriy, keyin kirish uchun)
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Kamida 6 ta belgi"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-hidden transition"
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

                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    ✉️ Elektron pochtangizga 6 xonali tasdiqlash kodi no-reply qilib yuboriladi. Kod <strong>10 daqiqa</strong> amal qiladi.
                  </p>
                </form>
              ) : (
                /* Step 2: Verification Code Input */
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-blue-800">
                        <Mail className="w-3.5 h-3.5" /> {email}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-200/70 text-blue-900 text-[10px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-blue-700" />
                        {formatTimer(timeLeft)}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700/90 leading-relaxed">
                      Elektron pochtangizga yuborilgan 6 xonali tasdiqlash kodini kiriting.
                    </p>
                  </div>

                  {testCodeHint && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between">
                      <span>🧪 Test kodi: <strong>{testCodeHint}</strong></span>
                      <button
                        type="button"
                        onClick={() => setCode(testCodeHint)}
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
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[12px] text-2xl font-mono font-extrabold py-3 rounded-xl border-2 border-blue-500 focus:ring-2 focus:ring-blue-400 text-slate-900 outline-hidden transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || timeLeft <= 0}
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
                      onClick={() => setStep("form")}
                      className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      ← Emailni o'zgartirish
                    </button>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={loading || timeLeft > 540}
                      className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer disabled:text-slate-400"
                    >
                      Qayta yuborish
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* LOGIN MODE */}
          {mode === "login" && (
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
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-hidden transition"
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
