import { Award, Building2, ChartNoAxesCombined, Compass, MapPin, Sparkles, Trophy } from "lucide-react";
import type { QuestMapProgress } from "../../data/questMapData";
import { getQuestById, getQuestLevel, getSpotById } from "../../lib/questMapScoring";

type QuestMapMyPageProps = {
  progress: QuestMapProgress;
};

const categoryProgress = [
  { label: "時間", value: 74, tone: "blue" },
  { label: "学び", value: 86, tone: "purple" },
  { label: "家族", value: 82, tone: "gold" },
  { label: "健康", value: 61, tone: "green" },
  { label: "都市", value: 68, tone: "teal" },
];

export function QuestMapMyPage({ progress }: QuestMapMyPageProps) {
  const level = getQuestLevel(progress.myRoi);
  const chartValues = [43, 46, 51, 54, 58, progress.myRoi];
  const chartPoints = chartValues.map((value, index) => `${8 + index * 32},${64 - (value - 35) * 1.35}`).join(" ");
  const latestHistory = progress.history[0];
  const latestQuest = latestHistory ? getQuestById(latestHistory.questId) : null;
  const latestSpot = latestHistory ? getSpotById(latestHistory.spotId) : null;
  const completedCount = 12 + progress.history.length;

  return (
    <section className="quest-map-page quest-map-my-page">
      <header className="quest-map-page-heading"><span>MY ROI</span><h1>自分の選択で、見える東京が増える</h1></header>
      <article className="quest-map-roi-hero">
        <div><span>My ROI</span><strong>{progress.myRoi}</strong><small>Lv.{level.level} {level.label}</small></div>
        <div className="quest-map-roi-chart" aria-label="My ROIの推移">
          <svg viewBox="0 0 176 70" role="img" aria-label="My ROIが43から現在値まで上昇した推移"><polyline points={chartPoints} fill="none" stroke="#1988c9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{chartValues.map((value, index) => <circle key={`${value}-${index}`} cx={8 + index * 32} cy={64 - (value - 35) * 1.35} r="3" fill="#fff" stroke="#1988c9" strokeWidth="2" />)}</svg>
        </div>
        <p>次の解放まで <strong>{Math.max(0, level.nextRoi - progress.myRoi)}</strong> ROI</p>
      </article>
      <div className="quest-map-stat-grid">
        <div><Sparkles size={18} /><strong>{completedCount}</strong><span>達成クエスト</span></div>
        <div><MapPin size={18} /><strong>{progress.visitedSpotIds.length}</strong><span>訪問スポット</span></div>
        <div><Compass size={18} /><strong>{progress.visitedAreas.length}</strong><span>訪問エリア</span></div>
      </div>
      <article className="quest-map-category-card">
        <h2><ChartNoAxesCombined size={18} />育っている価値</h2>
        {categoryProgress.map((item) => <div className={`tone-${item.tone}`} key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.value}%` }} /></i><strong>{item.value}</strong></div>)}
      </article>
      <article className="quest-map-recent-card">
        <h2>最近のクエスト</h2>
        {latestHistory && latestSpot ? <div><span>{new Date(latestHistory.completedAt).toLocaleDateString("ja-JP")}</span><strong>{latestHistory.questTitle ?? latestQuest?.title ?? "東京をひらくクエスト"}</strong><p><MapPin size={13} />{latestSpot.name}</p><em>ROI {latestHistory.roiBefore} → {latestHistory.roiAfter}</em></div> : <div><span>最近</span><strong>上野で学びをつなぐ</strong><p><MapPin size={13} />国立科学博物館</p><em>満足度 4.4</em></div>}
      </article>
      <article className="quest-map-trophy-row"><Trophy size={23} /><div><span>最近のトロフィー</span><strong>{progress.trophyIds.includes("water-learning") ? "水の学び手" : "オフピークウォーカー"}</strong></div><Award size={20} /></article>
      <article className="quest-map-atlas-progress"><Building2 size={20} /><div><span>東京図鑑</span><strong>{progress.visitedSpotIds.length} / 24 スポット</strong></div><i><b style={{ width: `${Math.round((progress.visitedSpotIds.length / 24) * 100)}%` }} /></i></article>
    </section>
  );
}
