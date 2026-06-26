'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, User, Menu, X, Package, HelpCircle, Info, Shield,
  LogOut, ChevronRight, Sun, Moon,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { getAdminAuth, logoutAdmin } from '@/lib/admin-auth';

export function Header() {
  const { items } = useCartStore();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(stored);
    setAdminLoggedIn(getAdminAuth().isLoggedIn);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode, mounted]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const navLinks = [
    { to: '/products', label: 'Productos', icon: Package },
    { to: '/about', label: 'Nosotros', icon: Info },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logoutAdmin();
    setAdminLoggedIn(false);
    window.location.href = '/';
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80">
        <div className="h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16" />
        </nav>
      </header>
    );
  }

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
      <div className="h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 10, scale: 1.05 }} className="relative">
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
              <img
                src="/logo2.jpg"
                alt="Ventas Garzón"
                className="relative h-11 w-11 rounded-full border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-surface-800 shadow-md group-hover:shadow-glow transition-all duration-300"
              />
            </motion.div>
            <div className="leading-none">
              <p className="text-[10px] uppercase tracking-[0.35em] text-primary-500 dark:text-primary-400 font-display font-bold">Ventas</p>
              <span className="text-xl font-display font-bold text-dark dark:text-white tracking-tight">Garzón</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} href={to}
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
            {adminLoggedIn && (
              <Link href="/admin"
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

          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative p-2.5 rounded-full text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-dark dark:hover:text-white transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {adminLoggedIn && (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 pr-3 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-md">
                    A
                  </div>
                  <ChevronRight size={14} className={`text-surface-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-90' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-surface-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-surface-200 dark:border-surface-700 overflow-hidden"
                    >
                      <div className="p-2">
                        <Link href="/admin"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-xl transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Shield size={18} className="text-surface-400" />
                          <span>Admin</span>
                        </Link>
                        <hr className="my-2 border-surface-200 dark:border-surface-700" />
                        <button onClick={handleLogout}
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
            )}

            {!adminLoggedIn && (
              <Link href="/admin"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}

            <Link href="/cart" className="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
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

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="md:hidden p-2.5 rounded-full text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

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
                  <motion.div key={to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Link href={to} onClick={() => setIsMenuOpen(false)}
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
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  {adminLoggedIn ? (
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Cerrar Sesión</span>
                    </button>
                  ) : (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all"
                    >
                      <Shield size={20} />
                      <span className="font-medium">Admin</span>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
