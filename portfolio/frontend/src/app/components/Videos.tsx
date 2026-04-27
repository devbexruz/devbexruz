import { useState } from 'react';
import { Play, Home, Flame, BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import VideoPage from './VideoPage';

let videos = [
  {
    id: 1,
    title: 'AI Chatbot yaratish - To‘liq qo‘llanma',
    thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=450&fit=crop',
    duration: '45:32',
    views: '12.5K',
    likes: '856',
    category: 'Tutorial',
    videoUrl: 'https://www.youtube.com/embed/B0KGnGLOLag',
    description: `# AI Chatbot Yaratish - To'liq Qo'llanma\n\n## Kirish\n\nBu videoda siz quyidagilarni o'rganasiz:\n\n- OpenAI GPT-4 API bilan ishlash\n- Custom training ma'lumotlar yaratish\n- Frontend va Backend integratsiya\n- Production ga deploy qilish\n\n## Texnologiyalar\n\n\`\`\`\n- OpenAI GPT-4\n- Python FastAPI\n- React + TypeScript\n- PostgreSQL\n- Docker\n\`\`\`\n\n## Asosiy Qadamlar\n\n### 1. API Setup\nOpenAI API kalitini olish va environment o'rnatish:\n\n\`\`\`python\nimport openai\n\nopenai.api_key = "your-api-key"\n\`\`\`\n\n### 2. Backend Development\nFastAPI da chatbot endpoint yaratish\n\n### 3. Frontend Integration\nReact da chat interface yaratish\n\n### 4. Database Setup\nConversation history saqlash uchun database\n\n## Foydali Linklar\n\n- [OpenAI Documentation](https://platform.openai.com/docs)\n- [FastAPI Tutorial](https://fastapi.tiangolo.com/)\n- [GitHub Repository](https://github.com/example)\n\n## Xulosa\n\nBu tutorial bilan siz to'liq ishlaydigan AI chatbot yaratishni o'rganasiz. Savol bo'lsa kommentlarda yozing!`
  },
  {
    id: 2,
    title: 'Machine Learning bilan Narx Bashorati',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    duration: '38:15',
    views: '8.3K',
    likes: '645',
    category: 'ML',
    videoUrl: 'https://www.youtube.com/embed/B0KGnGLOLag',
    description: `# Machine Learning bilan Narx Bashorati\n\n## Loyiha Haqida\n\nUshbu videoda biz uy-joy narxlarini bashorat qiluvchi ML model yaratamiz.\n\n## Dataset\n\n\`\`\`python\nimport pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\n\ndf = pd.read_csv('housing_data.csv')\n\`\`\`\n\n## Model Training\n\n### Feature Engineering\n- Location encoding\n- Size normalization\n- Age calculation\n- Amenities scoring\n\n### Modellar\n1. **Linear Regression** - Baseline\n2. **Random Forest** - Ensemble\n3. **XGBoost** - Boosting\n4. **Neural Network** - Deep Learning\n\n## Natijalar\n\n| Model | RMSE | R² Score |\n|-------|------|----------|\n| Linear Regression | 45K | 0.78 |\n| Random Forest | 32K | 0.87 |\n| **XGBoost** | **28K** | **0.91** |\n| Neural Network | 30K | 0.89 |\n\n## Deployment\n\nModel ni FastAPI orqali deploy qilish:\n\n\`\`\`python\nfrom fastapi import FastAPI\nimport joblib\n\napp = FastAPI()\nmodel = joblib.load('model.pkl')\n\n@app.post("/predict")\ndef predict(features: dict):\n    prediction = model.predict([features])\n    return {"price": prediction[0]}\n\`\`\``
  },
  {
    id: 3,
    title: 'O\'zbek tili uchun NLP Model',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    duration: '52:40',
    views: '15.2K',
    likes: '1.2K',
    category: 'NLP',
    videoUrl: 'https://www.youtube.com/embed/zDmTVr1S0bQ',
    description: `# O'zbek Tili uchun NLP Model\n\n## Muammo\n\nO'zbek tili uchun kam NLP resource mavjud. Bu videoda biz custom NLP model yaratamiz.\n\n## Qo'llaniladigan Texnologiyalar\n\n- **Transformers** (Hugging Face)\n- **PyTorch**\n- **Tokenizers**\n- **FastAPI** (API)\n\n## Dataset Preparation\n\n\`\`\`python\nimport re\n\ndef clean_uzbek_text(text):\n    text = re.sub(r'[^а-яА-Яўғҳқўғҳқa-zA-Z0-9\\s]', '', text)\n    return text.strip()\n\`\`\`\n\n## Model Architecture\n### BERT-based Model\n\`\`\`\nInput → Tokenization → BERT Encoder → Classification Head → Output\n\`\`\`\n\n## Training Process\n1. **Tokenizer yaratish** - O'zbek alifbosi uchun\n2. **Pre-training** - Unsupervised learning\n3. **Fine-tuning** - Specific task uchun\n4. **Evaluation** - Test dataset da\n\n## Use Cases\n- ✅ Sentiment Analysis\n- ✅ Text Classification\n- ✅ Named Entity Recognition\n- ✅ Question Answering\n\n## Performance\nModelimiz 89% accuracy ga erishdi o'zbek tilidagi sentiment analysis da!`
  },
  {
    id: 4,
    title: 'Computer Vision: Object Detection',
    thumbnail: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=450&fit=crop',
    duration: '41:20',
    views: '10.8K',
    likes: '892',
    category: 'Computer Vision',
    videoUrl: 'https://www.youtube.com/embed/zDmTVr1S0bQ',
    description: `# Computer Vision: Object Detection\n\n## YOLOv8 bilan Object Detection\n\nReal-time object detection tizimini yaratamiz.\n\n## Kerakli Kutubxonalar\n\`\`\`bash\npip install ultralytics opencv-python torch\n\`\`\`\n\n## YOLOv8 Setup\n\`\`\`python\nfrom ultralytics import YOLO\nmodel = YOLO('yolov8n.pt')\nresults = model('image.jpg')\n\`\`\`\n\n## Custom Dataset Training\n### 1. Dataset Tayyorlash\n- Rasm yig'ish\n- Annotation (labelImg)\n- Train/Val split\n\n### 2. Training Configuration\n\`\`\`yaml\ntrain: ./dataset/train\nval: ./dataset/val\nnc: 10\nnames: ['class1', 'class2', ...]\n\`\`\`\n\n### 3. Training\n\`\`\`python\nmodel.train(data='config.yaml', epochs=100, imgsz=640, batch=16)\n\`\`\`\n\n## Real-time Detection\n\`\`\`python\nimport cv2\ncap = cv2.VideoCapture(0)\nwhile True:\n    ret, frame = cap.read()\n    results = model(frame)\n    cv2.imshow('Detection', results.render()[0])\n\`\`\`\n\n## Natijalar\n- **mAP@50**: 0.87\n- **FPS**: 45 (RTX 3060)\n- **Inference time**: 22ms`
  },
  {
    id: 5,
    title: 'LangChain va Vector Database',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    duration: '35:50',
    views: '9.5K',
    likes: '734',
    category: 'AI',
    videoUrl: 'https://www.youtube.com/embed/B0KGnGLOLag',
    description: `# LangChain va Vector Database\n\n## RAG (Retrieval Augmented Generation)\nDocument-based chatbot yaratish uchun RAG architectura.\n\n## Stack\n- **LangChain** - Framework\n- **Pinecone** - Vector DB\n- **OpenAI Embeddings** - Text to Vector\n- **GPT-4** - Generation\n\n## Setup\n\`\`\`bash\npip install langchain openai pinecone-client\n\`\`\`\n\n## Code Example\n\`\`\`python\nfrom langchain.embeddings import OpenAIEmbeddings\nfrom langchain.vectorstores import Pinecone\nfrom langchain.chains import RetrievalQA\nfrom langchain.llms import OpenAI\n\nembeddings = OpenAIEmbeddings()\nvectorstore = Pinecone.from_documents(documents, embeddings, index_name=\"my-index\")\nqa = RetrievalQA.from_chain_type(llm=OpenAI(), retriever=vectorstore.as_retriever())\nanswer = qa.run(\"Savolingiz?\")\n\`\`\`\n\n## Workflow\n1. Document Loading\n2. Text Splitting\n3. Embedding\n4. Storage (Pinecone)\n5. Retrieval\n6. Generation\n\n## Optimization Tips\n- Chunk size: 500-1000 chars\n- Overlap: 50-100 chars\n- Top-k: 3-5\n- Temperature: 0.7`
  },
  {
    id: 6,
    title: 'API Development: FastAPI va PostgreSQL',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    duration: '47:25',
    views: '11.3K',
    likes: '967',
    category: 'Backend',
    videoUrl: 'https://www.youtube.com/embed/B0KGnGLOLag',
    description: `# Production-Ready API Development\n\n## FastAPI + PostgreSQL + Docker\nProfessional backend API yaratish bo'yicha to'liq qo'llanma.\n\n## Project Structure\n\`\`\`\napp/\n├── api/\n├── core/\n├── models/\n├── schemas/\n├── services/\n└── main.py\n\`\`\`\n\n## Database Models\n\`\`\`python\nfrom sqlalchemy import Column, Integer, String\nfrom app.core.database import Base\n\nclass User(Base):\n    __tablename__ = \"users\"\n    id = Column(Integer, primary_key=True)\n    email = Column(String, unique=True)\n    hashed_password = Column(String)\n\`\`\`\n\n## API Routes\n\`\`\`python\nfrom fastapi import APIRouter, Depends\n\nrouter = APIRouter()\n\n@router.post(\"/users\")\nasync def create_user(user: UserCreate, db: Session = Depends(get_db)):\n    return created_user\n\`\`\`\n\n## Authentication (JWT)\n\`\`\`python\nfrom jose import jwt\nfrom datetime import datetime, timedelta\n\ndef create_access_token(data: dict):\n    to_encode = data.copy()\n    expire = datetime.utcnow() + timedelta(minutes=30)\n    to_encode.update({\"exp\": expire})\n    return jwt.encode(to_encode, SECRET_KEY, algorithm=\"HS256\")\n\`\`\`\n\n## Docker Setup\n\`\`\`dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n\`\`\`\n\n## Testing\n\`\`\`python\nfrom fastapi.testclient import TestClient\n\ndef test_create_user():\n    response = client.post(\"/users\", json={\"email\": \"test@example.com\"})\n    assert response.status_code == 200\n\`\`\`\n\n## Best Practices\n✅ Input validation (Pydantic)\n✅ Error handling\n✅ Rate limiting\n✅ CORS configuration\n✅ Logging\n✅ API documentation (Swagger)`
  }
];
for (let i = 0; i < 100; i++) {
  videos.push(videos[i % videos.length])
}

const categories = ['All', 'Tutorial', 'ML', 'NLP', 'Computer Vision', 'AI', 'Backend'];

export default function Videos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const videoIdParam = searchParams.get('v');
  const selectedVideo = videoIdParam ? videos.find(v => v.id === Number(videoIdParam)) || null : null;

  const handleSelectVideo = (video: typeof videos[0] | null) => {
    if (video) {
      setSearchParams({ v: video.id.toString() });
    } else {
      setSearchParams({});
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // const [showFilters, setShowFilters] = useState(false);
  // const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const layout = 'grid';
  const showFilters = false;
  // const layout = 'grid';

  // Filtrlash
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRelatedVideos = (currentVideoId: number) => {
    return videos
      .filter(v => v.id !== currentVideoId)
      .map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
        duration: v.duration,
        views: v.views,
        category: v.category
      }));
  };

  if (selectedVideo) {
    return (
      <VideoPage
        video={selectedVideo}
        relatedVideos={getRelatedVideos(selectedVideo.id)}
        onVideoSelect={(id) => {
          const video = videos.find(v => v.id === id);
          handleSelectVideo(video || null);
        }}
      />
    );
  }

  return (
    <section className="min-h-screen pt-0 pb-8 px-6 flex items-start max-w-8xl mx-auto gap-8">

      {/* chap TOMON - SIDEBAR */}
      <aside className="w-60 hidden lg:flex flex-col gap-2 shrink-0 border-r border-white/5 pr-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
        <button className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 text-white font-medium transition-all">
          <Home className="w-5 h-5" /> Asosiy
        </button>
        <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
          <Flame className="w-5 h-5" /> Trendlar
        </button>
        <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
          <BookOpen className="w-5 h-5" /> Obunalar
        </button>
        <hr className="border-white/5 border-t my-4" />

        <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategoriyalar</h3>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${selectedCategory === cat
              ? 'bg-blue-600/20 text-blue-400'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            {cat === 'All' ? 'Barchasi' : cat}
          </button>
        ))}
      </aside>

      {/* o'ng TOMON - VIDEOLAR */}
      <div className="flex-1 min-w-0">


        {/* Kategoriya filtrlari */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-8 p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
              >
                {cat === 'All' ? 'Barchasi' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Video ro‘yxati */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Hech qanday video topilmadi. 🔍</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 text-purple-400 hover:underline"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className={layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
          }>
            {filteredVideos.map(video => (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`group cursor-pointer transition-all duration-300 ${layout === 'grid'
                  ? 'flex flex-col gap-3 rounded-2xl overflow-hidden'
                  : 'flex gap-4 bg-gray-800/40 rounded-2xl p-3 border border-gray-700 hover:border-purple-500/30'
                  }`}
              >
                {/* Thumbnail */}
                <div className={`relative overflow-hidden ${layout === 'grid' ? 'aspect-video w-full rounded-2xl' : 'w-48 h-28'} flex-shrink-0 bg-gray-800`}>

                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-bold tracking-wider bg-black/80 backdrop-blur-sm rounded-md text-white">{video.duration}</span>
                </div>

                {/* Info */}
                <div className={layout === 'grid' ? 'px-1' : 'flex-1 p-2'}>
                  <h3 className="font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{video.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <span className="font-medium text-gray-300">Developer Logic</span>
                    {/* Tick ikonkasi agar xohlasangiz */}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-mono">
                    <span>{video.views} ko'rish</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>1 oy oldin</span>
                  </div>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </section>
  );
}