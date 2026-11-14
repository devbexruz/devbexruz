"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Image as ImageIcon,
  Eye,
  Edit3,
  Loader2,
  Percent,
} from "lucide-react";
import { uploadImage } from "@/lib/api";

interface NotionLikeEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function NotionLikeEditor({
  value,
  onChange,
  placeholder = "Fikringiz yoki yechimingizni yozing... (Markdown va Notion uslubi qo'llab-quvvatlanadi)",
  minHeight = "220px",
}: NotionLikeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedWidthPercent, setSelectedWidthPercent] = useState<number>(100);
  const [showImageOptions, setShowImageOptions] = useState(false);

  // Keyboard shortcut listener (Ctrl+B, Ctrl+I, Ctrl+U)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier && e.key.toLowerCase() === "b") {
      e.preventDefault();
      wrapSelection("**", "**");
      return;
    }
    if (modifier && e.key.toLowerCase() === "i") {
      e.preventDefault();
      wrapSelection("*", "*");
      return;
    }
    if (modifier && e.key.toLowerCase() === "u") {
      e.preventDefault();
      wrapSelection("<u>", "</u>");
      return;
    }

    // Auto-detect Notion-style trigger on Space key:
    // e.g. "### " -> Header 3, "## " -> Header 2, "# " -> Header 1,
    // "[] " -> Checkbox, "- " -> bullet, "1. " -> ordered, "> " -> quote, "``` " -> code
    if (e.key === " ") {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const { selectionStart } = textarea;
      const textBeforeCursor = textarea.value.substring(0, selectionStart);
      const lines = textBeforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

      // If typing "### " at line start
      if (currentLine === "###") {
        e.preventDefault();
        replaceCurrentLinePrefix("### ", 3);
        return;
      }
      if (currentLine === "##") {
        e.preventDefault();
        replaceCurrentLinePrefix("## ", 2);
        return;
      }
      if (currentLine === "#") {
        e.preventDefault();
        replaceCurrentLinePrefix("# ", 1);
        return;
      }
      if (currentLine === "[]" || currentLine === "[ ]") {
        e.preventDefault();
        replaceCurrentLinePrefix("- [ ] ", currentLine.length);
        return;
      }
      if (currentLine === "-" || currentLine === "*") {
        e.preventDefault();
        replaceCurrentLinePrefix("- ", 1);
        return;
      }
      if (/^\d+\.$/.test(currentLine)) {
        // e.g. "1."
        e.preventDefault();
        replaceCurrentLinePrefix(`${currentLine} `, currentLine.length);
        return;
      }
      if (currentLine === ">") {
        e.preventDefault();
        replaceCurrentLinePrefix("> ", 1);
        return;
      }
      if (currentLine === "```") {
        e.preventDefault();
        replaceCurrentLinePrefix("```\n", 3, "\n```");
        return;
      }
    }
  };

  const replaceCurrentLinePrefix = (prefix: string, matchLen: number, postfix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const text = textarea.value;
    const lineStart = text.lastIndexOf("\n", selectionStart - 1) + 1;
    const newText =
      text.substring(0, lineStart) +
      prefix +
      text.substring(lineStart + matchLen, selectionEnd) +
      postfix +
      text.substring(selectionEnd);

    onChange(newText);
    setTimeout(() => {
      const newPos = lineStart + prefix.length;
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const wrapSelection = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = `${before}${selected || "matn"}${after}`;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected ? selected.length : 4));
    }, 10);
  };

  const insertAtCursor = (content: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const nextVal = text.substring(0, start) + content + text.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      const pos = start + content.length;
      textarea.setSelectionRange(pos, pos);
    }, 10);
  };

  // Image upload handling with max 1024px & percentage
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Faqat rasm fayllari (PNG, JPG, WebP) yuklanishi mumkin!");
      return;
    }

    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      // Construct centered image tag or markdown with width percent and max 1024px
      const imgMarkdown = `\n<img src="${res.url}" alt="${file.name}" style="width: ${selectedWidthPercent}%; max-width: 1024px; margin: 12px auto; display: block; border-radius: 8px;" />\n`;
      insertAtCursor(imgMarkdown);
      setShowImageOptions(false);
    } catch (err: any) {
      alert(err.message || "Rasm yuklashda xatolik yuz berdi");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Simple Markdown to HTML preview helper
  const renderMarkdownPreview = (text: string) => {
    if (!text) return "<p class='text-slate-400 italic'>Hech qanday matn kiritilmagan...</p>";

    // Escape basic html except our own allowed img tags and <u> tags
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Restore safe <u> and <img ...>
    html = html.replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/g, "<u>$1</u>");
    html = html.replace(
      /&lt;img src=&quot;([^&]+)&quot; alt=&quot;([^&]*)&quot; style=&quot;([^&]+)&quot; \/&gt;/g,
      '<img src="$1" alt="$2" style="$3" class="shadow-sm border border-slate-200" />'
    );
    html = html.replace(
      /&lt;img src="([^"]+)" alt="([^"]*)" style="([^"]+)" \/&gt;/g,
      '<img src="$1" alt="$2" style="$3" class="shadow-sm border border-slate-200" />'
    );

    // Code blocks ```code```
    html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      return `<pre class="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs font-mono my-2"><div class="text-[10px] text-slate-400 uppercase mb-1">${lang || "code"}</div><code>${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-blue-600 px-1 py-0.5 rounded text-xs font-mono">$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-900 mt-5 mb-2.5">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-slate-900 mt-6 mb-3">$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

    // Checkboxes
    html = html.replace(
      /^- \[x\] (.*$)/gim,
      '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="rounded text-blue-600" /><span class="line-through text-slate-400 text-sm">$1</span></div>'
    );
    html = html.replace(
      /^- \[ \] (.*$)/gim,
      '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="rounded text-slate-400" /><span class="text-slate-700 text-sm">$1</span></div>'
    );

    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-3 py-1 my-2 text-slate-600 italic bg-blue-50/40 rounded-r text-sm">$1</blockquote>');

    // Lists
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-sm text-slate-700 my-0.5">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-sm text-slate-700 my-0.5">$1</li>');

    // Paragraphs
    html = html
      .split("\n\n")
      .map(p => {
        if (p.startsWith("<h") || p.startsWith("<pre") || p.startsWith("<blockquote") || p.startsWith("<div") || p.startsWith("<img") || p.startsWith("<li")) {
          return p;
        }
        return `<p class="text-sm text-slate-700 leading-relaxed mb-3">${p.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("");

    return html;
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
      {/* Top Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-600">
        <div className="flex flex-wrap items-center gap-1">
          {/* Tabs: Write / Preview */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 mr-2">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition ${
                activeTab === "edit" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Yozish
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition ${
                activeTab === "preview" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Ko'rish
            </button>
          </div>

          {activeTab === "edit" && (
            <>
              {/* Bold, Italic, Underline */}
              <button
                type="button"
                onClick={() => wrapSelection("**", "**")}
                title="Qalin (Ctrl+B)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => wrapSelection("*", "*")}
                title="Qiya kursiv (Ctrl+I)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => wrapSelection("<u>", "</u>")}
                title="Tagi chizilgan (Ctrl+U)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>

              <span className="w-px h-5 bg-slate-200 mx-1" />

              {/* Headings */}
              <button
                type="button"
                onClick={() => insertAtCursor("\n# Sarlavha 1\n")}
                title="Sarlavha 1 (# + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("\n## Sarlavha 2\n")}
                title="Sarlavha 2 (## + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("\n### Sarlavha 3\n")}
                title="Sarlavha 3 (### + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              <span className="w-px h-5 bg-slate-200 mx-1" />

              {/* Lists and Quotes */}
              <button
                type="button"
                onClick={() => insertAtCursor("\n- Band 1\n- Band 2\n")}
                title="Ro'yxat (- + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("\n1. Birinchi\n2. Ikkinchi\n")}
                title="Raqamli ro'yxat (1. + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("\n- [ ] Vazifa\n")}
                title="Checkbox ([] + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("\n> Iqtibos matni\n")}
                title="Iqtibos (> + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("\n```javascript\n// kodingiz\n```\n")}
                title="Kod bloki (``` + probel)"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition"
              >
                <Code className="w-4 h-4" />
              </button>

              <span className="w-px h-5 bg-slate-200 mx-1" />

              {/* Image Uploader with Percentage Selector */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowImageOptions(!showImageOptions)}
                  disabled={uploadingImage}
                  className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 hover:border-blue-400 rounded text-xs font-medium text-slate-700 transition"
                  title="Rasm yuklash (Max 1024px, foizda kenglik)"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>Rasm ({selectedWidthPercent}%)</span>
                </button>

                {showImageOptions && (
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-30">
                    <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span>Rasm kengligi (Foizda):</span>
                      <span className="text-blue-600 font-mono">{selectedWidthPercent}%</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                      {[25, 50, 75, 100].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setSelectedWidthPercent(pct)}
                          className={`text-xs py-1 rounded font-medium border transition ${
                            selectedWidthPercent === pct
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2">
                      Rasm avtomatik ravishda 1024px dan oshmaydi va markazda joylashadi.
                    </div>

                    <label className="flex items-center justify-center gap-1.5 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg cursor-pointer text-xs font-semibold transition">
                      <ImageIcon className="w-4 h-4" />
                      <span>Faylni tanlash</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="text-[11px] text-slate-600 hidden sm:block">
          Notion uslubi: <code className="bg-slate-200/60 px-1 rounded">### </code>, <code className="bg-slate-200/60 px-1 rounded">[] </code>, <code className="bg-slate-200/60 px-1 rounded">- </code>, <code className="bg-slate-200/60 px-1 rounded">Ctrl+B</code>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === "edit" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-4 text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-hidden resize-y leading-relaxed"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="p-4 bg-slate-50/50 prose prose-slate max-w-none text-sm overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(value) }}
        />
      )}
    </div>
  );
}
