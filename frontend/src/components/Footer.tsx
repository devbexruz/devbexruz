import Link from "next/link";
import { Terminal, Send, Mail, Code2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-xs shrink-0 border border-slate-800/20 bg-[#0A0F1D]">
                <img src="/icon.svg" alt="DeveloperLogic" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">DeveloperLogic Platform</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md">
              Bexruz Boynazarov — Product Engineer, Forward Deployed Engineer va Tizim Arxitektori. 
              Yuqori yuklamali backend tizimlar, AI orkestratsiya va biznes avtomatlashtirish yechimlari.
            </p>
            <div className="text-[11px] text-slate-400 font-medium">
              🎓 O'zbekiston Milliy Universiteti (O'zMU) — Amaliy Matematika Fakulteti
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Platforma</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">Bosh Sahifa (Dual Mode)</Link>
              </li>
              <li>
                <Link href="/problems" className="hover:text-blue-600 transition">Dasturchilar Q&A (Muammolar)</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-blue-600 transition">Xizmatlar & Narxlar</Link>
              </li>
              <li>
                <Link href="/#ai-estimator" className="hover:text-blue-600 transition">AI Smeta Generatori</Link>
              </li>
              <li>
                <Link href="/admin/seo" className="hover:text-blue-600 transition">AI SEO Boshqaruvi</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Aloqa & Tarmoqlar</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="https://t.me/bexruzdeveloper" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition">
                  <Send className="w-3.5 h-3.5 text-blue-500" /> Telegram: @bexruzdeveloper
                </a>
              </li>
              <li>
                <a href="https://github.com/devbexruz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition">
                  <Code2 className="w-3.5 h-3.5" /> GitHub: devbexruz
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/bexruzdeveloper" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition">
                  <Globe className="w-3.5 h-3.5 text-blue-700" /> LinkedIn Profil
                </a>
              </li>
              <li>
                <a href="https://leetcode.com/bexruzdeveloper" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-amber-600 transition">
                  <Code2 className="w-3.5 h-3.5 text-amber-500" /> LeetCode Profil
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
          <p>© 2026 DevBexruz. Barcha huquqlar himoyalangan.</p>
          <p className="font-medium text-slate-500">
            Arxitektura: Next.js 15 + FastAPI + PostgreSQL (Decoupled & High-load Resilience)
          </p>
        </div>
      </div>
    </footer>
  );
}
