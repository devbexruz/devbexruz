import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, Home, Search, Briefcase, Video, BookOpen, LogIn, UserPlus, Flame } from 'lucide-react';

import { Badge } from './ui/badge';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isHome = location.pathname === '/';
  const isBlog = location.pathname === '/blog';
  const isVideos = location.pathname === '/videos';
  const isVideoDetail = isVideos && searchParams.has('v');
  const showSearch = (isBlog || isVideos) && !isVideoDetail;

  // Ekran kengligini kuzatish (faqat video/blog sahifalarida hamburger kerak)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768; // 768px dan kichik – mobil/planshet

  // Mobil menyuni faqat (mobil yoki video detail) ekranda ko‘rsatish
  const showHamburger = isMobile || isVideoDetail;
  // Katta ekranda qidiruv va linklarni saqlash
  const displaySearch = showSearch && !isMobile;
  const displayNavLinks = !isMobile;

  // Scroll efekti
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (isVideos) navigate(`/videos?q=${encodeURIComponent(searchQuery)}`);
    else if (isBlog) navigate(`/blog?q=${encodeURIComponent(searchQuery)}`);
    setIsDrawerOpen(false);
  };

  const scrollToProjects = () => {
    if (isHome) {
      const el = document.getElementById('projects');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('projects');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsDrawerOpen(false);
  };

  const drawerLinks = [
    { label: 'Loyihalar', icon: <Briefcase className="w-5 h-5" />, onClick: scrollToProjects },
    { label: 'Videodarslar', icon: <Video className="w-5 h-5" />, path: '/videos' },
    { label: 'Yangiliklar va Bloglar', icon: <BookOpen className="w-5 h-5" />, path: '/blog' },
  ];

  const navLinks = [
    { path: '/', name: 'Bosh sahifa', icon: <Home className="w-4 h-4" /> },
    { path: '/blog', name: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/videos', name: 'Videolar', icon: <Video className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
        : 'bg-transparent'
        }`}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Chap tomon: hamburger (faqat mobil, video/blog sahifalarida) + logo */}
            <div className="flex items-center gap-3">
              {showHamburger && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="p-2 rounded-full hover:bg-white/10 transition-all text-white"
                  aria-label="Menyu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              <Link to={isVideos ? '/videos' : isBlog ? '/blog' : '/'} className="flex items-center gap-2 group shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl blur-lg opacity-50" />
                  <div className="relative w-12 h-12 rounded-3xl bg-gradient-to-r from-purple-900/5 to-blue-900/5 flex items-center justify-center justify-items-center">
                    <img src='icon.svg' className='top-0 left-0 w-12 left-0 rounded-xl' />
                  </div>
                </div>
                <span className="text-white font-semibold text-base hidden sm:block">Bexruz Developer | Logic</span>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{"Demo"}</Badge>

              </Link>
            </div>

            {/* Markaz: qidiruv (faqat blog/videos sahifalarida) */}
            {displaySearch && (
              <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isVideos ? "Video qidirish..." : "Maqola qidirish..."}
                    className="w-full pl-9 pr-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/70 focus:bg-white/15 transition-all"
                  />
                </div>
              </form>
            )}

            {/* Desktop navigatsiya */}
            {displayNavLinks && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-2">{link.icon}{link.name}</span>
                    {isActive(link.path) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                    )}
                    <div className={`absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive(link.path) ? 'bg-white/10' : ''
                      }`} />
                  </Link>
                ))}
              </div>
            )}

            {/* O‘ng tomondagi tugmalar (Kirish/Boshlash) */}
            <div className="flex items-center gap-2">
              <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors">
                <LogIn className="w-4 h-4" />
                Kirish
              </button>
              <button className="hidden md:block px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                Boshlash
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer (yon panel) – faqat mobil menyu ochilganda */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isDrawerOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute left-0 top-0 bottom-0 w-72 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <img src='icon.svg' className='top-0 left-0 w-12 left-0 rounded-xl' />
                <span className="text-white font-semibold">Bexruz Developer</span>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
              {isVideoDetail ? (
                <>
                  <button onClick={() => { setIsDrawerOpen(false); navigate('/videos'); }} className="flex w-[calc(100%-16px)] items-center gap-4 px-4 py-3 mx-2 rounded-xl bg-white/10 text-white font-medium mb-1 transition-all">
                    <Home className="w-5 h-5" /> Asosiy
                  </button>
                  <button onClick={() => { setIsDrawerOpen(false); navigate('/videos'); }} className="flex w-[calc(100%-16px)] items-center gap-4 px-4 py-3 mx-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-1">
                    <Flame className="w-5 h-5" /> Trendlar
                  </button>
                  <button onClick={() => { setIsDrawerOpen(false); navigate('/videos'); }} className="flex w-[calc(100%-16px)] items-center gap-4 px-4 py-3 mx-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-1">
                    <BookOpen className="w-5 h-5" /> Obunalar
                  </button>
                  <hr className="border-white/5 border-t my-4 mx-4" />

                  <h3 className="px-6 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategoriyalar</h3>
                  {['All', 'Tutorial', 'ML', 'NLP', 'Computer Vision', 'AI', 'Backend'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setIsDrawerOpen(false); navigate('/videos'); }}
                      className="flex items-center gap-4 w-[calc(100%-16px)] px-4 py-2.5 mx-2 rounded-xl transition-all text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white text-left"
                    >
                      {cat === 'All' ? 'Barchasi' : cat}
                    </button>
                  ))}
                </>
              ) : (
                drawerLinks.map((item, idx) => (
                  item.path ? (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all ${isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30'
                        : 'text-gray-300 hover:bg-white/5'
                        }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={idx}
                      onClick={item.onClick}
                      className="flex items-center gap-3 w-[calc(100%-16px)] px-4 py-3 mx-2 rounded-xl text-gray-300 hover:bg-white/5 transition-all text-left"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )
                ))
              )}
            </div>

            {/* Mobil uchun kirish/boshlash */}
            <div className="border-t border-gray-800 p-4 space-y-2 md:hidden">
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/10 text-white">
                <LogIn className="w-4 h-4" /> Kirish
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <UserPlus className="w-4 h-4" /> Boshlash
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}