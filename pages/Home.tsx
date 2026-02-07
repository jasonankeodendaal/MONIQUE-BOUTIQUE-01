
import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutGrid, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const SectionDivider: React.FC = () => (
  <div className="max-w-xs mx-auto py-12 md:py-20 flex items-center justify-center gap-4 opacity-20">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
    <div className="rotate-45 w-2 h-2 border border-slate-400"></div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings, categories } = useSettings();

  const featuredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [categories]);

  return (
    <main className="pt-0 shrink-fit overflow-x-hidden">
      <style>{`
        .shrink-fit { width: 100%; max-width: 100vw; }
      `}</style>
      <Hero />
      
      <div className="bg-copper-wash relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <AboutSection />
      </div>

      <SectionDivider />

      {/* Category Portals Strip - Optimized for shrink to fit */}
      <section className="py-12 md:py-24 bg-copper-wash overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-3 text-contrast-shadow">{settings.homeNicheSubheader}</span>
            <h2 className="font-serif text-slate-900 tracking-tighter text-balance" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
              {settings.homeNicheHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{settings.homeNicheHeader?.split(' ').slice(-1)}</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {featuredCategories.map((cat) => {
              const Icon = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LayoutGrid;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className="flex flex-col items-center group relative w-full"
                >
                  <div className="relative w-full aspect-square max-w-[180px] rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-all duration-700 border border-slate-100 group-hover:border-primary/40 group-hover:-translate-y-2">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 transition-all duration-500 z-10 group-hover:opacity-0 group-hover:scale-50">
                      <Icon className="w-1/2 h-1/2" strokeWidth={1} />
                    </div>
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 scale-125 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  <div className="mt-4 md:mt-6 space-y-1 text-center w-full">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-primary transition-colors block truncate">{cat.name}</span>
                    <div className="h-[1px] w-0 bg-primary mx-auto transition-all duration-500 group-hover:w-8"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <CategoryGrid items={featuredCategories} />

      {/* Trust Section */}
      <section className="py-20 md:py-40 bg-copper-wash relative overflow-hidden border-t border-slate-100/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
           <div className="text-center mb-12 md:mb-24">
              <span className="text-[9px] font-black uppercase tracking-[0.8em] text-primary block mb-4">{settings.homeTrustSubheader}</span>
              <h2 className="font-serif text-slate-900 tracking-tight leading-none" style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)' }}>
                 {settings.homeTrustHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{settings.homeTrustHeader?.split(' ').slice(-1)}</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
              {[
                { iconName: settings.homeTrustItem1Icon, title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon, title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon, title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                const IconComponent = CustomIcons[item.iconName] || (LucideIcons as any)[item.iconName] || ShieldCheck;
                return (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="mb-6 w-16 h-16 md:w-20 md:h-20 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 text-primary flex items-center justify-center group-hover:rotate-3 transition-transform">
                      <IconComponent size={32} strokeWidth={1} />
                    </div>
                    <h4 className="text-lg font-bold mb-3 tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed text-sm md:text-base max-w-xs mx-auto">{item.desc}</p>
                  </div>
                );
              })}
           </div>
           
           <div className="mt-16 md:mt-32">
              <button onClick={() => navigate('/about')} className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-xl group">
                Read Full Story
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
