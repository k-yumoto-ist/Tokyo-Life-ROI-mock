import { ArrowRight, Check, Gauge, Heart, HelpCircle, MapPinned, MessageCircleMore, Pencil, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { finalPriorityLabels, finalSuggestionPrompts, type FinalPriority } from "../../../data/finalMockData";
import { getLearningStage } from "../../../lib/finalRecommendation";

type QolSignal = { label: string; trend: "up" | "steady" | "down" };

type FinalHomeScreenProps = {
  prompt: string;
  historyCount: number;
  latestInsight?: string;
  wellbeing: {
    averageQol: number;
    averageRoi: number;
    qolTrend: number;
    roiTrend: number;
    qolHeadline: string;
    qolNeed: string;
    roiHeadline: string;
    qolSignals: QolSignal[];
  };
  onPromptChange: (prompt: string) => void;
  priorities: FinalPriority[];
  onTogglePriority: (priority: FinalPriority) => void;
  onNext: () => void;
  onDemo: () => void;
  onExplain: () => void;
};

const quickPriorities: FinalPriority[] = ["low-fatigue", "children", "quiet", "time", "saving", "novelty", "slow"];

export function FinalHomeScreen({ prompt, historyCount, latestInsight, wellbeing, priorities, onPromptChange, onTogglePriority, onNext, onDemo, onExplain }: FinalHomeScreenProps) {
  const learning = getLearningStage(historyCount);
  const [searchMode, setSearchMode] = useState<"purpose" | "destination">("purpose");
  const [editing, setEditing] = useState(!prompt);
  const commitPrompt = () => {
    if (prompt.trim()) setEditing(false);
  };
  return (
    <main className="final-page final-home-page">
      <header className="final-compact-home-heading">
        <div><span>YOUR TOKYO, TODAY</span><h1>今日は、東京でどう過ごす？</h1></div>
        <button type="button" onClick={onExplain} aria-label="My QOLとMy ROIの説明を見る"><HelpCircle size={19} /></button>
      </header>

      <section className="final-compact-status" aria-label="最近の状態">
        <div><Heart size={16} /><span>最近のMy QOL</span><strong>{wellbeing.averageQol}</strong></div>
        <i />
        <div><Gauge size={16} /><span>選択の平均ROI</span><strong>{wellbeing.averageRoi}</strong></div>
      </section>

      <section className="final-compact-condition" aria-labelledby="final-condition-title">
        <div className="final-search-mode" role="tablist" aria-label="検索方法">
          <button type="button" role="tab" aria-selected={searchMode === "purpose"} className={searchMode === "purpose" ? "is-active" : ""} onClick={() => { setSearchMode("purpose"); setEditing(true); }}><Sparkles size={16} />やりたいこと</button>
          <button type="button" role="tab" aria-selected={searchMode === "destination"} className={searchMode === "destination" ? "is-active" : ""} onClick={() => { setSearchMode("destination"); setEditing(true); }}><MapPinned size={16} />目的地</button>
        </div>
        {editing ? (
          <div className="final-compact-input">
            <MessageCircleMore size={18} aria-hidden="true" />
            <label id="final-condition-title" htmlFor="final-prompt">{searchMode === "purpose" ? "今の気分や予定" : "行きたい場所"}</label>
            <input
              id="final-prompt"
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") commitPrompt(); }}
              placeholder={searchMode === "purpose" ? "子どもと2時間、暑さを避けたい" : "新宿、上野、科学館など"}
            />
            <button type="button" onClick={commitPrompt} disabled={!prompt.trim()} aria-label="入力を確定"><Check size={18} /></button>
          </div>
        ) : (
          <button type="button" className="final-condition-summary" onClick={() => setEditing(true)}>
            <span><small>{searchMode === "purpose" ? "やりたいこと" : "目的地"}</small><strong>{prompt}</strong></span><Pencil size={16} /><em>変更</em>
          </button>
        )}
        {editing && <div className="final-compact-suggestions" aria-label="入力候補">
          {finalSuggestionPrompts.slice(0, 3).map((suggestion) => <button type="button" key={suggestion} onClick={() => { onPromptChange(suggestion); setEditing(false); }}>{suggestion}</button>)}
        </div>}
      </section>

      <section className="final-compact-priorities">
        <div><strong>今日、大切にすること</strong><small>3つまで</small></div>
        <div>{quickPriorities.map((priority) => <button type="button" key={priority} className={priorities.includes(priority) ? "is-active" : ""} aria-pressed={priorities.includes(priority)} onClick={() => onTogglePriority(priority)}>{priorities.includes(priority) && <Check size={13} />}{finalPriorityLabels[priority]}</button>)}</div>
      </section>

      <div className="final-compact-home-footer">
        <p><Sparkles size={14} /><span><strong>{learning.label}</strong> {latestInsight ?? learning.note}</span></p>
        <button className="final-primary-button" disabled={!prompt.trim()} onClick={onNext}>今の条件で3案を見る <ArrowRight size={18} /></button>
        <button className="final-compact-demo" onClick={onDemo}><Play size={14} />デモ条件を使う</button>
      </div>
    </main>
  );
}
