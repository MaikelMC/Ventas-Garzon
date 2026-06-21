import { Request, Response } from 'express';
import { query } from '../database/index.js';
import { getAllProducts } from '../models/product.js';
import { getOrderByTicket, confirmOrder, cancelOrder } from '../models/order.js';
import { ApiError, hashPassword, comparePasswords } from '../utils/helpers.js';

export async function getDashboard(req: Request, res: Response) {
  try {
    const productsResult = await query('SELECT COUNT(*) as total FROM products');
    const totalProducts = parseInt(productsResult.rows[0].total);

    const ordersResult = await query('SELECT COUNT(*) as total FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].total);

    const usersResult = await query('SELECT COUNT(*) as total FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total);

    const revenueResult = await query("SELECT SUM(total) as total FROM orders WHERE status IN ('confirmed', 'picked_up')");
    const totalRevenue = parseFloat(revenueResult.rows[0].total || 0);

    const pendingResult = await query("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'");
    const pendingReservations = parseInt(pendingResult.rows[0].total);

    const recentOrdersResult = await query(`
      SELECT o.*, u.name as user_name FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        pendingReservations,
      },
      recentOrders: recentOrdersResult.rows,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function listAllProducts(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const result = await getAllProducts(page, 20);
    res.json(result);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function verifyReservation(req: Request, res: Response) {
  try {
    const ticket = req.query.ticket as string;
    if (!ticket || ticket.trim().length < 3) {
      throw new ApiError(400, 'Código de ticket requerido');
    }

    const order = await getOrderByTicket(ticket.trim());
    res.json(order);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function confirmReservation(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ApiError(400, 'ID inválido');

    const order = await confirmOrder(id);
    res.json(order);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function cancelReservation(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ApiError(400, 'ID inválido');

    const order = await cancelOrder(id);
    res.json(order);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function listAllOrders(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const status = req.query.status as string;

    const limit = 20;
    const offset = (page - 1) * limit;

    let sql = 'SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id';
    const params: any[] = [];

    if (status) {
      sql += ' WHERE o.status = $1';
      params.push(status);
      sql += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
    } else {
      sql += ` ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const ordersResult = await query(sql, params);

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

    const countSql = status ? 'SELECT COUNT(*) FROM orders WHERE status = $1' : 'SELECT COUNT(*) FROM orders';
    const countParams = status ? [status] : [];
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: orders,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function listAllUsers(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = 20;
    const offset = (page - 1) * limit;

    const usersResult = await query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: usersResult.rows,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function getSalesAnalytics(req: Request, res: Response) {
  try {
    const categorySalesResult = await query(`
      SELECT p.category, COUNT(oi.id) as count, SUM(oi.price * oi.quantity) as total
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('confirmed', 'picked_up')
      GROUP BY p.category
    `);

    const dailySalesResult = await query(`
      SELECT DATE(o.created_at) as date, COUNT(o.id) as orders, SUM(o.total) as total
      FROM orders o
      WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
      AND o.status IN ('confirmed', 'picked_up')
      GROUP BY DATE(o.created_at)
      ORDER BY date DESC
    `);

    const topProductsResult = await query(`
      SELECT p.id, p.name, COUNT(oi.id) as sales, SUM(oi.quantity) as quantity
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('confirmed', 'picked_up')
      GROUP BY p.id, p.name
      ORDER BY sales DESC
      LIMIT 10
    `);

    res.json({
      byCategory: categorySalesResult.rows,
      dailySales: dailySalesResult.rows,
      topProducts: topProductsResult.rows,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, stock, category, image } = req.body;
    if (!name || !price || !category) {
      throw new ApiError(400, 'Nombre, precio y categoría son requeridos');
    }

    const result = await query(
      `INSERT INTO products (name, description, price, stock, category, image)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description || '', parseFloat(price), parseInt(stock) || 0, category, image || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image } = req.body;

    const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    const result = await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        stock = COALESCE($4, stock),
        category = COALESCE($5, category),
        image = COALESCE($6, image)
       WHERE id = $7 RETURNING *`,
      [name, description, price !== undefined ? parseFloat(price) : null, stock !== undefined ? parseInt(stock) : null, category, image, id]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    await query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'picked_up', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Estado no válido');
    }

    if (status === 'confirmed') {
      const order = await confirmOrder(parseInt(id));
      return res.json(order);
    }
    if (status === 'cancelled') {
      const order = await cancelOrder(parseInt(id));
      return res.json(order);
    }

    const result = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (!result.rows[0]) throw new ApiError(404, 'Reserva no encontrada');
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['customer', 'admin'];
    if (!validRoles.includes(role)) {
      throw new ApiError(400, 'Rol no válido');
    }

    const existing = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, created_at',
      [role, id]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      throw new ApiError(404, 'Usuario no encontrado');
    }
    if (existing.rows[0].role === 'admin') {
      throw new ApiError(400, 'No se puede eliminar un administrador');
    }

    await query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1)', [id]);
    await query('DELETE FROM orders WHERE user_id = $1', [id]);
    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Contraseña actual y nueva contraseña son requeridas');
    }
    if (newPassword.length < 6) {
      throw new ApiError(400, 'La nueva contraseña debe tener al menos 6 caracteres');
    }

    const result = await query('SELECT id, password FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    const valid = await comparePasswords(currentPassword, result.rows[0].password);
    if (!valid) {
      throw new ApiError(400, 'La contraseña actual es incorrecta');
    }

    const hashed = await hashPassword(newPassword);
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}
