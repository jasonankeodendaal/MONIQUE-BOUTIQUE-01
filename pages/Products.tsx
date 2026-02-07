
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

  useEffect(() => {
    const el = subScrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => { if (e.deltaY !== 0) { e.preventDefault(); el.scrollLeft += e.deltaY; } };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [subScrollRef]);

  useEffect(() => {
    if (initialCat) { setSelectedCat(initialCat); setSelectedSub('all'); }
  }, [initialCat]);

  const heroContent = useMemo(() => {
    if (selectedCat !== 'all') {
      const cat = categories.find(c => c.id === selectedCat);
      if (cat) {
        return { title: cat.name, subtitle: cat.description || settings.productsHeroSubtitle, image: cat.image || settings.productsHeroImage, badge: 'Department Focus' };
      }
    }
    return { title: settings.productsHeroTitle, subtitle: settings.productsHeroSubtitle, image: settings.productsHeroImage, badge: 'The Collective Catalog' };
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

  const groupedProducts = useMemo(() => {
    let filtered = products.filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
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
      let groupKey = selectedCat === 'all' ? p.categoryId : (p.subCategoryId || 'none');
      let groupName = selectedCat === 'all' ? (categories.find(c => c.id === p.categoryId)?.name || 'General') : (subCategories.find(s => s.id === p.subCategoryId)?.name || 'Selections');
      if (!groups[groupKey]) groups[groupKey] = { name: groupName, items: [] };
      groups[groupKey].items.push(p);
    });
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [search, selectedCat, selectedSub, sortBy, products, categories, subCategories]);

  const renderProductMedia = (product: Product) => {
    const primary = product.media?.[0];
    if (!primary) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><ShoppingBag size={32} /></div>;
    if (primary.type?.startsWith('image/')) return <img src={primary.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
    return <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white"><VideoIcon size={32} className="mb-2 opacity-30" /><span className="text-[8px] uppercase font-black tracking-widest text-white/50">Cinematic Preview</span></div>;
  };

  return (
    <div className="min-h-screen pb-20 bg-[#FDF5F2] overflow-x-hidden pt-0 shrink-fit">
      <style>{`
        .subcat-row-container { display: flex; flex-wrap: nowrap; gap: 0.75rem; padding: 1.5rem 2rem; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
        .subcat-row-container::-webkit-scrollbar { height: 3px; }
        .infinite-scroll-mask { mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); }
        .shrink-fit { width: 100%; max-width: 100vw; }
      `}</style>
      
      {/* PERSISTENT BACK BUTTON - MOVED DOWN FOR CLEARANCE */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 md:top-32 md:left-12 z-[100] w-12 h-12 md:w-16 md:h-16 bg-white/60 backdrop-blur-2xl border border-primary/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-2xl group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* HERO SECTION */}
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-black pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroContent.image})`,
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
            opacity: Math.max(0.4, 1 - scrollY / 800)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="relative h-full max-w-7xl mx-auto px-5 flex flex-col justify-center items-center text-center">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-primary mb-4 block">{heroContent.badge}</span>
            <h1 className="font-serif text-white mb-4 tracking-tighter leading-[0.9]" style={{ fontSize: 'clamp(2rem, 8vw, 5rem)' }}>{heroContent.title}</h1>
            <p className="text-white/70 text-xs md:text-lg font-light leading-relaxed max-w-2xl mx-auto">{heroContent.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-40">
        
        {/* Filters Grid - Responsive */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-grow">
              <div className="relative flex items-center bg-white/90 backdrop-blur-md border border-[#B76E79]/10 rounded-2xl shadow-lg overflow-hidden">
                <Search className="ml-6 text-slate-300" size={20} />
                <input
                  type="text"
                  placeholder={settings.productsSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-4 md:py-5 bg-transparent outline-none text-sm md:text-base font-light text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative" ref={catRef}>
                <button 
                  onClick={() => setIsCatOpen(!isCatOpen)}
                  className={`flex items-center gap-4 px-6 py-4 md:py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all shadow-lg ${selectedCat !== 'all' ? 'bg-primary text-slate-900' : 'bg-white text-slate-500'}`}
                >
                  <Layers size={14} />
                  <span className="min-w-[100px] text-left truncate">{selectedCat === 'all' ? 'All' : categories.find(c => c.id === selectedCat)?.name}</span>
                  <ChevronDown size={14} className={isCatOpen ? 'rotate-180' : ''} />
                </button>
                {isCatOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] p-2">
                    <button onClick={() => { setSelectedCat('all'); setIsCatOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-[9px] font-bold uppercase hover:bg-slate-50">Everything</button>
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => { setSelectedCat(cat.id); setIsCatOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-[9px] font-bold uppercase hover:bg-slate-50">{cat.name}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* Product Grid */}
        {groupedProducts.length > 0 ? (
          <div className="space-y-20 md:space-y-32">
            {groupedProducts.map((group, gIdx) => (
              <section key={group.name} className="animate-in fade-in slide-in-from-bottom-12 duration-700">
                <div className="flex items-center gap-4 mb-10">
                   <h2 className="text-2xl md:text-4xl font-serif text-slate-900 tracking-tighter capitalize">{group.name}</h2>
                   <div className="h-px flex-grow bg-[#B76E79]/10"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {group.items.map((product: Product) => (
                    <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-[#B76E79]/5 shadow-sm hover:shadow-2xl transition-all duration-700 group hover:-translate-y-2 flex flex-col cursor-pointer">
                      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                        {renderProductMedia(product)}
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-900 shadow-xl border border-white/50">
                            R {product.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col text-left">
                        <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em] mb-1">{categories.find(c => c.id === product.categoryId)?.name}</span>
                        <h3 className="text-[11px] md:text-sm font-serif text-slate-900 line-clamp-2 min-h-[2.5em]">{product.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/40 rounded-3xl border border-dashed border-[#B76E79]/20">
            <p className="text-slate-400 text-sm font-light">No curations match these parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
