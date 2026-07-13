export type VisualGoalId = "fast" | "save" | "easy" | "family" | "quiet" | "city";
export type VisualMoodId = "energetic" | "normal" | "tired" | "rush" | "kids" | "rain";

export type VisualPlan = {
  id: "quick" | "comfort" | "city";
  label: string;
  destination: string;
  time: string;
  cost: string;
  walk: string;
  crowd: 1 | 3 | 5;
  satisfaction: 1 | 2 | 3 | 4 | 5;
  contribution: number;
  accent: "blue" | "green" | "purple";
  route: Array<{ mode: "walk" | "train" | "bus"; value: string }>;
  result: {
    time: string;
    money: string;
    crowd: string;
    points: string;
    badge: string;
  };
};

export const visualPlans: VisualPlan[] = [
  {
    id: "quick",
    label: "最短",
    destination: "東京駅",
    time: "28分",
    cost: "¥620",
    walk: "4分",
    crowd: 5,
    satisfaction: 3,
    contribution: 24,
    accent: "blue",
    route: [
      { mode: "walk", value: "4分" },
      { mode: "train", value: "18分" },
      { mode: "walk", value: "6分" },
    ],
    result: { time: "+18分", money: "+¥620", crowd: "+1", points: "+8pt", badge: "速さ" },
  },
  {
    id: "comfort",
    label: "快適",
    destination: "清澄白河",
    time: "38分",
    cost: "¥760",
    walk: "3分",
    crowd: 1,
    satisfaction: 5,
    contribution: 65,
    accent: "green",
    route: [
      { mode: "walk", value: "3分" },
      { mode: "train", value: "29分" },
      { mode: "walk", value: "6分" },
    ],
    result: { time: "+12分", money: "+¥380", crowd: "+3", points: "+18pt", badge: "空き" },
  },
  {
    id: "city",
    label: "貢献",
    destination: "中央区立スポーツセンター",
    time: "42分",
    cost: "¥540",
    walk: "9分",
    crowd: 1,
    satisfaction: 4,
    contribution: 92,
    accent: "purple",
    route: [
      { mode: "walk", value: "5分" },
      { mode: "bus", value: "28分" },
      { mode: "walk", value: "9分" },
    ],
    result: { time: "+10分", money: "+¥460", crowd: "+4", points: "+30pt", badge: "公共" },
  },
];
