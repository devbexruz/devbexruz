"use client";

import { useEffect, useState } from "react";
import HeroGateway from "@/components/HeroGateway";
import AIBusinessEstimator from "@/components/AIBusinessEstimator";
import ServicesPricingTable from "@/components/ServicesPricingTable";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import ProblemsFeed from "@/components/ProblemsFeed";
import { fetchServices, fetchProjects, fetchProblems, ServiceItem, ProjectItem, ProblemItem } from "@/lib/api";
import { Sparkles, Layers, Briefcase, HelpCircle, ArrowDown } from "lucide-react";

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<"business" | "developer">("business");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [serv, proj, prob] = await Promise.all([
          fetchServices(),
          fetchProjects(),
          fetchProblems(),
        ]);
        setServices(serv);
        setProjects(proj);
        setProblems(prob);
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
      <div className="sticky top-17 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/90 py-2.5 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 hidden md:inline">
              Bo'limlarga tezkor o'tish:
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto py-0.5">
            <a
              href="#estimator"
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>01. AI Smeta</span>
            </a>

            <a
              href="#services"
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>02. Xizmatlar &amp; Narxlar</span>
            </a>

            <a
              href="#projects"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>03. Real Loyihalar</span>
            </a>

            <a
              href="#problems"
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 flex items-center gap-1.5 transition shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>04. Dev Muammolar (Q&amp;A)</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 01: AI Business Estimator */}
      <div id="estimator" className="scroll-mt-28">
        <AIBusinessEstimator />
      </div>

      {/* SECTION 02: Transparent Services & Pricing Matrix */}
      <div id="services" className="scroll-mt-28 border-t border-slate-200 bg-white">
        <ServicesPricingTable services={services} />
      </div>

      {/* SECTION 03: Projects & Achievements Showcase */}
      <div id="projects" className="scroll-mt-28 border-t border-slate-200 bg-slate-50/70">
        <ProjectsShowcase projects={projects} />
      </div>

      {/* SECTION 04: Developer Q&A Community Feed */}
      <div id="problems" className="scroll-mt-28 border-t border-slate-200 bg-white">
        <ProblemsFeed initialProblems={problems} />
      </div>
    </div>
  );
}
