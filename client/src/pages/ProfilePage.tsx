import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, ShoppingCart, DollarSign, Package, TrendingUp,
  Star, CalendarDays, X, Clock, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuthStore } from '../store';
import { authService, orderService } from '../services/api';
import { formatPrice, formatDate } from '../utils';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
};

export const ProfilePage: React.FC = () => {
  const { isLoggedIn, user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([
        authService.getProfileStats(),
        orderService.getOrders(1),
      ])
        .then(([statsData, ordersData]) => {
          setStats(statsData);
          setOrders(ordersData.data || []);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedOrder) {
        setSelectedOrder(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedOrder]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const memberDays = stats?.memberSince
    ? Math.floor((Date.now() - new Date(stats.memberSince).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Card */}
        <div className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white/90 dark:bg-surface-800/90 p-8 shadow-xl dark:shadow-black/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/10 rounded-full blur-xl" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold mb-1">Mi Perfil</p>
              <h1 className="text-3xl font-display font-bold text-dark dark:text-white">{user?.name}</h1>
              <p className="text-surface-500 dark:text-surface-400 flex items-center gap-2 mt-1">
                <Mail size={14} /> {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-700 rounded-2xl px-4 py-2">
              <CalendarDays size={16} className="text-surface-500 dark:text-surface-400" />
              <span className="text-sm text-surface-600 dark:text-surface-300">
                Miembro desde hace {memberDays} {memberDays === 1 ? 'día' : 'días'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
          </div>
        ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Pedidos', value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: 'from-blue-500 to-blue-600', sub: `${stats?.pendingOrders ?? 0} activos` },
            { label: 'Total Gastado', value: formatPrice(stats?.totalSpent ?? 0), icon: DollarSign, color: 'from-primary-500 to-primary-600', sub: `Promedio: ${formatPrice(stats?.avgOrderValue ?? 0)}` },
            { label: 'Artículos Comprados', value: stats?.totalItems ?? 0, icon: Package, color: 'from-teal-500 to-teal-600', sub: `${stats?.confirmedOrders ?? 0} confirmados` },
            { label: 'Categoría Favorita', value: stats?.favoriteCategory ? ({ aseo: 'Aseo', limpieza: 'Limpieza', alimentos: 'Alimentos', bebidas: 'Bebidas' }[stats.favoriteCategory] || stats.favoriteCategory) : 'N/A', icon: Star, color: 'from-secondary-500 to-secondary-600', sub: stats?.favoriteCategory ? 'Más comprada' : 'Sin datos aún' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-5 shadow-sm dark:shadow-black/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400 font-semibold">{stat.label}</p>
                <div className={`bg-gradient-to-br ${stat.color} rounded-xl p-2`}>
                  <stat.icon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-dark dark:text-white truncate">{stat.value}</p>
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
        )}

        {/* Info + Orders */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Info */}
          <div className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 shadow-sm dark:shadow-black/20">
            <h2 className="text-lg font-display font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-primary-500" />
              Información de la Cuenta
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">Nombre</span>
                <span className="text-sm font-semibold text-dark dark:text-white">{user?.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">Email</span>
                <span className="text-sm font-semibold text-dark dark:text-white">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">Rol</span>
                <span className="text-sm font-semibold text-dark dark:text-white capitalize">{user?.role}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-surface-500 dark:text-surface-400">Miembro desde</span>
                <span className="text-sm font-semibold text-dark dark:text-white">{stats?.memberSince ? formatDate(stats.memberSince) : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Mis Pedidos */}
          <div className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 shadow-sm dark:shadow-black/20">
            <h2 className="text-lg font-display font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
              <Truck size={20} className="text-primary-500" />
              Mis Pedidos
            </h2>
            {orders.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {orders.map((order) => {
                  const st = statusConfig[order.status] || statusConfig.pending;
                  const Icon = st.icon;
                  return (
                    <motion.button key={order.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedOrder(order)}
                      className="w-full text-left rounded-2xl border border-surface-100 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 p-4 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-xl p-2 ${st.bg}`}>
                            <Icon size={16} className={st.color} />
                          </div>
                          <div>
                            <p className="font-semibold text-dark dark:text-white text-sm">Pedido #{order.id}</p>
                            <p className="text-xs text-surface-400 dark:text-surface-500">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600 dark:text-primary-400 text-sm">{formatPrice(order.total)}</p>
                          <span className={`text-xs font-semibold ${st.color}`}>{st.label}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Package size={40} className="mx-auto text-surface-300 dark:text-surface-600 mb-3" strokeWidth={1} />
                <p className="text-surface-500 dark:text-surface-400 text-sm">Aún no has realizado pedidos</p>
                <Link to="/products" className="inline-flex items-center gap-2 mt-4 text-primary-500 dark:text-primary-400 text-sm font-semibold hover:underline">
                  Explorar productos
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link to="/orders" className="flex items-center gap-4 rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-5 shadow-sm dark:shadow-black/20 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3 shadow-lg group-hover:scale-110 transition-transform">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-dark dark:text-white text-sm">Ver Todos los Pedidos</p>
              <p className="text-xs text-surface-400 dark:text-surface-500">{stats?.pendingOrders ?? 0} activos</p>
            </div>
          </Link>
          <Link to="/products" className="flex items-center gap-4 rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-5 shadow-sm dark:shadow-black/20 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3 shadow-lg group-hover:scale-110 transition-transform">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-dark dark:text-white text-sm">Catálogo</p>
              <p className="text-xs text-surface-400 dark:text-surface-500">Explorar productos</p>
            </div>
          </Link>
          <Link to="/cart" className="flex items-center gap-4 rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-5 shadow-sm dark:shadow-black/20 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 group">
            <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-3 shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-dark dark:text-white text-sm">Mi Carrito</p>
              <p className="text-xs text-surface-400 dark:text-surface-500">Continuar comprando</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-3xl shadow-2xl w-full max-w-lg border border-surface-100 dark:border-surface-700 max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-100 dark:border-surface-700">
                <div>
                  <h2 className="text-xl font-display font-bold text-dark dark:text-white">Pedido #{selectedOrder.id}</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <X size={20} className="text-surface-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500 dark:text-surface-400">Estado</span>
                  {(() => {
                    const st = statusConfig[selectedOrder.status] || statusConfig.pending;
                    const Icon = st.icon;
                    return (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${st.bg} ${st.color}`}>
                        <Icon size={14} />
                        {st.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold mb-3">Artículos</p>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 rounded-2xl bg-surface-50 dark:bg-surface-700/50 p-3">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-600 flex items-center justify-center">
                              <Package size={18} className="text-surface-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-dark dark:text-white text-sm truncate">{item.name}</p>
                            <p className="text-xs text-surface-400 dark:text-surface-500">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-bold text-dark dark:text-white text-sm">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/30">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-display font-bold text-dark dark:text-white">Total</span>
                  <span className="text-xl font-display font-bold text-primary-600 dark:text-primary-400">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
