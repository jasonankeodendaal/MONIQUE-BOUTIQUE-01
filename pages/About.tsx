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
    return IconComponent ? <IconComponent size={32} /> : defaultIcon;
  };

  return (
    <div className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Editorial Hero Spread (Phase 1B: High-Fidelity Split Screen) */}
      <div className="relative h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
        
        {/* Fixed Background Text Layer for Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block">
           <span className="text-[25vw] font-serif font-black text-white/[0.03] leading-none select-none tracking-tighter">EST. {settings.aboutEstablishedYear}</span>
        </div>

        {/* Left Side: Parallax Image */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden">
           <div 
             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-110"
             style={{ 
               backgroundImage: `url(${settings.aboutMainImage})`,
               transform: `translateY(${scrollY * 0.1}px) scale(${1.1 + scrollY * 0.0001})`
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/10 to-slate-950/40 lg:to-slate-950"></div>
           
           {/* Vertical "Narrative" Sidebar Label */}
           <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8">
              <div className="w-px h-24 bg-primary/40"></div>
              <span className="text-[10px] font-black uppercase tracking-[1em] text-primary -rotate-90 origin-center whitespace-nowrap">THE JOURNEY</span>
              <div className="w-px h-24 bg-primary/40"></div>
           </div>
        </div>
        
        {/* Right Side: Content Matrix */}
        <div className="w-full lg:w-1/2 flex items-center p-8 md:p-16 lg:p-24 relative z-10">
           <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.6em] mb-12 border border-primary/20">
                  <Sparkles size={14} className="animate-pulse"/> {settings.aboutFounderName}
              </div>
              
              <h1 className="font-serif text-white leading-[0.8] tracking-tighter mb-12 text-balance animate-in slide-in-from-bottom-12 duration-1000" style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)' }}>
                  {settings.aboutHeroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block" : "block"}>{word}</span>
                  ))}
              </h1>

              <div className="relative mb-12 pl-12 group">
                 <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-transparent group-hover:h-full transition-all duration-1000"></div>
                 <p className="text-xl md:text-3xl text-slate-400 font-light leading-relaxed italic text-pretty group-hover:text-white transition-colors duration-500">
                    "{settings.aboutHeroSubtitle}"
                 </p>
              </div>

              <div className="flex flex-wrap gap-10 pt-12 border-t border-white/10">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Location</span>
                    <span className="text-lg font-serif text-white flex items-center gap-2">
                       <MapPin size={16} className="text-primary" /> {settings.aboutLocation}
                    </span>
                 </div>
                 <div className="flex flex-col border-l border-white/10 pl-10">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Est.</span>
                    <span className="text-lg font-serif text-white flex items-center gap-2">
                       <Calendar size={16} className="text-primary" /> {settings.aboutEstablishedYear}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 animate-bounce text-primary/40">
           <span className="text-[8px] font-black uppercase tracking-[0.5em]">Scroll</span>
           <ArrowDown size={14} />
        </div>
      </div>

      {/* Main Narrative Spread (Phase 1B: Two-column text flow & Drop Caps) */}
      <section className="py-24 md:py-48 max-w-7xl mx-auto px-6 sm:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-32">
            
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit order-2 lg:order-1">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 space-y-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    
                    <div className="space-y-6 text-left relative z-10">
                        <div className="flex items-center gap-4 text-primary mb-6">
                           <div className="p-3 bg-primary/10 rounded-2xl">{renderIcon(settings.aboutMissionIcon, <Target size={28}/>)}</div>
                           <h4 className="text-2xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed font-light">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-6 text-left relative z-10">
                        <div className="flex items-center gap-4 text-primary mb-6">
                           <div className="p-3 bg-primary/10 rounded-2xl">{renderIcon(settings.aboutCommunityIcon, <Users size={28}/>)}</div>
                           <h4 className="text-2xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                    </div>

                    {settings.aboutSignatureImage && (
                       <div className="pt-12 border-t border-slate-100 flex flex-col items-center relative z-10">
                          <img 
                            src={settings.aboutSignatureImage} 
                            alt="Founder Signature" 
                            className="h-24 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity duration-700 mb-4 mix-blend-multiply" 
                          />
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em]">The Authenticity Seal</span>
                       </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-8 order-1 lg:order-2 text-left">
                <div className="flex items-center gap-6 mb-12">
                   <div className="h-[2px] w-20 bg-primary"></div>
                   <span className="text-[12px] font-black uppercase tracking-[0.8em] text-primary">The Manifesto</span>
                </div>
                
                <h3 className="text-4xl md:text-7xl font-serif text-slate-900 mb-16 leading-[0.9] tracking-tighter text-balance">
                   {settings.aboutHistoryTitle}
                </h3>
                
                {/* Editorial Columns with Drop Cap */}
                <div className="md:columns-2 gap-16 text-slate-500 font-light leading-relaxed text-lg text-pretty">
                    <div className="whitespace-pre-wrap 
                      first-letter:text-8xl 
                      first-letter:font-serif 
                      first-letter:font-black 
                      first-letter:text-slate-900 
                      first-letter:float-left 
                      first-letter:mr-8 
                      first-letter:mt-4
                      first-letter:leading-[0.8]
                      [&>p]:mb-6
                    ">
                        {settings.aboutHistoryBody}
                    </div>
                </div>

                {/* Staggered Editorial Gallery (Phase 1B: Offset Layout) */}
                {settings.aboutGalleryImages && settings.aboutGalleryImages.length > 0 && (
                  <div className="mt-32 md:mt-56 grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 items-start">
                    {settings.aboutGalleryImages.map((img, i) => (
                      <div 
                        key={i} 
                        className={`
                          rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl 
                          transition-all duration-1000 group
                          ${i === 0 ? 'lg:translate-y-20 lg:scale-105' : ''}
                          ${i === 1 ? 'lg:-translate-y-12' : ''}
                          ${i === 2 ? 'lg:translate-y-32' : ''}
                          ${i > 2 && i % 2 === 0 ? 'lg:translate-y-16' : ''}
                        `}
                      >
                         <div className="relative overflow-hidden aspect-[3/4]">
                           <img 
                            src={img} 
                            alt={`Moment ${i}`} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                           />
                           <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
        </div>
      </section>

      {/* Trust & Transparency Block (Enhanced Contrast & Shrinked for Mobile) */}
      <section className="py-16 md:py-64 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary-color) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
           <div className="inline-block p-4 md:p-10 bg-white/5 rounded-2xl md:rounded-3xl mb-8 md:mb-16 backdrop-blur-3xl border border-white/10 text-primary shadow-2xl animate-soft-flicker">
              {renderIcon(settings.aboutIntegrityIcon, <Award className="w-8 h-8 md:w-14 md:h-14"/>)}
           </div>
           
           <h2 className="text-3xl md:text-8xl font-serif mb-8 md:mb-12 tracking-tight leading-none text-balance">
              {settings.aboutIntegrityTitle}
           </h2>
           
           <div className="relative mb-12 md:mb-20">
              <Quote className="absolute -top-8 -left-2 md:-top-20 md:-left-16 text-primary/10 w-12 h-12 md:w-48 md:h-48 -z-10" />
              <p className="text-lg md:text-5xl font-light text-slate-300 leading-tight italic text-balance">
                "{settings.aboutIntegrityBody}"
              </p>
           </div>

           <div className="flex flex-wrap justify-center gap-6 md:gap-24 border-t border-white/10 pt-12 md:pt-20">
              <div className="flex flex-col items-center group">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500">
                    <Heart className="w-5 h-5 md:w-7 md:h-7"/>
                 </div>
                 <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-white transition-colors">Verified Pieces</span>
              </div>
              <div className="flex flex-col items-center group">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500">
                    <Calendar className="w-5 h-5 md:w-7 md:h-7"/>
                 </div>
                 <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-white transition-colors">Refreshed Daily</span>
              </div>
              <div className="flex flex-col items-center group">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500">
                    <MapPin className="w-5 h-5 md:w-7 md:h-7"/>
                 </div>
                 <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-white transition-colors">Global Selection</span>
              </div>
           </div>
        </div>
      </section>

      {/* Editorial Footer Meta */}
      <div className="py-20 border-t border-slate-100 text-center bg-white relative">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.6em]">Narrative Authenticity Verified: {lastUpdatedDate}</p>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Document No.</span>
               <span className="font-mono text-[9px] px-2 py-1 bg-slate-50 text-slate-400 rounded">AB-992-JOURNEY-025</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default About;