const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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

export interface SolutionItem {
  id: string;
  problem_id: string;
  author_name: string;
  content_markdown: string;
  is_accepted: boolean;
  upvotes_count: number;
  created_at: string;
}

export interface ProblemItem {
  id: string;
  title: string;
  slug: string;
  content_markdown: string;
  tags?: string;
  status: string;
  view_count: number;
  upvotes_count: number;
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
}): Promise<ProblemItem> {
  const res = await fetch(`${API_BASE}/problems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Create problem failed");
  return await res.json();
}

export async function addSolution(problemId: string, data: {
  author_name: string;
  content_markdown: string;
}): Promise<SolutionItem> {
  const res = await fetch(`${API_BASE}/problems/${problemId}/solutions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export async function fetchSeoStats() {
  const res = await fetch(`${API_BASE}/admin/seo/stats`, { cache: "no-store" });
  return await res.json();
}

export async function generateProblemSeo(problemId: string) {
  const res = await fetch(`${API_BASE}/admin/seo/generate-meta/${problemId}`, { method: "POST" });
  return await res.json();
}

export async function batchGenerateSeo(limit: number = 10, onlyUnoptimized: boolean = false) {
  const res = await fetch(`${API_BASE}/admin/seo/batch-generate-top-k?limit=${limit}&only_unoptimized=${onlyUnoptimized}`, {
    method: "POST",
  });
  return await res.json();
}
