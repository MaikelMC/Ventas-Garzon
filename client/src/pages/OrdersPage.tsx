import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertCircle, ChevronDown, Ticket } from 'lucide-react';
import { useAuthStore } from '../store';
import { orderService } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import { useReducedMotion } from '../utils/animations';

const STATUS_OPTIONS = [
  { id: '', label: 'Todas', color: '' },
  { id: 'pending', label: 'Pendiente', color: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300' },
  { id: 'confirmed', label: 'Confirmada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'picked_up', label: 'Recogida', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' },
  { id: 'cancelled', label: 'Cancelada', color: 'bg-error/10 text-error dark:bg-error/20' },
];

const PAGE_SIZE = 5;

export const OrdersPage: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const reduce = useReducedMotion();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await orderService.getOrders(page);
        setOrders(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudieron cargar las reservas');
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) loadOrders();
  }, [isLoggedIn, page]);

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => (o.status || '').toLowerCase() === statusFilter);
  }, [orders, statusFilter]);

  const itemVariants = (i: number) => ({
    hidden: reduce ? {} : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] } },
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.id === (status || '').toLowerCase());
    return opt?.color || STATUS_OPTIONS[0].color;
  };

  const getStatusLabel = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.id === (status || '').toLowerCase());
    return opt?.label || status;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-surface-dim dark:bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary-500 rounded-2xl p-3 shadow-sm">
            <Package size={24} className="text-white" />
          </div>
          <div>
            <span className="text-[0.7rem] uppercase tracking-[0.08em] font-bold text-primary-500 dark:text-primary-400">
              Historial
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink dark:text-surface-100">
              Mis Reservas
            </h1>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === opt.id
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-surface dark:bg-surface-800 text-ink-muted hover:text-ink dark:hover:text-surface-200 border border-surface-200 dark:border-surface-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 px-5 py-4 bg-error/10 dark:bg-error/20 border border-error/30 rounded-xl text-sm text-error">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-200 dark:bg-surface-800 mb-4">
              <Package size={32} className="text-ink-muted" />
            </div>
            <p className="text-ink text-lg font-semibold mb-1">
              {statusFilter ? 'No hay reservas en este estado' : 'Aún no has realizado ninguna reserva'}
            </p>
            <p className="text-ink-muted text-sm">
              {statusFilter ? 'Prueba con otro filtro' : 'Explora nuestros productos y haz tu primera reserva'}
            </p>
          </div>
        ) : (
          <>
            <motion.div initial="hidden" animate="visible" className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants(i)}
                    layout
                    className="bg-surface dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden transition-shadow hover:shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                      aria-expanded={expandedId === order.id}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Ticket size={14} className="text-primary-500" />
                            <p className="text-sm font-mono font-bold text-primary-600 dark:text-primary-400">
                              {order.ticket_code}
                            </p>
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(order.total)}
                        </span>
                        <motion.div animate={{ rotate: expandedId === order.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={16} className="text-ink-muted" />
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedId === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0 border-t border-surface-200 dark:border-surface-700">
                            <div className="pt-4 space-y-3">
                              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                                <div>
                                  <span className="text-ink-muted">Nombre:</span>
                                  <p className="font-medium text-ink dark:text-surface-100">{order.customer_name}</p>
                                </div>
                                <div>
                                  <span className="text-ink-muted">Carnet:</span>
                                  <p className="font-medium text-ink dark:text-surface-100">{order.customer_id_card}</p>
                                </div>
                                <div>
                                  <span className="text-ink-muted">Teléfono:</span>
                                  <p className="font-medium text-ink dark:text-surface-100">{order.customer_phone}</p>
                                </div>
                                <div>
                                  <span className="text-ink-muted">Pago:</span>
                                  <p className="font-medium text-ink dark:text-surface-100">{order.payment_method === 'cash' ? 'Efectivo' : 'Transferencia'}</p>
                                </div>
                              </div>
                              {(order.items || []).length > 0 ? (
                                order.items.map((item: any) => (
                                  <div key={item.id || item.product_id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 overflow-hidden flex-shrink-0">
                                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-ink dark:text-surface-100 truncate">
                                        {item.name || item.product_name}
                                      </p>
                                      <p className="text-xs text-ink-muted">x{item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-ink dark:text-surface-100">
                                      {formatPrice(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-ink-muted">Detalles no disponibles</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredOrders.length > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(filteredOrders.length / PAGE_SIZE) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                      page === i + 1
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface dark:bg-surface-800 text-ink-muted border border-surface-200 dark:border-surface-700 hover:border-primary/30'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
