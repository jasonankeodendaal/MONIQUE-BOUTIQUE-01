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
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 md:gap-24">
          
          {/* Header Column (Side on Desktop) */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-32 h-fit">
            <div className="inline-flex items-center gap-3 mb-6 md:mb-10">
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                {settings.homeNicheHeader || 'The Collections'}
              </span>
              <div className="h-px w-12 bg-primary/30"></div>
            </div>
            
            <h2 className="text-3xl md:text-6xl font-serif text-slate-900 tracking-tighter leading-[0.9] mb-8 md:mb-12">
              {settings.homeCategoryShopByLabel || 'Shop by'} <br/>
              <span className="italic font-light text-primary">{settings.productsDeptLabel}</span>
            </h2>
            
            <div className="max-w-sm">
              <p className="text-sm md:text-xl text-slate-600 font-light leading-relaxed italic border-l-2 border-primary/20 pl-6 md:pl-10">
                "{settings.homeNicheDescription}"
              </p>
            </div>
          </div>

          {/* Grid Column */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {displayItems.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group relative h-[400px] md:h-[550px] w-full overflow-hidden rounded-[2rem] md:rounded-[3.5rem] transition-all duration-1000 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-slate-100"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800'})` }}
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                  
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start text-left z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl">
                      <IconRenderer icon={cat.icon} className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
                    </div>
                    
                    <span className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-3 md:mb-4">
                      {settings.homeCategoryPortfolioLabel || 'Portfolio'} 0{idx + 1}
                    </span>
                    
                    <h3 className="text-2xl md:text-4xl font-serif text-white mb-4 md:mb-6 tracking-tight leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-75">
                      {cat.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] group-hover:gap-6 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                      {settings.homeCategoryDiscoverLabel || 'Discover'}
                      <div className="h-px w-8 md:w-16 bg-primary"></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;