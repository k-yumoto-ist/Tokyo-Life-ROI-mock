export type FinalPriority = "low-fatigue" | "time" | "saving" | "children" | "novelty" | "quiet" | "slow";
export type FinalActionStatus = "selected" | "visited" | "skipped" | "changed";
export type FinalSatisfaction = "great" | "good" | "low";
export type FinalCandidateRole = "best-fit" | "discovery" | "today-only";
export type FinalValueKey = "time" | "cost" | "crowd" | "fatigue" | "satisfaction" | "family" | "weather" | "novelty" | "publicValue" | "accessibility";

export type FinalProfile = {
  household: "solo" | "partner" | "family";
  childAges: number[];
  transportModes: string[];
  hourlyValue: number;
  hourlyValueMode: "auto" | "manual";
  dislikesCrowds: boolean;
  walkingTolerance: "low" | "medium" | "high";
  noveltyInterest: number;
  heatTolerance: "low" | "medium" | "high";
  accessibilityNeeded: boolean;
  interests: string[];
};

export type FinalTodayContext = {
  prompt: string;
  priorities: FinalPriority[];
  timeWindow: string;
  budget: number;
  origin: string;
  weather: "hot" | "rain" | "clear";
};

export type FinalCandidate = {
  id: string;
  title: string;
  place: string;
  area: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  travelMinutes: number;
  stayMinutes: number;
  cost: number;
  crowdLabel: string;
  crowdLevel: number;
  indoor: boolean;
  hours: string;
  event: string;
  route: string;
  shortCopy: string;
  tags: string[];
  dataSources: string[];
  cityPoint: number;
  scores: Record<FinalValueKey, number>;
};

export type FinalChoiceRecord = {
  id: string;
  scenario: string;
  selectedCandidateId: string;
  comparedCandidateIds: string[];
  actionStatus: FinalActionStatus;
  satisfaction?: FinalSatisfaction;
  feedbackReasons: string[];
  learnedInsight?: string;
  happenedAt: string;
};

export type FinalState = {
  profile: FinalProfile;
  history: FinalChoiceRecord[];
  lastPrompt: string;
  lastPriorities: FinalPriority[];
  demoEnabled: boolean;
};

export const finalStateStorageKey = "tokyo-life-roi-final-state-v1";

export const finalPriorityLabels: Record<FinalPriority, string> = {
  "low-fatigue": "疲れたくない",
  time: "時間を有効に",
  saving: "お金を抑える",
  children: "子どもを楽しませる",
  novelty: "新しい場所へ",
  quiet: "混雑を避ける",
  slow: "のんびりする",
};

export const finalFeedbackOptions = [
  "移動が楽だった",
  "思ったより混んでいた",
  "子どもが楽しんでいた",
  "費用に納得できた",
  "疲れた",
  "新しい発見があった",
  "また行きたい",
  "天候の影響が少なかった",
] as const;

export const finalSuggestionPrompts = [
  "子どもと2時間過ごしたい",
  "仕事帰りに気分転換したい",
  "雨でも楽しめる場所",
  "お金をかけずに一人で過ごす",
] as const;

export const defaultFinalProfile: FinalProfile = {
  household: "family",
  childAges: [6],
  transportModes: ["電車", "徒歩"],
  hourlyValue: 3200,
  hourlyValueMode: "auto",
  dislikesCrowds: true,
  walkingTolerance: "low",
  noveltyInterest: 64,
  heatTolerance: "low",
  accessibilityNeeded: false,
  interests: ["学び", "子ども", "公共施設"],
};

export const demoFinalHistory: FinalChoiceRecord[] = [
  {
    id: "history-library",
    scenario: "休日に子どもと屋内で過ごす",
    selectedCandidateId: "central-library",
    comparedCandidateIds: ["central-library", "kids-facility", "shinjuku-park"],
    actionStatus: "visited",
    satisfaction: "great",
    feedbackReasons: ["移動が楽だった", "子どもが楽しんでいた", "天候の影響が少なかった"],
    learnedInsight: "屋内で移動が楽な場所の満足度が高い傾向です",
    happenedAt: "2026-07-13T05:20:00.000Z",
  },
  {
    id: "history-park",
    scenario: "家族で近場に出かける",
    selectedCandidateId: "shinjuku-park",
    comparedCandidateIds: ["shinjuku-park", "tokyo-toy-museum", "kids-facility"],
    actionStatus: "visited",
    satisfaction: "good",
    feedbackReasons: ["移動が楽だった", "疲れた"],
    learnedInsight: "近さは好相性ですが、暑い日は屋内の方が合いそうです",
    happenedAt: "2026-07-06T04:10:00.000Z",
  },
  {
    id: "history-museum-skip",
    scenario: "雨の日に新しい場所へ",
    selectedCandidateId: "edo-tokyo-open-air",
    comparedCandidateIds: ["edo-tokyo-open-air", "water-science", "central-library"],
    actionStatus: "skipped",
    feedbackReasons: [],
    learnedInsight: "長い移動のプランは選んでも行動につながりにくい傾向です",
    happenedAt: "2026-06-29T03:30:00.000Z",
  },
];

export const initialFinalState: FinalState = {
  profile: defaultFinalProfile,
  history: [],
  lastPrompt: "",
  lastPriorities: [],
  demoEnabled: false,
};

export const finalCandidates: FinalCandidate[] = [
  {
    id: "kids-facility",
    title: "大型キッズ施設で思いきり遊ぶ",
    place: "東京ドームシティ ASOBono! 周辺",
    area: "文京区",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "屋内のカラフルな遊び場のイメージ",
    category: "定番・満足重視",
    travelMinutes: 32,
    stayMinutes: 120,
    cost: 4800,
    crowdLabel: "混雑",
    crowdLevel: 4,
    indoor: true,
    hours: "10:00〜18:00（デモ）",
    event: "親子プレイタイム",
    route: "電車1回＋徒歩9分",
    shortCopy: "子どもの満足は高め。移動と混雑は少し覚悟。",
    tags: ["子ども向け", "屋内", "定番"],
    dataSources: ["施設情報", "イベント情報", "公共交通", "混雑傾向"],
    cityPoint: 2,
    scores: { time: 55, cost: 38, crowd: 32, fatigue: 42, satisfaction: 94, family: 96, weather: 92, novelty: 48, publicValue: 35, accessibility: 78 },
  },
  {
    id: "shinjuku-park",
    title: "近所の公園で短く遊ぶ",
    place: "新宿中央公園",
    area: "新宿区",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "緑の多い都市公園のイメージ",
    category: "近さ・節約重視",
    travelMinutes: 12,
    stayMinutes: 90,
    cost: 0,
    crowdLabel: "普通",
    crowdLevel: 3,
    indoor: false,
    hours: "終日（デモ）",
    event: "芝生広場",
    route: "徒歩12分",
    shortCopy: "近くて無料。今日は暑さが負担になりそう。",
    tags: ["近い", "無料", "屋外"],
    dataSources: ["公園情報", "気象情報", "混雑傾向", "バリアフリー情報"],
    cityPoint: 5,
    scores: { time: 96, cost: 100, crowd: 66, fatigue: 70, satisfaction: 74, family: 82, weather: 28, novelty: 35, publicValue: 78, accessibility: 84 },
  },
  {
    id: "water-science",
    title: "涼しい科学館で親子体験",
    place: "東京都水の科学館",
    area: "江東区",
    imageUrl: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "子どもが科学展示を楽しむイメージ",
    category: "今日のあなた向け",
    travelMinutes: 28,
    stayMinutes: 100,
    cost: 0,
    crowdLabel: "少なめ",
    crowdLevel: 2,
    indoor: true,
    hours: "9:30〜17:00（デモ）",
    event: "水の実験ショー（デモ）",
    route: "電車1回＋徒歩6分",
    shortCopy: "屋内で空いていて、親子の満足と負担のバランスが良好。",
    tags: ["屋内", "空いている", "学び"],
    dataSources: ["東京都公共施設情報", "イベント情報", "気象情報", "公共交通", "混雑傾向"],
    cityPoint: 12,
    scores: { time: 72, cost: 100, crowd: 90, fatigue: 86, satisfaction: 89, family: 94, weather: 100, novelty: 78, publicValue: 98, accessibility: 88 },
  },
  {
    id: "tokyo-toy-museum",
    title: "昔と今のおもちゃを親子で発見",
    place: "東京おもちゃ美術館",
    area: "新宿区",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "木のおもちゃで遊ぶイメージ",
    category: "少し意外な相性",
    travelMinutes: 18,
    stayMinutes: 110,
    cost: 2500,
    crowdLabel: "普通",
    crowdLevel: 3,
    indoor: true,
    hours: "10:00〜16:00（デモ）",
    event: "木育ワークショップ（デモ）",
    route: "バス＋徒歩5分",
    shortCopy: "近さと新しい体験を両立。親子で手を動かせます。",
    tags: ["新しい体験", "屋内", "親子"],
    dataSources: ["文化施設情報", "イベント情報", "公共交通", "混雑傾向"],
    cityPoint: 7,
    scores: { time: 88, cost: 68, crowd: 62, fatigue: 82, satisfaction: 91, family: 96, weather: 96, novelty: 92, publicValue: 74, accessibility: 78 },
  },
  {
    id: "central-library",
    title: "図書館で絵本と静かな休憩",
    place: "東京都立中央図書館",
    area: "港区",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "明るく静かな図書館のイメージ",
    category: "静か・安心重視",
    travelMinutes: 26,
    stayMinutes: 90,
    cost: 0,
    crowdLabel: "少なめ",
    crowdLevel: 2,
    indoor: true,
    hours: "10:00〜17:30（デモ）",
    event: "児童書コーナー",
    route: "電車1回＋徒歩8分",
    shortCopy: "静かで無料。親子それぞれに余白ができます。",
    tags: ["無料", "静か", "屋内"],
    dataSources: ["図書館情報", "開館情報", "公共交通", "バリアフリー情報"],
    cityPoint: 10,
    scores: { time: 76, cost: 100, crowd: 94, fatigue: 88, satisfaction: 78, family: 72, weather: 100, novelty: 42, publicValue: 100, accessibility: 92 },
  },
  {
    id: "edo-tokyo-open-air",
    title: "昔の東京を歩いて発見する",
    place: "江戸東京たてもの園",
    area: "小金井市",
    imageUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "歴史的な日本建築のイメージ",
    category: "発見・文化重視",
    travelMinutes: 55,
    stayMinutes: 150,
    cost: 800,
    crowdLabel: "少なめ",
    crowdLevel: 2,
    indoor: false,
    hours: "9:30〜17:30（デモ）",
    event: "建物ガイド（デモ）",
    route: "電車2回＋バス",
    shortCopy: "遠いけれど、いつもと違う東京に出会えます。",
    tags: ["文化", "新しい発見", "屋外"],
    dataSources: ["文化施設情報", "イベント情報", "公共交通", "気象情報"],
    cityPoint: 11,
    scores: { time: 35, cost: 84, crowd: 90, fatigue: 45, satisfaction: 93, family: 84, weather: 40, novelty: 100, publicValue: 96, accessibility: 66 },
  },
];
