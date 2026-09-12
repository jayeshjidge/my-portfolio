import styles from "./index.module.css";

/**
 * CircleStamp — a vintage rubber-stamp seal for the footer.
 * "SOFTWARE ENGINEER" curves along the top, "BUILDING FOR WEB & MOBILE"
 * along the bottom, with "JAYESH / JIDGE" stacked in the middle and a small
 * star flanking each side. Curved text uses SVG <textPath> around arcs.
 */
export default function CircleStamp() {
  return (
    <div className={styles.stamp}>
      <svg
        viewBox="0 0 300 300"
        className={styles["stamp-svg"]}
        role="img"
        aria-label="Jayesh Jidge — Software Engineer · Building for web & mobile"
      >
        <defs>
          {/* top arc — glyphs sit just inside the ring */}
          <path id="stampTop" d="M 40 150 A 110 110 0 0 1 260 150" />
          {/* bottom arc — larger radius so the (inward-growing) glyphs land in
              the same band as the top text, keeping both symmetric to the ring */}
          <path id="stampBottom" d="M 27 150 A 123 123 0 0 0 273 150" />
        </defs>

        <circle cx="150" cy="150" r="143" className={styles["stamp-ring"]} />
        <circle
          cx="150"
          cy="150"
          r="135"
          className={`${styles["stamp-ring"]} ${styles["stamp-ring--inner"]}`}
        />

        <text className={`${styles["stamp-curve"]} ${styles["stamp-curve--top"]}`}>
          <textPath href="#stampTop" startOffset="50%" textAnchor="middle">
            SOFTWARE ENGINEER
          </textPath>
        </text>
        <text className={`${styles["stamp-curve"]} ${styles["stamp-curve--bottom"]}`}>
          <textPath href="#stampBottom" startOffset="50%" textAnchor="middle">
            BUILDING FOR WEB &amp; MOBILE
          </textPath>
        </text>

        <text
          x="150"
          y="129"
          className={styles["stamp-name"]}
          textAnchor="middle"
          dominantBaseline="central"
        >
          JAYESH
        </text>
        <text
          x="150"
          y="171"
          className={styles["stamp-name"]}
          textAnchor="middle"
          dominantBaseline="central"
        >
          JIDGE
        </text>

        <text x="58" y="156" className={styles["stamp-star"]} textAnchor="middle">
          ✦
        </text>
        <text x="242" y="156" className={styles["stamp-star"]} textAnchor="middle">
          ✦
        </text>
      </svg>
    </div>
  );
}
