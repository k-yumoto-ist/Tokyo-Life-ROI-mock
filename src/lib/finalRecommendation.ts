import {
  defaultFinalProfile,
  demoFinalHistory,
  finalCandidates,
  finalStateStorageKey,
  initialFinalState,
  legacyFinalStateStorageKey,
  type FinalActionStatus,
  type FinalBurden,
  type FinalCandidate,
  type FinalCandidateRole,
  type FinalChoiceRecord,
  type FinalPriority,
  type FinalProfile,
  type FinalRevisitIntent,
  type FinalSatisfaction,
  type FinalState,
  type FinalTodayContext,
  type FinalValueKey,
} from "../data/finalMockData";

export type FinalRecommendation = {
  candidate: FinalCandidate;
  role: FinalCandidateRole;
  affinity: number;
  predictedQol: number;
  predictedRoi: number;
  qolLabel: string;
  roiLabel: string;
  reason: string;
  qolReason: string;
  roiReason: string;
  learnedReason?: string;
};

const qolWeights: Record<FinalValueKey, number> = {
  time: .25, cost: .2, crowd: .75, fatigue: 1.25, satisfaction: 2.2,
  family: 1.6, weather: 1.1, novelty: 1.15, publicValue: .15, accessibility: .8,
};

const roiWeights: Record<FinalValueKey, number> = {
  time: 1.8, cost: 1.7, crowd: 1.15, fatigue: 1.35, satisfaction: .75,
  family: .45, weather: .7, novelty: .25, publicValue: .15, accessibility: .7,
};

const priorityWeights: Record<FinalPriority, { qol: Partial<Record<FinalValueKey, number>>; roi: Partial<Record<FinalValueKey, number>> }> = {
  "low-fatigue": { qol: { fatigue: 2.4, crowd: .6 }, roi: { fatigue: 2.7, accessibility: 1.1 } },
  time: { qol: { fatigue: .4 }, roi: { time: 3.3, fatigue: .8 } },
  saving: { qol: { satisfaction: .3 }, roi: { cost: 3.5 } },
  children: { qol: { family: 3.6, satisfaction: 1.5 }, roi: { family: 1.1 } },
  novelty: { qol: { novelty: 3.8, satisfaction: 1.2 }, roi: { novelty: .8 } },
  quiet: { qol: { crowd: 2.3, fatigue: .8 }, roi: { crowd: 2.7 } },
  slow: { qol: { satisfaction: 2.5, fatigue: 1.6, family: .7 }, roi: { fatigue: .5 } },
};

function clamp(value: number) {
  return Math.max(35, Math.min(97, Math.round(value)));
}

function scoreLabel(score: number) {
  if (score >= 88) return "とても高い";
  if (score >= 78) return "高い";
  if (score >= 67) return "ふつう";
  return "低め";
}

function applyWeight(target: Record<FinalValueKey, number>, changes: Partial<Record<FinalValueKey, number>>) {
  Object.entries(changes).forEach(([key, value]) => { target[key as FinalValueKey] += value ?? 0; });
}

function buildWeights(profile: FinalProfile, priorities: FinalPriority[], history: FinalChoiceRecord[]) {
  const qol = { ...qolWeights };
  const roi = { ...roiWeights };
  if (profile.household === "family") qol.family += 1.5;
  if (profile.dislikesCrowds) { qol.crowd += 1.1; roi.crowd += 1.2; }
  if (profile.walkingTolerance === "low") { qol.fatigue += 1.1; roi.fatigue += 1.4; }
  if (profile.heatTolerance === "low") { qol.weather += 1.2; roi.weather += .6; }
  if (profile.accessibilityNeeded) { qol.accessibility += 1.7; roi.accessibility += 2; }
  qol.novelty += profile.noveltyInterest / 80;
  priorities.forEach((priority) => {
    applyWeight(qol, priorityWeights[priority].qol);
    applyWeight(roi, priorityWeights[priority].roi);
  });

  history.forEach((record) => {
    if (record.actionStatus !== "visited") return;
    if (record.satisfaction === "great") qol.satisfaction += .55;
    if (record.satisfaction === "low") qol.satisfaction -= .2;
    if (record.feedbackReasons.includes("家族の満足度が高かった")) qol.family += .5;
    if (record.feedbackReasons.includes("新しい発見があった")) qol.novelty += .45;
    if (record.feedbackReasons.includes("思ったより混んでいた")) { qol.crowd += .35; roi.crowd += .45; }
    if (record.feedbackReasons.includes("思ったより時間がかかった")) roi.time += .5;
    if (record.feedbackReasons.includes("思ったよりお金がかかった")) roi.cost += .5;
    if (record.burden === "tired") { qol.fatigue += .35; roi.fatigue += .5; }
  });
  return { qol, roi, learningRatio: Math.min(.5, history.length * .08) };
}

function weightedScore(candidate: FinalCandidate, weights: Record<FinalValueKey, number>) {
  const entries = Object.entries(weights) as [FinalValueKey, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  return entries.reduce((sum, [key, weight]) => sum + candidate.scores[key] * weight, 0) / total;
}

function candidateHistoryAverage(candidateId: string, history: FinalChoiceRecord[], key: "actualQol" | "actualRoi") {
  const values = history.filter((item) => item.selectedCandidateId === candidateId && typeof item[key] === "number").map((item) => item[key] as number);
  if (!values.length) return undefined;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreCandidate(candidate: FinalCandidate, context: FinalTodayContext, profile: FinalProfile, history: FinalChoiceRecord[]) {
  const { qol, roi, learningRatio } = buildWeights(profile, context.priorities, history);
  const historicalQol = candidateHistoryAverage(candidate.id, history, "actualQol") ?? 74;
  const historicalRoi = candidateHistoryAverage(candidate.id, history, "actualRoi") ?? 74;
  const weatherQol = context.weather === "hot" && !candidate.indoor ? -12 : 0;
  const budgetRoi = candidate.cost <= context.budget ? 4 : -14;
  const durationRoi = candidate.travelMinutes + candidate.stayMinutes <= 150 ? 3 : -7;
  const predictedQol = clamp(weightedScore(candidate, qol) * (1 - learningRatio) + historicalQol * learningRatio + weatherQol);
  const predictedRoi = clamp(weightedScore(candidate, roi) * (1 - learningRatio) + historicalRoi * learningRatio + budgetRoi + durationRoi);
  return { candidate, predictedQol, predictedRoi, affinity: Math.round((predictedQol + predictedRoi) / 2) };
}

function learnedReason(history: FinalChoiceRecord[]) {
  if (!history.length) return undefined;
  if (history.some((item) => item.feedbackReasons.includes("家族の満足度が高かった"))) return "家族が楽しんだ日のQOL評価を反映しました";
  if (history.some((item) => item.burden === "tired")) return "疲れた日の実績ROIを反映しました";
  if (history.some((item) => item.actionStatus === "skipped")) return "選んでも行かなかった条件を弱めています";
  return "これまでの選択と振り返りを反映しています";
}

function recommendationCopy(candidate: FinalCandidate, role: FinalCandidateRole) {
  if (role === "qol-focus") return {
    reason: "効率よりも、今日の充実感を大切にする案です",
    qolReason: candidate.scores.novelty > 85 ? "新しい体験が、家族の思い出につながる" : "家族でゆっくり楽しめる",
    roiReason: candidate.travelMinutes > 35 ? "移動は長めでも、得られる体験は大きい" : "少し費用を使って、満足を優先",
  };
  if (role === "roi-focus") return {
    reason: "時間と費用の負担を抑えやすい案です",
    qolReason: candidate.scores.novelty < 55 ? "気軽だが、体験としてはいつも通り" : "無理なく楽しめる",
    roiReason: candidate.cost === 0 ? "近くて無料。負担を最小限にできる" : "移動と費用のバランスが良い",
  };
  return {
    reason: "効率と充実感の両方を、今日の条件で整えました",
    qolReason: "親子の満足と心身の余裕を両立しやすい",
    roiReason: "費用を抑えつつ、移動負担も小さい",
  };
}

function toRecommendation(item: ReturnType<typeof scoreCandidate>, role: FinalCandidateRole, history: FinalChoiceRecord[]): FinalRecommendation {
  const copy = recommendationCopy(item.candidate, role);
  return { ...item, role, qolLabel: scoreLabel(item.predictedQol), roiLabel: scoreLabel(item.predictedRoi), ...copy, learnedReason: role === "balanced" ? learnedReason(history) : undefined };
}

export function recommendFinalCandidates(context: FinalTodayContext, state: FinalState): FinalRecommendation[] {
  const scored = finalCandidates.map((candidate) => scoreCandidate(candidate, context, state.profile, state.history));
  const balanced = [...scored].sort((left, right) => right.affinity - left.affinity)[0];
  const qolFocus = [...scored].filter((item) => item.candidate.id !== balanced.candidate.id).sort((left, right) => right.predictedQol - left.predictedQol)[0];
  const roiFocus = [...scored].filter((item) => item.candidate.id !== balanced.candidate.id && item.candidate.id !== qolFocus.candidate.id).sort((left, right) => right.predictedRoi - left.predictedRoi)[0];
  return [
    toRecommendation(balanced, "balanced", state.history),
    toRecommendation(qolFocus, "qol-focus", state.history),
    toRecommendation(roiFocus, "roi-focus", state.history),
  ];
}

export function getLearningStage(historyCount: number) {
  if (historyCount === 0) return { label: "はじめまして", note: "設定から、最初の提案をつくります" };
  if (historyCount <= 2) return { label: "好みを学習中", note: `${historyCount}回の記録を反映しています` };
  if (historyCount <= 5) return { label: "少しずつ分かってきました", note: `${historyCount}回の行動から選び方を学習しました` };
  return { label: "あなたらしい選び方が見えてきました", note: `${historyCount}回の行動を反映しています` };
}

export function buildQolInsight(satisfaction?: FinalSatisfaction, revisitIntent?: FinalRevisitIntent, reasons: string[] = []) {
  if (reasons.includes("家族の満足度が高かった")) return "家族が楽しめる時間が、QOLを高める傾向です";
  if (reasons.includes("新しい発見があった")) return "新しい体験が、暮らしの充実につながりました";
  if (reasons.includes("予想より楽しかった")) return "効率だけでは見えない楽しさがありました";
  if (revisitIntent === "no" || satisfaction === "low") return "今回の体験は、次回のQOL予測を控えめにします";
  return "今回の満足度を、次のMy QOL予測に反映します";
}

export function buildRoiInsight(burden?: FinalBurden, reasons: string[] = []) {
  if (burden === "tired") return "移動や疲労の負担を、次回のROI予測で重く見ます";
  if (reasons.includes("思ったより時間がかかった")) return "所要時間の見積もりを次回は厳しくします";
  if (reasons.includes("思ったよりお金がかかった")) return "実際の費用を次回のROI予測に反映します";
  if (burden === "easy") return "負担の少なさが、実績ROIを支えました";
  return "時間・費用・負担の実績を、次のMy ROI予測に反映します";
}

function actualQol(predicted: number, satisfaction: FinalSatisfaction, revisitIntent: FinalRevisitIntent, reasons: string[]) {
  const satisfactionDelta = satisfaction === "great" ? 8 : satisfaction === "good" ? 2 : -12;
  const revisitDelta = revisitIntent === "yes" ? 3 : revisitIntent === "no" ? -6 : 0;
  const experienceDelta = (reasons.includes("予想より楽しかった") ? 4 : 0) + (reasons.includes("家族の満足度が高かった") ? 4 : 0) + (reasons.includes("新しい発見があった") ? 3 : 0);
  return clamp(predicted + satisfactionDelta + revisitDelta + experienceDelta);
}

function actualRoi(predicted: number, burden: FinalBurden, satisfaction: FinalSatisfaction, reasons: string[]) {
  const burdenDelta = burden === "easy" ? 4 : burden === "tired" ? -10 : 0;
  const varianceDelta = (reasons.includes("思ったより時間がかかった") ? -6 : 0) + (reasons.includes("思ったよりお金がかかった") ? -6 : 0) + (reasons.includes("思ったより混んでいた") ? -4 : 0);
  const satisfactionDelta = satisfaction === "great" ? 2 : satisfaction === "low" ? -2 : 0;
  return clamp(predicted + burdenDelta + varianceDelta + satisfactionDelta);
}

export function createChoiceRecord({ candidateId, comparedIds, context, status, predictedQol, predictedRoi, satisfaction, burden, revisitIntent, reasons }: {
  candidateId: string; comparedIds: string[]; context: FinalTodayContext; status: FinalActionStatus;
  predictedQol: number; predictedRoi: number; satisfaction?: FinalSatisfaction; burden?: FinalBurden; revisitIntent?: FinalRevisitIntent; reasons?: string[];
}): FinalChoiceRecord {
  const feedbackReasons = reasons ?? [];
  const visited = status === "visited" && satisfaction && burden && revisitIntent;
  const qolInsight = status === "skipped" ? "行動しなかった条件も、次のQOL提案を広げる手がかりです" : status === "changed" ? "別の場所を選んだことも、満足につながる条件として学びます" : buildQolInsight(satisfaction, revisitIntent, feedbackReasons);
  const roiInsight = status === "skipped" ? "行動につながりにくい負担条件を、次回は弱めます" : status === "changed" ? "予定変更のしやすさも、次回のROIで考慮します" : buildRoiInsight(burden, feedbackReasons);
  return {
    id: `final-${Date.now()}`, scenario: context.prompt, selectedCandidateId: candidateId, comparedCandidateIds: comparedIds,
    actionStatus: status, satisfaction, burden, revisitIntent, predictedQol, predictedRoi,
    actualQol: visited ? actualQol(predictedQol, satisfaction, revisitIntent, feedbackReasons) : undefined,
    actualRoi: visited ? actualRoi(predictedRoi, burden, satisfaction, feedbackReasons) : undefined,
    feedbackReasons, learnedInsight: qolInsight, qolInsight, roiInsight, happenedAt: new Date().toISOString(),
  };
}

export function getFinalDashboardSummary(history: FinalChoiceRecord[]) {
  const visited = history.filter((item) => item.actionStatus === "visited");
  const qolValues = visited.flatMap((item) => typeof item.actualQol === "number" ? [item.actualQol] : []);
  const roiValues = visited.flatMap((item) => typeof item.actualRoi === "number" ? [item.actualRoi] : []);
  const average = (values: number[], fallback: number) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : fallback;
  const familyWins = visited.filter((item) => item.feedbackReasons.includes("家族の満足度が高かった")).length;
  const tired = visited.filter((item) => item.burden === "tired").length;
  return {
    averageQol: average(qolValues, 76), averageRoi: average(roiValues, 74),
    qolTrend: qolValues.length > 1 ? qolValues[qolValues.length - 1] - qolValues[0] : 0,
    roiTrend: roiValues.length > 1 ? roiValues[roiValues.length - 1] - roiValues[0] : 0,
    qolHeadline: familyWins ? "家族時間が充実につながっています" : "満足につながる条件を学習中です",
    qolNeed: tired ? "休息は少し不足気味" : "心身の余裕は安定",
    roiHeadline: tired ? "疲労を含めるとROIが下がる傾向" : "時間と負担のバランスは良好",
  };
}

function migrateRecord(record: FinalChoiceRecord): FinalChoiceRecord {
  if (typeof record.predictedQol === "number") return record;
  const satisfactionBase = record.satisfaction === "great" ? 84 : record.satisfaction === "good" ? 74 : 62;
  return { ...record, predictedQol: satisfactionBase - 2, predictedRoi: 74, actualQol: record.actionStatus === "visited" ? satisfactionBase : undefined, actualRoi: record.actionStatus === "visited" ? 72 : undefined, burden: record.actionStatus === "visited" ? "balanced" : undefined, revisitIntent: record.actionStatus === "visited" ? "maybe" : undefined, qolInsight: record.learnedInsight, roiInsight: "過去の時間・費用・負担をもとに再評価しました" };
}

export function readFinalState(): FinalState {
  try {
    const raw = window.localStorage.getItem(finalStateStorageKey) ?? window.localStorage.getItem(legacyFinalStateStorageKey);
    if (!raw) return initialFinalState;
    const parsed = JSON.parse(raw) as Partial<FinalState>;
    return { ...initialFinalState, ...parsed, profile: { ...defaultFinalProfile, ...parsed.profile }, history: Array.isArray(parsed.history) ? parsed.history.map(migrateRecord) : [] };
  } catch { return initialFinalState; }
}

export function saveFinalState(state: FinalState) {
  try { window.localStorage.setItem(finalStateStorageKey, JSON.stringify(state)); } catch { /* Keep the in-memory demo usable. */ }
}

export function createDemoFinalState(): FinalState {
  return { profile: defaultFinalProfile, history: demoFinalHistory, lastPrompt: "日曜日の午後、6歳の子どもと2時間過ごしたい", lastPriorities: ["low-fatigue", "children"], demoEnabled: true };
}

export function resetFinalState() {
  try { window.localStorage.removeItem(finalStateStorageKey); window.localStorage.removeItem(legacyFinalStateStorageKey); } catch { /* Ignore unavailable storage. */ }
  return initialFinalState;
}
