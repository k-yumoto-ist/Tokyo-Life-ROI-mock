import { CalendarDays, CheckCircle2, Gauge, Heart, MapPin, Repeat2, XCircle } from "lucide-react";
import { finalCandidates, type FinalChoiceRecord } from "../../../data/finalMockData";

const statusMeta = {
  visited: { label: "行ってきた", Icon: CheckCircle2 },
  skipped: { label: "行かなかった", Icon: XCircle },
  changed: { label: "別の場所へ", Icon: Repeat2 },
  selected: { label: "選択済み", Icon: CheckCircle2 },
} as const;

export function FinalHistoryScreen({ history }: { history: FinalChoiceRecord[] }) {
  return (
    <main className="final-page final-library-page">
      <section className="final-section-heading"><span>HISTORY</span><h1>これまでの選択</h1><p>行った日も、行かなかった日も残っています。</p></section>
      {history.length > 0 && <section className="final-history-insights">
        <article className="is-qol"><Heart size={18} /><div><small>My QOLの傾向</small><strong>家族で落ち着いて過ごした日の充実度が高め</strong></div></article>
        <article className="is-roi"><Gauge size={18} /><div><small>My ROIの傾向</small><strong>移動が20分を超えると、負担が増えやすい</strong></div></article>
      </section>}
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
                {(record.predictedQol || record.predictedRoi) && <div className="final-history-dual"><span className="is-qol"><Heart size={12} />QOL <b>{record.actualQol ?? record.predictedQol}</b></span><span className="is-roi"><Gauge size={12} />ROI <b>{record.actualRoi ?? record.predictedRoi}</b></span></div>}
                {record.qolInsight && <small>{record.qolInsight}</small>}
              </div>
            </article>;
          })}
        </div>
      )}
    </main>
  );
}
