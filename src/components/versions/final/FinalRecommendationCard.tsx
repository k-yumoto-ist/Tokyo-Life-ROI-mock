import { ArrowRight, Award, Gauge, Heart, Info, Leaf, MapPin, Sparkles } from "lucide-react";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";

type FinalRecommendationCardProps = {
  recommendation: FinalRecommendation;
  currentQol: number;
  active: boolean;
  onDetails: () => void;
  onChoose: () => void;
};

const roleLabels = {
  "best-fit": "総合的におすすめ",
  easy: "近くて気軽",
  special: "今しかできない体験",
} as const;

export function FinalRecommendationCard({ recommendation, currentQol, active, onDetails, onChoose }: FinalRecommendationCardProps) {
  const { candidate } = recommendation;
  const positiveEffects = recommendation.qolEffects.filter((effect) => effect.direction === "up").slice(0, 2);
  return (
    <article className={`final-plan-card role-${recommendation.role} ${active ? "is-active" : ""}`}>
      <div className="final-plan-image">
        <img src={candidate.imageUrl} alt={candidate.imageAlt} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
        <span><Sparkles size={14} />{roleLabels[recommendation.role]}</span>
        <div className="final-plan-game-chips">
          {candidate.scores.publicValue >= 70 && <button type="button" onClick={onDetails}><Leaf size={12} />東京都おすすめ</button>}
          {candidate.cityPoint > 0 && <button type="button" onClick={onDetails}><Award size={12} />東京ポイント +{candidate.cityPoint}</button>}
        </div>
      </div>
      <div className="final-plan-content">
        <div className="final-plan-title-row">
          <div><span className="final-plan-category">{candidate.category}</span><h2>{candidate.title}</h2><p className="final-plan-place"><MapPin size={14} />{candidate.place}</p></div>
          <button type="button" onClick={onDetails} aria-label="候補の詳細を見る"><Info size={18} /></button>
        </div>
        <p className="final-plan-ai-copy">{recommendation.reason}</p>
        <section className="final-choice-indicators">
          <div className="is-qol" aria-label={`最近のMy QOL ${currentQol}、期待 ${recommendation.predictedQol}`}>
            <Heart size={17} /><span><small>My QOL</small><strong>{currentQol}<i>→</i>{recommendation.predictedQol}</strong></span><em>期待</em>
          </div>
          <div className="is-roi" aria-label={`My ROI ${recommendation.predictedRoi}`}>
            <Gauge size={17} /><span><small>My ROI</small><strong>{recommendation.predictedRoi}</strong></span><em>{recommendation.roiLabel}</em>
          </div>
        </section>
        <p className="final-plan-translation">{recommendation.roiReason}</p>
        {positiveEffects.length > 0 && <div className="final-plan-qol-tags" aria-label="満たせそうなこと">{positiveEffects.map((effect) => <span key={effect.label}><Heart size={11} />{effect.label}</span>)}</div>}
        <div className="final-plan-actions">
          <button type="button" className="final-text-button" onClick={onDetails}>詳しく見る</button>
          <button type="button" className="final-primary-button" onClick={onChoose}>この選択にする <ArrowRight size={17} /></button>
        </div>
      </div>
    </article>
  );
}
