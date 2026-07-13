import { BarChart3, Home, Settings } from "lucide-react";

type Props = {
  active: "home" | "roi" | "settings";
  onChange: (tab: "home" | "roi" | "settings") => void;
};

const items = [
  { id: "home", label: "ホーム", icon: Home },
  { id: "roi", label: "My ROI", icon: BarChart3 },
  { id: "settings", label: "設定", icon: Settings }
] as const;

export function BottomNavigation({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav" aria-label="下部ナビゲーション">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} className={active === item.id ? "is-active" : ""} onClick={() => onChange(item.id)} aria-current={active === item.id ? "page" : undefined}>
            <Icon size={21} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
