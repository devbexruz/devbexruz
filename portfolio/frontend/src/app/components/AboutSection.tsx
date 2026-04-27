import { CheckCircle2, Code, Brain, Database, Cpu, Globe, Rocket, Terminal, Layers } from 'lucide-react';

export default function AboutSection() {
  const techStack = [
    { name: 'Languages', icons: ['Python', 'JavaScript', 'C#', 'HTML5', 'CSS3'], color: 'from-yellow-400 to-orange-500' },
    { name: 'Backend & Frameworks', icons: ['FastAPI', 'Django', 'Flask', 'ASP.NET Core'], color: 'from-green-400 to-emerald-600' },
    { name: 'AI / ML / LLM', icons: ['HuggingFace', 'PyTorch', 'OpenAI', 'Transformers', 'LangChain'], color: 'from-blue-500 to-indigo-600' },
    { name: 'Databases', icons: ['PostgreSQL', 'MySQL', 'SQLite', 'Redis'], color: 'from-cyan-400 to-blue-500' },
    { name: 'DevOps & Tools', icons: ['Docker', 'Git', 'Linux', 'Celery', 'Nginx'], color: 'from-slate-400 to-slate-600' },
    { name: 'Bots & Automation', icons: ['Aiogram', 'BeautifulSoup', 'Selenium'], color: 'from-purple-400 to-pink-500' },
  ];

  const services = [
    { title: 'Backend Optimization', desc: 'High-performance APIs, query tuning, caching strategies' },
    { title: 'API Integration', desc: 'RESTful, GraphQL, third-party & internal API design' },
    { title: 'AI/ML Engineering', desc: 'HuggingFace, Transformers, LLM endpoints, model serving' },
    { title: 'Clean Architecture', desc: 'OOP, SOLID, Design Patterns, Code Review culture' },
    { title: 'Database Expertise', desc: 'PostgreSQL optimization, migrations, indexing' },
    { title: 'Automation & Scraping', desc: 'Telegram bots, web scraping, task automation' },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black/20">
      <div className="max-w-7xl mx-auto">
        
        {/* --- ABOUT ME --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start mb-32">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              <Terminal className="text-blue-500" /> 🧑💻 About Me
            </h2>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Men O'zbekistondan bo'lgan <span className="text-white font-semibold">Backend & AI/ML Developer</span>man. 
                Intellektual va yuqori samarali tizimlarni qurishga chuqur qiziqaman.
              </p>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex gap-3"><Rocket className="w-5 h-5 text-blue-500 shrink-0" /> <span><b>Hozirda:</b> FastAPI, LLM va HuggingFace orqali AI-backend servislar ustida ishlayapman.</span></li>
                <li className="flex gap-3"><Brain className="w-5 h-5 text-purple-500 shrink-0" /> <span><b>O'rganyapman:</b> PyTorch modeli optimizatsiyasi va LLM fine-tuning.</span></li>
                <li className="flex gap-3"><Layers className="w-5 h-5 text-emerald-500 shrink-0" /> <span><b>Hamkorlik:</b> Open-source AI tools va NLP loyihalar uchun ochiqman.</span></li>
              </ul>
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="italic text-gray-500 italic text-sm">
                  "Eng yaxshi kod — bu hech kim tushuntirishi shart bo'lmagan koddir. Clean Code bu qoida emas, hayot tarzi."
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              <Cpu className="text-purple-500" /> 🛠️ Tech Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techStack.map((tech) => (
                <div key={tech.name} className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all hover:bg-white/5">
                  <h3 className={`text-transparent bg-clip-text bg-gradient-to-r ${tech.color} font-bold mb-4 uppercase text-xs tracking-widest`}>
                    {tech.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tech.icons.map((icon) => (
                      <span key={icon} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-medium">
                        {icon}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- WHAT I BRING TO THE TABLE --- */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">💼 Professional Capabilities</h2>
            <p className="text-gray-500 max-w-2xl mx-auto italic">Nimalarni taqdim eta olaman?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-blue-500/30 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
