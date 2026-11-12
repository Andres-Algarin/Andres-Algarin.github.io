# Portafolio de Andrés Felipe Algarín Cardona

Portafolio personal con React, TypeScript y Vite. Diseño responsive en carbón y esmeralda, iconos de lucide-react y CSS sin frameworks. No contiene proyectos ficticios ni información confidencial.

## Desarrollo

```sh
npm ci
npm run dev
```

## Comprobaciones

```sh
npm run lint
npm run build
npm run preview
```

La compilación comprueba TypeScript y genera los archivos estáticos en `dist/`.

## Organización

- `src/App.tsx`: secciones, navegación responsive y componentes reutilizables.
- `src/App.css`: composición, componentes, estados y breakpoints.
- `src/index.css`: estilos globales, tipografía, accesibilidad y movimiento reducido.
- `src/data/projects.ts`: listado tipado de proyectos públicos; inicialmente vacío.
- `index.html`: idioma español y metadatos SEO/sociales.
- `public/favicon.svg`: identidad visual del sitio.

## Agregar proyectos

Añade entradas en `src/data/projects.ts` con título, descripción, tecnologías y, opcionalmente, enlaces HTTPS al repositorio público y demo. Las tarjetas aparecen automáticamente al agregar datos. Publica exclusivamente trabajos propios o expresamente autorizados. Comprueba que los enlaces y el contenido sean públicos y no incluyan datos de terceros.

## GitHub Pages (preparado, sin desplegar)

`vite.config.ts` usa `base: './'` para generar rutas relativas compatibles con Pages tanto en un dominio de usuario como en una subruta de repositorio. La página usa anclas y no requiere reescritura de rutas.

Cuando se autorice el despliegue, GitHub Pages debe publicar el contenido generado en `dist/`, no los archivos fuente. Se puede configurar posteriormente un workflow manual de GitHub Actions que ejecute `npm ci`, `npm run lint`, `npm run build` y publique ese directorio. No se incluye un workflow que despliegue automáticamente al hacer push.

No se ha realizado push, publicación ni cambio en la configuración remota.

## Notas

Las tipografías DM Sans y Manrope se cargan desde Google Fonts; el sitio usa fuentes de sistema si no hay conexión. El correo abre el cliente de correo del visitante; no hay formulario ni backend. Los enlaces a GitHub y LinkedIn abren una pestaña nueva de forma segura. La sección de proyectos no consulta ni expone repositorios automáticamente.
