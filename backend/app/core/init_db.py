import asyncio
from datetime import datetime
from sqlalchemy.future import select
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models import User, Problem, Solution, ServiceItem, ProjectItem, BlogPost
from app.services.estimator_service import DEFAULT_CATALOG
from app.api.v1.projects import DEFAULT_PROJECTS

INITIAL_PROBLEMS = [
    {
        "title": "FastAPI async SQLAlchemy da connection leak va 500 xatoligi qanday hal qilinadi?",
        "slug": "fastapi-async-sqlalchemy-connection-leak-500-error",
        "tags": "FastAPI, PostgreSQL, SQLAlchemy, Async",
        "content_markdown": """Bizda FastAPI va SQLAlchemy async session (`asyncpg`) orqali ishlaydigan yuqori yuklamali API mavjud. 
Pik paytida (500+ concurrent requests) server quyidagi xatolikni beryapti:
```
sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached, connection timed out
```
Requestlar ulanishni yopmasdan osilib qolayotganga o'xshaydi. Dependency injectionda `get_db` generatoridan foydalanamiz:
```python
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```
Bu connection leak'ni qanday bartaraf etish va pool parametrlarini to'g'ri sozlash mumkin?""",
        "meta_title": "FastAPI SQLAlchemy Connection Leak (QueuePool Limit) Yechimi",
        "meta_description": "FastAPI va async SQLAlchemy da QueuePool timeout va connection leak xatoligini bartaraf etish, sessiyalarni to'g'ri yopish va pool parametrlarini sozlash yo'li.",
        "meta_keywords": "FastAPI connection leak, sqlalchemy timeout error, QueuePool limit, asyncpg connection pool, python backend optimallashtirish",
        "meta_generated_by_ai": True,
        "view_count": 342,
        "upvotes_count": 28,
        "solutions": [
            {
                "author_name": "Bexruz Boynazarov",
                "is_accepted": True,
                "upvotes_count": 35,
                "content_markdown": """Asosiy sabab — kutilmagan exception yuz berganda sessiya avtomatik yopilmasligi yoki uzoq davom etuvchi I/O operatsiyalar paytida sessiya ochiq qolishidir.

Quyidagi 2 ta muhim qadamni bajaring:

### 1. `get_db` da `finally` va context manager kafolati:
```python
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### 2. Engine Pool parametrlarini yuklamaga moslang:
```python
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,          # Doimiy ochiq connectionlar
    max_overflow=40,       # Pik paytidagi qo'shimcha ulanishlar
    pool_timeout=30,       # Kutish vaqti
    pool_recycle=1800,     # Eskirgan ulanishlarni qayta yangilash (30 min)
    pool_pre_ping=True     # O'lik connectionlarni tekshirish
)
```
Bu sozlamalar bilan pik yuklamada ulanishlar o'z vaqtida tozalanadi va 500 xatosi to'liq yo'qoladi."""
            }
        ]
    },
    {
        "title": "PostgreSQL da 10M+ qatorda SELECT so'rovlari sekinlashdi: Indexing strategiyasi",
        "slug": "postgresql-10m-rows-query-slow-composite-indexing",
        "tags": "PostgreSQL, Database, Performance, Indexing",
        "content_markdown": """Jadvalimizda 10 milliondan ortiq yozuv bor. Foydalanuvchilar buyurtmalarni sanasi va statusi bo'yicha qidirganda so'rov 4-6 soniya davom etyapti:
```sql
SELECT * FROM orders 
WHERE user_id = 4521 AND status = 'completed' 
ORDER BY created_at DESC LIMIT 20;
```
`user_id` ustunida B-Tree index bor, lekin baribir sekin ishlayapti. `EXPLAIN ANALYZE` qilsak `Seq Scan` yoki og'ir `Bitmap Heap Scan` bo'lyapti. Buni qanday qilib 10-20 millisekundga tushirish mumkin?""",
        "meta_title": "PostgreSQL Katta Hajmdagi Jadvallarni Tezlashtirish: Composite Index",
        "meta_description": "PostgreSQL da 10M+ qatorli jadvallarda SELECT so'rovlarini 4 soniyadan 15ms ga tushirish, Composite Index va EXPLAIN ANALYZE tahlili bo'yicha to'liq qo'llanma.",
        "meta_keywords": "PostgreSQL indexing, query optimization, composite index, explain analyze, sql latency kamaytirish, highload postgres",
        "meta_generated_by_ai": True,
        "view_count": 512,
        "upvotes_count": 44,
        "solutions": [
            {
                "author_name": "Bexruz Boynazarov",
                "is_accepted": True,
                "upvotes_count": 48,
                "content_markdown": """Faqat `user_id` ustunidagi bitta indeks yetarli emas, chunki PostgreSQL `status` va `created_at DESC` bo'yicha qayta saralash (Sort) qilishga majbur bo'ladi.

Yechim — **Tarkibiy (Composite) Indeks** yaratish:
```sql
CREATE INDEX CONCURRENTLY idx_orders_user_status_created 
ON orders (user_id, status, created_at DESC);
```

Agar so'rovda faqat muayyan ustunlar kerak bo'lsa, `SELECT *` o'rniga faqat kerakli maydonlarni oling yoki `INCLUDE` indeksidan foydalaning:
```sql
CREATE INDEX CONCURRENTLY idx_orders_user_perf 
ON orders (user_id, status, created_at DESC) 
INCLUDE (total_amount);
```
Natijada **Index Only Scan** ishlaydi va so'rov vaqti 4 soniyadan **8–15 millisekundgacha** tushadi (NoreStyle Marketplace loyihamizda aynan shu usul bilan 40% latency dropga erishganmiz)."""
            }
        ]
    },
    {
        "title": "Next.js 15 Server Components va Client Components orasida ma'lumot uzatishda re-render muammosi",
        "slug": "nextjs-15-server-client-components-rerender-optimization",
        "tags": "Next.js, React, TypeScript, Frontend",
        "content_markdown": """Next.js 15 App Routerda sahifaning katta qismini Server Component qilib, faqat interaktiv filtr tugmalarini Client Component qildim. 
Lekin har safar filtr o'zgarganda butun sahifa qayta yuklanyapti va animatsiyalar uzilyapti. 
Server Actions va URL searchParams orqali state'ni boshqarishning eng toza va samarali usuli qanday?""",
        "meta_title": "Next.js 15 Server va Client Komponentlar O'rtasida Optimallashtirish",
        "meta_description": "Next.js 15 App Routerda keraksiz re-renderlarni yo'qotish, URL searchParams va nuqsonsiz UI o'tishlari uchun amaliy arxitektura yechimi.",
        "meta_keywords": "Next.js 15, Server Components, Client Components, React rerender, URL state sync, web performance",
        "meta_generated_by_ai": True,
        "view_count": 210,
        "upvotes_count": 19,
        "solutions": []
    },
    {
        "title": "Telegram Bot webhook xabarlari pik yuklamada kechikishi va bloklanishi",
        "slug": "telegram-bot-webhook-high-load-celery-redis",
        "tags": "Telegram Bot, Celery, Redis, High-Load",
        "content_markdown": """Telegram boti 20 mingdan ortiq foydalanuvchiga ega. Kanalda e'lon chiqqanda 5 daqiqa ichida bir necha ming odam /start yoki tugmalarni bosadi. Webhook endpoint har bir xabarni 2-3 soniya qayta ishlayotgani uchun Telegram timeout berib, so'rovlarni takroran yuborib yubormoqda va server qulamoqda. Buning asinxron arxitekturasi qanday bo'lishi kerak?""",
        "meta_title": None, # Will showcase fallback SEO initially!
        "meta_description": None,
        "meta_keywords": None,
        "meta_generated_by_ai": False,
        "view_count": 185,
        "upvotes_count": 14,
        "solutions": []
    }
]

async def init_database():
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Migration helpers for existing sqlite/postgres databases
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'email'"))
        except Exception:
            pass
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN provider_id VARCHAR(255)"))
        except Exception:
            pass

    async with AsyncSessionLocal() as session:
        # 1. Seed / Update Admin User
        res = await session.execute(select(User).where(User.username == "bexruz"))
        admin_user = res.scalars().first()
        if not admin_user:
            admin_user = User(
                username="bexruz",
                email="bexruz@devbexruz.uz",
                full_name="Bexruz Boynazarov",
                role="admin",
                github_profile="https://github.com/devbexruz",
                hashed_password=get_password_hash("Abdeix1006")
            )
            session.add(admin_user)
        else:
            admin_user.hashed_password = get_password_hash("Abdeix1006")
            admin_user.role = "admin"
        await session.commit()

        # 2. Seed Services
        res_serv = await session.execute(select(ServiceItem))
        if not res_serv.scalars().first():
            for i, item in enumerate(DEFAULT_CATALOG):
                s = ServiceItem(
                    key=item["key"],
                    name=item["name"],
                    category=item["category"],
                    description=item["description"],
                    duration_estimate=item["duration_estimate"],
                    price_min=item["price_min"],
                    price_max=item["price_max"],
                    order_index=i
                )
                session.add(s)
            await session.commit()

        # 3. Seed Projects
        res_proj = await session.execute(select(ProjectItem))
        if not res_proj.scalars().first():
            for p in DEFAULT_PROJECTS:
                proj = ProjectItem(**p)
                session.add(proj)
            await session.commit()

        # 4. Seed Problems
        res_prob = await session.execute(select(Problem))
        if not res_prob.scalars().first():
            for p_data in INITIAL_PROBLEMS:
                solutions_data = p_data.pop("solutions", [])
                prob = Problem(**p_data)
                session.add(prob)
                await session.flush()

                for s_data in solutions_data:
                    sol = Solution(
                        problem_id=prob.id,
                        **s_data
                    )
                    session.add(sol)
            await session.commit()

        # 5. Seed Initial Blog & Career Posts
        res_blog = await session.execute(select(BlogPost))
        if not res_blog.scalars().first():
            initial_blogs = [
                {
                    "title": "Forward Deployed Engineer (FDE) roli nima va nima uchun bugungi bizneslarga aynan shunday muhandis kerak?",
                    "slug": "forward-deployed-engineer-role-and-business-impact",
                    "category": "Karyera & Falsafa",
                    "read_time": "5 daqiqa",
                    "tags": "FDE, Systems Architect, Karyera, Business Engineering",
                    "summary": "Klassik dasturchi faqat Jira tasklarini yopadi. Forward Deployed Engineer esa biznes ichiga kirib, operatsion to'siqlarni aniqlaydi va bir necha haftada ishlab ketadigan mustahkam tizim quradi.",
                    "content_markdown": """### Forward Deployed Engineer (FDE) — Dasturchi va Biznes o'rtasidagi ko'prik

Ko'p yillar davomida dasturiy ta'minot kompaniyalarida bir muammo saqlanib qoldi: **dasturchilar kod yozadi, lekin biznesning real og'riqlarini tushunmaydi**. Natijada oylar davomida ishlab chiqilgan tizimlar amalda ishlatilmaydi yoki biznes operatsiyalarini sekinlashtiradi.

Aynan shu bo'shliqni to'ldirish uchun **Forward Deployed Engineer (FDE)** roli paydo bo'ldi (Palantir va zamonaviy AI laboratoriyalari ilgari surgan konseptsiya).

#### FDE qanday ishlaydi?
1. **Biznes ichiga chuqur kirish:** Kabinetda o'tirib texnik talabnoma (TOR) kutish emas, balki to'g'ridan-to'g'ri biznes asoschilari, omborchilar, menejerlar bilan muloqot qilib, real muammoni topish.
2. **Tezkor prototip va arxitektura:** 2-3 kunda ishlovchi prototip chiqarish va uni darhol ishlab chiqarish jarayonida sinash.
3. **Avtomatlashtirish & High-Load:** Faqat vaqtinchalik yechim emas, balki korxona 10 barobar kattalashganda ham yiqilmaydigan arxitektura (FastAPI, PostgreSQL, Redis, Celery) qurish.

> *"Faqat kod yozish emas — biznesga real moliyaviy va operatsion qiymat olib kelish mening muhandislik burchimdir."*""",
                },
                {
                    "title": "O'zMU Amaliy matematika fakultetidan Real Tizimlar Arxitekturasigacha: 6 yillik tajriba saboqlari",
                    "slug": "ozmu-applied-math-to-systems-architecture-journey",
                    "category": "Muhandislik Yo'li",
                    "read_time": "6 daqiqa",
                    "tags": "O'zMU, Matematika, Algoritmlar, PostgreSQL, Backend",
                    "summary": "Matematik modellashtirish, diskret matematika va murakkab algoritmlar qanday qilib millionlab so'rovlarni boshqaruvchi backend arxitekturasida hal qiluvchi rol o'ynashi haqida shaxsiy tahlil.",
                    "content_markdown": """### Nega fundamental matematika backend muhandisiga kerak?

O'zbekiston Milliy Universiteti (O'zMU) Amaliy matematika fakultetida ta'lim olish menga faqat formulalarni yodlashni emas, balki **har qanday muammoga tizimli va qat'iy mantiqiy yondashishni** o'rgatdi.

#### 1. Indekslash va Graf nazariyasi
PostgreSQL'da 10M+ yozuvli jadvallarni optimallashtirish shunchaki `CREATE INDEX` yozish emas. Bu B-Tree va Hash daraxtlari tuzilishini, xotirada sahifalar (pages) qanday joylashishini tushunishni talab qiladi.

#### 2. Ehtimollar nazariyasi va Asinxron navbatlar
Pik yuklamalar paytida Celery workerlari va Redis xotirasini rejalashtirishda ehtimollik taqsimotlari tizimni qulashdan asrab qoladi.

#### 3. Algoritmik intizom
Murakkab biznes mantiqni to'g'ri algoritmlar bilan qurish orqali server xarajatlarini 60% gacha tejash mumkin. Matematik tafakkur — bu toza va o'zgarmas arxitektura kalitidir.""",
                },
                {
                    "title": "Agentic Coding: Nega qo'lda mexanik kod terish davri yakunlandi?",
                    "slug": "agentic-coding-future-of-software-engineering",
                    "category": "AI & Innovatsiya",
                    "read_time": "4 daqiqa",
                    "tags": "AI, Agentic Coding, Claude, Fast Development, Kelajak",
                    "summary": "Bugungi kunda dasturchining qudrati minutiga 50 qator kod yozishda emas, balki AI agentlariga to'g'ri arxitektura berib, ularni boshqara olishidadir.",
                    "content_markdown": """### Muhandislikning yangi davri: Arxitektor-Operator

AI vositalari paydo bo'lgach, dasturchilik kasbi o'zining eng katta transformatsiyasini boshdan kechirmoqda. 

#### Agentic Engineering nima degani?
- **Inson vazifasi:** Tizim xavfsizligi, ma'lumotlar bazasi normalizatsiyasi, biznes talablarini texnik arxitekturaga aylantirish va xatarlarni baholash.
- **AI vazifasi:** Sintaksis yozish, unit testlarni qoplash, standart boilerplate kodlarni generatsiya qilish.

Aynan shu metodologiya orqali men va mening jamoam **2 oy davom etadigan korporativ tizimlarni 2-3 haftada mukammal sifat bilan** topshirishga erishmoqdamiz. Kelajak — bu AI'dan qo'rqqanlar emas, balki uni o'zining superkuchi qilib olgan tizim arxitektorlarinikidir.""",
                }
            ]
            for b_data in initial_blogs:
                post = BlogPost(**b_data)
                session.add(post)
            await session.commit()
            
    print("Database initialized & seeded successfully!")

if __name__ == "__main__":
    asyncio.run(init_database())
