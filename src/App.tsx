import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Home,
  Map,
  RotateCcw,
  Save,
  Sparkles,
  TrainFront,
  Users,
} from "lucide-react";
import { Header } from "./components/common/Header";
import { BottomNavigation } from "./components/common/BottomNavigation";
import { SimpleVersion } from "./components/versions/SimpleVersion";
import { FormVersion } from "./components/versions/FormVersion";
import { ChatVersion } from "./components/versions/ChatVersion";
import { BattleVersion } from "./components/versions/BattleVersion";
import { CityContributionVersion } from "./components/versions/CityContributionVersion";
import { VisualHistory, VisualVersion } from "./components/versions/VisualVersion";
import { TrophyCollection, TrophyVersion } from "./components/versions/TrophyVersion";
import { DiversityRoiMyPage, DiversityRoiVersion } from "./components/versions/DiversityRoiVersion";
import { SimpleExperienceMyRoi, SimpleExperienceVersion } from "./components/versions/SimpleExperienceVersion";
import { TokyoRecommendationMyRoi, TokyoRecommendationVersion } from "./components/versions/TokyoRecommendationVersion";
import { normalizeVersion, versions, type VersionKey } from "./config/versions";
import type { RoiCandidate } from "./data/mockData";
import { battleHistoryStorageKey, type BattleHistory } from "./data/battleMockData";

type PrimaryTab = "home" | "roi" | "settings";
type AppView = PrimaryTab | "choice" | "reflect";
type Satisfaction = "great" | "good" | "ok" | "bad";
type HourlyMode = "auto" | "manual";
type ProfileState = {
  homeArea: string;
  activityArea: string;
  incomeBand: string;
  workStyle: string;
  hourlyMode: HourlyMode;
  manualHourlyValue: number;
  family: string;
  children: number;
  childAge: string;
  transportModes: string[];
  priorities: string[];
};

const incomeBands = ["300万円未満", "300〜500万円", "500〜700万円", "700〜1,000万円", "1,000万円以上", "回答しない"];
const workStyles = ["標準的", "多忙", "自由時間少なめ"];
const familyOptions = ["一人暮らし", "パートナーと二人", "子どもあり", "親との同居", "その他"];
const childAgeOptions = ["未就学児", "小学生", "中高生"];
const transportOptions = ["電車", "バス", "自動車", "自転車", "徒歩"];
const priorityOptions = ["時間を短縮したい", "費用を抑えたい", "混雑を避けたい", "快適に過ごしたい", "家族で動きやすくしたい", "健康的に行動したい"];
const feedbackTags = ["早かった", "安かった", "空いていた", "子どもが楽しめた", "疲れなかった", "また使いたい"];
const profileStorageKey = "tokyo-life-roi-profile";
const versionStorageKey = "tokyo-life-roi-prototype-version";
const defaultProfile: ProfileState = {
  homeArea: "千葉県松戸市",
  activityArea: "東京都千代田区・中央区",
  incomeBand: "700〜1,000万円",
  workStyle: "標準的",
  hourlyMode: "auto",
  manualHourlyValue: 3500,
  family: "子どもあり",
  children: 2,
  childAge: "未就学児",
  transportModes: ["電車", "自動車", "徒歩"],
  priorities: ["時間を短縮したい", "混雑を避けたい", "家族で動きやすくしたい"],
};

function readVersionFromUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const versionFromUrl = searchParams.get("version") ?? searchParams.get("pattern") ?? searchParams.get("mode");
  if (versionFromUrl) return normalizeVersion(versionFromUrl);
  try {
    return normalizeVersion(window.localStorage.getItem(versionStorageKey));
  } catch {
    return normalizeVersion(null);
  }
}

function readBattleHistory(): BattleHistory | null {
  try {
    const raw = window.localStorage.getItem(battleHistoryStorageKey);
    return raw ? JSON.parse(raw) as BattleHistory : null;
  } catch {
    return null;
  }
}

function readProfile(): ProfileState {
  try {
    const raw = window.localStorage.getItem(profileStorageKey);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw) as Partial<ProfileState>;
    return { ...defaultProfile, ...parsed };
  } catch {
    return defaultProfile;
  }
}

function saveProfile(profile: ProfileState) {
  window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
}

function estimateHourlyValue(incomeBand: string, workStyle: string) {
  const base = {
    "300万円未満": 1600,
    "300〜500万円": 2200,
    "500〜700万円": 2800,
    "700〜1,000万円": 3200,
    "1,000万円以上": 4500,
    回答しない: 2600,
  }[incomeBand] ?? 2600;
  const multiplier = workStyle === "多忙" ? 1.15 : workStyle === "自由時間少なめ" ? 1.25 : 1;
  return Math.round((base * multiplier) / 100) * 100;
}

export default function App() {
  const [version, setVersion] = useState<VersionKey>(() => readVersionFromUrl());
  const [view, setView] = useState<AppView>("home");
  const [selectedCandidate, setSelectedCandidate] = useState<RoiCandidate | null>(null);
  const [battleHistory, setBattleHistory] = useState<BattleHistory | null>(() => readBattleHistory());
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onPopState = () => {
      setVersion(readVersionFromUrl());
      setView("home");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function changeVersion(nextVersion: VersionKey) {
    const url = new URL(window.location.href);
    url.searchParams.set("version", nextVersion);
    url.searchParams.delete("pattern");
    url.searchParams.delete("mode");
    window.history.pushState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
    window.localStorage.setItem(versionStorageKey, nextVersion);
    setVersion(nextVersion);
    setView("home");
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1700);
  }

  function handleSelect(candidate: RoiCandidate) {
    setSelectedCandidate(candidate);
    setView("choice");
  }

  function handleBattleComplete(history: BattleHistory) {
    window.localStorage.setItem(battleHistoryStorageKey, JSON.stringify(history));
    setBattleHistory(history);
  }

  const navActive: PrimaryTab = view === "settings" ? "settings" : view === "roi" || view === "reflect" ? "roi" : "home";

  return (
    <div className="min-h-[100dvh] bg-[#edf7ff] text-ink">
      <main className="app-shell">
        <div className="phone-surface">
          <section className="screen-content home-hero prototype-screen">
            <Header version={version} onVersionChange={changeVersion} onSettings={() => setView("settings")} />
            {view === "home" && version === "simple" && <SimpleVersion onSelect={handleSelect} onSettings={() => setView("settings")} />}
            {view === "home" && version === "form" && <FormVersion onSelect={handleSelect} />}
            {view === "home" && version === "chat" && <ChatVersion onSelect={handleSelect} />}
            {view === "home" && version === "battle" && <BattleVersion onComplete={handleBattleComplete} onMyRoi={() => setView("roi")} />}
            {view === "home" && version === "city-contribution" && <CityContributionVersion />}
            {view === "home" && version === "visual" && <VisualVersion />}
            {view === "home" && version === "trophy" && <TrophyVersion onCollection={() => setView("roi")} />}
            {view === "home" && version === "diversity-roi" && <DiversityRoiVersion onMyRoi={() => setView("roi")} />}
            {view === "home" && version === "simple-experience" && <SimpleExperienceVersion onMyRoi={() => setView("roi")} />}
            {view === "home" && version === "tokyo-recommendation" && <TokyoRecommendationVersion onMyRoi={() => setView("roi")} />}
            {view === "choice" && selectedCandidate && (
              <ChoicePanel
                candidate={selectedCandidate}
                onBack={() => setView("home")}
                onOpenRoute={() => showToast("経路を開く準備をしました")}
                onAddSchedule={() => showToast("予定に追加しました")}
                onReflect={() => setView("reflect")}
                onHome={() => setView("home")}
              />
            )}
            {view === "roi" && version === "visual" && <VisualHistory />}
            {view === "roi" && version === "trophy" && <TrophyCollection />}
            {view === "roi" && version === "diversity-roi" && <DiversityRoiMyPage />}
            {view === "roi" && version === "simple-experience" && <SimpleExperienceMyRoi />}
            {view === "roi" && version === "tokyo-recommendation" && <TokyoRecommendationMyRoi />}
            {view === "roi" && version !== "visual" && version !== "trophy" && version !== "diversity-roi" && version !== "simple-experience" && version !== "tokyo-recommendation" && <MyRoiPanel onReflect={() => setView("reflect")} selectedCandidate={selectedCandidate} battleHistory={battleHistory} />}
            {view === "reflect" && (
              <ReflectPanel
                candidate={selectedCandidate}
                onBack={() => setView(selectedCandidate ? "choice" : "roi")}
                onSave={() => {
                  showToast("振り返りを保存しました");
                  setView("roi");
                }}
              />
            )}
            {view === "settings" && (
              <SettingsPanel
                currentVersion={version}
                onSaved={() => {
                  showToast("個人設定を更新しました");
                  setView("home");
                }}
                onCancel={() => setView("home")}
              />
            )}
            {toast && (
              <div className="toast-message" role="status" aria-live="polite">
                {toast}
              </div>
            )}
          </section>
          <BottomNavigation active={navActive} onChange={(nextView) => setView(nextView)} />
        </div>
      </main>
    </div>
  );
}

function ChoicePanel({
  candidate,
  onBack,
  onOpenRoute,
  onAddSchedule,
  onReflect,
  onHome,
}: {
  candidate: RoiCandidate;
  onBack: () => void;
  onOpenRoute: () => void;
  onAddSchedule: () => void;
  onReflect: () => void;
  onHome: () => void;
}) {
  return (
    <section className="version-panel choice-flow-panel">
      <button className="mini-link-button flow-back" onClick={onBack}>
        <ChevronLeft size={16} />
        提案に戻る
      </button>
      <article className="choice-card">
        <CheckCircle2 size={42} />
        <h1>{candidate.title}を選びました</h1>
        <p>{candidate.tag}・{candidate.time}・{candidate.cost}・混雑 {candidate.crowd}</p>
        <div className="prototype-metrics">
          <div>
            <span><Clock3 size={14} />時間</span>
            <strong>{candidate.time}</strong>
          </div>
          <div>
            <span><Users size={14} />満足度</span>
            <strong>{candidate.satisfaction ?? "4.2"}</strong>
          </div>
          <div>
            <span><Sparkles size={14} />ROI</span>
            <strong>{candidate.roi}</strong>
          </div>
        </div>
        <p className="choice-note">この選択はあとで振り返りできます。結果を残すほど、次回のおすすめがあなた向けになります。</p>
        <div className="choice-actions">
          <button className="primary-button action-wide" onClick={onOpenRoute}>
            <Map size={18} />
            経路を開く
          </button>
          <button className="secondary-button action-wide" onClick={onAddSchedule}>
            <CalendarPlus size={18} />
            予定に追加
          </button>
          <button className="secondary-button action-wide" onClick={onReflect}>
            振り返る
          </button>
          <button className="mini-link-button full" onClick={onHome}>
            ホームに戻る
          </button>
        </div>
      </article>
    </section>
  );
}

function ReflectPanel({ candidate, onBack, onSave }: { candidate: RoiCandidate | null; onBack: () => void; onSave: () => void }) {
  const [satisfaction, setSatisfaction] = useState<Satisfaction>("great");
  const [selectedTags, setSelectedTags] = useState(["早かった", "空いていた"]);

  function toggleTag(tag: string) {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  return (
    <section className="version-panel">
      <button className="mini-link-button flow-back" onClick={onBack}>
        <ChevronLeft size={16} />
        戻る
      </button>
      <article className="quick-reflect-card flow-reflect-card">
        <div>
          <h2>今回の選択はどうでしたか？</h2>
          <p>{candidate ? `${candidate.title} の振り返り` : "最近の選択を振り返ります"}</p>
        </div>
        <Sparkles size={26} />
      </article>
      <div className="satisfaction-grid compact-satisfaction">
        {[
          ["great", "😊", "とても良い"],
          ["good", "🙂", "良かった"],
          ["ok", "😐", "普通"],
          ["bad", "😟", "いまいち"],
        ].map(([value, face, label]) => (
          <button
            key={value}
            className={`satisfaction-button satisfaction-${value} ${satisfaction === value ? "is-active" : ""}`}
            onClick={() => setSatisfaction(value as Satisfaction)}
            aria-pressed={satisfaction === value}
          >
            <span className="face-mark">{face}</span>
            {label}
          </button>
        ))}
      </div>
      <article className="summary-card">
        <p>何が良かったですか？</p>
        <div className="feedback-tags">
          {feedbackTags.map((tag) => (
            <button key={tag} className={`feedback-tag ${selectedTags.includes(tag) ? "is-active" : ""}`} onClick={() => toggleTag(tag)} aria-pressed={selectedTags.includes(tag)}>
              {selectedTags.includes(tag) && <CheckCircle2 size={14} />}
              {tag}
            </button>
          ))}
        </div>
        <button className="primary-button action-wide" onClick={onSave}>
          <Save size={18} />
          振り返りを保存
        </button>
      </article>
    </section>
  );
}

function MyRoiPanel({
  onReflect,
  selectedCandidate,
  battleHistory,
}: {
  onReflect: () => void;
  selectedCandidate: RoiCandidate | null;
  battleHistory: BattleHistory | null;
}) {
  return (
    <section className="version-panel">
      <h2 className="version-title">My ROI</h2>
      <article className="summary-card">
        <p>今月の成果</p>
        <div className="summary-grid">
          <strong>101分<span>時間短縮</span></strong>
          <strong>4,220円<span>節約額</span></strong>
          <strong>4.2<span>平均満足度</span></strong>
          <strong>7回<span>混雑回避</span></strong>
        </div>
        <p className="points-line">13回の選択をサポート。振り返りが次回の提案に反映されます。</p>
      </article>
      <article className="insight-mini">
        <h3>平日は時間重視</h3>
        <p>安さより時短を選ぶと満足度が高い傾向があります。</p>
      </article>
      <article className="insight-mini">
        <h3>混雑が少ない選択が好相性</h3>
        <p>空いている候補を選んだ日は、平均満足度が0.8高くなっています。</p>
      </article>
      {battleHistory && (
        <article className="battle-history-card">
          <span>前回のAIバトル</span>
          <h3>{battleHistory.selectedPlanTitle}</h3>
          <p>AIおすすめ: {battleHistory.recommendedPlanTitle}</p>
          <div>
            <strong>{battleHistory.savedMinutes}分<span>獲得時間</span></strong>
            <strong>¥{battleHistory.estimatedSavings.toLocaleString("ja-JP")}<span>節約見込み</span></strong>
            <strong>{battleHistory.roi}<span>ROI</span></strong>
          </div>
          <small>満足度 {battleHistory.satisfaction} / 100 ・ 今月は先月より300 ROIポイント改善</small>
        </article>
      )}
      <article className="recent-list-card">
        <h2>最近の選択</h2>
        <button className="recent-row" onClick={onReflect}>
          <span>今日</span>
          <strong>{selectedCandidate?.title ?? "朝の移動をスマートに"}</strong>
          <small>7分短縮・混雑低め・満足度4.5</small>
        </button>
        <button className="recent-row" onClick={onReflect}>
          <span>7/12</span>
          <strong>家族で屋内施設へ</strong>
          <small>雨を回避・子ども満足度高め</small>
        </button>
      </article>
    </section>
  );
}

function SettingsPanel({
  currentVersion,
  onSaved,
  onCancel,
}: {
  currentVersion: VersionKey;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const savedProfile = useMemo(() => readProfile(), []);
  const [homeArea, setHomeArea] = useState(savedProfile.homeArea);
  const [activityArea, setActivityArea] = useState(savedProfile.activityArea);
  const [incomeBand, setIncomeBand] = useState(savedProfile.incomeBand);
  const [workStyle, setWorkStyle] = useState(savedProfile.workStyle);
  const [hourlyMode, setHourlyMode] = useState<HourlyMode>(savedProfile.hourlyMode);
  const [manualHourlyValue, setManualHourlyValue] = useState(savedProfile.manualHourlyValue);
  const [showCalculation, setShowCalculation] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [family, setFamily] = useState(savedProfile.family);
  const [children, setChildren] = useState(savedProfile.children);
  const [childAge, setChildAge] = useState(savedProfile.childAge);
  const [transportModes, setTransportModes] = useState(savedProfile.transportModes);
  const [priorities, setPriorities] = useState(savedProfile.priorities);

  const estimatedHourlyValue = estimateHourlyValue(incomeBand, workStyle);
  const currentHourlyValue = hourlyMode === "auto" ? estimatedHourlyValue : manualHourlyValue;

  function toggleFromList(value: string, setter: (next: string[]) => void, current: string[]) {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <section className="version-panel profile-screen-lite">
      <div className="profile-intro">
        <strong>個人設定</strong>
        <p>あなたに合った行動を提案するための基本情報です。最初に一度設定すると、毎日の提案に反映されます。</p>
        <small>あなたの設定によって、同じ候補でもAIバトルの勝者が変わります。</small>
      </div>

      <article className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon"><Home size={19} /></div>
          <div>
            <h2>基本プロフィール</h2>
            <p>市区町村やエリア単位で設定します</p>
          </div>
        </div>
        <label className="profile-field">
          <span>居住エリア</span>
          <input value={homeArea} onChange={(event) => setHomeArea(event.target.value)} />
        </label>
        <label className="profile-field">
          <span>主な勤務地・活動エリア</span>
          <input value={activityArea} onChange={(event) => setActivityArea(event.target.value)} />
        </label>
      </article>

      <article className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon"><Clock3 size={19} /></div>
          <div>
            <h2>あなたの1時間の目安</h2>
            <p>移動時間や待ち時間を比較するための目安です</p>
          </div>
        </div>
        <div className="hourly-value-summary">
          <span>{hourlyMode === "auto" ? "自動計算" : "手動設定"}</span>
          <strong>1時間あたり {currentHourlyValue.toLocaleString("ja-JP")}円</strong>
          <p>年収帯や働き方をもとに自動計算しています。あなたの感覚に合わせて変更できます。</p>
        </div>
        <div className="choice-grid two-column profile-choice-block">
          {incomeBands.map((item) => (
            <button key={item} className={`choice-button ${incomeBand === item ? "is-active" : ""}`} onClick={() => setIncomeBand(item)}>
              {incomeBand === item && <CheckCircle2 size={14} />}
              {item}
            </button>
          ))}
        </div>
        <div className="choice-grid three-column profile-choice-block">
          {workStyles.map((item) => (
            <button key={item} className={`choice-button ${workStyle === item ? "is-active" : ""}`} onClick={() => setWorkStyle(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="time-value-actions">
          <button className="text-action-button" onClick={() => setShowCalculation((value) => !value)}>
            <CircleHelp size={15} />
            計算の考え方
          </button>
          <button className="text-action-button" onClick={() => setShowEditor((value) => !value)}>
            自分で変更する
          </button>
        </div>
        {showCalculation && (
          <div className="calculation-panel">
            <p>年収帯から基準値を置き、働き方や自由時間の少なさを少し加味します。正確な年収ではなく、時間と費用を比べるための目安です。</p>
          </div>
        )}
        {showEditor && (
          <div className="time-editor-panel">
            <div className="choice-grid two-column">
              <button className={`choice-button ${hourlyMode === "auto" ? "is-active" : ""}`} onClick={() => setHourlyMode("auto")}>自動計算を使用</button>
              <button className={`choice-button ${hourlyMode === "manual" ? "is-active" : ""}`} onClick={() => setHourlyMode("manual")}>自分で設定</button>
            </div>
            <div className="manual-value-row">
              <button onClick={() => setManualHourlyValue((value) => Math.max(500, value - 500))}>−</button>
              <strong>{manualHourlyValue.toLocaleString("ja-JP")}円</strong>
              <button onClick={() => setManualHourlyValue((value) => value + 500)}>＋</button>
            </div>
            <label className="profile-field">
              <span>金額を直接入力</span>
              <input
                inputMode="numeric"
                value={manualHourlyValue}
                onChange={(event) => setManualHourlyValue(Math.max(0, Number(event.target.value) || 0))}
              />
            </label>
            <button className="text-action-button" onClick={() => setManualHourlyValue(estimatedHourlyValue)}>
              <RotateCcw size={15} />
              推定値に戻す
            </button>
          </div>
        )}
      </article>

      <article className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon"><Users size={19} /></div>
          <div>
            <h2>家族・同行者</h2>
            <p>家族向け、子どもが疲れにくい提案に使います</p>
          </div>
        </div>
        <div className="choice-grid two-column">
          {familyOptions.map((item) => (
            <button key={item} className={`choice-button ${family === item ? "is-active" : ""}`} onClick={() => setFamily(item)}>
              {family === item && <CheckCircle2 size={14} />}
              {item}
            </button>
          ))}
        </div>
        {family === "子どもあり" && (
          <div className="child-settings">
            <div className="number-row">
              <span>子どもの人数</span>
              <button onClick={() => setChildren((value) => Math.max(0, value - 1))}>−</button>
              <strong>{children}人</strong>
              <button onClick={() => setChildren((value) => value + 1)}>＋</button>
            </div>
            <div className="choice-grid three-column">
              {childAgeOptions.map((item) => (
                <button key={item} className={`choice-button ${childAge === item ? "is-active" : ""}`} onClick={() => setChildAge(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      <article className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon"><TrainFront size={19} /></div>
          <div>
            <h2>主な移動手段</h2>
            <p>{transportModes.join("・") || "未設定"}</p>
          </div>
        </div>
        <div className="choice-grid two-column">
          {transportOptions.map((item) => (
            <button key={item} className={`choice-button ${transportModes.includes(item) ? "is-active" : ""}`} onClick={() => toggleFromList(item, setTransportModes, transportModes)} aria-pressed={transportModes.includes(item)}>
              {transportModes.includes(item) && <CheckCircle2 size={14} />}
              {item}
            </button>
          ))}
        </div>
      </article>

      <article className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon"><BarChart3 size={19} /></div>
          <div>
            <h2>普段重視すること</h2>
            <p>その日の希望と組み合わせて、提案の優先順位を調整します</p>
          </div>
        </div>
        <div className="choice-grid two-column">
          {priorityOptions.map((item) => (
            <button key={item} className={`choice-button ${priorities.includes(item) ? "is-active" : ""}`} onClick={() => toggleFromList(item, setPriorities, priorities)} aria-pressed={priorities.includes(item)}>
              {priorities.includes(item) && <CheckCircle2 size={14} />}
              {item}
            </button>
          ))}
        </div>
      </article>

      <article className="summary-card">
        <p>現在の試作</p>
        <h3>{versions[currentVersion].label}</h3>
        <span>{versions[currentVersion].description}</span>
      </article>

      <div className="profile-actions">
        <button
          className="primary-button action-wide"
          onClick={() => {
            saveProfile({
              homeArea,
              activityArea,
              incomeBand,
              workStyle,
              hourlyMode,
              manualHourlyValue,
              family,
              children,
              childAge,
              transportModes,
              priorities,
            });
            onSaved();
          }}
        >
          <Save size={18} />
          設定を保存
        </button>
        <button className="secondary-button action-wide" onClick={onCancel}>
          変更をキャンセル
        </button>
      </div>
    </section>
  );
}
