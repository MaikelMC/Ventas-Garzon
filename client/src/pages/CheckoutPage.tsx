import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store';
import { orderService } from '../services/api';
import { formatPrice } from '../utils';
import { MapPin, Check, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const total = getTotalPrice();
  const tax = total * 0.19;
  const grandTotal = total + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Ingresa una dirección de envío');
      return;
    }
    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        id: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));
      await orderService.createOrder(orderItems, address.trim());
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Error al procesar el pedido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-surface-800 rounded-3xl shadow-xl dark:shadow-black/30 p-10 max-w-md text-center border border-surface-100 dark:border-surface-700 relative z-10">
          <motion.div animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check size={40} className="text-white" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-dark dark:text-white mb-3">¡Pedido Recibido!</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8">Tu pedido ha sido procesado exitosamente. Recibirás una confirmación pronto.</p>
          <button onClick={() => navigate('/orders')}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-glow hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-2 mx-auto">
            Ver Mis Pedidos <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3 shadow-lg">
            <ShoppingCart size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Checkout</p>
            <h1 className="text-4xl font-display font-bold text-dark dark:text-white">Finalizar Compra</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-700 p-8 shadow-sm dark:shadow-black/20">
              <h2 className="text-xl font-display font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                <MapPin size={22} className="text-primary-500" />
                Dirección de Envío
              </h2>
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); setError(''); }}
                className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white placeholder-surface-400 dark:placeholder-surface-500 resize-none transition-all duration-300"
                rows={3}
                placeholder="Calle, número, barrio, ciudad..."
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-glow hover:from-primary-600 hover:to-primary-700 disabled:from-surface-300 disabled:to-surface-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Confirmar Pedido — {formatPrice(grandTotal)}
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-700 p-6 shadow-sm dark:shadow-black/20 sticky top-24">
              <h2 className="text-xl font-display font-bold text-dark dark:text-white mb-6">Resumen del Pedido</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-surface-500 dark:text-surface-400 truncate mr-2">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-dark dark:text-white whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface-100 dark:border-surface-700 pt-4 space-y-3">
                <div className="flex justify-between text-surface-500 dark:text-surface-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-surface-500 dark:text-surface-400">
                  <span>IVA (19%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-surface-500 dark:text-surface-400">
                  <span>Envío</span>
                  <span className="text-green-500 font-bold">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-dark dark:text-white pt-2 border-t border-surface-100 dark:border-surface-700">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
