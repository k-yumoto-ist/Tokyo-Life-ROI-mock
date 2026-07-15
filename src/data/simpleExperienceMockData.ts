export type SimpleMood = "smart" | "slow" | "discover";
export type SimpleCompanion = "solo" | "family" | "friends";
export type SimpleDuration = "two-hours" | "half-day" | "full-day";
export type SimpleBudget = "3000" | "5000" | "10000";

export type SimplePlan = {
  id: "smart" | "slow" | "discover";
  label: string;
  title: string;
  place: string;
  time: string;
  cost: string;
  crowd: string;
  summary: string;
  reasons: string[];
  details: {
    time: number;
    money: number;
    satisfaction: number;
    family: number;
    discovery: number;
  };
  accent: "blue" | "green" | "purple";
  timeline: { time: string; label: string }[];
  goodPoints: string[];
  cityImpact: string[];
};

export type SimpleExperienceRecord = {
  planId: SimplePlan["id"];
  satisfaction: "low" | "good" | "great";
  crowd: "low" | "normal" | "high";
  revisit: boolean;
  discovery: boolean;
  savedAt: string;
};

export const simpleExperienceStorageKey = "tokyo-life-roi-simple-experience";

export const simplePlans: SimplePlan[] = [
  {
    id: "smart",
    label: "時間を有効に使う",
    title: "東京駅で、用事も休憩もまとめる",
    place: "東京駅周辺・KITTE",
    time: "2時間20分",
    cost: "3,200円",
    crowd: "少なめ",
    summary: "短時間で、用事と家族時間をまとめる",
    reasons: ["移動を増やさず、家族でゆっくり過ごせます", "予算内で、用事と休憩をまとめられます"],
    details: { time: 5, money: 5, satisfaction: 3, family: 3, discovery: 2 },
    accent: "blue",
    timeline: [
      { time: "13:30", label: "東京駅に到着" },
      { time: "13:40", label: "用事を済ませる" },
      { time: "14:30", label: "KITTEで休憩・昼食" },
      { time: "15:30", label: "周辺を少し散歩" },
      { time: "15:50", label: "帰宅へ" },
    ],
    goodPoints: ["移動時間を約30分抑えられます", "予算を約1,200円抑えられます", "家族で過ごす時間を約70分取れます"],
    cityImpact: ["ピーク時間帯を避けやすい", "駅周辺の人流分散につながる"],
  },
  {
    id: "slow",
    label: "ゆっくり過ごす",
    title: "清澄白河で、親子のんびり散歩",
    place: "清澄白河・木場周辺",
    time: "2時間50分",
    cost: "4,100円",
    crowd: "とても少なめ",
    summary: "落ち着いた場所で、家族の時間をたっぷり取る",
    reasons: ["混雑を避け、会話を楽しめる時間を確保できます", "歩くペースを家族に合わせやすいプランです"],
    details: { time: 3, money: 3, satisfaction: 5, family: 5, discovery: 3 },
    accent: "green",
    timeline: [
      { time: "13:10", label: "清澄白河駅に到着" },
      { time: "13:25", label: "カフェでひと休み" },
      { time: "14:10", label: "木場公園をのんびり散歩" },
      { time: "15:30", label: "気に入ったお店に立ち寄る" },
      { time: "16:00", label: "帰宅へ" },
    ],
    goodPoints: ["落ち着いて過ごす時間を確保できます", "混雑を避けて移動できます", "家族のペースで予定を変えられます"],
    cityImpact: ["比較的空いているエリアを利用", "地域の店舗・施設を活用"],
  },
  {
    id: "discover",
    label: "新しい体験",
    title: "谷中で、親子の街歩き",
    place: "谷中・根津周辺",
    time: "3時間",
    cost: "4,600円",
    crowd: "少なめ",
    summary: "少し遠回りして、親子で初めての東京に出会う",
    reasons: ["いつもと違う街で、親子の思い出を増やせます", "地域の小さな店や施設を巡れます"],
    details: { time: 2, money: 2, satisfaction: 5, family: 4, discovery: 5 },
    accent: "purple",
    timeline: [
      { time: "13:00", label: "日暮里駅に到着" },
      { time: "13:20", label: "谷中の路地を散策" },
      { time: "14:10", label: "地域の店で休憩" },
      { time: "15:00", label: "根津の小さな施設へ" },
      { time: "16:00", label: "帰宅へ" },
    ],
    goodPoints: ["新しい場所を1か所発見できます", "親子の思い出づくりにつながります", "いつもの休日に変化をつくれます"],
    cityImpact: ["未訪問エリアへ足を運ぶ", "地域施設の利用につながる"],
  },
];

export function getSimplePlan(id: string | null | undefined) {
  return simplePlans.find((plan) => plan.id === id) ?? simplePlans[0];
}

export function readSimpleExperienceRecord(): SimpleExperienceRecord | null {
  try {
    const raw = window.localStorage.getItem(simpleExperienceStorageKey);
    return raw ? JSON.parse(raw) as SimpleExperienceRecord : null;
  } catch {
    return null;
  }
}

export function saveSimpleExperienceRecord(record: SimpleExperienceRecord) {
  window.localStorage.setItem(simpleExperienceStorageKey, JSON.stringify(record));
}
