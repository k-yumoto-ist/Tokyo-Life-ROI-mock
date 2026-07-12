import type { MyRoiStats, Plan, Satisfaction } from "../types";

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
