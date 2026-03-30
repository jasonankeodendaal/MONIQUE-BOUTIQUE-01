import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-20 md:py-40 bg-[#FAF9F6] overflow-hidden relative">
      {/* Abstract Background Elements - Softer and more layered */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[#F5F1EE] -skew-x-12 translate-x-1/3 z-0 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-row items-center gap-4 md:gap-24 mb-20 md:mb-32">
          
          {/* Text Column - 2 Column Side-by-Side on Mobile */}
          <div className="w-[55%] md:w-1/2 text-left relative z-20">
            <div className="inline-flex items-center gap-2 md:gap-4 mb-4 md:mb-10">
              <div className="w-6 md:w-12 h-px bg-primary/30"></div>
              <span className="text-[6px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-primary/70">{settings.homeAboutNarrativeLabel || 'The Curation Narrative'}</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-4 md:mb-12 leading-[0.95] tracking-tighter" style={{ fontSize: 'clamp(1.25rem, 5vw, 5.5rem)' }}>
              {settings.homeAboutTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? "italic font-light text-primary/60 block md:inline" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            
            <div className="relative mb-6 md:mb-14 pl-3 md:pl-10 border-l-2 border-primary/10">
              <p className="text-[9px] md:text-2xl text-slate-800 font-light leading-relaxed italic line-clamp-5 md:line-clamp-none">
                "{settings.homeAboutDescription}"
              </p>
            </div>

            <Link 
              to="/about" 
              className="group inline-flex items-center gap-3 md:gap-8"
            >
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-700 shadow-lg group-hover:shadow-primary/20">
                <ArrowRight className="w-4 h-4 md:w-8 md:h-8 text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-slate-900 group-hover:text-primary transition-colors">
                  {settings.homeAboutCta}
                </span>
                <div className="h-px w-0 group-hover:w-full bg-primary transition-all duration-500 mt-1"></div>
              </div>
            </Link>
          </div>

          {/* Image Column - 2 Column Side-by-Side on Mobile */}
          <div className="w-[45%] md:w-1/2 relative z-10">
            <div className="relative">
              {/* Soft Abstract Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[60px] md:blur-[100px] opacity-40"></div>
              
              <div className="relative z-10 overflow-hidden rounded-[2rem] md:rounded-[4rem] shadow-2xl border-[6px] md:border-[16px] border-white transform rotate-2 hover:rotate-0 transition-transform duration-1000">
                <img 
                  src={settings.homeAboutImage} 
                  alt={settings.aboutFounderName} 
                  loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined}
                  className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-[5s] hover:scale-110"
                />
                
                {/* Subtle Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              </div>
              
              {/* Floating Badge - 1 Column Style on Mobile */}
              <div className="absolute -bottom-6 -left-6 md:-bottom-16 md:-left-16 w-20 h-20 md:w-56 md:h-56 bg-white/90 backdrop-blur-2xl rounded-full border border-slate-100 shadow-2xl flex flex-col items-center justify-center p-3 md:p-10 text-center z-20 animate-bounce-slow">
                <Sparkles className="w-3 h-3 md:w-8 md:h-8 text-primary mb-1 md:mb-3" />
                <span className="text-[6px] md:text-[11px] font-serif italic text-slate-900 leading-tight">
                  Est. {settings.aboutEstablishedYear || '2024'} <br/> 
                  <span className="font-sans font-black uppercase tracking-widest text-[4px] md:text-[8px] text-primary mt-1 block">Curation Excellence</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3 COLUMN SIDE-BY-SIDE ON MOBILE --- */}
        <div className="grid grid-cols-3 gap-3 md:gap-12 pt-12 md:pt-24 border-t border-slate-200/60">
           {[
             { label: 'Authenticity', value: '100%', sub: 'Verified Source' },
             { label: 'Curation', value: 'Elite', sub: 'Hand-Picked' },
             { label: 'Delivery', value: 'Global', sub: 'Secure Transit' }
           ].map((stat, idx) => (
             <div key={idx} className="text-center group">
                <span className="block text-[5px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 md:mb-4 group-hover:text-primary transition-colors">
                  {stat.label}
                </span>
                <span className="block text-sm md:text-5xl font-serif text-slate-900 mb-1 md:mb-2 tracking-tighter">
                  {stat.value}
                </span>
                <span className="block text-[4px] md:text-[9px] font-medium text-slate-300 uppercase tracking-widest">
                  {stat.sub}
                </span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;