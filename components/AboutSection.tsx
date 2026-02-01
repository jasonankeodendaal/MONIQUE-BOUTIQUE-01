
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  // Safety fallbacks to prevent "split of null" errors
  const title = settings.homeAboutTitle || "Me and My Story.";
  const description = settings.homeAboutDescription || "";
  const cta = settings.homeAboutCta || "Read More";
  const image = settings.homeAboutImage || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200";

  return (
    <section className="py-16 md:py-40 bg-[#FDFCFB] overflow-visible relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-32">
          
          <div className="w-full lg:w-5/12 relative">
            <div className="relative z-10 group">
              <div className="hidden md:block absolute -inset-10 bg-primary/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <img 
                src={image} 
                alt={settings.aboutFounderName || "Founder"} 
                className="w-full h-auto aspect-[3/4] object-cover rounded-[2rem] md:rounded-[4rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] relative z-10 transition-all duration-700 group-hover:-translate-y-4 group-hover:rotate-1"
              />
              
              <div className="hidden md:block absolute -top-10 -right-10 w-40 h-40 border-t-2 border-r-2 border-primary/20 rounded-tr-[4rem] z-20 pointer-events-none"></div>
              <div className="hidden md:block absolute -bottom-10 -left-10 w-40 h-40 border-b-2 border-l-2 border-primary/20 rounded-bl-[4rem] z-20 pointer-events-none"></div>

              {/* Founder Tag - Enhanced */}
              <div className="absolute -bottom-6 -right-6 md:bottom-12 md:-right-12 z-30 bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/50 flex flex-col items-start min-w-[180px] md:min-w-[260px] transform transition-transform duration-500 hover:scale-105 group-hover:translate-x-2">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Founder & Curator</span>
                 </div>
                 <h4 className="text-xl md:text-3xl font-serif text-slate-900 mb-3">{settings.aboutFounderName || "Curator"}</h4>
                 <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full"></div>
                 </div>
                 {settings.aboutSignatureImage && (
                    <img src={settings.aboutSignatureImage} className="h-8 w-auto object-contain mt-4 opacity-50" alt="Signature" />
                 )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-6/12 text-left">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Curation Philosophy</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-8 leading-[0.9] tracking-tighter text-balance" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
              {title.split(' ').slice(0, 2).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary">{title.split(' ').slice(2).join(' ')}</span>
            </h2>
            
            <div className="relative mb-10">
              <Quote className="absolute -top-6 -left-8 text-primary/10 w-16 h-16 -z-10" />
              <p className="text-base md:text-2xl text-slate-500 font-light leading-relaxed text-pretty italic">
                {description}
              </p>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-6 group"
            >
              <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 group-hover:text-primary transition-colors">
                {cta}
              </span>
              <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary transition-all duration-300 shadow-xl group-hover:scale-110">
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
