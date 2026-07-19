import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Filter,
  Flag,
  Footprints,
  Grid2X2,
  Layers3,
  LocateFixed,
  LockKeyhole,
  Map as MapIcon,
  MapPin,
  Navigation,
  Settings,
  Sparkles,
  Trophy,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { VersionSwitcher } from "../common/VersionSwitcher";
import {
  demoLocation,
  questDefinitions,
  questMapSpots,
  type QuestDefinition,
  type QuestMapProgress,
  type QuestSpot,
  type QuestSpotCategory,
} from "../../data/questMapData";
import {
  calculatePredictedRoi,
  completeQuest,
  getLockedQuests,
  getQuestCandidates,
  getQuestLevel,
  getSpotById,
  readQuestMapProgress,
  resetQuestMapProgress,
  saveQuestMapProgress,
  type QuestPreference,
} from "../../lib/questMapScoring";
import type { VersionKey } from "../../config/versions";
import { QuestMapAtlas } from "./QuestMapAtlas";
import { QuestMapCanvas } from "./QuestMapCanvas";
import { QuestMapDetailSheet } from "./QuestMapDetailSheet";
import { QuestMapMyPage } from "./QuestMapMyPage";
import { QuestMapQuestCard } from "./QuestMapQuestCard";
import { QuestMapSettings } from "./QuestMapSettings";

type QuestMapTab = "map" | "quests" | "atlas" | "roi" | "settings";
type QuestMapPhase = "browse" | "active" | "complete";
type LocationStatus = "demo" | "requesting" | "located" | "denied";
type MapLocation = { latitude: number; longitude: number; label: string };

type QuestMapVersionProps = {
  currentVersion: VersionKey;
  onVersionChange: (version: VersionKey) => void;
};

const activeQuestStorageKey = "tokyo-life-roi-quest-map-active";

const purposeChoices: { id: QuestPreference; label: string; Icon: LucideIcon }[] = [
  { id: "nearby", label: "近場", Icon: Clock3 },
  { id: "family-learning", label: "家族で学ぶ", Icon: UsersRound },
  { id: "refresh", label: "リフレッシュ", Icon: Sparkles },
  { id: "saving", label: "節約", Icon: WalletCards },
  { id: "health", label: "運動", Icon: Footprints },
  { id: "discovery", label: "発見", Icon: Compass },
];

const navItems: { id: QuestMapTab; label: string; Icon: LucideIcon }[] = [
  { id: "map", label: "マップ", Icon: MapIcon },
  { id: "quests", label: "クエスト", Icon: Flag },
  { id: "atlas", label: "図鑑", Icon: Grid2X2 },
  { id: "roi", label: "My ROI", Icon: Sparkles },
  { id: "settings", label: "設定", Icon: Settings },
];

const categoryFilters: { id: "all" | QuestSpotCategory; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "learning", label: "学び" },
  { id: "family", label: "家族" },
  { id: "nature", label: "自然" },
  { id: "culture", label: "文化" },
  { id: "public", label: "公共" },
];

function readActiveQuest() {
  try {
    const id = window.localStorage.getItem(activeQuestStorageKey);
    return questDefinitions.find((quest) => quest.id === id) ?? null;
  } catch {
    return null;
  }
}

function createSpotQuest(spot: QuestSpot): QuestDefinition {
  return {
    id: `discover-${spot.id}`,
    title: `${spot.name}を新しく発見`,
    spotId: spot.id,
    difficulty: "beginner",
    summary: spot.description,
    condition: "スポットを訪問",
    roiGain: 2,
    minimumRoi: 0,
    distanceKm: 4.8,
    travelMinutes: 26,
    values: [
      { key: "satisfaction", label: "満足", points: 12 },
      { key: "discovery", label: "発見", points: 14 },
      { key: "urbanContribution", label: "都市", points: spot.scores.urbanContribution > 85 ? 10 : 5 },
    ],
  };
}

export function QuestMapVersion({ currentVersion, onVersionChange }: QuestMapVersionProps) {
  const [tab, setTab] = useState<QuestMapTab>("map");
  const [phase, setPhase] = useState<QuestMapPhase>(() => readActiveQuest() ? "active" : "browse");
  const [progress, setProgress] = useState<QuestMapProgress>(() => readQuestMapProgress());
  const [preference, setPreference] = useState<QuestPreference>("family-learning");
  const [location, setLocation] = useState<MapLocation>(demoLocation);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("demo");
  const [focusKey, setFocusKey] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<"all" | QuestSpotCategory>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<QuestDefinition | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<QuestSpot | null>(null);
  const [activeQuest, setActiveQuest] = useState<QuestDefinition | null>(() => readActiveQuest());
  const [completedQuest, setCompletedQuest] = useState<QuestDefinition | null>(null);
  const [toast, setToast] = useState("");
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const questCandidates = useMemo(() => getQuestCandidates(preference, progress), [preference, progress]);
  const lockedQuests = useMemo(() => getLockedQuests(progress), [progress]);
  const questSpotIds = useMemo(() => questCandidates.map((quest) => quest.spotId), [questCandidates]);
  const lockedSpotIds = useMemo(() => lockedQuests.map((quest) => quest.spotId), [lockedQuests]);
  const mainMapSpots = useMemo(() => {
    const candidateIds = new Set([...questSpotIds, ...lockedSpotIds.slice(0, 3)]);
    const supportingSpots = questMapSpots.filter((spot) => progress.visitedSpotIds.includes(spot.id) || spot.officialRecommended).slice(0, 12);
    const combined = [...questMapSpots.filter((spot) => candidateIds.has(spot.id)), ...supportingSpots];
    const unique = Array.from(new Map(combined.map((spot) => [spot.id, spot])).values());
    return categoryFilter === "all" ? unique : unique.filter((spot) => spot.category === categoryFilter);
  }, [categoryFilter, lockedSpotIds, progress.visitedSpotIds, questSpotIds]);
  const level = getQuestLevel(progress.myRoi);
  const nextUnlockGap = Math.max(0, level.nextRoi - progress.myRoi);

  useEffect(() => saveQuestMapProgress(progress), [progress]);
  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      setToast("位置情報を利用できないため、デモ位置を使います");
      return;
    }
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, label: "現在地" });
        setLocationStatus("located");
        setFocusKey((value) => value + 1);
      },
      () => {
        setLocation(demoLocation);
        setLocationStatus("denied");
        setFocusKey((value) => value + 1);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function openQuest(quest: QuestDefinition) {
    setSelectedQuest(quest);
    setSelectedSpot(getSpotById(quest.spotId));
  }

  function openSpot(spot: QuestSpot) {
    const quest = questDefinitions.find((item) => item.spotId === spot.id && item.minimumRoi <= progress.myRoi) ?? createSpotQuest(spot);
    setSelectedSpot(spot);
    setSelectedQuest(quest);
  }

  function startQuest(quest: QuestDefinition) {
    setSelectedQuest(null);
    setSelectedSpot(null);
    setActiveQuest(quest);
    setPhase("active");
    setTab("map");
    setSheetExpanded(false);
    window.localStorage.setItem(activeQuestStorageKey, quest.id);
  }

  function checkIn() {
    if (!activeQuest) return;
    const nextProgress = completeQuest(progress, activeQuest);
    setProgress(nextProgress);
    setCompletedQuest(activeQuest);
    setActiveQuest(null);
    setPhase("complete");
    window.localStorage.removeItem(activeQuestStorageKey);
  }

  function cancelQuest() {
    setActiveQuest(null);
    setPhase("browse");
    window.localStorage.removeItem(activeQuestStorageKey);
  }

  function resetDemo() {
    const initial = resetQuestMapProgress();
    setProgress(initial);
    setActiveQuest(null);
    setCompletedQuest(null);
    setPhase("browse");
    setTab("map");
    window.localStorage.removeItem(activeQuestStorageKey);
    setToast("V11のデモ状態を初期化しました");
  }

  function renderMap() {
    const activeSpot = activeQuest ? getSpotById(activeQuest.spotId) : undefined;
    return <div className="quest-map-main-stage">
      <QuestMapCanvas location={location} focusKey={focusKey} spots={mainMapSpots} questSpotIds={questSpotIds} lockedSpotIds={lockedSpotIds} visitedSpotIds={progress.visitedSpotIds} selectedSpotId={selectedSpot?.id} activeSpotId={activeSpot?.id} onSpotSelect={openSpot} />
      <div className="quest-map-status-stack">
        <button className="quest-map-location-status" onClick={requestLocation}><LocateFixed size={15} />{locationStatus === "requesting" ? "取得中…" : locationStatus === "located" ? "現在地を取得" : locationStatus === "denied" ? "デモ位置・許可なし" : "東京駅・デモ位置"}</button>
        <button className="quest-map-filter-button" onClick={() => setFilterOpen(true)} aria-label="地図フィルター"><Filter size={19} /></button>
      </div>
      <button className="quest-map-recenter" onClick={() => setFocusKey((value) => value + 1)} aria-label="現在地を地図の中心に表示"><Navigation size={19} /></button>
      {phase === "active" && activeQuest && activeSpot ? <section className="quest-map-active-sheet">
        <div className="quest-map-sheet-handle" />
        <span className="quest-map-live-label"><i />クエスト進行中</span>
        <h2>{activeQuest.title}</h2><p><MapPin size={14} />{activeSpot.name}</p>
        <div className="quest-map-active-facts"><span><Navigation size={15} />{activeQuest.distanceKm}km</span><span><Clock3 size={15} />約{activeQuest.travelMinutes}分</span><span><Footprints size={15} />電車＋徒歩</span></div>
        <div className="quest-map-active-condition"><Flag size={16} /><span>{activeQuest.condition}</span><strong>+{activeQuest.roiGain} ROI</strong></div>
        <button className="quest-map-checkin-button" onClick={checkIn}><CheckCircle2 size={20} />デモ：現地に到着・チェックイン</button>
        <button className="quest-map-cancel-button" onClick={cancelQuest}>クエストを中止</button>
      </section> : <section className={`quest-map-quest-sheet ${sheetExpanded ? "is-expanded" : ""}`}>
        <button className="quest-map-sheet-handle-button" onClick={() => setSheetExpanded((value) => !value)} aria-label={sheetExpanded ? "クエスト一覧を縮小" : "クエスト一覧を拡大"}><span /></button>
        <div className="quest-map-sheet-title"><div><span>今日のクエスト</span><strong>{questCandidates.length}件</strong></div><button onClick={() => setTab("quests")}>すべて見る<ChevronRight size={14} /></button></div>
        <div className="quest-map-card-scroller">{questCandidates.map((quest) => {
          const spot = getSpotById(quest.spotId);
          return <QuestMapQuestCard key={quest.id} quest={quest} spot={spot} predictedRoi={calculatePredictedRoi(spot, preference)} onOpen={() => openQuest(quest)} onStart={() => startQuest(quest)} />;
        })}</div>
      </section>}
    </div>;
  }

  function renderQuestList() {
    const available = questDefinitions.filter((quest) => quest.minimumRoi <= progress.myRoi && !progress.completedQuestIds.includes(quest.id));
    return <section className="quest-map-page quest-map-list-page"><header className="quest-map-page-heading"><span>QUESTS</span><h1>クエスト</h1><p>今の自分に合う挑戦から選べます</p></header><div className="quest-map-list-section"><h2><Sparkles size={17} />挑戦できるクエスト</h2>{available.map((quest) => { const spot = getSpotById(quest.spotId); return <QuestMapQuestCard key={quest.id} quest={quest} spot={spot} predictedRoi={calculatePredictedRoi(spot, preference)} onOpen={() => openQuest(quest)} onStart={() => startQuest(quest)} />; })}</div><div className="quest-map-list-section is-locked"><h2><LockKeyhole size={17} />これから見える東京</h2>{lockedQuests.slice(0, 3).map((quest) => <QuestMapQuestCard key={quest.id} quest={quest} spot={getSpotById(quest.spotId)} predictedRoi={0} locked onOpen={() => undefined} onStart={() => undefined} />)}</div></section>;
  }

  if (phase === "complete" && completedQuest) {
    const completedSpot = getSpotById(completedQuest.spotId);
    const unlockedComposite = progress.myRoi >= 60 && completedQuest.id === "water-family-learning";
    return <div className="quest-map-app quest-map-completion-view">
      <header className="quest-map-app-header"><div><strong>Tokyo Life ROI</strong><span>11. ROI Quest Map版</span></div><VersionSwitcher current={currentVersion} onChange={onVersionChange} /></header>
      <main className="quest-map-completion-content">
        <span className="quest-map-completion-mark"><Check size={34} /></span><p>QUEST COMPLETE</p><h1>{completedQuest.title}</h1><h2>{completedSpot.name}</h2>
        <article className="quest-map-roi-gain"><span>My ROI</span><div><strong>{progress.myRoi - completedQuest.roiGain}</strong><ChevronRight size={20} /><strong>{progress.myRoi}</strong></div><em>+{completedQuest.roiGain}</em></article>
        <div className="quest-map-gain-grid">{completedQuest.values.slice(0, 4).map((value) => <div key={value.key}><Sparkles size={17} /><strong>+{value.points}</strong><span>{value.label}</span></div>)}</div>
        <article className="quest-map-trophy-unlock"><Trophy size={25} /><div><span>新しいトロフィー</span><strong>水の学び手</strong><p>公共の学びスポットを家族で活用しました</p></div></article>
        {unlockedComposite && <article className="quest-map-new-unlock"><Layers3 size={25} /><div><span>NEW QUEST UNLOCKED</span><strong>複合クエスト</strong><p>2つの価値を1回の移動でつなぐクエストが地図に現れました。</p></div></article>}
        <button className="quest-map-primary-button quest-map-completion-cta" onClick={() => { setPhase("browse"); setTab("map"); }}>新しい地図を見る<ChevronRight size={17} /></button>
        <button className="quest-map-secondary-button" onClick={() => { setPhase("browse"); setTab("roi"); }}>My ROIで確認</button>
      </main>
    </div>;
  }

  return <div className="quest-map-app">
    <header className="quest-map-app-header"><div><strong>Tokyo Life ROI</strong><span>11. ROI Quest Map版</span></div><VersionSwitcher current={currentVersion} onChange={onVersionChange} /></header>
    {tab === "map" && <><section className="quest-map-map-overlay"><div className="quest-map-roi-chip"><span>My ROI</span><strong>{progress.myRoi}</strong><i><b style={{ width: `${(progress.myRoi / level.nextRoi) * 100}%` }} /></i><small>{nextUnlockGap > 0 ? `次の解放まで ${nextUnlockGap}` : level.label}</small></div><div className="quest-map-message"><strong>自分を育てるほど、東京の新しい選択肢が解放される。</strong><span>今日の選択を、次の可能性に変える。</span></div></section><div className="quest-map-purpose-bar" aria-label="今日の目的">{purposeChoices.map(({ id, label, Icon }) => <button key={id} className={preference === id ? "is-active" : ""} onClick={() => setPreference(id)} aria-pressed={preference === id}><Icon size={16} />{label}</button>)}</div>{renderMap()}</>}
    {tab === "quests" && renderQuestList()}
    {tab === "atlas" && <QuestMapAtlas progress={progress} onSpotSelect={openSpot} />}
    {tab === "roi" && <QuestMapMyPage progress={progress} />}
    {tab === "settings" && <QuestMapSettings onReset={resetDemo} />}
    <nav className="quest-map-bottom-nav" aria-label="ROI Quest Mapナビゲーション">{navItems.map(({ id, label, Icon }) => <button key={id} className={tab === id ? "is-active" : ""} onClick={() => { setTab(id); setPhase(activeQuest && id === "map" ? "active" : "browse"); }} aria-current={tab === id ? "page" : undefined}><Icon size={21} /><span>{label}</span></button>)}</nav>
    {filterOpen && <div className="quest-map-filter-backdrop" role="presentation" onMouseDown={() => setFilterOpen(false)}><section className="quest-map-filter-sheet" role="dialog" aria-modal="true" aria-label="地図フィルター" onMouseDown={(event) => event.stopPropagation()}><div className="quest-map-sheet-handle" /><div><h2>地図フィルター</h2><button aria-label="閉じる" onClick={() => setFilterOpen(false)}><X size={19} /></button></div><div className="quest-map-category-filters">{categoryFilters.map((item) => <button key={item.id} className={categoryFilter === item.id ? "is-active" : ""} onClick={() => setCategoryFilter(item.id)}>{categoryFilter === item.id && <Check size={14} />}{item.label}</button>)}</div><div className="quest-map-filter-demo"><span>使える時間</span><button className="is-active">2〜3時間</button><button>半日</button><span>予算</span><button className="is-active">1,000円以内</button><button>指定なし</button><span>環境</span><button className="is-active">屋内も含む</button><button>屋外</button></div><button className="quest-map-primary-button" onClick={() => setFilterOpen(false)}>この条件で地図を見る</button></section></div>}
    {selectedQuest && selectedSpot && <QuestMapDetailSheet quest={selectedQuest} spot={selectedSpot} predictedRoi={calculatePredictedRoi(selectedSpot, preference)} visited={progress.visitedSpotIds.includes(selectedSpot.id)} onClose={() => { setSelectedQuest(null); setSelectedSpot(null); }} onStart={() => startQuest(selectedQuest)} onRoute={() => setToast("経路表示はデモです")} />}
    {toast && <div className="quest-map-toast" role="status" aria-live="polite">{toast}</div>}
  </div>;
}
