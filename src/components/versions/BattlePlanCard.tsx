import { ChevronLeft, ChevronRight, Clock3, Coins, Star, Users } from "lucide-react";
import { useRef } from "react";
import type { BattlePlan } from "../../data/battleMockData";

type Props = {
  plan: BattlePlan;
  index: number;
  pushed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPush: () => void;
  onDetails: () => void;
};

const statusLabels = [
  ["time", "時間効率"],
  ["saving", "節約"],
  ["quiet", "混雑回避"],
  ["satisfaction", "満足度"],
  ["family", "家族適性"],
] as const;

export function BattlePlanCard({ plan, index, pushed, onPrevious, onNext, onPush, onDetails }: Props) {
  const touchStartX = useRef<number | null>(null);

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const offset = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(offset) < 42) return;
    if (offset > 0) onPrevious();
    else onNext();
  }

  return (
    <section className={`battle-card plan-${plan.id} ${pushed ? "is-pushed" : ""}`} onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={handleTouchEnd}>
      <div className="battle-carousel-head">
        <button aria-label="前のプラン" className="battle-arrow" onClick={onPrevious}><ChevronLeft size={19} /></button>
        <div>
          <span>3プラン比較中</span>
          <strong>{index + 1} / 3</strong>
        </div>
        <button aria-label="次のプラン" className="battle-arrow" onClick={onNext}><ChevronRight size={19} /></button>
      </div>
      <div className="battle-plan-head">
        <div>
          <span className="battle-plan-label">{plan.label} {pushed && <em><Star size={12} fill="currentColor" /> あなたの推し</em>}</span>
          <h2>{plan.title}</h2>
          <p>{plan.catchcopy}</p>
        </div>
        <div className="battle-roi"><strong>{plan.roi}</strong><span>ROI</span></div>
      </div>
      <span className="battle-feature">{plan.feature}</span>
      <div className="battle-metrics">
        <Metric icon={<Clock3 size={14} />} label="移動" value={plan.travel} />
        <Metric icon={<Coins size={14} />} label="費用" value={plan.cost} />
        <Metric icon={<Users size={14} />} label="混雑" value={plan.crowd} />
        <Metric icon={<Star size={14} />} label="満足度" value={String(plan.satisfaction)} />
      </div>
      <div className="battle-statuses">
        {statusLabels.map(([key, label]) => <div key={key}><span>{label}</span><div><i style={{ width: `${plan.status[key]}%` }} /></div></div>)}
      </div>
      <p className="battle-commentary">AI実況: {plan.commentary}</p>
      <div className="battle-card-actions">
        <button className="secondary-button" onClick={onDetails}>詳細を見る</button>
        <button className={`push-button ${pushed ? "is-active" : ""}`} onClick={onPush}><Star size={16} fill={pushed ? "currentColor" : "none"} /> {pushed ? "推しています" : "このプランを推す"}</button>
      </div>
      <div className="battle-dots" aria-label={`${index + 1}番目のプランを表示中`}><i className={index === 0 ? "is-current" : ""} /><i className={index === 1 ? "is-current" : ""} /><i className={index === 2 ? "is-current" : ""} /></div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div><span>{icon}{label}</span><strong>{value}</strong></div>;
}
