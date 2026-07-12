import type { AnnualIncomeBand, MyRoiStats, Plan, Satisfaction, UserProfile, WorkStyle } from "../types";

export function selectedPlanOrDefault(plans: Plan[], selectedPlanId: string | null) {
  return plans.find((plan) => plan.id === selectedPlanId) ?? plans.find((plan) => plan.recommended) ?? plans[0];
}

export function satisfactionToScore(satisfaction: Satisfaction) {
  if (satisfaction === "good") return 5;
  if (satisfaction === "ok") return 3.8;
  if (satisfaction === "bad") return 2.6;
  return 0;
}

export function updateStatsAfterFeedback(stats: MyRoiStats, plan: Plan, satisfaction: Satisfaction): MyRoiStats {
  const nextSupportCount = stats.supportCount + 1;
  const score = satisfactionToScore(satisfaction);
  const nextAverage = score
    ? Math.round(((stats.averageSatisfaction * stats.supportCount + score) / nextSupportCount) * 10) / 10
    : stats.averageSatisfaction;

  return {
    supportCount: nextSupportCount,
    savedMinutes: stats.savedMinutes + plan.savedMinutes,
    savedYen: stats.savedYen + plan.savedYen,
    avoidedCrowdCount: stats.avoidedCrowdCount + (plan.crowd === "低" ? 1 : 0),
    averageSatisfaction: nextAverage,
    actionPoints: stats.actionPoints + 5
  };
}

export function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);
}

export function calculateAutoHourlyValue(annualIncomeBand: AnnualIncomeBand, workStyle: WorkStyle) {
  const baseByIncome: Record<AnnualIncomeBand, number> = {
    under300: 1200,
    "300to500": 1800,
    "500to700": 2500,
    "700to1000": 3200,
    over1000: 5000,
    noAnswer: 2500
  };
  const workStyleMultiplier: Record<WorkStyle, number> = {
    regular: 1,
    busy: 1.15,
    flexible: 0.9
  };
  return Math.round((baseByIncome[annualIncomeBand] * workStyleMultiplier[workStyle]) / 100) * 100;
}

export function buildProfileSummary(profile: UserProfile) {
  const family = profile.children > 0 ? `家族${profile.adults + profile.children}人` : profile.familyType;
  const mainTransport = profile.transportModes.includes("train") ? "電車中心" : profile.transportModes[0] ? "移動手段あり" : "標準設定";
  return `時間価値 ${profile.hourlyValue.toLocaleString("ja-JP")}円/h　${family}　${mainTransport}`;
}

export function buildRecommendationReason(profile: UserProfile, plan: Plan) {
  const reasons: string[] = [];
  if (profile.hourlyValue >= 3000 && plan.id === "plan-a") {
    reasons.push("あなたの時間価値を考慮すると、420円多く払っても7分短縮できるAプランのROIが最も高くなります。");
  } else {
    reasons.push("時間価値、家族構成、混雑傾向を考慮すると、この案が最も高ROIです。");
  }

  if (profile.familyType === "子どもあり" || profile.children > 0) {
    reasons.push("乗り換えが少なく、子ども連れでも移動しやすいプランです。");
  }

  if (profile.defaultPriorities.includes("quiet")) {
    reasons.push("通常より混雑が少ない時間帯・経路を優先しています。");
  }

  return reasons.join("");
}
