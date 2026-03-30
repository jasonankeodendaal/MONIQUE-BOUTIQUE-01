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
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          
          {/* Text Column */}
          <div className="w-full md:w-1/2 text-left relative z-20">
            <div className="inline-flex items-center gap-3 mb-6 md:mb-10">
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                {settings.homeAboutNarrativeLabel || 'The Curation Narrative'}
              </span>
              <div className="h-px w-12 bg-primary/30"></div>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-8 md:mb-12 leading-[1.1] tracking-tighter" style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}>
              {settings.homeAboutTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? "italic font-light text-primary" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            
            <div className="relative mb-10 md:mb-16 pl-6 md:pl-10 border-l-2 border-primary/20">
              <p className="text-sm md:text-2xl text-slate-700 font-light leading-relaxed italic">
                "{settings.homeAboutDescription}"
              </p>
            </div>

            <Link 
              to="/about" 
              className="group inline-flex items-center gap-6"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-500 shadow-lg">
                <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900 group-hover:text-primary transition-colors">
                {settings.homeAboutCta}
              </span>
            </Link>
          </div>

          {/* Image Column (Cinematic Side) */}
          <div className="w-full md:w-1/2 relative z-10">
            <div className="relative group">
              {/* Abstract Frame */}
              <div className="absolute -inset-4 border border-slate-100 rounded-[3rem] -z-10 group-hover:scale-105 transition-transform duration-1000"></div>
              
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                <img 
                  src={settings.homeAboutImage} 
                  alt={settings.aboutFounderName} 
                  loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined}
                  className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-[3s] group-hover:scale-110"
                />
                
                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 md:w-48 md:h-48 bg-white rounded-full shadow-2xl flex items-center justify-center p-6 text-center transform rotate-12 group-hover:rotate-0 transition-transform duration-700 border border-slate-50">
                <div className="flex flex-col items-center">
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-primary mb-2" />
                  <span className="text-[8px] md:text-[10px] font-serif italic text-slate-900 leading-tight">
                    Est. {settings.aboutEstablishedYear || '2024'} <br/>
                    <span className="font-sans not-italic font-black uppercase tracking-widest text-[6px] md:text-[8px] text-primary mt-1 block">
                      Excellence
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;