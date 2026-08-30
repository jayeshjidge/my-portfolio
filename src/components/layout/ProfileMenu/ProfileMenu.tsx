"use client";

/**
 * ProfileMenu — minimalist identity control pinned to the extreme
 * top-right corner.
 *
 * Collapsed: just the circular "j" badge with a soft lavender glow.
 * Expanded: a compact floating card (identity + LinkedIn / GitHub /
 * Download Resume) with a hand-drawn dashed arrow pointing back up at
 * the badge. Opens on click, closes on outside-click or Escape.
 *
 * Motion mirrors the rest of the page: a spring pop on load, a
 * top-right-anchored scale/stagger on open, and everything collapses to
 * an instant, transform-free state under prefers-reduced-motion.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import JBadge from "./JBadge";
import "./ProfileMenu.css";

const EASE = [0.16, 1, 0.3, 1] as const;

type ProfileLink = {
  label: string;
  href: string;
  icon: ReactNode;
  download?: boolean;
};

const LINKS: ProfileLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jayesh-jidge/",
    icon: <FaLinkedin color="#0A66C2" />,
  },
  {
    label: "GitHub",
    href: "https://github.com/jayeshjidge",
    icon: <FaGithub color="#181717" />,
  },
  {
    label: "Download Resume",
    href: "/resume/jayesh_jidge_resume.pdf",
    download: true,
    icon: <FiDownload color="#7c3aed" />,
  },
];

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cardVar: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.12 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        hidden: { opacity: 0, y: -8, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: EASE,
            staggerChildren: 0.05,
            delayChildren: 0.08,
          },
        },
        exit: {
          opacity: 0,
          y: -6,
          scale: 0.97,
          transition: { duration: 0.16, ease: "easeIn" },
        },
      };

  const itemVar: Variants = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
      };

  const linkItems = LINKS.map((link) => (
    <motion.a
      key={link.label}
      className="pm-item"
      href={link.href}
      role="menuitem"
      variants={itemVar}
      {...(link.download
        ? { download: true }
        : { target: "_blank", rel: "noreferrer" })}
      onClick={() => setOpen(false)}
    >
      <span className="pm-item-ico">{link.icon}</span>
      <span className="pm-item-label">{link.label}</span>
    </motion.a>
  ));

  return (
    <div className="profile-menu" ref={rootRef}>
      <motion.button
        type="button"
        className="pm-badge"
        aria-label={open ? "Close profile menu" : "Open profile menu"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        initial={reduce ? false : { scale: 0, opacity: 0, rotate: -35 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 15, delay: 0.35 }
        }
        whileHover={reduce ? undefined : { scale: 1.07 }}
        whileTap={reduce ? undefined : { scale: 0.92 }}
      >
        <JBadge size={56} />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.svg
            key="arrow"
            className="pm-arrow"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 4 }}
            transition={{
              duration: reduce ? 0.12 : 0.32,
              ease: EASE,
              delay: reduce ? 0 : 0.14,
            }}
          >
            <path
              className="pm-arrow-line"
              d="M6 54 C 12 32 28 18 50 12"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              className="pm-arrow-head"
              d="M50 12 L41.5 9.6 M50 12 L43.4 18.4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ) : null}

        {open ? (
          <motion.div
            key="card"
            className="pm-card"
            role="menu"
            aria-label="Profile"
            variants={cardVar}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div className="pm-head" variants={itemVar}>
              <JBadge size={40} />
              <span className="pm-id">
                <span className="pm-name">Jayesh Jidge</span>
                <span className="pm-role">Software Engineer</span>
              </span>
            </motion.div>

            <div className="pm-divider" aria-hidden="true" />

            <div className="pm-links">{linkItems}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
