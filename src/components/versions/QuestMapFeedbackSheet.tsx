import { Check, Clock3, Heart, Sparkles, UsersRound } from "lucide-react";
import { useState } from "react";
import type { RoiFeedback } from "../../data/questMapData";

type QuestMapFeedbackSheetProps = {
  onCancel: () => void;
  onSubmit: (feedback: RoiFeedback) => void;
};

export function QuestMapFeedbackSheet({ onCancel, onSubmit }: QuestMapFeedbackSheetProps) {
  const [feedback, setFeedback] = useState<RoiFeedback>({
    satisfaction: "good",
    fatigue: "high",
    familyEnjoyment: true,
    timeExpectation: "longer",
  });

  return (
    <div className="quest-map-sheet-backdrop quest-map-feedback-backdrop" role="presentation">
      <section className="quest-map-feedback-sheet" role="dialog" aria-modal="true" aria-label="クエスト後のかんたん振り返り">
        <div className="quest-map-sheet-handle" />
        <span className="quest-map-feedback-kicker">CHECK-IN COMPLETE</span>
        <h2>実際どうだった？</h2>
        <p>選ぶほど、次の予測があなた向けになります。</p>
        <fieldset>
          <legend><Sparkles size={15} />満足できた？</legend>
          <div className="quest-map-feedback-options">
            {(["great", "good", "low"] as const).map((value) => <button key={value} className={feedback.satisfaction === value ? "is-active" : ""} onClick={() => setFeedback((current) => ({ ...current, satisfaction: value }))} aria-pressed={feedback.satisfaction === value}>{value === "great" ? "最高" : value === "good" ? "よかった" : "いまひとつ"}{feedback.satisfaction === value && <Check size={14} />}</button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend><Clock3 size={15} />移動の負担は？</legend>
          <div className="quest-map-feedback-options two-columns">
            <button className={feedback.fatigue === "light" ? "is-active" : ""} onClick={() => setFeedback((current) => ({ ...current, fatigue: "light" }))} aria-pressed={feedback.fatigue === "light"}>問題なし{feedback.fatigue === "light" && <Check size={14} />}</button>
            <button className={feedback.fatigue === "high" ? "is-active" : ""} onClick={() => setFeedback((current) => ({ ...current, fatigue: "high" }))} aria-pressed={feedback.fatigue === "high"}>思ったより疲れた{feedback.fatigue === "high" && <Check size={14} />}</button>
          </div>
        </fieldset>
        <fieldset>
          <legend><UsersRound size={15} />家族は楽しんだ？</legend>
          <div className="quest-map-feedback-options two-columns">
            <button className={feedback.familyEnjoyment ? "is-active" : ""} onClick={() => setFeedback((current) => ({ ...current, familyEnjoyment: true }))} aria-pressed={feedback.familyEnjoyment}>楽しんだ{feedback.familyEnjoyment && <Check size={14} />}</button>
            <button className={!feedback.familyEnjoyment ? "is-active" : ""} onClick={() => setFeedback((current) => ({ ...current, familyEnjoyment: false }))} aria-pressed={!feedback.familyEnjoyment}>ふつう{!feedback.familyEnjoyment && <Check size={14} />}</button>
          </div>
        </fieldset>
        <fieldset>
          <legend><Heart size={15} />時間は想定どおり？</legend>
          <div className="quest-map-feedback-options two-columns">
            <button className={feedback.timeExpectation === "as-planned" ? "is-active" : ""} onClick={() => setFeedback((current) => ({ ...current, timeExpectation: "as-planned" }))} aria-pressed={feedback.timeExpectation === "as-planned"}>想定どおり{feedback.timeExpectation === "as-planned" && <Check size={14} />}</button>
            <button className={feedback.timeExpectation === "longer" ? "is-active" : ""} onClick={() => setFeedback((current) => ({ ...current, timeExpectation: "longer" }))} aria-pressed={feedback.timeExpectation === "longer"}>少し長かった{feedback.timeExpectation === "longer" && <Check size={14} />}</button>
          </div>
        </fieldset>
        <button className="quest-map-primary-button" onClick={() => onSubmit(feedback)}>振り返りを保存<Check size={17} /></button>
        <button className="quest-map-cancel-button" onClick={onCancel}>クエスト画面に戻る</button>
      </section>
    </div>
  );
}
