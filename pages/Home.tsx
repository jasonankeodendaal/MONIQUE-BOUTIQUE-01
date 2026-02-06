
import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight, Heart, Star, ShoppingBag } from 'lucide-react';
import { useSettings } from '../App';

const SectionDivider: React.FC = () => (
  <div className="max-w-xs mx-auto py-12 md:py-20 flex items-center justify-center gap-4 opacity-20">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
    <div className="rotate-45 w-2 h-2 border border-slate-400"></div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings, categories, products } = useSettings();

  const featuredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [categories]);

  const curatorsEdit = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [products]);

  return (
    <main className="pt-0">
      <Hero />
      
      <div className="bg-copper-wash relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <AboutSection />
      </div>

      {/* --- CURATOR'S EDIT (BRIDGE SECTION) --- */}
      <section className="py-16 md:py-32 bg-paper relative">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-8">
               <div className="text-left">
                  <div className="flex items-center gap-3 mb-4">
                     <Heart size={14} className="text-primary fill-current animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Personal Recommendations</span>
                  </div>
                  <h2 className="text-4xl md:text-7xl font-serif text-slate-900 tracking-tighter">The Curator's <br/> <span className="italic font-light text-primary">Edit</span></h2>
                  <p className="text-slate-500 text-sm md:text-lg mt-6 max-w-xl font-light leading-relaxed">
                     The items I'm currently obsessing over. Personally vetted for style, quality, and that "hidden gem" factor.
                  </p>
               </div>
               <Link to="/products" className="group flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95">
                  View Entire Vault <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
               {curatorsEdit.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col items-start text-left">
                     <div className="aspect-[3/4] w-full bg-slate-50 rounded-[2rem] overflow-hidden relative shadow-xl mb-6 border border-slate-100 group-hover:-translate-y-2 transition-transform duration-700">
                        {product.media?.[0]?.url ? (
                          <img src={product.media[0].url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200"><ShoppingBag size={48} strokeWidth={1} /></div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-900 shadow-lg">
                           R {product.price.toLocaleString()}
                        </div>
                     </div>
                     <div className="space-y-1 w-full px-2">
                        <div className="flex gap-0.5 text-primary mb-1">
                           {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                        </div>
                        <h4 className="font-serif text-lg md:text-2xl text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hand-Picked Selection</span>
                     </div>
                  </Link>
               ))}
               {curatorsEdit.length === 0 && (
                 <div className="col-span-full py-20 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Populating Recommendations...</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      <SectionDivider />

      {/* Category Icons Strip - Updated with Image Icons */}
      <section className="py-8 md:py-16 bg-copper-wash">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-2 text-contrast-shadow break-words text-balance">{settings.homeNicheSubheader || 'Curated Portals'}</span>
            <h2 className="text-2xl md:text-5xl font-serif text-slate-900 tracking-tighter break-words text-balance">
              {settings.homeNicheHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary text-contrast-shadow">{settings.homeNicheHeader?.split(' ').slice(-1)}</span>
            </h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-12">
            {featuredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?category=${cat.id}`)}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 md:w-28 md:h-28 bg-white/40 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:-translate-y-3 transition-all duration-500 shadow-sm border border-slate-100/50 group-hover:border-primary/20 overflow-hidden">
                  {cat.image ? (
                    <img src={cat.image} className="w-full h-full object-cover aspect-square transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
                  ) : (
                    <LayoutGrid size={24} className="md:w-10 md:h-10" strokeWidth={1.2} />
                  )}
                </div>
                <span className="mt-4 md:mt-6 text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors truncate w-full text-center">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-copper-wash">
        <CategoryGrid items={featuredCategories} />
      </div>

      {/* Trust & Methodology Section - Updated with Image Icons */}
      <section className="py-12 md:py-40 bg-copper-wash relative overflow-hidden border-t border-slate-100/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
           <div className="text-center mb-8 md:mb-24">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.8em] text-primary block mb-2 md:mb-4 text-contrast-shadow break-words text-balance">{settings.homeTrustSubheader || 'Curation Integrity'}</span>
              <h2 className="text-xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none break-words text-balance">
                 {settings.homeTrustHeader?.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary text-contrast-shadow">{settings.homeTrustHeader?.split(' ').slice(-1)}</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-3 gap-2 md:gap-16">
              {[
                { iconUrl: settings.homeTrustItem1Icon, title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconUrl: settings.homeTrustItem2Icon, title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconUrl: settings.homeTrustItem3Icon, title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="mb-3 md:mb-10 w-12 h-12 md:w-28 md:h-28 bg-white/60 backdrop-blur-md rounded-xl md:rounded-[3.5rem] shadow-lg border border-white/40 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                    <img src={item.iconUrl} className="w-full h-full object-cover aspect-square" alt={item.title} />
                  </div>
                  <h4 className="text-[10px] md:text-2xl font-bold mb-1 md:mb-5 tracking-tight line-clamp-2 text-balance">{item.title}</h4>
                  <p className="text-slate-500 font-light leading-snug max-w-xs text-[8px] md:text-lg line-clamp-3 text-balance">{item.desc}</p>
                </div>
              ))}
           </div>
           
           <div className="mt-12 md:mt-32">
              <button 
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 md:gap-4 px-6 py-3 md:px-10 md:py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-2xl group"
              >
                Read Full Story
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
