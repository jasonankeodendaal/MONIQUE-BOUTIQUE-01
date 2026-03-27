import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import ReviewCarousel from '../components/ReviewCarousel';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutGrid, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';
import { IconRenderer } from '../components/IconRenderer';

const SectionDivider: React.FC = () => (
  <div className="relative w-full py-16 md:py-24 overflow-hidden">
    {/* Bowtie Strip Background - Soft & Modern */}
    <div 
      className="absolute inset-x-0 inset-y-4 bg-white/60 backdrop-blur-md border-y border-white/40 shadow-sm"
      style={{ clipPath: 'polygon(0 0, 50% 15%, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
    ></div>
    
    {/* Content inside bowtie strip */}
    <div className="max-w-xl mx-auto px-6 flex items-center justify-center gap-8 relative z-10">
      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      <div className="flex-shrink-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center rotate-45 group hover:rotate-90 transition-transform duration-700">
          <div className="w-3 h-3 bg-primary rounded-sm shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"></div>
        </div>
      </div>
      <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-slate-300 to-transparent"></div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings, categories } = useSettings();

  // Shuffle categories and pick exactly 4 to show on the home page
  const featuredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [categories]);

  return (
    <main className="pt-0 bg-rose-50/20 min-h-screen relative">
      <Hero />
      
      {/* Editorial Story Preview */}
      <div className="bg-copper-wash relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <AboutSection />
      </div>

      <SectionDivider />

      {/* Review Carousel Section */}
      <ReviewCarousel />

      <div className="bg-copper-wash">
        <CategoryGrid items={featuredCategories} />
      </div>

      {/* Trust & Methodology Section */}
      <section className="py-12 md:py-40 bg-copper-wash relative overflow-hidden border-t border-slate-100/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
           <div className="text-center mb-8 md:mb-24">
              <span className="text-[8px] md:text(10px) font-black uppercase tracking-[0.8em] text-primary block mb-2 md:mb-4 text-contrast-shadow break-words text-balance">{settings.homeTrustSubheader || 'Curation Integrity'}</span>
              <h2 className="text-xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none break-words text-balance">
                 {settings.homeTrustHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary text-contrast-shadow">{settings.homeTrustHeader?.split(' ').slice(-1)}</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-3 gap-2 md:gap-16">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                return (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="mb-3 md:mb-10 w-12 h-12 md:w-28 md:h-28 bg-white/60 backdrop-blur-md rounded-xl md:rounded-[3.5rem] shadow-lg border border-white/40 text-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                      <IconRenderer icon={item.iconName} size={20} className="md:w-12 md:h-12" strokeWidth={1} />
                    </div>
                    <h4 className="text-[9px] md:text-2xl font-bold mb-1 md:mb-5 tracking-tight line-clamp-2 text-balance">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-snug max-w-xs text-[7px] md:text-lg line-clamp-3 text-balance">{item.desc}</p>
                  </div>
                );
              })}
           </div>
           
           <div className="mt-12 md:mt-32">
              <button 
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 md:gap-4 px-6 py-3 md:px-10 md:py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-2xl group"
              >
                {settings.homeReadStoryBtn || 'Read Full Story'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>
    </main>
  );
};

export default Home;