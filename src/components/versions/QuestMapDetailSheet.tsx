import { BookOpen, Building2, Check, ChevronRight, Clock3, Footprints, MapPin, Route, Sparkles, WalletCards, X } from "lucide-react";
import { questCategoryLabels, type QuestDefinition, type QuestSpot } from "../../data/questMapData";

type QuestMapDetailSheetProps = {
  quest: QuestDefinition;
  spot: QuestSpot;
  predictedRoi: number;
  visited: boolean;
  onClose: () => void;
  onStart: () => void;
  onRoute: () => void;
};

const scoreRows = [
  ["満足", "satisfaction", "purple"],
  ["学び", "learning", "blue"],
  ["家族", "family", "gold"],
  ["都市へのプラス", "urbanContribution", "green"],
] as const;

export function QuestMapDetailSheet({ quest, spot, predictedRoi, visited, onClose, onStart, onRoute }: QuestMapDetailSheetProps) {
  return (
    <div className="quest-map-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="quest-map-detail-sheet" role="dialog" aria-modal="true" aria-label={`${spot.name}の詳細`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="quest-map-sheet-handle" />
        <button className="quest-map-sheet-close" onClick={onClose} aria-label="詳細を閉じる"><X size={19} /></button>
        <div className={`quest-map-spot-visual category-${spot.category}`}>
          <span><MapPin size={32} /></span>
          <p>{questCategoryLabels[spot.category]}</p>
          {spot.officialRecommended && <em><Building2 size={14} />東京都おすすめ</em>}
        </div>
        <div className="quest-map-detail-title">
          <span>{visited ? "訪問済み" : "未訪問"}・営業時間 9:30〜17:00（デモ）</span>
          <h2>{spot.name}</h2>
          <p><MapPin size={14} />{spot.address}</p>
        </div>
        <div className="quest-map-detail-facts">
          <div><Clock3 size={17} /><strong>{quest.travelMinutes}分</strong><span>移動</span></div>
          <div><WalletCards size={17} /><strong>{spot.estimatedCost.toLocaleString("ja-JP")}円</strong><span>費用</span></div>
          <div><BookOpen size={17} /><strong>{spot.estimatedStayMinutes}分</strong><span>滞在</span></div>
          <div><Sparkles size={17} /><strong>{predictedRoi}</strong><span>予測ROI</span></div>
        </div>
        <p className="quest-map-detail-description">{spot.description}</p>
        <section className="quest-map-fit-reason">
          <h3>今のあなたに合う理由</h3>
          <p><Check size={15} />家族で学びたい今日の目的に合う</p>
          <p><Check size={15} />予算内で、移動と滞在を90分前後にまとめられる</p>
        </section>
        <div className="quest-map-score-bars">
          {scoreRows.map(([label, key, tone]) => <div key={key} className={`tone-${tone}`}><span>{label}</span><i><b style={{ width: `${spot.scores[key]}%` }} /></i><strong>{spot.scores[key]}</strong></div>)}
        </div>
        {spot.officialRecommended && <section className="quest-map-public-value"><Building2 size={18} /><div><h3>この選択には、こんなプラスも</h3><p>公共施設の活用や、都心からの人流分散につながります。</p></div></section>}
        <div className="quest-map-detail-actions">
          <button className="quest-map-route-button" onClick={onRoute}><Route size={17} />経路を見る</button>
          <button className="quest-map-primary-button" onClick={onStart}>クエスト開始<ChevronRight size={17} /></button>
        </div>
        <p className="quest-map-walk-note"><Footprints size={13} />表示時間・費用・営業時間はデモ値です</p>
      </section>
    </div>
  );
}
