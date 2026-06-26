import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/storage';

const ADMIN_PASSWORD = 'canaria2026';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await getOrders();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;

  let filtered = orders;
  if (status) filtered = filtered.filter(o => o.status === status);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({ data, total, page, pageSize, totalPages });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, status } = body;
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

  orders[index] = { ...orders[index], status, updated_at: new Date().toISOString() };
  await saveOrders(orders);

  return NextResponse.json(orders[index]);
}
