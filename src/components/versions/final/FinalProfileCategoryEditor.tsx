import { ArrowLeft, Check, Save } from "lucide-react";
import { useState } from "react";
import type { FinalIncomeBand, FinalProfile, FinalProfileSection } from "../../../data/finalMockData";
import { FinalTimeValueEditor } from "./FinalTimeValueEditor";

type Props = { section: FinalProfileSection; profile: FinalProfile; onBack: () => void; onSave: (profile: FinalProfile) => void };
const labels: Record<FinalProfileSection, { title: string; hint: string }> = {
  basic: { title: "基本プロフィール", hint: "暮らし方と、普段使うエリア" },
  mobility: { title: "移動と身体", hint: "疲れや移動負担の評価に使われます" },
  money: { title: "時間とお金", hint: "時間価値とMy ROIの計算に使われます" },
  interests: { title: "興味と価値観", hint: "提案内容とMy QOLの振り返りに使われます" },
  details: { title: "詳細な暮らし", hint: "必要な配慮を提案へ反映します" },
};
const incomes: Array<[FinalIncomeBand, string]> = [["under-300","300万円未満"],["300-500","300〜500万円"],["500-700","500〜700万円"],["700-1000","700〜1,000万円"],["over-1000","1,000万円以上"],["private","回答しない"]];
const interests = ["子ども","学び","公共施設","自然","文化","健康","スポーツ","食","買い物","地域イベント","環境配慮","東京の歴史","新しい施設","穴場スポット"];
const values = ["時間","お金","疲れにくさ","満足感","家族との過ごしやすさ","新しい発見"];
const styles = ["予定を決めてから動きたい","その場で決めたい","定番を選びたい","新しい場所を試したい","静かに過ごしたい","活気のある場所に行きたい","一つの場所で長く過ごしたい","複数の場所を回りたい","効率よく動きたい","あえて寄り道を楽しみたい"];

function Toggle({ label, checked, onChange, note }: { label: string; checked: boolean; onChange: () => void; note?: string }) {
  return <button type="button" className={`final-setting-toggle ${checked ? "is-active" : ""}`} aria-pressed={checked} onClick={onChange}><span><strong>{label}</strong>{note && <small>{note}</small>}</span><i /></button>;
}

export function FinalProfileCategoryEditor({ section, profile, onBack, onSave }: Props) {
  const [draft, setDraft] = useState(profile);
  const set = <K extends keyof FinalProfile>(key: K, value: FinalProfile[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleArray = (key: "transportModes" | "interests" | "actionStyles", value: string) => set(key, draft[key].includes(value) ? draft[key].filter((item) => item !== value) : [...draft[key], value]);
  const togglePriority = (value: string) => {
    if (draft.valuePriorities.includes(value)) set("valuePriorities", draft.valuePriorities.filter((item) => item !== value));
    else if (draft.valuePriorities.length < 3) set("valuePriorities", [...draft.valuePriorities, value]);
  };
  const save = () => onSave({ ...draft, completedSections: draft.completedSections.includes(section) ? draft.completedSections : [...draft.completedSections, section] });
  const meta = labels[section];
  return (
    <main className="final-page final-profile-subpage final-profile-editor">
      <button type="button" className="final-back-link" onClick={onBack}><ArrowLeft size={18} /> 個人設定に戻る</button>
      <section className="final-section-heading final-settings-heading"><span>設定</span><h1>{meta.title}</h1><p>{meta.hint}</p></section>

      {section === "basic" && <div className="final-edit-sections">
        <fieldset><legend>暮らし方</legend><div className="final-choice-row three">{([['solo','ひとり'],['partner','二人'],['family','家族']] as const).map(([value,label]) => <button type="button" key={value} className={draft.household === value ? "is-active" : ""} onClick={() => set("household", value)}>{draft.household === value && <Check size={14} />}{label}</button>)}</div></fieldset>
        <fieldset><legend>子ども</legend><div className="final-choice-row two"><button type="button" className={!draft.hasChildren ? "is-active" : ""} onClick={() => set("hasChildren", false)}>いない</button><button type="button" className={draft.hasChildren ? "is-active" : ""} onClick={() => set("hasChildren", true)}>いる</button></div></fieldset>
        {draft.hasChildren && <fieldset><legend>子どもの年齢</legend><div className="final-area-inputs"><label>年齢<input type="number" min="0" max="18" value={draft.childAges[0] ?? 6} onChange={(event) => set("childAges", [Number(event.target.value)])} /></label></div></fieldset>}
        <fieldset><legend>生活エリア</legend><div className="final-area-inputs"><label>自宅<input value={draft.homeArea} onChange={(event) => set("homeArea", event.target.value)} /></label><label>勤務地・通学先<input value={draft.workArea} onChange={(event) => set("workArea", event.target.value)} /></label><label>よく使う駅<input value={draft.frequentStation} onChange={(event) => set("frequentStation", event.target.value)} /></label></div></fieldset>
      </div>}

      {section === "mobility" && <div className="final-edit-sections">
        <fieldset><legend>主な移動手段</legend><div className="final-chip-grid">{["電車","バス","車","自転車","徒歩"].map((item) => <button type="button" key={item} className={draft.transportModes.includes(item) ? "is-active" : ""} onClick={() => toggleArray("transportModes", item)}>{draft.transportModes.includes(item) && <Check size={14} />}{item}</button>)}</div></fieldset>
        <fieldset><legend>徒歩可能時間</legend><div className="final-choice-row four">{([5,15,30,60] as const).map((value) => <button type="button" key={value} className={draft.walkingMinutes === value ? "is-active" : ""} onClick={() => set("walkingMinutes", value)}>{value === 60 ? "それ以上" : `${value}分`}</button>)}</div></fieldset>
        <fieldset><legend>混雑</legend><div className="final-choice-stack">{([['avoid','できれば避けたい'],['neutral','あまり気にしない'],['shorter-is-ok','時間が短ければ許容']] as const).map(([value,label]) => <button type="button" key={value} className={draft.crowdPreference === value ? "is-active" : ""} onClick={() => { set("crowdPreference", value); set("dislikesCrowds", value === "avoid"); }}>{draft.crowdPreference === value && <Check size={14} />}{label}</button>)}</div></fieldset>
        <fieldset><legend>移動の配慮</legend><div className="final-toggle-list"><Toggle label="階段を避けたい" checked={draft.avoidStairs} onChange={() => set("avoidStairs", !draft.avoidStairs)} /><Toggle label="乗り換え回数を減らしたい" checked={draft.transferPreference === "fewer"} onChange={() => set("transferPreference", draft.transferPreference === "fewer" ? "neutral" : "fewer")} /><Toggle label="雨の日は徒歩を減らしたい" checked={draft.reduceWalkingInRain} onChange={() => set("reduceWalkingInRain", !draft.reduceWalkingInRain)} /><Toggle label="暑い日は屋外移動を減らしたい" checked={draft.reduceWalkingInHeat} onChange={() => set("reduceWalkingInHeat", !draft.reduceWalkingInHeat)} /><Toggle label="寒い日は屋外移動を減らしたい" checked={draft.reduceWalkingInCold} onChange={() => set("reduceWalkingInCold", !draft.reduceWalkingInCold)} /><Toggle label="座って移動したい" checked={draft.preferSeatedTravel} onChange={() => set("preferSeatedTravel", !draft.preferSeatedTravel)} /></div></fieldset>
      </div>}

      {section === "money" && <div className="final-edit-sections">
        <fieldset><legend>年収帯</legend><p className="final-field-help">時間価値の目安に使います。金額そのものを公開することはありません。</p><div className="final-chip-grid two">{incomes.map(([value,label]) => <button type="button" key={value} className={draft.incomeBand === value ? "is-active" : ""} onClick={() => set("incomeBand", value)}>{draft.incomeBand === value && <Check size={14} />}{label}</button>)}</div></fieldset>
        <FinalTimeValueEditor value={draft.hourlyValue} mode={draft.hourlyValueMode} onChange={(value, mode) => setDraft((current) => ({ ...current, hourlyValue: value, hourlyValueMode: mode }))} />
        <fieldset><legend>費用への感度</legend><div className="final-choice-stack">{([['saving','なるべく抑えたい'],['balanced','バランス重視'],['experience','体験が良ければ気にしない']] as const).map(([value,label]) => <button type="button" key={value} className={draft.costSensitivity === value ? "is-active" : ""} onClick={() => set("costSensitivity", value)}>{draft.costSensitivity === value && <Check size={14} />}{label}</button>)}</div></fieldset>
        <fieldset><legend>待ち時間への抵抗</legend><div className="final-choice-row three">{([['low','強い'],['medium','普通'],['high','少ない']] as const).map(([value,label]) => <button type="button" key={value} className={draft.waitTolerance === value ? "is-active" : ""} onClick={() => set("waitTolerance", value)}>{label}</button>)}</div></fieldset>
        <div className="final-toggle-list"><Toggle label="予約が必要な場所は避けたい" checked={draft.reservationResistance} onChange={() => set("reservationResistance", !draft.reservationResistance)} /><Toggle label="予定変更に柔軟" checked={draft.flexibleSchedule} onChange={() => set("flexibleSchedule", !draft.flexibleSchedule)} /><Toggle label="無料施設を優先する" checked={draft.preferFreeFacilities} onChange={() => set("preferFreeFacilities", !draft.preferFreeFacilities)} /><Toggle label="少し高くても快適さを取る" checked={draft.payForComfort} onChange={() => set("payForComfort", !draft.payForComfort)} /></div>
      </div>}

      {section === "interests" && <div className="final-edit-sections">
        <fieldset><legend>大切にしたいこと <small>上位3つ</small></legend><div className="final-profile-priority-grid">{values.map((item) => { const order = draft.valuePriorities.indexOf(item); return <button type="button" key={item} className={order >= 0 ? "is-active" : ""} onClick={() => togglePriority(item)}><i>{order >= 0 ? order + 1 : ""}</i><span>{item}</span></button>; })}</div></fieldset>
        <fieldset><legend>興味</legend><div className="final-chip-grid">{interests.map((item) => <button type="button" key={item} className={draft.interests.includes(item) ? "is-active" : ""} onClick={() => toggleArray("interests", item)}>{draft.interests.includes(item) && <Check size={14} />}{item}</button>)}</div></fieldset>
        <fieldset><legend>行動スタイル</legend><div className="final-choice-stack">{styles.map((item) => <button type="button" key={item} className={draft.actionStyles.includes(item) ? "is-active" : ""} onClick={() => toggleArray("actionStyles", item)}>{draft.actionStyles.includes(item) && <Check size={14} />}{item}</button>)}</div></fieldset>
      </div>}

      {section === "details" && <div className="final-edit-sections"><p className="final-field-help">必要な項目だけ設定してください。いつでも変更できます。</p><div className="final-toggle-list"><Toggle label="ベビーカーを利用する" checked={draft.stroller} onChange={() => set("stroller", !draft.stroller)} /><Toggle label="高齢者と移動することがある" checked={draft.elderlyCompanion} onChange={() => set("elderlyCompanion", !draft.elderlyCompanion)} /><Toggle label="ペットと出かける" checked={draft.hasPets} onChange={() => set("hasPets", !draft.hasPets)} /><Toggle label="荷物が多いことがある" checked={draft.oftenCarriesLuggage} onChange={() => set("oftenCarriesLuggage", !draft.oftenCarriesLuggage)} /><Toggle label="バリアフリーを優先する" checked={draft.accessibilityNeeded} onChange={() => set("accessibilityNeeded", !draft.accessibilityNeeded)} note="段差・エレベーターなどを提案に反映" /></div></div>}

      <div className="final-editor-footer"><button type="button" className="final-primary-button" onClick={save}><Save size={17} />変更を保存</button></div>
    </main>
  );
}
