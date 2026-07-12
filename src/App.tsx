import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  Frown,
  Heart,
  History,
  Home,
  Lightbulb,
  Meh,
  Navigation,
  PiggyBank,
  Smile,
  Sparkles,
  Star,
  ThumbsUp,
  Users
} from "lucide-react";
import { feedbackTags, goals, initialFeedback, initialLoopState, insights, loopStorageKey, plans } from "./lib/mockData";
import { formatYen, selectedPlanOrDefault, updateStatsAfterFeedback } from "./lib/scoring";
import type { GoalChip, GoalId, PersistedLoopState, Plan, Satisfaction, View } from "./types";

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "ホーム", icon: <Home size={21} /> },
  { id: "plans", label: "提案", icon: <Lightbulb size={21} /> },
  { id: "history", label: "履歴", icon: <History size={21} /> },
  { id: "reflection", label: "振り返り", icon: <Smile size={21} /> }
];

const goalIcons: Record<GoalId, React.ReactNode> = {
  time: <Clock3 size={17} />,
  saving: <Coins size={17} />,
  quiet: <Users size={17} />,
  family: <Heart size={17} />
};

export default function App() {
  const [view, setView] = useState<View>("home");
  const [state, setState] = useState<PersistedLoopState>(initialLoopState);
  const [showMoreTags, setShowMoreTags] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(loopStorageKey);
    if (!stored) return;
    try {
      setState({ ...initialLoopState, ...JSON.parse(stored) });
    } catch {
      setState(initialLoopState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(loopStorageKey, JSON.stringify(state));
  }, [state]);

  const selectedPlan = useMemo(() => selectedPlanOrDefault(plans, state.selectedPlanId), [state.selectedPlanId]);
  const recommendedPlan = plans.find((plan) => plan.recommended) ?? plans[0];

  function selectGoal(goal: GoalId) {
    setState((current) => ({ ...current, selectedGoal: goal }));
  }

  function startAction(plan: Plan) {
    setState((current) => ({
      ...current,
      selectedPlanId: plan.id,
      actionCompleted: false,
      feedback: initialFeedback
    }));
    setView("action");
  }

  function completeAction() {
    setState((current) => ({ ...current, actionCompleted: true }));
    setView("reflection");
  }

  function selectSatisfaction(satisfaction: Satisfaction) {
    setState((current) => ({ ...current, feedback: { ...current.feedback, satisfaction } }));
  }

  function toggleFeedbackTag(tag: string) {
    setState((current) => {
      const exists = current.feedback.tags.includes(tag);
      const tags = exists ? current.feedback.tags.filter((item) => item !== tag) : [...current.feedback.tags, tag];
      return { ...current, feedback: { ...current.feedback, tags } };
    });
  }

  function saveFeedback() {
    if (!state.feedback.satisfaction || state.feedback.saved) return;
    setState((current) => ({
      ...current,
      stats: updateStatsAfterFeedback(current.stats, selectedPlan, current.feedback.satisfaction),
      feedback: { ...current.feedback, saved: true }
    }));
  }

  function resetDemo() {
    window.localStorage.removeItem(loopStorageKey);
    setState(initialLoopState);
    setShowMoreTags(false);
    setView("home");
  }

  return (
    <div className="min-h-[100dvh] bg-[#edf7ff] text-ink">
      <main className="app-shell">
        <div className="phone-surface">
          {view === "home" && (
            <HomeScreen
              selectedGoal={state.selectedGoal}
              stats={state.stats}
              recommendedPlan={recommendedPlan}
              onGoal={selectGoal}
              onStart={() => startAction(recommendedPlan)}
              onPlans={() => setView("plans")}
            />
          )}
          {view === "plans" && <PlansScreen selectedGoal={state.selectedGoal} onBack={() => setView("home")} onSelect={startAction} />}
          {view === "action" && <ActionScreen plan={selectedPlan} onComplete={completeAction} onChangePlan={() => setView("plans")} />}
          {view === "history" && <HistoryScreen stats={state.stats} selectedPlan={selectedPlan} onReset={resetDemo} />}
          {view === "reflection" && (
            <ReflectionScreen
              plan={selectedPlan}
              state={state}
              showMoreTags={showMoreTags}
              onSatisfaction={selectSatisfaction}
              onTag={toggleFeedbackTag}
              onMore={() => setShowMoreTags((value) => !value)}
              onSave={saveFeedback}
              onMyRoi={() => setView("history")}
              onHome={() => setView("home")}
            />
          )}
          <BottomNavigation active={view} onNavigate={setView} />
        </div>
      </main>
    </div>
  );
}

function HomeScreen({
  selectedGoal,
  stats,
  recommendedPlan,
  onGoal,
  onStart,
  onPlans
}: {
  selectedGoal: GoalId;
  stats: PersistedLoopState["stats"];
  recommendedPlan: Plan;
  onGoal: (goal: GoalId) => void;
  onStart: () => void;
  onPlans: () => void;
}) {
  return (
    <section className="screen-content home-hero">
      <header className="top-bar">
        <div>
          <h1 className="brand-title">Tokyo Life ROI</h1>
          <p className="today-question">今日はどうしたい?</p>
        </div>
        <button className="round-icon-button" aria-label="通知">
          <Bell size={20} />
        </button>
      </header>

      <div className="goal-chip-row" aria-label="目的を選択">
        {goals.map((goal) => (
          <GoalChipButton key={goal.id} goal={goal} active={selectedGoal === goal.id} onClick={() => onGoal(goal.id)} />
        ))}
      </div>

      <RecommendationCard plan={recommendedPlan} onStart={onStart} onPlans={onPlans} />
      <MyRoiSummary stats={stats} compact />
    </section>
  );
}

function GoalChipButton({ goal, active, onClick }: { goal: GoalChip; active: boolean; onClick: () => void }) {
  return (
    <button className={`goal-chip goal-${goal.tone} ${active ? "is-active" : ""}`} onClick={onClick} aria-pressed={active} aria-label={`${goal.label}を重視`}>
      {goalIcons[goal.id]}
      <span>{goal.label}</span>
      {active && <CheckCircle2 size={14} className="chip-check" aria-hidden="true" />}
    </button>
  );
}

function RecommendationCard({ plan, onStart, onPlans }: { plan: Plan; onStart: () => void; onPlans: () => void }) {
  return (
    <article className="recommendation-card">
      <div className="section-label">今のあなたにおすすめ ✨</div>
      <div className="recommendation-main">
        <div className="train-illustration" aria-hidden="true">
          <Navigation size={42} />
        </div>
        <div>
          <h2>{plan.title}</h2>
          <p>{plan.description}</p>
          <span className="tiny-pill">+ 時短の達人プラン</span>
        </div>
      </div>
      <div className="metric-grid">
        <MetricItem icon={<Clock3 size={18} />} value={`${plan.savedMinutes}分`} label="短縮" tone="blue" />
        <MetricItem icon={<PiggyBank size={18} />} value={`${plan.savedYen}円`} label="お得" tone="green" />
        <MetricItem icon={<Users size={18} />} value={plan.crowd} label="混雑" tone="cyan" />
        <MetricItem icon={<Star size={18} />} value={plan.satisfaction.toFixed(1)} label="満足度予測" tone="orange" />
      </div>
      <button className="primary-button action-wide" onClick={onStart}>
        この案で行動 <ChevronRight size={20} />
      </button>
      <button className="secondary-button action-wide" onClick={onPlans}>
        他の案を見る <ChevronRight size={18} />
      </button>
    </article>
  );
}

function PlansScreen({ selectedGoal, onBack, onSelect }: { selectedGoal: GoalId; onBack: () => void; onSelect: (plan: Plan) => void }) {
  const selectedGoalLabel = goals.find((goal) => goal.id === selectedGoal)?.label ?? "時短";
  return (
    <section className="screen-content">
      <PageHeader title="提案比較" onBack={onBack} />
      <p className="condition-line"><Clock3 size={17} /> 今日は「{selectedGoalLabel}」を重視しています</p>
      <div className="plan-list">
        {plans.map((plan) => (
          <PlanComparisonCard key={plan.id} plan={plan} onSelect={() => onSelect(plan)} />
        ))}
      </div>
      <p className="demo-note">表示の情報は予測値です。実際の結果と異なる場合があります。</p>
    </section>
  );
}

function PlanComparisonCard({ plan, onSelect }: { plan: Plan; onSelect: () => void }) {
  const accent = plan.id === "plan-a" ? "blue" : plan.id === "plan-b" ? "green" : "orange";
  return (
    <article className={`plan-card plan-${accent} ${plan.recommended ? "is-recommended" : ""}`}>
      <div className="plan-card-head">
        <div className={`plan-letter ${accent}`}>{plan.name.replace("プラン", "")}</div>
        <div>
          <div className="plan-title-row">
            <h2>{plan.name}</h2>
            {plan.recommended && <span className="recommend-badge"><Star size={14} /> おすすめ</span>}
          </div>
          <p>{plan.description}</p>
        </div>
      </div>
      <div className="plan-metrics">
        <MiniMetric icon={<Clock3 size={15} />} label="時間" value={`${plan.timeMinutes}分`} />
        <MiniMetric icon={<Coins size={15} />} label="費用" value={formatYen(plan.cost)} />
        <MiniMetric icon={<Users size={15} />} label="混雑" value={plan.crowd} />
        <MiniMetric icon={<Star size={15} />} label="満足度" value={plan.satisfaction.toFixed(1)} />
      </div>
      <button className={plan.recommended ? "primary-button action-wide" : "outline-select-button"} onClick={onSelect}>
        これにする <ChevronRight size={18} />
      </button>
    </article>
  );
}

function ActionScreen({ plan, onComplete, onChangePlan }: { plan: Plan; onComplete: () => void; onChangePlan: () => void }) {
  return (
    <section className="screen-content action-screen">
      <PageHeader title={`${plan.name}で行動中`} />
      <article className="active-plan-card">
        <div className="active-illustration">
          <Navigation size={52} />
        </div>
        <h1>{plan.title}</h1>
        <p>{plan.description}</p>
        <div className="metric-grid">
          <MetricItem icon={<Clock3 size={18} />} value={`${plan.timeMinutes}分`} label="所要時間" tone="blue" />
          <MetricItem icon={<Coins size={18} />} value={formatYen(plan.cost)} label="費用" tone="green" />
          <MetricItem icon={<Users size={18} />} value={plan.crowd} label="混雑" tone="cyan" />
          <MetricItem icon={<Navigation size={18} />} value={plan.arrivalTime} label="到着予定" tone="orange" />
        </div>
      </article>
      <div className="sticky-actions">
        <button className="primary-button action-wide" onClick={onComplete}>行動を完了する</button>
        <button className="secondary-button action-wide" onClick={onChangePlan}>プランを変更する</button>
      </div>
    </section>
  );
}

function ReflectionScreen({
  plan,
  state,
  showMoreTags,
  onSatisfaction,
  onTag,
  onMore,
  onSave,
  onMyRoi,
  onHome
}: {
  plan: Plan;
  state: PersistedLoopState;
  showMoreTags: boolean;
  onSatisfaction: (satisfaction: Satisfaction) => void;
  onTag: (tag: string) => void;
  onMore: () => void;
  onSave: () => void;
  onMyRoi: () => void;
  onHome: () => void;
}) {
  if (state.feedback.saved) {
    return <FeedbackSavedScreen stats={state.stats} onMyRoi={onMyRoi} onHome={onHome} />;
  }

  if (!state.actionCompleted) {
    return (
      <section className="screen-content">
        <PageHeader title="振り返り" />
        <MyRoiDashboard stats={state.stats} />
      </section>
    );
  }

  const visibleTags = showMoreTags ? feedbackTags : feedbackTags.slice(0, 5);
  return (
    <section className="screen-content reflection-scene">
      <PageHeader title="行動後のかんたん振り返り" />
      <div className="city-illustration" aria-hidden="true">
        <Sparkles size={22} />
        <span>選択結果が次回のおすすめに反映されます</span>
      </div>
      <h2 className="reflection-title">今日の行動はどうだった?</h2>
      <div className="satisfaction-grid" role="group" aria-label="満足度を選択">
        <SatisfactionButton id="good" label="よかった" active={state.feedback.satisfaction === "good"} icon={<Smile size={42} />} onClick={() => onSatisfaction("good")} />
        <SatisfactionButton id="ok" label="まあまあ" active={state.feedback.satisfaction === "ok"} icon={<Meh size={42} />} onClick={() => onSatisfaction("ok")} />
        <SatisfactionButton id="bad" label="微妙" active={state.feedback.satisfaction === "bad"} icon={<Frown size={42} />} onClick={() => onSatisfaction("bad")} />
      </div>
      <p className="tag-help">当てはまるものを選んでね（複数選択OK）</p>
      <div className="feedback-tags">
        {visibleTags.map((tag) => (
          <FeedbackTag key={tag} tag={tag} active={state.feedback.tags.includes(tag)} onClick={() => onTag(tag)} />
        ))}
      </div>
      <button className="more-tag-button" onClick={onMore}>{showMoreTags ? "少なく表示" : "その他を見る"}</button>
      <div className="sticky-actions">
        <button className="primary-button action-wide" onClick={onSave} disabled={!state.feedback.satisfaction}>
          振り返りを保存
        </button>
        <p className="point-rule">行動完了 3ポイント + 振り返り完了 2ポイント</p>
      </div>
    </section>
  );
}

function FeedbackSavedScreen({ stats, onMyRoi, onHome }: { stats: PersistedLoopState["stats"]; onMyRoi: () => void; onHome: () => void }) {
  return (
    <section className="screen-content">
      <PageHeader title="振り返りありがとう!" />
      <article className="point-result-card">
        <div className="confetti" aria-hidden="true" />
        <div className="mascot-card">
          <ThumbsUp size={54} />
        </div>
        <p className="section-label">行動ポイント</p>
        <strong>+5</strong>
        <p>良い選択を振り返るほど、あなたに合った提案に近づきます。</p>
      </article>
      <MyRoiSummary stats={stats} />
      <div className="sticky-actions">
        <button className="primary-button action-wide" onClick={onMyRoi}>My ROIを見る</button>
        <button className="secondary-button action-wide" onClick={onHome}>ホームに戻る</button>
      </div>
    </section>
  );
}

function HistoryScreen({ stats, selectedPlan, onReset }: { stats: PersistedLoopState["stats"]; selectedPlan: Plan; onReset: () => void }) {
  return (
    <section className="screen-content">
      <PageHeader title="履歴" />
      <article className="history-card">
        <p className="section-label">最近の選択</p>
        <h2>{selectedPlan.name}: {selectedPlan.title}</h2>
        <p>{selectedPlan.savedMinutes}分短縮 / {selectedPlan.savedYen}円お得 / 混雑 {selectedPlan.crowd}</p>
      </article>
      <MyRoiDashboard stats={stats} />
      <button className="reset-button" onClick={onReset}>デモ状態を初期化</button>
    </section>
  );
}

function MyRoiDashboard({ stats }: { stats: PersistedLoopState["stats"] }) {
  return (
    <>
      <MyRoiSummary stats={stats} />
      <section className="insight-list">
        <h2>自分の選択傾向</h2>
        {insights.map((insight) => (
          <article key={insight.title} className="insight-card">
            <Lightbulb size={20} />
            <div>
              <h3>{insight.title}</h3>
              <p>{insight.body}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="compare-card">
        <h2>過去との比較</h2>
        <div className="compare-grid">
          <MetricItem icon={<Star size={18} />} value="+0.4" label="先月より満足度" tone="orange" />
          <MetricItem icon={<Clock3 size={18} />} value="+38分" label="先月より時短" tone="blue" />
        </div>
      </section>
    </>
  );
}

function MyRoiSummary({ stats, compact = false }: { stats: PersistedLoopState["stats"]; compact?: boolean }) {
  return (
    <section className={`my-roi-card ${compact ? "is-compact" : ""}`}>
      <h2>今月のMy ROI 📊</h2>
      <div className="roi-metrics">
        <MetricItem icon={<Heart size={18} />} value={`${stats.supportCount}回`} label="サポート" tone="blue" />
        <MetricItem icon={<Clock3 size={18} />} value={`${stats.savedMinutes}分`} label="時間短縮" tone="cyan" />
        <MetricItem icon={<Coins size={18} />} value={formatYen(stats.savedYen)} label="節約額" tone="green" />
        <MetricItem icon={<Star size={18} />} value={stats.averageSatisfaction.toFixed(1)} label="平均満足度" tone="orange" />
      </div>
      {!compact && <p className="points-line">選択ポイント: {stats.actionPoints}pt / 混雑回避: {stats.avoidedCrowdCount}回</p>}
    </section>
  );
}

function MetricItem({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: "blue" | "green" | "cyan" | "orange" }) {
  return (
    <div className={`metric-tile metric-${tone}`}>
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="mini-metric">
      <span>{icon}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SatisfactionButton({ id, label, active, icon, onClick }: { id: Exclude<Satisfaction, null>; label: string; active: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button className={`satisfaction-button satisfaction-${id} ${active ? "is-active" : ""}`} onClick={onClick} aria-pressed={active} aria-label={`満足度 ${label}`}>
      {active && <CheckCircle2 size={18} className="satisfaction-check" />}
      {icon}
      <span>{label}</span>
    </button>
  );
}

function FeedbackTag({ tag, active, onClick }: { tag: string; active: boolean; onClick: () => void }) {
  return (
    <button className={`feedback-tag ${active ? "is-active" : ""}`} onClick={onClick} aria-pressed={active} aria-label={`${tag}を選択`}>
      {active && <CheckCircle2 size={14} />}
      {tag}
    </button>
  );
}

function PageHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="page-header">
      {onBack ? <button className="back-button" onClick={onBack} aria-label="戻る">‹</button> : <span className="back-spacer" />}
      <h1>{title}</h1>
      <span className="back-spacer" />
    </header>
  );
}

function BottomNavigation({ active, onNavigate }: { active: View; onNavigate: (view: View) => void }) {
  return (
    <nav className="bottom-nav" aria-label="下部ナビゲーション">
      {navItems.map((item) => (
        <button key={item.id} className={active === item.id ? "is-active" : ""} onClick={() => onNavigate(item.id)} aria-current={active === item.id ? "page" : undefined}>
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
