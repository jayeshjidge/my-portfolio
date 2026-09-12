"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Search, X } from "lucide-react";
import { CAT_COLORS, FOCAL_INK, type LabDeck, type LabWord } from "../../labData";
import TechIcon from "../TechIcon";
import styles from "./index.module.css";

const MAX_RESULTS = 7;

/**
 * Technology search — lives in the window title bar. ⌘K (or click) focuses it;
 * typing filters the deck instantly; ↑/↓ move, Enter selects, Esc closes. A
 * pick just sets the active word, so all the existing highlight / dim / detail
 * behaviour is reused; the × clears the query and the selection.
 */
export default function SearchBar({
  deck,
  onSelect,
  onClear,
}: {
  deck: LabDeck;
  onSelect: (id: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hi, setHi] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const results = useMemo<LabWord[]>(() => {
    if (!q) return [];
    return deck.words
      .filter((w) => w.label.toLowerCase().includes(q))
      // Best match first: prefix matches, then shorter labels.
      .sort((a, b) => {
        const ap = a.label.toLowerCase().startsWith(q) ? 0 : 1;
        const bp = b.label.toLowerCase().startsWith(q) ? 0 : 1;
        return ap - bp || a.label.length - b.label.length;
      })
      .slice(0, MAX_RESULTS);
  }, [q, deck]);

  // ⌘K / Ctrl+K focuses the search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (w: LabWord) => {
    onSelect(w.id);
    // Clear the box after a completed search — the selection stays pinned on
    // the canvas, but the query text is reset so it's ready for the next search.
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const clear = () => {
    setQuery("");
    onClear();
    setOpen(true);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[hi]) choose(results[hi]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const resultEls = results.map((w, i) => (
    <li key={w.id} role="option" aria-selected={i === hi}>
      <button
        type="button"
        className={`${styles["lab-search-item"]}${i === hi ? ` ${styles["is-hi"]}` : ""}`}
        onMouseEnter={() => setHi(i)}
        onClick={() => choose(w)}
      >
        <span className={styles["lab-search-item-ic"]} aria-hidden="true">
          <TechIcon id={w.id} size={16} color={w.focal ? FOCAL_INK : CAT_COLORS[w.cat].ink} />
        </span>
        <span className={styles["lab-search-item-name"]}>{w.label}</span>
        <span className={styles["lab-search-item-cat"]}>{deck.cats[w.cat].name}</span>
      </button>
    </li>
  ));

  return (
    <div className={`${styles["lab-search"]}${open ? ` ${styles["is-open"]}` : ""}`} ref={rootRef}>
      <div className={styles["lab-search-field"]}>
        <Search className={styles["lab-search-icon"]} size={15} strokeWidth={2} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          className={styles["lab-search-input"]}
          placeholder="Search technologies…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHi(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-controls="lab-search-list"
          aria-label="Search technologies"
        />
        {hasQuery ? (
          <button
            type="button"
            className={styles["lab-search-clear"]}
            onClick={clear}
            aria-label="Clear search"
          >
            <X size={13} strokeWidth={2.4} />
          </button>
        ) : (
          <kbd className={styles["lab-search-kbd"]} aria-hidden="true">
            ⌘ K
          </kbd>
        )}
      </div>

      {open && (
        <div className={styles["lab-search-drop"]}>
          {!hasQuery ? (
            <p className={styles["lab-search-hint"]}>Start typing — try React, Next.js, GraphQL…</p>
          ) : results.length > 0 ? (
            <ul className={styles["lab-search-list"]} id="lab-search-list" role="listbox">
              {resultEls}
            </ul>
          ) : (
            <div className={styles["lab-search-empty"]}>
              <b>No technology found</b>
              <span>Try searching React, Next.js, GraphQL…</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
