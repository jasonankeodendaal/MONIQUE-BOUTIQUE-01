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
        <div className="flex flex-row items-center gap-8 md:gap-24">
          
          {/* Text Column */}
          <div className="w-1/2 md:w-1/2 text-left relative z-20">
            <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
              <span className="text-[7px] md:text-[10px] font-medium uppercase tracking-[0.3em] md:tracking-[0.5em] text-primary/80">{settings.homeAboutNarrativeLabel || 'The Curation Narrative'}</span>
              <div className="h-[1px] w-8 md:w-16 bg-primary/20"></div>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-6 md:mb-10 leading-[1.1] tracking-tighter" style={{ fontSize: 'clamp(1.2rem, 4vw, 4.5rem)' }}>
              {settings.homeAboutTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? "italic font-light text-primary/80" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            
            <div className="relative mb-8 md:mb-12 pl-4 md:pl-8 border-l border-primary/10">
              <p className="text-[10px] md:text-xl text-slate-900 font-light leading-relaxed italic line-clamp-3 md:line-clamp-none">
                "{settings.homeAboutDescription}"
              </p>
              <Link to="/about" className="md:hidden text-[8px] font-bold uppercase tracking-widest text-primary mt-2 inline-block">
                Read More +
              </Link>
            </div>

            <Link 
              to="/about" 
              className="group inline-flex items-center gap-3 md:gap-6"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-900 group-hover:text-primary transition-colors">
                {settings.homeAboutCta}
              </span>
            </Link>
          </div>

          {/* Image Column with Abstract Frame (Moved to Right and Faded) */}
          <div className="w-1/2 md:w-1/2 relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 opacity-40 md:opacity-20 md:scale-110 pointer-events-none z-10">
            <div className="relative">
              {/* Soft Abstract Shape behind image */}
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
              
              <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl border-[12px] border-white">
                <img 
                  src={settings.homeAboutImage} 
                  alt={settings.aboutFounderName} 
                  loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined}
                  className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-[3s] hover:scale-105"
                />
              </div>
              
              {/* Floating Abstract Element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 shadow-xl flex items-center justify-center p-8 text-center hidden md:flex">
                <span className="text-[9px] font-serif italic text-slate-800 leading-tight">
                  Est. 2024 <br/> Curation Excellence
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