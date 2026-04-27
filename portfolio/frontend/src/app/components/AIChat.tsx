import { useState, useRef, useEffect } from 'react';
import { Sparkles, UserPlus, Image, Paperclip, Rocket, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AICharacter() {
  const [input, setInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Input balandligini avtomatik sozlash
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Abstract Glows */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full animate-pulse delay-700" />

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            <Cpu className="w-3 h-3 text-blue-400" /> AI Innovation Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
            G'oyangizni <span className="text-blue-500">Analiz</span> qiling va <span className="text-purple-500">Byudjetni</span> Hisoblang
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base font-light">
            G'oyangizni yozing va biz uni texnik tomondan tahlil qilib, loyihani amalga oshirish uchun kerakli <strong className="text-white">taxminiy byudjet</strong>, <strong className="text-white">muddatlar</strong> va <strong className="text-white">ishchi kuchi</strong> haqida to'liq texnik xarita taqdim etamiz.
          </p>
        </div>

        {/* Minimalist Colorful Input Wrapper */}
        <div className="relative max-w-2xl mx-auto">
          {/* Animated Gradient Border Overlay */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2rem] blur-sm opacity-20 group-focus-within:opacity-100 transition-opacity duration-700" />

          <div className="relative bg-black/60 backdrop-blur-2xl rounded-[1.85rem] border border-white/10 shadow-2xl overflow-hidden p-2">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSubmitted}
                placeholder="Loyiha g'oyangizni yozing yoki fayl biriktiring..."
                rows={1}
                style={{
                  outline: 'none'
                }}
                className="w-full bg-transparent border-none focus:ring-0 text-white text-base md:text-lg p-5 md:p-6 placeholder:text-gray-600 resize-none min-h-[60px] max-h-[300px] custom-scrollbar transition-all font-light"
              />

              <div className="flex items-center justify-between p-2 border-t border-white/5 mt-1">
                <div className="flex items-center gap-1">
                  <button type="button" className="p-3 rounded-xl hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-all group relative">
                    <Paperclip className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">Fayl</span>
                  </button>
                  <button type="button" className="p-3 rounded-xl hover:bg-white/5 text-gray-500 hover:text-purple-400 transition-all group relative">
                    <Image className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">Rasm</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isSubmitted}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-0"
                >
                  <Rocket className="w-4 h-4" /> Tahlil qilish
                </button>
              </div>
            </form>

            {/* Auth Overlay */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-30 bg-gray-950/90 backdrop-blur-xl flex items-center justify-center p-6"
                >
                  <div className="text-center space-y-6 max-w-xs">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-bounce">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">Tahlil Tayyor!</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Sizning g'oyangiz uchun <strong className="text-white">texnik arxitektura</strong>, <strong className="text-white">taxminiy byudjet</strong> va <strong className="text-white">ishchi kuchi</strong> hisoblab chiqildi. Ma'lumotlarni ko'rish uchun tizimga kiring.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/10 active:scale-95">
                        <UserPlus className="w-4 h-4" /> Boshlash
                      </button>
                      <button className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all">
                        Tizimga kirish
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Small Trust Badge */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-[10px] font-bold text-white flex items-center gap-2 tracking-widest"><Cpu className="w-4 h-4" /> GPU POWERED</div>
          <div className="text-[10px] font-bold text-white flex items-center gap-2 tracking-widest uppercase italic">Cost Analysis v2.0</div>
          <div className="text-[10px] font-bold text-white flex items-center gap-2 tracking-widest uppercase italic font-sans">Market Price Data Sync</div>
        </div>
      </div>
    </section>
  );
}