import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders, getProducts, saveProducts } from '@/lib/storage';
import { generateTicketCode } from '@/lib/utils';
import { Order, OrderItem } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerName, customerIdCard, customerPhone, paymentMethod } = body;

    if (!items?.length || !customerName || !customerIdCard || !customerPhone) {
      return NextResponse.json({ message: 'Faltan datos requeridos' }, { status: 400 });
    }

    const products = await getProducts();
    const orders = await getOrders();

    let total = 0;
    const orderItems: OrderItem[] = items.map((item: any, idx: number) => {
      const product = products.find(p => p.id === item.id);
      const price = item.price || product?.price || 0;
      total += price * item.quantity;
      return {
        id: idx + 1,
        product_id: item.id,
        name: product?.name || 'Producto',
        image: product?.image || '',
        quantity: item.quantity,
        price,
      };
    });

    let ticketCode = generateTicketCode();
    while (orders.some(o => o.ticket_code === ticketCode)) {
      ticketCode = generateTicketCode();
    }

    const newOrder: Order = {
      id: Date.now(),
      ticket_code: ticketCode,
      customer_name: customerName,
      customer_id_card: customerIdCard,
      customer_phone: customerPhone,
      payment_method: paymentMethod || 'cash',
      items: orderItems,
      total,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    orders.push(newOrder);
    await saveOrders(orders);

    return NextResponse.json({ ...newOrder, ticket_code: ticketCode }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error al crear la reserva' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const orders = await getOrders();
  const { searchParams } = new URL(req.url);
  const idCard = searchParams.get('id_card');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;

  let filtered = orders;
  if (idCard) filtered = filtered.filter(o => o.customer_id_card === idCard);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({ data, total, page, pageSize, totalPages });
}
