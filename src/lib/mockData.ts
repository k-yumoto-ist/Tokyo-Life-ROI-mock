import type {
  DefaultPriority,
  FeedbackState,
  GoalChip,
  Insight,
  MyRoiStats,
  PersistedLoopState,
  Plan,
  TransportMode,
  UserProfile
} from "../types";

export const loopStorageKey = "tokyo-life-roi-loop-v1";

export const goals: GoalChip[] = [
  { id: "time", label: "時短", tone: "blue" },
  { id: "saving", label: "節約", tone: "green" },
  { id: "quiet", label: "空いてる", tone: "cyan" },
  { id: "family", label: "家族向け", tone: "orange" }
];

export const plans: Plan[] = [
  {
    id: "plan-a",
    name: "Aプラン",
    title: "朝の移動をスマートに",
    description: "乗り換え少なめでスムーズ",
    timeMinutes: 15,
    cost: 980,
    crowd: "低",
    satisfaction: 4.4,
    arrivalTime: "8:45",
    savedMinutes: 7,
    savedYen: 420,
    tags: ["時短の達人プラン", "おすすめ", "混雑少なめ"],
    recommended: true
  },
  {
    id: "plan-b",
    name: "Bプラン",
    title: "費用を抑えてコスパ重視",
    description: "費用を抑えてコスパ重視",
    timeMinutes: 22,
    cost: 680,
    crowd: "中",
    satisfaction: 3.9,
    arrivalTime: "8:52",
    savedMinutes: 3,
    savedYen: 720,
    tags: ["コスト重視", "節約"]
  },
  {
    id: "plan-c",
    name: "Cプラン",
    title: "ゆったり快適に移動",
    description: "ゆったり快適に移動",
    timeMinutes: 28,
    cost: 1150,
    crowd: "低",
    satisfaction: 4.1,
    arrivalTime: "8:58",
    savedMinutes: 0,
    savedYen: 180,
    tags: ["快適", "空いてる"]
  }
];

export const initialStats: MyRoiStats = {
  supportCount: 12,
  savedMinutes: 94,
  savedYen: 3800,
  avoidedCrowdCount: 6,
  averageSatisfaction: 4.2,
  actionPoints: 18
};

export const initialFeedback: FeedbackState = {
  satisfaction: null,
  tags: [],
  saved: false
};

export const initialProfile: UserProfile = {
  homeArea: "千葉県松戸市",
  activityArea: "東京都千代田区・中央区",
  hourlyValue: 3200,
  familyType: "子どもあり",
  adults: 2,
  children: 2,
  childAgeGroup: "未就学児",
  transportModes: ["train", "car", "walk"],
  defaultPriorities: ["time", "quiet", "family"]
};

export const initialLoopState: PersistedLoopState = {
  selectedGoal: "time",
  selectedPlanId: null,
  actionCompleted: false,
  feedback: initialFeedback,
  stats: initialStats,
  profile: initialProfile
};

export const transportModeLabels: Record<TransportMode, string> = {
  train: "電車",
  bus: "バス",
  car: "自動車",
  bike: "自転車",
  walk: "徒歩"
};

export const defaultPriorityLabels: Record<DefaultPriority, string> = {
  time: "時間を短縮したい",
  cost: "費用を抑えたい",
  quiet: "混雑を避けたい",
  comfort: "快適に過ごしたい",
  family: "家族で動きやすくしたい",
  health: "健康的に行動したい"
};

export const feedbackTags = [
  "時短できた",
  "安かった",
  "空いていた",
  "快適だった",
  "家族に優しかった",
  "また使いたい",
  "思ったより時間がかかった",
  "思ったより混んでいた"
];

export const insights: Insight[] = [
  {
    title: "時間重視の選択が好調",
    body: "あなたは、安さより時間を重視した選択の満足度が高いです。"
  },
  {
    title: "平日と休日で傾向が違います",
    body: "平日は時短、休日は家族向けの提案をよく選んでいます。"
  },
  {
    title: "空いている選択は満足度が高め",
    body: "混雑が少ない選択では、満足度が0.8高くなっています。"
  }
];
