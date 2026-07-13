import { useState } from "react";
import { RecommendationCard } from "../common/RecommendationCard";
import { formCandidates, personalSummary } from "../../data/mockData";

const purposeOptions = ["移動", "子どもと遊ぶ", "買い物", "気分転換"];
const companionOptions = ["ひとり", "家族", "子どもと", "友人と"];
const crowdOptions = ["気にしない", "できれば避けたい", "かなり避けたい"];

export function FormVersion() {
  const [hasDestination, setHasDestination] = useState("目的地あり");
  const [purpose, setPurpose] = useState("移動");
  const [companion, setCompanion] = useState("子どもと");
  const [crowd, setCrowd] = useState("できれば避けたい");
  const [searched, setSearched] = useState(false);

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
          <input defaultValue="自宅" />
        </label>
        <label className="prototype-field">
          <span>{hasDestination === "目的地あり" ? "目的地" : "エリア"}</span>
          <input defaultValue={hasDestination === "目的地あり" ? "上野動物園" : "都内東部"} />
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
            <input defaultValue="1時間以内" />
          </label>
          <label className="prototype-field">
            <span>予算</span>
            <input defaultValue="5,000円以内" />
          </label>
        </div>
        <label className="prototype-field">
          <span>帰宅希望時刻</span>
          <input defaultValue="18:00" />
        </label>
        <button className="primary-button action-wide" onClick={() => setSearched(true)}>候補を比較する</button>
      </div>
      {searched && (
        <div className="compact-card-list">
          {formCandidates.map((candidate, index) => (
            <RecommendationCard key={candidate.id} candidate={candidate} featured={index === 0} />
          ))}
        </div>
      )}
    </section>
  );
}

function Segment({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="prototype-segment">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  );
}
