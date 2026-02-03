
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
          <VideoIcon size={48} className="mb-3 opacity-30" />
          <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Cinematic Preview</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
        <FileText size={48} />
        <span className="text-[10px] uppercase font-black tracking-widest mt-3">{primary.type.split('/')[1]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-32 bg-[#FDFCFB] max-w-full overflow-x-hidden">
      
      {/* KINETIC CONTEXT HERO */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-slate-950">
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
          className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-20 md:pb-32"
          style={{ 
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 1 - scrollY / 700 
          }}
        >
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 md:w-12 bg-primary"></div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-primary">
                {heroContent.badge}
              </span>
            </div>

            <h1 className="text-4xl md:text-[7rem] font-serif text-white mb-6 tracking-tighter leading-[0.9] text-balance">
              {heroContent.title.split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary drop-shadow-2xl">
                {heroContent.title.split(' ').slice(-1)}
              </span>
            </h1>
            
            <p className="text-white/70 text-sm md:text-2xl font-light leading-relaxed max-w-2xl text-pretty border-l border-white/10 pl-6 md:pl-10">
              {heroContent.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-8">
        
        {/* Search Bar - Floating Effect */}
        <div className="relative -mt-10 md:-mt-16 mb-12 md:mb-24 px-1 md:px-2 z-10">
           <div className="relative w-full max-w-3xl mx-auto group">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-primary/5 focus-within:-translate-y-1">
                <Search className="ml-8 text-slate-300" size={24} />
                <input
                  type="text"
                  placeholder={settings.productsSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-6 py-6 md:py-8 bg-transparent outline-none text-base md:text-xl font-light text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
        </div>

        <div className="space-y-6 md:space-y-10 mb-12 md:mb-24 px-1 md:px-2">
          {/* Main Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <button
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); }}
              className={`px-6 py-3 md:px-10 md:py-4 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                selectedCat === 'all' 
                ? 'bg-primary text-white shadow-xl shadow-primary/30 border-primary' 
                : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
              }`}
            >
              All Selections
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); }}
                className={`px-6 py-3 md:px-10 md:py-4 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                  selectedCat === cat.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/30 border-primary' 
                  : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub-Category and Sort Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-3 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto px-4 py-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-4 flex-shrink-0">Refine Collection:</span>
              <button
                onClick={() => setSelectedSub('all')}
                className={`px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedSub === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                Display All
              </button>
              {currentSubCategories.map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSub(sub.id)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedSub === sub.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 px-4 pb-2 lg:pb-0 w-full lg:w-auto">
              <div className="relative w-full" ref={sortRef}>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between gap-6 px-8 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <ArrowUpDown size={16} className="text-primary" />
                    <span className="truncate">Sequence: {sortBy.replace('-', ' ')}</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 space-y-1">
                      {[
                        { id: 'newest', label: 'Latest Curation' },
                        { id: 'price-low', label: 'Value: Low to High' },
                        { id: 'price-high', label: 'Value: High to Low' },
                        { id: 'name', label: 'Alphabetical Index' },
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                          className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-16">
            {filteredProducts.map((product: Product) => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id} 
                className="bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group hover:-translate-y-6 flex flex-col relative"
              >
                {product.discountRules && product.discountRules.length > 0 && (
                  <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-red-500 text-white px-4 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl z-20 animate-pulse">
                     {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`} Exclusive
                  </div>
                )}
                
                <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                  {renderProductMedia(product)}
                  <div className="absolute top-4 left-4 md:top-10 md:left-10 bg-white/90 backdrop-blur-2xl px-4 py-2 md:px-8 md:py-4 rounded-2xl md:rounded-[2rem] text-sm md:text-xl font-black text-slate-900 shadow-2xl border border-white/40 z-10">
                    R {product.price.toLocaleString()}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center z-10">
                    <div className="bg-white text-slate-900 px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center gap-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 shadow-2xl">
                       Examine Selection <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-14 flex-grow flex flex-col text-left">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                    <CheckCircle size={12} className="text-primary md:w-5 md:h-5" />
                    <span className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Verified Authenticity</span>
                  </div>
                  <h3 className="text-lg md:text-4xl font-serif text-slate-900 mb-4 md:mb-8 group-hover:text-primary transition-colors duration-500 leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="hidden md:block text-slate-500 text-lg mb-10 md:mb-12 line-clamp-3 leading-relaxed font-light">
                    {product.description}
                  </p>
                  
                  <div className="mt-auto pt-4 md:pt-12 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1 md:mb-2">Reference ID</span>
                      <span className="text-[10px] md:text-base font-bold text-slate-500 font-mono tracking-tighter truncate max-w-[80px] md:max-w-none">{product.sku}</span>
                    </div>
                    <div 
                      className="p-3 md:px-12 md:py-6 bg-primary hover:brightness-110 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-full md:rounded-[2.5rem] flex items-center gap-2 md:gap-5 transition-all shadow-lg"
                    >
                      <span className="hidden md:inline">Acquire Now</span>
                      <ExternalLink size={14} className="md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-64 bg-white rounded-[4rem] border border-dashed border-slate-200 mx-2">
            <div className="w-32 h-32 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-12">
              <ShoppingBag size={64} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Zero Match Result</h3>
            <p className="text-slate-400 max-w-md mx-auto text-xl font-light leading-relaxed">No curations were found matching your current refinement parameters.</p>
            <button 
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setSearch(''); }} 
              className="mt-10 text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2"
            >
              Reset All Refinements
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
