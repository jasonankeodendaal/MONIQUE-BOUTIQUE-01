
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, FileText, Video as VideoIcon, ChevronDown, ArrowUpDown, ArrowLeft, Layers, Tag, LayoutGrid, Check, Filter } from 'lucide-react';
import { useSettings } from '../App';
import { Product, SubCategory } from '../types';

const Products: React.FC = () => {
  const { settings, products, categories, subCategories } = useSettings();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const initialCat = query.get('category');

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCat || 'all');
  const [selectedSub, setSelectedSub] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const catRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const subScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Vertical to Horizontal Scroll Handler for Desktop
  useEffect(() => {
    const el = subScrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [subScrollRef]);

  useEffect(() => {
    if (initialCat) {
      setSelectedCat(initialCat);
      setSelectedSub('all');
    }
  }, [initialCat]);

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
      const target = event.target as Node;
      if (catRef.current && !catRef.current.contains(target)) setIsCatOpen(false);
      if (sortRef.current && !sortRef.current.contains(target)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSubCategories = useMemo(() => {
    if (selectedCat === 'all') return subCategories;
    return subCategories.filter((s: SubCategory) => s.categoryId === selectedCat);
  }, [selectedCat, subCategories]);

  // Hierarchical Grouping Logic
  const groupedProducts = useMemo(() => {
    let filtered = products.filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
      const matchesSub = selectedSub === 'all' || p.subCategoryId === selectedSub;
      return matchesSearch && matchesCat && matchesSub;
    });

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    const groups: Record<string, { name: string; items: Product[] }> = {};

    filtered.forEach(p => {
      let groupKey = '';
      let groupName = '';

      if (selectedCat === 'all') {
        groupKey = p.categoryId;
        groupName = categories.find(c => c.id === p.categoryId)?.name || 'General Collections';
      } else {
        groupKey = p.subCategoryId || 'none';
        groupName = subCategories.find(s => s.id === p.subCategoryId)?.name || 'General Selections';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { name: groupName, items: [] };
      }
      groups[groupKey].items.push(p);
    });

    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [search, selectedCat, selectedSub, sortBy, products, categories, subCategories]);

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
    <div className="min-h-screen pb-20 md:pb-32 bg-[#FDFBF7] max-w-full overflow-x-hidden pt-24">
      <style>{`
        .subcat-row-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 0.75rem;
          padding: 1.5rem 2rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-color) transparent;
        }
        .subcat-row-container::-webkit-scrollbar {
          height: 3px;
        }
        .subcat-row-container::-webkit-scrollbar-thumb {
          background: rgba(var(--primary-rgb), 0.2);
          border-radius: 10px;
        }
        .infinite-scroll-mask {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        @media (min-width: 1024px) {
           .subcat-row-container {
              padding: 2rem 4rem;
           }
        }
      `}</style>
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[40vh] md:h-[55vh] w-full overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${heroContent.image})`,
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
            opacity: Math.max(0.3, 1 - scrollY / 800)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
        
        <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 md:top-10 md:left-10 z-30 w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20 group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div 
          className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-8 md:pb-16"
          style={{ 
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 1 - scrollY / 700 
          }}
        >
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-8 md:w-12 bg-primary"></div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-primary">
                {heroContent.badge}
              </span>
            </div>
            <h1 className="text-3xl md:text-[4.5rem] font-serif text-slate-900 mb-2 md:mb-4 tracking-tighter leading-[0.9] text-balance">
              {heroContent.title}
            </h1>
            <p className="text-slate-500 text-xs md:text-lg font-light leading-relaxed max-w-2xl text-pretty border-l border-slate-200 pl-4 md:pl-6">
              {heroContent.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION & FILTERS --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 md:-mt-10 relative z-40">
        
        {/* Department Dropdown & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-grow group">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-primary/5 focus-within:-translate-y-1">
                <Search className="ml-6 text-slate-300" size={20} />
                <input
                  type="text"
                  placeholder={settings.productsSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-4 md:py-5 bg-transparent outline-none text-sm md:text-base font-light text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative" ref={catRef}>
                <button 
                  onClick={() => { setIsCatOpen(!isCatOpen); setIsSortOpen(false); }}
                  className={`flex items-center gap-4 px-8 py-4 md:py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-lg ${
                    isCatOpen || selectedCat !== 'all' ? 'bg-primary text-slate-900 border-primary' : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  <Layers size={14} className={isCatOpen || selectedCat !== 'all' ? 'text-slate-900' : 'text-primary'} />
                  <span className="min-w-[120px] text-left">Dept: {selectedCat === 'all' ? 'All Collections' : categories.find(c => c.id === selectedCat)?.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCatOpen && (
                  <div className="absolute top-full left-0 md:right-0 mt-3 w-72 bg-white border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 p-2">
                    <button 
                      onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setIsCatOpen(false); }}
                      className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all mb-1 ${selectedCat === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      Browse Everything
                    </button>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); setIsCatOpen(false); }}
                          className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all mb-1 ${selectedCat === cat.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={sortRef}>
                <button 
                  onClick={() => { setIsSortOpen(!isSortOpen); setIsCatOpen(false); }}
                  className={`flex items-center justify-center w-14 md:w-16 h-full rounded-2xl border transition-all shadow-lg ${
                    isSortOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <ArrowUpDown size={20} />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 p-2">
                      {[
                        { id: 'newest', label: 'Latest' },
                        { id: 'price-low', label: 'Price: Low' },
                        { id: 'price-high', label: 'Price: High' },
                        { id: 'name', label: 'Name' },
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                          className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mb-1 ${
                            sortBy === option.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* --- HORIZONTAL SUB-CATEGORY SCROLL --- */}
        <div className="relative mb-12">
           <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2">
                 <Tag size={12} className="text-primary" /> Curated Niches
              </span>
              <div className="h-px flex-grow mx-6 bg-slate-100"></div>
              {selectedSub !== 'all' && (
                <button 
                  onClick={() => setSelectedSub('all')}
                  className="text-[9px] font-black uppercase text-primary hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  Clear Filter <Check size={10} />
                </button>
              )}
           </div>

           <div className="relative infinite-scroll-mask group/scroll">
              <div 
                ref={subScrollRef}
                className="subcat-row-container"
              >
                {/* Reset Option */}
                <button
                  onClick={() => setSelectedSub('all')}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap scroll-snap-align-start h-fit flex-shrink-0 ${
                    selectedSub === 'all' ? 'bg-primary text-slate-900 border-primary scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/30'
                  }`}
                >
                  Show All
                </button>

                {currentSubCategories.map((sub: SubCategory) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub.id)}
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap scroll-snap-align-start h-fit flex-shrink-0 ${
                      selectedSub === sub.id ? 'bg-primary text-slate-900 border-primary scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/30'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 opacity-0 group-hover/scroll:opacity-20 pointer-events-none transition-opacity">
                <ChevronDown className="rotate-90 text-slate-900" size={32} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover/scroll:opacity-20 pointer-events-none transition-opacity">
                <ChevronDown className="-rotate-90 text-slate-900" size={32} />
              </div>
           </div>
        </div>

        {/* --- GROUPED PRODUCT GRID --- */}
        {groupedProducts.length > 0 ? (
          <div className="space-y-24 md:space-y-36">
            {groupedProducts.map((group, gIdx) => (
              <section key={group.name} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${gIdx * 100}ms` }}>
                <div className="flex items-center gap-6 mb-10 md:mb-16">
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <span className="text-primary font-mono text-xl md:text-2xl font-black">
                      {(gIdx + 1).toString().padStart(2, '0')}
                    </span>
                    <h2 className="text-2xl md:text-5xl font-serif text-slate-900 tracking-tighter capitalize">
                      {group.name}
                    </h2>
                  </div>
                  <div className="h-px flex-grow bg-slate-200/60 relative">
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-1 bg-primary rounded-full"></div>
                  </div>
                  <div className="hidden md:block">
                     <span className="px-4 py-2 rounded-full bg-white border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {group.items.length} Selections
                     </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {group.items.map((product: Product) => (
                    <div 
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 group hover:-translate-y-3 flex flex-col relative cursor-pointer"
                    >
                      {product.discountRules && product.discountRules.length > 0 && (
                        <div className="absolute top-3 right-3 md:top-5 md:right-5 bg-red-600 text-white px-3 py-1 rounded-full font-black text-[7px] md:text-[9px] uppercase tracking-widest shadow-lg z-20">
                          {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
                        </div>
                      )}
                      
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        {renderProductMedia(product)}
                        <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 z-10">
                          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl text-[10px] md:text-sm font-black text-slate-900 shadow-xl border border-white/50">
                            R {(product.price || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center z-10">
                           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                              <ShoppingBag size={20} />
                           </div>
                        </div>
                      </div>
                      
                      <div className="p-4 md:p-6 flex-grow flex flex-col text-left">
                        <span className="text-[7px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">
                           {categories.find(c => c.id === product.categoryId)?.name}
                        </span>
                        <h3 className="text-[12px] md:text-base font-serif text-slate-900 mb-3 group-hover:text-primary transition-colors duration-500 leading-snug line-clamp-2 min-h-[2.5em]">
                          {product.name}
                        </h3>
                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[7px] md:text-[8px] font-bold text-slate-300 font-mono tracking-tighter truncate max-w-[80px] uppercase">Ref: {product.sku}</span>
                          <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                             <Check size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <Filter size={40} />
            </div>
            <h3 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">Refinement Required</h3>
            <p className="text-slate-400 max-w-sm mx-auto text-sm font-light leading-relaxed">We couldn't find any pieces matching these specific parameters. Try broadening your discovery.</p>
            <button 
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setSearch(''); }} 
              className="mt-10 px-8 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-slate-900 transition-all shadow-xl"
            >
              Reset Discovery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
