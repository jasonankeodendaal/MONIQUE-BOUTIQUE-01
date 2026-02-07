import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-12 md:py-36 bg-copper-wash overflow-hidden relative border-y border-slate-200/40 section-vignette">
      <div className="max-w-7xl mx-auto px-4 md:px-20">
        {/* Decorative Background Shadow with Rose gold hint */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/[0.04] blur-[150px] pointer-events-none"></div>

        <div className="flex flex-row items-start gap-6 md:gap-24 relative z-10">
          
          {/* Smaller Image Column with increased depth */}
          <div className="w-1/3 md:w-4/12 relative">
            <div className="relative z-10 group">
              {/* Stacked Shadow Effect */}
              <div className="absolute -inset-2 bg-[#B76E79]/5 rounded-[4.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-2xl md:rounded-[4rem] shadow-2xl transition-all duration-1000 group-hover:-translate-y-4">
                <img 
                  src={settings.homeAboutImage} 
                  alt={settings.aboutFounderName} 
                  className="w-full h-auto aspect-[3/4] object-cover relative z-10 transition-transform duration-[2s] group-hover:scale-105"
                />
              </div>
              
              {/* Founder Tag with Glassmorphism and Depth */}
              <div className="absolute -bottom-4 -right-2 md:bottom-12 md:-right-10 z-30 glass-card p-3 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(183,110,121,0.2)] border border-white/60 flex flex-col items-start min-w-[100px] md:min-w-[240px] transform group-hover:translate-x-2 transition-transform duration-700">
                 <span className="text-[6px] md:text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-1 md:mb-3 text-contrast-shadow">The Curator</span>
                 <h4 className="text-[10px] md:text-3xl font-serif text-slate-900 leading-tight">{settings.aboutFounderName}</h4>
              </div>
            </div>
          </div>

          {/* Smaller Text Column */}
          <div className="w-2/3 md:w-8/12 text-left min-w-0 flex flex-col justify-center py-4">
            <div className="flex items-center gap-3 mb-4 md:mb-10">
              <div className="p-2 bg-[#B76E79]/10 rounded-full">
                <Sparkles size={14} className="text-[#B76E79] md:w-6 md:h-6" />
              </div>
              <span className="text-[8px] md:text-[13px] font-black uppercase tracking-[0.5em] text-slate-400">The Curation Narrative</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-4 md:mb-12 leading-[1.1] tracking-tighter text-pretty break-words drop-shadow-sm" style={{ fontSize: 'clamp(1.5rem, 5vw, 5.5rem)' }}>
              {settings.homeAboutTitle.split(' ').slice(0, -2).join(' ')} <br/>
              <span className="italic font-light text-primary text-contrast-shadow">
                {settings.homeAboutTitle.split(' ').slice(-2).join(' ')}
              </span>
            </h2>
            
            <div className="relative mb-6 md:mb-16">
              <p className="text-sm md:text-2xl text-slate-500 font-light leading-relaxed text-pretty pr-2 md:pr-16 line-clamp-6 max-w-4xl break-words relative z-10">
                {settings.homeAboutDescription}
              </p>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-3 md:gap-10 group self-start"
            >
              <span className="text-[9px] md:text-[16px] font-black uppercase tracking-[0.3em] text-slate-900 group-hover:text-primary transition-all border-b-2 border-slate-200 group-hover:border-primary pb-1">
                {settings.homeAboutCta}
              </span>
              <div className="w-8 h-8 md:w-20 md:h-20 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary group-hover:text-slate-900 transition-all duration-700 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] group-hover:shadow-primary/40">
                <ArrowRight size={14} className="md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;