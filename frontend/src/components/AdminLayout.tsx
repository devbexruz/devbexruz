"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Sparkles, Newspaper, LogOut, ArrowLeft, LayoutDashboard, Globe } from "lucide-react";
import { getApiBase } from "@/lib/api";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetch(`${getApiBase()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(user => {
        if (!user || user.role !== "admin") {
          throw new Error("Forbidden: Not admin");
        }
        setAdminUser(user);
        setAuthorized(true);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
          Admin huquqi tekshirilmoqda...
        </span>
      </div>
    );
  }

  const tabs = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/seo", label: "AI SEO Boshqaruvi", icon: Sparkles },
    { href: "/admin/blogs", label: "Blog & Yangiliklar", icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0A0F1D] border border-slate-700 p-1 flex items-center justify-center shrink-0">
                  <img src="/icon.svg" alt="Admin" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    DeveloperLogic <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">Admin</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block -mt-0.5">
                    Control Console
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: User & Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition"
                title="Saytga o'tish"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Saytni Ko'rish</span>
              </Link>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold text-xs flex items-center justify-center">
                  {adminUser?.full_name ? adminUser.full_name[0] : "B"}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">
                    {adminUser?.full_name || "Bexruz Boynazarov"}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    SuperAdmin
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-1 p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  title="Chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-slate-900 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold ${
                  isActive ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
