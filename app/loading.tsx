export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading page"
      className="min-h-full bg-slate-50 px-5 py-6 md:px-8 md:py-8"
    >
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="mt-3 h-9 w-64 max-w-full rounded-lg bg-slate-200" />
        <div className="mt-3 h-4 w-[min(32rem,90%)] rounded bg-slate-200" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-14 rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="h-44 bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/5 rounded bg-slate-200" />
                <div className="h-4 w-2/5 rounded bg-slate-100" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-4/5 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading page content…</span>
    </main>
  );
}
