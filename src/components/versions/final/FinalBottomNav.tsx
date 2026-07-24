import { History, Home, Search, Settings } from "lucide-react";

export type FinalTab = "home" | "search" | "record" | "settings";

type FinalBottomNavProps = {
  active: FinalTab;
  onChange: (tab: FinalTab) => void;
};

const finalTabs = [
  { id: "home", label: "ホーム", Icon: Home },
  { id: "search", label: "探す", Icon: Search },
  { id: "record", label: "記録", Icon: History },
  { id: "settings", label: "設定", Icon: Settings },
] as const;

export function FinalBottomNav({ active, onChange }: FinalBottomNavProps) {
  return (
    <nav className="final-bottom-nav" aria-label="統合版ナビゲーション">
      {finalTabs.map(({ id, label, Icon }) => (
        <button type="button" key={id} className={active === id ? "is-active" : ""} onClick={() => onChange(id)} aria-current={active === id ? "page" : undefined}>
          <Icon size={21} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
