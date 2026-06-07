import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutGrid } from 'lucide-react';
import { SlideUp, containerVariants, itemVariants } from '../utils/animations';
import { productService } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts(1);
        setProducts(data.data || data);
        setFilteredProducts(data.data || data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const categories = [
    { id: 'aseo', name: 'Aseo' },
    { id: 'alimentos', name: 'Alimentos' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-300/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <section className="bg-light dark:bg-surface-950 pt-20 pb-4 border-b border-surface-100 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3 shadow-lg">
              <LayoutGrid size={28} className="text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 font-display font-bold">Catálogo</p>
              <h1 className="text-4xl font-display font-bold text-dark dark:text-white">Productos</h1>
            </div>
          </div>
          <p className="text-surface-500 dark:text-surface-400 text-lg ml-[60px]">Explora nuestros mejores productos de aseo y alimentos</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <SlideUp>
              <div className="bg-white dark:bg-surface-800 p-6 rounded-3xl sticky top-24 shadow-lg dark:shadow-black/20 border border-surface-100 dark:border-surface-700">
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-dark dark:text-surface-200 mb-2">Buscar</label>
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500" />
                    <input
                      type="text"
                      placeholder="Busca un producto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-bold text-dark dark:text-surface-200 mb-4">Categorías</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                        selectedCategory === ''
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'bg-surface-50 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600'
                      }`}
                    >
                      Todos los Productos
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                          selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                            : 'bg-surface-50 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SlideUp>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton h-80 rounded-3xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/10 rounded-full blur-2xl" />
                  <div className="relative bg-gradient-to-br from-surface-100 to-surface-50 dark:from-surface-800 dark:to-surface-700 rounded-full p-8 shadow-xl">
                    <Search size={48} className="text-surface-300 dark:text-surface-500" strokeWidth={1} />
                  </div>
                </div>
                <p className="text-surface-500 dark:text-surface-400 text-lg">No se encontraron productos</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
