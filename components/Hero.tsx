import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, LayoutPanelTop } from 'lucide-react';
import { CarouselSlide } from '../types';
import { Link } from 'react-router-dom';
import { useSettings } from '../App';

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
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* Hero Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[2s] ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
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
          
          {/* Refined Overlays */}
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center items-start">
            <div className={`max-w-4xl flex flex-col items-start text-left transition-all duration-[1.5s] delay-500 transform ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
              <span className="text-[8px] md:text-xs font-medium uppercase tracking-[0.3em] md:tracking-[0.4em] text-white mb-4 md:mb-6">
                {settings.homeHeroBadge || 'FINDARA'}
              </span>
              
              <h1 className="font-serif text-white mb-4 md:mb-10 leading-[0.9] tracking-tighter text-balance max-w-[70%] md:max-w-none"
                  style={{ fontSize: 'clamp(2rem, 8vw, 7rem)' }}>
                {(settings.homeHeroTitle || slide.title)}
              </h1>
              
              <p className="text-[10px] md:text-lg text-white/90 mb-6 md:mb-12 max-w-[60%] md:max-w-xl font-light leading-relaxed text-pretty">
                {settings.homeHeroSubtitle || slide.subtitle}
              </p>
              
              <Link 
                to="/products"
                className="group inline-flex items-center gap-2 md:gap-4 bg-white text-slate-900 px-6 md:px-10 py-2.5 md:py-4 rounded-full text-[8px] md:text-[10px] font-medium uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all hover:bg-white/90 hover:scale-105"
              >
                {slide.cta}
                <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-30 flex gap-2">
        <button 
          onClick={prevSlide}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
        >
          <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </section>
  );
};

export default Hero;