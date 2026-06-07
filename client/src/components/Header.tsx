import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  HelpCircle,
  Info,
  Shield,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Sun,
  Moon,
} from 'lucide-react';
import { useCartStore, useAuthStore } from '../store';
import { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const { items } = useCartStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/products', label: 'Productos', icon: Package },
    { to: '/about', label: 'Nosotros', icon: Info },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 dark:bg-surface-900/80 glass shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-white/60 dark:bg-surface-900/60 glass'
      }`}
    >
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
              <img
                src="/logo2.jpg"
                alt="Ventas Garzón"
                className="relative h-11 w-11 rounded-full border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-surface-800 shadow-md group-hover:shadow-glow transition-all duration-300"
              />
            </motion.div>
            <div className="leading-none">
              <p className="text-[10px] uppercase tracking-[0.35em] text-primary-500 dark:text-primary-400 font-display font-bold">
                Ventas
              </p>
              <span className="text-xl font-display font-bold text-dark dark:text-white tracking-tight">
                Garzón
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link flex items-center gap-2 ${
                  isActive(to)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-surface-600 dark:text-surface-300 hover:text-dark dark:hover:text-white'
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                <span>{label}</span>
              </Link>
            ))}

            {isLoggedIn && user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`nav-link flex items-center gap-2 ${
                  isActive('/admin')
                    ? 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30'
                    : 'text-surface-600 dark:text-surface-300 hover:text-dark dark:hover:text-white'
                }`}
              >
                <Shield size={16} strokeWidth={2} />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative p-2.5 rounded-full text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-dark dark:hover:text-white transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu / Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 pr-3 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-surface-400 transition-transform duration-300 ${
                      isUserMenuOpen ? 'rotate-90' : ''
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-surface-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-surface-200 dark:border-surface-700 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border-b border-surface-200 dark:border-surface-700">
                        <p className="font-display font-semibold text-dark dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 capitalize">
                          {user?.role}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-xl transition-colors"
                        >
                          <User size={18} className="text-surface-400" />
                          <span>Mi Perfil</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-xl transition-colors"
                        >
                          <ShoppingBag size={18} className="text-surface-400" />
                          <span>Mis Pedidos</span>
                        </Link>
                        <hr className="my-2 border-surface-200 dark:border-surface-700" />
                        <button
                          onClick={() => {
                            logout();
                            window.location.href = '/';
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-surface-600 dark:text-surface-300">
                  Ingresar
                </Link>
                <Link to="/register" className="btn-primary">
                  <span className="flex items-center gap-2">
                    Registrarse
                    <ChevronRight size={16} />
                  </span>
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <Link to="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2.5 rounded-full text-surface-600 dark:text-surface-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
              >
                <ShoppingCart size={22} strokeWidth={1.8} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2.5 rounded-full text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-surface-200 dark:border-surface-700"
            >
              <div className="py-4 space-y-1">
                {navLinks.map(({ to, label, icon: Icon }, index) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive(to)
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{label}</span>
                    </Link>
                  </motion.div>
                ))}

                {isLoggedIn && user?.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive('/admin')
                          ? 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400'
                          : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                      }`}
                    >
                      <Shield size={20} />
                      <span className="font-medium">Admin</span>
                    </Link>
                  </motion.div>
                )}

                {!isLoggedIn && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 px-4 space-y-3 border-t border-surface-200 dark:border-surface-700"
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full btn-ghost border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300"
                    >
                      <User size={18} />
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full btn-primary"
                    >
                      <span>Crear Cuenta</span>
                      <ChevronRight size={18} />
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};
