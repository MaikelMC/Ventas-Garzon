import axios, { AxiosInstance } from 'axios';
import { AuthResponse, User } from '../types';
import {
  MOCK_PRODUCTS, MOCK_ORDERS, MOCK_USERS, MOCK_DASHBOARD,
  MOCK_PROFILE_STATS, MOCK_SALES_ANALYTICS, findOrderByTicket, paginate
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Network error helper ──────────────────────────────
function isNetworkError(err: any): boolean {
  return !err.response && (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || err.message?.includes('Network Error'));
}

// ─── API Client ────────────────────────────────────────
class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    this.token = localStorage.getItem('auth_token');
    if (this.token) this.setToken(this.token);

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }

  getClient() { return this.client; }
}

export const apiClient = new APIClient();

// ─── Auth Services ─────────────────────────────────────
export const authService = {
  register: async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.getClient().post<AuthResponse>('/auth/register', { email, password, name });
      apiClient.setToken(response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const user = { id: 1, name, email, role: 'customer' as const, created_at: new Date().toISOString() };
        localStorage.setItem('auth_user', JSON.stringify(user));
        return { user, token: 'mock-token' };
      }
      throw err;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.getClient().post<AuthResponse>('/auth/login', { email, password });
      apiClient.setToken(response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const user = { id: 1, name: 'Demo Usuario', email, role: 'customer' as const, created_at: new Date().toISOString() };
        localStorage.setItem('auth_user', JSON.stringify(user));
        return { user, token: 'mock-token' };
      }
      throw err;
    }
  },

  logout: () => {
    apiClient.clearToken();
    localStorage.removeItem('auth_user');
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.getClient().get<User>('/auth/me');
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        return JSON.parse(localStorage.getItem('auth_user') || '{}');
      }
      throw err;
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      const response = await apiClient.getClient().put<User>('/auth/profile', data);
      localStorage.setItem('auth_user', JSON.stringify(response.data));
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const current = JSON.parse(localStorage.getItem('auth_user') || '{}');
        const updated = { ...current, ...data };
        localStorage.setItem('auth_user', JSON.stringify(updated));
        return updated;
      }
      throw err;
    }
  },

  getProfileStats: async () => {
    try {
      const response = await apiClient.getClient().get('/auth/profile/stats');
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return MOCK_PROFILE_STATS;
      throw err;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      return await apiClient.getClient().post('/auth/forgot-password', { email });
    } catch (err: any) {
      if (isNetworkError(err)) return { message: 'Correo enviado' };
      throw err;
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      return await apiClient.getClient().post('/auth/reset-password', { token, password });
    } catch (err: any) {
      if (isNetworkError(err)) return { message: 'Contraseña restablecida' };
      throw err;
    }
  },
};

// ─── Product Services ──────────────────────────────────
export const productService = {
  getAllProducts: async (page = 1, category?: string) => {
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (category) params.append('category', category);
      const response = await apiClient.getClient().get(`/products?${params}`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        let items = MOCK_PRODUCTS;
        if (category) items = items.filter(p => p.category === category);
        return paginate(items, page, 12);
      }
      throw err;
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = await apiClient.getClient().get(`/products/${id}`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return MOCK_PRODUCTS.find(p => p.id === Number(id)) || null;
      throw err;
    }
  },

  searchProducts: async (query: string) => {
    try {
      const response = await apiClient.getClient().get('/products/search', { params: { q: query } });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const q = query.toLowerCase();
        return MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      throw err;
    }
  },
};

// ─── Order Services ────────────────────────────────────
let nextMockOrderId = MOCK_ORDERS.length + 1;
let mockOrders = [...MOCK_ORDERS];

export const orderService = {
  createOrder: async (data: { items: any[]; customerName: string; customerIdCard: string; customerPhone: string; paymentMethod: string }) => {
    try {
      const response = await apiClient.getClient().post('/orders', data);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const ticket = `VG-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const newOrder = {
          id: nextMockOrderId++,
          user_id: 1,
          ticket_code: ticket,
          customer_name: data.customerName,
          customer_id_card: data.customerIdCard,
          customer_phone: data.customerPhone,
          payment_method: data.paymentMethod,
          total: data.items.reduce((s: number, i: any) => s + (i.price || 0) * (i.quantity || 0), 0),
          status: 'pending' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: data.items.map((item: any, idx: number) => ({
            id: idx + 1,
            order_id: 0,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: MOCK_PRODUCTS.find(p => p.id === item.id)?.name || 'Producto',
            image: '',
            current_stock: 0,
          })),
        };
        mockOrders = [newOrder, ...mockOrders];
        return { ...newOrder, ticket_code: ticket };
      }
      throw err;
    }
  },

  getOrders: async (page = 1) => {
    try {
      const response = await apiClient.getClient().get('/orders', { params: { page } });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return paginate(mockOrders, page, 10);
      throw err;
    }
  },

  getOrder: async (id: string) => {
    try {
      const response = await apiClient.getClient().get(`/orders/${id}`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return mockOrders.find(o => o.id === Number(id)) || null;
      throw err;
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const response = await apiClient.getClient().patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const order = mockOrders.find(o => o.id === Number(id));
        if (order) { (order as any).status = status; }
        return order;
      }
      throw err;
    }
  },
};

// ─── Admin Services ────────────────────────────────────
let mockAdminProducts = [...MOCK_PRODUCTS];
let mockAdminOrders = [...MOCK_ORDERS];
let mockAdminUsers = [...MOCK_USERS];

export const adminService = {
  getDashboard: async () => {
    try {
      const response = await apiClient.getClient().get('/admin/dashboard');
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return MOCK_DASHBOARD;
      throw err;
    }
  },

  getProducts: async (page = 1) => {
    try {
      const response = await apiClient.getClient().get('/admin/products', { params: { page } });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return paginate(mockAdminProducts, page, 20);
      throw err;
    }
  },

  createProduct: async (data: any) => {
    try {
      const response = await apiClient.getClient().post('/admin/products', data);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        const newProduct = { id: mockAdminProducts.length + 1, ...data, rating: 0, reviews: 0 };
        mockAdminProducts = [...mockAdminProducts, newProduct];
        return newProduct;
      }
      throw err;
    }
  },

  updateProduct: async (id: string, data: any) => {
    try {
      const response = await apiClient.getClient().put(`/admin/products/${id}`, data);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminProducts = mockAdminProducts.map(p => p.id === Number(id) ? { ...p, ...data } : p);
        return mockAdminProducts.find(p => p.id === Number(id));
      }
      throw err;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await apiClient.getClient().delete(`/admin/products/${id}`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminProducts = mockAdminProducts.filter(p => p.id !== Number(id));
        return { message: 'Producto eliminado correctamente' };
      }
      throw err;
    }
  },

  getOrders: async (page = 1, status?: string) => {
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (status) params.append('status', status);
      const response = await apiClient.getClient().get(`/admin/orders?${params}`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        let items = mockAdminOrders;
        if (status) items = items.filter(o => o.status === status);
        return paginate(items, page, 20);
      }
      throw err;
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const response = await apiClient.getClient().patch(`/admin/orders/${id}/status`, { status });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminOrders = mockAdminOrders.map(o => o.id === Number(id) ? { ...o, status: status as any } : o);
        return mockAdminOrders.find(o => o.id === Number(id));
      }
      throw err;
    }
  },

  verifyReservation: async (ticket: string) => {
    try {
      const response = await apiClient.getClient().get(`/admin/reservations/verify`, { params: { ticket } });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return findOrderByTicket(ticket);
      throw err;
    }
  },

  confirmReservation: async (id: string) => {
    try {
      const response = await apiClient.getClient().patch(`/admin/reservations/${id}/confirm`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminOrders = mockAdminOrders.map(o => o.id === Number(id) ? { ...o, status: 'confirmed' as const } : o);
        return mockAdminOrders.find(o => o.id === Number(id));
      }
      throw err;
    }
  },

  cancelReservation: async (id: string) => {
    try {
      const response = await apiClient.getClient().patch(`/admin/reservations/${id}/cancel`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminOrders = mockAdminOrders.map(o => o.id === Number(id) ? { ...o, status: 'cancelled' as const } : o);
        return mockAdminOrders.find(o => o.id === Number(id));
      }
      throw err;
    }
  },

  getUsers: async (page = 1) => {
    try {
      const response = await apiClient.getClient().get('/admin/users', { params: { page } });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return paginate(mockAdminUsers, page, 20);
      throw err;
    }
  },

  updateUserRole: async (id: string, role: string) => {
    try {
      const response = await apiClient.getClient().patch(`/admin/users/${id}/role`, { role });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminUsers = mockAdminUsers.map(u => u.id === Number(id) ? { ...u, role: role as any } : u);
        return mockAdminUsers.find(u => u.id === Number(id));
      }
      throw err;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const response = await apiClient.getClient().delete(`/admin/users/${id}`);
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) {
        mockAdminUsers = mockAdminUsers.filter(u => u.id !== Number(id));
        return { message: 'Usuario eliminado correctamente' };
      }
      throw err;
    }
  },

  getSalesAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await apiClient.getClient().get('/admin/analytics/sales', { params });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return MOCK_SALES_ANALYTICS;
      throw err;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.getClient().patch('/admin/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return { message: 'Contraseña actualizada correctamente' };
      throw err;
    }
  },
};

// ─── Upload Service ────────────────────────────────────
export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiClient.getClient().post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      if (isNetworkError(err)) return { url: '' };
      throw err;
    }
  },
};
