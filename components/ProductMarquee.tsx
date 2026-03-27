import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../App';
import { Link } from 'react-router-dom';

const ProductMarquee: React.FC = () => {
  const { products } = useSettings();

  // Triple products to ensure a seamless loop
  const displayProducts = [...products, ...products, ...products, ...products];

  if (products.length === 0) return null;

  return (
    <div className="py-4 bg-copper-wash/30 overflow-hidden border-y border-slate-200/10">
      <div className="relative flex">
        <motion.div
          className="flex gap-3 items-center"
          animate={{
            x: [0, '-50%'],
          }}
          transition={{
            duration: 60,
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
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/30 shadow-sm bg-white/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:border-primary/20">
                <img
                  src={product.media?.[0]?.url || 'https://picsum.photos/seed/product/200/200'}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-xl">
                <span className="text-[7px] font-black text-white uppercase tracking-tighter">View</span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductMarquee;
