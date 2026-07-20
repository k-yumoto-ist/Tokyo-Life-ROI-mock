import { Check, Meh, Smile, Sparkles } from "lucide-react";
import { useState } from "react";
import { finalFeedbackOptions, type FinalBurden, type FinalRevisitIntent, type FinalSatisfaction } from "../../../data/finalMockData";
import type { FinalRecommendation } from "../../../lib/finalRecommendation";

type Props = {
  recommendation: FinalRecommendation;
  onSave: (feedback: { satisfaction: FinalSatisfaction; burden: FinalBurden; revisitIntent: FinalRevisitIntent; reasons: string[] }) => void;
};

const satisfactionOptions: { value: FinalSatisfaction; label: string; Icon: typeof Smile }[] = [
  { value: "great", label: "かなり良かった", Icon: Sparkles },
  { value: "good", label: "まあ良かった", Icon: Smile },
  { value: "low", label: "いまひとつ", Icon: Meh },
];

export function FinalReflectionScreen({ recommendation, onSave }: Props) {
  const [satisfaction, setSatisfaction] = useState<FinalSatisfaction>("good");
  const [burden, setBurden] = useState<FinalBurden>("balanced");
  const [revisitIntent, setRevisitIntent] = useState<FinalRevisitIntent>("maybe");
  const [reasons, setReasons] = useState<string[]>([]);
  function toggle(reason: string) {
    setReasons((current) => current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]);
  }
  return (
    <main className="final-page final-reflection-page">
      <section className="final-reflection-heading">
        <p>AFTER</p>
        <h1>今日の選択、<br />どうだった？</h1>
        <small>{recommendation.candidate.place}</small>
      </section>
      <fieldset className="final-reflection-fieldset">
        <legend>満足度</legend>
        <div className="final-satisfaction-options">
          {satisfactionOptions.map(({ value, label, Icon }) => (
            <button key={value} className={satisfaction === value ? "is-active" : ""} aria-pressed={satisfaction === value} onClick={() => setSatisfaction(value)}>
              <Icon size={24} />{label}{satisfaction === value && <Check size={15} />}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="final-reflection-fieldset">
        <legend>負担感</legend>
        <div className="final-compact-choice-row">
          {([['easy','楽だった'],['balanced','ちょうどよい'],['tired','疲れた']] as const).map(([value, label]) => <button key={value} className={burden === value ? "is-active" : ""} aria-pressed={burden === value} onClick={() => setBurden(value)}>{burden === value && <Check size={14} />}{label}</button>)}
        </div>
      </fieldset>
      <fieldset className="final-reflection-fieldset">
        <legend>また選びたい？</legend>
        <div className="final-compact-choice-row">
          {([['yes','また選びたい'],['maybe','条件次第'],['no','もう選ばない']] as const).map(([value, label]) => <button key={value} className={revisitIntent === value ? "is-active" : ""} aria-pressed={revisitIntent === value} onClick={() => setRevisitIntent(value)}>{revisitIntent === value && <Check size={14} />}{label}</button>)}
        </div>
      </fieldset>
      <details className="final-feedback-details">
        <summary>もう少しだけ教える <small>任意</small></summary>
        <div className="final-feedback-grid">
          {finalFeedbackOptions.map((reason) => <button key={reason} className={reasons.includes(reason) ? "is-active" : ""} aria-pressed={reasons.includes(reason)} onClick={() => toggle(reason)}>{reasons.includes(reason) && <Check size={14} />}{reason}</button>)}
        </div>
      </details>
      <button className="final-primary-button final-sticky-cta" onClick={() => onSave({ satisfaction, burden, revisitIntent, reasons })}>2つの予測に反映する</button>
    </main>
  );
}
