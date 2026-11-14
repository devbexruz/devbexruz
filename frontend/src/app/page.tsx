"use client";

import { useEffect, useState } from "react";
import HeroGateway from "@/components/HeroGateway";
import AIBusinessEstimator from "@/components/AIBusinessEstimator";
import ServicesPricingTable from "@/components/ServicesPricingTable";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import ProblemsFeed from "@/components/ProblemsFeed";
import { fetchServices, fetchProjects, fetchProblems, ServiceItem, ProjectItem, ProblemItem } from "@/lib/api";

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
    <div className="bg-white">
      {/* Dual Mode Hero */}
      <HeroGateway activeMode={activeMode} setActiveMode={setActiveMode} />

      {/* Mode-specific content */}
      {activeMode === "business" ? (
        <>
          {/* AI Estimator is the centerpiece of the Business mode */}
          <AIBusinessEstimator />

          {/* Founder Projects Showcase */}
          <ProjectsShowcase projects={projects} />

          {/* Transparent Services & Pricing Matrix */}
          <ServicesPricingTable services={services} />
        </>
      ) : (
        <>
          {/* Developer Community Q&A Feed */}
          <ProblemsFeed initialProblems={problems} />

          {/* Transparent Services as a reference for architecture */}
          <ServicesPricingTable services={services} />
        </>
      )}
    </div>
  );
}
