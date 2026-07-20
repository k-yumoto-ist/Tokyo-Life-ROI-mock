import { ArrowRight, Gauge, Heart, HelpCircle, MessageCircleMore, Play, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { finalSuggestionPrompts } from "../../../data/finalMockData";
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
  onNext: () => void;
  onDemo: () => void;
  onExplain: () => void;
};

const trendSymbol = { up: "↑", steady: "→", down: "↓" } as const;

export function FinalHomeScreen({ prompt, historyCount, latestInsight, wellbeing, onPromptChange, onNext, onDemo, onExplain }: FinalHomeScreenProps) {
  const learning = getLearningStage(historyCount);
  return (
    <main className="final-page final-home-page">
      <section className="final-home-intro">
        <span className="final-kicker">YOUR TOKYO, TODAY</span>
        <h1>今日は、東京で<br />どう過ごす？</h1>
        <p>気分や予定を、そのまま入力してください。</p>
      </section>

      <section className="final-home-qol-state" aria-labelledby="final-home-qol-title">
        <header>
          <div><Heart size={19} /><span><small>直近7日間</small><strong id="final-home-qol-title">最近のMy QOL</strong></span></div>
          <button onClick={onExplain} aria-label="My QOLとMy ROIの違いを見る"><HelpCircle size={18} /></button>
        </header>
        <div className="final-qol-state-body">
          <strong>{wellbeing.averageQol}</strong>
          <div><p>{wellbeing.qolHeadline}</p><small>{wellbeing.qolNeed}</small></div>
        </div>
        <div className="final-qol-signal-row" aria-label="最近のQOL要素">
          {wellbeing.qolSignals.map((signal) => <span className={`trend-${signal.trend}`} key={signal.label}>{signal.label}<b>{trendSymbol[signal.trend]}</b></span>)}
        </div>
      </section>

      <details className="final-home-roi-insight">
        <summary>
          <Gauge size={17} />
          <span><small>最近の選択傾向</small><strong>平均My ROI {wellbeing.averageRoi}</strong></span>
          {wellbeing.roiTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </summary>
        <p>{wellbeing.roiHeadline}。My ROIは、今日の候補を比べるためのものさしです。</p>
      </details>

      <section className="final-prompt-composer">
        <MessageCircleMore size={21} aria-hidden="true" />
        <label htmlFor="final-prompt">やりたいこと</label>
        <textarea
          id="final-prompt"
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="例：子どもと2時間、暑さを避けて過ごしたい"
          rows={3}
        />
      </section>

      <div className="final-suggestion-row" aria-label="入力候補">
        {finalSuggestionPrompts.map((suggestion) => <button key={suggestion} onClick={() => onPromptChange(suggestion)}>{suggestion}</button>)}
      </div>

      <section className="final-learning-note">
        <Sparkles size={18} />
        <div><strong>{learning.label}</strong><span>{latestInsight ?? learning.note}</span></div>
      </section>

      <button className="final-primary-button final-home-cta" disabled={!prompt.trim()} onClick={onNext}>
        今日の条件を決める <ArrowRight size={18} />
      </button>
      <button className="final-demo-button" onClick={onDemo}><Play size={16} />デモを試す</button>
    </main>
  );
}
