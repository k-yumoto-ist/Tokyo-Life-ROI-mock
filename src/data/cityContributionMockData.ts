export type CityCandidateKind = "sports" | "park" | "community";

export type CityContributionCandidate = {
  id: string;
  title: string;
  area: string;
  kind: CityCandidateKind;
  travelTime: string;
  hints: string[];
  result: {
    personalRoi: string;
    contributionScore: number;
    tokyoPoints: number;
    congestion: number;
    publicFacility: number;
    explanation: string;
  };
};

export type CityBadge = {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
};

export const cityQuestGoals = ["子どもと遊びたい", "運動したい", "静かな場所で過ごしたい", "近場で気分転換したい"];

export const cityCandidates: CityContributionCandidate[] = [
  {
    id: "chuo-sports",
    title: "中央区立総合スポーツセンター",
    area: "中央区・日本橋浜町",
    kind: "sports",
    travelTime: "約25分",
    hints: ["屋内で遊べる", "今は比較的空いている", "公共施設を活用できる"],
    result: { personalRoi: "+780円相当", contributionScore: 35, tokyoPoints: 10, congestion: 15, publicFacility: 20, explanation: "混雑している都心の商業施設を避け、比較的空いている公共施設を選んだことで、移動時間と支出を抑えながら、都市の混雑分散にも貢献しました。" },
  },
  {
    id: "yoyogi-park",
    title: "代々木公園",
    area: "渋谷区・代々木神園町",
    kind: "park",
    travelTime: "約15分",
    hints: ["移動負担が少ない", "家族で過ごしやすい", "やや混雑している可能性"],
    result: { personalRoi: "+650円相当", contributionScore: 18, tokyoPoints: 5, congestion: 4, publicFacility: 14, explanation: "近場で家族が過ごせる公園を選んだことで、移動負担を抑えながら、都心への移動集中を避ける選択になりました。" },
  },
  {
    id: "toyosu-park",
    title: "豊洲公園・周辺施設",
    area: "江東区・豊洲",
    kind: "community",
    travelTime: "約35分",
    hints: ["混雑エリアを分散できる", "地域施設を活用できる", "少し遠いが満足度が高そう"],
    result: { personalRoi: "+710円相当", contributionScore: 28, tokyoPoints: 8, congestion: 16, publicFacility: 12, explanation: "混雑しやすいエリアから少し離れた地域施設を選んだことで、満足度を確保しながら、東京全体の人流分散にもつながりました。" },
  },
];

export const cityBadges: CityBadge[] = [
  { id: "crowd", title: "混雑回避ビギナー", description: "混雑時間帯を3回避ける", achieved: true },
  { id: "public", title: "公共施設ハンター", description: "公共施設を5回利用する", achieved: true },
  { id: "spread", title: "東京分散マスター", description: "混雑エリア以外を10回選ぶ", achieved: false },
  { id: "local", title: "地域応援サポーター", description: "地域施設や商店を継続利用する", achieved: false },
  { id: "champion", title: "都市最適化チャンピオン", description: "月間都市貢献スコアが一定値を超える", achieved: false },
];
