"use client";

import { useEffect, useState } from "react";
import HeroGateway from "@/components/HeroGateway";
import BusinessSolutionsGrid from "@/components/BusinessSolutionsGrid";
import AIBusinessEstimator from "@/components/AIBusinessEstimator";
import ServicesPricingTable from "@/components/ServicesPricingTable";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import ProblemsFeed from "@/components/ProblemsFeed";
import { fetchServices, fetchProjects, fetchProblems, ServiceItem, ProjectItem, ProblemItem } from "@/lib/api";
import { Sparkles, Layers, Briefcase, HelpCircle, LayoutGrid } from "lucide-react";

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<"business" | "developer">("business");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync mode with localStorage & role-changed event
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("devbexruz_user_role") as "business" | "developer" | null;
      if (savedRole) {
        setActiveMode(savedRole);
      }
    }

    const handleRoleChanged = (e: any) => {
      if (e.detail && (e.detail === "business" || e.detail === "developer")) {
        setActiveMode(e.detail);
      }
    };
    window.addEventListener("role-changed", handleRoleChanged);
    return () => window.removeEventListener("role-changed", handleRoleChanged);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [servRes, projRes, probRes] = await Promise.allSettled([
          fetchServices(),
          fetchProjects(),
          fetchProblems(),
        ]);
        if (servRes.status === "fulfilled") setServices(servRes.value);
        if (projRes.status === "fulfilled") setProjects(projRes.value);
        if (probRes.status === "fulfilled") setProblems(probRes.value);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Dual Mode Hero */}
      <HeroGateway activeMode={activeMode} setActiveMode={setActiveMode} />

      {/* Sticky Quick-Navigation Jump Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/90 py-2.5 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 hidden md:inline">
              Bo'limlarga tezkor o'tish:
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto py-0.5">
            <a
              href="#business-solutions"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
              <span>01. Biznes Yechimlar</span>
            </a>

            <a
              href="#estimator"
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>02. AI Smeta</span>
            </a>

            <a
              href="#services"
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>03. Xizmatlar &amp; Narxlar</span>
            </a>

            <a
              href="#projects"
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>04. Real Loyihalar</span>
            </a>

            <a
              href="#problems"
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>05. Dev Muammolar (Q&amp;A)</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 01: Comprehensive Business Solutions Grid (CRM, Bot, Web, Mobile, Hardware, 1C) */}
      <BusinessSolutionsGrid />

      {/* SECTION 02: AI Business Estimator */}
      <div id="estimator" className="scroll-mt-28">
        <AIBusinessEstimator />
      </div>

      {/* SECTION 03: Transparent Services & Pricing Matrix */}
      <div id="services" className="scroll-mt-28 border-t border-slate-200 bg-white">
        <ServicesPricingTable services={services} />
      </div>

      {/* SECTION 04: Projects & Achievements Showcase */}
      <div id="projects" className="scroll-mt-28 border-t border-slate-200 bg-slate-50/70">
        <ProjectsShowcase projects={projects} />
      </div>

      {/* SECTION 05: Developer Q&A Community Feed */}
      <div id="problems" className="scroll-mt-28 border-t border-slate-200 bg-white">
        <ProblemsFeed initialProblems={problems} />
      </div>
    </div>
  );
}
