import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { versions, type VersionKey } from "../../config/versions";

type Props = {
  current: VersionKey;
  onChange: (version: VersionKey) => void;
};

export function VersionSwitcher({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function choose(version: VersionKey) {
    onChange(version);
    setOpen(false);
  }

  return (
    <div className="version-switcher">
      <button className="version-switcher-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu">
        <span>試作</span>
        <ChevronDown size={14} className={open ? "is-open" : ""} />
      </button>
      {open && (
        <div className="version-switcher-menu" role="menu" aria-label="試作を切り替える">
          {Object.entries(versions).map(([key, version]) => {
            const selected = current === key;
            return (
              <button key={key} role="menuitemradio" aria-checked={selected} className={selected ? "is-selected" : ""} onClick={() => choose(key as VersionKey)}>
                <span>{version.label}</span>
                {selected && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
