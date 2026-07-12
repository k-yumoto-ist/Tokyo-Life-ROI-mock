import type { Plan } from "../types";
import { formatYen } from "../lib/scoring";

export function ComparisonDashboard({ plans }: { plans: Plan[] }) {
  return (
    <div className="plan-list">
      {plans.map((plan) => (
        <article key={plan.id} className="plan-card">
          <h2>{plan.name}</h2>
          <p>{plan.description}</p>
          <div className="plan-metrics">
            <div className="mini-metric"><span>時間</span><strong>{plan.timeMinutes}分</strong></div>
            <div className="mini-metric"><span>費用</span><strong>{formatYen(plan.cost)}</strong></div>
            <div className="mini-metric"><span>混雑</span><strong>{plan.crowd}</strong></div>
            <div className="mini-metric"><span>満足度</span><strong>{plan.satisfaction.toFixed(1)}</strong></div>
          </div>
        </article>
      ))}
    </div>
  );
}
