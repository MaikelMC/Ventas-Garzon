'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function SlideUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }} viewport={{ once: true }}>
      {children}
    </motion.div>
  );
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const router = useRouter();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
        </div>
        <div className="text-center relative z-10 px-4">
          <SlideUp>
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/10 rounded-full blur-2xl" />
              <div className="relative bg-gradient-to-br from-surface-100 to-surface-50 dark:from-surface-800 dark:to-surface-700 rounded-full p-8 shadow-xl">
                <ShoppingCart size={64} className="text-surface-300 dark:text-surface-500" strokeWidth={1} />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-dark dark:text-white mb-2 md:mb-3">Tu carrito está vacío</h1>
            <p className="text-surface-500 dark:text-surface-400 text-base md:text-lg mb-6 md:mb-10 max-w-md mx-auto">Agrega productos para comenzar tu compra</p>
            <Link href="/products"
              className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-glow hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
            >
              <ShoppingCart size={20} /> Continuar Comprando <ArrowRight size={20} />
            </Link>
          </SlideUp>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SlideUp>
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl md:rounded-2xl p-2 md:p-3 shadow-lg">
              <ShoppingCart size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Tu Carrito</p>
              <h1 className="text-2xl md:text-4xl font-display font-bold text-dark dark:text-white">Mi Carrito</h1>
            </div>
          </div>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {items.map((item) => (
                <motion.div key={item.id} variants={itemVariants}
                  className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg dark:shadow-black/20 p-4 md:p-6 flex gap-3 md:gap-6 border border-surface-100 dark:border-surface-700 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
                    <img src={item.image || ''} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm md:text-lg text-dark dark:text-white truncate">{item.name}</h3>
                    <p className="text-surface-500 dark:text-surface-400 text-xs md:text-sm mb-1 md:mb-2 line-clamp-1">{item.description}</p>
                    <p className="font-bold text-sm md:text-base text-primary-600 dark:text-primary-400">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center border border-surface-200 dark:border-surface-600 rounded-lg md:rounded-xl bg-surface-50 dark:bg-surface-700/50">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-l-lg md:rounded-l-xl transition-colors"
                      >
                        <Minus size={14} className="text-surface-600 dark:text-surface-300" />
                      </button>
                      <span className="px-2 md:px-4 py-1.5 md:py-2 font-bold text-dark dark:text-white min-w-[2rem] md:min-w-[2.5rem] text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-r-lg md:rounded-r-xl transition-colors"
                      >
                        <Plus size={14} className="text-surface-600 dark:text-surface-300" />
                      </button>
                    </div>
                    <p className="font-bold text-sm md:text-base text-dark dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <SlideUp delay={0.2}>
              <div className="bg-white dark:bg-surface-800 rounded-2xl md:rounded-3xl p-4 md:p-6 sticky top-24 shadow-xl dark:shadow-black/30 border border-surface-100 dark:border-surface-700">
                <h2 className="text-xl md:text-2xl font-display font-bold text-dark dark:text-white mb-4 md:mb-6">Resumen</h2>
                <div className="mb-6 border-b border-surface-100 dark:border-surface-700 pb-6">
                  <div className="flex justify-between text-dark dark:text-surface-200">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xl md:text-2xl font-bold text-dark dark:text-white mb-4 md:mb-6">
                  <span>Total:</span>
                  <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-glow hover:from-primary-600 hover:to-primary-700 transition-all duration-300 mb-3 md:mb-4 flex items-center justify-center gap-2"
                >
                  Reservar Productos <ArrowRight size={20} />
                </motion.button>
                <button onClick={() => router.push('/products')}
                  className="w-full border-2 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 mb-3 md:mb-4"
                >
                  Seguir Comprando
                </button>
                <button onClick={clearCart}
                  className="w-full text-red-500 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl transition-all duration-200 font-medium"
                >
                  Vaciar Carrito
                </button>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </div>
  );
}
