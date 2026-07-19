import {
  initialQuestMapProgress,
  questDefinitions,
  questMapSpots,
  questMapStorageKey,
  type QuestDefinition,
  type QuestMapProgress,
  type QuestSpot,
  type QuestSpotScores,
} from "../data/questMapData";

export type QuestPreference = "nearby" | "family-learning" | "refresh" | "saving" | "health" | "discovery" | "balanced";

const preferenceWeights: Record<QuestPreference, Record<keyof QuestSpotScores, number>> = {
  nearby: { time: 4, cost: 2, satisfaction: 2, learning: 1, family: 1, health: 1, urbanContribution: 1 },
  "family-learning": { time: 2, cost: 2, satisfaction: 3, learning: 5, family: 5, health: 1, urbanContribution: 2 },
  refresh: { time: 2, cost: 1, satisfaction: 5, learning: 1, family: 1, health: 5, urbanContribution: 1 },
  saving: { time: 2, cost: 6, satisfaction: 2, learning: 1, family: 1, health: 1, urbanContribution: 2 },
  health: { time: 2, cost: 2, satisfaction: 3, learning: 1, family: 2, health: 6, urbanContribution: 2 },
  discovery: { time: 1, cost: 1, satisfaction: 4, learning: 4, family: 2, health: 2, urbanContribution: 3 },
  balanced: { time: 3, cost: 3, satisfaction: 3, learning: 3, family: 3, health: 3, urbanContribution: 3 },
};

export function calculatePredictedRoi(spot: QuestSpot, preference: QuestPreference) {
  const weights = preferenceWeights[preference];
  const entries = Object.entries(weights) as [keyof QuestSpotScores, number][];
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const weightedScore = entries.reduce((sum, [key, weight]) => sum + spot.scores[key] * weight, 0) / totalWeight;
  return Math.max(0, Math.min(100, Math.round(weightedScore)));
}

export function getSpotById(spotId: string) {
  return questMapSpots.find((spot) => spot.id === spotId) ?? questMapSpots[0];
}

export function getQuestById(questId: string) {
  return questDefinitions.find((quest) => quest.id === questId) ?? questDefinitions[0];
}

export function getQuestCandidates(preference: QuestPreference, progress: QuestMapProgress) {
  const unlocked = questDefinitions.filter((quest) => quest.minimumRoi <= progress.myRoi && !progress.completedQuestIds.includes(quest.id));
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
      const leftPriority = preferredIds.indexOf(left.id);
      const rightPriority = preferredIds.indexOf(right.id);
      const normalizedLeft = leftPriority === -1 ? 99 : leftPriority;
      const normalizedRight = rightPriority === -1 ? 99 : rightPriority;
      if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
      return calculatePredictedRoi(getSpotById(right.spotId), preference) - calculatePredictedRoi(getSpotById(left.spotId), preference);
    })
    .slice(0, 3);
}

export function getLockedQuests(progress: QuestMapProgress) {
  return questDefinitions.filter((quest) => quest.minimumRoi > progress.myRoi);
}

export function getQuestLevel(myRoi: number) {
  if (myRoi >= 85) return { level: 5, label: "シークレット探索", nextRoi: 100 };
  if (myRoi >= 70) return { level: 4, label: "エリア探索", nextRoi: 85 };
  if (myRoi >= 60) return { level: 3, label: "複合クエスト", nextRoi: 70 };
  if (myRoi >= 30) return { level: 2, label: "テーマ探索", nextRoi: 60 };
  return { level: 1, label: "はじめの探索", nextRoi: 30 };
}

export function completeQuest(progress: QuestMapProgress, quest: QuestDefinition) {
  if (progress.completedQuestIds.includes(quest.id)) return progress;
  const spot = getSpotById(quest.spotId);
  const roiAfter = Math.min(100, progress.myRoi + quest.roiGain);
  const area = spot.address.split(/[区市]/)[0] + (spot.address.includes("区") ? "区" : spot.address.includes("市") ? "市" : "");
  return {
    ...progress,
    myRoi: roiAfter,
    completedQuestIds: [...progress.completedQuestIds, quest.id],
    visitedSpotIds: Array.from(new Set([...progress.visitedSpotIds, spot.id])),
    visitedAreas: Array.from(new Set([...progress.visitedAreas, area])),
    trophyIds: Array.from(new Set([...progress.trophyIds, "water-learning"])),
    history: [{ questId: quest.id, questTitle: quest.title, spotId: spot.id, completedAt: new Date().toISOString(), roiBefore: progress.myRoi, roiAfter }, ...progress.history],
  } satisfies QuestMapProgress;
}

export function readQuestMapProgress(): QuestMapProgress {
  try {
    const stored = window.localStorage.getItem(questMapStorageKey);
    if (!stored) return initialQuestMapProgress;
    const parsed = JSON.parse(stored) as Partial<QuestMapProgress>;
    return { ...initialQuestMapProgress, ...parsed };
  } catch {
    return initialQuestMapProgress;
  }
}

export function saveQuestMapProgress(progress: QuestMapProgress) {
  window.localStorage.setItem(questMapStorageKey, JSON.stringify(progress));
}

export function resetQuestMapProgress() {
  window.localStorage.removeItem(questMapStorageKey);
  return initialQuestMapProgress;
}
