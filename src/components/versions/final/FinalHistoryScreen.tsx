import { CalendarDays, CheckCircle2, MapPin, Repeat2, XCircle } from "lucide-react";
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
      {history.length === 0 ? (
        <section className="final-empty-state"><CalendarDays size={30} /><h2>記録はまだありません</h2><p>候補を選ぶと、ここから好みを学び始めます。</p></section>
      ) : (
        <div className="final-history-list">
          {[...history].reverse().map((record) => {
            const candidate = finalCandidates.find((item) => item.id === record.selectedCandidateId);
            const meta = statusMeta[record.actionStatus];
            return <article key={record.id}>
              <time>{new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(new Date(record.happenedAt))}</time>
              <div><span className={`final-history-status status-${record.actionStatus}`}><meta.Icon size={14} />{meta.label}</span><h2>{candidate?.title ?? record.scenario}</h2><p><MapPin size={14} />{candidate?.place ?? "選択を記録"}</p>{record.learnedInsight && <small>{record.learnedInsight}</small>}</div>
            </article>;
          })}
        </div>
      )}
    </main>
  );
}
