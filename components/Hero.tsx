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
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80" />
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" />
          
          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center items-center">
            <div className={`max-w-5xl flex flex-col items-center text-center transition-all duration-[1.5s] delay-500 transform ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.8em] text-white/70 mb-8 block">
                {settings.homeHeroBadge}
              </span>
              
              <h1 className="font-serif text-white mb-12 leading-[0.9] tracking-tighter text-balance"
                  style={{ fontSize: 'clamp(2.5rem, 10vw, 10rem)' }}>
                {(settings.homeHeroTitle || slide.title).split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
                <span className="text-primary italic font-light">
                  {(settings.homeHeroTitle || slide.title).split(' ').slice(-1)}
                </span>
              </h1>
              
              <p className="text-sm md:text-xl text-white/60 mb-12 max-w-2xl font-light leading-relaxed text-pretty mx-auto">
                {settings.homeHeroSubtitle || slide.subtitle}
              </p>
              
              <Link 
                to="/products"
                className="group relative inline-flex items-center gap-6 bg-white text-slate-900 px-10 py-5 rounded-full text-xs md:text-sm font-black uppercase tracking-[0.4em] transition-all hover:bg-primary hover:text-white shadow-2xl hover:shadow-primary/40"
              >
                {slide.cta}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-12">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all duration-500 rounded-full ${current === i ? 'w-12 bg-primary' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 right-12 hidden md:flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 vertical-text rotate-180">Scroll to Explore</span>
        <div className="w-px h-24 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;