import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

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

  const viewedProducts = products.filter((p) => viewedIds.includes(p.id));

  if (viewedProducts.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-12 text-center">
          Recently <span className="italic font-light text-primary">Viewed</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {viewedProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="aspect-square overflow-hidden rounded-2xl bg-white mb-4">
                <img
                  src={product.media[0]?.url || 'https://picsum.photos/seed/product/400/400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-medium text-slate-900">{product.name}</h3>
              <p className="text-slate-500">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
