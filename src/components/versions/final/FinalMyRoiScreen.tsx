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
  const restLevel = tired > 0 ? 46 : 72;
  const discoveryLevel = discoveries > 0 ? 76 : 52;
  const familyLevel = familyWins > 0 ? 88 : 64;
  return (
    <main className="final-page final-roi-page">
      <section className="final-section-heading"><span>MY LIFE, RECENTLY</span><h1>わたしの傾向</h1><p>最近の暮らしと、選び方の変化を振り返ります。</p></section>
      <section className="final-learning-profile">
        <div className="final-learning-ring"><Brain size={24} /><span>{history.length}</span><small>記録</small></div>
        <div><small>パーソナライズ</small><h2>{stage.label}</h2><p>{stage.note}</p></div>
      </section>

      <section className="final-qol-dashboard" aria-labelledby="final-qol-dashboard-title">
        <header><div><Heart size={21} /><span><small>直近7日間</small><h2 id="final-qol-dashboard-title">最近のMy QOL</h2></span></div><strong>{summary.averageQol}</strong></header>
        <p>{summary.qolHeadline}</p><small>{summary.qolNeed}</small>
        <div className="final-qol-dimensions">
          <span><label>家族時間</label><i><b style={{ width: `${familyLevel}%` }} /></i><em>高い</em></span>
          <span><label>心の余裕</label><i><b style={{ width: "72%" }} /></i><em>安定</em></span>
          <span><label>休息</label><i><b style={{ width: `${restLevel}%` }} /></i><em>{tired ? "やや不足" : "安定"}</em></span>
          <span><label>新しい体験</label><i><b style={{ width: `${discoveryLevel}%` }} /></i><em>{discoveries ? "充実" : "普通"}</em></span>
        </div>
        <em className="final-qol-summary-note"><Sparkles size={13} />{latest?.qolInsight ?? "満足につながる条件を学習中です"}</em>
      </section>

      <section className="final-roi-pattern-card" aria-labelledby="final-roi-pattern-title">
        <header><Gauge size={19} /><span><small>最近の選択傾向</small><h2 id="final-roi-pattern-title">平均My ROI {summary.averageRoi}</h2></span></header>
        <p>{summary.roiHeadline}</p>
        <ul>
          <li>移動負担が少ない日は、満足度も高い傾向です</li>
          {tired > 0 && <li>疲労が大きい日は、予想より評価が下がっています</li>}
          <li>家族が楽しめる行動は、My ROIも高くなる傾向があります</li>
        </ul>
        <small><TimerReset size={13} />{latest?.roiInsight ?? "時間・費用・疲れと得られた価値を学習中です"}</small>
      </section>

      <section className="final-qol-roi-relationship">
        <Gauge size={17} /><ArrowRight size={15} /><Heart size={17} />
        <p><strong>My QOLは暮らしの現在地。</strong><span>My ROIは、次の選択を考えるものさしです。</span></p>
      </section>
      <button className="final-list-link" onClick={onHistory}><Compass size={19} /><span><strong>これまでの記録を見る</strong><small>{history.length}件の選択と振り返り</small></span><ArrowRight size={18} /></button>
      <button className="final-list-link" onClick={onSettings}><Settings2 size={19} /><span><strong>個人設定</strong><small>時間価値や家族構成を調整</small></span><ChevronRight size={18} /></button>
    </main>
  );
}
