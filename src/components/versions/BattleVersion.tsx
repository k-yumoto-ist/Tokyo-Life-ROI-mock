import { CheckCircle2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { battleJudgingMessages, battleLoadingMessages, battlePlans, type BattleHistory, type BattlePlan } from "../../data/battleMockData";
import { BattleConditionForm } from "./BattleConditionForm";
import { BattleDecided, BattleResult } from "./BattleResult";
import { BattlePlanCard } from "./BattlePlanCard";

type BattlePhase = "form" | "loading" | "compare" | "judging" | "result" | "decided";

type Props = {
  onComplete: (history: BattleHistory) => void;
  onMyRoi: () => void;
};

export function BattleVersion({ onComplete, onMyRoi }: Props) {
  const [phase, setPhase] = useState<BattlePhase>("form");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [judgingIndex, setJudgingIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pushedPlanId, setPushedPlanId] = useState<BattlePlan["id"] | null>(null);
  const [detailPlan, setDetailPlan] = useState<BattlePlan | null>(null);
  const [decidedPlan, setDecidedPlan] = useState<BattlePlan | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (phase !== "loading") return;
    const isLast = loadingIndex === battleLoadingMessages.length;
    const timer = window.setTimeout(() => isLast ? setPhase("compare") : setLoadingIndex((index) => index + 1), isLast ? 500 : 260);
    return () => window.clearTimeout(timer);
  }, [loadingIndex, phase]);

  useEffect(() => {
    if (phase !== "judging") return;
    const isLast = judgingIndex === battleJudgingMessages.length;
    const timer = window.setTimeout(() => isLast ? setPhase("result") : setJudgingIndex((index) => index + 1), isLast ? 420 : 250);
    return () => window.clearTimeout(timer);
  }, [judgingIndex, phase]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1700);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function startBattle() {
    setLoadingIndex(0);
    setPhase("loading");
  }

  function startJudging() {
    setJudgingIndex(0);
    setPhase("judging");
  }

  function choosePlan(plan: BattlePlan) {
    setDecidedPlan(plan);
    setPhase("decided");
    onComplete({
      selectedPlanId: plan.id,
      selectedPlanTitle: plan.title,
      recommendedPlanTitle: battlePlans[0].title,
      savedMinutes: plan.id === "a" ? 50 : plan.id === "b" ? 35 : 18,
      estimatedSavings: plan.id === "b" ? 2800 : plan.id === "a" ? 1800 : 600,
      satisfaction: plan.satisfaction,
      roi: plan.roi,
    });
  }

  function rematch() {
    setPhase("form");
    setActiveIndex(0);
    setPushedPlanId(null);
    setDecidedPlan(null);
  }

  if (phase === "form") return <BattleConditionForm onStart={startBattle} />;
  if (phase === "loading") return <BattleLoading message={battleLoadingMessages[Math.min(loadingIndex, battleLoadingMessages.length - 1)]} complete={loadingIndex === battleLoadingMessages.length} />;
  if (phase === "judging") return <BattleJudging message={battleJudgingMessages[Math.min(judgingIndex, battleJudgingMessages.length - 1)]} complete={judgingIndex === battleJudgingMessages.length} />;
  if (phase === "result") return <BattleResult plans={battlePlans} pushedPlanId={pushedPlanId} onChoose={choosePlan} onRematch={rematch} />;
  if (phase === "decided" && decidedPlan) return <BattleDecided plan={decidedPlan} onAction={setToast} onMyRoi={onMyRoi} />;

  const plan = battlePlans[activeIndex];
  return (
    <section className="battle-arena">
      <div className="battle-arena-heading">
        <span>3 WAY BATTLE</span>
        <h2>PLAN A <i>VS</i> PLAN B <i>VS</i> PLAN C</h2>
      </div>
      <div className="battle-plan-tabs" role="tablist" aria-label="比較するプラン">
        {battlePlans.map((item, index) => <button key={item.id} role="tab" aria-selected={activeIndex === index} className={activeIndex === index ? "is-active" : ""} onClick={() => setActiveIndex(index)}>{item.title}</button>)}
      </div>
      <BattlePlanCard
        plan={plan}
        index={activeIndex}
        pushed={pushedPlanId === plan.id}
        onPrevious={() => setActiveIndex((activeIndex + battlePlans.length - 1) % battlePlans.length)}
        onNext={() => setActiveIndex((activeIndex + 1) % battlePlans.length)}
        onPush={() => setPushedPlanId((current) => current === plan.id ? null : plan.id)}
        onDetails={() => setDetailPlan(plan)}
      />
      <div className="battle-verdict-action">
        <p>AI実況: あなたの時間価値と今回の優先条件を反映して、最終判定します</p>
        <button className="primary-button action-wide battle-judge-button" onClick={startJudging}><Sparkles size={18} />AI判定を見る</button>
        <small>総合ROIと勝者は判定後に公開されます</small>
      </div>
      {detailPlan && <BattleDetailSheet plan={detailPlan} onClose={() => setDetailPlan(null)} />}
      {toast && <div className="battle-local-toast" role="status">{toast}</div>}
    </section>
  );
}

function BattleLoading({ message, complete }: { message: string; complete: boolean }) {
  return <section className="battle-loading" aria-live="polite"><Sparkles size={35} /><span>{message}</span><strong>{complete ? "3つのプランがエントリーしました" : "AIが条件を整理しています"}</strong><div><i /><i /><i /></div></section>;
}

function BattleJudging({ message, complete }: { message: string; complete: boolean }) {
  return <section className="battle-loading battle-judging" aria-live="polite"><Sparkles size={35} /><span>{message}</span><strong>{complete ? "判定完了" : "AIが総合条件を判定しています"}</strong><div><i /><i /><i /></div></section>;
}

function BattleDetailSheet({ plan, onClose }: { plan: BattlePlan; onClose: () => void }) {
  return <div className="battle-sheet-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="battle-detail-sheet" role="dialog" aria-modal="true" aria-label={`${plan.title}の詳細`} onMouseDown={(event) => event.stopPropagation()}>
      <button className="battle-sheet-close" onClick={onClose} aria-label="詳細を閉じる"><X size={20} /></button>
      <span className="battle-plan-label">{plan.label}</span>
      <h2>{plan.title}</h2>
      <p>{plan.destination}で過ごすプランです。滞在 {plan.stay}、待ち時間 {plan.wait}。</p>
      <h3>このプランの強み</h3>
      <ul>{plan.strengths.map((strength) => <li key={strength}><CheckCircle2 size={15} />{strength}</li>)}</ul>
    </section>
  </div>;
}
