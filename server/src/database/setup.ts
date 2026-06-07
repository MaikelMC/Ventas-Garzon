import { query } from './index.js';
import { hashPassword } from '../utils/helpers.js';

export async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Users table
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

    // Products table
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

    // Orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Order items table
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

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);`);

    const adminEmail = 'admin@ventasgarzon.com';
    const adminPassword = 'Admin@1234';
    const adminName = 'Administrador Ventas Garzón';
    const hashedAdminPassword = await hashPassword(adminPassword);

    await query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO UPDATE SET name = $1, password = $3, role = 'admin';`,
      [adminName, adminEmail, hashedAdminPassword]
    );

    console.log('Database setup completed successfully');
    console.log('Admin seeded:', adminEmail);
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}
