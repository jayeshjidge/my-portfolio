"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { CAT_COLORS, wordMap, type LabDeck, type StackId } from "../labData";
import "./DetailPanel.css";

/** Monogram from a label, e.g. "React Query" → "RQ", "CSS" → "CS". */
function monogram(label: string) {
  const parts = label.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return label.slice(0, 2).toUpperCase();
}

const DECK_ACCENT: Record<StackId, { ink: string; soft: string }> = {
  frontend: { ink: "#6d28d9", soft: "#e7e3fb" },
  backend: { ink: "#2f6b70", soft: "#d7ecec" },
};

/**
 * Right-rail detail. With no word pinned it shows the deck's "focused stack"
 * card (label, summary, concepts, what I do). When a word is pinned it shows
 * that word's detail with clickable related-concept chips.
 */
export default function DetailPanel({
  deck,
  wordId,
  onPick,
}: {
  deck: LabDeck;
  wordId: string | null;
  onPick: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const byId = wordMap(deck);
  const word = wordId ? byId[wordId] : null;

  // ——— Word detail ———
  if (word) {
    const cat = CAT_COLORS[word.cat];
    const ink = word.focal ? "#e0524b" : cat.ink;
    const related = word.related.map((id) => byId[id]).filter(Boolean);
    return (
      <div className="lab-detail sticker">
        <motion.div
          key={`${deck.id}-${word.id}`}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lab-detail-head">
            <span className="lab-detail-mono" style={{ background: cat.soft, color: ink }} aria-hidden="true">
              {monogram(word.label)}
            </span>
            <div>
              <h3 className="lab-detail-name">{word.label}</h3>
              <span className="lab-detail-cat" style={{ color: ink }}>
                {deck.cats[word.cat].name}
              </span>
            </div>
          </div>

          <p className="lab-detail-desc">{word.desc}</p>

          {related.length > 0 && (
            <>
              <p className="lab-detail-sub">Related concepts</p>
              <div className="lab-detail-chips">
                {related.map((r) => (
                  <button key={r.id} type="button" className="lab-chip" onClick={() => onPick(r.id)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {word.does && word.does.length > 0 && (
            <>
              <div className="lab-detail-rule" />
              <p className="lab-detail-sub lab-detail-sub--hand">What I do with {word.label}</p>
              <ul className="lab-detail-does">
                {word.does.map((d) => (
                  <li key={d}>
                    <span className="lab-detail-check" style={{ color: ink }}>
                      <Check size={13} strokeWidth={2.6} />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ——— Deck default (focused stack) ———
  const accent = DECK_ACCENT[deck.id];
  return (
    <div className="lab-detail sticker">
      <motion.div
        key={deck.id}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lab-detail-head">
          <span className="lab-detail-mono" style={{ background: accent.soft, color: accent.ink }} aria-hidden="true">
            {deck.monogram}
          </span>
          <div>
            <h3 className="lab-detail-name">{deck.label}</h3>
            <span className="lab-detail-cat" style={{ color: accent.ink }}>
              Focused stack
            </span>
          </div>
        </div>

        <p className="lab-detail-desc">{deck.summary}</p>

        <p className="lab-detail-sub">Related concepts</p>
        <div className="lab-detail-chips">
          {deck.related.map((c) => (
            <span key={c} className="lab-chip is-static" style={{ "--chip-ink": accent.ink } as CSSProperties}>
              {c}
            </span>
          ))}
        </div>

        <div className="lab-detail-rule" />
        <p className="lab-detail-sub lab-detail-sub--hand">What I do with {deck.label}</p>
        <ul className="lab-detail-does">
          {deck.does.map((d) => (
            <li key={d}>
              <span className="lab-detail-check" style={{ color: accent.ink }}>
                <Check size={13} strokeWidth={2.6} />
              </span>
              {d}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
