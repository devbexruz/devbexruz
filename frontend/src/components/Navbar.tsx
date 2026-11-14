"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Sparkles,
  Send,
  Layers,
  HelpCircle,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  LogIn,
  UserPlus
} from "lucide-react";
import AuthModal from "./AuthModal";
import { getAuthSession, clearAuthSession, AuthUser } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "telegram" | "google">("register");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync auth state
  const syncAuth = () => {
    const session = getAuthSession();
    setCurrentUser(session.user);
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener("auth-changed", syncAuth);
    return () => window.removeEventListener("auth-changed", syncAuth);
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
    { href: "/", label: "Bosh sahifa", icon: Code2 },
    { href: "/#estimator", label: "AI Smeta Hisoblash", icon: Sparkles, highlight: true },
    { href: "/#services", label: "Xizmatlar & Narxlar", icon: Layers },
    { href: "/problems", label: "Dev Muammolar (Q&A)", icon: HelpCircle },
    { href: "/about", label: "Muhandis Haqida", icon: UserIcon },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-17">

            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-blue-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Code2 className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-950 text-base tracking-tight group-hover:text-blue-900 transition">
                    DEVELOPER LOGIC
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60">
                    AI &amp; System
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Bexruz Boynazarov · Forward Deployed Architect
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-xl border border-slate-200/60">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white text-blue-900 shadow-2xs border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${link.highlight ? "text-amber-500 animate-pulse" : "text-slate-500"}`} />
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action: User Auth & Contact */}
            <div className="hidden sm:flex items-center gap-2.5">
              
              {/* If Logged In */}
              {currentUser ? (
                <div className="flex items-center gap-2.5 bg-slate-50 py-1 px-2.5 rounded-xl border border-slate-200">
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
                      {currentUser.role === "admin" ? "Admin" : "Dasturchi"}
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuth("login")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kirish</span>
                  </button>

                  <button
                    onClick={() => openAuth("register")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 shadow-2xs transition active:scale-[0.98] cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ro'yxatdan o'tish</span>
                  </button>
                </div>
              )}

              {/* Direct Telegram Chat Button */}
              <a
                href="https://t.me/bexruzdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition"
              >
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden md:inline">Telegram</span>
              </a>

            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
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
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold ${
                      isActive ? "bg-blue-50 text-blue-900" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {(currentUser.full_name || currentUser.username).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{currentUser.full_name || currentUser.username}</div>
                      <div className="text-[10px] text-slate-500">{currentUser.email}</div>
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
                    className="py-2.5 px-3 rounded-xl bg-blue-700 text-white text-xs font-bold text-center"
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
        }}
      />
    </>
  );
}
