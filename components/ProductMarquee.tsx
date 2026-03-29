import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../App';
import { Link } from 'react-router-dom';

const ProductMarquee: React.FC = () => {
  const { products, settings } = useSettings();

  // Multiply products to ensure a seamless loop even on wide screens
  const displayProducts = [...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products];

  if (products.length === 0) return null;

  return (
    <div className="py-24 bg-white overflow-hidden border-y border-slate-100 relative">
      <div className="absolute top-0 left-0 h-full w-32 md:w-64 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-32 md:w-64 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-center gap-6">
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 whitespace-nowrap">Curated Selection</span>
        <div className="h-px w-full bg-slate-100"></div>
        <span className="text-[10px] font-medium text-slate-400 italic whitespace-nowrap">New Arrivals</span>
      </div>

      <div className="relative flex">
        <motion.div
          className="flex gap-4 md:gap-6 items-center"
          animate={{
            x: [0, '-50%'],
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: 'max-content' }}
        >
          {displayProducts.map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              to={`/product/${product.id}`}
              className="group relative flex-shrink-0 block"
            >
              <div className="w-[200px] h-[280px] md:w-[280px] md:h-[400px] rounded-2xl overflow-hidden border border-slate-100/50 shadow-sm bg-slate-50 transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1 relative">
                <img
                  src={product.media?.[0]?.url || 'https://picsum.photos/seed/product/400/500'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Always visible gradient at bottom for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-medium text-lg md:text-xl mb-1 drop-shadow-sm line-clamp-1">{product.name}</h3>
                    <p className="text-white/90 font-mono text-xs md:text-sm drop-shadow-sm">{settings.currencySymbol || '$'}{product.price?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductMarquee;
