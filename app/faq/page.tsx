'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, MessageCircle, Search, ChevronDown, Package, Truck, CreditCard, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'orders', label: 'Pedidos' },
  { id: 'shipping', label: 'Envío' },
  { id: 'payments', label: 'Pagos' },
  { id: 'returns', label: 'Devoluciones' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  orders: <Package size={16} />,
  shipping: <Truck size={16} />,
  payments: <CreditCard size={16} />,
  returns: <RefreshCw size={16} />,
};

const faqs = [
  { question: '¿Cómo realizo un pedido?', answer: 'Busca el producto que deseas, agrégalo al carrito y completa tus datos en el formulario de pago. Recibirás un código de ticket como confirmación.', category: 'orders' },
  { question: '¿Cómo recoges tu pedido?', answer: 'Reserva online y recoge en tienda cuando te convenga. Te notificaremos cuando esté listo para recoger. El proceso suele tomar de 1 a 2 horas en días hábiles.', category: 'orders' },
  { question: '¿Puedo modificar mi pedido después de realizarlo?', answer: 'Puedes modificar tu pedido siempre que no haya sido procesado aún. Contáctanos lo antes posible para realizar cambios.', category: 'orders' },
  { question: '¿Cuáles son los horarios de recogida?', answer: 'Nuestro horario de recogida en tienda es de lunes a sábado de 8:00 AM a 6:00 PM y domingos de 9:00 AM a 2:00 PM.', category: 'shipping' },
  { question: '¿Hacen envíos a domicilio?', answer: 'Actualmente ofrecemos recogida en tienda. Estamos trabajando para habilitar envíos a domicilio próximamente. Si necesitas una entrega especial, contáctanos.', category: 'shipping' },
  { question: '¿Cuánto tiempo tengo para recoger mi pedido?', answer: 'Tienes hasta 3 días hábiles para recoger tu pedido después de recibir la notificación de que está listo.', category: 'shipping' },
  { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos pagos en efectivo, transferencia bancaria, Nequi, Daviplata y tarjetas débito/crédito. Para pedidos al por mayor, también aceptamos consignaciones.', category: 'payments' },
  { question: '¿Puedo comprar al por mayor?', answer: 'Claro, en Ventas Garzón atendemos clientes mayoristas y minoristas con precios especiales. Contáctanos para conocer los descuentos por volumen.', category: 'payments' },
  { question: '¿Ofrecen factura electrónica?', answer: 'Sí, generamos factura electrónica para todos los pedidos. Asegúrate de ingresar tu NIT o cédula al momento del pago.', category: 'payments' },
  { question: '¿Cuál es la política de devoluciones?', answer: 'Aceptamos devoluciones dentro de los primeros 8 días. El producto debe estar en su empaque original y en perfecto estado. Aplica para productos perecederos según la ley colombiana.', category: 'returns' },
  { question: '¿Cómo contacto al soporte?', answer: 'Puedes escribirnos a info@ventasgarzon.com, llamarnos al número en el pie de página, o visitarnos directamente en tienda. Estaremos encantados de ayudarte.', category: 'returns' },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [openId, setOpenId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = !search || faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || faq.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-surface-dim dark:bg-surface-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-primary-500 rounded-2xl p-3 shadow-sm"><MessageCircle size={24} className="text-white" /></div>
          <div>
            <span className="text-[0.7rem] uppercase tracking-[0.08em] font-bold text-primary-500 dark:text-primary-400">Preguntas Frecuentes</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink dark:text-surface-100">¿Tienes dudas?</h1>
          </div>
        </div>
        <p className="text-ink-muted text-sm mb-8 ml-[60px]">Encuentra respuestas rápidas a las preguntas más comunes.</p>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input ref={inputRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar... (Ctrl+K)"
            className="w-full h-12 pl-10 pr-4 bg-surface dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-ink dark:text-surface-100 placeholder:text-ink-muted outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink">Limpiar</button>}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} aria-pressed={category === cat.id}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-surface dark:bg-surface-800 text-ink-muted hover:text-ink dark:hover:text-surface-200 border border-surface-200 dark:border-surface-700'
              }`}
            >
              {CATEGORY_ICONS[cat.id]} {cat.label}
            </button>
          ))}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-200 dark:bg-surface-800 mb-4">
              <HelpCircle size={28} className="text-ink-muted" />
            </div>
            <p className="text-ink text-lg font-semibold mb-1">No encontramos resultados</p>
            <p className="text-ink-muted text-sm">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <motion.div key={faq.question} custom={i} variants={itemVariants} initial="hidden" animate="visible"
                className="bg-surface dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
              >
                <button onClick={() => toggle(i)} aria-expanded={openId === i}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-2"><HelpCircle size={16} className="text-primary-500" /></div>
                    <span className="font-medium text-sm text-ink dark:text-surface-100">{faq.question}</span>
                  </div>
                  <motion.div animate={{ rotate: openId === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-ink-muted" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openId === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 pt-0 text-sm text-ink-muted leading-relaxed border-t border-surface-200 dark:border-surface-700">
                        <span className="block pt-4">{faq.answer}</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-primary-500 rounded-2xl p-6 text-center">
          <p className="text-white text-lg font-display font-semibold mb-1">¿No encuentras tu respuesta?</p>
          <p className="text-primary-100 text-sm mb-4">Estamos aquí para ayudarte personalmente</p>
          <a href="mailto:info@ventasgarzon.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl text-sm hover:bg-primary-50 transition-colors"
          >
            <MessageCircle size={16} /> Contactar Soporte
          </a>
        </div>
      </div>
    </div>
  );
}
