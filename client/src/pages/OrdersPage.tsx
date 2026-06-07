import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, AlertCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../store';
import { orderService } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import { SlideUp } from '../utils/animations';

export const OrdersPage: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderService.getOrders(1);
        setOrders(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudieron cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      loadOrders();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white/90 dark:bg-surface-800/90 p-10 shadow-xl dark:shadow-black/30">
          <SlideUp>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3 shadow-lg">
                <Package size={28} className="text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Historial</p>
                <h1 className="text-4xl font-display font-bold text-dark dark:text-white">Mis Pedidos</h1>
              </div>
            </div>
            <p className="mt-2 text-surface-500 dark:text-surface-400 ml-[60px]">Revisa el estado de tus compras recientes.</p>
          </SlideUp>

          {loading ? (
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-28 rounded-3xl" />
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-12 text-center py-12">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/10 rounded-full blur-2xl" />
                <div className="relative bg-gradient-to-br from-surface-100 to-surface-50 dark:from-surface-800 dark:to-surface-700 rounded-full p-8 shadow-xl">
                  <Package size={48} className="text-surface-300 dark:text-surface-500" strokeWidth={1} />
                </div>
              </div>
              <p className="text-surface-500 dark:text-surface-400 text-lg">Aún no has realizado ningún pedido.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 p-6 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Pedido #{order.id}</p>
                      <p className="text-lg font-semibold text-dark dark:text-white">Total: {formatPrice(order.total)}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase">
                      <Clock size={14} />
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-4 text-surface-600 dark:text-surface-300">Dirección de envío: {order.shipping_address || 'No disponible'}</p>
                  <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">Fecha: {formatDate(order.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
