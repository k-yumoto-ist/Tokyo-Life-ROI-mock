export type DiversityValueKey = "time" | "money" | "satisfaction" | "family" | "comfort" | "discovery";

export type DiversityWeights = Record<DiversityValueKey, number>;

export type DiversityPlan = {
  id: "smart" | "leisure" | "discovery";
  name: string;
  label: string;
  destination: string;
  summary: string;
  time: string;
  cost: string;
  crowd: string;
  accent: "blue" | "green" | "purple";
  primaryMetrics: DiversityValueKey[];
  metrics: Record<DiversityValueKey, number>;
  roi: number;
  returns: string[];
  cityImpact: string[];
  trophy: string;
};

export type DiversitySession = {
  planId: DiversityPlan["id"];
  satisfaction: number;
  crowd: number;
  revisit: boolean;
  discovery: boolean;
  savedAt: string;
};

export const diversityRoiStorageKey = "tokyo-life-roi-diversity-session";

export const diversityValueLabels: Record<DiversityValueKey, string> = {
  time: "時間",
  money: "お金",
  satisfaction: "満足",
  family: "家族時間",
  comfort: "快適さ",
  discovery: "新しい発見",
};

export const neutralDiversityWeights: DiversityWeights = {
  time: 2,
  money: 2,
  satisfaction: 2,
  family: 2,
  comfort: 2,
  discovery: 2,
};

export const diversityMoodPresets: Record<string, DiversityWeights> = {
  efficient: { ...neutralDiversityWeights, time: 3, money: 3, comfort: 1 },
  slow: { ...neutralDiversityWeights, comfort: 3, satisfaction: 3, time: 1 },
  family: { ...neutralDiversityWeights, family: 3, satisfaction: 3, comfort: 3 },
  discover: { ...neutralDiversityWeights, discovery: 3, satisfaction: 3, money: 1 },
};

export const diversityPlans: DiversityPlan[] = [
  {
    id: "smart",
    name: "スマートプラン",
    label: "効率重視",
    destination: "東京駅周辺・KITTE",
    summary: "短時間で、余白を残す過ごし方",
    time: "2時間20分",
    cost: "3,200円",
    crowd: "少ない",
    accent: "blue",
    primaryMetrics: ["time", "money", "comfort"],
    metrics: { time: 5, money: 5, satisfaction: 3, family: 3, comfort: 3, discovery: 2 },
    roi: 88,
    returns: ["30分の時間短縮", "1,200円の節約", "混雑回避", "家族時間 70分"],
    cityImpact: ["ピーク時間帯を回避", "駅周辺の人流を分散"],
    trophy: "スマートムーバー",
  },
  {
    id: "leisure",
    name: "ゆとりプラン",
    label: "QOL重視",
    destination: "清澄白河・木場公園",
    summary: "落ち着いて、家族の時間を楽しむ",
    time: "2時間50分",
    cost: "4,100円",
    crowd: "とても少ない",
    accent: "green",
    primaryMetrics: ["satisfaction", "comfort", "family"],
    metrics: { time: 3, money: 3, satisfaction: 5, family: 5, comfort: 5, discovery: 3 },
    roi: 81,
    returns: ["家族時間 90分", "心の余白", "混雑回避", "ゆっくり過ごせる"],
    cityImpact: ["空いている地域へ分散", "公園・地域施設を活用"],
    trophy: "家族時間クリエイター",
  },
  {
    id: "discovery",
    name: "発見プラン",
    label: "新しい体験",
    destination: "谷中・根津の地域めぐり",
    summary: "少し遠回りして、初めての東京へ",
    time: "3時間",
    cost: "4,600円",
    crowd: "少ない",
    accent: "purple",
    primaryMetrics: ["discovery", "satisfaction", "family"],
    metrics: { time: 2, money: 2, satisfaction: 5, family: 5, comfort: 3, discovery: 5 },
    roi: 76,
    returns: ["新しい場所 1か所", "家族の思い出", "地域店舗を利用", "発見価値が高い"],
    cityImpact: ["未訪問エリアへ分散", "地域店舗で消費"],
    trophy: "東京開拓者",
  },
];

export function scoreDiversityPlan(plan: DiversityPlan, weights: DiversityWeights) {
  const weighted = (Object.keys(weights) as DiversityValueKey[]).reduce((sum, key) => sum + plan.metrics[key] * weights[key], 0);
  const maximum = (Object.keys(weights) as DiversityValueKey[]).reduce((sum, key) => sum + 5 * weights[key], 0);
  const alignment = maximum === 0 ? 0.5 : weighted / maximum;
  const moodAdjustment = Math.round((alignment - 0.5) * 12);
  return Math.max(60, Math.min(96, plan.roi + moodAdjustment));
}

export function qolScore(plan: DiversityPlan) {
  return Math.round(((plan.metrics.satisfaction + plan.metrics.family + plan.metrics.comfort) / 15) * 100);
}

export function readDiversitySession(): DiversitySession | null {
  try {
    const raw = window.localStorage.getItem(diversityRoiStorageKey);
    return raw ? JSON.parse(raw) as DiversitySession : null;
  } catch {
    return null;
  }
}

export function saveDiversitySession(session: DiversitySession) {
  window.localStorage.setItem(diversityRoiStorageKey, JSON.stringify(session));
}
