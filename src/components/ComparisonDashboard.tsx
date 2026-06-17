import { BarChart3, ChevronRight, Clock3, RotateCcw, ShieldCheck, WalletCards } from "lucide-react";
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
  const chartData = scoredOptions.map((option) => ({
    name: option.shortName,
    支払額: option.paymentCost + (option.feeCost ?? 0),
    時間コスト: option.timeCost,
    疲労リスク: option.fatigueCost + option.riskCost,
    実質生活コスト: option.actualCost,
    score: option.lifeRoiScore
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-5 sm:px-5 sm:py-8">
      <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="panel p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-kicker">Comparison Dashboard</p>
              <h1 className="section-title">{scenario.title}のLife ROI比較</h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{scenario.insight}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
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
        <MobileRecommendation option={recommended} />
        <div className="panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-slate-500">時間価値スライダー</span>
            <button className="icon-text-button" onClick={() => onTimeValueChange(calculatedTimeValue)}>
              <RotateCcw size={15} /> 初期値
            </button>
          </div>
          <div className="mt-3 text-3xl font-black text-night sm:text-4xl lg:text-3xl">{formatYen(timeValue)} / 時間</div>
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
          <p className="mt-4 text-sm leading-6 text-slate-600">
            あなたの時間価値が高くなるほど、移動や待ち時間の少ない選択肢が有利になります。
          </p>
          <button className="mt-4 text-sm font-black text-aqua underline underline-offset-4" onClick={onBackProfile}>
            時間価値を変更する
          </button>
        </div>
      </section>

      <section className="mb-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="recommend-card desktop-recommendation">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-cyan-100">Recommended</p>
            <h2 className="mt-2 text-4xl font-black tracking-normal">{recommended.name}</h2>
            <p className="mt-4 text-lg leading-8 text-cyan-50">{recommended.reason}</p>
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
          <div className="hidden h-[320px] md:block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700 }} />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}千`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatYen(Number(value))} />
                <Legend />
                <Bar dataKey="支払額" stackId="a" fill="#15243a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="時間コスト" stackId="a" fill="#00a8c8" />
                <Bar dataKey="疲労リスク" stackId="a" fill="#ffd166" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[300px] md:hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 10, bottom: 8, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${Number(value) / 1000}千`} tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={58}
                  tick={{ fontSize: 12, fontWeight: 800 }}
                />
                <Tooltip formatter={(value) => formatYen(Number(value))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="支払額" stackId="a" fill="#15243a" />
                <Bar dataKey="時間コスト" stackId="a" fill="#00a8c8" />
                <Bar dataKey="疲労リスク" stackId="a" fill="#ffd166" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:gap-5 xl:grid-cols-4">
        {scoredOptions.map((option, index) => (
          <button
            key={option.id}
            className={`option-card ${index === 0 ? "is-recommended" : ""}`}
            onClick={() => onOpenDetail(option)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {index === 0 && <span className="recommend-pill">推奨</span>}
                <h3 className="mt-3 text-left text-2xl font-black text-night">{option.name}</h3>
              </div>
              <div className="mini-score">{option.lifeRoiScore}</div>
            </div>
            <div className="mt-5 grid gap-3">
              <Metric icon={<WalletCards size={18} />} label="実質生活コスト" value={formatYen(option.actualCost)} highlight />
              <Metric icon={<Clock3 size={18} />} label="時間コスト" value={formatYen(option.timeCost)} />
              <Metric icon={<ShieldCheck size={18} />} label="疲労・リスク" value={formatYen(option.fatigueCost + option.riskCost)} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-left text-sm text-slate-600 xl:hidden">
              <span>支払額: <strong className="text-night">{formatYen(option.paymentCost + (option.feeCost ?? 0))}</strong></span>
              <span>時間: <strong className="text-night">{option.totalMinutes}分</strong></span>
              <span>疲労: <strong className="text-night">{option.fatigue}</strong></span>
              <span>手戻り: <strong className="text-night">{option.risk}</strong></span>
            </div>
            <p className="mt-4 text-left text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 xl:text-sm xl:leading-6">{option.reason}</p>
            <span className="mt-5 flex items-center justify-end gap-1 text-sm font-black text-aqua">
              詳細を見る <ChevronRight size={15} />
            </span>
          </button>
        ))}
      </section>

      <section className="panel mt-5 hidden overflow-hidden p-0 md:block">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-night">比較表</h2>
          <p className="mt-1 text-slate-500">あなたの時間価値で、選択肢を並べ替える。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                {["選択肢", "Life ROI", "実質生活コスト", "支払額", "時間", "混雑", "疲労", "手戻り"].map((head) => (
                  <th key={head} className="px-5 py-4 font-black">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scoredOptions.map((option) => (
                <tr key={option.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-black text-night">{option.name}</td>
                  <td className="px-5 py-4"><span className="table-score">{option.lifeRoiScore}</span></td>
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
  );
}

function MobileRecommendation({ option }: { option: ScoredOption }) {
  return (
    <article className="recommend-card mobile-recommendation">
      <div>
        <p className="text-sm font-black text-cyan-100">今日のおすすめ</p>
        <h2 className="mt-2 text-3xl font-black tracking-normal">{option.name}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/15 p-3">
            <span className="block text-xs font-black text-cyan-100">Life ROI</span>
            <strong className="text-4xl font-black text-signal">{option.lifeRoiScore}</strong>
          </div>
          <div className="rounded-lg bg-white/15 p-3">
            <span className="block text-xs font-black text-cyan-100">実質生活コスト</span>
            <strong className="text-xl font-black">{formatYen(option.actualCost)}</strong>
          </div>
        </div>
        <p className="mt-4 text-base leading-7 text-cyan-50">
          あなたの時間価値では、この選択肢が最も合理的です。{option.reason}
        </p>
      </div>
    </article>
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
