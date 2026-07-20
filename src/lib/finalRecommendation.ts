import {
  defaultFinalProfile,
  demoFinalHistory,
  finalCandidates,
  finalStateStorageKey,
  initialFinalState,
  type FinalActionStatus,
  type FinalCandidate,
  type FinalCandidateRole,
  type FinalChoiceRecord,
  type FinalPriority,
  type FinalProfile,
  type FinalSatisfaction,
  type FinalState,
  type FinalTodayContext,
  type FinalValueKey,
} from "../data/finalMockData";

export type FinalRecommendation = {
  candidate: FinalCandidate;
  role: FinalCandidateRole;
  affinity: number;
  reason: string;
  learnedReason?: string;
};

const baseWeights: Record<FinalValueKey, number> = {
  time: 1,
  cost: 1,
  crowd: 1,
  fatigue: 1,
  satisfaction: 1.2,
  family: 1,
  weather: 1,
  novelty: .7,
  publicValue: .25,
  accessibility: .5,
};

const priorityWeights: Record<FinalPriority, Partial<Record<FinalValueKey, number>>> = {
  "low-fatigue": { fatigue: 3.2, time: 1.4, accessibility: 1.2 },
  time: { time: 3.2, fatigue: 1.3 },
  saving: { cost: 3.4 },
  children: { family: 3.5, satisfaction: 1.8 },
  novelty: { novelty: 3.6, satisfaction: 1.4 },
  quiet: { crowd: 3.5, fatigue: 1.4 },
  slow: { satisfaction: 2.5, fatigue: 2, crowd: 1.4 },
};

function mergeWeights(profile: FinalProfile, priorities: FinalPriority[], history: FinalChoiceRecord[]) {
  const weights = { ...baseWeights };
  if (profile.dislikesCrowds) weights.crowd += 1.8;
  if (profile.walkingTolerance === "low") weights.fatigue += 1.6;
  if (profile.household === "family") weights.family += 1.8;
  if (profile.heatTolerance === "low") weights.weather += 1.4;
  if (profile.accessibilityNeeded) weights.accessibility += 2.4;
  weights.novelty += profile.noveltyInterest / 100;

  priorities.forEach((priority) => {
    Object.entries(priorityWeights[priority]).forEach(([key, value]) => {
      weights[key as FinalValueKey] += value ?? 0;
    });
  });

  const learningRatio = Math.min(.48, history.length * .08);
  history.forEach((record) => {
    if (record.actionStatus !== "visited") return;
    const satisfactionFactor = record.satisfaction === "great" ? 1 : record.satisfaction === "good" ? .5 : -.45;
    if (record.feedbackReasons.includes("移動が楽だった")) weights.fatigue += .7 * satisfactionFactor;
    if (record.feedbackReasons.includes("子どもが楽しんでいた")) weights.family += .8 * satisfactionFactor;
    if (record.feedbackReasons.includes("費用に納得できた")) weights.cost += .6 * satisfactionFactor;
    if (record.feedbackReasons.includes("新しい発見があった")) weights.novelty += .7 * satisfactionFactor;
    if (record.feedbackReasons.includes("天候の影響が少なかった")) weights.weather += .6 * satisfactionFactor;
    if (record.feedbackReasons.includes("思ったより混んでいた")) weights.crowd += .5;
    if (record.feedbackReasons.includes("疲れた")) weights.fatigue += .5;
  });

  return { weights, learningRatio };
}

function scoreCandidate(candidate: FinalCandidate, context: FinalTodayContext, profile: FinalProfile, history: FinalChoiceRecord[]) {
  const { weights, learningRatio } = mergeWeights(profile, context.priorities, history);
  const entries = Object.entries(weights) as [FinalValueKey, number][];
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const profileScore = entries.reduce((sum, [key, weight]) => sum + candidate.scores[key] * weight, 0) / totalWeight;

  const visits = history.filter((record) => record.selectedCandidateId === candidate.id && record.actionStatus === "visited");
  const highSatisfaction = visits.filter((record) => record.satisfaction === "great").length;
  const skipped = history.filter((record) => record.selectedCandidateId === candidate.id && record.actionStatus === "skipped").length;
  const behaviorScore = visits.length === 0 ? 72 : 72 + highSatisfaction * 8 - skipped * 6;
  const budgetFit = candidate.cost <= context.budget ? 3 : -12;
  const durationFit = candidate.travelMinutes + candidate.stayMinutes <= 150 ? 3 : -5;
  const weatherFit = context.weather === "hot" && !candidate.indoor ? -12 : 0;
  const blended = profileScore * (1 - learningRatio) + behaviorScore * learningRatio + budgetFit + durationFit + weatherFit;
  return Math.max(45, Math.min(97, Math.round(blended)));
}

function learnedReason(history: FinalChoiceRecord[]) {
  if (history.length === 0) return undefined;
  const reasons = history.flatMap((item) => item.feedbackReasons);
  if (reasons.filter((item) => item === "移動が楽だった").length >= 1) return "移動が楽だった日の満足度を反映しました";
  if (reasons.filter((item) => item === "子どもが楽しんでいた").length >= 1) return "子どもが楽しんだ選択を少し重く見ています";
  if (history.some((item) => item.actionStatus === "skipped")) return "選んでも行かなかった条件を弱めています";
  return "これまでの選択と振り返りを反映しています";
}

function reasonFor(candidate: FinalCandidate, role: FinalCandidateRole, context: FinalTodayContext, history: FinalChoiceRecord[]) {
  if (role === "best-fit") {
    if (history.length > 0) return "疲れにくさと子どもの満足を、これまでより重視しました";
    return `今日は「${context.priorities[0] ? priorityName(context.priorities[0]) : "バランス"}」を中心に選びました`;
  }
  if (role === "discovery") return `${candidate.travelMinutes}分で、まだ選んでいない体験を増やせます`;
  return candidate.indoor ? "今日の暑さを避けられる条件が効いています" : "短い時間と今の天気だから成立する案です";
}

function priorityName(priority: FinalPriority) {
  return {
    "low-fatigue": "疲れたくない",
    time: "時間",
    saving: "節約",
    children: "子どもの満足",
    novelty: "新しい発見",
    quiet: "混雑回避",
    slow: "のんびり",
  }[priority];
}

export function recommendFinalCandidates(context: FinalTodayContext, state: FinalState): FinalRecommendation[] {
  const ranked = finalCandidates
    .map((candidate) => ({ candidate, affinity: scoreCandidate(candidate, context, state.profile, state.history) }))
    .sort((left, right) => right.affinity - left.affinity);
  const best = ranked[0];
  const visitedIds = new Set(state.history.filter((item) => item.actionStatus === "visited").map((item) => item.selectedCandidateId));
  const discoveryCandidates = [...ranked]
    .filter((item) => item.candidate.id !== best.candidate.id)
    .sort((left, right) => (visitedIds.has(left.candidate.id) ? -15 : left.candidate.scores.novelty) - (visitedIds.has(right.candidate.id) ? -15 : right.candidate.scores.novelty));
  const discovery = discoveryCandidates[discoveryCandidates.length - 1] ?? ranked[1];
  const todayOnly = [...ranked]
    .filter((item) => item.candidate.id !== best.candidate.id && item.candidate.id !== discovery.candidate.id)
    .sort((left, right) => {
      const leftFit = context.weather === "hot" || context.weather === "rain" ? left.candidate.scores.weather : left.candidate.scores.time;
      const rightFit = context.weather === "hot" || context.weather === "rain" ? right.candidate.scores.weather : right.candidate.scores.time;
      return rightFit - leftFit;
    })[0] ?? ranked[2];
  const commonLearnedReason = learnedReason(state.history);

  return [
    { ...best, role: "best-fit", reason: reasonFor(best.candidate, "best-fit", context, state.history), learnedReason: commonLearnedReason },
    { ...discovery, role: "discovery", reason: reasonFor(discovery.candidate, "discovery", context, state.history) },
    { ...todayOnly, role: "today-only", reason: reasonFor(todayOnly.candidate, "today-only", context, state.history) },
  ];
}

export function getLearningStage(historyCount: number) {
  if (historyCount === 0) return { label: "はじめまして", note: "設定から、最初の提案をつくります" };
  if (historyCount <= 2) return { label: "好みを学習中", note: `${historyCount}回の記録を反映しています` };
  if (historyCount <= 5) return { label: "少しずつ分かってきました", note: `${historyCount}回の行動から選び方を学習しました` };
  return { label: "あなたらしい選び方が見えてきました", note: `${historyCount}回の行動を反映しています` };
}

export function buildLearnedInsight(status: FinalActionStatus, satisfaction?: FinalSatisfaction, reasons: string[] = []) {
  if (status === "skipped") return "選んでも行かなかった条件を、次回は少し弱めます";
  if (status === "changed") return "途中で変えたことも、次回の候補づくりに反映します";
  if (reasons.includes("移動が楽だった")) return "移動の楽さが満足度に影響しているようです";
  if (reasons.includes("子どもが楽しんでいた")) return "子ども向け体験がある施設の評価が高めです";
  if (reasons.includes("思ったより混んでいた")) return "混雑の少ない場所を、次回は少し重く見ます";
  if (reasons.includes("新しい発見があった")) return "新しい場所への関心が、少し高まっています";
  if (satisfaction === "low") return "今回の条件を弱め、別の方向から提案します";
  return "今回の満足度を、次のおすすめに反映しました";
}

export function createChoiceRecord({ candidateId, comparedIds, context, status, satisfaction, reasons }: {
  candidateId: string;
  comparedIds: string[];
  context: FinalTodayContext;
  status: FinalActionStatus;
  satisfaction?: FinalSatisfaction;
  reasons?: string[];
}): FinalChoiceRecord {
  return {
    id: `final-${Date.now()}`,
    scenario: context.prompt,
    selectedCandidateId: candidateId,
    comparedCandidateIds: comparedIds,
    actionStatus: status,
    satisfaction,
    feedbackReasons: reasons ?? [],
    learnedInsight: buildLearnedInsight(status, satisfaction, reasons),
    happenedAt: new Date().toISOString(),
  };
}

export function readFinalState(): FinalState {
  try {
    const raw = window.localStorage.getItem(finalStateStorageKey);
    if (!raw) return initialFinalState;
    const parsed = JSON.parse(raw) as Partial<FinalState>;
    return { ...initialFinalState, ...parsed, profile: { ...defaultFinalProfile, ...parsed.profile }, history: Array.isArray(parsed.history) ? parsed.history : [] };
  } catch {
    return initialFinalState;
  }
}

export function saveFinalState(state: FinalState) {
  try {
    window.localStorage.setItem(finalStateStorageKey, JSON.stringify(state));
  } catch {
    // The in-memory demo remains usable when storage is unavailable.
  }
}

export function createDemoFinalState(): FinalState {
  return {
    profile: defaultFinalProfile,
    history: demoFinalHistory,
    lastPrompt: "日曜日の午後、6歳の子どもと2時間過ごしたい",
    lastPriorities: ["low-fatigue", "children"],
    demoEnabled: true,
  };
}

export function resetFinalState() {
  try {
    window.localStorage.removeItem(finalStateStorageKey);
  } catch {
    // Ignore unavailable storage.
  }
  return initialFinalState;
}
