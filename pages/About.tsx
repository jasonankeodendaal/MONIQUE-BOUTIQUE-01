
import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
// Added ShieldCheck to imports
import { Target, Users, Award, Star, Quote, Sparkles, MapPin, Calendar, Heart, ArrowDown, ChevronRight, MousePointer2, ShieldCheck } from 'lucide-react';
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
      
      {/* --- UPGRADED EDITORIAL HERO: LAYERED SPREAD --- */}
      <section className="relative min-h-[90vh] md:min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
        
        {/* Background Layer: Kinetic Brand Text */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        >
          <span className="text-[25vw] font-serif font-black text-slate-900/[0.03] whitespace-nowrap tracking-tighter shadow-none leading-none">
            {settings.companyName} {settings.aboutEstablishedYear}
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center relative z-10">
          
          {/* Narrative Column */}
          <div className="lg:col-span-7 text-left order-2 lg:order-1 lg:pr-20">
             <div className="space-y-8 md:space-y-12">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-flex items-center gap-4 mb-6">
                    <div className="h-px w-12 bg-primary"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Narrative</span>
                  </div>
                  
                  <h1 className="font-serif text-slate-900 leading-[0.9] tracking-tighter mb-8" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
                     {settings.aboutHeroTitle.split(' ').slice(0, -2).join(' ')} <br/>
                     <span className="italic font-light text-primary">{settings.aboutHeroTitle.split(' ').slice(-2).join(' ')}</span>
                  </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:items-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                   <div className="max-w-md">
                      <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 border-l-2 border-slate-100 pl-8">
                        {settings.aboutHeroSubtitle}
                      </p>
                      
                      {/* Integrated Identity Badge */}
                      <div className="flex items-center gap-10">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Est.</span>
                            <span className="text-xl font-serif font-bold text-slate-900">{settings.aboutEstablishedYear}</span>
                         </div>
                         <div className="w-px h-8 bg-slate-200"></div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Location</span>
                            <span className="text-xl font-serif font-bold text-slate-900">{settings.aboutLocation}</span>
                         </div>
                         <div className="w-px h-8 bg-slate-200"></div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Curator</span>
                            <span className="text-xl font-serif font-bold text-slate-900">{settings.aboutFounderName.split(' ')[0]}</span>
                         </div>
                      </div>
                   </div>

                   {settings.aboutSignatureImage && (
                     <div className="hidden md:block pt-4">
                        <img src={settings.aboutSignatureImage} className="h-24 w-auto object-contain opacity-40 grayscale mix-blend-multiply" alt="Signature" />
                     </div>
                   )}
                </div>
                
                <div className="flex items-center gap-6 pt-8 animate-in fade-in zoom-in duration-1000 delay-500">
                   <button 
                    onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
                    className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all duration-500 group shadow-2xl"
                   >
                      <ArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
                   </button>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Explore the archive</span>
                </div>
             </div>
          </div>

          {/* Visual Column: Organic Arch Frame */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end relative">
             <div 
               className="relative w-full aspect-[4/5] max-w-[500px] animate-in zoom-in fade-in duration-1000"
               style={{ transform: `translateY(${scrollY * 0.05}px)` }}
             >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 border border-primary/20 rounded-full animate-soft-flicker"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary rounded-2xl rotate-12 z-20 shadow-xl flex items-center justify-center text-slate-900">
                   <Sparkles size={20} />
                </div>

                {/* Main Frame */}
                <div className="relative h-full w-full overflow-hidden rounded-t-[15rem] rounded-b-[2rem] border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-100 group">
                   <img 
                    src={settings.aboutMainImage} 
                    className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" 
                    alt="Founder"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                {/* Floating Glass Tag */}
                <div className="absolute top-2/3 -right-6 md:-right-12 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-2xl flex flex-col items-start gap-1 z-30">
                   <span className="text-[8px] font-black uppercase tracking-widest text-primary">Chief Curator</span>
                   <h4 className="text-xl font-serif text-slate-900">{settings.aboutFounderName}</h4>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- PROFESSIONAL NARRATIVE SECTION --- */}
      <section className="py-24 md:py-56 max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-32">
          
          {/* Detailed Context Column */}
          <div className="md:col-span-5 order-2 md:order-1">
             <div className="sticky top-32 space-y-12">
                <div className="p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-12 block">The Philosophy</h3>
                  
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                         {renderIcon(settings.aboutMissionIcon, <Target size={20}/>)}
                      </div>
                      <h4 className="text-xl font-serif text-white">{settings.aboutMissionTitle}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 border border-white/10">
                         {renderIcon(settings.aboutCommunityIcon, <Users size={20}/>)}
                      </div>
                      <h4 className="text-xl font-serif text-white">{settings.aboutCommunityTitle}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl hover:border-primary/20 transition-all text-center">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-4">Official Verification</span>
                   <div className="flex justify-center items-center gap-4 text-primary mb-2">
                      <Award size={24} />
                      <span className="text-2xl font-serif text-slate-900 italic">Certified Affiliate</span>
                   </div>
                   <p className="text-xs text-slate-400 font-light">Transparency & Trust in every selection.</p>
                </div>
             </div>
          </div>

          {/* Narrative Text Column */}
          <div className="md:col-span-7 order-1 md:order-2 text-left">
            <div className="space-y-12 md:space-y-20">
               <div>
                  <h2 className="text-4xl md:text-8xl font-serif text-slate-900 tracking-tighter leading-none mb-12">
                    {settings.aboutHistoryTitle}
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-6 first-letter:mt-2 whitespace-pre-wrap">
                      {settings.aboutHistoryBody}
                    </p>
                  </div>
               </div>

               {/* Integrity Highlight */}
               <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-lg flex-shrink-0">
                        {renderIcon(settings.aboutIntegrityIcon, <ShieldCheck size={32}/>)}
                     </div>
                     <div>
                        <h4 className="text-xl font-serif text-slate-900 mb-2">{settings.aboutIntegrityTitle}</h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed italic">
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
        <section className="py-24 md:py-48 bg-white border-t border-slate-50">
           <div className="max-w-[1600px] mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-32 gap-8">
                 <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-6">Aesthetic Archive</span>
                    <h2 className="text-4xl md:text-8xl font-serif text-slate-900 tracking-tighter leading-none">
                       Curated <br/> <span className="italic font-light text-primary">Moments.</span>
                    </h2>
                 </div>
                 <p className="text-slate-400 text-sm md:text-lg font-light max-w-sm text-left">
                    Every piece in our archive undergoes a rigorous aesthetic and quality audit before entering the collection.
                 </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                 {settings.aboutGalleryImages.slice(0,4).map((img, i) => (
                    <div key={i} className={`group relative overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl ${i % 2 !== 0 ? 'md:mt-24' : ''}`}>
                       <img 
                        src={img} 
                        className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                        alt={`Gallery ${i}`} 
                       />
                       <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Editorial Page Meta */}
      <div className="py-12 border-t border-slate-100 text-center bg-white">
         <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
            <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.5em]">Narrative Synchronization: {lastUpdatedDate}</p>
            <div className="flex items-center gap-4">
               <span className="font-mono text-[9px] text-slate-400">BUILD: CUR-ARCH-99-PRO</span>
               <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Public Domain Reference</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default About;
