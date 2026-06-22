export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="h-44 animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
