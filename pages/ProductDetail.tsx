import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, Package, Share2, Star, MessageCircle, ChevronDown, Minus, Plus, X, Facebook, Twitter, Mail, Copy, CheckCircle, Check, Send, RefreshCcw, Sparkles, Instagram, Linkedin, Rocket, ShieldCheck } from 'lucide-react';
import { useSettings } from '../App';
import { Review, Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings, products, categories, updateData, logEvent } = useSettings();
  
  const product = products.find((p: Product) => p.id === id);
  const category = categories.find(c => c.id === product?.categoryId);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Review Form State
  const [newReview, setNewReview] = useState({ userName: '', comment: '', rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Share State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPreparingBundle, setIsPreparingBundle] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setIsLoaded(true), 100);
    
    if (id && product) {
        logEvent('view', `Product: ${product.name}`);
    }

    return () => clearTimeout(timeout);
  }, [id, product, logEvent]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmittingReview(true);
    
    const review: Review = {
        id: Date.now().toString(),
        userName: newReview.userName || 'Guest',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: Date.now()
    };

    const updatedProduct = { ...product, reviews: [review, ...(product.reviews || [])] };
    await updateData('products', updatedProduct);
      
    setNewReview({ userName: '', comment: '', rating: 5 });
    setIsSubmittingReview(false);
  };

  // Curated Ad Content Generator
  const adContent = useMemo(() => {
    if (!product) return { caption: '', pitch: '', shortPitch: '' };
    
    const desc = product.description || '';
    const compName = settings.companyName || 'Maison';
    const discount = product.discountRules?.[0];
    const discountString = discount 
      ? (discount.type === 'percentage' ? `${discount.value}% OFF` : `R${discount.value} OFF`) 
      : '';
    
    const pitch = `✨ Curated Find: ${product.name}\n\n${desc.substring(0, 120)}${desc.length > 120 ? '...' : ''}\n\n${discountString ? `🔥 Limited Offer: ${discountString}\n` : ''}💎 Exclusive to ${compName}`;
    const fullCaption = `${pitch}\n\nShop here: ${window.location.href}\n\n#${compName.replace(/\s/g, '')} #Curation #LuxuryStyle`;
    
    return { caption: fullCaption, pitch, shortPitch: `Check out this ${product.name} at ${compName}!` };
  }, [product, settings]);

  const handleShareTrigger = () => {
    if (!product) return;
    logEvent('share', `Product: ${product.name} - Preview`);
    setIsShareOpen(true);
  };

  const executeNativeShare = async () => {
    if (!product) return;
    setIsPreparingBundle(true);
    logEvent('share', `Product: ${product.name} - Executed`);

    const shareData: ShareData = {
      title: product.name,
      text: adContent.caption,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        const imgUrl = product.media?.[activeMediaIndex]?.url || product.media?.[0]?.url;
        if (imgUrl) {
          try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const file = new File([blob], `${product.name.replace(/\s/g, '_')}.jpg`, { type: blob.type });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
               shareData.files = [file];
            }
          } catch (e) {
            console.warn("Media bundling failed, falling back to text only", e);
          }
        }

        await navigator.share(shareData);
      } catch (err) {
        console.log("Native share failed or cancelled", err);
      } finally {
        setIsPreparingBundle(false);
      }
    } else {
        // Fallback: Copy link and alert user
        handleCopyLink();
        setIsPreparingBundle(false);
        alert("Advert link copied! Please paste it into your desired app.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${adContent.caption}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const averageRating = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / product.reviews.length);
  }, [product?.reviews]);

  const socialShares = useMemo(() => {
     const url = window.location.href;
     const text = adContent.caption;
     return [
      { name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366]', text: 'text-white', url: `https://wa.me/?text=${encodeURIComponent(text)}` },
      { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', text: 'text-white', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}` },
      { name: 'X', icon: Twitter, color: 'bg-black', text: 'text-white', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}` },
      { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0A66C2]', text: 'text-white', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    ];
  }, [adContent]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-6 pt-24">
        <div>
          <Package size={64} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-3xl font-serif mb-4">Piece Not Found</h2>
          <button onClick={() => navigate('/products')} className="text-primary font-bold uppercase tracking-widest text-xs">Return to Collection</button>
        </div>
      </div>
    );
  }

  const media = product.media || [];
  const currentMedia = media[activeMediaIndex];

  const nextMedia = () => setActiveMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  const prevMedia = () => setActiveMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

  return (
    <main className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 pt-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Global Persistent Back Button */}
      <button 
        onClick={() => navigate('/products')}
        className="fixed top-8 left-6 md:top-12 md:left-12 z-[60] w-12 h-12 md:w-16 md:h-16 bg-white/60 backdrop-blur-2xl border border-primary/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-2xl group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">
        
        {/* Left Side: Cinematic Media Gallery with Rose Gold Aura */}
        <div className="w-full lg:w-3/5 h-[50vh] md:h-[60vh] lg:h-full relative overflow-hidden group">
          
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E5C1CD]/20 blur-[120px] rounded-full animate-pulse"></div>
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#E5C1CD]/10 via-transparent to-transparent"></div>
             <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-[#E5C1CD]/5 via-transparent to-transparent"></div>
          </div>

          <div className="relative h-full w-full z-10 flex items-center justify-center p-6 md:p-12 lg:p-24 lg:pt-32">
            {currentMedia ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {currentMedia.type.startsWith('video') ? (
                  <video 
                    key={currentMedia.id}
                    src={currentMedia.url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(183,110,121,0.3)] transition-all duration-1000 scale-100 group-hover:scale-[1.02]"
                  />
                ) : (
                  <img 
                    key={currentMedia.id}
                    src={currentMedia.url} 
                    alt={product.name} 
                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(183,110,121,0.3)] transition-all duration-1000 scale-100 group-hover:scale-[1.02]"
                  />
                )}
              </div>
            ) : (
              <div className="text-slate-200"><Package size={80} className="md:w-32 md:h-32"/></div>
            )}
          </div>

          {media.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-all">
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={nextMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {media.map((_: any, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveMediaIndex(i)}
                    className={`h-1.5 transition-all duration-700 rounded-full ${i === activeMediaIndex ? 'w-10 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Product Information */}
        <div className="w-full lg:w-2/5 lg:h-full lg:overflow-y-auto bg-white p-6 md:p-12 lg:pt-32 border-l border-slate-100">
          <div className="max-w-xl mx-auto space-y-10">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 text-primary">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= averageRating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">({product.reviews?.length || 0} Appraisals)</span>
                </div>
                <button onClick={handleShareTrigger} className="p-3 rounded-full bg-slate-50 hover:bg-primary/20 text-slate-400 hover:text-primary transition-all duration-300 flex items-center justify-center">
                  <Share2 size={20} />
                </button>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-[0.9] tracking-tighter text-balance">
                {product.name.split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
                <span className="italic font-light text-primary">{product.name.split(' ').slice(-1)}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Acquisition Value</span>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl md:text-4xl font-black text-slate-900">R {(product.price || 0).toLocaleString()}</span>
                    {product.discountRules && product.discountRules.length > 0 && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                        {product.discountRules[0].type === 'percentage' ? `${product.discountRules[0].value}% OFF` : `R${product.discountRules[0].value} OFF`}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col border-l border-slate-100 pl-8">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Maison SKU</span>
                   <span className="text-xs font-mono font-bold text-slate-400 tracking-tighter uppercase">{product.sku}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-10 border-t border-slate-50">
               <div className="flex gap-4">
                  <a 
                    href={product.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => logEvent('click', `Product: ${product.name}`)}
                    className="flex-grow py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-[1.5rem] hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    <span>{settings.productAcquisitionLabel || 'Secure Acquisition'}</span>
                    <ExternalLink size={16} />
                  </a>
                  <button 
                    onClick={handleShareTrigger}
                    className="w-20 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-slate-100"
                    title="Share Curation"
                  >
                    <Share2 size={24} />
                  </button>
               </div>
               <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  <Check size={12} className="text-green-500" />
                  Direct Merchant Link Verified • Secure Handshake SSL
               </div>
            </div>

            <div className="space-y-8">
              <div className="relative">
                <p className="text-lg text-slate-600 leading-relaxed font-light italic">
                  "{product.description}"
                </p>
              </div>
              
              {product.features && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
               <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                    className="w-full px-8 py-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{settings.productSpecsLabel || 'Technical Specifications'}</span>
                     <div className={`transition-transform duration-500 ${openAccordion === 'specs' ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18}/>
                     </div>
                  </button>
                  <div className={`transition-all duration-700 overflow-hidden ${openAccordion === 'specs' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 py-6 bg-white grid grid-cols-2 gap-x-12 gap-y-6">
                       {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                             <span className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">{key}</span>
                             <span className="text-sm text-slate-700 font-medium">{value}</span>
                          </div>
                       ))}
                    </div>
                  </div>
               </div>
            )}

            <div className="pt-12 space-y-10 border-t border-slate-100">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif text-slate-900">Maison Perspectives</h3>
                  <button onClick={() => setOpenAccordion(openAccordion === 'review' ? null : 'review')} className="px-5 py-2 rounded-full border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all">Submit Entry</button>
               </div>

               <div className={`transition-all duration-700 overflow-hidden ${openAccordion === 'review' ? 'max-h-[600px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
                 <form onSubmit={handleSubmitReview} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-2">Rating</label>
                          <div className="flex gap-2 p-2 bg-white rounded-xl border border-slate-100 w-fit">
                             {[1,2,3,4,5].map(star => (
                                <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})} className="focus:outline-none transition-transform hover:scale-125">
                                   <Star size={22} fill={star <= newReview.rating ? "#B76E79" : "none"} className={star <= newReview.rating ? "text-primary" : "text-slate-200"} />
                                </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-2">Client Name</label>
                          <input 
                           type="text" 
                           required
                           value={newReview.userName}
                           onChange={e => setNewReview({...newReview, userName: e.target.value})}
                           className="w-full px-5 py-3 rounded-xl border-2 border-transparent focus:border-primary/20 outline-none text-sm bg-white shadow-sm transition-all"
                           placeholder="Anonymous"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-2">Appraisal Details</label>
                       <textarea 
                        rows={4}
                        required
                        value={newReview.comment}
                        onChange={e => setNewReview({...newReview, comment: e.target.value})}
                        className="w-full px-5 py-3 rounded-xl border-2 border-transparent focus:border-primary/20 outline-none text-sm bg-white shadow-sm transition-all resize-none"
                        placeholder="Detail your experience with this curation..."
                       />
                    </div>
                    <button disabled={isSubmittingReview} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary hover:text-slate-900 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
                       {isSubmittingReview ? <RefreshCcw size={16} className="animate-spin"/> : <Send size={16}/>}
                       {isSubmittingReview ? 'Processing...' : 'Transmit Appraisal'}
                    </button>
                 </form>
               </div>

               <div className="space-y-12">
                  {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                     <div key={review.id} className="relative pl-12 md:pl-16">
                        <div className="absolute left-0 top-0 w-8 h-8 md:w-12 md:h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase">
                           {review.userName.charAt(0)}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                           <span className="font-bold text-slate-900 text-lg">{review.userName}</span>
                           <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{new Date(review.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                        </div>
                        <div className="flex gap-0.5 text-primary mb-4">
                           {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />)}
                        </div>
                        <p className="text-slate-500 text-base leading-relaxed font-light">{review.comment}</p>
                     </div>
                  )) : (
                     <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Awaiting First Perspective</p>
                     </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Strategic Share & Ad Preview Modal */}
      {isShareOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden flex flex-col md:flex-row">
               
               <button onClick={() => setIsShareOpen(false)} className="absolute top-6 right-6 z-[110] p-3 bg-slate-900/10 hover:bg-slate-900 hover:text-white rounded-full transition-all backdrop-blur-md">
                 <X size={24} />
               </button>

               {/* Advert Preview Section */}
               <div className="w-full md:w-1/2 bg-[#FDFCFB] p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                  <span className="text-[9px] font-black uppercase text-primary tracking-[0.4em] mb-8 block">Generation Preview</span>
                  
                  {/* The Ad Card */}
                  <div className="w-full max-w-[320px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 transform -rotate-1 group hover:rotate-0 transition-transform duration-700">
                     <div className="p-4 flex items-center gap-3 border-b border-slate-50">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black">
                           {settings.companyLogo}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-slate-900 leading-none">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>
                           <span className="text-[7px] text-slate-400 font-medium">Curated Suggestion</span>
                        </div>
                     </div>
                     <div className="aspect-square bg-slate-50 relative">
                        <img src={currentMedia?.url} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
                           <Sparkles size={14} className="text-primary" />
                        </div>
                     </div>
                     <div className="p-5 text-left">
                        <p className="text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                           <span className="font-bold mr-2">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>
                           {adContent.pitch}
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                           <span className="text-[8px] font-black text-primary uppercase tracking-widest">Shop Collection</span>
                           <ArrowLeft className="rotate-180 text-primary" size={12} />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Share Actions Section */}
               <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
                  <div className="mb-10">
                     <h3 className="text-3xl font-serif text-slate-900 mb-2">Deploy <span className="italic font-light text-primary">Advert</span></h3>
                     <p className="text-slate-500 text-sm font-light">Share this curation instantly. All media and details have been bundled for you.</p>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-10">
                     {socialShares.map((s) => (
                        <a 
                         key={s.name} 
                         href={s.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex flex-col items-center gap-3 group"
                        >
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${s.color} ${s.text} group-hover:scale-110 transition-all duration-300 group-hover:-translate-y-1`}>
                              <s.icon size={24} />
                           </div>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.name}</span>
                        </a>
                     ))}
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2 block">Curation Intelligence</label>
                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                           <div className="p-3 bg-green-500/10 text-green-600 rounded-xl">
                              <ShieldCheck size={20} />
                           </div>
                           <div className="flex-grow">
                              <span className="block text-[10px] font-black uppercase text-slate-900">Asset Pack Ready</span>
                              <p className="text-[9px] text-slate-400 leading-none mt-1 uppercase tracking-widest font-bold">Image + Full Pitch + Deep Link</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <button 
                          onClick={executeNativeShare}
                          disabled={isPreparingBundle}
                          className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary hover:text-slate-900 transition-all shadow-xl flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50"
                        >
                          {isPreparingBundle ? (
                             <RefreshCcw size={18} className="animate-spin" />
                          ) : (
                             <>
                               <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                               Launch Advert to Apps
                             </>
                          )}
                        </button>

                        <button 
                           onClick={handleCopyLink} 
                           className="w-full py-4 bg-white text-slate-500 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] hover:text-slate-900 transition-all flex items-center justify-center gap-3 border border-slate-100"
                        >
                           {copySuccess ? <CheckCircle size={16} className="text-green-500"/> : <Copy size={16}/>}
                           {copySuccess ? 'Copied' : 'Manual Copy Link'}
                        </button>
                     </div>

                     <p className="text-center text-slate-300 text-[8px] font-black uppercase tracking-widest mt-6">
                        Auto-Bundling active • Universal Handshake Protocol
                     </p>
                  </div>
               </div>

            </div>
         </div>
      )}
    </main>
  );
};

export default ProductDetail;