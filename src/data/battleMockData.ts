export type BattleStatus = {
  time: number;
  saving: number;
  quiet: number;
  satisfaction: number;
  family: number;
};

export type BattlePlan = {
  id: "a" | "b" | "c";
  label: string;
  title: string;
  catchcopy: string;
  destination: string;
  travel: string;
  stay: string;
  wait: string;
  cost: string;
  crowd: string;
  satisfaction: number;
  roi: number;
  feature: string;
  primaryStrength: string;
  strengths: string[];
  commentary: string;
  status: BattleStatus;
};

export type BattleHistory = {
  selectedPlanId: BattlePlan["id"];
  selectedPlanTitle: string;
  recommendedPlanTitle: string;
  savedMinutes: number;
  estimatedSavings: number;
  satisfaction: number;
  roi: number;
};

export const battlePlans: BattlePlan[] = [
  {
    id: "a",
    label: "PLAN A",
    title: "近場速攻型",
    catchcopy: "移動と待ち時間を最小化",
    destination: "葛西臨海公園",
    travel: "45分",
    stay: "3時間",
    wait: "10分",
    cost: "5,200円",
    crowd: "少なめ",
    satisfaction: 82,
    roi: 92,
    feature: "待ち時間カット",
    primaryStrength: "家族の移動負担が最も少ない",
    strengths: ["時間効率が高い", "子どもの負担が少ない", "帰宅後の時間を確保できる"],
    commentary: "近場速攻型が移動時間でリードしています。",
    status: { time: 94, saving: 56, quiet: 80, satisfaction: 82, family: 92 },
  },
  {
    id: "b",
    label: "PLAN B",
    title: "節約じっくり型",
    catchcopy: "出費を抑えて一日楽しむ",
    destination: "水元公園＋周辺散策",
    travel: "35分",
    stay: "4時間",
    wait: "ほぼなし",
    cost: "2,400円",
    crowd: "普通",
    satisfaction: 78,
    roi: 88,
    feature: "無料スポット連携",
    primaryStrength: "費用対効果が最も高い",
    strengths: ["費用対効果が高い", "無料施設を活用できる", "長時間過ごせる"],
    commentary: "節約じっくり型は費用対効果でリードしています。",
    status: { time: 82, saving: 98, quiet: 62, satisfaction: 78, family: 78 },
  },
  {
    id: "c",
    label: "PLAN C",
    title: "満足度全振り型",
    catchcopy: "今日しかできない特別体験",
    destination: "チームラボプラネッツ",
    travel: "70分",
    stay: "3時間",
    wait: "30分",
    cost: "9,600円",
    crowd: "やや多い",
    satisfaction: 96,
    roi: 90,
    feature: "特別体験ボーナス",
    primaryStrength: "体験価値が最も高い",
    strengths: ["非日常体験", "子どもの記憶に残りやすい", "体験価値が高い"],
    commentary: "満足度全振り型は体験価値が高い一方、混雑が弱点です。",
    status: { time: 54, saving: 34, quiet: 42, satisfaction: 96, family: 75 },
  },
];

export const battleLoadingMessages = [
  "移動時間を比較中",
  "費用を計算中",
  "混雑状況を確認中",
  "あなたの時間価値を反映中",
  "家族構成と好みを反映中",
  "3つのプランを選定中",
];

export const battleJudgingMessages = [
  "あなたの時間価値を反映",
  "費用と移動負担を換算",
  "混雑と満足度を比較",
  "総合ROIを算出中",
];

export const battleHistoryStorageKey = "tokyo-life-roi-battle-history";
