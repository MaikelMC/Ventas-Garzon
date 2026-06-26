export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  ticket_code: string;
  customer_name: string;
  customer_id_card: string;
  customer_phone: string;
  payment_method: 'cash' | 'transfer';
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  current_stock?: number;
}

export interface Ticket {
  ticketCode: string;
  orderId: number;
  status: string;
  fecha: string;
}
