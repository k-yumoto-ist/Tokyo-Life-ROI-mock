import { ArrowDown, ArrowUp, Award, BusFront, CalendarDays, Check, Clock3, CloudSun, Coins, Database, Gauge, Heart, Leaf, MapPin, Minus, Route, UsersRound, X } from "lucide-react";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";

type FinalPlanSheetProps = {
  recommendation: FinalRecommendation;
  onClose: () => void;
  onChoose: () => void;
};

const effectIcons = { up: ArrowUp, steady: Minus, down: ArrowDown } as const;

export function FinalPlanSheet({ recommendation, onClose, onChoose }: FinalPlanSheetProps) {
  const { candidate } = recommendation;
  return (
    <div className="final-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="final-detail-sheet" role="dialog" aria-modal="true" aria-label={`${candidate.place}の詳細`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="final-sheet-handle" />
        <button className="final-sheet-close" onClick={onClose} aria-label="詳細を閉じる"><X size={19} /></button>
        <div className="final-detail-image"><img src={candidate.imageUrl} alt={candidate.imageAlt} onError={(event) => { event.currentTarget.hidden = true; }} /></div>
        <span className="final-plan-category">{candidate.category}</span><h2>{candidate.title}</h2><p className="final-plan-place"><MapPin size={15} />{candidate.place}</p>
        <div className="final-detail-facts">
          <span><BusFront size={17} /><strong>{candidate.route}</strong></span>
          <span><Clock3 size={17} /><strong>{candidate.travelMinutes + candidate.stayMinutes}分</strong></span>
          <span><Coins size={17} /><strong>{candidate.cost === 0 ? "無料" : `${candidate.cost.toLocaleString("ja-JP")}円`}</strong></span>
          <span><UsersRound size={17} /><strong>混雑 {candidate.crowdLabel}</strong></span>
          <span><CloudSun size={17} /><strong>{candidate.indoor ? "天候の影響なし" : "暑さに注意"}</strong></span>
        </div>
        <section className="final-detail-reason"><h3>この案を出した理由</h3><p>{recommendation.reason}</p>{recommendation.learnedReason && <p><Check size={15} />{recommendation.learnedReason}</p>}</section>
        <section className="final-detail-impact">
          <h3>今日の選択として見る</h3>
          <div className="final-roi-evaluation is-detail">
            <div><Gauge size={19} /><span><small>My ROI</small><strong>{recommendation.predictedRoi}</strong></span><em>{recommendation.roiLabel}</em></div>
            <p>{recommendation.roiReason}</p>
            <small>満足や家族時間も価値に含め、時間・費用・疲れと比べています。</small>
          </div>
          <div className="final-qol-effects is-detail">
            <h3><Heart size={15} />暮らしに加わりそうなもの</h3>
            <div>{recommendation.qolEffects.map((effect) => { const Icon = effectIcons[effect.direction]; return <span className={`effect-${effect.direction}`} key={effect.label}>{effect.label}<Icon size={13} /></span>; })}</div>
          </div>
        </section>
        <section className="final-mini-map" aria-label="簡易ルートマップ"><span>新宿</span><i /><b><Route size={18} /></b><i /><span>{candidate.area}</span></section>
        <div className="final-detail-meta"><p><CalendarDays size={16} /><span>{candidate.event}</span></p><p><Clock3 size={16} /><span>{candidate.hours}</span></p></div>
        <section className="final-detail-city-value">
          <div><Leaf size={17} /><span><small>この選択にある東京へのプラス</small><strong>{candidate.scores.publicValue >= 70 ? "公共施設の活用・混雑分散" : "周辺エリアへの人流分散"}</strong></span></div>
          <p><Award size={15} />東京ポイント +{candidate.cityPoint}・関連クエストが進みます</p>
          <div>{candidate.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        </section>
        <details className="final-data-details"><summary><Database size={15} />この提案に使った情報</summary><div>{candidate.dataSources.map((source) => <span key={source}>{source}</span>)}</div></details>
        <button className="final-primary-button" onClick={onChoose}>このプランを選ぶ</button>
        <small className="final-demo-data-note">写真・混雑・イベント・営業時間はデモ表示です</small>
      </section>
    </div>
  );
}
