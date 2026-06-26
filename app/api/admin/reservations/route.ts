import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders, getProducts, saveProducts } from '@/lib/storage';

const ADMIN_PASSWORD = 'canaria2026';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const ticket = searchParams.get('ticket');

  if (!ticket || ticket.length < 3) {
    return NextResponse.json({ message: 'Ingresa un código de ticket válido' }, { status: 400 });
  }

  const orders = await getOrders();
  const order = orders.find(o => o.ticket_code?.toUpperCase() === ticket.toUpperCase());

  if (!order) {
    return NextResponse.json({ message: 'Reserva no encontrada' }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, action } = body;
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });

  const order = orders[index];

  if (action === 'confirm') {
    if (order.status !== 'pending') {
      return NextResponse.json({ message: 'La reserva no está pendiente' }, { status: 400 });
    }

    const products = await getProducts();
    for (const item of order.items) {
      const productIndex = products.findIndex(p => p.id === item.product_id);
      if (productIndex !== -1) {
        products[productIndex].stock = Math.max(0, products[productIndex].stock - item.quantity);
      }
    }
    await saveProducts(products);

    orders[index] = { ...order, status: 'confirmed', updated_at: new Date().toISOString() };
  } else if (action === 'cancel') {
    if (order.status === 'confirmed') {
      const products = await getProducts();
      for (const item of order.items) {
        const productIndex = products.findIndex(p => p.id === item.product_id);
        if (productIndex !== -1) {
          products[productIndex].stock += item.quantity;
        }
      }
      await saveProducts(products);
    }

    orders[index] = { ...order, status: 'cancelled', updated_at: new Date().toISOString() };
  } else {
    return NextResponse.json({ message: 'Acción inválida' }, { status: 400 });
  }

  await saveOrders(orders);
  return NextResponse.json(orders[index]);
}
