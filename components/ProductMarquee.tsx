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
    <div className="py-20 md:py-32 bg-white overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mb-48"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          
          {/* Static Info Column */}
          <div className="w-full lg:w-1/3 text-left relative z-30 bg-white/50 backdrop-blur-sm p-6 md:p-0 rounded-3xl lg:bg-transparent lg:backdrop-blur-none lg:-mr-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-primary/80">Curated Selection</span>
              <div className="h-[1px] w-12 bg-primary/20"></div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tighter leading-tight mb-8">
              Handpicked <br/>
              <span className="italic font-light text-primary">Excellence</span>
            </h2>
            
            <p className="text-slate-700 font-light leading-relaxed mb-10 text-sm md:text-base">
              Explore our meticulously chosen collection of premium products, each selected for its exceptional quality and timeless design.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary">
                <span className="text-xs font-serif italic">01</span>
              </div>
              <div className="h-px w-8 bg-slate-200"></div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Scroll to explore</span>
            </div>
          </div>

          {/* Marquee Column */}
          <div className="w-full lg:w-2/3 relative lg:-ml-24">
            {/* Soft Fade Mask */}
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/90 to-transparent z-20 pointer-events-none hidden lg:block"></div>
            
            <div className="relative flex [perspective:1500px] overflow-visible"
                 style={{ 
                   maskImage: 'linear-gradient(to right, transparent, black 25%)',
                   WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%)' 
                 }}>
              <motion.div
                className="flex gap-8 md:gap-12 items-center py-10"
                animate={{
                  x: [0, '-50%'],
                }}
                transition={{
                  duration: 80,
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
                    <div className="w-[200px] h-[280px] md:w-[280px] md:h-[400px] rounded-[3rem] overflow-hidden bg-white shadow-xl transition-all duration-700 group-hover:shadow-2xl group-hover:scale-105 [transform:rotateY(10deg)_rotateX(5deg)] group-hover:rotate-0 relative border border-white/50">
                      <img
                        src={product.media?.[0]?.url || 'https://picsum.photos/seed/product/400/500'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      {/* Soft Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMarquee;
