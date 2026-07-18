export type TokyoSpotBadgeTone = "blue" | "green" | "purple" | "gold";
export type TokyoSpotBadge = {
  label: string;
  tone: TokyoSpotBadgeTone;
};

export type TokyoRecommendationSpot = {
  id: string;
  name: string;
  area: string;
  category: string;
  travelTime: string;
  cost: string;
  crowd: string;
  satisfaction: number;
  personalScore: number;
  tokyoScore: number;
  totalScore: number;
  environmentalScore: number;
  learningCultureScore: number;
  cityScore: number;
  summary: string;
  personalReasons: string[];
  tokyoReasons: string[];
  badges: TokyoSpotBadge[];
  personalBenefits: string[];
  cityBenefits: string[];
  completionBadge: string;
  completionBadgeDetail: string;
};

export const tokyoRecommendationSpots: TokyoRecommendationSpot[] = [
  {
    id: "ecocle-koto",
    name: "えこっくる江東",
    area: "江東区潮見",
    category: "環境学習施設",
    travelTime: "35分",
    cost: "500円",
    crowd: "少なめ",
    satisfaction: 88,
    personalScore: 91,
    tokyoScore: 94,
    totalScore: 92,
    environmentalScore: 96,
    learningCultureScore: 91,
    cityScore: 88,
    summary: "家族で楽しみながら、環境のことも自然に学べます。",
    personalReasons: ["子どもと一緒に体験しやすい", "予算内で半日を過ごせる", "午後は比較的空いている見込み"],
    tokyoReasons: ["環境学習につながる公共施設", "公共交通で行きやすい", "利用が集中しにくい時間帯"],
    badges: [{ label: "東京おすすめ", tone: "blue" }, { label: "環境にやさしい", tone: "green" }, { label: "学びスポット", tone: "purple" }],
    personalBenefits: ["満足度 とても満足", "時間効率 +18", "子どもの学びを確保"],
    cityBenefits: ["学びスポットを利用", "混雑の少ない時間帯を選択"],
    completionBadge: "エコなお出かけ",
    completionBadgeDetail: "環境を学べる東京おすすめスポットを選びました",
  },
  {
    id: "miraikan",
    name: "日本科学未来館",
    area: "江東区青海",
    category: "科学館",
    travelTime: "42分",
    cost: "2,500円",
    crowd: "ふつう",
    satisfaction: 92,
    personalScore: 88,
    tokyoScore: 91,
    totalScore: 90,
    environmentalScore: 82,
    learningCultureScore: 97,
    cityScore: 84,
    summary: "雨でも安心。体験展示で親子の会話が広がります。",
    personalReasons: ["屋内なので天候を気にしにくい", "親子で楽しめる展示が多い", "半日プランに収まりやすい"],
    tokyoReasons: ["科学・技術への学びにつながる", "臨海エリアの施設利用につながる", "公共交通でアクセスしやすい"],
    badges: [{ label: "東京おすすめ", tone: "blue" }, { label: "学びスポット", tone: "purple" }],
    personalBenefits: ["満足度 とても満足", "雨の日でも快適", "親子の会話が増える"],
    cityBenefits: ["学びスポットを利用", "臨海エリアへ人流を分散"],
    completionBadge: "学びスポット発見",
    completionBadgeDetail: "親子で科学にふれる選択をしました",
  },
  {
    id: "hibiya-library",
    name: "日比谷図書文化館",
    area: "千代田区日比谷",
    category: "図書館・文化施設",
    travelTime: "20分",
    cost: "0円",
    crowd: "ふつう",
    satisfaction: 84,
    personalScore: 96,
    tokyoScore: 65,
    totalScore: 89,
    environmentalScore: 76,
    learningCultureScore: 92,
    cityScore: 62,
    summary: "近くで、静かに過ごしたい日の文化的な寄り道。",
    personalReasons: ["移動時間を抑えられる", "費用をかけずに過ごせる", "落ち着いた時間を取りやすい"],
    tokyoReasons: ["都心の文化施設を活用できる", "徒歩と公共交通で移動しやすい"],
    badges: [{ label: "文化・歴史", tone: "purple" }, { label: "公共施設", tone: "blue" }],
    personalBenefits: ["時間効率 +24", "費用を節約", "静かな休憩時間"],
    cityBenefits: ["公共施設を利用", "都心の文化資源にふれる"],
    completionBadge: "東京文化ハンター",
    completionBadgeDetail: "身近な文化施設を新しく活用しました",
  },
  {
    id: "sona-area",
    name: "そなエリア東京",
    area: "江東区有明",
    category: "防災体験施設",
    travelTime: "55分",
    cost: "0円",
    crowd: "少なめ",
    satisfaction: 79,
    personalScore: 78,
    tokyoScore: 97,
    totalScore: 85,
    environmentalScore: 70,
    learningCultureScore: 94,
    cityScore: 96,
    summary: "少し足を伸ばして、家族の安心につながる体験を。",
    personalReasons: ["家族で防災を体験できる", "費用を抑えられる", "混雑の少ない時間帯"],
    tokyoReasons: ["防災を学べる公共施設", "地域の防災意識につながる", "混雑分散しやすいエリア"],
    badges: [{ label: "防災を学べる", tone: "gold" }, { label: "公共施設", tone: "blue" }, { label: "混雑分散に貢献", tone: "green" }],
    personalBenefits: ["費用を節約", "家族の安心につながる", "混雑を避けやすい"],
    cityBenefits: ["防災体験施設を利用", "有明エリアへ人流を分散"],
    completionBadge: "公共施設サポーター",
    completionBadgeDetail: "防災を学べる公共施設を利用しました",
  },
  {
    id: "kiba-park",
    name: "木場公園と東京都現代美術館",
    area: "江東区三好",
    category: "都立公園・美術館",
    travelTime: "38分",
    cost: "1,200円",
    crowd: "少なめ",
    satisfaction: 89,
    personalScore: 86,
    tokyoScore: 89,
    totalScore: 87,
    environmentalScore: 85,
    learningCultureScore: 93,
    cityScore: 87,
    summary: "公園とアートを一緒に。親子のペースで楽しめます。",
    personalReasons: ["屋外と屋内を気分で選べる", "家族で過ごす余白がある", "混雑を避けやすい"],
    tokyoReasons: ["都立公園と文化施設を活用", "地域施設の利用につながる", "徒歩で園内を楽しめる"],
    badges: [{ label: "文化・歴史", tone: "purple" }, { label: "地域貢献", tone: "green" }],
    personalBenefits: ["家族時間を確保", "満足度 とても満足", "自然とアートを両立"],
    cityBenefits: ["都立公園を利用", "地域の文化施設を活用"],
    completionBadge: "東京探索ビギナー",
    completionBadgeDetail: "いつもと違う地域の文化にふれました",
  },
  {
    id: "yanesen",
    name: "谷中銀座と谷根千まち歩き",
    area: "台東区谷中",
    category: "地域商店街・文化",
    travelTime: "48分",
    cost: "1,800円",
    crowd: "やや混雑",
    satisfaction: 90,
    personalScore: 83,
    tokyoScore: 86,
    totalScore: 86,
    environmentalScore: 72,
    learningCultureScore: 90,
    cityScore: 89,
    summary: "暮らしの近くにある、東京らしい発見を楽しめます。",
    personalReasons: ["親子で街歩きを楽しめる", "新しい発見が多い", "予算に合わせて立ち寄れる"],
    tokyoReasons: ["地域商店街の利用につながる", "文化的な街並みにふれられる", "地域への消費分散につながる"],
    badges: [{ label: "文化・歴史", tone: "purple" }, { label: "地域貢献", tone: "green" }],
    personalBenefits: ["新しい発見 1件", "家族の思い出", "地域の味を楽しむ"],
    cityBenefits: ["地域店舗を利用", "地域への消費を分散"],
    completionBadge: "地域発見サポーター",
    completionBadgeDetail: "地域の暮らしにふれる選択をしました",
  },
];

export function getTokyoRecommendationResults(activity: string, destination: string, includeTokyoRecommendations: boolean) {
  const normalizedDestination = destination.trim();
  let pool = tokyoRecommendationSpots;

  if (normalizedDestination.includes("上野") || activity === "文化・歴史") {
    pool = [tokyoRecommendationSpots[2], tokyoRecommendationSpots[5], tokyoRecommendationSpots[4]];
  } else if (activity === "防災を学ぶ") {
    pool = [tokyoRecommendationSpots[3], tokyoRecommendationSpots[0], tokyoRecommendationSpots[1]];
  } else if (activity === "環境にふれる") {
    pool = [tokyoRecommendationSpots[0], tokyoRecommendationSpots[4], tokyoRecommendationSpots[1]];
  } else {
    pool = [tokyoRecommendationSpots[0], tokyoRecommendationSpots[1], tokyoRecommendationSpots[2], tokyoRecommendationSpots[3]];
  }

  return [...pool]
    .sort((left, right) => (includeTokyoRecommendations ? right.totalScore - left.totalScore : right.personalScore - left.personalScore))
    .slice(0, 3);
}
