
import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import { useNavigate, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../constants';
import { LayoutGrid, Sparkles, ShieldCheck, Globe, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';
import { Product } from '../types';

const SectionDivider: React.FC = () => (
  <div className="max-w-xs mx-auto py-12 md:py-20 flex items-center justify-center gap-4 opacity-20">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-900 to-transparent"></div>
    <div className="rotate-45 w-2 h-2 border border-slate-900"></div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-900 to-transparent"></div>
  </div>
);

const CuratorsPick: React.FC = () => {
  const { settings } = useSettings();
  const products: Product[] = useMemo(() => {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  }, []);
  
  // Just grab the first product as the featured one for now
  const featured = products[0];

  if (!featured) return null;

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
       {/* Background */}
       <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

       <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="order-2 lg:order-1">
                <span className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                   Curator's Spotlight
                </span>
                <h2 className="font-serif text-4xl md:text-6xl mb-6">{featured.name}</h2>
                <p className="text-slate-400 text-lg font-light leading-relaxed mb-8 max-w-lg">
                   {featured.description.substring(0, 150)}...
                </p>
                
                <div className="space-y-4 mb-10">
                   {featured.features?.slice(0,3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                         <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                         <span>{feat}</span>
                      </div>
                   ))}
                </div>

                <div className="flex items-center gap-6">
                   <Link 
                     to={`/product/${featured.id}`}
                     className="px-10 py-5 bg-white text-slate-900 rounded-full font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
                   >
                      View Details
                   </Link>
                   <span className="text-2xl font-serif italic text-primary">R {featured.price}</span>
                </div>
             </div>
             
             <div className="order-1 lg:order-2 relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                   <img src={featured.media?.[0]?.url} alt={featured.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                   <div className="absolute bottom-8 left-8">
                      <div className="flex gap-1 text-primary mb-2">
                         {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor"/>)}
                      </div>
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Highly Recommended</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  return (
    <main className="pt-0 bg-[#FDFCFB]">
      <Hero />
      
      {/* Story Section - Prominent Position */}
      <AboutSection />

      {/* Curator's Pick - Bridge to Product */}
      <CuratorsPick />

      {/* Trust Factors */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                const IconComponent = CustomIcons[item.iconName] || (LucideIcons as any)[item.iconName] || ShieldCheck;
                return (
                  <div key={i} className="flex flex-col items-center text-center group">
                    <div className="mb-6 p-5 bg-slate-50 rounded-2xl text-slate-900 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <IconComponent size={24} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-lg font-serif font-bold mb-3">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed text-sm max-w-xs">{item.desc}</p>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* Categories */}
      <CategoryGrid />
      
      <div className="pb-20 text-center">
         <Link to="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors">
            View Full Collection <ArrowRight size={14} />
         </Link>
      </div>

    </main>
  );
};

export default Home;
