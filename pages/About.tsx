
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

  const renderIcon = (iconName: string, defaultIcon: React.ReactNode) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={24} /> : defaultIcon;
  };

  return (
    <div className={`min-h-screen bg-sand overflow-x-hidden transition-opacity duration-1000 shrink-fit ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      <style>{` .shrink-fit { width: 100%; max-width: 100vw; } `}</style>
      
      {/* Editorial Hero Spread */}
      <div className="relative min-h-[90vh] lg:h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950 pt-16 lg:pt-0">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative overflow-hidden">
           <div 
             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
             style={{ backgroundImage: `url(${settings.aboutMainImage})`, transform: `translateY(${scrollY * 0.1}px) scale(${1.1})` }}
           />
           <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent to-slate-950"></div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center p-8 md:p-16 lg:p-24 relative z-10 bg-slate-950 lg:bg-transparent">
           <div className="max-w-xl text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-primary/20">{settings.aboutFounderName}</span>
              <h1 className="font-serif text-white leading-[0.85] tracking-tighter mb-10" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
                  {settings.aboutHeroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block" : "block"}>{word}</span>
                  ))}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed italic border-l-2 border-primary/40 pl-6">{settings.aboutHeroSubtitle}</p>
           </div>
        </div>
      </div>

      <section className="py-24 md:py-40 bg-copper-wash relative section-vignette shrink-fit">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 md:gap-24">
              <div className="w-full lg:col-span-4 h-fit lg:sticky lg:top-40">
                  <div className="glass-card p-10 rounded-[2.5rem] shadow-xl space-y-12 bg-white/40">
                      <div className="space-y-4 text-left">
                          <div className="flex items-center gap-4 text-primary">
                             {renderIcon(settings.aboutMissionIcon, <Target size={24}/>)}
                             <h4 className="text-xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-light">{settings.aboutMissionBody}</p>
                      </div>
                      <div className="space-y-4 text-left">
                          <div className="flex items-center gap-4 text-primary">
                             {renderIcon(settings.aboutCommunityIcon, <Users size={24}/>)}
                             <h4 className="text-xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                      </div>
                      {settings.aboutSignatureImage && (
                         <div className="pt-10 border-t border-slate-200/60 flex flex-col items-center">
                            <img src={settings.aboutSignatureImage} className="h-16 w-auto object-contain opacity-40 mix-blend-multiply" alt="Sign" />
                         </div>
                      )}
                  </div>
              </div>

              <div className="w-full lg:col-span-8 text-left min-w-0">
                  <div className="flex items-center gap-6 mb-10">
                     <div className="h-[2px] w-16 bg-primary"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The Narrative</span>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-serif text-slate-900 mb-12 tracking-tighter">{settings.aboutHistoryTitle}</h3>
                  <div className="text-slate-600 font-light leading-relaxed text-lg md:text-xl break-words whitespace-pre-wrap">
                      {settings.aboutHistoryBody}
                  </div>
                  {settings.aboutGalleryImages && (
                    <div className="mt-20 grid grid-cols-2 gap-6">
                      {settings.aboutGalleryImages.slice(0,2).map((img, i) => (
                        <div key={i} className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[3/4]">
                          <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                        </div>
                      ))}
                    </div>
                  )}
              </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white shrink-fit">
        <div className="max-w-6xl mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 text-left">
              <div className="w-full md:w-1/3 flex flex-col items-start gap-6">
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-primary">{renderIcon(settings.aboutIntegrityIcon, <Award size={40}/>)}</div>
                 <h2 className="text-4xl md:text-5xl font-serif tracking-tight">{settings.aboutIntegrityTitle}</h2>
              </div>
              <div className="w-full md:w-2/3 border-l-2 border-primary/20 pl-8">
                 <p className="text-xl md:text-3xl font-light text-slate-300 leading-tight italic">{settings.aboutIntegrityBody}</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
