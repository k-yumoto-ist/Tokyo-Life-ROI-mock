import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  GraduationCap,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  getTokyoRecommendationResults,
  type TokyoRecommendationSpot,
  type TokyoSpotBadge,
} from "../../data/tokyoRecommendationMockData";

type SearchMode = "activity" | "destination";
type Phase = "home" | "results" | "selected" | "complete";

const activityOptions = ["子どもと学ぶ", "環境にふれる", "文化・歴史", "防災を学ぶ"];
const recordStorageKey = "tokyo-life-roi-v10-last-spot";

function BadgeIcon({ badge }: { badge: TokyoSpotBadge }) {
  const Icon = badge.label.includes("環境") ? Leaf : badge.label.includes("学び") || badge.label.includes("防災") ? GraduationCap : badge.label.includes("公共") ? Building2 : badge.label.includes("文化") ? BookOpen : badge.label.includes("混雑") ? UsersRound : Star;
  return <span className={`v10-badge tone-${badge.tone}`}><Icon size={13} />{badge.label}</span>;
}

function MetricGauge({ label, value, tone = "blue", Icon }: { label: string; value: number; tone?: "blue" | "green" | "purple" | "gold"; Icon: LucideIcon }) {
  return <div className={`v10-metric-gauge tone-${tone}`}>
    <div><Icon size={15} /><span>{label}</span><strong>{value}</strong></div>
    <span className="v10-meter-track"><i style={{ width: `${value}%` }} /></span>
  </div>;
}

function DetailSheet({ spot, onClose, onChoose }: { spot: TokyoRecommendationSpot; onClose: () => void; onChoose: () => void }) {
  return <div className="v10-sheet-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="v10-detail-sheet" role="dialog" aria-modal="true" aria-label={`${spot.name}の詳細`} onMouseDown={(event) => event.stopPropagation()}>
      <div className="v10-sheet-handle" />
      <div className="v10-sheet-head">
        <div><span>{spot.category}・デモデータ</span><h2>{spot.name}</h2></div>
        <button aria-label="詳細を閉じる" onClick={onClose}><X size={19} /></button>
      </div>
      <div className="v10-score-pair">
        <MetricGauge label="あなたとの相性" value={spot.personalScore} Icon={Sparkles} />
        <MetricGauge label="東京おすすめ度" value={spot.tokyoScore} tone="green" Icon={Building2} />
      </div>
      <section className="v10-detail-section">
        <h3><Sparkles size={17} />あなたにおすすめの理由</h3>
        {spot.personalReasons.map((reason) => <p key={reason}><Check size={15} />{reason}</p>)}
      </section>
      <section className="v10-detail-section v10-city-detail">
        <h3><Building2 size={17} />東京おすすめの理由</h3>
        {spot.tokyoReasons.map((reason) => <p key={reason}><Check size={15} />{reason}</p>)}
        <small>この選択には、こんなプラスもあります。</small>
      </section>
      <section className="v10-detail-metrics">
        <MetricGauge label="環境" value={spot.environmentalScore} tone="green" Icon={Leaf} />
        <MetricGauge label="学び・文化" value={spot.learningCultureScore} tone="purple" Icon={BookOpen} />
        <MetricGauge label="都市へのプラス" value={spot.cityScore} tone="gold" Icon={Trees} />
      </section>
      <button className="primary-button action-wide v10-sheet-cta" onClick={onChoose}>このスポットを選ぶ<ChevronRight size={17} /></button>
    </section>
  </div>;
}

function SpotCard({ spot, onDetail, onChoose }: { spot: TokyoRecommendationSpot; onDetail: () => void; onChoose: () => void }) {
  return <article className="v10-spot-card">
    <div className="v10-spot-card-head"><span>{spot.category}</span><strong>総合 {spot.totalScore}</strong></div>
    <h2>{spot.name}</h2>
    <p className="v10-place"><MapPin size={15} />{spot.area}</p>
    <div className="v10-facts"><span><Clock3 size={15} />{spot.travelTime}</span><span><WalletCards size={15} />{spot.cost}</span><span><UsersRound size={15} />{spot.crowd}</span></div>
    <div className="v10-badge-list">{spot.badges.slice(0, 3).map((badge) => <BadgeIcon badge={badge} key={badge.label} />)}</div>
    <p className="v10-spot-summary">{spot.summary}</p>
    <div className="v10-card-scores">
      <span><Sparkles size={14} />あなた {spot.personalScore}</span>
      <span><Building2 size={14} />東京 {spot.tokyoScore}</span>
    </div>
    <div className="v10-card-actions"><button className="v10-detail-button" onClick={onDetail}>理由を見る<CircleHelp size={15} /></button><button className="secondary-button" onClick={onChoose}>選ぶ<ChevronRight size={15} /></button></div>
  </article>;
}

export function TokyoRecommendationVersion({ onMyRoi }: { onMyRoi: () => void }) {
  const [phase, setPhase] = useState<Phase>("home");
  const [searchMode, setSearchMode] = useState<SearchMode>("activity");
  const [activity, setActivity] = useState("子どもと学ぶ");
  const [destination, setDestination] = useState("");
  const [includeTokyoRecommendations, setIncludeTokyoRecommendations] = useState(true);
  const [detailSpot, setDetailSpot] = useState<TokyoRecommendationSpot | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<TokyoRecommendationSpot | null>(null);
  const results = useMemo(() => getTokyoRecommendationResults(activity, destination, includeTokyoRecommendations), [activity, destination, includeTokyoRecommendations]);

  function showResults() {
    setDetailSpot(null);
    setPhase("results");
  }

  function chooseSpot(spot: TokyoRecommendationSpot) {
    setDetailSpot(null);
    setSelectedSpot(spot);
    setPhase("selected");
  }

  function completeAction() {
    if (selectedSpot) window.localStorage.setItem(recordStorageKey, JSON.stringify({ spotId: selectedSpot.id, savedAt: new Date().toISOString() }));
    setPhase("complete");
  }

  if (phase === "home") {
    return <section className="version-panel v10-panel">
      <div className="v10-intro"><span>V10 / DEMO</span><h2>東京おすすめスポットも評価に反映</h2><p><Sparkles size={14} />環境・学び・文化・地域への貢献も含めて提案します</p></div>
      <div className="v10-search-mode" role="tablist" aria-label="探し方">
        <button className={searchMode === "activity" ? "is-active" : ""} onClick={() => setSearchMode("activity")} role="tab" aria-selected={searchMode === "activity"}><Sparkles size={16} />やりたいことから</button>
        <button className={searchMode === "destination" ? "is-active" : ""} onClick={() => setSearchMode("destination")} role="tab" aria-selected={searchMode === "destination"}><MapPin size={16} />目的地から</button>
      </div>
      <article className="v10-search-card">
        {searchMode === "activity" ? <><h3>今日は何をしたい？</h3><div className="v10-choice-grid">{activityOptions.map((option) => <button key={option} className={activity === option ? "is-active" : ""} onClick={() => setActivity(option)} aria-pressed={activity === option}>{activity === option && <CheckCircle2 size={14} />}{option}</button>)}</div></> : <><h3>行きたい場所</h3><label className="v10-destination-input"><MapPin size={18} /><input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="上野、日比谷、有明など" aria-label="目的地" /></label><p className="v10-input-caption">入力がなくても、今の条件から探せます</p></>}
        <div className="v10-condition-summary"><UsersRound size={16} /><span>家族4人・午後・予算5,000円以内</span></div>
      </article>
      <button className={`v10-recommendation-toggle ${includeTokyoRecommendations ? "is-active" : ""}`} onClick={() => setIncludeTokyoRecommendations((value) => !value)} aria-pressed={includeTokyoRecommendations}><span><Building2 size={18} />東京おすすめを含める<small>環境・学び・公共施設も評価</small></span><i>{includeTokyoRecommendations && <Check size={15} />}</i></button>
      <button className="primary-button action-wide v10-main-cta" onClick={showResults}>東京のスポットを探す<ChevronRight size={18} /></button>
    </section>;
  }

  if (phase === "results") {
    return <section className="version-panel v10-panel">
      <button className="mini-link-button" onClick={() => setPhase("home")}><ArrowLeft size={16} />条件を変える</button>
      <div className="v10-results-heading"><span>あなたに合う候補</span><p>{searchMode === "activity" ? activity : destination || "東京周辺"}・デモデータ</p></div>
      <div className="v10-results-note"><Sparkles size={15} />個人の過ごしやすさを優先しながら、東京おすすめの価値も見ています</div>
      <div className="v10-results-list">{results.map((spot) => <SpotCard key={spot.id} spot={spot} onDetail={() => setDetailSpot(spot)} onChoose={() => chooseSpot(spot)} />)}</div>
      {detailSpot && <DetailSheet spot={detailSpot} onClose={() => setDetailSpot(null)} onChoose={() => chooseSpot(detailSpot)} />}
    </section>;
  }

  if (phase === "selected" && selectedSpot) {
    return <section className="version-panel v10-panel">
      <button className="mini-link-button" onClick={() => setPhase("results")}><ArrowLeft size={16} />候補に戻る</button>
      <div className="v10-selected-heading"><CheckCircle2 size={23} /><span>今日のスポットを選びました</span><h1>{selectedSpot.name}</h1><p><MapPin size={15} />{selectedSpot.area}</p></div>
      <article className="v10-selected-card"><div className="v10-facts"><span><Clock3 size={15} />{selectedSpot.travelTime}</span><span><WalletCards size={15} />{selectedSpot.cost}</span><span><UsersRound size={15} />{selectedSpot.crowd}</span></div><p>{selectedSpot.summary}</p></article>
      <section className="v10-return-card"><h3><Sparkles size={18} />あなたにとっての良いところ</h3>{selectedSpot.personalBenefits.map((benefit) => <p key={benefit}><Check size={15} />{benefit}</p>)}</section>
      <section className="v10-city-card"><h3><Building2 size={18} />東京にも、少し良い選択</h3>{selectedSpot.cityBenefits.map((benefit) => <p key={benefit}><Check size={15} />{benefit}</p>)}<small>自分に合う選択が、東京の過ごしやすさにもつながります。</small></section>
      <button className="primary-button action-wide v10-main-cta" onClick={completeAction}>行動を完了する<ChevronRight size={18} /></button>
    </section>;
  }

  return <section className="version-panel v10-panel v10-complete">
    <span className="v10-complete-icon"><Check size={30} /></span>
    <p className="v10-eyebrow">TODAY'S CHOICE</p><h1>今日の選択</h1><h2>{selectedSpot?.name}</h2>
    <section className="v10-return-card"><h3><Sparkles size={18} />今日、あなたが得たこと</h3>{selectedSpot?.personalBenefits.map((benefit) => <p key={benefit}><Check size={15} />{benefit}</p>)}</section>
    <section className="v10-city-card"><h3><Building2 size={18} />東京への小さなプラス</h3>{selectedSpot?.cityBenefits.map((benefit) => <p key={benefit}><Check size={15} />{benefit}</p>)}</section>
    <article className="v10-earned-badge"><Star size={21} /><div><span>新しいバッジ</span><strong>{selectedSpot?.completionBadge}</strong><p>{selectedSpot?.completionBadgeDetail}</p></div></article>
    <button className="primary-button action-wide v10-main-cta" onClick={onMyRoi}>My ROIを見る<ChevronRight size={18} /></button>
    <button className="secondary-button action-wide" onClick={() => setPhase("home")}>ホームに戻る</button>
  </section>;
}

export function TokyoRecommendationMyRoi() {
  const [record] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem(recordStorageKey) ?? "null") as { spotId: string; savedAt: string } | null; } catch { return null; }
  });
  return <section className="version-panel v10-panel v10-my-roi">
    <div className="v10-results-heading"><span>今月の東京おすすめ行動</span><p>個人の過ごしやすさを優先した、デモの振り返りです</p></div>
    <article className="v10-my-main"><div><Clock3 size={20} /><strong>96分</strong><span>時間を確保</span></div><div><WalletCards size={20} /><strong>4,200円</strong><span>費用を抑えた</span></div><div><Sparkles size={20} /><strong>4.3</strong><span>平均満足度</span></div></article>
    <article className="v10-return-card"><h3><Star size={18} />最近の選択</h3><p><strong>{record ? "東京おすすめスポットを選択" : "まだ選択はありません"}</strong></p><small>{record ? "選択結果は次の提案にも反映されます" : "ホームからスポットを探してみましょう"}</small></article>
    <article className="v10-city-card"><h3><Building2 size={18} />東京への小さなプラス</h3><div className="v10-city-stats"><span><strong>3回</strong>公共施設</span><span><strong>4回</strong>学びスポット</span><span><strong>6回</strong>混雑を回避</span></div></article>
  </section>;
}
