import { ArrowLeft, ArrowRight, GitCompareArrows, X } from "lucide-react";
import { useState } from "react";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";
import { FinalRecommendationCard } from "./FinalRecommendationCard";

type FinalRecommendationsScreenProps = {
  recommendations: FinalRecommendation[];
  contextSummary: string;
  onDetails: (recommendation: FinalRecommendation) => void;
  onChoose: (recommendation: FinalRecommendation) => void;
};

const shortRoleLabels = ["バランス", "QOL", "ROI"];

export function FinalRecommendationsScreen({ recommendations, contextSummary, onDetails, onChoose }: FinalRecommendationsScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [compareOpen, setCompareOpen] = useState(false);
  return (
    <main className="final-page final-results-page">
      <section className="final-results-heading"><span>2 / 2</span><h1>今日は、どの良さを<br />選びますか？</h1><p>{contextSummary}・順位ではなく異なる3つの価値です</p></section>
      <div className="final-plan-tabs" role="tablist" aria-label="候補を切り替える">
        {recommendations.map((item, index) => <button key={item.candidate.id} role="tab" aria-selected={activeIndex === index} className={activeIndex === index ? "is-active" : ""} onClick={() => setActiveIndex(index)}><span>{index + 1}</span>{shortRoleLabels[index]}</button>)}
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
          <div className="final-sheet-heading"><div><span>COMPARE</span><h2>違いだけを比べる</h2></div><button onClick={() => setCompareOpen(false)} aria-label="比較を閉じる"><X size={19} /></button></div>
          <div className="final-compare-grid">
            <span>案</span>{recommendations.map((item, index) => <strong key={item.candidate.id}>{shortRoleLabels[index]}</strong>)}
            <span>移動</span>{recommendations.map((item) => <b key={item.candidate.id}>{item.candidate.travelMinutes}分</b>)}
            <span>費用</span>{recommendations.map((item) => <b key={item.candidate.id}>{item.candidate.cost === 0 ? "無料" : `${item.candidate.cost.toLocaleString("ja-JP")}円`}</b>)}
            <span>混雑</span>{recommendations.map((item) => <b key={item.candidate.id}>{item.candidate.crowdLabel}</b>)}
            <span>My QOL</span>{recommendations.map((item) => <b className="is-qol" key={item.candidate.id}>{item.qolLabel}</b>)}
            <span>My ROI</span>{recommendations.map((item) => <b className="is-roi" key={item.candidate.id}>{item.roiLabel}</b>)}
            <span>特徴</span>{recommendations.map((item) => <b key={item.candidate.id}>{item.role === "balanced" ? "両方" : item.role === "qol-focus" ? "充実" : "効率"}</b>)}
          </div>
          <p>順位ではなく、今日どの良さを選ぶかの比較です。</p>
          <button className="final-primary-button" onClick={() => { setCompareOpen(false); onChoose(recommendations[activeIndex]); }}>{shortRoleLabels[activeIndex]}の案を選ぶ</button>
        </section>
      </div>}
    </main>
  );
}
