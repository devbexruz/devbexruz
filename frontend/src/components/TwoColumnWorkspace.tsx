"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  CheckCircle2,
  Sparkles,
  Send,
  Search,
  BookOpen,
  HelpCircle,
  Plus,
  ShieldAlert,
  CornerDownRight,
  User,
  Share2,
  Clock,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  ProblemItem,
  SolutionItem,
  CommentItem,
  fetchProblems,
  fetchProblemBySlug,
  createProblem,
  addSolution,
  upvoteProblem,
  upvoteSolution,
  fetchComments,
  createComment,
  getAuthSession,
} from "@/lib/api";
import NotionLikeEditor from "./NotionLikeEditor";
import ReportModal from "./ReportModal";

interface TwoColumnWorkspaceProps {
  initialSlug?: string;
}

export default function TwoColumnWorkspace({ initialSlug }: TwoColumnWorkspaceProps) {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [activeProblem, setActiveProblem] = useState<ProblemItem | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingActive, setLoadingActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "question" | "tutorial">("all");

  // New Solution State
  const [solutionAuthor, setSolutionAuthor] = useState("");
  const [solutionContent, setSolutionContent] = useState("");
  const [submittingSolution, setSubmittingSolution] = useState(false);

  // New Post / Problem / Tutorial Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"question" | "tutorial">("question");
  const [newTags, setNewTags] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submittingNew, setSubmittingNew] = useState(false);

  // Shikoyat (Report) Modal State
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    targetType: "problem" | "solution" | "comment";
    targetId: string;
    itemSnippet: string;
  }>({
    isOpen: false,
    targetType: "problem",
    targetId: "",
    itemSnippet: "",
  });

  // Track hidden items locally upon instant report
  const [hiddenItemIds, setHiddenItemIds] = useState<Set<string>>(new Set());

  // Active open paragraph comment thread (e.g. "problem-0", "solution-{id}-2")
  const [openParagraphKey, setOpenParagraphKey] = useState<string | null>(null);

  // Load problems list
  useEffect(() => {
    loadProblems();
    // Prefill author name from session if available
    const session = getAuthSession();
    if (session.user) {
      setSolutionAuthor(session.user.full_name || session.user.username);
    }
  }, []);

  const loadProblems = async () => {
    setLoadingList(true);
    try {
      const data = await fetchProblems();
      setProblems(data);
      if (data.length > 0) {
        if (initialSlug) {
          const matched = data.find((p) => p.slug === initialSlug);
          if (matched) {
            selectProblem(matched);
          } else {
            selectProblem(data[0]);
          }
        } else {
          selectProblem(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  const selectProblem = async (item: ProblemItem) => {
    setLoadingActive(true);
    try {
      const full = await fetchProblemBySlug(item.slug);
      setActiveProblem(full || item);
    } catch (e) {
      console.error(e);
      setActiveProblem(item);
    } finally {
      setLoadingActive(false);
    }
  };

  // Upvotes
  const handleUpvoteProblem = async () => {
    if (!activeProblem) return;
    try {
      const res = await upvoteProblem(activeProblem.id);
      setActiveProblem((prev) => (prev ? { ...prev, upvotes_count: res.upvotes_count } : null));
      setProblems((prev) =>
        prev.map((p) => (p.id === activeProblem.id ? { ...p, upvotes_count: res.upvotes_count } : p))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpvoteSolution = async (solutionId: string) => {
    if (!activeProblem) return;
    try {
      const res = await upvoteSolution(solutionId);
      setActiveProblem((prev) =>
        prev
          ? {
              ...prev,
              solutions: prev.solutions.map((s) =>
                s.id === solutionId ? { ...s, upvotes_count: res.upvotes_count } : s
              ),
            }
          : null
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Add Solution (Only to problem, Stack Overflow style)
  const handleAddSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProblem) return;
    if (!solutionContent.trim()) {
      alert("Yechim matni kiritilishi shart!");
      return;
    }
    setSubmittingSolution(true);
    try {
      const newSol = await addSolution(activeProblem.id, {
        author_name: solutionAuthor.trim() || "Dasturchi",
        content_markdown: solutionContent,
      });
      setActiveProblem((prev) =>
        prev ? { ...prev, solutions: [...(prev.solutions || []), newSol] } : null
      );
      setSolutionContent("");
      alert("Yechimingiz muvaffaqiyatli chop etildi!");
    } catch (err: any) {
      alert(err.message || "Yechim qo'shishda xatolik yuz berdi");
    } finally {
      setSubmittingSolution(false);
    }
  };

  // Create New Problem or Tutorial
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Sarlavha va matn maydonlari to'ldirilishi shart!");
      return;
    }
    setSubmittingNew(true);
    try {
      const session = getAuthSession();
      const authorName = session.user?.full_name || session.user?.username || "Dasturchi";
      const created = await createProblem({
        title: newTitle.trim(),
        content_markdown: newContent,
        tags: newTags.trim(),
        author_name: authorName,
        post_type: newType,
      });
      setProblems((prev) => [created, ...prev]);
      setActiveProblem(created);
      setShowNewModal(false);
      setNewTitle("");
      setNewTags("");
      setNewContent("");
      alert(newType === "tutorial" ? "Tutorial muvaffaqiyatli yaratildi!" : "Savol muvaffaqiyatli joylandi!");
    } catch (err: any) {
      alert(err.message || "Post yaratishda xatolik yuz berdi");
    } finally {
      setSubmittingNew(false);
    }
  };

  // Instant soft-hide upon reporting
  const handleReportSuccess = (targetType: "problem" | "solution" | "comment", targetId: string) => {
    setHiddenItemIds((prev) => new Set(prev).add(targetId));

    if (targetType === "problem") {
      setProblems((prev) => prev.filter((p) => p.id !== targetId));
      if (activeProblem?.id === targetId) {
        setActiveProblem(null);
      }
    } else if (targetType === "solution") {
      setActiveProblem((prev) =>
        prev
          ? {
              ...prev,
              solutions: prev.solutions.filter((s) => s.id !== targetId),
            }
          : null
      );
    }
  };

  const triggerReport = (
    targetType: "problem" | "solution" | "comment",
    targetId: string,
    snippet: string
  ) => {
    setReportModalData({
      isOpen: true,
      targetType,
      targetId,
      itemSnippet: snippet.slice(0, 100),
    });
  };

  // Filter problems for Left Telegram column
  const filteredProblems = problems.filter((item) => {
    if (hiddenItemIds.has(item.id)) return false;
    if (typeFilter !== "all" && item.post_type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTags = item.tags?.toLowerCase().includes(q);
      return matchTitle || matchTags;
    }
    return true;
  });

  // Sort solutions Stack Overflow style: accepted first, then highest upvotes
  const sortedSolutions = [...(activeProblem?.solutions || [])]
    .filter((s) => !hiddenItemIds.has(s.id) && !s.is_hidden)
    .sort((a, b) => {
      if (a.is_accepted && !b.is_accepted) return -1;
      if (!a.is_accepted && b.is_accepted) return 1;
      return (b.upvotes_count || 0) - (a.upvotes_count || 0);
    });

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Workspace Container - 2 Column Split (Telegram-Style) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
          
          {/* LEFT COLUMN: Telegram-Style Feed & Chat List (4 cols) */}
          <div className="lg:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/60 max-h-[850px]">
            {/* Left Header: Search, Filter Tabs & New Post Button */}
            <div className="p-3 border-b border-slate-200 bg-white space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Mavzular & Savollar
                </h2>
                <button
                  type="button"
                  onClick={() => setShowNewModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yangi Post</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Qidirish (kalit so'z, tag)..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-blue-400 focus:outline-hidden transition"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`flex-1 py-1 rounded-lg transition text-center ${
                    typeFilter === "all" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Hammasi
                </button>
                <button
                  onClick={() => setTypeFilter("question")}
                  className={`flex-1 py-1 rounded-lg transition text-center ${
                    typeFilter === "question" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Savollar
                </button>
                <button
                  onClick={() => setTypeFilter("tutorial")}
                  className={`flex-1 py-1 rounded-lg transition text-center ${
                    typeFilter === "tutorial" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tutoriallar
                </button>
              </div>
            </div>

            {/* Problems List Items (Telegram Chat Items) */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loadingList ? (
                <div className="p-8 text-center text-xs text-slate-400">Yuklanmoqda...</div>
              ) : filteredProblems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">Hech qanday mavzu topilmadi.</div>
              ) : (
                filteredProblems.map((item) => {
                  const isSelected = activeProblem?.id === item.id;
                  const isTutorial = item.post_type === "tutorial";

                  return (
                    <div
                      key={item.id}
                      onClick={() => selectProblem(item)}
                      className={`p-3.5 cursor-pointer transition relative flex items-start gap-3 ${
                        isSelected
                          ? "bg-blue-50/80 border-l-4 border-blue-600 shadow-xs"
                          : "hover:bg-slate-100/80"
                      }`}
                    >
                      {/* Avatar / Type Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          isTutorial
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : item.status === "solved"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        {isTutorial ? (
                          <BookOpen className="w-4 h-4" />
                        ) : item.status === "solved" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <HelpCircle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isTutorial
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-200/70 text-slate-700"
                            }`}
                          >
                            {isTutorial ? "Tutorial" : "Savol"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.created_at).toLocaleDateString("uz-UZ", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.content_markdown.replace(/[#*`]/g, "").slice(0, 80)}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                          <span className="text-slate-600 font-medium truncate max-w-[120px]">
                            {item.author?.full_name || item.author?.username || "Dasturchi"}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <span className="flex items-center gap-0.5">
                              <ThumbsUp className="w-3 h-3 text-slate-400" />
                              {item.upvotes_count || 0}
                            </span>
                            <span className="flex items-center gap-0.5 font-semibold text-blue-600">
                              <MessageSquare className="w-3 h-3" />
                              {item.solutions?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Post Details, Paragraph Comments & Notion Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-white overflow-y-auto max-h-[850px]">
            {loadingActive ? (
              <div className="p-16 text-center text-sm text-slate-400">Yuklanmoqda...</div>
            ) : !activeProblem ? (
              <div className="p-16 text-center flex flex-col items-center justify-center h-full text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
                <h4 className="text-sm font-bold text-slate-700">Hech qanday mavzu tanlanmagan</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Chap tarafdagi ro'yxatdan muammo yoki qo'llanmani tanlang.
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Active Post Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          activeProblem.post_type === "tutorial"
                            ? "bg-purple-100 text-purple-800"
                            : activeProblem.status === "solved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {activeProblem.post_type === "tutorial"
                          ? "Qo'llanma / Tutorial"
                          : activeProblem.status === "solved"
                          ? "Yechilgan"
                          : "Ochiq Savol"}
                      </span>
                      {activeProblem.tags && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          #{activeProblem.tags}
                        </span>
                      )}
                    </div>

                    {/* Upvote & Report Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleUpvoteProblem}
                        className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-xs font-semibold text-slate-700 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{activeProblem.upvotes_count || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          triggerReport("problem", activeProblem.id, activeProblem.title)
                        }
                        className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition"
                        title="Shikoyat qilish (Shu zahoti yashiriladi)"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                        <span>Shikoyat</span>
                      </button>
                    </div>
                  </div>

                  <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {activeProblem.title}
                  </h1>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="font-semibold text-slate-700">
                      {activeProblem.author?.full_name || activeProblem.author?.username || "Dasturchi"}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(activeProblem.created_at).toLocaleDateString("uz-UZ", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {activeProblem.view_count || 1} ko'rildi
                    </span>
                  </div>
                </div>

                {/* Post Body with Paragraph-Level Comments */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <SectionWithParagraphComments
                    contentMarkdown={activeProblem.content_markdown}
                    targetId={activeProblem.id}
                    targetType="problem"
                    openKey={openParagraphKey}
                    onToggleKey={(key) =>
                      setOpenParagraphKey(openParagraphKey === key ? null : key)
                    }
                    onTriggerReport={triggerReport}
                  />
                </div>

                {/* Stack Overflow Solutions Section */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      Yechimlar ({sortedSolutions.length})
                    </h2>
                    <span className="text-xs text-slate-500">
                      Stack Overflow qoidasi: Eng yaxshi yechim birinchi
                    </span>
                  </div>

                  {sortedSolutions.length === 0 ? (
                    <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                      Hozircha yechimlar yo'q. Birinchi bo'lib o'z yechimingizni qoldiring!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedSolutions.map((sol) => (
                        <div
                          key={sol.id}
                          className={`p-4 rounded-xl border transition ${
                            sol.is_accepted
                              ? "bg-emerald-50/40 border-emerald-200"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          {/* Solution Top Bar */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              {sol.is_accepted && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Check className="w-3 h-3 text-emerald-600" /> Qabul qilingan yechim
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-800">
                                {sol.author_name || "Dasturchi"}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(sol.created_at).toLocaleDateString("uz-UZ")}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleUpvoteSolution(sol.id)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-xs font-semibold text-slate-700 transition"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{sol.upvotes_count || 0}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  triggerReport("solution", sol.id, sol.content_markdown)
                                }
                                className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                                title="Shikoyat qilish"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Solution Content with Paragraph-Level Comments */}
                          <SectionWithParagraphComments
                            contentMarkdown={sol.content_markdown}
                            targetId={sol.id}
                            targetType="solution"
                            openKey={openParagraphKey}
                            onToggleKey={(key) =>
                              setOpenParagraphKey(openParagraphKey === key ? null : key)
                            }
                            onTriggerReport={triggerReport}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Write Solution Box (Notion-Style Editor) */}
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    O'z Yechimingizni Yozing
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Notion uslubidagi formatlash, klaviatura kombinatsiyalari va 1024px gacha foizli rasm yuklash imkoniyati.
                  </p>

                  <form onSubmit={handleAddSolution} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Ismingiz / Taxallusingiz:
                        </label>
                        <input
                          type="text"
                          value={solutionAuthor}
                          onChange={(e) => setSolutionAuthor(e.target.value)}
                          placeholder="Masalan: Bexruz Boynazarov"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <NotionLikeEditor
                      value={solutionContent}
                      onChange={setSolutionContent}
                      placeholder="Aniq va tushunarli yechim yozing. Kod bloklari va tushuntirishlarni kiriting..."
                      minHeight="180px"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingSolution}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingSolution ? "Yuborilmoqda..." : "Yechimni Chop Etish"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Problem / Tutorial Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {newType === "tutorial" ? "Yangi Tutorial / Qo'llanma Yuklash" : "Yangi Muammo / Savol Yaratish"}
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setNewType("question")}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    newType === "question" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                  }`}
                >
                  Savol (Q&A Muammo)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("tutorial")}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    newType === "tutorial" ? "bg-white text-purple-600 shadow-xs" : "text-slate-600"
                  }`}
                >
                  Tutorial (Tayyor Yechim / Maqola)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sarlavha:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    newType === "tutorial"
                      ? "Masalan: Next.js 16 va Tailwind 4 integratsiyasi bo'yicha to'liq qo'llanma"
                      : "Masalan: FastAPI da CORS xatoligi qanday hal qilinadi?"
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teglar (vergul bilan):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="FastAPI, Python, Docker"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batafsil matn (Notion uslubida):
                </label>
                <NotionLikeEditor
                  value={newContent}
                  onChange={setNewContent}
                  placeholder="Mavzuni to'liq tushuntiring, kod va rasmlar joylang..."
                  minHeight="220px"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submittingNew}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {submittingNew ? "Chop etilmoqda..." : "Chop Etish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shikoyat Modal */}
      <ReportModal
        isOpen={reportModalData.isOpen}
        onClose={() => setReportModalData((prev) => ({ ...prev, isOpen: false }))}
        targetType={reportModalData.targetType}
        targetId={reportModalData.targetId}
        itemTitleOrSnippet={reportModalData.itemSnippet}
        onReportSuccess={handleReportSuccess}
      />
    </div>
  );
}

// ----------------------------------------------------
// SectionWithParagraphComments: Renders text split into paragraphs.
// Excludes headers from paragraph commenting, adds side comment icon
// to paragraphs and code blocks, and allows inline commenting & replies.
// ----------------------------------------------------
interface SectionWithParagraphProps {
  contentMarkdown: string;
  targetId: string;
  targetType: "problem" | "solution";
  openKey: string | null;
  onToggleKey: (key: string) => void;
  onTriggerReport: (type: "problem" | "solution" | "comment", id: string, snippet: string) => void;
}

function SectionWithParagraphComments({
  contentMarkdown,
  targetId,
  targetType,
  openKey,
  onToggleKey,
  onTriggerReport,
}: SectionWithParagraphProps) {
  // Split content by double linebreaks into blocks
  const blocks = contentMarkdown.split(/\n\n+/);

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        const isHeader = /^#{1,6}\s/.test(trimmed);
        const paragraphKey = `${targetType}-${targetId}-${idx}`;
        const isOpen = openKey === paragraphKey;

        // Render block HTML
        const blockHtml = renderBlockHtml(trimmed);

        return (
          <div key={idx} className="group relative">
            <div className="flex items-start justify-between gap-2">
              <div
                className="flex-1 text-xs text-slate-700 leading-relaxed overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: blockHtml }}
              />

              {/* Only non-headers get line-level commenting per user requirement! */}
              {!isHeader && (
                <button
                  type="button"
                  onClick={() => onToggleKey(paragraphKey)}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition shrink-0 ${
                    isOpen
                      ? "opacity-100 bg-blue-100 text-blue-700"
                      : "bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600"
                  }`}
                  title="Ushbu qatorga izoh yozish"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Izoh</span>
                </button>
              )}
            </div>

            {/* Paragraph Comment Thread Drawer */}
            {isOpen && (
              <ParagraphCommentThread
                targetType={targetType}
                targetId={targetId}
                paragraphIndex={idx}
                onTriggerReport={onTriggerReport}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Paragraph Comment Thread Sub-component
function ParagraphCommentThread({
  targetType,
  targetId,
  paragraphIndex,
  onTriggerReport,
}: {
  targetType: "problem" | "solution";
  targetId: string;
  paragraphIndex: number;
  onTriggerReport: (type: "problem" | "solution" | "comment", id: string, snippet: string) => void;
}) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, [targetId, paragraphIndex]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchComments({
        problem_id: targetType === "problem" ? targetId : undefined,
        solution_id: targetType === "solution" ? targetId : undefined,
        paragraph_index: paragraphIndex,
      });
      setComments(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (parentId?: string) => {
    const text = parentId ? replyText : newText;
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const session = getAuthSession();
      const author = session.user?.full_name || session.user?.username || "Dasturchi";
      await createComment({
        content: text.trim(),
        problem_id: targetType === "problem" ? targetId : undefined,
        solution_id: targetType === "solution" ? targetId : undefined,
        paragraph_index: paragraphIndex,
        parent_id: parentId,
        author_name: author,
      });
      if (parentId) {
        setReplyText("");
        setReplyParentId(null);
      } else {
        setNewText("");
      }
      load();
    } catch (err: any) {
      alert(err.message || "Izoh yozishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2 ml-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs space-y-3">
      <div className="font-bold text-slate-800 text-[11px] flex items-center justify-between">
        <span>Qatorga bildirilgan sharhlar ({comments.length}):</span>
      </div>

      {loading ? (
        <div className="text-[11px] text-slate-400">Yuklanmoqda...</div>
      ) : comments.length === 0 ? (
        <div className="text-[11px] text-slate-400">Bu qatorga hali sharh yozilmagan.</div>
      ) : (
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-slate-900 text-[11px]">{c.author_name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">
                    {new Date(c.created_at).toLocaleTimeString("uz-UZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => onTriggerReport("comment", c.id, c.content)}
                    className="p-0.5 text-slate-300 hover:text-red-500 rounded"
                    title="Shikoyat qilish"
                  >
                    <ShieldAlert className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-slate-700 text-[11px]">{c.content}</p>

              {/* Comment Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 border-blue-200 space-y-1.5">
                  {c.replies.map((rep) => (
                    <div key={rep.id} className="p-1.5 bg-slate-50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-[10px]">{rep.author_name}</span>
                        <button
                          type="button"
                          onClick={() => onTriggerReport("comment", rep.id, rep.content)}
                          className="text-slate-300 hover:text-red-500"
                        >
                          <ShieldAlert className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <p className="text-slate-600 text-[10px]">{rep.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Button & Box */}
              <div className="mt-1.5">
                {replyParentId === c.id ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Javob yozing..."
                      className="flex-1 px-2 py-1 bg-slate-50 rounded border border-slate-200 text-[11px] focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdd(c.id)}
                      disabled={submitting}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                    >
                      Yuborish
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyParentId(null)}
                      className="text-slate-400 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReplyParentId(c.id)}
                    className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold hover:underline"
                  >
                    <CornerDownRight className="w-2.5 h-2.5" /> Javob berish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Comment Input */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Ushbu qatorga sharhingizni yozing..."
          className="flex-1 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px] focus:outline-hidden focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => handleAdd()}
          disabled={submitting}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
        >
          Yuborish
        </button>
      </div>
    </div>
  );
}

// Markdown Block Renderer with max 1024px centered image support
function renderBlockHtml(text: string) {
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Restore <u> and <img ...>
  html = html.replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/g, "<u>$1</u>");
  html = html.replace(
    /&lt;img src=&quot;([^&]+)&quot; alt=&quot;([^&]*)&quot; style=&quot;([^&]+)&quot; \/&gt;/g,
    '<img src="$1" alt="$2" style="$3" class="shadow-sm border border-slate-200 rounded-lg" />'
  );
  html = html.replace(
    /&lt;img src="([^"]+)" alt="([^"]*)" style="([^"]+)" \/&gt;/g,
    '<img src="$1" alt="$2" style="$3" class="shadow-sm border border-slate-200 rounded-lg" />'
  );

  // Markdown image syntax fallback: ![alt](url)
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<img src="$2" alt="$1" style="max-width: 1024px; width: 100%; margin: 12px auto; display: block;" class="shadow-sm border border-slate-200 rounded-lg" />'
  );

  // Headers
  if (/^### (.*$)/.test(text)) {
    return `<h3 class="text-sm font-bold text-slate-900 mt-2 mb-1">${text.replace(/^### /, "")}</h3>`;
  }
  if (/^## (.*$)/.test(text)) {
    return `<h2 class="text-base font-bold text-slate-900 mt-3 mb-1.5">${text.replace(/^## /, "")}</h2>`;
  }
  if (/^# (.*$)/.test(text)) {
    return `<h1 class="text-lg font-black text-slate-900 mt-3 mb-2">${text.replace(/^# /, "")}</h1>`;
  }

  // Code Block
  if (text.startsWith("```")) {
    const lines = text.split("\n");
    const lang = lines[0].replace(/```/, "").trim();
    const code = lines.slice(1, -1).join("\n");
    return `<pre class="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-[11px] font-mono my-2"><div class="text-[9px] text-slate-400 uppercase mb-1">${lang || "code"}</div><code>${code}</code></pre>`;
  }

  // Inline styling
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-blue-600 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-3 py-1 my-1 text-slate-600 italic bg-blue-50/40 rounded-r">$1</blockquote>');

  return `<p class="leading-relaxed mb-2">${html.replace(/\n/g, "<br/>")}</p>`;
}
