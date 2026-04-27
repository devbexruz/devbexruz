import { Github, Linkedin, Mail, ExternalLink, Code2, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Chap tomon: Matnli ma'lumotlar */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Backend & AI/ML Developer</span>
          </div>

          <div className="space-y-4">
            <img 
              src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&duration=4000&pause=1000&color=3F8EFC&center=false&vCenter=true&random=false&width=600&lines=Hey+there!+I'm+Bexruz+%F0%9F%91%8B;Backend+%26+AI%2FML+Developer;Building+Intelligent+Systems+%F0%9F%A4%96;Clean+Code+%E2%80%A2+Scalable+Architecture" 
              alt="Typing SVG"
              className="mx-auto lg:mx-0 h-12 md:h-16"
            />
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans mt-4">
              O'zbekistondan bo'lgan <strong className="text-white">Backend & AI/ML</strong> dasturchiman. Yuqori samaradorlikka ega, intellektual tizimlar va toza arxitekturalar yaratishga ishtiyoqmandman.
            </p>
          </div>

          {/* Social Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <a href="https://linkedin.com/in/bexruzdeveloper" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
              <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
            </a>
            <a href="https://t.me/bexruzdeveloper" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
              <img src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"/>
            </a>
            <a href="mailto:bexruzpy@gmail.com" className="hover:scale-105 transition-transform">
              <img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
            </a>
            <a href="https://leetcode.com/u/bexruzdeveloper" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
              <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" alt="LeetCode"/>
            </a>
          </div>

          <div className="pt-6">
            <img src="https://komarev.com/ghpvc/?username=devbexruz&style=for-the-badge&color=3F8EFC" alt="Profile Views" className="mx-auto lg:mx-0 shadow-lg shadow-blue-500/10" />
          </div>
        </div>

        {/* O'ng tomon: Rasm yoki Abstrakt Visual */}
        <div className="relative group mx-auto lg:mx-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-gray-900 border border-white/10 rounded-3xl p-2 overflow-hidden shadow-2xl">
            {/* Bu yerda sizning rasmingiz bo'lishi kerak. Hozircha yuqori sifatli dasturchi ramziy rasmi qo'ydim */}
            <img 
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" 
              alt="Developer Workspace" 
              className="rounded-2xl w-full h-[400px] object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
            {/* Floating Terminal Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <code className="text-blue-400 text-sm font-mono block">
                $ bz.aboutMe()
                <span className="text-gray-300 block mt-1">"Backend & AI Engineer. Clean code is a lifestyle."</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}