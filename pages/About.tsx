import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, Star, Quote, Sparkles, MapPin, Calendar, Heart, ArrowDown } from 'lucide-react';
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

  const renderIcon = (iconName: string, defaultIcon: React.ReactNode) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={24} /> : defaultIcon;
  };

  return (
    <div className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Editorial Hero Spread */}
      <div className="relative h-[70vh] md:h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block">
           <span className="text-[25vw] font-serif font-black text-white/[0.03] leading-none select-none tracking-tighter">EST. {settings.aboutEstablishedYear}</span>
        </div>

        <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden">
           <div 
             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-110"
             style={{ 
               backgroundImage: `url(${settings.aboutMainImage})`,
               transform: `translateY(${scrollY * 0.1}px) scale(${1.1 + scrollY * 0.0001})`
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/10 to-slate-950/40 lg:to-slate-950"></div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center p-6 md:p-24 relative z-10">
           <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-6 md:mb-12 border border-primary/20">
                  <Sparkles size={10} className="animate-pulse"/> {settings.aboutFounderName}
              </div>
              
              <h1 className="font-serif text-white leading-[0.8] tracking-tighter mb-6 md:mb-12 text-balance animate-in slide-in-from-bottom-12 duration-1000" style={{ fontSize: 'clamp(2rem, 7vw, 7rem)' }}>
                  {settings.aboutHeroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block" : "block"}>{word}</span>
                  ))}
              </h1>

              <p className="text-sm md:text-2xl text-slate-400 font-light leading-relaxed italic text-pretty border-l border-primary/30 pl-4 md:pl-10">
                "{settings.aboutHeroSubtitle}"
              </p>
           </div>
        </div>
      </div>

      {/* Narrative Spread - Side-by-Side on all devices */}
      <section className="py-12 md:py-48 max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-12 gap-4 md:gap-32">
            
            {/* Smaller Sidebar Column (Always Side-by-Side) */}
            <div className="col-span-4 h-fit">
                <div className="bg-white p-4 md:p-16 rounded-2xl md:rounded-[3rem] shadow-xl border border-slate-50 space-y-8 md:space-y-16 relative overflow-hidden">
                    <div className="space-y-4 text-left relative z-10">
                        <div className="flex items-center gap-2 text-primary">
                           <div className="p-1.5 md:p-3 bg-primary/10 rounded-lg md:rounded-2xl">{renderIcon(settings.aboutMissionIcon, <Target size={16}/>)}</div>
                           <h4 className="text-xs md:text-2xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                        </div>
                        <p className="text-[8px] md:text-sm text-slate-500 leading-tight md:leading-relaxed font-light">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-4 text-left relative z-10">
                        <div className="flex items-center gap-2 text-primary">
                           <div className="p-1.5 md:p-3 bg-primary/10 rounded-lg md:rounded-2xl">{renderIcon(settings.aboutCommunityIcon, <Users size={16}/>)}</div>
                           <h4 className="text-xs md:text-2xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                        </div>
                        <p className="text-[8px] md:text-sm text-slate-500 leading-tight md:leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                    </div>

                    {settings.aboutSignatureImage && (
                       <div className="pt-4 md:pt-12 border-t border-slate-100 flex flex-col items-center">
                          <img src={settings.aboutSignatureImage} className="h-10 md:h-24 w-auto object-contain opacity-40 mix-blend-multiply" alt="Sig" />
                       </div>
                    )}
                </div>
            </div>

            {/* Main Story Column (Always Side-by-Side) */}
            <div className="col-span-8 text-left">
                <div className="flex items-center gap-2 md:gap-6 mb-4 md:mb-12">
                   <div className="h-[1px] md:h-[2px] w-8 md:w-20 bg-primary"></div>
                   <span className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.4em] text-primary">The Manifesto</span>
                </div>
                
                <h3 className="text-lg md:text-7xl font-serif text-slate-900 mb-6 md:mb-16 leading-[1] tracking-tighter">
                   {settings.aboutHistoryTitle}
                </h3>
                
                <div className="text-slate-500 font-light leading-relaxed text-[10px] md:text-lg">
                    <div className="whitespace-pre-wrap 
                      first-letter:text-4xl md:first-letter:text-8xl 
                      first-letter:font-serif 
                      first-letter:font-black 
                      first-letter:text-slate-900 
                      first-letter:float-left 
                      first-letter:mr-2 md:first-letter:mr-8 
                      first-letter:leading-none
                    ">
                        {settings.aboutHistoryBody}
                    </div>
                </div>

                {settings.aboutGalleryImages && (
                  <div className="mt-12 md:mt-56 grid grid-cols-3 gap-2 md:gap-12">
                    {settings.aboutGalleryImages.slice(0,3).map((img, i) => (
                      <div key={i} className="rounded-xl md:rounded-[4rem] overflow-hidden shadow-lg aspect-[3/4]">
                        <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                      </div>
                    ))}
                  </div>
                )}
            </div>
        </div>
      </section>

      {/* Shrink down Transparency Block - side-by-side row */}
      <section className="py-12 md:py-40 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
           <div className="flex flex-row items-center gap-6 md:gap-20 text-left">
              
              {/* Icon & Title Group */}
              <div className="w-1/3 flex flex-col items-start gap-3">
                 <div className="p-3 md:p-6 bg-white/5 rounded-xl md:rounded-3xl border border-white/10 text-primary animate-soft-flicker">
                    {renderIcon(settings.aboutIntegrityIcon, <Award size={24}/>)}
                 </div>
                 <h2 className="text-base md:text-6xl font-serif tracking-tight leading-tight">
                    {settings.aboutIntegrityTitle}
                 </h2>
              </div>

              {/* Body Text Group */}
              <div className="w-2/3 border-l border-white/10 pl-6 md:pl-20">
                 <p className="text-xs md:text-4xl font-light text-slate-300 leading-tight italic">
                    "{settings.aboutIntegrityBody}"
                 </p>
                 <div className="mt-6 flex flex-row gap-4 md:gap-12 opacity-50">
                    <div className="flex flex-col gap-1">
                       <Heart size={12} className="text-primary"/>
                       <span className="text-[6px] md:text-[10px] font-black uppercase tracking-widest">Verified</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <Calendar size={12} className="text-primary"/>
                       <span className="text-[6px] md:text-[10px] font-black uppercase tracking-widest">Fresh</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <MapPin size={12} className="text-primary"/>
                       <span className="text-[6px] md:text-[10px] font-black uppercase tracking-widest">Global</span>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Editorial Footer Meta */}
      <div className="py-10 border-t border-slate-100 text-center bg-white relative">
         <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-40">
            <p className="text-[7px] md:text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Narrative Verified: {lastUpdatedDate}</p>
            <span className="font-mono text-[7px] md:text-[9px] text-slate-400">AB-992-JOURNEY-025</span>
         </div>
      </div>

    </div>
  );
};

export default About;