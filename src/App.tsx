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
  const activeScenario = scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
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
          timeValue={calculatedTimeValue}
          onIncome={updateIncome}
          onProfile={updateProfile}
          onCustomIncome={(value) => updateProfile("annualIncome", value)}
          onNext={() => setStep("scenario")}
        />
      )}
      {step === "scenario" && (
        <ScenarioSelector
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
          scenarios={scenarios}
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
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:py-4">
        <button className="flex items-center gap-3 text-left" onClick={() => setStep("hero")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-night text-white shadow-glow sm:h-10 sm:w-10">
            <LineChart size={21} />
          </span>
          <span>
            <span className="block text-base font-black tracking-tight sm:text-lg">Tokyo Life ROI</span>
            <span className="hidden text-sm text-slate-500 sm:block">最安ではなく、あなたにとっての最適へ。</span>
          </span>
        </button>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-night md:hidden">
          {step === "hero" ? "コンセプト" : steps.find((item) => item.id === step)?.label ?? "比較"}
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
    <main className="relative overflow-hidden">
      <section className="hero-scene">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-5 sm:py-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-2 text-sm font-bold text-night shadow-sm sm:mb-5 sm:px-4">
              <Sparkles size={16} className="text-aqua" />
              価格だけでは見えない、東京生活の実質コスト。
            </div>
            <h1 className="max-w-4xl text-[42px] font-black leading-[1.04] tracking-normal text-night sm:text-5xl md:text-7xl">
              Tokyo Life ROI
            </h1>
            <p className="mt-4 max-w-3xl text-xl font-bold leading-relaxed text-slate-800 sm:mt-5 sm:text-2xl md:text-3xl">
              東京生活の「最適な選択」を、あなたの時間価値で可視化する。
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              価格・時間・移動・混雑・疲労・手戻りリスクを統合し、都民と東京で働く人の意思決定を支援します。
            </p>
            <div className="mt-6 rounded-xl border-l-4 border-signal bg-white/86 p-4 text-xl font-black leading-snug text-night shadow-sm sm:mt-8 sm:p-5 sm:text-2xl">
              同じ500円、同じ30分。でも価値は人によって違う。
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <button className="primary-button" onClick={onStart}>
                デモを始める <ArrowRight size={18} />
              </button>
              <button className="secondary-button" onClick={onJump}>
                Life ROIを見る <LineChart size={18} />
              </button>
            </div>
          </div>
          <div className="dashboard-preview" aria-label="Tokyo Life ROI dashboard preview">
            <div className="preview-topline">
              <span>Life ROI DEMO</span>
              <span>Tokyo / 18:40</span>
            </div>
            <div className="preview-score">
              <span>推奨</span>
              <strong>まとめ買い配送</strong>
              <b>91</b>
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
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-10 sm:px-5 sm:pb-14 md:-mt-4 md:grid-cols-3">
        {[
          ["価格だけでなく時間も比較", "支払額・移動・待ち時間を同じ軸に置き、実質生活コストを可視化します。", Clock],
          ["あなたの時間価値でパーソナライズ", "忙しさや家族状況に応じて、1時間を取り戻す価値を調整します。", Settings2],
          ["最安ではなく最適を提案", "混雑・疲労・手戻りリスクまで含め、納得できる理由を提示します。", BadgeCheck]
        ].map(([title, body, Icon]) => (
          <article key={String(title)} className="feature-card">
            <Icon className="text-aqua" size={24} />
            <h2>{title as string}</h2>
            <p>{body as string}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function TimeValueSetup({
  profile,
  timeValue,
  onIncome,
  onProfile,
  onCustomIncome,
  onNext
}: {
  profile: UserProfile;
  timeValue: number;
  onIncome: (preset: IncomePreset) => void;
  onProfile: <T extends keyof UserProfile>(key: T, value: UserProfile[T]) => void;
  onCustomIncome: (value: number) => void;
  onNext: () => void;
}) {
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-5 sm:py-10 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="panel p-5 sm:p-7">
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
      <section className="panel p-5 sm:p-7">
        <FormBlock title="年収レンジ">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {incomePresets.map((item) => (
              <button
                key={item.label}
                className={`choice-button ${profile.incomePreset === item.value ? "is-active" : ""}`}
                onClick={() => onIncome(item.value)}
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
                onChange={(event) => onCustomIncome(Number(event.target.value))}
              />
            </label>
          )}
        </FormBlock>
        <FormBlock title="1週間の自由時間">
          <Segmented
            values={["少ない", "普通", "多い"]}
            active={profile.freeTime}
            onChange={(value) => onProfile("freeTime", value as FreeTime)}
          />
        </FormBlock>
        <FormBlock title="今日の忙しさ">
          <Segmented
            values={["余裕あり", "普通", "忙しい", "とても忙しい"]}
            active={profile.busyness}
            onChange={(value) => onProfile("busyness", value as Busyness)}
          />
        </FormBlock>
        <FormBlock title="家族状況">
          <Segmented
            values={["一人暮らし", "夫婦", "子育て中", "介護あり"]}
            active={profile.familyStatus}
            onChange={(value) => onProfile("familyStatus", value as FamilyStatus)}
          />
        </FormBlock>
      </section>
    </main>
  );
}

function ScenarioSelector({ activeScenario, onSelect }: { activeScenario: Scenario; onSelect: (scenario: Scenario) => void }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Scenario</p>
          <h1 className="section-title">東京には選択肢が多い。だからこそ、選ぶ時間を減らす。</h1>
        </div>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          今回のメインデモは買い物です。他の生活シーンも同じLife ROI軸で比較できます。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className={`scenario-card ${activeScenario.id === scenario.id ? "is-active" : ""}`}
          >
            <ScenarioIcon scenario={scenario} />
            <span className="mt-5 block text-2xl font-black text-night">{scenario.title}</span>
            <span className="mt-3 block text-left text-base leading-7 text-slate-600">{scenario.description}</span>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan-50 px-3 text-sm font-black text-aqua">
              比較する <ArrowRight size={16} />
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}

function ScenarioIcon({ scenario }: { scenario: Scenario }) {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-lg bg-night text-white">
      <Layers size={22} />
    </span>
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
