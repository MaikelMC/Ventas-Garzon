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

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  ticket_code: string;
  customer_name: string;
  customer_id_card: string;
  customer_phone: string;
  payment_method: 'cash' | 'transfer';
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
