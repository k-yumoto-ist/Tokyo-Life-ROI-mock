import { useState } from "react";
import { BarChart3, ChevronRight, Clock3, RotateCcw, ShieldCheck, WalletCards, X } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatYen } from "../lib/scoring";
import type { Scenario, ScenarioId, ScoredOption } from "../types";

type Props = {
  scenario: Scenario;
  scenarios: Scenario[];
  timeValue: number;
  calculatedTimeValue: number;
  scoredOptions: ScoredOption[];
  recommended: ScoredOption;
  onScenarioChange: (id: ScenarioId) => void;
  onTimeValueChange: (value: number) => void;
  onOpenDetail: (option: ScoredOption) => void;
  onBackProfile: () => void;
};

type MobileSheet = "options" | "breakdown" | "why" | null;

export function ComparisonDashboard({
  scenario,
  scenarios,
  timeValue,
  calculatedTimeValue,
  scoredOptions,
  recommended,
  onScenarioChange,
  onTimeValueChange,
  onOpenDetail,
  onBackProfile
}: Props) {
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>(null);
  const chartData = scoredOptions.map((option) => ({
    name: option.shortName,
    支払額: option.paymentCost + (option.feeCost ?? 0),
    時間コスト: option.timeCost,
    疲労リスク: option.fatigueCost + option.riskCost,
    混雑コスト: option.congestionCost,
    実質生活コスト: option.actualCost,
    score: option.lifeRoiScore
  }));

  return (
    <>
      <MobileDecisionDashboard
        scenario={scenario}
        scenarios={scenarios}
        timeValue={timeValue}
        calculatedTimeValue={calculatedTimeValue}
        scoredOptions={scoredOptions}
        recommended={recommended}
        onScenarioChange={onScenarioChange}
        onTimeValueChange={onTimeValueChange}
        onBackProfile={onBackProfile}
        onOpenSheet={setMobileSheet}
      />

      <main className="mx-auto hidden max-w-7xl px-5 py-8 md:block">
        <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="panel p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-kicker">Comparison Dashboard</p>
                <h1 className="section-title">{scenario.title}のLife ROI比較</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{scenario.insight}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {scenarios.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onScenarioChange(item.id)}
                    className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-black ${
                      scenario.id === item.id
                        ? "border-aqua bg-cyan-50 text-night"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <TimeValuePanel
            timeValue={timeValue}
            calculatedTimeValue={calculatedTimeValue}
            onTimeValueChange={onTimeValueChange}
            onBackProfile={onBackProfile}
          />
        </section>

        <section className="mb-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="recommend-card desktop-recommendation">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-cyan-100">Recommended</p>
              <h2 className="mt-2 text-4xl font-black tracking-normal">{recommended.name}</h2>
              <p className="mt-4 text-lg leading-8 text-cyan-50">{recommended.reason}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <UrbanImpactBadge score={recommended.urbanImpact.score} inverted />
                <span className="rounded-full bg-white/15 px-3 py-2 text-sm font-black">
                  混雑回避 {recommended.urbanImpact.congestionAvoidance}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-2 text-sm font-black">
                  近隣資源活用 {recommended.urbanImpact.alternativeUse}
                </span>
              </div>
            </div>
            <div className="score-orb">
              <span>Life ROI</span>
              <strong>{recommended.lifeRoiScore}</strong>
            </div>
          </article>
          <article className="panel p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-black text-night">
              <BarChart3 className="text-aqua" size={22} />
              支払額と時間価値を含むコスト比較
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 12, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700 }} />
                  <YAxis tickFormatter={(value) => `${Number(value) / 1000}千`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatYen(Number(value))} />
                  <Legend />
                  <Bar dataKey="支払額" stackId="a" fill="#15243a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="時間コスト" stackId="a" fill="#00a8c8" />
                  <Bar dataKey="疲労リスク" stackId="a" fill="#ffd166" />
                  <Bar dataKey="混雑コスト" stackId="a" fill="#ef8354" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          {scoredOptions.map((option, index) => (
            <OptionCard key={option.id} option={option} isRecommended={index === 0} onOpenDetail={onOpenDetail} />
          ))}
        </section>

        <section className="panel mt-5 overflow-hidden p-0">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-night">比較表</h2>
            <p className="mt-1 text-slate-500">あなたの時間価値で、選択肢を並べ替える。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  {["選択肢", "Life ROI", "都市分散効果", "実質生活コスト", "支払額", "時間", "混雑", "疲労", "手戻り"].map((head) => (
                    <th key={head} className="px-5 py-4 font-black">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoredOptions.map((option) => (
                  <tr key={option.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-black text-night">{option.name}</td>
                    <td className="px-5 py-4"><span className="table-score">{option.lifeRoiScore}</span></td>
                    <td className="px-5 py-4"><UrbanImpactBadge score={option.urbanImpact.score} /></td>
                    <td className="px-5 py-4 font-bold">{formatYen(option.actualCost)}</td>
                    <td className="px-5 py-4">{formatYen(option.paymentCost + (option.feeCost ?? 0))}</td>
                    <td className="px-5 py-4">{option.totalMinutes}分</td>
                    <td className="px-5 py-4">{option.crowd}</td>
                    <td className="px-5 py-4">{option.fatigue}</td>
                    <td className="px-5 py-4">{option.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <MobileBottomSheet sheet={mobileSheet} onClose={() => setMobileSheet(null)} recommended={recommended} scoredOptions={scoredOptions} onOpenDetail={onOpenDetail} />
    </>
  );
}

function MobileDecisionDashboard({
  scenario,
  scenarios,
  timeValue,
  calculatedTimeValue,
  scoredOptions,
  recommended,
  onScenarioChange,
  onTimeValueChange,
  onBackProfile,
  onOpenSheet
}: {
  scenario: Scenario;
  scenarios: Scenario[];
  timeValue: number;
  calculatedTimeValue: number;
  scoredOptions: ScoredOption[];
  recommended: ScoredOption;
  onScenarioChange: (id: ScenarioId) => void;
  onTimeValueChange: (value: number) => void;
  onBackProfile: () => void;
  onOpenSheet: (sheet: MobileSheet) => void;
}) {
  return (
    <main className="mobile-decision-screen md:hidden">
      <section className="mobile-decision-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="section-kicker">比較 3/4</p>
            <h1 className="text-2xl font-black leading-tight text-night">{scenario.title}の最適解</h1>
          </div>
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600" onClick={onBackProfile}>
            変更
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <CompactMetric label="時間価値" value={`${formatYen(timeValue)}/h`} />
          <CompactMetric label="実質コスト" value={formatYen(recommended.actualCost)} />
        </div>

        <article className="mt-3 rounded-xl bg-night p-4 text-white">
          <p className="text-xs font-black text-cyan-100">今日のおすすめ</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <h2 className="text-2xl font-black leading-tight">{recommended.name}</h2>
            <div className="shrink-0 text-right">
              <span className="block text-xs font-black text-cyan-100">Life ROI</span>
              <strong className="text-5xl font-black leading-none text-signal">{recommended.lifeRoiScore}</strong>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <UrbanImpactBadge score={recommended.urbanImpact.score} inverted />
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-black text-cyan-50">
              混雑回避 {recommended.urbanImpact.congestionAvoidance}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-cyan-50">
            {mobileReason(recommended)}
          </p>
          <button className="mt-2 text-sm font-black text-signal underline underline-offset-4" onClick={() => onOpenSheet("why")}>
            なぜこの結果？
          </button>
        </article>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-slate-600">時間価値</span>
            <button className="icon-text-button" onClick={() => onTimeValueChange(calculatedTimeValue)}>
              <RotateCcw size={14} /> 初期値
            </button>
          </div>
          <input
            aria-label="時間価値"
            className="mt-1 h-8 w-full accent-cyan-600"
            type="range"
            min={800}
            max={9000}
            step={100}
            value={timeValue}
            onChange={(event) => onTimeValueChange(Number(event.target.value))}
          />
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>800円/h</span>
            <span>9,000円/h</span>
          </div>
        </div>

        <MiniCostBars options={scoredOptions} />

        <details className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <summary className="cursor-pointer text-sm font-black text-night">シーンを切り替える</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {scenarios.map((item) => (
              <button
                key={item.id}
                onClick={() => onScenarioChange(item.id)}
                className={`min-h-10 rounded-lg border px-2 text-sm font-black ${
                  scenario.id === item.id ? "border-aqua bg-cyan-50 text-night" : "border-slate-200 text-slate-600"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </details>
      </section>

      <div className="mobile-action-bar">
        <button className="secondary-button" onClick={() => onOpenSheet("options")}>他の選択肢</button>
        <button className="primary-button" onClick={() => onOpenSheet("breakdown")}>内訳を見る</button>
      </div>
    </main>
  );
}

function TimeValuePanel({
  timeValue,
  calculatedTimeValue,
  onTimeValueChange,
  onBackProfile
}: {
  timeValue: number;
  calculatedTimeValue: number;
  onTimeValueChange: (value: number) => void;
  onBackProfile: () => void;
}) {
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-slate-500">時間価値スライダー</span>
        <button className="icon-text-button" onClick={() => onTimeValueChange(calculatedTimeValue)}>
          <RotateCcw size={15} /> 初期値
        </button>
      </div>
      <div className="mt-3 text-3xl font-black text-night">{formatYen(timeValue)} / 時間</div>
      <input
        aria-label="時間価値"
        className="mt-5 h-8 w-full accent-cyan-600"
        type="range"
        min={800}
        max={9000}
        step={100}
        value={timeValue}
        onChange={(event) => onTimeValueChange(Number(event.target.value))}
      />
      <div className="mt-2 flex justify-between text-xs font-bold text-slate-400">
        <span>800円</span>
        <span>9,000円</span>
      </div>
      <button className="mt-4 text-sm font-black text-aqua underline underline-offset-4" onClick={onBackProfile}>
        時間価値を変更する
      </button>
    </div>
  );
}

function OptionCard({ option, isRecommended, onOpenDetail }: { option: ScoredOption; isRecommended: boolean; onOpenDetail: (option: ScoredOption) => void }) {
  return (
    <button className={`option-card ${isRecommended ? "is-recommended" : ""}`} onClick={() => onOpenDetail(option)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          {isRecommended && <span className="recommend-pill">推奨</span>}
          <h3 className="mt-3 text-left text-2xl font-black text-night">{option.name}</h3>
        </div>
        <div className="mini-score">{option.lifeRoiScore}</div>
      </div>
      <div className="mt-5 grid gap-3">
        <Metric icon={<WalletCards size={18} />} label="実質生活コスト" value={formatYen(option.actualCost)} highlight />
        <Metric icon={<Clock3 size={18} />} label="時間コスト" value={formatYen(option.timeCost)} />
        <Metric icon={<ShieldCheck size={18} />} label="疲労・リスク" value={formatYen(option.fatigueCost + option.riskCost)} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-cyan-50 p-3">
        <UrbanImpactBadge score={option.urbanImpact.score} />
        <span className="text-sm font-bold text-slate-600">混雑 {option.crowd}</span>
      </div>
      <p className="mt-4 text-left text-sm leading-6 text-slate-600">{option.reason}</p>
      <span className="mt-5 flex items-center justify-end gap-1 text-sm font-black text-aqua">
        詳細を見る <ChevronRight size={15} />
      </span>
    </button>
  );
}

function MobileBottomSheet({
  sheet,
  onClose,
  recommended,
  scoredOptions,
  onOpenDetail
}: {
  sheet: MobileSheet;
  onClose: () => void;
  recommended: ScoredOption;
  scoredOptions: ScoredOption[];
  onOpenDetail: (option: ScoredOption) => void;
}) {
  if (!sheet) return null;

  const title = sheet === "options" ? "他の選択肢" : sheet === "breakdown" ? "内訳" : "なぜこの結果？";

  return (
    <div className="fixed inset-0 z-50 grid items-end bg-night/50 md:hidden" role="dialog" aria-modal="true">
      <article className="max-h-[78dvh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-2xl">
        <div className="sticky top-0 -mx-4 -mt-4 mb-3 flex items-center justify-between border-b border-slate-200 bg-white p-4">
          <h2 className="text-lg font-black text-night">{title}</h2>
          <button className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 text-slate-500" onClick={onClose} aria-label="閉じる">
            <X size={19} />
          </button>
        </div>

        {sheet === "options" && (
          <div className="grid gap-2">
            {scoredOptions.map((option, index) => (
              <button
                key={option.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left"
                onClick={() => {
                  onClose();
                  onOpenDetail(option);
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {index === 0 && <span className="recommend-pill">おすすめ</span>}
                      <span className="font-black text-night">{option.name}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      実質 {formatYen(option.actualCost)} / 混雑 {option.crowd}
                    </p>
                    <div className="mt-2"><UrbanImpactBadge score={option.urbanImpact.score} /></div>
                  </div>
                  <div className="mini-score">{option.lifeRoiScore}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {sheet === "breakdown" && (
          <div className="grid gap-2">
            <BreakdownRow label="支払額" value={formatYen(recommended.paymentCost + (recommended.feeCost ?? 0))} />
            <BreakdownRow label="時間コスト" value={formatYen(recommended.timeCost)} />
            <BreakdownRow label="疲労コスト" value={formatYen(recommended.fatigueCost)} />
            <BreakdownRow label="手戻りリスク" value={formatYen(recommended.riskCost)} />
            <BreakdownRow label="混雑コスト" value={formatYen(recommended.congestionCost)} />
            <BreakdownRow label="移動・作業時間" value={`${recommended.totalMinutes}分`} />
            <BreakdownRow label="実質生活コスト" value={formatYen(recommended.actualCost)} strong />
            <div className="mt-2 grid grid-cols-3 gap-2">
              <ImpactMetric label="混雑回避" value={recommended.urbanImpact.congestionAvoidance} />
              <ImpactMetric label="代替活用" value={recommended.urbanImpact.alternativeUse} />
              <ImpactMetric label="移動削減" value={recommended.urbanImpact.travelReduction} />
            </div>
          </div>
        )}

        {sheet === "why" && (
          <div className="grid gap-3">
            <p className="rounded-xl bg-cyan-50 p-4 text-base font-bold leading-7 text-night">
              あなたの時間価値では、{recommended.name} が最も合理的です。
            </p>
            <p className="text-base leading-7 text-slate-700">{recommended.reason}</p>
            <p className="text-sm leading-6 text-slate-500">
              時間価値が高くなるほど、移動・待ち時間・疲労が少ない選択肢が有利になります。スライダーを下げると、支払額の安い選択肢が上位に戻りやすくなります。
            </p>
            <p className="rounded-xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">
              あなたにとって合理的であることを優先し、その結果として混雑しやすい場所への集中を避けやすくする提案です。
            </p>
          </div>
        )}
      </article>
    </div>
  );
}

function MiniCostBars({ options }: { options: ScoredOption[] }) {
  const max = Math.max(...options.map((option) => option.actualCost));
  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 text-sm font-black text-night">実質生活コスト</div>
      <div className="grid gap-1.5">
        {options.map((option) => (
          <div key={option.id} className="grid grid-cols-[72px_1fr_64px] items-center gap-2 text-xs">
            <span className="truncate font-bold text-slate-600">{option.shortName}</span>
            <span className="h-2 overflow-hidden rounded-full bg-slate-100">
              <span className="block h-full rounded-full bg-aqua" style={{ width: `${Math.max(18, (option.actualCost / max) * 100)}%` }} />
            </span>
            <strong className="text-right text-night">{formatYen(option.actualCost).replace("￥", "")}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2">
      <span className="block text-[11px] font-black text-slate-500">{label}</span>
      <strong className="block truncate text-base font-black text-night">{value}</strong>
    </div>
  );
}

function ImpactMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-cyan-50 p-2 text-center">
      <span className="block text-[10px] font-black text-slate-500">{label}</span>
      <strong className="text-lg font-black text-night">{value}</strong>
    </div>
  );
}

function UrbanImpactBadge({ score, inverted = false }: { score: number; inverted?: boolean }) {
  const level = score >= 80 ? "高" : score >= 50 ? "中" : "低";
  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${
      inverted ? "bg-white/15 text-white" : "bg-emerald-50 text-emerald-700"
    }`}>
      都市分散効果 {level}
    </span>
  );
}

function BreakdownRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 rounded-lg p-3 ${strong ? "bg-night text-white" : "bg-slate-50 text-night"}`}>
      <span className="font-bold">{label}</span>
      <strong className="text-lg font-black">{value}</strong>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  highlight = false
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`metric-row ${highlight ? "is-highlight" : ""}`}>
      <span className="flex items-center gap-2 text-slate-500">{icon}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function mobileReason(option: ScoredOption) {
  if (option.urbanImpact.score >= 80) {
    return "移動と混雑が少なく、今日のあなたには最も合理的です。混雑しやすい場所への集中を避ける選択にもなります。";
  }
  return option.reason.split("。")[0] + "。";
}
