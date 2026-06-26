import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getOrders } from '@/lib/storage';

const ADMIN_PASSWORD = 'canaria2026';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await getProducts();
  const orders = await getOrders();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingReservations = orders.filter(o => o.status === 'pending').length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map(o => ({
      id: o.id,
      ticket_code: o.ticket_code,
      customer_name: o.customer_name,
      total: o.total,
      status: o.status,
      created_at: o.created_at,
    }));

  return NextResponse.json({
    stats: { totalProducts, totalOrders, totalRevenue, pendingReservations },
    recentOrders,
  });
}
