import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-20 md:py-32 bg-[#FDFCFB] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          
          {/* Image Side with Personal Branding Touch */}
          <div className="w-full md:w-5/12 relative order-1 md:order-1">
            <div className="relative z-10 group">
              <div className="hidden md:block absolute -inset-10 bg-primary/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]">
                 <img 
                    src={settings.homeAboutImage} 
                    alt="Founder Story" 
                    className="w-full h-auto aspect-[3/4] object-cover transform transition-transform duration-[1.5s] group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                 
                 {/* Signature/Name overlay for personal branding */}
                 <div className="absolute bottom-8 left-8 text-white">
                    <p className="font-serif italic text-2xl">{settings.aboutFounderName || 'The Curator'}</p>
                 </div>
              </div>

              {/* Decorative elements */}
              <div className="hidden md:block absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-primary/30 rounded-tr-[3rem] z-20 pointer-events-none"></div>
              <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-primary/30 rounded-bl-[3rem] z-20 pointer-events-none"></div>
            </div>
          </div>

          {/* Story Content Side */}
          <div className="w-full md:w-6/12 order-2 md:order-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-6 md:mb-8">
              <span className="w-12 h-px bg-primary"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">My Journey</span>
            </div>
            
            {/* Fluid Text Headline */}
            <h2 className="font-serif text-slate-900 mb-8 leading-[1.1] tracking-tight text-balance" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              {settings.homeAboutTitle}
            </h2>
            
            <div className="relative mb-10">
               <Quote size={48} className="absolute -top-6 -left-6 text-primary/10 -z-10 fill-current hidden md:block" />
               <p className="text-base md:text-lg text-slate-500 font-light leading-loose text-pretty">
                 {settings.homeAboutDescription}
               </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
               <Link 
                 to="/about" 
                 className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-primary hover:text-slate-900 transition-all duration-300 shadow-xl shadow-slate-900/10 group"
               >
                 <span className="text-xs font-black uppercase tracking-[0.2em]">
                   {settings.homeAboutCta || 'Read Full Story'}
                 </span>
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               
               <div className="flex items-center gap-4 text-slate-400">
                  <div className="h-px w-8 bg-slate-200"></div>
                  <span className="font-serif italic text-sm">Est. {settings.aboutEstablishedYear || '2024'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;