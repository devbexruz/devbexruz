import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as styles from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownViewerProps {
  content: string;
}

// 1. Nusxalash tugmasi komponenti (Yangilangan dizayn bilan)
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nusxalashda xatolik:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center p-1.5 rounded-md hover:bg-white/10 transition-all active:scale-90 text-gray-400 hover:text-white"
      title="Nusxa olish"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
      )}
    </button>
  );
};

// 2. Shaffof fonli Dracula stili
const customDracula = {
  ...styles.dracula,
  'pre[class*="language-"]': {
    ...styles.dracula['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: 0,
  },
  'code[class*="language-"]': {
    ...styles.dracula['code[class*="language-"]'],
    background: 'transparent',
  },
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Jadvallar stili
          table: ({node, ...props}) => (
            <div className="my-6 w-fit max-w-full overflow-x-auto rounded-xl border border-white/10 shadow-lg">
              <table className="w-fit text-left text-sm border-collapse" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-white/5 border-b border-white/10 text-purple-400" {...props} />,
          th: ({node, ...props}) => <th className="px-4 py-3 font-bold uppercase tracking-wider" {...props} />,
          td: ({node, ...props}) => <td className="px-4 py-3 border-b border-white/5 text-gray-300" {...props} />,

          // Kod bloki stili
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeText = String(children).replace(/\n$/, '');
            const language = match ? match[1] : '';
            
            return !inline && match ? (
              <div className="relative my-6 w-fit min-w-[280px] max-w-full rounded-2xl border border-white/10 bg-[#1e1e2e] shadow-2xl group overflow-hidden font-sans">
                
                {/* Tepadagi Header panel: Til nomi va Copy tugmasi */}
                <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/5">
                  <span className="text-[11px] font-bold text-purple-400/80 uppercase tracking-widest">
                    {language}
                  </span>
                  <CopyButton text={codeText} />
                </div>

                {/* Kod muharriri qismi */}
                <div className="p-4 pt-3 overflow-x-auto">
                  <SyntaxHighlighter
                    {...props}
                    children={codeText}
                    style={customDracula}
                    language={language}
                    PreTag="div"
                    showLineNumbers={true}
                    // Satrlar masofasi va shrift o'lchami
                    customStyle={{
                      lineHeight: '1.5',
                      fontSize: '14px',
                    }}
                    lineNumberStyle={{ 
                      color: '#4b5563', 
                      minWidth: '2.5em', 
                      paddingRight: '1em', 
                      textAlign: 'right', 
                      userSelect: 'none', 
                      fontSize: '12px',
                      lineHeight: '1.5' // Raqamlar qatori ham asosiy kod bilan bir xil masofada bo'lishi uchun
                    }}
                  />
                </div>
              </div>
            ) : (
              // Bir qatorli (inline) kod stili
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300 font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;