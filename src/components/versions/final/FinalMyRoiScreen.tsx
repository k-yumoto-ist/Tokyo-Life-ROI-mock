import { ArrowRight, Brain, ChevronRight, Compass, Heart, Settings2, Sparkles, TrendingUp } from "lucide-react";
import type { FinalChoiceRecord } from "../../../data/finalMockData";
import { getLearningStage } from "../../../lib/finalRecommendation";

type Props = { history: FinalChoiceRecord[]; onSettings: () => void; onHistory: () => void };

export function FinalMyRoiScreen({ history, onSettings, onHistory }: Props) {
  const visited = history.filter((item) => item.actionStatus === "visited");
  const rated = visited.filter((item) => item.satisfaction);
  const satisfaction = rated.length === 0 ? "--" : (rated.reduce((sum, item) => sum + (item.satisfaction === "great" ? 5 : item.satisfaction === "good" ? 4 : 2.5), 0) / rated.length).toFixed(1);
  const stage = getLearningStage(history.length);
  const discoveries = visited.filter((item) => item.feedbackReasons.includes("新しい発見があった")).length;
  const easyTrips = visited.filter((item) => item.feedbackReasons.includes("移動が楽だった")).length;
  const latest = history[history.length - 1];
  return (
    <main className="final-page final-roi-page">
      <section className="final-section-heading"><span>MY ROI</span><h1>あなたらしい選び方</h1><p>点数ではなく、満足につながる条件を見つけていきます。</p></section>
      <section className="final-learning-profile">
        <div className="final-learning-ring"><Brain size={24} /><span>{history.length}</span><small>記録</small></div>
        <div><small>パーソナライズ</small><h2>{stage.label}</h2><p>{stage.note}</p></div>
      </section>
      <section className="final-roi-metrics">
        <div><Heart size={20} /><strong>{satisfaction}</strong><span>平均満足度</span></div>
        <div><TrendingUp size={20} /><strong>{easyTrips}</strong><span>楽な移動</span></div>
        <div><Compass size={20} /><strong>{discoveries}</strong><span>新しい発見</span></div>
      </section>
      <section className="final-insight-panel">
        <div><Sparkles size={18} /><h2>最近の選択から</h2></div>
        <p>{latest?.learnedInsight ?? "まだ行動記録がありません。最初の提案は個人設定をもとにつくります。"}</p>
        {history.length > 1 && <small>近さだけでなく、移動の楽さと混雑の少なさで満足度が高い傾向があります。</small>}
      </section>
      <button className="final-list-link" onClick={onHistory}><span><strong>最近の選択</strong><small>{history.length}件の判断を記録</small></span><ArrowRight size={18} /></button>
      <button className="final-list-link" onClick={onSettings}><Settings2 size={19} /><span><strong>個人設定</strong><small>最初の提案に使う基本情報</small></span><ChevronRight size={18} /></button>
      <section className="final-roi-note"><h2>My ROIとは</h2><p>自分にとって満足度の高い選択条件を見つけるためのプロフィールです。累積ポイントやランキングではありません。</p></section>
    </main>
  );
}
