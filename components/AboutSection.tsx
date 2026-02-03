
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, UserCheck, PenTool, Quote, ShieldCheck } from 'lucide-react';
import { useSettings } from '../App';
import Signature from './Signature';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  const title = settings?.homeAboutTitle || "Me and My Story.";
  const description = settings?.homeAboutDescription || "A personal journey of curation and taste.";
  const cta = settings?.homeAboutCta || "Read My Story";
  const image = settings?.homeAboutImage || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200";

  // Safe splitting logic
  const titleWords = title.split(' ');
  const mainTitlePart = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : title;
  const lastTitleWord = titleWords.length > 1 ? titleWords.slice(-1) : "";

  return (
    <section className="py-32 md:py-64 bg-[#FDFCFB] overflow-visible relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-40">
          
          <div className="w-full lg:w-5/12 relative">
            <div className="relative z-10 group">
              <div className="hidden md:block absolute -inset-10 bg-primary/5 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-[3rem] md:rounded-[5rem] shadow-2xl transition-all duration-1000 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]">
                <img 
                  src={image} 
                  alt={settings?.aboutFounderName || "Founder"} 
                  className="w-full h-auto aspect-[4/5] object-cover relative z-10 transition-transform duration-[3s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-20"></div>
                
                <div className="absolute top-8 left-8 z-30 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50 animate-in fade-in zoom-in duration-1000 delay-500">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                         <UserCheck size={16} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Established</span>
                         <span className="text-xs font-bold text-slate-900 leading-none">{settings?.aboutEstablishedYear || '2025'}</span>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-4 md:bottom-12 md:-right-16 z-30 bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-start min-w-[220px] md:min-w-[320px] transform transition-all duration-700 group-hover:translate-x-2 group-hover:-translate-y-2">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Founder & Curator</span>
                 </div>
                 <h4 className="text-2xl md:text-4xl font-serif text-white mb-2 leading-none">{settings?.aboutFounderName || "The Curator"}</h4>
                 
                 <div className="relative mt-2">
                    <Signature className="h-12 md:h-16 text-primary opacity-90 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute -bottom-2 right-0 text-[9px] font-script text-white/40 italic">Personally Verified</span>
                 </div>
                 
                 <div className="mt-8 pt-8 border-t border-white/5 w-full flex items-center justify-between text-slate-500">
                    <div className="flex items-center gap-3">
                      <PenTool size={14} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Expert Stylist</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary/40">
                      <ShieldCheck size={12} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Verified</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-6/12 text-left">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-10 border border-primary/20">
                <Sparkles size={14} /> The Manifesto
             </div>
             
             <h2 className="text-5xl md:text-8xl font-serif text-slate-900 mb-12 leading-[0.85] tracking-tighter text-balance">
                {mainTitlePart} {lastTitleWord && <span className="italic font-light text-primary">{lastTitleWord}</span>}
             </h2>
             
             <div className="relative mb-12">
                <Quote size={56} className="absolute -top-10 -left-12 text-primary/10 -z-10" />
                <div className="prose prose-2xl text-slate-500 font-light leading-relaxed">
                   <p className="first-letter:text-8xl first-letter:font-serif first-letter:font-bold first-letter:text-slate-900 first-letter:mr-4 first-letter:float-left first-letter:leading-none">
                      {description}
                   </p>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-8 pt-10 border-t border-slate-100">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-6 px-12 py-7 bg-slate-900 text-white font-black uppercase tracking-widest text-[12px] rounded-full hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 group"
                >
                  {cta}
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <div className="flex flex-col justify-center gap-1 text-slate-400">
                   <div className="flex items-center gap-4">
                      <div className="h-px w-10 bg-slate-200"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Bridging quality & vision</span>
                   </div>
                   <p className="text-[10px] italic font-light pl-14">"Every piece is a chapter of my journey."</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
