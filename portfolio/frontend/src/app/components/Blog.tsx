import { useState } from 'react';
import { Clock, ArrowRight, Eye, ThumbsUp, ChevronRight, Hash, Compass, Newspaper, BookOpen } from 'lucide-react';

// Topic va Subtopiclar strukturasi
const topicsData = [
  {
    id: 'backend',
    title: 'Backend Engineering',
    subtopics: [
      { id: 'python', title: 'Python & FastAPI' },
      { id: 'csharp', title: 'C# & .NET' },
      { id: 'architecture', title: 'System Architecture' },
    ]
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    subtopics: [
      { id: 'nlp', title: 'NLP & LLMs' },
      { id: 'cv', title: 'Computer Vision' },
      { id: 'ops', title: 'MLOps' },
    ]
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    subtopics: [
      { id: 'docker', title: 'Docker & Containers' },
      { id: 'ci-cd', title: 'CI/CD Pipelines' },
    ]
  }
];

// Aralash Maqolalar va Yangiliklar
const contentData = [
  {
    id: 1,
    type: 'article', // yoki 'news'
    title: 'FastAPI da dependency injection orqali toza arxitektura',
    excerpt: 'Katta loyihalarda FastAPI ning Dependency Injection tizimidan foydalanib kodni qanday qilib modulli va testlashga qulay qilish mumkin.',
    date: '2026-04-20',
    readTime: '8 min',
    topicId: 'backend',
    subtopicId: 'python',
    views: 1250,
    likes: 340,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    type: 'news',
    title: 'OpenAI yangi GPT-5 modelini e\'lon qildi',
    excerpt: 'Tez orada ommaga taqdim etiladigan yangi AI modelining asosiy xususiyatlari va u dasturchilar uchun nimalarni o\'zgartirishi kutilmoqda.',
    date: '2026-04-25',
    readTime: '3 min',
    topicId: 'ai-ml',
    subtopicId: 'nlp',
    views: 5420,
    likes: 1200,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    type: 'article',
    title: 'PostgreSQL da qidiruvni optimallashtirish',
    excerpt: 'Millionlab qatorga ega bazalarda indekslash va Full Text Search orqali qidiruv tezligini yuz barobarga oshirish usullari.',
    date: '2026-04-18',
    readTime: '12 min',
    topicId: 'backend',
    subtopicId: 'architecture',
    views: 890,
    likes: 215,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
  },
  {
    id: 4,
    type: 'article',
    title: '.NET 8 da nimalar yangi? Asosiy o\'zgarishlar',
    excerpt: 'Microsoft tomonidan taqdim etilgan yangi framework versiyasidagi unumdorlik o\'sishi va C# 12 imkoniyatlari.',
    date: '2026-04-15',
    readTime: '10 min',
    topicId: 'backend',
    subtopicId: 'csharp',
    views: 1020,
    likes: 305,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
  },
  {
    id: 5,
    type: 'news',
    title: 'Docker Compose v2 endi standart hisoblanadi',
    excerpt: 'Eski docker-compose skriptlari o\'rniga yangi tizimga o\'tish orqali qanday afzalliklarga ega bo\'lish mumkin.',
    date: '2026-04-22',
    readTime: '4 min',
    topicId: 'devops',
    subtopicId: 'docker',
    views: 670,
    likes: 180,
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop',
  },
  {
    id: 6,
    type: 'article',
    title: 'HuggingFace modellarini lokal serverda ishlatish',
    excerpt: 'Ochiq kodli LLM modellarini o\'z serveringizga o\'rnatish va API orqali ularga ulanish bo\'yicha to\'liq qo\'llanma.',
    date: '2026-04-10',
    readTime: '15 min',
    topicId: 'ai-ml',
    subtopicId: 'nlp',
    views: 2100,
    likes: 640,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
  }
];

export default function Blog() {
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [activeSubtopic, setActiveSubtopic] = useState<string>('all');
  const [contentType, setContentType] = useState<'all' | 'article' | 'news'>('all');

  // Filtrlash mantiqi
  const filteredContent = contentData.filter(item => {
    const matchTopic = activeTopic === 'all' || item.topicId === activeTopic;
    const matchSubtopic = activeSubtopic === 'all' || item.subtopicId === activeSubtopic;
    const matchType = contentType === 'all' || item.type === contentType;
    return matchTopic && matchSubtopic && matchType;
  });

  const handleTopicChange = (topicId: string) => {
    setActiveTopic(topicId);
    setActiveSubtopic('all'); // Topic o'zgarganda subtopic reset bo'ladi
  };

  const currentTopicData = topicsData.find(t => t.id === activeTopic);

  // So'nggi yangilik va maqolalarni ajratib olish
  const latestNews = [...contentData].filter(i => i.type === 'news').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestArticles = [...contentData].filter(i => i.type === 'article').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <section id="blog" className="min-h-screen py-24 px-6 relative overflow-hidden bg-black/20">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-10">

        {/* CHAP TOMON: Filter va Topiclar (Sidebar) */}
        <div className="lg:w-1/4 shrink-0 space-y-8">
          <div className="sticky top-28">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Compass className="text-blue-500 w-6 h-6" /> Explore
            </h2>

            {/* Content Type Filtrlari */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-8">
              <button
                onClick={() => setContentType('all')}
                className={`flex-1 text-sm py-2 px-3 rounded-lg font-medium transition-all ${contentType === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Barcha
              </button>
              <button
                onClick={() => setContentType('article')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 px-3 rounded-lg font-medium transition-all ${contentType === 'article' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <BookOpen className="w-4 h-4" /> Maqola
              </button>
              <button
                onClick={() => setContentType('news')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 px-3 rounded-lg font-medium transition-all ${contentType === 'news' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Newspaper className="w-4 h-4" /> Yangilik
              </button>
            </div>

            {/* Asosiy Topiclar */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Kategoriyalar</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleTopicChange('all')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTopic === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="flex items-center gap-2"><Hash className="w-4 h-4 opacity-50" /> Barchasi</div>
                </button>
                {topicsData.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicChange(topic.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTopic === topic.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2"><Hash className="w-4 h-4 opacity-50" /> {topic.title}</div>
                    {activeTopic === topic.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtopiclar (Agar Topic tanlangan bo'lsa ko'rinadi) */}
            {activeTopic !== 'all' && currentTopicData && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest px-2">{currentTopicData.title} Mavzulari</h3>
                <div className="space-y-1 pl-4 border-l border-white/10">
                  <button
                    onClick={() => setActiveSubtopic('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${activeSubtopic === 'all' ? 'text-white font-medium bg-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                  >
                    Barcha mavzular
                  </button>
                  {currentTopicData.subtopics.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubtopic(sub.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${activeSubtopic === sub.id ? 'text-white font-medium bg-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* O'NG TOMON: Maqolalar va Yangiliklar Grid ro'yxati */}
        <div className="flex-1 min-w-0">

          {/* Gorizontal: So'nggi Yangiliklar (Faqat barcha bo'limidaligida chiqadi) */}
          {(activeTopic === 'all' && contentType !== 'article') && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Newspaper className="text-purple-400 w-6 h-6" /> So'nggi Yangiliklar
                </h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar">
                {latestNews.map(item => (
                  <div key={item.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] group flex flex-col bg-gray-900 border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
                    <div className="relative h-40 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[10px] font-bold text-purple-200 uppercase tracking-widest backdrop-blur-md">News</div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2 font-mono">
                        <span>{item.date}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">{item.title}</h3>
                      <div className="mt-auto flex items-center justify-between">
                        <button className="text-xs font-bold text-gray-400 group-hover:text-purple-400 transition-colors flex items-center gap-1">O'qish <ArrowRight className="w-3 h-3" /></button>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500"><ThumbsUp className="w-3 h-3 group-hover:text-pink-400 transition-colors" />{item.likes}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gorizontal: So'nggi Maqolalar (Faqat barcha bo'limidaligida chiqadi) */}
          {(activeTopic === 'all' && contentType !== 'news') && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-blue-400 w-6 h-6" /> So'nggi Maqolalar
                </h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar">
                {latestArticles.map(item => (
                  <div key={item.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] group flex flex-col bg-gray-900 border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="relative h-40 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-[10px] font-bold text-blue-200 uppercase tracking-widest backdrop-blur-md">Article</div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2 font-mono">
                        <span>{item.date}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h3>
                      <div className="mt-auto flex items-center justify-between">
                        <button className="text-xs font-bold text-gray-400 group-hover:text-blue-400 transition-colors flex items-center gap-1">O'qish <ArrowRight className="w-3 h-3" /></button>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500"><ThumbsUp className="w-3 h-3 group-hover:text-pink-400 transition-colors" />{item.likes}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sarlavha Qismi (Katalog uchu) */}
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {activeTopic === 'all' ? 'Barcha nashrlar' : currentTopicData?.title}
              </h1>
              <p className="text-gray-400 text-sm">
                Bizning muhandislik blogimizdagi so'nggi {contentType === 'all' ? 'maqola va yangiliklar' : contentType === 'article' ? 'maqolalar' : 'yangiliklar'}ni o'qing.
              </p>
            </div>
            <div className="text-2xl font-black text-gray-800">{filteredContent.length} ta</div>
          </div>

          {/* Grid Content */}
          {filteredContent.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500">Ushbu guruhda hozircha nashr yo'q.</p>
              <button onClick={() => { setActiveTopic('all'); setActiveSubtopic('all'); setContentType('all') }} className="mt-4 text-blue-400 text-sm hover:underline">Filtrlarni tozalash</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContent.map(item => (
                <div key={item.id} className="group flex flex-col bg-gray-900 border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">

                  {/* Rasm */}
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border ${item.type === 'news' ? 'bg-purple-500/20 text-purple-200 border-purple-500/30' : 'bg-blue-500/20 text-blue-200 border-blue-500/30'
                        }`}>
                        {item.type === 'news' ? 'News' : 'Article'}
                      </span>
                    </div>
                  </div>

                  {/* Informatsiya */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 font-mono">
                      <span>{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {item.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      {/* Views & Likes */}
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-300 transition-colors">
                          <Eye className="w-4 h-4" /> {item.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-pink-300 transition-colors">
                          <ThumbsUp className="w-4 h-4" /> {item.likes.toLocaleString()}
                        </div>
                      </div>

                      <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                        O'qish <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}