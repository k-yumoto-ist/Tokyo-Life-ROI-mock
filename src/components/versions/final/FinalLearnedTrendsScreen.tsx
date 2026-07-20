import { ArrowLeft, BrainCircuit, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { FinalChoiceRecord } from "../../../data/finalMockData";

type Props = { history: FinalChoiceRecord[]; onBack: () => void };

const learnedTrends = [
  "混雑を避けた提案の満足度が高めです",
  "子どもと一緒のときは、移動時間より体験を重視しています",
  "公共施設を含む提案を選ぶことが多いです",
  "平日は時間を、休日は満足感を重視する傾向があります",
];

export function FinalLearnedTrendsScreen({ history, onBack }: Props) {
  const [paused, setPaused] = useState<number[]>([]);
  const toggle = (index: number) => setPaused((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  return (
    <main className="final-page final-profile-subpage">
      <button type="button" className="final-back-link" onClick={onBack}><ArrowLeft size={18} /> 個人設定に戻る</button>
      <section className="final-section-heading final-settings-heading">
        <span>学習</span>
        <h1>行動から見えてきた<br />あなたの傾向</h1>
        <p>選んだ提案や振り返りをもとに、提案の仕方を調整しています。</p>
      </section>
      <div className="final-learned-note"><BrainCircuit size={20} /><span><b>{Math.max(history.length, 4)}回分の選択を参考にしています</b><small>設定した内容とは分けて扱います</small></span></div>
      <div className="final-learned-list">
        {learnedTrends.map((trend, index) => {
          const isPaused = paused.includes(index);
          return <article key={trend} className={isPaused ? "is-paused" : ""}>
            <div><span className="final-source-badge is-learned">学習</span>{!isPaused && <span className="final-reflecting-label"><Check size={12} />提案に反映中</span>}</div>
            <p>{trend}</p>
            <button type="button" onClick={() => toggle(index)}>{isPaused ? <><RotateCcw size={14} />反映を戻す</> : "この傾向は違う"}</button>
          </article>;
        })}
      </div>
      <p className="final-privacy-note">傾向は決めつけではありません。違うと感じた内容は、いつでも反映を止められます。</p>
    </main>
  );
}
