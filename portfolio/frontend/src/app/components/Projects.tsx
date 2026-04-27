import { useState, useRef } from 'react';
import { ExternalLink, Github, Star, Sparkles, ChevronRight, ChevronLeft, Bot, Brain, Mic, LineChart, FileText, ShoppingBag, X } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AI Chatbot Platform',
    description: 'GPT-4 asosida ishlaydigan ko\'p tilli chatbot platformasi.',
    fullDescription: 'Biznesingiz uchun aqlli chatbot – 24/7 avtomatik muloqot, savollarga javob berish, buyurtmalarni qabul qilish. Open AI GPT-4, LangChain, FastAPI asosida qurilgan.',
    images: [
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
    ],
    tags: ['OpenAI', 'Python', 'FastAPI', 'React'],
    stars: 245,
    category: 'AI',
    icon: <Bot className="w-5 h-5" />,
    gradient: 'from-purple-500 to-pink-500',
    stats: { users: '1.2K+', responseTime: '<1s', languages: 12 },
  },
  {
    id: 2,
    title: 'ML Prediction System',
    description: 'Mahsulot narxlarini bashorat qiluvchi ML tizimi. 95% aniqlik.',
    fullDescription: 'TensorFlow va scikit-learn asosida bozor trendlarini tahlil qiladi, narxlarni oldindan bashorat qiladi.',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    ],
    tags: ['TensorFlow', 'Python', 'scikit-learn', 'PostgreSQL'],
    stars: 189,
    category: 'Machine Learning',
    icon: <Brain className="w-5 h-5" />,
    gradient: 'from-blue-500 to-cyan-500',
    stats: { accuracy: '95%', dataPoints: '1M+', models: 5 },
  },
  {
    id: 3,
    title: 'Voice Assistant',
    description: 'O\'zbek tilida ovozli yordamchi. Speech-to-text va TTS.',
    fullDescription: 'O‘zbek tilida 98% aniqlik, real-time WebRTC orqali aloqa.',
    images: [
      'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop',
    ],
    tags: ['Whisper', 'TTS', 'Node.js', 'WebRTC'],
    stars: 156,
    category: 'Voice AI',
    icon: <Mic className="w-5 h-5" />,
    gradient: 'from-emerald-500 to-teal-500',
    stats: { accuracy: '98%', latency: '<500ms', commands: 50 },
  },
  {
    id: 4,
    title: 'Smart Analytics Dashboard',
    description: 'AI-powered analytics platformasi. Real-time vizualizatsiya.',
    fullDescription: 'Biznes ko‘rsatkichlarini bir joyda kuzatib boring, AI asosida trendlarni aniqlaydi.',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    ],
    tags: ['React', 'D3.js', 'Python', 'AI'],
    stars: 203,
    category: 'Analytics',
    icon: <LineChart className="w-5 h-5" />,
    gradient: 'from-orange-500 to-red-500',
    stats: { dashboards: 15, dataSources: 10, refreshRate: 'real-time' },
  },
  {
    id: 5,
    title: 'Document AI Analyzer',
    description: 'Hujjatlarni avtomatik tahlil qiluvchi AI (OCR, NLP).',
    fullDescription: 'OCR va NLP asosida hujjatlarni avtomatik o‘qiydi, klassifikatsiya qiladi.',
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?w=600&h=400&fit=crop',
    ],
    tags: ['OCR', 'NLP', 'PyTorch', 'FastAPI'],
    stars: 178,
    category: 'Document AI',
    icon: <FileText className="w-5 h-5" />,
    gradient: 'from-rose-500 to-pink-500',
    stats: { accuracy: '96%', speed: '2s/page', formats: 12 },
  },
  {
    id: 6,
    title: 'E-commerce Recommendation',
    description: 'Mahsulot tavsiya tizimi. Konversiyani +40% oshiradi.',
    fullDescription: 'Collaborative filtering + content-based filtering, shaxsiylashtirilgan tavsiyalar.',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&h=400&fit=crop',
    ],
    tags: ['Collaborative Filtering', 'Python', 'Redis', 'Next.js'],
    stars: 234,
    category: 'Recommendation',
    icon: <ShoppingBag className="w-5 h-5" />,
    gradient: 'from-indigo-500 to-purple-500',
    stats: { conversion: '+40%', recommendations: '10K+/day', accuracy: '92%' },
  },
];

const categories = ['All', 'AI', 'Machine Learning', 'Voice AI', 'Analytics', 'Document AI', 'Recommendation'];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<typeof projects[0] | null>(null);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isAnimating, setIsAnimating] = useState(false);
  
  const enterTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  // Katta kartani ochish funksiyasi
  const triggerExpand = (project: typeof projects[0], rect: DOMRect) => {
    setHoverRect(rect);
    setHoveredProject(project);
    setCurrentImageIndex(0);

    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  };

  // Asosiy mantiq: Kursor qimirlaganda taymerni yangilash
  const handleMouseMove = (project: typeof projects[0], e: React.MouseEvent<HTMLDivElement>) => {
    // Agar karta allaqachon ochilgan yoki animatsiya jarayonida bo'lsa, hech narsa qilmaymiz
    if (isAnimating || hoveredProject?.id === project.id) return;

    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    const rect = e.currentTarget.getBoundingClientRect();

    // Kursor harakatlanganda taymer bekor bo'lib, noldan boshlanadi.
    // 400ms davomida kursor mutlaqo qimirlamasagina (to'xtab tursa), katta karta ochiladi.
    enterTimerRef.current = window.setTimeout(() => {
      triggerExpand(project, rect);
    }, 400); 
  };

  const handleMouseEnter = (project: typeof projects[0], e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseMove(project, e);
  };

  const closeExpanded = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setHoveredProject(null);
      setHoverRect(null);
      setCurrentImageIndex(0);
    }, 500); 
  };

  const handleCardMouseLeave = () => {
    // Sichqoncha kartadan chiqib ketsa ochilishni bekor qilamiz
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    if (hoveredProject) {
      leaveTimerRef.current = window.setTimeout(() => {
        closeExpanded();
      }, 150);
    }
  };

  const handleExpandedMouseEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  };

  const handleExpandedMouseLeave = () => {
    leaveTimerRef.current = window.setTimeout(() => {
      closeExpanded();
    }, 200);
  };

  const nextImage = () => {
    if (hoveredProject) {
      setCurrentImageIndex((prev) => (prev + 1) % hoveredProject.images.length);
    }
  };
  
  const prevImage = () => {
    if (hoveredProject) {
      setCurrentImageIndex((prev) => (prev - 1 + hoveredProject.images.length) % hoveredProject.images.length);
    }
  };

  return (
    <section id="projects" className="py-28 px-6 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">So'nggi</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent ml-3">Loyihalarim</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            AI va zamonaviy texnologiyalar asosida ishlangan real loyihalar.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onMouseEnter={(e) => handleMouseEnter(project, e)}
              onMouseMove={(e) => handleMouseMove(project, e)} // Yana bitta muhim hodisa
              onMouseLeave={handleCardMouseLeave}
              onClick={(e) => {
                if (enterTimerRef.current) clearTimeout(enterTimerRef.current); // Hover taymerini to'xtatamiz
                const rect = e.currentTarget.getBoundingClientRect();
                triggerExpand(project, rect); // Darhol ochamiz
              }}
              className="relative transition-all duration-300"
            >
              <div className="transform transition-all duration-300 hover:scale-105 origin-center">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${project.gradient} text-white text-xs font-medium shadow-lg`}>
                        {project.icon}
                        <span>{project.category}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{project.stars}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && <span className="px-2 py-0.5 text-xs rounded-lg bg-gray-800/50 text-gray-400">+{project.tags.length - 3}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kengayadigan karta (Expanded Card) */}
        {hoveredProject && hoverRect && (
          <>
            <div 
              className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
                isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={closeExpanded}
            />

            <div
              onMouseEnter={handleExpandedMouseEnter}
              onMouseLeave={handleExpandedMouseLeave}
              className="fixed z-50 bg-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden flex flex-col md:flex-row"
              style={{
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                ...(isAnimating
                  ? {
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '90%',
                      maxWidth: '1200px',
                      height: 'auto',
                      maxHeight: '90vh',
                      opacity: 1,
                    }
                  : {
                      top: `${hoverRect.top}px`,
                      left: `${hoverRect.left}px`,
                      transform: 'translate(0, 0)',
                      width: `${hoverRect.width}px`,
                      height: `${hoverRect.height}px`,
                      opacity: 0,
                    }),
              }}
            >
              <div className="flex flex-col md:flex-row w-full h-full relative">
                <div className={`relative bg-gray-800 transition-all duration-500 ${isAnimating ? 'md:w-1/2 min-h-[300px]' : 'w-full h-full'}`}>
                  <img
                    src={hoveredProject.images[currentImageIndex]}
                    alt={hoveredProject.title}
                    className="w-full h-full object-cover"
                  />
                  {hoveredProject.images.length > 1 && isAnimating && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all flex items-center justify-center"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all flex items-center justify-center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {hoveredProject.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className={`flex flex-col overflow-y-auto transition-all duration-500 ease-in-out ${
                  isAnimating 
                    ? 'md:w-1/2 p-6 opacity-100 translate-x-0' 
                    : 'w-0 p-0 opacity-0 translate-x-8 pointer-events-none'
                }`}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-white whitespace-nowrap">{hoveredProject.title}</h3>
                    <button onClick={closeExpanded} className="text-gray-400 hover:text-white flex-shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mt-2">{hoveredProject.fullDescription}</p>

                  <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-lg bg-gray-800/50">
                    {Object.entries(hoveredProject.stats).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className="text-xs text-gray-400 capitalize">
                          {key === 'users' ? 'Foydalanuvchilar' :
                           key === 'responseTime' ? 'Javob vaqti' :
                           key === 'languages' ? 'Tillar' :
                           key === 'accuracy' ? 'Aniqlik' :
                           key === 'dataPoints' ? 'Maʼlumotlar' :
                           key === 'models' ? 'Modellar' :
                           key === 'latency' ? 'Kechikish' :
                           key === 'commands' ? 'Buyruqlar' :
                           key === 'dashboards' ? 'Dashboard' :
                           key === 'dataSources' ? 'Manbalar' :
                           key === 'refreshRate' ? 'Yangilanish' :
                           key === 'speed' ? 'Tezlik' :
                           key === 'formats' ? 'Formatlar' :
                           key === 'conversion' ? 'Konversiya' :
                           key === 'recommendations' ? 'Tavsiyalar' : key}
                        </div>
                        <div className="text-white font-semibold text-sm">{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hoveredProject.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg transition-all">
                      <ExternalLink className="w-4 h-4" /> Demo
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 transition-all">
                      <Github className="w-4 h-4" /> Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}