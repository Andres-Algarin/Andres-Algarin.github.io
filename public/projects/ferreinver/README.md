# Capturas de FERREINVER

Las nueve capturas reales fueron suministradas en `public/fereinver/`. La autorización para usar el nombre, las imágenes y el enlace al repositorio fue confirmada por el propietario del portafolio.

En esta carpeta se conservan copias con nombres descriptivos:

| Original | Archivo                 | Contenido                                            |
| -------- | ----------------------- | ---------------------------------------------------- |
| 1.jpeg   | landing.jpeg            | Inicio con invernadero y botón Cotiza ahora; portada |
| 2.jpeg   | proceso.jpeg            | Proceso de construcción en la landing                |
| 3.jpeg   | tipos-invernaderos.jpeg | Estructura metálica y tipo capilla                   |
| 4.jpeg   | productos-footer.jpeg   | Productos y footer                                   |
| 5.jpeg   | contacto.jpeg           | Formulario e información de contacto                 |
| 6.jpeg   | ubicacion-footer.jpeg   | Ubicación, mapa y footer                             |
| 7.jpeg   | sobre-nosotros.jpeg     | Presentación, misión y visión; contexto del equipo   |
| 8.jpeg   | objetivos.jpeg          | Objetivos; contexto del equipo                       |
| 9.jpeg   | alcance-footer.jpeg     | Alcance del proyecto y footer                        |

No se alteró el contenido ni se recomprimieron los JPEG recibidos. No se recibió una captura del carrito y no se inventó ninguna. Las vistas de contexto del equipo no se presentan como contribuciones individuales.

## Optimización y mantenimiento

Desde la raíz del repositorio:

```powershell
./scripts/optimize-project-images.ps1
```

El script compara cada JPEG con una versión WebP sin pérdida, sin redimensionar ni transformar colores o contenido. Conserva WebP solo si reduce el peso; en caso contrario utiliza el JPEG original y descarta exclusivamente la copia generada. Actualiza `src/data/project-images.json` con el archivo seleccionado y sus dimensiones reales. Requiere npm para la herramienta temporal sharp-cli; no añade dependencias al proyecto.

Con las imágenes actuales, los JPEG originales son más ligeros que los WebP sin pérdida. Se utilizan esos JPEG, evitando compresión adicional y mayor transferencia.

## Revisión local

```sh
npm run dev
```

Abre la URL que indique Vite y ve a `#proyectos` → «Ver detalles». La galería usa carga diferida y textos alternativos. Puedes ampliar las nueve imágenes, consultar su tamaño original con desplazamiento, usar los botones anterior/siguiente o las teclas ← y →, y cerrar con el botón, Escape o pulsando fuera del cuadro.

Los cuadros de diálogo mantienen el foco dentro y lo devuelven al botón de apertura al cerrar. La ampliación utiliza el JPEG original, con la resolución real recibida; no se aumenta artificialmente su detalle.
