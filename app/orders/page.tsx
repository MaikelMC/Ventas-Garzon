'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertCircle, ChevronDown, Ticket, Search } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_OPTIONS = [
  { id: '', label: 'Todas', color: '' },
  { id: 'pending', label: 'Pendiente', color: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300' },
  { id: 'confirmed', label: 'Confirmada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'picked_up', label: 'Recogida', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' },
  { id: 'cancelled', label: 'Cancelada', color: 'bg-error/10 text-error dark:bg-error/20' },
];

interface PastOrder {
  ticket_code: string;
  customer_name: string;
  customer_id_card: string;
  total: number;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchCard, setSearchCard] = useState('');
  const [searched, setSearched] = useState(false);

  const localOrders: PastOrder[] = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('past_orders') || '[]')
    : [];

  const handleSearch = async () => {
    if (!searchCard.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?id_card=${encodeURIComponent(searchCard.trim())}`);
      const data = await res.json();
      setOrders(data.data || []);
    } catch {
      setError('Error al buscar reservas');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => (o.status || '').toLowerCase() === statusFilter);
  }, [orders, statusFilter]);

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.id === (status || '').toLowerCase());
    return opt?.color || '';
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
            <span className="text-[0.7rem] uppercase tracking-[0.08em] font-bold text-primary-500 dark:text-primary-400">Historial</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink dark:text-surface-100">Mis Reservas</h1>
          </div>
        </div>

        <div className="bg-surface dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-4 md:p-5 mb-6 shadow-sm">
          <p className="text-xs font-semibold text-ink-muted mb-2">Busca tus reservas por carnet de identidad</p>
          <div className="flex gap-2">
            <input type="text" value={searchCard}
              onChange={(e) => setSearchCard(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ej: 12345678"
              className="flex-1 px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-sm text-ink dark:text-surface-100 outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button onClick={handleSearch} disabled={loading || !searchCard.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl font-semibold text-sm hover:bg-primary-600 disabled:opacity-50 transition-all"
            >
              <Search size={16} /> Buscar
            </button>
          </div>
        </div>

        {!searched && localOrders.length > 0 && (
          <div className="bg-surface dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-4 md:p-5 mb-6 shadow-sm">
            <h2 className="text-sm font-display font-bold text-ink dark:text-surface-100 mb-3">Reservas Recientes</h2>
            <div className="space-y-2">
              {localOrders.slice(0, 5).map((order, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Ticket size={12} className="text-primary-500" />
                    <span className="font-mono font-bold text-xs text-primary-600 dark:text-primary-400">{order.ticket_code}</span>
                  </div>
                  <span className="text-xs text-ink-muted">{formatPrice(order.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && (
          <>
            <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.id} onClick={() => setStatusFilter(opt.id)}
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
                {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
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
                  {statusFilter ? 'No hay reservas en este estado' : 'No se encontraron reservas'}
                </p>
              </div>
            ) : (
              <motion.div initial="hidden" animate="visible" className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order, i) => (
                    <motion.div key={order.id} layout
                      className="bg-surface dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden transition-shadow hover:shadow-sm"
                    >
                      <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        aria-expanded={expandedId === order.id}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <Ticket size={14} className="text-primary-500" />
                              <p className="text-sm font-mono font-bold text-primary-600 dark:text-primary-400">{order.ticket_code}</p>
                            </div>
                            <p className="text-xs text-ink-muted mt-0.5">{formatDate(order.created_at)}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{formatPrice(order.total)}</span>
                          <motion.div animate={{ rotate: expandedId === order.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={16} className="text-ink-muted" />
                          </motion.div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedId === order.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden"
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
                                {(order.items || []).length > 0 ? order.items.map((item: any) => (
                                  <div key={item.id || item.product_id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 overflow-hidden flex-shrink-0">
                                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-ink dark:text-surface-100 truncate">{item.name || item.product_name}</p>
                                      <p className="text-xs text-ink-muted">x{item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-ink dark:text-surface-100">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                )) : (
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
