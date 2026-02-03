import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, UserCheck, PenTool } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  const title = settings.homeAboutTitle || "The Narrative.";
  const description = settings.homeAboutDescription || "Every selection tells a story.";
  const cta = settings.homeAboutCta || "Read My Story";
  const image = settings.homeAboutImage || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200";

  return (
    <section className="py-24 md:py-56 bg-[#FDFCFB] overflow-visible relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
          
          <div className="w-full lg:w-5/12 relative">
            <div className="relative z-10 group">
              <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-2xl transition-all duration-1000 group-hover:shadow-primary/5">
                <img 
                  src={image} 
                  alt={settings.aboutFounderName || "Founder"} 
                  className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-[5s] group-hover:scale-110"
                />
              </div>
              
              <div className="absolute -bottom-10 -right-4 md:bottom-12 md:-right-12 z-30 bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-start min-w-[240px] transform transition-all duration-700 group-hover:translate-x-4">
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-2">Curator Identity</span>
                 <h4 className="text-3xl font-serif text-slate-900 mb-6">{settings.aboutFounderName || "The Curator"}</h4>
                 
                 {settings.aboutSignatureImage ? (
                    <img src={settings.aboutSignatureImage} className="h-10 w-auto object-contain opacity-60" alt="Signature" />
                 ) : (
                    <div className="h-0.5 w-12 bg-primary/30"></div>
                 )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-6/12 text-left">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 block flex items-center gap-3">
                <Sparkles size={14} /> The Visionary Bridge
             </span>
             
             <h2 className="text-5xl md:text-8xl font-serif text-slate-900 mb-12 leading-[0.85] tracking-tighter">
                {title}
             </h2>
             
             <div className="prose prose-xl prose-slate text-slate-500 font-light leading-relaxed mb-16 max-w-xl">
                <p className="whitespace-pre-wrap">{description}</p>
             </div>
             
             <Link 
               to="/about"
               className="inline-flex items-center gap-6 px-12 py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 group"
             >
                {cta}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;