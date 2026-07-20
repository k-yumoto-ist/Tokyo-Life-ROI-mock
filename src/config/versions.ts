export const versions = {
  simple: {
    label: "1. シンプル提案型",
    description: "直感的に選んで、最適案をすぐ見る",
  },
  form: {
    label: "2. 条件入力型",
    description: "条件を指定して、複数候補を比較する",
  },
  chat: {
    label: "3. AI相談型",
    description: "自然文から条件を整理して提案する",
  },
  battle: {
    label: "4. AIバトル型",
    description: "3つの行動案を比較して、最適案を決める",
  },
  "city-contribution": {
    label: "5. 都市貢献",
    description: "あなたに良い選択を、東京の快適さにもつなげる",
  },
  visual: {
    label: "6. アイコン中心",
    description: "アイコンと数値で、今の選択を比べる",
  },
  trophy: {
    label: "7. トロフィー",
    description: "東京での選択を、実績として集める",
  },
  "diversity-roi": {
    label: "8. 多様性ROI版",
    description: "効率・満足・発見など、多様な価値から自分らしい選択をする統合最終候補",
  },
  "simple-experience": {
    label: "9. シンプル体験版",
    description: "今の気分と条件から、迷わず一つの過ごし方を決める",
  },
  "tokyo-recommendation": {
    label: "10. 東京おすすめスポット版",
    description: "あなたに合う選択肢に、東京にとって良い選択もプラス",
  },
  "quest-map": {
    label: "11. ROI Quest Map版",
    description: "今日の選択で、自分と東京の新しい可能性を解放する",
  },
  final: {
    label: "Final. 統合版",
    description: "選択と満足度を学び、使うほど自分向けに変わる",
  },
} as const;

export type VersionKey = keyof typeof versions;

export const defaultVersion: VersionKey = "simple";

export function normalizeVersion(value: string | null): VersionKey {
  if (value === "7") return "trophy";
  if (value === "8") return "diversity-roi";
  if (value === "9") return "simple-experience";
  if (value === "10") return "tokyo-recommendation";
  if (value === "11") return "quest-map";
  if (value === "form" || value === "chat" || value === "battle" || value === "city-contribution" || value === "visual" || value === "trophy" || value === "diversity-roi" || value === "simple-experience" || value === "tokyo-recommendation" || value === "quest-map" || value === "final" || value === "simple") {
    return value;
  }
  return defaultVersion;
}
