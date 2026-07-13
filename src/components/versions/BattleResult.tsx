import { CheckCircle2, ChevronLeft, Crown, Map, Save, Share2, Sparkles } from "lucide-react";
import type { BattlePlan } from "../../data/battleMockData";

type ResultProps = {
  plans: BattlePlan[];
  pushedPlanId: BattlePlan["id"] | null;
  onChoose: (plan: BattlePlan) => void;
  onRematch: () => void;
};

export function BattleResult({ plans, pushedPlanId, onChoose, onRematch }: ResultProps) {
  const winner = plans[0];
  return (
    <section className="battle-result">
      <button className="mini-link-button flow-back" onClick={onRematch}><ChevronLeft size={16} />条件を変えて再戦</button>
      <article className="battle-winner-card">
        <span className="winner-label"><Crown size={14} /> WINNER</span>
        <h2>{winner.title}</h2>
        <p>家族の負担を抑えながら、休日をしっかり楽しめます</p>
        <div className="winner-score">ROI {winner.roi}</div>
      </article>
      <article className="battle-reason-card">
        <h3>勝利理由</h3>
        <ul>
          <li>移動時間と待ち時間が短い</li>
          <li>満足度を大きく落とさない</li>
          <li>帰宅後の時間も確保できる</li>
          <li>時間価値を含めた総合ROIが最も高い</li>
        </ul>
      </article>
      <article className="battle-difference-card">
        <h3>決定的な差</h3>
        <p>節約じっくり型より満足度が4ポイント高く、満足度全振り型より移動時間を25分短縮できます。</p>
      </article>
      <div className="battle-choice-panel">
        <h3>最後に決めるのは、あなたです</h3>
        <button className="primary-button action-wide" onClick={() => onChoose(winner)}><Sparkles size={18} />AIおすすめで決定</button>
        {plans.slice(1).map((plan) => <button key={plan.id} className={`secondary-button action-wide ${pushedPlanId === plan.id ? "is-pushed-choice" : ""}`} onClick={() => onChoose(plan)}>{plan.title}を選ぶ</button>)}
      </div>
    </section>
  );
}

type DecidedProps = {
  plan: BattlePlan;
  onAction: (message: string) => void;
  onMyRoi: () => void;
};

export function BattleDecided({ plan, onAction, onMyRoi }: DecidedProps) {
  return (
    <section className="battle-result">
      <article className="battle-decided-card">
        <CheckCircle2 size={34} />
        <h2>{plan.title}で決定しました</h2>
        <p>{plan.catchcopy}。あなたの条件に合う選択として記録しました。</p>
        {plan.id !== "a" && <small>AIとは違う選択も、次回の提案をあなた向けに近づけます。</small>}
      </article>
      <div className="battle-decision-actions">
        <button className="primary-button action-wide" onClick={() => onAction("このプランで出発します")}>このプランで出発</button>
        <button className="secondary-button action-wide" onClick={() => onAction("地図画面はモックです")}><Map size={17} />地図を見る</button>
        <button className="secondary-button action-wide" onClick={() => onAction("スケジュール画面はモックです")}>スケジュールを見る</button>
        <button className="secondary-button action-wide" onClick={() => onAction("プランを保存しました")}><Save size={17} />保存する</button>
        <button className="secondary-button action-wide" onClick={() => onAction("共有用リンクを作成しました")}><Share2 size={17} />家族に共有</button>
      </div>
      <button className="mini-link-button full" onClick={onMyRoi}>My ROIで今回の記録を見る</button>
    </section>
  );
}
