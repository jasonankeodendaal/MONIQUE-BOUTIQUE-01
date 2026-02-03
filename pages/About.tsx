
import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, Star, Quote, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const About: React.FC = () => {
  const { settings } = useSettings();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const renderIcon = (iconName: string, defaultIcon: React.ReactNode) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={32} /> : defaultIcon;
  };

  return (
    <div className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Editorial Hero Spread */}
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative overflow-hidden">
           <img 
            src={settings.aboutMainImage} 
            alt={settings.aboutFounderName} 
            className="w-full h-full object-cover scale-105 animate-kenburns"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/40 lg:to-slate-950"></div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center p-8 md:p-24 relative z-10">
           <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-12 border border-primary/20">
                  <Sparkles size={14}/> The Creative Vision
              </div>
              
              <h1 className="font-serif text-white leading-[0.85] tracking-tighter mb-10 text-balance" style={{ fontSize: 'clamp(3.5rem, 10vw, 8.5rem)' }}>
                  {settings.aboutHeroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block" : "block"}>{word}</span>
                  ))}
              </h1>

              <div className="relative mb-12 pl-12">
                 <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-transparent"></div>
                 <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed italic text-pretty">
                    "{settings.aboutHeroSubtitle}"
                 </p>
              </div>

              <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Established</span>
                    <span className="text-lg font-serif text-white">{settings.aboutEstablishedYear}</span>
                 </div>
                 <div className="flex flex-col border-l border-white/10 pl-8">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Curation Origin</span>
                    <span className="text-lg font-serif text-white">{settings.aboutLocation}</span>
                 </div>
                 <div className="flex flex-col border-l border-white/10 pl-8">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Curator</span>
                    <span className="text-lg font-serif text-white">{settings.aboutFounderName}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Narrative Spread */}
      <section className="py-24 md:py-48 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-32">
            
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit order-2 lg:order-1">
                <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-50 space-y-12">
                    <div className="space-y-6 text-left">
                        <div className="flex items-center gap-3 text-primary mb-4">
                           {renderIcon(settings.aboutMissionIcon, <Target size={32}/>)}
                           <h4 className="text-xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-6 text-left">
                        <div className="flex items-center gap-3 text-primary mb-4">
                           {renderIcon(settings.aboutCommunityIcon, <Users size={32}/>)}
                           <h4 className="text-xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">{settings.aboutCommunityBody}</p>
                    </div>

                    {settings.aboutSignatureImage && (
                       <div className="pt-8 border-t border-slate-100 flex flex-col items-center">
                          <img src={settings.aboutSignatureImage} alt="Founder Signature" className="h-20 w-auto object-contain opacity-60 mb-4" />
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]">Signature of Quality</span>
                       </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-8 order-1 lg:order-2 text-left">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-px w-12 bg-primary"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The Narrative</span>
                </div>
                
                <h3 className="text-3xl md:text-6xl font-serif text-slate-900 mb-12 leading-tight tracking-tighter">
                   {settings.aboutHistoryTitle}
                </h3>
                
                <div className="columns-1 md:columns-2 gap-12 text-slate-500 font-light leading-loose text-lg text-pretty">
                    <div className="whitespace-pre-wrap first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-slate-900 first-letter:float-left first-letter:mr-6 first-letter:mt-1">
                        {settings.aboutHistoryBody}
                    </div>
                </div>

                {/* Gallery Spread */}
                {settings.aboutGalleryImages && settings.aboutGalleryImages.length > 0 && (
                  <div className="mt-24 md:mt-40 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {settings.aboutGalleryImages.map((img, i) => (
                      <div key={i} className={`rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl hover:-translate-y-4 transition-transform duration-700 ${i % 2 === 0 ? 'mt-8 md:mt-16' : ''}`}>
                         <img src={img} alt={`Moment ${i}`} className="w-full h-full object-cover aspect-[3/4]" />
                      </div>
                    ))}
                  </div>
                )}
            </div>
        </div>
      </section>

      {/* Trust & Transparency Block */}
      <section className="py-24 md:py-48 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
           <div className="inline-block p-4 md:p-6 bg-white/5 rounded-3xl mb-12 backdrop-blur-xl border border-white/10 text-primary">
              {renderIcon(settings.aboutIntegrityIcon, <Award size={48}/>)}
           </div>
           
           <h2 className="text-3xl md:text-7xl font-serif mb-10 tracking-tight leading-none">
              {settings.aboutIntegrityTitle}
           </h2>
           
           <p className="text-xl md:text-3xl font-light text-slate-400 leading-relaxed mb-16 italic text-balance">
              "{settings.aboutIntegrityBody}"
           </p>

           <div className="flex flex-wrap justify-center gap-10 md:gap-20">
              <div className="flex flex-col items-center">
                 <Heart className="text-primary mb-3" size={24}/>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Verified Curations</span>
              </div>
              <div className="flex flex-col items-center">
                 <Calendar className="text-primary mb-3" size={24}/>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Updated Daily</span>
              </div>
              <div className="flex flex-col items-center">
                 <MapPin className="text-primary mb-3" size={24}/>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Global Presence</span>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

export default About;
