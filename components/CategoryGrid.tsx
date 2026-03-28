import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useSettings } from '../App';
import { IconRenderer } from './IconRenderer';
import { Category } from '../types';

interface CategoryGridProps {
  items?: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ items }) => {
  const navigate = useNavigate();
  const { settings, categories: allCategories } = useSettings();
  
  const displayItems = items || allCategories;

  const handleCategoryClick = (id: string) => {
    navigate(`/products?category=${id}`);
  };

  return (
    <section className="py-24 md:py-48 bg-slate-50/50 relative overflow-hidden border-y border-slate-100">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-32">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 block mb-6">
              {settings.homeNicheHeader}
            </span>
            <h2 className="text-4xl md:text-7xl font-serif text-slate-900 tracking-tighter leading-none">
              {settings.homeCategoryShopByLabel || 'Shop by'} <span className="italic font-light text-primary">{settings.productsDeptLabel}</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-slate-500 text-lg font-light leading-relaxed italic border-l-2 border-primary/20 pl-8">
              "{settings.homeNicheDescription}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {displayItems.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-[450px] md:h-[650px] w-full overflow-hidden rounded-[2.5rem] md:rounded-[4rem] transition-all duration-1000 hover:shadow-2xl hover:-translate-y-4 bg-slate-200"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800'})` }}
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
              
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start text-left z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl">
                  <IconRenderer icon={cat.icon} size={24} className="md:w-8 md:h-8 text-white" strokeWidth={1.5} />
                </div>
                
                <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-4">
                  {settings.homeCategoryPortfolioLabel || 'Portfolio'} 0{idx + 1}
                </span>
                
                <h3 className="text-2xl md:text-4xl font-serif text-white mb-6 tracking-tight leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-75">
                  {cat.name}
                </h3>
                
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-light mb-8 max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-1000 ease-in-out opacity-0 group-hover:opacity-100 pr-4 line-clamp-3 transform translate-y-4 group-hover:translate-y-0">
                  {cat.description}
                </p>
                
                <div className="flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.4em] group-hover:gap-6 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                  {settings.homeCategoryDiscoverLabel || 'Discover Collection'}
                  <div className="h-px w-8 md:w-12 bg-primary"></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;