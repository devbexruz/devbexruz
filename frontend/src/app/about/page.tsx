import { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, GraduationCap, Award, Cpu, ShieldCheck, CheckCircle2, Terminal, Code2, Send, Globe, Newspaper } from "lucide-react";
import { fetchBlogs } from "@/lib/api";
import AboutBlogSection from "@/components/AboutBlogSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Bexruz Boynazarov — Product Engineer, Systems Architect, Karyera & Blog (Men Haqimda)",
  description: "Bexruz Boynazarovning 6 yillik muhandislik yo'li, O'zMU Amaliy matematika fakulteti poydevori, Agentic coding falsafasi, shaxsiy blog va yangiliklar.",
  keywords: ["Bexruz Boynazarov", "Systems Architect", "Product Engineer", "O'zMU", "FastAPI", "PostgreSQL", "CV", "Karyera blogi", "Dasturchi blogi"],
};

export default async function AboutPage() {
  const blogs = await fetchBlogs();
  const skills = [
    { category: "Arxitektura & Tamoyillar", items: ["Decoupled Microservices", "High-Load Scalability", "SOLID Principles", "Infrastructure Resilience", "Code Review"] },
    { category: "Backend & Texnologiyalar", items: ["FastAPI (Expert)", "Django / DRF", "SQLAlchemy 2.0 (Async)", "Celery", "Redis", "Asyncio"] },
    { category: "Ma'lumotlar Bazasi", items: ["PostgreSQL (Index Tuning, 40%+ Latency Drop)", "Query Optimization", "Schema Normalization"] },
    { category: "AI & Agentic Engineering", items: ["Claude (Anthropic)", "OpenAI / Codex", "Amazon Bedrock", "RAG Systems", "HuggingFace", "PyTorch"] },
    { category: "Integratsiyalar & Avtomatlashtirish", items: ["CRM Workflows", "Webhooks", "Click / Payme / Uzum", "BeautifulSoup", "Selenium Scraping"] },
    { category: "DevOps & Bulut", items: ["Docker & Compose", "Linux (Ubuntu/Debian)", "Nginx", "CI/CD", "AWS (EC2, S3, Bedrock)"] },
  ];

  const timeline = [
    {
      year: "2020 — 2021",
      title: "Backend Muhandisligi & Ma'lumotlar Bazalari",
      desc: "Python (Django, Flask, FastAPI) va PostgreSQL asosida mustahkam poydevor qurish. Algoritmlar va ma'lumotlar tuzilmalarini chuqur o'rganish."
    },
    {
      year: "2022 — 2023",
      title: "Yuqori Yuklamali Savdo Platformasi (NoreStyle Marketplace)",
      desc: "Katta trafikli e-commerce tizimi arxitekturasini loyihalash. PostgreSQL indeksatsiya strategiyasi orqali latency'ni 40% ga tushirish va Celery asinxron konveyerini o'rnatish."
    },
    {
      year: "2024",
      title: "AI / LLM & Computer Vision Integratsiyasi (Math Visual AI)",
      desc: "FastAPI va Claude/OpenAI modellarini RAG tizimi orqali ulash. Matematik hisob-kitoblarni real vaqtda 2D/3D vizualizatsiya qiluvchi tizimni ishga tushirish."
    },
    {
      year: "2025 — 2026",
      title: "Product Engineer & Forward Deployed Systems Architect",
      desc: "Agentic coding paradigmasi — AI agentlarni (Claude, Codex) boshqarish orqali loyihalarni bir necha barobar tezroq va xatosiz ishlab chiqish. Mijozlar biznes jarayonlarini to'liq avtomatlashtirish."
    }
  ];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-10 border-b border-slate-200 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
              <Terminal className="w-3.5 h-3.5 text-amber-600" />
              Founder & Systems Architect
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Bexruz Boynazarov
            </h1>
            <p className="text-sm sm:text-base font-semibold text-blue-700">
              Senior Systems Architect · Product Engineer · Forward Deployed Engineer (FDE)
            </p>
            <p className="text-xs text-slate-500 max-w-xl">
              6 yillik amaliy tajribaga ega dasturiy ta'minot arxitektori. Yuqori yuklamali tizimlar, AI/LLM integratsiyasi va biznes jarayonlarini avtomatlashtirishga ixtisoslashgan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <a
              href="/Bexruz_CV.pdf"
              download="Bexruz_Boynazarov_CV.pdf"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>CV (PDF) Yuklab Olish</span>
            </a>
            <a
              href="#blog-section"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs transition"
            >
              <Newspaper className="w-3.5 h-3.5 text-blue-600" />
              <span>Blog &amp; Postlar</span>
            </a>
            <a
              href="https://t.me/bexruzdeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Telegram Bog'lanish</span>
            </a>
          </div>
        </div>

        {/* Education Highlight Box */}
        <div className="my-10 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Oliy Ta'lim & Matematik Asos</span>
            <h3 className="text-base font-bold text-slate-950 mt-0.5">
              O'zbekiston Milliy Universiteti (O'zMU) — Amaliy Matematika Fakulteti
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Matematik modellashtirish, diskret matematika, murakkab algoritmlar va ma'lumotlar tuzilmalari. 
              Ushbu fundamental bilimlar yuqori yuklamali tizimlarda optimal so'rovlar va mustahkam arxitektura qurishda asosiy ustun bo'lib xizmat qiladi.
            </p>
          </div>
        </div>

        {/* Engineering Philosophy: Agentic Coding */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-950 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-600" />
            Muhandislik Falsafasi: Zamonaviy Agentic Coding
          </h2>
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Bugungi kunda dasturchining kuchi klaviaturada qo'lda qatorlab kod terishda emas, balki <strong>tizim arxitekturasini to'g'ri loyihalash</strong>, biznes muammosini tushunish va <strong>AI agentlarni (Claude, Codex) to'g'ri boshqarish</strong> orqali o'lchanadi.
            </p>
            <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-slate-900 font-medium text-xs">
              ⚡ <em>"Qo'lda mexanik kod yozish o'tmishda qoldi. Biz tizimni boshqaramiz, arxitekturani chizamiz, AI agentlariga aniq ko'rsatma beramiz va kod sifatini SOLID hamda High-Load tamoyillari bo'yicha qat'iy nazorat qilamiz."</em>
            </div>
            <p>
              Bu yondashuv tufayli an'anaviy ravishda 2 oy talab qiladigan murakkab backend va integratsiyalarni 2-3 haftada sifat kafolati bilan topshirish mumkin.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-950 mb-6">
            6 Yillik Tajriba & Asosiy Bosqichlar
          </h2>
          <div className="space-y-4 border-l-2 border-slate-200 pl-4 sm:pl-6 ml-2">
            {timeline.map((t, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[23px] sm:-left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-blue-600 group-hover:bg-blue-600 transition"></div>
                <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block mb-1 border border-amber-200">
                  {t.year}
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-950 mb-6">
            Texnik Ko'nikmalar & Texnologiyalar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  {s.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((item, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Showcase */}
        <section className="mb-12 p-6 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-950">
              Sertifikatlar & Professional Yutuqlar
            </h2>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            UDACITY (One Million Uzbek Coders) — Full Stack Development Track sertifikati sohibi.
          </p>
          <div className="max-w-md border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <img
              src="/it-park.jpg"
              alt="Udacity One Million Uzbek Coders Certificate"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* Section: Personal Blog & Career Posts */}
        <AboutBlogSection blogs={blogs} />

        {/* Contact CTA */}
        <div className="p-6 rounded-xl bg-slate-900 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Birgalikda Yuqori Yuklamali Tizim Qurasizmi?
            </h3>
            <p className="text-xs text-slate-300">
              Loyihangiz bo'yicha maslahat olish yoki Forward Deployed Architect sifatida ishlash uchun bemalol yozing.
            </p>
          </div>
          <a
            href="https://t.me/bexruzdeveloper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition"
          >
            <Send className="w-4 h-4" />
            <span>Telegram: @bexruzdeveloper</span>
          </a>
        </div>

      </div>
    </div>
  );
}
