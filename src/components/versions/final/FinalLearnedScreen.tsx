import { ArrowRight, Check, Gauge, Heart, MapPinned } from "lucide-react";
import type { FinalChoiceRecord } from "../../../data/finalMockData";

type Props = { record: FinalChoiceRecord; cityPoint: number; onMyRoi: () => void; onHome: () => void };

export function FinalLearnedScreen({ record, cityPoint, onMyRoi, onHome }: Props) {
  const didVisit = record.actionStatus === "visited";
  return (
    <main className="final-page final-learned-page">
      <section className="final-learned-hero">
        <span><Check size={30} /></span>
        <p>{didVisit ? "振り返りを保存しました" : "今回の判断を記録しました"}</p>
        <h1>次のおすすめに<br />反映します</h1>
      </section>
      <section className="final-after-dual-result" aria-label="今回のMy QOLとMy ROI">
        <article className="is-qol"><Heart size={20} /><span><small>実績My QOL</small><strong>{record.actualQol ?? "記録のみ"}</strong><em>{record.qolInsight}</em></span>{record.actualQol && <b>予測 {record.predictedQol}</b>}</article>
        <article className="is-roi"><Gauge size={20} /><span><small>実績My ROI</small><strong>{record.actualRoi ?? "記録のみ"}</strong><em>{record.roiInsight}</em></span>{record.actualRoi && <b>予測 {record.predictedRoi}</b>}</article>
      </section>
      <p className="final-learning-caution">QOLとROIは別々に学習します。一度の記録だけで、あなたの好みを決めつけません。</p>
      {didVisit && cityPoint > 0 && (
        <section className="final-city-result">
          <MapPinned size={21} /><div><small>結果として、東京にもプラス</small><strong>東京ポイント +{cityPoint}</strong><p>地域施設の利用と混雑分散につながりました</p></div>
        </section>
      )}
      <button className="final-primary-button" onClick={onMyRoi}>QOL / ROIの変化を見る <ArrowRight size={17} /></button>
      <button className="final-text-button final-center-button" onClick={onHome}>ホームに戻る</button>
    </main>
  );
}
