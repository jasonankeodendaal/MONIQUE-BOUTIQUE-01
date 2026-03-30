import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, Sparkles, MapPin, Calendar, Heart, ArrowRight, Quote } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const About: React.FC = () => {
  const { settings, products } = useSettings();
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    setLoaded(true);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lastUpdatedDate = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(new Date());

  const renderIcon = (iconName: string, defaultIcon: React.ReactNode) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={24} /> : defaultIcon;
  };

  return (
    <main className={`min-h-screen bg-sand overflow-x-hidden transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Editorial Hero Spread - Optimised for perfect fit */}
      <div className="relative h-screen lg:h-screen w-full flex flex-row overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)]"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block overflow-hidden w-full text-center">
           <span className="text-[20vw] font-serif font-black text-white/[0.02] leading-none select-none tracking-tighter whitespace-nowrap inline-block animate-kenburns">EST. {settings.aboutEstablishedYear}</span>
        </div>

        {/* Image Column - Shrinks to fit */}
        <div className="w-1/2 lg:w-1/2 h-full lg:h-full relative overflow-hidden flex-shrink-0 lg:flex-shrink">
           <div 
             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
             style={{ 
               backgroundImage: `url(${settings.aboutMainImage})`,
               transform: `translateY(${scrollY * 0.15}px) scale(${1.15 + scrollY * 0.0001})`
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/20 to-slate-950"></div>
           <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
        </div>
        
        {/* Content Column - Shrinks to fit */}
        <div className="w-1/2 lg:w-1/2 h-full lg:h-full flex items-center p-4 md:p-12 lg:p-24 xl:p-32 relative z-10 bg-transparent overflow-hidden">
           <div className="max-w-2xl text-left h-full flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-[6px] md:text-[11px] font-black uppercase tracking-[0.5em] mb-4 md:mb-8 lg:mb-12 border border-primary/20 shadow-lg w-fit">
                  <Sparkles size={8} className="animate-pulse md:w-3 md:h-3"/> {settings.aboutHeroBadge}
              </div>
              
              <h1 className="font-serif text-white leading-[0.85] tracking-tighter mb-4 md:mb-8 lg:mb-12 text-balance animate-in slide-in-from-bottom-16 duration-1000" style={{ fontSize: 'clamp(1.2rem, 5vw, 6.5rem)' }}>
                  {settings.aboutHeroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block drop-shadow-2xl" : "block"}>{word}</span>
                  ))}
              </h1>

              <div className="relative pl-3 md:pl-12">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                <p className="text-[8px] md:text-xl lg:text-2xl text-slate-300 font-light leading-relaxed italic text-pretty line-clamp-6 lg:line-clamp-none">
                  {settings.aboutHeroSubtitle}
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* Narrative Spread with layered backgrounds */}
      <section className="py-24 lg:py-56 bg-copper-wash relative overflow-hidden section-vignette">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-24">
              
              {/* Sidebar Column with enhanced glassmorphism */}
              <div className="col-span-1 md:col-span-4 h-fit md:sticky md:top-40">
                  <div className="glass-card p-4 md:p-16 rounded-3xl md:rounded-[4.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] space-y-6 md:space-y-20 relative overflow-hidden h-full">
                      
                      <div className="space-y-3 md:space-y-6 text-left relative z-10">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-primary">
                             <div className="p-2 md:p-5 bg-white shadow-lg rounded-xl md:rounded-[2rem] border border-slate-100 w-fit">{renderIcon(settings.aboutMissionIcon, <Target className="w-3 h-3 md:w-6 md:h-6"/>)}</div>
                             <h4 className="text-[10px] md:text-3xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                          </div>
                          <p className="text-[8px] md:text-lg text-slate-600 leading-relaxed font-light line-clamp-4 md:line-clamp-none">{settings.aboutMissionBody}</p>
                      </div>

                      <div className="space-y-3 md:space-y-6 text-left relative z-10">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-primary">
                             <div className="p-2 md:p-5 bg-white shadow-lg rounded-xl md:rounded-[2rem] border border-slate-100 w-fit">{renderIcon(settings.aboutCommunityIcon, <Users className="w-3 h-3 md:w-6 md:h-6"/>)}</div>
                             <h4 className="text-[10px] md:text-3xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                          </div>
                          <p className="text-[8px] md:text-lg text-slate-600 leading-relaxed font-light line-clamp-4 md:line-clamp-none">{settings.aboutCommunityBody}</p>
                      </div>

                      {settings.aboutSignatureImage && (
                         <div className="pt-6 md:pt-20 border-t border-slate-200/60 flex flex-col items-center">
                            <img src={settings.aboutSignatureImage} loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined} className="h-10 md:h-28 w-auto object-contain opacity-60 mix-blend-multiply" alt="Signature" />
                            <span className="text-[6px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2 md:mt-4">Verified Narrative</span>
                         </div>
                      )}
                  </div>
              </div>

              {/* Main Story Column */}
              <div className="col-span-1 md:col-span-8 text-left min-w-0">
                  <div className="flex items-center gap-3 md:gap-10 mb-4 md:mb-20">
                     <div className="h-[1px] md:h-[3px] w-4 md:w-32 bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                     <span className="text-[6px] md:text-[15px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-primary text-contrast-shadow">{settings.aboutManifestoTitle || 'The Curation Manifesto'}</span>
                  </div>
                  
                  <h3 className="text-sm md:text-8xl font-serif text-slate-900 mb-4 md:mb-24 leading-tight md:leading-[1] tracking-tighter break-words drop-shadow-sm">
                     {settings.aboutHistoryTitle}
                  </h3>
                  
                  <div className="text-slate-600 font-light leading-relaxed text-[10px] md:text-2xl break-words max-w-4xl">
                      <div className="whitespace-pre-wrap 
                        first-letter:text-2xl md:first-letter:text-10xl 
                        first-letter:font-serif 
                        first-letter:font-black 
                        first-letter:text-slate-900 
                        first-letter:float-left 
                        first-letter:mr-2 md:first-letter:mr-10 
                        first-letter:leading-[0.8]
                        first-letter:mt-0.5 md:first-letter:mt-2
                      ">
                          {settings.aboutHistoryBody}
                      </div>
                  </div>

                  {settings.aboutGalleryImages && (
                    <div className="mt-12 md:mt-48 grid grid-cols-3 gap-4 md:gap-12">
                      {settings.aboutGalleryImages.slice(0,3).map((img, i) => (
                        <div key={i} className={`rounded-[1.5rem] md:rounded-[5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] aspect-[3/4] ${i === 1 ? 'mt-4 md:mt-24' : ''} transform transition-all duration-1000 hover:scale-105 hover:-translate-y-4`}>
                          <img src={img} loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined} className="w-full h-full object-cover" alt="Gallery" />
                        </div>
                      ))}
                    </div>
                  )}
              </div>
          </div>
        </div>
      </section>

      {/* Favorites Section with deep backgrounds */}
      <section className="py-32 bg-[#F4F1EC] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
         
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
               <div className="text-left">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-5 block flex items-center gap-3 text-contrast-shadow">
                    <Heart size={14} className="fill-current animate-pulse" /> {settings.aboutHeroBadge}
                  </span>
                  <h3 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tight">The Curator's Edit</h3>
                  <p className="text-slate-500 font-light mt-6 max-w-lg text-lg md:text-xl leading-relaxed">
                    Exclusive selections defined by authenticity and global trend analysis.
                  </p>
               </div>
               <Link 
                 to="/products" 
                 className="hidden md:inline-flex items-center gap-4 px-10 py-5 bg-slate-900 shadow-2xl rounded-full text-xs font-black uppercase tracking-widest text-white hover:bg-primary hover:text-slate-900 transition-all group"
               >
                  Explore Entire Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/>
               </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                 {products.slice(0, 4).map((product, idx) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="group block text-left soft-3d">
                       <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-white relative mb-8 shadow-xl border border-slate-200">
                          {product.media?.[0]?.url ? (
                            <img 
                              src={product.media[0].url} 
                              alt={product.media[0].altText || product.name} 
                              loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined}
                              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                               <LucideIcons.ShoppingBag size={48} strokeWidth={1} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                          <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.1)] opacity-50 group-hover:opacity-0 transition-opacity"></div>
                       </div>
                       
                       <div className="space-y-2 px-2">
                          <h4 className="text-lg font-serif text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-[12px] font-black text-primary uppercase tracking-widest">
                             R {(product.price || 0).toLocaleString()}
                          </span>
                       </div>
                    </Link>
                 ))}
              </div>
            ) : (
              <div className="w-full py-32 glass-card rounded-[3rem] border border-dashed border-slate-300 text-center text-slate-400 font-black uppercase text-[12px] tracking-[0.4em]">
                 {settings.productsEmptyMessage}
              </div>
            )}
         </div>
      </section>

      {/* Transparency Section with Dark Depth */}
       <section className="py-16 md:py-56 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
           <div className="flex flex-row items-center gap-8 md:gap-32 text-left">
              
              <div className="w-1/3 flex flex-col items-start gap-4 md:gap-10">
                 <div className="p-4 md:p-10 bg-white/5 rounded-2xl md:rounded-[3.5rem] border border-white/10 text-primary shadow-2xl animate-soft-flicker shrink-0">
                    {renderIcon(settings.aboutIntegrityIcon, <Award className="w-6 h-6 md:w-12 md:h-12" strokeWidth={1}/>)}
                 </div>
                 <h2 className="text-lg md:text-7xl font-serif tracking-tight leading-none text-balance">
                    {settings.aboutIntegrityTitle}
                 </h2>
              </div>

              <div className="w-2/3 border-l-2 md:border-l-4 border-primary/20 pl-6 md:pl-24">
                 <p className="text-sm md:text-5xl font-light text-slate-300 leading-tight italic drop-shadow-xl">
                    {settings.aboutIntegrityBody}
                 </p>
                 <div className="mt-6 md:mt-16 flex flex-wrap gap-4 md:gap-20 opacity-40">
                    <div className="flex items-center gap-2 md:gap-4">
                       <Heart className="w-3 h-3 md:w-5 md:h-5 text-primary"/>
                       <span className="text-[6px] md:text-[12px] font-black uppercase tracking-[0.4em]">{settings.aboutIntegrityBadge1}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                       <Calendar className="w-3 h-3 md:w-5 md:h-5 text-primary"/>
                       <span className="text-[6px] md:text-[12px] font-black uppercase tracking-[0.4em]">{settings.aboutIntegrityBadge2}</span>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Final Editorial Footer */}
      <div className="py-16 border-t border-slate-200/40 text-center bg-[#FDFBF7] relative">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.5em]">Digital Portfolio Verified: {lastUpdatedDate}</p>
            <div className="flex items-center gap-8">
              <span className="font-mono text-[10px] text-slate-500 tracking-widest">NR-990-2025-JS</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(212,175,55,1)]"></div>
            </div>
         </div>
      </div>

    </main>
  );
};

export default About;