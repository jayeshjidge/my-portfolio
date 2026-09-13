/**
 * MetalClasp — the chrome swivel clasp the badge strap threads through.
 * Pure presentational SVG; the gradient id is namespaced per badge so
 * multiple chapters can render without id collisions.
 */

export default function MetalClasp({ id }: { id: string }) {
  const gid = `chrome-${id}`;
  return (
    <svg
      className="exp-clasp-metal"
      viewBox="0 0 40 60"
      width="40"
      height="60"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dfe4ea" />
          <stop offset="0.22" stopColor="#9aa3ad" />
          <stop offset="0.5" stopColor="#f6f8fb" />
          <stop offset="0.78" stopColor="#828c98" />
          <stop offset="1" stopColor="#c6cdd5" />
        </linearGradient>
      </defs>
      {/* top crimp that grips the strap */}
      <rect
        x="11"
        y="0"
        width="18"
        height="14"
        rx="3"
        fill={`url(#${gid})`}
        stroke="#6a727d"
        strokeWidth="0.6"
      />
      {/* neck */}
      <rect x="17.5" y="12" width="5" height="10" rx="2" fill={`url(#${gid})`} />
      {/* swivel ring */}
      <circle
        cx="20"
        cy="36"
        r="12"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="5"
      />
      <circle
        cx="20"
        cy="36"
        r="12"
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.6"
      />
    </svg>
  );
}
