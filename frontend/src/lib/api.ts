// Dynamic API Base URL:
// In browser: ALWAYS use same-origin relative path "/api/v1" (prevents localhost Mixed Content / Failed to fetch errors)
// In SSR (Server Components): use internal backend URL
export const getApiBase = (): string => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return (
    process.env.INTERNAL_API_URL ||
    (process.env.NODE_ENV === "production" ? "http://127.0.0.1:8005/api/v1" : "http://127.0.0.1:8000/api/v1")
  );
};

export const API_BASE = {
  toString: () => getApiBase(),
  valueOf: () => getApiBase(),
};


export interface ServiceItem {
  id: string;
  key: string;
  name: string;
  category: string;
  description: string;
  duration_estimate: string;
  price_min: number;
  price_max: number;
  is_active: boolean;
  order_index: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  business_problem: string;
  technical_solution: string;
  metrics_results: string;
  live_url?: string;
  github_url?: string;
  image_url?: string;
  is_featured: boolean;
  order_index: number;
}

export interface CommentItem {
  id: string;
  content: string;
  author_name?: string;
  author_id?: string;
  paragraph_index?: number | null;
  problem_id?: string | null;
  solution_id?: string | null;
  parent_id?: string | null;
  is_flagged?: boolean;
  is_hidden?: boolean;
  created_at: string;
  replies?: CommentItem[];
}

export interface ReportItem {
  id: string;
  reporter_id?: string;
  reporter_name: string;
  target_type: "problem" | "solution" | "comment";
  target_id: string;
  reason: string;
  details?: string;
  status: "pending" | "restored" | "deleted";
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  target_content?: string;
  target_author?: string;
  problem_title?: string;
  parent_content?: string;
}

export interface SolutionItem {
  id: string;
  problem_id: string;
  author_name: string;
  author_id?: string;
  content_markdown: string;
  is_accepted: boolean;
  upvotes_count: number;
  is_flagged?: boolean;
  is_hidden?: boolean;
  created_at: string;
  comments?: CommentItem[];
}

export interface ProblemItem {
  id: string;
  title: string;
  slug: string;
  content_markdown: string;
  tags?: string;
  status: string;
  post_type?: string;
  view_count: number;
  upvotes_count: number;
  is_flagged?: boolean;
  is_hidden?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_generated_by_ai: boolean;
  meta_generated_at?: string;
  effective_meta_title?: string;
  effective_meta_description?: string;
  created_at: string;
  updated_at: string;
  solutions: SolutionItem[];
  comments?: CommentItem[];
  author?: { id: string; username: string; full_name?: string };
}

export interface SelectedServiceItem {
  key: string;
  name: string;
  category: string;
  reason: string;
  price_estimate: string;
  duration: string;
}

export interface BusinessEstimateResponse {
  problem_diagnosis: string;
  recommended_architecture: string;
  selected_services: SelectedServiceItem[];
  total_price_min: number;
  total_price_max: number;
  total_duration_estimate: string;
  deliverables: string[];
  business_roi: string;
  call_to_action: string;
}

export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const res = await fetch(`${API_BASE}/services`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Services fetch failed");
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Projects fetch failed");
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchProblems(tag?: string, q?: string, sort_by: string = "latest"): Promise<ProblemItem[]> {
  try {
    const params = new URLSearchParams();
    if (tag) params.append("tag", tag);
    if (q) params.append("q", q);
    if (sort_by) params.append("sort_by", sort_by);
    
    const res = await fetch(`${API_BASE}/problems?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Problems fetch failed");
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchProblemBySlug(slug: string): Promise<ProblemItem | null> {
  try {
    const res = await fetch(`${API_BASE}/problems/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function estimateBusinessSolution(data: {
  problem_description: string;
  business_type?: string;
  contact_name?: string;
  contact_info?: string;
}): Promise<BusinessEstimateResponse> {
  const res = await fetch(`${API_BASE}/ai/estimate-solution`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Estimation failed");
  return await res.json();
}

export async function submitLeadInquiry(data: {
  client_name: string;
  client_contact: string;
  business_type?: string;
  problem_description: string;
  estimated_solution_json?: string;
}) {
  const res = await fetch(`${API_BASE}/leads/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function createProblem(data: {
  title: string;
  content_markdown: string;
  tags?: string;
  author_name?: string;
  post_type?: string;
}): Promise<ProblemItem> {
  const session = getAuthSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  const res = await fetch(`${API_BASE}/problems`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Create problem failed");
  return await res.json();
}

export async function addSolution(problemId: string, data: {
  author_name: string;
  content_markdown: string;
}): Promise<SolutionItem> {
  const session = getAuthSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  const res = await fetch(`${API_BASE}/problems/${problemId}/solutions`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Add solution failed");
  return await res.json();
}

export async function upvoteProblem(problemId: string) {
  const res = await fetch(`${API_BASE}/problems/${problemId}/upvote`, { method: "POST" });
  return await res.json();
}

export async function upvoteSolution(solutionId: string) {
  const res = await fetch(`${API_BASE}/problems/solutions/${solutionId}/upvote`, { method: "POST" });
  return await res.json();
}

export const getAdminToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token") || localStorage.getItem("auth_token");
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchSeoStats() {
  const res = await fetch(`${API_BASE}/admin/seo/stats`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("SEO statistikasini yuklab bo'lmadi (Admin ruxsati kerak)");
  return await res.json();
}

export async function generateProblemSeo(problemId: string) {
  const res = await fetch(`${API_BASE}/admin/seo/generate-meta/${problemId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("SEO generatsiyada xatolik (Admin ruxsati kerak)");
  return await res.json();
}

export async function batchGenerateSeo(limit: number = 10, onlyUnoptimized: boolean = false) {
  const res = await fetch(`${API_BASE}/admin/seo/batch-generate-top-k?limit=${limit}&only_unoptimized=${onlyUnoptimized}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Batch SEO generatsiyada xatolik (Admin ruxsati kerak)");
  return await res.json();
}

// --- Blog & Career News API ---
export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content_markdown: string;
  tags: string;
  image_url?: string;
  read_time: string;
  is_published: boolean;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export async function fetchBlogs(category?: string): Promise<BlogPostItem[]> {
  try {
    const url = category && category !== "Barchasi" 
      ? `${API_BASE}/blogs?category=${encodeURIComponent(category)}`
      : `${API_BASE}/blogs`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPostItem | null> {
  try {
    const res = await fetch(`${API_BASE}/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchAdminBlogs(): Promise<BlogPostItem[]> {
  const res = await fetch(`${API_BASE}/admin/blogs/all`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Bloglarni yuklab bo'lmadi");
  return await res.json();
}

export async function createAdminBlog(data: Partial<BlogPostItem>): Promise<BlogPostItem> {
  const res = await fetch(`${API_BASE}/admin/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Blog yaratib bo'lmadi");
  return await res.json();
}

export async function updateAdminBlog(id: string, data: Partial<BlogPostItem>): Promise<BlogPostItem> {
  const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Blogni tahrirlab bo'lmadi");
  return await res.json();
}

export async function deleteAdminBlog(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Blogni o'chirib bo'lmadi");
}

// --- User Authentication API ---
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  auth_provider?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export async function loginUser(emailOrUsername: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_or_username: emailOrUsername, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login xatoligi" }));
    throw new Error(err.detail || "Email yoki parol noto'g'ri");
  }
  return await res.json();
}

export async function sendVerificationCode(email: string): Promise<{
  success: boolean;
  message: string;
  expires_in_seconds: number;
  test_code?: string;
}> {
  const res = await fetch(`${API_BASE}/auth/send-verification-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Kod yuborishda xatolik" }));
    throw new Error(err.detail || "Kod yuborishda xatolik yuz berdi");
  }
  return await res.json();
}

export async function registerWithCode(data: {
  email: string;
  code: string;
  full_name: string;
  password?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register-with-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Ro'yxatdan o'tishda xatolik" }));
    throw new Error(err.detail || "Ro'yxatdan o'tish amalga oshmadi");
  }
  return await res.json();
}

export async function authWithGoogle(payload: {
  email: string;
  name?: string;
  avatar_url?: string;
  sub?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Google orqali kirishda xatolik" }));
    throw new Error(err.detail || "Google autentifikatsiyasi amalga oshmadi");
  }
  return await res.json();
}

export async function authWithTelegram(payload: {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/telegram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Telegram orqali kirishda xatolik" }));
    throw new Error(err.detail || "Telegram autentifikatsiyasi amalga oshmadi");
  }
  return await res.json();
}

export async function sendTelegramCode(phoneNumber: string): Promise<{
  success: boolean;
  message: string;
  sent_via_bot: boolean;
  bot_url?: string;
  expires_in_seconds: number;
  test_code?: string;
}> {
  const res = await fetch(`${API_BASE}/auth/telegram/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number: phoneNumber }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Telegram orqali kod yuborishda xatolik" }));
    throw new Error(err.detail || "Telegram orqali kod yuborishda xatolik yuz berdi");
  }
  return await res.json();
}

export async function verifyTelegramCode(data: {
  phone_number: string;
  code: string;
  full_name?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/telegram/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Telegram kodini tasdiqlashda xatolik" }));
    throw new Error(err.detail || "Telegram kodi noto'g'ri yoki muddati tugagan");
  }
  return await res.json();
}

export function saveAuthSession(auth: AuthResponse) {
  if (typeof window !== "undefined") {
    localStorage.setItem("devbexruz_token", auth.access_token);
    localStorage.setItem("devbexruz_user", JSON.stringify(auth.user));
    window.dispatchEvent(new Event("auth-changed"));
  }
}

export function getAuthSession(): { token: string | null; user: AuthUser | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("devbexruz_token");
  const userJson = localStorage.getItem("devbexruz_user");
  try {
    return { token, user: userJson ? JSON.parse(userJson) : null };
  } catch {
    return { token: null, user: null };
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("devbexruz_token");
    localStorage.removeItem("devbexruz_user");
    window.dispatchEvent(new Event("auth-changed"));
  }
}

export interface ProblemAIPolishResult {
  id?: string;
  slug?: string;
  title: string;
  category?: string;
  problem_summary?: string;
  root_cause?: string;
  recommended_architecture?: string;
  tech_stack?: string[];
  tags: string;
  content_markdown: string;
  author_name: string;
  is_saved: boolean;
}

export async function aiPolishProblem(data: {
  author_name: string;
  contact?: string;
  raw_problem: string;
  publish_immediately?: boolean;
}): Promise<ProblemAIPolishResult> {
  const res = await fetch(`${API_BASE}/problems/ai-polish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "AI tahlil qilishda xatolik" }));
    throw new Error(err.detail || "Muammoni AI orqali tahlil qilishda xatolik yuz berdi");
  }
  return await res.json();
}

export async function updateUserRole(role: "business" | "developer"): Promise<AuthUser> {
  const session = getAuthSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  const res = await fetch(`${API_BASE}/auth/role`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Rolni yangilashda xatolik" }));
    throw new Error(err.detail || "Rol yangilanmadi");
  }
  const updatedUser = await res.json();
  if (session.token) {
    saveAuthSession({ access_token: session.token, token_type: "bearer", user: updatedUser });
  }
  return updatedUser;
}

// --- Comments API ---
export async function fetchComments(params: {
  problem_id?: string;
  solution_id?: string;
  paragraph_index?: number;
}): Promise<CommentItem[]> {
  const query = new URLSearchParams();
  if (params.problem_id) query.append("problem_id", params.problem_id);
  if (params.solution_id) query.append("solution_id", params.solution_id);
  if (params.paragraph_index !== undefined && params.paragraph_index !== null) {
    query.append("paragraph_index", params.paragraph_index.toString());
  }

  const res = await fetch(`${API_BASE}/comments?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Sharhlarni yuklashda xatolik");
  return await res.json();
}

export async function createComment(data: {
  content: string;
  problem_id?: string;
  solution_id?: string;
  parent_id?: string;
  paragraph_index?: number | null;
  author_name?: string;
}): Promise<CommentItem> {
  const session = getAuthSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Izoh yozishda xatolik" }));
    throw new Error(err.detail || "Izoh yozishda xatolik yuz berdi");
  }
  return await res.json();
}

// --- Reports & Moderation API ---
export async function submitReport(data: {
  target_type: "problem" | "solution" | "comment";
  target_id: string;
  reason: string;
  details?: string;
  reporter_name?: string;
}): Promise<{ success: boolean; message: string; report_id: string }> {
  const session = getAuthSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Shikoyat yuborishda xatolik" }));
    throw new Error(err.detail || "Shikoyat yuborishda xatolik yuz berdi");
  }
  return await res.json();
}

export async function fetchAdminReports(statusFilter?: string): Promise<ReportItem[]> {
  const query = statusFilter ? `?status_filter=${statusFilter}` : "";
  const res = await fetch(`${API_BASE}/reports/admin/reports${query}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Shikoyatlarni yuklashda xatolik (Admin ruxsati zarur)");
  }
  return await res.json();
}

export async function reviewAdminReport(
  reportId: string,
  action: "restore" | "delete",
  adminNotes?: string
): Promise<ReportItem> {
  const res = await fetch(`${API_BASE}/reports/admin/reports/${reportId}/review`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, admin_notes: adminNotes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Shikoyatni ko'rib chiqishda xatolik" }));
    throw new Error(err.detail || "Amalni bajarib bo'lmadi");
  }
  return await res.json();
}

// --- Image Upload API (Max 1024px with WebP optimization) ---
export async function uploadImage(file: File): Promise<{
  success: boolean;
  url: string;
  width: number;
  height: number;
  filename: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload/image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Rasm yuklashda xatolik" }));
    throw new Error(err.detail || "Rasm yuklashda xatolik yuz berdi");
  }
  return await res.json();
}

