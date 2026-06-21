import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils';
import { useCartStore } from '../store';
import { useReducedMotion } from '../utils/animations';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  variant?: 'bazar' | 'prime';
  onAddToCart?: (product: Product, quantity: number) => void;
}

const FALLBACK_IMG = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22200%22 height=%22200%22/%3E%3Cpath d=%22M80 85h40v30H80z%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E';

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false, variant = 'bazar', onAddToCart }) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = React.useState(1);
  const reduce = useReducedMotion();

  const handleAddToCart = (qty = quantity) => {
    if (onAddToCart) {
      onAddToCart(product, qty);
    } else {
      addItem(product, qty);
    }
    setQuantity(1);
  };

  const outOfStock = product.stock === 0;

  if (variant === 'prime') {
    return (
      <article className="bg-surface dark:bg-[#0f1522] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_24px_48px_-12px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_24px_48px_-12px_rgba(52,211,153,0.12)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-100 dark:bg-[#0d111c] group">
          <img
            src={product.image || FALLBACK_IMG}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-error text-white text-[0.55rem] font-bold px-2 py-0.5 rounded-full z-10">
              Últimas
            </div>
          )}

          <button
            onClick={() => handleAddToCart(1)}
            disabled={outOfStock}
            aria-label={outOfStock ? 'Producto agotado' : `Añadir ${product.name} al carrito`}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-medium shadow-sm hover:bg-primary-500 hover:text-white disabled:bg-surface-300 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
          >
            <ShoppingCart size={14} />
            {outOfStock ? 'Agotado' : 'Añadir'}
          </button>
        </div>
        <div className="p-3.5">
          {product.category && (
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.08em] text-primary-500 dark:text-primary-400">
              {product.category === 'aseo' ? 'Aseo' : product.category === 'alimentos' ? 'Alimentos' : product.category === 'bebidas' ? 'Bebidas' : product.category === 'limpieza' ? 'Limpieza' : product.category}
            </span>
          )}
          <h3 className="font-display font-medium text-sm text-ink dark:text-surface-100 tracking-tight mt-0.5 leading-snug">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[0.7rem] text-ink-muted mt-0.5 line-clamp-1">{product.description}</p>
          )}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm font-medium text-ink dark:text-surface-100">{formatPrice(product.price)}</span>
            <span className="text-[0.65rem] text-ink-muted">
              {outOfStock ? 'Agotado' : `${product.stock} disp.`}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (featured) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-surface dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-shadow duration-300 group h-full">
        <div className="absolute inset-0">
          <img
            src={product.image || FALLBACK_IMG}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
          {product.category && (
            <span className="self-start px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-full bg-secondary-500 text-ink mb-3">
              {{ aseo: 'Aseo', limpieza: 'Limpieza', alimentos: 'Alimentos', bebidas: 'Bebidas' }[product.category] || product.category}
            </span>
          )}
          <h3 className="font-display font-bold text-xl md:text-2xl mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2 mb-2 max-w-lg">
            {product.description}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-display font-bold">{formatPrice(product.price)}</span>
            <span className="text-sm text-white/60">{product.stock} disponibles</span>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-ink rounded-full font-semibold text-sm hover:bg-white/90 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              {outOfStock ? 'Agotado' : 'Agregar'}
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-ink/10">
                <ArrowRight size={12} />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={reduce ? {} : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="flex flex-col bg-surface dark:bg-surface-800 rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-all duration-300 h-full group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-surface-100 dark:bg-surface-700">
        <img
          src={product.image || FALLBACK_IMG}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-error-500 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full">
            Últimas {product.stock}!
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 right-3 bg-secondary-500 text-ink text-[0.65rem] font-bold px-2.5 py-1 rounded-full">
            {{ aseo: 'Aseo', limpieza: 'Limpieza', alimentos: 'Alimentos', bebidas: 'Bebidas' }[product.category] || product.category}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-base text-ink dark:text-surface-100 mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-ink-muted text-xs mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mb-3">
          <p className="text-xl font-display font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(product.price)}
          </p>
          <p className="text-[0.7rem] text-ink-muted mt-0.5">
            {outOfStock ? 'Agotado' : `${product.stock} disponibles`}
          </p>
        </div>

        {/* Quantity + CTA */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-surface-200 dark:border-surface-700">
          <div className="flex items-center border border-surface-200 dark:border-surface-600 rounded-lg overflow-hidden">
            <button
              aria-label="Reducir cantidad"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 text-ink-muted hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors disabled:opacity-40"
              disabled={outOfStock}
            >
              <Minus size={12} />
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(product.stock, Math.max(1, val)));
              }}
              className="w-8 text-center border-0 outline-none bg-transparent text-sm font-semibold text-ink dark:text-surface-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={outOfStock}
              aria-label="Cantidad"
            />
            <button
              aria-label="Aumentar cantidad"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-1.5 text-ink-muted hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors disabled:opacity-40"
              disabled={outOfStock}
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            aria-label={outOfStock ? 'Producto agotado' : 'Agregar al carrito'}
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 dark:disabled:bg-surface-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all active:scale-[0.97]"
          >
            <ShoppingCart size={14} />
            <span>{outOfStock ? 'Agotado' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
