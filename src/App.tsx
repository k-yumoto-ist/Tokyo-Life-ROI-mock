import { useMemo, useState } from "react";
import { ArrowRight, Database, MapPin, Settings2, TrainFront } from "lucide-react";
import { ComparisonDashboard } from "./components/ComparisonDashboard";
import { defaultConditions, openDataSources, personalImpact, routeOptions, tokyoImpact } from "./lib/mockData";
import { calculateTimeValuePerMinute, formatYen, scoreRouteOptions } from "./lib/scoring";
import type { CrowdAvoidanceLevel, PriorityMode, Step, TravelConditions, TravelPurpose } from "./types";

const purposeOptions: TravelPurpose[] = ["通勤", "仕事の移動", "買い物", "お出かけ"];
const priorityOptions: PriorityMode[] = ["時間優先", "バランス", "費用優先"];
const crowdOptions: CrowdAvoidanceLevel[] = ["気にしない", "できれば避けたい", "できるだけ避けたい"];

export default function App() {
  const [conditions, setConditions] = useState<TravelConditions>(defaultConditions);
  const [step, setStep] = useState<Step>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSelectedRoute, setHasSelectedRoute] = useState(false);

  const scoredRoutes = useMemo(() => scoreRouteOptions(routeOptions, conditions), [conditions]);
  const recommended = scoredRoutes[0];
  const timeValuePerMinute = useMemo(() => calculateTimeValuePerMinute(conditions), [conditions]);

  function updateCondition<T extends keyof TravelConditions>(key: T, value: TravelConditions[T]) {
    setConditions((current) => ({ ...current, [key]: value }));
    setHasSelectedRoute(false);
  }

  function compareRoutes() {
    setIsLoading(true);
    setHasSelectedRoute(false);
    window.setTimeout(() => {
      setIsLoading(false);
      setStep("results");
    }, 620);
  }

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-ink">
      <Header step={step} onReset={() => setStep("input")} />
      <main className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-5 lg:pb-12">
        {step === "input" ? (
          <MobilityInput
            conditions={conditions}
            timeValuePerMinute={timeValuePerMinute}
            isLoading={isLoading}
            onChange={updateCondition}
            onCompare={compareRoutes}
          />
        ) : (
          <ComparisonDashboard
            conditions={conditions}
            scoredRoutes={scoredRoutes}
            recommended={recommended}
            personalImpact={personalImpact}
            tokyoImpact={tokyoImpact}
            hasSelectedRoute={hasSelectedRoute}
            onSelectRoute={() => setHasSelectedRoute(true)}
            onBack={() => setStep("input")}
            onChange={updateCondition}
            onRecompare={compareRoutes}
          />
        )}
        <OpenDataSection compact={step === "results"} />
      </main>
    </div>
  );
}

function Header({ step, onReset }: { step: Step; onReset: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
        <button className="flex min-w-0 items-center gap-3 text-left" onClick={onReset}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-night text-white shadow-glow">
            <TrainFront size={22} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black tracking-tight sm:text-lg">Tokyo Life ROI</span>
            <span className="block truncate text-xs font-bold text-slate-500 sm:text-sm">あなたの時間と、東京の混雑を最適化</span>
          </span>
        </button>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black text-night">
          {step === "input" ? "1/3 条件入力" : "2/3 比較結果"}
        </span>
      </div>
    </header>
  );
}

function MobilityInput({
  conditions,
  timeValuePerMinute,
  isLoading,
  onChange,
  onCompare
}: {
  conditions: TravelConditions;
  timeValuePerMinute: number;
  isLoading: boolean;
  onChange: <T extends keyof TravelConditions>(key: T, value: TravelConditions[T]) => void;
  onCompare: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100dvh-72px)] gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="rounded-2xl bg-night p-5 text-white shadow-glow sm:p-7 lg:p-9">
        <p className="section-kicker text-cyan-100">Mobility Decision</p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal sm:text-5xl">
          あなたに合う移動で、混雑のピークを避ける。
        </h1>
        <p className="mt-4 text-base font-semibold leading-7 text-cyan-50 sm:text-lg">
          移動時間・費用・混雑を比較して、快適さと余裕を取り戻す移動案を提案します。
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <ValueChip label="比較" value="3案" />
          <ValueChip label="混雑回避" value="8分" />
          <ValueChip label="到着" value="9:24" />
        </div>
      </div>

      <div className="panel p-4 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="section-kicker">Trip Conditions</p>
            <h2 className="mt-1 text-2xl font-black text-night sm:text-3xl">移動条件を入力</h2>
          </div>
          <button
            className="icon-text-button min-h-11"
            onClick={() => {
              (Object.keys(defaultConditions) as Array<keyof TravelConditions>).forEach((key) => onChange(key, defaultConditions[key]));
            }}
            type="button"
          >
            初期値
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="出発地" value={conditions.origin} onChange={(value) => onChange("origin", value)} icon={<MapPin size={18} />} />
          <TextField label="目的地" value={conditions.destination} onChange={(value) => onChange("destination", value)} icon={<MapPin size={18} />} />
          <label className="field-label">
            <span>到着希望時刻</span>
            <input
              className="text-field"
              type="time"
              value={conditions.arrivalTime}
              onChange={(event) => onChange("arrivalTime", event.target.value)}
            />
          </label>
          <label className="field-label">
            <span>移動目的</span>
            <select
              className="text-field"
              value={conditions.purpose}
              onChange={(event) => onChange("purpose", event.target.value as TravelPurpose)}
            >
              {purposeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <ChoiceGroup
          title="時間と費用の優先度"
          values={priorityOptions}
          active={conditions.priority}
          onChange={(value) => onChange("priority", value as PriorityMode)}
        />
        <ChoiceGroup
          title="混雑回避レベル"
          values={crowdOptions}
          active={conditions.crowdAvoidance}
          onChange={(value) => onChange("crowdAvoidance", value as CrowdAvoidanceLevel)}
        />

        <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black text-night">
            <span className="inline-flex items-center gap-2"><Settings2 size={16} /> 詳細設定</span>
            <span className="text-xs text-slate-500">任意</span>
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <RangeField
              label="15分短縮に払ってもよい金額"
              value={conditions.willingnessToPayFor15Min}
              min={150}
              max={1200}
              step={30}
              unit="円"
              onChange={(value) => onChange("willingnessToPayFor15Min", value)}
            />
            <RangeField
              label="徒歩時間の上限"
              value={conditions.walkLimitMinutes}
              min={5}
              max={25}
              step={1}
              unit="分"
              onChange={(value) => onChange("walkLimitMinutes", value)}
            />
            <RangeField
              label="乗り換え回数の上限"
              value={conditions.transferLimit}
              min={0}
              max={3}
              step={1}
              unit="回"
              onChange={(value) => onChange("transferLimit", value)}
            />
          </div>
        </details>

        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-slate-600">現在の時間価値</span>
            <strong className="text-xl font-black text-night">{formatYen(timeValuePerMinute)} / 分</strong>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">難しい金額入力を省き、優先度と詳細設定から移動中の時間価値を推定しています。</p>
        </div>

        <button className="primary-button mt-4 w-full" onClick={onCompare} disabled={isLoading}>
          {isLoading ? "比較しています..." : "おすすめの移動を比較する"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </div>
    </section>
  );
}

function TextField({ label, value, icon, onChange }: { label: string; value: string; icon: React.ReactNode; onChange: (value: string) => void }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input className="text-field pl-10" value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  );
}

function ChoiceGroup({ title, values, active, onChange }: { title: string; values: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-black text-night">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {values.map((value) => (
          <button key={value} className={`choice-button ${active === value ? "is-active" : ""}`} onClick={() => onChange(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <strong className="mt-1 block text-lg font-black text-night">{value.toLocaleString("ja-JP")}{unit}</strong>
      <input
        className="mt-2 h-8 w-full accent-cyan-600"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
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

function OpenDataSection({ compact }: { compact: boolean }) {
  return (
    <section className={`${compact ? "mt-4" : "mt-6"} pb-[env(safe-area-inset-bottom)]`}>
      <details className="panel p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-black text-night"><Database size={18} className="text-aqua" /> 利用予定データ</span>
          <span className="text-xs font-bold text-slate-500">現在はサンプルデータ</span>
        </summary>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          現在はオープンデータをもとにしたサンプルデータで動作しています。今後、公共交通データや混雑情報APIとの接続を予定しています。
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
