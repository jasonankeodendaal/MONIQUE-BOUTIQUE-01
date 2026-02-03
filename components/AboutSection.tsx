
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-6 md:py-12 bg-[#FDFCFB] overflow-visible relative border-y border-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-row items-center gap-6 md:gap-16">
          
          <div className="w-5/12 lg:w-4/12 relative">
            <div className="relative z-10 group">
              <div className="hidden md:block absolute -inset-6 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <img 
                src={settings.homeAboutImage} 
                alt={settings.aboutFounderName} 
                className="w-full h-auto aspect-square object-cover rounded-[1rem] md:rounded-[2rem] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative z-10 transition-all duration-700 group-hover:-translate-y-1"
              />
              
              <div className="hidden md:block absolute -top-4 -right-4 w-16 h-16 border-t border-r border-primary/20 rounded-tr-[2rem] z-20 pointer-events-none"></div>
              <div className="hidden md:block absolute -bottom-4 -left-4 w-16 h-16 border-b border-l border-primary/20 rounded-bl-[2rem] z-20 pointer-events-none"></div>

              {/* Founder Tag */}
              <div className="absolute -bottom-1 -right-1 md:bottom-6 md:-right-6 z-30 bg-white p-1.5 md:p-4 rounded-lg md:rounded-2xl shadow-lg border border-slate-100 flex flex-col items-start min-w-[80px] md:min-w-[150px]">
                 <span className="text-[5px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-0.5">The Curator</span>
                 <h4 className="text-[8px] md:text-lg font-serif text-slate-900 leading-tight">{settings.aboutFounderName}</h4>
              </div>
            </div>
          </div>

          <div className="w-7/12 lg:w-7/12 text-left">
            <div className="flex items-center gap-2 mb-1.5 md:mb-4">
              <Sparkles size={10} className="text-primary md:w-3.5 md:h-3.5" />
              <span className="text-[6px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400">Our Story</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-2 md:mb-6 leading-[1.1] tracking-tighter text-balance" style={{ fontSize: 'clamp(1.1rem, 3.5vw, 3.5rem)' }}>
              {settings.homeAboutTitle.split(' ').slice(0, 2).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary">{settings.homeAboutTitle.split(' ').slice(2).join(' ')}</span>
            </h2>
            
            <div className="relative mb-3 md:mb-8">
              <Quote className="absolute -top-1.5 -left-2 md:-top-4 md:-left-6 text-primary/10 w-4 h-4 md:w-12 md:h-12 -z-10" />
              <p className="text-[9px] md:text-lg text-slate-500 font-light leading-relaxed text-pretty italic line-clamp-3 md:line-clamp-4">
                {settings.homeAboutDescription}
              </p>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-1.5 md:gap-4 group"
            >
              <span className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-900 group-hover:text-primary transition-colors">
                {settings.homeAboutCta}
              </span>
              <div className="w-5 h-5 md:w-10 md:h-10 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary transition-all duration-300 shadow-md">
                <ArrowRight size={8} className="md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
