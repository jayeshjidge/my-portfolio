import { portfolio } from "@/data/portfolio";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-cta" id="contact">
      <div className="footer-inner">
        <p className="footer-eyebrow">Have a project in mind?</p>
        <h2 className="footer-title">
          LET’S WORK
          <br />
          <span className="footer-italic">together</span>
        </h2>
        <p className="footer-connect">Connect with me</p>
        <a className="footer-email" href={`mailto:${portfolio.contact.email}`}>
          {portfolio.contact.email}
        </a>
        <SocialLinks links={[...portfolio.socials]} />
      </div>
      <div className="footer-bar">
        <span>
          © {year} <strong>{portfolio.name}</strong>
        </span>
        <span>Designed with care &amp; clean code</span>
        <nav className="footer-nav" aria-label="Footer">
          {portfolio.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
