import { useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";
import { RecommendationCard } from "../common/RecommendationCard";
import { chatCandidates, chatConditionChips, chatExamples } from "../../data/mockData";

export function ChatVersion() {
  const [message, setMessage] = useState(chatExamples[0]);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="version-panel">
      <h2 className="version-title">AIに相談して探す</h2>
      <div className="chat-box">
        <div className="assistant-bubble">
          <Sparkles size={16} />
          <span>自然な文章で希望を教えてください。条件に分解して候補を出します。</span>
        </div>
        <label className="chat-input">
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} />
        </label>
        <div className="example-row">
          {chatExamples.slice(0, 2).map((example) => (
            <button key={example} onClick={() => setMessage(example)}>{example.slice(0, 18)}…</button>
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
              {chatConditionChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </section>
          <div className="compact-card-list">
            {chatCandidates.map((candidate, index) => (
              <RecommendationCard key={`${candidate.id}-${index}`} candidate={candidate} featured={index === 0} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
