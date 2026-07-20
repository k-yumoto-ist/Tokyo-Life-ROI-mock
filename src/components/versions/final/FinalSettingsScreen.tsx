import { ArrowLeft, Check, Clock3, RotateCcw, Save, UsersRound } from "lucide-react";
import { useState } from "react";
import type { FinalProfile } from "../../../data/finalMockData";

type Props = { profile: FinalProfile; onSave: (profile: FinalProfile) => void; onBack: () => void; onReset: () => void };

export function FinalSettingsScreen({ profile, onSave, onBack, onReset }: Props) {
  const [draft, setDraft] = useState(profile);
  const [timeOpen, setTimeOpen] = useState(false);
  const set = <K extends keyof FinalProfile>(key: K, value: FinalProfile[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleInterest = (interest: string) => set("interests", draft.interests.includes(interest) ? draft.interests.filter((item) => item !== interest) : [...draft.interests, interest]);
  return (
    <main className="final-page final-settings-page">
      <button className="final-back-link" onClick={onBack}><ArrowLeft size={18} />わたしの傾向に戻る</button>
      <section className="final-section-heading"><span>PROFILE</span><h1>個人設定</h1><p>最初の提案をつくるための仮説です。行動と振り返りで少しずつ更新されます。</p></section>
      <section className="final-settings-section">
        <div className="final-settings-title"><UsersRound size={20} /><div><h2>暮らしと移動</h2><p>家族の負担や移動方法に反映します</p></div></div>
        <label>暮らし方</label>
        <div className="final-segmented-row">
          {([['solo','ひとり'],['partner','二人'],['family','家族']] as const).map(([value, label]) => <button key={value} className={draft.household === value ? "is-active" : ""} onClick={() => set("household", value)}>{draft.household === value && <Check size={14} />}{label}</button>)}
        </div>
        <label>混雑</label>
        <button className={`final-setting-toggle ${draft.dislikesCrowds ? "is-active" : ""}`} aria-pressed={draft.dislikesCrowds} onClick={() => set("dislikesCrowds", !draft.dislikesCrowds)}><span><strong>混雑をできれば避ける</strong><small>待ち時間と疲労をやや重く評価</small></span><i /></button>
        <label>歩く量</label>
        <div className="final-segmented-row">
          {([['low','少なめ'],['medium','普通'],['high','歩ける']] as const).map(([value, label]) => <button key={value} className={draft.walkingTolerance === value ? "is-active" : ""} onClick={() => set("walkingTolerance", value)}>{label}</button>)}
        </div>
      </section>
      <section className="final-settings-section">
        <button className="final-settings-accordion" onClick={() => setTimeOpen((open) => !open)} aria-expanded={timeOpen}>
          <Clock3 size={20} /><span><small>あなたの時間価値</small><strong>{draft.hourlyValue.toLocaleString("ja-JP")}円 / 時間</strong></span><b>{timeOpen ? "閉じる" : "調整"}</b>
        </button>
        {timeOpen && <div className="final-time-editor"><p>{draft.hourlyValueMode === "auto" ? "年収帯などからの推定値を使用中です。" : "あなたが調整した値を使用中です。"} 感覚に合わせて500円単位で変更できます。</p><div><button onClick={() => setDraft((current) => ({ ...current, hourlyValue: Math.max(500, current.hourlyValue - 500), hourlyValueMode: "manual" }))} aria-label="時間価値を500円下げる">−</button><strong>{draft.hourlyValue.toLocaleString("ja-JP")}円</strong><button onClick={() => setDraft((current) => ({ ...current, hourlyValue: current.hourlyValue + 500, hourlyValueMode: "manual" }))} aria-label="時間価値を500円上げる">＋</button></div><button className="final-text-button" onClick={() => setDraft((current) => ({ ...current, hourlyValue: 3200, hourlyValueMode: "auto" }))}><RotateCcw size={14} />推定値に戻す</button></div>}
      </section>
      <section className="final-settings-section">
        <h2>関心のあること</h2>
        <div className="final-feedback-grid">
          {["学び", "子ども", "公共施設", "自然", "文化", "健康"].map((item) => <button key={item} className={draft.interests.includes(item) ? "is-active" : ""} aria-pressed={draft.interests.includes(item)} onClick={() => toggleInterest(item)}>{draft.interests.includes(item) && <Check size={14} />}{item}</button>)}
        </div>
      </section>
      <button className="final-primary-button" onClick={() => onSave(draft)}><Save size={17} />設定を保存</button>
      <button className="final-text-button final-reset-button" onClick={onReset}><RotateCcw size={15} />統合版のデモ状態を初期化</button>
    </main>
  );
}
