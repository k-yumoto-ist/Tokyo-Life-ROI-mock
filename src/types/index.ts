export type Step = "hero" | "profile" | "scenario" | "comparison";

export type IncomePreset = 300 | 500 | 700 | 1000 | "custom";
export type FreeTime = "少ない" | "普通" | "多い";
export type Busyness = "余裕あり" | "普通" | "忙しい" | "とても忙しい";
export type FamilyStatus = "一人暮らし" | "夫婦" | "子育て中" | "介護あり";

export type UserProfile = {
  annualIncome: number;
  incomePreset: IncomePreset;
  freeTime: FreeTime;
  busyness: Busyness;
  familyStatus: FamilyStatus;
};

export type ScenarioId = "shopping" | "admin" | "mobility" | "family";

export type UrbanImpact = {
  congestionAvoidance: number;
  alternativeUse: number;
  travelReduction: number;
  score: number;
};

export type LifeOption = {
  id: string;
  name: string;
  shortName: string;
  paymentCost: number;
  feeCost?: number;
  travelMinutes: number;
  waitMinutes?: number;
  workMinutes: number;
  crowd: string;
  fatigue: "なし" | "低" | "中" | "高";
  risk: "低" | "中" | "高";
  fatigueBaseCost: number;
  riskBaseCost: number;
  congestionBaseCost: number;
  benefitBonus: number;
  urbanImpact: UrbanImpact;
  facts: string[];
  reason: string;
  caution: string;
  fit: string;
};

export type Scenario = {
  id: ScenarioId;
  title: string;
  description: string;
  icon: string;
  options: LifeOption[];
  insight: string;
};

export type ScoredOption = LifeOption & {
  totalMinutes: number;
  timeCost: number;
  fatigueCost: number;
  riskCost: number;
  congestionCost: number;
  urbanDistributionBonus: number;
  actualCost: number;
  lifeRoiScore: number;
};
