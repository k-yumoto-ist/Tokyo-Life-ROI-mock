import { ArrowRight, Clock3, Coins, MapPin, Sparkles, UsersRound } from "lucide-react";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";

type FinalRecommendationCardProps = {
  recommendation: FinalRecommendation;
  active: boolean;
  onDetails: () => void;
  onChoose: () => void;
};

const roleLabels = {
  "best-fit": "今日のあなた向け",
  discovery: "少し意外な相性",
  "today-only": "今日だから成立",
} as const;

export function FinalRecommendationCard({ recommendation, active, onDetails, onChoose }: FinalRecommendationCardProps) {
  const { candidate } = recommendation;
  return (
    <article className={`final-plan-card role-${recommendation.role} ${active ? "is-active" : ""}`}>
      <div className="final-plan-image">
        <img src={candidate.imageUrl} alt={candidate.imageAlt} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
        <span><Sparkles size={14} />{roleLabels[recommendation.role]}</span>
      </div>
      <div className="final-plan-content">
        <span className="final-plan-category">{candidate.category}</span>
        <h2>{candidate.title}</h2>
        <p className="final-plan-place"><MapPin size={15} />{candidate.place}</p>
        <div className="final-plan-metrics">
          <div><Clock3 size={17} /><strong>{candidate.travelMinutes}分</strong><span>移動</span></div>
          <div><Coins size={17} /><strong>{candidate.cost === 0 ? "無料" : `${candidate.cost.toLocaleString("ja-JP")}円`}</strong><span>費用</span></div>
          <div><UsersRound size={17} /><strong>{candidate.crowdLabel}</strong><span>混雑</span></div>
          <div><Sparkles size={17} /><strong>{recommendation.affinity}</strong><span>今日の相性</span></div>
        </div>
        <p className="final-plan-copy">{candidate.shortCopy}</p>
        <div className="final-reason-line"><span>なぜ？</span><p>{recommendation.reason}</p></div>
        {recommendation.learnedReason && <p className="final-learned-reason"><Sparkles size={14} />{recommendation.learnedReason}</p>}
        <div className="final-plan-actions">
          <button className="final-text-button" onClick={onDetails}>詳しく見る</button>
          <button className="final-primary-button" onClick={onChoose}>この案を選ぶ <ArrowRight size={17} /></button>
        </div>
      </div>
    </article>
  );
}
