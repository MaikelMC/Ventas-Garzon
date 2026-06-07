import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity }],
          };
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  setUser: (user: User, token: string) => {
    set({ user, token, isLoggedIn: true });
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
  },

  logout: () => {
    set({ user: null, token: null, isLoggedIn: false });
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  },

  setAuthFromStorage: () => {
    const user = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    if (user && token) {
      set({ user: JSON.parse(user), token, isLoggedIn: true });
    }
  },
}));
