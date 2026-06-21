# Stack de Despliegue — Ventas Garzón

## Resumen
Plataforma ecommerce de reservas de productos con recogida en tienda. Stack fullstack JavaScript/TypeScript.

---

## Frontend

| Componente | Versión | Uso |
|---|---|---|
| **React** | 18 | Framework UI |
| **TypeScript** | ~5 | Tipado estático |
| **Vite** | 5 | Bundler y dev server |
| **Tailwind CSS** | 3 | Estilos utility-first |
| **Framer Motion** | 11 | Animaciones |
| **Zustand** | 5 | State management (carrito, auth) |
| **React Router** | 6 | Enrutamiento SPA |
| **Axios** | 1 | HTTP client |
| **Lucide React** | 0.400+ | Iconografía |
| **Zod** | 3 | Validación de schemas |

### Build
- `npm run build` genera el directorio `dist/` con archivos estáticos listos para servir.
- Puerto de desarrollo: `3000` (configurable en Vite).

---

## Backend

| Componente | Versión | Uso |
|---|---|---|
| **Node.js** | 18+ | Runtime |
| **Express** | 4 | Framework HTTP |
| **TypeScript** | ~5 | Tipado estático |
| **pg** | 8 | Cliente PostgreSQL (sin ORM) |
| **JWT** (jsonwebtoken) | 9 | Autenticación |
| **Bcrypt** | 5 | Hash de contraseñas |
| **Zod** | 3 | Validación de inputs |
| **Multer** | 1 | Upload de archivos (imágenes) |

### API
- Puerto: `5000` (configurable via `DB_PORT` en `.env`)
- Endpoints principales:
  - `POST /api/auth/*` — Login, registro, forgot-password
  - `GET /api/products/*` — Catálogo público
  - `POST /api/orders` — Crear reserva
  - `GET /api/admin/*` — Dashboard, CRUD, verificación de reservas
  - `POST /api/upload` — Subir imagen de producto

---

## Base de Datos

| Componente | Versión | Uso |
|---|---|---|
| **PostgreSQL** | 16 (Alpine) | Base de datos relacional |
| **Docker** | — | Contenedor para PostgreSQL |

### Configuración Docker
```yaml
# docker-compose.yml
services:
  ventas-postgres:
    image: postgres:16-alpine
    ports:
      - "5433:5432"   # 5433 para evitar conflicto con PG local
    environment:
      POSTGRES_DB: ventas_garzon
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pg_data:/var/lib/postgresql/data
```

### Tablas principales
- `users` — Usuarios con roles (admin/user)
- `products` — Productos con categorías (aseo, limpieza, alimentos, bebidas)
- `orders` — Reservas con ticket_code (VG-XXXX), datos del cliente, estado
- `order_items` — Items de cada reserva

### Schema
- Archivo: `database/schema.sql`
- Setup automático al iniciar el servidor (`server/src/database/setup.ts`)
- Seeds: 10 productos reales + admin por defecto

---

## Estructura del Proyecto

```
ventas-garzon/
├── client/              # Frontend React (Vite)
│   ├── public/products/ # Imágenes estáticas de productos
│   └── src/
│       ├── components/  # Header, Footer, ProductCard, ImageUploader
│       ├── pages/       # Landing, Products, Cart, Checkout, Admin, etc.
│       ├── services/    # API client (Axios)
│       ├── store/       # Zustand stores
│       └── types/       # TypeScript interfaces
├── server/              # Backend Express
│   ├── uploads/         # Imágenes subidas por usuarios (multer)
│   └── src/
│       ├── controllers/ # Lógica de negocio
│       ├── database/    # Pool PG + setup
│       ├── middleware/   # Auth JWT
│       ├── models/      # Queries SQL
│       └── routes/      # Endpoints
├── database/            # Schema SQL
├── docker-compose.yml   # PostgreSQL container
└── package.json         # Scripts: dev, client, server
```

---

## Variables de Entorno

### server/.env
```
DB_HOST=localhost
DB_PORT=5433
DB_NAME=ventas_garzon
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_clave_secreta_aqui
PORT=5000
NODE_ENV=development
```

---

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia frontend (:3000) + backend (:5000) |
| `npm run client` | Solo frontend |
| `npm run server` | Solo backend |
| `docker compose up -d` | Levanta PostgreSQL en puerto 5433 |
| `docker compose down` | Detiene PostgreSQL |

---

## Credenciales por Defecto

- **Admin:** `admin@ventasgarzon.com` / `Admin@1234`
- **DB:** `postgres` / `postgres` (puerto 5433)

---

## Consideraciones de Despliegue

1. **Puerto 5433**: PostgreSQL corre en 5433 para evitar conflicto con instalación local en 5432.
2. **Imágenes**: Las subidas van a `server/uploads/` — necesita persistencia de volumen.
3. **JWT_SECRET**: Cambiar en producción.
4. **CORS**: Configurado para `localhost:3000` en desarrollo — ajustar para dominio en producción.
5. **Static files**: El backend sirve `/uploads/` como archivos estáticos.
6. **Schema**: Se ejecuta automáticamente al iniciar — crea tablas + seeds si están vacías.
