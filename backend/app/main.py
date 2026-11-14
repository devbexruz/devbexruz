from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.init_db import init_database
from app.api.v1.auth import router as auth_router
from app.api.v1.problems import router as problems_router
from app.api.v1.ai_estimator import router as ai_router
from app.api.v1.services import router as services_router
from app.api.v1.projects import router as projects_router
from app.api.v1.leads import router as leads_router
from app.api.v1.seo_admin import router as seo_admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed data on startup
    await init_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="DevBexruz Platform Backend: Developer Q&A Community, SEO Meta Engine, and Founder AI Business Estimator",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(problems_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(services_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(leads_router, prefix=settings.API_V1_STR)
app.include_router(seo_admin_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to DevBexruz Platform API",
        "docs": "/docs",
        "founder": "Bexruz Boynazarov"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
