import { Bell, Check, Clock3, LocateFixed, RotateCcw, ShieldCheck, TrainFront, UsersRound, WalletCards } from "lucide-react";
import { useState } from "react";

type QuestMapSettingsProps = {
  onReset: () => void;
};

export function QuestMapSettings({ onReset }: QuestMapSettingsProps) {
  const [income, setIncome] = useState("700〜1,000万円");
  const [timeValue, setTimeValue] = useState(3200);
  const [priority, setPriority] = useState("バランス重視");
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  return (
    <section className="quest-map-page quest-map-settings-page">
      <header className="quest-map-page-heading"><span>PERSONALIZE</span><h1>設定</h1><p>任意の設定を加えると、クエストの相性がより自分向けになります。</p></header>
      <article className="quest-map-setting-card">
        <h2><WalletCards size={18} />時間価値</h2>
        <label><span>年収帯（任意）</span><select value={income} onChange={(event) => setIncome(event.target.value)}><option>回答しない</option><option>500〜700万円</option><option>700〜1,000万円</option><option>1,000万円以上</option></select></label>
        <div className="quest-map-time-value"><span>自動算出の目安</span><strong>{timeValue.toLocaleString("ja-JP")}円 / h</strong><div><button onClick={() => setTimeValue((value) => Math.max(500, value - 500))}>−</button><button onClick={() => setTimeValue((value) => value + 500)}>＋</button></div></div>
        <p><Clock3 size={14} />移動や待ち時間を比較する目安です。感覚に合わせて変更できます。</p>
      </article>
      <article className="quest-map-setting-card">
        <h2><UsersRound size={18} />家族・生活</h2>
        <div className="quest-map-setting-summary"><span>家族構成</span><strong>配偶者・子ども2人（6歳、3歳）</strong></div>
        <div className="quest-map-setting-summary"><span>生活エリア</span><strong>東京近郊・都心東部</strong></div>
        <div className="quest-map-setting-summary"><span>よく使う移動</span><strong><TrainFront size={14} />電車・徒歩</strong></div>
      </article>
      <article className="quest-map-setting-card">
        <h2><ShieldCheck size={18} />提案の好み</h2>
        <div className="quest-map-settings-chips">{["時間を大切に", "出費を抑える", "家族との体験", "新しい学び", "健康", "バランス重視"].map((item) => <button key={item} className={priority === item ? "is-active" : ""} onClick={() => setPriority(item)}>{priority === item && <Check size={13} />}{item}</button>)}</div>
      </article>
      <article className="quest-map-setting-card quest-map-toggle-settings">
        <button onClick={() => setLocationEnabled((value) => !value)} aria-pressed={locationEnabled}><span><LocateFixed size={18} />位置情報<small>現在地に近いクエストを表示</small></span><i className={locationEnabled ? "is-on" : ""}>{locationEnabled && <Check size={13} />}</i></button>
        <button onClick={() => setNotifications((value) => !value)} aria-pressed={notifications}><span><Bell size={18} />通知<small>解放クエストをお知らせ</small></span><i className={notifications ? "is-on" : ""}>{notifications && <Check size={13} />}</i></button>
      </article>
      <button className="quest-map-reset-button" onClick={onReset}><RotateCcw size={16} />V11のデモ状態をリセット</button>
      <p className="quest-map-privacy-note">設定はこのブラウザに保存されます。年収・家庭情報は未入力でも利用できます。</p>
    </section>
  );
}
