import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, DateTime, ForeignKey, Table, Enum
)
from sqlalchemy.orm import relationship, backref
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

class TelegramUser(Base):
    __tablename__ = "telegram_users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    chat_id = Column(Integer, unique=True, index=True, nullable=False)
    telegram_id = Column(Integer, index=True, nullable=True)
    phone_number = Column(String(50), index=True, nullable=True)
    first_name = Column(String(255), nullable=True)
    username = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TelegramVerificationCode(Base):
    __tablename__ = "telegram_verification_codes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    phone_number = Column(String(50), index=True, nullable=True)
    chat_id = Column(Integer, index=True, nullable=True)
    code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Problem(Base):
    __tablename__ = "problems"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    author_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    post_type = Column(String(50), default="question") # "question" or "tutorial"
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    content_markdown = Column(Text, nullable=False)
    status = Column(String(50), default="open") # "open", "solved"
    view_count = Column(Integer, default=0)
    upvotes_count = Column(Integer, default=0)
    tags = Column(String(255), default="") # Comma-separated tags e.g. "FastAPI, PostgreSQL, Async"
    
    # Moderation fields
    is_flagged = Column(Boolean, default=False)
    is_hidden = Column(Boolean, default=False)

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
    comments = relationship("Comment", back_populates="problem", cascade="all, delete-orphan", foreign_keys="Comment.problem_id")

class Solution(Base):
    __tablename__ = "solutions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=False)
    author_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    author_name = Column(String(255), default="Anonim Dasturchi")
    content_markdown = Column(Text, nullable=False)
    is_accepted = Column(Boolean, default=False)
    upvotes_count = Column(Integer, default=0)
    is_flagged = Column(Boolean, default=False)
    is_hidden = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("Problem", back_populates="solutions")
    author = relationship("User", back_populates="solutions")
    comments = relationship("Comment", back_populates="solution", cascade="all, delete-orphan", foreign_keys="Comment.solution_id")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    problem_id = Column(String(36), ForeignKey("problems.id"), nullable=True)
    solution_id = Column(String(36), ForeignKey("solutions.id"), nullable=True)
    parent_id = Column(String(36), ForeignKey("comments.id"), nullable=True)
    paragraph_index = Column(Integer, nullable=True) # None = general comment, >= 0 = inline paragraph comment
    author_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    author_name = Column(String(255), default="Dasturchi")
    content = Column(Text, nullable=False)
    is_flagged = Column(Boolean, default=False)
    is_hidden = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("Problem", back_populates="comments", foreign_keys=[problem_id])
    solution = relationship("Solution", back_populates="comments", foreign_keys=[solution_id])
    author = relationship("User")
    replies = relationship("Comment", backref=backref("parent", remote_side=[id]), cascade="all, delete-orphan")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    reporter_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    reporter_name = Column(String(255), default="Foydalanuvchi")
    target_type = Column(String(50), nullable=False) # "problem", "solution", "comment"
    target_id = Column(String(36), nullable=False)
    reason = Column(String(255), nullable=False) # "spam", "harassment", "offensive", "incorrect", "other"
    details = Column(Text, nullable=True)
    status = Column(String(50), default="pending") # "pending", "restored", "deleted"
    reviewed_by = Column(String(255), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("User")

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

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), default="Career") # "Career", "Architecture", "Engineering", "News"
    summary = Column(Text, nullable=False)
    content_markdown = Column(Text, nullable=False)
    tags = Column(String(255), default="")
    image_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True)
    read_time = Column(String(50), default="4 min")
    author_name = Column(String(255), default="Bexruz Boynazarov")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
