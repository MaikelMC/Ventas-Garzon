# MEMORIA DEL PROYECTO — Ventas Garzón

## VARIABLES DEL PROYECTO
- proyecto_nombre: Ventas Garzón
- proyecto_descripcion: Aplicación de comercio electrónico para hogares cubanos y pequeños comerciantes en Santiago de Cuba. Plataforma local para artículos de aseo y alimentos, con delivery confiable.
- proyecto_audiencia: Hogares cubanos (consumer, mobile-first) y pequeños comerciantes/bodegas (B2B, desktop/tablet). Ambos grupos comparten: español, contexto cubano, confianza en marca local, necesidad de delivery confiable.
- proyecto_stack: React 18.2, TypeScript, Vite, Tailwind CSS 3, Framer Motion, Zustand, React Router 6, Axios, Lucide React, Zod / Express, Node.js, PostgreSQL, JWT, Bcrypt, CORS
- proyecto_tono_marca: Moderno, eficiente, amigable
- direccion_visual_elegida: Bazar Digital — mercado cálido con bento grid asimétrico (mixed card sizes 2×2, 2×1, 1×2, 1×1), tarjetas image-dominant con texto overlay en featured, filtros pill con spring physics, scroll reveals, surface slate existente con noise texture sutil, dark mode slate-900. Layout orgánico que evita la grilla equitativa genérica. Filosofía: "un mercado de confianza, no un supermercado frío".
- paleta_colores: (definida en DESIGN.md) primary: #10b981, primary-deep: #059669, secondary: #f59e0b, secondary-deep: #d97706, surface: #ffffff, surface-dim: #f9fafb, ink: #1f2937, success: #059669, warning: #f59e0b, error: #ef4444, info: #3b82f6
- tipografia_elegida: Outfit (display/headings), DM Sans (body), JetBrains Mono (mono/code)
- skill_estilo_principal: high-end-visual-design
- anti_patrones_a_evitar: (pendiente — Fase 1)
- vistas_principales: LandingPage, ProductsPage, CartPage, CheckoutPage, LoginPage, RegisterPage, AdminPage, OrdersPage, ProfilePage, AboutPage, FAQPage, ForgotPasswordPage
- flujos_criticos: (pendiente — Fase 6)

## ESTADO ACTUAL
- fase_actual: 7-banners-completos
- paso_actual: 18-demo-animado-html
- ultima_actualizacion: 2026-06-20

## LOG DE PROGRESO
| Fecha | Fase | Skill | Decisiones/Acciones | Archivos |
|-------|------|-------|--------------------|----------|
| 2026-06-20 | 0-setup | — | Creación inicial de PROJECT_MEMORY.md | .agents/memory/PROJECT_MEMORY.md |
| 2026-06-20 | 0-paso1 | customize-opencode | Stack detectado: React 18, Vite, Tailwind 3, Express, PostgreSQL. MCP Playwright configurado. AGENTS.md generado con contexto completo del proyecto. | opencode.json, AGENTS.md |
| 2026-06-20 | 0-paso2 | impeccable | Init ejecutado. PRODUCT.md y DESIGN.md ya existían completos. Variables de marca ya rellenadas en memoria. | — |
| 2026-06-20 | 1-paso3 | ui-ux-pro-max | Auditoría UX completa de las 12 vistas + componentes compartidos. Reporte generado con 4 críticos, 8 importantes, 8 mejoras. | AUDIT_REPORT.md |
| 2026-06-20 | 1-paso4 | impeccable | Critique completada (no se encontraron issues adicionales en detección automática). Anti-patrones consolidados (20 items) en PROJECT_MEMORY.md. Fase 1 completada. | PROJECT_MEMORY.md |
| 2026-06-20 | 2-paso5 | ckm:brand | Marca refinada: paleta semántica completa (success/warning/error/info), 5 reglas de voz textual, tabla aplicación UI vs Marketing. Todo documentado en DESIGN.md. | DESIGN.md, PROJECT_MEMORY.md |
| 2026-06-20 | 2-paso6 | ckm:design-system | Design system implementado: tokens CSS (light+dark mode), escala tipográfica completa, sombras (5 niveles), bordes (4 niveles), breakpoints, interacción en tailwind.config.cjs + index.css. | tailwind.config.cjs, index.css |
| 2026-06-20 | 3-paso7 | redesign-existing-projects | Análisis completo de 12 vistas. REDESIGN_PLAN.md generado: 8 CONSERVAR, 2 MEJORAR (OrdersPage, FAQPage), 2 REDISEÑAR (ProductsPage crítica, CheckoutPage alta). | REDESIGN_PLAN.md |
| 2026-06-20 | 3-paso8 | design-taste-frontend | 3 direcciones visuales generadas para ProductsPage. Usuario elige Dirección 1 "Bazar Digital" con paleta actual. Alias coloreado a slate. Prototipo en design/prototypes/direction-1-bazar-digital.html. | direction-1-bazar-digital.html |
| 2026-06-20 | 3-paso9 | high-end-visual-design | Reglas de profundización definidas para Bazar Digital: Double-Bezel en cards, Button-in-Button en CTAs, spring physics, scroll reveals, grain overlay fixed, macro-whitespace (py-24+). | PROJECT_MEMORY.md |
| 2026-06-20 | 4-paso10 | huashu-design | 4 prototipos HTML hi-fi creados siguiendo Bazar Digital: ProductsPage (direction-1), CheckoutPage, OrdersPage, FAQPage. Todos con estados completos (loading/empty/error/success), dark mode, responsive, animaciones. | design/prototypes/*.html |
| 2026-06-20 | 5-paso11 | ckm:ui-styling + frontend-design | ProductsPage implementada en código real con Bazar Digital: sticky filter pills, bento grid (featured card 2×2), error state con retry, load more, URL query params, debounced search. ProductCard mejorado: variante featured image-dominant, button-in-button icon, aria-labels, fallback img SVG local. | ProductsPage.tsx, ProductCard.tsx, animations.tsx |
| 2026-06-20 | 5-paso12 | ckm:ui-styling | CheckoutPage reescrita: customer fields (name/phone/address/notes), payment method selector (efectivo/transferencia/Nequi/Daviplata/tarjeta), order summary, validation de campos, estados loading/error/success. | CheckoutPage.tsx |
| 2026-06-20 | 5-paso12 | ckm:ui-styling | OrdersPage reescrita: status filter pills (Todos/Pendiente/Confirmado/Enviado/Entregado/Cancelado), expandable items con product thumbnails, paginación, estados loading/empty/error, per-status badge coloring. | OrdersPage.tsx |
| 2026-06-20 | 5-paso12 | ckm:ui-styling | FAQPage reescrita: accordion expandible, search con Ctrl+K, category filters (Pedidos/Envío/Pagos/Devoluciones), 11 preguntas reales, contact CTA, estados loading/empty. | FAQPage.tsx |
| 2026-06-20 | 5-paso12 | impeccable | ProductsPage migrada a Garzón Prime: CSS columns masonry, cards variant="prime", tokens reemplazados, aria-labels añadidos. Polish en OrdersPage (aria-expanded, aria-current, aria-controls, containerVariants corregido), FAQPage (aria-expanded, role="region", aria-pressed en filtros). | ProductsPage.tsx, ProductCard.tsx, OrdersPage.tsx, FAQPage.tsx |
| 2026-06-20 | 5-paso12 | impeccable | Build exitoso (1632 modules, 56.87 KB CSS, 467.03 KB JS, 4.53s). Detector impeccable: 0 issues encontrados. Audit visual: contraste WCAG AA, dark mode, responsive, keyboard nav, prefers-reduced-motion en todas las vistas implementadas. Fase 5 completada. | -- |
| 2026-06-20 | 6-paso13 | playwright-core + playwright-pom + playwright-ci | Playwright instalado + config. 7 Page Objects creados (Login, Products, Cart, Checkout, Orders, FAQ, Header). 4 test specs: navigation (5 tests), products (5 tests), auth (5 tests), checkout (6 tests). CI workflow en .github/workflows/playwright.yml con PostgreSQL service container, sharding, artifacts. | playwright.config.ts, tests/pages/*.ts, tests/specs/*.ts, .github/workflows/playwright.yml |
| 2026-06-20 | 7-paso14 | ckm:brand + webfetch | Investigación de referencias para e-commerce/grocery/local delivery: Rappi, Uber Eats, Walmart Grocery, Amazon Fresh, MercadoLibre, Whole Foods Market. Patrones extraídos: gancho corto, CTA accionable, producto protagonista, fecha/oferta visible, confianza logística. | marketing/references/referencias-creativas.md, PROJECT_MEMORY.md |
| 2026-06-20 | 7-paso15 | ckm:brand | Copy publicitario generado para campaña “Lo que falta, llega fácil”: 3 variantes por formato OG/web, feed cuadrado, story vertical y leaderboard, con tono moderno/eficiente/amigable y CTA específico. | marketing/copy-campana-bazar-digital.md |
| 2026-06-20 | 7-paso16 | ckm:design | Assets vectoriales creados sin dependencias externas: logo wordmark SVG y product montage SVG para banners/demo. | marketing/assets/logo-wordmark.svg, marketing/assets/product-montage.svg |
| 2026-06-20 | 7-paso17 | ckm:banner-design | Banners HTML composados en 4 formatos: OG 1200×630, feed 1080×1080, story 1080×1920, leaderboard 728×90. Cada formato incluye 3 variantes de composición y copy. | marketing/banners/og-web-bazar-digital.html, marketing/banners/feed-square-bazar-digital.html, marketing/banners/story-vertical-bazar-digital.html, marketing/banners/leaderboard-bazar-digital.html |
| 2026-06-20 | 7-paso18 | huashu-design | Demo animado HTML del flujo principal (explorar → agregar → checkout → confirmación → cierre) con timeline de 40s, sin audio, listo para grabar si se requiere MP4/GIF. | marketing/video/demo-flujo-principal.html |

## DECISIONES CLAVE
- **Registro visual confirmado:** Product (app UI, e-commerce). El diseño SIRVE al producto.
- **Paleta existente mantenida:** Verde #10b981 + Ámbar #f59e0b con surface slate. No se cambia.
- **Tipografía existente mantenida:** Outfit (display) + DM Sans (body) + JetBrains Mono (code).

## REGLAS DE EJECUCIÓN (de high-end-visual-design)
_Aplican a toda implementación de la dirección Bazar Digital._

### Arquitectura de componentes
- **Double-Bezel (Doppelrand):** Cards principales envueltas en shell externo (p-1.5, bg-border/30, rounded-xl) + inner core con su propio background y shadow inset. NO poner cards planas sobre el fondo.
- **Button-in-Button:** CTAs con icono anidado en su propio círculo (w-1.75rem h-1.75rem rounded-full bg-white/15), flush contra el padding derecho del botón. Icono se traduce en hover (translateX + scale).
- **Macro-whitespace:** Section padding mínimo py-24. El diseño debe respirar.

### Motion
- **Curvas:** Solo custom cubic-bezier. Prohibido linear o ease-in-out. Usar --spring-fast: cubic-bezier(0.34,1.56,0.64,1) para micro-interacciones, --spring-slow: cubic-bezier(0.22,1,0.36,1) para transiciones de layout, --ease-out: cubic-bezier(0.16,1,0.3,1) para entradas.
- **Scroll reveals:** IntersectionObserver o whileInView. translate-y-16 + blur-md → translate-y-0 + blur-0 en 800ms+. Nunca window.addEventListener('scroll').
- **Magnetic hover:** En CTAs, hover → translateY(-1px) + shadow. Active → scale(0.97). group-hover para iconos internos.
- **prefers-reduced-motion:** TODO el motion se colapsa a instant/static. No excepciones.

### Surface
- **Grain overlay:** Fixed, inset-0, pointer-events-none, z-50, noise SVG como background-image, opacity 0.025 (light) / 0.04 (dark).
- **backdrop-blur:** Solo en elementos fixed/sticky (navbars, overlays). Nunca en scrolling containers.
- **Sombras tintadas:** Shadows usan color-mix con el color de fondo. No black puro a baja opacidad.

### Layout
- **Bento grid:** Mixed card sizes (col-span/row-span). Nunca grilla equitativa. Mobile collapse a single column con w-full.
- **min-height:** Siempre min-h-[100dvh], nunca h-screen (iOS Safari).
- **Animaciones:** Solo transform y opacity. Nunca top/left/width/height.

### Tipografía
- **Display:** Outfit 700-800, tracking-tighter para headlines grandes.
- **Body:** DM Sans 400-600, max-width 65ch para párrafos.
- **Eyebrow tags:** Max 1 por cada 3 secciones. Pill shape, text-[0.7rem] uppercase tracking-[0.08em].

## ANTI-PATRONES A EVITAR
_Consolidado de auditoría UX + detección automatizada. Ordenado por severidad._

### Críticos
1. **Imágenes placeholder externas** — `via.placeholder.com` en `ProductCard.tsx`. Produce 404s y aspecto no profesional. Usar assets locales o URLs reales.
2. **Sin prefers-reduced-motion** — `animations.tsx` y componentes usan `framer-motion` sin respetar `prefers-reduced-motion: reduce`. Rompe accesibilidad WCAG AA.
3. **Icon-only buttons sin aria-label** — Varios botones tipo close/menu/cart sin etiqueta accesible.
4. **Glassmorphism en Header** — `backdrop-filter: blur()` usado como fondo default. Contradice el design system (surface sólido). Ocurre en `Header.tsx`.

### Importantes
5. **Sin skip-to-content link** — Todas las páginas carecen de enlace de navegación por teclado.
6. **Imágenes sin atributos de tamaño** — `width`/`height` ausentes en varios `<img>` causando CLS.
7. **Estados vacíos genéricos** — Listas y tablas sin estado "sin datos" o "cargando" definido.
8. **Sin meta description/OG tags dinámicos** — Cada vista debe tener head metadata única.
9. **Títulos de página no sincronizados con `<title>`** — `document.title` no se actualiza por ruta.
10. **Contraste insuficiente en modo claro** — Textos gris sobre surface claro no alcanzan 4.5:1.
11. **Sin feedback de carga en navegación** — Transiciones entre rutas sin indicador de carga.
12. **Sin stale-while-revalidate en fetching** — Llamadas API sin estrategia de caché.

### Mejoras
13. **Sin "saltar al producto" en catálogo** — Teclado no puede saltar a resultados de búsqueda.
14. **Sin breadcrumbs** — Navegación secundaria ausente en páginas anidadas.
15. **Sin debounce en búsqueda** — Inputs de búsqueda no tienen debounce.
16. **Sin confirmación en acciones destructivas** — Eliminar sin diálogo de confirmación.
17. **Sin animación de scroll suave** — `scroll-behavior: smooth` no está definido en CSS base.
18. **Sin truncamiento de texto en tarjetas** — Nombres largos pueden romper layout.
19. **Sin foco automático en modales** — Al abrir modal/drawer el foco no se mueve al primer elemento.
20. **npm audit sin verificar** — No hay script ni hook que verifique vulnerabilidades.

## REFERENCIAS
- `/DESIGN.md` — design system actual
- `/PRODUCT.md` — descripción del producto
- `/.agents/AUDIT_REPORT.md` — auditoría UX completa (4 críticos, 8 importantes, 8 mejoras)

## REFERENCIAS CREATIVAS
- `marketing/references/referencias-creativas.md` — patrones extraídos de Rappi, Uber Eats, Walmart Grocery, Amazon Fresh, MercadoLibre y Whole Foods Market para campaña Ventas Garzón.

## PENDIENTES / BLOQUEOS
- (ninguno)
