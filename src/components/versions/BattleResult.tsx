import { CheckCircle2, ChevronLeft, CircleHelp, Crown, Map, Save, Share2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { BattlePlan } from "../../data/battleMockData";

type ResultProps = {
  plans: BattlePlan[];
  pushedPlanId: BattlePlan["id"] | null;
  onChoose: (plan: BattlePlan) => void;
  onRematch: () => void;
};

export function BattleResult({ plans, pushedPlanId, onChoose, onRematch }: ResultProps) {
  const [showRoiInfo, setShowRoiInfo] = useState(false);
  const results = [...plans].sort((a, b) => b.roi - a.roi);
  const winner = results[0];
  const pushedPlan = plans.find((plan) => plan.id === pushedPlanId);
  const judgementMessage = pushedPlan
    ? pushedPlan.id === winner.id
      ? "AIとあなたの判断が一致しました"
      : `AIは効率を重視しましたが、あなたは${pushedPlan.primaryStrength.replace("最も", "")}を重視しています`
    : "あなたの推しを選ばず、AIの総合判定を確認しました";
  return (
    <section className="battle-result">
      <button className="mini-link-button flow-back" onClick={onRematch}><ChevronLeft size={16} />条件を変えて再戦</button>
      <article className="battle-winner-card">
        <span className="winner-label"><Crown size={14} /> WINNER</span>
        <h2>{winner.title}</h2>
        <p>家族の負担を抑えながら、休日をしっかり楽しめます</p>
        <div className="winner-score">総合ROI {winner.roi}</div>
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
      <article className="battle-final-score-card">
        <div>
          <h3>最終判定</h3>
          <button onClick={() => setShowRoiInfo(true)} aria-label="総合ROIの説明を見る"><CircleHelp size={17} />ROIとは？</button>
        </div>
        <ol>
          {results.map((plan, index) => <li key={plan.id}><span>{index + 1}</span><strong>{plan.title}</strong><b>ROI {plan.roi}</b></li>)}
        </ol>
      </article>
      <article className="battle-judgement-message">
        <span>AI判定: {winner.title}</span>
        <span>あなたの推し: {pushedPlan?.title ?? "未選択"}</span>
        <p>{judgementMessage}</p>
      </article>
      <div className="battle-choice-panel">
        <h3>最後に決めるのは、あなたです</h3>
        <button className="primary-button action-wide" onClick={() => onChoose(winner)}><Sparkles size={18} />AIおすすめで決定</button>
        {plans.map((plan) => <button key={plan.id} className={`secondary-button action-wide ${pushedPlanId === plan.id ? "is-pushed-choice" : ""}`} onClick={() => onChoose(plan)}>{plan.title}を選ぶ</button>)}
      </div>
      {showRoiInfo && <RoiInfoSheet onClose={() => setShowRoiInfo(false)} />}
    </section>
  );
}

function RoiInfoSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="battle-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="battle-detail-sheet battle-roi-sheet" role="dialog" aria-modal="true" aria-label="総合ROIの説明" onMouseDown={(event) => event.stopPropagation()}>
        <button className="battle-sheet-close" onClick={onClose} aria-label="説明を閉じる"><X size={20} /></button>
        <CircleHelp size={26} />
        <h2>総合ROIとは？</h2>
        <p>満足度などから得られる価値と、費用・移動時間・待ち時間・混雑・疲労などの負担を、あなたの設定に合わせて総合評価した指標です。</p>
        <p>モックでは、時間価値・家族構成・今回の優先条件を反映して判定しています。</p>
      </section>
    </div>
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
