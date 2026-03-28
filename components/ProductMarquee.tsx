import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../App';
import { Link } from 'react-router-dom';

const ProductMarquee: React.FC = () => {
  const { products } = useSettings();

  // Multiply products to ensure a seamless loop even on wide screens
  const displayProducts = [...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products];

  if (products.length === 0) return null;

  return (
    <div className="py-3 bg-copper-wash/30 overflow-hidden border-y border-slate-200/10">
      <div className="relative flex">
        <motion.div
          className="flex gap-2 items-center"
          animate={{
            x: [0, '-50%'],
          }}
          transition={{
            duration: 120, // Slower for a more elegant feel
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: 'max-content' }}
        >
          {displayProducts.map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              to={`/product/${product.id}`}
              className="group relative flex-shrink-0"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-white/30 shadow-sm bg-white/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:border-primary/30 group-hover:z-10 relative">
                <img
                  src={product.media?.[0]?.url || 'https://picsum.photos/seed/product/200/200'}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductMarquee;
