import { BusFront, CalendarDays, CloudSun, History, MapPin, UsersRound } from "lucide-react";

const loadingSignals = [
  { label: "移動", Icon: BusFront },
  { label: "天気", Icon: CloudSun },
  { label: "混雑", Icon: UsersRound },
  { label: "イベント", Icon: CalendarDays },
  { label: "施設", Icon: MapPin },
  { label: "過去の満足", Icon: History },
];

export function FinalLoadingScreen() {
  return (
    <main className="final-loading-page" aria-live="polite">
      <div className="final-loading-orbit" aria-hidden="true"><span /><i /></div>
      <h1>今のあなたに合う<br />3つを探しています</h1>
      <div className="final-loading-signals">
        {loadingSignals.map(({ label, Icon }, index) => <span key={label} style={{ animationDelay: `${index * 120}ms` }}><Icon size={18} />{label}</span>)}
      </div>
    </main>
  );
}
