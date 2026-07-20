import { ArrowLeft, Check, ChevronRight, Compass, Heart, Home, Sparkles, Train, WalletCards } from "lucide-react";
import { useState } from "react";
import type { FinalIncomeBand, FinalProfile, FinalProfileSection } from "../../../data/finalMockData";
import { FinalTimeValueEditor } from "./FinalTimeValueEditor";

type Props = {
  profile: FinalProfile;
  onComplete: (profile: FinalProfile, openDetails: boolean) => void;
};

const incomeOptions: Array<[FinalIncomeBand, string]> = [
  ["under-300", "300万円未満"], ["300-500", "300〜500万円"], ["500-700", "500〜700万円"],
  ["700-1000", "700〜1,000万円"], ["over-1000", "1,000万円以上"], ["private", "回答しない"],
];
const allInterests = ["子ども", "学び", "公共施設", "自然", "文化", "健康", "スポーツ", "食", "買い物", "地域イベント", "環境", "東京の新しい発見"];
const valueOptions = ["時間", "お金", "疲れにくさ", "満足感", "家族との過ごしやすさ", "新しい発見"];
const stepMeta = [
  { label: "暮らし", icon: Home },
  { label: "普段の移動", icon: Train },
  { label: "時間とお金", icon: WalletCards },
  { label: "大切にしたいこと", icon: Heart },
  { label: "興味", icon: Compass },
] as const;

function addSection(sections: FinalProfileSection[], section: FinalProfileSection) {
  return sections.includes(section) ? sections : [...sections, section];
}

export function FinalProfileOnboarding({ profile, onComplete }: Props) {
  const [draft, setDraft] = useState(profile);
  const [step, setStep] = useState(0);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const set = <K extends keyof FinalProfile>(key: K, value: FinalProfile[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleArray = (key: "transportModes" | "interests", value: string) => set(key, draft[key].includes(value) ? draft[key].filter((item) => item !== value) : [...draft[key], value]);
  const togglePriority = (value: string) => {
    if (draft.valuePriorities.includes(value)) set("valuePriorities", draft.valuePriorities.filter((item) => item !== value));
    else if (draft.valuePriorities.length < 3) set("valuePriorities", [...draft.valuePriorities, value]);
  };
  const finishStep = () => {
    const section: FinalProfileSection = step === 0 ? "basic" : step === 1 ? "mobility" : step === 2 ? "money" : "interests";
    setDraft((current) => ({ ...current, completedSections: addSection(current.completedSections, section) }));
    setStep((current) => current + 1);
  };

  if (step >= stepMeta.length) {
    return (
      <main className="final-onboarding final-onboarding-complete">
        <div className="final-complete-mark"><Sparkles size={28} /></div>
        <span>準備できました</span>
        <h1>あなた向けの提案を<br />始められます</h1>
        <p>まずは今の情報から提案します。選択や振り返りを重ねることで、少しずつあなた向けに更新されます。</p>
        <div className="final-onboarding-summary">
          <b>{draft.household === "family" ? "家族" : draft.household === "partner" ? "二人" : "ひとり"}</b>
          <b>{draft.transportModes.join("・")}</b>
          <b>{draft.valuePriorities.slice(0, 2).join("・")}</b>
        </div>
        <div className="final-onboarding-actions">
          <button type="button" className="final-primary-button" onClick={() => onComplete(draft, false)}>この設定で始める <ChevronRight size={18} /></button>
          <button type="button" className="final-secondary-button" onClick={() => onComplete(draft, true)}>もう少し詳しく設定する</button>
        </div>
      </main>
    );
  }

  const meta = stepMeta[step];
  const StepIcon = meta.icon;
  return (
    <main className="final-onboarding">
      <header className="final-onboarding-header">
        <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} aria-label="前のステップへ"><ArrowLeft size={20} /></button>
        <div><span>{meta.label}</span><strong>{step + 1} / {stepMeta.length}</strong></div>
      </header>
      <div className="final-onboarding-progress" aria-label={`設定 ${step + 1}/${stepMeta.length}`}><i style={{ width: `${((step + 1) / stepMeta.length) * 100}%` }} /></div>
      <section className="final-onboarding-title">
        <StepIcon size={24} />
        <span>{step === 4 ? "任意" : "初回設定"}</span>
        <h1>{step === 0 ? "まず、普段の暮らしを教えてください" : step === 1 ? "どんな移動が自分に合っていますか？" : step === 2 ? "時間とお金のバランスを設定します" : step === 3 ? "普段の選択で、何を大切にしますか？" : "気になるテーマを選んでください"}</h1>
      </section>

      {step === 0 && <div className="final-onboarding-fields">
        <fieldset><legend>暮らし方</legend><div className="final-choice-row three">{([['solo','ひとり'],['partner','二人'],['family','家族']] as const).map(([value,label]) => <button type="button" key={value} className={draft.household === value ? "is-active" : ""} onClick={() => set("household", value)}>{draft.household === value && <Check size={15} />}{label}</button>)}</div></fieldset>
        <fieldset><legend>子ども</legend><div className="final-choice-row two"><button type="button" className={!draft.hasChildren ? "is-active" : ""} onClick={() => set("hasChildren", false)}>いない</button><button type="button" className={draft.hasChildren ? "is-active" : ""} onClick={() => set("hasChildren", true)}>{draft.hasChildren && <Check size={15} />}いる</button></div></fieldset>
        <fieldset><legend>主な生活エリア</legend><div className="final-area-inputs"><label>自宅<input value={draft.homeArea} onChange={(event) => set("homeArea", event.target.value)} /></label><label>勤務地・通学先<input value={draft.workArea} onChange={(event) => set("workArea", event.target.value)} /></label><label>よく使う駅<input value={draft.frequentStation} onChange={(event) => set("frequentStation", event.target.value)} /></label></div></fieldset>
      </div>}

      {step === 1 && <div className="final-onboarding-fields">
        <fieldset><legend>主な移動手段 <small>複数選択</small></legend><div className="final-chip-grid">{["電車","バス","車","自転車","徒歩"].map((item) => <button type="button" key={item} className={draft.transportModes.includes(item) ? "is-active" : ""} onClick={() => toggleArray("transportModes", item)}>{draft.transportModes.includes(item) && <Check size={14} />}{item}</button>)}</div></fieldset>
        <fieldset><legend>歩ける量</legend><div className="final-choice-row three">{([['low','少なめ'],['medium','普通'],['high','よく歩ける']] as const).map(([value,label]) => <button type="button" key={value} className={draft.walkingTolerance === value ? "is-active" : ""} onClick={() => set("walkingTolerance", value)}>{label}</button>)}</div></fieldset>
        <fieldset><legend>混雑</legend><div className="final-choice-stack">{([['avoid','できれば避けたい'],['neutral','あまり気にしない'],['shorter-is-ok','時間が短ければ許容']] as const).map(([value,label]) => <button type="button" key={value} className={draft.crowdPreference === value ? "is-active" : ""} onClick={() => { set("crowdPreference", value); set("dislikesCrowds", value === "avoid"); }}>{draft.crowdPreference === value && <Check size={15} />}{label}</button>)}</div></fieldset>
        <fieldset><legend>乗り換え</legend><div className="final-choice-row two"><button type="button" className={draft.transferPreference === "fewer" ? "is-active" : ""} onClick={() => set("transferPreference", "fewer")}>少ない方がよい</button><button type="button" className={draft.transferPreference === "neutral" ? "is-active" : ""} onClick={() => set("transferPreference", "neutral")}>気にしない</button></div></fieldset>
      </div>}

      {step === 2 && <div className="final-onboarding-fields">
        <fieldset><legend>年収帯</legend><p className="final-field-help">時間価値の目安に使います。金額そのものを公開することはありません。</p><div className="final-chip-grid two">{incomeOptions.map(([value,label]) => <button type="button" key={value} className={draft.incomeBand === value ? "is-active" : ""} onClick={() => set("incomeBand", value)}>{draft.incomeBand === value && <Check size={14} />}{label}</button>)}</div></fieldset>
        <FinalTimeValueEditor value={draft.hourlyValue} mode={draft.hourlyValueMode} onChange={(value, mode) => setDraft((current) => ({ ...current, hourlyValue: value, hourlyValueMode: mode }))} />
        <fieldset><legend>費用への感度</legend><div className="final-choice-stack">{([['saving','なるべく抑えたい'],['balanced','バランス重視'],['experience','体験が良ければ気にしない']] as const).map(([value,label]) => <button type="button" key={value} className={draft.costSensitivity === value ? "is-active" : ""} onClick={() => set("costSensitivity", value)}>{draft.costSensitivity === value && <Check size={15} />}{label}</button>)}</div></fieldset>
        <fieldset><legend>待ち時間への抵抗</legend><div className="final-choice-row three">{([['low','強い'],['medium','普通'],['high','少ない']] as const).map(([value,label]) => <button type="button" key={value} className={draft.waitTolerance === value ? "is-active" : ""} onClick={() => set("waitTolerance", value)}>{label}</button>)}</div></fieldset>
      </div>}

      {step === 3 && <div className="final-onboarding-fields"><p className="final-field-help">大切な順に3つまで。選んだ順番も提案に反映します。</p><div className="final-profile-priority-grid">{valueOptions.map((item) => { const order = draft.valuePriorities.indexOf(item); return <button type="button" key={item} className={order >= 0 ? "is-active" : ""} onClick={() => togglePriority(item)}><i>{order >= 0 ? order + 1 : ""}</i><span>{item}</span></button>; })}</div></div>}

      {step === 4 && <div className="final-onboarding-fields"><p className="final-field-help">いくつでも選べます。後から個人設定で変更できます。</p><div className="final-chip-grid">{allInterests.slice(0, showAllInterests ? allInterests.length : 6).map((item) => <button type="button" key={item} className={draft.interests.includes(item) ? "is-active" : ""} onClick={() => toggleArray("interests", item)}>{draft.interests.includes(item) && <Check size={14} />}{item}</button>)}</div>{!showAllInterests && <button type="button" className="final-inline-action" onClick={() => setShowAllInterests(true)}>もっと見る <ChevronRight size={14} /></button>}</div>}

      <div className="final-onboarding-footer">
        {step === 4 && <button type="button" className="final-skip-action" onClick={finishStep}>あとで設定</button>}
        <button type="button" className="final-primary-button" onClick={finishStep}>次へ <ChevronRight size={18} /></button>
      </div>
    </main>
  );
}
