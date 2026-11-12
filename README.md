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
- `src/data/projects.ts`: datos tipados del proyecto colaborativo y sus capturas autorizadas.
- `index.html`: idioma español y metadatos SEO/sociales.
- `public/favicon.svg`: identidad visual del sitio.

## Agregar proyectos

Los datos de FERREINVER están en `src/data/projects.ts`. La tarjeta, los detalles y la galería reutilizables están en `src/components/Projects.tsx`, con estilos en `Projects.css`. Cada proyecto distingue la contribución propia y las tecnologías del equipo. Publica exclusivamente trabajos propios o expresamente autorizados. Las instrucciones para incorporar las nueve capturas originales y optimizarlas sin pérdida están en `public/projects/ferreinver/README.md`.

## GitHub Pages (preparado, sin desplegar)

`vite.config.ts` usa `base: './'` para generar rutas relativas compatibles con Pages tanto en un dominio de usuario como en una subruta de repositorio. La página usa anclas y no requiere reescritura de rutas.

Cuando se autorice el despliegue, GitHub Pages debe publicar el contenido generado en `dist/`, no los archivos fuente. Se puede configurar posteriormente un workflow manual de GitHub Actions que ejecute `npm ci`, `npm run lint`, `npm run build` y publique ese directorio. No se incluye un workflow que despliegue automáticamente al hacer push.

No se ha realizado push, publicación ni cambio en la configuración remota.

## Notas

Las tipografías DM Sans y Manrope se cargan desde Google Fonts; el sitio usa fuentes de sistema si no hay conexión. El correo abre el cliente de correo del visitante; no hay formulario ni backend. Los enlaces a GitHub y LinkedIn abren una pestaña nueva de forma segura. La sección de proyectos no consulta ni expone repositorios automáticamente.

## Vistas locales de proyectos sin autorización pública

Los textos y las capturas de revisiones privadas se guardan exclusivamente en `.private/`, ignorada por Git. No deben ponerse en `public/`. El servidor de desarrollo sirve únicamente las imágenes seleccionadas en `.private/projects.json`, con acceso restringido a loopback. No sirve el resto de los archivos privados.

Para revisarlas, ejecuta `npm run dev`, abre la URL local que indique Vite y entra en Proyectos → Ver detalles. Reinicia el servidor después de cambiar los datos de `.private/projects.json`. Los cuadros de diálogo y la galería se reutilizan para proyectos individuales y de equipo.

`npm run build` no lee ni importa los datos privados, incluso usando un modo de desarrollo. `npm run preview` sirve únicamente el resultado público generado. Los clones del repositorio funcionan sin `.private/` y muestran los proyectos públicos.

Después de compilar, las comprobaciones de aislamiento se ejecutan con:

```sh
node --test scripts/local-preview.test.mjs
```

Las pruebas privadas se omiten cuando no existen datos locales. La carpeta privada contiene la información para revisar sus capturas; mantén los archivos originales y excluye cualquier captura con datos personales, credenciales, clientes, ventas o existencias internas hasta disponer de una versión adecuada y autorización.
