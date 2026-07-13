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
} as const;

export type VersionKey = keyof typeof versions;

export const defaultVersion: VersionKey = "simple";

export function normalizeVersion(value: string | null): VersionKey {
  if (value === "form" || value === "chat" || value === "simple") {
    return value;
  }
  return defaultVersion;
}
