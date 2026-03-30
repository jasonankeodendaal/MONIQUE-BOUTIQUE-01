import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '../App';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const { settings } = useSettings();
  // Curate top 4 products (e.g., newest arrivals)
  const featured = [...products]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 md:gap-24">
          
          {/* Header Column */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-32 h-fit">
            <div className="inline-flex items-center gap-3 mb-6 md:mb-10">
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                {settings.homeFeaturedSubtitle || 'The Selection'}
              </span>
              <div className="h-px w-12 bg-primary/30"></div>
            </div>
            
            <h2 className="text-3xl md:text-6xl font-serif text-slate-900 tracking-tighter leading-[0.9] mb-8 md:mb-12">
              Curated <br/>
              <span className="italic font-light text-primary">Selections</span>
            </h2>
            
            <p className="text-sm md:text-xl text-slate-600 font-light leading-relaxed italic mb-10 md:mb-16 border-l-2 border-primary/20 pl-6 md:pl-10">
              "Discover our most sought-after pieces, meticulously crafted for the modern connoisseur."
            </p>

            <Link 
              to="/products" 
              className="group inline-flex items-center gap-6"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-500 shadow-lg">
                <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900 group-hover:text-primary transition-colors">
                {settings.homeFeaturedCta || 'View All'}
              </span>
            </Link>
          </div>

          {/* Products Column */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-2 gap-6 md:gap-10">
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
                    <div className="relative aspect-[3/4] mb-6 md:mb-10 overflow-hidden bg-slate-50 rounded-[2rem] md:rounded-[3rem] shadow-sm group-hover:shadow-2xl transition-all duration-700">
                      <img 
                        src={product.media?.[0]?.url || 'https://picsum.photos/seed/product/600/800'} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-700" />
                      
                      <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                        <div className="w-full py-4 bg-white/90 backdrop-blur-xl text-slate-900 text-center text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl">
                          Discover
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:space-y-3 px-2">
                      <h3 className="text-lg md:text-2xl font-serif text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary">
                          {settings.currencySymbol || 'R'}{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <div className="h-px flex-grow bg-slate-100"></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
