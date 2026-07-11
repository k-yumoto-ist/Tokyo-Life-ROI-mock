import { X } from "lucide-react";
import { formatYen } from "../lib/scoring";
import type { CurrentWish, ScoredCandidate, UserProfile } from "../types";

export function DetailModal({
  candidate,
  profile,
  wish,
  onClose
}: {
  candidate: ScoredCandidate;
  profile: UserProfile;
  wish: CurrentWish;
  onClose: () => void;
}) {
  const rows = [
    ["所要時間", `${candidate.requiredMinutes}分`],
    ["移動時間", `${candidate.travelMinutes}分`],
    ["想定費用", formatYen(candidate.expectedCost)],
    ["混雑度", candidate.crowdLevel],
    ["快適度", `${candidate.comfortScore}/100`],
    ["家族満足度", `${candidate.familySatisfaction}/100`],
    ["時間価値コスト", formatYen(candidate.timeCost)],
    ["混雑・疲労負担", formatYen(candidate.crowdCost + candidate.fatigueCost)],
    ["実質コスト", formatYen(candidate.actualCost)]
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
            <p className="section-kicker">{wish.companion} / {wish.purpose}</p>
            <h2 className="mt-1 text-2xl font-black text-night sm:text-3xl">{candidate.name}</h2>
          </div>
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl bg-night p-5 text-white">
            <span className="text-sm font-black text-cyan-100">総合ROI</span>
            <div className="mt-2 text-6xl font-black text-signal">{candidate.roiScore}</div>
            <div className="mt-5 rounded-xl bg-white/10 p-3">
              <span className="text-xs font-black text-cyan-100">時間価値</span>
              <strong className="mt-1 block text-2xl font-black">{formatYen(profile.timeValuePerHour)} / 時間</strong>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-cyan-50">{candidate.detail}</p>
          </aside>
          <div className="grid gap-4">
            <section className="detail-section">
              <h3>なぜこの提案か</h3>
              <p>{candidate.reason}</p>
            </section>
            <section className="grid gap-2 sm:grid-cols-3">
              {candidate.matchedSignals.map((signal) => (
                <div key={signal} className="rounded-xl bg-cyan-50 p-3 text-sm font-black text-night">{signal}</div>
              ))}
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
              <h3>他候補との違い</h3>
              <p>{candidate.difference}</p>
            </section>
            <section className="detail-section">
              <h3>参照しているデモデータ</h3>
              <div className="mt-2 grid gap-2">
                {candidate.dataNotes.map((note) => (
                  <div key={note} className="rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700">{note}</div>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">現時点ではデモデータです。実運用では東京都オープンデータ、公共交通情報、施設APIなどに差し替える想定です。</p>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
