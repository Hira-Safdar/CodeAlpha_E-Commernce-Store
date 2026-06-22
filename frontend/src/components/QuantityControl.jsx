import { Minus, Plus } from "lucide-react";

export default function QuantityControl({ value, max, onDecrease, onIncrease, disabled = false }) {
  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
        onClick={onDecrease}
        disabled={disabled || value <= 0}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="grid h-10 min-w-12 place-items-center border-x border-slate-200 px-3 text-sm font-black dark:border-slate-700">
        {value}
      </span>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
        onClick={onIncrease}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
