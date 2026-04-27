import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import AICharacter from '../components/AIChat';
import Projects from '../components/Projects';
import AboutSection from '../components/AboutSection';
// import { Button } from '../components/ui/button';
import { BookOpen, Video, Sparkles, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black" style={{
      overflow: 'hidden'
    }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
      {/* Gradient orbs for depth */}
      <div className="absolute top-0 -left-48 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      {/* <div className="absolute top-0 -right-48 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" /> */}

      <div id="hero" className="relative z-10">
        <Hero />
      </div>

      <div className="relative z-10">
        <AboutSection />
      </div>

      <div className="relative z-10">
        <Projects />
      </div>

      <div className="relative z-10">
        <AICharacter />
      </div>

      {/* Blog va Video preview section - Premium Apple style */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Qo'shimcha Resurslar</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent py-3">
              Ko'proq o'rganing
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
              AI va zamonaviy texnologiyalar haqida chuqur bilim olish uchun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Blog preview - Glassmorphism style */}
            <Link to="/blog" className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-700 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                        Blog va Yangiliklar
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                        <span>30+ maqolalar</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span>Weekly yangilanishlar</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-8 leading-relaxed">
                    AI texnologiyalari, dasturlash tutorials va sanoat yangiliklari haqida
                    batafsil maqolalar. O'zbek va Ingliz tillarida professional content.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-400">O'qishni boshlash</span>
                    <ChevronRight className="w-5 h-5 text-purple-400 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Video preview */}
            <Link to="/videos" className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 p-8 hover:border-blue-500/30 transition-all duration-700 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Video className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                        Video Darsliklar
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                        <span>20+ video</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span>HD quality</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-8 leading-relaxed">
                    AI va dasturlash bo'yicha batafsil video qo'llanmalar.
                    Step-by-step tutorials, real loyihalar va code review.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-400">Videolarni ko'rish</span>
                    <ChevronRight className="w-5 h-5 text-blue-400 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <span>✨ Yangi kontent har hafta</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>🎯 5000+ foydalanuvchi</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>⭐ 4.9 star rating</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}