import { BookOpen, Building2, ChevronRight, Clock3, LockKeyhole, MapPin, Sparkles, UsersRound, WalletCards } from "lucide-react";
import type { QuestDefinition, QuestSpot } from "../../data/questMapData";

type QuestMapQuestCardProps = {
  quest: QuestDefinition;
  spot: QuestSpot;
  predictedRoi: number;
  locked?: boolean;
  onOpen: () => void;
  onStart: () => void;
};

export function QuestMapQuestCard({ quest, spot, predictedRoi, locked = false, onOpen, onStart }: QuestMapQuestCardProps) {
  return (
    <article className={`quest-map-quest-card ${locked ? "is-locked" : ""}`}>
      <div className="quest-map-card-kicker">
        <span>{locked ? <LockKeyhole size={13} /> : <Sparkles size={13} />}{quest.difficulty === "beginner" ? "初級" : quest.difficulty === "intermediate" ? "中級" : quest.difficulty === "advanced" ? "上級" : "SECRET"}</span>
        {spot.officialRecommended && <em><Building2 size={12} />東京おすすめ</em>}
      </div>
      <h3>{quest.title}</h3>
      <p className="quest-map-card-spot"><MapPin size={14} />{spot.name}</p>
      <div className="quest-map-card-facts">
        <span><Clock3 size={14} />{quest.travelMinutes}分</span>
        <span><WalletCards size={14} />{spot.estimatedCost.toLocaleString("ja-JP")}円</span>
        <span><BookOpen size={14} />{spot.estimatedStayMinutes}分</span>
      </div>
      <div className="quest-map-card-values">
        {quest.values.slice(0, 3).map((value) => <span key={value.key}>{value.key === "family" ? <UsersRound size={13} /> : <Sparkles size={13} />}{value.label} +{value.points}</span>)}
      </div>
      {locked ? <p className="quest-map-unlock-condition"><LockKeyhole size={14} />{quest.condition}</p> : <div className="quest-map-card-bottom">
        <button className="quest-map-card-detail" onClick={onOpen}>詳細</button>
        <strong>予測ROI {predictedRoi}</strong>
        <button className="quest-map-card-start" onClick={onStart} aria-label={`${quest.title}を開始`}>開始<ChevronRight size={15} /></button>
      </div>}
    </article>
  );
}
