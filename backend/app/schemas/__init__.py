from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None
    role: Optional[str] = "developer"
    github_profile: Optional[str] = None
    avatar_url: Optional[str] = None
    auth_provider: Optional[str] = "email"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class SendVerificationCodeRequest(BaseModel):
    email: str

class SendVerificationCodeResponse(BaseModel):
    success: bool
    message: str
    expires_in_seconds: int = 600
    test_code: Optional[str] = None

class RegisterWithCodeRequest(BaseModel):
    email: str
    code: str
    full_name: str
    password: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    sub: Optional[str] = None

class TelegramAuthRequest(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None
    auth_date: Optional[int] = None
    hash: Optional[str] = None

class TelegramSendCodeRequest(BaseModel):
    phone_number: str

class TelegramSendCodeResponse(BaseModel):
    success: bool
    message: str
    sent_via_bot: bool = False
    bot_url: Optional[str] = None
    expires_in_seconds: int = 600
    test_code: Optional[str] = None

class TelegramVerifyCodeRequest(BaseModel):
    phone_number: str
    code: str
    full_name: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Solution Schemas ---
class SolutionBase(BaseModel):
    content_markdown: str
    author_name: Optional[str] = "Anonim Dasturchi"

class SolutionCreate(SolutionBase):
    pass

class SolutionResponse(SolutionBase):
    id: str
    problem_id: str
    author_id: Optional[str] = None
    is_accepted: bool = False
    upvotes_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

# --- Problem Schemas (with SEO fields) ---
class ProblemBase(BaseModel):
    title: str
    content_markdown: str
    tags: Optional[str] = ""

class ProblemCreate(ProblemBase):
    author_name: Optional[str] = "Dasturchi"

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    content_markdown: Optional[str] = None
    tags: Optional[str] = None
    status: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class ProblemResponse(ProblemBase):
    id: str
    slug: str
    status: str
    view_count: int
    upvotes_count: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    meta_generated_by_ai: bool = False
    meta_generated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    solutions: List[SolutionResponse] = []
    author: Optional[UserResponse] = None

    # Fallback SEO helpers
    effective_meta_title: Optional[str] = None
    effective_meta_description: Optional[str] = None

    class Config:
        from_attributes = True

# --- AI Estimator & Services Schemas ---
class ServiceItemResponse(BaseModel):
    id: str
    key: str
    name: str
    category: str
    description: str
    duration_estimate: str
    price_min: int
    price_max: int
    is_active: bool
    order_index: int

    class Config:
        from_attributes = True

class ProjectItemResponse(BaseModel):
    id: str
    title: str
    slug: str
    category: str
    summary: str
    business_problem: str
    technical_solution: str
    metrics_results: str
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool
    order_index: int

    class Config:
        from_attributes = True

class BusinessEstimateRequest(BaseModel):
    problem_description: str = Field(..., min_length=10, description="Biznes egasi duch kelgan muammo yoki reja")
    business_type: Optional[str] = "E-Commerce / Xizmat"
    target_timeline: Optional[str] = "Tezroq"
    contact_name: Optional[str] = None
    contact_info: Optional[str] = None

class SelectedServiceItem(BaseModel):
    key: str
    name: str
    category: str
    reason: str
    price_estimate: str
    duration: str

class BusinessEstimateResponse(BaseModel):
    problem_diagnosis: str
    recommended_architecture: str
    selected_services: List[SelectedServiceItem]
    total_price_min: int
    total_price_max: int
    total_duration_estimate: str
    deliverables: List[str]
    business_roi: str
    call_to_action: str

class LeadInquiryCreate(BaseModel):
    client_name: str
    client_contact: str
    business_type: Optional[str] = None
    problem_description: str
    estimated_solution_json: Optional[str] = None

class LeadInquiryResponse(BaseModel):
    id: str
    client_name: str
    client_contact: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI SEO Meta Schemas ---
class AISecMetaGenerateRequest(BaseModel):
    problem_id: str

class AISecMetaBatchRequest(BaseModel):
    limit: int = 10

class AISecMetaResult(BaseModel):
    problem_id: str
    slug: str
    meta_title: str
    meta_description: str
    meta_keywords: str
    search_intent_summary: str
