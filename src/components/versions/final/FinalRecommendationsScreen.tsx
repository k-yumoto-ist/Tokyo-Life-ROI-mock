import { ArrowLeft, ArrowRight, GitCompareArrows, X } from "lucide-react";
import { useState } from "react";
import type { FinalCandidateRole } from "../../../data/finalMockData";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";
import { FinalRecommendationCard } from "./FinalRecommendationCard";

type FinalRecommendationsScreenProps = {
  recommendations: FinalRecommendation[];
  contextSummary: string;
  onDetails: (recommendation: FinalRecommendation) => void;
  onChoose: (recommendation: FinalRecommendation) => void;
};

const shortRoleLabels: Record<FinalCandidateRole, string> = {
  "best-fit": "おすすめ",
  easy: "気軽",
  special: "特別体験",
};

function effectSummary(recommendation: FinalRecommendation) {
  const positive = recommendation.qolEffects.filter((effect) => effect.direction === "up").map((effect) => effect.label);
  return (positive.length ? positive : recommendation.qolEffects.map((effect) => effect.label)).slice(0, 2).join("・");
}

export function FinalRecommendationsScreen({ recommendations, contextSummary, onDetails, onChoose }: FinalRecommendationsScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [compareOpen, setCompareOpen] = useState(false);
  return (
    <main className="final-page final-results-page">
      <section className="final-results-heading"><span>2 / 2</span><h1>今日の条件から、<br />3つの選び方を見つけました</h1><p>{contextSummary}・どれも違う良さがあります</p></section>
      <div className="final-plan-tabs" role="tablist" aria-label="候補を切り替える">
        {recommendations.map((item, index) => <button key={item.candidate.id} role="tab" aria-selected={activeIndex === index} className={activeIndex === index ? "is-active" : ""} onClick={() => setActiveIndex(index)}><span>{index + 1}</span>{shortRoleLabels[item.role]}</button>)}
      </div>
      <div className="final-plan-stage">
        {recommendations.map((recommendation, index) => <FinalRecommendationCard key={recommendation.candidate.id} recommendation={recommendation} active={activeIndex === index} onDetails={() => onDetails(recommendation)} onChoose={() => onChoose(recommendation)} />)}
      </div>
      <div className="final-card-pager">
        <button onClick={() => setActiveIndex((index) => (index + recommendations.length - 1) % recommendations.length)} aria-label="前の候補"><ArrowLeft size={18} /></button>
        <span>{activeIndex + 1} / {recommendations.length}</span>
        <button onClick={() => setActiveIndex((index) => (index + 1) % recommendations.length)} aria-label="次の候補"><ArrowRight size={18} /></button>
      </div>
      <button className="final-compare-button" onClick={() => setCompareOpen(true)}><GitCompareArrows size={17} />3案を一覧で比べる</button>

      {compareOpen && <div className="final-sheet-backdrop" role="presentation" onMouseDown={() => setCompareOpen(false)}>
        <section className="final-compare-sheet" role="dialog" aria-modal="true" aria-label="3案の比較" onMouseDown={(event) => event.stopPropagation()}>
          <div className="final-sheet-handle" />
          <div className="final-sheet-heading"><div><span>COMPARE</span><h2>今日のものさしで比べる</h2></div><button onClick={() => setCompareOpen(false)} aria-label="比較を閉じる"><X size={19} /></button></div>
          <p className="final-compare-intro">My ROIは、満足や家族時間も価値に含めた「今日の割に合い方」です。</p>
          <div className="final-compare-grid">
            <span>選び方</span>{recommendations.map((item) => <strong key={item.candidate.id}>{shortRoleLabels[item.role]}</strong>)}
            <span>My ROI</span>{recommendations.map((item) => <b className="is-roi" key={item.candidate.id}>{item.predictedRoi}</b>)}
            <span>移動</span>{recommendations.map((item) => <b key={item.candidate.id}>{item.candidate.travelMinutes}分</b>)}
            <span>費用</span>{recommendations.map((item) => <b key={item.candidate.id}>{item.candidate.cost === 0 ? "無料" : `${item.candidate.cost.toLocaleString("ja-JP")}円`}</b>)}
            <span>混雑</span>{recommendations.map((item) => <b key={item.candidate.id}>{item.candidate.crowdLabel}</b>)}
            <span>満たせそう</span>{recommendations.map((item) => <b className="is-qol" key={item.candidate.id}>{effectSummary(item)}</b>)}
          </div>
          <p>最も効率的な案ではなく、今日の自分に合う案を選べます。</p>
          <button className="final-primary-button" onClick={() => { setCompareOpen(false); onChoose(recommendations[activeIndex]); }}>{shortRoleLabels[recommendations[activeIndex].role]}の案を選ぶ</button>
        </section>
      </div>}
    </main>
  );
}
