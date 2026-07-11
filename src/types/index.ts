export type Step = "start" | "profile" | "wish" | "results" | "profile-review";

export type IncomeRange =
  | "300万円未満"
  | "300万〜500万円"
  | "500万〜700万円"
  | "700万〜1,000万円"
  | "1,000万円以上"
  | "回答しない";

export type FamilyStructure =
  | "ひとり暮らし"
  | "夫婦・パートナー"
  | "夫婦＋子ども"
  | "ひとり親＋子ども"
  | "親と同居"
  | "回答しない";

export type ChildAge = "未就学児" | "小学生" | "中高生" | "大学生以上";
export type TransportMode = "電車" | "バス" | "自動車" | "自転車" | "徒歩" | "タクシー";
export type ValuePriority = "時間" | "費用" | "快適さ" | "家族満足度";
export type AvoidanceLevel = "低め" | "普通" | "高め";

export type UserProfile = {
  residentArea: string;
  workArea: string;
  incomeRange: IncomeRange;
  familyStructure: FamilyStructure;
  childrenCount: number;
  childAges: ChildAge[];
  transportModes: TransportMode[];
  priorities: ValuePriority[];
  crowdAvoidance: AvoidanceLevel;
  timeValuePerHour: number;
};

export type Companion = "ひとり" | "パートナー" | "友人" | "子ども" | "家族";
export type WishPurpose = "食事" | "買い物" | "子どもと遊ぶ" | "観光・レジャー" | "仕事・作業" | "移動" | "その他";
export type AvailableTime = "1時間以内" | "2〜3時間" | "半日" | "1日";
export type BudgetRange = "できるだけ抑える" | "3,000円以内" | "5,000円以内" | "10,000円以内" | "予算を気にしない";
export type WishFocus = "時間" | "費用" | "快適さ" | "混雑回避" | "家族の満足度" | "バランス";

export type CurrentWish = {
  companion: Companion;
  purpose: WishPurpose;
  availableTime: AvailableTime;
  budget: BudgetRange;
  focus: WishFocus;
  startPoint: string;
  plannedDateTime: string;
};

export type CrowdLevel = "低" | "中" | "高";

export type CandidateOption = {
  id: string;
  name: string;
  area: string;
  categories: WishPurpose[];
  suitedFor: Companion[];
  summary: string;
  requiredMinutes: number;
  travelMinutes: number;
  expectedCost: number;
  crowdLevel: CrowdLevel;
  comfortScore: number;
  familySatisfaction: number;
  experienceValue: number;
  tags: string[];
  baseReason: string;
  difference: string;
  detail: string;
  dataNotes: string[];
};

export type ScoredCandidate = CandidateOption & {
  timeCost: number;
  crowdCost: number;
  fatigueCost: number;
  actualCost: number;
  roiScore: number;
  rank: number;
  reason: string;
  matchedSignals: string[];
};

export type TokyoContext = {
  weather: string;
  crowdTrend: string;
  transitStatus: string;
  eventInfo: string;
  facilityInfo: string;
  note: string;
};

export type OpenDataSource = {
  title: string;
  data: string;
  usage: string;
};
