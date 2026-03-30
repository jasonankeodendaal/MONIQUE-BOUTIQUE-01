import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, LayoutPanelTop } from 'lucide-react';
import { CarouselSlide } from '../types';
import { Link } from 'react-router-dom';
import { useSettings } from '../App';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  const { settings, heroSlides } = useSettings();
  
  const slides = useMemo(() => heroSlides || [], [heroSlides]);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, slides.length]);

  const prevSlide = () => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  // Handle automatic transition for IMAGES
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const currentSlide = slides[current];
    if (currentSlide?.type === 'image') {
      const timer = setTimeout(nextSlide, 8000);
      return () => clearTimeout(timer);
    }
  }, [nextSlide, slides, current]);

  // Manage Video Playback
  useEffect(() => {
    const activeSlide = slides[current];
    if (activeSlide?.type === 'video') {
      const vid = videoRefs.current[activeSlide.id];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(err => console.debug("Video play interrupted", err));
      }
    }

    slides.forEach((slide, idx) => {
      if (idx !== current && slide.type === 'video') {
        const vid = videoRefs.current[slide.id];
        if (vid) vid.pause();
      }
    });
  }, [current, slides]);

  if (slides.length === 0) {
    return (
      <div className="h-[60vh] md:h-[80vh] w-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LayoutPanelTop className="mx-auto text-slate-700 mb-4" size={48} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active hero slides</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {/* Hero Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[2s] ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="flex flex-col md:flex-row h-full w-full">
            {/* Content Side (Left on Tablet) */}
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-start px-6 md:px-20 lg:px-32 bg-white z-20 order-2 md:order-1">
              <div className={`max-w-xl transition-all duration-[1.5s] delay-500 transform ${
                index === current ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}>
                <div className="inline-flex items-center gap-3 mb-6 md:mb-10">
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    {settings.homeHeroBadge || 'FINDARA'}
                  </span>
                  <div className="h-px w-8 bg-primary/30"></div>
                </div>
                
                <h1 className="font-serif text-slate-900 mb-6 md:mb-12 leading-[0.9] tracking-tighter"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 6.5rem)' }}>
                  {(settings.homeHeroTitle || slide.title)}
                </h1>
                
                <p className="text-xs md:text-xl text-slate-600 mb-8 md:mb-16 max-w-md font-light leading-relaxed italic">
                  "{settings.homeHeroSubtitle || slide.subtitle}"
                </p>
                
                <Link 
                  to="/products"
                  className="group inline-flex items-center gap-4 bg-slate-900 text-white px-8 md:px-12 py-3 md:py-5 rounded-full text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-slate-900 hover:scale-105 shadow-2xl shadow-slate-900/20"
                >
                  {slide.cta}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Progress Indicator (Desktop Only) */}
              <div className="hidden md:flex absolute bottom-12 left-20 lg:left-32 items-center gap-4">
                <span className="text-[10px] font-black text-slate-400">0{current + 1}</span>
                <div className="w-24 h-px bg-slate-100 relative overflow-hidden">
                  <motion.div 
                    key={current}
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 8, ease: 'linear' }}
                    className="absolute inset-0 bg-primary"
                  />
                </div>
                <span className="text-[10px] font-black text-slate-400">0{slides.length}</span>
              </div>
            </div>

            {/* Media Side (Right on Tablet) */}
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden order-1 md:order-2">
              {slide.type === 'video' ? (
                <video
                  ref={(el) => { videoRefs.current[slide.id] = el; }}
                  muted
                  playsInline
                  onEnded={nextSlide}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[12s] ease-linear ${index === current ? 'scale-110' : 'scale-100'}`}
                  src={slide.image}
                />
              ) : (
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-[12s] ease-linear ${index === current ? 'scale-110 animate-kenburns' : 'scale-100'}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              )}
              <div className="absolute inset-0 bg-slate-900/10" />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-30 flex gap-3">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 hover:bg-primary hover:border-primary hover:text-slate-900 transition-all shadow-xl"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 hover:bg-primary hover:border-primary hover:text-slate-900 transition-all shadow-xl"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;