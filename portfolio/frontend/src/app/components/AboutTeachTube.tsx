import { PlayCircle, Presentation, ArrowRight, Sparkles } from 'lucide-react';

export default function HomeTeachTubeSection() {
  return (<section className="relative py-24 px-6 overflow-hidden bg-black/20">
  {/* Dekorativ gradient blurlar – loyihaga mos ohangda */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px]" />
  </div>

  <div className="max-w-7xl mx-auto text-center space-y-8">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm mb-4">
      <Sparkles className="w-4 h-4 text-yellow-400" />
      <span>Interaktiv video tajriba</span>
    </div>

    {/* Sarlavha */}
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
      Yangi Loyiha <br />
      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Teach Tube
      </span>
    </h1>

    {/* Tavsif */}
    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
      Video endi shunchaki media emas – vaqtga bog‘langan hujjatlar, doskalar va 
      interaktiv elementlar bilan boyitilgan to‘laqonli ish muhiti.
    </p>

    {/* Tugmalar */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
      <a href="/teachtube" className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
        <PlayCircle className="w-6 h-6" />
        <span>Interaktiv demo</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </a>

      <a href="/teachtube/presentation" className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-white font-semibold text-lg hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300">
        <Presentation className="w-6 h-6 text-purple-400" />
        <span>Taqdimot</span>
        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </a>
    </div>

    {/* Status qatori – loyiha xususiyatlari */}
    <div className="pt-8 flex justify-center gap-8 text-gray-500 text-sm">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Vaqtga bog‘langan elementlar
      </span>
      <span>📄 Interaktiv hujjatlar & doskalar</span>
      <span>📐 Moslashuvchan masshtab tizimi</span>
    </div>
  </div>
</section>
  );
}