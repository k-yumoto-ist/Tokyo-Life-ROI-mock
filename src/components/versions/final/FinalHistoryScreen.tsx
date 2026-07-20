import { CalendarDays, CheckCircle2, Gauge, Heart, MapPin, Repeat2, XCircle } from "lucide-react";
import { finalCandidates, type FinalChoiceRecord } from "../../../data/finalMockData";
import { getFinalDashboardSummary } from "../../../lib/finalRecommendation";

const statusMeta = {
  visited: { label: "行ってきた", Icon: CheckCircle2 },
  skipped: { label: "行かなかった", Icon: XCircle },
  changed: { label: "別の場所へ", Icon: Repeat2 },
  selected: { label: "選択済み", Icon: CheckCircle2 },
} as const;

export function FinalHistoryScreen({ history }: { history: FinalChoiceRecord[] }) {
  const summary = getFinalDashboardSummary(history);
  return (
    <main className="final-page final-library-page">
      <section className="final-section-heading"><span>RECORDS</span><h1>これまでの記録</h1><p>行った日も、行かなかった日も、次の選び方につながります。</p></section>
      {history.length > 0 && <>
        <section className="final-history-qol-summary">
          <Heart size={19} /><div><small>最近のMy QOL</small><strong>{summary.qolHeadline}</strong><span>{summary.qolNeed}</span></div><b>{summary.averageQol}</b>
        </section>
        <section className="final-history-roi-note">
          <Gauge size={17} /><div><small>選択の傾向・平均My ROI {summary.averageRoi}</small><strong>{summary.roiHeadline}</strong></div>
        </section>
      </>}
      {history.length === 0 ? (
        <section className="final-empty-state"><CalendarDays size={30} /><h2>記録はまだありません</h2><p>候補を選ぶと、ここから好みを学び始めます。</p></section>
      ) : (
        <div className="final-history-list">
          {[...history].reverse().map((record) => {
            const candidate = finalCandidates.find((item) => item.id === record.selectedCandidateId);
            const meta = statusMeta[record.actionStatus];
            return <article key={record.id}>
              <time>{new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(new Date(record.happenedAt))}</time>
              <div><span className={`final-history-status status-${record.actionStatus}`}><meta.Icon size={14} />{meta.label}</span><h2>{candidate?.title ?? record.scenario}</h2><p><MapPin size={14} />{candidate?.place ?? "選択を記録"}</p>
                {record.predictedRoi && <div className="final-history-roi"><Gauge size={12} /><span>{record.actualRoi ? "実績" : "予測"}My ROI</span><b>{record.actualRoi ?? record.predictedRoi}</b></div>}
                {record.qolInsight && <small><Heart size={12} />暮らしへの記録：{record.qolInsight}</small>}
              </div>
            </article>;
          })}
        </div>
      )}
    </main>
  );
}
