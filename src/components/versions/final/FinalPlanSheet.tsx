import { BusFront, CalendarDays, Check, Clock3, CloudSun, Database, Gauge, Heart, MapPin, Route, UsersRound, X } from "lucide-react";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";

type FinalPlanSheetProps = {
  recommendation: FinalRecommendation;
  onClose: () => void;
  onChoose: () => void;
};

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
          <span><UsersRound size={17} /><strong>混雑 {candidate.crowdLabel}</strong></span>
          <span><CloudSun size={17} /><strong>{candidate.indoor ? "天候の影響なし" : "暑さに注意"}</strong></span>
        </div>
        <section className="final-detail-reason"><h3>この案を出した理由</h3><p>{recommendation.reason}</p>{recommendation.learnedReason && <p><Check size={15} />{recommendation.learnedReason}</p>}</section>
        <section className="final-detail-impact">
          <h3>2つの視点で見る</h3>
          <div className="final-dual-impact">
            <div className="is-qol"><Heart size={17} /><span><small>予測My QOL</small><strong>{recommendation.qolLabel}</strong><em>{recommendation.qolReason}</em></span><b>{recommendation.predictedQol}</b></div>
            <div className="is-roi"><Gauge size={17} /><span><small>予測My ROI</small><strong>{recommendation.roiLabel}</strong><em>{recommendation.roiReason}</em></span><b>{recommendation.predictedRoi}</b></div>
          </div>
          <div className="final-qol-roi-map" aria-label={`My ROI ${recommendation.predictedRoi}、My QOL ${recommendation.predictedQol}`}>
            <span>QOL</span><i>充実</i><i>効率</i><b style={{ left: `${recommendation.predictedRoi}%`, bottom: `${recommendation.predictedQol}%` }} /><small>ROI</small>
          </div>
          <p className="final-impact-note">ROIとQOLは別の指標です。効率が低くても、満足につながる選択があります。</p>
        </section>
        <section className="final-mini-map" aria-label="簡易ルートマップ"><span>新宿</span><i /><b><Route size={18} /></b><i /><span>{candidate.area}</span></section>
        <div className="final-detail-meta"><p><CalendarDays size={16} /><span>{candidate.event}</span></p><p><Clock3 size={16} /><span>{candidate.hours}</span></p></div>
        <details className="final-data-details"><summary><Database size={15} />この提案に使った情報</summary><div>{candidate.dataSources.map((source) => <span key={source}>{source}</span>)}</div></details>
        <button className="final-primary-button" onClick={onChoose}>このプランを選ぶ</button>
        <small className="final-demo-data-note">写真・混雑・イベント・営業時間はデモ表示です</small>
      </section>
    </div>
  );
}
