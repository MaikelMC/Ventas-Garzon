import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: '¿Cómo realizo un pedido?',
    answer: 'Busca el producto, agrégalo al carrito y completa tus datos en el formulario de pago.',
  },
  {
    question: '¿Realizan envíos a domicilio?',
    answer: 'Sí, ofrecemos envíos a Bogotá y zonas cercanas con tiempos de entrega rápidos.',
  },
  {
    question: '¿Puedo comprar al por mayor?',
    answer: 'Claro, en Ventas Garzón atendemos clientes mayoristas y minoristas con precios especiales.',
  },
  {
    question: '¿Cómo contacto al soporte?',
    answer: 'Puedes escribirnos al email info@ventasgarzon.com o llamar al número disponible en el pie de página.',
  },
];

export const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white/90 dark:bg-surface-800/90 p-10 shadow-xl dark:shadow-black/30"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3 shadow-lg">
              <MessageCircle size={28} className="text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Preguntas Frecuentes</p>
              <h1 className="text-4xl font-display font-bold text-dark dark:text-white">¿Tienes dudas?</h1>
            </div>
          </div>
          <p className="text-surface-500 dark:text-surface-400 text-lg ml-[60px] mb-8">Estamos para ayudarte</p>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-surface-100 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 p-6 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900/30 rounded-xl p-2 mt-0.5">
                    <HelpCircle size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-semibold text-dark dark:text-white">{faq.question}</h2>
                    <p className="mt-2 text-surface-500 dark:text-surface-400">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
