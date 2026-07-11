import type {
  AvoidanceLevel,
  BudgetRange,
  CandidateOption,
  CurrentWish,
  IncomeRange,
  ScoredCandidate,
  UserProfile,
  WishFocus
} from "../types";

const incomeTimeValue: Record<IncomeRange, number> = {
  "300万円未満": 1400,
  "300万〜500万円": 2100,
  "500万〜700万円": 2700,
  "700万〜1,000万円": 3200,
  "1,000万円以上": 4300,
  回答しない: 2400
};

const crowdMultiplier: Record<AvoidanceLevel, number> = {
  低め: 0.7,
  普通: 1,
  高め: 1.35
};

const budgetLimit: Record<BudgetRange, number> = {
  できるだけ抑える: 2500,
  "3,000円以内": 3000,
  "5,000円以内": 5000,
  "10,000円以内": 10000,
  予算を気にしない: 50000
};

export function estimateTimeValue(profile: Pick<UserProfile, "incomeRange" | "familyStructure" | "childrenCount" | "priorities" | "crowdAvoidance">) {
  const base = incomeTimeValue[profile.incomeRange] ?? incomeTimeValue["回答しない"];
  const familyBoost = profile.familyStructure.includes("子ども") ? 1.12 : 1;
  const childBoost = profile.childrenCount > 0 ? Math.min(1.18, 1 + profile.childrenCount * 0.05) : 1;
  const timeBoost = profile.priorities.includes("時間") ? 1.08 : 1;
  const crowdBoost = profile.crowdAvoidance === "高め" ? 1.06 : 1;
  return Math.round((base * familyBoost * childBoost * timeBoost * crowdBoost) / 100) * 100;
}

export function scoreCandidates(candidates: CandidateOption[], profile: UserProfile, wish: CurrentWish): ScoredCandidate[] {
  const timeValuePerMinute = profile.timeValuePerHour / 60;
  const relevant = candidates.filter((candidate) => isRelevant(candidate, wish));
  const pool = relevant.length >= 3 ? relevant : candidates;

  return pool
    .map((candidate) => {
      const timeCost = Math.round((candidate.travelMinutes / 60) * profile.timeValuePerHour);
      const crowdCost = Math.round(crowdBase(candidate.crowdLevel) * crowdMultiplier[profile.crowdAvoidance] * focusCrowdBoost(wish.focus));
      const fatigueCost = Math.round(Math.max(0, candidate.requiredMinutes - 120) * timeValuePerMinute * 0.16);
      const actualCost = candidate.expectedCost + timeCost + crowdCost + fatigueCost;
      const satisfaction = satisfactionScore(candidate, profile, wish);
      const budgetPenalty = candidate.expectedCost > budgetLimit[wish.budget] ? 12 : 0;
      const timeFitPenalty = timeFit(candidate.requiredMinutes, wish.availableTime) ? 0 : 10;
      const focusBonus = focusScore(candidate, wish.focus);
      const roiScore = clamp(Math.round(satisfaction + focusBonus - actualCost / 620 - budgetPenalty - timeFitPenalty), 0, 100);

      return {
        ...candidate,
        timeCost,
        crowdCost,
        fatigueCost,
        actualCost,
        roiScore,
        rank: 0,
        reason: buildReason(candidate, profile, wish, actualCost),
        matchedSignals: buildSignals(candidate, profile, wish)
      };
    })
    .sort((a, b) => b.roiScore - a.roiScore)
    .slice(0, 3)
    .map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
      tags: index === 0 ? ["あなた向け1位", ...candidate.tags.filter((tag) => tag !== "あなた向け1位")].slice(0, 4) : candidate.tags.slice(0, 4)
    }));
}

function isRelevant(candidate: CandidateOption, wish: CurrentWish) {
  return candidate.categories.includes(wish.purpose) || candidate.suitedFor.includes(wish.companion);
}

function satisfactionScore(candidate: CandidateOption, profile: UserProfile, wish: CurrentWish) {
  const familyWeight = wish.companion === "家族" || wish.companion === "子ども" || profile.childrenCount > 0 ? 0.42 : 0.16;
  const comfortWeight = wish.focus === "快適さ" || wish.focus === "混雑回避" ? 0.3 : 0.22;
  const experienceWeight = 1 - familyWeight - comfortWeight;
  return candidate.familySatisfaction * familyWeight + candidate.comfortScore * comfortWeight + candidate.experienceValue * experienceWeight;
}

function focusScore(candidate: CandidateOption, focus: WishFocus) {
  if (focus === "混雑回避") return candidate.crowdLevel === "低" ? 13 : candidate.crowdLevel === "中" ? 4 : -8;
  if (focus === "家族の満足度") return (candidate.familySatisfaction - 70) / 2.2;
  if (focus === "快適さ") return (candidate.comfortScore - 70) / 2.4;
  if (focus === "費用") return candidate.expectedCost <= 5000 ? 10 : -8;
  if (focus === "時間") return candidate.travelMinutes <= 35 ? 10 : candidate.travelMinutes <= 55 ? 3 : -7;
  return 5;
}

function focusCrowdBoost(focus: WishFocus) {
  return focus === "混雑回避" ? 1.22 : 1;
}

function crowdBase(level: CandidateOption["crowdLevel"]) {
  if (level === "低") return 280;
  if (level === "中") return 780;
  return 1600;
}

function timeFit(requiredMinutes: number, available: CurrentWish["availableTime"]) {
  const limit = available === "1時間以内" ? 70 : available === "2〜3時間" ? 190 : available === "半日" ? 300 : 520;
  return requiredMinutes <= limit;
}

function buildReason(candidate: CandidateOption, profile: UserProfile, wish: CurrentWish, actualCost: number) {
  const familyPhrase = profile.childrenCount > 0 ? `未就学児を含む家族${profile.childrenCount + 2}人の満足度` : "同行者の満足度";
  const focusPhrase =
    wish.focus === "混雑回避"
      ? "混雑が少なく、移動後の疲労も抑えやすい"
      : wish.focus === "費用"
        ? "支払費用を抑えやすい"
        : wish.focus === "時間"
          ? "移動と滞在の時間効率が良い"
          : "時間・費用・快適さのバランスが良い";

  return `${candidate.baseReason} ${focusPhrase}ため、${familyPhrase}を含めると今回の総合ROIが高くなります。時間価値を含めた実質コストは${formatYen(actualCost)}です。`;
}

function buildSignals(candidate: CandidateOption, profile: UserProfile, wish: CurrentWish) {
  const signals: string[] = [];
  if (candidate.categories.includes(wish.purpose)) signals.push(`目的「${wish.purpose}」に一致`);
  if (candidate.suitedFor.includes(wish.companion)) signals.push(`同行者「${wish.companion}」に対応`);
  if (candidate.expectedCost <= budgetLimit[wish.budget]) signals.push("予算内");
  if (candidate.crowdLevel === "低" && profile.crowdAvoidance === "高め") signals.push("混雑回避と相性が良い");
  if (candidate.travelMinutes <= 40 && profile.priorities.includes("時間")) signals.push("移動時間が短い");
  return signals.slice(0, 4);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);
}
