"use client";

/**
 * Contact — the closing "let's talk" section.
 *
 * A two-column, full-bleed layout on the paper grid: the invite copy + real
 * contact channels on the left, and an interactive scattered collage of my
 * work (little window mockups) and 3D desk props on the right. Everything
 * wakes on scroll-into-view; the collage adds scroll + pointer parallax and
 * per-item hover rewards. Composition shell only — each piece is its own file.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { portfolio } from "@/data/portfolio";
import { leftGroup, leftItem } from "./contactMotion";
import type { ContactRowData } from "./constants";
import ContactIntro from "./Intro/ContactIntro";
import ContactRow from "./Row/ContactRow";
import ContactCollage from "./Collage/ContactCollage";
import "./Contact.css";

export default function Contact() {
  const reduce = useReducedMotion();
  const leftRef = useRef<HTMLDivElement | null>(null);
  const leftInView = useInView(leftRef, { once: true, amount: 0.3 });

  const rows: ContactRowData[] = [
    {
      id: "email",
      label: "Email",
      value: portfolio.contact.email,
      href: `mailto:${portfolio.contact.email}`,
      accent: "lavender",
      icon: "mail",
    },
    {
      id: "phone",
      label: "Phone",
      value: portfolio.contact.phone,
      href: `tel:${portfolio.contact.phone.replace(/\s+/g, "")}`,
      accent: "mint",
      icon: "phone",
    },
    {
      id: "location",
      label: "Location",
      value: "Mumbai, India",
      href: "https://maps.google.com/?q=Mumbai,India",
      accent: "peach",
      icon: "pin",
      external: true,
    },
  ];

  const rowItems = rows.map((row) => (
    <li key={row.id}>
      <ContactRow row={row} />
    </li>
  ));

  return (
    <section className="contact" id="contact" data-nav-offset="0" aria-label="Contact">
      <div className="contact-inner">
        <div className="contact-grid">
          <motion.div
            ref={leftRef}
            className="contact-left"
            variants={leftGroup(Boolean(reduce))}
            initial="hidden"
            animate={leftInView ? "visible" : "hidden"}
          >
            <motion.div variants={leftItem(Boolean(reduce))}>
              <ContactIntro />
            </motion.div>

            <motion.ul className="contact-rows" variants={leftItem(Boolean(reduce))}>
              {rowItems}
            </motion.ul>

            <motion.p className="contact-signoff" variants={leftItem(Boolean(reduce))}>
              Thanks for stopping by!
              <br />
              Looking forward to connecting with you.{" "}
              <span aria-hidden="true">💜</span>
            </motion.p>
          </motion.div>

          <div className="contact-right">
            <ContactCollage />
          </div>
        </div>
      </div>
    </section>
  );
}
