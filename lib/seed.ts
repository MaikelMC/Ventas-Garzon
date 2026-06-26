import { Product, Order } from './types';

export const SEED_PRODUCTS: Product[] = [
  { id: 1, name: 'Caldito de Pollo Maggi', description: 'Cubos de caldo de pollo, paquete 24 unidades', price: 4500, image: '/products/caldito.jpg', category: 'alimentos', stock: 50 },
  { id: 2, name: 'Crema de Aloe Vera', description: 'Crema humectante corporal de aloe vera 500ml', price: 12000, image: '/products/crema-aloe.jpg', category: 'aseo', stock: 30 },
  { id: 3, name: 'Jabón Facial de Aloe Vera', description: 'Jabón facial de aloe vera para limpieza diaria', price: 8500, image: '/products/jabon-facial.jpg', category: 'aseo', stock: 40 },
  { id: 4, name: 'Jabón de Baño', description: 'Jabón de baño humectante 150g', price: 3200, image: '/products/jabon.jpg', category: 'aseo', stock: 60 },
  { id: 5, name: 'Jugos Naturales', description: 'Pack de jugos naturales surtidos 6 unidades', price: 15000, image: '/products/jugos.jpg', category: 'bebidas', stock: 25 },
  { id: 6, name: 'Pasta de Tomate', description: 'Pasta de tomate Pomarola 300g', price: 5200, image: '/products/pasta-tomate.jpg', category: 'alimentos', stock: 45 },
  { id: 7, name: 'Refrescos Gaseosas', description: 'Pack de refrescos gaseosas 6 latas', price: 18000, image: '/products/refrescos.jpg', category: 'bebidas', stock: 20 },
  { id: 8, name: 'Sazón Completo', description: 'Condimento sazón completo para comidas 250g', price: 3800, image: '/products/sazon.jpg', category: 'alimentos', stock: 55 },
  { id: 9, name: 'Shampoo de Aloe Vera', description: 'Shampoo de aloe vera para cabello seco 400ml', price: 14500, image: '/products/shampoo-aloe.jpg', category: 'aseo', stock: 35 },
  { id: 10, name: 'Sopita Instantánea', description: 'Sopa instantánea de vegetales 6 sobres', price: 6500, image: '/products/sopita.jpg', category: 'alimentos', stock: 40 },
];
