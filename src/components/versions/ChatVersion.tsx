import { useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";
import { RecommendationCard } from "../common/RecommendationCard";
import { chatCandidates, chatExamples, type RoiCandidate } from "../../data/mockData";

type Props = {
  onSelect: (candidate: RoiCandidate) => void;
  onSettings?: () => void;
};

export function ChatVersion({ onSelect }: Props) {
  const [message, setMessage] = useState(chatExamples[0]);
  const [submitted, setSubmitted] = useState(false);
  const conditionChips = parseMockConditions(message);

  return (
    <section className="version-panel">
      <h2 className="version-title">AIに相談して探す</h2>
      <div className="chat-box">
        <div className="assistant-bubble">
          <Sparkles size={16} />
          <span>自然な文章で希望を教えてください。条件に分解して候補を出します。</span>
        </div>
        <label className="chat-input">
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} aria-label="相談内容" />
        </label>
        <div className="example-row">
          {chatExamples.slice(0, 2).map((example) => (
            <button key={example} onClick={() => setMessage(example)}>{example.slice(0, 18)}...</button>
          ))}
        </div>
        <button className="primary-button action-wide" onClick={() => setSubmitted(true)}>
          <SendHorizonal size={18} />
          相談する
        </button>
      </div>
      {submitted && (
        <>
          <section className="read-conditions">
            <h3>読み取った条件</h3>
            <div>
              {conditionChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </section>
          <div className="compact-card-list">
            {chatCandidates.map((candidate, index) => (
              <RecommendationCard key={`${candidate.id}-${index}`} candidate={candidate} featured={index === 0} onSelect={onSelect} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function parseMockConditions(text: string) {
  const chips = new Set<string>();
  if (/子ども|家族/.test(text)) chips.add("子ども連れ");
  if (/夕方|帰り/.test(text)) chips.add("夕方まで");
  if (/混んで|混雑|空いて/.test(text)) chips.add("混雑回避");
  if (/雨|暑/.test(text)) chips.add("屋内");
  if (/高すぎ|無料|お金/.test(text)) chips.add("費用配慮");
  if (/外出|行け|場所/.test(text)) chips.add("外出");
  if (chips.size === 0) {
    ["条件整理中", "移動時間", "費用", "混雑"].forEach((chip) => chips.add(chip));
  }
  return [...chips];
}
