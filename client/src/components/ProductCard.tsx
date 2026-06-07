import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils';
import { useCartStore } from '../store';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      addItem(product, quantity);
    }
    setQuantity(1);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="flex flex-col bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-lg dark:shadow-black/20 hover:shadow-2xl transition-all duration-300 border border-surface-100 dark:border-surface-700 h-full"
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-surface-100 dark:bg-surface-700">
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          src={product.image || 'https://via.placeholder.com/300x200?text=' + product.name}
          alt={product.name}
          className="w-full h-full object-cover cursor-pointer"
        />
        {product.category && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md">
            {product.category === 'aseo' ? '🧹 Aseo' : '🍽️ Alimentos'}
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
            ¡Últimas {product.stock}!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-lg text-dark dark:text-white mb-2 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-surface-500 dark:text-surface-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating || 0)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-surface-300 dark:text-surface-600'
                }
              />
            ))}
            <span className="text-xs text-surface-400 dark:text-surface-500 ml-1">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-display font-bold text-primary-500 dark:text-primary-400">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </p>
        </div>

        {/* Quantity and Button */}
        <div className="flex items-center gap-3 mt-auto pt-4">
          <div className="flex items-center border border-surface-200 dark:border-surface-600 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors disabled:opacity-50"
              disabled={product.stock === 0}
            >
              <Minus size={14} />
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
              className="w-10 text-center border-0 outline-none bg-transparent text-sm font-semibold text-dark dark:text-white"
              disabled={product.stock === 0}
            />
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-2 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors disabled:opacity-50"
              disabled={product.stock === 0}
            >
              <Plus size={14} />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: product.stock > 0 ? 1.03 : 1 }}
            whileTap={{ scale: product.stock > 0 ? 0.97 : 1 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-surface-300 disabled:to-surface-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={16} />
            <span>{product.stock === 0 ? 'Agotado' : 'Agregar'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
