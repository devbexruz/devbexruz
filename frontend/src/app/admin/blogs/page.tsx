"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Newspaper, Plus, Edit3, Trash2, CheckCircle2, Clock, 
  Tag, RefreshCw, X, Eye, FileText, Sparkles 
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { 
  BlogPostItem, fetchAdminBlogs, createAdminBlog, 
  updateAdminBlog, deleteAdminBlog 
} from "@/lib/api";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Karyera & Falsafa");
  const [summary, setSummary] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("4 daqiqa");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "Karyera & Falsafa",
    "Muhandislik Yo'li",
    "AI & Innovatsiya",
    "Yangiliklar & E'lonlar",
    "Arxitektura & Tizimlar"
  ];

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBlogs();
      setBlogs(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle("");
    setCategory("Karyera & Falsafa");
    setSummary("");
    setContentMarkdown("");
    setTags("");
    setReadTime("4 daqiqa");
    setIsPublished(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (post: BlogPostItem) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setSummary(post.summary);
    setContentMarkdown(post.content_markdown);
    setTags(post.tags);
    setReadTime(post.read_time);
    setIsPublished(post.is_published);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !contentMarkdown.trim()) {
      setError("Sarlavha, qisqa tavsif va maqola matni majburiy!");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        category,
        summary: summary.trim(),
        content_markdown: contentMarkdown.trim(),
        tags: tags.trim(),
        read_time: readTime.trim() || "4 daqiqa",
        is_published: isPublished,
        author_name: "Bexruz Boynazarov"
      };

      if (editingPost) {
        await updateAdminBlog(editingPost.id, payload);
      } else {
        await createAdminBlog(payload);
      }

      setModalOpen(false);
      await loadBlogs();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (post: BlogPostItem) => {
    if (!confirm(`Haqiqatan ham "${post.title}" maqolasini o'chirmoqchimisiz?`)) {
      return;
    }
    try {
      await deleteAdminBlog(post.id);
      await loadBlogs();
    } catch (err: any) {
      alert("O'chirishda xatolik: " + err.message);
    }
  };

  const handleTogglePublish = async (post: BlogPostItem) => {
    try {
      await updateAdminBlog(post.id, { is_published: !post.is_published });
      await loadBlogs();
    } catch (err: any) {
      alert("Holatni o'zgartirishda xatolik: " + err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
              <Newspaper className="w-3.5 h-3.5 text-blue-600" />
              Karyera &amp; Muhandislik Blogi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Shaxsiy Blog va Yangiliklar Boshqaruvi
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Bu yerda yozilgan postlar "Men haqimda" (/about) sahifasida barcha tashrif buyuruvchilarga chiroyli kartochkalar sifatida taqdim etiladi.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Maqola Yozish</span>
          </button>
        </div>

        {/* Blogs List */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Yuklanmoqda...
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white text-slate-500 text-xs">
            Hozircha birorta ham maqola mavjud emas. Yangi maqola yozish tugmasini bosing!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {b.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      b.is_published 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {b.is_published ? "Chop etilgan" : "Qoralama"}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {b.read_time}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      · {new Date(b.created_at).toLocaleDateString("uz-UZ")}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {b.summary}
                  </p>

                  {b.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {b.tags.split(",").map((t, idx) => (
                        <span key={idx} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleTogglePublish(b)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                    title={b.is_published ? "Qoralama holatiga o'tkazish" : "Chop etish"}
                  >
                    {b.is_published ? "Yashirish" : "Chop etish"}
                  </button>

                  <button
                    onClick={() => openEditModal(b)}
                    className="p-2 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(b)}
                    className="p-2 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {editingPost ? "Maqolani Tahrirlash" : "Yangi Karyera & Blog Posti"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Bexruz Boynazarov shaxsiy muhandislik tajribalari
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Maqola Sarlavhasi *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Forward Deployed Engineer roli va biznesdagi o'rni..."
                    required
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Kategoriya *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      O'qish vaqti
                    </label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="Masalan: 5 daqiqa"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Qisqa Tavsif / Mohiyat (Summary) *
                  </label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Maqolaning asosiy mazmuni va nimaga bag'ishlanganligi (kartochkada ko'rinadi)..."
                    required
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Teglar (Vergul bilan ajrating)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="FastAPI, High-Load, Architecture, O'zMU"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    To'liq Matn (Markdown qo'llab-quvvatlanadi) *
                  </label>
                  <textarea
                    rows={8}
                    value={contentMarkdown}
                    onChange={(e) => setContentMarkdown(e.target.value)}
                    placeholder="### Sarlavha&#10;&#10;Bu yerda maqolangiz matnini to'liq yozing. Kodlar yoki sitatalar qo'yishingiz mumkin..."
                    required
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_published" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Darhol chop etilsin ("Men haqimda" sahifasida faol bo'lsin)
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Saqlanmoqda..." : (editingPost ? "O'zgarishlarni Saqlash" : "Maqolani Joylash")}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
