import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-8 md:py-32 bg-[#FDFCFB] overflow-hidden relative border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-20">
        {/* Forced Flex-Row for Side-by-Side on Mobile */}
        <div className="flex flex-row items-start gap-4 md:gap-24">
          
          {/* Smaller Image Column */}
          <div className="w-1/3 md:w-4/12 relative">
            <div className="relative z-10 group">
              <img 
                src={settings.homeAboutImage} 
                alt={settings.aboutFounderName} 
                className="w-full h-auto aspect-[3/4] object-cover rounded-2xl md:rounded-[4rem] shadow-xl relative z-10 transition-all duration-1000 group-hover:-translate-y-2"
              />
              
              {/* Smaller Founder Tag */}
              <div className="absolute -bottom-2 -right-1 md:bottom-12 md:-right-10 z-30 bg-white p-2 md:p-6 rounded-xl md:rounded-[2rem] shadow-2xl border border-slate-50 flex flex-col items-start min-w-[80px] md:min-w-[200px]">
                 <span className="text-[5px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5 md:mb-2">The Curator</span>
                 <h4 className="text-[8px] md:text-2xl font-serif text-slate-900 leading-tight">{settings.aboutFounderName}</h4>
              </div>
            </div>
          </div>

          {/* Smaller Text Column */}
          <div className="w-2/3 md:w-8/12 text-left">
            <div className="flex items-center gap-2 mb-2 md:mb-8">
              <Sparkles size={12} className="text-primary md:w-5 md:h-5" />
              <span className="text-[7px] md:text-[12px] font-black uppercase tracking-[0.4em] text-slate-400">The Narrative</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-3 md:mb-12 leading-[1] tracking-tighter text-pretty" style={{ fontSize: 'clamp(1.2rem, 4vw, 5.5rem)' }}>
              {settings.homeAboutTitle.split(' ').slice(0, -2).join(' ')} <span className="italic font-light text-primary">{settings.homeAboutTitle.split(' ').slice(-2).join(' ')}</span>
            </h2>
            
            <div className="relative mb-4 md:mb-16">
              {/* Added line-clamp-5 to restrict the preview description length */}
              <p className="text-xs md:text-3xl text-slate-500 font-light leading-relaxed text-pretty pr-2 md:pr-20 line-clamp-5">
                {settings.homeAboutDescription}
              </p>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 md:gap-8 group"
            >
              <span className="text-[7px] md:text-[14px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-primary transition-colors border-b border-transparent group-hover:border-primary pb-1">
                {settings.homeAboutCta}
              </span>
              <div className="w-6 h-6 md:w-16 md:h-16 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500 shadow-xl">
                <ArrowRight size={10} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;