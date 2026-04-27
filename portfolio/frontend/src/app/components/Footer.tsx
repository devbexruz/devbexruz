import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, MapPin, Send, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/devbexruz", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/in/bexruzdeveloper", label: "LinkedIn" },
    { icon: <Send className="w-5 h-5" />, href: "https://t.me/bexruzdeveloper", label: "Telegram" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:bexruzpy@gmail.com", label: "Email" },
  ];

  const quickLinks = [
    { name: "Bosh sahifa", href: "/" },
    { name: "Videolar", href: "/videos" },
    { name: "Blog va Yangiliklar", href: "/blog" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black border-t border-white/10 mt-20">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">

          {/* Brand & About */}
          <div className="md:w-1/2 lg:w-1/3">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl" />
                <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center">
                  <img src="icon.svg" alt="Logo" className="w-full h-full rounded-2xl object-cover p-1" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.className = 'hidden'; }} />
                </div>
              </div>
              <div>
                <span className="text-white font-bold text-xl tracking-tight">Bexruz Developer | Logic</span>
                <span className="text-xs text-blue-400 block font-medium">Backend & AI/ML Engineer</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Katta yuklamali tizimlar (High-load systems),
              algoritmlar va sun'iy intellekt bo'yicha mustahkam orqa qism (Backend) yechimlari.
            </p>

            <div className="flex items-center gap-3">
              {socialIcons.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-b hover:from-blue-600 hover:to-purple-600 hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/4">
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Tezkor havolalar</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-2 group w-fit"
                  >
                    <Sparkles className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:bexruzpy@gmail.com" className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>bexruzpy@gmail.com</span>
            </a>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Toshkent, O'zbekiston</span>
            </div>
          </div>

          <div className="text-gray-500 text-sm font-mono flex items-center gap-2">
            © {currentYear} <span className="text-gray-300">Bexruz Developer</span>.
          </div>
        </div>
      </div>
    </footer>
  );
}