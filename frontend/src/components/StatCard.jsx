export default function StatCard({ label, value }) {
  return (
    <div className="panel p-5">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
