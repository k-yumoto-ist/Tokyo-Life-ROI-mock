import { versions, type VersionKey } from "../../config/versions";

type Props = {
  current: VersionKey;
  onChange: (version: VersionKey) => void;
};

export function VersionSwitcher({ current, onChange }: Props) {
  return (
    <label className="version-switcher">
      <span>試作</span>
      <select value={current} onChange={(event) => onChange(event.target.value as VersionKey)} aria-label="試作を切り替える">
        {Object.entries(versions).map(([key, version]) => (
          <option key={key} value={key}>
            {version.label}
          </option>
        ))}
      </select>
    </label>
  );
}
