import { ArrowRight, Check, Gauge, Heart, MapPinned, Sparkles } from "lucide-react";
import type { FinalChoiceRecord } from "../../../data/finalMockData";

type Props = { record: FinalChoiceRecord; cityPoint: number; onMyRoi: () => void; onHome: () => void };

export function FinalLearnedScreen({ record, cityPoint, onMyRoi, onHome }: Props) {
  const didVisit = record.actionStatus === "visited";
  return (
    <main className="final-page final-learned-page">
      <section className="final-learned-hero">
        <span><Check size={30} /></span>
        <p>{didVisit ? "振り返りを保存しました" : "今回の判断を記録しました"}</p>
        <h1>次のおすすめが、<br />少しあなた向けになります</h1>
      </section>
      {didVisit ? <>
        <section className="final-actual-roi-result" aria-label="今回の実績My ROI">
          <header><Gauge size={21} /><span><small>今回の実績My ROI</small><strong>{record.actualRoi}</strong></span><b>予測 {record.predictedRoi}</b></header>
          <p>{record.roiInsight}</p>
          <small>今回の時間・費用・疲れ・満足を、次の候補比較に反映します。</small>
        </section>
        <section className="final-qol-contribution" aria-label="最近の暮らしへの記録">
          <Heart size={20} />
          <div><small>最近のMy QOLに加わったこと</small><strong>{record.qolInsight}</strong><p>一回の体験をQOLスコアにはせず、最近の行動の積み重ねとして振り返ります。</p></div>
        </section>
      </> : <section className="final-qol-contribution"><Sparkles size={20} /><div><small>行動しなかったことも学びです</small><strong>{record.qolInsight}</strong><p>次回は行動につながりやすい条件を優先します。</p></div></section>}
      {didVisit && cityPoint > 0 && (
        <section className="final-city-result">
          <MapPinned size={21} /><div><small>結果として、東京にもプラス</small><strong>東京ポイント +{cityPoint}</strong><p>地域施設の利用と混雑分散につながりました</p></div>
        </section>
      )}
      <button className="final-primary-button" onClick={onMyRoi}>わたしの傾向を見る <ArrowRight size={17} /></button>
      <button className="final-text-button final-center-button" onClick={onHome}>ホームに戻る</button>
    </main>
  );
}
