import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import ReviewCarousel from '../components/ReviewCarousel';
import ProductMarquee from '../components/ProductMarquee';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutGrid, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';
import { IconRenderer } from '../components/IconRenderer';

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
    <main className="pt-0">
      <Hero />
      
      {/* Editorial Story Preview */}
      <div className="bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <AboutSection />
      </div>

      {/* Product Marquee Section */}
      <ProductMarquee />

      {/* Review Carousel Section */}
      <ReviewCarousel />

      <div className="bg-slate-50/50">
        <CategoryGrid items={featuredCategories} />
      </div>

      {/* Trust & Methodology Section */}
      <section className="py-24 md:py-48 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <div className="text-center mb-16 md:mb-32">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 block mb-6">{settings.homeTrustSubheader || 'Curation Integrity'}</span>
              <h2 className="text-3xl md:text-6xl font-serif text-slate-900 tracking-tighter leading-none">
                 {settings.homeTrustHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{settings.homeTrustHeader?.split(' ').slice(-1)}</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                return (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="mb-8 w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-primary flex items-center justify-center group-hover:bg-white group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700">
                      <IconRenderer icon={item.iconName} size={32} className="md:w-14 md:h-14" strokeWidth={1} />
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold mb-4 tracking-tight text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed max-w-xs text-sm md:text-lg text-balance">{item.desc}</p>
                  </div>
                );
              })}
           </div>
           
           <div className="mt-20 md:mt-40">
              <button 
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-xl hover:shadow-primary/20 group"
              >
                {settings.homeReadStoryBtn || 'Read Full Story'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>
    </main>
  );
};

export default Home;