import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ShoppingBag, CheckCircle, FileText, Video as VideoIcon, ChevronDown, Filter, ArrowUpDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSettings } from '../App';
import { Product } from '../types';

const Products: React.FC = () => {
  const { settings, products, categories, subCategories } = useSettings();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const initialCat = query.get('category');

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCat || 'all');
  const [selectedSub, setSelectedSub] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const sortRef = useRef<HTMLDivElement>(null);

  // Handle Parallax Scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state with URL if it changes externally
  useEffect(() => {
    if (initialCat) setSelectedCat(initialCat);
  }, [initialCat]);

  // Derive Hero Content based on selection
  const heroContent = useMemo(() => {
    if (selectedCat !== 'all') {
      const cat = categories.find(c => c.id === selectedCat);
      if (cat) {
        return {
          title: cat.name,
          subtitle: cat.description || settings.productsHeroSubtitle,
          image: cat.image || settings.productsHeroImage,
          badge: 'Department Focus'
        };
      }
    }
    return {
      title: settings.productsHeroTitle,
      subtitle: settings.productsHeroSubtitle,
      image: settings.productsHeroImage,
      badge: 'The Collective Catalog'
    };
  }, [selectedCat, categories, settings]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSubCategories = useMemo(() => {
    if (selectedCat === 'all') return [];
    return subCategories.filter((s: any) => s.categoryId === selectedCat);
  }, [selectedCat, subCategories]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
      const matchesSub = selectedSub === 'all' || p.subCategoryId === selectedSub;
      return matchesSearch && matchesCat && matchesSub;
    });

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [search, selectedCat, selectedSub, sortBy, products]);

  const renderProductMedia = (product: Product) => {
    const media = product.media || [];
    const primary = media[0];
    
    if (!primary) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><ShoppingBag size={32} /></div>;

    if (primary.type?.startsWith('image/')) {
      return <img src={primary.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
    }
    
    if (primary.type?.startsWith('video/')) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
          <VideoIcon size={32} className="mb-2 opacity-30" />
          <span className="text-[8px] uppercase font-black tracking-widest text-white/50">Cinematic Preview</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
        <FileText size={32} />
        <span className="text-[8px] uppercase font-black tracking-widest mt-2">{primary.type.split('/')[1]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-32 bg-copper-wash max-w-full overflow-x-hidden pt-24">
      
      {/* KINETIC CONTEXT HERO */}
      <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden bg-slate-950">
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${heroContent.image})`,
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
            opacity: Math.max(0.4, 1 - scrollY / 800)
          }}
        />
        
        {/* Overlay Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Floating Back Button */}
        <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 md:top-10 md:left-10 z-30 w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20 group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Cinematic Content Layer */}
        <div 
          className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-12 md:pb-20"
          style={{ 
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 1 - scrollY / 700 
          }}
        >
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 mb-3 md:mb-6">
              <div className="h-px w-8 md:w-12 bg-primary"></div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-primary">
                {heroContent.badge}
              </span>
            </div>

            <h1 className="text-3xl md:text-[5rem] font-serif text-white mb-3 md:mb-6 tracking-tighter leading-[0.9] text-balance">
              {heroContent.title}
            </h1>
            
            <p className="text-white/70 text-xs md:text-xl font-light leading-relaxed max-w-2xl text-pretty border-l border-white/10 pl-4 md:pl-8">
              {heroContent.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-8">
        
        {/* Search Bar - Floating Effect */}
        <div className="relative -mt-8 md:-mt-12 mb-8 md:mb-16 px-1 md:px-2 z-10">
           <div className="relative w-full max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-white border border-slate-100 rounded-full shadow-xl overflow-hidden transition-all duration-500 hover:shadow-primary/5 focus-within:-translate-y-1">
                <Search className="ml-6 text-slate-300" size={20} />
                <input
                  type="text"
                  placeholder={settings.productsSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-4 md:py-6 bg-transparent outline-none text-sm md:text-lg font-light text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
        </div>

        <div className="space-y-4 md:space-y-8 mb-8 md:mb-16 px-1 md:px-2">
          {/* Main Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); }}
              className={`px-4 py-2 md:px-8 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                selectedCat === 'all' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 border-primary' 
                : 'bg-white/60 backdrop-blur-md text-slate-500 border-slate-100/50 hover:bg-white'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); }}
                className={`px-4 py-2 md:px-8 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                  selectedCat === cat.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 border-primary' 
                  : 'bg-white/60 backdrop-blur-md text-slate-500 border-slate-100/50 hover:bg-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub-Category and Sort Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 bg-white/40 backdrop-blur-xl rounded-3xl md:rounded-full border border-white/40 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-4 py-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mr-2 flex-shrink-0">Refine:</span>
              <button
                onClick={() => setSelectedSub('all')}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedSub === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {currentSubCategories.map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSub(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedSub === sub.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 px-4 pb-1 md:pb-0 w-full md:w-auto">
              <div className="relative w-full" ref={sortRef}>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-2.5 bg-white/50 border border-white/60 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={12} className="text-primary" />
                    <span className="truncate">{sortBy.replace('-', ' ')}</span>
                  </div>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 space-y-0.5">
                      {[
                        { id: 'newest', label: 'Latest' },
                        { id: 'price-low', label: 'Price: Low' },
                        { id: 'price-high', label: 'Price: High' },
                        { id: 'name', label: 'Name' },
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                            sortBy === option.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* HIGH DENSITY GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {filteredProducts.map((product: Product) => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id} 
                className="bg-white/40 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/50 shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 flex flex-col relative"
              >
                {/* Slow Flickering Discount Badge */}
                {product.discountRules && product.discountRules.length > 0 && (
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-red-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full font-black text-[7px] md:text-[9px] uppercase tracking-widest shadow-lg z-20 animate-soft-flicker">
                     {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
                  </div>
                )}
                
                <div className="relative aspect-square overflow-hidden bg-white/20">
                  {renderProductMedia(product)}
                  
                  {/* Integrated Price Display */}
                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10">
                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-sm font-black text-slate-900 shadow-lg border border-white/50">
                      R {product.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-black uppercase text-[8px] tracking-widest flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                       View Selection
                    </div>
                  </div>
                </div>
                
                <div className="p-3 md:p-5 flex-grow flex flex-col text-left">
                  <h3 className="text-[11px] md:text-sm font-serif text-slate-900 mb-1 group-hover:text-primary transition-colors duration-500 leading-snug line-clamp-2 min-h-[2.5em]">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-2 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[7px] md:text-[9px] font-bold text-slate-400 font-mono tracking-tighter truncate max-w-[60px]">{product.sku}</span>
                    <div className="text-primary group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/20 rounded-3xl border border-dashed border-white/40 mx-1">
            <div className="w-20 h-20 bg-white/20 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tighter uppercase">No Results</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm font-light leading-relaxed">Adjust your refinement parameters to find what you're looking for.</p>
            <button 
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setSearch(''); }} 
              className="mt-6 text-primary font-black uppercase tracking-widest text-[9px] hover:underline decoration-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;