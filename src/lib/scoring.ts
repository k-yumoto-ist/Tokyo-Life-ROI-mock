import type { Busyness, FamilyStatus, FreeTime, LifeOption, ScoredOption, UserProfile } from "../types";

const busynessMultiplier: Record<Busyness, number> = {
  "余裕あり": 1,
  "普通": 1.2,
  "忙しい": 1.5,
  "とても忙しい": 2
};

const familyMultiplier: Record<FamilyStatus, number> = {
  "一人暮らし": 1,
  "夫婦": 1.1,
  "子育て中": 1.4,
  "介護あり": 1.5
};

const freeTimeMultiplier: Record<FreeTime, number> = {
  "少ない": 1.25,
  "普通": 1,
  "多い": 0.9
};

export function calculateTimeValue(profile: UserProfile) {
  const baseIncomeHourlyValue = profile.annualIncome / 2000;
  return Math.round(
    baseIncomeHourlyValue *
      busynessMultiplier[profile.busyness] *
      familyMultiplier[profile.familyStatus] *
      freeTimeMultiplier[profile.freeTime]
  );
}

export function scoreOptions(options: LifeOption[], timeValuePerHour: number): ScoredOption[] {
  const enriched = options.map((option) => {
    const totalMinutes = option.travelMinutes + (option.waitMinutes ?? 0) + option.workMinutes;
    const timeCost = Math.round((totalMinutes / 60) * timeValuePerHour);
    const fatigueCost = Math.round(option.fatigueBaseCost * Math.max(0.75, timeValuePerHour / 2500));
    const riskCost = Math.round(option.riskBaseCost * Math.max(0.8, timeValuePerHour / 3000));
    const congestionCost = Math.round(option.congestionBaseCost * Math.max(0.85, timeValuePerHour / 3200));
    const actualCost = option.paymentCost + (option.feeCost ?? 0) + timeCost + fatigueCost + riskCost + congestionCost;
    const urbanDistributionBonus = Math.round(
      option.urbanImpact.congestionAvoidance * 0.08 +
      option.urbanImpact.alternativeUse * 0.05 +
      option.urbanImpact.travelReduction * 0.04
    );

    return {
      ...option,
      totalMinutes,
      timeCost,
      fatigueCost,
      riskCost,
      congestionCost,
      urbanDistributionBonus,
      actualCost,
      lifeRoiScore: 0
    };
  });

  const actualCosts = enriched.map((option) => option.actualCost);
  const payments = enriched.map((option) => option.paymentCost + (option.feeCost ?? 0));
  const minActual = Math.min(...actualCosts);
  const maxActual = Math.max(...actualCosts);
  const maxPayment = Math.max(...payments);
  const range = Math.max(1, maxActual - minActual);

  const normalizedPriceSensitivity =
    (9000 - Math.min(9000, Math.max(800, timeValuePerHour))) / 8200;
  const priceSensitivity = 12 + Math.pow(normalizedPriceSensitivity, 3) * 230;

  return enriched
    .map((option) => {
      const payment = option.paymentCost + (option.feeCost ?? 0);
      const normalizedActualCost = ((option.actualCost - minActual) / range) * 42;
      const priceAdvantage = ((maxPayment - payment) / Math.max(1, maxPayment)) * priceSensitivity;
      const benefit = option.benefitBonus / 45;
      const lifeRoiScore = clamp(
        Math.round(50 - normalizedActualCost + priceAdvantage + benefit + option.urbanDistributionBonus),
        0,
        100
      );
      return { ...option, lifeRoiScore };
    })
    .sort((a, b) => b.lifeRoiScore - a.lifeRoiScore);
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
