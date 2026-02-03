import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, UserCheck, PenTool } from 'lucide-react';
import { useSettings } from '../App';
import SignatureHeader from './SignatureHeader';

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
              <div className="hidden md:block absolute -inset-10 bg-primary/5 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-2xl transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]">
                <img 
                  src={image} 
                  alt={settings.aboutFounderName || "Founder"} 
                  className="w-full h-auto aspect-[3/4] object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
              </div>
              
              <div className="absolute -bottom-8 -right-4 md:bottom-12 md:-right-12 z-30 bg-white/95 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col items-start min-w-[200px] md:min-w-[300px] transform transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Founder & Curator</span>
                 </div>
                 <h4 className="text-2xl md:text-4xl font-serif text-slate-900 mb-4">{settings.aboutFounderName || "The Curator"}</h4>
                 
                 {settings.aboutSignatureImage ? (
                    <img src={settings.aboutSignatureImage} className="h-12 w-auto object-contain mt-2 opacity-70 group-hover:opacity-100 transition-opacity" alt="Signature" />
                 ) : (
                    <div className="h-0.5 w-12 bg-primary/30 mt-4"></div>
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

          <div className="w-full lg:w-6/12 text-left">
             <SignatureHeader />
             
             <h2 className="text-4xl md:text-7xl font-serif text-slate-900 mb-10 leading-[0.9] tracking-tighter">
                {title.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{title.split(' ').slice(-1)}</span>
             </h2>
             
             <div className="prose prose-lg text-slate-500 font-light leading-relaxed mb-12">
                <p>{description}</p>
             </div>

             <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-primary hover:text-slate-900 transition-all shadow-xl active:scale-95 group"
                >
                  {cta}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;