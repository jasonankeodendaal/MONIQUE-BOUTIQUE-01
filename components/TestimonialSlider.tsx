
import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Eleanor Vance",
    role: "Collectors Circle Member",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    text: "The bridge curation is impeccable. I found pieces that I've been searching for across global retailers, all vetted by someone with a true eye for quality.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "Private Client",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    text: "Navigating the world of luxury affiliate links can be daunting. FINDARA simplifies the process while maintaining a sense of exclusivity and trust.",
    rating: 5
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Style Consultant",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    text: "Every recommendation feels personal. It's rare to find a curator who values material integrity as much as aesthetic appeal. A truly unique bridge page.",
    rating: 5
  }
];

const TestimonialSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20 md:py-40">
      <div className="text-center mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.3em] mb-4 border border-primary/20">
          Social Proof
        </div>
        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tight">Voices of the <span className="italic font-light text-primary">Collective</span></h2>
      </div>

      <div className="relative group">
        <div className="overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-primary/5 p-8 md:p-20">
          <Quote size={64} className="text-primary/10 absolute top-10 left-10 md:top-16 md:left-16" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] overflow-hidden flex-shrink-0 border-4 border-slate-50 shadow-xl">
              <img 
                src={TESTIMONIALS[current].image} 
                alt={TESTIMONIALS[current].name} 
                className="w-full h-full object-cover transition-all duration-700" 
              />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex justify-center md:justify-start gap-1 text-primary mb-6">
                {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-xl md:text-3xl text-slate-700 font-light leading-relaxed italic mb-8">
                "{TESTIMONIALS[current].text}"
              </p>
              
              <div>
                <h4 className="text-lg font-bold text-slate-900">{TESTIMONIALS[current].name}</h4>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">{TESTIMONIALS[current].role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 -left-6 md:-left-12 -translate-y-1/2 flex items-center justify-center">
          <button onClick={prev} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 hover:text-primary hover:scale-110 transition-all">
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute top-1/2 -right-6 md:-right-12 -translate-y-1/2 flex items-center justify-center">
          <button onClick={next} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 hover:text-primary hover:scale-110 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-12">
        {TESTIMONIALS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-primary' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
