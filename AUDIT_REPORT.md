# Auditoría UX/UI — Ventas Garzón

> Fecha: 2026-06-20 | Vistas auditadas: 12 + componentes compartidos

---

## CRÍTICO

### C1. Sin soporte `prefers-reduced-motion`

**Dónde:** `client/src/utils/animations.tsx` — SlideUp, FadeIn, fadeInVariants, slideUpVariants
Todas las vistas usan estos componentes.

**Problema:** Ningún componente de animación verifica `prefers-reduced-motion`. En un proyecto cuya audiencia incluye usuarios en Cuba con conexiones lentas y dispositivos variados, esto es prioritario. WCAG AA exige alternativas.

**Solución:** Agregar `@media (prefers-reduced-motion: reduce)` que convierta animaciones a crossfade/instant.

---

### C2. Imágenes placeholder externas

**Dónde:**
- `client/src/components/ProductCard.tsx` línea 22: `src={'https://via.placeholder.com/300x200?text=' + product.name}`
- `client/src/pages/CartPage.tsx` línea 92: `src={item.image || 'https://via.placeholder.com/200'}`

**Problema:** Dependencia de servicio externo (placeholder.com) que puede fallar en redes cubanas. Las URL con `text=` contienen nombres de productos que son datos de negocio expuestos en URL de terceros.

---

### C3. Navegación por teclado — icon‑only buttons sin aria‑label

**Dónde:** Múltiples componentes:
- CartPage: botones trash/plus/minus (sin aria-label)
- Header: dark mode toggle
- AdminPage: edit/delete buttons en tablas
- ProfilePage: close modal button

**Problema:** Usuarios de lector de pantalla no pueden identificar la acción. WCAG AA 4.1.2.

---

### C4. Glassmorphism como default en header

**Dónde:** `client/src/components/Header.tsx` línea 129-130: `bg-white/80 dark:bg-surface-900/80 glass`
`client/src/index.css` clase `.glass` con `backdrop-filter: blur(12px)`

**Problema:** DESIGN.md indica explícitamente "Don't use glassmorphism as default treatment". El header usa blur+glass todo el tiempo.

---

## IMPORTANTE

### I1. Emoji como icono estructural en ProductCard

**Dónde:** `client/src/components/ProductCard.tsx` línea 38:
`{'🧹 Aseo'}` y `{'🍽️ Alimentos'}`

**Problema:** DESIGN.md dice "No emoji as icons." Usar emojis en badges estructurales es inconsistente y no escalable. Deberían ser SVG icons (Lucide tiene `Sparkles` para aseo, `Utensils` para alimentos).

---

### I2. Gradiente decorativo en botones — inconsistente con design system

**Dónde:** Todas las vistas usan `bg-gradient-to-r from-primary-500 to-primary-600` en botones primarios.

**Problema:** DESIGN.md define botón primario como color sólido (#10b981 → #059669 en hover), no gradient. El gradient sobre‑decoración que el design system evita explícitamente.

---

### I3. Status config incompleto vs tipos definidos

**Dónde:** `ProfilePage.tsx` línea 12 y `AdminPage.tsx` línea 26
Types define: `'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'`
StatusConfig solo cubre: `pending | confirmed | cancelled`

**Problema:** `confirmed` no está en el type pero se usa en UI. `processing`, `shipped`, `delivered` no tienen representación visual definida. Discrepancia entre tipos y UI.

---

### I4. Checkout — sin validación de formulario por campo

**Dónde:** `client/src/pages/CheckoutPage.tsx`

**Problema:** No hay formulario de datos de envío/pago — solo un botón de confirmación. El checkout muestra resumen pero no captura dirección, nombre, ni método de pago. Flujo incompleto para B2B.

---

### I5. Sin estado empty para búsqueda sin resultados en ProductsPage (resuelto parcialmente)

**Dónde:** `ProductsPage.tsx` línea 77-85

**Problema:** Hay empty state para "no se encontraron productos" con diseño decorativo, pero no hay mensaje de ayuda ni sugerencia de qué hacer (cambiar filtros, buscar otra cosa). El empty state es decorativo pero no instructivo.

---

### I6. Header — sin skip link

**Dónde:** `client/src/components/Header.tsx`

**Problema:** No hay enlace "Saltar al contenido principal" antes de la navegación. WCAG AA 2.4.1.

---

### I7. Animaciones sin variantes de timing

**Dónde:** `client/src/utils/animations.tsx`

**Problema:** Todas las animaciones usan `duration: 0.6` fijo. Sin variación contextual (entrada más rápida para micro-interacciones vs más lenta para hero). El diseño system pide 150-300ms para micro-interacciones.

---

### I8. La Landing carga productos en `useEffect` pero no maneja error state

**Dónde:** `LandingPage.tsx` línea 13-20

**Problema:** Si `loadProducts()` falla, solo logea el error. El usuario ve skeletons infinitos (nunca se cambia `loading` a `false` en el catch).

---

## MEJORA

### M1. Touch targets — verificar en mobile

**Dónde:** Múltiples componentes con `p-2` o `p-2.5` para botones icon-only (16-20px de padding). En mobile con iconos de 16-20px, el touch target total puede ser ~48-56px lo cual está en el límite de 44x44px. Los botones de edición/eliminación en AdminPage tienen `p-2` (8px padding) que resulta en targets pequeños (~32px) — no cumplen WCAG.

### M2. AboutPage y FAQPage — estructura monolítica

Ambas páginas son single-card estáticas sin loading ni error states (no los necesitan por ser contenido fijo, pero la estructura es frágil para escalar).

### M3. FAQ — sin `<details>/<summary>` nativo

Las preguntas siempre expandidas. Para pocas FAQs funciona, pero no usa el elemento semántico HTML nativo.

### M4. AdminPage — sin confirmación nativa para borrados

Usa `confirm()` nativo (modal blocking). Debería usar el mismo modal que el producto para consistencia.

### M5. ProductsPage — 2 categorías hardcodeadas

`categories` es un array hardcodeado. No escala si se agregan categorías desde el backend.

### M6. LoginPage — credenciales de desarrollo expuestas

Las credenciales admin están hardcodeadas en la UI (`Admin@1234`). Deberían estar en .env o solo en documentación.

### M7. OrdersPage — hardcodea 3 skeleton items

En lugar de mostrar la cantidad correcta basada en paginación.

### M8. Colores hardcodeados en Tailwind config vs tokens semánticos

Los colores surface y primary están en `tailwind.config.cjs` pero los componentes usan clases como `text-surface-500` y `bg-surface-50` — OK. Sin embargo, el `dark:` modo usa clases separadas en cada componente en vez de variables CSS. Hay duplicación de valores.

---

## RESUMEN POR VISTA

| Vista | Críticos | Importantes | Mejoras |
|-------|----------|-------------|---------|
| LandingPage | C1 | I2, I8 | — |
| ProductsPage | C1, C3 | I1, I2, I5 | M5 |
| CartPage | C1, C2, C3 | I2 | — |
| CheckoutPage | C1, C3 | I2, I4 | — |
| LoginPage | C1, C3 | I2, I6 | M6 |
| RegisterPage | C1, C3 | I2 | — |
| ForgotPasswordPage | C1, C3 | I2 | — |
| AdminPage | C1, C3 | I2, I3, I6 | M1, M4 |
| OrdersPage | C1 | I2, I3 | M7 |
| ProfilePage | C1, C3 | I2, I3 | — |
| AboutPage | C1 | I2 | M2 |
| FAQPage | C1, C3 | I2 | M2, M3 |
| Header (global) | C4 | I6 | — |
| Footer (global) | — | — | — |
| ProductCard (global) | C2 | I1, I2 | — |
| Animaciones (global) | C1 | I7 | — |
