import { portfolio } from "@/data/portfolio";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Hero() {
  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="hero-copy">
        <p className="hero-kicker">Hi, I’m</p>
        <h1 className="hero-name">
          <span className="name-first">{portfolio.firstName}</span>
          <span className="name-last">{portfolio.lastName}</span>
        </h1>
        <p className="hero-role">
          Full-stack <span className="role-accent">Software Engineer</span>
        </p>
        <p className="hero-bio">
          {portfolio.bioParts.map((part, i) =>
            part.emphasis ? (
              <strong key={i}>{part.text}</strong>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
          <strong>{portfolio.companyShort}</strong>.
        </p>
        <SocialLinks links={[...portfolio.socials]} className="hero-socials" />
        <div className="hero-actions">
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
            Let’s Talk
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="portrait-stage">
          <span className="ring ring-1" />
          <span className="ring ring-2" />
          <span className="ring ring-3" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="portrait-halo"
            src={portfolio.images.portrait}
            alt=""
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="portrait-cutout"
            src={portfolio.images.portrait}
            alt="Portrait of Jayesh Jidge"
            width={925}
            height={1600}
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
