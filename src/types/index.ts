export type Step = "input" | "results";

export type TravelPurpose = "通勤" | "仕事の移動" | "買い物" | "お出かけ";
export type PriorityMode = "時間優先" | "バランス" | "費用優先";
export type CrowdAvoidanceLevel = "気にしない" | "できれば避けたい" | "できるだけ避けたい";
export type CrowdingLevel = "空いている" | "やや混雑" | "非常に混雑";
export type SeatChance = "低い" | "中程度" | "高い";

export type TravelConditions = {
  origin: string;
  destination: string;
  arrivalTime: string;
  purpose: TravelPurpose;
  priority: PriorityMode;
  crowdAvoidance: CrowdAvoidanceLevel;
  willingnessToPayFor15Min: number;
  walkLimitMinutes: number;
  transferLimit: number;
};

export type RouteOption = {
  id: string;
  title: string;
  label: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  fare: number;
  crowding: CrowdingLevel;
  crowdingScore: number;
  crowdedMinutes: number;
  walkMinutes: number;
  seatChance: SeatChance;
  transfers: number;
  delayRiskCost: number;
  effortCost: number;
  note: string;
};

export type ScoredRouteOption = RouteOption & {
  timeValuePerMinute: number;
  travelTimeCost: number;
  crowdCost: number;
  walkCost: number;
  totalBurden: number;
  deltaVsBaseline: number;
  congestionMinutesReduced: number;
  recoveredMinutes: number;
  totalBenefitYen: number;
  lifeRoiScore: number;
  reason: string;
};

export type PersonalImpact = {
  recoveredThisTripMinutes: number;
  recoveredThisMonthMinutes: number;
  avoidedCrowdingThisMonthMinutes: number;
  monthlyBenefitYen: number;
};

export type TokyoImpact = {
  shiftedTrips: number;
  reducedCrowdingHours: number;
  routeDistributionRate: number;
  sampleNote: string;
};

export type OpenDataSource = {
  title: string;
  data: string;
  usage: string;
};
