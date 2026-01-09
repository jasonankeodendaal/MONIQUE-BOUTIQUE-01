
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause, Quote, Star } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Media Side - Video/Image Hybrid */}
          <div className="w-full lg:w-1/2 relative order-1">
             <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl group border border-slate-100">
                <img 
                  src={settings.homeAboutImage} 
                  alt="Founder" 
                  className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out ${isPlaying ? 'scale-110 blur-sm' : 'scale-100'}`}
                />
                
                {/* Simulated Video Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                   <button 
                     onClick={() => setIsPlaying(!isPlaying)}
                     className="w-20 h-20 bg-white/30 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center text-white hover:scale-110 hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer shadow-2xl"
                   >
                     {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                   </button>
                </div>
                
                {/* Personal Brand Badge */}
                <div className="absolute bottom-8 right-6 md:bottom-10 md:right-10 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl max-w-[240px] border border-white/50 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="flex gap-1 mb-3 text-primary">
                      {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                   </div>
                   <p className="font-serif italic text-lg text-slate-900 mb-2 leading-snug">"{settings.slogan}"</p>
                   <div className="flex items-center gap-3">
                      <div className="h-px w-8 bg-slate-300"></div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{settings.aboutFounderName}</p>
                   </div>
                </div>
             </div>
             
             {/* Decorative Background Elements */}
             <div className="absolute -z-10 top-12 -left-12 w-full h-full border-[2px] border-slate-100 rounded-[2.5rem]"></div>
             <div className="absolute -z-10 -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          {/* Story Content Side */}
          <div className="w-full lg:w-1/2 text-left order-2">
            <div className="flex items-center gap-4 mb-8">
               <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
               </span>
               <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                  The Origin Story
               </span>
            </div>
            
            <h2 className="font-serif text-5xl md:text-7xl text-slate-900 mb-8 leading-[0.9] tracking-tight">
              {settings.homeAboutTitle}
            </h2>
            
            <div className="prose prose-lg text-slate-500 font-light mb-10 leading-loose">
               <p className="text-xl text-slate-800 font-normal mb-6">
                 Hi, I'm <span className="text-primary font-bold">{settings.aboutFounderName}</span>.
               </p>
               <p>{settings.homeAboutDescription}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
               <Link 
                 to="/about" 
                 className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full hover:bg-primary hover:text-slate-900 transition-all duration-300 shadow-xl shadow-slate-900/10 group"
               >
                 <span className="text-xs font-black uppercase tracking-[0.2em]">
                   {settings.homeAboutCta || 'Read My Full Story'}
                 </span>
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               
               <div className="flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500">
                  <img src={settings.aboutSignatureImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png'} alt="Signature" className="h-12 w-auto" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
