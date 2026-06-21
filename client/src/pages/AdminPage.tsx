import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Plus, Pencil, Trash2,
  ChevronLeft, ChevronRight, ChevronDown, X, Save, AlertCircle, Check,
  DollarSign, Truck, CheckCircle2, XCircle, Clock, ShieldCheck, Ticket, Search, Key
} from 'lucide-react';
import { useAuthStore } from '../store';
import { adminService } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import { ImageUploader } from '../components/ImageUploader';

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'verify';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: string;
}

const emptyProduct: ProductForm = { name: '', description: '', price: '', stock: '', category: 'limpieza', image: '' };

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
  picked_up: { label: 'Recogido', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Truck },
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
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // Verify Reservation
  const [verifyTicket, setVerifyTicket] = useState('');
  const [verifiedReservation, setVerifiedReservation] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const clearMessages = useCallback(() => {
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  }, []);

  const toggleOrderExpanded = (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showProductModal) setShowProductModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showProductModal]);

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

  // Verify Reservation
  const handleVerifyTicket = async () => {
    if (!verifyTicket.trim() || verifyTicket.trim().length < 3) {
      setVerifyError('Ingresa un código de ticket válido');
      return;
    }
    try {
      setVerifying(true);
      setVerifyError('');
      setVerifiedReservation(null);
      const data = await adminService.verifyReservation(verifyTicket.trim());
      setVerifiedReservation(data);
    } catch (err: any) {
      setVerifyError(err.response?.data?.message || 'Reserva no encontrada');
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmReservation = async (id: number) => {
    try {
      setConfirmingId(id);
      await adminService.confirmReservation(String(id));
      setSuccess('Reserva confirmada — stock descontado');
      setVerifiedReservation({ ...verifiedReservation, status: 'confirmed' });
      clearMessages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error confirmando reserva');
      clearMessages();
    } finally {
      setConfirmingId(null);
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    try {
      setCancellingId(id);
      await adminService.cancelReservation(String(id));
      setSuccess('Reserva cancelada');
      setVerifiedReservation({ ...verifiedReservation, status: 'cancelled' });
      clearMessages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cancelando reserva');
      clearMessages();
    } finally {
      setCancellingId(null);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Completa ambas contraseñas');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    try {
      setChangingPassword(true);
      await adminService.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verify', label: 'Verificar Reserva', icon: Ticket },
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
        <div className="mb-6 md:mb-8 rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 bg-white/90 dark:bg-surface-800/90 shadow-xl dark:shadow-black/30 p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl md:rounded-2xl p-2 md:p-3 shadow-lg">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <div>
                <p className="text-[0.65rem] md:text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Panel de Control</p>
                <h1 className="text-xl md:text-3xl font-display font-bold text-dark dark:text-white">Administrador</h1>
              </div>
            </div>
            <div className="rounded-xl md:rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-3 md:px-5 py-2 md:py-3 text-white shadow-lg">
              <p className="text-xs text-white/80">{user?.email}</p>
              <p className="font-bold">{user?.name || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 md:mb-8 flex gap-1.5 md:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700 border border-surface-100 dark:border-surface-700'
              }`}
            >
              <tab.icon size={14} className="md:hidden" />
              <tab.icon size={18} className="hidden md:block" />
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
                <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Productos', value: dashboard.stats?.totalProducts ?? 0, icon: Package, color: 'from-blue-500 to-blue-600' },
                    { label: 'Pedidos', value: dashboard.stats?.totalOrders ?? 0, icon: ShoppingCart, color: 'from-teal-500 to-teal-600' },
                    { label: 'Usuarios', value: dashboard.stats?.totalUsers ?? 0, icon: Users, color: 'from-secondary-500 to-secondary-600' },
                    { label: 'Ingresos', value: formatPrice(dashboard.stats?.totalRevenue ?? 0), icon: DollarSign, color: 'from-primary-500 to-primary-600' },
                  ].map((stat) => (
                    <motion.div key={stat.label} whileHover={{ y: -4 }}
                      className="rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-3 md:p-5 shadow-sm dark:shadow-black/20">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <p className="text-[0.6rem] md:text-xs uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400 font-semibold">{stat.label}</p>
                        <div className={`bg-gradient-to-br ${stat.color} rounded-lg md:rounded-xl p-1.5 md:p-2`}>
                          <stat.icon size={12} className="text-white md:hidden" />
                          <stat.icon size={16} className="text-white hidden md:block" />
                        </div>
                      </div>
                      <p className="text-lg md:text-2xl font-display font-bold text-dark dark:text-white">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-4 md:p-6 shadow-sm dark:shadow-black/20">
                  <h2 className="text-base md:text-xl font-display font-bold text-dark dark:text-white mb-3 md:mb-4">Pedidos Recientes</h2>
                  <div className="space-y-2 md:space-y-3">
                    {dashboard.recentOrders?.length ? (
                      dashboard.recentOrders.map((order: any) => {
                        const st = statusConfig[order.status] || statusConfig.pending;
                        const Icon = st.icon;
                        return (
                          <div key={order.id} className="flex items-center justify-between rounded-xl md:rounded-2xl border border-surface-100 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 p-3 md:p-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className={`rounded-lg md:rounded-xl p-1.5 md:p-2 ${st.bg}`}><Icon size={14} className={st.color} /></div>
                              <div>
                                <p className="text-xs text-surface-500 dark:text-surface-400">#{order.id}</p>
                                <p className="font-semibold text-dark dark:text-white text-xs md:text-sm">{order.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-dark dark:text-white text-xs md:text-sm">{formatPrice(order.total)}</p>
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

                {/* Change Password */}
                <div className="bg-white dark:bg-surface-800 rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 p-4 md:p-6 shadow-sm dark:shadow-black/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-2">
                      <Key size={16} className="text-white" />
                    </div>
                    <h2 className="text-base md:text-xl font-display font-bold text-dark dark:text-white">Cambiar Contraseña</h2>
                  </div>
                  <div className="max-w-sm space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1">Contraseña actual</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(''); setPasswordSuccess(''); }}
                        className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1">Nueva contraseña</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); setPasswordSuccess(''); }}
                        className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => { setConfirmNewPassword(e.target.value); setPasswordError(''); setPasswordSuccess(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                        className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm"
                      />
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {passwordError}</p>
                    )}
                    {passwordSuccess && (
                      <p className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> {passwordSuccess}</p>
                    )}
                    <button
                      onClick={handleChangePassword}
                      disabled={changingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changingPassword ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Key size={14} />
                      )}
                      Actualizar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Verify Reservation Tab */}
            {activeTab === 'verify' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-surface-800 rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 p-4 md:p-6 shadow-sm">
                  <h2 className="text-base md:text-lg font-display font-bold text-dark dark:text-white mb-3 md:mb-4">Buscar Reserva por Ticket</h2>
                  <div className="flex gap-2 md:gap-3">
                    <input
                      type="text"
                      value={verifyTicket}
                      onChange={(e) => { setVerifyTicket(e.target.value.toUpperCase()); setVerifyError(''); }}
                      placeholder="Ej: VG-A3F7"
                      className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm font-mono tracking-wider placeholder-surface-400"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyTicket()}
                    />
                    <button
                      onClick={handleVerifyTicket}
                      disabled={verifying}
                      className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {verifying ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Search size={16} />
                      )}
                      Buscar
                    </button>
                  </div>
                  {verifyError && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
                      <AlertCircle size={14} /> {verifyError}
                    </p>
                  )}
                </div>

                {verifiedReservation && (
                  <div className="bg-white dark:bg-surface-800 rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 p-4 md:p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-5 gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg md:rounded-xl p-2 md:p-2.5 ${(statusConfig[verifiedReservation.status] || statusConfig.pending).bg}`}>
                          {(() => { const Icon = (statusConfig[verifiedReservation.status] || statusConfig.pending).icon; return <Icon size={20} className={(statusConfig[verifiedReservation.status] || statusConfig.pending).color} />; })()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Ticket size={12} className="text-primary-500" />
                            <span className="font-mono font-bold text-base md:text-lg text-primary-600 dark:text-primary-400">{verifiedReservation.ticket_code}</span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[0.6rem] md:text-[0.65rem] font-bold uppercase tracking-wider mt-1 ${(statusConfig[verifiedReservation.status] || statusConfig.pending).bg} ${(statusConfig[verifiedReservation.status] || statusConfig.pending).color}`}>
                            {(statusConfig[verifiedReservation.status] || statusConfig.pending).label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(verifiedReservation.total)}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{formatDate(verifiedReservation.created_at)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5 p-3 md:p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl md:rounded-2xl">
                      <div>
                        <p className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Nombre</p>
                        <p className="text-xs md:text-sm font-medium text-dark dark:text-white">{verifiedReservation.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Carnet</p>
                        <p className="text-xs md:text-sm font-medium text-dark dark:text-white">{verifiedReservation.customer_id_card}</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Teléfono</p>
                        <p className="text-xs md:text-sm font-medium text-dark dark:text-white">{verifiedReservation.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-wider text-surface-500 dark:text-surface-400 font-semibold">Pago</p>
                        <p className="text-sm font-medium text-dark dark:text-white">{verifiedReservation.payment_method === 'cash' ? 'Efectivo' : 'Transferencia'}</p>
                      </div>
                    </div>

                    <h3 className="text-xs md:text-sm font-semibold text-dark dark:text-white mb-2 md:mb-3">Productos Reservados</h3>
                    <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-5">
                      {(verifiedReservation.items || []).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg md:rounded-xl">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-surface-200 dark:bg-surface-600 overflow-hidden flex-shrink-0">
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-dark dark:text-white truncate">{item.name}</p>
                            <p className="text-[0.65rem] md:text-xs text-surface-500 dark:text-surface-400">
                              x{item.quantity} — Stock actual: {item.current_stock}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-dark dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {verifiedReservation.status === 'pending' && (
                      <div className="flex gap-2 md:gap-3">
                        <button
                          onClick={() => handleConfirmReservation(verifiedReservation.id)}
                          disabled={confirmingId === verifiedReservation.id}
                          className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                          {confirmingId === verifiedReservation.id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          Confirmar — Descontar Stock
                        </button>
                        <button
                          onClick={() => handleCancelReservation(verifiedReservation.id)}
                          disabled={cancellingId === verifiedReservation.id}
                          className="flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                        >
                          {cancellingId === verifiedReservation.id ? (
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          Cancelar
                        </button>
                      </div>
                    )}

                    {verifiedReservation.status === 'confirmed' && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium">
                        <CheckCircle2 size={16} />
                        Reserva confirmada — Stock descontado. Esperando recogida del cliente.
                      </div>
                    )}

                    {verifiedReservation.status === 'cancelled' && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
                        <XCircle size={16} />
                        Esta reserva fue cancelada.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => { setEditingProduct(null); setProductForm(emptyProduct); setShowProductModal(true); }}
                    className="flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all">
                    <Plus size={18} /> Agregar Producto
                  </button>
                </div>

                <div className="rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 overflow-hidden shadow-sm dark:shadow-black/20">
                  {/* Mobile: Card layout */}
                  <div className="md:hidden divide-y divide-surface-100 dark:divide-surface-700">
                    {products.map((product) => (
                      <div key={product.id} className="p-4 flex gap-3">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-600 flex items-center justify-center flex-shrink-0">
                            <Package size={18} className="text-surface-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-dark dark:text-white text-sm truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-flex rounded-full bg-surface-100 dark:bg-surface-600 px-2 py-0.5 text-[0.6rem] font-semibold text-surface-600 dark:text-surface-300 capitalize">{product.category}</span>
                            <span className="text-xs font-semibold text-dark dark:text-white">{formatPrice(product.price)}</span>
                            <span className={`text-[0.6rem] font-semibold ${product.stock <= 5 ? 'text-red-500' : 'text-surface-400'}`}>Stock: {product.stock}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-1">
                          <button onClick={() => openEditProduct(product)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} disabled={deletingId === product.id}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50">
                            {deletingId === product.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Table layout */}
                  <div className="hidden md:block overflow-x-auto">
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
                    <div className="py-8 md:py-12 text-center text-surface-500 dark:text-surface-400 text-sm">No hay productos registrados.</div>
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
                <div className="flex gap-1.5 md:gap-2 flex-wrap">
                  {['', 'pending', 'confirmed', 'picked_up', 'cancelled'].map((status) => (
                    <button key={status} onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all ${
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
                    const isExpanded = expandedOrders.has(order.id);
                    const hasItems = order.items && order.items.length > 0;
                    return (
                      <div key={order.id} className="rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 p-4 md:p-5 shadow-sm dark:shadow-black/20">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg md:rounded-xl p-2 md:p-2.5 ${st.bg}`}><Icon size={16} className={st.color} /></div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Ticket size={10} className="text-primary-500 md:hidden" />
                                <Ticket size={12} className="text-primary-500 hidden md:block" />
                                <p className="font-mono font-bold text-xs md:text-sm text-primary-600 dark:text-primary-400">{order.ticket_code}</p>
                              </div>
                              <p className="font-semibold text-dark dark:text-white text-xs md:text-sm">{order.customer_name}</p>
                              <p className="text-[0.65rem] md:text-xs text-surface-500 dark:text-surface-400">{order.customer_id_card} — {order.customer_phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="text-right">
                              <p className="text-base md:text-lg font-bold text-dark dark:text-white">{formatPrice(order.total)}</p>
                            </div>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              disabled={updatingOrderId === order.id}
                              className="bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg md:rounded-xl px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-dark dark:text-white outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 cursor-pointer"
                            >
                              {Object.entries(statusConfig).map(([key, cfg]) => (
                                <option key={key} value={key}>{cfg.label}</option>
                              ))}
                            </select>
                            {hasItems && (
                              <button
                                onClick={() => toggleOrderExpanded(order.id)}
                                className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                                title={isExpanded ? 'Ocultar productos' : 'Ver productos'}
                              >
                                <ChevronDown
                                  size={20}
                                  className={`text-surface-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Order Items - Collapsible */}
                        <AnimatePresence>
                          {isExpanded && hasItems && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700">
                                <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">Productos</p>
                                <div className="space-y-2">
                                  {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-3 text-sm">
                                      {item.image ? (
                                        <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-600 flex items-center justify-center">
                                          <Package size={14} className="text-surface-400" />
                                        </div>
                                      )}
                                      <span className="text-dark dark:text-white flex-1 truncate">{item.name}</span>
                                      <span className="text-surface-500 dark:text-surface-400">x{item.quantity}</span>
                                      <span className="font-semibold text-dark dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                <div className="rounded-2xl md:rounded-3xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 overflow-hidden shadow-sm dark:shadow-black/20">
                  {/* Mobile: Card layout */}
                  <div className="md:hidden divide-y divide-surface-100 dark:divide-surface-700">
                    {users.map((u) => (
                      <div key={u.id} className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-dark dark:text-white text-sm truncate">{u.name}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{u.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold ${
                              u.role === 'admin'
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                : 'bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                            }`}>
                              {u.role}
                            </span>
                            <span className="text-[0.6rem] text-surface-400">{formatDate(u.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            disabled={updatingUserId === u.id || u.id === user?.id}
                            className="bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg px-2 py-1 text-xs font-semibold text-dark dark:text-white outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button onClick={() => handleDeleteUser(u.id)} disabled={deletingUserId === u.id || u.id === user?.id || u.role === 'admin'}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            {deletingUserId === u.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Table layout */}
                  <div className="hidden md:block overflow-x-auto">
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
                    <div className="py-8 md:py-12 text-center text-surface-500 dark:text-surface-400 text-sm">No hay usuarios registrados.</div>
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
              className="bg-white dark:bg-surface-800 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-lg border border-surface-100 dark:border-surface-700 mx-4"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-surface-100 dark:border-surface-700">
                <h2 className="text-lg md:text-xl font-display font-bold text-dark dark:text-white">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={() => setShowProductModal(false)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <X size={20} className="text-surface-400" />
                </button>
              </div>
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Nombre *</label>
                  <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Descripción</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Precio *</label>
                    <input type="number" step="0.01" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Stock</label>
                    <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Categoría *</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-dark dark:text-white text-sm cursor-pointer">
                      <option value="aseo">Aseo</option>
                      <option value="limpieza">Limpieza</option>
                      <option value="alimentos">Alimentos</option>
                      <option value="bebidas">Bebidas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-1.5">Imagen del Producto</label>
                    <ImageUploader
                      value={productForm.image}
                      onChange={(url) => setProductForm({ ...productForm, image: url })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 md:gap-3 p-4 md:p-6 border-t border-surface-100 dark:border-surface-700">
                <button onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-surface-200 dark:border-surface-600 text-surface-600 dark:text-surface-400 font-semibold text-xs md:text-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                  Cancelar
                </button>
                <button onClick={handleSaveProduct} disabled={savingProduct || !productForm.name || !productForm.price}
                  className="flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 md:gap-2">
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
