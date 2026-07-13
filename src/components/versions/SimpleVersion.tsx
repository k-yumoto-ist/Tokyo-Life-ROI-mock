import { useMemo, useState } from "react";
import { Settings2 } from "lucide-react";
import { RecommendationCard } from "../common/RecommendationCard";
import { fallbackSimpleKey, personalSummary, simpleGoals, simpleRecommendations, type RoiCandidate } from "../../data/mockData";

type Props = {
  onSelect: (candidate: RoiCandidate) => void;
  onSettings: () => void;
};

export function SimpleVersion({ onSelect, onSettings }: Props) {
  const [goal, setGoal] = useState(fallbackSimpleKey);
  const recommendation = useMemo(() => simpleRecommendations[goal] ?? simpleRecommendations[fallbackSimpleKey], [goal]);

  return (
    <section className="version-panel">
      <button className="profile-line profile-line-button" onClick={onSettings}>
        <span>{personalSummary}</span>
        <Settings2 size={14} />
      </button>
      <h2 className="version-title">今日はどう過ごしたい？</h2>
      <div className="simple-goal-grid">
        {simpleGoals.map((item) => (
          <button key={item} className={goal === item ? "is-active" : ""} onClick={() => setGoal(item)}>
            {item}
          </button>
        ))}
      </div>
      <RecommendationCard candidate={recommendation.main} featured onSelect={onSelect} />
      <details className="prototype-details">
        <summary>代替候補を見る</summary>
        <div className="compact-card-list">
          {recommendation.alternatives.slice(0, 2).map((candidate) => (
            <RecommendationCard key={candidate.id} candidate={candidate} onSelect={onSelect} />
          ))}
        </div>
      </details>
    </section>
  );
}
