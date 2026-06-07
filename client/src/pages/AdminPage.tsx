import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Plus, Pencil, Trash2,
  ChevronLeft, ChevronRight, X, Save, AlertCircle, Check,
  DollarSign, Truck, CheckCircle2, XCircle, Clock, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../store';
import { adminService } from '../services/api';
import { formatPrice, formatDate } from '../utils';

type Tab = 'dashboard' | 'products' | 'orders' | 'users';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: string;
}

const emptyProduct: ProductForm = { name: '', description: '', price: '', stock: '', category: 'aseo', image: '' };

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle2 },
  shipped: { label: 'Enviado', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: Truck },
  delivered: { label: 'Entregado', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
};

export const AdminPage: React.FC = () => {
  const { isLoggedIn, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dashboard
  const [dashboard, setDashboard] = useState<any>(null);

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const clearMessages = useCallback(() => {
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  }, []);

  // Load dashboard
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cargando dashboard');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Load products
  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await adminService.getProducts(page);
      setProducts(data.data || []);
      setProductPage(data.page || 1);
      setProductTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cargando productos');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Load orders
  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const data = await adminService.getOrders(page, orderStatusFilter || undefined);
      setOrders(data.data || []);
      setOrderPage(data.page || 1);
      setOrderTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cargando pedidos');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Load users
  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(page);
      setUsers(data.data || []);
      setUserPage(data.page || 1);
      setUserTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cargando usuarios');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboard();
    else if (activeTab === 'products') loadProducts(1);
    else if (activeTab === 'orders') loadOrders(1);
    else if (activeTab === 'users') loadUsers(1);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'orders') loadOrders(1);
  }, [orderStatusFilter]);

  // Product CRUD
  const handleSaveProduct = async () => {
    try {
      setSavingProduct(true);
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock) || 0,
      };
      if (editingProduct) {
        await adminService.updateProduct(String(editingProduct.id), payload);
        setSuccess('Producto actualizado correctamente');
      } else {
        await adminService.createProduct(payload);
        setSuccess('Producto creado correctamente');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm(emptyProduct);
      loadProducts(productPage);
      clearMessages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error guardando producto');
      clearMessages();
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      setDeletingId(id);
      await adminService.deleteProduct(String(id));
      setSuccess('Producto eliminado correctamente');
      loadProducts(productPage);
      clearMessages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error eliminando producto');
      clearMessages();
    } finally {
      setDeletingId(null);
    }
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      image: product.image || '',
    });
    setShowProductModal(true);
  };

  // Order status
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await adminService.updateOrderStatus(String(orderId), newStatus);
      setSuccess(`Pedido #${orderId} actualizado a "${statusConfig[newStatus]?.label}"`);
      loadOrders(orderPage);
      clearMessages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error actualizando pedido');
      clearMessages();
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // User role
  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      setUpdatingUserId(userId);
      await adminService.updateUserRole(String(userId), newRole);
      setSuccess('Rol de usuario actualizado');
      loadUsers(userPage);
      clearMessages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error actualizando rol');
      clearMessages();
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Se eliminarán también sus pedidos.')) return;
    try {
      setDeletingUserId(userId);
      await adminService.deleteUser(String(userId));
      setSuccess('Usuario eliminado correctamente');
      loadUsers(userPage);
      clearMessages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error eliminando usuario');
      clearMessages();
    } finally {
      setDeletingUserId(null);
    }
  };

  if (!isLoggedIn || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'users', label: 'Usuarios', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-surface-100 dark:border-surface-700 bg-white/90 dark:bg-surface-800/90 shadow-xl dark:shadow-black/30 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3 shadow-lg">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Panel de Control</p>
                <h1 className="text-3xl font-display font-bold text-dark dark:text-white">Administrador</h1>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-white shadow-lg">
              <p className="text-xs text-white/80">{user?.email}</p>
              <p className="font-bold">{user?.name || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700 border border-surface-100 dark:border-surface-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3">
              <AlertCircle size={20} /> <span className="text-sm">{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-2xl flex items-center gap-3">
              <Check size={20} /> <span className="text-sm">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-3xl" />)}
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && dashboard && (
              <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Productos', value: dashboard.stats?.totalProducts ?? 0, icon: Package, color: 'from-blue-500 to-blue-600' },
                    { label: 'Pedidos', value: dashboard.stats?.totalOrders ?? 0, icon: ShoppingCart, color: 'from-purple-500 to-purple-600' },
                    { label: 'Usuarios', value: dashboard.stats?.totalUsers ?? 0, icon: Users, color: 'from-secondary-500 to-secondary-600' },
                    { label: 'Ingresos', value: formatPrice(dashboard.stats?.totalRevenue ?? 0), icon: DollarSign, color: 'from-primary-500 to-primary-600' },
                  ].map((stat) => (
                    <motion.div key={stat.label} whileHover={{ y: -4 }}
                      className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-5 shadow-sm dark:shadow-black/20">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400 font-semibold">{stat.label}</p>
                        <div className={`bg-gradient-to-br ${stat.color} rounded-xl p-2`}>
                          <stat.icon size={16} className="text-white" />
                        </div>
                      </div>
                      <p className="text-2xl font-display font-bold text-dark dark:text-white">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 shadow-sm dark:shadow-black/20">
                  <h2 className="text-xl font-display font-bold text-dark dark:text-white mb-4">Pedidos Recientes</h2>
                  <div className="space-y-3">
                    {dashboard.recentOrders?.length ? (
                      dashboard.recentOrders.map((order: any) => {
                        const st = statusConfig[order.status] || statusConfig.pending;
                        const Icon = st.icon;
                        return (
                          <div key={order.id} className="flex items-center justify-between rounded-2xl border border-surface-100 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 p-4">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-xl p-2 ${st.bg}`}><Icon size={16} className={st.color} /></div>
                              <div>
                                <p className="text-sm text-surface-500 dark:text-surface-400">#{order.id}</p>
                                <p className="font-semibold text-dark dark:text-white text-sm">{order.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-dark dark:text-white text-sm">{formatPrice(order.total)}</p>
                              <span className={`text-xs font-semibold ${st.color}`}>{st.label}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-surface-500 dark:text-surface-400 text-sm">No hay pedidos recientes.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => { setEditingProduct(null); setProductForm(emptyProduct); setShowProductModal(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
                    <Plus size={18} /> Agregar Producto
                  </button>
                </div>

                <div className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 overflow-hidden shadow-sm dark:shadow-black/20">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50">
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Producto</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Categoría</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Precio</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Stock</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {product.image ? (
                                  <img src={product.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-600 flex items-center justify-center">
                                    <Package size={18} className="text-surface-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-dark dark:text-white text-sm">{product.name}</p>
                                  <p className="text-xs text-surface-400 dark:text-surface-500 line-clamp-1">{product.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-full bg-surface-100 dark:bg-surface-600 px-3 py-1 text-xs font-semibold text-surface-600 dark:text-surface-300 capitalize">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-dark dark:text-white text-sm">{formatPrice(product.price)}</td>
                            <td className="px-6 py-4">
                              <span className={`font-semibold text-sm ${product.stock <= 5 ? 'text-red-500' : 'text-dark dark:text-white'}`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEditProduct(product)}
                                  className="p-2 rounded-xl text-surface-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                  <Pencil size={16} />
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id)} disabled={deletingId === product.id}
                                  className="p-2 rounded-xl text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50">
                                  {deletingId === product.id ? (
                                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {products.length === 0 && (
                    <div className="py-12 text-center text-surface-500 dark:text-surface-400">No hay productos registrados.</div>
                  )}
                </div>

                {/* Pagination */}
                {productTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => loadProducts(productPage - 1)} disabled={productPage <= 1}
                      className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm text-surface-500 dark:text-surface-400 px-3">{productPage} / {productTotalPages}</span>
                    <button onClick={() => loadProducts(productPage + 1)} disabled={productPage >= productTotalPages}
                      className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button key={status} onClick={() => setOrderStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        orderStatusFilter === status
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                      }`}>
                      {status ? statusConfig[status]?.label : 'Todos'}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {orders.map((order) => {
                    const st = statusConfig[order.status] || statusConfig.pending;
                    const Icon = st.icon;
                    return (
                      <div key={order.id} className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-5 shadow-sm dark:shadow-black/20">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`rounded-xl p-2.5 ${st.bg}`}><Icon size={20} className={st.color} /></div>
                            <div>
                              <p className="text-xs text-surface-500 dark:text-surface-400">Pedido #{order.id}</p>
                              <p className="font-semibold text-dark dark:text-white">{order.name} — {order.email}</p>
                              <p className="text-sm text-surface-500 dark:text-surface-400">{formatDate(order.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-dark dark:text-white">{formatPrice(order.total)}</p>
                              <p className="text-xs text-surface-500 dark:text-surface-400">{order.shipping_address || 'Sin dirección'}</p>
                            </div>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              disabled={updatingOrderId === order.id}
                              className="bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl px-3 py-2 text-sm font-semibold text-dark dark:text-white outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 cursor-pointer"
                            >
                              {Object.entries(statusConfig).map(([key, cfg]) => (
                                <option key={key} value={key}>{cfg.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {orders.length === 0 && (
                    <div className="py-12 text-center text-surface-500 dark:text-surface-400">No hay pedidos{orderStatusFilter ? ` con estado "${statusConfig[orderStatusFilter]?.label}"` : ''}.</div>
                  )}
                </div>

                {orderTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => loadOrders(orderPage - 1)} disabled={orderPage <= 1}
                      className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm text-surface-500 dark:text-surface-400 px-3">{orderPage} / {orderTotalPages}</span>
                    <button onClick={() => loadOrders(orderPage + 1)} disabled={orderPage >= orderTotalPages}
                      className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 overflow-hidden shadow-sm dark:shadow-black/20">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50">
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Usuario</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Email</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Rol</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Registro</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <p className="font-semibold text-dark dark:text-white text-sm">{u.name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-300">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                  : 'bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                              }`}>
                                {u.role === 'admin' ? <ShieldCheck size={12} /> : <Users size={12} />}
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-surface-500 dark:text-surface-400">{formatDate(u.created_at)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                  disabled={updatingUserId === u.id || u.id === user?.id}
                                  className="bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl px-3 py-2 text-sm font-semibold text-dark dark:text-white outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 cursor-pointer"
                                >
                                  <option value="user">Usuario</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <button onClick={() => handleDeleteUser(u.id)} disabled={deletingUserId === u.id || u.id === user?.id || u.role === 'admin'}
                                  className="p-2 rounded-xl text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={u.role === 'admin' ? 'No se puede eliminar admin' : 'Eliminar usuario'}>
                                  {deletingUserId === u.id ? (
                                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {users.length === 0 && (
                    <div className="py-12 text-center text-surface-500 dark:text-surface-400">No hay usuarios registrados.</div>
                  )}
                </div>

                {userTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => loadUsers(userPage - 1)} disabled={userPage <= 1}
                      className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm text-surface-500 dark:text-surface-400 px-3">{userPage} / {userTotalPages}</span>
                    <button onClick={() => loadUsers(userPage + 1)} disabled={userPage >= userTotalPages}
                      className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProductModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-3xl shadow-2xl w-full max-w-lg border border-surface-100 dark:border-surface-700"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-surface-100 dark:border-surface-700">
                <h2 className="text-xl font-display font-bold text-dark dark:text-white">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={() => setShowProductModal(false)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <X size={20} className="text-surface-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Nombre *</label>
                  <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Descripción</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Precio *</label>
                    <input type="number" step="0.01" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Stock</label>
                    <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Categoría *</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm cursor-pointer">
                      <option value="aseo">Aseo</option>
                      <option value="alimentos">Alimentos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">URL Imagen</label>
                    <input type="url" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm placeholder-surface-400" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-surface-100 dark:border-surface-700">
                <button onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-surface-200 dark:border-surface-600 text-surface-600 dark:text-surface-400 font-semibold text-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                  Cancelar
                </button>
                <button onClick={handleSaveProduct} disabled={savingProduct || !productForm.name || !productForm.price}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                  {savingProduct ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={16} />
                      {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
