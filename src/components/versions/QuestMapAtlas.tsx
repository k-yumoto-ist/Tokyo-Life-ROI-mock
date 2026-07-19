import { useMemo, useState, type CSSProperties } from "react";
import { Building2, Grid2X2, LockKeyhole, Map, MapPin, Star } from "lucide-react";
import { demoLocation, questCategoryLabels, questMapSpots, type QuestMapProgress, type QuestSpot, type QuestSpotCategory } from "../../data/questMapData";
import { QuestMapCanvas } from "./QuestMapCanvas";

type QuestMapAtlasProps = {
  progress: QuestMapProgress;
  onSpotSelect: (spot: QuestSpot) => void;
};

type AtlasFilter = "all" | QuestSpotCategory | "visited" | "official";

export function QuestMapAtlas({ progress, onSpotSelect }: QuestMapAtlasProps) {
  const [view, setView] = useState<"cards" | "map">("cards");
  const [filter, setFilter] = useState<AtlasFilter>("all");
  const filteredSpots = useMemo(() => questMapSpots.filter((spot) => {
    if (filter === "all") return true;
    if (filter === "visited") return progress.visitedSpotIds.includes(spot.id);
    if (filter === "official") return spot.officialRecommended;
    return spot.category === filter;
  }), [filter, progress.visitedSpotIds]);

  return (
    <section className="quest-map-page quest-map-atlas-page">
      <header className="quest-map-page-heading"><span>TOKYO ATLAS</span><h1>東京図鑑</h1><p>{progress.visitedSpotIds.length} / {questMapSpots.length} スポットを発見</p></header>
      <div className="quest-map-atlas-toolbar">
        <div className="quest-map-view-toggle"><button className={view === "cards" ? "is-active" : ""} onClick={() => setView("cards")}><Grid2X2 size={16} />カード</button><button className={view === "map" ? "is-active" : ""} onClick={() => setView("map")}><Map size={16} />地図</button></div>
        <div className="quest-map-atlas-progress-ring" style={{ "--progress": `${Math.round((progress.visitedSpotIds.length / questMapSpots.length) * 360)}deg` } as CSSProperties}><span>{Math.round((progress.visitedSpotIds.length / questMapSpots.length) * 100)}%</span></div>
      </div>
      <div className="quest-map-filter-scroll" aria-label="図鑑フィルター">
        {([ ["all", "すべて"], ["visited", "訪問済み"], ["official", "東京おすすめ"], ["learning", "学び"], ["nature", "自然"], ["culture", "文化"], ["public", "公共"] ] as const).map(([value, label]) => <button key={value} className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      {view === "map" ? <div className="quest-map-atlas-map"><QuestMapCanvas location={demoLocation} focusKey={0} spots={filteredSpots} questSpotIds={[]} lockedSpotIds={[]} visitedSpotIds={progress.visitedSpotIds} onSpotSelect={onSpotSelect} /></div> : <div className="quest-map-atlas-grid">
        {filteredSpots.map((spot) => {
          const visited = progress.visitedSpotIds.includes(spot.id);
          return <button key={spot.id} className={`quest-map-atlas-card category-${spot.category} ${visited ? "is-visited" : ""}`} onClick={() => onSpotSelect(spot)}>
            <span className="quest-map-atlas-icon">{visited ? <MapPin size={20} /> : <LockKeyhole size={18} />}</span>
            <small>{questCategoryLabels[spot.category]}</small>
            <strong>{spot.name}</strong>
            <em>{visited ? "訪問済み" : "未訪問"}{spot.officialRecommended && <><Building2 size={11} />東京</>}</em>
          </button>;
        })}
      </div>}
      <p className="quest-map-atlas-hint"><Star size={14} />未訪問スポットも名称を確認できます。次のクエスト候補を探してみましょう。</p>
    </section>
  );
}
