import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Headphones, ArrowRight, HelpCircle, ShoppingBag } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-surface-100 dark:border-surface-700 bg-white/90 dark:bg-surface-800/90 p-10 shadow-xl dark:shadow-black/30"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3 shadow-lg">
              <Store size={28} className="text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Acerca de</p>
              <h1 className="text-4xl font-display font-bold text-dark dark:text-white">Ventas Garzón</h1>
            </div>
          </div>
          <p className="text-surface-500 dark:text-surface-400 leading-relaxed text-lg ml-[60px]">
            Somos una tienda enfocada en calidad, precio justo y atención personalizada. Nuestro objetivo es
            facilitar la compra de productos de limpieza y alimentos tanto para consumidores como para negocios.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Mayorista y Minorista',
                description: 'Compras al por mayor y detalle con precios competitivos.',
                icon: Store,
                color: 'from-blue-500 to-blue-600',
              },
              {
                title: 'Recoge en Tienda',
                description: 'Reserva online y recoge cuando te convenga. Sin esperas.',
                icon: ShoppingBag,
                color: 'from-teal-500 to-teal-600',
              },
              {
                title: 'Atención local',
                description: 'Soporte cercano con una experiencia de compra segura.',
                icon: Headphones,
                color: 'from-primary-500 to-primary-600',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-surface-100 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 p-6 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300">
                <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-3 w-fit mb-4 shadow-lg`}>
                  <item.icon size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-display font-semibold text-dark dark:text-white mb-2">{item.title}</h2>
                <p className="text-surface-500 dark:text-surface-400">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center ml-[60px]">
            <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-glow hover:from-primary-600 hover:to-primary-700 transition-all duration-300">
              Ver productos
              <ArrowRight size={18} />
            </Link>
            <Link to="/faq" className="inline-flex items-center gap-2 border-2 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400 px-6 py-3 rounded-full font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300">
              <HelpCircle size={18} />
              Preguntas Frecuentes
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
