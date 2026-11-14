"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  User,
  Bell,
  Cpu,
} from "lucide-react";
import TwoColumnWorkspace from "@/components/TwoColumnWorkspace";
import NotificationPermissionPrompt from "@/components/NotificationPermissionPrompt";
import { getAuthSession, updateUserRole } from "@/lib/api";

export default function DeveloperDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const session = getAuthSession();
    if (session.user) {
      setCurrentUser(session.user);
    }
  }, []);

  const handleSwitchToBusiness = async () => {
    try {
      await updateUserRole("business");
      window.location.href = "/dashboard/business";
    } catch {
      window.location.href = "/dashboard/business";
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner / Hero for Developer */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Terminal className="w-3.5 h-3.5" /> Dasturchilar Maydoni
                </span>
                <span className="text-xs text-slate-400">
                  Stack Overflow & Notion uslubida Q&A
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Salom, {currentUser?.full_name || currentUser?.username || "Dasturchi"}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Bu yerda texnik muammolarga yechim toping, Telegram uslubidagi chat-lentada mavzularni ko'ring,
                Notion editor yordamida o'z tajribangizni tutorial sifatida bo'lishing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSwitchToBusiness}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Biznes rejimiga o'tish</span>
              </button>

              <Link
                href="/about"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-xs transition"
              >
                <span>Bexruz Carier & Blog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Web Push Notification Permission Prompt */}
        <NotificationPermissionPrompt />

        {/* Telegram-style 2-Column Workspace Component */}
        <TwoColumnWorkspace />
      </div>
    </div>
  );
}
