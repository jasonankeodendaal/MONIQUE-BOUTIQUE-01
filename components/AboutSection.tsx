
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-12 md:py-32 bg-[#FDFCFB] overflow-visible relative border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-24">
          
          <div className="w-full md:w-5/12 lg:w-4/12 relative">
            <div className="relative z-10 group">
              <div className="hidden md:block absolute -inset-8 bg-primary/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <img 
                src={settings.homeAboutImage} 
                alt={settings.aboutFounderName} 
                className="w-full h-auto aspect-[4/5] object-cover rounded-[2rem] md:rounded-[4rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] relative z-10 transition-all duration-1000 group-hover:-translate-y-4"
              />
              
              <div className="hidden md:block absolute -top-8 -right-8 w-32 h-32 border-t-2 border-r-2 border-primary/30 rounded-tr-[4rem] z-20 pointer-events-none"></div>
              <div className="hidden md:block absolute -bottom-8 -left-8 w-32 h-32 border-b-2 border-l-2 border-primary/30 rounded-bl-[4rem] z-20 pointer-events-none"></div>

              {/* Founder Tag */}
              <div className="absolute -bottom-4 -right-2 md:bottom-12 md:-right-10 z-30 bg-white p-3 md:p-6 rounded-2xl md:rounded-[2rem] shadow-2xl border border-slate-50 flex flex-col items-start min-w-[120px] md:min-w-[200px] transition-transform duration-500 group-hover:scale-110">
                 <span className="text-[6px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1 md:mb-2">The Curator</span>
                 <h4 className="text-xs md:text-2xl font-serif text-slate-900 leading-tight">{settings.aboutFounderName}</h4>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12 lg:w-8/12 text-left">
            <div className="flex items-center gap-3 mb-4 md:mb-8">
              <Sparkles size={16} className="text-primary md:w-5 md:h-5" />
              <span className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-slate-400">The Narrative</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-6 md:mb-12 leading-[1] tracking-tighter text-balance" style={{ fontSize: 'clamp(2.5rem, 6vw, 6.5rem)' }}>
              {settings.homeAboutTitle.split(' ').slice(0, -2).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary">{settings.homeAboutTitle.split(' ').slice(-2).join(' ')}</span>
            </h2>
            
            <div className="relative mb-10 md:mb-16">
              <Quote className="absolute -top-6 -left-6 md:-top-10 md:-left-12 text-primary/10 w-12 h-12 md:w-24 md:h-24 -z-10" />
              <p className="text-lg md:text-3xl text-slate-500 font-light leading-relaxed text-pretty italic pr-4 md:pr-20">
                {settings.homeAboutDescription}
              </p>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-4 md:gap-8 group"
            >
              <span className="text-[9px] md:text-[14px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-900 group-hover:text-primary transition-colors border-b-2 border-transparent group-hover:border-primary pb-2">
                {settings.homeAboutCta}
              </span>
              <div className="w-10 h-10 md:w-16 md:h-16 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500 shadow-xl group-hover:shadow-primary/30">
                <ArrowRight size={16} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
