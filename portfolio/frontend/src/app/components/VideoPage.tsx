import { useState } from 'react';
import {
  MessageSquare, Reply, User, Send, ChevronDown, ThumbsUp,
  ThumbsDown, Share2, Eye, Calendar, Clock, MessageCircle, Youtube, Play
} from 'lucide-react';
import { Badge } from './ui/badge';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import MarkdownViewer from './MarkdownViewer';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className={`space-y-4 ${depth > 0 ? 'ml-6 md:ml-12 border-l border-white/10 pl-4 md:pl-6' : ''}`}>
      <div className="flex gap-3 md:gap-4 group">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-purple-300 text-sm">{comment.user}</span>
              <span className="text-[10px] text-gray-500">{comment.timestamp}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
          </div>
          <div className="flex items-center gap-4 px-2">
            <button
              type="button"
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 font-medium transition-colors"
            >
              <Reply className="w-3 h-3" /> Javob berish
            </button>
          </div>

          {showReply && (
            <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                placeholder="Javobingizni yozing..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600"
              />
              <button type="button" className="bg-purple-600/80 hover:bg-purple-500 p-2 rounded-xl transition-all shadow-lg shadow-purple-500/20">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

interface VideoPageProps {
  video: {
    id: number;
    title: string;
    videoUrl: string;
    views: string;
    likes: string;
    category: string;
    description: string;
    duration: string;
    date?: string;
  };
  relatedVideos: Array<{
    id: number;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    category: string;
  }>;
  onVideoSelect: (id: number) => void;
}

export default function VideoPage({ video, relatedVideos, onVideoSelect }: VideoPageProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(parseInt(video.likes) || 0);
  const [showDescription, setShowDescription] = useState(false);

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    if (!disliked && !liked) setLikesCount(prev => prev - 1);
    if (disliked && !liked) setLikesCount(prev => prev + 1);
    setDisliked(!disliked);
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('embed')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = match && match[2].length === 11 ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-[calc((100vh-200px)*1.77+400px)] mx-auto px-4 pb-12 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-4 gap-y-4">

          <div className="space-y-6">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black relative">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`${getEmbedUrl(video.videoUrl)}?autoplay=1&theme=dark&modestbranding=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {video.category}
                </Badge>
                <h1 className="text-xl md:text-2xl font-bold leading-tight">{video.title}</h1>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-purple-400" /> {video.views} ko‘rish</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-400" /> {video.date || "26 Aprel, 2026"}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-purple-400" /> {video.duration}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                    <button type="button" onClick={handleLike} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${liked ? 'bg-purple-500 text-white' : 'hover:bg-white/10 text-gray-300'}`}>
                      <ThumbsUp className="w-4 h-4" /> <span className="text-sm font-medium">{likesCount}</span>
                    </button>
                    <div className="w-[1px] bg-white/10 my-1"></div>
                    <button type="button" onClick={handleDislike} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${disliked ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-gray-300'}`}>
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button type="button" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                    <Share2 className="w-4 h-4" /> Ulashish
                  </button>
                </div>
              </div>
            </div>

            <div className={`${showDescription ? '' : 'h-20 bg-white/2 hover:bg-white/5 border border-white/5 rounded-2xl'} p-2 overflow-hidden transition-all duration-500`}>
              
              {!showDescription && (<h2 onClick={() => setShowDescription(!showDescription)} className="p-4 cursor-pointer text-lg font-semibold mb-4 flex items-center gap-2 pb-3">
                <MessageCircle className="w-5 h-5 text-purple-400" /> Video zohi
              </h2>)}
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-300 prose-code:text-purple-300 prose-strong:text-purple-400 font-sans">
                <MarkdownViewer content={video.description} />
              </div>
              {showDescription && (
                <h2 onClick={() => setShowDescription(!showDescription)} className="cursor-pointer text-lg font-semibold mb-4 flex items-center gap-2 border-t border-white/5 pt-3 mt-6">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  Video izoini qisqartirish
                </h2>
              )}
            </div>

            <div className="space-y-8 py-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Fikrlar</h3>
                    <p className="text-xs text-gray-500">24 ta fikr qoldirilgan</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <span>Eng yangilari</span><ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-gray-500" /></div>
                <div className="flex-1 space-y-3">
                  <textarea
                    style={{ outline: 'none' }}
                    placeholder="Video haqida fikringizni qoldiring..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 resize-none min-h-[60px]"
                  />
                  <div className="flex justify-end pt-2 border-t border-white/5">
                    <button type="button" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20">
                      Fikr qoldirish
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-8 mt-6">
                {[
                  {
                    id: '1', user: 'Ali Valiyev', text: 'Dars uchun rahmat! Juda tushunarli bo\'libdi. Ayniqsa AI qismi yoqdi.', timestamp: '2 soat avval',
                    replies: [
                      {
                        id: '1-1', user: 'Behzod', text: 'Ali, fikringiz uchun rahmat! Keyingi darsda yana ham chuqurroq o\'rganamiz.', timestamp: '1 soat avval',
                        replies: [{ id: '1-2', user: 'Sardor', text: 'Kutamiz! 👍', timestamp: '30 daqiqa avval', replies: [] }]
                      }
                    ]
                  },
                  { id: '2', user: 'Malika Karimova', text: 'Bu darsning davomi ham bo\'ladimi? Advanced daraja kerak edi.', timestamp: '5 soat avval', replies: [] }
                ].map(comment => <CommentItem key={comment.id} comment={comment} />)}
              </div>
            </div>
          </div>

          <div className="lg:w-[400px] flex-shrink-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="w-5 h-5 text-purple-300" />
                <h3 className="text-lg font-bold text-purple-300">O‘xshash videolar</h3>
              </div>
              <div className="space-y-3">
                {relatedVideos.map((relVideo) => (
                  <div
                    key={relVideo.id}
                    onClick={() => {
                      onVideoSelect(relVideo.id);
                    }}
                    className="group cursor-pointer backdrop-blur-sm rounded-xl hover:bg-white/5 transition-all p-2 border border-transparent hover:border-white/5"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-36 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                        <img src={relVideo.thumbnail} alt={relVideo.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play className="w-6 h-6 text-white" /></div>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-bold bg-black/80 rounded">{relVideo.duration}</span>
                      </div>
                      <div className="flex flex-col justify-between py-0.5">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">{relVideo.title}</h4>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Eye className="w-3 h-3" /> {relVideo.views} ko'rish</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}