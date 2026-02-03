
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, UserCheck, PenTool, Quote } from 'lucide-react';
import { useSettings } from '../App';
import Signature from './Signature';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  const title = settings.homeAboutTitle || "Me and My Story.";
  const description = settings.homeAboutDescription || "";
  const cta = settings.homeAboutCta || "Read My Story";
  const image = settings.homeAboutImage || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200";

  return (
    <section className="py-24 md:py-64 bg-[#FDFCFB] overflow-visible relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-40">
          
          <div className="w-full lg:w-5/12 relative">
            <div className="relative z-10 group">
              {/* Decorative Blur Background */}
              <div className="hidden md:block absolute -inset-10 bg-primary/5 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-[3rem] md:rounded-[5rem] shadow-2xl transition-all duration-1000 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]">
                <img 
                  src={image} 
                  alt={settings.aboutFounderName || "Founder"} 
                  className="w-full h-auto aspect-[4/5] object-cover relative z-10 transition-transform duration-[3s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                
                {/* Floating Experience Badge */}
                <div className="absolute top-8 left-8 z-30 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50 animate-in fade-in zoom-in duration-1000 delay-500">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                         <UserCheck size={16} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Established</span>
                         <span className="text-xs font-bold text-slate-900 leading-none">{settings.aboutEstablishedYear}</span>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* Founder Signature Tag */}
              <div className="absolute -bottom-10 -right-4 md:bottom-20 md:-right-20 z-30 bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-start min-w-[220px] md:min-w-[340px] transform transition-all duration-700 group-hover:translate-x-4 group-hover:-translate-y-4">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Founder & Curator</span>
                 </div>
                 <h4 className="text-3xl md:text-5xl font-serif text-white mb-2 leading-none">{settings.aboutFounderName || "The Curator"}</h4>
                 
                 <div className="relative mt-2">
                    <Signature className="h-16 md:h-20 text-primary opacity-90 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute -bottom-2 right-0 text-[10px] font-script text-white/40 italic">Personally Verified</span>
                 </div>
                 
                 <div className="mt-8 pt-8 border-t border-white/5 w-full flex items-center justify-between text-slate-500">
                    <div className="flex items-center gap-2">
                      <PenTool size={14} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Expert Stylist</span>
                    </div>
                    <span className="text-[8px] font-bold uppercase text-slate-600">ID: CUR-001</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-6/12 text-left">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-10 border border-primary/20">
                <Sparkles size={14} /> My Story
             </div>
             
             <h2 className="text-5xl md:text-8xl font-serif text-slate-900 mb-12 leading-[0.85] tracking-tighter text-balance">
                {title.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{title.split(' ').slice(-1)}</span>
             </h2>
             
             <div className="relative mb-12">
                <Quote size={48} className="absolute -top-6 -left-8 text-primary/10 -z-10" />
                <div className="prose prose-2xl text-slate-500 font-light leading-relaxed">
                   <p className="first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                      {description}
                   </p>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-slate-100">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-6 px-10 py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 group"
                >
                  {cta}
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 text-slate-400">
                   <div className="h-px w-10 bg-slate-200"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">Discovery Phase</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
