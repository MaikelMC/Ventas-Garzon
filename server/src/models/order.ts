import { query, connect } from '../database/index.js';
import { ApiError, formatDatabaseError } from '../utils/helpers.js';

export interface Order {
  id: number;
  user_id: number;
  ticket_code: string;
  customer_name: string;
  customer_id_card: string;
  customer_phone: string;
  payment_method: string;
  total: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled';
  created_at: string;
  updated_at: string;
}

function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'VG-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createOrder(
  userId: number,
  items: any[],
  customerName: string,
  customerIdCard: string,
  customerPhone: string,
  paymentMethod: string,
  total: number
): Promise<Order> {
  const client = await connect();

  try {
    await client.query('BEGIN');

    let ticketCode = generateTicketCode();
    let attempts = 0;
    while (attempts < 10) {
      const exists = await client.query('SELECT id FROM orders WHERE ticket_code = $1', [ticketCode]);
      if (exists.rows.length === 0) break;
      ticketCode = generateTicketCode();
      attempts++;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, ticket_code, customer_name, customer_id_card, customer_phone, payment_method, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, ticketCode, customerName, customerIdCard, customerPhone, paymentMethod, total]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error: any) {
    await client.query('ROLLBACK');
    throw new ApiError(500, formatDatabaseError(error));
  } finally {
    client.release();
  }
}

export async function getOrders(userId: number, page: number = 1): Promise<any> {
  try {
    const limit = 10;
    const offset = (page - 1) * limit;

    const ordersResult = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].count);

    const orders = await Promise.all(
      ordersResult.rows.map(async (order: any) => {
        const itemsResult = await query(
          `SELECT oi.*, p.name, p.image FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        return { ...order, items: itemsResult.rows };
      })
    );

    return {
      data: orders,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    throw new ApiError(500, formatDatabaseError(error));
  }
}

export async function getOrderById(id: number, userId: number): Promise<any> {
  try {
    const orderResult = await query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);

    if (!orderResult.rows[0]) {
      throw new ApiError(404, 'Reserva no encontrada');
    }

    const itemsResult = await query(
      `SELECT oi.*, p.name, p.image FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    return { ...orderResult.rows[0], items: itemsResult.rows };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, formatDatabaseError(error));
  }
}

export async function getOrderByTicket(ticketCode: string): Promise<any> {
  try {
    const orderResult = await query(
      'SELECT * FROM orders WHERE ticket_code = $1',
      [ticketCode.toUpperCase()]
    );

    if (!orderResult.rows[0]) {
      throw new ApiError(404, 'Reserva no encontrada con ese código');
    }

    const order = orderResult.rows[0];

    const itemsResult = await query(
      `SELECT oi.*, p.name, p.image, p.stock as current_stock FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    return { ...order, items: itemsResult.rows };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, formatDatabaseError(error));
  }
}

export async function confirmOrder(id: number): Promise<Order> {
  const client = await connect();

  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id, status FROM orders WHERE id = $1', [id]);
    if (!existing.rows[0]) {
      throw new ApiError(404, 'Reserva no encontrada');
    }

    if (existing.rows[0].status !== 'pending') {
      throw new ApiError(400, 'Solo se pueden confirmar reservas pendientes');
    }

    const items = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id]);
    for (const item of items.rows) {
      await client.query(
        'UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    const result = await client.query(
      "UPDATE orders SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, formatDatabaseError(error));
  } finally {
    client.release();
  }
}

export async function cancelOrder(id: number): Promise<Order> {
  const client = await connect();

  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id, status FROM orders WHERE id = $1', [id]);
    if (!existing.rows[0]) {
      throw new ApiError(404, 'Reserva no encontrada');
    }

    if (existing.rows[0].status === 'confirmed') {
      const items = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id]);
      for (const item of items.rows) {
        await client.query(
          'UPDATE products SET stock = stock + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }
    }

    const result = await client.query(
      "UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, formatDatabaseError(error));
  } finally {
    client.release();
  }
}

export async function updateOrderStatus(id: number, status: string): Promise<Order> {
  if (status === 'confirmed') return confirmOrder(id);
  if (status === 'cancelled') return cancelOrder(id);

  try {
    const result = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (!result.rows[0]) throw new ApiError(404, 'Reserva no encontrada');
    return result.rows[0];
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, formatDatabaseError(error));
  }
}
