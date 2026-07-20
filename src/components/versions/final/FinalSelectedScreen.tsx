import { ArrowLeft, Check, Gauge, Heart, Map, MapPin, Navigation, Share2, Sparkles } from "lucide-react";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";

type Props = {
  recommendation: FinalRecommendation;
  onBack: () => void;
  onVisited: () => void;
  onSkipped: () => void;
  onChanged: () => void;
  onToast: (message: string) => void;
};

export function FinalSelectedScreen({ recommendation, onBack, onVisited, onSkipped, onChanged, onToast }: Props) {
  const { candidate } = recommendation;
  return (
    <main className="final-page final-selected-page">
      <button className="final-back-link" onClick={onBack}><ArrowLeft size={18} />候補に戻る</button>
      <section className="final-choice-hero">
        <span className="final-success-mark"><Check size={25} /></span>
        <p>今日のプランが決まりました</p>
        <h1>{candidate.title}</h1>
        <span><MapPin size={15} />{candidate.place}</span>
      </section>

      <section className="final-route-summary" aria-label="今日の予定">
        <div><span>出発目安</span><strong>13:20</strong></div>
        <div><span>移動</span><strong>{candidate.travelMinutes}分</strong></div>
        <div><span>費用</span><strong>{candidate.cost === 0 ? "無料" : `${candidate.cost.toLocaleString("ja-JP")}円`}</strong></div>
      </section>
      <section className="final-dual-impact" aria-label="選択したプランの予測">
        <div className="is-qol"><Heart size={17} /><span><small>予測My QOL</small><strong>{recommendation.qolLabel}</strong><em>{recommendation.qolReason}</em></span><b>{recommendation.predictedQol}</b></div>
        <div className="is-roi"><Gauge size={17} /><span><small>予測My ROI</small><strong>{recommendation.roiLabel}</strong><em>{recommendation.roiReason}</em></span><b>{recommendation.predictedRoi}</b></div>
      </section>

      <section className="final-timeline">
        <h2>今日の流れ</h2>
        <ol>
          <li><time>13:20</time><span><b>出発</b>{candidate.route}</span></li>
          <li><time>13:50</time><span><b>{candidate.place}</b>{candidate.event}</span></li>
          <li><time>15:30</time><span><b>帰宅へ</b>疲れる前に、少し余白を残す</span></li>
        </ol>
      </section>

      <button className="final-primary-button final-map-button" onClick={() => onToast("地図画面はデモです")}><Navigation size={18} />地図で見る</button>
      <div className="final-secondary-actions">
        <button onClick={() => onToast("行き方を表示しました")}><Map size={17} />行き方</button>
        <button onClick={() => onToast("共有用リンクを作成しました")}><Share2 size={17} />家族に共有</button>
      </div>

      <section className="final-action-check">
        <div><Sparkles size={18} /><span><strong>その後、どうしましたか？</strong><small>選んだだけの日も、次の提案に役立ちます</small></span></div>
        <button className="final-primary-button" onClick={onVisited}>行ってきた</button>
        <div className="final-action-check-secondary">
          <button onClick={onSkipped}>今回は行かなかった</button>
          <button onClick={onChanged}>別の場所にした</button>
        </div>
      </section>
      {candidate.cityPoint > 0 && <p className="final-city-note">空いている地域施設を選ぶことで、混雑分散にもつながります</p>}
    </main>
  );
}
