import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Building2,
  Check,
  ChevronRight,
  Clock3,
  CloudRain,
  Coins,
  Crown,
  Leaf,
  MapPin,
  Medal,
  Route,
  Sparkles,
  Store,
  Trophy,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  applyTrophyAction,
  getTrophy,
  getTrophyDemoFromUrl,
  getTrophyStats,
  readTrophyState,
  saveTrophyDemoState,
  trophyActionPlans,
  trophyDefinitions,
  updateTrophyDemoInUrl,
  type TrophyActionPlan,
  type TrophyDefinition,
  type TrophyDemo,
  type TrophyIcon,
  type TrophyRank,
  type TrophyState,
} from "../../data/trophyMockData";

type TrophyPhase = "home" | "result";

const rankLabels: Record<TrophyRank, string> = {
  bronze: "ブロンズ",
  silver: "シルバー",
  gold: "ゴールド",
  platinum: "プラチナ",
};

const trophyIcons: Record<TrophyIcon, LucideIcon> = {
  clock: Clock3,
  building: Building2,
  spark: Sparkles,
  store: Store,
  users: UsersRound,
  route: Route,
  rain: CloudRain,
  city: MapPin,
  crown: Crown,
  leaf: Leaf,
};

const collectionGroups = [
  { label: "時間・混雑", ids: ["peak-shifter", "time-alchemist", "crowd-avoider", "eco-step"] },
  { label: "公共・地域", ids: ["public-facility", "public-hunter", "local-supporter"] },
  { label: "家族・発見", ids: ["family-creator", "back-route"] },
  { label: "特別", ids: ["city-balancer", "rain-tokyo", "tokyo-life-master"] },
] as const;

function TrophyMark({ icon, rank, size = 25 }: { icon: TrophyIcon; rank: TrophyRank; size?: number }) {
  const Icon = trophyIcons[icon];
  return <span className={`trophy-mark rank-${rank}`} aria-label={`${rankLabels[rank]} トロフィー`}><Icon size={size} aria-hidden="true" /></span>;
}

function CrowdDots({ level }: { level: TrophyActionPlan["crowd"] }) {
  const count = level === "low" ? 1 : level === "medium" ? 3 : 5;
  return <span className={`trophy-crowd crowd-${level}`} aria-label={`混雑 ${level === "low" ? "少" : level === "medium" ? "中" : "多"}`}>{[0, 1, 2, 3, 4].map((item) => <UsersRound key={item} size={12} aria-hidden="true" className={item < count ? "is-filled" : ""} />)}</span>;
}

interface TrophyActionCardProps {
  plan: TrophyActionPlan;
  onChoose: (plan: TrophyActionPlan) => void;
}

function TrophyActionCard({ plan, onChoose }: TrophyActionCardProps) {
  const Icon = plan.kind === "route" ? Route : plan.kind === "public" ? Building2 : Store;
  return (
    <article className={`trophy-action-card type-${plan.kind}`}>
      <div className="trophy-action-heading">
        <span className="trophy-action-symbol"><Icon size={22} aria-hidden="true" /></span>
        <div><h3>{plan.title}</h3><p>{plan.subtitle}</p></div>
        <Trophy size={19} aria-label={plan.trophyHint} />
      </div>
      <div className="trophy-action-metrics" aria-label={`${plan.title}の指標`}>
        <span><Clock3 size={15} aria-hidden="true" />{plan.duration}</span>
        <span><Coins size={15} aria-hidden="true" />{plan.cost}</span>
        <span><CrowdDots level={plan.crowd} /></span>
        <span><Sparkles size={15} aria-hidden="true" />{plan.satisfaction}</span>
        <span className="trophy-contribution-mini"><MapPin size={15} aria-hidden="true" />{plan.contribution}</span>
      </div>
      <button type="button" onClick={() => onChoose(plan)}><Check size={18} aria-hidden="true" />選ぶ</button>
    </article>
  );
}

interface TrophyResultProps {
  plan: TrophyActionPlan;
  trophyState: TrophyState;
  newlyUnlockedIds: string[];
  onHome: () => void;
  onCollection: () => void;
}

function TrophyResult({ plan, trophyState, newlyUnlockedIds, onHome, onCollection }: TrophyResultProps) {
  const [showCeremony, setShowCeremony] = useState(newlyUnlockedIds.length > 0);
  const latest = newlyUnlockedIds.map(getTrophy).find(Boolean) ?? (trophyState.lastUnlockedId ? getTrophy(trophyState.lastUnlockedId) : null);

  useEffect(() => {
    if (!showCeremony) return;
    const timer = window.setTimeout(() => setShowCeremony(false), 2400);
    return () => window.clearTimeout(timer);
  }, [showCeremony]);

  return (
    <section className="trophy-result" aria-live="polite">
      <div className="trophy-result-route" aria-hidden="true"><MapPin /><span /><Route /><span /><MapPin /></div>
      <div className="trophy-result-choice"><Check size={20} /><strong>{plan.title}</strong></div>
      <div className="trophy-result-metrics">
        <span><Clock3 aria-hidden="true" /><b>+{plan.savedMinutes}分</b></span>
        <span><Coins aria-hidden="true" /><b>+¥{plan.savedYen}</b></span>
        <span><UsersRound aria-hidden="true" /><b>{plan.crowd === "low" ? "−" : "±"}</b></span>
        <span><MapPin aria-hidden="true" /><b>+{plan.contribution}</b></span>
      </div>
      {latest ? (
        <article className="trophy-unlock-card">
          <span className="trophy-unlock-light" aria-hidden="true" />
          <TrophyMark icon={latest.icon} rank={latest.rank} size={34} />
          <div><span>トロフィー解除</span><h2>{latest.name}</h2><p>{latest.description}</p></div>
          {newlyUnlockedIds.length > 1 && <small>+{newlyUnlockedIds.length - 1}</small>}
        </article>
      ) : (
        <article className="trophy-progress-card"><Trophy size={25} aria-hidden="true" /><span>進捗更新</span></article>
      )}
      {showCeremony && latest && <div className="trophy-ceremony" aria-hidden="true"><TrophyMark icon={latest.icon} rank={latest.rank} size={52} /></div>}
      <div className="trophy-result-actions">
        <button type="button" className="trophy-primary-action" onClick={onCollection}><Trophy size={19} aria-hidden="true" />コレクション</button>
        <button type="button" className="trophy-secondary-action" onClick={onHome}>ホーム</button>
      </div>
    </section>
  );
}

function TrophyDemoPicker({ demo }: { demo?: TrophyDemo }) {
  return (
    <label className="trophy-demo-picker">
      <span>DEMO</span>
      <select value={demo ?? "almost"} aria-label="デモ状態" onChange={(event) => updateTrophyDemoInUrl(event.target.value as TrophyDemo)}>
        <option value="locked">未解除</option>
        <option value="almost">解除直前</option>
        <option value="unlocked">解除直後</option>
        <option value="platinum">プラチナ</option>
      </select>
    </label>
  );
}

interface TrophyVersionProps {
  onCollection: () => void;
}

export function TrophyVersion({ onCollection }: TrophyVersionProps) {
  const [demo] = useState(() => getTrophyDemoFromUrl());
  const [trophyState, setTrophyState] = useState(() => readTrophyState(demo));
  const [phase, setPhase] = useState<TrophyPhase>("home");
  const [selectedPlan, setSelectedPlan] = useState<TrophyActionPlan | null>(null);
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);
  const activeTrophy = getTrophy("peak-shifter");
  const progress = activeTrophy ? trophyState.progress[activeTrophy.id] : undefined;

  function choosePlan(plan: TrophyActionPlan) {
    const outcome = applyTrophyAction(trophyState, plan);
    setTrophyState(outcome.state);
    setSelectedPlan(plan);
    setNewlyUnlockedIds(outcome.unlockedIds);
    saveTrophyDemoState(outcome.state, demo);
    setPhase("result");
  }

  if (phase === "result" && selectedPlan) {
    return <TrophyResult plan={selectedPlan} trophyState={trophyState} newlyUnlockedIds={newlyUnlockedIds} onHome={() => setPhase("home")} onCollection={onCollection} />;
  }

  return (
    <section className="trophy-home">
      <div className="trophy-home-topline"><MapPin size={16} aria-hidden="true" /><b>新宿</b><span>家族</span><TrophyDemoPicker demo={demo} /></div>
      <article className="trophy-ai-message"><Sparkles size={18} aria-hidden="true" /><p>今日は混雑を避けると、実績を解除できそうです</p></article>
      {activeTrophy && progress && (
        <article className="trophy-active-goal">
          <TrophyMark icon={activeTrophy.icon} rank={activeTrophy.rank} />
          <div><span>挑戦中</span><strong>{activeTrophy.name}</strong><small>{progress.progress} / {activeTrophy.target}</small></div>
          <i style={{ "--progress": `${Math.round((progress.progress / activeTrophy.target) * 100)}%` } as CSSProperties} aria-label={`進捗 ${progress.progress} / ${activeTrophy.target}`} />
        </article>
      )}
      <div className="trophy-action-list">
        {trophyActionPlans.map((plan) => <TrophyActionCard key={plan.id} plan={plan} onChoose={choosePlan} />)}
      </div>
    </section>
  );
}

interface TrophyDetailSheetProps {
  trophy: TrophyDefinition;
  progress: { progress: number; unlockedAt?: string };
  lastAction: string | null;
  onClose: () => void;
}

function TrophyDetailSheet({ trophy, progress, lastAction, onClose }: TrophyDetailSheetProps) {
  const isLocked = !progress.unlockedAt;
  const title = isLocked && trophy.isHidden ? "？？？" : trophy.name;
  const description = isLocked && trophy.isHidden ? trophy.hint : trophy.description;
  const relatedTrophy = trophyDefinitions.find((item) => item.category === trophy.category && item.id !== trophy.id);
  return (
    <div className="battle-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="battle-detail-sheet trophy-detail-sheet" role="dialog" aria-modal="true" aria-label={`${title}の詳細`} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="battle-sheet-close" aria-label="閉じる" onClick={onClose}><X size={22} /></button>
        <TrophyMark icon={trophy.icon} rank={trophy.rank} size={38} />
        <span className="trophy-rank-label">{rankLabels[trophy.rank]}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="trophy-detail-progress"><span>{progress.progress} / {trophy.target}</span><i><em style={{ width: `${Math.min(100, (progress.progress / trophy.target) * 100)}%` }} /></i></div>
        {progress.unlockedAt ? <small>{progress.unlockedAt} 解除</small> : <small>{trophy.isHidden ? trophy.hint : "あと少し"}</small>}
        {progress.unlockedAt && lastAction && <div className="trophy-detail-history"><Clock3 size={15} aria-hidden="true" />{lastAction}</div>}
        {relatedTrophy && <div className="trophy-detail-next"><ChevronRight size={15} aria-hidden="true" />{relatedTrophy.name}</div>}
      </section>
    </div>
  );
}

export function TrophyCollection() {
  const [demo] = useState(() => getTrophyDemoFromUrl());
  const [trophyState, setTrophyState] = useState(() => readTrophyState(demo));
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyDefinition | null>(null);
  const stats = useMemo(() => getTrophyStats(trophyState), [trophyState]);
  const selectedProgress = selectedTrophy ? trophyState.progress[selectedTrophy.id] : undefined;

  function openTrophy(trophy: TrophyDefinition) {
    setSelectedTrophy(trophy);
    if (trophyState.viewedTrophyIds.includes(trophy.id)) return;
    const next = { ...trophyState, viewedTrophyIds: [...trophyState.viewedTrophyIds, trophy.id] };
    setTrophyState(next);
    saveTrophyDemoState(next, demo);
  }

  return (
    <section className="trophy-collection">
      <div className="trophy-collection-summary">
        <span><Trophy size={20} aria-hidden="true" /><b>{stats.unlocked} / {stats.total}</b></span>
        <span><Medal size={20} aria-hidden="true" /><b>{stats.percent}%</b></span>
        <span className={`trophy-rank-summary rank-${stats.rank}`}><Crown size={20} aria-hidden="true" /><b>{rankLabels[stats.rank]}</b></span>
      </div>
      <article className="trophy-style-card">
        <div><Clock3 aria-hidden="true" /><i><em style={{ width: "83%" }} /></i></div>
        <div><UsersRound aria-hidden="true" /><i><em style={{ width: "76%" }} /></i></div>
        <div><Coins aria-hidden="true" /><i><em style={{ width: "48%" }} /></i></div>
        <div><MapPin aria-hidden="true" /><i><em style={{ width: "79%" }} /></i></div>
        <p>混雑を避けて、家族と動きやすい選択をしています</p>
      </article>
      <div className="trophy-collection-heading"><span>コレクション</span><TrophyDemoPicker demo={demo} /></div>
      <div className="trophy-group-list">
        {collectionGroups.map((group) => <section key={group.label}><h2>{group.label}</h2><div className="trophy-grid">{group.ids.map((id) => {
          const trophy = getTrophy(id);
          if (!trophy) return null;
          const progress = trophyState.progress[trophy.id];
          const locked = !progress.unlockedAt;
          const hidden = locked && trophy.isHidden;
          return (
            <button type="button" className={`trophy-grid-item rank-${trophy.rank} ${locked ? "is-locked" : ""}`} key={trophy.id} onClick={() => openTrophy(trophy)} aria-label={`${hidden ? "隠しトロフィー" : trophy.name} ${locked ? "未解除" : "解除済み"}`}>
              <TrophyMark icon={trophy.icon} rank={trophy.rank} />
              <strong>{hidden ? "？？？" : trophy.name}</strong>
              <span>{rankLabels[trophy.rank]}</span>
              {!locked && <Check size={14} aria-hidden="true" />}
              {locked && !hidden && <i>{progress.progress} / {trophy.target}</i>}
            </button>
          );
        })}</div></section>)}
      </div>
      {selectedTrophy && selectedProgress && <TrophyDetailSheet trophy={selectedTrophy} progress={selectedProgress} lastAction={trophyState.lastAction} onClose={() => setSelectedTrophy(null)} />}
    </section>
  );
}
