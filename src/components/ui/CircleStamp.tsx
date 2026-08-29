import "./CircleStamp.css";

/**
 * CircleStamp — a vintage rubber-stamp seal for the footer.
 * "SOFTWARE ENGINEER" curves along the top, "BUILDING FOR WEB & MOBILE"
 * along the bottom, with "JAYESH / JIDGE" stacked in the middle and a small
 * star flanking each side. Curved text uses SVG <textPath> around arcs.
 */
export default function CircleStamp() {
  return (
    <div className="stamp">
      <svg
        viewBox="0 0 300 300"
        className="stamp-svg"
        role="img"
        aria-label="Jayesh Jidge — Software Engineer · Building for web & mobile"
      >
        <defs>
          {/* top arc (left → right, over the top) */}
          <path id="stampTop" d="M 42 150 A 108 108 0 0 1 258 150" />
          {/* bottom arc (left → right, under the bottom) */}
          <path id="stampBottom" d="M 46 150 A 104 104 0 0 0 254 150" />
        </defs>

        <circle cx="150" cy="150" r="143" className="stamp-ring" />
        <circle cx="150" cy="150" r="135" className="stamp-ring stamp-ring--inner" />

        <text className="stamp-curve stamp-curve--top">
          <textPath href="#stampTop" startOffset="50%" textAnchor="middle">
            SOFTWARE ENGINEER
          </textPath>
        </text>
        <text className="stamp-curve stamp-curve--bottom">
          <textPath href="#stampBottom" startOffset="50%" textAnchor="middle">
            BUILDING FOR WEB &amp; MOBILE
          </textPath>
        </text>

        <text x="150" y="147" className="stamp-name" textAnchor="middle">
          JAYESH
        </text>
        <text x="150" y="192" className="stamp-name" textAnchor="middle">
          JIDGE
        </text>

        <text x="58" y="156" className="stamp-star" textAnchor="middle">
          ✦
        </text>
        <text x="242" y="156" className="stamp-star" textAnchor="middle">
          ✦
        </text>
      </svg>
    </div>
  );
}
