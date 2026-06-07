import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { SlideUp } from '../utils/animations';
import { authService } from '../services/api';
import { useAuthStore } from '../store';
import { Mail, Lock, User, AlertCircle, Check, Eye, EyeOff, ArrowRight, ShoppingBag, Shield } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData.email, formData.password, formData.name);
      setSuccess(true);
      setUser(response.user, response.token);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-surface-900 dark:via-surface-950 dark:to-surface-900 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 dark:bg-primary-400/5 rounded-full blur-3xl" />
        </div>

        <SlideUp>
          <div className="relative bg-white dark:bg-surface-800 rounded-3xl shadow-xl dark:shadow-black/30 p-10 max-w-md text-center border border-surface-100 dark:border-surface-700">
            <motion.div
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Check size={40} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-dark dark:text-white mb-3">
              ¡Bienvenido!
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              Tu cuenta ha sido creada exitosamente
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-surface-400 dark:text-surface-500">
              <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              Redirigiendo...
            </div>
          </div>
        </SlideUp>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-surface-900 dark:via-surface-950 dark:to-surface-900 pt-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 dark:bg-primary-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <SlideUp>
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                <img
                  src="/logo2.jpg"
                  alt="Ventas Garzón"
                  className="relative h-14 w-14 rounded-full border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-surface-800 shadow-lg"
                />
              </div>
              <div className="leading-none text-left">
                <p className="text-[10px] uppercase tracking-[0.35em] text-primary-500 dark:text-primary-400 font-display font-bold">
                  Ventas
                </p>
                <span className="text-2xl font-display font-bold text-dark dark:text-white tracking-tight">
                  Garzón
                </span>
              </div>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-surface-800 rounded-3xl shadow-xl dark:shadow-black/30 p-8 border border-surface-100 dark:border-surface-700">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-dark dark:text-white mb-2">
                Crear Cuenta
              </h1>
              <p className="text-surface-500 dark:text-surface-400">
                Únete a Ventas Garzón
              </p>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-6 flex items-start gap-3"
                >
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-2">
                  Nombre Completo
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 group-focus-within:text-primary-500 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-300"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 group-focus-within:text-primary-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-300"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-2">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 group-focus-within:text-primary-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`h-1.5 flex-1 rounded-full ${formData.password.length >= 8 ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-600'}`} />
                    <span className={`text-xs ${formData.password.length >= 8 ? 'text-primary-500' : 'text-surface-400'}`}>
                      {formData.password.length >= 8 ? '✓ Válida' : 'Mínimo 8 caracteres'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-surface-200 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 group-focus-within:text-primary-500 transition-colors">
                    <Shield size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-primary-500">
                    <Check size={14} />
                    Las contraseñas coinciden
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 rounded-2xl font-bold text-base transition-all duration-300 disabled:from-surface-300 disabled:to-surface-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-surface-200 dark:bg-surface-600" />
              <span className="text-xs text-surface-400 dark:text-surface-500 font-medium">o</span>
              <div className="flex-1 h-px bg-surface-200 dark:bg-surface-600" />
            </div>

            {/* Links */}
            <div className="text-center">
              <p className="text-surface-500 dark:text-surface-400 text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="text-primary-500 dark:text-primary-400 font-bold hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-surface-500 dark:text-surface-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors"
            >
              <ShoppingBag size={16} />
              Volver a la tienda
            </Link>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};
