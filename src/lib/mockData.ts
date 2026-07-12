import type {
  AnnualIncomeBand,
  BudgetOption,
  Companion,
  DecisionCandidate,
  DefaultPriority,
  FeedbackState,
  GoalChip,
  Insight,
  MyRoiStats,
  OutingForm,
  OutingIntent,
  PersistedLoopState,
  Plan,
  RouteForm,
  RoutePriority,
  TimeBudget,
  TransportMode,
  TravelRange,
  UserProfile,
  WorkStyle
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
  annualIncomeBand: "700to1000",
  workStyle: "regular",
  hourlyValueMode: "auto",
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

export const annualIncomeBandLabels: Record<AnnualIncomeBand, string> = {
  under300: "300万円未満",
  "300to500": "300〜500万円",
  "500to700": "500〜700万円",
  "700to1000": "700〜1,000万円",
  over1000: "1,000万円以上",
  noAnswer: "回答しない"
};

export const workStyleLabels: Record<WorkStyle, string> = {
  regular: "標準的",
  busy: "忙しめ",
  flexible: "調整しやすい"
};

export const companionLabels: Record<Companion, string> = {
  solo: "ひとり",
  family: "家族",
  children: "子どもと",
  partner: "パートナーと",
  friends: "友人と"
};

export const routePriorityLabels: Record<RoutePriority, string> = {
  fast: "早く着きたい",
  cheap: "安く済ませたい",
  easy: "疲れたくない",
  avoidCrowd: "混雑を避けたい",
  avoidRain: "雨に濡れたくない",
  lessWalk: "歩く量を減らしたい"
};

export const outingIntentLabels: Record<OutingIntent, string> = {
  playWithChildren: "子どもと遊びたい",
  refresh: "気分転換したい",
  relax: "ゆっくりしたい",
  eat: "おいしいものを食べたい",
  exercise: "体を動かしたい",
  newPlace: "新しい場所に行きたい",
  free: "お金をかけずに楽しみたい",
  weatherSafe: "暑さや雨を避けたい"
};

export const timeBudgetLabels: Record<TimeBudget, string> = {
  oneHour: "1時間以内",
  twoThreeHours: "2〜3時間",
  halfDay: "半日",
  fullDay: "1日"
};

export const budgetLabels: Record<BudgetOption, string> = {
  free: "できるだけ無料",
  under3000: "3,000円以内",
  under5000: "5,000円以内",
  under10000: "10,000円以内",
  noLimit: "こだわらない"
};

export const travelRangeLabels: Record<TravelRange, string> = {
  within15: "15分以内",
  within30: "30分以内",
  within60: "1時間以内",
  noLimit: "こだわらない"
};

export const destinationSuggestions = ["東京駅", "上野動物園", "東京スカイツリー", "新宿御苑"];

export const routeLoadingMessages = ["移動候補を比較しています", "混雑や天気を確認しています", "あなたの時間価値を反映しています"];
export const outingLoadingMessages = ["条件に合う場所を探しています", "混雑や天気を確認しています", "あなたに合う過ごし方を比較しています"];

export const initialRouteForm: RouteForm = {
  fromType: "home",
  fromText: "千葉県松戸市",
  destination: "上野動物園",
  departureAt: "今日 10:30",
  companion: "children",
  priorities: ["fast", "avoidCrowd", "lessWalk"]
};

export const initialOutingForm: OutingForm = {
  intents: ["playWithChildren", "weatherSafe"],
  timeBudget: "halfDay",
  budget: "under10000",
  companion: "children",
  travelRange: "within30",
  priorities: ["avoidCrowd", "easy", "avoidRain"]
};

export const routeCandidateSets: Record<"balanced" | "easy" | "cheap", { main: DecisionCandidate; alternatives: DecisionCandidate[] }> = {
  balanced: {
    main: {
      title: "電車＋徒歩",
      subtitle: "目的地までの最適バランス",
      label: "あなたへのおすすめ",
      roi: 86,
      reason: "時間価値、交通費、現在の混雑傾向を踏まえると、最もバランスのよい移動方法です。",
      metrics: [
        { label: "所要時間", value: "42分" },
        { label: "費用", value: "520円" },
        { label: "徒歩", value: "8分" },
        { label: "乗換", value: "1回" },
        { label: "混雑", value: "やや混雑" }
      ]
    },
    alternatives: [
      {
        title: "タクシー",
        subtitle: "楽さ優先",
        label: "楽さ優先",
        roi: 72,
        reason: "徒歩は少ない一方、費用が大きく上がるため総合ROIは控えめです。",
        metrics: [
          { label: "所要時間", value: "35分" },
          { label: "費用", value: "6,200円" },
          { label: "徒歩", value: "1分" }
        ]
      },
      {
        title: "バス＋徒歩",
        subtitle: "節約優先",
        label: "節約優先",
        roi: 64,
        reason: "費用は低いですが、時間と徒歩負担が増えます。",
        metrics: [
          { label: "所要時間", value: "55分" },
          { label: "費用", value: "280円" },
          { label: "徒歩", value: "15分" }
        ]
      }
    ]
  },
  easy: {
    main: {
      title: "タクシー＋短距離徒歩",
      subtitle: "徒歩と乗換を最小化",
      label: "あなたへのおすすめ",
      roi: 84,
      reason: "子ども連れや雨の日の負担を考えると、費用よりも移動の楽さが高ROIになります。",
      metrics: [
        { label: "所要時間", value: "36分" },
        { label: "費用", value: "5,800円" },
        { label: "徒歩", value: "2分" },
        { label: "乗換", value: "0回" },
        { label: "混雑", value: "低め" }
      ]
    },
    alternatives: []
  },
  cheap: {
    main: {
      title: "バス＋徒歩",
      subtitle: "費用を抑えるルート",
      label: "あなたへのおすすめ",
      roi: 80,
      reason: "時間に余裕があり費用を重視する条件では、安さのメリットが大きくなります。",
      metrics: [
        { label: "所要時間", value: "55分" },
        { label: "費用", value: "280円" },
        { label: "徒歩", value: "15分" },
        { label: "乗換", value: "0回" },
        { label: "混雑", value: "普通" }
      ]
    },
    alternatives: []
  }
};

export const outingCandidateSets: Record<"children" | "relax" | "free", { main: DecisionCandidate; alternatives: DecisionCandidate[] }> = {
  children: {
    main: {
      title: "近くの屋内施設で子どもと遊ぶ",
      subtitle: "葛飾区科学教育センター 未来わくわく館",
      label: "今日のおすすめ",
      roi: 91,
      reason: "雨を避けながら、移動負担を抑え、子どもと過ごせる時間を長く確保できます。今日の条件では最も満足度が高い選択です。",
      metrics: [
        { label: "移動時間", value: "25分" },
        { label: "滞在目安", value: "2時間" },
        { label: "費用目安", value: "3,200円" },
        { label: "混雑", value: "比較的空いている" },
        { label: "天候", value: "屋内で影響なし" }
      ]
    },
    alternatives: [
      {
        title: "近隣の大型公園",
        subtitle: "節約優先",
        label: "節約優先",
        roi: 82,
        reason: "費用を抑えつつ短時間で行けますが、天候の影響を受けます。",
        metrics: [
          { label: "移動時間", value: "18分" },
          { label: "費用目安", value: "500円" },
          { label: "混雑", value: "普通" }
        ]
      },
      {
        title: "商業施設＋カフェ",
        subtitle: "気分転換優先",
        label: "気分転換優先",
        roi: 76,
        reason: "屋内で過ごしやすい一方、混雑と費用が少し上がります。",
        metrics: [
          { label: "移動時間", value: "30分" },
          { label: "費用目安", value: "4,500円" },
          { label: "混雑", value: "やや混雑" }
        ]
      },
      {
        title: "地域の公共施設",
        subtitle: "混雑回避優先",
        label: "混雑回避優先",
        roi: 79,
        reason: "空いていて低コストですが、体験の幅はやや限定されます。",
        metrics: [
          { label: "移動時間", value: "20分" },
          { label: "費用目安", value: "1,000円" },
          { label: "混雑", value: "空いている" }
        ]
      }
    ]
  },
  relax: {
    main: {
      title: "静かなカフェでゆっくり過ごす",
      subtitle: "日本橋エリアの穴場カフェ",
      label: "今日のおすすめ",
      roi: 88,
      reason: "移動時間を抑えながら、混雑の少ない屋内で気分転換できます。",
      metrics: [
        { label: "移動時間", value: "22分" },
        { label: "滞在目安", value: "90分" },
        { label: "費用目安", value: "1,800円" },
        { label: "混雑", value: "低め" }
      ]
    },
    alternatives: []
  },
  free: {
    main: {
      title: "公共施設と近隣公園を組み合わせる",
      subtitle: "図書館＋水辺の散歩コース",
      label: "今日のおすすめ",
      roi: 87,
      reason: "費用を抑えながら、移動負担と混雑を小さくできます。",
      metrics: [
        { label: "移動時間", value: "18分" },
        { label: "滞在目安", value: "2時間" },
        { label: "費用目安", value: "300円" },
        { label: "混雑", value: "空いている" }
      ]
    },
    alternatives: []
  }
};

export const decisionDataSources = ["交通・移動時間", "天気", "混雑傾向", "施設情報", "営業時間", "あなたの時間価値", "家族構成", "今日の気分や優先事項"];

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
