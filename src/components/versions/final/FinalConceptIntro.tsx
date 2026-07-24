import { ArrowRight, Gauge, Heart, X } from "lucide-react";

type FinalConceptIntroProps = {
  onClose: () => void;
};

export function FinalConceptIntro({ onClose }: FinalConceptIntroProps) {
  return (
    <div className="final-concept-backdrop">
      <section className="final-concept-dialog" role="dialog" aria-modal="true" aria-labelledby="final-concept-title">
        <button type="button" className="final-concept-skip" onClick={onClose} aria-label="説明を閉じる"><X size={19} /></button>
        <span className="final-kicker">HOW IT WORKS</span>
        <h2 id="final-concept-title">今日の選択から、<br />自分らしい暮らしへ。</h2>
        <div className="final-concept-flow">
          <article className="is-roi">
            <Gauge size={22} />
            <div><strong>My ROI</strong><span>今日の選択のものさし</span><small>得られる価値と、時間・費用・疲れのバランス</small></div>
          </article>
          <ArrowRight size={18} aria-hidden="true" />
          <article className="is-qol">
            <Heart size={22} />
            <div><strong>My QOL</strong><span>最近の暮らしの現在地</span><small>行動と振り返りから見える、暮らしの充実度</small></div>
          </article>
        </div>
        <p>良い選択を重ねながら、あなたらしい暮らしを見つけます。</p>
        <button type="button" className="final-primary-button" onClick={onClose}>使ってみる <ArrowRight size={17} /></button>
      </section>
    </div>
  );
}
