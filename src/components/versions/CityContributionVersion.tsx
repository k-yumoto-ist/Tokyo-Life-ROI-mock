import { Building2, ChevronLeft, CheckCircle2, Footprints, MapPin, Medal, Sparkles, Trees, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { cityBadges, cityCandidates, cityQuestGoals, type CityCandidateKind, type CityContributionCandidate } from "../../data/cityContributionMockData";

type CityPhase = "quest" | "choices" | "result";

export function CityContributionVersion() {
  const [phase, setPhase] = useState<CityPhase>("quest");
  const [goal, setGoal] = useState(cityQuestGoals[0]);
  const [selectedCandidate, setSelectedCandidate] = useState<CityContributionCandidate | null>(null);
  const [showBadges, setShowBadges] = useState(false);

  function selectCandidate(candidate: CityContributionCandidate) {
    setSelectedCandidate(candidate);
    setPhase("result");
  }

  function resetQuest() {
    setSelectedCandidate(null);
    setPhase("quest");
  }

  return (
    <section className="city-contribution-panel">
      <CityStatus />
      {phase === "quest" && (
        <>
          <section className="city-hero-copy">
            <span><Sparkles size={14} /> CITY QUEST</span>
            <h2>あなたにとって良い選択が、東京にとっても良い選択になる</h2>
          </section>
          <article className="city-quest-card">
            <h3>今日のクエスト</h3>
            <div className="city-goal-grid">
              {cityQuestGoals.map((item) => <button key={item} className={goal === item ? "is-active" : ""} onClick={() => setGoal(item)} aria-pressed={goal === item}>{goal === item && <CheckCircle2 size={14} />}{item}</button>)}
            </div>
            <div className="city-context"><span><MapPin size={14} />出発: 新宿</span><span><UsersRound size={14} />大人2人・子ども2人</span><span><Footprints size={14} />14:00〜17:00</span></div>
            <button className="primary-button action-wide city-quest-button" onClick={() => setPhase("choices")}><Sparkles size={18} />東京クエストを探す</button>
          </article>
          <button className="city-badge-link" onClick={() => setShowBadges(true)}><Medal size={17} />バッジを見る</button>
        </>
      )}
      {phase === "choices" && (
        <section className="city-choices">
          <button className="mini-link-button flow-back" onClick={() => setPhase("quest")}><ChevronLeft size={16} />クエスト条件を変える</button>
          <div className="city-choices-head"><h2>今日のクエスト候補</h2><p>{goal}。自分の感覚で選んでみましょう。</p></div>
          <div className="city-candidate-list">
            {cityCandidates.map((candidate) => <CityCandidateCard key={candidate.id} candidate={candidate} onSelect={selectCandidate} />)}
          </div>
        </section>
      )}
      {phase === "result" && selectedCandidate && <CityResult candidate={selectedCandidate} onBadges={() => setShowBadges(true)} onNext={resetQuest} />}
      {showBadges && <CityBadgesSheet onClose={() => setShowBadges(false)} />}
    </section>
  );
}

function CityStatus() {
  return <article className="city-status-card"><div><span>都市貢献レベル</span><strong>Lv.4</strong></div><div><span>今月のスコア</span><strong>320</strong></div><div><span>東京ポイント</span><strong>180pt</strong></div><div className="city-level-progress"><span>次のレベルまで あと80</span><i><b /></i></div></article>;
}

function CityCandidateCard({ candidate, onSelect }: { candidate: CityContributionCandidate; onSelect: (candidate: CityContributionCandidate) => void }) {
  return <article className="city-candidate-card"><div className={`city-place-icon ${candidate.kind}`}><CandidateIcon kind={candidate.kind} /></div><div className="city-candidate-heading"><h3>{candidate.title}</h3><p>{candidate.area}</p></div><div className="city-hints">{candidate.hints.map((hint) => <span key={hint}>{hint}</span>)}</div><p className="city-travel"><Footprints size={15} />移動時間 {candidate.travelTime}</p><button className="secondary-button action-wide" onClick={() => onSelect(candidate)}>このクエストを選ぶ</button></article>;
}

function CityResult({ candidate, onBadges, onNext }: { candidate: CityContributionCandidate; onBadges: () => void; onNext: () => void }) {
  const { result } = candidate;
  return <section className="city-result"><article className="city-result-card"><span><Sparkles size={15} />クエスト達成！</span><h2>{candidate.title}</h2><p>個人の得と、東京の快適さにつながる選択を記録しました。</p><div className="city-result-metrics"><strong>{result.personalRoi}<small>個人ROI</small></strong><strong>+{result.contributionScore}<small>都市貢献</small></strong><strong>+{result.tokyoPoints}pt<small>東京ポイント</small></strong></div><div className="city-impact-list"><span>混雑分散への貢献 <b>+{result.congestion}</b></span><span>公共施設活用 <b>+{result.publicFacility}</b></span></div></article><article className="city-result-explain"><h3>今回の選択がつくること</h3><p>{result.explanation}</p></article><article className="city-badge-earned"><Medal size={36} /><div><span>新しいバッジを獲得しました！</span><h3>公共施設ハンター</h3><p>公共施設を5回利用</p></div></article><div className="city-result-actions"><button className="primary-button action-wide" onClick={onBadges}><Medal size={18} />バッジを見る</button><button className="secondary-button action-wide" onClick={onNext}>次のクエストを探す</button></div><p className="city-point-note">東京ポイントは将来的な行政・地域サービスとの連携を想定したコンセプトです</p></section>;
}

function CityBadgesSheet({ onClose }: { onClose: () => void }) {
  return <div className="battle-sheet-backdrop" role="presentation" onMouseDown={onClose}><section className="battle-detail-sheet city-badges-sheet" role="dialog" aria-modal="true" aria-label="都市貢献バッジ一覧" onMouseDown={(event) => event.stopPropagation()}><button className="battle-sheet-close" onClick={onClose} aria-label="バッジ一覧を閉じる"><X size={20} /></button><h2>都市貢献バッジ</h2><p>自分に合う選択が、東京の快適さにもつながった記録です。</p><div className="city-badge-list">{cityBadges.map((badge) => <article key={badge.id} className={badge.achieved ? "is-achieved" : ""}><Medal size={23} /><div><strong>{badge.title}</strong><span>{badge.description}</span></div>{badge.achieved && <CheckCircle2 size={17} />}</article>)}</div><small>ポイントの利用先は、公共施設の利用特典・地域イベント・子育てや健康サービス・地域店舗のクーポンなどを想定しています。</small></section></div>;
}

function CandidateIcon({ kind }: { kind: CityCandidateKind }) {
  if (kind === "sports") return <Building2 size={25} />;
  if (kind === "park") return <Trees size={25} />;
  return <MapPin size={25} />;
}
