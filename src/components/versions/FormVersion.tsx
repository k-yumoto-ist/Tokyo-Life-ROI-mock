import type { ReactNode } from "react";
import { useState } from "react";
import { RecommendationCard } from "../common/RecommendationCard";
import { formCandidates, personalSummary, type RoiCandidate } from "../../data/mockData";

const purposeOptions = ["移動", "子どもと遊ぶ", "買い物", "気分転換"];
const companionOptions = ["ひとり", "家族", "子どもと", "友人と"];
const crowdOptions = ["気にしない", "できれば避けたい", "かなり避けたい"];

type Props = {
  onSelect: (candidate: RoiCandidate) => void;
  onSettings?: () => void;
};

export function FormVersion({ onSelect }: Props) {
  const [hasDestination, setHasDestination] = useState("目的地あり");
  const [purpose, setPurpose] = useState("移動");
  const [companion, setCompanion] = useState("子どもと");
  const [crowd, setCrowd] = useState("できれば避けたい");
  const [origin, setOrigin] = useState("自宅");
  const [target, setTarget] = useState("上野動物園");
  const [travelTime, setTravelTime] = useState("1時間以内");
  const [budget, setBudget] = useState("5,000円以内");
  const [returnTime, setReturnTime] = useState("18:00");
  const [searched, setSearched] = useState(false);
  const candidates = getSortedCandidates(crowd, budget);

  return (
    <section className="version-panel">
      <p className="profile-line">{personalSummary}</p>
      <h2 className="version-title">条件を入れて比較する</h2>
      <div className="form-card">
        <Segment label="目的地">
          {["目的地あり", "目的地未定"].map((item) => (
            <button key={item} className={hasDestination === item ? "is-active" : ""} onClick={() => setHasDestination(item)}>{item}</button>
          ))}
        </Segment>
        <label className="prototype-field">
          <span>出発地</span>
          <input value={origin} onChange={(event) => setOrigin(event.target.value)} />
        </label>
        <label className="prototype-field">
          <span>{hasDestination === "目的地あり" ? "目的地" : "エリア"}</span>
          <input value={target} onChange={(event) => setTarget(event.target.value)} />
        </label>
        <Segment label="目的">
          {purposeOptions.map((item) => (
            <button key={item} className={purpose === item ? "is-active" : ""} onClick={() => setPurpose(item)}>{item}</button>
          ))}
        </Segment>
        <Segment label="誰と">
          {companionOptions.map((item) => (
            <button key={item} className={companion === item ? "is-active" : ""} onClick={() => setCompanion(item)}>{item}</button>
          ))}
        </Segment>
        <Segment label="混雑許容度">
          {crowdOptions.map((item) => (
            <button key={item} className={crowd === item ? "is-active" : ""} onClick={() => setCrowd(item)}>{item}</button>
          ))}
        </Segment>
        <div className="two-fields">
          <label className="prototype-field">
            <span>移動可能時間</span>
            <input value={travelTime} onChange={(event) => setTravelTime(event.target.value)} />
          </label>
          <label className="prototype-field">
            <span>予算</span>
            <input value={budget} onChange={(event) => setBudget(event.target.value)} />
          </label>
        </div>
        <label className="prototype-field">
          <span>帰宅希望時刻</span>
          <input value={returnTime} onChange={(event) => setReturnTime(event.target.value)} />
        </label>
        <button className="primary-button action-wide" onClick={() => setSearched(true)}>候補を比較する</button>
      </div>
      {searched && (
        <div className="compact-card-list">
          <p className="result-summary-line">{origin}から{target}へ、{companion}・{crowd}で比較しました。</p>
          {candidates.map((candidate, index) => (
            <RecommendationCard key={candidate.id} candidate={candidate} featured={index === 0} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}

function getSortedCandidates(crowd: string, budget: string) {
  if (budget.includes("3,000") || budget.includes("無料")) {
    return [...formCandidates].sort((a, b) => Number(a.cost.replace(/\D/g, "")) - Number(b.cost.replace(/\D/g, "")));
  }
  if (crowd.includes("かなり") || crowd.includes("避けたい")) {
    return [...formCandidates].sort((a, b) => {
      const rank = { 低め: 0, 普通: 1, やや混雑: 2 };
      return (rank[a.crowd as keyof typeof rank] ?? 9) - (rank[b.crowd as keyof typeof rank] ?? 9);
    });
  }
  return formCandidates;
}

function Segment({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="prototype-segment">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  );
}
