import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-24 md:py-56 bg-[#FAF9F6] overflow-hidden relative">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F5F1EE] -skew-x-12 translate-x-1/4 z-0"></div>
      
      {/* Background Image - Free View & Faded */}
      <div className="absolute top-0 right-0 w-full md:w-[70%] h-full pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-110"
          style={{ 
            backgroundImage: `url(${settings.homeAboutImage})`,
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
            opacity: 0.12
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-24">
          
          {/* Text Column */}
          <div className="w-full md:w-3/5 text-left relative z-20">
            <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
              <span className="text-[7px] md:text-[10px] font-medium uppercase tracking-[0.3em] md:tracking-[0.5em] text-primary/80">{settings.homeAboutNarrativeLabel || 'The Curation Narrative'}</span>
              <div className="h-[1px] w-8 md:w-16 bg-primary/20"></div>
            </div>
            
            <h2 className="font-serif text-slate-900 mb-6 md:mb-10 leading-[0.88] tracking-tighter" style={{ fontSize: 'clamp(2rem, 6vw, 6.5rem)' }}>
              {settings.homeAboutTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? "italic font-light text-primary/80 block" : "block"}>
                  {word}
                </span>
              ))}
            </h2>
            
            <div className="relative mb-8 md:mb-12 pl-4 md:pl-8 border-l border-primary/10 max-w-2xl">
              <p className="text-[10px] md:text-2xl text-slate-900 font-light leading-relaxed italic line-clamp-3 md:line-clamp-none">
                "{settings.homeAboutDescription}"
              </p>
              <Link to="/about" className="md:hidden text-[8px] font-bold uppercase tracking-widest text-primary mt-2 inline-block">
                Read More +
              </Link>
            </div>

            <Link 
              to="/about" 
              className="group inline-flex items-center gap-3 md:gap-6"
            >
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ArrowRight className="w-3.5 h-3.5 md:w-6 md:h-6 text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[8px] md:text-[12px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-900 group-hover:text-primary transition-colors">
                {settings.homeAboutCta}
              </span>
            </Link>
          </div>

          {/* Empty column to maintain flex spacing if needed, or just let text take space */}
          <div className="hidden md:block md:w-2/5"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;