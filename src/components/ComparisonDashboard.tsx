import { useState } from "react";
import { ArrowLeft, BarChart3, CheckCircle2, ChevronRight, CloudSun, Settings2, TrainFront, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DetailModal } from "./DetailModal";
import { formatYen } from "../lib/scoring";
import type { CurrentWish, ScoredCandidate, TokyoContext, UserProfile } from "../types";

type Props = {
  profile: UserProfile;
  wish: CurrentWish;
  tokyoContext: TokyoContext;
  candidates: ScoredCandidate[];
  recommended: ScoredCandidate;
  onBack: () => void;
  onProfile: () => void;
  onRecalculate: () => void;
};

export function ComparisonDashboard({ profile, wish, tokyoContext, candidates, recommended, onBack, onProfile, onRecalculate }: Props) {
  const [detailCandidate, setDetailCandidate] = useState<ScoredCandidate | null>(null);
  const otherCandidates = candidates.filter((candidate) => candidate.id !== recommended.id);

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-4">
          <SummaryCard candidate={recommended} profile={profile} wish={wish} />
          <TokyoContextCard context={tokyoContext} />
        </div>

        <div className="grid gap-4">
          <RecommendedCard candidate={recommended} onDetail={() => setDetailCandidate(recommended)} />
          <div className="grid grid-cols-2 gap-3">
            {otherCandidates.map((candidate) => (
              <CompactCandidateCard key={candidate.id} candidate={candidate} onDetail={() => setDetailCandidate(candidate)} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <RoiChart candidates={candidates} />
        <ComparisonList candidates={candidates} onDetail={setDetailCandidate} />
      </section>

      <div className="mobile-action-bar md:hidden">
        <button className="secondary-button" onClick={onBack}><ArrowLeft size={17} /> 希望を変更</button>
        <button className="primary-button" onClick={onProfile}><Settings2 size={17} /> 基本設定</button>
      </div>

      <div className="mt-4 hidden justify-between gap-3 md:flex">
        <button className="secondary-button w-auto" onClick={onBack}><ArrowLeft size={17} /> 今回の希望を変更</button>
        <div className="flex gap-2">
          <button className="secondary-button w-auto" onClick={onProfile}>基本設定を確認</button>
          <button className="primary-button w-auto" onClick={onRecalculate}>再提案する</button>
        </div>
      </div>

      {detailCandidate && <DetailModal candidate={detailCandidate} profile={profile} wish={wish} onClose={() => setDetailCandidate(null)} />}
    </>
  );
}

function SummaryCard({ candidate, profile, wish }: { candidate: ScoredCandidate; profile: UserProfile; wish: CurrentWish }) {
  return (
    <article className="recommend-card compact-decision">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.12em] text-cyan-100">あなた向け1位</p>
        <h1 className="mt-2 text-2xl font-black leading-tight sm:text-4xl">{candidate.name}</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-cyan-50 sm:text-base sm:leading-7">{candidate.reason}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MetricBlock label="総合ROI" value={`${candidate.roiScore}点`} />
        <MetricBlock label="実質コスト" value={formatYen(candidate.actualCost)} />
        <MetricBlock label="所要時間" value={`${candidate.requiredMinutes}分`} />
        <MetricBlock label="混雑度" value={candidate.crowdLevel} />
      </div>
      <p className="mt-3 rounded-xl bg-white/12 p-3 text-sm font-bold leading-6 text-cyan-50">
        {profile.residentArea || wish.startPoint} から、{wish.companion}で「{wish.purpose}」。{wish.focus}を重視する今回の条件で並べ替えています。
      </p>
    </article>
  );
}

function RecommendedCard({ candidate, onDetail }: { candidate: ScoredCandidate; onDetail: () => void }) {
  return (
    <article className="option-card is-recommended p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="recommend-pill">おすすめ順位 {candidate.rank}位</span>
          <h2 className="mt-2 text-2xl font-black leading-tight text-night">{candidate.name}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{candidate.area} / {candidate.summary}</p>
        </div>
        <div className="mini-score">{candidate.roiScore}</div>
      </div>
      <CandidateFacts candidate={candidate} />
      <div className="mt-4 flex flex-wrap gap-2">
        {candidate.tags.map((tag) => <span key={tag} className="fact-chip">{tag}</span>)}
      </div>
      <button className="primary-button mt-4 w-full" onClick={onDetail}><CheckCircle2 size={18} /> 候補の詳細を見る</button>
    </article>
  );
}

function CompactCandidateCard({ candidate, onDetail }: { candidate: ScoredCandidate; onDetail: () => void }) {
  return (
    <button className="option-card compact-route" onClick={onDetail}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="recommend-pill">{candidate.rank}位</span>
          <h3 className="mt-2 text-left text-base font-black leading-tight text-night">{candidate.name}</h3>
          <p className="mt-1 text-left text-xs font-bold text-slate-500">{candidate.area} / {formatYen(candidate.expectedCost)}</p>
        </div>
        <div className="mini-score small">{candidate.roiScore}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-left text-xs">
        <span className="fact-chip">混雑 {candidate.crowdLevel}</span>
        <span className="fact-chip">移動 {candidate.travelMinutes}分</span>
      </div>
      <span className="mt-3 flex items-center justify-end gap-1 text-sm font-black text-aqua">詳細 <ChevronRight size={15} /></span>
    </button>
  );
}

function CandidateFacts({ candidate }: { candidate: ScoredCandidate }) {
  const facts = [
    { icon: <TrainFront size={17} />, label: "移動時間", value: `${candidate.travelMinutes}分` },
    { icon: <WalletCards size={17} />, label: "想定費用", value: formatYen(candidate.expectedCost) },
    { icon: <BarChart3 size={17} />, label: "快適度", value: `${candidate.comfortScore}/100` },
    { icon: <CheckCircle2 size={17} />, label: "家族満足度", value: `${candidate.familySatisfaction}/100` }
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {facts.map((fact) => (
        <div key={fact.label} className="metric-row">
          <span className="inline-flex items-center gap-1.5">{fact.icon}{fact.label}</span>
          <strong>{fact.value}</strong>
        </div>
      ))}
    </div>
  );
}

function TokyoContextCard({ context }: { context: TokyoContext }) {
  return (
    <article className="panel p-4 sm:p-5">
      <h2 className="inline-flex items-center gap-2 text-lg font-black text-night"><CloudSun size={19} className="text-aqua" /> 東京の状況</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">混雑予測・天気・交通情報を反映。現在はデモデータを使用しています。</p>
      <div className="mt-3 grid gap-2">
        <ContextRow label="天気" value={context.weather} />
        <ContextRow label="混雑" value={context.crowdTrend} />
        <ContextRow label="交通" value={context.transitStatus} />
        <ContextRow label="施設・イベント" value={context.eventInfo} />
      </div>
      <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800">{context.note}</p>
    </article>
  );
}

function RoiChart({ candidates }: { candidates: ScoredCandidate[] }) {
  const chartData = candidates.map((candidate) => ({
    name: candidate.name.replace("で", "\n"),
    実質コスト: candidate.actualCost,
    ROI: candidate.roiScore
  }));

  return (
    <article className="panel p-4 sm:p-5">
      <h2 className="text-lg font-black text-night">実質コストの比較</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">支払費用に、移動・待ち時間、時間価値、混雑負担を足して比較します。</p>
      <div className="mt-3 h-[220px] sm:h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} interval={0} />
            <YAxis tickFormatter={(value) => `${Number(value) / 1000}千`} tick={{ fontSize: 12 }} width={34} />
            <Tooltip formatter={(value, name) => name === "実質コスト" ? formatYen(Number(value)) : `${value}点`} />
            <Bar dataKey="実質コスト" fill="#00a8c8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function ComparisonList({ candidates, onDetail }: { candidates: ScoredCandidate[]; onDetail: (candidate: ScoredCandidate) => void }) {
  return (
    <article className="panel p-4 sm:p-5">
      <h2 className="text-lg font-black text-night">候補の違い</h2>
      <div className="mt-3 grid gap-2">
        {candidates.map((candidate) => (
          <button key={candidate.id} className="route-row" onClick={() => onDetail(candidate)}>
            <span>
              <span className="flex items-center gap-2">
                <span className="recommend-pill">{candidate.rank}位</span>
                <strong>{candidate.name}</strong>
              </span>
              <span className="mt-1 block text-sm text-slate-600">{candidate.difference}</span>
            </span>
            <span className="mini-score">{candidate.roiScore}</span>
          </button>
        ))}
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

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="block text-xs font-black text-slate-500">{label}</span>
      <strong className="mt-1 block text-sm font-bold leading-6 text-night">{value}</strong>
    </div>
  );
}
