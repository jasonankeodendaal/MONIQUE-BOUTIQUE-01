
import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutGrid, Sparkles, ShieldCheck, Globe, Star, ArrowRight } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const SectionDivider: React.FC = () => (
  <div className="max-w-xs mx-auto py-12 md:py-20 flex items-center justify-center gap-4 opacity-30">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
    <div className="rotate-45 w-2 h-2 border border-slate-400"></div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings, categories } = useSettings();

  return (
    <main className="pt-0">
      <Hero />
      
      {/* Editorial Story Preview - Centered more for branding */}
      <div className="bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <AboutSection />
      </div>

      <SectionDivider />

      {/* Category Icons Strip */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-2">{settings.homeNicheSubheader || 'Curated Portals'}</span>
            <h2 className="text-2xl md:text-5xl font-serif text-slate-900 tracking-tighter">
              {settings.homeNicheHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{settings.homeNicheHeader?.split(' ').slice(-1)}</span>
            </h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-12">
            {categories.map((cat) => {
              const Icon = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LayoutGrid;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className="flex flex-col items-center group"
                >
                  <div className="w-16 h-16 md:w-28 md:h-28 bg-slate-50 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:-translate-y-3 transition-all duration-500 shadow-sm border border-transparent group-hover:border-primary/20">
                    <Icon size={24} className="md:w-10 md:h-10" strokeWidth={1.2} />
                  </div>
                  <span className="mt-4 md:mt-6 text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <CategoryGrid />

      {/* Trust & Methodology Section */}
      <section className="py-20 md:py-40 bg-[#FDFCFB] relative overflow-hidden border-t border-slate-50">
        {/* Decorative BG */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <div className="text-center mb-16 md:mb-24">
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-primary block mb-4">{settings.homeTrustSubheader || 'Curation Integrity'}</span>
              <h2 className="text-3xl md:text-6xl font-serif text-slate-900 tracking-tight leading-none">
                 {settings.homeTrustHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{settings.homeTrustHeader?.split(' ').slice(-1)}</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                const IconComponent = CustomIcons[item.iconName] || (LucideIcons as any)[item.iconName] || ShieldCheck;
                return (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="mb-6 md:mb-10 w-20 h-20 md:w-28 md:h-28 bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border border-slate-50 text-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                      <IconComponent size={32} className="md:w-12 md:h-12" strokeWidth={1} />
                    </div>
                    <h4 className="text-lg md:text-2xl font-bold mb-3 md:mb-5 tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed max-w-xs text-sm md:text-lg">{item.desc}</p>
                  </div>
                );
              })}
           </div>
           
           <div className="mt-20 md:mt-32">
              <button 
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-2xl group"
              >
                Read Full Curation Story
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
