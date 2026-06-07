import { Request, Response } from 'express';
import { z } from 'zod';
import { createUser, getUserById, verifyPassword, updateUser, getUserByEmail } from '../models/user.js';
import { generateToken, ApiError } from '../utils/helpers.js';
import { query } from '../database/index.js';

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function register(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);

    const user = await createUser(body.name, body.email, body.password);
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      user,
      token,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos inválidos', errors: error.errors });
    }
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);

    const user = await verifyPassword(body.email, body.password);
    if (!user) {
      throw new ApiError(401, 'Email o contraseña incorrectos');
    }

    const fullUser = await getUserById(user.id);
    const token = generateToken(user.id, user.role);

    res.json({
      user: fullUser,
      token,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos inválidos', errors: error.errors });
    }
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'No autenticado');
    }

    const user = await getUserById(req.user.userId);
    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    res.json(user);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'No autenticado');
    }

    const { name, avatar } = req.body;

    const user = await updateUser(req.user.userId, { name, avatar });

    res.json(user);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      // No revelar si el email existe
      return res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
    }

    // TODO: Implementar envío de email con token temporal

    res.json({ message: 'Se ha enviado un enlace de recuperación a tu email' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    // TODO: Implementar reset de contraseña con token

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function getProfileStats(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'No autenticado');
    }

    const userId = req.user.userId;

    // Total orders
    const ordersResult = await query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = $1',
      [userId]
    );
    const totalOrders = parseInt(ordersResult.rows[0].total);

    // Total spent (excluding cancelled)
    const spentResult = await query(
      'SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE user_id = $1 AND status != $2',
      [userId, 'cancelled']
    );
    const totalSpent = parseFloat(spentResult.rows[0].total);

    // Pending orders
    const pendingResult = await query(
      "SELECT COUNT(*) as total FROM orders WHERE user_id = $1 AND status IN ('pending', 'confirmed', 'shipped')",
      [userId]
    );
    const pendingOrders = parseInt(pendingResult.rows[0].total);

    // Delivered orders
    const deliveredResult = await query(
      "SELECT COUNT(*) as total FROM orders WHERE user_id = $1 AND status = 'delivered'",
      [userId]
    );
    const deliveredOrders = parseInt(deliveredResult.rows[0].total);

    // Favorite category
    const categoryResult = await query(
      `SELECT p.category, COUNT(oi.id) as count
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = $1 AND o.status != 'cancelled'
       GROUP BY p.category
       ORDER BY count DESC
       LIMIT 1`,
      [userId]
    );
    const favoriteCategory = categoryResult.rows[0]?.category || null;

    // Last order
    const lastOrderResult = await query(
      'SELECT id, total, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    const lastOrder = lastOrderResult.rows[0] || null;

    // Total items bought
    const itemsResult = await query(
      `SELECT COALESCE(SUM(oi.quantity), 0) as total
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = $1 AND o.status != 'cancelled'`,
      [userId]
    );
    const totalItems = parseInt(itemsResult.rows[0].total);

    // Average order value
    const avgResult = await query(
      'SELECT COALESCE(AVG(total), 0) as avg FROM orders WHERE user_id = $1 AND status != $2',
      [userId, 'cancelled']
    );
    const avgOrderValue = parseFloat(avgResult.rows[0].avg);

    // Member since
    const userResult = await query(
      'SELECT created_at FROM users WHERE id = $1',
      [userId]
    );
    const memberSince = userResult.rows[0]?.created_at;

    res.json({
      totalOrders,
      totalSpent,
      pendingOrders,
      deliveredOrders,
      favoriteCategory,
      lastOrder,
      totalItems,
      avgOrderValue,
      memberSince,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}
