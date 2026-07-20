import { RotateCcw } from "lucide-react";
import type { FinalProfile } from "../../../data/finalMockData";

type Props = {
  value: number;
  mode: FinalProfile["hourlyValueMode"];
  onChange: (value: number, mode: FinalProfile["hourlyValueMode"]) => void;
};

export function FinalTimeValueEditor({ value, mode, onChange }: Props) {
  return (
    <div className="final-time-value-editor">
      <div className="final-time-value-heading">
        <span>あなたの時間価値</span>
        <strong>{value.toLocaleString("ja-JP")}円／時間</strong>
      </div>
      <p>移動や待ち時間を、My ROIであなた向けに評価するための目安です。</p>
      <div className="final-time-stepper" aria-label="時間価値を調整">
        <button type="button" onClick={() => onChange(Math.max(500, value - 500), "manual")} aria-label="時間価値を500円下げる">−</button>
        <span>{mode === "auto" ? "年収帯から自動算出" : "手動で調整中"}</span>
        <button type="button" onClick={() => onChange(Math.min(15000, value + 500), "manual")} aria-label="時間価値を500円上げる">＋</button>
      </div>
      {mode === "manual" && (
        <button type="button" className="final-inline-action" onClick={() => onChange(3200, "auto")}>
          <RotateCcw size={14} /> 自動算出に戻す
        </button>
      )}
    </div>
  );
}
