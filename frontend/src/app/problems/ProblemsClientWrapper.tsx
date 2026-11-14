"use client";

import React, { useState } from "react";
import TwoColumnWorkspace from "@/components/TwoColumnWorkspace";
import ProblemsFeed from "@/components/ProblemsFeed";
import { ProblemItem } from "@/lib/api";
import { LayoutGrid, Columns, MessageSquare } from "lucide-react";

interface Props {
  initialProblems: ProblemItem[];
}

export default function ProblemsClientWrapper({ initialProblems }: Props) {
  const [viewMode, setViewMode] = useState<"telegram" | "feed">("telegram");

  return (
    <div>
      {/* Top Bar with Mode Switcher */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Dasturchilar Maydoni &amp; Q&amp;A
            </h1>
            <span className="hidden sm:inline-block text-xs text-slate-400">•</span>
            <span className="hidden sm:inline-block text-xs text-slate-500">
              Stack Overflow &amp; Notion uslubidagi yechimlar
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("telegram")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "telegram"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Telegram Chat Ko'rinishi</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("feed")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "feed"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Karta Ko'rinishi</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "telegram" ? (
        <TwoColumnWorkspace />
      ) : (
        <div className="py-6">
          <ProblemsFeed initialProblems={initialProblems} />
        </div>
      )}
    </div>
  );
}
