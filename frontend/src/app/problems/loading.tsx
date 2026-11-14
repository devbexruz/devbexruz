import { Sparkles } from "lucide-react";

export default function ProblemsLoading() {
  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="h-6 w-36 bg-blue-100 rounded-full" />
          <div className="h-9 w-2/3 bg-slate-200 rounded-lg" />
          <div className="h-4 w-4/5 bg-slate-200 rounded" />
          
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="h-10 w-64 bg-white border border-slate-200 rounded-xl" />
            <div className="h-10 w-32 bg-slate-200 rounded-xl" />
            <div className="h-10 w-44 bg-blue-200 rounded-xl ml-auto" />
          </div>
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-slate-100 border border-slate-200 rounded-lg shrink-0" />
          ))}
        </div>

        {/* Problem Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-emerald-100 rounded-md" />
                <div className="h-4 w-28 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-4/5 bg-slate-100 rounded" />
              <div className="flex items-center gap-2 pt-2">
                <div className="h-6 w-16 bg-slate-100 rounded-md" />
                <div className="h-6 w-20 bg-slate-100 rounded-md" />
                <div className="h-6 w-14 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
