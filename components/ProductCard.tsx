'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'prime' | 'featured' | 'default';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  if (variant === 'prime') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative bg-white dark:bg-surface-800 rounded-2xl overflow-hidden border border-surface-100 dark:border-surface-700 shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300"
      >
        <div className="aspect-[4/5] overflow-hidden bg-surface-50 dark:bg-surface-700">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-surface-300 dark:text-surface-500" />
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-wider bg-white/90 dark:bg-surface-900/90 text-primary-600 dark:text-primary-400 backdrop-blur-sm shadow-sm">
            {product.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display font-bold text-sm text-dark dark:text-white truncate">{product.name}</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-1 mt-0.5">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</span>
            {product.stock > 0 ? (
              <button
                onClick={() => addItem(product, 1)}
                className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all"
                aria-label="Añadir al carrito"
              >
                <ShoppingCart size={16} />
              </button>
            ) : (
              <span className="text-[0.6rem] font-semibold text-red-500 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-lg">Agotado</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-surface-800 rounded-2xl overflow-hidden border border-surface-100 dark:border-surface-700 shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300"
    >
      <div className="aspect-[4/5] overflow-hidden bg-surface-50 dark:bg-surface-700">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-surface-300 dark:text-surface-500" />
          </div>
        )}
      </div>
      <div className="absolute top-3 left-3">
        <span className="inline-block px-2.5 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-wider bg-white/90 dark:bg-surface-900/90 text-primary-600 dark:text-primary-400 backdrop-blur-sm shadow-sm">
          {product.category}
        </span>
      </div>
      {product.stock > 0 && product.stock <= 5 && (
        <div className="absolute top-3 right-3">
          <span className="inline-block px-2 py-0.5 rounded-full text-[0.55rem] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
            Últimas
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-display font-bold text-sm text-dark dark:text-white truncate">{product.name}</h3>
        <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-1 mt-0.5">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</span>
          <span className={`text-[0.6rem] font-semibold ${product.stock > 5 ? 'text-surface-400' : 'text-red-500'}`}>
            Stock: {product.stock}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700/50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-l-lg transition-colors text-xs font-bold"
            >
              -
            </button>
            <span className="px-2 py-1 font-bold text-dark dark:text-white text-xs min-w-[1.5rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-2 py-1 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-r-lg transition-colors text-xs font-bold"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 disabled:bg-surface-300 dark:disabled:bg-surface-700 disabled:cursor-not-allowed transition-all active:scale-[0.97]"
          >
            <ShoppingCart size={12} />
            Agregar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
