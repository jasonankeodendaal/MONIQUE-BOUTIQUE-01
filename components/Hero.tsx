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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 md:pb-32 items-start">
            <div className={`w-full flex flex-col md:flex-row md:items-end justify-between gap-8 transition-all duration-[1.5s] delay-500 transform ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
              <div className="max-w-3xl flex flex-col items-start text-left">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/80 mb-4 md:mb-6 flex items-center gap-4">
                  <div className="w-8 h-px bg-white/50"></div>
                  {settings.homeHeroBadge || 'FINDARA'}
                </span>
                
                <h1 className="font-serif text-white mb-4 md:mb-6 leading-[0.85] tracking-tighter text-balance"
                    style={{ fontSize: 'clamp(2rem, 10vw, 8rem)' }}>
                  {(settings.homeHeroTitle || slide.title)}
                </h1>
                
                <p className="text-xs md:text-xl text-white/80 max-w-xl font-light leading-relaxed text-pretty">
                  {settings.homeHeroSubtitle || slide.subtitle}
                </p>
              </div>
              
              <div className="shrink-0 pb-2 md:pb-6">
                <Link 
                  to="/products"
                  className="group inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-slate-900 hover:scale-105"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
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