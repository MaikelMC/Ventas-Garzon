import { Request, Response } from 'express';
import { z } from 'zod';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../models/order.js';
import { ApiError } from '../utils/helpers.js';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.union([z.number(), z.string().transform(Number)]),
      quantity: z.union([z.number(), z.string().transform(Number)]).refine((n) => n > 0),
      price: z.union([z.number(), z.string().transform(Number)]).refine((n) => n > 0),
    })
  ),
  shippingAddress: z.string().min(1, 'La dirección de envío es requerida'),
});

export async function createOrderHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'No autenticado');
    }

    const body = createOrderSchema.parse(req.body);

    const total = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await createOrder(req.user.userId, body.items, body.shippingAddress, total);

    res.status(201).json(order);
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

export async function listOrders(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'No autenticado');
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    const result = await getOrders(req.user.userId, page);

    res.json(result);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function getOrderHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'No autenticado');
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, 'ID inválido');
    }

    const order = await getOrderById(id, req.user.userId);

    res.json(order);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function updateOrderStatusHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, 'ID inválido');
    }

    const { status } = req.body;
    if (!status) {
      throw new ApiError(400, 'Estado requerido');
    }

    const order = await updateOrderStatus(id, status);

    res.json(order);
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}
