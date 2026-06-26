'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, ChevronDown, Tag } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

const CATEGORIES = [
  { id: '', name: 'Todos' },
  { id: 'aseo', name: 'Aseo' },
  { id: 'alimentos', name: 'Alimentos' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'limpieza', name: 'Limpieza' },
];

const PAGE_SIZE = 12;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/products?page=1');
        const data = await res.json();
        setAllProducts(data.data || []);
      } catch (err: any) {
        setError(err?.message || 'Error al cargar productos. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (category) filtered = filtered.filter(p => p.category === category);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [allProducts, category, debouncedSearch]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetch('/api/products?page=1')
      .then(res => res.json())
      .then(data => setAllProducts(data.data || []))
      .catch((err: any) => setError(err?.message || 'Error al cargar productos.'))
      .finally(() => setLoading(false));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <div className="pt-20 pb-2 md:pb-3 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 rounded-xl p-2.5">
              <Tag size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-medium text-2xl md:text-3xl text-ink dark:text-surface-100 tracking-tight">Productos</h1>
              <p className="text-xs text-ink-muted">Catálogo completo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-surface-dim dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
          <div className="relative flex-1 max-w-[160px] md:max-w-[200px] min-w-[100px] md:min-w-[120px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input type="text" placeholder="Buscar…" aria-label="Buscar productos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white dark:bg-surface-800 border border-transparent rounded-lg text-xs text-ink dark:text-surface-100 placeholder-ink-muted outline-none focus:border-primary/30 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                aria-pressed={category === cat.id}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'text-ink-muted hover:bg-primary/10 hover:text-primary-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton rounded-2xl mb-4" style={{ aspectRatio: '4/5' }} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-error/10 mb-4">
                <RotateCcw size={24} className="text-error" />
              </div>
              <p className="text-ink-muted text-sm mb-4">{error}</p>
              <button onClick={handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary-500 text-white rounded-full text-xs font-medium hover:bg-primary-600 active:scale-[0.97] transition-all"
              >
                <RotateCcw size={14} /> Intentar de nuevo
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
                <Search size={24} className="text-ink-muted" />
              </div>
              <p className="text-ink font-medium text-sm mb-1">Sin resultados</p>
              <p className="text-ink-muted text-xs mb-5">
                {debouncedSearch ? `No encontramos "${debouncedSearch}"` : 'Intentá con otra categoría'}
              </p>
              <button onClick={() => { setSearch(''); setCategory(''); }}
                className="px-5 py-2 border border-surface-200 dark:border-surface-700 text-ink dark:text-surface-100 rounded-full text-xs font-medium hover:bg-surface-100 dark:hover:bg-surface-800 active:scale-[0.97] transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants} initial="hidden" animate="visible" layout
                      className="break-inside-avoid mb-4"
                    >
                      <ProductCard product={product} variant="prime" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-ink dark:text-surface-100 rounded-full text-xs font-medium hover:border-primary/30 hover:text-primary-500 active:scale-[0.97] transition-all"
                  >
                    <ChevronDown size={16} /> Ver más ({filteredProducts.length - visibleCount} restantes)
                  </button>
                </div>
              )}
              <div className="text-center mt-3 text-xs text-ink-muted">
                {Math.min(visibleCount, filteredProducts.length)} de {filteredProducts.length} productos
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
