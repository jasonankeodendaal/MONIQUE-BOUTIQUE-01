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
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          {/* Text Column */}
          <div className="w-full md:w-1/2 text-left relative z-20">
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-primary/80">{settings.homeAboutNarrativeLabel || 'The Curation Narrative'}</span>
              <div className="h-[1px] w-16 bg-primary/20"></div>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-10 leading-[1.1] tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              {settings.homeAboutTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? "italic font-light text-primary/80" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            
            <div className="relative mb-12 pl-8 border-l border-primary/10">
              <p className="text-lg md:text-xl text-slate-900 font-light leading-relaxed italic">
                "{settings.homeAboutDescription}"
              </p>
            </div>

            <Link 
              to="/about" 
              className="group inline-flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ArrowRight size={20} className="text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 group-hover:text-primary transition-colors">
                {settings.homeAboutCta}
              </span>
            </Link>
          </div>

          {/* Image Column with Abstract Frame (Moved to Right and Faded) */}
          <div className="w-full md:w-1/2 relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:opacity-20 md:scale-110 pointer-events-none z-10">
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