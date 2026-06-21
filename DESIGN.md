---
name: Ventas Garzon
description: Local e-commerce platform for household essentials serving Cuban consumers and small retailers
colors:
  primary: "#10b981"
  primary-deep: "#059669"
  secondary: "#f59e0b"
  secondary-deep: "#d97706"
  surface: "#ffffff"
  surface-dim: "#f9fafb"
  surface-50: "#f8fafc"
  surface-100: "#f1f5f9"
  surface-200: "#e2e8f0"
  surface-300: "#cbd5e1"
  surface-400: "#94a3b8"
  surface-500: "#64748b"
  surface-600: "#475569"
  surface-700: "#334155"
  surface-800: "#1e293b"
  surface-900: "#0f172a"
  surface-950: "#020617"
  ink: "#1f2937"
  danger: "#ef4444"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "DM Sans, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, monospace"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "#ffffff"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
---

# Design System: Ventas Garzon

## 1. Overview

**Creative North Star: "The Local Market, Reimagined"**

This design system captures a modern, efficient, and friendly e-commerce experience for Cuban households and small retailers. The visual language balances contemporary digital patterns with the warmth and approachability of a trusted local business.

The system rejects the generic SaaS cream/beige aesthetic (anti-reference: warm-neutral backgrounds with token names like --paper, --cream, --sand). Instead, it uses a crisp, clean surface palette with purposeful accent color application. The primary green (#10b981) signals freshness and reliability, while the amber secondary (#f59e0b) adds energy and warmth to promotional moments.

**Key Characteristics:**
- Clean, uncluttered layouts with generous white space
- Purposeful motion that confirms state changes without decoration
- Mobile-first performance as a core feature (skeleton loading, optimized images)
- Dual-audience flexibility: consumer browsing and B2B efficiency
- Local Cuban identity through imagery and contact, not decorative tropes

## 2. Colors

The palette is restrained with two deliberate accents: emerald green for primary actions and amber for promotional emphasis.

### Primary
- **Emerald Primary** (#10b981): Primary actions, active states, links, focus rings, success indicators. Used sparingly to maintain its impact.
- **Emerald Deep** (#059669): Hover state for primary elements, depth variation.

### Secondary
- **Amber Secondary** (#f59e0b): Promotional badges, sale tags, cart count, limited stock alerts. Reserve for moments that need attention.
- **Amber Deep** (#d97706): Hover state for secondary elements.

### Neutral
- **Surface** (#ffffff): Primary content background, cards, modals.
- **Surface Dim** (#f9fafb): Body background, secondary surfaces.
- **Ink** (#1f2937): Primary text, headings.
- **Surface 400** (#94a3b8): Secondary text, placeholders, disabled states.
- **Surface 200** (#e2e8f0): Borders, dividers.
- **Surface 900** (#0f172a): Dark mode text.
- **Surface 950** (#020617): Dark mode background.

### Semantic
- **Success** (#059669 / emerald-600): Order delivered, payment confirmed, positive feedback.
- **Warning** (#f59e0b / amber-500): Low stock, pending payment, expiring soon.
- **Error** (#ef4444 / red-500): Failed payment, invalid input, server errors.
- **Info** (#3b82f6 / blue-500): Shipping updates, account changes, system messages.

### Named Rules
**The 10% Accent Rule.** Primary green appears on roughly 10% of any given screen surface. Its rarity makes it meaningful; spreading it dilutes its signal.

## 2b. Brand Voice

**Ventas Garzón habla como un dependiente de confianza: eficiente, directo y que conoce su mercancía.**

| Regla | Descripción | Correcto | Incorrecto |
|-------|-------------|----------|------------|
| 1. Directo y específico | Dar cifras exactas, no promesas genéricas | "Entrega en 24h o te devolvemos el envío" | "Te llegará rápido" |
| 2. Cálido sin ser cargante | Amable pero eficiente; sin charla innecesaria | "Tu pedido ya salió. Llegada estimada: mañana 10am" | "¡Hola! Esperamos que estés teniendo un día maravilloso lleno de bendiciones ✨" |
| 3. Español cubano natural | "Usted" en B2B, "tú" en consumer; slang solo en marketing | "Usted puede agendar su entrega semanal aquí" / "Escoge lo que te gusta" | "Hey guys, check it out!" |
| 4. Frases cortas y escaneables | Sin párrafos de más de 3 líneas en UI | "Stock actual: 12 unidades. Nuevo lote: viernes." | "Actualmente contamos con disponibilidad limitada de este producto, aunque estamos gestionando la reposición correspondiente para la próxima semana." |
| 5. Confianza por especificidad | Precios, fechas y cantidades siempre exactas | "CUP 350.00 — Ahorras CUP 50.00" | "Precio competitivo — oferta limitada" |

### Aplicación: UI vs. Marketing

| Contexto | Tono | Ejemplo |
|----------|------|---------|
| UI (botones, labels, errores) | Funcional, conciso, orientado a acción | "Producto agotado. Avísame cuando llegue." |
| UI (confirmaciones, estados) | Informativo, tranquilizador | "Tu pedido #4821 fue confirmado. Recibes un email con los detalles." |
| Marketing (hero, banners) | Cálido, benefit-driven, gancho emocional | "Lo que tu hogar necesita, sin salir de casa." |
| Marketing (redes, promos) | Energético, local, confianza | "Llegó el jabón que todos estaban esperando. 📦" |

## 3. Typography

**Display Font:** Outfit (sans-serif)
**Body Font:** DM Sans (sans-serif)
**Mono Font:** JetBrains Mono (monospace)

**Character:** The Outfit + DM Sans pairing delivers modern professionalism with approachable warmth. Outfit's geometric structure provides clean headings, while DM Sans offers comfortable body readability. The combination feels contemporary without being cold.

### Hierarchy
- **Display** (700, clamp(2.5rem, 5vw, 6rem), 1.1): Hero headlines, page titles. Reserve for moments that need impact.
- **Headline** (700, 2rem, 1.2): Section headings. Clear hierarchy above body text.
- **Title** (600, 1.5rem, 1.3): Subsection headings, card titles.
- **Body** (400, 1rem, 1.6): Paragraphs, descriptions. Max line length 65-75ch for readability.
- **Label** (500, 0.875rem, normal): Buttons, navigation, form labels. Uppercase for short labels (max 4 words).

### Named Rules
**The Single Scale Rule.** Two font families are sufficient: Outfit for display/headings, DM Sans for everything else. JetBrains Mono appears only in code or data contexts.

## 4. Elevation

This system uses a hybrid approach: flat surfaces at rest with subtle shadows for interactive elevation. Shadows appear on hover, focus, and modal states to convey depth without heaviness.

### Shadow Vocabulary
| Level | Value | Usage |
|-------|-------|-------|
| Subtle | 0 1px 3px rgba(0,0,0,0.1) | Cards at rest, secondary surfaces |
| Medium | 0 4px 6px rgba(0,0,0,0.1) | Cards on hover, dropdowns |
| Prominent | 0 10px 15px rgba(0,0,0,0.1) | Modals, sticky elements |
| Glow | 0 0 15px rgba(16,185,129,0.4) | Primary button hover, success states |
| None | none | Flat surfaces by default |

### Named Rules
**The Flat-By-Default Rule.** Surfaces start flat. Shadows appear only as feedback to user interaction or to establish hierarchy (modals above content).

## 5. Components

### Buttons
- **Shape:** Full pill (9999px radius) for primary actions, medium rounded (12px) for secondary.
- **Primary:** Green gradient (primary-500 to primary-600), white text, 12px 32px padding.
- **Hover/Focus:** Deeper green, subtle glow shadow, scale(1.02) feedback.
- **Ghost:** Transparent background, text color, pill shape. Used for secondary navigation.

### Cards
- **Corner Style:** 12px radius (rounded-lg).
- **Background:** White surface (#ffffff), dim surface (#f9fafb) for secondary cards.
- **Shadow Strategy:** Subtle at rest, medium on hover. No heavy shadows.
- **Border:** 1px solid surface-200 for definition.
- **Internal Padding:** 24px consistent spacing.

### Inputs
- **Style:** Light surface-50 background, surface-200 border, 12px radius.
- **Focus:** Primary green ring (2px), transparent border. Clear visual feedback.
- **Error:** Red border, error message below field.
- **Disabled:** Muted appearance, no interaction.

### Navigation
- **Style:** Fixed header with glass effect on scroll. Pill-shaped nav links.
- **Typography:** DM Sans, medium weight, 14px.
- **Default:** Surface text color.
- **Hover:** Subtle background tint, primary color text.
- **Active:** Primary color background, primary text.
- **Mobile:** Slide-out menu, full-width links.

### Status Indicators
- **Pending:** Amber background, amber text.
- **Confirmed:** Blue background, blue text.
- **Shipped:** Purple background, purple text.
- **Delivered:** Green background, green text.
- **Cancelled:** Red background, red text.

## 6. Do's and Don'ts

### Do:
- **Do** use skeleton loading instead of spinners in content areas.
- **Do** keep primary green usage to approximately 10% of screen surface.
- **Do** use full pill shapes (9999px) for primary buttons and tags.
- **Do** provide clear focus indicators for keyboard navigation.
- **Do** use amber exclusively for promotional attention (sales, badges, limited stock).
- **Do** maintain 4.5:1 contrast ratio for body text.
- **Do** use DM Sans for all body text and labels.

### Don't:
- **Don't** use warm-neutral backgrounds (cream/sand/beige) as body surface.
- **Don't** apply primary green to more than 10% of screen area.
- **Don't** use border-left or border-right greater than 1px as colored accent.
- **Don't** create gradient text effects (background-clip: text).
- **Don't** use glassmorphism as default treatment.
- **Don't** put tiny uppercase tracked eyebrows above every section.
- **Don't** use numbered section markers (01, 02, 03) as default scaffolding.
- **Don't** animate CSS layout properties unless truly needed.
- **Don't** use bounce or elastic easing curves.
- **Don't** create identical card grids with icon + heading + text repeated endlessly.