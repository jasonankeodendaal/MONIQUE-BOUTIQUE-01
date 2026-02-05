
import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, Star, Quote, Sparkles, MapPin, Calendar, Heart, ArrowDown, ChevronRight, MousePointer2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const About: React.FC = () => {
  const { settings } = useSettings();
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

  const renderIcon = (iconName: string, defaultIcon: React.ReactNode, size: number = 24) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={size} /> : defaultIcon;
  };

  return (
    <div className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* --- UPGRADED EDITORIAL HERO: ALWAYS SIDE-BY-SIDE --- */}
      <section className="relative min-h-[70vh] md:min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20 md:pt-32">
        
        {/* Background Layer: Kinetic Brand Text */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        >
          <span className="text-[25vw] font-serif font-black text-slate-900/[0.02] whitespace-nowrap tracking-tighter shadow-none leading-none">
            {settings.companyName} {settings.aboutEstablishedYear}
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-12 w-full relative z-10">
          <div className="flex flex-row items-center gap-4 md:gap-20">
            
            {/* Narrative Column (60%) */}
            <div className="w-7/12 md:w-7/12 text-left">
               <div className="space-y-4 md:space-y-12">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 md:gap-4 mb-2 md:mb-6">
                      <div className="h-px w-4 md:w-12 bg-primary"></div>
                      <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">The Narrative</span>
                    </div>
                    
                    <h1 className="font-serif text-slate-900 leading-[0.95] tracking-tighter mb-4 md:mb-8" style={{ fontSize: 'clamp(1.4rem, 6vw, 7rem)' }}>
                       {settings.aboutHeroTitle.split(' ').slice(0, -2).join(' ')} <br/>
                       <span className="italic font-light text-primary">{settings.aboutHeroTitle.split(' ').slice(-2).join(' ')}</span>
                    </h1>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                     <div className="max-w-full">
                        <p className="text-xs md:text-xl text-slate-500 font-light leading-relaxed mb-4 md:mb-10 border-l border-slate-100 pl-3 md:pl-8 line-clamp-4 md:line-clamp-none">
                          {settings.aboutHeroSubtitle}
                        </p>
                        
                        {/* Integrated Identity Badge - Compact for Mobile */}
                        <div className="flex items-center gap-3 md:gap-10">
                           <div className="flex flex-col">
                              <span className="text-[5px] md:text-[8px] font-black uppercase text-slate-400 tracking-widest">Est.</span>
                              <span className="text-[10px] md:text-xl font-serif font-bold text-slate-900">{settings.aboutEstablishedYear}</span>
                           </div>
                           <div className="w-px h-4 md:h-8 bg-slate-200"></div>
                           <div className="flex flex-col">
                              <span className="text-[5px] md:text-[8px] font-black uppercase text-slate-400 tracking-widest">Region</span>
                              <span className="text-[10px] md:text-xl font-serif font-bold text-slate-900 truncate max-w-[40px] md:max-w-none">{settings.aboutLocation.split(' ')[0]}</span>
                           </div>
                           <div className="w-px h-4 md:h-8 bg-slate-200"></div>
                           <div className="flex flex-col">
                              <span className="text-[5px] md:text-[8px] font-black uppercase text-slate-400 tracking-widest">Curator</span>
                              <span className="text-[10px] md:text-xl font-serif font-bold text-slate-900">{settings.aboutFounderName.split(' ')[0]}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2 md:pt-8 animate-in fade-in zoom-in duration-1000 delay-500">
                     <button 
                      onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
                      className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all duration-500 group shadow-xl"
                     >
                        <ArrowDown size={14} className="md:w-6 md:h-6 group-hover:translate-y-1 transition-transform" />
                     </button>
                     <span className="text-[6px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">Enter the Archive</span>
                  </div>
               </div>
            </div>

            {/* Visual Column (40%) - FREE VIEW 3D TRANSFORMATION */}
            <div className="w-5/12 md:w-5/12 flex justify-end relative">
               <div 
                 className="relative w-full aspect-[4/5] animate-in zoom-in fade-in duration-1000"
                 style={{ transform: `translateY(${scrollY * 0.05}px)` }}
               >
                  {/* Decorative Elements - Floating Orbs */}
                  <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 w-16 h-16 md:w-40 md:h-40 border border-primary/20 rounded-full animate-soft-flicker"></div>
                  
                  {/* Main Frame - CAPSULE SHAPE / NO BORDER */}
                  <div className="relative h-full w-full overflow-hidden rounded-[8rem] md:rounded-[20rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] bg-slate-100 group transition-transform duration-700 hover:-translate-y-4 hover:scale-[1.02]">
                     <img 
                      src={settings.aboutMainImage} 
                      className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110" 
                      alt="Founder"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Floating Glass Tag - Shrunk for Mobile */}
                  <div className="absolute bottom-10 -left-6 md:top-2/3 md:-right-16 bg-white/80 backdrop-blur-2xl p-3 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/50 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] flex flex-col items-start z-30 transition-all duration-500 hover:scale-110">
                     <span className="text-[5px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-1">Chief Curator</span>
                     <h4 className="text-[10px] md:text-2xl font-serif text-slate-900 whitespace-nowrap">{settings.aboutFounderName}</h4>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROFESSIONAL NARRATIVE SECTION: ALWAYS SIDE-BY-SIDE --- */}
      <section className="py-16 md:py-56 max-w-7xl mx-auto px-4 md:px-12 relative border-t border-slate-50">
        <div className="flex flex-row items-start gap-4 md:gap-32">
          
          {/* Detailed Context Column (40%) */}
          <div className="w-5/12 md:w-5/12">
             <div className="sticky top-24 md:top-32 space-y-4 md:space-y-12">
                <div className="p-4 md:p-12 bg-slate-900 rounded-[3rem] md:rounded-[5rem] text-white shadow-[0_50px_80px_-20px_rgba(15,23,42,0.3)] relative overflow-hidden group border border-white/5 transition-transform duration-500 hover:scale-[0.98]">
                  <h3 className="text-[6px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary mb-4 md:mb-12 block">The Philosophy</h3>
                  
                  <div className="space-y-4 md:space-y-10">
                    <div className="space-y-1 md:space-y-4 text-left">
                      <div className="w-6 h-6 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                         {renderIcon(settings.aboutMissionIcon, <Target size={12}/>, 12)}
                      </div>
                      <h4 className="text-[10px] md:text-xl font-serif text-white">{settings.aboutMissionTitle}</h4>
                      <p className="text-[8px] md:text-sm text-slate-400 leading-relaxed font-light line-clamp-3 md:line-clamp-none">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-1 md:space-y-4 text-left">
                      <div className="w-6 h-6 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 border border-white/10 shadow-lg">
                         {renderIcon(settings.aboutCommunityIcon, <Users size={12}/>, 12)}
                      </div>
                      <h4 className="text-[10px] md:text-xl font-serif text-white">{settings.aboutCommunityTitle}</h4>
                      <p className="text-[8px] md:text-sm text-slate-500 leading-relaxed font-light line-clamp-3 md:line-clamp-none">{settings.aboutCommunityBody}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 md:p-10 bg-white border border-slate-100 rounded-[3rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] text-center hidden md:block transition-all hover:shadow-xl">
                   <div className="flex justify-center items-center gap-2 text-primary mb-1">
                      <Award size={18} />
                      <span className="text-sm font-serif text-slate-900 italic">Certified Affiliate</span>
                   </div>
                   <p className="text-[8px] text-slate-400 font-light">Transparency & Trust first.</p>
                </div>
             </div>
          </div>

          {/* Narrative Text Column (60%) */}
          <div className="w-7/12 md:w-7/12 text-left">
            <div className="space-y-6 md:space-y-20">
               <div>
                  <h2 className="text-xl md:text-8xl font-serif text-slate-900 tracking-tighter leading-[1.1] md:leading-none mb-4 md:mb-12">
                    {settings.aboutHistoryTitle}
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-[10px] md:text-2xl text-slate-500 font-light leading-relaxed first-letter:text-3xl md:first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-2 md:first-letter:mr-6 first-letter:mt-0 md:first-letter:mt-2 whitespace-pre-wrap line-clamp-[12] md:line-clamp-none">
                      {settings.aboutHistoryBody}
                    </p>
                  </div>
               </div>

               {/* Integrity Highlight - NO BOX FEEL */}
               <div className="p-6 md:p-12 bg-slate-50 border border-slate-100 rounded-[4rem] md:rounded-[6rem] relative overflow-hidden group shadow-sm transition-all hover:shadow-lg">
                  <div className="relative z-10 flex flex-row items-center gap-4 md:gap-10">
                     <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] flex-shrink-0">
                        {renderIcon(settings.aboutIntegrityIcon, <ShieldCheck size={24}/>, 24)}
                     </div>
                     <div>
                        <h4 className="text-[10px] md:text-2xl font-serif text-slate-900 mb-1">{settings.aboutIntegrityTitle}</h4>
                        <p className="text-[8px] md:text-base text-slate-500 font-light leading-relaxed italic line-clamp-2 md:line-clamp-none">
                          "{settings.aboutIntegrityBody}"
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GALLERY SPREAD - PILL CAPSULE SHAPES --- */}
      {settings.aboutGalleryImages && settings.aboutGalleryImages.length > 0 && (
        <section className="py-12 md:py-48 bg-white border-t border-slate-50 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-4 md:px-12">
              <div className="flex flex-row justify-between items-end mb-16 md:mb-40 gap-4">
                 <div className="text-left w-1/2">
                    <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.6em] text-primary block mb-2 md:mb-6">Aesthetic Archive</span>
                    <h2 className="text-xl md:text-8xl font-serif text-slate-900 tracking-tighter leading-none">
                       Curated <br/> <span className="italic font-light text-primary">Moments.</span>
                    </h2>
                 </div>
                 <p className="text-slate-400 text-[8px] md:text-lg font-light max-w-sm text-left w-1/2 leading-relaxed">
                    Every piece in our archive undergoes a rigorous aesthetic audit before entering the collection.
                 </p>
              </div>

              {/* HIGH DENSITY 3D GALLERY */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-16">
                 {settings.aboutGalleryImages.slice(0,4).map((img, i) => (
                    <div 
                      key={i} 
                      className={`group relative overflow-hidden rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-8 hover:shadow-2xl hover:scale-105 ${i % 2 !== 0 ? 'md:mt-32' : 'md:-mt-12'}`}
                    >
                       <img 
                        src={img} 
                        className="w-full h-auto aspect-[3/5] object-cover transition-transform duration-[10s] group-hover:scale-110 grayscale group-hover:grayscale-0" 
                        alt={`Gallery ${i}`} 
                       />
                       {/* Subtle inner depth overlay */}
                       <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-full"></div>
                       <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Editorial Page Meta */}
      <div className="py-12 md:py-20 border-t border-slate-100 text-center bg-white">
         <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 opacity-30">
            <p className="text-[6px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] md:tracking-[0.5em]">Synchronized: {lastUpdatedDate}</p>
            <div className="flex items-center gap-2 md:gap-4">
               <span className="font-mono text-[6px] md:text-[9px] text-slate-400">CUR-ARCH-99-PRO</span>
               <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-slate-300 rounded-full"></div>
               <span className="text-[6px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Public Domain Ref</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default About;
