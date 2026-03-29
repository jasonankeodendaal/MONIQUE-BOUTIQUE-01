import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  // Curate top 4 products (e.g., newest arrivals)
  const featured = [...products]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex flex-row items-end justify-between mb-8 md:mb-16 gap-4 md:gap-6">
          <div className="max-w-xl">
            <h2 className="text-xl md:text-5xl font-serif text-slate-900 tracking-tighter mb-2 md:mb-4">
              Curated <span className="italic font-light text-primary">Selections</span>
            </h2>
            <p className="text-[10px] md:text-base text-slate-700 font-light leading-relaxed">
              Discover our most sought-after pieces, meticulously crafted for the modern connoisseur.
            </p>
          </div>
          <Link 
            to="/products" 
            className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-900 hover:text-primary transition-colors shrink-0"
          >
            <span>View All</span>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <ArrowRight className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
          {featured.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] mb-3 md:mb-6 overflow-hidden bg-slate-100 rounded-xl md:rounded-2xl">
                  <img 
                    src={product.media?.[0]?.url || 'https://picsum.photos/seed/product/600/800'} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  {/* Quick View Button Overlay */}
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 translate-y-2 md:translate-y-0 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-full py-1.5 md:py-3 bg-white/90 backdrop-blur-md text-slate-900 text-center text-[6px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl shadow-lg">
                      Discover
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1 md:space-y-2 text-center">
                  <h3 className="text-[10px] md:text-lg font-serif text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[9px] md:text-sm font-light text-slate-700">
                    R{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
