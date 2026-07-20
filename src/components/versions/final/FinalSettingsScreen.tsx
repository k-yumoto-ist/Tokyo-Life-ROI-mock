import { Accessibility, ArrowLeft, BrainCircuit, CheckCircle2, ChevronRight, Heart, RotateCcw, TrainFront, UserRound, WalletCards } from "lucide-react";
import { useState } from "react";
import type { FinalChoiceRecord, FinalProfile, FinalProfileSection } from "../../../data/finalMockData";
import { FinalLearnedTrendsScreen } from "./FinalLearnedTrendsScreen";
import { FinalProfileCategoryEditor } from "./FinalProfileCategoryEditor";

type Props = { profile: FinalProfile; history: FinalChoiceRecord[]; initialSection?: FinalProfileSection; onSave: (profile: FinalProfile) => void; onBack: () => void; onReset: () => void };
type SettingsView = "top" | "learned" | FinalProfileSection;

export function FinalSettingsScreen({ profile, history, initialSection, onSave, onBack, onReset }: Props) {
  const [draft, setDraft] = useState(profile);
  const [view, setView] = useState<SettingsView>(initialSection ?? "top");
  const completion = Math.min(100, 20 + (draft.completedSections.includes("basic") ? 15 : 0) + (draft.completedSections.includes("mobility") ? 15 : 0) + (draft.completedSections.includes("money") ? 15 : 0) + (draft.completedSections.includes("interests") ? 20 : 0) + (draft.completedSections.includes("details") ? 15 : 0));
  const saveSection = (next: FinalProfile) => { setDraft(next); onSave(next); setView("top"); };

  if (view === "learned") return <FinalLearnedTrendsScreen history={history} onBack={() => setView("top")} />;
  if (view !== "top") return <FinalProfileCategoryEditor section={view} profile={draft} onBack={() => setView("top")} onSave={saveSection} />;

  const cards: Array<{ id: FinalProfileSection; icon: typeof UserRound; title: string; lines: string[]; extra?: string }> = [
    { id: "basic", icon: UserRound, title: "基本プロフィール", lines: [draft.household === "family" ? "家族・子どもあり" : draft.household === "partner" ? "二人暮らし" : "ひとり暮らし", `${draft.homeArea}・${draft.frequentStation}`] },
    { id: "mobility", icon: TrainFront, title: "移動と身体", lines: [draft.transportModes.join("・"), `徒歩${draft.walkingMinutes}分程度・混雑${draft.dislikesCrowds ? "回避" : "許容"}`] },
    { id: "money", icon: WalletCards, title: "時間とお金", lines: [draft.costSensitivity === "balanced" ? "費用はバランス重視" : draft.costSensitivity === "saving" ? "費用を抑えたい" : "体験を優先", "待ち時間はなるべく避けたい"], extra: `時間価値 ${draft.hourlyValue.toLocaleString("ja-JP")}円／時間` },
    { id: "interests", icon: Heart, title: "興味と価値観", lines: [draft.interests.slice(0, 3).join("・"), draft.valuePriorities.slice(0, 2).join("・") || "大切にしたいことを追加"] },
    { id: "details", icon: Accessibility, title: "詳細な暮らし", lines: ["ベビーカー・高齢者との移動", "荷物・ペット・バリアフリー"] },
  ];

  return (
    <main className="final-page final-settings-page final-settings-top">
      <button type="button" className="final-back-link" onClick={onBack}><ArrowLeft size={18} /> わたしの傾向に戻る</button>
      <section className="final-section-heading final-settings-heading">
        <span>PROFILE</span>
        <h1>個人設定</h1>
        <p>入力した内容と行動の振り返りから、あなたへの提案を少しずつ更新します。</p>
      </section>
      <section className="final-profile-completion" aria-label={`プロフィール完成度 ${completion}%`}>
        <div><span>プロフィール完成度</span><strong>{completion}%</strong></div>
        <div className="final-profile-progress"><i style={{ width: `${completion}%` }} /></div>
        <p>詳しく設定すると、提案の理由がさらにあなた向けになります。</p>
      </section>
      <div className="final-settings-card-list">
        {cards.map((card) => {
          const Icon = card.icon;
          const isComplete = draft.completedSections.includes(card.id);
          return <button type="button" key={card.id} className="final-settings-card" onClick={() => setView(card.id)}>
            <span className="final-settings-card-icon"><Icon size={20} /></span>
            <span className="final-settings-card-copy"><span><b>{card.title}</b><em className={isComplete ? "is-complete" : ""}>{isComplete ? <><CheckCircle2 size={12} />設定済み</> : card.id === "details" ? "未設定" : "項目を追加"}</em></span>{card.extra && <small className="final-settings-card-extra">{card.extra}</small>}<small>{card.lines.join(" / ")}</small></span>
            <ChevronRight size={18} />
          </button>;
        })}
        <button type="button" className="final-settings-card is-learned" onClick={() => setView("learned")}>
          <span className="final-settings-card-icon"><BrainCircuit size={20} /></span>
          <span className="final-settings-card-copy"><span><b>学習した傾向</b><em className="is-learned">新しい発見あり</em></span><small>選択と振り返りから更新されます</small></span>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="final-settings-legend"><span><i className="is-setting" />あなたが設定したこと</span><span><i className="is-learned" />行動から学習したこと</span></div>
      <button type="button" className="final-text-button final-reset-button" onClick={onReset}><RotateCcw size={15} />統合版のデモ状態を初期化</button>
    </main>
  );
}
