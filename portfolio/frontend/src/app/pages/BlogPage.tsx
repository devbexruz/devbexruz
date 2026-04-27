import { useState } from 'react';
import { Calendar, Clock, ArrowRight, Tag, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

const blogPosts = [
  {
    id: 1,
    title: 'AI Integration: Biznesingizni keyingi bosqichga olib chiqing',
    excerpt: 'AI texnologiyalari qanday qilib kichik bizneslarni raqamli transformatsiya qilmoqda va siz ham bu imkoniyatlardan qanday foydalanishingiz mumkin.',
    date: '2026-04-15',
    readTime: '8 min',
    category: 'AI Integration',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    tags: ['AI', 'Business', 'Automation']
  },
  {
    id: 2,
    title: 'GPT-4 bilan Custom Chatbot yaratish',
    excerpt: 'O\'zingizning ma\'lumotlaringiz asosida chatbot qanday train qilish mumkin. Step-by-step qo\'llanma va eng yaxshi amaliyotlar.',
    date: '2026-04-10',
    readTime: '12 min',
    category: 'Tutorial',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop',
    tags: ['GPT-4', 'Chatbot', 'OpenAI']
  },
  {
    id: 3,
    title: 'Machine Learning modellarni Production ga deploy qilish',
    excerpt: 'ML modellarni ishlab chiqishdan production muhitga o\'tkazish jarayoni. Best practices va keng tarqalgan xatolar.',
    date: '2026-04-05',
    readTime: '15 min',
    category: 'Machine Learning',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    tags: ['ML', 'Deployment', 'DevOps']
  },
  {
    id: 4,
    title: 'O\'zbek tili uchun NLP: Challenges va Solutions',
    excerpt: 'O\'zbek tilida Natural Language Processing bilan ishlashda duch keladigan qiyinchiliklar va ularni yechish yo\'llari.',
    date: '2026-03-28',
    readTime: '10 min',
    category: 'NLP',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    tags: ['NLP', 'Uzbek', 'Language']
  },
  {
    id: 5,
    title: 'AI Ethics: Mas\'uliyatli AI rivojlantirish',
    excerpt: 'AI texnologiyalarini rivojlantirishda etika va mas\'uliyat masalalari. Bias, privacy va transparency haqida.',
    date: '2026-03-22',
    readTime: '9 min',
    category: 'AI Ethics',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
    tags: ['Ethics', 'AI', 'Privacy']
  },
  {
    id: 6,
    title: '2026 yilda AI Trendlari va Imkoniyatlar',
    excerpt: 'Bu yil AI sohasida kutilayotgan eng asosiy yangiliklar va biznes uchun qanday imkoniyatlar yaratishi.',
    date: '2026-03-15',
    readTime: '11 min',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    tags: ['Trends', 'AI', '2026']
  },
  {
    id: 7,
    title: 'Deep Learning bilan Image Recognition',
    excerpt: 'CNN arxitekturasi va transfer learning yordamida yuqori aniqlikdagi image classification tizimi yaratish.',
    date: '2026-03-08',
    readTime: '14 min',
    category: 'Deep Learning',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    tags: ['Deep Learning', 'CNN', 'Computer Vision']
  },
  {
    id: 8,
    title: 'Kubernetes bilan ML Model Deployment',
    excerpt: 'Microservices arxitekturasi va Kubernetes orqali ML modellarni scale qilish va deploy qilish.',
    date: '2026-03-01',
    readTime: '13 min',
    category: 'DevOps',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
    tags: ['Kubernetes', 'Docker', 'ML Ops']
  },
  {
    id: 9,
    title: 'Prompt Engineering: GPT modellarni optimize qilish',
    excerpt: 'Eng yaxshi natijalarni olish uchun prompt engineering texnikalari va best practices.',
    date: '2026-02-22',
    readTime: '10 min',
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    tags: ['Prompt Engineering', 'GPT', 'LLM']
  }
];

const categories = ['All', 'AI Integration', 'Tutorial', 'Machine Learning', 'NLP', 'AI Ethics', 'Trends', 'Deep Learning', 'DevOps', 'AI'];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Blog va Yangiliklar</h1>
          <p className="text-xl text-blue-100 mb-8">
            AI texnologiyalari, tutorials va sanoat yangiliklari
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Maqola qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-white"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b sticky top-16 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category === 'All' ? 'Barchasi' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Hech narsa topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full gap-2">
                    O'qish
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
