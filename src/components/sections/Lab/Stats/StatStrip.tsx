import { Boxes, Wrench, Infinity as InfinityIcon, GraduationCap } from "lucide-react";
import { LAB_STATS } from "../labData";
import "./StatStrip.css";

const ICONS = [Boxes, Wrench, InfinityIcon, GraduationCap];
const TINTS = ["#e7e3fb", "#ffe6d9", "#dcecfb", "#d9f0e4"];
const INKS = ["#5b47a8", "#b8503f", "#3a6ea5", "#2f6b45"];

/** Bottom stat strip under the cloud window. */
export default function StatStrip() {
  return (
    <div className="lab-stats">
      {LAB_STATS.map((s, i) => {
        const Icon = ICONS[i];
        return (
          <div key={s.label} className="lab-stat sticker">
            <span
              className="lab-stat-ic"
              style={{ background: TINTS[i], color: INKS[i] }}
            >
              <Icon size={18} strokeWidth={1.9} />
            </span>
            <span className="lab-stat-txt">
              <b>{s.value}</b>
              <em>{s.label}</em>
            </span>
          </div>
        );
      })}
    </div>
  );
}
