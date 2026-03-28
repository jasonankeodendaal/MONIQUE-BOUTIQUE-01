import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-24 md:py-48 bg-white overflow-hidden relative border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Decorative Background Shadow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-primary/[0.02] blur-[150px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32 relative z-10">
          
          {/* Image Column */}
          <div className="w-full md:w-5/12 relative">
            <div className="relative z-10 group">
              <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-2xl transition-all duration-1000 group-hover:-translate-y-2">
                <img 
                  src={settings.homeAboutImage} 
                  alt={settings.aboutFounderName} 
                  loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined}
                  className="w-full h-auto aspect-[4/5] object-cover relative z-10 transition-transform duration-[2s] group-hover:scale-105"
                />
              </div>
              
              {/* Founder Tag */}
              <div className="absolute -bottom-6 -right-4 md:bottom-12 md:-right-12 z-30 bg-white/90 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-start min-w-[180px] md:min-w-[280px] transform group-hover:translate-x-2 transition-transform duration-700">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 md:mb-4">{settings.homeAboutCuratorLabel || 'The Curator'}</span>
                 <h4 className="text-xl md:text-4xl font-serif text-slate-900 leading-tight">{settings.aboutFounderName}</h4>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full md:w-7/12 text-left">
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100">
                <Sparkles size={20} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-slate-400">{settings.homeAboutNarrativeLabel || 'The Curation Narrative'}</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-8 md:mb-16 leading-[1.1] tracking-tighter text-pretty" style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)' }}>
              {settings.homeAboutTitle.split(' ').slice(0, -2).join(' ')} <br/>
              <span className="italic font-light text-primary">
                {settings.homeAboutTitle.split(' ').slice(-2).join(' ')}
              </span>
            </h2>
            
            <div className="relative mb-10 md:mb-20">
              <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed text-pretty max-w-3xl italic">
                "{settings.homeAboutDescription}"
              </p>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-6 md:gap-12 group"
            >
              <span className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-slate-900 group-hover:text-primary transition-all border-b border-slate-200 group-hover:border-primary pb-2">
                {settings.homeAboutCta}
              </span>
              <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary group-hover:text-slate-900 transition-all duration-700 shadow-xl group-hover:shadow-primary/20">
                <ArrowRight size={20} className="md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;