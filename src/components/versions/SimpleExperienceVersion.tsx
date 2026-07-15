import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  Heart,
  Leaf,
  Map,
  MapPin,
  Meh,
  Route,
  Smile,
  Sparkles,
  Star,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  getSimplePlan,
  readSimpleExperienceRecord,
  saveSimpleExperienceRecord,
  simplePlans,
  type SimpleBudget,
  type SimpleCompanion,
  type SimpleDuration,
  type SimpleMood,
  type SimplePlan,
} from "../../data/simpleExperienceMockData";

type SimplePhase = "home" | "result" | "alternatives" | "selected" | "feedback" | "saved";
type Satisfaction = "low" | "good" | "great";
type Crowd = "low" | "normal" | "high";

const moodChoices: { id: SimpleMood; title: string; caption: string; Icon: LucideIcon; tone: string }[] = [
  { id: "smart", title: "サクッと効率よく", caption: "時間や移動を抑えたい", Icon: Clock3, tone: "blue" },
  { id: "slow", title: "ゆっくり満足したい", caption: "心地よく過ごしたい", Icon: Leaf, tone: "green" },
  { id: "discover", title: "いつもと違う体験をしたい", caption: "新しい場所を発見したい", Icon: Compass, tone: "purple" },
];

function Metric({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string }) {
  return <div className="simple-experience-metric"><Icon size={16} /><span>{label}</span><strong>{value}</strong></div>;
}

function DetailSheet({ plan, onClose }: { plan: SimplePlan; onClose: () => void }) {
  return <div className="simple-experience-sheet-backdrop" role="presentation" onMouseDown={onClose}><section className="simple-experience-sheet" role="dialog" aria-modal="true" aria-label="プランの詳細" onMouseDown={(event) => event.stopPropagation()}><div className="simple-experience-sheet-handle" /><div className="simple-experience-sheet-head"><div><span>このプランの特徴</span><h2>{plan.title}</h2></div><button aria-label="閉じる" onClick={onClose}><X size={19} /></button></div><div className="simple-experience-detail-grid"><Metric Icon={Clock3} label="時間" value={`${plan.details.time}/5`} /><Metric Icon={WalletCards} label="お金" value={`${plan.details.money}/5`} /><Metric Icon={Smile} label="満足" value={`${plan.details.satisfaction}/5`} /><Metric Icon={UsersRound} label="家族時間" value={`${plan.details.family}/5`} /><Metric Icon={Compass} label="新しい発見" value={`${plan.details.discovery}/5`} /></div><div className="simple-experience-detail-reason"><CircleHelp size={17} /><p>今日は効率を重視しつつ、家族で過ごす条件に合うため選ばれました。</p></div></section></div>;
}

function PlanPreview({ plan, onChoose, selected }: { plan: SimplePlan; onChoose: () => void; selected?: boolean }) {
  return <article className={`simple-experience-plan-card accent-${plan.accent} ${selected ? "is-selected" : ""}`}><div className="simple-experience-plan-card-head"><span>{plan.label}</span>{selected && <CheckCircle2 size={18} />}</div><h2>{plan.title}</h2><p className="simple-experience-place"><MapPin size={15} />{plan.place}</p><div className="simple-experience-plan-facts"><span><Clock3 size={15} />{plan.time}</span><span><WalletCards size={15} />{plan.cost}</span></div><p className="simple-experience-plan-summary">{plan.summary}</p><button className={selected ? "primary-button action-wide" : "secondary-button action-wide"} onClick={onChoose}>{selected ? "この案にする" : "この案を選ぶ"}<ChevronRight size={17} /></button></article>;
}

export function SimpleExperienceVersion({ onMyRoi }: { onMyRoi: () => void }) {
  const [phase, setPhase] = useState<SimplePhase>("home");
  const [mood, setMood] = useState<SimpleMood>("smart");
  const [companion, setCompanion] = useState<SimpleCompanion>("family");
  const [duration, setDuration] = useState<SimpleDuration>("half-day");
  const [budget, setBudget] = useState<SimpleBudget>("5000");
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<SimplePlan["id"]>("smart");
  const [activeAlternative, setActiveAlternative] = useState<SimplePlan["id"]>("smart");
  const [satisfaction, setSatisfaction] = useState<Satisfaction>("good");
  const [crowd, setCrowd] = useState<Crowd>("normal");
  const [revisit, setRevisit] = useState(true);
  const [discovery, setDiscovery] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const recommendedPlan = getSimplePlan(mood);
  const selectedPlan = getSimplePlan(selectedPlanId);
  const activePlan = getSimplePlan(activeAlternative);
  const companionLabel = companion === "family" ? "家族" : companion === "solo" ? "ひとり" : "友人・パートナー";
  const durationLabel = duration === "two-hours" ? "2時間くらい" : duration === "half-day" ? "半日" : "1日";
  const budgetLabel = budget === "3000" ? "3,000円以内" : budget === "5000" ? "5,000円以内" : "10,000円以内";

  function beginRecommendation() {
    setSelectedPlanId(recommendedPlan.id);
    setActiveAlternative(recommendedPlan.id);
    setPhase("result");
  }

  function choosePlan(plan: SimplePlan) {
    setSelectedPlanId(plan.id);
    setActiveAlternative(plan.id);
    setPhase("selected");
  }

  function saveFeedback() {
    saveSimpleExperienceRecord({ planId: selectedPlan.id, satisfaction, crowd, revisit, discovery, savedAt: new Date().toISOString() });
    setPhase("saved");
  }

  if (phase === "home") {
    return <section className="version-panel simple-experience-panel"><div className="simple-experience-intro"><h2>今日、どんな時間にしたい？</h2><p>今の気分と条件から、東京での過ごし方を提案します</p></div><div className="simple-experience-mood-list">{moodChoices.map(({ id, title, caption, Icon, tone }) => <button key={id} className={`simple-experience-mood-card tone-${tone} ${mood === id ? "is-active" : ""}`} onClick={() => setMood(id)} aria-pressed={mood === id}><span className="simple-experience-mood-icon"><Icon size={22} /></span><span><strong>{title}</strong><small>{caption}</small></span>{mood === id && <Check size={17} />}</button>)}</div><div className="simple-experience-input-group"><h3>誰と過ごす？</h3><div className="simple-experience-segment">{([ ["solo", "ひとり"], ["family", "家族"], ["friends", "友人・パートナー"] ] as const).map(([value, label]) => <button key={value} className={companion === value ? "is-active" : ""} onClick={() => setCompanion(value)}>{label}</button>)}</div></div><div className="simple-experience-input-group"><h3>使える時間</h3><div className="simple-experience-segment">{([ ["two-hours", "2時間くらい"], ["half-day", "半日"], ["full-day", "1日"] ] as const).map(([value, label]) => <button key={value} className={duration === value ? "is-active" : ""} onClick={() => setDuration(value)}>{label}</button>)}</div></div><div className="simple-experience-input-group"><h3>予算</h3><div className="simple-experience-segment">{([ ["3000", "3,000円以内"], ["5000", "5,000円以内"], ["10000", "10,000円以内"] ] as const).map(([value, label]) => <button key={value} className={budget === value ? "is-active" : ""} onClick={() => setBudget(value)}>{label}</button>)}</div></div><div className="simple-experience-destination"><button onClick={() => setDestinationOpen((value) => !value)} aria-expanded={destinationOpen}><MapPin size={16} />行きたい場所が決まっている<ChevronRight size={16} className={destinationOpen ? "is-open" : ""} /></button>{destinationOpen && <input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="東京駅、上野、葛西臨海公園など" aria-label="行きたい場所" />}</div><button className="primary-button simple-experience-main-cta" onClick={beginRecommendation}>おすすめを見る<ChevronRight size={18} /></button></section>;
  }

  if (phase === "result") {
    return <section className="version-panel simple-experience-panel"><button className="mini-link-button" onClick={() => setPhase("home")}><ArrowLeft size={16} />条件を変える</button><div className="simple-experience-result-heading"><span>あなたには、これがおすすめ</span><p>{companionLabel}・{durationLabel}・{budgetLabel}</p></div><article className={`simple-experience-featured-card accent-${recommendedPlan.accent}`}><span className="simple-experience-featured-label">効率と満足のバランス</span><h1>{recommendedPlan.title}</h1><p className="simple-experience-place"><MapPin size={16} />{recommendedPlan.place}</p><div className="simple-experience-featured-metrics"><Metric Icon={Clock3} label="所要時間" value={recommendedPlan.time} /><Metric Icon={WalletCards} label="予算" value={recommendedPlan.cost} /><Metric Icon={UsersRound} label="混雑" value={recommendedPlan.crowd} /></div><div className="simple-experience-reasons">{recommendedPlan.reasons.map((reason) => <p key={reason}><Check size={16} />{reason}</p>)}</div><button className="simple-experience-detail-link" onClick={() => setDetailOpen(true)}><CircleHelp size={16} />詳しく見る</button></article><div className="simple-experience-result-actions"><button className="primary-button action-wide" onClick={() => choosePlan(recommendedPlan)}>このプランにする<ChevronRight size={17} /></button><button className="secondary-button action-wide" onClick={() => setPhase("alternatives")}>ほかの案を見る</button></div>{detailOpen && <DetailSheet plan={recommendedPlan} onClose={() => setDetailOpen(false)} />}</section>;
  }

  if (phase === "alternatives") {
    const activeIndex = simplePlans.findIndex((plan) => plan.id === activeAlternative);
    return <section className="version-panel simple-experience-panel"><button className="mini-link-button" onClick={() => setPhase("result")}><ArrowLeft size={16} />おすすめに戻る</button><div className="simple-experience-result-heading"><span>ほかの過ごし方</span><p>今日は、どれを選ぶ？</p></div><div className="simple-experience-carousel-tabs">{simplePlans.map((plan) => <button key={plan.id} className={activeAlternative === plan.id ? "is-active" : ""} onClick={() => setActiveAlternative(plan.id)} aria-label={`${plan.label}を表示`}>{plan.label.replace("時間を有効に使う", "スマート").replace("ゆっくり過ごす", "ゆとり").replace("新しい体験", "発見")}</button>)}</div><div className="simple-experience-carousel" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>{simplePlans.map((plan) => <div className="simple-experience-carousel-slide" key={plan.id}><PlanPreview plan={plan} selected={activeAlternative === plan.id} onChoose={() => choosePlan(plan)} /></div>)}</div><div className="simple-experience-dots" aria-label="プランのページ"><span className={activeIndex === 0 ? "is-active" : ""} /><span className={activeIndex === 1 ? "is-active" : ""} /><span className={activeIndex === 2 ? "is-active" : ""} /></div><button className="primary-button action-wide simple-experience-selected-cta" onClick={() => choosePlan(activePlan)}>{activePlan.label.replace("時間を有効に使う", "スマート").replace("ゆっくり過ごす", "ゆとり").replace("新しい体験", "発見")}プランにする<ChevronRight size={17} /></button></section>;
  }

  if (phase === "selected") {
    return <section className="version-panel simple-experience-panel"><button className="mini-link-button" onClick={() => setPhase("alternatives")}><ArrowLeft size={16} />別の案に変える</button><div className="simple-experience-decision-heading"><span><CheckCircle2 size={20} />今日のプランが決まりました</span><h1>{selectedPlan.title}</h1><p><MapPin size={15} />{selectedPlan.place}</p></div><article className={`simple-experience-decision-card accent-${selectedPlan.accent}`}><div className="simple-experience-featured-metrics"><Metric Icon={Clock3} label="所要時間" value={selectedPlan.time} /><Metric Icon={WalletCards} label="予算" value={selectedPlan.cost} /><Metric Icon={UsersRound} label="混雑" value={selectedPlan.crowd} /><Metric Icon={Clock3} label="出発目安" value="13:30" /></div><div className="simple-experience-timeline">{selectedPlan.timeline.map((item) => <div key={item.time}><time>{item.time}</time><span /><p>{item.label}</p></div>)}</div></article><button className="primary-button action-wide simple-experience-map-cta" onClick={() => setMapOpen(true)}><Map size={18} />地図で見る</button><div className="simple-experience-secondary-actions"><button className="secondary-button" onClick={() => setPhase("feedback")}>プランを保存</button><button className="mini-link-button" onClick={() => setPhase("alternatives")}>別の案に変える</button></div><section className="simple-experience-good-card"><h3>このプランの良いところ</h3>{selectedPlan.goodPoints.map((item) => <p key={item}><Check size={15} />{item}</p>)}</section><section className="simple-experience-city-card"><h3>東京にも、少し良い選択</h3>{selectedPlan.cityImpact.map((item) => <p key={item}><Check size={14} />{item}</p>)}</section>{mapOpen && <div className="simple-experience-sheet-backdrop" role="presentation" onMouseDown={() => setMapOpen(false)}><section className="simple-experience-map-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><button aria-label="閉じる" onClick={() => setMapOpen(false)}><X size={19} /></button><Map size={38} /><h2>東京駅周辺・KITTE</h2><p>地図表示はデモです</p></section></div>}</section>;
  }

  if (phase === "feedback") {
    return <section className="version-panel simple-experience-panel"><button className="mini-link-button" onClick={() => setPhase("selected")}><ArrowLeft size={16} />プランに戻る</button><div className="simple-experience-feedback-heading"><Heart size={22} /><div><h1>今日のプラン、どうだった？</h1><p>{selectedPlan.title}</p></div></div><div className="simple-experience-feedback-block"><h3>満足度</h3><div className="simple-experience-feedback-choices">{([ ["low", "いまひとつ", Meh], ["good", "よかった", Smile], ["great", "最高", Star] ] as const).map(([value, label, Icon]) => <button key={value} className={satisfaction === value ? "is-active" : ""} onClick={() => setSatisfaction(value)}><Icon size={25} />{label}</button>)}</div></div><div className="simple-experience-feedback-block"><h3>混雑</h3><div className="simple-experience-feedback-choices">{([ ["low", "空いていた"], ["normal", "ふつう"], ["high", "混んでいた"] ] as const).map(([value, label]) => <button key={value} className={crowd === value ? "is-active" : ""} onClick={() => setCrowd(value)}>{label}</button>)}</div></div><div className="simple-experience-feedback-block"><h3>また選びたいか</h3><div className="simple-experience-feedback-choices two"><button className={revisit ? "is-active" : ""} onClick={() => setRevisit(true)}>また選びたい</button><button className={!revisit ? "is-active" : ""} onClick={() => setRevisit(false)}>次は別の案</button></div></div><label className="simple-experience-discovery-check"><input type="checkbox" checked={discovery} onChange={(event) => setDiscovery(event.target.checked)} />新しい発見があった</label><button className="primary-button action-wide" onClick={saveFeedback}>振り返りを保存<Check size={17} /></button></section>;
  }

  return <section className="version-panel simple-experience-panel simple-experience-saved"><span className="simple-experience-saved-check"><Check size={29} /></span><h1>今日、暮らしに増えたもの</h1><div className="simple-experience-saved-metrics"><strong>+70分<small>家族時間</small></strong><strong>4.0<small>満足度</small></strong><strong>{discovery ? "1件" : "0件"}<small>新しい発見</small></strong></div><div className="simple-experience-saved-city"><Leaf size={17} /><span>東京にも、少し良い選択</span><p>混雑する時間帯を避けた</p></div><div className="simple-experience-badge"><Sparkles size={18} /><span>新しいバッジ：スマートムーバー</span></div><button className="primary-button action-wide" onClick={onMyRoi}>My ROIを見る<ChevronRight size={17} /></button><button className="secondary-button action-wide" onClick={() => setPhase("home")}>ホームに戻る</button></section>;
}

export function SimpleExperienceMyRoi() {
  const [record] = useState(() => readSimpleExperienceRecord());
  const plan = getSimplePlan(record?.planId);
  return <section className="version-panel simple-experience-my-page"><div className="simple-experience-my-heading"><span>MY TOKYO</span><h1>今月、暮らしに増えたもの</h1><p>あなたが選んだ東京の過ごし方</p></div><article className="simple-experience-my-main"><div><Heart size={19} /><strong>+6時間</strong><span>家族時間</span></div><div><Clock3 size={19} /><strong>+4時間20分</strong><span>自由時間</span></div><div><Compass size={19} /><strong>4件</strong><span>新しい発見</span></div></article><div className="simple-experience-my-submetrics"><span>節約できた金額 <strong>8,400円</strong></span><span>平均満足度 <strong>4.2</strong></span></div><article className="simple-experience-my-insight"><Sparkles size={20} /><div><h2>最近のあなたの傾向</h2><p>休日は、効率だけでなく家族時間と心地よさを大切にする選択が増えています</p></div></article><article className="simple-experience-recent-choice"><span>最近の選択</span><h2>{plan.title}</h2><p>{plan.place}</p><strong>満足度 {record?.satisfaction === "great" ? "5.0" : record?.satisfaction === "low" ? "3.0" : "4.0"}</strong></article><article className="simple-experience-city-card"><h3>あなたの選択が、東京を少し変える</h3><div className="simple-experience-city-stats"><span><strong>6回</strong>混雑を避けた</span><span><strong>3回</strong>地域施設を利用</span><span><strong>2か所</strong>新しいエリア</span></div></article></section>;
}
