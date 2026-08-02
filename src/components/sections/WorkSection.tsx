import Image from "next/image";
import { portfolio } from "@/data/portfolio";
import { ImpactPanel } from "@/components/sections/ImpactPanel";
import { Reveal, RevealGroup, RevealChild } from "@/components/motion/Reveal";

export function WorkSection() {
  return (
    <>
      <Reveal direction="up" amount={0.4}>
        <div className="section-head">
          <p className="eyebrow">What I bring</p>
          <h2>Work, craft &amp; impact</h2>
        </div>
      </Reveal>

      <section className="bento" id="work" aria-label="Portfolio">
        <Reveal className="span-5 row-2" direction="up" amount={0.15}>
          <ImpactPanel stats={[...portfolio.impact]} />
        </Reveal>

        <Reveal className="span-7" direction="up" amount={0.15}>
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Present · Jio Platforms</p>
                <h2 className="panel-title">What I&rsquo;m building now</h2>
              </div>
              <a className="panel-link" href="#projects">
                View All
              </a>
            </div>
            <RevealGroup className="beat-list" stagger={0.12} amount={0.15}>
              {portfolio.jioBeats.map((beat) => (
                <RevealChild
                  className="beat"
                  direction="up"
                  key={beat.title}
                >
                  {beat.avatar ? (
                    <Image
                      className="beat-avatar"
                      src={beat.avatar}
                      alt=""
                      width={44}
                      height={44}
                    />
                  ) : null}
                  <div>
                    <h3>{beat.title}</h3>
                    <p>{beat.body}</p>
                  </div>
                  <a className="btn btn-soft" href="#projects">
                    Details
                  </a>
                </RevealChild>
              ))}
            </RevealGroup>
          </article>
        </Reveal>

        <Reveal className="span-7" direction="up" amount={0.2}>
          <article className="panel">
            <p className="panel-label">Delivery focus</p>
            <p className="metric-big">90%</p>
            <p className="metric-sub">
              Test coverage · <em>↑ quality since day one</em>
            </p>
            <div className="scale" aria-hidden="true">
              <span>60</span>
              <div className="scale-track">
                <div className="scale-fill" />
                <div className="scale-thumb" />
              </div>
              <span>100</span>
            </div>
          </article>
        </Reveal>

        <Reveal className="span-5" direction="left" amount={0.15}>
          <article className="panel feature-panel">
            <div className="feature-media">
              <Image
                src={portfolio.images.feature}
                alt="Developer workspace with code on screen"
                fill
                sizes="(max-width: 1100px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="feature-content">
              <span
                className="badge badge-accent"
                style={{ alignSelf: "flex-start", marginBottom: 8 }}
              >
                Focus area
              </span>
              <h2 className="panel-title">Frontend systems that scale</h2>
              <p className="panel-body">
                React, Redux, Next.js, and micro frontends — fast loads, clear
                architecture.
              </p>
              <a
                className="btn btn-glass"
                href="#craft"
                style={{ alignSelf: "flex-start" }}
              >
                Explore craft →
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal className="span-5" direction="right" amount={0.15}>
          <article className="panel" id="craft">
            <div className="panel-head">
              <div>
                <p className="panel-label">Craft</p>
                <h2 className="panel-title">How the work gets built</h2>
              </div>
            </div>
            <RevealGroup className="craft-list" stagger={0.1} amount={0.15}>
              {portfolio.craft.map((item) => (
                <RevealChild className="craft-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </RevealChild>
              ))}
            </RevealGroup>
          </article>
        </Reveal>

        <Reveal className="span-7" direction="up" amount={0.15}>
          <article className="panel" id="projects">
            <div className="panel-head">
              <div>
                <p className="panel-label">Selected work</p>
                <h2 className="panel-title">Projects worth opening</h2>
              </div>
              <a className="panel-link" href="#contact">
                View All
              </a>
            </div>
            <RevealGroup className="project-stack" stagger={0.1} amount={0.15}>
              {portfolio.projects.map((project) => (
                <RevealChild key={project.title}>
                  <a className="project-row" href="#contact">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.body}</p>
                      <div className="project-tags">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span className="project-cta">View</span>
                  </a>
                </RevealChild>
              ))}
            </RevealGroup>
          </article>
        </Reveal>

        <Reveal className="span-5" direction="left" amount={0.15}>
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Path</p>
                <h2 className="panel-title">Where it began</h2>
              </div>
            </div>
            <RevealGroup className="path-list" stagger={0.12} amount={0.15}>
              {portfolio.path.map((row) => (
                <RevealChild as="article" className="path-row" key={row.role}>
                  <p className="path-when">{row.when}</p>
                  <h3>{row.role}</h3>
                  <p className="path-place">{row.place}</p>
                  <p className="path-body">{row.body}</p>
                </RevealChild>
              ))}
            </RevealGroup>
          </article>
        </Reveal>

        <Reveal className="span-7" direction="right" amount={0.15}>
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Education</p>
                <h2 className="panel-title">Foundations</h2>
              </div>
            </div>
            <div className="beat" style={{ marginTop: 4 }}>
              <span
                className="badge badge-accent"
                style={{
                  width: 44,
                  height: 44,
                  justifyContent: "center",
                  padding: 0,
                  borderRadius: "50%",
                }}
              >
                🎓
              </span>
              <div>
                <h3>{portfolio.education.degree}</h3>
                <p>{portfolio.education.school}</p>
              </div>
              <span className="badge badge-success">
                GPA {portfolio.education.gpa}
              </span>
            </div>
          </article>
        </Reveal>
      </section>
    </>
  );
}
