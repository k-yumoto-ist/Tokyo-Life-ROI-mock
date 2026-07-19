import { Award, Building2, ChartNoAxesCombined, Compass, MapPin, Sparkles, Trophy } from "lucide-react";
import type { QuestMapProgress } from "../../data/questMapData";
import { getAverageMyRoi, getMonthAverageMyRoi, getQuestLevel, getSpotById } from "../../lib/questMapScoring";

type QuestMapMyPageProps = {
  progress: QuestMapProgress;
};

const categoryProgress = [
  { label: "家族×学び", value: 82, tone: "blue" },
  { label: "自然×健康", value: 78, tone: "green" },
  { label: "長距離移動", value: 65, tone: "gold" },
];

export function QuestMapMyPage({ progress }: QuestMapMyPageProps) {
  const questLevel = getQuestLevel(progress.questPoints);
  const recentAverage = getAverageMyRoi(progress.roiHistory.slice(0, 5));
  const monthAverage = getMonthAverageMyRoi(progress.roiHistory);
  const highestMyRoi = Math.max(...progress.roiHistory.map((item) => item.actualMyRoi));
  const chartValues = progress.roiHistory.slice(0, 6).reverse().map((item) => item.actualMyRoi);
  const chartPoints = chartValues.map((value, index) => `${8 + index * 32},${68 - (value - 55) * 1.35}`).join(" ");
  const latestHistory = progress.roiHistory[0];
  const latestSpot = latestHistory ? getSpotById(latestHistory.spotId) : null;
  const pointsToNext = Math.max(0, questLevel.nextUnlockPoints - progress.questPoints);

  return (
    <section className="quest-map-page quest-map-my-page">
      <header className="quest-map-page-heading"><span>MY ROI & QUESTS</span><h1>あなたの選択と行動</h1><p>ROIは選択の質、Quest Pointは東京での実績を表します。</p></header>
      <article className="quest-map-roi-trend-card">
        <div className="quest-map-section-heading"><ChartNoAxesCombined size={18} /><div><span>あなたに合う選択の傾向</span><strong>My ROIは蓄積せず、振り返ります</strong></div></div>
        <div className="quest-map-roi-trend-grid"><div><span>直近平均</span><strong>{recentAverage}</strong></div><div><span>今月平均</span><strong>{monthAverage}</strong></div><div><span>過去最高</span><strong>{highestMyRoi}</strong></div></div>
        <div className="quest-map-roi-chart" aria-label="直近の実績My ROI推移"><svg viewBox="0 0 176 74" role="img" aria-label="実績My ROIの推移"><polyline points={chartPoints} fill="none" stroke="#1988c9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{chartValues.map((value, index) => <circle key={`${value}-${index}`} cx={8 + index * 32} cy={68 - (value - 55) * 1.35} r="3" fill="#fff" stroke="#1988c9" strokeWidth="2" />)}</svg></div>
        <p className="quest-map-roi-insight">家族×学びの選択で高い傾向。長時間移動を含むクエストでは低下しやすい傾向です。</p>
      </article>
      <article className="quest-map-quest-progress-card">
        <div className="quest-map-section-heading"><Sparkles size={18} /><div><span>東京での行動実績</span><strong>Quest Pointで次の選択肢を解放</strong></div></div>
        <div className="quest-map-points-hero"><div><span>Quest Level</span><strong>Lv.{questLevel.level}</strong><small>{questLevel.label}</small></div><div><span>累積 Quest Point</span><strong>{progress.questPoints.toLocaleString("ja-JP")} <small>QP</small></strong><i><b style={{ width: `${Math.min(100, (progress.questPoints / questLevel.nextUnlockPoints) * 100)}%` }} /></i><em>次の解放まで {pointsToNext} QP</em></div></div>
      </article>
      <div className="quest-map-stat-grid">
        <div><Sparkles size={18} /><strong>{progress.completedQuestCount}</strong><span>達成クエスト</span></div>
        <div><MapPin size={18} /><strong>{progress.visitedSpotIds.length}</strong><span>訪問スポット</span></div>
        <div><Compass size={18} /><strong>{progress.visitedAreas.length}</strong><span>訪問エリア</span></div>
      </div>
      <article className="quest-map-category-card">
        <h2><ChartNoAxesCombined size={18} />自分に合う条件</h2>
        {categoryProgress.map((item) => <div className={`tone-${item.tone}`} key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.value}%` }} /></i><strong>{item.value}</strong></div>)}
      </article>
      <article className="quest-map-recent-card">
        <h2>最近のクエスト</h2>
        {latestHistory && latestSpot ? <div><span>{new Date(latestHistory.completedAt).toLocaleDateString("ja-JP")}</span><strong>{latestHistory.questTitle}</strong><p><MapPin size={13} />{latestSpot.name}</p><em>予測 {latestHistory.predictedMyRoi} / 実績 {latestHistory.actualMyRoi}</em></div> : <div><span>最近</span><strong>上野で学びをつなぐ</strong><p><MapPin size={13} />国立科学博物館</p><em>実績My ROI 74</em></div>}
      </article>
      <article className="quest-map-trophy-row"><Trophy size={23} /><div><span>最近のトロフィー</span><strong>{progress.trophyIds.includes("water-learning") ? "水の学び手" : "オフピークウォーカー"}</strong></div><Award size={20} /></article>
      <article className="quest-map-atlas-progress"><Building2 size={20} /><div><span>東京図鑑</span><strong>{progress.visitedSpotIds.length} / 24 スポット</strong></div><i><b style={{ width: `${Math.round((progress.visitedSpotIds.length / 24) * 100)}%` }} /></i></article>
    </section>
  );
}
