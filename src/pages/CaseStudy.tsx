import { motion } from "framer-motion";
import { Link } from "../lib/router";
import { projects, type Project } from "../content";
import { Contact } from "./Home";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease },
};

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div className="case-body" {...fadeUp}>
      <p className="mono muted">{label}</p>
      <div className="prose">{children}</div>
    </motion.div>
  );
}

export function CaseStudy({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.id === project.id);
  const next = projects[(i + 1) % projects.length];

  return (
    <main>
      <section className="case-hero">
        <Link to="/#work" className="case-back mono muted">
          ← All work
        </Link>
        <p className="mono accent" style={{ marginBottom: 16 }}>
          Case study {project.index} / {String(projects.length).padStart(2, "0")}
        </p>
        <h1 className="case-title" style={{ overflow: "hidden", paddingBottom: "0.05em" }}>
          <motion.span style={{ display: "inline-block" }} initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease }}>
            {project.title}
          </motion.span>
        </h1>
        <motion.p className="case-tagline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease }}>
          {project.tagline}
        </motion.p>

        <motion.div className="case-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
          <div>
            <p className="mono muted">Role</p>
            <p>{project.role}</p>
          </div>
          <div>
            <p className="mono muted">Year</p>
            <p>{project.year}</p>
          </div>
          <div>
            <p className="mono muted">Focus</p>
            <p>{project.tags.join(", ")}</p>
          </div>
          <div>
            <p className="mono muted">Links</p>
            <p style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live site ↗</a>}
              {project.github && <a href={project.github} target="_blank" rel="noreferrer">Source ↗</a>}
              {project.article && <a href={project.article} target="_blank" rel="noreferrer">Article ↗</a>}
            </p>
          </div>
        </motion.div>
      </section>

      <motion.div className="case-media" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.1, ease }}>
        {project.video ? (
          <video src={project.video} poster={project.image} autoPlay muted loop playsInline controls preload="metadata" />
        ) : (
          <img src={project.image} alt={`${project.title} screenshot`} />
        )}
      </motion.div>

      <section className="section">
        <div className="metrics">
          {project.metrics.map((m) => (
            <motion.div className="metric" key={m.label} {...fadeUp}>
              <strong>{m.value}</strong>
              <span className="muted">{m.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} style={{ marginTop: "clamp(56px, 8vw, 100px)" }}>
          <p className="mono muted">System flow</p>
          <div className="pipeline">
            <div className="pipeline__track">
              <span className="pipeline__line" />
              <span className="pipeline__packet" />
              {project.pipeline.map((s) => (
                <span className="pipeline__node" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <div style={{ marginTop: "clamp(56px, 8vw, 100px)" }}>
          <Block label="The problem">
            {project.overview.map((p) => <p key={p}>{p}</p>)}
          </Block>
          <Block label="What I built">
            <ul style={{ display: "grid", gap: 16 }}>
              {project.contribution.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Block>
          <Block label="Hard parts">
            {project.challenges.map((p) => <p key={p}>{p}</p>)}
          </Block>
          <Block label="Stack">
            <div className="chips" style={{ marginTop: 0 }}>
              {project.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>
          </Block>
          {project.gallery && (
            <Block label="Screens">
              <div className="gallery">
                {project.gallery.map((g) => {
                  const { src, caption } = typeof g === "string" ? { src: g, caption: "" } : g;
                  return (
                    <figure key={src}>
                      <img src={src} alt={caption || `${project.title} screen`} loading="lazy" />
                      {caption && <figcaption className="mono muted">{caption}</figcaption>}
                    </figure>
                  );
                })}
              </div>
            </Block>
          )}
        </div>
      </section>

      <Link to={`/work/${next.id}`} className="next-project" data-cursor="Next">
        <p className="mono muted" style={{ marginBottom: 16 }}>Next project →</p>
        <p className="next-project__title">{next.title}</p>
      </Link>
      <Contact />
    </main>
  );
}
