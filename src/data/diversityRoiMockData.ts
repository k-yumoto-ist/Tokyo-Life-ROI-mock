export type DiversityValueKey = "time" | "money" | "satisfaction" | "family" | "comfort" | "discovery";

export type DiversityWeights = Record<DiversityValueKey, number>;
export type DiversityMoodId = "efficient" | "slow" | "family" | "discover";

export type DiversityPlan = {
  id: string;
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

export type DiversityScenario = {
  id: DiversityMoodId;
  title: string;
  condition: string;
  destinationLabel: string;
  plans: DiversityPlan[];
};

export type DiversitySession = {
  planId: string;
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

export const diversityMoodPresets: Record<DiversityMoodId, DiversityWeights> = {
  efficient: { ...neutralDiversityWeights, time: 3, money: 3, comfort: 1 },
  slow: { ...neutralDiversityWeights, comfort: 3, satisfaction: 3, time: 1 },
  family: { ...neutralDiversityWeights, family: 3, satisfaction: 3, comfort: 3 },
  discover: { ...neutralDiversityWeights, discovery: 3, satisfaction: 3, money: 1 },
};

const familyPlans: DiversityPlan[] = [
  {
    id: "family-smart", name: "スマートプラン", label: "効率重視", destination: "東京駅周辺・KITTE",
    summary: "短時間で、親子の用事と休憩をまとめて済ませる", time: "2時間20分", cost: "3,200円", crowd: "少なめ", accent: "blue",
    primaryMetrics: ["time", "money", "comfort"], metrics: { time: 5, money: 5, satisfaction: 3, family: 3, comfort: 3, discovery: 2 }, roi: 88,
    returns: ["30分の時間短縮", "1,200円の節約", "混雑を回避", "家族時間 70分"],
    cityImpact: ["ピーク時間帯を避ける", "駅周辺の人流を分散"], trophy: "スマートムーバー",
  },
  {
    id: "family-leisure", name: "ゆとりプラン", label: "QOL重視", destination: "清澄白河・木場公園",
    summary: "落ち着いた場所で、親子の時間をたっぷり確保する", time: "2時間50分", cost: "4,100円", crowd: "とても少ない", accent: "green",
    primaryMetrics: ["satisfaction", "comfort", "family"], metrics: { time: 3, money: 3, satisfaction: 5, family: 5, comfort: 5, discovery: 3 }, roi: 81,
    returns: ["家族時間 90分", "心の余白", "混雑を回避", "ゆっくり過ごせる"],
    cityImpact: ["空いているエリアへ分散", "公園と地域施設を活用"], trophy: "家族時間クリエイター",
  },
  {
    id: "family-discovery", name: "発見プラン", label: "新しい体験", destination: "谷中・根津の地域めぐり",
    summary: "少し遠回りして、親子で初めての東京に出会う", time: "3時間", cost: "4,600円", crowd: "少なめ", accent: "purple",
    primaryMetrics: ["discovery", "satisfaction", "family"], metrics: { time: 2, money: 2, satisfaction: 5, family: 5, comfort: 3, discovery: 5 }, roi: 76,
    returns: ["新しい場所 1か所", "家族の思い出", "地域施設を利用", "発見価値が高い"],
    cityImpact: ["未訪問エリアへ分散", "地域の店舗で消費"], trophy: "東京開拓者",
  },
];

const efficientPlans: DiversityPlan[] = [
  {
    id: "efficient-smart", name: "最短プラン", label: "時間を守る", destination: "丸の内・八重洲", summary: "移動を絞って、45分の用事をスムーズに完結", time: "1時間15分", cost: "1,480円", crowd: "普通", accent: "blue",
    primaryMetrics: ["time", "money", "comfort"], metrics: { time: 5, money: 4, satisfaction: 3, family: 2, comfort: 3, discovery: 2 }, roi: 91,
    returns: ["18分の時間短縮", "移動 2回で完結", "乗換負担を軽減", "予定に余白"], cityImpact: ["混雑する改札を避ける", "オフピーク経路を利用"], trophy: "15分の錬金術師",
  },
  {
    id: "efficient-leisure", name: "ひと息プラン", label: "快適さを足す", destination: "日比谷公園・有楽町", summary: "予定の前後に短い休憩をつくり、疲れを残さない", time: "1時間40分", cost: "2,100円", crowd: "少なめ", accent: "green",
    primaryMetrics: ["comfort", "satisfaction", "time"], metrics: { time: 4, money: 3, satisfaction: 4, family: 2, comfort: 5, discovery: 3 }, roi: 84,
    returns: ["休憩 25分", "歩行負担を軽減", "混雑を回避", "気分転換"], cityImpact: ["公園空間を活用", "混雑時間をずらす"], trophy: "余白の達人",
  },
  {
    id: "efficient-discovery", name: "寄り道プラン", label: "小さな発見", destination: "神田・御茶ノ水", summary: "用事のついでに、気になる街をひとつだけ覗く", time: "1時間55分", cost: "1,860円", crowd: "少なめ", accent: "purple",
    primaryMetrics: ["discovery", "time", "satisfaction"], metrics: { time: 3, money: 4, satisfaction: 4, family: 2, comfort: 3, discovery: 5 }, roi: 79,
    returns: ["新しい店 1軒", "移動のついで", "混雑を回避", "地域に立ち寄る"], cityImpact: ["地域店舗を利用", "定番エリアから分散"], trophy: "ローカルサポーター",
  },
];

const slowPlans: DiversityPlan[] = [
  {
    id: "slow-smart", name: "静かな近場プラン", label: "移動を少なく", destination: "清澄白河・カフェ散策", summary: "近場で移動負担を抑え、静かな午後をつくる", time: "2時間", cost: "2,800円", crowd: "少なめ", accent: "blue",
    primaryMetrics: ["comfort", "time", "money"], metrics: { time: 4, money: 4, satisfaction: 4, family: 3, comfort: 5, discovery: 3 }, roi: 86,
    returns: ["移動 20分以内", "静かな席", "予定に余白", "費用を抑える"], cityImpact: ["混雑エリアを避ける", "近隣店舗を利用"], trophy: "オフピークマスター",
  },
  {
    id: "slow-leisure", name: "ゆるやかプラン", label: "心の余白", destination: "浜離宮恩賜庭園", summary: "景色を眺めながら、急がない午後を過ごす", time: "2時間40分", cost: "3,500円", crowd: "とても少ない", accent: "green",
    primaryMetrics: ["comfort", "satisfaction", "family"], metrics: { time: 2, money: 3, satisfaction: 5, family: 4, comfort: 5, discovery: 4 }, roi: 80,
    returns: ["心の余白", "混雑を回避", "屋外でリフレッシュ", "写真に残る時間"], cityImpact: ["公共庭園を活用", "人流を分散"], trophy: "快適ルート発見者",
  },
  {
    id: "slow-discovery", name: "文化にふれるプラン", label: "ゆっくり発見", destination: "本所・すみだの小さな美術館", summary: "小規模な展示と街歩きで、静かな発見を重ねる", time: "3時間", cost: "3,900円", crowd: "少なめ", accent: "purple",
    primaryMetrics: ["discovery", "comfort", "satisfaction"], metrics: { time: 2, money: 3, satisfaction: 5, family: 3, comfort: 4, discovery: 5 }, roi: 75,
    returns: ["新しい展示", "静かな街歩き", "混雑を回避", "地域文化に触れる"], cityImpact: ["小規模施設を活用", "周辺地域で消費"], trophy: "穴場発見王",
  },
];

const discoveryPlans: DiversityPlan[] = [
  {
    id: "discover-smart", name: "上野カルチャープラン", label: "定番を上手に", destination: "上野・国立科学博物館", summary: "時間帯をずらして、定番スポットを快適に楽しむ", time: "2時間30分", cost: "3,600円", crowd: "普通", accent: "blue",
    primaryMetrics: ["time", "satisfaction", "discovery"], metrics: { time: 4, money: 4, satisfaction: 4, family: 4, comfort: 3, discovery: 4 }, roi: 85,
    returns: ["展示を効率よく鑑賞", "移動を最適化", "混雑時間を回避", "発見 1件"], cityImpact: ["入館ピークを避ける", "公共文化施設を活用"], trophy: "公共施設マスター",
  },
  {
    id: "discover-leisure", name: "豊洲水辺プラン", label: "気持ちよく発見", destination: "豊洲公園・周辺施設", summary: "水辺で過ごしながら、家族で新しい景色を楽しむ", time: "2時間50分", cost: "4,200円", crowd: "少なめ", accent: "green",
    primaryMetrics: ["family", "comfort", "discovery"], metrics: { time: 3, money: 3, satisfaction: 5, family: 5, comfort: 5, discovery: 4 }, roi: 80,
    returns: ["家族時間 95分", "水辺の散策", "混雑を回避", "新しい景色"], cityImpact: ["湾岸エリアへ分散", "公園と地域施設を利用"], trophy: "ファミリー貢献",
  },
  {
    id: "discover-discovery", name: "谷根千探索プラン", label: "まだ知らない東京", destination: "谷中・根津・千駄木", summary: "商店と路地をめぐり、その街らしい時間を見つける", time: "3時間", cost: "4,600円", crowd: "少なめ", accent: "purple",
    primaryMetrics: ["discovery", "satisfaction", "family"], metrics: { time: 2, money: 2, satisfaction: 5, family: 4, comfort: 3, discovery: 5 }, roi: 76,
    returns: ["新しい場所 3か所", "地域店舗を利用", "家族の思い出", "発見価値が高い"], cityImpact: ["未訪問エリアへ分散", "地域の商店で消費"], trophy: "東京開拓者",
  },
];

export const diversityScenarios: Record<DiversityMoodId, DiversityScenario> = {
  efficient: { id: "efficient", title: "短時間でも、余白を残したい日", condition: "ひとり・2時間以内・東京駅周辺", destinationLabel: "東京駅周辺", plans: efficientPlans },
  slow: { id: "slow", title: "急がず、心を整えたい日", condition: "午後・混雑を避けたい・ゆっくり", destinationLabel: "都心から30分以内", plans: slowPlans },
  family: { id: "family", title: "家族で、気持ちよく過ごしたい日", condition: "家族4人・午後・予算5,000円以内", destinationLabel: "東京駅周辺", plans: familyPlans },
  discover: { id: "discover", title: "まだ知らない東京に出会いたい日", condition: "家族で・3時間・混雑を避けたい", destinationLabel: "東京23区", plans: discoveryPlans },
};

export const diversityPlans = familyPlans;

export function getDiversityScenario(mood: DiversityMoodId) {
  return diversityScenarios[mood];
}

export function findDiversityPlan(planId: string) {
  return Object.values(diversityScenarios).flatMap((scenario) => scenario.plans).find((plan) => plan.id === planId);
}

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
