import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from './CustomIcons';
import { Category } from '../types';

interface CategoryGridProps {
  items?: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ items }) => {
  const navigate = useNavigate();
  const { categories: allCategories } = useSettings();
  
  const displayItems = items || allCategories;

  const handleCategoryClick = (id: string) => {
    navigate(`/products?category=${id}`);
  };

  return (
    <section className="py-16 md:py-48 bg-[#F4F1EC] relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-32 gap-6 md:gap-12">
          <div className="max-w-3xl text-center md:text-left">
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.8em] text-primary mb-4 md:mb-8 block text-contrast-shadow">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-slate-900 leading-none tracking-tighter text-balance drop-shadow-sm" style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)' }}>
              Shop by <br className="hidden md:block"/> <span className="italic font-light text-primary text-contrast-shadow">Department</span>
            </h2>
          </div>
          <div className="hidden md:block p-8 border-l border-slate-300/50 max-w-xs">
            <p className="text-slate-500 font-light leading-relaxed text-sm md:text-lg italic">
              "Curation is the art of seeing what others miss."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          {displayItems.map((cat, idx) => {
            const IconComponent = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LucideIcons.Package;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative h-[300px] md:h-[700px] w-full overflow-hidden rounded-[2rem] md:rounded-[4rem] transition-all duration-700 hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 hover:border-primary/40 hover:-translate-y-6"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800'})` }}
                />
                
                {/* Layered Overlays for better depth */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90" />
                <div className="absolute inset-0 border-[1px] border-white/10 rounded-[inherit] pointer-events-none group-hover:border-primary/20 transition-all duration-700"></div>
                
                <div className="absolute inset-0 p-6 md:p-14 flex flex-col justify-end items-start text-left z-10">
                  <div className="w-10 h-10 md:w-20 md:h-20 glass-card rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white mb-4 md:mb-12 border border-white/30 transform -translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl">
                    <IconComponent size={18} className="md:w-10 md:h-10 text-primary" strokeWidth={1} />
                  </div>
                  
                  <span className="text-[8px] md:text-[12px] font-black text-white/50 uppercase tracking-[0.5em] mb-2 md:mb-5">
                    Portfolio {idx + 1}
                  </span>
                  
                  <h3 className="text-xl md:text-5xl font-serif text-white mb-3 md:mb-8 leading-tight group-hover:text-primary transition-colors duration-500">
                    {cat.name}
                  </h3>
                  
                  <p className="hidden md:block text-sm md:text-lg text-white/60 leading-relaxed font-light mb-8 md:mb-14 max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-1000 ease-in-out opacity-0 group-hover:opacity-100 pr-4">
                    {cat.description}
                  </p>
                  
                  <div className="flex items-center gap-3 md:gap-6 text-white text-[9px] md:text-[13px] font-black uppercase tracking-[0.4em] group-hover:gap-8 transition-all duration-700">
                    Discover Collection
                    <div className="h-px w-6 md:w-16 bg-primary shadow-[0_0_15px_rgba(212,175,55,0.8)]"></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;