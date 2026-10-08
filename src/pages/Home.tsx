import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { NeuralField } from "../components/NeuralField";
import { CopyEmail } from "../components/Chrome";
import { Link } from "../lib/router";
import {
  certifications,
  education,
  experience,
  marquee,
  principles,
  profile,
  projects,
  recognition,
  socials,
  toolkit,
} from "../content";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease },
};

function SectionHead({ index, title, id }: { index: string; title: React.ReactNode; id: string }) {
  return (
    <div className="section__head" id={id}>
      <p className="mono muted">({index})</p>
      <motion.h2 className="section__title" {...fadeUp}>
        {title}
      </motion.h2>
    </div>
  );
}

/* ---------------- hero ---------------- */

const rotating = ["useful", "secure", "scalable", "shipped"];

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % rotating.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="rotator serif accent">
      <AnimatePresence initial={false}>
        <motion.span
          key={rotating[i]}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease }}
        >
          {rotating[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Hero() {
  const line = (delay: number) => ({
    initial: { y: "110%" },
    animate: { y: "0%" },
    transition: { duration: 1.1, delay, ease },
  });
  return (
    <section className="hero">
      <NeuralField />
      <div className="hero__inner">
        <motion.div
          className="hero__kicker mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <span className="accent">●</span>
          <span>{profile.role}</span>
          <span className="muted">/ Builder of real-world AI systems</span>
        </motion.div>
        <h1 className="hero__name" aria-label={profile.name}>
          <span className="line">
            <motion.span {...line(0.1)}>Harshita</motion.span>
          </span>
          <span className="line">
            <motion.span {...line(0.22)}>
              Phadtare<span className="serif accent">.</span>
            </motion.span>
          </span>
        </h1>
        <motion.div
          className="hero__bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease }}
        >
          <p className="hero__lede">
            I build AI products that solve real problems. Fast to ship, engineered to be <Rotator />
          </p>
          <div className="hero__meta">
            <p className="mono muted">Currently</p>
            <p>MS Artificial Intelligence, RMIT</p>
          </div>
          <div className="hero__meta">
            <p className="mono muted">Previously</p>
            <p>SWE Intern, AllHome</p>
          </div>
          <div className="scroll-cue mono muted">
            <i /> Move · click
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((m, i) => (
          <span className="marquee__item" key={i}>
            {m}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- about ---------------- */

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span className="w" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const text =
    "I care about the problem before the model. I use AI to move fast, then system design, architecture and security to make sure what I build actually holds up.";
  const words = text.split(" ");
  return (
    <p className="statement" ref={ref}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="section__head">
        <p className="mono muted">(01) About</p>
        <Statement />
      </div>

      <div className="about-grid">
        <motion.figure className="portrait" {...fadeUp}>
          <img src="/harshita.png" alt="Portrait of Harshita Phadtare" loading="lazy" />
          <figcaption className="mono">Hover for colour</figcaption>
        </motion.figure>
        <div className="about-copy">
          {profile.about.map((p, i) => (
            <motion.p key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
              {p}
            </motion.p>
          ))}
          <motion.div {...fadeUp} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">
              Résumé ↗
            </a>
            <a className="btn" href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("scroll-to", { detail: "contact" })); }}>
              Get in touch →
            </a>
          </motion.div>
        </div>
      </div>

      <div className="principles">
        {principles.map((p, i) => (
          <motion.div className="principle" key={p.k} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
            <span className="mono accent">{p.k}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- work ---------------- */

function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  return (
    <section className="section" id="work" onPointerMove={(e) => { x.set(e.clientX + 24); y.set(e.clientY - 120); }}>
      <SectionHead index="02" id="work-head" title={<>Selected <span className="serif">work</span></>} />
      <div className="work-list" onPointerLeave={() => setHovered(null)}>
        {projects.map((p, i) => (
          <motion.div key={p.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
            <Link to={`/work/${p.id}`} className="work-row" data-cursor="View" onPointerEnter={() => setHovered(i)}>
              <span className="work-row__idx mono muted">{p.index}</span>
              <span className="work-row__title">
                {p.title}
                <em>{p.tagline}</em>
              </span>
              <span className="work-row__tags">
                {p.tags.map((t) => (
                  <span className="chip" key={t}>{t}</span>
                ))}
              </span>
              <span className="work-row__year mono muted">
                {p.live && <span className="live-dot">Live</span>}
                {p.year}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            className="preview"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
            transition={{ duration: 0.35, ease }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={projects[hovered].image}
                src={projects[hovered].image}
                alt=""
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: "absolute", inset: 0 }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- experience ---------------- */

function Experience() {
  return (
    <section className="section" id="experience">
      <SectionHead index="03" id="experience-head" title={<>Where I've <span className="serif">built</span></>} />
      <div className="xp">
        {experience.map((e) => (
          <motion.article className="xp-row" key={e.company} {...fadeUp}>
            <div>
              <h3>{e.company}</h3>
              <p className="mono muted" style={{ marginTop: 10 }}>{e.period}</p>
            </div>
            <p className="xp-row__role">{e.role}</p>
            <div>
              <ul>
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className="chips">
                {e.stack.map((s) => (
                  <span className="chip" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="section" id="education">
      <SectionHead index="04" id="education-head" title={<>Learning &amp; <span className="serif">recognition</span></>} />
      <div className="split">
        <div>
          <p className="mono muted" style={{ marginBottom: 8 }}>Education</p>
          {education.map((ed) => (
            <motion.div className="edu-card" key={ed.school} {...fadeUp}>
              <h3>{ed.school}</h3>
              <p className="degree">{ed.degree}</p>
              <div className="row mono">
                <span className="muted">{ed.place} · {ed.period}</span>
                <span className={ed.note === "In progress" ? "badge-now" : "muted"}>{ed.note}</span>
              </div>
            </motion.div>
          ))}
          <p className="mono muted sub-head">Certifications</p>
          <div className="list-rows">
            {certifications.map((c) => (
              <div key={c}>
                <h4>{c}</h4>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mono muted" style={{ marginBottom: 8 }}>Recognition &amp; community</p>
          <div className="list-rows">
            {recognition.map((r) => (
              <motion.div key={r.title} {...fadeUp}>
                <h4>{r.title}</h4>
                <span className="mono muted">{r.year}</span>
                <p>{r.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="section" id="toolkit">
      <SectionHead index="05" id="toolkit-head" title={<>The <span className="serif">toolkit</span></>} />
      <div className="toolkit">
        {toolkit.map((t, i) => (
          <motion.div className="tool-cell" key={t.group} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}>
            <p className="mono muted">{t.group}</p>
            <ul>
              {t.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <footer className="contact" id="contact">
      <p className="mono" style={{ marginBottom: 24 }}>(06) Contact</p>
      <motion.h2 className="contact__big" {...fadeUp}>
        Got a real problem?
        <br />
        <span className="serif">Let's build it.</span>
      </motion.h2>
      <div className="contact__row">
        <div>
          <p className="mono" style={{ marginBottom: 12, opacity: 0.7 }}>Say hello</p>
          <CopyEmail />
        </div>
        <div className="contact__links">
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              {s.label} <span>↗</span>
            </a>
          ))}
        </div>
        <div>
          <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">
            Download résumé ↓
          </a>
        </div>
      </div>
      <div className="footer-bar mono">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.location}</span>
        <span>Designed &amp; engineered by me</span>
      </div>
    </footer>
  );
}

export function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Work />
      <Experience />
      <Education />
      <Toolkit />
      <Contact />
    </main>
  );
}
