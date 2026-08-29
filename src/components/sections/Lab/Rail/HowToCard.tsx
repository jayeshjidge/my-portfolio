import { MousePointerClick, RotateCcw } from "lucide-react";
import { HOW_TO } from "../labData";
import "./HowToCard.css";

const ICONS: Record<string, typeof MousePointerClick> = {
  click: MousePointerClick,
  reset: RotateCcw,
};

/** "How to interact" sticker card in the left rail. */
export default function HowToCard() {
  const rows = HOW_TO.map((row) => {
    const Icon = ICONS[row.key];
    return (
      <li key={row.key}>
        <span className="lab-howto-ic">
          <Icon size={17} strokeWidth={1.9} />
        </span>
        <span className="lab-howto-txt">
          <b>{row.title}</b>
          <em>{row.sub}</em>
        </span>
      </li>
    );
  });

  return (
    <div className="lab-howto sticker">
      <h3 className="lab-card-title">
        How to interact <span aria-hidden="true">✦</span>
      </h3>
      <ul className="lab-howto-list">{rows}</ul>
    </div>
  );
}
