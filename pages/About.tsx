import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, Sparkles, MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';
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
    <div className={`min-h-screen bg-copper-wash overflow-x-hidden transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Editorial Hero Spread */}
      <div className="relative min-h-[80vh] lg:h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block">
           <span className="text-[15vw] font-serif font-black text-white/[0.03] leading-none select-none tracking-tighter whitespace-nowrap">EST. {settings.aboutEstablishedYear}</span>
        </div>

        <div className="w-full lg:w-1/2 h-[40vh] lg:h-full relative overflow-hidden">
           <div 
             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
             style={{ 
               backgroundImage: `url(${settings.aboutMainImage})`,
               transform: `translateY(${scrollY * 0.1}px) scale(${1.1 + scrollY * 0.0001})`
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-slate-950/10 to-slate-950"></div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center p-6 md:p-12 lg:p-24 relative z-10">
           <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-6 lg:mb-12 border border-primary/20 text-contrast-shadow">
                  <Sparkles size={10} className="animate-pulse"/> {settings.aboutFounderName}
              </div>
              
              <h1 className="font-serif text-white leading-[0.9] tracking-tighter mb-6 lg:mb-12 text-balance animate-in slide-in-from-bottom-12 duration-1000" style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}>
                  {settings.aboutHeroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block text-contrast-shadow" : "block"}>{word}</span>
                  ))}
              </h1>

              <p className="text-base md:text-xl lg:text-2xl text-slate-400 font-light leading-relaxed italic text-pretty border-l border-primary/30 pl-4 lg:pl-10">
                "{settings.aboutHeroSubtitle}"
              </p>
           </div>
        </div>
      </div>

      {/* Narrative Spread - Stacks on Mobile, Columns on Large */}
      <section className="py-16 lg:py-48 max-w-7xl mx-auto px-6 lg:px-12 relative overflow-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Sidebar Column */}
            <div className="w-full lg:col-span-4 h-fit lg:sticky lg:top-32">
                <div className="bg-white/60 backdrop-blur-md p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] shadow-xl border border-white/50 space-y-10 lg:space-y-14 relative overflow-hidden">
                    <div className="space-y-4 text-left relative z-10">
                        <div className="flex items-center gap-3 text-primary">
                           <div className="p-2 lg:p-3 bg-primary/10 rounded-xl lg:rounded-2xl">{renderIcon(settings.aboutMissionIcon, <Target size={20}/>)}</div>
                           <h4 className="text-lg lg:text-2xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                        </div>
                        <p className="text-sm lg:text-base text-slate-500 leading-relaxed font-light">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-4 text-left relative z-10">
                        <div className="flex items-center gap-3 text-primary">
                           <div className="p-2 lg:p-3 bg-primary/10 rounded-xl lg:rounded-2xl">{renderIcon(settings.aboutCommunityIcon, <Users size={20}/>)}</div>
                           <h4 className="text-lg lg:text-2xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                        </div>
                        <p className="text-sm lg:text-base text-slate-500 leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                    </div>

                    {settings.aboutSignatureImage && (
                       <div className="pt-8 lg:pt-12 border-t border-black/5 flex flex-col items-center">
                          <img src={settings.aboutSignatureImage} className="h-12 lg:h-20 w-auto object-contain opacity-40 mix-blend-multiply" alt="Signature" />
                       </div>
                    )}
                </div>
            </div>

            {/* Main Story Column */}
            <div className="w-full lg:col-span-8 text-left min-w-0">
                <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-12">
                   <div className="h-[2px] w-12 lg:w-20 bg-primary"></div>
                   <span className="text-[10px] lg:text-[12px] font-black uppercase tracking-[0.4em] text-primary text-contrast-shadow">The Manifesto</span>
                </div>
                
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-8 lg:mb-16 leading-[1.1] tracking-tighter break-words">
                   {settings.aboutHistoryTitle}
                </h3>
                
                <div className="text-slate-500 font-light leading-relaxed text-base lg:text-lg break-words">
                    <div className="whitespace-pre-wrap 
                      first-letter:text-6xl lg:first-letter:text-8xl 
                      first-letter:font-serif 
                      first-letter:font-black 
                      first-letter:text-slate-900 
                      first-letter:float-left 
                      first-letter:mr-4 lg:first-letter:mr-8 
                      first-letter:leading-none
                    ">
                        {settings.aboutHistoryBody}
                    </div>
                </div>

                {settings.aboutGalleryImages && (
                  <div className="mt-16 lg:mt-32 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
                    {settings.aboutGalleryImages.slice(0,3).map((img, i) => (
                      <div key={i} className={`rounded-2xl lg:rounded-[2.5rem] overflow-hidden shadow-lg aspect-[3/4] ${i === 1 ? 'mt-6 lg:mt-12' : ''} ${i === 2 ? 'hidden md:block' : ''}`}>
                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Gallery" />
                      </div>
                    ))}
                  </div>
                )}
            </div>
        </div>
      </section>

      {/* Curator's Edit / Favorites Section */}
      <section className="py-24 bg-white/20 relative overflow-hidden backdrop-blur-sm">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
         
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 block flex items-center gap-2 text-contrast-shadow">
                    <Heart size={12} className="fill-current" /> Current Obsessions
                  </span>
                  <h3 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight">The Curator's Edit</h3>
                  <p className="text-slate-500 font-light mt-4 max-w-md text-sm md:text-base leading-relaxed">
                    A selection of pieces that are currently defining my personal aesthetic. Hand-picked and verified.
                  </p>
               </div>
               <Link 
                 to="/products" 
                 className="hidden md:inline-flex items-center gap-3 px-6 py-3 bg-white/40 border border-white/50 rounded-full text-xs font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all group"
               >
                  Explore Catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
               </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                 {products.slice(0, 4).map((product, idx) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="group block text-left">
                       <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-white/40 relative mb-5 shadow-sm border border-white/50">
                          {product.media?.[0]?.url ? (
                            <img 
                              src={product.media[0].url} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <LucideIcons.ShoppingBag size={32} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                             <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl text-center shadow-lg">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">View Details</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="space-y-1 px-1">
                          <h4 className="text-sm font-serif text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                               R {product.price.toLocaleString()}
                             </span>
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
            ) : (
              <div className="w-full py-20 bg-white/20 rounded-3xl border border-dashed border-white/40 text-center text-slate-400 text-xs uppercase tracking-widest">
                 Curator hasn't selected favorites yet.
              </div>
            )}

            <div className="mt-12 md:hidden text-center">
               <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1">
                  View Full Collection
               </Link>
            </div>
         </div>
      </section>

      {/* Transparency Block */}
      <section className="py-20 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
           <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-20 text-left">
              
              <div className="w-full lg:w-1/3 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-6">
                 <div className="p-4 lg:p-6 bg-white/5 rounded-2xl lg:rounded-3xl border border-white/10 text-primary animate-soft-flicker shrink-0">
                    {renderIcon(settings.aboutIntegrityIcon, <Award size={28}/>)}
                 </div>
                 <h2 className="text-2xl lg:text-5xl font-serif tracking-tight leading-tight">
                    {settings.aboutIntegrityTitle}
                 </h2>
              </div>

              <div className="w-full lg:w-2/3 border-l-2 lg:border-l-4 border-primary/20 pl-6 lg:pl-20">
                 <p className="text-lg lg:text-3xl font-light text-slate-300 leading-relaxed italic">
                    "{settings.aboutIntegrityBody}"
                 </p>
                 <div className="mt-8 flex flex-wrap gap-8 lg:gap-12 opacity-50">
                    <div className="flex flex-col gap-1">
                       <Heart size={14} className="text-primary"/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <Calendar size={14} className="text-primary"/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Fresh</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <MapPin size={14} className="text-primary"/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Global</span>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Editorial Footer Meta */}
      <div className="py-10 border-t border-black/5 text-center bg-transparent relative">
         <div className="max-w-7xl mx-auto px-6 flex flex-row justify-between items-center opacity-40">
            <p className="text-[8px] lg:text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Narrative Verified: {lastUpdatedDate}</p>
            <span className="font-mono text-[8px] lg:text-[9px] text-slate-400">AB-992-JOURNEY-025</span>
         </div>
      </div>

    </div>
  );
};

export default About;