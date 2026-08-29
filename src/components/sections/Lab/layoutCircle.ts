/**
 * Circular word-cloud packing. Given the deck's words and which are currently
 * visible (energy-dependent), it arranges the visible ones into a compact,
 * overlap-free ellipse that fills the 1000 × 640 canvas — the focal word at the
 * centre, everything else spiralled around it (Archimedean spiral + AABB
 * collision test). Pure & deterministic: word sizes are derived from the label
 * length and weight (Courier Prime is monospace), so no DOM measuring is needed.
 * Hidden words are parked at the centre so they grow outward when revealed.
 */

import { SIZE, type LabWord } from "./labData";

const W = 1000;
const H = 640;
const UNIT = 10; // 1cqi ≈ 10 design units on a 1000-wide canvas
const CHAR = 0.62; // Courier Prime advance ≈ 0.6em
const PADX = 0.7; // extra horizontal breathing (in font units)
const FIT_FACTOR = 0.78; // leave margin around the cloud (zoom out a touch)

type Box = { x: number; y: number; hw: number; hh: number };

// Each node stacks an icon over the label, so it's taller than the text alone.
// The focal word renders as a bigger padded card, so inflate it.
function halfSize(word: LabWord): { hw: number; hh: number } {
  const fp = SIZE[word.w] * UNIT;
  const labelW = word.label.length * CHAR * fp + PADX * fp;
  const iconW = fp * 1.25;
  let hw = Math.max(labelW, iconW) / 2;
  let hh = fp * 1.4; // ≈ half of (pad + icon + gap + label + pad)
  if (word.focal) {
    hw *= 1.4;
    hh = fp * 0.9;
  }
  return { hw, hh };
}

export type CloudLayout = {
  positions: Record<string, { x: number; y: number }>;
  /** The zoom that makes the packed content fill the canvas (auto-fit). */
  fit: number;
};

export function layoutCircle(words: LabWord[], visible: Set<string>): CloudLayout {
  const cx = W / 2;
  const cy = H / 2;
  const pad = 13;
  const ax = 1; // horizontal spread
  const ay = 0.66; // vertical spread → ellipse matching the canvas aspect

  const placed: Box[] = [];
  const pos: Record<string, { x: number; y: number }> = {};

  // Focal first, then heaviest → lightest, so big words sit near the centre.
  const vis = words
    .filter((w) => visible.has(w.id))
    .sort((a, b) => (b.focal ? 1 : 0) - (a.focal ? 1 : 0) || b.w - a.w);

  for (const word of vis) {
    const { hw, hh } = halfSize(word);
    let x = cx;
    let y = cy;

    if (placed.length > 0) {
      let theta = 0;
      let found = false;
      for (let k = 0; k < 6000; k++) {
        theta += 0.2;
        const r = 1.7 * theta;
        x = cx + Math.cos(theta) * r * ax;
        y = cy + Math.sin(theta) * r * ay;
        if (x - hw < pad || x + hw > W - pad || y - hh < pad || y + hh > H - pad) continue;
        let hit = false;
        for (const p of placed) {
          if (Math.abs(x - p.x) < hw + p.hw + pad && Math.abs(y - p.y) < hh + p.hh + pad) {
            hit = true;
            break;
          }
        }
        if (!hit) {
          found = true;
          break;
        }
      }
      if (!found) {
        x = Math.max(pad + hw, Math.min(W - pad - hw, x));
        y = Math.max(pad + hh, Math.min(H - pad - hh, y));
      }
    }

    placed.push({ x, y, hw, hh });
    pos[word.id] = { x: Math.round(x), y: Math.round(y) };
  }

  // Hidden words wait at the centre so they emerge outward when revealed.
  for (const word of words) {
    if (!pos[word.id]) pos[word.id] = { x: cx, y: cy };
  }

  // Auto-fit: the largest uniform scale (around the centre) that still keeps the
  // packed content inside the canvas. Few words → small cluster → big zoom;
  // many words → larger cluster → smaller zoom. Independent of viewport aspect.
  const fitPad = 22;
  let hx = 1;
  let hy = 1;
  for (const b of placed) {
    hx = Math.max(hx, Math.abs(b.x - cx) + b.hw);
    hy = Math.max(hy, Math.abs(b.y - cy) + b.hh);
  }
  const fit = Math.min((cx - fitPad) / hx, (cy - fitPad) / hy) * FIT_FACTOR;

  return { positions: pos, fit };
}
