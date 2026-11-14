export default function GlobalLoading() {
  return (
    <div className="bg-white min-h-[60vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
          Yuklanmoqda...
        </p>
      </div>
    </div>
  );
}
