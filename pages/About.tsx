
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
      
      {/* --- REFINED EDITORIAL HERO: FREE FLOATING IMAGE --- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center bg-white pt-24 pb-12 md:py-0 overflow-hidden">
        
        {/* Massive Background Brand Text (Subtle Layer) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        >
          <span className="text-[20vw] font-serif font-black text-slate-50 whitespace-nowrap tracking-tighter leading-none">
            {settings.companyName} {settings.aboutEstablishedYear}
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Column */}
            <div className="order-2 lg:order-1 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-left duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4">
                  <div className="h-px w-12 bg-primary"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Narrative</span>
                </div>
                
                <h1 className="font-serif text-slate-900 leading-[0.95] tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>
                   {settings.aboutHeroTitle.split(' ').slice(0, -2).join(' ')} <br/>
                   <span className="italic font-light text-primary">{settings.aboutHeroTitle.split(' ').slice(-2).join(' ')}</span>
                </h1>

                <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-xl border-l-2 border-primary/20 pl-8">
                  {settings.aboutHeroSubtitle}
                </p>
              </div>

              {/* Identity Details */}
              <div className="flex items-center gap-8 md:gap-12">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Est.</span>
                    <span className="text-xl font-serif font-bold text-slate-900">{settings.aboutEstablishedYear}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-100"></div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Location</span>
                    <span className="text-xl font-serif font-bold text-slate-900">{settings.aboutLocation}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-100"></div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Curator</span>
                    <span className="text-xl font-serif font-bold text-slate-900">{settings.aboutFounderName.split(' ')[0]}</span>
                 </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <button 
                  onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
                  className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all duration-500 group shadow-2xl"
                >
                   <ArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
                </button>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Scroll to Discover</span>
              </div>
            </div>

            {/* Image Column: FREE FLOATING IMPLEMENTATION */}
            <div className="order-1 lg:order-2 relative group flex justify-center items-center">
              {/* Boxed containers removed to allow image to float */}
              <div className="relative w-full flex items-center justify-center">
                <img 
                  src={settings.aboutMainImage} 
                  alt="The Curator" 
                  className="w-full h-auto max-h-[75vh] object-contain animate-in zoom-in-95 duration-1000 transition-transform group-hover:scale-[1.03] drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                />
                
                {/* Floating Signature Overlay - Now overlaps the free image more naturally */}
                <div className="absolute -bottom-4 right-0 w-32 md:w-56 opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 transform group-hover:-rotate-3 group-hover:translate-x-2">
                  <img src={settings.aboutSignatureImage} alt="Signature" className="w-full h-auto" />
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full flex items-center justify-center text-slate-900 p-4 text-center shadow-2xl rotate-12 animate-soft-flicker z-20">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight">Verified Curation</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROFESSIONAL NARRATIVE SECTION --- */}
      <section className="py-16 md:py-56 max-w-7xl mx-auto px-6 md:px-12 relative border-t border-slate-50">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-32">
          
          {/* Detailed Context Column */}
          <div className="w-full md:w-5/12">
             <div className="md:sticky md:top-32 space-y-6 md:space-y-12">
                <div className="p-8 md:p-12 bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] text-white shadow-[0_50px_80px_-20px_rgba(15,23,42,0.4)] relative overflow-hidden group border border-white/5 transition-all duration-500 hover:-translate-y-2">
                  <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-primary mb-8 md:mb-12 block">The Philosophy</h3>
                  
                  <div className="space-y-8 md:space-y-12">
                    <div className="space-y-2 md:space-y-4 text-left">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                         {renderIcon(settings.aboutMissionIcon, <Target size={18}/>, 18)}
                      </div>
                      <h4 className="text-lg md:text-2xl font-serif text-white">{settings.aboutMissionTitle}</h4>
                      <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-2 md:space-y-4 text-left">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 border border-white/10 shadow-lg">
                         {renderIcon(settings.aboutCommunityIcon, <Users size={18}/>, 18)}
                      </div>
                      <h4 className="text-lg md:text-2xl font-serif text-white">{settings.aboutCommunityTitle}</h4>
                      <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm text-center transition-all hover:shadow-xl group">
                   <div className="flex justify-center items-center gap-2 text-primary mb-2 group-hover:scale-105 transition-transform">
                      <Award size={20} />
                      <span className="text-sm md:text-base font-serif text-slate-900 italic">Certified Curation Service</span>
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Transparency Protocol 03-A</p>
                </div>
             </div>
          </div>

          {/* Narrative Text Column */}
          <div className="w-full md:w-7/12 text-left">
            <div className="space-y-8 md:space-y-20">
               <div>
                  <h2 className="text-4xl md:text-8xl font-serif text-slate-900 tracking-tighter leading-[1.1] md:leading-none mb-8 md:mb-16">
                    {settings.aboutHistoryTitle}
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-base md:text-2xl text-slate-500 font-light leading-relaxed first-letter:text-5xl md:first-letter:text-8xl first-letter:font-serif first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-4 md:first-letter:mr-8 first-letter:mt-2 md:first-letter:mt-4 whitespace-pre-wrap">
                      {settings.aboutHistoryBody}
                    </p>
                  </div>
               </div>

               {/* Integrity Highlight */}
               <div className="p-8 md:p-16 bg-slate-50 border border-slate-100 rounded-[3rem] md:rounded-[5rem] relative overflow-hidden group shadow-sm transition-all hover:shadow-2xl">
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center text-primary shadow-xl flex-shrink-0">
                        {renderIcon(settings.aboutIntegrityIcon, <ShieldCheck size={32}/>, 32)}
                     </div>
                     <div className="text-center md:text-left">
                        <h4 className="text-xl md:text-3xl font-serif text-slate-900 mb-2">{settings.aboutIntegrityTitle}</h4>
                        <p className="text-sm md:text-lg text-slate-500 font-light leading-relaxed italic">
                          "{settings.aboutIntegrityBody}"
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GALLERY SPREAD --- */}
      {settings.aboutGalleryImages && settings.aboutGalleryImages.length > 0 && (
        <section className="py-20 md:py-48 bg-white border-t border-slate-50 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-40 gap-8">
                 <div className="text-left w-full md:w-1/2">
                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-primary block mb-4 md:mb-8">Aesthetic Archive</span>
                    <h2 className="text-5xl md:text-9xl font-serif text-slate-900 tracking-tighter leading-none">
                       Curated <br/> <span className="italic font-light text-primary">Moments.</span>
                    </h2>
                 </div>
                 <p className="text-slate-400 text-sm md:text-xl font-light max-w-md text-left w-full md:w-1/2 leading-relaxed">
                    Every piece in our archive undergoes a rigorous aesthetic audit before entering the collection. These frames represent our core visual identity.
                 </p>
              </div>

              {/* HIGH DENSITY 3D GALLERY */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-16">
                 {settings.aboutGalleryImages.slice(0,4).map((img, i) => (
                    <div 
                      key={i} 
                      className={`group relative overflow-hidden rounded-[2rem] md:rounded-full shadow-2xl transition-all duration-700 hover:-translate-y-8 hover:scale-105 ${i % 2 !== 0 ? 'md:mt-32' : 'md:-mt-12'}`}
                    >
                       <img 
                        src={img} 
                        className="w-full h-auto aspect-[3/5] object-cover transition-transform duration-[10s] group-hover:scale-110 grayscale group-hover:grayscale-0" 
                        alt={`Gallery ${i}`} 
                       />
                       <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] md:rounded-full"></div>
                       <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Meta Footer Section */}
      <div className="py-12 md:py-24 border-t border-slate-100 text-center bg-white">
         <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-row justify-between items-center opacity-30">
            <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.6em]">Synchronized: {lastUpdatedDate}</p>
            <div className="flex items-center gap-4 md:gap-8">
               <span className="font-mono text-[8px] md:text-[10px] text-slate-400">CUR-ARCH-99-PRO</span>
               <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
               <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Domain Ref</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default About;
