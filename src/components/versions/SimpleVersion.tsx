import { useMemo, useState } from "react";
import { RecommendationCard } from "../common/RecommendationCard";
import { fallbackSimpleKey, personalSummary, simpleGoals, simpleRecommendations } from "../../data/mockData";

export function SimpleVersion() {
  const [goal, setGoal] = useState(fallbackSimpleKey);
  const recommendation = useMemo(() => simpleRecommendations[goal] ?? simpleRecommendations[fallbackSimpleKey], [goal]);

  return (
    <section className="version-panel">
      <p className="profile-line">{personalSummary}</p>
      <h2 className="version-title">今日どう過ごしたい?</h2>
      <div className="simple-goal-grid">
        {simpleGoals.map((item) => (
          <button key={item} className={goal === item ? "is-active" : ""} onClick={() => setGoal(item)}>
            {item}
          </button>
        ))}
      </div>
      <RecommendationCard candidate={recommendation.main} featured />
      <details className="prototype-details">
        <summary>代替候補を見る</summary>
        <div className="compact-card-list">
          {recommendation.alternatives.slice(0, 2).map((candidate) => (
            <RecommendationCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </details>
    </section>
  );
}
