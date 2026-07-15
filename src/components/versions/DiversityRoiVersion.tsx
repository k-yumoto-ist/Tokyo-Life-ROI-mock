import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coins,
  Compass,
  Heart,
  Leaf,
  MapPin,
  Meh,
  Route,
  Smile,
  Sparkles,
  Star,
  Trophy,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  diversityMoodPresets,
  diversityPlans,
  diversityValueLabels,
  findDiversityPlan,
  getDiversityScenario,
  qolScore,
  readDiversitySession,
  saveDiversitySession,
  scoreDiversityPlan,
  type DiversityMoodId,
  type DiversityPlan,
  type DiversitySession,
  type DiversityValueKey,
  type DiversityWeights,
} from "../../data/diversityRoiMockData";

type DiversityPhase = "home" | "plans" | "selected" | "feedback";
type EntryMode = "destination" | "explore";
type ConditionKey = "people" | "time" | "budget";

const moodOptions: { id: DiversityMoodId; label: string; Icon: LucideIcon; tone: string }[] = [
  { id: "efficient", label: "効率よく動きたい", Icon: Clock3, tone: "blue" },
  { id: "slow", label: "ゆっくり過ごしたい", Icon: Leaf, tone: "green" },
  { id: "family", label: "家族時間を大切に", Icon: UsersRound, tone: "orange" },
  { id: "discover", label: "新しい場所を発見", Icon: Compass, tone: "purple" },
];

const valueKeys: DiversityValueKey[] = ["time", "money", "satisfaction", "family", "comfort", "discovery"];
const valueIcons: Record<DiversityValueKey, LucideIcon> = {
  time: Clock3,
  money: Coins,
  satisfaction: Smile,
  family: UsersRound,
  comfort: Leaf,
  discovery: Compass,
};
const valueLevels = [
  { value: 1, label: "控えめ" },
  { value: 2, label: "中立" },
  { value: 3, label: "大切" },
] as const;
const conditionChoices: Record<ConditionKey, string[]> = {
  people: ["ひとり", "家族4人"],
  time: ["午前", "午後"],
  budget: ["3,000円以内", "5,000円以内"],
};

function getValueSummary(weights: DiversityWeights) {
  const selected = valueKeys
    .filter((key) => weights[key] === 3)
    .slice(0, 2)
    .map((key) => diversityValueLabels[key]);

  return selected.length > 0 ? `${selected.join("・")}を重視` : "バランスよく";
}

function getChoiceCopy(plan: DiversityPlan) {
  if (plan.accent === "blue") return "短時間で、用事も休憩も";
  if (plan.accent === "green") return "移動を減らして、家族時間を最大化";
  return "少し遠回りして、新しい東京へ";
}

function MetricMeter({ label, value, Icon, accent = "blue" }: { label: string; value: number; Icon: LucideIcon; accent?: string }) {
  return (
    <div className="diversity-meter-item">
      <div className="diversity-meter-label"><Icon size={14} /><span>{label}</span><strong>{value}/5</strong></div>
      <div className="diversity-meter-track" aria-label={`${label} ${value} / 5`}>
        <span className={`diversity-meter-fill ${accent}`} style={{ width: `${value * 20}%` }} />
      </div>
    </div>
  );
}

function PlanCard({ plan, onDetails, onChoose }: { plan: DiversityPlan; onDetails: () => void; onChoose: () => void }) {
  return (
    <article className={`diversity-plan-card accent-${plan.accent}`}>
      <div className="diversity-plan-card-top">
        <span className="diversity-plan-icon"><Sparkles size={20} /></span>
        <div><span className="diversity-plan-label">{plan.label}</span><h3>{plan.name}</h3></div>
      </div>
      <p className="diversity-plan-choice-copy">{getChoiceCopy(plan)}</p>
      <p className="diversity-plan-destination"><MapPin size={15} />{plan.destination}</p>
      <div className="diversity-plan-key-metrics">
        <div><Clock3 size={15} /><strong>{plan.time}</strong><small>所要時間</small></div>
        <div><WalletCards size={15} /><strong>{plan.cost}</strong><small>費用</small></div>
        <div><UsersRound size={15} /><strong>{plan.crowd}</strong><small>混雑</small></div>
      </div>
      <p className="diversity-plan-summary">{plan.summary}</p>
      <div className="diversity-plan-primary-metrics">
        {plan.primaryMetrics.map((key) => {
          const Icon = valueIcons[key];
          return <MetricMeter key={key} label={diversityValueLabels[key]} value={plan.metrics[key]} Icon={Icon} accent={plan.accent} />;
        })}
      </div>
      <div className="diversity-card-actions">
        <button className="secondary-button" onClick={onDetails}><CircleHelp size={16} />詳しく見る</button>
        <button className="primary-button" onClick={onChoose}>この案を選ぶ <ChevronRight size={17} /></button>
      </div>
    </article>
  );
}

function QuickCompare({ plans, onCompare }: { plans: DiversityPlan[]; onCompare: () => void }) {
  return (
    <section className="diversity-quick-compare" aria-label="3案の簡易比較">
      <div className="diversity-quick-compare-heading">
        <div><span className="eyebrow-label">3 VALUE OPTIONS</span><h3>3つの良さを見比べる</h3></div>
        <button className="diversity-compare-inline-button" onClick={onCompare}><Route size={15} />3案を比較する</button>
      </div>
      <div className="diversity-quick-compare-grid">
        {plans.map((plan) => (
          <div className={`diversity-quick-option accent-${plan.accent}`} key={plan.id}>
            <strong>{plan.name.replace("プラン", "")}</strong>
            {plan.primaryMetrics.map((key) => {
              const Icon = valueIcons[key];
              return <span key={key}><Icon size={12} />{diversityValueLabels[key]} {plan.metrics[key]}</span>;
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function ValueBalance({ weights, expanded, onChange, onToggle }: { weights: DiversityWeights; expanded: boolean; onChange: (key: DiversityValueKey, value: number) => void; onToggle: () => void }) {
  const summary = getValueSummary(weights);
  return (
    <section className={`diversity-balance-card ${expanded ? "is-expanded" : "is-collapsed"}`}>
      <div className="diversity-section-heading">
        <div><span className="eyebrow-label">VALUE BALANCE</span><h2>今日、大切にしたいこと</h2></div>
        <button className="diversity-balance-toggle" onClick={onToggle} aria-expanded={expanded}>{expanded ? "閉じる" : "詳細を調整"}</button>
      </div>
      <p className="diversity-balance-summary">{summary}</p>
      {expanded && (
        <div className="diversity-value-list">
          {valueKeys.map((key) => {
            const Icon = valueIcons[key];
            return (
              <div className="diversity-value-row" key={key}>
                <span className="diversity-value-name"><Icon size={15} />{diversityValueLabels[key]}</span>
                <div className="diversity-value-options" role="group" aria-label={`${diversityValueLabels[key]}の優先度`}>
                  {valueLevels.map((level) => <button key={level.value} className={weights[key] === level.value ? "is-active" : ""} onClick={() => onChange(key, level.value)}>{level.label}</button>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Sheet({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="diversity-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="diversity-sheet" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="diversity-sheet-handle" />
        <div className="diversity-sheet-header"><h2>{title}</h2><button className="icon-shell" aria-label="閉じる" onClick={onClose}><X size={18} /></button></div>
        {children}
      </section>
    </div>
  );
}

function PlanDetails({ plan, weights, onChoose }: { plan: DiversityPlan; weights: DiversityWeights; onChoose: () => void }) {
  const score = scoreDiversityPlan(plan, weights);
  const qol = qolScore(plan);
  return (
    <div className="diversity-detail-content">
      <div className="diversity-detail-hero"><span className={`diversity-detail-dot ${plan.accent}`}><Sparkles size={21} /></span><div><span>{plan.label}</span><h3>{plan.name}</h3><p>{plan.destination}</p></div></div>
      <h3 className="diversity-subheading">この選択で得られるリターン</h3>
      <div className="diversity-return-grid">{plan.returns.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div>
      <div className="diversity-score-pair"><div><span>総合ROI</span><strong>{score}</strong><small>価値観の重みを反映</small></div><div><span>QOL期待値</span><strong>{qol}</strong><small>満足・家族・快適さ</small></div></div>
      <div className="diversity-axis-map" aria-label="ROIとQOLの関係"><span className="axis-y">満足・QOL</span><span className="axis-x">効率・ROI</span><i className={`axis-dot ${plan.accent}`} style={{ left: `${score}%`, bottom: `${qol}%` }} /></div>
      <div className="diversity-all-metrics">{valueKeys.map((key) => { const Icon = valueIcons[key]; return <MetricMeter key={key} label={diversityValueLabels[key]} value={plan.metrics[key]} Icon={Icon} accent={plan.accent} />; })}</div>
      <div className="diversity-city-note"><Building2 size={17} /><div><strong>東京への小さな貢献</strong><p>{plan.cityImpact.join("・")}</p></div></div>
      <button className="primary-button action-wide" onClick={onChoose}>この案を選ぶ <ChevronRight size={17} /></button>
    </div>
  );
}

function ComparisonSheet({ plans, weights, onChoose }: { plans: DiversityPlan[]; weights: DiversityWeights; onChoose: (plan: DiversityPlan) => void }) {
  return (
    <div className="diversity-comparison-table">
      <p className="diversity-sheet-lead">どれが正解ではなく、今日はどれを選ぶ？</p>
      <div className="diversity-compare-header"><span>価値</span>{plans.map((plan) => <strong key={plan.id}>{plan.name.replace("プラン", "")}</strong>)}</div>
      {(["time", "money", "satisfaction", "comfort", "family", "discovery"] as DiversityValueKey[]).map((key) => <div className="diversity-compare-row" key={key}><span>{diversityValueLabels[key]}</span>{plans.map((plan) => <b key={plan.id}>{plan.metrics[key]}/5</b>)}</div>)}
      <div className="diversity-compare-row diversity-compare-roi"><span>総合ROI</span>{plans.map((plan) => <b key={plan.id}>{scoreDiversityPlan(plan, weights)}</b>)}</div>
      <div className="diversity-compare-actions">{plans.map((plan) => <button key={plan.id} className="secondary-button" onClick={() => onChoose(plan)}>{plan.name}を選ぶ</button>)}</div>
    </div>
  );
}

export function DiversityRoiVersion({ onMyRoi }: { onMyRoi: () => void }) {
  const [phase, setPhase] = useState<DiversityPhase>("home");
  const [mood, setMood] = useState<DiversityMoodId>("family");
  const [entryMode, setEntryMode] = useState<EntryMode>("explore");
  const [weights, setWeights] = useState<DiversityWeights>(diversityMoodPresets.family);
  const [conditions, setConditions] = useState<Record<ConditionKey, string>>({ people: "家族4人", time: "午後", budget: "5,000円以内" });
  const [conditionOpen, setConditionOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [detailPlanId, setDetailPlanId] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [balanceExpanded, setBalanceExpanded] = useState(false);
  const [started, setStarted] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [satisfaction, setSatisfaction] = useState(4);
  const [crowd, setCrowd] = useState(3);
  const [revisit, setRevisit] = useState(true);
  const [discovery, setDiscovery] = useState(true);

  const scenario = getDiversityScenario(mood);
  const selectedPlan = findDiversityPlan(selectedPlanId ?? "") ?? scenario.plans[0];
  const detailPlan = findDiversityPlan(detailPlanId ?? "");
  const conditionSummary = `${conditions.people}・${conditions.time}・予算${conditions.budget}`;

  function chooseMood(nextMood: DiversityMoodId) {
    setMood(nextMood);
    setWeights(diversityMoodPresets[nextMood]);
    setBalanceExpanded(false);
  }

  function choosePlan(plan: DiversityPlan) {
    setSelectedPlanId(plan.id);
    setDetailPlanId(null);
    setCompareOpen(false);
    setPhase("selected");
    setFeedbackSaved(false);
    setStarted(false);
  }

  function saveFeedback() {
    const session: DiversitySession = { planId: selectedPlan.id, satisfaction, crowd, revisit, discovery, savedAt: new Date().toISOString() };
    saveDiversitySession(session);
    setFeedbackSaved(true);
  }

  if (phase === "selected") return <DiversitySelectedPlan plan={selectedPlan} started={started} onStart={() => setStarted(true)} onFeedback={() => setPhase("feedback")} onBack={() => setPhase("plans")} onMyRoi={onMyRoi} />;
  if (phase === "feedback") return <DiversityFeedback plan={selectedPlan} saved={feedbackSaved} satisfaction={satisfaction} crowd={crowd} revisit={revisit} discovery={discovery} onSatisfaction={setSatisfaction} onCrowd={setCrowd} onRevisit={setRevisit} onDiscovery={setDiscovery} onSave={saveFeedback} onMyRoi={onMyRoi} onBack={() => setPhase("selected")} />;

  return (
    <section className="version-panel diversity-version-panel">
      {phase === "home" ? (
        <>
          <div className="diversity-hero-copy"><span className="diversity-orbit-icon"><Sparkles size={19} /></span><h2>あなたの価値観で、東京を選ぶ。</h2><p>効率だけが、豊かさではない。</p><span className="diversity-hero-context">{scenario.title}</span></div>
          <div className="diversity-life-roi-note"><CircleHelp size={15} /><span><strong>Life ROI</strong> = お金・時間・満足・家族時間・発見など、暮らしから得られるリターン</span></div>
          <h2 className="diversity-question">今日はどう過ごしたい？</h2>
          <div className="diversity-mood-grid">{moodOptions.map(({ id, label, Icon, tone }) => <button key={id} className={`diversity-mood-button tone-${tone} ${mood === id ? "is-active" : ""}`} onClick={() => chooseMood(id)}><Icon size={25} /><span>{label}</span>{mood === id && <Check size={15} className="diversity-selected-check" />}</button>)}</div>
          <div className="diversity-entry-tabs" role="tablist" aria-label="探し方"><button className={entryMode === "destination" ? "is-active" : ""} onClick={() => setEntryMode("destination")}><MapPin size={17} />行きたい場所から</button><button className={entryMode === "explore" ? "is-active" : ""} onClick={() => setEntryMode("explore")}><Compass size={17} />やりたいことから</button></div>
          <section className="diversity-condition-card">
            <button className="diversity-condition-summary" onClick={() => setConditionOpen((current) => !current)} aria-expanded={conditionOpen}><span><MapPin size={16} /><small>{entryMode === "destination" ? "行きたい場所から探す" : "やりたいことから探す"}</small><strong>{conditionSummary}</strong></span><ChevronRight size={18} className={conditionOpen ? "is-open" : ""} /></button>
            {conditionOpen && <div className="diversity-condition-editor">{(Object.keys(conditionChoices) as ConditionKey[]).map((key) => <div key={key}><span>{key === "people" ? "人数" : key === "time" ? "時間帯" : "予算"}</span><div>{conditionChoices[key].map((choice) => <button key={choice} className={conditions[key] === choice ? "is-active" : ""} onClick={() => setConditions((current) => ({ ...current, [key]: choice }))}>{choice}</button>)}</div></div>)}</div>}
          </section>
          <ValueBalance weights={weights} expanded={balanceExpanded} onToggle={() => setBalanceExpanded((current) => !current)} onChange={(key, value) => setWeights((current) => ({ ...current, [key]: value }))} />
          <button className="primary-button diversity-main-cta" onClick={() => setPhase("plans")}><Sparkles size={18} />3つの過ごし方を見る <ChevronRight size={18} /></button>
          <p className="diversity-data-note"><CircleHelp size={14} />現在はデモデータです。天気・混雑・施設情報を反映する想定です。</p>
        </>
      ) : (
        <>
          <div className="diversity-results-top"><button className="mini-link-button" onClick={() => setPhase("home")}><ArrowLeft size={16} />条件を変える</button><div className="diversity-results-heading"><div><span className="eyebrow-label">VALUE OPTIONS</span><h2>{scenario.title}</h2><p>{conditionSummary}・{entryMode === "destination" ? scenario.destinationLabel : "やりたいことから探す"}</p></div><div className="diversity-plan-count">{scenario.plans.length}<small>案</small></div></div></div>
          <QuickCompare plans={scenario.plans} onCompare={() => setCompareOpen(true)} />
          <div className="diversity-plan-list">{scenario.plans.map((plan) => <PlanCard key={plan.id} plan={plan} onDetails={() => setDetailPlanId(plan.id)} onChoose={() => choosePlan(plan)} />)}</div>
          <button className="secondary-button action-wide diversity-compare-button" onClick={() => setCompareOpen(true)}><Route size={17} />3案を比較する</button>
        </>
      )}
      {detailPlan && <Sheet title="この選択で得られるもの" onClose={() => setDetailPlanId(null)}><PlanDetails plan={detailPlan} weights={weights} onChoose={() => choosePlan(detailPlan)} /></Sheet>}
      {compareOpen && <Sheet title="それぞれの良さを比べる" onClose={() => setCompareOpen(false)}><ComparisonSheet plans={scenario.plans} weights={weights} onChoose={choosePlan} /></Sheet>}
    </section>
  );
}

function DiversitySelectedPlan({ plan, started, onStart, onFeedback, onBack, onMyRoi }: { plan: DiversityPlan; started: boolean; onStart: () => void; onFeedback: () => void; onBack: () => void; onMyRoi: () => void }) {
  return (
    <section className="version-panel diversity-selected-panel">
      <button className="mini-link-button" onClick={onBack}><ArrowLeft size={16} />ほかの案を見る</button>
      <div className="diversity-selected-hero"><span className="diversity-orbit-icon"><Check size={21} /></span><span className="eyebrow-label">TODAY'S CHOICE</span><h2>今日はこの東京を選ぶ</h2><p>{plan.name}・{plan.destination}</p></div>
      <div className={`diversity-selected-card accent-${plan.accent}`}><div className="diversity-selected-title"><Sparkles size={20} /><div><span>{plan.label}</span><h3>{plan.name}</h3></div></div><div className="diversity-plan-key-metrics"><div><Clock3 size={15} /><strong>{plan.time}</strong><small>所要時間</small></div><div><WalletCards size={15} /><strong>{plan.cost}</strong><small>費用</small></div><div><UsersRound size={15} /><strong>{plan.crowd}</strong><small>混雑</small></div></div></div>
      <section className="diversity-personal-return-card"><div className="diversity-return-section-heading"><Heart size={18} /><h3>あなたへのリターン</h3></div><div className="diversity-return-grid">{plan.returns.slice(0, 4).map((item) => <span key={item}><Check size={15} />{item}</span>)}</div></section>
      <section className="diversity-city-contribution-card"><div className="diversity-return-section-heading"><Building2 size={18} /><h3>東京への小さな貢献</h3></div><div className="diversity-contribution-list">{plan.cityImpact.map((item) => <span key={item}><Check size={14} />{item}</span>)}</div><p>あなたにとって良い選択が、東京にとっても少し良い選択になります。</p></section>
      <div className="diversity-action-stack"><button className="primary-button action-wide" onClick={onStart}>{started ? <><Check size={18} />行動を記録しました</> : <><ArrowRight size={18} />行動をはじめる</>}</button><button className="secondary-button action-wide" onClick={onFeedback}><Smile size={18} />実際どうだった？</button><button className="mini-link-button" onClick={onMyRoi}>My ROIを見る</button></div>
    </section>
  );
}

function DiversityFeedback({ plan, saved, satisfaction, crowd, revisit, discovery, onSatisfaction, onCrowd, onRevisit, onDiscovery, onSave, onMyRoi, onBack }: { plan: DiversityPlan; saved: boolean; satisfaction: number; crowd: number; revisit: boolean; discovery: boolean; onSatisfaction: (value: number) => void; onCrowd: (value: number) => void; onRevisit: (value: boolean) => void; onDiscovery: (value: boolean) => void; onSave: () => void; onMyRoi: () => void; onBack: () => void }) {
  if (saved) {
    return <section className="version-panel diversity-feedback-panel"><div className="diversity-success-orbit"><Trophy size={32} /></div><span className="eyebrow-label">FEEDBACK SAVED</span><h2>今日の選択を振り返れた</h2><section className="diversity-personal-return-card"><div className="diversity-return-section-heading"><Heart size={18} /><h3>今日、あなたが得たもの</h3></div><div className="diversity-result-grid"><strong>+90分<small>家族時間</small></strong><strong>1件<small>新しい発見</small></strong><strong>{satisfaction}.0<small>満足度</small></strong></div></section><section className="diversity-city-contribution-card"><div className="diversity-return-section-heading"><Building2 size={18} /><h3>東京への小さな貢献</h3></div><div className="diversity-contribution-list"><span><Check size={14} />混雑時間帯を回避</span>{plan.cityImpact.slice(0, 1).map((item) => <span key={item}><Check size={14} />{item}</span>)}</div></section><div className="diversity-trophy-unlock"><Trophy size={22} /><div><span>新しいトロフィー</span><strong>{plan.trophy}</strong></div><Star size={18} /></div><p className="diversity-feedback-note">振り返りが、次回のあなた向け提案に反映されます。</p><button className="primary-button action-wide" onClick={onMyRoi}>あなたが選んだ東京を見る <ChevronRight size={17} /></button><button className="secondary-button action-wide" onClick={onBack}>別の案を選ぶ</button></section>;
  }
  return <section className="version-panel diversity-feedback-panel"><button className="mini-link-button" onClick={onBack}><ArrowLeft size={16} />選択画面へ</button><div className="diversity-feedback-heading"><span className="diversity-orbit-icon"><Heart size={22} /></span><div className="diversity-feedback-heading-copy"><span className="eyebrow-label">AFTER CHOICE</span><h2>実際どうだった？</h2><p>{plan.name}を振り返ります</p></div></div><div className="diversity-feedback-form"><div className="diversity-feedback-block"><h3>満足度</h3><div className="diversity-face-row">{[{ value: 3, label: "ふつう", Icon: Meh }, { value: 4, label: "よかった", Icon: Smile }, { value: 5, label: "最高", Icon: Star }].map(({ value, label, Icon }) => <button key={value} className={satisfaction === value ? "is-active" : ""} onClick={() => onSatisfaction(value)}><Icon size={28} /><span>{label}</span></button>)}</div></div><div className="diversity-feedback-block"><h3>混雑具合</h3><div className="diversity-choice-row is-three">{[1, 3, 5].map((value) => <button key={value} className={crowd === value ? "is-active" : ""} onClick={() => onCrowd(value)}>{value === 1 ? "空いていた" : value === 3 ? "普通" : "混んでいた"}</button>)}</div></div><div className="diversity-feedback-block"><h3>また行きたい？</h3><div className="diversity-choice-row"><button className={revisit ? "is-active" : ""} onClick={() => onRevisit(true)}>はい</button><button className={!revisit ? "is-active" : ""} onClick={() => onRevisit(false)}>今回は別の案</button></div></div><div className="diversity-feedback-block"><h3>新しい発見</h3><div className="diversity-choice-row"><button className={discovery ? "is-active" : ""} onClick={() => onDiscovery(true)}><Compass size={16} />あった</button><button className={!discovery ? "is-active" : ""} onClick={() => onDiscovery(false)}>まだない</button></div></div></div><button className="primary-button action-wide" onClick={onSave}>振り返りを保存 <Check size={17} /></button></section>;
}

export function DiversityRoiMyPage() {
  const [session] = useState(() => readDiversitySession());
  const [moreReturnsOpen, setMoreReturnsOpen] = useState(false);
  const plan = findDiversityPlan(session?.planId ?? "") ?? diversityPlans[1];
  return <section className="version-panel diversity-my-page"><div className="diversity-my-hero"><span className="diversity-orbit-icon"><Heart size={21} /></span><span className="eyebrow-label">MY TOKYO</span><h2>あなたが選んだ東京</h2><p>効率だけではない、今月のリターン</p></div><section className="diversity-month-card"><span className="section-label">今月のあなたのリターン</span><div className="diversity-my-metrics"><strong>4時間20分<small>生み出した時間</small></strong><strong>8,400円<small>節約した金額</small></strong><strong>4.2<small>平均満足度</small></strong><strong>6時間<small>家族時間</small></strong></div><button className="diversity-my-more-button" onClick={() => setMoreReturnsOpen((current) => !current)}>{moreReturnsOpen ? "閉じる" : "新しい発見 4件を見る"}</button>{moreReturnsOpen && <div className="diversity-return-grid"><span><Compass size={15} />新しい場所 4か所</span><span><Heart size={15} />家族の思い出</span></div>}</section><div className="diversity-insight-card"><Sparkles size={20} /><div><strong>あなたの選択傾向</strong><p>効率だけでなく、休日は家族時間と快適さを大切にする選択が増えています。</p></div></div><div className="diversity-profile-values"><div className="diversity-section-heading"><div><span className="eyebrow-label">YOUR VALUES</span><h2>よく大切にしている価値</h2></div><Compass size={19} /></div>{(["time", "satisfaction", "family", "comfort", "discovery"] as DiversityValueKey[]).map((key, index) => { const Icon = valueIcons[key]; return <MetricMeter key={key} label={diversityValueLabels[key]} value={[4, 4, 5, 4, 3][index]} Icon={Icon} accent={index === 4 ? "purple" : "green"} />; })}</div><div className="diversity-last-choice"><div><span className="eyebrow-label">LAST CHOICE</span><h3>{plan.name}</h3><p>{plan.destination}・満足度 4.0</p></div><Trophy size={25} /></div><section className="diversity-city-contribution-card diversity-my-city-card"><div className="diversity-return-section-heading"><Building2 size={18} /><h3>あなたの選択が、東京を少し変える</h3></div><div className="diversity-city-metrics"><span>6回<small>混雑を避けた</small></span><span>3回<small>地域施設を利用</small></span><span>2か所<small>新しいエリア</small></span></div><p>人流の分散・地域施設の利用・未訪問エリアの発見</p></section></section>;
}
