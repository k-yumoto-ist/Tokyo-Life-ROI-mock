export type View = "home" | "plans" | "action" | "history" | "reflection" | "profile";
export type GoalId = "time" | "saving" | "quiet" | "family";
export type PlanId = "plan-a" | "plan-b" | "plan-c";
export type Satisfaction = "good" | "ok" | "bad" | null;
export type FamilyType = "一人暮らし" | "パートナーと二人" | "子どもあり" | "親との同居" | "その他";
export type TransportMode = "train" | "bus" | "car" | "bike" | "walk";
export type DefaultPriority = "time" | "cost" | "quiet" | "comfort" | "family" | "health";
export type AnnualIncomeBand = "under300" | "300to500" | "500to700" | "700to1000" | "over1000" | "noAnswer";
export type WorkStyle = "regular" | "busy" | "flexible";
export type HourlyValueMode = "auto" | "manual";
export type DecisionMode = "route" | "outing";
export type Companion = "solo" | "family" | "children" | "partner" | "friends";
export type RoutePriority = "fast" | "cheap" | "easy" | "avoidCrowd" | "avoidRain" | "lessWalk";
export type OutingIntent =
  | "playWithChildren"
  | "refresh"
  | "relax"
  | "eat"
  | "exercise"
  | "newPlace"
  | "free"
  | "weatherSafe";
export type TimeBudget = "oneHour" | "twoThreeHours" | "halfDay" | "fullDay";
export type BudgetOption = "free" | "under3000" | "under5000" | "under10000" | "noLimit";
export type TravelRange = "within15" | "within30" | "within60" | "noLimit";

export type RouteForm = {
  fromType: "current" | "home" | "custom";
  fromText: string;
  destination: string;
  departureAt: string;
  companion: Companion;
  priorities: RoutePriority[];
};

export type OutingForm = {
  intents: OutingIntent[];
  timeBudget: TimeBudget;
  budget: BudgetOption;
  companion: Companion;
  travelRange: TravelRange;
  priorities: RoutePriority[];
};

export type DecisionMetric = {
  label: string;
  value: string;
};

export type DecisionCandidate = {
  title: string;
  subtitle: string;
  label: string;
  roi: number;
  reason: string;
  metrics: DecisionMetric[];
};

export type DecisionResult = {
  mode: DecisionMode;
  heading: string;
  main: DecisionCandidate;
  alternatives: DecisionCandidate[];
  dataSources: string[];
};

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

export type UserProfile = {
  homeArea: string;
  activityArea: string;
  annualIncomeBand: AnnualIncomeBand;
  workStyle: WorkStyle;
  hourlyValueMode: HourlyValueMode;
  hourlyValue: number;
  familyType: FamilyType;
  adults: number;
  children: number;
  childAgeGroup: string;
  transportModes: TransportMode[];
  defaultPriorities: DefaultPriority[];
};

export type PersistedLoopState = {
  selectedGoal: GoalId;
  selectedPlanId: PlanId | null;
  actionCompleted: boolean;
  feedback: FeedbackState;
  stats: MyRoiStats;
  profile: UserProfile;
};

export type Insight = {
  title: string;
  body: string;
};
