import { ArrowRight, Check, MapPinned, Sparkles } from "lucide-react";
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
      <section className="final-learning-result">
        <div><Sparkles size={20} /><span><small>今回わかったこと</small><strong>{record.learnedInsight}</strong></span></div>
        <p>一度の記録で決めつけず、これからの選択と満足度を少しずつ重ねます。</p>
      </section>
      {didVisit && cityPoint > 0 && (
        <section className="final-city-result">
          <MapPinned size={21} /><div><small>結果として、東京にもプラス</small><strong>東京ポイント +{cityPoint}</strong><p>地域施設の利用と混雑分散につながりました</p></div>
        </section>
      )}
      <button className="final-primary-button" onClick={onMyRoi}>My ROIで変化を見る <ArrowRight size={17} /></button>
      <button className="final-text-button final-center-button" onClick={onHome}>ホームに戻る</button>
    </main>
  );
}
