import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bike,
  Bus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coins,
  Compass,
  Footprints,
  Heart,
  House,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  TrainFront,
  TreePine,
  Umbrella,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { type VisualGoalId, type VisualMoodId, type VisualPlan, visualPlans } from "../../data/visualMockData";

type VisualPhase = "home" | "loading" | "plans" | "result";
type TravelMode = "destination" | "explore";

const goals: Array<{ id: VisualGoalId; label: string; Icon: LucideIcon; tone: string }> = [
  { id: "fast", label: "速さ", Icon: Clock3, tone: "blue" },
  { id: "save", label: "安さ", Icon: Coins, tone: "yellow" },
  { id: "easy", label: "楽さ", Icon: Sparkles, tone: "green" },
  { id: "family", label: "家族", Icon: Users, tone: "purple" },
  { id: "quiet", label: "空き", Icon: TreePine, tone: "green" },
  { id: "city", label: "貢献", Icon: MapPin, tone: "blue" },
];

const moods: Array<{ id: VisualMoodId; label: string; Icon: LucideIcon }> = [
  { id: "energetic", label: "元気", Icon: Zap },
  { id: "normal", label: "普通", Icon: Heart },
  { id: "tired", label: "疲れ", Icon: Sparkles },
  { id: "rush", label: "急ぎ", Icon: Clock3 },
  { id: "kids", label: "子連れ", Icon: Users },
  { id: "rain", label: "雨", Icon: Umbrella },
];

function CrowdIndicator({ level }: { level: VisualPlan["crowd"] }) {
  return (
    <span className={`visual-crowd level-${level}`} aria-label={`混雑度 ${level === 1 ? "低" : level === 3 ? "中" : "高"}`}>
      {[0, 1, 2, 3, 4].map((person) => <Users key={person} size={13} aria-hidden="true" />)}
    </span>
  );
}

function SatisfactionFace({ level }: { level: VisualPlan["satisfaction"] }) {
  return (
    <span className={`visual-face level-${level}`} aria-label={`満足度 ${level} / 5`}>
      {level >= 4 ? "☺" : level === 3 ? "●" : "◔"}
    </span>
  );
}

function ContributionRing({ value, compact = false }: { value: number; compact?: boolean }) {
  return (
    <span className={`visual-contribution-ring ${compact ? "is-compact" : ""}`} style={{ "--ring-progress": `${value * 3.6}deg` } as CSSProperties} aria-label={`都市貢献度 ${value}`}>
      <MapPin size={compact ? 14 : 18} aria-hidden="true" />
    </span>
  );
}

function RouteLine({ plan }: { plan: VisualPlan }) {
  const routeIcons = { walk: Footprints, train: TrainFront, bus: Bus };
  return (
    <div className="visual-route-line" aria-label={`${plan.destination}までの経路`}>
      <House size={18} aria-hidden="true" />
      {plan.route.map((segment, index) => {
        const Icon = routeIcons[segment.mode];
        return (
          <span className="visual-route-segment" key={`${segment.mode}-${index}`}>
            <ArrowRight size={13} aria-hidden="true" />
            <Icon size={17} aria-hidden="true" />
            <b>{segment.value}</b>
          </span>
        );
      })}
      <ArrowRight size={13} aria-hidden="true" />
      <MapPin size={18} aria-hidden="true" />
    </div>
  );
}

function VisualPlanCard({ plan, active, onDetails, onChoose }: { plan: VisualPlan; active: boolean; onDetails: () => void; onChoose: () => void }) {
  const PlanIcon = plan.id === "quick" ? Navigation : plan.id === "comfort" ? Sparkles : TreePine;
  return (
    <article className={`visual-plan-card accent-${plan.accent} ${active ? "is-active" : ""}`} aria-label={`${plan.label} ${plan.destination}`}>
      <header className="visual-plan-heading">
        <span className="visual-plan-symbol"><PlanIcon size={25} aria-hidden="true" /></span>
        <div>
          <strong>{plan.label}</strong>
          <span>{plan.destination}</span>
        </div>
        <ContributionRing value={plan.contribution} compact />
      </header>
      <div className="visual-mini-map" aria-hidden="true">
        <span className="visual-map-dot start" /><span className="visual-map-path" /><span className="visual-map-dot end" />
        <TrainFront size={18} />
      </div>
      <div className="visual-main-metrics">
        <MetricIcon Icon={Clock3} value={plan.time} />
        <MetricIcon Icon={Coins} value={plan.cost} />
      </div>
      <div className="visual-indicator-row">
        <span><CrowdIndicator level={plan.crowd} /></span>
        <span><Footprints size={17} aria-hidden="true" />{plan.walk}</span>
        <SatisfactionFace level={plan.satisfaction} />
      </div>
      <div className="visual-status-bars" aria-label="プラン指標">
        <StatusBar Icon={Clock3} value={plan.id === "quick" ? 5 : plan.id === "comfort" ? 3 : 2} />
        <StatusBar Icon={Coins} value={plan.id === "city" ? 5 : plan.id === "comfort" ? 3 : 2} />
        <StatusBar Icon={Users} value={plan.crowd === 1 ? 5 : 2} />
      </div>
      <div className="visual-card-actions">
        <button type="button" className="visual-icon-action" aria-label={`${plan.label}の詳細`} onClick={onDetails}><Search size={18} /></button>
        <button type="button" className="visual-choose-button" onClick={onChoose}><Check size={18} aria-hidden="true" />これにする</button>
      </div>
    </article>
  );
}

function MetricIcon({ Icon, value }: { Icon: LucideIcon; value: string }) {
  return <span><Icon size={20} aria-hidden="true" /><b>{value}</b></span>;
}

function StatusBar({ Icon, value }: { Icon: LucideIcon; value: number }) {
  return <span className="visual-status"><Icon size={14} aria-hidden="true" /><i><em style={{ width: `${value * 20}%` }} /></i></span>;
}

function VisualDetailSheet({ plan, onClose }: { plan: VisualPlan; onClose: () => void }) {
  return (
    <div className="battle-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="battle-detail-sheet visual-detail-sheet" role="dialog" aria-modal="true" aria-label={`${plan.label}の詳細`} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="battle-sheet-close" aria-label="閉じる" onClick={onClose}><X size={22} /></button>
        <div className="visual-sheet-title"><span>{plan.label}</span><strong>{plan.destination}</strong></div>
        <RouteLine plan={plan} />
        <div className="visual-detail-grid">
          <MetricIcon Icon={Clock3} value={plan.time} />
          <MetricIcon Icon={Coins} value={plan.cost} />
          <MetricIcon Icon={Footprints} value={plan.walk} />
          <span><CrowdIndicator level={plan.crowd} /></span>
          <span><SatisfactionFace level={plan.satisfaction} /></span>
          <ContributionRing value={plan.contribution} />
        </div>
        <div className="visual-weather"><Umbrella size={18} aria-hidden="true" /><span>24°</span><span>☁</span></div>
      </section>
    </div>
  );
}

function VisualLoading() {
  return (
    <section className="visual-loading" aria-live="polite">
      <div className="visual-loading-map" aria-hidden="true"><span /><span /><span /></div>
      <div className="visual-loader-ring"><Sparkles size={28} /></div>
      <strong>最適化中</strong>
      <div className="visual-loading-icons" aria-hidden="true"><Clock3 /><Coins /><Users /><Heart /></div>
    </section>
  );
}

function VisualResult({ plan, badgesOpen, onRestart, onBadges, onCloseBadges }: { plan: VisualPlan; badgesOpen: boolean; onRestart: () => void; onBadges: () => void; onCloseBadges: () => void }) {
  return (
    <section className="visual-result" aria-live="polite">
      <div className="visual-result-city" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className={`visual-result-badge accent-${plan.accent}`}><Check size={34} /></div>
      <div className="visual-result-place"><MapPin size={18} /><strong>{plan.destination}</strong></div>
      <div className="visual-result-metrics">
        <MetricIcon Icon={Clock3} value={plan.result.time} />
        <MetricIcon Icon={Coins} value={plan.result.money} />
        <span><Users size={20} aria-hidden="true" /><b>{plan.result.crowd}</b></span>
        <span><MapPin size={20} aria-hidden="true" /><b>{plan.result.points}</b></span>
      </div>
      <button type="button" className="visual-earned-badge" onClick={onBadges}><span>✦</span>{plan.result.badge}</button>
      <button type="button" className="visual-choose-button visual-result-button" onClick={onRestart}><Compass size={18} aria-hidden="true" />もう一度</button>
      {badgesOpen && <VisualBadgeSheet onClose={onCloseBadges} />}
    </section>
  );
}

export function VisualVersion() {
  const [phase, setPhase] = useState<VisualPhase>("home");
  const [mode, setMode] = useState<TravelMode>("destination");
  const [goal, setGoal] = useState<VisualGoalId>("fast");
  const [mood, setMood] = useState<VisualMoodId>("normal");
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailPlan, setDetailPlan] = useState<VisualPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<VisualPlan | null>(null);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => setPhase("plans"), 1300);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const activePlan = visualPlans[activeIndex];
  const visiblePlans = useMemo(() => ({ previous: visualPlans[(activeIndex + visualPlans.length - 1) % visualPlans.length], next: visualPlans[(activeIndex + 1) % visualPlans.length] }), [activeIndex]);
  const MoodIcon = moods.find((item) => item.id === mood)?.Icon ?? Heart;
  const shiftPlan = (direction: -1 | 1) => setActiveIndex((index) => (index + direction + visualPlans.length) % visualPlans.length);

  function choose(plan: VisualPlan) {
    setSelectedPlan(plan);
    setDetailPlan(null);
    setPhase("result");
  }

  if (phase === "loading") return <VisualLoading />;
  if (phase === "result" && selectedPlan) return <VisualResult plan={selectedPlan} badgesOpen={badgesOpen} onRestart={() => setPhase("home")} onBadges={() => setBadgesOpen(true)} onCloseBadges={() => setBadgesOpen(false)} />;

  if (phase === "plans") {
    return (
      <section className="visual-plans-screen">
        <div className="visual-plan-topline"><span><Sparkles size={15} />{goals.find((item) => item.id === goal)?.label}</span><span><MoodIcon size={15} /></span></div>
        <div
          className="visual-carousel"
          aria-label="候補比較"
          onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            const endX = event.changedTouches[0]?.clientX;
            if (touchStartX === null || endX === undefined) return;
            const distance = endX - touchStartX;
            if (Math.abs(distance) > 42) shiftPlan(distance > 0 ? -1 : 1);
            setTouchStartX(null);
          }}
        >
          <button type="button" className="visual-carousel-peek left" aria-label="前の候補" onClick={() => shiftPlan(-1)}><ChevronLeft /><span>{visiblePlans.previous.label}</span></button>
          <VisualPlanCard plan={activePlan} active onDetails={() => setDetailPlan(activePlan)} onChoose={() => choose(activePlan)} />
          <button type="button" className="visual-carousel-peek right" aria-label="次の候補" onClick={() => shiftPlan(1)}><span>{visiblePlans.next.label}</span><ChevronRight /></button>
        </div>
        <div className="visual-carousel-dots" aria-label={`${activeIndex + 1} / ${visualPlans.length}`}>{visualPlans.map((plan, index) => <button key={plan.id} type="button" className={index === activeIndex ? "is-active" : ""} aria-label={`${plan.label}を表示`} onClick={() => setActiveIndex(index)} />)}</div>
        {detailPlan && <VisualDetailSheet plan={detailPlan} onClose={() => setDetailPlan(null)} />}
        {badgesOpen && <VisualBadgeSheet onClose={() => setBadgesOpen(false)} />}
      </section>
    );
  }

  return (
    <section className="visual-home">
      <div className="visual-mode-tabs" role="tablist" aria-label="検索モード">
        <button type="button" role="tab" aria-selected={mode === "destination"} className={mode === "destination" ? "is-active" : ""} onClick={() => setMode("destination")}><Navigation size={22} /><span>行き先</span></button>
        <button type="button" role="tab" aria-selected={mode === "explore"} className={mode === "explore" ? "is-active" : ""} onClick={() => setMode("explore")}><Compass size={22} /><span>おまかせ</span></button>
      </div>
      {mode === "destination" && <div className="visual-destination"><Search size={21} aria-hidden="true" /><strong>東京駅</strong><MapPin size={21} aria-hidden="true" /></div>}
      <div className="visual-goal-grid" aria-label="目的">
        {goals.map(({ id, label, Icon, tone }) => <button key={id} type="button" className={`visual-goal tone-${tone} ${goal === id ? "is-selected" : ""}`} aria-pressed={goal === id} onClick={() => setGoal(id)}><Icon size={27} aria-hidden="true" /><span>{label}</span>{goal === id && <Check size={14} className="visual-check" aria-hidden="true" />}</button>)}
      </div>
      <div className="visual-mood-row" aria-label="状態">
        {moods.map(({ id, label, Icon }) => <button key={id} type="button" className={mood === id ? "is-selected" : ""} aria-label={label} aria-pressed={mood === id} onClick={() => setMood(id)}><Icon size={19} aria-hidden="true" /><span>{label}</span></button>)}
      </div>
      <button type="button" className="visual-start-button" onClick={() => setPhase("loading")}><Sparkles size={20} aria-hidden="true" />探す<ArrowRight size={20} aria-hidden="true" /></button>
      {badgesOpen && <VisualBadgeSheet onClose={() => setBadgesOpen(false)} />}
    </section>
  );
}

function VisualBadgeSheet({ onClose }: { onClose: () => void }) {
  const badges = ["空き", "公共", "移動", "家族", "発見"];
  return (
    <div className="battle-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="battle-detail-sheet visual-badge-sheet" role="dialog" aria-modal="true" aria-label="バッジ" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="battle-sheet-close" aria-label="閉じる" onClick={onClose}><X size={22} /></button>
        <div className="visual-badge-grid">{badges.map((badge, index) => <span className={index > 1 ? "is-locked" : ""} key={badge}><i>{index > 1 ? "○" : "✦"}</i><b>{badge}</b></span>)}</div>
      </section>
    </div>
  );
}

export function VisualHistory() {
  return (
    <section className="visual-history" aria-label="My ROI">
      <div className="visual-history-rings">
        <ContributionRing value={72} /><ContributionRing value={58} /><ContributionRing value={84} />
      </div>
      <div className="visual-history-metrics">
        <MetricIcon Icon={Clock3} value="94分" />
        <MetricIcon Icon={Coins} value="¥3,800" />
        <span><Heart size={20} aria-hidden="true" /><b>4.2</b></span>
        <span><MapPin size={20} aria-hidden="true" /><b>320</b></span>
      </div>
      <div className="visual-heatmap" aria-label="今週の記録">{[1, 2, 3, 4, 5, 6, 7].map((day) => <span className={`level-${day % 4}`} key={day} />)}</div>
      <div className="visual-history-list">
        <VisualHistoryRow date="7/13" place="清澄白河" time="+12分" points="+18" />
        <VisualHistoryRow date="7/12" place="中央区" time="+10分" points="+30" />
        <VisualHistoryRow date="7/10" place="東京駅" time="+18分" points="+8" />
      </div>
    </section>
  );
}

function VisualHistoryRow({ date, place, time, points }: { date: string; place: string; time: string; points: string }) {
  return <div className="visual-history-row"><b>{date}</b><MapPin size={18} aria-hidden="true" /><span>{place}</span><Clock3 size={17} aria-hidden="true" /><strong>{time}</strong><i>{points}</i></div>;
}
