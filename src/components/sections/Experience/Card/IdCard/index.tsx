import Image from "next/image";
import { portfolio, type ExperienceItem } from "@/data/portfolio";
import styles from "./index.module.css";

/**
 * IdCard — the badge face that hangs from the lanyard. Photo up top, a
 * round company chip overlapping its corner, then name / role / employer /
 * dates and the ID code with a little "favourite" heart.
 *
 * NOTE: this section intentionally uses Jayesh's real photo (an explicit
 * exception to the site-wide no-photo rule — this is the factual résumé).
 */
export default function IdCard({ item }: { item: ExperienceItem }) {
  const isRaster = item.logo.endsWith(".png") || item.logo.endsWith(".jpg");
  return (
    <div className={styles.idcard}>
      <span className={styles["idcard-hole"]} aria-hidden="true" />

      <div className={styles["idcard-photo"]}>
        <Image
          src={item.photo}
          alt={`${portfolio.name} — member photo`}
          width={400}
          height={520}
          className={styles["idcard-photo-img"]}
          draggable={false}
          style={{
            objectPosition: item.photoPos,
            transform: `scale(${item.photoScale})`,
            transformOrigin: item.photoOrigin,
          }}
        />
      </div>

      {/* Company chip — sibling of the photo (not inside it) so the
          overflow:hidden crop can't clip it where it overlaps the seam. */}
      <span className={styles["idcard-chip"]} aria-hidden="true">
        <Image
          src={item.logo}
          alt=""
          width={64}
          height={64}
          draggable={false}
          className={
            isRaster
              ? `${styles["idcard-chip-img"]} ${styles["idcard-chip-img--raster"]}`
              : styles["idcard-chip-img"]
          }
        />
      </span>

      <div className={styles["idcard-info"]}>
        <p className={styles["idcard-name"]}>{portfolio.name}</p>
        <span
          className={styles["idcard-underline"]}
          style={{ background: item.accent }}
          aria-hidden="true"
        />
        <p className={styles["idcard-role"]} style={{ color: item.accent }}>
          {item.role}
        </p>
        <p className={styles["idcard-company"]}>{item.company}</p>

        <p className={styles["idcard-meta"]}>
          <svg viewBox="0 0 24 24" className={styles["idcard-cal"]} aria-hidden="true">
            <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
            <path d="M3 9h18M8 2.5v4M16 2.5v4" />
          </svg>
          {item.when} · {item.location}
        </p>

        <div className={styles["idcard-foot"]}>
          <span className={styles["idcard-id"]}>ID {item.badgeId}</span>
          <svg viewBox="0 0 24 24" className={styles["idcard-heart"]} aria-hidden="true">
            <path d="M12 20s-7-4.35-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
