"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params change, conclude loading
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept link clicks to start progress bar instantly
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      // Check if it's an internal route link and not an anchor jump
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.startsWith("#") &&
        target.target !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        // If navigating to the exact current pathname without query, don't trigger
        const currentFull = window.location.pathname + window.location.search;
        if (href !== currentFull) {
          setLoading(true);
          setProgress(25);
          setTimeout(() => setProgress(65), 100);
          setTimeout(() => setProgress(85), 400);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 pointer-events-none">
      <div
        className="h-[3px] bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-500 shadow-sm shadow-blue-500/50 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
      {/* Animated glowing head */}
      {loading && progress < 100 && (
        <div
          className="absolute top-0 right-0 w-24 h-[3px] bg-gradient-to-r from-transparent to-white blur-[1px] animate-pulse"
          style={{ transform: `translateX(${progress - 100}%)` }}
        />
      )}
    </div>
  );
}
