---
name: Payhub
description: Pasarela de pagos de Tuboleta con el lenguaje de tuboleta.com - Montserrat, azul de marca, superficies gris claro, acción principal amarilla, plano y sin adorno salvo el medallón de la estrella.
colors:
  tuboleta-blue: "#006eb7"
  blue-deep: "#00548c"
  blue-tint-50: "#eef6fb"
  blue-tint-100: "#b2d3e9"
  ink: "#1a171b"
  white: "#ffffff"
  surface-gray: "#f1f4f7"
  line-gray: "#dee2e6"
  action-yellow: "#ffc107"
  action-amber: "#f28f15"
  danger-red: "#bd0a27"
  success-green: "#198754"
typography:
  display:
    fontFamily: "Montserrat, Arial, Helvetica, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Montserrat, Arial, Helvetica, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Montserrat, Arial, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Montserrat, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Montserrat, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
  amount:
    fontFamily: "Montserrat, Arial, Helvetica, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "'tnum' 1, 'lnum' 1"
rounded:
  custom: "0.375rem"
  xl: "0.75rem"
  2xl: "1rem"
  3xl: "1.5rem"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.action-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.custom}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.action-amber}"
  button-primary-compact:
    backgroundColor: "{colors.action-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.custom}"
    padding: "8px 16px"
  button-mobile-solid:
    backgroundColor: "{colors.tuboleta-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.custom}"
    padding: "12px 0"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.custom}"
    padding: "12px 16px"
  method-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  checkout-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
  brand-band:
    backgroundColor: "{colors.tuboleta-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.2xl}"
  payment-summary:
    backgroundColor: "{colors.tuboleta-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
  alert:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "16px"
  hero-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
  button-hero:
    backgroundColor: "{colors.tuboleta-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.custom}"
    padding: "16px 28px"
  icon-badge:
    backgroundColor: "{colors.blue-tint-50}"
    textColor: "{colors.tuboleta-blue}"
    rounded: "{rounded.full}"
    size: "40px"
---

# Design System: Payhub

## Overview

**Creative North Star: "La Taquilla Tuboleta"**

Payhub no inventa un mundo propio: es una página más de tuboleta.com. Fondo blanco, cabecera y pie en Azul Tuboleta, Montserrat en todo, texto casi negro, superficies en grises claros y un único amarillo reservado a la acción principal. Quien llega desde la tienda debe sentir que sigue en el mismo sitio.

El sistema es plano y sobrio. La jerarquía sale del tamaño y el peso de Montserrat (800 para titulares y montos, 700 para encabezados) y del contraste azul / blanco / gris, no de efectos. El único adorno de marca es el medallón de la estrella de Tuboleta; todo lo demás es contenido, iconos de línea y color. Sobre ese fondo hay una capa de vidrio esmerilado, usada solo donde hay color o contenido detrás que mostrar (hero de Home, tarjetas de Home, alertas, cabecera fija y Loader), nunca en formularios de checkout.

Rechaza el mundo de billete anterior y cualquier decoración que no venga de tuboleta.com.

**Key Characteristics:**
- Montserrat para todo, incluidos montos con cifras tabulares (`num`).
- Azul Tuboleta como campo de marca (header, footer, resumen de pago); blanco y gris para leer y capturar datos.
- Amarillo solo para la acción principal (en Home, únicamente el botón «Regístrate» del Header); hover ámbar.
- Radio de 0.375rem en controles; 0.75rem en tarjetas; círculos para iconos.
- Plano: una sola sombra suave en láminas grandes, ninguna en tarjetas pequeñas; el vidrio trae su propia sombra.
- Vidrio (`glass`, `glass-strong`, `glass-brand`) solo sobre color o contenido: hero, tarjetas de Home, alertas, cabecera fija, Loader.

## Colors

Una paleta de marca corta: un azul, su sombra, un amarillo de acción, tinta casi negra y dos grises.

### Primary
- **Azul Tuboleta** (`tuboleta-blue`): header, footer, resumen de pago, medallones de icono sobre su tinte, numerales de pasos y medallones de medios de pago de Home, borde de foco de inputs, color de selección de caret y acento de controles. Intacto por restricción de marca.
- **Azul Profundo** (`blue-deep`): token secundario del tema (`secondary`); hover y active del botón del hero y mancha desenfocada del campo del hero.

### Secondary
- **Amarillo de Acción** (`action-yellow`): relleno del botón principal. En Home solo aparece en el botón «Regístrate» del Header.
- **Ámbar de Acción** (`action-amber`): hover del botón principal.
- **Verde de Éxito** (`success-green`): ícono y barra de tiempo de las alertas de éxito; reemplaza el verde de react-toastify.

### Neutral
- **Tinta** (`ink`): todo el texto; secundario a opacidad 70 a 75%, placeholders 55%.
- **Blanco** (`white`): fondo de página, lámina de checkout, inputs.
- **Gris Superficie** (`surface-gray`): input deshabilitado y hover del botón de cerrar alerta.
- **Gris Línea** (`line-gray`): bordes de tarjetas, filetes entre secciones, anillo del spinner.
- **Tinte Azul 50 / 100** (`blue-tint-50`, `blue-tint-100`): fondo de insignias e iconos; selección de texto (100); extremos del campo del hero y de medios de pago en Home (`--color-primary-50` / `--color-primary-100`).
- **Rojo de Error** (`danger-red`): borde, asterisco de obligatorio y mensaje de error; ícono y barra de alertas de error.
- **Campo azul claro del hero**: degradado a 135deg de `blue-tint-50` a `blue-tint-100` detrás del panel de vidrio, con manchas desenfocadas de `tuboleta-blue` al 30%, `blue-deep` al 20% (token `secondary`) y blanco al 90%. Solo fondo del hero; nunca texto ni botón.
- **Campo de medios de pago**: degradado de `blue-tint-50` a blanco con manchas desenfocadas de `tuboleta-blue` al 15% y `blue-tint-100`.

### Named Rules
**The One Yellow Rule.** El amarillo sólido es solo la acción principal; nunca fondo de panel, de campo ni texto. En Home aparece en el botón «Regístrate» del Header y, como acento de marca, en el degradado del medallón de la estrella; el campo del hero y los numerales de pasos son azules o tinta.

**The Brand Field Rule.** Se firma sobre azul (header, footer, franja, resumen) y se lee y escribe sobre blanco o gris. Los inputs nunca van sobre azul. El hero de Home usa un campo azul claro de la misma familia que Header y Footer, y dentro de su panel de vidrio solo el titular y el botón van en `tuboleta-blue`; el párrafo es `ink`.

**The Glass Over Color Rule.** El vidrio solo va sobre color o contenido que debe verse a través (hero, tarjetas de Home, alertas, cabecera fija, Loader). Nunca en formularios de checkout, inputs ni láminas de lectura, ni sobre fondo plano blanco.

## Typography

**Display Font:** Montserrat (con Arial, Helvetica, sans-serif)
**Body Font:** Montserrat (con Arial, Helvetica, sans-serif)

**Character:** Una sola familia geométrica, la de tuboleta.com; la jerarquía se construye con peso y tamaño.

### Hierarchy
- **Display** (800, 2.25 / 3 / 3.75rem según breakpoint, 1.1, tracking tight): titular de la franja de Home, ancho máximo 16ch, `text-balance`.
- **Headline** (700, 1.875rem): títulos de sección de Home; titular de checkout 1.5 a 1.875rem.
- **Title** (700, 1.125 a 1.25rem): nombre de medio de pago, encabezado de sección de formulario.
- **Body** (400, 1 a 1.125rem, 1.5): párrafos; máximo 48ch en la franja.
- **Label** (600, 0.875rem): etiquetas de campo; 0.75rem para insignias y ayudas.
- **Amount** (800, 2.25rem, tabular): monto del resumen de pago con la utilidad `num`.

### Named Rules
**The Weight Is The Hierarchy Rule.** Un solo tipo de letra; el escalón lo marcan el peso (400 / 600 / 700 / 800) y el tamaño. No se añade una segunda familia.

## Layout

Contenedor `max-w-6xl` centrado dentro de `main` (padding 32px móvil, 48px md). Home apila bloques con 56px: hero de campo azul claro con panel de vidrio (texto a la izquierda, medallón a la derecha desde lg), campo de medios de pago con rejilla (1, 2 y 4 columnas) y dos listas en dos columnas desde lg (seguridad y pasos) con huecos de 40px. Checkout: lámina blanca con cabecera de título e insignia de seguridad, y cuerpo en rejilla `minmax(0,1fr) / 20rem` en lg; el resumen es pegajoso (`lg:sticky top-6`) y va primero en móvil. Secciones de formulario en dos columnas desde md con huecos de 20px. Header fijo (`sticky top-0`, z-40) de 64px (74px md), footer en seis columnas en lg y acordeón en móvil. Ritmo: 8, 16, 24, 40, 56px.

## Elevation & Depth

Plano con tonos más una capa de vidrio. La profundidad viene del contraste de campos (azul, blanco, gris), de bordes de 1px `line-gray` y, donde hay color detrás, del vidrio esmerilado (relleno translúcido, borde de luz de 1px y desenfoque del fondo).

### Shadow Vocabulary
- **Form shadow** (`box-shadow: 0 1px 2px rgb(26 23 27 / 0.06), 0 8px 24px -12px rgb(26 23 27 / 0.18)`): solo en láminas grandes (lámina de checkout, hero de Home).
- **Glass** (relleno blanco al 55%, borde blanco al 70%, desenfoque 20px con saturación 160%, `--glass-shadow: 0 18px 40px -18px rgb(26 23 27 / 0.3)`, más luz interior de 1px arriba): panel del hero y tarjetas de medios de pago.
- **Glass strong** (relleno blanco al 82%, mismo borde, desenfoque y sombra): alertas, que deben leerse sobre cualquier contenido.
- **Glass brand** (azul Tuboleta al 93%, desenfoque 16px, saturación 150%, filete interior claro abajo, sin borde ni sombra externa): cabecera fija y overlay del Loader.

### Named Rules
**The Flat Cards Rule.** Tarjetas pequeñas, inputs y botones no llevan sombra; la sombra suave es solo de las láminas grandes. La sombra del vidrio es parte de su receta, no una sombra suelta.

**The Fallback Rule.** Todo vidrio degrada a casi opaco (blanco al 94 a 96%, o azul sólido para `glass-brand`) con `prefers-reduced-transparency: reduce` o sin soporte de `backdrop-filter`, para conservar el contraste.

## Shapes

Radio de 0.375rem (`rounded-custom`) en botones, inputs y select. Tarjetas, alertas y resumen de pago a 0.75rem (`rounded-xl`); el panel de vidrio del hero a 1rem (`rounded-2xl`); el campo del hero y el de medios de pago a 1.5rem (`rounded-3xl`). Círculos completos para medallones de icono (40, 44, 56px), insignias y numerales. Bordes de 1px `line-gray`. El medallón de la estrella es un disco `ink` con la estrella blanca en su interior.

## Components

### Buttons
- **Shape:** radio 0.375rem.
- **Primary:** relleno `action-yellow`, texto `ink` en negrita, padding 16x28px, flecha al final; hover `action-amber` en 200ms. En header, compacto 8x16px.
- **Hero:** dentro del panel de vidrio no va amarillo; el botón es `tuboleta-blue` con texto blanco (5.3:1), mismo radio y padding, hover y active `blue-deep`, y la flecha avanza 4px al pasar el mouse (sin movimiento con `prefers-reduced-motion`).
- **Mobile menu:** sólido `tuboleta-blue` con texto blanco, y contorno `tuboleta-blue` sobre blanco.
- **Focus:** anillo global de 2px `tuboleta-blue` con desfase 2px.

### Cards / Containers
- **Medio de pago:** vidrio (`glass`) sobre el campo de color suave, radio 0.75rem, relleno 24px, medallón `tuboleta-blue` de 56px con icono blanco, nombre en Title y nota al 75%.
- **Lámina de checkout:** blanca, borde `line-gray`, radio 0.75rem, form shadow; cabecera separada por filete. Sin tarjetas anidadas: las secciones se separan con filete `line-gray`.
- **Resumen de pago:** campo `tuboleta-blue`, radio 0.75rem, monto en Amount, referencia en píldora blanca al 15%, pasos con círculos blancos numerados, pie con candado.
- **Hero de Home:** campo azul claro (radio 1.5rem, form shadow, relleno 12 a 24px) con tres manchas desenfocadas y un panel `glass` de radio 1rem y relleno 32 a 64px; titular en `tuboleta-blue`, párrafo en `ink` al 80%, botón `tuboleta-blue`.
- **Alerta:** `glass-strong`, radio 0.75rem, relleno 16px; ícono circular de 36px con el color del tipo (rojo, verde, dorado con texto `ink`, azul), texto `ink`, barra de tiempo de 3px abajo; entra desde arriba en 0.4s con ease-out exponencial y se pausa al pasar el mouse. Sustituye a react-toastify; sin animación con `prefers-reduced-motion`.

### Inputs / Fields
- **Style:** fondo blanco, borde `ink` al 25% (45% en hover), radio 0.375rem, padding 12x16px, 14px.
- **Focus:** borde `tuboleta-blue` y halo de 4px `tuboleta-blue` al 20%; el contorno global se anula.
- **Error / Disabled:** borde y halo `danger-red`, mensaje 12px con icono; deshabilitado en `surface-gray` con texto al 50%.
- **Select:** nativo con chevron propio o spinner.
- **Section header:** medallón de 44px `blue-tint-50` con icono azul, título 700 y descripción al 70%.

### Navigation
Header de vidrio de marca (`glass-brand`, azul Tuboleta al 93%), fijo al desplazar, de 64px con logo Tuboleta y acciones a la derecha (iniciar sesión con subrayado al pasar, registro en botón amarillo compacto); menú móvil a pantalla completa en blanco. Footer `tuboleta-blue` sólido con columnas, insignias sociales circulares al 10% blanco y acordeón en móvil.

### Signature: Medallón de la estrella
Disco con el degradado dorado de la marca (`gold` a `amber`, 135°) y la estrella blanca de Tuboleta en su centro (240px en Home, `alt=""`, anillo de 8px blanco al 60%, sin sombra). Es el único toque amarillo del hero. En el Loader, el medallón gira (1.8s, sin movimiento con `prefers-reduced-motion`) sobre vidrio de marca.

### Focus ring and selection
Foco global: contorno de 2px `tuboleta-blue`, desfase 2px. Selección de texto: fondo `blue-tint-100`, texto `ink`.

## Do's and Don'ts

### Do:
- **Do** usar Montserrat en toda pantalla y marcar la jerarquía con peso y tamaño.
- **Do** reservar `action-yellow` para la acción principal; los numerales de pasos van en `tuboleta-blue` con texto blanco.
- **Do** poner texto de lectura y campos sobre blanco o `surface-gray`, y la marca sobre `tuboleta-blue`.
- **Do** usar 0.375rem en controles y 0.75rem en tarjetas.
- **Do** separar secciones de formulario con filetes `line-gray`, sin cajas anidadas.
- **Do** mantener la estrella solo como medallón y respetar `prefers-reduced-motion`.
- **Do** usar vidrio solo sobre color o contenido (hero, tarjetas de Home, alertas, cabecera fija, Loader) y conservar los respaldos para `prefers-reduced-transparency` y sin `backdrop-filter`.
- **Do** comunicar el tipo de alerta con el color del ícono y la barra, con cuerpo de vidrio claro y texto `ink`.

### Don't:
- **Don't** alterar el Azul Tuboleta ni el logo.
- **Don't** añadir una segunda familia tipográfica.
- **Don't** usar amarillo como fondo de panel o de campo, ni como texto.
- **Don't** añadir sombras duras desplazadas ni sombras en tarjetas pequeñas.
- **Don't** reintroducir texturas, patrones u ornamento de otro mundo visual; el único adorno es el medallón.
- **Don't** poner vidrio en formularios de checkout, inputs ni láminas de lectura, ni apilar vidrio sobre vidrio.
- **Don't** poner amarillo ni más azul que el titular y el botón dentro del panel de vidrio del hero, ni reintroducir anillos decorativos o la sombra del medallón.
