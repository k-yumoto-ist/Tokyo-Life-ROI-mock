import type { CrowdAvoidanceLevel, PriorityMode, RouteOption, ScoredRouteOption, TravelConditions } from "../types";

const priorityMultiplier: Record<PriorityMode, number> = {
  時間優先: 1.28,
  バランス: 1,
  費用優先: 0.72
};

const crowdMultiplier: Record<CrowdAvoidanceLevel, number> = {
  気にしない: 0.45,
  できれば避けたい: 1,
  できるだけ避けたい: 1.45
};

export function calculateTimeValuePerMinute(conditions: TravelConditions) {
  const base = conditions.willingnessToPayFor15Min / 15;
  return Math.max(10, Math.round(base * priorityMultiplier[conditions.priority]));
}

export function scoreRouteOptions(options: RouteOption[], conditions: TravelConditions): ScoredRouteOption[] {
  const baseline = options.find((option) => option.id === "now-fastest") ?? options[0];
  const timeValuePerMinute = calculateTimeValuePerMinute(conditions);
  const baselineCrowdedMinutes = baseline.crowdedMinutes;
  const baselineDeparture = toMinutes(baseline.departureTime);
  const baselineDuration = baseline.durationMinutes;

  const scored = options.map((option) => {
    const transferPenalty = Math.max(0, option.transfers - conditions.transferLimit) * 160;
    const walkOverLimit = Math.max(0, option.walkMinutes - conditions.walkLimitMinutes);
    const travelTimeCost = option.durationMinutes * timeValuePerMinute;
    const crowdCost = Math.round(option.crowdedMinutes * timeValuePerMinute * crowdMultiplier[conditions.crowdAvoidance] * 1.35);
    const walkCost = Math.round(option.walkMinutes * 12 + walkOverLimit * 35);
    const totalBurden = option.fare + travelTimeCost + crowdCost + walkCost + option.delayRiskCost + option.effortCost + transferPenalty;
    const congestionMinutesReduced = Math.max(0, baselineCrowdedMinutes - option.crowdedMinutes);
    const departureShift = Math.max(0, toMinutes(option.departureTime) - baselineDeparture);
    const extraTravelMinutes = Math.max(0, option.durationMinutes - baselineDuration);
    const farePenaltyMinutes = Math.max(0, Math.ceil((option.fare - baseline.fare) / Math.max(1, timeValuePerMinute)));
    const recoveredMinutes = Math.max(0, departureShift - extraTravelMinutes - farePenaltyMinutes - option.transfers);

    return {
      ...option,
      timeValuePerMinute,
      travelTimeCost,
      crowdCost,
      walkCost,
      totalBurden,
      deltaVsBaseline: 0,
      congestionMinutesReduced,
      recoveredMinutes,
      totalBenefitYen: 0,
      lifeRoiScore: 0,
      reason: ""
    };
  });

  const baselineScored = scored.find((option) => option.id === baseline.id) ?? scored[0];
  return scored
    .map((option) => {
      const deltaVsBaseline = baselineScored.totalBurden - option.totalBurden;
      const comfortBonus = option.congestionMinutesReduced * 0.7 + option.recoveredMinutes * 0.45 + (option.seatChance === "高い" ? 3 : 0);
      const arrivalPenalty = arrivesAfterTarget(option.arrivalTime, conditions.arrivalTime) ? 28 : 0;
      const lifeRoiScore = clamp(Math.round(102 - option.totalBurden / 80 + comfortBonus - arrivalPenalty), 0, 100);
      const totalBenefitYen = Math.max(0, Math.round(deltaVsBaseline + option.recoveredMinutes * option.timeValuePerMinute));

      return {
        ...option,
        deltaVsBaseline,
        totalBenefitYen,
        lifeRoiScore,
        reason: buildReason(option, conditions, totalBenefitYen)
      };
    })
    .sort((a, b) => b.lifeRoiScore - a.lifeRoiScore);
}

function buildReason(option: ScoredRouteOption, conditions: TravelConditions, totalBenefitYen: number) {
  if (option.id === "delay-comfort") {
    return `出発を15分遅らせても到着希望時刻 ${conditions.arrivalTime} に間に合います。混雑時間を約${option.congestionMinutesReduced}分減らせるため、あなたの設定では今すぐ移動するより総合的に${formatYen(totalBenefitYen)}相当お得です。`;
  }

  if (option.id === "alternate-calm") {
    return `少し歩いて別経路を使うことで、混雑時間を約${option.congestionMinutesReduced}分減らせます。徒歩時間は増えますが、混雑回避を重視する日は快適さを取り戻しやすい案です。`;
  }

  return "到着は最も早い一方で、ピーク時間帯の混雑負担が大きくなります。時間を最優先する場合の比較基準として表示しています。";
}

function arrivesAfterTarget(arrivalTime: string, targetTime: string) {
  return toMinutes(arrivalTime) > toMinutes(targetTime);
}

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
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
