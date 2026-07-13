import { UserRound } from "lucide-react";
import { versions, type VersionKey } from "../../config/versions";
import { VersionSwitcher } from "./VersionSwitcher";

type Props = {
  version: VersionKey;
  onVersionChange: (version: VersionKey) => void;
};

export function Header({ version, onVersionChange }: Props) {
  return (
    <header className="prototype-header">
      <div>
        <h1>Tokyo Life ROI</h1>
        <p>試作：{versions[version].label}</p>
      </div>
      <div className="prototype-actions">
        <VersionSwitcher current={version} onChange={onVersionChange} />
        <button className="icon-shell" aria-label="個人設定">
          <UserRound size={18} />
        </button>
      </div>
    </header>
  );
}
