# Pro-DG Static Site

Sitio web estático profesional para Pro-DG (agencia de marketing digital y media buying) construido con HTML, CSS y JavaScript puros. Incluye soporte bilingüe (ES/EN), componentes reutilizables, formulario con validación y assets listos para producción.

## Estructura

```
index.html
assets/
  css/styles.css
  js/main.js
  img/
  icons/
robots.txt
sitemap.xml
```

Los archivos en `assets/img/` y `assets/icons/` contienen placeholders vectoriales para facilitar la revisión del PR. Sustitúyelos por recursos reales cuando estén disponibles.

## Contenido y traducciones

- Todo el contenido editable usa atributos `data-i18n` (texto), `data-i18n-placeholder` (placeholders) y `data-i18n-aria-label` (accesibilidad).
- Las traducciones se definen en `assets/js/main.js` dentro del objeto `translations`. Agrega nuevas claves allí si sumas secciones o componentes.

## Formulario de contacto

El formulario envía los datos mediante `fetch` a un endpoint configurable:

1. Abre `index.html` y ubica el formulario (`<form id="contact-form" ...>`).
2. Cambia el valor del atributo `data-endpoint` por la URL de tu API/servicio (por ejemplo, un webhook o función serverless).
3. Asegúrate de aceptar solicitudes `POST` con JSON. El payload enviado contiene los campos del formulario como claves/valores.

Estados del formulario:
- **Enviando…**: se activa al presionar enviar.
- **Éxito**: el formulario se resetea cuando el endpoint responde `2xx`.
- **Error**: mensaje genérico si ocurre un fallo de red o respuesta distinta de `2xx`.

Puedes personalizar los textos editando las claves `contact.form.status*` en el diccionario.

## Agregar servicios o proyectos

- **Servicios**: duplica una tarjeta `<article class="card service-card">` dentro de la sección `#servicios`. Crea nuevas claves en el diccionario (`services.nuevo.title`, `services.nuevo.copy`) para mantener el soporte bilingüe.
- **Casos de éxito**: añade nuevas tarjetas dentro de `#casos` siguiendo la clase `result-card` y agrega las traducciones correspondientes.
- **Portfolio**: sustituye el placeholder `assets/img/placeholder-image.svg` por tus miniaturas reales y actualiza los textos con nuevas claves `portfolio.itemX`.
- **Testimonios**: replica el bloque `<article class="testimonial">` y registra las claves `testimonials.itemX.*` para cada idioma.

## Optimización y build

- El CSS crítico (header + hero) está inline en `index.html` para mejorar el LCP.
- Incluye un comentario en el `<head>` sobre la minificación. Usa herramientas como `esbuild`/`lightningcss` para generar versiones minificadas para producción.
- Todas las imágenes usan `loading="lazy"` para carga diferida y se respeta `prefers-reduced-motion`.

## Accesibilidad y SEO

- Navegación accesible con soporte para teclado y ARIA.
- Schema.org (`Organization` + `LocalBusiness`) en formato JSON-LD.
- `robots.txt` y `sitemap.xml` listos para publicar.

## Sustituir assets

- Logo: reemplaza `assets/img/pro-dg-logo.svg` por el archivo oficial.
- Hero y proyectos: reemplaza `assets/img/hero-abstract.svg` y `assets/img/placeholder-image.svg` por fotografías/frames propios. Puedes mantener los nombres o actualizar las rutas en el HTML/CSS.
- Favicons: agrega tus archivos reales en `assets/icons/` (16x16, 32x32, 48x48 y apple-touch-icon.png). Mantén `mask-icon.svg` o ajústalo según tu branding.

## Desarrollo local

Al ser un sitio estático puedes servirlo con cualquier servidor simple (por ejemplo, `npx serve` o `python -m http.server`).

```bash
python -m http.server 3000
```

Luego visita `http://localhost:3000` para ver el sitio.

## Analytics

`index.html` incluye un placeholder para Google Analytics/GA4 en el bloque `gtag()`. Sustituye con tu script oficial cuando esté listo.
