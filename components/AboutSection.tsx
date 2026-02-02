import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote, UserCheck, PenTool } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  const title = settings.homeAboutTitle || "Me and My Story.";
  const description = settings.homeAboutDescription || "";
  const cta = settings.homeAboutCta || "Read My Story";
  const image = settings.homeAboutImage || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200";

  return (
    <section className="py-20 md:py-48 bg-[#FDFCFB] overflow-visible relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          
          <div className="w-full lg:w-5/12 relative">
            <div className="relative z-10 group">
              {/* Decorative Blur Background */}
              <div className="hidden md:block absolute -inset-10 bg-primary/5 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-2xl">
                <img 
                  src={image} 
                  alt={settings.aboutFounderName || "Founder"} 
                  className="w-full h-auto aspect-[3/4] object-cover relative z-10 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
              </div>
              
              {/* Founder Signature Tag */}
              <div className="absolute -bottom-8 -right-4 md:bottom-12 md:-right-12 z-30 bg-white/95 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col items-start min-w-[200px] md:min-w-[300px] transform transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Founder & Curator</span>
                 </div>
                 <h4 className="text-2xl md:text-4xl font-serif text-slate-900 mb-4">{settings.aboutFounderName || "The Curator"}</h4>
                 
                 {settings.aboutSignatureImage ? (
                    <img src={settings.aboutSignatureImage} className="h-12 w-auto object-contain mt-2 opacity-70 group-hover:opacity-100 transition-opacity" alt="Signature" />
                 ) : (
                    <div className="h-0.5 w-12 bg-primary/30"></div>
                 )}
                 
                 <div className="mt-6 pt-6 border-t border-slate-100 w-full flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Verified Expert</span>
                    </div>
                    <PenTool size={14} className="opacity-20" />
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12 text-left">
            <div className="flex items-center gap-4 mb-8">
              <Sparkles size={18} className="text-primary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">The Journey Behind the Bridge</span>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-10 leading-[0.85] tracking-tighter text-balance" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}>
              {title.split(' ').slice(0, 2).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary">{title.split(' ').slice(2).join(' ')}</span>
            </h2>
            
            <div className="relative mb-12">
              <Quote className="absolute -top-10 -left-12 text-primary/10 w-24 h-24 -z-10" />
              <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed text-pretty italic border-l-4 border-primary/20 pl-8 md:pl-12">
                {description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
               <div className="p-6 bg-white rounded-3xl border border-slate-100 hover:border-primary/20 transition-colors group/item">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                    <Sparkles size={20} />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-widest">Hand-Picked</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">No algorithms. Every piece is selected based on personal industry experience.</p>
               </div>
               <div className="p-6 bg-white rounded-3xl border border-slate-100 hover:border-primary/20 transition-colors group/item">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                    <UserCheck size={20} />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-widest">High Trust</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">Bridging you directly to verified luxury retailers with secure checkout.</p>
               </div>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-8 group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 group-hover:text-primary transition-colors">
                  {cta}
                </span>
                <div className="h-0.5 w-full bg-slate-900 mt-2 group-hover:bg-primary transition-all"></div>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:bg-primary transition-all duration-500 shadow-2xl group-hover:scale-110 active:scale-95">
                <ArrowRight size={20} className="md:w-7 md:h-7 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;