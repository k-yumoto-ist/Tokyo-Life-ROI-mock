import { ArrowRight, Gauge, Heart, MessageCircleMore, Play, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { finalSuggestionPrompts } from "../../../data/finalMockData";
import { getLearningStage } from "../../../lib/finalRecommendation";

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
  };
  onPromptChange: (prompt: string) => void;
  onNext: () => void;
  onDemo: () => void;
};

export function FinalHomeScreen({ prompt, historyCount, latestInsight, wellbeing, onPromptChange, onNext, onDemo }: FinalHomeScreenProps) {
  const learning = getLearningStage(historyCount);
  return (
    <main className="final-page final-home-page">
      <section className="final-home-intro">
        <span className="final-kicker">YOUR TOKYO, TODAY</span>
        <h1>今日は、東京で<br />どう過ごす？</h1>
        <p>気分や予定を、そのまま入力してください。</p>
      </section>

      <section className="final-home-indicators" aria-label="My QOLとMy ROIの最近の状態">
        <article className="is-qol"><div><Heart size={18} /><span>My QOL<small>暮らしの充実</small></span></div><strong>{wellbeing.averageQol}</strong><p>{wellbeing.qolHeadline}</p><small>{wellbeing.qolNeed}</small></article>
        <article className="is-roi"><div><Gauge size={18} /><span>My ROI<small>価値と負担</small></span></div><strong>{wellbeing.averageRoi}</strong><p>{wellbeing.roiHeadline}</p><small>{wellbeing.roiTrend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}最近の選択平均</small></article>
      </section>
      <p className="final-dual-definition"><Heart size={13} />QOLは充実度 <span /> <Gauge size={13} />ROIは選択のバランス</p>

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
