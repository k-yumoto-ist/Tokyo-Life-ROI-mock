import { ArrowRight, Brain, ChevronRight, Compass, Gauge, Heart, Settings2, Sparkles, TimerReset } from "lucide-react";
import type { FinalChoiceRecord } from "../../../data/finalMockData";
import { getFinalDashboardSummary, getLearningStage } from "../../../lib/finalRecommendation";

type Props = { history: FinalChoiceRecord[]; onSettings: () => void; onHistory: () => void };

export function FinalMyRoiScreen({ history, onSettings, onHistory }: Props) {
  const visited = history.filter((item) => item.actionStatus === "visited");
  const summary = getFinalDashboardSummary(history);
  const stage = getLearningStage(history.length);
  const discoveries = visited.filter((item) => item.feedbackReasons.includes("新しい発見があった")).length;
  const familyWins = visited.filter((item) => item.feedbackReasons.includes("家族の満足度が高かった")).length;
  const tired = visited.filter((item) => item.burden === "tired").length;
  const latest = history[history.length - 1];
  return (
    <main className="final-page final-roi-page">
      <section className="final-section-heading"><span>YOUR BALANCE</span><h1>My QOL と My ROI</h1><p>暮らしの充実と、選択の効率を別々に振り返ります。</p></section>
      <section className="final-learning-profile">
        <div className="final-learning-ring"><Brain size={24} /><span>{history.length}</span><small>記録</small></div>
        <div><small>パーソナライズ</small><h2>{stage.label}</h2><p>{stage.note}</p></div>
      </section>

      <section className="final-profile-axis is-qol">
        <header><div><Heart size={20} /><span><small>MY QOL</small><h2>暮らしの充実</h2></span></div><strong>{summary.averageQol}</strong></header>
        <p>{summary.qolHeadline}</p><small>{summary.qolNeed}</small>
        <div className="final-axis-mini-metrics"><span><b>{familyWins}</b>家族の満足</span><span><b>{discoveries}</b>新しい発見</span><span><b>{Math.max(0, visited.length - tired)}</b>余裕のある日</span></div>
        <em><Sparkles size={13} />{latest?.qolInsight ?? "満足につながる条件を学習中です"}</em>
      </section>

      <section className="final-profile-axis is-roi">
        <header><div><Gauge size={20} /><span><small>MY ROI</small><h2>価値と負担のバランス</h2></span></div><strong>{summary.averageRoi}</strong></header>
        <p>{summary.roiHeadline}</p><small>時間・費用・混雑・疲労を含む最近の平均</small>
        <div className="final-axis-mini-metrics"><span><b>42分</b>移動を短縮</span><span><b>{tired}</b>負担が大きい日</span><span><b>±6</b>予測との差</span></div>
        <em><TimerReset size={13} />{latest?.roiInsight ?? "負担と得られた価値のバランスを学習中です"}</em>
      </section>

      <section className="final-quadrant-explainer">
        <h2>どの選択も、あり得ます</h2>
        <div><span>高QOL<br />低ROI</span><span>高QOL<br />高ROI</span><span>低QOL<br />低ROI</span><span>低QOL<br />高ROI</span><i /></div>
        <p>遠回りや少しの贅沢が、充実につながる日もあります。</p>
      </section>
      <button className="final-list-link" onClick={onHistory}><Compass size={19} /><span><strong>選択ごとの2軸を見る</strong><small>{history.length}件のQOL・ROI履歴</small></span><ArrowRight size={18} /></button>
      <button className="final-list-link" onClick={onSettings}><Settings2 size={19} /><span><strong>個人設定</strong><small>時間価値や家族構成を調整</small></span><ChevronRight size={18} /></button>
    </main>
  );
}
