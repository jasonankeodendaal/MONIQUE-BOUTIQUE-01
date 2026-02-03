
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, Package, Share2, Star, MessageCircle, ChevronDown, Minus, Plus, X, Facebook, Twitter, Mail, Copy, CheckCircle, Check, ShoppingBag, Loader2, Quote, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { useSettings } from '../App';
import { useCart } from '../context/CartContext';
import { Review, Product } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Signature from '../components/Signature';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings, products, categories, updateData, logEvent, isDataLoaded } = useSettings();
  const { addToCart } = useCart();
  
  const product = products.find((p: Product) => p.id === id);
  const category = categories.find(c => c.id === product?.categoryId);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ userName: '', comment: '', rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Direct Sale State
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Affiliate Bridge State
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Share State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setIsLoaded(true), 100);
    if (id && product) {
        logEvent('view', `Product: ${product.name}`);
    }
    return () => clearTimeout(timeout);
  }, [id, product]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('reviews').select('*').eq('productId', id).order('createdAt', { ascending: false });
        if (data) setReviews(data);
      } else {
        try {
            const allReviews: Review[] = JSON.parse(localStorage.getItem('site_reviews') || '[]');
            const productReviews = allReviews.filter(r => r.productId === id).sort((a, b) => b.createdAt - a.createdAt);
            setReviews(productReviews || []);
        } catch (e) {
            setReviews([]);
        }
      }
    };
    fetchReviews();
  }, [id, isSupabaseConfigured]);

  useEffect(() => {
    if (product) {
        document.title = `${product.name} | ${settings.companyName}`;
        const updateMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[property="${name}"]`) || document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };
        const safeDesc = (product.description || '').substring(0, 200);
        updateMeta('og:title', product.name || '');
        updateMeta('og:description', safeDesc);
        updateMeta('og:image', product.media?.[0]?.url || '');
    }
  }, [product, settings.companyName]);

  const sharePayload = useMemo(() => {
      if (!product) return { title: '', text: '', url: '' };
      const discount = product.discountRules?.[0];
      const discountString = discount ? (discount.type === 'percentage' ? `-${discount.value}%` : `-R${discount.value}`) : '';
      const priceVal = product.price || 0;
      const priceString = `R ${priceVal.toLocaleString()}`;
      const description = product.description || '';
      const safeDesc = description ? (description.length > 150 ? `${description.substring(0, 150)}...` : description) : '';
      const adText = [`✨ ${product.name} ✨`, '', safeDesc, '', `💎 Price: ${priceString} ${discountString ? `(${discountString} OFF 🔥)` : ''}`, '', '👇 View details & Acquire:'].join('\n');
      return { title: product.name, text: adText, url: window.location.href };
  }, [product]);

  const socialShares = useMemo(() => {
    const { title, text, url } = sharePayload;
    const encodedText = encodeURIComponent(text + '\n' + url);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return [
      { 
        name: 'WhatsApp', 
        icon: MessageCircle, 
        url: `https://wa.me/?text=${encodedText}`, 
        color: 'bg-[#25D366]/10', 
        text: 'text-[#25D366]' 
      },
      { 
        name: 'Facebook', 
        icon: Facebook, 
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, 
        color: 'bg-[#1877F2]/10', 
        text: 'text-[#1877F2]' 
      },
      { 
        name: 'Twitter', 
        icon: Twitter, 
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}`, 
        color: 'bg-[#1DA1F2]/10', 
        text: 'text-[#1DA1F2]' 
      },
      { 
        name: 'Email', 
        icon: Mail, 
        url: `mailto:?subject=${encodedTitle}&body=${encodedText}`, 
        color: 'bg-slate-100', 
        text: 'text-slate-600' 
      },
    ];
  }, [sharePayload]);

  const handleAffiliateClick = (e: React.MouseEvent) => {
    if (!product?.affiliateLink) return;
    e.preventDefault();
    logEvent('click', `Affiliate Redirect: ${product.name}`);
    setIsRedirecting(true);
    setTimeout(() => {
        window.open(product.affiliateLink, '_blank');
        setIsRedirecting(false);
    }, 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmittingReview(true);
    const review: Review = { id: Date.now().toString(), productId: product.id, userName: newReview.userName || 'Guest', rating: newReview.rating, comment: newReview.comment, createdAt: Date.now() };
    if (isSupabaseConfigured) { await supabase.from('reviews').insert(review); } 
    else { const allReviews: Review[] = JSON.parse(localStorage.getItem('site_reviews') || '[]'); localStorage.setItem('site_reviews', JSON.stringify([review, ...allReviews])); }
    setReviews(prev => [review, ...prev]);
    setNewReview({ userName: '', comment: '', rating: 5 });
    setIsSubmittingReview(false);
  };

  const handleAddToCart = () => {
     if (!product) return;
     addToCart(product, quantity);
     setAddedToCart(true);
     logEvent('click', `Add to Cart: ${product.name}`);
     setTimeout(() => setAddedToCart(false), 2000);
  };

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / reviews.length);
  }, [reviews]);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="flex flex-col items-center gap-4"><Loader2 className="animate-spin text-slate-900" size={32} /><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Collection...</p></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-6">
        <div><Package size={64} className="text-slate-200 mx-auto mb-6" /><h2 className="text-3xl font-serif mb-4">Piece Not Found</h2><button onClick={() => navigate('/products')} className="text-primary font-bold uppercase tracking-widest text-xs">Return to Collection</button></div>
      </div>
    );
  }

  const media = product.media || [];
  const currentMedia = media[activeMediaIndex];
  const nextMedia = () => setActiveMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  const prevMedia = () => setActiveMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  const isOutOfStock = product.isDirectSale && (product.stockQuantity || 0) <= 0;

  return (
    <main className={`min-h-screen bg-[#FDFCFB] pt-28 md:pt-32 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Affiliate Bridge Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="text-center p-8 max-w-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-8 relative">
                 <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                 <Sparkles className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">Connecting you...</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Taking you to my verified partner for secure checkout. Thank you for supporting my curation!
              </p>
              <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">Curator Trusted Partner</span>
              </div>
           </div>
        </div>
      )}

      <div className="hidden lg:block absolute top-32 left-10 md:left-20 z-30">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <Link to="/" className="hover:text-primary transition-colors">Home</Link>
           <ChevronRight size={10} /><Link to="/products" className="hover:text-primary transition-colors">Collections</Link>
           {category && (<><ChevronRight size={10} /><Link to={`/products?category=${category.id}`} className="hover:text-primary transition-colors">{category.name}</Link></>)}
           <ChevronRight size={10} /><span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
        
        {/* Media Gallery */}
        <div className="w-full lg:w-3/5 h-[45vh] md:h-[55vh] lg:h-full relative bg-slate-100 overflow-hidden group rounded-t-[2.5rem] lg:rounded-tr-none lg:rounded-l-[2.5rem]">
          <button onClick={() => navigate('/products')} className="absolute top-6 left-6 md:top-10 md:left-10 lg:hidden z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20"><ArrowLeft size={20} /></button>
          <div className="absolute inset-0 flex items-center justify-center">
            {currentMedia ? (currentMedia.type.startsWith('video') ? (<video key={currentMedia.id} src={currentMedia.url} autoPlay loop muted playsInline className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"/>) : (<img key={currentMedia.id} src={currentMedia.url} alt={product.name} className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"/>)) : (<div className="text-slate-200"><Package size={80} className="md:w-32 md:h-32"/></div>)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
          {media.length > 1 && (<><div className="absolute inset-y-0 left-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={prevMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"><ChevronLeft size={24} /></button></div><div className="absolute inset-y-0 right-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={nextMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"><ChevronRight size={24} /></button></div><div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">{media.map((_: any, i: number) => (<button key={i} onClick={() => setActiveMediaIndex(i)} className={`h-1.5 transition-all duration-500 rounded-full ${i === activeMediaIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}/>))}</div></>)}
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-2/5 lg:h-full lg:overflow-y-auto bg-white p-6 md:p-12 lg:pt-32 border-l border-slate-50">
          <div className="max-w-xl mx-auto space-y-10 pb-20">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="flex gap-0.5 text-primary">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={14} fill={star <= averageRating ? "currentColor" : "none"} />))}</div><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">({reviews.length} Verified Reviews)</span></div>
                <button onClick={() => setIsShareOpen(true)} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"><Share2 size={18} /></button>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-black text-slate-900">R {(product.price || 0).toLocaleString()}</span>
                {product.discountRules && product.discountRules.length > 0 && (<span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">{product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}</span>)}
              </div>
            </div>

            {/* ACTION SECTION */}
            <div className="py-8 border-y border-slate-100 space-y-6">
               {product.isDirectSale ? (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Quantity</span>
                         <div className={`flex items-center bg-slate-100 rounded-xl ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"><Minus size={14}/></button>
                            <span className="w-10 text-center font-bold text-slate-900">{quantity}</span>
                            <button onClick={() => setQuantity(Math.min((product.stockQuantity || 1), quantity + 1))} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"><Plus size={14}/></button>
                         </div>
                      </div>
                      <button onClick={handleAddToCart} disabled={isOutOfStock || addedToCart} className={`w-full py-5 font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : addedToCart ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary text-slate-900 hover:brightness-110 shadow-primary/20 active:scale-95'}`}>{isOutOfStock ? 'Sold Out' : (addedToCart ? (<><span>Added to Bag</span><CheckCircle size={16}/></>) : (<><span>Add to Shopping Bag</span><ShoppingBag size={16}/></>))}</button>
                  </div>
               ) : (
                  <div className="space-y-4">
                    <button onClick={handleAffiliateClick} className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-primary hover:text-slate-900 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"><span>Secure Acquisition</span><ExternalLink size={18} /></button>
                    <div className="flex items-center justify-center gap-2">
                       <ShieldCheck size={12} className="text-green-500" />
                       <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Bridging you to a verified partner</p>
                    </div>
                  </div>
               )}
            </div>

            {/* CURATOR'S NOTE - Re-styled as Letter of Recommendation */}
            <div className="bg-[#FDFBF7] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group border border-primary/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
               {/* Paper Texture Overlay */}
               <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="absolute top-4 right-4 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Award size={80} className="text-primary" />
                  </div>

                  <div className="mb-10 flex flex-col items-center">
                     <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/70 mb-3 block">Personal Recommendation</span>
                     <h4 className="text-xs font-serif italic text-slate-400">From the desk of</h4>
                     <h3 className="text-2xl font-serif text-slate-900 mt-1">{settings.aboutFounderName}</h3>
                  </div>

                  <div className="w-16 h-px bg-primary/20 mb-12"></div>

                  <p className="text-slate-800 font-serif italic text-2xl md:text-3xl leading-relaxed mb-14 max-w-lg">
                     "I hand-selected this piece specifically for its timeless silhouette and exceptional material quality. It is my professional opinion that this remains a cornerstone of any discerning wardrobe."
                  </p>
                  
                  <div className="flex flex-col items-center gap-2">
                    <Signature className="h-16 text-primary/80" />
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-primary/10 w-40 justify-center">
                       <ShieldCheck size={14} className="text-primary/50" />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Access</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-4 text-left">
              <p className="text-slate-600 leading-relaxed font-light">{product.description}</p>
              {product.features && (<ul className="space-y-3">{product.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3 text-sm text-slate-600"><CheckCircle size={18} className="text-primary mt-0.5 flex-shrink-0" /><span>{feature}</span></li>))}</ul>)}
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
               <div className="border border-slate-100 rounded-3xl overflow-hidden">
                  <button onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')} className="w-full px-8 py-5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"><span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Technical Specifications</span>{openAccordion === 'specs' ? <Minus size={14}/> : <Plus size={14}/>}</button>
                  {openAccordion === 'specs' && (<div className="px-8 py-6 bg-white grid grid-cols-2 gap-x-8 gap-y-6 text-left">{Object.entries(product.specifications).map(([key, value]) => (<div key={key}><span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{key}</span><span className="text-sm text-slate-800 font-medium">{value}</span></div>))}</div>)}
               </div>
            )}

            {/* Reviews */}
            <div className="pt-8 space-y-10 text-left">
               <div className="flex items-center justify-between border-b border-slate-100 pb-6"><h3 className="text-2xl font-serif text-slate-900">Client Perspectives</h3><button onClick={() => setOpenAccordion(openAccordion === 'review' ? null : 'review')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-slate-900 transition-colors bg-primary/10 px-4 py-2 rounded-full">Write Review</button></div>
               {openAccordion === 'review' && (<form onSubmit={handleSubmitReview} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6 animate-in slide-in-from-top-4"><div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Rating</label><div className="flex gap-2">{[1,2,3,4,5].map(star => (<button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})} className="focus:outline-none hover:scale-110 transition-transform"><Star size={24} fill={star <= newReview.rating ? "#D4AF37" : "none"} className={star <= newReview.rating ? "text-primary" : "text-slate-300"} /></button>))}</div></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Name</label><input type="text" required value={newReview.userName} onChange={e => setNewReview({...newReview, userName: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-slate-900 outline-none text-sm bg-white" placeholder="Your Name" /></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Experience</label><textarea rows={4} required value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-slate-900 outline-none text-sm bg-white resize-none" placeholder="Share your thoughts..." /></div><button disabled={isSubmittingReview} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-xl disabled:opacity-50">{isSubmittingReview ? 'Submitting...' : 'Post My Perspective'}</button></form>)}
               <div className="space-y-8">{reviews.length > 0 ? reviews.map(review => (<div key={review.id} className="border-b border-slate-100 pb-8 last:border-0"><div className="flex items-center justify-between mb-3"><span className="font-bold text-slate-900 text-base">{review.userName}</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span></div><div className="flex gap-1 text-primary mb-3">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />)}</div><p className="text-slate-600 text-sm leading-relaxed font-light">"{review.comment}"</p></div>)) : (<div className="text-center py-12 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200"><p className="text-slate-400 text-sm">No perspectives recorded yet. Be the first to share your experience.</p></div>)}</div>
            </div>

          </div>
        </div>
      </div>
      
      {isShareOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm relative shadow-2xl">
               <button onClick={() => setIsShareOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"><X size={20} className="text-slate-500"/></button>
               <h3 className="text-2xl font-serif text-slate-900 mb-2 text-center">Share Curation</h3>
               <p className="text-center text-slate-400 text-xs mb-8">Spread the vision with your collective.</p>
               <div className="grid grid-cols-4 gap-4 mb-8">
                  {socialShares.map((s) => (<a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${s.color} ${s.text} group-hover:scale-110 transition-transform`}><s.icon size={24} /></div><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.name}</span></a>))}
               </div>
               <div className="relative"><div className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 overflow-hidden whitespace-nowrap text-ellipsis font-medium">{sharePayload.text.substring(0, 40)}...</div><button onClick={() => { navigator.clipboard.writeText(`${sharePayload.text}\n${sharePayload.url}`); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white shadow-sm border border-slate-100 rounded-xl hover:text-primary transition-colors" title="Copy full ad text">{copySuccess ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}</button></div>
               {copySuccess && <p className="text-[10px] text-green-500 text-center mt-3 font-black uppercase tracking-widest animate-in fade-in">Link & Meta Transmitted!</p>}
            </div>
         </div>
      )}
    </main>
  );
};

export default ProductDetail;
