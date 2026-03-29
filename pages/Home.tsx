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
                 {settings.homeTrustHeader}
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="mb-4 w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 text-slate-900 flex items-center justify-center">
                      <IconRenderer icon={item.iconName} size={20} strokeWidth={1} />
                    </div>
                    <h4 className="text-base font-medium mb-2 tracking-tight text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed text-xs text-balance">{item.desc}</p>
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