import localProjects from "virtual:local-projects";
import projectImages from "./project-images.json";

export type ProjectImage = {
  src: string;
  originalSrc?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  collaborative: boolean;
  participationLabel?: string;
  platform?: string;
  problem?: string;
  contributionTitle?: string;
  noteTitle?: string;
  status?: string;
  previewOnly?: boolean;
  features?: string[];
  architecture?: { title: string; description: string }[];
  technologyGroups?: { name: string; items: string[] }[];
  description: string;
  overview: string;
  objective: string;
  contributions: string[];
  collaborationNote: string;
  technologies: string[];
  additionalTechnologies: string[];
  cover: ProjectImage;
  gallery: ProjectImage[];
};

const image = (
  filename: keyof typeof projectImages,
  alt: string,
  caption: string,
): ProjectImage => ({
  src: `${import.meta.env.BASE_URL}projects/ferreinver/${projectImages[filename].file}`,
  originalSrc: `${import.meta.env.BASE_URL}projects/ferreinver/${filename}.jpeg`,
  alt,
  caption,
  width: projectImages[filename].width,
  height: projectImages[filename].height,
});

// Public use of the name, supplied screenshots and team repository link was
// explicitly authorized by the portfolio owner in this conversation.
const publicProjects: Project[] = [
  {
    id: "ferreinver",
    title: "FERREINVER",
    category: "Desarrollo Frontend",
    collaborative: true,
    description:
      "Contribución frontend a una plataforma de comercio electrónico para productos de ferretería y soluciones para invernaderos: landing page, interfaz visual del carrito, contacto y footer.",
    overview:
      "Plataforma desarrollada en equipo para una empresa dedicada a la comercialización de productos de ferretería y soluciones para invernaderos. El sistema completo cuenta con tienda virtual, panel administrativo y funcionalidades de cotización de invernaderos.",
    objective:
      "Presentar los productos y las soluciones para invernaderos en una plataforma web que facilite explorar la oferta, contactar a la empresa y acceder a las funcionalidades comerciales del sistema.",
    contributions: [
      "Diseño y desarrollo frontend de la landing page.",
      "Desarrollo de la interfaz visual del carrito de compras.",
      "Diseño y desarrollo de la sección de contacto.",
      "Diseño e implementación del footer.",
    ],
    collaborationNote:
      "Proyecto desarrollado en equipo. Mi participación se limitó a las interfaces descritas: no me atribuyo la implementación del backend, el panel administrativo ni el sistema de cotizaciones. Las capturas muestran el sistema como contexto del trabajo colaborativo; no representan autoría individual de todas sus secciones.",
    technologies: ["React", "JavaScript", "CSS3", "Vite"],
    additionalTechnologies: ["PHP", "Laravel"],
    cover: image(
      "landing",
      "Página de inicio de FERREINVER con navegación, fotografía de un invernadero y botón Cotiza ahora.",
      "Landing page · presentación principal",
    ),
    gallery: [
      image(
        "proceso",
        "Sección de la landing con la presentación del proceso de construcción de invernaderos.",
        "Landing · proceso de construcción",
      ),
      image(
        "tipos-invernaderos",
        "Tarjetas de los tipos de invernadero: estructura metálica y tipo capilla.",
        "Landing · tipos de invernaderos",
      ),
      image(
        "productos-footer",
        "Sección de productos sin artículos disponibles y footer con navegación e información de contacto.",
        "Productos y footer",
      ),
      image(
        "contacto",
        "Página de contacto con información de la empresa y formulario de mensaje.",
        "Interfaz de contacto",
      ),
      image(
        "ubicacion-footer",
        "Sección de contacto con un mapa de El Carmen de Viboral y el footer de FERREINVER.",
        "Contacto · ubicación y footer",
      ),
      image(
        "sobre-nosotros",
        "Página Sobre nosotros con presentación de FERREINVER y secciones de misión y visión.",
        "Contexto del equipo · sobre nosotros",
      ),
      image(
        "objetivos",
        "Sección Nuestros objetivos con seis tarjetas informativas de FERREINVER.",
        "Contexto del equipo · objetivos",
      ),
      image(
        "alcance-footer",
        "Sección Alcance del proyecto y footer de FERREINVER.",
        "Contexto del proyecto y footer",
      ),
    ],
  },
];

export const projects: Project[] = [...publicProjects, ...localProjects];
