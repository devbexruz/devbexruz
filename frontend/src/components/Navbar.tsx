"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Send, Search, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Bosh Sahifa" },
    { href: "/problems", label: "Dev Muammolar (Q&A)" },
    { href: "/#services", label: "Xizmatlar & Narxlar" },
    { href: "/#ai-estimator", label: "AI Smeta Generatori" },
    { href: "/about", label: "Men Haqimda" },
    { href: "/admin/seo", label: "AI SEO Boshqaruvi", badge: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-slate-800 transition">
            <Terminal className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-base tracking-tight">
              DevBexruz
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Product Engineer & Architect
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-slate-100 text-slate-950 font-bold"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://t.me/bexruzdeveloper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Bog'lanish</span>
          </a>
        </div>
      </div>
    </header>
  );
}
