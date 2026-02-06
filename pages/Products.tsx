
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
          badge: 'Dept.'
        };
      }
    }
    return {
      title: settings.productsHeroTitle,
      subtitle: settings.productsHeroSubtitle,
      image: settings.productsHeroImage,
      badge: 'Catalog'
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
    
    if (!primary) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><ShoppingBag size={24} /></div>;

    if (primary.type?.startsWith('image/')) {
      return <img src={primary.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
    }
    
    if (primary.type?.startsWith('video/')) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
          <VideoIcon size={24} className="mb-1 opacity-30" />
          <span className="text-[6px] uppercase font-black tracking-widest text-white/50">Cinema</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
        <FileText size={24} />
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12 md:pb-32 bg-[#FDFBF7] max-w-full overflow-x-hidden pt-16 md:pt-24">
      <style>{`
        .subcat-row-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .subcat-row-container::-webkit-scrollbar {
          display: none;
        }
        .infinite-scroll-mask {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @media (min-width: 1024px) {
           .subcat-row-container {
              padding: 1.5rem 4rem;
              gap: 0.75rem;
           }
        }
      `}</style>
      
      {/* --- HERO SECTION - SHRUNK --- */}
      <div className="relative h-[25vh] md:h-[55vh] w-full overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${heroContent.image})`,
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
            opacity: Math.max(0.3, 1 - scrollY / 600)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/10 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
        
        <button 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 md:top-10 md:left-10 z-30 w-8 h-8 md:w-14 md:h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl border border-white/20 group"
        >
            <ArrowLeft size={16} className="md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div 
          className="relative h-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-end pb-4 md:pb-16"
          style={{ 
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: 1 - scrollY / 500 
          }}
        >
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-[1px] w-4 md:w-12 bg-primary"></div>
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                {heroContent.badge}
              </span>
            </div>
            <h1 className="text-xl md:text-[4.5rem] font-serif text-slate-900 mb-1 md:mb-4 tracking-tighter leading-tight text-balance">
              {heroContent.title}
            </h1>
            <p className="hidden md:block text-slate-500 text-lg font-light leading-relaxed max-w-2xl text-pretty border-l border-slate-200 pl-6">
              {heroContent.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION & FILTERS - CONDENSED --- */}
      <div className="max-w-7xl mx-auto px-3 md:px-8 -mt-4 md:-mt-10 relative z-40">
        
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6">
           <div className="relative flex-grow group">
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden transition-all duration-500 focus-within:-translate-y-0.5">
                <Search className="ml-4 md:ml-6 text-slate-300" size={16} />
                <input
                  type="text"
                  placeholder={settings.productsSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-3 md:py-5 bg-transparent outline-none text-xs md:text-base font-light text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-grow md:flex-grow-0" ref={catRef}>
                <button 
                  onClick={() => { setIsCatOpen(!isCatOpen); setIsSortOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 md:py-5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all shadow-md ${
                    isCatOpen || selectedCat !== 'all' ? 'bg-primary text-slate-900 border-primary' : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  <Layers size={12} className={isCatOpen || selectedCat !== 'all' ? 'text-slate-900' : 'text-primary'} />
                  <span className="truncate max-w-[100px] md:min-w-[120px] text-left">{selectedCat === 'all' ? 'Depts' : categories.find(c => c.id === selectedCat)?.name}</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCatOpen && (
                  <div className="absolute top-full left-0 md:right-0 mt-2 w-56 md:w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] overflow-hidden p-1">
                    <button 
                      onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setIsCatOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all mb-0.5 ${selectedCat === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      Browse Everything
                    </button>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); setIsCatOpen(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all mb-0.5 ${selectedCat === cat.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
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
                  className={`flex items-center justify-center w-10 md:w-16 h-full rounded-xl border transition-all shadow-md ${
                    isSortOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <ArrowUpDown size={16} />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] overflow-hidden p-1">
                      {[
                        { id: 'newest', label: 'Latest' },
                        { id: 'price-low', label: 'Low Price' },
                        { id: 'price-high', label: 'High Price' },
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all mb-0.5 ${
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

        {/* --- HORIZONTAL SUB-CATEGORY SCROLL - CONDENSED --- */}
        <div className="relative mb-6 md:mb-12">
           <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-1.5">
                 <Tag size={10} className="text-primary" /> Niches
              </span>
              {selectedSub !== 'all' && (
                <button 
                  onClick={() => setSelectedSub('all')}
                  className="text-[8px] font-black uppercase text-primary hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  Clear <Check size={8} />
                </button>
              )}
           </div>

           <div className="relative infinite-scroll-mask group/scroll -mx-3 px-3">
              <div 
                ref={subScrollRef}
                className="subcat-row-container"
              >
                <button
                  onClick={() => setSelectedSub('all')}
                  className={`px-5 py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap h-fit flex-shrink-0 ${
                    selectedSub === 'all' ? 'bg-primary text-slate-900 border-primary' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/30'
                  }`}
                >
                  All
                </button>

                {currentSubCategories.map((sub: SubCategory) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub.id)}
                    className={`px-5 py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap h-fit flex-shrink-0 ${
                      selectedSub === sub.id ? 'bg-primary text-slate-900 border-primary' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/30'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* --- GROUPED PRODUCT GRID - COMPACT --- */}
        {groupedProducts.length > 0 ? (
          <div className="space-y-8 md:space-y-36">
            {groupedProducts.map((group, gIdx) => (
              <section key={group.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${gIdx * 50}ms` }}>
                <div className="flex items-center gap-2 mb-4 md:mb-16">
                  <span className="text-primary font-mono text-sm md:text-2xl font-black">
                    {(gIdx + 1).toString().padStart(2, '0')}
                  </span>
                  <h2 className="text-lg md:text-5xl font-serif text-slate-900 tracking-tight capitalize">
                    {group.name}
                  </h2>
                  <div className="h-px flex-grow bg-slate-200/50"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-8">
                  {group.items.map((product: Product) => (
                    <div 
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-white rounded-xl md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 group flex flex-col relative cursor-pointer"
                    >
                      {product.discountRules && product.discountRules.length > 0 && (
                        <div className="absolute top-2 left-2 md:top-5 md:right-5 bg-red-600 text-white px-1.5 py-0.5 rounded-full font-black text-[6px] md:text-[9px] uppercase tracking-widest shadow-lg z-20">
                          {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
                        </div>
                      )}
                      
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        {renderProductMedia(product)}
                        <div className="absolute bottom-2 left-2 md:bottom-5 md:left-5 z-10">
                          <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 md:px-5 md:py-2.5 rounded-md md:rounded-lg text-[7px] md:text-sm font-black text-slate-900 shadow-lg border border-white/50">
                            R {(product.price || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2 md:p-6 flex-grow flex flex-col text-left">
                        <span className="text-[6px] md:text-[9px] font-black text-primary uppercase tracking-[0.1em] mb-1 block">
                           {categories.find(c => c.id === product.categoryId)?.name}
                        </span>
                        <h3 className="text-[9px] md:text-base font-serif text-slate-900 mb-1 group-hover:text-primary transition-colors duration-500 leading-tight line-clamp-2 min-h-[2.2em]">
                          {product.name}
                        </h3>
                        <div className="mt-auto pt-1 md:pt-2 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[6px] md:text-[8px] font-bold text-slate-300 font-mono tracking-tighter truncate max-w-[50px] md:max-w-[60px] uppercase">Ref: {product.sku}</span>
                          <div className="w-3.5 h-3.5 md:w-6 md:h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                             <Check size={7} className="md:w-3 md:h-3" />
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={24} />
            </div>
            <h3 className="text-xl font-serif text-slate-900 mb-2">No Matches</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-xs font-light px-6">Adjust your search parameters to find more pieces.</p>
            <button 
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setSearch(''); }} 
              className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[8px] hover:bg-primary hover:text-slate-900 transition-all shadow-lg"
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
