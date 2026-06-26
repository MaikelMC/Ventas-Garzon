// ─── Mock Data ─────────────────────────────────────────
// Productos, órdenes, dashboard, usuarios — todo simulado
// para que el frontend funcione standalone en puerto 3000
// ────────────────────────────────────────────────────────

const NOW = new Date();
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86400000).toISOString();

export const MOCK_PRODUCTS = [
  { id: 1,  name: 'Caldito',                  description: 'Saborizante en polvo para caldos y sopas',               price: 2500,  image: '', category: 'alimentos', stock: 48,  rating: 4.5, reviews: 50 },
  { id: 2,  name: 'Crema de Aloe Vera',        description: 'Crema hidratante con aloe vera para piel',              price: 8500,  image: '', category: 'aseo',      stock: 39,  rating: 4.7, reviews: 30 },
  { id: 3,  name: 'Jabón de Cuidado Facial',    description: 'Jabón especial para el cuidado facial',                 price: 6000,  image: '', category: 'aseo',      stock: 60,  rating: 4.6, reviews: 45 },
  { id: 4,  name: 'Jabón',                      description: 'Jabón de baño estándar',                               price: 3000,  image: '', category: 'aseo',      stock: 120, rating: 4.3, reviews: 80 },
  { id: 5,  name: 'Jugos de Cajita',            description: 'Jugos en cajita variedad sabor frutas',                price: 2000,  image: '', category: 'bebidas',   stock: 145, rating: 4.2, reviews: 60 },
  { id: 6,  name: 'Pasta de Tomate',            description: 'Pasta de tomate concentrada para cocinar',              price: 4500,  image: '', category: 'alimentos', stock: 79,  rating: 4.4, reviews: 40 },
  { id: 7,  name: 'Refrescos',                  description: 'Refrescos variados botella 500ml',                      price: 3000,  image: '', category: 'bebidas',   stock: 198, rating: 4.1, reviews: 70 },
  { id: 8,  name: 'Sazón',                      description: 'Sazonador en polvo para cocinar',                       price: 2000,  image: '', category: 'alimentos', stock: 88,  rating: 4.5, reviews: 55 },
  { id: 9,  name: 'Shampú de Aloe',             description: 'Shampoo con aloe vera para todo tipo de cabello',       price: 7500,  image: '', category: 'aseo',      stock: 48,  rating: 4.6, reviews: 35 },
  { id: 10, name: 'Sopita Instantánea',         description: 'Sopa instantánea sabor variado',                        price: 2500,  image: '', category: 'alimentos', stock: 127, rating: 4.3, reviews: 65 },
];

// ─── Orders ────────────────────────────────────────────
const mockOrderItems = [
  // Order 1 — pending
  [{ product_id: 1, quantity: 2, price: 2500 }, { product_id: 4, quantity: 1, price: 3000 }, { product_id: 5, quantity: 3, price: 2000 }],
  // Order 2 — confirmed
  [{ product_id: 2, quantity: 1, price: 8500 }, { product_id: 9, quantity: 2, price: 7500 }],
  // Order 3 — picked_up
  [{ product_id: 6, quantity: 1, price: 4500 }, { product_id: 7, quantity: 1, price: 3000 }],
  // Order 4 — cancelled
  [{ product_id: 3, quantity: 1, price: 6000 }, { product_id: 6, quantity: 1, price: 4500 }],
  // Order 5 — pending
  [{ product_id: 1, quantity: 3, price: 2500 }, { product_id: 7, quantity: 2, price: 3000 }, { product_id: 10, quantity: 1, price: 2500 }, { product_id: 8, quantity: 2, price: 2000 }],
  // Order 6 — confirmed
  [{ product_id: 2, quantity: 1, price: 8500 }],
];

const orderMeta = [
  { id: 1, ticket: 'VG-A1B2', name: 'María García',     card: '00123456789', phone: '+53 5 1111 2222', payment: 'cash',      total: 14000, status: 'pending'   as const,  created: daysAgo(2)  },
  { id: 2, ticket: 'VG-C3D4', name: 'Carlos López',     card: '00987654321', phone: '+53 5 3333 4444', payment: 'transfer',  total: 23500, status: 'confirmed' as const, created: daysAgo(5)  },
  { id: 3, ticket: 'VG-E5F6', name: 'Ana Martínez',     card: '00555555555', phone: '+53 5 5555 6666', payment: 'cash',      total: 7500,  status: 'picked_up' as const, created: daysAgo(10) },
  { id: 4, ticket: 'VG-G7H8', name: 'Pedro Rodríguez',  card: '00333333333', phone: '+53 5 7777 8888', payment: 'transfer',  total: 10500, status: 'cancelled' as const, created: daysAgo(3)  },
  { id: 5, ticket: 'VG-I9J0', name: 'Laura Fernández',  card: '00222222222', phone: '+53 5 9999 0000', payment: 'cash',      total: 20000, status: 'pending'   as const, created: daysAgo(1)  },
  { id: 6, ticket: 'VG-K1L2', name: 'Jorge Hernández',  card: '00111111111', phone: '+53 5 1234 5678', payment: 'transfer',  total: 8500,  status: 'confirmed' as const, created: daysAgo(7)  },
];

function buildOrderItems(orderId: number) {
  return mockOrderItems[orderId - 1].map((item, i) => {
    const product = MOCK_PRODUCTS.find(p => p.id === item.product_id)!;
    return {
      id: i + 1,
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      name: product.name,
      image: product.image,
      current_stock: product.stock,
    };
  });
}

export const MOCK_ORDERS = orderMeta.map(o => ({
  id: o.id,
  user_id: 1,
  ticket_code: o.ticket,
  customer_name: o.name,
  customer_id_card: o.card,
  customer_phone: o.phone,
  payment_method: o.payment,
  total: o.total,
  status: o.status,
  created_at: o.created,
  updated_at: o.created,
  items: buildOrderItems(o.id),
}));

// ─── Users ────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 1, name: 'Administrador Demo',    email: 'admin@ventasgarzon.com',    role: 'admin' as const, created_at: daysAgo(90) },
  { id: 2, name: 'María García',          email: 'maria@example.com',         role: 'customer' as const, created_at: daysAgo(60) },
  { id: 3, name: 'Carlos López',          email: 'carlos@example.com',        role: 'customer' as const, created_at: daysAgo(45) },
  { id: 4, name: 'Ana Martínez',          email: 'ana@example.com',           role: 'customer' as const, created_at: daysAgo(30) },
  { id: 5, name: 'Pedro Rodríguez',       email: 'pedro@example.com',         role: 'customer' as const, created_at: daysAgo(20) },
  { id: 6, name: 'Laura Fernández',       email: 'laura@example.com',         role: 'customer' as const, created_at: daysAgo(10) },
  { id: 7, name: 'Jorge Hernández',       email: 'jorge@example.com',         role: 'customer' as const, created_at: daysAgo(5)  },
];

// ─── Dashboard ─────────────────────────────────────────
export const MOCK_DASHBOARD = {
  stats: {
    totalProducts: MOCK_PRODUCTS.length,
    totalOrders: MOCK_ORDERS.length,
    totalUsers: MOCK_USERS.length,
    totalRevenue: MOCK_ORDERS
      .filter(o => o.status === 'confirmed' || o.status === 'picked_up')
      .reduce((sum, o) => sum + o.total, 0),
    pendingReservations: MOCK_ORDERS.filter(o => o.status === 'pending').length,
  },
  recentOrders: MOCK_ORDERS.slice(0, 5).map(o => ({
    id: o.id,
    ticket_code: o.ticket_code,
    name: o.customer_name,
    total: o.total,
    status: o.status,
    created_at: o.created_at,
    user_name: 'Administrador Demo',
  })),
};

// ─── Profile Stats ─────────────────────────────────────
export const MOCK_PROFILE_STATS = {
  totalOrders: MOCK_ORDERS.length,
  pendingOrders: MOCK_ORDERS.filter(o => o.status === 'pending').length,
  confirmedOrders: MOCK_ORDERS.filter(o => o.status === 'confirmed' || o.status === 'picked_up').length,
  cancelledOrders: MOCK_ORDERS.filter(o => o.status === 'cancelled').length,
  totalSpent: MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0),
  totalItems: MOCK_ORDERS.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0),
  avgOrderValue: Math.round(MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0) / MOCK_ORDERS.length),
  favoriteCategory: 'aseo',
  memberSince: daysAgo(90),
};

// ─── Sales Analytics ───────────────────────────────────
export const MOCK_SALES_ANALYTICS = {
  byCategory: [
    { category: 'aseo',      count: 8,  total: 54500 },
    { category: 'alimentos', count: 10, total: 32000 },
    { category: 'bebidas',   count: 6,  total: 21000 },
  ],
  dailySales: Array.from({ length: 7 }, (_, i) => ({
    date: daysAgo(i).split('T')[0],
    orders: Math.floor(Math.random() * 5) + 1,
    total: Math.floor(Math.random() * 40000) + 5000,
  })),
  topProducts: MOCK_PRODUCTS.slice(0, 5).map(p => ({
    id: p.id,
    name: p.name,
    sales: Math.floor(Math.random() * 15) + 5,
    quantity: Math.floor(Math.random() * 40) + 10,
  })),
};

// ─── Utilities ─────────────────────────────────────────
export function findOrderByTicket(ticket: string) {
  const order = MOCK_ORDERS.find(o => o.ticket_code.toUpperCase() === ticket.toUpperCase());
  if (!order) throw new Error('Reserva no encontrada');
  return order;
}

export function paginate<T>(items: T[], page: number, pageSize = 20) {
  return {
    data: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}
