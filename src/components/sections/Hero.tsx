"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { portfolio } from "@/data/portfolio";
import { SocialLinks } from "@/components/ui/SocialLinks";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const item = (y = 24) => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  },
});

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [0, -60]
  );
  const portraitScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [1, 1] : [1, 0.94]
  );
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [0, 80]
  );
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    prefersReduced ? [1, 1, 1] : [1, 0.6, 0]
  );

  return (
    <motion.section
      ref={heroRef}
      className="hero"
      id="home"
      aria-label="Introduction"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="hero-copy"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.p className="hero-kicker" variants={item(16)}>
          Hi, I&rsquo;m
        </motion.p>
        <motion.h1 className="hero-name" variants={item(22)}>
          <span className="name-first">{portfolio.firstName}</span>
          <span className="name-last">{portfolio.lastName}</span>
        </motion.h1>
        <motion.p className="hero-role" variants={item(18)}>
          Full-stack <span className="role-accent">Software Engineer</span>
        </motion.p>
        <motion.p className="hero-bio" variants={item(18)}>
          {portfolio.bioParts.map((part, i) =>
            part.emphasis ? (
              <strong key={i}>{part.text}</strong>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
          <strong>{portfolio.companyShort}</strong>.
        </motion.p>
        <motion.div variants={item(16)}>
          <SocialLinks
            links={[...portfolio.socials]}
            className="hero-socials"
          />
        </motion.div>
        <motion.div className="hero-actions" variants={item(14)}>
          <a className="btn btn-primary" href="#contact">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v13M12 16l4-4M12 16l-4-4M5 21h14" />
            </svg>
            Download CV
          </a>
          <a className="btn btn-glass" href="#contact">
            Let&rsquo;s Talk
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-visual"
        aria-hidden="true"
        style={{ y: portraitY, scale: portraitScale }}
      >
        <div className="portrait-stage">
          <motion.span
            className="ring ring-1"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          <motion.span
            className="ring ring-2"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.3,
              delay: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          <motion.span
            className="ring ring-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.4,
              delay: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            className="portrait-halo"
            src={portfolio.images.portrait}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.4, delay: 0.2 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            className="portrait-cutout"
            src={portfolio.images.portrait}
            alt="Portrait of Jayesh Jidge"
            width={925}
            height={1600}
            decoding="async"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </motion.div>

      <ScrollCue />
    </motion.section>
  );
}

function ScrollCue() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="scroll-cue"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      aria-hidden="true"
    >
      <span>Scroll</span>
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={
          prefersReduced ? undefined : { y: [0, 4, 0], opacity: [0.6, 1, 0.6] }
        }
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 5v14M6 13l6 6 6-6" />
      </motion.svg>
    </motion.div>
  );
}
