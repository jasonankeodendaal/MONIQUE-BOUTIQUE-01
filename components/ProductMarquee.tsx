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
    <div className="py-12 bg-white/20 backdrop-blur-md overflow-hidden border-y border-slate-200/20 relative">
      <div className="absolute top-0 left-0 h-full w-40 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-40 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-6">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 whitespace-nowrap">Curated Selection</span>
        <div className="h-px w-full bg-slate-200/60"></div>
        <span className="text-[10px] font-medium text-slate-400 italic whitespace-nowrap">New Arrivals</span>
      </div>

      <div className="relative flex">
        <motion.div
          className="flex gap-4 items-center"
          animate={{
            x: [0, '-50%'],
          }}
          transition={{
            duration: 180, // Even slower for a more premium, effortless feel
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
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-white/50 shadow-sm bg-white/40 backdrop-blur-sm transition-all duration-700 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-primary/40 group-hover:z-10 relative">
                <img
                  src={product.media?.[0]?.url || 'https://picsum.photos/seed/product/200/200'}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductMarquee;
