export type View = "home" | "plans" | "action" | "history" | "reflection";
export type GoalId = "time" | "saving" | "quiet" | "family";
export type PlanId = "plan-a" | "plan-b" | "plan-c";
export type Satisfaction = "good" | "ok" | "bad" | null;

export type GoalChip = {
  id: GoalId;
  label: string;
  tone: "blue" | "green" | "cyan" | "orange";
};

export type Plan = {
  id: PlanId;
  name: string;
  title: string;
  description: string;
  timeMinutes: number;
  cost: number;
  crowd: "低" | "中" | "高";
  satisfaction: number;
  arrivalTime: string;
  savedMinutes: number;
  savedYen: number;
  tags: string[];
  recommended?: boolean;
};

export type MyRoiStats = {
  supportCount: number;
  savedMinutes: number;
  savedYen: number;
  avoidedCrowdCount: number;
  averageSatisfaction: number;
  actionPoints: number;
};

export type FeedbackState = {
  satisfaction: Satisfaction;
  tags: string[];
  saved: boolean;
};

export type PersistedLoopState = {
  selectedGoal: GoalId;
  selectedPlanId: PlanId | null;
  actionCompleted: boolean;
  feedback: FeedbackState;
  stats: MyRoiStats;
};

export type Insight = {
  title: string;
  body: string;
};
