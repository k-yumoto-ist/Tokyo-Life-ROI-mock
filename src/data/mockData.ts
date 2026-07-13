export type RoiCandidate = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  cost: string;
  crowd: string;
  satisfaction?: string;
  roi: number;
  reason: string;
  tag: string;
};

export const personalSummary = "時間価値 3,200円/h・家族4人・電車中心";

export const simpleGoals = [
  "ゆっくりしたい",
  "家族で楽しみたい",
  "短時間で済ませたい",
  "お得に過ごしたい",
  "混雑を避けたい"
];

export const simpleRecommendations: Record<string, { main: RoiCandidate; alternatives: RoiCandidate[] }> = {
  "ゆっくりしたい": {
    main: {
      id: "relax-cafe",
      title: "静かなカフェで90分休む",
      subtitle: "日本橋の穴場カフェ",
      time: "22分",
      cost: "1,800円",
      crowd: "低め",
      satisfaction: "4.4",
      roi: 88,
      tag: "休息優先",
      reason: "移動が短く、混雑も少ないため、短時間で気分転換できます。"
    },
    alternatives: [
      {
        id: "spa",
        title: "温浴施設でリセット",
        subtitle: "少し遠いが満足度高め",
        time: "38分",
        cost: "2,600円",
        crowd: "普通",
        satisfaction: "4.2",
        roi: 80,
        tag: "快適",
        reason: "滞在満足度は高い一方、移動時間が増えます。"
      },
      {
        id: "library",
        title: "図書館で静かに過ごす",
        subtitle: "無料で落ち着ける",
        time: "18分",
        cost: "0円",
        crowd: "低め",
        satisfaction: "3.9",
        roi: 79,
        tag: "無料",
        reason: "費用は抑えられますが、体験の特別感は控えめです。"
      }
    ]
  },
  "家族で楽しみたい": {
    main: {
      id: "science",
      title: "屋内施設で子どもと遊ぶ",
      subtitle: "葛飾区科学教育センター 未来わくわく館",
      time: "25分",
      cost: "3,200円",
      crowd: "比較的空いている",
      satisfaction: "4.6",
      roi: 91,
      tag: "家族向け",
      reason: "雨や暑さを避けながら、子どもの満足度と移動負担のバランスが高いです。"
    },
    alternatives: [
      {
        id: "park",
        title: "近隣の大型公園",
        subtitle: "費用を抑えて遊ぶ",
        time: "18分",
        cost: "500円",
        crowd: "普通",
        satisfaction: "4.0",
        roi: 82,
        tag: "節約",
        reason: "安く楽しめますが、天候の影響を受けます。"
      },
      {
        id: "mall",
        title: "商業施設＋カフェ",
        subtitle: "屋内で過ごしやすい",
        time: "30分",
        cost: "4,500円",
        crowd: "やや混雑",
        satisfaction: "4.1",
        roi: 76,
        tag: "屋内",
        reason: "便利ですが、費用と混雑が少し上がります。"
      }
    ]
  },
  "短時間で済ませたい": {
    main: {
      id: "quick-errand",
      title: "駅近で用事をまとめて済ませる",
      subtitle: "移動少なめの短時間プラン",
      time: "45分",
      cost: "980円",
      crowd: "普通",
      satisfaction: "4.2",
      roi: 87,
      tag: "時短",
      reason: "移動と待ち時間が短く、今日の時間価値では最も効率が高い選択です。"
    },
    alternatives: [
      {
        id: "quick-train",
        title: "電車で最短移動",
        subtitle: "乗換1回で到着",
        time: "32分",
        cost: "520円",
        crowd: "やや混雑",
        satisfaction: "3.9",
        roi: 81,
        tag: "最短",
        reason: "早い一方で、混雑負担が少しあります。"
      },
      {
        id: "nearby-shop",
        title: "近場で代替する",
        subtitle: "徒歩圏で完結",
        time: "28分",
        cost: "1,200円",
        crowd: "低め",
        satisfaction: "3.8",
        roi: 78,
        tag: "近場",
        reason: "移動は短いですが、選択肢はやや限られます。"
      }
    ]
  },
  "お得に過ごしたい": {
    main: {
      id: "public-free",
      title: "公共施設と公園を組み合わせる",
      subtitle: "図書館＋近隣公園",
      time: "18分",
      cost: "300円",
      crowd: "低め",
      satisfaction: "4.0",
      roi: 86,
      tag: "節約",
      reason: "費用を抑えながら、移動負担と混雑も小さくできます。"
    },
    alternatives: [
      {
        id: "park",
        title: "近隣の大型公園",
        subtitle: "無料中心で楽しむ",
        time: "18分",
        cost: "500円",
        crowd: "普通",
        satisfaction: "4.0",
        roi: 82,
        tag: "無料",
        reason: "安く楽しめますが、天候の影響を受けます。"
      },
      {
        id: "community-center",
        title: "地域の公共施設",
        subtitle: "混雑少なめ",
        time: "20分",
        cost: "1,000円",
        crowd: "空いている",
        satisfaction: "3.8",
        roi: 79,
        tag: "公共",
        reason: "安定して空いていますが、体験の幅は控えめです。"
      }
    ]
  },
  "混雑を避けたい": {
    main: {
      id: "quiet-public",
      title: "空いている地域施設へ行く",
      subtitle: "ピークを避けた近場プラン",
      time: "20分",
      cost: "1,000円",
      crowd: "空いている",
      satisfaction: "4.1",
      roi: 89,
      tag: "混雑回避",
      reason: "混雑が少なく、家族連れでも疲れにくい候補です。"
    },
    alternatives: [
      {
        id: "early-museum",
        title: "早めの時間にミュージアム",
        subtitle: "午前帯で混雑回避",
        time: "34分",
        cost: "2,400円",
        crowd: "低め",
        satisfaction: "4.2",
        roi: 83,
        tag: "時間ずらし",
        reason: "混雑は避けやすいですが、移動時間が少し増えます。"
      },
      {
        id: "quiet-cafe",
        title: "穴場カフェで休む",
        subtitle: "静かな屋内",
        time: "22分",
        cost: "1,800円",
        crowd: "低め",
        satisfaction: "4.0",
        roi: 80,
        tag: "静か",
        reason: "ゆっくりできますが、子ども向け要素は少なめです。"
      }
    ]
  }
};

export const fallbackSimpleKey = "家族で楽しみたい";

export const formCandidates: RoiCandidate[] = [
  {
    id: "train-walk",
    title: "電車＋徒歩",
    subtitle: "バランス重視の移動",
    time: "42分",
    cost: "520円",
    crowd: "やや混雑",
    satisfaction: "4.3",
    roi: 86,
    tag: "おすすめ",
    reason: "時間価値、交通費、混雑傾向のバランスが最も高い候補です。"
  },
  {
    id: "taxi",
    title: "タクシー",
    subtitle: "疲れにくい移動",
    time: "35分",
    cost: "6,200円",
    crowd: "低め",
    satisfaction: "4.0",
    roi: 72,
    tag: "快適",
    reason: "徒歩負担は小さいですが、費用が大きく上がります。"
  },
  {
    id: "bus-walk",
    title: "バス＋徒歩",
    subtitle: "費用を抑える移動",
    time: "55分",
    cost: "280円",
    crowd: "普通",
    satisfaction: "3.8",
    roi: 64,
    tag: "節約",
    reason: "費用は低い一方、徒歩と所要時間が増えます。"
  }
];

export const chatExamples = [
  "今日は子どもと外出したい。夕方までには帰りたい。なるべく混んでいない場所がいい",
  "仕事帰りに短時間で気分転換したい。高すぎる場所は避けたい",
  "雨でも行けて、家族で楽しめる場所を探したい"
];

export const chatConditionChips = ["家族", "子ども連れ", "夕方まで", "混雑回避", "外出"];

export const chatCandidates: RoiCandidate[] = [
  simpleRecommendations["家族で楽しみたい"].main,
  formCandidates[0],
  simpleRecommendations["家族で楽しみたい"].alternatives[0]
];
