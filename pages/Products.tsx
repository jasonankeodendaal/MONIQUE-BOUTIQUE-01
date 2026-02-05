
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ShoppingBag, CheckCircle, FileText, Video as VideoIcon, ChevronDown, Filter, ArrowUpDown, ArrowRight, ArrowLeft, Layers, Tag, LayoutGrid } from 'lucide-react';
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
  
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const catRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (initialCat) setSelectedCat(initialCat);
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
      if (subRef.current && !subRef.current.contains(target)) setIsSubOpen(false);
      if (sortRef.current && !sortRef.current.contains(target)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSubCategories = useMemo(() => {
    if (selectedCat === 'all') return [];
    return subCategories.filter((s: any) => s.categoryId === selectedCat);
  }, [selectedCat, subCategories]);

  // Hierarchical Grouping Logic
  const groupedProducts = useMemo(() => {
    // 1. First, apply flat filters
    let filtered = products.filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
      const matchesSub = selectedSub === 'all' || p.subCategoryId === selectedSub;
      return matchesSearch && matchesCat && matchesSub;
    });

    // 2. Sort the flat list within groups
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    // 3. Create Groups
    const groups: Record<string, { name: string; items: Product[] }> = {};

    filtered.forEach(p => {
      let groupKey = '';
      let groupName = '';

      if (selectedCat === 'all') {
        // Group by Category when viewing all
        groupKey = p.categoryId;
        groupName = categories.find(c => c.id === p.categoryId)?.name || 'General Collections';
      } else {
        // Group by Sub-category when viewing specific department
        groupKey = p.subCategoryId || 'none';
        groupName = subCategories.find(s => s.id === p.subCategoryId)?.name || 'General Selections';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { name: groupName, items: [] };
      }
      groups[groupKey].items.push(p);
    });

    // 4. Convert to array and Sort Alphabetically by group name
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

  const getSortLabel = (id: string) => {
    const labels: Record<string, string> = { newest: 'Latest', 'price-low': 'Price: Low', 'price-high': 'Price: High', name: 'Name' };
    return labels[id] || 'Latest';
  };

  return (
    <div className="min-h-screen pb-20 md:pb-32 bg-copper-wash max-w-full overflow-x-hidden pt-24">
      
      <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${heroContent.image})`,
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
            opacity: Math.max(0.4, 1 - scrollY / 800)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
        
        <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 md:top-10 md:left-10 z-30 w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20 group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

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
        
        <div className="relative -mt-8 md:-mt-12 mb-8 md:mb-12 px-1 md:px-2 z-10">
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

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-8 md:mb-16 px-1 md:px-2 z-20 relative">
          <div className="relative" ref={catRef}>
             <button 
                onClick={() => { setIsCatOpen(!isCatOpen); setIsSubOpen(false); setIsSortOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                  isCatOpen || selectedCat !== 'all' ? 'bg-primary text-white border-primary' : 'bg-white/60 backdrop-blur-md text-slate-500 border-slate-100'
                }`}
             >
                <Layers size={12} className={isCatOpen || selectedCat !== 'all' ? 'text-white' : 'text-primary'} />
                <span>Dept: {selectedCat === 'all' ? 'All' : categories.find(c => c.id === selectedCat)?.name}</span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
             </button>
             {isCatOpen && (
               <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
                 <div className="p-2 space-y-0.5">
                    <button 
                      onClick={() => { setSelectedCat('all'); setSelectedSub('all'); setIsCatOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${selectedCat === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      All Departments
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); setIsCatOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${selectedCat === cat.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                 </div>
               </div>
             )}
          </div>

          {selectedCat !== 'all' && (
            <div className="relative" ref={subRef}>
               <button 
                  onClick={() => { setIsSubOpen(!isSubOpen); setIsCatOpen(false); setIsSortOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                    isSubOpen || selectedSub !== 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/60 backdrop-blur-md text-slate-500 border-slate-100'
                  }`}
               >
                  <Tag size={12} className={isSubOpen || selectedSub !== 'all' ? 'text-white' : 'text-primary'} />
                  <span>Focus: {selectedSub === 'all' ? 'All' : currentSubCategories.find(s => s.id === selectedSub)?.name}</span>
                  <ChevronDown size={10} className={`transition-transform duration-300 ${isSubOpen ? 'rotate-180' : ''}`} />
               </button>
               {isSubOpen && (
                 <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
                   <div className="p-2 space-y-0.5">
                      <button 
                        onClick={() => { setSelectedSub('all'); setIsSubOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${selectedSub === 'all' ? 'bg-slate-900/10 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        All Sub-Categories
                      </button>
                      {currentSubCategories.map((sub: any) => (
                        <button
                          key={sub.id}
                          onClick={() => { setSelectedSub(sub.id); setIsSubOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${selectedSub === sub.id ? 'bg-slate-900/10 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                   </div>
                 </div>
               )}
            </div>
          )}

          <div className="relative" ref={sortRef}>
             <button 
                onClick={() => { setIsSortOpen(!isSortOpen); setIsCatOpen(false); setIsSubOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                  isSortOpen ? 'bg-white text-primary border-primary' : 'bg-white/60 backdrop-blur-md text-slate-500 border-slate-100'
                }`}
             >
                <ArrowUpDown size={12} className="text-primary" />
                <span>Sort: {getSortLabel(sortBy)}</span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
             </button>
             {isSortOpen && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
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
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
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

        {/* AUTOMATED GROUPED GRID */}
        {groupedProducts.length > 0 ? (
          <div className="space-y-24 md:space-y-36">
            {groupedProducts.map((group, gIdx) => (
              <section key={group.name} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${gIdx * 150}ms` }}>
                <div className="flex items-center gap-6 mb-12 md:mb-20">
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <span className="text-primary font-mono text-xl md:text-2xl font-black">
                      {(gIdx + 1).toString().padStart(2, '0')}
                    </span>
                    <h2 className="text-3xl md:text-6xl font-serif text-slate-900 tracking-tighter capitalize">
                      {group.name}
                    </h2>
                  </div>
                  <div className="h-px flex-grow bg-slate-200/60 relative">
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-1 bg-primary"></div>
                  </div>
                  <div className="hidden md:block">
                     <span className="px-4 py-2 rounded-full bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {group.items.length} Selections
                     </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                  {group.items.map((product: Product) => (
                    <Link 
                      to={`/product/${product.id}`}
                      key={product.id} 
                      className="bg-white/40 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 flex flex-col relative"
                    >
                      {product.discountRules && product.discountRules.length > 0 && (
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-red-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full font-black text-[7px] md:text-[9px] uppercase tracking-widest shadow-lg z-20 animate-soft-flicker">
                          {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
                        </div>
                      )}
                      
                      <div className="relative aspect-square overflow-hidden bg-white/20">
                        {renderProductMedia(product)}
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
              </section>
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
