"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Send,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  LogIn,
  UserPlus,
  Sparkles,
  Building2,
  ChevronDown,
  PlusCircle
} from "lucide-react";
import AuthModal from "./AuthModal";
import RoleSelectModal from "./RoleSelectModal";
import NewProblemModal from "./NewProblemModal";
import { getAuthSession, clearAuthSession, AuthUser } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "telegram" | "google">("login");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [problemModalOpen, setProblemModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<"business" | "developer">("business");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync auth & role state
  const syncState = () => {
    const session = getAuthSession();
    setCurrentUser(session.user);
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("devbexruz_user_role") as "business" | "developer" | null;
      if (savedRole) {
        setUserRole(savedRole);
      } else if (session.user?.role === "business" || session.user?.role === "developer") {
        setUserRole(session.user.role);
      }
    }
  };

  useEffect(() => {
    syncState();
    window.addEventListener("auth-changed", syncState);
    const handleRoleChanged = (e: any) => {
      if (e.detail) setUserRole(e.detail);
    };
    window.addEventListener("role-changed", handleRoleChanged);
    return () => {
      window.removeEventListener("auth-changed", syncState);
      window.removeEventListener("role-changed", handleRoleChanged);
    };
  }, []);

  const openAuth = (mode: "login" | "register" | "telegram" | "google") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
  };

  const navLinks = [
    { href: "/", label: "Asosiy" },
    { href: "/#estimator", label: "AI Smeta" },
    { href: "/#services", label: "Xizmatlar" },
    { href: "/problems", label: "Muammolar" },
    { href: "/about", label: "Muhandis" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">

            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0 border border-slate-800/20 bg-[#0A0F1D]">
                <img src="/icon.svg" alt="DeveloperLogic" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-950 text-sm sm:text-base tracking-tight group-hover:text-blue-900 transition leading-none">
                  DeveloperLogic
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                  Systems &amp; AI Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? "bg-slate-100 text-blue-900 font-bold"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Center/Right Action: Role Badge & New Problem Button */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Role Switcher Pill */}
              <button
                onClick={() => setRoleModalOpen(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  userRole === "business"
                    ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                    : "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
                }`}
                title="Rolni o'zgartirish"
              >
                {userRole === "business" ? (
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>{userRole === "business" ? "Biznesmen" : "Dasturchi"}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Gemini AI New Problem Button */}
              <button
                onClick={() => setProblemModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300/80 transition shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Yangi muammo (AI)</span>
              </button>
            </div>

            {/* Right Action: User Auth & Contact */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {/* If Logged In */}
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-50 py-1 px-2.5 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                    {currentUser.avatar_url ? (
                      <img src={currentUser.avatar_url} alt={currentUser.full_name || ""} className="w-full h-full object-cover" />
                    ) : (
                      (currentUser.full_name || currentUser.username).charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-none">
                      {currentUser.full_name || currentUser.username}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {currentUser.role === "admin" ? "Admin" : (userRole === "business" ? "Biznesmen" : "Dasturchi")}
                    </span>
                  </div>

                  {currentUser.role === "admin" && (
                    <Link
                      href="/admin/seo"
                      className="ml-1 p-1.5 rounded-lg text-amber-700 hover:bg-amber-100/70 text-xs font-bold transition"
                      title="AI SEO Boshqaruvi"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Chiqish"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* If Not Logged In */
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openAuth("login")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kirish</span>
                  </button>

                  <button
                    onClick={() => openAuth("register")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition active:scale-[0.98] cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Ro'yxatdan o'tish</span>
                  </button>
                </div>
              )}

              {/* Telegram Icon Button */}
              <a
                href="https://t.me/bexruzdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-sky-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-100 transition"
                title="Telegram orqali bog'lanish"
              >
                <Send className="w-4 h-4" />
              </a>

            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setProblemModalOpen(true)}
                className="p-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
                title="Yangi muammo yozish"
              >
                <Sparkles className="w-5 h-5 text-amber-600" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
            {/* Mobile Role Switcher */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Sizning rolingiz:</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRoleModalOpen(true);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                  userRole === "business"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-blue-100 text-blue-900 border-blue-300"
                }`}
              >
                {userRole === "business" ? <Building2 className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                <span>{userRole === "business" ? "Biznesmen" : "Dasturchi"}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      isActive ? "bg-slate-100 text-blue-900 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile New Problem Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setProblemModalOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Yangi muammo yozish (Gemini AI)</span>
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              {currentUser ? (
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {(currentUser.full_name || currentUser.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">
                        {currentUser.full_name || currentUser.username}
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {currentUser.role === "admin" ? "Admin" : (userRole === "business" ? "Biznesmen" : "Dasturchi")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold"
                  >
                    Chiqish
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openAuth("login")}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 text-center"
                  >
                    Kirish
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold text-center"
                  >
                    Ro'yxatdan o'tish
                  </button>
                </div>
              )}

              <a
                href="https://t.me/bexruzdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200"
              >
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>Telegram orqali bog'lanish</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={(user) => {
          setCurrentUser(user);
          // When user logs in, show Role modal so they can confirm/choose Biznesmen or Dasturchi!
          setRoleModalOpen(true);
        }}
      />

      {/* Role Selection Modal */}
      <RoleSelectModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onRoleSelected={(r) => {
          setUserRole(r);
        }}
      />

      {/* New Problem Modal (Gemini AI Polish) */}
      <NewProblemModal
        isOpen={problemModalOpen}
        onClose={() => setProblemModalOpen(false)}
        onProblemCreated={(p) => {
          window.dispatchEvent(new CustomEvent("problem-created", { detail: p }));
        }}
      />
    </>
  );
}
