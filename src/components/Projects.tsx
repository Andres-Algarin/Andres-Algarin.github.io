import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { Project, ProjectImage } from "../data/projects";
import "./Projects.css";

function Modal({
  title,
  children,
  onClose,
  className = "",
  onKeyDown,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`project-modal ${className}`}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-modal-content">
        <header className="project-modal-header">
          <h2 id={headingId}>{title}</h2>
          <button
            type="button"
            className="project-icon-button"
            onClick={onClose}
            aria-label={`Cerrar ${title}`}
            autoFocus
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

function Screenshot({
  image,
  original = false,
  loading = "lazy",
}: {
  image: ProjectImage;
  original?: boolean;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);
  const [useOriginal, setUseOriginal] = useState(original);
  if (failed)
    return (
      <div className="project-image-missing" role="status">
        <ImageOff aria-hidden="true" />
        <span>Captura pendiente de incorporar</span>
        <small>{image.caption}</small>
      </div>
    );
  return (
    <img
      src={useOriginal ? (image.originalSrc ?? image.src) : image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={loading}
      decoding="async"
      onError={() => {
        if (!useOriginal && image.originalSrc) setUseOriginal(true);
        else setFailed(true);
      }}
    />
  );
}

function Gallery({ images }: { images: ProjectImage[] }) {
  const [showAll, setShowAll] = useState(false);
  const galleryId = useId();
  const initialCount = 8;
  const visibleImages = showAll ? images : images.slice(0, initialCount);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const current = selected === null ? null : images[selected];
  const navigate = (direction: number) => {
    setSelected((index) =>
      index === null
        ? null
        : (index + direction + images.length) % images.length,
    );
    setZoomed(false);
  };
  return (
    <>
      <div className="project-gallery-toolbar">
        <p aria-live="polite">
          Mostrando {visibleImages.length} de {images.length} capturas
        </p>
        {images.length > initialCount && (
          <button
            type="button"
            className="project-control"
            aria-expanded={showAll}
            aria-controls={galleryId}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll
              ? "Mostrar selección"
              : `Ver todas las capturas (${images.length})`}
          </button>
        )}
      </div>
      <div className="project-gallery" id={galleryId}>
        {visibleImages.map((image, index) => (
          <figure key={image.src}>
            <button
              type="button"
              className="project-gallery-button"
              aria-label={`Ampliar: ${image.caption}`}
              onClick={() => {
                setSelected(index);
                setZoomed(false);
              }}
            >
              <Screenshot image={image} />
              <span className="project-image-expand">
                <ZoomIn size={17} aria-hidden="true" /> Ampliar
              </span>
            </button>
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      {current && selected !== null && (
        <Modal
          title={current.caption}
          className="project-lightbox"
          onClose={() => setSelected(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              navigate(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              navigate(-1);
            }
          }}
        >
          <div className="project-lightbox-toolbar">
            <p aria-live="polite">
              {selected + 1} / {images.length}
            </p>
            <button
              className="project-control"
              type="button"
              onClick={() => setZoomed(!zoomed)}
              aria-pressed={zoomed}
            >
              {zoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
              {zoomed ? "Ajustar a pantalla" : "Tamaño original"}
            </button>
          </div>
          <div
            className={`project-lightbox-image ${zoomed ? "is-zoomed" : ""}`}
          >
            <Screenshot
              key={current.src}
              image={current}
              original
              loading="eager"
            />
          </div>
          <div className="project-lightbox-navigation">
            <button
              className="project-control"
              type="button"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={18} /> Anterior
            </button>
            <p>También puedes usar ← → · Esc para cerrar</p>
            <button
              className="project-control"
              type="button"
              onClick={() => navigate(1)}
            >
              Siguiente <ChevronRight size={18} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function ProjectBadges({ project }: { project: Project }) {
  return (
    <div className="project-badges">
      <span>{project.category}</span>
      {project.platform && <span>{project.platform}</span>}
      {(project.collaborative || project.participationLabel) && (
        <span>
          <Users size={13} aria-hidden="true" />
          {project.participationLabel ?? "Proyecto en equipo"}
        </span>
      )}
    </div>
  );
}

function ProjectDetails({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <Modal title={project.title} onClose={onClose}>
      <div className="project-details-cover">
        <Screenshot image={project.cover} loading="eager" />
      </div>
      <div className="project-details-body">
        {project.subtitle && (
          <p className="project-subtitle">{project.subtitle}</p>
        )}
        <ProjectBadges project={project} />
        {project.status && <p className="project-status">{project.status}</p>}
        {project.platform && (
          <p className="project-status">
            Plataforma: {project.platform} · Aplicación de escritorio
          </p>
        )}
        <section>
          <h3>El sistema</h3>
          <p>{project.overview}</p>
        </section>
        <section>
          <h3>Objetivo del proyecto</h3>
          <p>{project.objective}</p>
        </section>
        {project.problem && (
          <section>
            <h3>Problema que busca resolver</h3>
            <p>{project.problem}</p>
          </section>
        )}
        <section>
          <h3>{project.contributionTitle ?? "Mi contribución frontend"}</h3>
          <ul className="project-contributions">
            {project.contributions.map((contribution) => (
              <li key={contribution}>
                <Check size={16} aria-hidden="true" />
                {contribution}
              </li>
            ))}
          </ul>
        </section>
        {project.features && (
          <section>
            <h3>Funcionalidades principales</h3>
            <ul className="project-contributions">
              {project.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        )}
        {project.architecture && (
          <section>
            <h3>Arquitectura tecnológica</h3>
            <div className="project-architecture">
              {project.architecture.map((layer) => (
                <article key={layer.title}>
                  <h4>{layer.title}</h4>
                  <p>{layer.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        {project.technologyGroups && (
          <section>
            <h3>Stack tecnológico completo</h3>
            <div className="project-tech-groups">
              {project.technologyGroups.map((group) => (
                <div key={group.name}>
                  <h4>{group.name}</h4>
                  <div className="tags">
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h3>
            {project.technologyGroups
              ? "Tecnologías principales"
              : "Tecnologías de mi contribución"}
          </h3>
          <div className="tags">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          {project.additionalTechnologies.length > 0 && (
            <p className="project-additional-tech">
              Tecnologías adicionales del sistema completo:{" "}
              {project.additionalTechnologies.join(" · ")}. No corresponden a mi
              contribución frontend.
            </p>
          )}
        </section>
        <aside className="project-collaboration">
          <Users size={21} aria-hidden="true" />
          <div>
            <h3>{project.noteTitle ?? "Un resultado de equipo"}</h3>
            <p>{project.collaborationNote}</p>
          </div>
        </aside>
        <section>
          <h3>Recorrido visual</h3>
          <p>
            Capturas reales del sistema. Selecciona una imagen para ampliarla y
            consultar el archivo original.
          </p>
          <Gallery images={[project.cover, ...project.gallery]} />
        </section>
      </div>
    </Modal>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <article className="project-showcase">
      <div className="project-showcase-cover">
        <Screenshot image={project.cover} />
      </div>
      <div className="project-showcase-body">
        <ProjectBadges project={project} />
        <h3>{project.title}</h3>
        {project.subtitle && (
          <p className="project-subtitle">{project.subtitle}</p>
        )}
        <p>{project.description}</p>
        <div className="tags">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
        <div className="project-showcase-actions">
          <button
            className="button primary"
            type="button"
            onClick={() => setDetailsOpen(true)}
            aria-haspopup="dialog"
          >
            Ver detalles <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      {detailsOpen && (
        <ProjectDetails
          project={project}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </article>
  );
}
