import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Clock, Layers, LineChart, Settings2, Sparkles } from "lucide-react";
import { scenarios } from "./lib/mockData";
import { calculateTimeValue, formatYen, scoreOptions } from "./lib/scoring";
import type { Busyness, FamilyStatus, FreeTime, IncomePreset, Scenario, ScenarioId, ScoredOption, Step, UserProfile } from "./types";
import { ComparisonDashboard } from "./components/ComparisonDashboard";
import { DetailModal } from "./components/DetailModal";

const steps: { id: Step; label: string }[] = [
  { id: "profile", label: "1. 時間価値設定" },
  { id: "scenario", label: "2. シーン選択" },
  { id: "comparison", label: "3. 比較" },
  { id: "comparison", label: "4. 詳細" }
];

const incomePresets: { label: string; value: IncomePreset; amount: number }[] = [
  { label: "300万円", value: 300, amount: 3000000 },
  { label: "500万円", value: 500, amount: 5000000 },
  { label: "700万円", value: 700, amount: 7000000 },
  { label: "1000万円", value: 1000, amount: 10000000 },
  { label: "自由入力", value: "custom", amount: 7200000 }
];

const defaultProfile: UserProfile = {
  annualIncome: 5000000,
  incomePreset: 500,
  freeTime: "少ない",
  busyness: "忙しい",
  familyStatus: "子育て中"
};

export default function App() {
  const [step, setStep] = useState<Step>("hero");
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [scenarioId, setScenarioId] = useState<ScenarioId>("shopping");
  const [manualTimeValue, setManualTimeValue] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<ScoredOption | null>(null);

  const calculatedTimeValue = useMemo(() => calculateTimeValue(profile), [profile]);
  const timeValue = manualTimeValue ?? calculatedTimeValue;
  const orderedScenarios = useMemo(() => {
    const order: ScenarioId[] = ["shopping", "mobility", "admin", "family"];
    return [...scenarios].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, []);
  const activeScenario = orderedScenarios.find((scenario) => scenario.id === scenarioId) ?? orderedScenarios[0];
  const scoredOptions = useMemo(() => scoreOptions(activeScenario.options, timeValue), [activeScenario, timeValue]);
  const recommended = scoredOptions[0];

  function updateIncome(preset: IncomePreset) {
    const selected = incomePresets.find((item) => item.value === preset);
    setManualTimeValue(null);
    setProfile((current) => ({
      ...current,
      incomePreset: preset,
      annualIncome: selected?.amount ?? current.annualIncome
    }));
  }

  function updateProfile<T extends keyof UserProfile>(key: T, value: UserProfile[T]) {
    setManualTimeValue(null);
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-ink">
      <Header step={step} setStep={setStep} />
      {step === "hero" && <Hero onStart={() => setStep("profile")} onJump={() => setStep("comparison")} />}
      {step === "profile" && (
        <TimeValueSetup
          profile={profile}
          timeValue={timeValue}
          onIncome={updateIncome}
          onProfile={updateProfile}
          onCustomIncome={(value) => updateProfile("annualIncome", value)}
          onPresetTimeValue={setManualTimeValue}
          onNext={() => setStep("scenario")}
        />
      )}
      {step === "scenario" && (
        <ScenarioSelector
          availableScenarios={orderedScenarios}
          activeScenario={activeScenario}
          onSelect={(scenario) => {
            setScenarioId(scenario.id);
            setStep("comparison");
          }}
        />
      )}
      {step === "comparison" && (
        <ComparisonDashboard
          scenario={activeScenario}
          scenarios={orderedScenarios}
          timeValue={timeValue}
          calculatedTimeValue={calculatedTimeValue}
          scoredOptions={scoredOptions}
          recommended={recommended}
          onScenarioChange={setScenarioId}
          onTimeValueChange={setManualTimeValue}
          onOpenDetail={setSelectedOption}
          onBackProfile={() => setStep("profile")}
        />
      )}
      {selectedOption && (
        <DetailModal option={selectedOption} scenario={activeScenario} onClose={() => setSelectedOption(null)} />
      )}
    </div>
  );
}

function Header({ step, setStep }: { step: Step; setStep: (step: Step) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-5 lg:py-4">
        <button className="flex items-center gap-3 text-left" onClick={() => setStep("hero")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-night text-white shadow-glow sm:h-10 sm:w-10">
            <LineChart size={21} />
          </span>
          <span>
            <span className="block text-base font-black tracking-tight sm:text-lg">Tokyo Life ROI</span>
            <span className="hidden text-sm text-slate-500 sm:block">最安ではなく、あなたにとっての最適へ。</span>
          </span>
        </button>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1.5 text-xs font-black text-night md:hidden">
          {step === "hero" ? "Top" : step === "profile" ? "1/4 設定" : step === "scenario" ? "2/4 シーン" : "3/4 比較"}
        </div>
        <nav className="hidden grid-cols-2 gap-2 md:grid lg:flex">
          {steps.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              onClick={() => setStep(item.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                step === item.id
                  ? "border-aqua bg-cyan-50 text-night"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ onStart, onJump }: { onStart: () => void; onJump: () => void }) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <section className="hero-scene">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-5 sm:py-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-2 text-xs font-bold text-night shadow-sm sm:mb-5 sm:px-4 sm:text-sm">
              <Sparkles size={16} className="text-aqua" />
              最安ではなく、あなたにとっての最適へ。
            </div>
            <h1 className="max-w-4xl text-[42px] font-black leading-[1.04] tracking-normal text-night sm:text-5xl md:text-7xl">
              Tokyo Life ROI
            </h1>
            <p className="mt-3 max-w-3xl text-xl font-bold leading-snug text-slate-800 sm:mt-5 sm:text-2xl sm:leading-relaxed md:text-3xl">
              個人の最適が、東京全体の快適につながる。
            </p>
            <p className="mt-4 hidden max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8 md:block">
              価格・時間・移動・混雑・疲労・リスクを統合し、東京で暮らす人・働く人の納得ある選択を支援します。
            </p>
            <div className="mt-4 rounded-xl border-l-4 border-signal bg-white/86 p-3 text-lg font-black leading-snug text-night shadow-sm sm:mt-8 sm:p-5 sm:text-2xl">
              同じ500円、同じ30分。でも価値は人によって違う。
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:mt-8 sm:flex-row">
              <button className="primary-button" onClick={onStart}>
                デモを始める <ArrowRight size={18} />
              </button>
              <button className="secondary-button hidden sm:inline-flex" onClick={onJump}>
                Life ROIを見る <LineChart size={18} />
              </button>
            </div>
            <details className="mt-3 rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 md:hidden">
              <summary className="cursor-pointer font-black text-night">詳しく見る</summary>
              <p className="mt-2 leading-6">
                価格・時間・混雑などを統合し、空いている代替候補も提示します。あなたにとって合理的な選択が、自然な行動分散にもつながります。
              </p>
            </details>
          </div>
          <div className="dashboard-preview hidden md:block" aria-label="Tokyo Life ROI dashboard preview">
            <div className="preview-topline">
              <span>Life ROI DEMO</span>
              <span>Tokyo / 18:40</span>
            </div>
            <div className="preview-score">
              <span>推奨</span>
              <strong>近隣の空いている店舗</strong>
              <b>92</b>
            </div>
            <div className="preview-bars">
              <span style={{ width: "92%" }} />
              <span style={{ width: "67%" }} />
              <span style={{ width: "48%" }} />
            </div>
            <div className="preview-map">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>
      <section className="mobile-value-strip mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 pb-5 sm:px-5 sm:pb-14 md:-mt-4 md:grid-cols-3 md:gap-4">
        {[
          ["価格だけでなく時間も", "支払額・移動・待ち時間を同じ軸で比較します。", Clock],
          ["空いている代替候補", "混雑を避けやすい選択の幅を広げます。", Settings2],
          ["自然な行動分散", "個人の合理的な選択が東京の快適にもつながります。", BadgeCheck]
        ].map(([title, body, Icon]) => (
          <article key={String(title)} className="feature-card">
            <Icon className="text-aqua" size={24} />
            <h2>{title as string}</h2>
            <p>{body as string}</p>
          </article>
        ))}
      </section>
      <OpenDataSection />
    </main>
  );
}

function TimeValueSetup({
  profile,
  timeValue,
  onIncome,
  onProfile,
  onCustomIncome,
  onPresetTimeValue,
  onNext
}: {
  profile: UserProfile;
  timeValue: number;
  onIncome: (preset: IncomePreset) => void;
  onProfile: <T extends keyof UserProfile>(key: T, value: UserProfile[T]) => void;
  onCustomIncome: (value: number) => void;
  onPresetTimeValue: (value: number | null) => void;
  onNext: () => void;
}) {
  const timeModes = [
    { label: "ゆとり", value: 1000 },
    { label: "標準", value: 2000 },
    { label: "多忙", value: 3500 },
    { label: "超多忙", value: 5000 }
  ];

  return (
    <main className="mx-auto grid min-h-[calc(100dvh-58px)] max-w-7xl gap-4 px-4 py-4 sm:px-5 sm:py-10 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="panel mobile-profile-card p-4 md:hidden">
        <p className="section-kicker">Time Value</p>
        <h1 className="text-2xl font-black leading-tight text-night">あなたの時間価値</h1>
        <div className="mt-3 rounded-xl bg-night p-4 text-white">
          <span className="text-xs font-bold text-cyan-100">現在の推定</span>
          <div className="mt-1 text-4xl font-black leading-tight">{formatYen(timeValue)} / 時間</div>
          <div className="mt-1 text-sm font-semibold text-cyan-100">30分：約{formatYen(Math.round(timeValue / 2))}</div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {timeModes.map((mode) => (
            <button
              key={mode.label}
              className={`choice-button ${Math.abs(timeValue - mode.value) < 100 ? "is-active" : ""}`}
              onClick={() => onPresetTimeValue(mode.value)}
            >
              <span className="block text-sm">{mode.label}モード</span>
              <span className="block text-xs font-bold text-slate-500">{formatYen(mode.value)} / h</span>
            </button>
          ))}
        </div>
        <details className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
          <summary className="cursor-pointer text-sm font-black text-night">詳細設定</summary>
          <div className="mt-3">
            <ProfileFields
              profile={profile}
              onIncome={onIncome}
              onProfile={onProfile}
              onCustomIncome={onCustomIncome}
              onAnyChange={() => onPresetTimeValue(null)}
            />
          </div>
        </details>
        <button className="primary-button mt-3 w-full justify-center" onClick={onNext}>
          シーンを選ぶ <ArrowRight size={18} />
        </button>
      </section>

      <section className="panel hidden p-5 sm:p-7 md:block">
        <p className="section-kicker">Time Value</p>
        <h1 className="section-title">あなたが1時間を取り戻すために払ってもよい金額</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          年収だけで価値を決めず、自由時間・今日の忙しさ・家族状況を合わせて、今の生活文脈に近い時間価値を作ります。
        </p>
        <div className="mt-6 rounded-xl bg-night p-5 text-white sm:mt-7 sm:p-6">
          <span className="text-sm font-bold text-cyan-100">あなたの時間価値</span>
          <div className="mt-2 text-4xl font-black leading-tight sm:text-5xl">{formatYen(timeValue)} / 時間</div>
          <div className="mt-3 text-lg font-semibold text-cyan-100">30分の価値：約{formatYen(Math.round(timeValue / 2))}</div>
        </div>
        <button className="primary-button mt-7 w-full justify-center" onClick={onNext}>
          シーンを選ぶ <ArrowRight size={18} />
        </button>
      </section>
      <section className="panel hidden p-5 sm:p-7 md:block">
        <ProfileFields profile={profile} onIncome={onIncome} onProfile={onProfile} onCustomIncome={onCustomIncome} />
      </section>
    </main>
  );
}

function ScenarioSelector({
  availableScenarios,
  activeScenario,
  onSelect
}: {
  availableScenarios: Scenario[];
  activeScenario: Scenario;
  onSelect: (scenario: Scenario) => void;
}) {
  return (
    <main className="mx-auto min-h-[calc(100dvh-58px)] max-w-7xl px-4 py-4 sm:px-5 sm:py-10">
      <div className="mb-4 flex flex-col justify-between gap-3 md:mb-8 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Scenario</p>
          <h1 className="section-title">東京には選択肢が多い。だからこそ、選ぶ時間を減らす。</h1>
        </div>
        <p className="hidden max-w-xl text-lg leading-8 text-slate-600 md:block">
          今回のメインデモは買い物です。他の生活シーンも同じLife ROI軸で比較できます。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
        {availableScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className={`scenario-card ${activeScenario.id === scenario.id ? "is-active" : ""}`}
          >
            <ScenarioIcon scenario={scenario} />
            <span className="mt-3 block text-xl font-black text-night md:mt-5 md:text-2xl">{scenario.title}</span>
            <span className="mt-1 block truncate text-left text-sm leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">{scenario.description}</span>
            <span className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-cyan-50 px-3 text-sm font-black text-aqua md:mt-6 md:min-h-11">
              比較する <ArrowRight size={16} />
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}

function OpenDataSection() {
  const dataSources = [
    ["東京都オープンデータカタログ", "公共施設・公園・子育て施設・AED等", "代替候補、安心度、公共資源活用"],
    ["公共交通オープンデータ", "駅・時刻表・運行情報・バスロケーション", "移動時間、遅延、移動負荷"],
    ["東京都区部 消費者物価指数", "食料・交通・日用品の物価動向", "物価高背景、生活コスト補正"],
    ["区市町村の地域データ", "地域施設・子育て・防災関連データ", "生活圏内の候補提示、安心度"]
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-5 md:pb-16">
      <details className="rounded-xl border border-slate-200 bg-white p-4 md:hidden">
        <summary className="cursor-pointer font-black text-night">活用予定のオープンデータ</summary>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          東京都や公共交通のオープンデータを活用し、施設・移動・物価・公共サービスを比較可能な選択肢として構造化する予定です。
        </p>
      </details>
      <div className="hidden md:block">
        <div className="mb-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">Open Data</p>
            <h2 className="section-title">活用予定のオープンデータ</h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            東京都オープンデータカタログや公共交通オープンデータ等を活用し、東京の施設・移動・物価・公共サービスを比較可能な選択肢として構造化します。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dataSources.map(([title, data, use]) => (
            <article key={title} className="panel p-5">
              <span className="recommend-pill">活用予定</span>
              <h3 className="mt-3 text-lg font-black text-night">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{data}</p>
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm font-bold leading-6 text-aqua">用途：{use}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="panel p-5">
            <h3 className="text-lg font-black text-night">この選択が東京にもたらす効果</h3>
            <p className="mt-2 leading-7 text-slate-600">混雑しやすい場所への集中を避け、近隣の空いている資源を活用し、不要な移動や消費の偏りを自然に緩和します。</p>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-black text-night">既存サービスとの違い</h3>
            <p className="mt-2 leading-7 text-slate-600">地図アプリは移動時間を、価格比較は支払額を出す。Tokyo Life ROI は、あなたにとって納得できる意思決定を提示します。</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function ScenarioIcon({ scenario }: { scenario: Scenario }) {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-lg bg-night text-white">
      <Layers size={22} />
    </span>
  );
}

function ProfileFields({
  profile,
  onIncome,
  onProfile,
  onCustomIncome,
  onAnyChange
}: {
  profile: UserProfile;
  onIncome: (preset: IncomePreset) => void;
  onProfile: <T extends keyof UserProfile>(key: T, value: UserProfile[T]) => void;
  onCustomIncome: (value: number) => void;
  onAnyChange?: () => void;
}) {
  function handleIncome(preset: IncomePreset) {
    onAnyChange?.();
    onIncome(preset);
  }

  function handleProfile<T extends keyof UserProfile>(key: T, value: UserProfile[T]) {
    onAnyChange?.();
    onProfile(key, value);
  }

  function handleCustomIncome(value: number) {
    onAnyChange?.();
    onCustomIncome(value);
  }

  return (
    <>
      <FormBlock title="年収レンジ">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {incomePresets.map((item) => (
            <button
              key={item.label}
              className={`choice-button ${profile.incomePreset === item.value ? "is-active" : ""}`}
              onClick={() => handleIncome(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {profile.incomePreset === "custom" && (
          <label className="mt-3 block">
            <span className="text-sm font-bold text-slate-500">自由入力（円）</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-bold outline-none focus:border-aqua"
              type="number"
              min={1000000}
              step={100000}
              value={profile.annualIncome}
              onChange={(event) => handleCustomIncome(Number(event.target.value))}
            />
          </label>
        )}
      </FormBlock>
      <FormBlock title="1週間の自由時間">
        <Segmented
          values={["少ない", "普通", "多い"]}
          active={profile.freeTime}
          onChange={(value) => handleProfile("freeTime", value as FreeTime)}
        />
      </FormBlock>
      <FormBlock title="今日の忙しさ">
        <Segmented
          values={["余裕あり", "普通", "忙しい", "とても忙しい"]}
          active={profile.busyness}
          onChange={(value) => handleProfile("busyness", value as Busyness)}
        />
      </FormBlock>
      <FormBlock title="家族状況">
        <Segmented
          values={["一人暮らし", "夫婦", "子育て中", "介護あり"]}
          active={profile.familyStatus}
          onChange={(value) => handleProfile("familyStatus", value as FamilyStatus)}
        />
      </FormBlock>
    </>
  );
}

function FormBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <h2 className="mb-3 text-base font-black text-night">{title}</h2>
      {children}
    </div>
  );
}

function Segmented({ values, active, onChange }: { values: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {values.map((value) => (
        <button key={value} className={`choice-button ${active === value ? "is-active" : ""}`} onClick={() => onChange(value)}>
          {value}
        </button>
      ))}
    </div>
  );
}
