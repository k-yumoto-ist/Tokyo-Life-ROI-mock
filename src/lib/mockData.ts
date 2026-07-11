import type { CandidateOption, CurrentWish, OpenDataSource, TokyoContext, UserProfile } from "../types";

export const profileStorageKey = "tokyo-life-roi-profile-v2";

export const demoProfile: UserProfile = {
  residentArea: "松戸",
  workArea: "東京23区",
  incomeRange: "700万〜1,000万円",
  familyStructure: "夫婦＋子ども",
  childrenCount: 2,
  childAges: ["未就学児"],
  transportModes: ["電車", "自動車"],
  priorities: ["時間", "家族満足度", "費用"],
  crowdAvoidance: "高め",
  timeValuePerHour: 3200
};

export const emptyProfile: UserProfile = {
  residentArea: "",
  workArea: "",
  incomeRange: "回答しない",
  familyStructure: "回答しない",
  childrenCount: 0,
  childAges: [],
  transportModes: ["電車"],
  priorities: ["時間", "快適さ", "費用"],
  crowdAvoidance: "普通",
  timeValuePerHour: 2200
};

export const demoWish: CurrentWish = {
  companion: "家族",
  purpose: "子どもと遊ぶ",
  availableTime: "半日",
  budget: "10,000円以内",
  focus: "混雑回避",
  startPoint: "松戸駅",
  plannedDateTime: "2026-07-11T13:00"
};

export const tokyoContext: TokyoContext = {
  weather: "土曜午後は晴れ時々くもり。屋外も選べるが、暑さ対策が必要です。",
  crowdTrend: "都心大型商業施設は混雑高め。東部・水辺エリアは比較的分散傾向です。",
  transitStatus: "JR・東京メトロは平常運行想定。主要駅の乗換混雑は15時台から増加。",
  eventInfo: "湾岸・上野周辺でイベントあり。周辺施設は待ち時間が伸びる可能性があります。",
  facilityInfo: "屋内施設は予約枠と営業時間を確認。公園・公共施設はデモデータで表示しています。",
  note: "現在はデモデータを使用しています。将来的に東京都オープンデータ、公共交通オープンデータ、気象情報などと連携します。"
};

export const candidateOptions: CandidateOption[] = [
  {
    id: "mizumoto-family-park",
    name: "水元公園で半日ピクニック",
    area: "葛飾区",
    categories: ["子どもと遊ぶ", "観光・レジャー"],
    suitedFor: ["家族", "子ども", "パートナー"],
    summary: "松戸から近く、広い園内で混雑を避けながら未就学児が遊びやすい候補。",
    requiredMinutes: 210,
    travelMinutes: 34,
    expectedCost: 3200,
    crowdLevel: "低",
    comfortScore: 86,
    familySatisfaction: 92,
    experienceValue: 90,
    tags: ["あなた向け1位", "混雑少なめ", "家族向け", "コスト重視"],
    baseReason: "移動時間が短く、混雑が少ないため、子ども2人連れでも親の負担を抑えやすい選択肢です。",
    difference: "都心施設より派手さは控えめですが、移動・費用・混雑のバランスが最も良い候補です。",
    detail: "広い公園で滞在時間を調整しやすく、帰宅判断もしやすい半日向けのデモ候補です。",
    dataNotes: ["天気: 晴れ時々くもり", "混雑: 低め想定", "料金: 入園無料想定"]
  },
  {
    id: "toy-museum-indoor",
    name: "東京おもちゃ美術館で屋内遊び",
    area: "新宿区",
    categories: ["子どもと遊ぶ", "観光・レジャー"],
    suitedFor: ["家族", "子ども"],
    summary: "屋内で快適に遊べ、天候の影響を受けにくい。予約・混雑確認が重要。",
    requiredMinutes: 190,
    travelMinutes: 54,
    expectedCost: 6200,
    crowdLevel: "中",
    comfortScore: 82,
    familySatisfaction: 95,
    experienceValue: 93,
    tags: ["家族向け", "快適さ◎", "雨でも安心"],
    baseReason: "費用と移動時間は増えますが、屋内で未就学児が満足しやすく、暑さや天気の不安を減らせます。",
    difference: "公園より費用は上がる一方、体験の密度と天候耐性が高い候補です。",
    detail: "未就学児向けの遊び場として満足度が高い想定のデモ候補です。実運用では空き枠や営業時間を参照します。",
    dataNotes: ["天気: 影響小", "混雑: 中程度想定", "料金: 家族4人の概算"]
  },
  {
    id: "odaiba-legoland",
    name: "お台場の屋内レジャー施設",
    area: "港区",
    categories: ["子どもと遊ぶ", "観光・レジャー", "買い物"],
    suitedFor: ["家族", "子ども", "友人"],
    summary: "満足度は高いが、移動時間・費用・周辺混雑が大きくなりやすい候補。",
    requiredMinutes: 260,
    travelMinutes: 78,
    expectedCost: 11800,
    crowdLevel: "高",
    comfortScore: 70,
    familySatisfaction: 96,
    experienceValue: 96,
    tags: ["満足度高め", "イベント感", "要混雑確認"],
    baseReason: "体験価値は高い一方で、今回の予算と混雑回避の希望では実質コストが上がります。",
    difference: "特別感は最も高い候補ですが、今回の条件ではROIが伸びにくい候補です。",
    detail: "休日午後の湾岸エリアは混雑を受けやすいため、ピーク回避や事前予約が重要なデモ候補です。",
    dataNotes: ["混雑: 高め想定", "交通: 乗換負担あり", "料金: 予算超過気味"]
  },
  {
    id: "kitasenju-lunch",
    name: "北千住で早めのランチと買い物",
    area: "足立区",
    categories: ["食事", "買い物"],
    suitedFor: ["ひとり", "パートナー", "友人", "家族"],
    summary: "移動しやすく、短時間でも食事と買い物をまとめられる生活圏寄りの候補。",
    requiredMinutes: 150,
    travelMinutes: 22,
    expectedCost: 4800,
    crowdLevel: "中",
    comfortScore: 78,
    familySatisfaction: 72,
    experienceValue: 75,
    tags: ["時間効率◎", "生活圏", "バランス"],
    baseReason: "短い移動で複数の用事をまとめられるため、時間効率を重視する時に向いています。",
    difference: "子どもの遊び目的では公園・屋内施設より満足度が下がりますが、食事や買い物ならROIが高くなります。",
    detail: "駅周辺で行動が完結しやすいデモ候補です。混雑時間を避けるとさらに快適になります。",
    dataNotes: ["交通: 良好", "混雑: 中程度", "料金: 調整しやすい"]
  },
  {
    id: "cowork-cafe",
    name: "上野周辺の静かなカフェ作業",
    area: "台東区",
    categories: ["仕事・作業", "食事"],
    suitedFor: ["ひとり", "友人"],
    summary: "作業時間を確保しつつ、移動と混雑を抑えるひとり向け候補。",
    requiredMinutes: 120,
    travelMinutes: 38,
    expectedCost: 1800,
    crowdLevel: "中",
    comfortScore: 80,
    familySatisfaction: 40,
    experienceValue: 72,
    tags: ["作業向け", "コスト重視", "短時間"],
    baseReason: "ひとりで作業する条件では費用が低く、移動も許容範囲のためROIが高くなります。",
    difference: "家族で過ごす目的には合いませんが、仕事・作業では実質コストを抑えやすい候補です。",
    detail: "電源・席の空き状況を将来的に参照する想定のデモ候補です。",
    dataNotes: ["施設: 空席はデモ想定", "費用: ドリンク・軽食想定", "混雑: 中程度"]
  },
  {
    id: "shifted-train-route",
    name: "出発をずらして混雑を避ける移動",
    area: "東京23区",
    categories: ["移動"],
    suitedFor: ["ひとり", "パートナー", "友人", "家族"],
    summary: "目的地は変えず、出発時間と経路を調整して混雑負担を下げる候補。",
    requiredMinutes: 60,
    travelMinutes: 42,
    expectedCost: 420,
    crowdLevel: "低",
    comfortScore: 88,
    familySatisfaction: 65,
    experienceValue: 68,
    tags: ["混雑少なめ", "時間効率◎", "移動向け"],
    baseReason: "移動目的では、少し出発をずらすだけで混雑負担を減らせるため、時間価値込みのROIが上がります。",
    difference: "行き先提案ではなく、同じ目的地へ向かう移動の質を上げる候補です。",
    detail: "公共交通オープンデータや混雑情報APIと接続しやすいデモ候補です。",
    dataNotes: ["交通: 平常運行想定", "混雑: 低め", "料金: 交通費のみ"]
  }
];

export const openDataSources: OpenDataSource[] = [
  {
    title: "東京都オープンデータカタログ",
    data: "公共施設、公園、子育て施設、トイレ、AED、避難所、公共無線LANなど",
    usage: "代替候補、子連れ負荷、安心度、公共資源活用の評価"
  },
  {
    title: "公共交通オープンデータセンター",
    data: "駅情報、時刻表、運行情報、バスロケーション等",
    usage: "移動時間、遅延、乗換負担、交通手段比較"
  },
  {
    title: "鉄道の駅別乗降人員",
    data: "駅別の利用規模、混雑しやすい時間帯の推定データ",
    usage: "混雑負担と行動分散の補正"
  },
  {
    title: "都営地下鉄の混雑に関する情報",
    data: "路線・時間帯ごとの混雑傾向",
    usage: "混雑回避提案と出発時刻調整"
  },
  {
    title: "東京都・区市町村のイベント情報",
    data: "イベント、施設、地域のお知らせ",
    usage: "周辺混雑、営業時間、代替候補の提示"
  },
  {
    title: "気象情報",
    data: "天気、気温、雨、風など",
    usage: "屋内外候補、徒歩負担、子連れ負荷の補正"
  }
];
