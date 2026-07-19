import {
  initialQuestMapProgress,
  questDefinitions,
  questMapLegacyStorageKey,
  questMapProgressStorageKey,
  questMapRoiHistoryStorageKey,
  questMapSpots,
  type QuestDefinition,
  type QuestMapProgress,
  type QuestReward,
  type QuestSpot,
  type QuestSpotCategory,
  type QuestSpotScores,
  type RoiEvaluation,
  type RoiFeedback,
  type RoiHistoryItem,
} from "../data/questMapData";

export type QuestPreference = "nearby" | "family-learning" | "refresh" | "saving" | "health" | "discovery" | "balanced";

export type QuestCompletion = {
  questId: string;
  progress: QuestMapProgress;
  evaluation: RoiEvaluation;
  reward: QuestReward;
  unlockedQuestIds: string[];
  levelUp: boolean;
};

const preferenceWeights: Record<QuestPreference, Record<keyof QuestSpotScores, number>> = {
  nearby: { time: 4, cost: 2, satisfaction: 2, learning: 1, family: 1, health: 1, urbanContribution: 1 },
  "family-learning": { time: 2, cost: 2, satisfaction: 3, learning: 5, family: 5, health: 1, urbanContribution: 2 },
  refresh: { time: 2, cost: 1, satisfaction: 5, learning: 1, family: 1, health: 5, urbanContribution: 1 },
  saving: { time: 2, cost: 6, satisfaction: 2, learning: 1, family: 1, health: 1, urbanContribution: 2 },
  health: { time: 2, cost: 2, satisfaction: 3, learning: 1, family: 2, health: 6, urbanContribution: 2 },
  discovery: { time: 1, cost: 1, satisfaction: 4, learning: 4, family: 2, health: 2, urbanContribution: 3 },
  balanced: { time: 3, cost: 3, satisfaction: 3, learning: 3, family: 3, health: 3, urbanContribution: 3 },
};

export function calculatePredictedMyRoi(spot: QuestSpot, preference: QuestPreference) {
  const weights = preferenceWeights[preference];
  const entries = Object.entries(weights) as [keyof QuestSpotScores, number][];
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const weightedScore = entries.reduce((sum, [key, weight]) => sum + spot.scores[key] * weight, 0) / totalWeight;
  return Math.max(0, Math.min(100, Math.round(weightedScore)));
}

export function calculateQuestPredictedMyRoi(quest: QuestDefinition, spot: QuestSpot, preference: QuestPreference) {
  return Math.max(0, Math.min(100, calculatePredictedMyRoi(spot, preference) + (quest.roiAdjustment ?? 0)));
}

export function getRoiFitReasons(spot: QuestSpot, preference: QuestPreference) {
  const reasonsByPreference: Record<QuestPreference, string[]> = {
    nearby: ["移動時間を抑えやすい", "短い時間でも予定に組み込みやすい"],
    "family-learning": ["家族で学びを共有しやすい", "費用を抑えながら満足度が期待できる"],
    refresh: ["気分を切り替えやすい", "無理のない時間で過ごせる"],
    saving: ["予算にゆとりを残せる", "コストに対する満足が見込める"],
    health: ["心身を動かす時間をつくれる", "普段と違うリズムを選べる"],
    discovery: ["新しい場所や知識に出会える", "次の選択肢を広げやすい"],
    balanced: ["時間・費用・満足のバランスが取りやすい", "今日の条件に無理なく合う"],
  };
  const indoorReason = spot.indoor ? "屋内で天候の影響を受けにくい" : "屋外で気分転換しやすい";
  return [...reasonsByPreference[preference], indoorReason].slice(0, 3);
}

export function calculateActualMyRoi(predictedMyRoi: number, feedback: RoiFeedback) {
  const satisfactionAdjustment = feedback.satisfaction === "great" ? 4 : feedback.satisfaction === "low" ? -6 : 0;
  const fatigueAdjustment = feedback.fatigue === "high" ? -4 : 0;
  const familyAdjustment = feedback.familyEnjoyment ? 2 : 0;
  const durationAdjustment = feedback.timeExpectation === "longer" ? -3 : 0;
  return Math.max(0, Math.min(100, predictedMyRoi + satisfactionAdjustment + fatigueAdjustment + familyAdjustment + durationAdjustment));
}

export function getQuestById(questId: string) {
  return questDefinitions.find((quest) => quest.id === questId) ?? questDefinitions[0];
}

export function getSpotById(spotId: string) {
  return questMapSpots.find((spot) => spot.id === spotId) ?? questMapSpots[0];
}

export function getQuestCandidates(preference: QuestPreference, progress: QuestMapProgress) {
  const unlocked = questDefinitions.filter((quest) => quest.minimumQuestPoints <= progress.questPoints && !progress.completedQuestIds.includes(quest.id));
  const preferredIds = preference === "family-learning"
    ? ["water-family-learning", "rainbow-public", "mot-culture", "composite-koto"]
    : preference === "health" || preference === "refresh"
      ? ["hibiya-reset", "yumenoshima-green", "mot-culture", "composite-koto"]
      : preference === "saving"
        ? ["rainbow-public", "water-family-learning", "yumenoshima-green", "composite-koto"]
        : preference === "discovery"
          ? ["yumenoshima-green", "mot-culture", "water-family-learning", "composite-koto"]
          : ["water-family-learning", "mot-culture", "rainbow-public", "composite-koto"];

  return [...unlocked]
    .sort((left, right) => {
      const normalizedLeft = preferredIds.indexOf(left.id) === -1 ? 99 : preferredIds.indexOf(left.id);
      const normalizedRight = preferredIds.indexOf(right.id) === -1 ? 99 : preferredIds.indexOf(right.id);
      if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
      return calculateQuestPredictedMyRoi(right, getSpotById(right.spotId), preference) - calculateQuestPredictedMyRoi(left, getSpotById(left.spotId), preference);
    })
    .slice(0, 3);
}

export function getLockedQuests(progress: QuestMapProgress) {
  return questDefinitions.filter((quest) => quest.minimumQuestPoints > progress.questPoints);
}

export function getQuestLevel(questPoints: number) {
  if (questPoints >= 3000) return { level: 5, label: "シークレット探索", nextUnlockPoints: 3000 };
  if (questPoints >= 2000) return { level: 4, label: "エリア探索", nextUnlockPoints: 3000 };
  if (questPoints >= 1200) return { level: 3, label: "複合クエスト", nextUnlockPoints: 2000 };
  if (questPoints >= 500) return { level: 2, label: "テーマ探索", nextUnlockPoints: 1200 };
  return { level: 1, label: "はじめてのクエスト", nextUnlockPoints: 500 };
}

export function getAverageMyRoi(history: RoiHistoryItem[]) {
  if (!history.length) return 0;
  return Math.round(history.reduce((sum, item) => sum + item.actualMyRoi, 0) / history.length);
}

export function getMonthAverageMyRoi(history: RoiHistoryItem[]) {
  return getAverageMyRoi(history.slice(0, 3));
}

export function getRewardPreview(quest: QuestDefinition, spot: QuestSpot, predictedMyRoi: number) {
  const roiBonus = predictedMyRoi >= 85 ? 15 : predictedMyRoi >= 70 ? 10 : predictedMyRoi >= 50 ? 5 : 0;
  const urbanBonus = spot.scores.urbanContribution >= 80 ? 5 : 0;
  return { minimum: quest.basePoints, maximum: quest.basePoints + 30 + roiBonus + urbanBonus };
}

function getArea(spot: QuestSpot) {
  return spot.address.match(/.{1,5}[区市]/u)?.[0] ?? spot.address;
}

export function calculateQuestReward(progress: QuestMapProgress, quest: QuestDefinition, actualMyRoi: number): QuestReward {
  const spot = getSpotById(quest.spotId);
  const area = getArea(spot);
  const firstVisitBonus = progress.visitedSpotIds.includes(spot.id) ? 0 : 30;
  const newAreaBonus = progress.visitedAreas.includes(area) ? 0 : 20;
  const hasVisitedCategory = questMapSpots.some((item) => progress.visitedSpotIds.includes(item.id) && item.category === spot.category);
  const newCategoryBonus = hasVisitedCategory ? 0 : 10;
  const streakBonus = progress.consecutiveQuestDays > 0 ? 5 : 0;
  const roiBonus = actualMyRoi >= 85 ? 15 : actualMyRoi >= 70 ? 10 : actualMyRoi >= 50 ? 5 : 0;
  const urbanContributionBonus = spot.scores.urbanContribution >= 80 ? 5 : 0;
  const totalPoints = quest.basePoints + firstVisitBonus + newAreaBonus + newCategoryBonus + streakBonus + roiBonus + urbanContributionBonus;
  return { basePoints: quest.basePoints, firstVisitBonus, newAreaBonus, newCategoryBonus, streakBonus, roiBonus, urbanContributionBonus, totalPoints };
}

export function completeQuest(progress: QuestMapProgress, quest: QuestDefinition, predictedMyRoi: number, feedback: RoiFeedback): QuestCompletion {
  const spot = getSpotById(quest.spotId);
  const actualMyRoi = calculateActualMyRoi(predictedMyRoi, feedback);
  const reward = calculateQuestReward(progress, quest, actualMyRoi);
  const pointsAfter = progress.questPoints + reward.totalPoints;
  const area = getArea(spot);
  const evaluation: RoiEvaluation = {
    predictedMyRoi,
    actualMyRoi,
    userAverageMyRoi: getAverageMyRoi(progress.roiHistory),
    reasons: actualMyRoi >= predictedMyRoi ? ["体験の満足度が予測を上回りました", "次回の推薦にも反映します"] : ["想定より移動負荷が高かったため、予測より少し低くなりました", "次回は移動時間の重みを調整します"],
    feedback,
  };
  const roiHistoryItem: RoiHistoryItem = {
    questId: quest.id,
    questTitle: quest.title,
    spotId: spot.id,
    completedAt: new Date().toISOString(),
    category: spot.category,
    predictedMyRoi,
    actualMyRoi,
    feedback,
  };
  const beforeLevel = getQuestLevel(progress.questPoints);
  const afterLevel = getQuestLevel(pointsAfter);
  const unlockedQuestIds = questDefinitions
    .filter((item) => item.minimumQuestPoints <= pointsAfter && item.minimumQuestPoints > progress.questPoints)
    .map((item) => item.id);
  const nextProgress: QuestMapProgress = {
    ...progress,
    questPoints: pointsAfter,
    completedQuestCount: progress.completedQuestCount + 1,
    completedQuestIds: Array.from(new Set([...progress.completedQuestIds, quest.id])),
    visitedSpotIds: Array.from(new Set([...progress.visitedSpotIds, spot.id])),
    visitedAreas: Array.from(new Set([...progress.visitedAreas, area])),
    unlockedQuestIds: Array.from(new Set([...progress.unlockedQuestIds, ...unlockedQuestIds])),
    trophyIds: Array.from(new Set([...progress.trophyIds, "water-learning"])),
    consecutiveQuestDays: progress.consecutiveQuestDays + 1,
    roiHistory: [roiHistoryItem, ...progress.roiHistory],
  };
  return { questId: quest.id, progress: nextProgress, evaluation, reward, unlockedQuestIds, levelUp: afterLevel.level > beforeLevel.level };
}

export function readQuestMapProgress(): QuestMapProgress {
  try {
    const storedProgress = window.localStorage.getItem(questMapProgressStorageKey);
    const storedHistory = window.localStorage.getItem(questMapRoiHistoryStorageKey);
    if (!storedProgress && !storedHistory) return initialQuestMapProgress;
    const parsedProgress = storedProgress ? JSON.parse(storedProgress) as Partial<QuestMapProgress> : {};
    const parsedHistory = storedHistory ? JSON.parse(storedHistory) as RoiHistoryItem[] : initialQuestMapProgress.roiHistory;
    return { ...initialQuestMapProgress, ...parsedProgress, roiHistory: Array.isArray(parsedHistory) ? parsedHistory : initialQuestMapProgress.roiHistory };
  } catch {
    return initialQuestMapProgress;
  }
}

export function saveQuestMapProgress(progress: QuestMapProgress) {
  try {
    const { roiHistory, ...questProgress } = progress;
    window.localStorage.setItem(questMapProgressStorageKey, JSON.stringify(questProgress));
    window.localStorage.setItem(questMapRoiHistoryStorageKey, JSON.stringify(roiHistory));
  } catch {
    // Storage can be unavailable in private browsing; the current session still works.
  }
}

export function resetQuestMapProgress() {
  try {
    window.localStorage.removeItem(questMapProgressStorageKey);
    window.localStorage.removeItem(questMapRoiHistoryStorageKey);
    window.localStorage.removeItem(questMapLegacyStorageKey);
  } catch {
    // Ignore unavailable storage and return the in-memory demo state.
  }
  return initialQuestMapProgress;
}
