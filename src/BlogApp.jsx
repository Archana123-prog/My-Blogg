import ThreeBackground from "./ThreeBackground";
import * as THREE from "three";
import { useState, useEffect, useRef } from "react";

/* ─── DATA ─────────────────────────────────────────── */
const PROJECTS = [
  {
    emoji: "🔐",
    tag: "CYBER SECURITY",
    title: "SecureVault App",
    desc: "A password manager with AES-256 encryption, breach detection, and a clean dashboard built to keep your digital life safe.",
    color: "from-red to-yellow",
    glow: "rgba(255,107,107,0.2)",
    demo: "#",
    github: "#",
  },
  {
    emoji: "🤖",
    tag: "AI / MACHINE LEARNING",
    title: "AI Blog Summarizer",
    desc: "Paste any article URL and get a clean 5-point summary using NLP. Saves hours of reading every week.",
    color: "from-blue to-purple",
    glow: "rgba(77,150,255,0.2)",
    demo: "#",
    github: "#",
  },
  {
    emoji: "🌐",
    tag: "WEB DEVELOPMENT",
    title: "Dev Portfolio v2",
    desc: "This very website — built with React, hooks, and zero external UI libraries. Fully responsive with silky animations.",
    color: "from-green to-blue",
    glow: "rgba(107,203,119,0.2)",
    demo: "#",
    github: "#",
  },
];

const SKILLS = [
  { label: "HTML / CSS", color: "#ff6b6b" },
  { label: "JavaScript", color: "#ffd93d" },
  { label: "React", color: "#4d96ff" },
  { label: "Node.js", color: "#6bcb77" },
  { label: "Python", color: "#c77dff" },
  { label: "AI / ML", color: "#ff6b6b" },
  { label: "Cyber Security", color: "#4d96ff" },
];

/* ─── HOOKS ─────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useMouse() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

/* ─── STYLES (injected once) ─────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0d0d0d;
    color: #f0f0f0;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0d0d0d; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#ff6b6b, #4d96ff); border-radius: 10px; }

  @keyframes float {
    0%,100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-28px) scale(1.06); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bgShift {
    0%   { transform: scale(1) rotate(0deg); }
    100% { transform: scale(1.06) rotate(1.5deg); }
  }
  @keyframes scrollLine {
    0%,100% { transform: scaleY(1); opacity: 1; }
    50%      { transform: scaleY(0.4); opacity: 0.3; }
  }
  @keyframes pulse {
    0%,100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .reveal { opacity: 0; transform: translateY(40px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .nav-link { color: #888; text-decoration: none; font-size: .88rem; letter-spacing: .05em; transition: color .3s; }
  .nav-link:hover, .nav-link.active { color: #f0f0f0; }

  .btn { display: inline-block; padding: .85rem 2rem; border-radius: .5rem; font-family: 'DM Sans', sans-serif; font-size: .95rem; font-weight: 500; cursor: pointer; transition: all .3s; text-decoration: none; border: none; }
  .btn-primary { background: linear-gradient(135deg, #ff6b6b, #4d96ff); color: white; }
  .btn-primary:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(255,107,107,.35); }
  .btn-outline { background: transparent; color: #f0f0f0; border: 1px solid rgba(255,255,255,.2); }
  .btn-outline:hover { border-color: #4d96ff; color: #4d96ff; transform: translateY(-4px); }

  .project-card { background: #141414; border-radius: 1.25rem; overflow: hidden; border: 1px solid rgba(255,255,255,.07); transition: transform .35s, box-shadow .35s; cursor: pointer; }
  .project-card:hover { transform: translateY(-10px); }

  .card-link { font-size: .82rem; color: #f0f0f0; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,.25); padding-bottom: 2px; transition: color .3s, border-color .3s; }
  .card-link:hover { color: #4d96ff; border-color: #4d96ff; }

  input, textarea { font-family: 'DM Sans', sans-serif; }
  input:focus, textarea:focus { outline: none; border-color: #4d96ff !important; box-shadow: 0 0 0 3px rgba(77,150,255,.15) !important; }

  @media(max-width:768px){
    .projects-grid { grid-template-columns: 1fr !important; }
    .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
    .form-row { grid-template-columns: 1fr !important; }
    nav { padding: 1rem 1.5rem !important; }
    .nav-links { gap: 1.2rem !important; }
  }
`;

/* ─── COMPONENTS ─────────────────────────────────────── */

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "1.2rem 4rem",
      backdropFilter: "blur(20px)",
      background: scrolled ? "rgba(13,13,13,.85)" : "rgba(13,13,13,.5)",
      borderBottom: "1px solid rgba(255,255,255,.05)",
      transition: "background .4s",
    }}>
  <img
  src="/AB png.png"
  alt="Logo"
  style={{
    height: "50px",
    width: "auto",
    objectFit: "contain",
  }}
/>

      <ul className="nav-links" style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
        {["hero", "about", "projects", "contact"].map(id => (
          <li key={id}>
            <a href={`#${id}`} className={`nav-link${active === id ? " active" : ""}`}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative", overflow: "hidden",
      padding: "8rem 4rem 4rem", textAlign: "center",
    }}>
      {/* animated bg */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 20% 40%, rgba(255,107,107,.15) 0%, transparent 60%),
                     radial-gradient(ellipse 60% 80% at 80% 20%, rgba(77,150,255,.15) 0%, transparent 60%),
                     radial-gradient(ellipse 70% 70% at 60% 80%, rgba(199,125,255,.12) 0%, transparent 60%)`,
        animation: "bgShift 8s ease-in-out infinite alternate",
      }} />

      {/* blobs */}
      {[
        { w: 420, h: 420, bg: "#ff6b6b", top: "-110px", left: "-110px", delay: "0s" },
        { w: 320, h: 320, bg: "#4d96ff", bottom: "-60px", right: "-60px", delay: "2s" },
        { w: 260, h: 260, bg: "#c77dff", top: "50%", left: "62%", delay: "4s" },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: b.w, height: b.h, background: b.bg,
          filter: "blur(90px)", opacity: 0.28,
          top: b.top, left: b.left, bottom: b.bottom, right: b.right,
          animation: `float 6s ${b.delay} ease-in-out infinite`,
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 2, maxWidth: 820 }}>
        <div style={{
          display: "inline-block", fontFamily: "'Space Mono',monospace",
          fontSize: ".75rem", letterSpacing: ".2em", color: "#6bcb77",
          border: "1px solid #6bcb77", padding: ".3rem 1rem", borderRadius: "2rem",
          marginBottom: "2rem",
          animation: "fadeUp .8s ease forwards",
        }}>✦ Welcome to my corner of the internet</div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(3rem,8vw,7rem)", lineHeight: 1.05,
          marginBottom: "1.5rem",
          animation: "fadeUp .8s .2s ease forwards", opacity: 0,
        }}>
          Where{" "}
          <span style={{
            fontStyle: "italic",
            background: "linear-gradient(135deg,#ff6b6b 0%,#ffd93d 40%,#4d96ff 80%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>ideas</span>
          <br />come alive
        </h1>

        <p style={{
          fontSize: "1.15rem", color: "#888", maxWidth: 520,
          margin: "0 auto 2.5rem", lineHeight: 1.75,
          animation: "fadeUp .8s .4s ease forwards", opacity: 0,
        }}>
          I write about technology, creativity, and the things that keep me up at night. Dive in and explore.
        </p>

        <div style={{
          display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap",
          animation: "fadeUp .8s .6s ease forwards", opacity: 0,
        }}>
          <a href="#projects" className="btn btn-primary">Explore Projects</a>
          <a href="#contact" className="btn btn-outline">Get in Touch</a>
        </div>
      </div>

      {/* scroll hint */}
      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem",
        color: "#555", fontSize: ".72rem", letterSpacing: ".12em",
        animation: "fadeUp 1s 1s ease forwards", opacity: 0,
      }}>
        <span>scroll</span>
        <div style={{
          width: 1, height: 44,
          background: "linear-gradient(to bottom,#4d96ff,transparent)",
          animation: "scrollLine 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

/* ── About ── */
function About() {
  const [ref, visible] = useInView();
  return (
    <section id="about" style={{ padding: "7rem 4rem", background: "rgba(255,255,255,.02)" }}>
<div
  ref={ref}
  className={`about-grid reveal${visible ? " visible" : ""}`}
  style={{
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "5rem", alignItems: "center",
    maxWidth: 1100, margin: "0 auto",
  }}
>
        {/* avatar */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            width: "100%", maxWidth: 360, aspectRatio: "1",
            borderRadius: "2rem", padding: 3,
            background: "linear-gradient(135deg,#c77dff,#4d96ff,#ff6b6b)",
          }}>
            <div style={{
              width: "100%", height: "100%",
              borderRadius: "calc(2rem - 3px)", background: "#141414",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "6rem",
            }}>🧑‍💻</div>
          </div>
        </div>

        {/* text */}
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".7rem", letterSpacing: ".25em", color: "#888", marginBottom: ".75rem" }}>
            // about me
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.15, marginBottom: "1.25rem" }}>
            A{" "}
            <span style={{ background: "linear-gradient(135deg,#ffd93d,#6bcb77)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              curious mind
            </span>{" "}
            building things
          </h2>
          <p style={{ color: "#888", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Hey! I'm a developer, blogger, and lifelong learner passionate about the intersection of technology, design, and human experience.
          </p>
          <p style={{ color: "#888", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            I love breaking down complex ideas into simple, digestible stories. When I'm not coding, you'll find me reading, exploring new tools, or writing about what I discover.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
            {SKILLS.map(s => (
              <span key={s.label} style={{
                padding: ".35rem .9rem", borderRadius: "2rem",
                fontSize: ".78rem", fontFamily: "'Space Mono',monospace",
                color: s.color, border: `1px solid ${s.color}`,
                background: `${s.color}14`,
              }}>{s.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Project Card ── */
function ProjectCard({ project, index }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);

  const bannerColors = [
    "linear-gradient(135deg,rgba(255,107,107,.2),rgba(255,217,61,.2))",
    "linear-gradient(135deg,rgba(77,150,255,.2),rgba(199,125,255,.2))",
    "linear-gradient(135deg,rgba(107,203,119,.2),rgba(77,150,255,.2))",
  ];

  return (
    <div ref={ref} className={`project-card reveal${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s`, boxShadow: hovered ? `0 22px 65px ${project.glow}` : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        height: 180, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "3.5rem", background: bannerColors[index],
        transition: "transform .3s",
        transform: hovered ? "scale(1.03)" : "scale(1)",
      }}>{project.emoji}</div>

      <div style={{ padding: "1.5rem" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".15em", color: "#4d96ff", marginBottom: ".5rem" }}>
          {project.tag}
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", marginBottom: ".75rem" }}>
          {project.title}
        </h3>
        <p style={{ color: "#888", fontSize: ".9rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
          {project.desc}
        </p>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          <a href={project.demo} className="card-link">Live Demo →</a>
          <a href={project.github} className="card-link">GitHub →</a>
        </div>
      </div>
    </div>
  );
}

/* ── Projects ── */
function Projects() {
  const [ref, visible] = useInView();
  return (
    <section id="projects" style={{ padding: "7rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`} style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".7rem", letterSpacing: ".25em", color: "#888", marginBottom: ".75rem" }}>
          // what i've built
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3.5rem)" }}>
          Featured{" "}
          <span style={{ background: "linear-gradient(135deg,#ffd93d,#6bcb77)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Projects
          </span>
        </h2>
      </div>

      <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact() {
  const [ref, visible] = useInView();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.1)", borderRadius: ".6rem",
    padding: ".85rem 1rem", color: "#f0f0f0", fontSize: ".95rem",
    transition: "border-color .3s, box-shadow .3s",
  };

  return (
    <section id="contact" style={{ padding: "7rem 4rem", background: "rgba(255,255,255,.02)" }}>
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}
        style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".7rem", letterSpacing: ".25em", color: "#888", marginBottom: ".75rem" }}>
          // say hello
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3.5rem)", marginBottom: ".75rem" }}>
          Let's{" "}
          <span style={{ background: "linear-gradient(135deg,#ffd93d,#6bcb77)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Connect
          </span>
        </h2>
        <p style={{ color: "#888", marginBottom: "3rem", lineHeight: 1.75 }}>
          Have a project in mind, a question, or just want to say hi? Drop me a message and I'll get back to you soon.
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "left" }}>
          <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {[
              { label: "Your Name", name: "name", type: "text", placeholder: "John Doe" },
              { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com" },
            ].map(f => (
              <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                <label style={{ fontSize: ".8rem", color: "#888", letterSpacing: ".05em" }}>{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder}
                  value={form[f.name]} onChange={handle} required style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <label style={{ fontSize: ".8rem", color: "#888" }}>Subject</label>
            <input name="subject" type="text" placeholder="What's this about?"
              value={form.subject} onChange={handle} required style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <label style={{ fontSize: ".8rem", color: "#888" }}>Message</label>
            <textarea name="message" rows={5} placeholder="Tell me what's on your mind..."
              value={form.message} onChange={handle} required
              style={{ ...inputStyle, resize: "none" }} />
          </div>

          <button type="submit" disabled={status === "sending"} style={{
            alignSelf: "center", padding: "1rem 2.5rem",
            background: status === "sending"
              ? "rgba(255,255,255,.1)"
              : "linear-gradient(135deg,#c77dff,#4d96ff)",
            color: "white", border: "none", borderRadius: ".6rem",
            fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", fontWeight: 500,
            cursor: status === "sending" ? "not-allowed" : "pointer",
            transition: "transform .3s, box-shadow .3s",
            display: "flex", alignItems: "center", gap: ".6rem",
          }}
            onMouseEnter={e => { if (status !== "sending") e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
          >
            {status === "sending" && (
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />
            )}
            {status === "sending" ? "Sending..." : "Send Message ✦"}
          </button>

          {status === "sent" && (
            <div style={{
              padding: "1rem 1.5rem",
              background: "rgba(107,203,119,.1)", border: "1px solid #6bcb77",
              borderRadius: ".6rem", color: "#6bcb77", fontSize: ".9rem", textAlign: "center",
              animation: "fadeUp .4s ease forwards",
            }}>
              ✅ Message sent! I'll get back to you within 24 hours.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{
      padding: "2.5rem 4rem",
      borderTop: "1px solid rgba(255,255,255,.06)",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: "1rem",
    }}>
  <img
  src="/AB png.png"
  alt="Logo"
  style={{
    height: "50px",
    width: "auto",
    objectFit: "contain",
  }}
/>

      <p style={{ color: "#555", fontSize: ".85rem" }}>
        © 2025 — Built with 💛 React & Vanilla CSS
      </p>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        {["Twitter", "GitHub", "LinkedIn"].map(s => (
          <a key={s} href="#" style={{ color: "#555", textDecoration: "none", fontSize: ".85rem", transition: "color .3s" }}
            onMouseEnter={e => e.target.style.color = "#4d96ff"}
            onMouseLeave={e => e.target.style.color = "#555"}
          >{s}</a>
        ))}
      </div>
    </footer>
  );
}

/* ─── APP ────────────────────────────────────────────── */
export default function App() {
  const mouse = useMouse();
  const [activeSection, setActiveSection] = useState("hero");

  // inject CSS once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // active nav section
  useEffect(() => {
    const sections = ["hero", "about", "projects", "contact"];
    const handler = () => {
      const current = sections.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom > 120;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
        <ThreeBackground /> 
      {/* cursor glow */}
      <div style={{
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(77,150,255,.07) 0%,transparent 70%)",
        position: "fixed",
        left: mouse.x, top: mouse.y,
        transform: "translate(-50%,-50%)",
        pointerEvents: "none", zIndex: 0,
        transition: "left .08s, top .08s",
      }} />

      <Navbar active={activeSection} />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
