import { CheckCircle2, Clock3, Coins, Users } from "lucide-react";
import type { RoiCandidate } from "../../data/mockData";

type Props = {
  candidate: RoiCandidate;
  featured?: boolean;
};

export function RecommendationCard({ candidate, featured = false }: Props) {
  return (
    <article className={`prototype-card ${featured ? "is-featured" : ""}`}>
      <div className="prototype-card-head">
        <div>
          <span className="prototype-tag">{candidate.tag}</span>
          <h2>{candidate.title}</h2>
          <p>{candidate.subtitle}</p>
        </div>
        <div className="prototype-roi">
          <strong>{candidate.roi}</strong>
          <span>ROI</span>
        </div>
      </div>
      <div className="prototype-metrics">
        <Metric icon={<Clock3 size={15} />} label="時間" value={candidate.time} />
        <Metric icon={<Coins size={15} />} label="費用" value={candidate.cost} />
        <Metric icon={<Users size={15} />} label="混雑" value={candidate.crowd} />
      </div>
      <p className="prototype-reason">
        <CheckCircle2 size={14} />
        {candidate.reason}
      </p>
    </article>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <span>{icon}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
