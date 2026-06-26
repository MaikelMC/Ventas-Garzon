# INSTRUCTIVO PARA EL DESARROLLADOR - E-commerce Canaria AI (Versión Costo Cero)

**Fecha:** Junio 2026  
**Objetivo:** Preparar el proyecto (React + Node.js) para desplegar en Vercel **plan Hobby** con costo prácticamente cero, sin base de datos externa, sin autenticación de usuarios y con actualizaciones sin redeploy.

## Requisitos clave
- Eliminar completamente registro y login de usuarios.
- Usar **Vercel Blob** como almacenamiento persistente (1 GB gratis).
- Gestionar tres archivos JSON:
  - `products.json`
  - `orders.json`
  - `tickets.json`
- Ruta `/admin` protegida solo con contraseña hardcodeada.
- El cliente solo ve catálogo → carrito → realiza pedido → recibe ticket.
- Ticket sirve para mostrar en punto de recogida.

---

## 1. Estructura recomendada del proyecto

```
canaria-ai-ecommerce/
├── app/                      # Si usas Next.js App Router (recomendado)
├── components/
├── public/
├── data/                     # Solo para desarrollo local (no subir a git)
├── api/                      # Rutas API (serverless)
├── lib/                      # Helpers (blob.ts)
├── vercel.json
├── package.json
├── .env.local
└── README.md
```

**Recomendación:** Migra a **Next.js 14+ App Router** si aún no lo estás usando. Es lo más óptimo para Vercel.

---

## 2. Configuración de Vercel Blob

### Instalación
```bash
npm install @vercel/blob
```

### Crear Blob Store
1. Ve a [vercel.com/dashboard/storage](https://vercel.com/dashboard/storage)
2. Crea un nuevo Blob Store.
3. Copia el **Read + Write Token**.

### Archivo `.env.local`
```env
BLOB_READ_WRITE_TOKEN=tu-token-aquí
```

---

## 3. Helper para Blob (lib/blob.ts)

```ts
// lib/blob.ts
import { put, get } from '@vercel/blob';

const BLOB_FOLDER = 'data/';

export async function getJsonFromBlob(filename: string) {
  try {
    const { url } = await get(`${BLOB_FOLDER}${filename}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('File not found');
    return await response.json();
  } catch (error) {
    // Retorna array vacío si no existe
    return filename.includes('products') ? [] : [];
  }
}

export async function saveJsonToBlob(filename: string, data: any) {
  await put(`${BLOB_FOLDER}${filename}`, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

export async function uploadImageToBlob(file: File, filename: string): Promise<string> {
  const { url } = await put(`${BLOB_FOLDER}images/${filename}`, file, {
    access: 'public',
    contentType: file.type,
  });
  return url;
}
```

---

## 4. Rutas API principales (App Router)

### `/app/api/products/route.ts`
```ts
import { NextRequest } from 'next/server';
import { getJsonFromBlob, saveJsonToBlob } from '@/lib/blob';

export async function GET() {
  const products = await getJsonFromBlob('products.json');
  return Response.json(products);
}

export async function POST(req: NextRequest) {
  const { password, products } = await req.json();
  if (password !== 'canaria2026') {  // ← Cambiar esta contraseña
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await saveJsonToBlob('products.json', products);
  return Response.json({ success: true });
}
```

### `/app/api/orders/route.ts`
```ts
import { NextRequest } from 'next/server';
import { getJsonFromBlob, saveJsonToBlob } from '@/lib/blob';

export async function POST(req: NextRequest) {
  const orderData = await req.json();
  
  const orders = await getJsonFromBlob('orders.json');
  const tickets = await getJsonToBlob('tickets.json');

  const ticketCode = `TICK-${Date.now().toString().slice(-8)}`;

  const newOrder = {
    id: Date.now().toString(),
    ...orderData,
    status: 'pendiente',
    ticketCode,
    fecha: new Date().toISOString(),
  };

  orders.push(newOrder);
  tickets.push({
    ticketCode,
    orderId: newOrder.id,
    status: 'pendiente',
    fecha: new Date().toISOString(),
  });

  await saveJsonToBlob('orders.json', orders);
  await saveJsonToBlob('tickets.json', tickets);

  return Response.json({ 
    success: true, 
    ticketCode, 
    order: newOrder 
  });
}
```

### `/app/api/admin/route.ts` (para otras acciones del admin)

---

## 5. Panel Admin (/admin)

- Crea una página `/admin` con:
  - Login simple (contraseña hardcodeada).
  - Sección para subir imágenes (usando `uploadImageToBlob`).
  - Editor de productos (cargar, modificar, guardar).
  - Vista de pedidos y tickets.

Guarda el estado de login en `localStorage`.

---

## 6. Estructura recomendada de los JSON

**products.json**
```json
[
  {
    "id": "1",
    "name": "Producto Ejemplo",
    "price": 15.99,
    "description": "...",
    "imageUrl": "https://blob.vercel-storage.com/...",
    "stock": 50,
    "category": "..."
  }
]
```

**orders.json** y **tickets.json** similares (ver ejemplo en las rutas).

---

## 7. Instrucciones finales para el desarrollador

1. Implementar todo el flujo: catálogo → carrito → checkout → ticket.
2. Asegurarse que las imágenes se suban a Vercel Blob.
3. Proteger todas las rutas admin con la contraseña.
4. Crear un buen README con instrucciones de despliegue.
5. Probar localmente y luego desplegar en Vercel.
6. Entregar el proyecto listo para conectar con el dominio.

**Contraseña admin temporal:** `canaria2026` (cámbiala antes de producción).

---

**Listo para implementar.**  
Cuando termines, avísame para revisar o desplegar.

---

**Nota para ti (dueño del proyecto):**  
Una vez que tu agente termine, pásame el link del repositorio o dime y te ayudo con el deploy en Vercel + dominio.