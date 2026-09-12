"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { portfolio } from "@/data/portfolio";
import ProfileMenu from "../ProfileMenu/index";

export default function Header() {
  const [active, setActive] = useState("#home");
  const lenis = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const ids = portfolio.nav.map((n) => n.href.slice(1));
      let current = "#home"; // default to Home while near the top of the page
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) current = `#${id}`;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth-scroll to the section WITHOUT pushing a #hash onto the URL.
  const onNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const el = document.getElementById(href.slice(1));
    if (!el) return; // target not on this page — fall back to default nav
    e.preventDefault();
    setActive(href);
    // Full-viewport sections carry their own top padding for the nav and opt to
    // snap flush to the top via data-nav-offset.
    const offset = el.dataset.navOffset ? Number(el.dataset.navOffset) : -80;
    if (lenis) lenis.scrollTo(el, { offset });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="topbar is-paper" id="top">
      <motion.nav
        className="nav-pill"
        aria-label="Primary"
        initial={reduce ? false : { y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.05 }}
      >
        {portfolio.nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => onNavClick(e, item.href)}
            className={active === item.href ? "is-active" : undefined}
          >
            {item.label}
          </a>
        ))}
      </motion.nav>
      <ProfileMenu />
    </header>
  );
}
