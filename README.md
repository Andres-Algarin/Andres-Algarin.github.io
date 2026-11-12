# Portafolio de Andrés Felipe Algarín Cardona

Portafolio en React, TypeScript y Vite, con diseño responsive carbón y esmeralda, iconos de lucide-react y CSS sin frameworks.

## Desarrollo y comprobaciones

```sh
npm ci
npm run dev
npm run lint
npm run build
node --test scripts/projects.test.mjs
npm run preview
```

`npm run dev` muestra los tres proyectos en localhost. `npm run preview` permite revisar exactamente la compilación pública de `dist/`. Después de cambiar la configuración de Vite, reinicia el servidor.

## Proyectos autorizados

Se confirmó autorización para mostrar públicamente los nombres, las descripciones y las capturas seleccionadas de FERREINVER, Austral y ContraSENA. No hay enlaces al código fuente ni demos de los proyectos.

- FERREINVER: contribución frontend en equipo, limitada a landing page, interfaz visual del carrito, contacto y footer; nueve capturas.
- Austral: desarrollo individual Full Stack para su titular; 23 capturas autorizadas, incluida la nueva pantalla de inicio de sesión. Los usuarios visibles son ficticios de prueba; se omite la captura de Productos del panel administrativo. Desarrollo funcional pendiente de publicación en su dominio.
- ContraSENA: desarrollo individual de una aplicación de escritorio para Windows; diez capturas. El usuario confirmó que los registros, identificaciones e importes visibles son ficticios de prueba.

La participación técnica no se presenta como titularidad de los derechos de productos desarrollados para terceros. No se agregaron interfaces ficticias ni funcionalidades no suministradas.

## Organización

- `src/data/projects.ts`: tipos, contenido de FERREINVER y composición de los tres proyectos públicos.
- `src/data/additional-projects.json`: textos y metadatos autorizados de Austral y ContraSENA.
- `src/data/project-images.json`: metadatos de las capturas de FERREINVER.
- `src/components/Projects.tsx` y `Projects.css`: tarjetas, detalles y galería reutilizables, con teclado, Escape, ampliación y carga diferida.
- `public/projects/ferreinver/`, `public/projects/austral/` y `public/projects/contrasena/`: capturas públicas seleccionadas.
- `src/App.tsx`, `src/App.css` y `src/index.css`: secciones y estilos del portafolio.
- `scripts/projects.test.mjs`: integridad de los archivos de producción y comprobación HTTP de las imágenes.

Se conservaron las dimensiones y los JPEG recibidos. En las comparaciones realizadas, WebP sin pérdida resultó más pesado que los originales, por lo que se usan los JPEG sin recomprimir. La ampliación utiliza el original recibido y no aumenta artificialmente su detalle.

## Privacidad

La aplicación ya no depende de módulos virtuales ni de `.private/`. Funciona igual en desarrollo y producción con los tres proyectos públicos. Los originales adicionales, borradores y scripts históricos de revisión permanecen en `.private/`, ignorada por Git y bloqueada por Vite. No son necesarios para compilar ni ejecutar el portafolio. No uses `git add -f` sobre esa carpeta ni copies capturas adicionales a public sin revisarlas.

## GitHub Pages

`vite.config.ts` usa `base: './'` para generar rutas relativas compatibles con Pages tanto en un dominio de usuario como en una subruta. La navegación usa anclas y no requiere reescritura de rutas. El resultado estático está en `dist/`.

No se configuró despliegue automático ni se hizo push o despliegue. Para revisar la versión final, compila y ejecuta `npm run preview`; usa la URL que indique Vite.

## Notas

Las tipografías DM Sans y Manrope se cargan desde Google Fonts con alternativas de sistema. Los enlaces de correo, WhatsApp, Instagram, LinkedIn y perfil de GitHub abren sus destinos; no hay formulario ni backend en el portafolio. Los repositorios privados nunca se consultan ni exponen automáticamente.
