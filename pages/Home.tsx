
import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import { useNavigate, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutGrid, Sparkles, ShieldCheck, Globe, Star, ArrowRight, ShoppingBag, ExternalLink, Quote } from 'lucide-react';
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
  const { settings, categories, products } = useSettings();

  const featuredProduct = useMemo(() => {
    return products.length > 0 ? products[0] : null;
  }, [products]);

  return (
    <main className="pt-0 bg-[#FDFCFB]">
      <Hero />
      
      {/* Intro Personal Brand Message */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 block">The Bridge Curator</span>
           <h2 className="text-3xl md:text-6xl font-serif text-slate-900 leading-tight tracking-tighter mb-8 text-balance">
              "I don't just sell fashion. I <span className="italic font-light text-primary">bridge the gap</span> between you and your best self."
           </h2>
           <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 p-1">
                 <img src={settings.homeAboutImage} className="w-full h-full object-cover rounded-full" alt="Curator" />
              </div>
              <div>
                 <p className="text-slate-900 font-bold uppercase tracking-widest text-xs">{settings.aboutFounderName}</p>
                 <p className="text-slate-400 text-[10px] uppercase tracking-widest">Founder & Lead Stylist</p>
              </div>
           </div>
        </div>
      </section>

      <AboutSection />

      <SectionDivider />

      {/* Featured Recommendation (Core Bridge Page Element) */}
      {featuredProduct && (
        <section className="py-20 md:py-40 bg-slate-950 text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
           
           <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative group order-2 lg:order-1">
                 <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                    <img src={featuredProduct.media?.[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Featured" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
              </div>

              <div className="space-y-8 order-1 lg:order-2 text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                    <Star size={12}/> Editor's Selection
                 </div>
                 <h3 className="text-4xl md:text-7xl font-serif leading-none tracking-tighter">
                    {featuredProduct.name}
                 </h3>
                 <div className="relative pl-8 border-l border-primary/30 py-2">
                    <Quote className="absolute top-0 left-2 text-primary/10 w-12 h-12" />
                    <p className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed">
                       {featuredProduct.description.substring(0, 150)}...
                    </p>
                 </div>
                 <div className="flex items-center gap-6">
                    <Link 
                      to={`/product/${featuredProduct.id}`}
                      className="px-10 py-5 bg-primary text-slate-900 font-black uppercase text-xs tracking-widest rounded-2xl hover:brightness-110 transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
                    >
                       View Details <ArrowRight size={18}/>
                    </Link>
                    <a 
                      href={featuredProduct.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                    >
                       Secure Acquisition <ExternalLink size={14}/>
                    </a>
                 </div>
              </div>
           </div>
        </section>
      )}

      <SectionDivider />

      {/* Category Icons Strip */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6 md:mb-12">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">{settings.homeCategorySectionTitle}</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-8">
            {categories.map((cat) => {
              const Icon = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LayoutGrid;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className="flex flex-col items-center group"
                >
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:-translate-y-2 transition-all duration-500 shadow-sm border border-transparent group-hover:border-primary/20">
                    <Icon size={18} className="md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <span className="mt-3 md:mt-5 text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <CategoryGrid />

      <SectionDivider />

      {/* Trust & Methodology Section */}
      <section className="py-12 md:py-32 bg-[#FDFCFB] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center mb-8 md:mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-2">{settings.homeTrustSectionTitle}</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-16">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                const IconComponent = CustomIcons[item.iconName] || (LucideIcons as any)[item.iconName] || ShieldCheck;
                return (
                  <div key={i} className={`flex flex-col items-center text-center ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                    <div className="mb-4 md:mb-8 p-4 md:p-6 bg-white rounded-3xl shadow-xl border border-slate-50 text-primary group hover:scale-110 transition-transform duration-500">
                      <IconComponent size={20} className="md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm md:text-lg font-bold mb-2 md:mb-4 tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed max-w-xs text-xs md:text-base">{item.desc}</p>
                  </div>
                );
              })}
           </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
