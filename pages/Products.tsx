import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, FileText, Video as VideoIcon, ChevronDown, ArrowUpDown, ArrowLeft, Layers, Tag, LayoutGrid, Check, Filter, Heart, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { useSettings } from '../App';
import { Product, SubCategory, WishlistItem } from '../types';

const Products: React.FC = () => {
  const { settings, products, categories, subCategories, user, wishlist, updateData, deleteData, logEvent } = useSettings();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const initialCat = query.get('category');

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCat || 'all');
  const [selectedSub, setSelectedSub] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const catRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
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
      if (filterRef.current && !filterRef.current.contains(target)) setIsFilterOpen(false);
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
    let filtered = products;

    if (search.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name', 'description', 'tags', 'features'],
        threshold: 0.3,
        ignoreLocation: true
      });
      filtered = fuse.search(search).map(result => result.item);
    }

    filtered = filtered.filter((p: Product) => {
      const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
      const matchesSub = selectedSub === 'all' || p.subCategoryId === selectedSub;
      const matchesMinPrice = minPrice === '' || p.price >= minPrice;
      const matchesMaxPrice = maxPrice === '' || p.price <= maxPrice;
      return matchesCat && matchesSub && matchesMinPrice && matchesMaxPrice;
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
  }, [search, selectedCat, selectedSub, sortBy, minPrice, maxPrice, products, categories, subCategories]);

  const renderProductMedia = (product: Product) => {
    const media = product.media || [];
    const primary = media[0];
    
    if (!primary) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><ShoppingBag size={32} /></div>;

    if (primary.type?.startsWith('image/')) {
      return <img src={primary.url} alt={primary.altText || product.name} loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
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

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    const existingItem = wishlist.find(item => item.productId === productId && item.userId === user.id);
    
    if (existingItem) {
      await deleteData('wishlist', existingItem.id);
      logEvent('click', `Removed from Wishlist: ${productId}`);
    } else {
      const newItem: WishlistItem = {
        id: crypto.randomUUID(),
        userId: user.id,
        productId,
        createdAt: Date.now()
      };
      await updateData('wishlist', newItem);
      logEvent('click', `Added to Wishlist: ${productId}`);
    }
  };

  return (
    <main className="min-h-screen pb-20 md:pb-32 bg-white max-w-full overflow-x-hidden pt-0">
      <style>{`
        .subcat-row-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 0.75rem;
          padding: 1rem 2rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          background: rgba(248, 250, 252, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          border: 1px solid rgba(241, 245, 249, 1);
        }
        .subcat-row-container::-webkit-scrollbar {
          display: none;
        }
        .infinite-scroll-mask {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        @media (min-width: 1024px) {
           .subcat-row-container {
              padding: 1rem 4rem;
           }
        }
      `}</style>
      
      {/* Persistent Fixed Back Button for catalog page */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-6 md:top-12 md:left-12 z-[60] w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-2xl border border-slate-100 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xl group"
      >
        <ArrowLeft size={24} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* --- HERO SECTION --- */}
      <div className="relative h-[40vh] md:h-[65vh] w-full overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${heroContent.image})`,
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
            opacity: Math.max(0.5, 1 - scrollY / 800)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        <div 
          className="relative h-full max-w-7xl mx-auto px-6 flex flex-row items-center justify-between text-left pb-12 pt-24 md:pt-32"
          style={{ 
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 1 - scrollY / 700 
          }}
        >
          <div className="max-w-[70%] md:max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-start gap-3 md:gap-6 mb-4 md:mb-6">
              <div className="h-px w-6 md:w-12 bg-primary/50"></div>
              <span className="text-[6px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-primary">
                {heroContent.badge}
              </span>
              <div className="h-px w-6 md:w-12 bg-primary/50"></div>
            </div>
            <h1 className="text-xl md:text-7xl font-serif text-white mb-4 md:mb-6 tracking-tighter leading-[0.9] text-balance">
              {heroContent.title}
            </h1>
            <p className="text-white/60 text-[8px] md:text-xl font-light leading-relaxed max-w-2xl text-pretty">
              {heroContent.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION & FILTERS --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-8 md:-mt-14 relative z-40">
        
        {/* Department Dropdown & Search Bar */}
        <div className="flex flex-row gap-2 md:gap-6 mb-8 md:mb-12">
           <div className="relative flex-grow group">
              <div className="relative flex items-center bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 focus-within:-translate-y-1">
                <Search className="ml-4 md:ml-8 text-slate-300 w-3.5 h-3.5 md:w-5 md:h-5" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder={settings.productsSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 md:px-6 py-3 md:py-7 bg-transparent outline-none text-[10px] md:text-base font-light text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex gap-2 md:gap-4">
              <div className="relative" ref={catRef}>
                <button 
                  onClick={() => { setIsCatOpen(!isCatOpen); setIsSortOpen(false); }}
                  className={`flex items-center gap-2 md:gap-6 px-4 md:px-10 py-3 md:py-7 rounded-2xl md:rounded-3xl text-[6px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] border transition-all shadow-2xl ${
                    isCatOpen || selectedCat !== 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'
                  }`}
                >
                  <Layers className={`w-3 h-3 md:w-4 md:h-4 ${isCatOpen || selectedCat !== 'all' ? 'text-primary' : 'text-slate-400'}`} strokeWidth={1.5} />
                  <span className="min-w-[60px] md:min-w-[140px] text-left truncate">{selectedCat === 'all' ? (settings.productsAllCollectionsLabel || 'All') : categories.find(c => c.id === selectedCat)?.name}</span>
                  <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-500 ${isCatOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                </button>
                
                {isCatOpen && (
                  <div className="absolute top-full left-0 md:right-0 mt-4 w-80 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 p-3">
                    <button 
                      onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setIsCatOpen(false); }}
                      className={`w-full text-left px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${selectedCat === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {settings.productsBrowseEverythingLabel || 'Browse Everything'}
                    </button>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); setIsCatOpen(false); }}
                          className={`w-full text-left px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${selectedCat === cat.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); setIsCatOpen(false); }}
                  className={`flex items-center justify-center w-10 md:w-20 h-full rounded-2xl md:rounded-3xl border transition-all shadow-2xl ${
                    isFilterOpen || minPrice !== '' || maxPrice !== '' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  <Filter className={`w-4 h-4 md:w-5 md:h-5 ${isFilterOpen || minPrice !== '' || maxPrice !== '' ? 'text-primary' : 'text-slate-400'}`} strokeWidth={1.5} />
                </button>
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-4 w-64 md:w-72 bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 p-6 md:p-8">
                    <h4 className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">Price Range</h4>
                    <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
                      <div className="flex-1">
                        <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 md:mb-2 block">Min</label>
                        <input 
                          type="number" 
                          value={minPrice} 
                          onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl text-xs outline-none focus:border-primary transition-colors"
                          placeholder="0"
                        />
                      </div>
                      <div className="text-slate-200 font-bold mt-4 md:mt-6">-</div>
                      <div className="flex-1">
                        <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 md:mb-2 block">Max</label>
                        <input 
                          type="number" 
                          value={maxPrice} 
                          onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl text-xs outline-none focus:border-primary transition-colors"
                          placeholder="Any"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <button 
                        onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                        className="flex-1 py-3 md:py-4 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                      >
                        Clear
                      </button>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1 py-3 md:py-4 bg-slate-900 text-white rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={sortRef}>
                <button 
                  onClick={() => { setIsSortOpen(!isSortOpen); setIsCatOpen(false); }}
                  className={`flex items-center justify-center w-10 md:w-20 h-full rounded-2xl md:rounded-3xl border transition-all shadow-2xl ${
                    isSortOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-4 w-56 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 p-3">
                      {[
                        { id: 'newest', label: 'Latest Arrivals' },
                        { id: 'price-low', label: 'Price: Low to High' },
                        { id: 'price-high', label: 'Price: High to Low' },
                        { id: 'name', label: 'Alphabetical' },
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                          className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${
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
        <div className="relative mb-20">
           <div className="flex items-center justify-between px-4 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 flex items-center gap-3">
                 <Tag size={14} strokeWidth={1.5} className="text-primary" /> {settings.productsNichesLabel || 'Curated Niches'}
              </span>
              <div className="h-px flex-grow mx-8 bg-slate-100"></div>
              {selectedSub !== 'all' && (
                <button 
                  onClick={() => setSelectedSub('all')}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  {settings.productsClearFilterLabel || 'Clear Filter'} <X size={12} strokeWidth={2} />
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
                  className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap scroll-snap-align-start h-fit flex-shrink-0 ${
                    selectedSub === 'all' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/30'
                  }`}
                >
                  {settings.productsFilterAll || 'Show All'}
                </button>

                {currentSubCategories.map((sub: SubCategory) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub.id)}
                    className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap scroll-snap-align-start h-fit flex-shrink-0 ${
                      selectedSub === sub.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/30'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* --- GROUPED PRODUCT GRID --- */}
        {groupedProducts.length > 0 ? (
          <div className="space-y-32 md:space-y-48">
            {groupedProducts.map((group, gIdx) => (
              <section key={group.name} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${gIdx * 100}ms` }}>
                <div className="flex items-center gap-8 mb-12 md:mb-20">
                  <div className="flex-shrink-0 flex items-center gap-6">
                    <span className="text-primary font-serif italic text-2xl md:text-4xl">
                      {(gIdx + 1).toString().padStart(2, '0')}
                    </span>
                    <h2 className="text-3xl md:text-6xl font-serif text-slate-900 tracking-tighter">
                      {group.name}
                    </h2>
                  </div>
                  <div className="h-px flex-grow bg-slate-100 relative">
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-1 bg-primary rounded-full"></div>
                  </div>
                  <div className="hidden md:block">
                     <span className="px-6 py-3 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {group.items.length} {settings.productsSelectionsLabel || 'Selections'}
                     </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-12">
                  {group.items.map((product: Product) => (
                    <div 
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group flex flex-col relative cursor-pointer"
                    >
                      {/* Product Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-slate-50 mb-3 md:mb-8 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                        {renderProductMedia(product)}
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 md:top-6 md:left-6 z-20 flex flex-col gap-1 md:gap-2">
                          {product.discountRules && product.discountRules.length > 0 && (
                            <div className="bg-red-500 text-white px-2 py-0.5 md:px-4 md:py-1.5 rounded-full font-black text-[6px] md:text-[9px] uppercase tracking-widest shadow-xl">
                              {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
                            </div>
                          )}
                          {product.stock === 0 ? (
                            <div className="bg-slate-900 text-white px-2 py-0.5 md:px-4 md:py-1.5 rounded-full font-black text-[6px] md:text-[9px] uppercase tracking-widest shadow-xl backdrop-blur-md">
                              Sold Out
                            </div>
                          ) : product.stock && product.stock <= 5 ? (
                            <div className="bg-amber-500 text-white px-2 py-0.5 md:px-4 md:py-1.5 rounded-full font-black text-[6px] md:text-[9px] uppercase tracking-widest shadow-xl backdrop-blur-md">
                              Only {product.stock} Left
                            </div>
                          ) : null}
                        </div>

                        {/* Wishlist Button */}
                        <button 
                          onClick={(e) => toggleWishlist(e, product.id)}
                          className="absolute top-3 right-3 md:top-6 md:right-6 z-20 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-xl opacity-0 translate-y-2 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-white"
                        >
                          <Heart 
                            className={`w-4 h-4 md:w-5 md:h-5 ${user && wishlist.some(w => w.productId === product.id && w.userId === user.id) ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-500 transition-colors"}`} 
                            strokeWidth={1.5}
                          />
                        </button>

                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                          <div className="px-4 py-2 md:px-8 md:py-4 bg-white text-slate-900 rounded-xl md:rounded-2xl text-[6px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                            View Details
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex flex-col text-center px-2 md:px-4">
                        <span className="text-[6px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.4em] mb-1 md:mb-3">
                           {categories.find(c => c.id === product.categoryId)?.name}
                        </span>
                        <h3 className="text-[10px] md:text-2xl font-serif text-slate-900 mb-2 md:mb-4 group-hover:text-primary transition-colors duration-500 leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 md:gap-4">
                          <span className="text-[9px] md:text-lg font-light text-slate-900">
                            R {(product.price || 0).toLocaleString()}
                          </span>
                          {product.wasPrice && product.wasPrice > 0 && (
                            <span className="text-[7px] md:text-sm font-light text-slate-300 line-through">
                              R {product.wasPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white text-slate-200 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
              <Search size={40} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif text-slate-900 mb-6 tracking-tight">{settings.emptyProductsTitle || 'No Selections Found'}</h3>
            <p className="text-slate-400 max-w-sm mx-auto text-base font-light leading-relaxed mb-12">{settings.productsEmptyMessage || 'We couldn\'t find any pieces matching your current filters. Try broadening your discovery.'}</p>
            <button 
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setSearch(''); }} 
              className="px-12 py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-slate-900 transition-all shadow-2xl"
            >
              {settings.emptyProductsResetLabel || 'Reset All Filters'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;