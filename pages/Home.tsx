
import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import TestimonialSlider from '../components/TestimonialSlider';
import { useNavigate, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutGrid, Sparkles, ShieldCheck, Globe, Star, ArrowRight, ShoppingBag, History } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const SectionDivider: React.FC = () => (
  <div className="max-w-xs mx-auto py-16 md:py-28 flex items-center justify-center gap-6 opacity-30">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
    <div className="rotate-45 w-2 h-2 border border-slate-400 bg-white"></div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings, categories } = useSettings();

  // Defensive logic for string splitting
  const hookTitle = settings?.homeBottomHookTitle || "The Future of Taste.";
  const titleWords = hookTitle.split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastTitleWord = titleWords.slice(-1);

  return (
    <main className="pt-0">
      {/* 1. Cinematic Hero */}
      <Hero />
      
      {/* 2. Primary Narrative Bridge - Me and My Story */}
      <AboutSection />

      <SectionDivider />

      {/* 3. Category Quick Entry */}
      <section className="py-12 md:py-20 bg-white relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
             <div className="text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-3">
                  {settings?.homeCategorySectionTitle || 'Departments'}
                </span>
                <h3 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight">Curated <span className="italic font-light">Departments</span></h3>
             </div>
             <Link to="/products" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
                Full Collection <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-primary group-hover:translate-x-2 transition-all"><ArrowRight size={16}/></div>
             </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {categories.slice(0, 4).map((cat) => {
              const Icon = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LayoutGrid;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className="flex flex-col items-center group relative"
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-50 rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:-translate-y-3 transition-all duration-700 shadow-sm border border-transparent group-hover:border-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/5 overflow-hidden">
                    <Icon size={24} className="md:w-10 md:h-10 relative z-10" strokeWidth={1} />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </div>
                  <span className="mt-6 md:mt-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-900 transition-colors truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Full Visual Gallery Bridge */}
      <CategoryGrid />

      {/* 5. Trust Testimonials */}
      <TestimonialSlider />

      <SectionDivider />

      {/* 6. Trust & Methodology - The Personal Vouch */}
      <section className="py-24 md:py-48 bg-[#FDFCFB] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center mb-20 md:mb-32">
              <span className="text-[11px] font-black uppercase tracking-[0.7em] text-primary block mb-4">
                {settings?.homeTrustSectionTitle || 'The Standard'}
              </span>
              <h3 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tighter">The <span className="italic font-light">Curator's</span> Standard</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
              {[
                { iconName: settings?.homeTrustItem1Icon || 'ShieldCheck', title: settings?.homeTrustItem1Title || 'Vetted Quality', desc: settings?.homeTrustItem1Desc || 'Strict quality checks.' },
                { iconName: settings?.homeTrustItem2Icon || 'Sparkles', title: settings?.homeTrustItem2Title || 'Authentic Finds', desc: settings?.homeTrustItem2Desc || 'Genuine partnerships.' },
                { iconName: settings?.homeTrustItem3Icon || 'Globe', title: settings?.homeTrustItem3Title || 'Global Reach', desc: settings?.homeTrustItem3Desc || 'International shipping.' }
              ].map((item, i) => {
                const IconComponent = CustomIcons[item.iconName] || (LucideIcons as any)[item.iconName] || ShieldCheck;
                return (
                  <div key={i} className="flex flex-col items-center text-center group">
                    <div className="mb-10 p-8 md:p-10 bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-50 text-primary group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 group-hover:shadow-primary/10">
                      <IconComponent size={32} className="md:w-12 md:h-12" strokeWidth={1} />
                    </div>
                    <h4 className="text-xl md:text-2xl font-serif mb-4 md:mb-6 tracking-tight text-slate-900 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed max-w-xs text-sm md:text-lg">{item.desc}</p>
                    
                    <div className="mt-8 h-0.5 w-8 bg-primary/20 group-hover:w-16 transition-all duration-700"></div>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* 7. Bottom Story Hook */}
      <section className="py-24 md:py-32 bg-slate-900 text-white">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <History size={40} className="text-primary mx-auto mb-10 opacity-60" />
            <h3 className="text-3xl md:text-5xl font-serif mb-8 leading-tight tracking-tight">
               {mainTitle} <span className="italic text-primary">{lastTitleWord}</span>
            </h3>
            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto">
               {settings?.homeBottomHookSubtitle || "Join a community of discerning individuals who value substance over noise."}
            </p>
            <button 
               onClick={() => navigate('/about')}
               className="px-12 py-5 bg-primary text-slate-900 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-2xl active:scale-95"
            >
               {settings?.homeBottomHookButtonText || "Join the Circle"}
            </button>
         </div>
      </section>
    </main>
  );
};

export default Home;
