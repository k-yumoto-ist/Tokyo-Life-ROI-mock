import { ChevronLeft, UserRound } from "lucide-react";
import { VersionSwitcher } from "../../common/VersionSwitcher";
import type { VersionKey } from "../../../config/versions";

type FinalHeaderProps = {
  currentVersion: VersionKey;
  title?: string;
  onVersionChange: (version: VersionKey) => void;
  onBack?: () => void;
  onProfile?: () => void;
};

export function FinalHeader({ currentVersion, title, onVersionChange, onBack, onProfile }: FinalHeaderProps) {
  return (
    <header className="final-header">
      <div className="final-header-main">
        {onBack ? <button className="final-icon-button" onClick={onBack} aria-label="前の画面に戻る"><ChevronLeft size={21} /></button> : <span className="final-brand-mark" aria-hidden="true">TL</span>}
        <div><strong>{title ?? "Tokyo Life ROI"}</strong><small>{title ? "Tokyo Life ROI" : "今の自分に、納得できる選択を"}</small></div>
      </div>
      <div className="final-header-actions">
        <VersionSwitcher current={currentVersion} onChange={onVersionChange} />
        {onProfile && <button className="final-icon-button" onClick={onProfile} aria-label="個人設定を開く"><UserRound size={19} /></button>}
      </div>
    </header>
  );
}
