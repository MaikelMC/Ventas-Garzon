# REDESIGN PLAN — Ventas Garzón

## Clasificación por vista

### CONSERVAR (funciona bien, no tocar fondo)

| Vista | Razón |
|-------|-------|
| **LandingPage** | Hero con gradiente on-brand, skeleton loading, dark mode, Framer Motion. Solo falta estado error. |
| **CartPage** | Feature-complete: vacío/populado, quantity controls, resumen lateral, CTA. Solo placeholder.com como fallback. |
| **LoginPage** | UI pulida, password toggle, dark mode, error animado. Remover credenciales dev del UI. |
| **RegisterPage** | Password strength bar, confirm-match, success state. Remover auto-redirect timeout. |
| **AdminPage** | CRUD completo con 4 tabs, paginación, modales, skeletons, empty states, guards. Refactor `confirm()` nativo a modal. |
| **ProfilePage** | Stats grid, account info, order history + modal detalle. Manejo de error individualizado. |
| **AboutPage** | Página informativa estática, cumple su propósito. Aceptable como está. |
| **ForgotPasswordPage** | Form + success state, loading spinner. Añadir validación email. |

### MEJORAR (estructura ok, ejecución visual floja)

| Vista | Prioridad | Qué mejorar |
|-------|-----------|-------------|
| **OrdersPage** | Alta | Expandir items del pedido, paginación, colores por status, enlace a detalle |
| **FAQPage** | Baja | Acordeón expand/collapse, search, fetch desde API |

### REDISEÑAR (estructura y visual requieren cambio)

| Vista | Prioridad | Por qué |
|-------|-----------|---------|
| **ProductsPage** | **Crítica** | Vista más traficada del e-commerce. Sin paginación, sin URL sync, sin estado error, categorías hardcodeadas. La grilla es genérica y no aprovecha el espacio. |
| **CheckoutPage** | Alta | No tiene campos de contacto (nombre, teléfono, notas). El flujo de confirmación es demasiado minimalista para un checkout real. |

## Plan de ataque

1. **REDISEÑAR ProductsPage** — prioridad crítica, máximo tráfico
2. **REDISEÑAR CheckoutPage** — flujo crítico de conversión
3. **MEJORAR OrdersPage** — experiencia post-compra
4. **MEJORAR FAQPage** — mejora menor
5. **CONSERVAR** — mantener las 8 vistas restantes, solo corregir anti-patrones puntuales

## Anti-patrones a corregir en vistas CONSERVAR
- LandingPage: añadir estado error en fetch
- CartPage: reemplazar placeholder.com con fallback local
- LoginPage: remover dev credentials del UI
- RegisterPage: reemplazar setTimeout redirect por navegación manual
- AdminPage: reemplazar `confirm()` con modal in-app
- ProfilePage: error handling individualizado para stats vs orders
- ForgotPasswordPage: validación de formato email
