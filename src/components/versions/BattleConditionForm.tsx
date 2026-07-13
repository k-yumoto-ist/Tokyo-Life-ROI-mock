import { ChevronDown, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { personalSummary } from "../../data/mockData";

type Props = {
  onStart: () => void;
};

const purposes = ["移動", "子どもと遊ぶ", "買い物", "気分転換", "食事", "公園・自然", "雨の日", "混雑回避"];
const companions = ["ひとり", "家族", "子どもと", "友人と"];
const priorities = ["時間を節約", "お金を節約", "とにかく楽しむ", "混雑を避ける", "家族の負担を減らす", "バランス重視"];

export function BattleConditionForm({ onStart }: Props) {
  const [destinationMode, setDestinationMode] = useState("目的地未定");
  const [purpose, setPurpose] = useState("子どもと遊ぶ");
  const [companion, setCompanion] = useState("子どもと");
  const [priority, setPriority] = useState(["混雑を避ける", "家族の負担を減らす"]);
  const [crowd, setCrowd] = useState("できれば避けたい");
  const [travelTime, setTravelTime] = useState("60分以内");
  const [budget, setBudget] = useState("10,000円以内");
  const [detailsOpen, setDetailsOpen] = useState(false);

  function togglePriority(value: string) {
    setPriority((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <section className="battle-condition-form">
      <div className="battle-copy">
        <span className="battle-eyebrow"><Sparkles size={14} /> AI BATTLE</span>
        <h2>条件を入れて、3つのプランを戦わせよう</h2>
        <p>時間・費用・混雑・満足度をAIが比較します</p>
      </div>
      <p className="profile-line">{personalSummary}</p>
      <article className="form-card battle-form-card">
        <div className="prototype-segment">
          <span>目的地</span>
          <div>
            {["目的地あり", "目的地未定"].map((item) => (
              <button key={item} className={destinationMode === item ? "is-active" : ""} onClick={() => setDestinationMode(item)}>
                {destinationMode === item && <CheckCircle2 size={14} />}{item}
              </button>
            ))}
          </div>
        </div>
        <label className="prototype-field">
          <span><MapPin size={14} /> 出発地</span>
          <input value="自宅" readOnly aria-label="出発地" />
        </label>
        {destinationMode === "目的地あり" ? (
          <label className="prototype-field">
            <span>目的地</span>
            <input value="上野動物園" readOnly aria-label="目的地" />
          </label>
        ) : (
          <ChipGroup label="目的" value={purpose} options={purposes} onChange={setPurpose} />
        )}
        <ChipGroup label="誰と" value={companion} options={companions} onChange={setCompanion} />
        <div className="prototype-segment">
          <span>今回の優先条件</span>
          <div>
            {priorities.slice(0, 4).map((item) => (
              <button key={item} className={priority.includes(item) ? "is-active" : ""} onClick={() => togglePriority(item)} aria-pressed={priority.includes(item)}>
                {priority.includes(item) && <CheckCircle2 size={14} />}{item}
              </button>
            ))}
          </div>
        </div>
        <button className="battle-detail-trigger" onClick={() => setDetailsOpen((value) => !value)} aria-expanded={detailsOpen}>
          詳細条件を設定 <ChevronDown size={17} className={detailsOpen ? "is-open" : ""} />
        </button>
        {detailsOpen && (
          <div className="battle-detail-panel">
            <ChipGroup label="混雑許容度" value={crowd} options={["気にしない", "できれば避けたい", "かなり避けたい"]} onChange={setCrowd} />
            <div className="two-fields">
              <ChipGroup label="移動可能時間" value={travelTime} options={["30分以内", "60分以内", "90分以内"]} onChange={setTravelTime} />
              <ChipGroup label="予算" value={budget} options={["3,000円以内", "5,000円以内", "10,000円以内", "指定なし"]} onChange={setBudget} />
            </div>
          </div>
        )}
        <button className="primary-button action-wide battle-start-button" onClick={onStart}>
          <Sparkles size={19} /> 3プランでAIバトル開始
        </button>
      </article>
    </section>
  );
}

function ChipGroup({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="prototype-segment">
      <span>{label}</span>
      <div>
        {options.map((item) => <button key={item} className={value === item ? "is-active" : ""} onClick={() => onChange(item)}>{value === item && <CheckCircle2 size={14} />}{item}</button>)}
      </div>
    </div>
  );
}
