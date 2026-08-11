"use client";

import { useEffect, useState } from "react";
import { portfolio } from "@/data/portfolio";

export function Header() {
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => {
      const ids = portfolio.nav.map((n) => n.href.slice(1));
      let current = "#home";
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

  return (
    <header className="topbar is-paper" id="top">
      <nav className="nav-pill" aria-label="Primary">
        {portfolio.nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={active === item.href ? "is-active" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
