'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Check, AlertCircle, ArrowRight, CreditCard, Wallet, Copy, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerIdCard, setCustomerIdCard] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [ticketCode, setTicketCode] = useState('');
  const [copied, setCopied] = useState(false);

  const total = getTotalPrice();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'El nombre es obligatorio';
    if (!customerIdCard.trim()) errs.customerIdCard = 'El carnet es obligatorio';
    else if (customerIdCard.trim().length < 5) errs.customerIdCard = 'Carnet inválido';
    if (!customerPhone.trim()) errs.customerPhone = 'El teléfono es obligatorio';
    else if (!/^[\d\s+\-()]{7,15}$/.test(customerPhone)) errs.customerPhone = 'Teléfono inválido';
    setValidation(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { setError('El carrito está vacío'); return; }

    setLoading(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        id: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          customerName: customerName.trim(),
          customerIdCard: customerIdCard.trim(),
          customerPhone: customerPhone.trim(),
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al crear la reserva');
      }

      const result = await res.json();
      setTicketCode(result.ticket_code);
      setSuccess(true);
      clearCart();

      if (typeof window !== 'undefined') {
        const pastOrders = JSON.parse(localStorage.getItem('past_orders') || '[]');
        pastOrders.push({
          ticket_code: result.ticket_code,
          customer_name: customerName.trim(),
          customer_id_card: customerIdCard.trim(),
          customer_phone: customerPhone.trim(),
          total,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('past_orders', JSON.stringify(pastOrders));
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la reserva. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const copyTicket = () => {
    navigator.clipboard.writeText(ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-surface-dim dark:bg-surface-950">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-surface dark:bg-surface-800 rounded-2xl p-6 md:p-10 max-w-md text-center border border-surface-200 dark:border-surface-700 shadow-sm mx-4"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-16 h-16 md:w-20 md:h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-md"
          >
            <Check size={28} className="text-white" />
          </motion.div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-ink dark:text-surface-100 mb-2">¡Reserva Creada!</h2>
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
            <p className="text-[0.65rem] md:text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">Tu código de reserva</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl md:text-3xl font-mono font-bold text-primary-700 dark:text-primary-300 tracking-wider">{ticketCode}</span>
              <button onClick={copyTicket} className="p-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors">
                {copied ? <CheckCircle size={18} className="text-primary-500" /> : <Copy size={18} className="text-primary-400" />}
              </button>
            </div>
          </div>
          <p className="text-ink-muted mb-2 text-sm">Presenta este código al llegar a recoger tu reserva.</p>
          <p className="text-ink-muted mb-8 text-xs">El pago se realiza en persona al recoger los productos.</p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
            <button onClick={() => router.push('/')}
              className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 bg-primary-500 text-white rounded-full font-medium text-sm hover:bg-primary-600 active:scale-[0.97] transition-all"
            >
              Volver al Inicio <ArrowRight size={16} />
            </button>
            <Link href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 border border-surface-300 dark:border-surface-700 text-ink dark:text-surface-200 rounded-full font-medium text-sm hover:bg-surface-100 dark:hover:bg-surface-700 active:scale-[0.97] transition-all"
            >
              Seguir Comprando
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-muted mb-4">Tu carrito está vacío</p>
          <Link href="/products" className="btn-primary">Ir a Productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-surface-dim dark:bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-primary-500 rounded-xl md:rounded-2xl p-2 md:p-3 shadow-sm">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <span className="text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.08em] font-bold text-primary-500 dark:text-primary-400">Reserva</span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-ink dark:text-surface-100">Confirmar Reserva</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="bg-surface dark:bg-surface-800 rounded-xl md:rounded-2xl border border-surface-200 dark:border-surface-700 p-4 md:p-6 shadow-sm mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-display font-bold text-ink dark:text-surface-100 mb-4 md:mb-5">Tus Datos</h2>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-ink dark:text-surface-200 mb-1.5">
                      Nombre completo <span className="text-error">*</span>
                    </label>
                    <input id="customerName" type="text" value={customerName}
                      onChange={(e) => { setCustomerName(e.target.value); setValidation(v => ({ ...v, customerName: '' })); }}
                      placeholder="Ej: Juan Pérez"
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 bg-surface-50 dark:bg-surface-700 border rounded-lg md:rounded-xl text-sm text-ink dark:text-surface-100 placeholder-ink-muted outline-none transition-all ${
                        validation.customerName ? 'border-error focus:ring-2 focus:ring-error/30' : 'border-surface-200 dark:border-surface-600 focus:ring-2 focus:ring-primary/30'
                      }`}
                    />
                    {validation.customerName && <p className="mt-1 text-xs text-error">{validation.customerName}</p>}
                  </div>
                  <div>
                    <label htmlFor="customerIdCard" className="block text-sm font-medium text-ink dark:text-surface-200 mb-1.5">
                      Carnet de identidad <span className="text-error">*</span>
                    </label>
                    <input id="customerIdCard" type="text" value={customerIdCard}
                      onChange={(e) => { setCustomerIdCard(e.target.value); setValidation(v => ({ ...v, customerIdCard: '' })); }}
                      placeholder="Ej: 12345678"
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 bg-surface-50 dark:bg-surface-700 border rounded-lg md:rounded-xl text-sm text-ink dark:text-surface-100 placeholder-ink-muted outline-none transition-all ${
                        validation.customerIdCard ? 'border-error focus:ring-2 focus:ring-error/30' : 'border-surface-200 dark:border-surface-600 focus:ring-2 focus:ring-primary/30'
                      }`}
                    />
                    {validation.customerIdCard && <p className="mt-1 text-xs text-error">{validation.customerIdCard}</p>}
                  </div>
                  <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-ink dark:text-surface-200 mb-1.5">
                      Teléfono <span className="text-error">*</span>
                    </label>
                    <input id="customerPhone" type="tel" value={customerPhone}
                      onChange={(e) => { setCustomerPhone(e.target.value); setValidation(v => ({ ...v, customerPhone: '' })); }}
                      placeholder="Ej: +53 5 1234 5678"
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 bg-surface-50 dark:bg-surface-700 border rounded-lg md:rounded-xl text-sm text-ink dark:text-surface-100 placeholder-ink-muted outline-none transition-all ${
                        validation.customerPhone ? 'border-error focus:ring-2 focus:ring-error/30' : 'border-surface-200 dark:border-surface-600 focus:ring-2 focus:ring-primary/30'
                      }`}
                    />
                    {validation.customerPhone && <p className="mt-1 text-xs text-error">{validation.customerPhone}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-surface dark:bg-surface-800 rounded-xl md:rounded-2xl border border-surface-200 dark:border-surface-700 p-4 md:p-6 shadow-sm mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-display font-bold text-ink dark:text-surface-100 mb-3 md:mb-4">Método de Pago</h2>
                <p className="text-xs text-ink-muted mb-4">Selecciona cómo vas a pagar al recoger tu reserva</p>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <button type="button" onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl border text-xs md:text-sm font-medium transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                        : 'bg-surface-50 dark:bg-surface-700 border-surface-200 dark:border-surface-600 text-ink-muted hover:border-primary/30'
                    }`}
                  >
                    <Wallet size={18} />
                    <span className="text-left">
                      <span className="block font-semibold">Efectivo</span>
                      <span className="text-[0.7rem] opacity-70">Paga al recoger</span>
                    </span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('transfer')}
                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl border text-xs md:text-sm font-medium transition-all ${
                      paymentMethod === 'transfer'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                        : 'bg-surface-50 dark:bg-surface-700 border-surface-200 dark:border-surface-600 text-ink-muted hover:border-primary/30'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="text-left">
                      <span className="block font-semibold">Transferencia</span>
                      <span className="text-[0.7rem] opacity-70">Paga por transferencia</span>
                    </span>
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="flex items-start gap-3 px-4 py-3 mb-4 bg-error/10 dark:bg-error/20 border border-error/30 rounded-xl text-sm text-error"
                  >
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 md:py-3.5 px-5 md:px-6 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 dark:disabled:bg-surface-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm md:text-base transition-all active:scale-[0.97]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <>Reservar Productos &mdash; {formatPrice(total)} <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-surface dark:bg-surface-800 rounded-xl md:rounded-2xl border border-surface-200 dark:border-surface-700 p-4 md:p-6 shadow-sm sticky top-24">
              <h2 className="text-base md:text-lg font-display font-bold text-ink dark:text-surface-100 mb-4 md:mb-5">Resumen de la Reserva</h2>
              <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-64 overflow-y-auto mb-4 md:mb-5 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 flex-shrink-0 overflow-hidden">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink dark:text-surface-100 truncate">{item.name}</p>
                      <p className="text-xs text-ink-muted">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink dark:text-surface-100 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
                <div className="flex justify-between text-lg font-bold text-ink dark:text-surface-100">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-ink-muted mt-2 text-center">Pago en persona al recoger</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
