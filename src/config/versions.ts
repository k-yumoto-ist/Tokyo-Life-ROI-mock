export const versions = {
  simple: {
    label: "シンプル提案型",
    description: "直感的に選んで、最適案をすぐ見る",
  },
  form: {
    label: "条件入力型",
    description: "条件を指定して、複数候補を比較する",
  },
  chat: {
    label: "AI相談型",
    description: "自然文から条件を整理して提案する",
  },
  battle: {
    label: "AIバトル型",
    description: "3つの行動案を比較して、最適案を決める",
  },
  "city-contribution": {
    label: "都市貢献",
    description: "あなたに良い選択を、東京の快適さにもつなげる",
  },
  visual: {
    label: "アイコン中心",
    description: "アイコンと数値で、今の選択を比べる",
  },
} as const;

export type VersionKey = keyof typeof versions;

export const defaultVersion: VersionKey = "simple";

export function normalizeVersion(value: string | null): VersionKey {
  if (value === "form" || value === "chat" || value === "battle" || value === "city-contribution" || value === "visual" || value === "simple") {
    return value;
  }
  return defaultVersion;
}
