import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  Database,
  ExternalLink,
  FolderCode,
  GitBranch,
  GitFork as Github,
  GraduationCap,
  Layers3,
  ContactRound as Linkedin,
  Mail,
  MapPin,
  Menu,
  Monitor,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./App.css";
import { projects } from "./data/projects";

const currentYear = new Date().getFullYear();
const links = [
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "stack", label: "Stack" },
  { id: "experiencia", label: "Experiencia" },
  { id: "proyectos", label: "Proyectos" },
];
const social = {
  email: "mailto:andresf.algarin@gmail.com",
  github: "https://github.com/Andres-Algarin",
  linkedin: "https://www.linkedin.com/in/andr%C3%A9s-algar%C3%ADn-124849390/",
};
const stack: { name: string; icon: LucideIcon; items: string[] }[] = [
  {
    name: "Frontend",
    icon: Code2,
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Vite",
    ],
  },
  { name: "Backend", icon: Terminal, items: ["Node.js", "NestJS", "Express"] },
  {
    name: "Bases de datos",
    icon: Database,
    items: ["MySQL", "MariaDB", "TypeORM"],
  },
  { name: "Escritorio", icon: Monitor, items: ["Electron"] },
  {
    name: "Herramientas y testing",
    icon: GitBranch,
    items: ["Git", "GitHub", "Jest", "Supertest"],
  },
  {
    name: "Seguridad",
    icon: ShieldCheck,
    items: ["JWT", "Passport", "bcrypt"],
  },
];
function SectionHeading({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number} /</span> {label}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
function SocialLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("https") ? "_blank" : undefined}
      rel={href.startsWith("https") ? "noopener noreferrer" : undefined}
    >
      <Icon size={19} aria-hidden="true" />
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="header">
        <div className="container nav-wrap">
          <a
            className="brand"
            href="#inicio"
            aria-label="Andrés Algarín, inicio"
          >
            <span className="brand-symbol">
              a<span>.</span>
            </span>
            <span>
              andrés<span className="muted"> / algarín</span>
            </span>
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={menuOpen}
            aria-controls="navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav
            id="navigation"
            aria-label="Navegación principal"
            className={menuOpen ? "navigation open" : "navigation"}
          >
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={active === link.id ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              className="nav-contact"
              onClick={() => setMenuOpen(false)}
            >
              Hablemos <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>
      <main id="contenido">
        <section className="hero container" id="inicio">
          <div className="hero-copy">
            <p className="status">
              <span /> DESARROLLADOR FULL STACK JUNIOR
            </p>
            <h1>
              Hola, soy Andrés.
              <br />
              Transformo ideas
              <br />
              en <span>software.</span>
            </h1>
            <p className="hero-description">
              Andrés Felipe Algarín Cardona.
              <br />
              Desarrollo experiencias web y de escritorio, conectando
              interfaces, lógica y datos con propósito.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#contacto">
                Conectemos <ArrowUpRight size={18} />
              </a>
              <a className="button secondary" href="#experiencia">
                Conoce mi experiencia <ArrowRight size={18} />
              </a>
            </div>
            <p className="location">
              <MapPin size={15} /> Marinilla, Antioquia, Colombia
            </p>
          </div>
          <div
            className="hero-art"
            aria-label="Ilustración de las capas de desarrollo full stack"
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="art-coordinate">01 — CONSTRUIR CON PROPÓSITO</div>
            <div className="code-window">
              <div className="window-bar">
                <span />
                <span />
                <span />
                <p>andres.config.ts</p>
                <Braces size={15} />
              </div>
              <div className="code-body">
                <p>
                  <span className="code-purple">const</span> developer{" "}
                  <span className="code-purple">=</span> {"{"}
                </p>
                <p className="indent">
                  name: <span className="code-green">'Andrés Algarín'</span>,
                </p>
                <p className="indent">
                  role: <span className="code-green">'Full Stack Junior'</span>,
                </p>
                <p className="indent">focus: [</p>
                <p className="indent-double code-green">'Aprender',</p>
                <p className="indent-double code-green">'Resolver',</p>
                <p className="indent-double code-green">'Construir'</p>
                <p className="indent">],</p>
                <p className="indent">
                  location: <span className="code-green">'Colombia'</span>
                </p>
                <p>
                  {"}"}
                  <span className="cursor" />
                </p>
              </div>
              <div className="window-footer">
                <span>
                  <span className="tiny-dot" /> TypeScript
                </span>
                <span>UTF-8</span>
              </div>
            </div>
            <div className="floating-tag tag-top">
              <Code2 size={18} /> Frontend<span>React + TypeScript</span>
            </div>
            <div className="floating-tag tag-bottom">
              <Database size={18} /> Backend<span>Node.js + SQL</span>
            </div>
            <div className="art-caption">
              <span>INTERFACES.</span>
              <span>LÓGICA.</span>
              <span>CONEXIONES.</span>
            </div>
          </div>
          <a className="scroll-cue" href="#sobre-mi">
            <ArrowDown size={16} /> EXPLORA MI PERFIL
          </a>
          <div className="hero-index">PORTAFOLIO / 2026</div>
        </section>
        <div className="technology-strip" aria-label="Tecnologías principales">
          <div className="container">
            <span>
              <Braces /> React
            </span>
            <span className="ts-mark">
              TS <b>TypeScript</b>
            </span>
            <span>
              <Terminal /> Node.js
            </span>
            <span>
              <Layers3 /> NestJS
            </span>
            <span>
              <Database /> MySQL
            </span>
            <span>
              <GitBranch /> Git
            </span>
          </div>
        </div>
        <section id="sobre-mi" className="section container about">
          <SectionHeading
            number="01"
            label="SOBRE MÍ"
            title="Curiosidad para aprender. Criterio para construir."
          />
          <div className="about-content">
            <p>
              Soy Andrés,{" "}
              <strong>Desarrollador de Software Full Stack Junior</strong> en
              Marinilla, Antioquia. Me interesa entender los problemas y
              convertirlos en soluciones digitales claras, funcionales y fáciles
              de usar.
            </p>
            <p>
              He desarrollado aplicaciones web y de escritorio desde cero, desde
              el levantamiento de requerimientos hasta la implementación de APIs
              REST y la integración de bases de datos. Disfruto conectar cada
              parte del proceso y resolver los retos técnicos del camino.
            </p>
            <div className="about-notes">
              <span>
                <Check size={16} /> Visión de principio a fin
              </span>
              <span>
                <Check size={16} /> Aprendizaje continuo
              </span>
            </div>
          </div>
        </section>
        <section id="stack" className="section section-tinted">
          <div className="container">
            <SectionHeading
              number="02"
              label="MI CAJA DE HERRAMIENTAS"
              title="Un stack conectado."
              description="Tecnologías con las que desarrollo, integro y doy forma a mis soluciones."
            />
            <div className="stack-grid">
              {stack.map(({ name, icon: Icon, items }, index) => (
                <article className="stack-card" key={name}>
                  <div className="card-top">
                    <Icon size={23} />
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{name}</h3>
                  <div className="tags">
                    {items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="experiencia" className="section container">
          <SectionHeading
            number="03"
            label="EXPERIENCIA"
            title="Aprender haciendo."
          />
          <div className="experience">
            <div className="experience-date">
              <span className="timeline-dot" /> MAY — NOV 2026
              <p>Etapa práctica</p>
            </div>
            <article className="experience-detail">
              <div className="experience-title">
                <div>
                  <p className="eyebrow">TECNOPARQUE RIONEGRO · SENA</p>
                  <h3>Desarrollo de software</h3>
                </div>
                <span className="outline-badge">Práctica profesional</span>
              </div>
              <p>
                Participación en el desarrollo de soluciones de software,
                abordando necesidades técnicas desde los requerimientos hasta su
                implementación.
              </p>
              <ul>
                {[
                  "Desarrollo de aplicaciones web y de escritorio desde cero.",
                  "Levantamiento y análisis de requerimientos funcionales.",
                  "Implementación de APIs REST e integración de bases de datos.",
                  "Resolución de problemas técnicos durante el desarrollo.",
                ].map((text) => (
                  <li key={text}>
                    <ArrowUpRight size={16} />
                    {text}
                  </li>
                ))}
              </ul>
              <p className="confidential-note">
                <ShieldCheck size={16} /> Información presentada de forma
                general para respetar la confidencialidad.
              </p>
            </article>
          </div>
        </section>
        <section id="formacion" className="section container education">
          <SectionHeading
            number="04"
            label="FORMACIÓN"
            title="Bases para seguir creciendo."
          />
          <div className="education-list">
            <article>
              <GraduationCap />
              <div>
                <span className="eyebrow">SENA · 2025–2026</span>
                <h3>Tecnólogo en Análisis y Desarrollo de Software</h3>
              </div>
            </article>
            <article>
              <GraduationCap />
              <div>
                <span className="eyebrow">SENA</span>
                <h3>Técnico en Sistemas</h3>
              </div>
            </article>
            <div className="language">
              <span>EN</span>
              <p>
                Inglés <strong>B1</strong>
              </p>
            </div>
          </div>
        </section>
        <section id="proyectos" className="section section-tinted">
          <div className="container">
            <SectionHeading
              number="05"
              label="PROYECTOS"
              title="Espacio para lo que viene."
              description="Una selección de trabajos propios o con autorización para compartir, cuando estén disponibles."
            />
            <div className="projects-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.title}>
                  <FolderCode size={26} aria-hidden="true" />
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tags">
                    {project.technologies.map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.repositoryUrl && (
                      <SocialLink href={project.repositoryUrl} icon={Github}>
                        Código
                      </SocialLink>
                    )}
                    {project.demoUrl && (
                      <SocialLink href={project.demoUrl} icon={ExternalLink}>
                        Ver proyecto
                      </SocialLink>
                    )}
                  </div>
                </article>
              ))}
            </div>
            {projects.length === 0 && (
              <div className="projects-empty">
                <div className="project-icon">
                  <FolderCode size={34} strokeWidth={1.4} />
                </div>
                <div>
                  <span className="eyebrow">EN PREPARACIÓN</span>
                  <h3>Las buenas ideas merecen su espacio.</h3>
                  <p>
                    Aquí encontrarás proyectos con su contexto, tecnologías y
                    enlaces públicos.
                    <br />
                    Por ahora, puedes conocer mi perfil en GitHub.
                  </p>
                </div>
                <a
                  className="text-link"
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visitar GitHub <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </section>
        <section id="contacto" className="section container contact">
          <div>
            <p className="eyebrow">
              <span>06 /</span> SIGUIENTE PASO
            </p>
            <h2>
              Una conversación.
              <br />
              <span>Muchas posibilidades.</span>
            </h2>
            <p>
              ¿Tienes una oportunidad o una idea en mente?
              <br />
              Me encantará conocerla y conversar contigo.
            </p>
            <a className="email-link" href={social.email}>
              andresf.algarin@gmail.com <ArrowUpRight />
            </a>
          </div>
          <div className="contact-links">
            <SocialLink href={social.email} icon={Mail}>
              Envíame un correo
            </SocialLink>
            <SocialLink href={social.linkedin} icon={Linkedin}>
              Conectemos en LinkedIn
            </SocialLink>
            <SocialLink href={social.github} icon={Github}>
              Encuéntrame en GitHub
            </SocialLink>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <a className="brand" href="#inicio">
          a<span className="accent">.</span>
        </a>
        <p>© {currentYear} Andrés Felipe Algarín Cardona</p>
        <a href="#inicio">
          Volver arriba <ArrowUpRight size={15} />
        </a>
      </footer>
    </>
  );
}
export default App;
