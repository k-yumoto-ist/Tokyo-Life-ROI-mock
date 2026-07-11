import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Clock3, Footprints, RotateCcw, ShieldCheck, TrainFront, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DetailModal } from "./DetailModal";
import { formatYen } from "../lib/scoring";
import type { CrowdAvoidanceLevel, PersonalImpact, PriorityMode, ScoredRouteOption, TokyoImpact, TravelConditions } from "../types";

type Props = {
  conditions: TravelConditions;
  scoredRoutes: ScoredRouteOption[];
  recommended: ScoredRouteOption;
  personalImpact: PersonalImpact;
  tokyoImpact: TokyoImpact;
  hasSelectedRoute: boolean;
  onSelectRoute: () => void;
  onBack: () => void;
  onChange: <T extends keyof TravelConditions>(key: T, value: TravelConditions[T]) => void;
  onRecompare: () => void;
};

export function ComparisonDashboard({
  conditions,
  scoredRoutes,
  recommended,
  personalImpact,
  tokyoImpact,
  hasSelectedRoute,
  onSelectRoute,
  onBack,
  onChange,
  onRecompare
}: Props) {
  const [detailRoute, setDetailRoute] = useState<ScoredRouteOption | null>(null);
  const otherRoutes = scoredRoutes.filter((route) => route.id !== recommended.id);

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-4">
          <SummaryCard recommended={recommended} conditions={conditions} />
          <QuickControls conditions={conditions} onChange={onChange} onRecompare={onRecompare} />
        </div>

        <div className="grid gap-4">
          <RecommendedRouteCard route={recommended} onSelectRoute={onSelectRoute} onDetail={() => setDetailRoute(recommended)} />
          <div className="grid grid-cols-2 gap-3">
            {otherRoutes.map((route) => (
              <CompactRouteCard key={route.id} route={route} onDetail={() => setDetailRoute(route)} />
            ))}
          </div>
        </div>
      </section>

      {hasSelectedRoute && (
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <PersonalImpactCard impact={personalImpact} route={recommended} />
          <TokyoImpactCard impact={tokyoImpact} route={recommended} />
        </section>
      )}

      <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <RouteChart routes={scoredRoutes} />
        <div className="panel p-4 sm:p-5">
          <h2 className="text-lg font-black text-night">3つの移動案</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            最短経路だけでなく、出発時刻をずらす案と別経路を使う案を同じ基準で比較します。
          </p>
          <div className="mt-3 grid gap-2">
            {scoredRoutes.map((route, index) => (
              <button key={route.id} className="route-row" onClick={() => setDetailRoute(route)}>
                <span>
                  <span className="flex items-center gap-2">
                    {index === 0 && <span className="recommend-pill">おすすめ</span>}
                    <strong>{route.title}</strong>
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {route.departureTime}発 - {route.arrivalTime}着 / 混雑 {route.crowding}
                  </span>
                </span>
                <span className="mini-score">{route.lifeRoiScore}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mobile-action-bar md:hidden">
        <button className="secondary-button" onClick={onBack}><ArrowLeft size={17} /> 条件変更</button>
        <button className="primary-button" onClick={onSelectRoute}>この案を選ぶ</button>
      </div>

      <div className="mt-4 hidden justify-between gap-3 md:flex">
        <button className="secondary-button w-auto" onClick={onBack}><ArrowLeft size={17} /> 条件を変更する</button>
        <button className="primary-button w-auto" onClick={onSelectRoute}>この移動案を選ぶ</button>
      </div>

      {detailRoute && <DetailModal route={detailRoute} conditions={conditions} onClose={() => setDetailRoute(null)} />}
    </>
  );
}

function SummaryCard({ recommended, conditions }: { recommended: ScoredRouteOption; conditions: TravelConditions }) {
  return (
    <article className="recommend-card compact-decision">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.12em] text-cyan-100">おすすめ</p>
        <h1 className="mt-2 text-2xl font-black leading-tight sm:text-4xl">{recommended.title}</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-cyan-50 sm:text-base sm:leading-7">
          {recommended.reason}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MetricBlock label="到着予定" value={recommended.arrivalTime} />
        <MetricBlock label="取り戻せる時間" value={`実質${recommended.recoveredMinutes}分`} />
        <MetricBlock label="混雑負担" value={`${Math.round((recommended.congestionMinutesReduced / 18) * 100)}%減`} />
        <MetricBlock label="総合メリット" value={`${formatYen(recommended.totalBenefitYen)}相当`} />
      </div>
      <p className="mt-3 rounded-xl bg-white/12 p-3 text-sm font-bold leading-6 text-cyan-50">
        {conditions.origin} から {conditions.destination} へ。自分にとって得な移動が、結果としてピーク時間への集中を避ける選択にもなります。
      </p>
    </article>
  );
}

function RecommendedRouteCard({ route, onSelectRoute, onDetail }: { route: ScoredRouteOption; onSelectRoute: () => void; onDetail: () => void }) {
  return (
    <article className="option-card is-recommended p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="recommend-pill">おすすめ</span>
          <h2 className="mt-2 text-2xl font-black leading-tight text-night">{route.title}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{route.label}</p>
        </div>
        <div className="mini-score">{route.lifeRoiScore}</div>
      </div>
      <RouteFacts route={route} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="primary-button" onClick={onSelectRoute}><CheckCircle2 size={18} /> この案を選ぶ</button>
        <button className="secondary-button" onClick={onDetail}>経路の詳細</button>
      </div>
    </article>
  );
}

function CompactRouteCard({ route, onDetail }: { route: ScoredRouteOption; onDetail: () => void }) {
  return (
    <button className="option-card compact-route" onClick={onDetail}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-left text-base font-black leading-tight text-night">{route.title}</h3>
          <p className="mt-1 text-left text-xs font-bold text-slate-500">{route.departureTime}発 / {route.durationMinutes}分</p>
        </div>
        <div className="mini-score small">{route.lifeRoiScore}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-left text-xs">
        <span className="fact-chip">混雑 {route.crowding}</span>
        <span className="fact-chip">徒歩 {route.walkMinutes}分</span>
      </div>
      <span className="mt-3 flex items-center justify-end gap-1 text-sm font-black text-aqua">詳細 <ChevronRight size={15} /></span>
    </button>
  );
}

function RouteFacts({ route }: { route: ScoredRouteOption }) {
  const facts = [
    { icon: <Clock3 size={17} />, label: "出発/到着", value: `${route.departureTime} - ${route.arrivalTime}` },
    { icon: <TrainFront size={17} />, label: "所要時間", value: `${route.durationMinutes}分` },
    { icon: <WalletCards size={17} />, label: "交通費", value: formatYen(route.fare) },
    { icon: <ShieldCheck size={17} />, label: "混雑度", value: route.crowding },
    { icon: <Footprints size={17} />, label: "徒歩", value: `${route.walkMinutes}分` },
    { icon: <CheckCircle2 size={17} />, label: "座れる可能性", value: route.seatChance }
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="metric-row">
          <span className="inline-flex items-center gap-1.5">{fact.icon}{fact.label}</span>
          <strong>{fact.value}</strong>
        </div>
      ))}
    </div>
  );
}

function QuickControls({
  conditions,
  onChange,
  onRecompare
}: {
  conditions: TravelConditions;
  onChange: <T extends keyof TravelConditions>(key: T, value: TravelConditions[T]) => void;
  onRecompare: () => void;
}) {
  return (
    <article className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-lg font-black text-night"><RotateCcw size={18} className="text-aqua" /> 条件を微調整</h2>
        <button className="icon-text-button min-h-11" onClick={onRecompare}>再比較</button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="text-xs font-black text-slate-500">優先度</span>
          <select className="text-field mt-1" value={conditions.priority} onChange={(event) => onChange("priority", event.target.value as PriorityMode)}>
            <option>時間優先</option>
            <option>バランス</option>
            <option>費用優先</option>
          </select>
        </label>
        <label>
          <span className="text-xs font-black text-slate-500">混雑回避</span>
          <select className="text-field mt-1" value={conditions.crowdAvoidance} onChange={(event) => onChange("crowdAvoidance", event.target.value as CrowdAvoidanceLevel)}>
            <option>気にしない</option>
            <option>できれば避けたい</option>
            <option>できるだけ避けたい</option>
          </select>
        </label>
      </div>
    </article>
  );
}

function PersonalImpactCard({ impact, route }: { impact: PersonalImpact; route: ScoredRouteOption }) {
  return (
    <article className="panel p-4 sm:p-5">
      <h2 className="text-lg font-black text-night">個人への効果</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">混雑の少ない移動を選択しました。今回、混雑時間を約{route.congestionMinutesReduced}分減らせる見込みです。</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <CompactMetric label="今回取り戻せる時間" value={`${impact.recoveredThisTripMinutes}分`} />
        <CompactMetric label="今月取り戻した時間" value={`${impact.recoveredThisMonthMinutes}分`} />
        <CompactMetric label="混雑を避けた時間" value={`${impact.avoidedCrowdingThisMonthMinutes}分`} />
        <CompactMetric label="総合メリット" value={`${formatYen(impact.monthlyBenefitYen)}相当`} />
      </div>
    </article>
  );
}

function TokyoImpactCard({ impact, route }: { impact: TokyoImpact; route: ScoredRouteOption }) {
  return (
    <article className="panel p-4 sm:p-5">
      <h2 className="text-lg font-black text-night">東京全体への効果</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        あなたと同じように、今日{impact.shiftedTrips.toLocaleString("ja-JP")}人がピーク時間を避けました。自分にとって得な選択が、結果として東京の混雑緩和につながります。
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <CompactMetric label="分散できた移動" value={`${impact.shiftedTrips.toLocaleString("ja-JP")}件`} />
        <CompactMetric label="削減できた混雑時間" value={`${impact.reducedCrowdingHours}時間`} />
        <CompactMetric label="分散率" value={`${impact.routeDistributionRate}%`} />
      </div>
      <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800">{impact.sampleNote} 推奨案では混雑時間を約{route.congestionMinutesReduced}分減らします。</p>
    </article>
  );
}

function RouteChart({ routes }: { routes: ScoredRouteOption[] }) {
  const chartData = routes.map((route) => ({
    name: route.label,
    総合負担: route.totalBurden,
    混雑時間: route.crowdedMinutes,
    roi: route.lifeRoiScore
  }));

  return (
    <article className="panel p-4 sm:p-5">
      <h2 className="text-lg font-black text-night">総合負担の比較</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">費用だけでなく、時間と混雑負担を足して比較します。</p>
      <div className="mt-3 h-[210px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700 }} />
            <YAxis tickFormatter={(value) => `${Number(value) / 1000}千`} tick={{ fontSize: 12 }} width={34} />
            <Tooltip formatter={(value, name) => name === "総合負担" ? formatYen(Number(value)) : `${value}分`} />
            <Bar dataKey="総合負担" fill="#00a8c8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/12 p-3">
      <span className="block text-xs font-black text-cyan-100">{label}</span>
      <strong className="mt-1 block text-lg font-black text-white sm:text-xl">{value}</strong>
    </div>
  );
}

function CompactMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="block text-xs font-black text-slate-500">{label}</span>
      <strong className="mt-1 block text-lg font-black text-night">{value}</strong>
    </div>
  );
}
