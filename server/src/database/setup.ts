import { query } from './index.js';
import { hashPassword } from '../utils/helpers.js';

const PRODUCTS = [
  { name: 'Caldito', description: 'Saborizante en polvo para caldos y sopas', price: 2500, image: '/products/Caldito.jpg', category: 'alimentos', stock: 100, rating: 4.5, reviews: 50 },
  { name: 'Crema de Aloe Vera', description: 'Crema hidratante con aloe vera para piel', price: 8500, image: '/products/Crema de Aloe vera.jpg', category: 'aseo', stock: 40, rating: 4.7, reviews: 30 },
  { name: 'Jabón de Cuidado Facial', description: 'Jabón especial para el cuidado facial', price: 6000, image: '/products/Jabon de Cuidado Facial.jpg', category: 'aseo', stock: 60, rating: 4.6, reviews: 45 },
  { name: 'Jabón', description: 'Jabón de baño estándar', price: 3000, image: '/products/Jabon.jpg', category: 'aseo', stock: 120, rating: 4.3, reviews: 80 },
  { name: 'Jugos de Cajita', description: 'Jugos en cajita varieties sabor frutas', price: 2000, image: '/products/Jugos de cajita.jpg', category: 'bebidas', stock: 150, rating: 4.2, reviews: 60 },
  { name: 'Pasta de Tomate', description: 'Pasta de tomate concentrada para cocinar', price: 4500, image: '/products/Pasta de Tomate.jpg', category: 'alimentos', stock: 80, rating: 4.4, reviews: 40 },
  { name: 'Refrescos', description: 'Refrescos variados botella 500ml', price: 3000, image: '/products/Refeescos.jpg', category: 'bebidas', stock: 200, rating: 4.1, reviews: 70 },
  { name: 'Sazón', description: 'Sazonador en polvo para cocinar', price: 2000, image: '/products/Sazon.jpg', category: 'alimentos', stock: 90, rating: 4.5, reviews: 55 },
  { name: 'Shampú de Aloe', description: 'Shampoo con aloe vera para todo tipo de cabello', price: 7500, image: '/products/Shampú de Aloe.jpg', category: 'aseo', stock: 50, rating: 4.6, reviews: 35 },
  { name: 'Sopita Instantánea', description: 'Sopa instantánea sabor variado', price: 2500, image: '/products/Sopita Instantanea.jpg', category: 'alimentos', stock: 130, rating: 4.3, reviews: 65 },
];

export async function setupDatabase() {
  try {
    console.log('Setting up database...');

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image TEXT,
        category VARCHAR(100) NOT NULL,
        stock INTEGER DEFAULT 0,
        rating DECIMAL(3, 2),
        reviews INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`DROP TABLE IF EXISTS order_items CASCADE;`);
    await query(`DROP TABLE IF EXISTS orders CASCADE;`);

    await query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        ticket_code VARCHAR(10) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_id_card VARCHAR(30) NOT NULL,
        customer_phone VARCHAR(30) NOT NULL,
        payment_method VARCHAR(20) DEFAULT 'cash',
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_ticket_code ON orders(ticket_code);`);

    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);`);

    const adminEmail = 'admin@ventasgarzon.com';
    const adminPassword = 'Admin@1234';
    const adminName = 'Administrador Ventas Garzón';
    const hashedAdminPassword = await hashPassword(adminPassword);

    await query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO UPDATE SET name = $1, role = 'admin';`,
      [adminName, adminEmail, hashedAdminPassword]
    );

    const existing = await query(`SELECT COUNT(*)::int AS count FROM products`);
    if (existing.rows[0].count === 0) {
      for (const p of PRODUCTS) {
        await query(
          `INSERT INTO products (name, description, price, image, category, stock, rating, reviews)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
          [p.name, p.description, p.price, p.image, p.category, p.stock, p.rating, p.reviews]
        );
      }
      console.log(`Seeded ${PRODUCTS.length} products`);
    }

    // ── Demo: seed sample orders ──
    await query(`
      INSERT INTO orders (user_id, ticket_code, customer_name, customer_id_card, customer_phone, payment_method, total, status, created_at)
      VALUES
        (1, 'VG-A1B2', 'María García',        '00123456789', '+53 5 1111 2222', 'cash',       14000, 'pending',   CURRENT_TIMESTAMP - INTERVAL '2 days'),
        (1, 'VG-C3D4', 'Carlos López',        '00987654321', '+53 5 3333 4444', 'transfer',   23500, 'confirmed', CURRENT_TIMESTAMP - INTERVAL '5 days'),
        (1, 'VG-E5F6', 'Ana Martínez',        '00555555555', '+53 5 5555 6666', 'cash',        7500, 'picked_up', CURRENT_TIMESTAMP - INTERVAL '10 days'),
        (1, 'VG-G7H8', 'Pedro Rodríguez',     '00333333333', '+53 5 7777 8888', 'transfer',   10500, 'cancelled', CURRENT_TIMESTAMP - INTERVAL '3 days'),
        (1, 'VG-I9J0', 'Laura Fernández',     '00222222222', '+53 5 9999 0000', 'cash',       20000, 'pending',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
        (1, 'VG-K1L2', 'Jorge Hernández',     '00111111111', '+53 5 1234 5678', 'transfer',    8500, 'confirmed', CURRENT_TIMESTAMP - INTERVAL '7 days');
    `);

    await query(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES
        -- Order 1 (pending): 2x Caldito + 1x Jabón + 3x Jugos = 14000
        (1, 1, 2, 2500),
        (1, 4, 1, 3000),
        (1, 5, 3, 2000),
        -- Order 2 (confirmed): 1x Crema Aloe + 2x Shampú Aloe = 23500
        (2, 2, 1, 8500),
        (2, 9, 2, 7500),
        -- Order 3 (picked_up): 1x Pasta Tomate + 1x Refrescos = 7500
        (3, 6, 1, 4500),
        (3, 7, 1, 3000),
        -- Order 4 (cancelled): 1x Jabón Facial + 1x Pasta Tomate = 10500
        (4, 3, 1, 6000),
        (4, 6, 1, 4500),
        -- Order 5 (pending): 3x Caldito + 2x Refrescos + 1x Sopita + 2x Sazón = 20000
        (5, 1, 3, 2500),
        (5, 7, 2, 3000),
        (5, 10, 1, 2500),
        (5, 8, 2, 2000),
        -- Order 6 (confirmed): 1x Crema Aloe = 8500
        (6, 2, 1, 8500);
    `);

    console.log('Seeded 6 sample orders with items');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

const isMain = process.argv[1]?.includes('setup');
if (isMain) {
  setupDatabase()
    .then(async () => {
      const { pool } = await import('./index.js');
      await pool.end();
      process.exit(0);
    })
    .catch(() => process.exit(1));
}
