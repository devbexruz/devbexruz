import { ExternalLink, Code2, TrendingUp, Cpu, CheckCircle } from "lucide-react";
import { ProjectItem } from "@/lib/api";

interface Props {
  projects: ProjectItem[];
}

export default function ProjectsShowcase({ projects }: Props) {
  return (
    <section id="projects" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-200">
            <Cpu className="w-3.5 h-3.5" />
            Founder & Architect Loyihalar Vitrinasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Asos Solingan, Ishlab Chiqilgan va Reklama Qilingan Mahsulotlar
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Bexruz Boynazarov asos solgan yoki arxitekturasini qurgan real biznes loyihalar, texnik yutuqlar va o'lchanadigan natijalar.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div
              key={p.id || p.slug}
              className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between"
            >
              <div>
                {/* Category Badge & Links */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {p.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-900 transition p-1"
                        title="GitHub kodi"
                      >
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-600 transition p-1"
                        title="Jonli havola"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {p.summary}
                </p>

                {/* Problem & Solution Accordion-style layout */}
                <div className="space-y-3 mb-5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-0.5 text-[11px] uppercase tracking-wide">
                      🛑 Biznes Muammosi:
                    </span>
                    <p className="text-slate-600 leading-normal">{p.business_problem}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-0.5 text-[11px] uppercase tracking-wide">
                      🛠️ Texnik Arxitektura:
                    </span>
                    <p className="text-blue-950 leading-normal">{p.technical_solution}</p>
                  </div>
                </div>
              </div>

              {/* Metrics Result Banner */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 text-xs">
                  <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-900">
                      Erishilgan Natija & Metrika:
                    </span>
                    <span className="font-semibold text-slate-900">{p.metrics_results}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
