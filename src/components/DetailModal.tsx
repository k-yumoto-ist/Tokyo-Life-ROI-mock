import { X } from "lucide-react";
import type { Plan } from "../types";
import { formatYen } from "../lib/scoring";

export function DetailModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid items-end bg-night/55 p-0 pt-10 backdrop-blur-sm sm:place-items-center sm:p-4" role="dialog" aria-modal="true">
      <article className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-4 pb-[env(safe-area-inset-bottom)] shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label">{plan.name}</p>
            <h2 className="mt-1 text-2xl font-black text-night">{plan.title}</h2>
          </div>
          <button className="round-icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>
        <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{plan.description}</p>
        <div className="mt-4 plan-metrics">
          <div className="mini-metric"><span>時間</span><strong>{plan.timeMinutes}分</strong></div>
          <div className="mini-metric"><span>費用</span><strong>{formatYen(plan.cost)}</strong></div>
          <div className="mini-metric"><span>混雑</span><strong>{plan.crowd}</strong></div>
          <div className="mini-metric"><span>満足度</span><strong>{plan.satisfaction.toFixed(1)}</strong></div>
        </div>
      </article>
    </div>
  );
}
