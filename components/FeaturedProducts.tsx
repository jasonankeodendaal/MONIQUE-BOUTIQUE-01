import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  // Curate top 4 products (e.g., newest arrivals)
  const featured = [...products]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-12 text-center">
          Curated <span className="italic font-light text-primary">Arrivals</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 mb-4">
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

export default FeaturedProducts;
