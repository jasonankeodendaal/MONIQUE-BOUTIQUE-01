import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import ReviewCarousel from '../components/ReviewCarousel';
import ProductMarquee from '../components/ProductMarquee';
import NewsletterSignup from '../components/NewsletterSignup';
import SocialProofGrid from '../components/SocialProofGrid';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutGrid, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';
import { IconRenderer } from '../components/IconRenderer';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings, categories } = useSettings();

  // Consistently pick exactly 4 categories to show on the home page
  const featuredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    return sorted.slice(0, 4);
  }, [categories]);

  return (
    <main className="pt-0">
      <Hero />
      
      {/* Editorial Story Preview */}
      <AboutSection />

      {/* Product Marquee Section */}
      <ProductMarquee />

      {/* Review Carousel Section */}
      <ReviewCarousel />

      <CategoryGrid items={featuredCategories} />

      {/* Trust & Methodology Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
           <div className="text-center mb-12">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 block mb-4">{settings.homeTrustSubheader || 'Curation Integrity'}</span>
              <h2 className="text-2xl md:text-3xl font-serif text-slate-900 tracking-tighter">
                 {settings.homeTrustHeader || 'The Standard of Excellence'}
              </h2>
           </div>
           
           <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title || 'Verified Authenticity', desc: settings.homeTrustItem1Desc || 'Every piece is rigorously authenticated by our experts.' },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title || 'Curated Selection', desc: settings.homeTrustItem2Desc || 'Only the finest items make it into our collection.' },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title || 'Global Reach', desc: settings.homeTrustItem3Desc || 'Sourced from the most exclusive locations worldwide.' }
              ].map((item, i) => {
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="mb-2 md:mb-4 w-8 h-8 md:w-12 md:h-12 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100 text-slate-900 flex items-center justify-center">
                      <IconRenderer icon={item.iconName} className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1} />
                    </div>
                    <h4 className="text-[8px] md:text-base font-medium mb-1 md:mb-2 tracking-tight text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed text-[7px] md:text-xs text-balance line-clamp-2">{item.desc}</p>
                  </div>
                );
              })}
           </div>
           
           <div className="mt-12">
              <button 
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:text-primary transition-all"
              >
                {settings.homeReadStoryBtn || 'Read Full Story'}
                <ArrowRight size={14} />
              </button>
           </div>
        </div>
      </section>

    </main>
  );
};

export default Home;