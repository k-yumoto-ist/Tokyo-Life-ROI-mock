import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Database, MapPin, RotateCcw, Settings2, Sparkles } from "lucide-react";
import { ComparisonDashboard } from "./components/ComparisonDashboard";
import { candidateOptions, demoProfile, demoWish, emptyProfile, openDataSources, profileStorageKey, tokyoContext } from "./lib/mockData";
import { estimateTimeValue, formatYen, scoreCandidates } from "./lib/scoring";
import type {
  AvailableTime,
  AvoidanceLevel,
  BudgetRange,
  ChildAge,
  Companion,
  CurrentWish,
  FamilyStructure,
  IncomeRange,
  Step,
  TransportMode,
  UserProfile,
  ValuePriority,
  WishFocus,
  WishPurpose
} from "./types";

const incomeOptions: IncomeRange[] = ["300万円未満", "300万〜500万円", "500万〜700万円", "700万〜1,000万円", "1,000万円以上", "回答しない"];
const familyOptions: FamilyStructure[] = ["ひとり暮らし", "夫婦・パートナー", "夫婦＋子ども", "ひとり親＋子ども", "親と同居", "回答しない"];
const childAgeOptions: ChildAge[] = ["未就学児", "小学生", "中高生", "大学生以上"];
const transportOptions: TransportMode[] = ["電車", "バス", "自動車", "自転車", "徒歩", "タクシー"];
const priorityOptions: ValuePriority[] = ["時間", "費用", "快適さ", "家族満足度"];
const avoidanceOptions: AvoidanceLevel[] = ["低め", "普通", "高め"];

const companionOptions: Companion[] = ["ひとり", "パートナー", "友人", "子ども", "家族"];
const purposeOptions: WishPurpose[] = ["食事", "買い物", "子どもと遊ぶ", "観光・レジャー", "仕事・作業", "移動", "その他"];
const timeOptions: AvailableTime[] = ["1時間以内", "2〜3時間", "半日", "1日"];
const budgetOptions: BudgetRange[] = ["できるだけ抑える", "3,000円以内", "5,000円以内", "10,000円以内", "予算を気にしない"];
const focusOptions: WishFocus[] = ["時間", "費用", "快適さ", "混雑回避", "家族の満足度", "バランス"];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(demoProfile);
  const [wish, setWish] = useState<CurrentWish>(demoWish);
  const [step, setStep] = useState<Step>("start");
  const [isLoading, setIsLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(profileStorageKey);
    if (stored) {
      try {
        setProfile({ ...demoProfile, ...JSON.parse(stored) });
        setProfileSaved(true);
        setStep("wish");
      } catch {
        setStep("start");
      }
    }
  }, []);

  const scoredCandidates = useMemo(() => scoreCandidates(candidateOptions, profile, wish), [profile, wish]);
  const recommended = scoredCandidates[0];
  const estimatedTimeValue = useMemo(() => estimateTimeValue(profile), [profile]);

  function updateProfile<T extends keyof UserProfile>(key: T, value: UserProfile[T]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function updateWish<T extends keyof CurrentWish>(key: T, value: CurrentWish[T]) {
    setWish((current) => ({ ...current, [key]: value }));
  }

  function saveProfile(nextStep: Step = "wish", profileToSave: UserProfile = profile) {
    const normalized = { ...profileToSave, timeValuePerHour: profileToSave.timeValuePerHour || estimateTimeValue(profileToSave) };
    setProfile(normalized);
    window.localStorage.setItem(profileStorageKey, JSON.stringify(normalized));
    setProfileSaved(true);
    setStep(nextStep);
  }

  function resetProfile() {
    window.localStorage.removeItem(profileStorageKey);
    setProfile(demoProfile);
    setWish(demoWish);
    setProfileSaved(false);
    setStep("profile");
  }

  function showResults() {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setStep("results");
    }, 560);
  }

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-ink">
      <Header step={step} profileSaved={profileSaved} onProfile={() => setStep(profileSaved ? "profile-review" : "profile")} onReset={resetProfile} />
      <main className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-5 lg:pb-12">
        <StepNav step={step} profileSaved={profileSaved} />
        {step === "start" && <StartScreen onStart={() => setStep(profileSaved ? "wish" : "profile")} onDemo={() => saveProfile("wish", demoProfile)} />}
        {step === "profile" && (
          <ProfileSetup
            profile={profile}
            estimatedTimeValue={estimatedTimeValue}
            onChange={updateProfile}
            onSave={() => saveProfile("wish")}
            onUseDemo={() => {
              setProfile(demoProfile);
              saveProfile("wish", demoProfile);
            }}
          />
        )}
        {step === "profile-review" && (
          <ProfileReview
            profile={profile}
            estimatedTimeValue={estimatedTimeValue}
            onChange={() => setStep("profile")}
            onReset={resetProfile}
            onNext={() => setStep("wish")}
          />
        )}
        {step === "wish" && (
          <WishInput
            profile={profile}
            wish={wish}
            isLoading={isLoading}
            onChange={updateWish}
            onSubmit={showResults}
            onProfile={() => setStep("profile-review")}
          />
        )}
        {step === "results" && (
          <ComparisonDashboard
            profile={profile}
            wish={wish}
            tokyoContext={tokyoContext}
            candidates={scoredCandidates}
            recommended={recommended}
            onBack={() => setStep("wish")}
            onProfile={() => setStep("profile-review")}
            onRecalculate={showResults}
          />
        )}
        <OpenDataSection />
      </main>
    </div>
  );
}

function Header({
  step,
  profileSaved,
  onProfile,
  onReset
}: {
  step: Step;
  profileSaved: boolean;
  onProfile: () => void;
  onReset: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
        <button className="flex min-w-0 items-center gap-3 text-left" onClick={onProfile}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-night text-white shadow-glow">
            <Sparkles size={21} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black tracking-tight sm:text-lg">Tokyo Life ROI</span>
            <span className="block truncate text-xs font-bold text-slate-500 sm:text-sm">あなたにとって、今もっともROIの高い選択へ</span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button className="hidden min-h-10 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600 sm:inline-flex sm:items-center" onClick={onReset}>
            リセット
          </button>
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black text-night">
            {step === "results" ? "3/3 提案結果" : step === "wish" ? "2/3 今回の希望" : profileSaved ? "設定済み" : "1/3 基本設定"}
          </span>
        </div>
      </div>
    </header>
  );
}

function StepNav({ step, profileSaved }: { step: Step; profileSaved: boolean }) {
  const items = [
    { id: "profile", label: "基本設定", done: profileSaved },
    { id: "wish", label: "今回の希望", done: step === "results" },
    { id: "results", label: "提案結果", done: step === "results" }
  ];
  return (
    <nav className="mb-3 grid grid-cols-3 gap-2">
      {items.map((item) => {
        const active = step === item.id || (step === "profile-review" && item.id === "profile");
        return (
          <div key={item.id} className={`rounded-xl border px-2 py-2 text-center text-xs font-black ${active ? "border-aqua bg-cyan-50 text-night" : item.done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-500"}`}>
            {item.label}
          </div>
        );
      })}
    </nav>
  );
}

function StartScreen({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  return (
    <section className="grid min-h-[calc(100dvh-118px)] gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="rounded-2xl bg-night p-5 text-white shadow-glow sm:p-8">
        <p className="section-kicker text-cyan-100">Personal Life ROI</p>
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">基本設定と今の希望から、東京での最適な行動を提案。</h1>
        <p className="mt-4 text-base font-semibold leading-7 text-cyan-50">
          一般的なおすすめではなく、時間価値・家族構成・予算・混雑・天気を掛け合わせて、あなたにとって今もっともROIの高い選択肢を比較します。
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <ValueChip label="基本設定" value="2分" />
          <ValueChip label="候補比較" value="3件" />
          <ValueChip label="保存" value="自動" />
        </div>
      </div>
      <div className="panel p-4 sm:p-6">
        <h2 className="text-2xl font-black text-night">何を入力するサービスか</h2>
        <div className="mt-4 grid gap-3">
          {[
            ["基本設定", "生活条件、時間価値、家族構成、行動の価値観を保存します。"],
            ["今回の希望", "誰と何をしたいか、予算、使える時間、重視点を選びます。"],
            ["東京の状況", "混雑、天気、交通、施設情報をデモデータとして反映します。"]
          ].map(([title, body]) => (
            <article key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="font-black text-night">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button className="primary-button" onClick={onStart}>はじめる <ArrowRight size={18} /></button>
          <button className="secondary-button" onClick={onDemo}>デモ設定で試す</button>
        </div>
      </div>
    </section>
  );
}

function ProfileSetup({
  profile,
  estimatedTimeValue,
  onChange,
  onSave,
  onUseDemo
}: {
  profile: UserProfile;
  estimatedTimeValue: number;
  onChange: <T extends keyof UserProfile>(key: T, value: UserProfile[T]) => void;
  onSave: () => void;
  onUseDemo: () => void;
}) {
  const selectedPriorities = profile.priorities.join("、");
  function updateAndEstimate<T extends keyof UserProfile>(key: T, value: UserProfile[T]) {
    const nextProfile = { ...profile, [key]: value };
    onChange(key, value);
    if (key !== "timeValuePerHour") {
      onChange("timeValuePerHour", estimateTimeValue(nextProfile));
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
      <aside className="panel p-4 sm:p-6">
        <p className="section-kicker">Profile</p>
        <h1 className="mt-1 text-2xl font-black text-night sm:text-3xl">基本設定</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          あなたの生活条件や価値観をもとに、時間・費用・快適さを比較します。設定内容は後から変更できます。
        </p>
        <div className="mt-4 rounded-2xl bg-night p-4 text-white">
          <span className="text-xs font-black text-cyan-100">あなたの1時間の推定価値</span>
          <strong className="mt-1 block text-4xl font-black text-signal">{formatYen(profile.timeValuePerHour || estimatedTimeValue)}</strong>
          <p className="mt-2 text-sm font-semibold leading-6 text-cyan-50">正確な金額ではなく、時間価値の推定にのみ使用します。</p>
        </div>
        <RangeField
          label="時間価値を調整"
          value={profile.timeValuePerHour || estimatedTimeValue}
          min={1000}
          max={7000}
          step={100}
          unit="円/h"
          onChange={(value) => updateAndEstimate("timeValuePerHour", value)}
        />
        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm font-bold leading-6 text-night">
          現在の優先順位: {selectedPriorities}
        </div>
      </aside>

      <div className="panel p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="居住エリア" value={profile.residentArea} placeholder="例: 松戸" onChange={(value) => updateAndEstimate("residentArea", value)} />
          <TextField label="勤務エリア" value={profile.workArea} placeholder="例: 東京23区" onChange={(value) => updateAndEstimate("workArea", value)} />
        </div>
        <ChoiceGroup title="年収帯" values={incomeOptions} active={profile.incomeRange} onChange={(value) => updateAndEstimate("incomeRange", value as IncomeRange)} columns="grid-cols-2 sm:grid-cols-3" />
        <p className="mt-2 text-xs font-bold text-slate-500">正確な金額ではなく、時間価値の推定にのみ使用します。</p>
        <ChoiceGroup title="家族構成" values={familyOptions} active={profile.familyStructure} onChange={(value) => updateAndEstimate("familyStructure", value as FamilyStructure)} columns="grid-cols-2 sm:grid-cols-3" />
        <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr]">
          <RangeField label="子どもの人数" value={profile.childrenCount} min={0} max={4} step={1} unit="人" onChange={(value) => updateAndEstimate("childrenCount", value)} />
          <MultiChoice title="子どもの年代" values={childAgeOptions} active={profile.childAges} onChange={(values) => updateAndEstimate("childAges", values as ChildAge[])} />
        </div>
        <MultiChoice title="主な移動手段" values={transportOptions} active={profile.transportModes} onChange={(values) => updateAndEstimate("transportModes", values as TransportMode[])} />
        <MultiChoice title="時間・費用・快適さの優先順位" values={priorityOptions} active={profile.priorities} max={3} onChange={(values) => updateAndEstimate("priorities", values as ValuePriority[])} />
        <ChoiceGroup title="混雑を避けたい度合い" values={avoidanceOptions} active={profile.crowdAvoidance} onChange={(value) => updateAndEstimate("crowdAvoidance", value as AvoidanceLevel)} />
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button className="secondary-button" onClick={onUseDemo}>デモ設定を入れる</button>
          <button className="primary-button" onClick={onSave}>基本設定を保存する <ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function ProfileReview({ profile, estimatedTimeValue, onChange, onReset, onNext }: { profile: UserProfile; estimatedTimeValue: number; onChange: () => void; onReset: () => void; onNext: () => void }) {
  return (
    <section className="panel p-4 sm:p-6">
      <p className="section-kicker">Saved Profile</p>
      <h1 className="mt-1 text-2xl font-black text-night">設定済みのプロフィール</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileFact label="居住/勤務" value={`${profile.residentArea || "未設定"} / ${profile.workArea || "未設定"}`} />
        <ProfileFact label="家族構成" value={`${profile.familyStructure}・子ども${profile.childrenCount}人`} />
        <ProfileFact label="時間価値" value={formatYen(profile.timeValuePerHour || estimatedTimeValue)} />
        <ProfileFact label="混雑回避" value={profile.crowdAvoidance} />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button className="secondary-button" onClick={onChange}>設定を変更</button>
        <button className="secondary-button" onClick={onReset}><RotateCcw size={17} /> リセット</button>
        <button className="primary-button" onClick={onNext}>今回の希望へ</button>
      </div>
    </section>
  );
}

function WishInput({
  profile,
  wish,
  isLoading,
  onChange,
  onSubmit,
  onProfile
}: {
  profile: UserProfile;
  wish: CurrentWish;
  isLoading: boolean;
  onChange: <T extends keyof CurrentWish>(key: T, value: CurrentWish[T]) => void;
  onSubmit: () => void;
  onProfile: () => void;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
      <aside className="panel p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="section-kicker">Today</p>
            <h1 className="mt-1 text-2xl font-black text-night">今回の希望</h1>
          </div>
          <button className="icon-text-button min-h-11" onClick={onProfile}><Settings2 size={16} /> 設定</button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {profile.residentArea || "現在地"} から、誰と何をしたいかを選ぶだけで候補を並べ替えます。
        </p>
        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
          <span className="text-xs font-black text-slate-500">使用中の時間価値</span>
          <strong className="mt-1 block text-2xl font-black text-night">{formatYen(profile.timeValuePerHour)} / 時間</strong>
        </div>
      </aside>

      <div className="panel p-4 sm:p-6">
        <ChoiceGroup title="誰と行動するか" values={companionOptions} active={wish.companion} onChange={(value) => onChange("companion", value as Companion)} />
        <ChoiceGroup title="目的" values={purposeOptions} active={wish.purpose} onChange={(value) => onChange("purpose", value as WishPurpose)} columns="grid-cols-2 sm:grid-cols-4" />
        <ChoiceGroup title="使える時間" values={timeOptions} active={wish.availableTime} onChange={(value) => onChange("availableTime", value as AvailableTime)} columns="grid-cols-2 sm:grid-cols-4" />
        <ChoiceGroup title="予算" values={budgetOptions} active={wish.budget} onChange={(value) => onChange("budget", value as BudgetRange)} columns="grid-cols-2 sm:grid-cols-5" />
        <ChoiceGroup title="今回もっとも重視すること" values={focusOptions} active={wish.focus} onChange={(value) => onChange("focus", value as WishFocus)} columns="grid-cols-2 sm:grid-cols-3" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField label="出発地点" value={wish.startPoint} placeholder="例: 松戸駅" onChange={(value) => onChange("startPoint", value)} icon={<MapPin size={17} />} />
          <label className="field-label">
            <span>行動予定日時</span>
            <input className="text-field" type="datetime-local" value={wish.plannedDateTime} onChange={(event) => onChange("plannedDateTime", event.target.value)} />
          </label>
        </div>
        <button className="primary-button mt-5 w-full" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "あなた向けに並べ替えています..." : "ROIの高い候補を見る"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </div>
    </section>
  );
}

function OpenDataSection() {
  return (
    <section className="mt-4 pb-[env(safe-area-inset-bottom)]">
      <details className="panel p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-black text-night"><Database size={18} className="text-aqua" /> 利用予定データ</span>
          <span className="text-xs font-bold text-slate-500">現在はデモデータ</span>
        </summary>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          現在はデモデータを使用しています。今後、東京都のオープンデータや公共交通オープンデータ、気象情報、施設情報APIと接続する想定です。
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {openDataSources.map((source) => (
            <article key={source.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-black text-night">{source.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{source.data}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-aqua">{source.usage}</p>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}

function TextField({ label, value, placeholder, icon, onChange }: { label: string; value: string; placeholder?: string; icon?: React.ReactNode; onChange: (value: string) => void }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <span className="relative block">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input className={`text-field ${icon ? "pl-10" : ""}`} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  );
}

function ChoiceGroup({ title, values, active, columns = "grid-cols-3", onChange }: { title: string; values: string[]; active: string; columns?: string; onChange: (value: string) => void }) {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-black text-night">{title}</h3>
      <div className={`grid gap-2 ${columns}`}>
        {values.map((value) => (
          <button key={value} className={`choice-button ${active === value ? "is-active" : ""}`} onClick={() => onChange(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiChoice({ title, values, active, max, onChange }: { title: string; values: string[]; active: string[]; max?: number; onChange: (value: string[]) => void }) {
  function toggle(value: string) {
    if (active.includes(value)) {
      onChange(active.filter((item) => item !== value));
      return;
    }
    const next = max && active.length >= max ? [...active.slice(1), value] : [...active, value];
    onChange(next);
  }

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-black text-night">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {values.map((value) => (
          <button key={value} className={`choice-button ${active.includes(value) ? "is-active" : ""}`} onClick={() => toggle(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeField({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="mt-4 block">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <strong className="mt-1 block text-lg font-black text-night">{value.toLocaleString("ja-JP")}{unit}</strong>
      <input className="mt-2 h-8 w-full accent-cyan-600" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function ValueChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/12 p-3">
      <span className="block text-xs font-black text-cyan-100">{label}</span>
      <strong className="mt-1 block text-xl font-black text-signal">{value}</strong>
    </div>
  );
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="block text-xs font-black text-slate-500">{label}</span>
      <strong className="mt-1 block text-base font-black text-night">{value}</strong>
    </div>
  );
}
