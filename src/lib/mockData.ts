import type { OpenDataSource, PersonalImpact, RouteOption, TokyoImpact, TravelConditions } from "../types";

export const defaultConditions: TravelConditions = {
  origin: "新宿駅",
  destination: "大手町駅",
  arrivalTime: "09:30",
  purpose: "仕事の移動",
  priority: "バランス",
  crowdAvoidance: "できれば避けたい",
  willingnessToPayFor15Min: 480,
  walkLimitMinutes: 15,
  transferLimit: 1
};

export const routeOptions: RouteOption[] = [
  {
    id: "delay-comfort",
    title: "15分ずらして快適に移動",
    label: "出発をずらす",
    departureTime: "08:50",
    arrivalTime: "09:24",
    durationMinutes: 34,
    fare: 210,
    crowding: "やや混雑",
    crowdingScore: 46,
    crowdedMinutes: 10,
    walkMinutes: 6,
    seatChance: "高い",
    transfers: 1,
    delayRiskCost: 80,
    effortCost: 90,
    note: "出発を15分遅らせても到着希望時刻に間に合い、ピークの混雑を避けやすい案です。"
  },
  {
    id: "now-fastest",
    title: "今すぐ最短で移動",
    label: "最短経路",
    departureTime: "08:35",
    arrivalTime: "09:07",
    durationMinutes: 32,
    fare: 210,
    crowding: "非常に混雑",
    crowdingScore: 88,
    crowdedMinutes: 18,
    walkMinutes: 5,
    seatChance: "低い",
    transfers: 1,
    delayRiskCost: 120,
    effortCost: 210,
    note: "到着は早い一方で、混雑時間が長く、疲労感が残りやすい案です。"
  },
  {
    id: "alternate-calm",
    title: "別経路でゆったり移動",
    label: "別駅を使う",
    departureTime: "08:40",
    arrivalTime: "09:19",
    durationMinutes: 39,
    fare: 290,
    crowding: "空いている",
    crowdingScore: 30,
    crowdedMinutes: 5,
    walkMinutes: 12,
    seatChance: "中程度",
    transfers: 1,
    delayRiskCost: 90,
    effortCost: 160,
    note: "少し歩いて別経路を使うことで、車内混雑を大きく避ける案です。"
  }
];

export const personalImpact: PersonalImpact = {
  recoveredThisTripMinutes: 12,
  recoveredThisMonthMinutes: 46,
  avoidedCrowdingThisMonthMinutes: 38,
  monthlyBenefitYen: 2140
};

export const tokyoImpact: TokyoImpact = {
  shiftedTrips: 1284,
  reducedCrowdingHours: 326,
  routeDistributionRate: 18,
  sampleNote: "表示値はデモ用のサンプルです。実運用では公共交通データや混雑情報をもとに推計します。"
};

export const openDataSources: OpenDataSource[] = [
  {
    title: "東京都オープンデータカタログ",
    data: "公共施設、イベント、地域施設、安心安全に関するデータ",
    usage: "目的地周辺の代替候補や地域イベントによる混雑要因の推定"
  },
  {
    title: "都営地下鉄の混雑に関する情報",
    data: "路線別・時間帯別の混雑傾向",
    usage: "ピーク時間を避ける出発時刻や経路の提示"
  },
  {
    title: "鉄道の駅別乗降人員",
    data: "駅ごとの利用規模、時間帯別需要の推定に使う統計",
    usage: "利用者が集中しやすい駅や経路の負担補正"
  },
  {
    title: "公共交通オープンデータセンター",
    data: "駅、時刻表、運行情報、バスロケーション等",
    usage: "移動時間、待ち時間、遅延リスクの比較"
  },
  {
    title: "東京都・区市町村のイベント情報",
    data: "イベント開催日、会場、来場見込みに関する情報",
    usage: "周辺混雑や迂回候補の提示"
  },
  {
    title: "気象情報",
    data: "雨、暑さ、風などの移動負荷に関する情報",
    usage: "徒歩時間や乗り換え負担の補正"
  }
];
