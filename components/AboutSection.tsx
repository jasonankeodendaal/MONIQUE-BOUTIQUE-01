
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  // Truncate logic: tighter teaser for side-by-side layout on mobile
  const getTeaser = (text: string) => {
    if (text.length <= 125) return text;
    return text.slice(0, 120).trim() + "...";
  };

  return (
    <section className="py-8 md:py-24 bg-[#FDFCFB] overflow-visible relative border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-20">
        <div className="flex flex-row items-center gap-4 md:gap-16 lg:gap-24">
          
          {/* Image Container - Fixed ratio side-by-side */}
          <div className="w-[35%] md:w-4/12 lg:w-3/12 flex-shrink-0 relative">
            <div className="relative z-10 group">
              <div className="hidden md:block absolute -inset-4 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <img 
                src={settings.homeAboutImage} 
                alt={settings.aboutFounderName} 
                className="w-full h-auto aspect-[4/5] object-cover rounded-2xl md:rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-10 transition-all duration-700 group-hover:-translate-y-2"
              />
              
              <div className="hidden md:block absolute -top-4 -right-4 w-16 h-16 border-t border-r border-primary/30 rounded-tr-[2rem] z-20 pointer-events-none"></div>
              <div className="hidden md:block absolute -bottom-4 -left-4 w-16 h-16 border-b border-l border-primary/30 rounded-bl-[2rem] z-20 pointer-events-none"></div>

              {/* Founder Tag - Responsive sizing */}
              <div className="absolute -bottom-2 -right-1 md:bottom-8 md:-right-8 z-30 bg-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-slate-50 flex flex-col items-start min-w-[80px] md:min-w-[160px] transition-transform duration-500 group-hover:scale-105">
                 <span className="text-[5px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-0.5 md:mb-1">The Curator</span>
                 <h4 className="text-[8px] md:text-lg font-serif text-slate-900 leading-tight truncate w-full">{settings.aboutFounderName}</h4>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-[65%] md:w-8/12 lg:w-9/12 text-left">
            <div className="flex items-center gap-2 mb-2 md:mb-6">
              <Sparkles size={12} className="text-primary md:w-4 md:h-4" />
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-400">The Narrative</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-3 md:mb-8 leading-[1.1] tracking-tighter text-balance" style={{ fontSize: 'clamp(1.1rem, 4vw, 4.5rem)' }}>
              {settings.homeAboutTitle.split(' ').slice(0, -2).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary">{settings.homeAboutTitle.split(' ').slice(-2).join(' ')}</span>
            </h2>
            
            <div className="relative mb-4 md:mb-10">
              <Quote className="absolute -top-3 -left-3 md:-top-8 md:-left-8 text-primary/10 w-6 h-6 md:w-16 md:h-16 -z-10" />
              <p className="text-[10px] md:text-2xl text-slate-500 font-light leading-relaxed text-pretty italic pr-2 md:pr-12">
                {getTeaser(settings.homeAboutDescription)}
              </p>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-3 md:gap-6 group"
            >
              <span className="text-[7px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-900 group-hover:text-primary transition-colors border-b border-transparent group-hover:border-primary pb-1">
                {settings.homeAboutCta}
              </span>
              <div className="w-6 h-6 md:w-12 md:h-12 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500 shadow-lg group-hover:shadow-primary/20">
                <ArrowRight size={10} className="md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
