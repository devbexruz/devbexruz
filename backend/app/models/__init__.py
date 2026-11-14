import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, DateTime, ForeignKey, Table, Enum
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="developer") # "developer", "admin"
    avatar_url = Column(String(500), nullable=True)
    github_profile = Column(String(255), nullable=True)
    auth_provider = Column(String(50), default="email") # "email", "google", "telegram"
    provider_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    problems = relationship("Problem", back_populates="author", cascade="all, delete-orphan")
    solutions = relationship("Solution", back_populates="author", cascade="all, delete-orphan")

class EmailVerificationCode(Base):
    __tablename__ = "email_verification_codes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), index=True, nullable=False)
    code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Problem(Base):
    __tablename__ = "problems"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    author_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    content_markdown = Column(Text, nullable=False)
    status = Column(String(50), default="open") # "open", "solved"
    view_count = Column(Integer, default=0)
    upvotes_count = Column(Integer, default=0)
    tags = Column(String(255), default="") # Comma-separated tags e.g. "FastAPI, PostgreSQL, Async"
    
    # Advanced SEO Meta fields (Google & Yandex optimized)
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(String(500), nullable=True)
    meta_generated_by_ai = Column(Boolean, default=False)
    meta_generated_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = relationship("User", back_populates="problems")
    solutions = relationship("Solution", back_populates="problem", cascade="all, delete-orphan", order_by="desc(Solution.is_accepted), desc(Solution.upvotes_count)")

class Solution(Base):
    __tablename__ = "solutions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    author_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    author_name = Column(String(255), default="Anonim Dasturchi")
    content_markdown = Column(Text, nullable=False)
    is_accepted = Column(Boolean, default=False)
    upvotes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("Problem", back_populates="solutions")
    author = relationship("User", back_populates="solutions")

class ServiceItem(Base):
    __tablename__ = "service_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    key = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # "core_system", "integration", "optimization", "cloud"
    description = Column(Text, nullable=False)
    duration_estimate = Column(String(100), nullable=False) # e.g. "1-2 hafta"
    price_min = Column(Integer, nullable=False) # e.g. 700
    price_max = Column(Integer, nullable=False) # e.g. 1200
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)

class ProjectItem(Base):
    __tablename__ = "project_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False) # "Founder", "Enterprise", "AI/ML", "SaaS"
    summary = Column(Text, nullable=False)
    business_problem = Column(Text, nullable=False)
    technical_solution = Column(Text, nullable=False)
    metrics_results = Column(Text, nullable=False)
    live_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)

class LeadInquiry(Base):
    __tablename__ = "lead_inquiries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_name = Column(String(255), nullable=False)
    client_contact = Column(String(255), nullable=False) # Telegram or phone
    business_type = Column(String(255), nullable=True)
    problem_description = Column(Text, nullable=False)
    estimated_solution_json = Column(Text, nullable=True)
    status = Column(String(50), default="new") # "new", "contacted", "in_progress", "closed"
    created_at = Column(DateTime, default=datetime.utcnow)
