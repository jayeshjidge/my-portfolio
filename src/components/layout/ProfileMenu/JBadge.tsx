"use client";

/* eslint-disable @next/next/no-img-element */

/**
 * JBadge — the circular identity mark: a headshot of Jayesh on a dark
 * ring. Reused at two sizes (the corner control button and the profile
 * card header). `size` sets the diameter in px.
 *
 * The source is a pre-cropped square avatar (public/images/jayesh-avatar.jpg,
 * cropped from IMG_1625.jpg) so the head frames cleanly in the circle.
 */

import "./JBadge.css";

export default function JBadge({
  size = 46,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`jbadge${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        className="jbadge-photo"
        src="/images/jayesh-avatar.jpg"
        alt=""
        width={size}
        height={size}
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
