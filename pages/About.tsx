import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Sparkles, Heart, ArrowRight, GraduationCap } from 'lucide-react';
import { useSettings } from '../App';
import { TRAINING_MODULES } from '../constants';

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

  const renderIcon = (iconUrl: string) => {
    return <img src={iconUrl} className="w-6 h-6 lg:w-10 lg:h-10 object-cover aspect-square rounded-lg lg:rounded-2xl" alt="Module Icon" />;
  };

  return (
    <div className={`min-h-screen bg-sand overflow-x-hidden transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Editorial Hero Spread */}
      <div className="relative min-h-[90vh] lg:h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)]"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block overflow-hidden w-full text-center">
           <span className="text-[20vw] font-serif font-black text-white/[0.02] leading-none select-none tracking-tighter whitespace-nowrap inline-block animate-kenburns">EST. {settings.aboutEstablishedYear}</span>
        </div>

        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative overflow-hidden">
           <div 
             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
             style={{ 
               backgroundImage: `url(${settings.aboutMainImage})`,
               transform: `translateY(${scrollY * 0.15}px) scale(${1.15 + scrollY * 0.0001})`
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-slate-950/20 to-slate-950"></div>
           <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center p-8 md:p-16 lg:p-32 relative z-10 bg-slate-950 lg:bg-transparent">
           <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] mb-8 lg:mb-16 border border-primary/20 shadow-lg">
                  <Sparkles size={12} className="animate-pulse"/> {settings.aboutFounderName}
              </div>
              
              <h1 className="font-serif text-white leading-[0.85] tracking-tighter mb-8 lg:mb-16 text-balance animate-in slide-in-from-bottom-16 duration-1000" style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}>
                  {settings.aboutHeroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block drop-shadow-2xl" : "block"}>{word}</span>
                  ))}
              </h1>

              <div className="relative pl-8 lg:pl-16">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                <p className="text-lg md:text-2xl lg:text-3xl text-slate-300 font-light leading-relaxed italic text-pretty">
                  {settings.aboutHeroSubtitle}
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* Narrative Spread */}
      <section className="py-24 lg:py-56 bg-copper-wash relative overflow-hidden section-vignette">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24">
              
              <div className="w-full lg:col-span-4 h-fit lg:sticky lg:top-40">
                  <div className="glass-card p-10 lg:p-16 rounded-[2.5rem] lg:rounded-[4.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] space-y-12 lg:space-y-20 relative overflow-hidden">
                      
                      <div className="space-y-6 text-left relative z-10">
                          <div className="flex items-center gap-4 text-primary">
                             <div className="p-3 lg:p-5 bg-white shadow-xl rounded-2xl lg:rounded-[2rem] border border-slate-100 overflow-hidden">
                               {renderIcon(settings.aboutMissionIcon)}
                             </div>
                             <h4 className="text-xl lg:text-3xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                          </div>
                          <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-light">{settings.aboutMissionBody}</p>
                      </div>

                      <div className="space-y-6 text-left relative z-10">
                          <div className="flex items-center gap-4 text-primary">
                             <div className="p-3 lg:p-5 bg-white shadow-xl rounded-2xl lg:rounded-[2rem] border border-slate-100 overflow-hidden">
                               {renderIcon(settings.aboutCommunityIcon)}
                             </div>
                             <h4 className="text-xl lg:text-3xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                          </div>
                          <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                      </div>

                      {settings.aboutSignatureImage && (
                         <div className="pt-12 lg:pt-20 border-t border-slate-200/60 flex flex-col items-center">
                            <img src={settings.aboutSignatureImage} className="h-16 lg:h-28 w-auto object-contain opacity-60 mix-blend-multiply" alt="Signature" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4">Verified Narrative</span>
                         </div>
                      )}
                  </div>
              </div>

              <div className="w-full lg:col-span-8 text-left min-w-0">
                  <div className="flex items-center gap-6 lg:gap-10 mb-10 lg:mb-20">
                     <div className="h-[3px] w-16 lg:w-32 bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                     <span className="text-[12px] lg:text-[15px] font-black uppercase tracking-[0.6em] text-primary text-contrast-shadow">The Curation Manifesto</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl lg:text-8xl font-serif text-slate-900 mb-12 lg:mb-24 leading-[1] tracking-tighter break-words drop-shadow-sm">
                     {settings.aboutHistoryTitle}
                  </h3>
                  
                  <div className="text-slate-600 font-light leading-relaxed text-lg lg:text-2xl break-words max-w-4xl">
                      <div className="whitespace-pre-wrap 
                        first-letter:text-7xl lg:first-letter:text-10xl 
                        first-letter:font-serif 
                        first-letter:font-black 
                        first-letter:text-slate-900 
                        first-letter:float-left 
                        first-letter:mr-6 lg:first-letter:mr-10 
                        first-letter:leading-[0.8]
                        first-letter:mt-2
                      ">
                          {settings.aboutHistoryBody}
                      </div>
                  </div>

                  {settings.aboutGalleryImages && (
                    <div className="mt-24 lg:mt-48 grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12">
                      {settings.aboutGalleryImages.slice(0,3).map((img, i) => (
                        <div key={i} className={`rounded-[2.5rem] lg:rounded-[5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] aspect-[3/4] ${i === 1 ? 'mt-10 lg:mt-24' : ''} ${i === 2 ? 'hidden md:block' : ''} transform transition-all duration-1000 hover:scale-105 hover:-translate-y-4`}>
                          <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                        </div>
                      ))}
                    </div>
                  )}
              </div>
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      <section className="py-32 bg-[#F4F1EC] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
         
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
               <div className="text-left">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-5 block flex items-center gap-3 text-contrast-shadow">
                    <Heart size={14} className="fill-current animate-pulse" /> Personal Curation Vault
                  </span>
                  <h3 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tight">The Curator's Edit</h3>
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
                 {products.slice(0, 4).map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="group block text-left soft-3d">
                       <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-white relative mb-8 shadow-xl border border-slate-200">
                          {product.media?.[0]?.url && (
                            <img 
                              src={product.media[0].url} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                            />
                          )}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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
                 Populating Personal Collection...
              </div>
            )}
         </div>
      </section>

      {/* Transparency Section */}
      <section className="py-32 lg:py-56 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
           <div className="flex flex-col lg:flex-row items-start lg:items-center gap-16 lg:gap-32 text-left">
              
              <div className="w-full lg:w-1/3 flex flex-row lg:flex-col items-center lg:items-start gap-8 lg:gap-10">
                 <div className="p-6 lg:p-10 bg-white/5 rounded-[2rem] lg:rounded-[3.5rem] border border-white/10 text-primary shadow-2xl animate-soft-flicker shrink-0 overflow-hidden">
                    {renderIcon(settings.aboutIntegrityIcon)}
                 </div>
                 <h2 className="text-4xl lg:text-7xl font-serif tracking-tight leading-none text-balance">
                    {settings.aboutIntegrityTitle}
                 </h2>
              </div>

              <div className="w-full lg:w-2/3 border-l-4 border-primary/20 pl-10 lg:pl-24">
                 <p className="text-2xl lg:text-5xl font-light text-slate-300 leading-tight italic drop-shadow-xl">
                    {settings.aboutIntegrityBody}
                 </p>
              </div>

           </div>
        </div>
      </section>

      <div className="py-16 border-t border-slate-200/40 text-center bg-[#FDFBF7] relative">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.5em]">Digital Portfolio Verified: {lastUpdatedDate}</p>
         </div>
      </div>

    </div>
  );
};

export default About;