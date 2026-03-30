import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-20 md:py-32 bg-[#FAF9F6] overflow-hidden relative">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F5F1EE] -skew-x-12 translate-x-1/4 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-row items-center gap-6 md:gap-24">
          
          {/* Text Column */}
          <div className="w-1/2 md:w-1/2 text-left relative z-20">
            <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-8">
              <span className="text-[6px] md:text-[10px] font-medium uppercase tracking-[0.2em] md:tracking-[0.5em] text-primary/80">{settings.homeAboutNarrativeLabel || 'The Curation Narrative'}</span>
              <div className="h-[1px] w-4 md:w-16 bg-primary/20"></div>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-4 md:mb-10 leading-[1.1] tracking-tighter" style={{ fontSize: 'clamp(1rem, 4vw, 4.5rem)' }}>
              {settings.homeAboutTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? "italic font-light text-primary/80" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            
            <div className="relative mb-6 md:mb-12 pl-3 md:pl-8 border-l border-primary/10">
              <p className="text-[8px] md:text-xl text-slate-900 font-light leading-relaxed italic line-clamp-4 md:line-clamp-none">
                "{settings.homeAboutDescription}"
              </p>
            </div>

            <Link 
              to="/about" 
              className="group inline-flex items-center gap-2 md:gap-6"
            >
              <div className="w-8 h-8 md:w-14 md:h-14 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ArrowRight className="w-3 h-3 md:w-5 md:h-5 text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[7px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.4em] text-slate-900 group-hover:text-primary transition-colors">
                {settings.homeAboutCta}
              </span>
            </Link>
          </div>

          {/* Image Column with Abstract Frame */}
          <div className="w-1/2 md:w-1/2 relative z-10">
            <div className="relative">
              {/* Soft Abstract Shape behind image */}
              <div className="absolute -top-4 -left-4 md:-top-8 md:-left-8 w-32 h-32 md:w-64 md:h-64 bg-primary/10 rounded-full blur-2xl md:blur-3xl opacity-60"></div>
              
              <div className="relative z-10 overflow-hidden rounded-[1.5rem] md:rounded-[3rem] shadow-xl md:shadow-2xl border-[4px] md:border-[12px] border-white">
                <img 
                  src={settings.homeAboutImage} 
                  alt={settings.aboutFounderName} 
                  loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined}
                  className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-[3s] hover:scale-105"
                />
              </div>
              
              {/* Floating Abstract Element */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-10 md:-right-10 w-16 h-16 md:w-40 md:h-40 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 shadow-lg md:shadow-xl flex items-center justify-center p-2 md:p-8 text-center">
                <span className="text-[5px] md:text-[9px] font-serif italic text-slate-800 leading-tight">
                  Est. {settings.aboutEstablishedYear || '2024'} <br/> <span className="hidden md:inline">Curation Excellence</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;