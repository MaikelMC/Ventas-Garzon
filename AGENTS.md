# Ventas Garzón — Contexto del Proyecto

## Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion, Zustand, React Router 6, Axios, Lucide React, Zod
- **Backend:** Node.js, Express, TypeScript, PostgreSQL, JWT, Bcrypt, Zod, CORS
- **Herramientas:** concurrently, tsx

## Estructura
- `/client` — Frontend React (Vite)
- `/server` — Backend Express API
- `/database` — SQL schema + seeds

## Rutas principales (Frontend)
| Ruta | Página | Propósito |
|------|--------|-----------|
| `/` | LandingPage | Hero, promos, productos destacados |
| `/products` | ProductsPage | Catálogo con filtros, búsqueda |
| `/cart` | CartPage | Carrito con persistencia localStorage |
| `/checkout` | CheckoutPage | Finalizar compra |
| `/login` | LoginPage | Inicio de sesión |
| `/register` | RegisterPage | Registro de usuario |
| `/admin` | AdminPage | Dashboard + CRUD productos + gestión |
| `/orders` | OrdersPage | Historial de órdenes |
| `/profile` | ProfilePage | Perfil de usuario |
| `/about` | AboutPage | Información |
| `/faq` | FAQPage | Preguntas frecuentes |
| `/forgot-password` | ForgotPasswordPage | Recuperación de contraseña |

## Diseño existente
- **Design system:** Documentado en `/DESIGN.md`
- **Paleta:** Primary: #10b981 (verde), Secondary: #f59e0b (ámbar)
- **Tipografía:** Outfit (display), DM Sans (body), JetBrains Mono (code)
- **Principios:** Mobile-first, WCAG AA, rendimiento en redes lentas, público dual (consumer + B2B)

## Comandos
- `npm run dev` — Inicia frontend (:3000) + backend (:5000) simultáneamente
- `npm run client` — Solo frontend
- `npm run server` — Solo backend
