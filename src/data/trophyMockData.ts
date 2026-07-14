export type TrophyRank = "bronze" | "silver" | "gold" | "platinum";
export type TrophyCategory = "time" | "saving" | "comfort" | "family" | "discovery" | "local" | "congestion" | "public";
export type TrophyIcon = "clock" | "building" | "spark" | "store" | "users" | "route" | "rain" | "city" | "crown" | "leaf";
export type TrophyDemo = "locked" | "almost" | "unlocked" | "platinum";

export type TrophyDefinition = {
  id: string;
  name: string;
  description: string;
  rank: TrophyRank;
  category: TrophyCategory;
  icon: TrophyIcon;
  isHidden?: boolean;
  target: number;
  hint?: string;
  requires?: string[];
};

export type TrophyProgress = {
  progress: number;
  unlockedAt?: string;
};

export type TrophyState = {
  progress: Record<string, TrophyProgress>;
  lastUnlockedId: string | null;
  lastAction: string | null;
  viewedTrophyIds: string[];
  visitedPublicFacilities: string[];
};

export type TrophyActionPlan = {
  id: string;
  title: string;
  subtitle: string;
  kind: "route" | "public" | "local";
  duration: string;
  cost: string;
  crowd: "low" | "medium" | "high";
  satisfaction: number;
  contribution: number;
  trophyHint: string;
  savedMinutes: number;
  savedYen: number;
  actionTrophies: string[];
  publicFacilityId?: string;
};

export const trophyStorageKey = "tokyo-life-roi-trophy-state-v1";

export const trophyDefinitions: TrophyDefinition[] = [
  { id: "peak-shifter", name: "ピークシフター", description: "混雑する時間を避け、快適な移動を選びました", rank: "bronze", category: "congestion", icon: "clock", target: 1 },
  { id: "public-facility", name: "はじめての公共施設", description: "東京の公共資産を新しく活用しました", rank: "bronze", category: "public", icon: "building", target: 1 },
  { id: "time-alchemist", name: "15分の錬金術師", description: "移動や待ち時間を減らし、自分の時間を増やしました", rank: "bronze", category: "time", icon: "spark", target: 1 },
  { id: "local-supporter", name: "ローカルサポーター", description: "地域に根ざした選択をしました", rank: "bronze", category: "local", icon: "store", target: 1 },
  { id: "crowd-avoider", name: "混雑回避の達人", description: "混雑を避ける選択が習慣になってきました", rank: "silver", category: "congestion", icon: "clock", target: 5 },
  { id: "public-hunter", name: "公共施設ハンター", description: "東京のまだ知らない公共施設を発見しました", rank: "silver", category: "public", icon: "building", target: 3 },
  { id: "family-creator", name: "家族時間クリエイター", description: "家族にとって快適な時間をつくりました", rank: "silver", category: "family", icon: "users", target: 3 },
  { id: "back-route", name: "東京の裏ルート発見者", description: "いつもの東京とは違う景色を発見しました", rank: "gold", category: "discovery", icon: "route", target: 3 },
  { id: "city-balancer", name: "都市バランサー", description: "自分の利益と都市の利益を両立しました", rank: "gold", category: "comfort", icon: "city", target: 1, requires: ["peak-shifter", "public-facility", "local-supporter"] },
  { id: "rain-tokyo", name: "雨の東京を味方につけた", description: "天候に左右されず、東京を快適に使いこなしました", rank: "gold", category: "comfort", icon: "rain", target: 1, isHidden: true, hint: "雨の日の東京には、いつもと違う攻略法があるようです" },
  { id: "eco-step", name: "エコステップ", description: "徒歩と公共交通を組み合わせて移動しました", rank: "bronze", category: "saving", icon: "leaf", target: 1 },
  { id: "tokyo-life-master", name: "TOKYO LIFE MASTER", description: "東京での多様な選択を、自分らしく使いこなしました", rank: "platinum", category: "discovery", icon: "crown", target: 1, requires: ["city-balancer", "back-route", "rain-tokyo"] },
];

export const trophyActionPlans: TrophyActionPlan[] = [
  {
    id: "peak-shift-route",
    title: "混雑を避けて移動",
    subtitle: "東京駅 → 大手町",
    kind: "route",
    duration: "41分",
    cost: "¥520",
    crowd: "low",
    satisfaction: 4.5,
    contribution: 76,
    trophyHint: "解除チャンス",
    savedMinutes: 18,
    savedYen: 420,
    actionTrophies: ["peak-shifter", "crowd-avoider", "time-alchemist", "eco-step"],
  },
  {
    id: "public-facility-stop",
    title: "公共施設に立ち寄る",
    subtitle: "中央区立スポーツセンター",
    kind: "public",
    duration: "55分",
    cost: "¥430",
    crowd: "low",
    satisfaction: 4.2,
    contribution: 88,
    trophyHint: "あと1回",
    savedMinutes: 9,
    savedYen: 280,
    actionTrophies: ["public-facility", "crowd-avoider", "family-creator", "eco-step"],
    publicFacilityId: "chuo-sports",
  },
  {
    id: "local-discovery",
    title: "地域の店を選ぶ",
    subtitle: "清澄白河・小さな商店街",
    kind: "local",
    duration: "48分",
    cost: "¥690",
    crowd: "medium",
    satisfaction: 4.4,
    contribution: 71,
    trophyHint: "発見チャンス",
    savedMinutes: 11,
    savedYen: 360,
    actionTrophies: ["local-supporter", "back-route", "family-creator"],
  },
];

function emptyState(): TrophyState {
  return {
    progress: Object.fromEntries(trophyDefinitions.map((trophy) => [trophy.id, { progress: 0 }])),
    lastUnlockedId: null,
    lastAction: null,
    viewedTrophyIds: [],
    visitedPublicFacilities: [],
  };
}

function unlock(state: TrophyState, id: string, date = "2026/07/14") {
  const trophy = trophyDefinitions.find((item) => item.id === id);
  if (!trophy || state.progress[id]?.unlockedAt) return false;
  state.progress[id] = { progress: trophy.target, unlockedAt: date };
  state.lastUnlockedId = id;
  return true;
}

function seedUnlocked(state: TrophyState, ids: string[]) {
  ids.forEach((id) => unlock(state, id, "2026/07/08"));
  state.lastUnlockedId = null;
}

export function createTrophyDemoState(demo: TrophyDemo = "almost"): TrophyState {
  const state = emptyState();
  if (demo === "almost") {
    seedUnlocked(state, ["public-facility", "time-alchemist", "local-supporter"]);
    state.progress["crowd-avoider"].progress = 4;
    state.progress["public-hunter"].progress = 2;
    state.visitedPublicFacilities = ["chuo-sports", "koto-library"];
  }
  if (demo === "unlocked") {
    seedUnlocked(state, ["peak-shifter", "public-facility", "time-alchemist", "local-supporter", "eco-step"]);
    state.progress["crowd-avoider"].progress = 4;
    state.progress["public-hunter"].progress = 2;
  }
  if (demo === "platinum") {
    seedUnlocked(state, trophyDefinitions.map((trophy) => trophy.id));
    state.visitedPublicFacilities = ["chuo-sports", "koto-library", "edogawa-center"];
  }
  return state;
}

export function readTrophyState(demo?: TrophyDemo): TrophyState {
  try {
    const storage = demo ? window.sessionStorage : window.localStorage;
    const raw = storage.getItem(demo ? `${trophyStorageKey}:${demo}` : trophyStorageKey);
    if (!raw) return createTrophyDemoState(demo ?? "almost");
    const parsed = JSON.parse(raw) as Partial<TrophyState>;
    const base = createTrophyDemoState(demo ?? "almost");
    return {
      ...base,
      ...parsed,
      progress: { ...base.progress, ...parsed.progress },
      viewedTrophyIds: parsed.viewedTrophyIds ?? [],
    visitedPublicFacilities: parsed.visitedPublicFacilities ?? [],
    lastAction: parsed.lastAction ?? null,
    };
  } catch {
    return createTrophyDemoState(demo ?? "almost");
  }
}

export function saveTrophyState(state: TrophyState) {
  window.localStorage.setItem(trophyStorageKey, JSON.stringify(state));
}

export function saveTrophyDemoState(state: TrophyState, demo?: TrophyDemo) {
  if (demo) {
    window.sessionStorage.setItem(`${trophyStorageKey}:${demo}`, JSON.stringify(state));
    return;
  }
  saveTrophyState(state);
}

function evaluateCompositeTrophies(state: TrophyState, unlockedIds: string[]) {
  trophyDefinitions.forEach((trophy) => {
    if (!trophy.requires?.length || trophy.requires.some((id) => !state.progress[id]?.unlockedAt)) return;
    if (unlock(state, trophy.id)) unlockedIds.push(trophy.id);
  });
}

export function applyTrophyAction(previous: TrophyState, plan: TrophyActionPlan) {
  const state: TrophyState = {
    ...previous,
    progress: Object.fromEntries(Object.entries(previous.progress).map(([id, entry]) => [id, { ...entry }])),
    visitedPublicFacilities: [...previous.visitedPublicFacilities],
  };
  const unlockedIds: string[] = [];
  state.lastAction = plan.title;

  plan.actionTrophies.forEach((id) => {
    const trophy = trophyDefinitions.find((item) => item.id === id);
    const entry = state.progress[id] ?? { progress: 0 };
    if (!trophy || entry.unlockedAt) return;
    entry.progress = Math.min(trophy.target, entry.progress + 1);
    state.progress[id] = entry;
    if (entry.progress >= trophy.target && unlock(state, id)) unlockedIds.push(id);
  });

  if (plan.publicFacilityId && !state.visitedPublicFacilities.includes(plan.publicFacilityId)) {
    state.visitedPublicFacilities.push(plan.publicFacilityId);
    const hunter = trophyDefinitions.find((item) => item.id === "public-hunter");
    const entry = state.progress["public-hunter"];
    if (hunter && entry && !entry.unlockedAt) {
      entry.progress = Math.min(hunter.target, state.visitedPublicFacilities.length);
      if (entry.progress >= hunter.target && unlock(state, "public-hunter")) unlockedIds.push("public-hunter");
    }
  }

  evaluateCompositeTrophies(state, unlockedIds);
  return { state, unlockedIds };
}

export function getTrophy(trophyId: string) {
  return trophyDefinitions.find((trophy) => trophy.id === trophyId) ?? null;
}

export function getTrophyStats(state: TrophyState) {
  const unlocked = trophyDefinitions.filter((trophy) => Boolean(state.progress[trophy.id]?.unlockedAt));
  const percent = Math.round((unlocked.length / trophyDefinitions.length) * 100);
  const rank: TrophyRank = unlocked.some((trophy) => trophy.rank === "platinum") ? "platinum" : unlocked.filter((trophy) => trophy.rank === "gold").length >= 2 ? "gold" : unlocked.length >= 4 ? "silver" : "bronze";
  return { unlocked: unlocked.length, total: trophyDefinitions.length, percent, rank };
}

export function getTrophyDemoFromUrl(): TrophyDemo | undefined {
  const demo = new URLSearchParams(window.location.search).get("demo");
  return demo === "locked" || demo === "almost" || demo === "unlocked" || demo === "platinum" ? demo : undefined;
}

export function updateTrophyDemoInUrl(demo: TrophyDemo) {
  const url = new URL(window.location.href);
  url.searchParams.set("version", "trophy");
  url.searchParams.set("demo", demo);
  window.location.assign(`${url.pathname}?${url.searchParams.toString()}`);
}
