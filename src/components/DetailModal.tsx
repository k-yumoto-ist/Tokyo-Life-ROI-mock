import { X } from "lucide-react";
import { formatYen } from "../lib/scoring";
import type { ScoredRouteOption, TravelConditions } from "../types";

export function DetailModal({
  route,
  conditions,
  onClose
}: {
  route: ScoredRouteOption;
  conditions: TravelConditions;
  onClose: () => void;
}) {
  const rows = [
    ["出発時刻", route.departureTime],
    ["到着時刻", route.arrivalTime],
    ["所要時間", `${route.durationMinutes}分`],
    ["交通費", formatYen(route.fare)],
    ["混雑時間", `${route.crowdedMinutes}分`],
    ["徒歩", `${route.walkMinutes}分`],
    ["乗り換え", `${route.transfers}回`],
    ["座れる可能性", route.seatChance],
    ["総合負担", formatYen(route.totalBurden)],
    ["基準案との差額", route.deltaVsBaseline >= 0 ? `${formatYen(route.deltaVsBaseline)}お得` : `${formatYen(Math.abs(route.deltaVsBaseline))}高い`],
    ["削減できる混雑時間", `${route.congestionMinutesReduced}分`],
    ["取り戻せる時間", `${route.recoveredMinutes}分`]
  ];

  return (
    <div
      className="fixed inset-0 z-50 grid items-end bg-night/55 p-0 pt-10 backdrop-blur-sm sm:place-items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <article className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-4 sm:p-6">
          <div>
            <p className="section-kicker">{conditions.origin} → {conditions.destination}</p>
            <h2 className="mt-1 text-2xl font-black text-night sm:text-3xl">{route.title}</h2>
          </div>
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl bg-night p-5 text-white">
            <span className="text-sm font-black text-cyan-100">Life ROI</span>
            <div className="mt-2 text-6xl font-black text-signal">{route.lifeRoiScore}</div>
            <div className="mt-5 rounded-xl bg-white/10 p-3">
              <span className="text-xs font-black text-cyan-100">総合メリット</span>
              <strong className="mt-1 block text-2xl font-black">{formatYen(route.totalBenefitYen)}相当</strong>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-cyan-50">{route.note}</p>
          </aside>
          <div className="grid gap-4">
            <section className="detail-section">
              <h3>おすすめ理由</h3>
              <p>{route.reason}</p>
            </section>
            <section className="grid gap-2 sm:grid-cols-2">
              {rows.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-black text-slate-500">{label}</div>
                  <div className="mt-1 text-lg font-black text-night">{value}</div>
                </div>
              ))}
            </section>
            <section className="detail-section">
              <h3>計算の考え方</h3>
              <p>
                総合負担は、交通費、移動時間、混雑時間、遅延リスク、徒歩や乗り換えの負担を合算しています。
                Life ROI は総合負担の低さに加え、混雑時間を減らせる度合いと座れる可能性を反映した簡易スコアです。
              </p>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
