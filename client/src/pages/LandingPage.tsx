import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SlideUp, fadeInVariants, containerVariants, itemVariants } from '../utils/animations';
import { productService } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components';
import { Store, Shield, BadgeCheck, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAllProducts(1);
        setFeaturedProducts((data.data || data).slice(0, 6));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-surface-900 dark:via-surface-950 dark:to-surface-900 pt-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 dark:bg-primary-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <SlideUp>
            <div className="space-y-4 md:space-y-6">
              <motion.p
                className="inline-flex items-center gap-2 rounded-full bg-primary-100 dark:bg-primary-900/40 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200 dark:border-primary-800"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
              >
                <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                Tu mercado local de confianza
              </motion.p>
              <motion.h1
                className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-dark dark:text-white leading-tight"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
              >
                Bienvenido a <span className="text-primary-500 dark:text-primary-400">Ventas Garzón</span>
              </motion.h1>
              <motion.p
                className="text-base md:text-xl text-surface-600 dark:text-surface-300"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                Aseo, alimentos y productos esenciales con estilo fresco e inspirador. Compra con seguridad y
                recibe tu pedido rápido.
              </motion.p>
              <motion.div
                className="flex flex-col gap-4 sm:flex-row"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/products"
                  className="group bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:shadow-glow transition-all duration-300 font-bold text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Compra Ahora
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400 px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 font-bold text-base md:text-lg"
                >
                  Conoce Más
                </Link>
              </motion.div>
            </div>
          </SlideUp>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-full max-w-xs mx-auto md:max-w-none aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 border-primary-200 dark:border-primary-800 bg-white dark:bg-surface-800 shadow-2xl dark:shadow-primary-500/10">
              <img
                src="/logo2.jpg"
                alt="Logo Ventas Garzón"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-surface-50 dark:bg-surface-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-center text-dark dark:text-white mb-2 md:mb-4">¿Por qué elegirnos?</h2>
            <p className="text-center text-surface-500 dark:text-surface-400 mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
              Ofrecemos la mejor experiencia de compra con productos de calidad y servicio excepcional
            </p>
          </SlideUp>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
          >
            {[
              {
                icon: Store,
                title: 'Recoge en Tienda',
                description: 'Reserva online y recoge cuando quieras',
                color: 'from-primary-500 to-primary-600',
              },
              {
                icon: Shield,
                title: 'Pago Seguro',
                description: 'Múltiples formas de pago seguras',
                color: 'from-secondary-500 to-secondary-600',
              },
              {
                icon: BadgeCheck,
                title: 'Calidad Garantizada',
                description: 'Productos de marca y garantía',
                color: 'from-emerald-500 to-emerald-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-surface-800 p-5 md:p-8 rounded-2xl shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 border border-surface-100 dark:border-surface-700"
              >
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 md:mb-6 shadow-lg`}>
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="text-base md:text-xl font-display font-bold text-dark dark:text-white mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-surface-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-center text-dark dark:text-white mb-8 md:mb-12">Ofertas Especiales</h2>
          </SlideUp>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-5 md:p-8 rounded-2xl overflow-hidden relative shadow-xl"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
              <h3 className="text-xl md:text-3xl font-display font-bold mb-1 md:mb-2 relative z-10">Descuento en Aseo</h3>
              <p className="mb-4 md:mb-6 text-primary-100 relative z-10 text-sm md:text-base">Hasta 40% en productos de limpieza</p>
              <Link to="/products?category=aseo" className="inline-flex items-center gap-2 bg-white text-primary-600 px-5 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base hover:shadow-lg transition-all duration-300 relative z-10">
                Ver Oferta
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white p-5 md:p-8 rounded-2xl overflow-hidden relative shadow-xl"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
              <h3 className="text-xl md:text-3xl font-display font-bold mb-1 md:mb-2 relative z-10">Pack Alimentos</h3>
              <p className="mb-4 md:mb-6 text-secondary-100 relative z-10 text-sm md:text-base">Combos especiales para reservar</p>
              <Link to="/products?category=alimentos" className="inline-flex items-center gap-2 bg-white text-secondary-600 px-5 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base hover:shadow-lg transition-all duration-300 relative z-10">
                Ver Oferta
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-20 bg-surface-50 dark:bg-surface-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-center text-dark dark:text-white mb-2 md:mb-4">Productos Destacados</h2>
            <p className="text-center text-surface-500 dark:text-surface-400 mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
              Descubre nuestra selección de productos más populares
            </p>
          </SlideUp>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-60 md:h-80 rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:shadow-glow transition-all duration-300 font-bold text-base md:text-lg group"
            >
              Ver Todos los Productos
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <SlideUp>
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-2 md:mb-4">¿Listo para Comprar?</h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 text-primary-100">Únete a miles de clientes satisfechos</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:shadow-xl transition-all duration-300 text-base md:text-lg group"
            >
              Compra Ahora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </SlideUp>
        </div>
      </section>
    </div>
  );
};
