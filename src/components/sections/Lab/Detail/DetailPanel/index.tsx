"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { CAT_COLORS, FOCAL_INK, FOCAL_SOFT, wordMap, type LabDeck } from "../../labData";
import TechIcon from "../../Cloud/TechIcon";
import styles from "./index.module.css";

/** The tab's single gold accent — used everywhere in the panel except the icon
 *  marks themselves, so the whole card reads as one cohesive theme. */
const DECK_ACCENT = { ink: "#8a6a12", soft: FOCAL_SOFT };

/**
 * Right-rail detail — a persistent panel (fixed min-height so switching words
 * doesn't shift the layout). With no word pinned it shows the deck's "focused
 * stack" card; when a word is pinned it shows that word's detail: the tech's
 * icon (in its brand colour) over a gold chip, then desc, related-concept
 * chips (each with its own icon), and the "What I do" list.
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
    // Icon fallback (for lucide concept icons): the focal hub is gold, everything
    // else uses its category ink. Brand `Si*` icons override in TechIcon.
    const iconTint = word.focal ? FOCAL_INK : cat.ink;
    const related = word.related.map((id) => byId[id]).filter(Boolean);
    return (
      <div className={`${styles["lab-detail"]} sticker`}>
        <motion.div
          key={`${deck.id}-${word.id}`}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles["lab-detail-head"]}>
            <span
              className={styles["lab-detail-mono"]}
              style={{ background: DECK_ACCENT.soft }}
              aria-hidden="true"
            >
              <TechIcon id={word.id} size={24} color={iconTint} />
            </span>
            <div>
              <h3 className={styles["lab-detail-name"]}>{word.label}</h3>
              <span className={styles["lab-detail-cat"]} style={{ color: DECK_ACCENT.ink }}>
                {deck.cats[word.cat].name}
              </span>
            </div>
          </div>

          <p className={styles["lab-detail-desc"]}>{word.desc}</p>

          {related.length > 0 && (
            <>
              <p className={styles["lab-detail-sub"]}>Related concepts</p>
              <div className={styles["lab-detail-chips"]}>
                {related.map((r) => {
                  const rTint = r.focal ? FOCAL_INK : CAT_COLORS[r.cat].ink;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={styles["lab-chip"]}
                      onClick={() => onPick(r.id)}
                    >
                      <span className={styles["lab-chip-ic"]} aria-hidden="true">
                        <TechIcon id={r.id} size={13} color={rTint} />
                      </span>
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {word.does && word.does.length > 0 && (
            <>
              <div className={styles["lab-detail-rule"]} />
              <p className={`${styles["lab-detail-sub"]} ${styles["lab-detail-sub--hand"]}`}>What I do with {word.label}</p>
              <ul className={styles["lab-detail-does"]}>
                {word.does.map((d) => (
                  <li key={d}>
                    <span className={styles["lab-detail-check"]} style={{ color: DECK_ACCENT.ink }}>
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
  return (
    <div className={`${styles["lab-detail"]} sticker`}>
      <motion.div
        key={deck.id}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles["lab-detail-head"]}>
          <span
            className={`${styles["lab-detail-mono"]} ${styles["lab-detail-mono--text"]}`}
            style={{ background: DECK_ACCENT.soft, color: DECK_ACCENT.ink }}
            aria-hidden="true"
          >
            {deck.monogram}
          </span>
          <div>
            <h3 className={styles["lab-detail-name"]}>{deck.label}</h3>
            <span className={styles["lab-detail-cat"]} style={{ color: DECK_ACCENT.ink }}>
              Focused stack
            </span>
          </div>
        </div>

        <p className={styles["lab-detail-desc"]}>{deck.summary}</p>

        <p className={styles["lab-detail-sub"]}>Related concepts</p>
        <div className={styles["lab-detail-chips"]}>
          {deck.related.map((c) => (
            <span
              key={c}
              className={`${styles["lab-chip"]} ${styles["is-static"]}`}
              style={{ "--chip-ink": DECK_ACCENT.ink } as CSSProperties}
            >
              {c}
            </span>
          ))}
        </div>

        <div className={styles["lab-detail-rule"]} />
        <p className={`${styles["lab-detail-sub"]} ${styles["lab-detail-sub--hand"]}`}>What I do with {deck.label}</p>
        <ul className={styles["lab-detail-does"]}>
          {deck.does.map((d) => (
            <li key={d}>
              <span className={styles["lab-detail-check"]} style={{ color: DECK_ACCENT.ink }}>
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
