import { History, Home, LineChart } from "lucide-react";

export type FinalTab = "home" | "history" | "roi";

type FinalBottomNavProps = {
  active: FinalTab;
  onChange: (tab: FinalTab) => void;
};

const finalTabs = [
  { id: "home", label: "ホーム", Icon: Home },
  { id: "history", label: "記録", Icon: History },
  { id: "roi", label: "わたしの傾向", Icon: LineChart },
] as const;

export function FinalBottomNav({ active, onChange }: FinalBottomNavProps) {
  return (
    <nav className="final-bottom-nav" aria-label="統合版ナビゲーション">
      {finalTabs.map(({ id, label, Icon }) => (
        <button key={id} className={active === id ? "is-active" : ""} onClick={() => onChange(id)} aria-current={active === id ? "page" : undefined}>
          <Icon size={21} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
