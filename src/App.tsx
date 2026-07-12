import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  Home as HomeIcon,
  Frown,
  Heart,
  History,
  Info,
  Lightbulb,
  MapPin,
  Meh,
  Navigation,
  PiggyBank,
  Save,
  Smile,
  Sparkles,
  Star,
  ThumbsUp,
  TrainFront,
  UserRound,
  Users
} from "lucide-react";
import {
  annualIncomeBandLabels,
  defaultPriorityLabels,
  feedbackTags,
  goals,
  initialFeedback,
  initialLoopState,
  insights,
  loopStorageKey,
  plans,
  transportModeLabels,
  workStyleLabels
} from "./lib/mockData";
import { buildProfileSummary, buildRecommendationReason, calculateAutoHourlyValue, formatYen, selectedPlanOrDefault, updateStatsAfterFeedback } from "./lib/scoring";
import type {
  AnnualIncomeBand,
  DefaultPriority,
  FamilyType,
  GoalChip,
  GoalId,
  HourlyValueMode,
  PersistedLoopState,
  Plan,
  Satisfaction,
  TransportMode,
  UserProfile,
  View,
  WorkStyle
} from "./types";

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "ホーム", icon: <HomeIcon size={21} /> },
  { id: "plans", label: "提案", icon: <Lightbulb size={21} /> },
  { id: "history", label: "履歴", icon: <History size={21} /> },
  { id: "reflection", label: "振り返り", icon: <Smile size={21} /> }
];

const familyTypes: FamilyType[] = ["一人暮らし", "パートナーと二人", "子どもあり", "親との同居", "その他"];
const annualIncomeBands = Object.keys(annualIncomeBandLabels) as AnnualIncomeBand[];
const workStyles = Object.keys(workStyleLabels) as WorkStyle[];
const childAgeGroups = ["未就学児", "小学生", "中高生"];
const transportModes = Object.keys(transportModeLabels) as TransportMode[];
const priorityOptions = Object.keys(defaultPriorityLabels) as DefaultPriority[];

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
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(loopStorageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Partial<PersistedLoopState>;
      setState({
        ...initialLoopState,
        ...parsed,
        feedback: { ...initialLoopState.feedback, ...parsed.feedback },
        stats: { ...initialLoopState.stats, ...parsed.stats },
        profile: { ...initialLoopState.profile, ...parsed.profile }
      });
    } catch {
      setState(initialLoopState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(loopStorageKey, JSON.stringify(state));
  }, [state]);

  const selectedPlan = useMemo(() => selectedPlanOrDefault(plans, state.selectedPlanId), [state.selectedPlanId]);
  const recommendedPlan = plans.find((plan) => plan.recommended) ?? plans[0];
  const recommendationReason = useMemo(() => buildRecommendationReason(state.profile, recommendedPlan), [recommendedPlan, state.profile]);

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
    setToast("");
    setView("home");
  }

  function saveProfile(profile: UserProfile) {
    setState((current) => ({ ...current, profile }));
    setView("home");
    setToast("個人設定を更新しました");
    window.setTimeout(() => setToast(""), 1800);
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
              profile={state.profile}
              recommendationReason={recommendationReason}
              onGoal={selectGoal}
              onStart={() => startAction(recommendedPlan)}
              onPlans={() => setView("plans")}
              onProfile={() => setView("profile")}
            />
          )}
          {view === "plans" && (
            <PlansScreen
              selectedGoal={state.selectedGoal}
              profile={state.profile}
              onBack={() => setView("home")}
              onSelect={startAction}
            />
          )}
          {view === "action" && <ActionScreen plan={selectedPlan} onComplete={completeAction} onChangePlan={() => setView("plans")} />}
          {view === "profile" && <ProfileScreen profile={state.profile} onSave={saveProfile} onCancel={() => setView("home")} />}
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
          {toast && <div className="toast-message" role="status">{toast}</div>}
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
  profile,
  recommendationReason,
  onGoal,
  onStart,
  onPlans,
  onProfile
}: {
  selectedGoal: GoalId;
  stats: PersistedLoopState["stats"];
  recommendedPlan: Plan;
  profile: UserProfile;
  recommendationReason: string;
  onGoal: (goal: GoalId) => void;
  onStart: () => void;
  onPlans: () => void;
  onProfile: () => void;
}) {
  return (
    <section className="screen-content home-hero">
      <header className="top-bar">
        <div>
          <h1 className="brand-title">Tokyo Life ROI</h1>
          <p className="today-question">今日はどうしたい?</p>
        </div>
        <button className="round-icon-button" aria-label="個人設定を開く" onClick={onProfile}>
          <UserRound size={20} />
        </button>
      </header>

      <div className="goal-chip-row" aria-label="目的を選択">
        {goals.map((goal) => (
          <GoalChipButton key={goal.id} goal={goal} active={selectedGoal === goal.id} onClick={() => onGoal(goal.id)} />
        ))}
      </div>

      <button className="profile-summary-button" onClick={onProfile} aria-label="個人設定を確認・変更">
        <UserRound size={16} />
        <span>{buildProfileSummary(profile)}</span>
        <ChevronRight size={16} />
      </button>

      <RecommendationCard plan={recommendedPlan} reason={recommendationReason} onStart={onStart} onPlans={onPlans} />
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

function RecommendationCard({ plan, reason, onStart, onPlans }: { plan: Plan; reason: string; onStart: () => void; onPlans: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="recommendation-card">
      <div className="section-label">今のあなたにおすすめ ✨</div>
      <p className="recommendation-note"><Info size={14} /> あなたの時間価値・家族構成・過去の選択をもとに提案しています</p>
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
      <div className="recommendation-reason">
        <strong>おすすめ理由</strong>
        <p className={expanded ? "is-expanded" : ""}>{reason}</p>
        <button className="reason-toggle" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? "理由を閉じる" : "理由を詳しく見る"}
        </button>
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

function PlansScreen({ selectedGoal, profile, onBack, onSelect }: { selectedGoal: GoalId; profile: UserProfile; onBack: () => void; onSelect: (plan: Plan) => void }) {
  const selectedGoalLabel = goals.find((goal) => goal.id === selectedGoal)?.label ?? "時短";
  return (
    <section className="screen-content">
      <PageHeader title="提案比較" onBack={onBack} />
      <p className="condition-line"><Clock3 size={17} /> 今日は「{selectedGoalLabel}」を重視しています</p>
      <div className="plan-list">
        {plans.map((plan) => (
          <PlanComparisonCard key={plan.id} plan={plan} profile={profile} onSelect={() => onSelect(plan)} />
        ))}
      </div>
      <p className="demo-note">表示の情報は予測値です。実際の結果と異なる場合があります。</p>
    </section>
  );
}

function PlanComparisonCard({ plan, profile, onSelect }: { plan: Plan; profile: UserProfile; onSelect: () => void }) {
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
      {plan.recommended && (
        <p className="plan-reason"><Info size={14} /> {buildRecommendationReason(profile, plan)}</p>
      )}
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

function ProfileScreen({ profile, onSave, onCancel }: { profile: UserProfile; onSave: (profile: UserProfile) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(() =>
    profile.hourlyValueMode === "auto"
      ? { ...profile, hourlyValue: calculateAutoHourlyValue(profile.annualIncomeBand, profile.workStyle) }
      : profile
  );
  const [showCalculation, setShowCalculation] = useState(false);
  const [showTimeEditor, setShowTimeEditor] = useState(false);

  const autoHourlyValue = calculateAutoHourlyValue(draft.annualIncomeBand, draft.workStyle);

  function setField<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateAutoBasis(updates: Partial<Pick<UserProfile, "annualIncomeBand" | "workStyle">>) {
    setDraft((current) => {
      const next = { ...current, ...updates };
      return {
        ...next,
        hourlyValue: next.hourlyValueMode === "auto" ? calculateAutoHourlyValue(next.annualIncomeBand, next.workStyle) : next.hourlyValue
      };
    });
  }

  function setHourlyValueMode(mode: HourlyValueMode) {
    setDraft((current) => ({
      ...current,
      hourlyValueMode: mode,
      hourlyValue: mode === "auto" ? calculateAutoHourlyValue(current.annualIncomeBand, current.workStyle) : current.hourlyValue
    }));
  }

  function changeManualHourlyValue(delta: number) {
    setDraft((current) => ({
      ...current,
      hourlyValueMode: "manual",
      hourlyValue: Math.max(500, Math.min(20000, current.hourlyValue + delta))
    }));
  }

  function setManualHourlyValue(value: number) {
    const rounded = Math.round(value / 500) * 500;
    setDraft((current) => ({
      ...current,
      hourlyValueMode: "manual",
      hourlyValue: Math.max(500, Math.min(20000, Number.isFinite(rounded) ? rounded : current.hourlyValue))
    }));
  }

  function toggleTransport(mode: TransportMode) {
    setDraft((current) => {
      const exists = current.transportModes.includes(mode);
      const transportModes = exists ? current.transportModes.filter((item) => item !== mode) : [...current.transportModes, mode];
      return { ...current, transportModes };
    });
  }

  function togglePriority(priority: DefaultPriority) {
    setDraft((current) => {
      const exists = current.defaultPriorities.includes(priority);
      const defaultPriorities = exists ? current.defaultPriorities.filter((item) => item !== priority) : [...current.defaultPriorities, priority];
      return { ...current, defaultPriorities };
    });
  }

  return (
    <section className="screen-content profile-screen">
      <PageHeader title="個人設定" onBack={onCancel} />
      <div className="profile-intro">
        <strong>最初に一度設定するだけで、毎日の提案に反映されます</strong>
        <p>あなたに合った行動を提案するための基本情報です。設定内容は後から変更できます。</p>
      </div>

      <SettingsCard icon={<MapPin size={20} />} title="生活エリア" value={`${draft.homeArea} / ${draft.activityArea}`}>
        <label className="profile-field">
          <span>居住エリア</span>
          <input value={draft.homeArea} onChange={(event) => setField("homeArea", event.target.value)} />
        </label>
        <label className="profile-field">
          <span>主な勤務地・活動エリア</span>
          <input value={draft.activityArea} onChange={(event) => setField("activityArea", event.target.value)} />
        </label>
        <p className="field-help">詳細な住所ではなく、市区町村やエリア単位で設定します。</p>
      </SettingsCard>

      <SettingsCard icon={<Coins size={20} />} title="年収帯・働き方" value={`${annualIncomeBandLabels[draft.annualIncomeBand]} / ${workStyleLabels[draft.workStyle]}`}>
        <p className="field-help compact-help">正確な金額ではなく、時間価値の推定にのみ使用します。</p>
        <div className="choice-grid two-column profile-choice-block" role="group" aria-label="年収帯を選択">
          {annualIncomeBands.map((incomeBand) => (
            <ChoiceButton
              key={incomeBand}
              active={draft.annualIncomeBand === incomeBand}
              label={annualIncomeBandLabels[incomeBand]}
              onClick={() => updateAutoBasis({ annualIncomeBand: incomeBand })}
            />
          ))}
        </div>
        <div className="choice-grid three-column profile-choice-block" role="group" aria-label="働き方を選択">
          {workStyles.map((workStyle) => (
            <ChoiceButton
              key={workStyle}
              active={draft.workStyle === workStyle}
              label={workStyleLabels[workStyle]}
              onClick={() => updateAutoBasis({ workStyle })}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard icon={<Clock3 size={20} />} title="あなたの1時間の目安" value={`1時間あたり ${formatYen(draft.hourlyValue)}`}>
        <div className="hourly-value-summary">
          <span>{draft.hourlyValueMode === "auto" ? "自動計算" : "手動設定"}</span>
          <strong>1時間あたり {formatYen(draft.hourlyValue)}</strong>
          <p>年収帯や働き方をもとに自動計算しています</p>
        </div>
        <p className="field-help">移動時間や待ち時間を比較するための目安です。年収帯などから自動計算しますが、あなたの感覚に合わせて変更できます。</p>
        <div className="time-value-actions">
          <button className="text-action-button" onClick={() => setShowCalculation((value) => !value)} aria-expanded={showCalculation}>
            計算の考え方を見る
          </button>
          <button className="text-action-button" onClick={() => setShowTimeEditor((value) => !value)} aria-expanded={showTimeEditor}>
            自分で変更する
          </button>
        </div>
        {showCalculation && (
          <div className="calculation-panel">
            <p>年収帯ごとの目安額に、働き方の忙しさを反映しています。現在の自動計算値は {formatYen(autoHourlyValue)} / 時間です。</p>
          </div>
        )}
        {showTimeEditor && (
          <div className="time-editor-panel">
            <div className="choice-grid two-column" role="group" aria-label="時間価値の設定方法を選択">
              <ChoiceButton active={draft.hourlyValueMode === "auto"} label="自動計算を使用する" onClick={() => setHourlyValueMode("auto")} />
              <ChoiceButton active={draft.hourlyValueMode === "manual"} label="自分で設定する" onClick={() => setHourlyValueMode("manual")} />
            </div>
            {draft.hourlyValueMode === "manual" && (
              <>
                <div className="manual-value-row">
                  <button onClick={() => changeManualHourlyValue(-500)} aria-label="時間価値を500円下げる">-</button>
                  <strong>{formatYen(draft.hourlyValue)}</strong>
                  <button onClick={() => changeManualHourlyValue(500)} aria-label="時間価値を500円上げる">+</button>
                </div>
                <label className="profile-field">
                  <span>金額の直接入力（500円単位）</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    step={500}
                    min={500}
                    max={20000}
                    value={draft.hourlyValue}
                    onChange={(event) => setManualHourlyValue(Number(event.target.value))}
                  />
                </label>
              </>
            )}
          </div>
        )}
      </SettingsCard>

      <SettingsCard icon={<Users size={20} />} title="家族構成" value={draft.children > 0 ? `大人${draft.adults}人・子ども${draft.children}人・${draft.childAgeGroup}` : draft.familyType}>
        <div className="choice-grid two-column" role="group" aria-label="家族構成を選択">
          {familyTypes.map((familyType) => (
            <ChoiceButton
              key={familyType}
              active={draft.familyType === familyType}
              label={familyType}
              onClick={() => setDraft((current) => ({ ...current, familyType, children: familyType === "子どもあり" ? Math.max(current.children, 1) : 0 }))}
            />
          ))}
        </div>
        {draft.familyType === "子どもあり" && (
          <div className="child-settings">
            <div className="number-row">
              <span>大人</span>
              <button onClick={() => setField("adults", Math.max(1, draft.adults - 1))} aria-label="大人を減らす">-</button>
              <strong>{draft.adults}人</strong>
              <button onClick={() => setField("adults", draft.adults + 1)} aria-label="大人を増やす">+</button>
            </div>
            <div className="number-row">
              <span>子ども</span>
              <button onClick={() => setField("children", Math.max(1, draft.children - 1))} aria-label="子どもを減らす">-</button>
              <strong>{draft.children}人</strong>
              <button onClick={() => setField("children", draft.children + 1)} aria-label="子どもを増やす">+</button>
            </div>
            <div className="choice-grid three-column" role="group" aria-label="子どもの年齢層を選択">
              {childAgeGroups.map((ageGroup) => (
                <ChoiceButton key={ageGroup} active={draft.childAgeGroup === ageGroup} label={ageGroup} onClick={() => setField("childAgeGroup", ageGroup)} />
              ))}
            </div>
          </div>
        )}
        <p className="field-help">家族向け、子どもが疲れにくい、移動が少ないなどの評価に使います。</p>
      </SettingsCard>

      <SettingsCard icon={<TrainFront size={20} />} title="主な移動手段" value={draft.transportModes.map((mode) => transportModeLabels[mode]).join("・") || "未設定"}>
        <div className="choice-grid three-column" role="group" aria-label="主な移動手段を選択">
          {transportModes.map((mode) => (
            <ChoiceButton key={mode} active={draft.transportModes.includes(mode)} label={transportModeLabels[mode]} onClick={() => toggleTransport(mode)} />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard icon={<Lightbulb size={20} />} title="普段重視すること" value={draft.defaultPriorities.map((priority) => defaultPriorityLabels[priority]).slice(0, 2).join("・")}>
        <div className="choice-grid two-column" role="group" aria-label="普段重視することを選択">
          {priorityOptions.map((priority) => (
            <ChoiceButton key={priority} active={draft.defaultPriorities.includes(priority)} label={defaultPriorityLabels[priority]} onClick={() => togglePriority(priority)} />
          ))}
        </div>
        <p className="field-help">その日の希望と組み合わせて、提案の優先順位を調整します。</p>
      </SettingsCard>

      <div className="profile-actions">
        <button
          className="primary-button action-wide"
          onClick={() =>
            onSave({
              ...draft,
              hourlyValue: draft.hourlyValueMode === "auto" ? calculateAutoHourlyValue(draft.annualIncomeBand, draft.workStyle) : draft.hourlyValue
            })
          }
        >
          <Save size={18} /> 設定を保存
        </button>
        <button className="secondary-button action-wide" onClick={onCancel}>変更をキャンセル</button>
      </div>
    </section>
  );
}

function SettingsCard({ icon, title, value, children }: { icon: React.ReactNode; title: string; value: string; children: React.ReactNode }) {
  return (
    <article className="settings-card">
      <div className="settings-card-head">
        <span className="settings-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          <p>{value}</p>
        </div>
      </div>
      {children}
    </article>
  );
}

function ChoiceButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className={`choice-button ${active ? "is-active" : ""}`} onClick={onClick} aria-pressed={active}>
      {active && <CheckCircle2 size={14} />}
      {label}
    </button>
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
