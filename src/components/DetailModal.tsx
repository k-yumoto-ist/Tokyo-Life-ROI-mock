import { X } from "lucide-react";
import { formatYen } from "../lib/scoring";
import type { Scenario, ScoredOption } from "../types";

export function DetailModal({ option, scenario, onClose }: { option: ScoredOption; scenario: Scenario; onClose: () => void }) {
  const rows = [
    ["支払額", formatYen(option.paymentCost + (option.feeCost ?? 0))],
    ["移動時間", `${option.travelMinutes}分`],
    ["待ち時間", `${option.waitMinutes ?? 0}分`],
    ["作業時間", `${option.workMinutes}分`],
    ["時間コスト", formatYen(option.timeCost)],
    ["疲労補正", formatYen(option.fatigueCost)],
    ["リスク補正", formatYen(option.riskCost)],
    ["混雑補正", formatYen(option.congestionCost)]
  ];

  return (
    <div
      className="fixed inset-0 z-50 grid items-end bg-night/55 p-0 pt-10 backdrop-blur-sm sm:place-items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <article className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 sm:p-6">
          <div>
            <p className="section-kicker">{scenario.title} / Option Detail</p>
            <h2 className="text-2xl font-black text-night sm:text-3xl">{option.name}</h2>
          </div>
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[260px_1fr]">
          <div className="rounded-xl bg-night p-6 text-white">
            <span className="text-sm font-black text-cyan-100">Life ROI スコア</span>
            <div className="mt-2 text-5xl font-black sm:text-6xl">{option.lifeRoiScore}</div>
            <div className="mt-4 text-cyan-100">実質生活コスト</div>
            <div className="text-2xl font-black">{formatYen(option.actualCost)}</div>
            <div className="mt-5 rounded-lg bg-white/10 p-3">
              <div className="text-sm font-black text-cyan-100">都市分散効果</div>
              <div className="mt-1 text-3xl font-black">{option.urbanImpact.score}</div>
            </div>
          </div>
          <div className="grid gap-5">
            <section className="detail-section">
              <h3>おすすめ理由</h3>
              <p>{option.reason}</p>
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              {rows.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-500">{label}</div>
                  <div className="mt-1 text-xl font-black text-night">{value}</div>
                </div>
              ))}
            </section>
            <section className="detail-section">
              <h3>都市分散効果</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["混雑回避", option.urbanImpact.congestionAvoidance],
                  ["代替候補活用", option.urbanImpact.alternativeUse],
                  ["移動削減", option.urbanImpact.travelReduction]
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg bg-cyan-50 p-3 text-center">
                    <div className="text-xs font-bold text-slate-500">{label}</div>
                    <div className="mt-1 text-2xl font-black text-night">{value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                個人にとって合理的な選択を優先し、その結果として混雑回避、代替候補の活用、不要な移動の削減につながる度合いです。
              </p>
            </section>
            <section className="grid gap-4 md:grid-cols-2">
              <div className="detail-section">
                <h3>注意点</h3>
                <p>{option.caution}</p>
              </div>
              <div className="detail-section">
                <h3>向いている人</h3>
                <p>{option.fit}</p>
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
