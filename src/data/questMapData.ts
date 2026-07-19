export type QuestSpotCategory = "learning" | "family" | "nature" | "culture" | "health" | "public" | "food";

export type QuestSpotScores = {
  time: number;
  cost: number;
  satisfaction: number;
  learning: number;
  family: number;
  health: number;
  urbanContribution: number;
};

export type QuestSpot = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  category: QuestSpotCategory;
  imageUrl?: string;
  estimatedStayMinutes: number;
  estimatedCost: number;
  officialRecommended: boolean;
  indoor: boolean;
  tags: string[];
  scores: QuestSpotScores;
};

export type QuestDifficulty = "beginner" | "intermediate" | "advanced" | "secret";
export type QuestValueKey = keyof QuestSpotScores | "discovery";

export type QuestDefinition = {
  id: string;
  title: string;
  spotId: string;
  difficulty: QuestDifficulty;
  summary: string;
  condition: string;
  basePoints: number;
  minimumQuestPoints: number;
  roiAdjustment?: number;
  distanceKm: number;
  travelMinutes: number;
  values: { key: QuestValueKey; label: string; points: number }[];
  isComposite?: boolean;
};

export type RoiFeedback = {
  satisfaction: "great" | "good" | "low";
  fatigue: "light" | "high";
  familyEnjoyment: boolean;
  timeExpectation: "as-planned" | "longer";
};

export type RoiEvaluation = {
  predictedMyRoi: number;
  actualMyRoi?: number;
  userAverageMyRoi: number;
  reasons: string[];
  feedback?: RoiFeedback;
};

export type QuestReward = {
  basePoints: number;
  firstVisitBonus: number;
  newAreaBonus: number;
  newCategoryBonus: number;
  streakBonus: number;
  roiBonus: number;
  urbanContributionBonus: number;
  totalPoints: number;
};

export type RoiHistoryItem = {
  questId: string;
  questTitle: string;
  spotId: string;
  completedAt: string;
  category: QuestSpotCategory;
  predictedMyRoi: number;
  actualMyRoi: number;
  feedback: RoiFeedback;
};

export type QuestMapProgress = {
  questPoints: number;
  completedQuestCount: number;
  completedQuestIds: string[];
  visitedSpotIds: string[];
  visitedAreas: string[];
  unlockedQuestIds: string[];
  trophyIds: string[];
  consecutiveQuestDays: number;
  roiHistory: RoiHistoryItem[];
};

export const questMapProgressStorageKey = "tokyo-life-roi-quest-map-progress-v2";
export const questMapRoiHistoryStorageKey = "tokyo-life-roi-quest-map-roi-history-v2";
export const questMapLegacyStorageKey = "tokyo-life-roi-quest-map-progress";

export const initialQuestMapProgress: QuestMapProgress = {
  questPoints: 1140,
  completedQuestCount: 12,
  completedQuestIds: ["ueno-learning-walk", "hibiya-reset"],
  visitedSpotIds: ["ueno-park", "national-science-museum", "hibiya-park", "tokyo-forum", "inokashira-park", "koishikawa-korakuen", "mot", "hamarikyu", "central-library"],
  visitedAreas: ["台東区", "千代田区", "三鷹市", "文京区", "江東区"],
  unlockedQuestIds: ["water-family-learning", "rainbow-public", "mot-culture", "yumenoshima-green"],
  trophyIds: ["first-learning", "off-peak-walker"],
  consecutiveQuestDays: 0,
  roiHistory: [
    { questId: "family-library", questTitle: "図書館で親子読書", spotId: "central-library", completedAt: "2026-07-16T05:30:00.000Z", category: "public", predictedMyRoi: 76, actualMyRoi: 74, feedback: { satisfaction: "good", fatigue: "light", familyEnjoyment: true, timeExpectation: "as-planned" } },
    { questId: "park-reset", questTitle: "日比谷で60分リセット", spotId: "hibiya-park", completedAt: "2026-07-12T04:00:00.000Z", category: "health", predictedMyRoi: 73, actualMyRoi: 72, feedback: { satisfaction: "good", fatigue: "light", familyEnjoyment: false, timeExpectation: "as-planned" } },
    { questId: "ueno-learning-walk", questTitle: "上野で学びをつなぐ", spotId: "national-science-museum", completedAt: "2026-07-08T03:00:00.000Z", category: "learning", predictedMyRoi: 75, actualMyRoi: 70, feedback: { satisfaction: "good", fatigue: "high", familyEnjoyment: true, timeExpectation: "longer" } },
    { questId: "inokashira-family", questTitle: "井の頭で家族散歩", spotId: "inokashira-park", completedAt: "2026-06-28T04:00:00.000Z", category: "nature", predictedMyRoi: 80, actualMyRoi: 78, feedback: { satisfaction: "great", fatigue: "light", familyEnjoyment: true, timeExpectation: "as-planned" } },
    { questId: "forum-break", questTitle: "東京駅で小休憩", spotId: "tokyo-forum", completedAt: "2026-06-20T03:00:00.000Z", category: "culture", predictedMyRoi: 79, actualMyRoi: 76, feedback: { satisfaction: "good", fatigue: "light", familyEnjoyment: false, timeExpectation: "as-planned" } },
    { questId: "kasai-day", questTitle: "葛西で自然にふれる", spotId: "kasai-park", completedAt: "2026-06-15T03:00:00.000Z", category: "nature", predictedMyRoi: 89, actualMyRoi: 88, feedback: { satisfaction: "great", fatigue: "light", familyEnjoyment: true, timeExpectation: "as-planned" } },
  ],
};

export const questCategoryLabels: Record<QuestSpotCategory, string> = {
  learning: "学び",
  family: "家族",
  nature: "自然",
  culture: "文化",
  health: "健康",
  public: "公共",
  food: "食",
};

export const questMapSpots: QuestSpot[] = [
  { id: "water-science", name: "東京都水の科学館", description: "水の循環と都市の水道を体験展示で学べる施設。", latitude: 35.6297, longitude: 139.7819, address: "江東区有明3-1-8", category: "learning", estimatedStayMinutes: 60, estimatedCost: 0, officialRecommended: true, indoor: true, tags: ["無料", "親子", "雨の日"], scores: { time: 78, cost: 100, satisfaction: 84, learning: 96, family: 90, health: 52, urbanContribution: 82 } },
  { id: "rainbow-sewerage", name: "東京都虹の下水道館", description: "下水道の仕事と水環境を体験しながら知る公共施設。", latitude: 35.6304, longitude: 139.7776, address: "江東区有明2-3-5", category: "public", estimatedStayMinutes: 55, estimatedCost: 0, officialRecommended: true, indoor: true, tags: ["無料", "環境", "公共施設"], scores: { time: 76, cost: 100, satisfaction: 80, learning: 94, family: 86, health: 46, urbanContribution: 94 } },
  { id: "mot", name: "東京都現代美術館", description: "現代美術と建築をゆったり楽しめる都立美術館。", latitude: 35.6812, longitude: 139.8085, address: "江東区三好4-1-1", category: "culture", estimatedStayMinutes: 120, estimatedCost: 500, officialRecommended: true, indoor: true, tags: ["アート", "木場", "屋内"], scores: { time: 72, cost: 78, satisfaction: 90, learning: 86, family: 74, health: 52, urbanContribution: 86 } },
  { id: "edo-open-air", name: "江戸東京たてもの園", description: "歴史的建造物を移築保存した屋外型の文化施設。", latitude: 35.7157, longitude: 139.5121, address: "小金井市桜町3-7-1", category: "culture", estimatedStayMinutes: 150, estimatedCost: 400, officialRecommended: true, indoor: false, tags: ["歴史", "建築", "未訪問エリア"], scores: { time: 55, cost: 82, satisfaction: 92, learning: 94, family: 82, health: 78, urbanContribution: 91 } },
  { id: "kasai-park", name: "葛西臨海公園", description: "海辺の景色と広い芝生を楽しめる都立公園。", latitude: 35.6401, longitude: 139.862, address: "江戸川区臨海町6", category: "nature", estimatedStayMinutes: 150, estimatedCost: 0, officialRecommended: true, indoor: false, tags: ["海", "公園", "家族"], scores: { time: 65, cost: 96, satisfaction: 91, learning: 66, family: 92, health: 88, urbanContribution: 84 } },
  { id: "ueno-park", name: "上野恩賜公園", description: "文化施設と自然を一度に巡れる東京を代表する都立公園。", latitude: 35.7148, longitude: 139.7732, address: "台東区上野公園", category: "nature", estimatedStayMinutes: 120, estimatedCost: 0, officialRecommended: true, indoor: false, tags: ["公園", "文化", "散歩"], scores: { time: 90, cost: 95, satisfaction: 88, learning: 72, family: 84, health: 82, urbanContribution: 64 } },
  { id: "tokyo-met-art", name: "東京都美術館", description: "多彩な展覧会とアートコミュニケーションを楽しめる美術館。", latitude: 35.7172, longitude: 139.7729, address: "台東区上野公園8-36", category: "culture", estimatedStayMinutes: 100, estimatedCost: 1200, officialRecommended: true, indoor: true, tags: ["美術", "上野", "屋内"], scores: { time: 84, cost: 62, satisfaction: 88, learning: 90, family: 70, health: 45, urbanContribution: 76 } },
  { id: "national-science-museum", name: "国立科学博物館", description: "自然史と科学技術を親子で深く楽しめる博物館。", latitude: 35.7164, longitude: 139.7765, address: "台東区上野公園7-20", category: "learning", estimatedStayMinutes: 150, estimatedCost: 630, officialRecommended: false, indoor: true, tags: ["科学", "恐竜", "親子"], scores: { time: 84, cost: 78, satisfaction: 94, learning: 100, family: 96, health: 42, urbanContribution: 68 } },
  { id: "tokyo-forum", name: "東京国際フォーラム", description: "建築とイベント空間を短時間でも楽しめる都心スポット。", latitude: 35.6769, longitude: 139.7635, address: "千代田区丸の内3-5-1", category: "culture", estimatedStayMinutes: 45, estimatedCost: 0, officialRecommended: false, indoor: true, tags: ["建築", "駅近", "短時間"], scores: { time: 98, cost: 96, satisfaction: 74, learning: 68, family: 58, health: 42, urbanContribution: 60 } },
  { id: "hibiya-park", name: "日比谷公園", description: "都心で短い休息と散歩を取りやすい歴史ある公園。", latitude: 35.6735, longitude: 139.7566, address: "千代田区日比谷公園", category: "health", estimatedStayMinutes: 60, estimatedCost: 0, officialRecommended: true, indoor: false, tags: ["散歩", "無料", "都心"], scores: { time: 96, cost: 100, satisfaction: 82, learning: 52, family: 70, health: 92, urbanContribution: 68 } },
  { id: "yumenoshima", name: "夢の島熱帯植物館", description: "大温室で熱帯植物と環境を学べる都立施設。", latitude: 35.6502, longitude: 139.8274, address: "江東区夢の島2-1-2", category: "learning", estimatedStayMinutes: 90, estimatedCost: 250, officialRecommended: true, indoor: true, tags: ["植物", "環境", "雨の日"], scores: { time: 68, cost: 92, satisfaction: 88, learning: 90, family: 88, health: 66, urbanContribution: 92 } },
  { id: "tama-zoo", name: "多摩動物公園", description: "広い園内で動物の生態と自然を学べる都立動物園。", latitude: 35.6494, longitude: 139.4042, address: "日野市程久保7-1-1", category: "family", estimatedStayMinutes: 240, estimatedCost: 600, officialRecommended: true, indoor: false, tags: ["動物", "一日", "多摩"], scores: { time: 38, cost: 78, satisfaction: 96, learning: 92, family: 100, health: 90, urbanContribution: 90 } },
  { id: "inokashira-park", name: "井の頭恩賜公園", description: "池と緑の中で散歩や家族時間を楽しめる都立公園。", latitude: 35.7005, longitude: 139.5755, address: "武蔵野市御殿山1", category: "nature", estimatedStayMinutes: 120, estimatedCost: 0, officialRecommended: true, indoor: false, tags: ["散歩", "池", "家族"], scores: { time: 58, cost: 96, satisfaction: 94, learning: 56, family: 92, health: 94, urbanContribution: 82 } },
  { id: "koishikawa-korakuen", name: "小石川後楽園", description: "江戸の庭園文化と季節の自然を味わえる都立庭園。", latitude: 35.7057, longitude: 139.7498, address: "文京区後楽1-6-6", category: "culture", estimatedStayMinutes: 75, estimatedCost: 300, officialRecommended: true, indoor: false, tags: ["庭園", "歴史", "静か"], scores: { time: 82, cost: 90, satisfaction: 90, learning: 78, family: 68, health: 82, urbanContribution: 85 } },
  { id: "hamarikyu", name: "浜離宮恩賜庭園", description: "潮入の池と歴史的景観を楽しめる都立庭園。", latitude: 35.6597, longitude: 139.7635, address: "中央区浜離宮庭園1-1", category: "nature", estimatedStayMinutes: 90, estimatedCost: 300, officialRecommended: true, indoor: false, tags: ["庭園", "水辺", "歴史"], scores: { time: 84, cost: 88, satisfaction: 91, learning: 74, family: 68, health: 84, urbanContribution: 82 } },
  { id: "central-library", name: "東京都立中央図書館", description: "豊富な資料と静かな閲覧環境を備えた公共図書館。", latitude: 35.6529, longitude: 139.7225, address: "港区南麻布5-7-13", category: "public", estimatedStayMinutes: 90, estimatedCost: 0, officialRecommended: true, indoor: true, tags: ["無料", "図書館", "静か"], scores: { time: 75, cost: 100, satisfaction: 82, learning: 98, family: 58, health: 38, urbanContribution: 96 } },
  { id: "sona-area", name: "そなエリア東京", description: "首都直下地震の備えを体験しながら学べる防災施設。", latitude: 35.6345, longitude: 139.7914, address: "江東区有明3-8-35", category: "learning", estimatedStayMinutes: 90, estimatedCost: 0, officialRecommended: true, indoor: true, tags: ["防災", "無料", "親子"], scores: { time: 70, cost: 100, satisfaction: 86, learning: 100, family: 90, health: 48, urbanContribution: 100 } },
  { id: "ecocle", name: "えこっくる江東", description: "環境について体験学習できる江東区の公共施設。", latitude: 35.6584, longitude: 139.8193, address: "江東区潮見1-29-7", category: "public", estimatedStayMinutes: 75, estimatedCost: 0, officialRecommended: true, indoor: true, tags: ["環境", "無料", "公共施設"], scores: { time: 72, cost: 100, satisfaction: 82, learning: 94, family: 88, health: 44, urbanContribution: 98 } },
  { id: "adachi-bio", name: "足立区生物園", description: "身近な生きものを間近で観察できる地域の学習施設。", latitude: 35.7946, longitude: 139.8068, address: "足立区保木間2-17-1", category: "family", estimatedStayMinutes: 120, estimatedCost: 300, officialRecommended: false, indoor: true, tags: ["生きもの", "地域施設", "親子"], scores: { time: 50, cost: 90, satisfaction: 92, learning: 88, family: 96, health: 58, urbanContribution: 92 } },
  { id: "sumida-aquarium", name: "すみだ水族館", description: "東京スカイツリータウン内で水辺の生態を楽しめる施設。", latitude: 35.7101, longitude: 139.8107, address: "墨田区押上1-1-2", category: "family", estimatedStayMinutes: 120, estimatedCost: 2500, officialRecommended: false, indoor: true, tags: ["水族館", "屋内", "親子"], scores: { time: 76, cost: 42, satisfaction: 96, learning: 82, family: 98, health: 36, urbanContribution: 52 } },
  { id: "musashino-place", name: "武蔵野プレイス", description: "図書館と市民活動機能が一体になった公共文化施設。", latitude: 35.7015, longitude: 139.5432, address: "武蔵野市境南町2-3-18", category: "public", estimatedStayMinutes: 90, estimatedCost: 0, officialRecommended: false, indoor: true, tags: ["図書館", "公共施設", "建築"], scores: { time: 52, cost: 100, satisfaction: 86, learning: 94, family: 74, health: 40, urbanContribution: 94 } },
  { id: "yumenoshima-sports", name: "夢の島公園アーチェリー場周辺", description: "緑の中で散歩や軽い運動を楽しめる都立スポーツエリア。", latitude: 35.6517, longitude: 139.8252, address: "江東区夢の島2", category: "health", estimatedStayMinutes: 90, estimatedCost: 0, officialRecommended: true, indoor: false, tags: ["運動", "公園", "混雑回避"], scores: { time: 66, cost: 98, satisfaction: 82, learning: 42, family: 76, health: 98, urbanContribution: 90 } },
  { id: "jindai-garden", name: "神代植物公園", description: "四季の植物と広い園内散策を楽しめる都立植物公園。", latitude: 35.6721, longitude: 139.5464, address: "調布市深大寺元町5-31-10", category: "nature", estimatedStayMinutes: 150, estimatedCost: 500, officialRecommended: true, indoor: false, tags: ["植物", "散歩", "多摩"], scores: { time: 44, cost: 82, satisfaction: 94, learning: 82, family: 86, health: 96, urbanContribution: 92 } },
  { id: "fukagawa-edo", name: "深川江戸資料館", description: "江戸の町並みを実物大で再現した地域文化施設。", latitude: 35.6816, longitude: 139.8003, address: "江東区白河1-3-28", category: "culture", estimatedStayMinutes: 80, estimatedCost: 400, officialRecommended: false, indoor: true, tags: ["江戸", "地域文化", "屋内"], scores: { time: 76, cost: 88, satisfaction: 88, learning: 94, family: 86, health: 40, urbanContribution: 91 } },
];

export const questDefinitions: QuestDefinition[] = [
  { id: "water-family-learning", title: "無料で知識を増やす90分", spotId: "water-science", difficulty: "beginner", summary: "家族で水のしくみを発見しよう", condition: "予算1,000円以内・屋内", basePoints: 100, minimumQuestPoints: 0, roiAdjustment: -4, distanceKm: 5.8, travelMinutes: 28, values: [{ key: "learning", label: "学び", points: 18 }, { key: "family", label: "家族", points: 10 }, { key: "cost", label: "コスト", points: 15 }, { key: "urbanContribution", label: "都市", points: 6 }] },
  { id: "rainbow-public", title: "近くの無料公共施設を使おう", spotId: "rainbow-sewerage", difficulty: "beginner", summary: "水環境を親子で体験する", condition: "無料・60分以内", basePoints: 100, minimumQuestPoints: 0, roiAdjustment: -4, distanceKm: 6.1, travelMinutes: 30, values: [{ key: "learning", label: "学び", points: 16 }, { key: "cost", label: "コスト", points: 15 }, { key: "urbanContribution", label: "都市", points: 12 }] },
  { id: "mot-culture", title: "混雑を避けてアートに触れよう", spotId: "mot", difficulty: "beginner", summary: "木場エリアで静かな文化時間", condition: "混雑少なめ・2時間", basePoints: 100, minimumQuestPoints: 0, distanceKm: 4.2, travelMinutes: 24, values: [{ key: "satisfaction", label: "満足", points: 14 }, { key: "learning", label: "学び", points: 12 }, { key: "urbanContribution", label: "都市", points: 8 }] },
  { id: "yumenoshima-green", title: "雨でも緑を楽しむ90分", spotId: "yumenoshima", difficulty: "intermediate", summary: "熱帯植物と環境を学ぶ屋内クエスト", condition: "Quest Point 500・屋内", basePoints: 110, minimumQuestPoints: 500, distanceKm: 7.4, travelMinutes: 34, values: [{ key: "learning", label: "学び", points: 14 }, { key: "satisfaction", label: "満足", points: 13 }, { key: "urbanContribution", label: "都市", points: 10 }] },
  { id: "composite-koto", title: "学びと家族時間を1回の移動で", spotId: "mot", difficulty: "intermediate", summary: "水の科学館と現代美術館をつなぐ複合ルート", condition: "Quest Point 1,200・半日", basePoints: 120, minimumQuestPoints: 1200, distanceKm: 8.2, travelMinutes: 38, values: [{ key: "time", label: "時間", points: 12 }, { key: "learning", label: "学び", points: 20 }, { key: "family", label: "家族", points: 16 }, { key: "discovery", label: "発見", points: 12 }], isComposite: true },
  { id: "new-area-architecture", title: "未訪問エリアで東京の建築を知る", spotId: "edo-open-air", difficulty: "advanced", summary: "小金井で歴史的建築を巡る", condition: "Quest Point 2,000・未訪問エリア", basePoints: 130, minimumQuestPoints: 2000, distanceKm: 24.6, travelMinutes: 62, values: [{ key: "learning", label: "学び", points: 18 }, { key: "health", label: "健康", points: 12 }, { key: "discovery", label: "発見", points: 20 }] },
  { id: "secret-rain", title: "雨の東京で新しい学びを", spotId: "sona-area", difficulty: "secret", summary: "天候を味方にするシークレットクエスト", condition: "Quest Point 3,000・雨の日", basePoints: 150, minimumQuestPoints: 3000, distanceKm: 6.5, travelMinutes: 31, values: [{ key: "learning", label: "学び", points: 22 }, { key: "family", label: "家族", points: 16 }, { key: "urbanContribution", label: "都市", points: 18 }] },
  { id: "ueno-learning-walk", title: "上野で学びをつなぐ", spotId: "national-science-museum", difficulty: "intermediate", summary: "公園と科学博物館をまとめて巡る", condition: "達成済み", basePoints: 110, minimumQuestPoints: 500, distanceKm: 4.4, travelMinutes: 22, values: [{ key: "learning", label: "学び", points: 18 }, { key: "family", label: "家族", points: 12 }] },
  { id: "hibiya-reset", title: "都心で60分リセット", spotId: "hibiya-park", difficulty: "beginner", summary: "短い散歩で心と体に余白を", condition: "達成済み", basePoints: 100, minimumQuestPoints: 0, distanceKm: 1.8, travelMinutes: 12, values: [{ key: "health", label: "健康", points: 16 }, { key: "time", label: "時間", points: 12 }] },
];

export const demoLocation = { latitude: 35.6812, longitude: 139.7671, label: "東京駅（デモ位置）" };
