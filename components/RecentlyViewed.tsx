import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';

interface RecentlyViewedProps {
  products: Product[];
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ products }) => {
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setViewedIds(JSON.parse(stored));
    }
  }, []);

  const viewedProducts = products.filter((p) => viewedIds.includes(p.id)).slice(0, 4);

  if (viewedProducts.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tighter">
            Recently <span className="italic font-light text-primary">Viewed</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {viewedProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100">
                  <img
                    src={product.media[0]?.url || 'https://picsum.photos/seed/product/400/400'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                
                <div className="space-y-1 text-center">
                  <h3 className="text-sm md:text-base font-serif text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm font-light text-slate-500">
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

export default RecentlyViewed;
