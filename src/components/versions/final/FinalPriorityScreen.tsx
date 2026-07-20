import { ArrowRight, Check, Clock3, Coins, Footprints, Leaf, Sparkles, UsersRound, Waves } from "lucide-react";
import { finalPriorityLabels, type FinalPriority } from "../../../data/finalMockData";

type FinalPriorityScreenProps = {
  selected: FinalPriority[];
  summary: string;
  onToggle: (priority: FinalPriority) => void;
  onSubmit: () => void;
};

const priorityIcons = {
  "low-fatigue": Footprints,
  time: Clock3,
  saving: Coins,
  children: UsersRound,
  novelty: Sparkles,
  quiet: Waves,
  slow: Leaf,
} as const;

export function FinalPriorityScreen({ selected, summary, onToggle, onSubmit }: FinalPriorityScreenProps) {
  return (
    <main className="final-page final-priority-page">
      <section className="final-step-heading"><span>1 / 2</span><h1>今日は、何を<br />大事にする？</h1><p>3つまで選べます。</p></section>
      <div className="final-context-summary">{summary}</div>
      <div className="final-priority-grid">
        {(Object.keys(finalPriorityLabels) as FinalPriority[]).map((priority) => {
          const Icon = priorityIcons[priority];
          const active = selected.includes(priority);
          return <button key={priority} className={active ? "is-active" : ""} onClick={() => onToggle(priority)} aria-pressed={active}>
            <span><Icon size={21} /></span><strong>{finalPriorityLabels[priority]}</strong>{active && <Check size={16} className="final-choice-check" />}
          </button>;
        })}
      </div>
      <p className="final-help-copy"><Sparkles size={14} />普段の好みと、これまでの選択も反映します</p>
      <button className="final-primary-button" disabled={selected.length === 0} onClick={onSubmit}>3つの案を見る <ArrowRight size={18} /></button>
    </main>
  );
}
