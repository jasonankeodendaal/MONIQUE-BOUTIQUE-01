import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, Package, Share2, Star, MessageCircle, ChevronDown, Minus, Plus, X, Facebook, Twitter, Mail, Copy, CheckCircle, Check, Send, RefreshCcw, Sparkles, Instagram, Linkedin, Rocket, ShieldCheck, Tag, Maximize2 } from 'lucide-react';
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
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

  // Handle Esc key to close modal & Toggle body class for header hiding
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
        setIsShareOpen(false);
      }
    };

    if (isImageModalOpen || isShareOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('modal-open');
    };
  }, [isImageModalOpen, isShareOpen]);

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
    <main className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 pt-20 md:pt-28 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Strategic Spacing Styles */}
      <style>{`
        .poster-lean {
          transform: perspective(2000px) rotateY(-8deg) rotateX(5deg);
          box-shadow: 
            30px 40px 60px -20px rgba(0, 0, 0, 0.4),
            5px 5px 15px rgba(0, 0, 0, 0.1);
          transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .poster-lean:hover {
          transform: perspective(2000px) rotateY(-4deg) rotateX(2deg) scale(1.02);
        }
        .modal-container {
          max-height: 85vh;
          overflow-y: auto;
        }
        @media (max-width: 1024px) {
          .poster-lean {
            transform: perspective(1000px) rotateX(3deg);
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>

      {/* Persistent Fixed Back Button - Lowered to clear header */}
      <button 
        onClick={() => navigate('/products')}
        className="fixed top-24 left-6 md:top-32 md:left-12 z-[60] w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-2xl border border-primary/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-2xl group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-112px)] lg:h-[calc(100vh-112px)] lg:overflow-hidden">
        
        {/* Left Side: Poster Style Media Gallery */}
        <div className="w-full lg:w-3/5 h-[65vh] md:h-[75vh] lg:h-full relative overflow-hidden group bg-slate-50/50">
          
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#E5C1CD]/10 blur-[150px] rounded-full"></div>
             {/* Realistic wall texture suggestion */}
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
          </div>

          <div className="relative h-full w-full z-10 flex items-center justify-center p-8 md:p-16 lg:p-24">
            {currentMedia ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div 
                  onClick={() => setIsImageModalOpen(true)}
                  className="poster-lean relative bg-white rounded-lg p-2 md:p-4 overflow-hidden cursor-zoom-in group/poster"
                >
                   {currentMedia.type.startsWith('video') ? (
                    <video 
                      key={currentMedia.id}
                      src={currentMedia.url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded shadow-inner"
                    />
                  ) : (
                    <img 
                      key={currentMedia.id}
                      src={currentMedia.url} 
                      alt={product.name} 
                      className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded shadow-inner"
                    />
                  )}
                  {/* Subtle paper reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/5 pointer-events-none"></div>
                  
                  {/* Maximize Icon Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-xl transform scale-75 group-hover/poster:scale-100 transition-transform duration-500">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-200"><Package size={80} className="md:w-32 md:h-32"/></div>
            )}
          </div>

          {media.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevMedia} className="w-10 h-10 bg-white/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-all">
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={nextMedia} className="w-10 h-10 bg-white/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Product Information */}
        <div className="w-full lg:w-2/5 lg:h-full lg:overflow-y-auto bg-white p-6 md:p-12 border-l border-slate-100 custom-scrollbar">
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
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Acquisition Value</span>
                  <div className="flex items-end gap-4 flex-wrap">
                    <span className="text-3xl md:text-4xl font-black text-slate-900">R {(product.price || 0).toLocaleString()}</span>
                    {product.wasPrice && product.wasPrice > 0 && (
                      <span className="text-lg md:text-xl font-bold text-slate-300 line-through decoration-primary/40 mb-1.5">
                        R {product.wasPrice.toLocaleString()}
                      </span>
                    )}
                    {product.discountRules && product.discountRules.length > 0 && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 mb-1.5">
                        {product.discountRules[0].type === 'percentage' ? `${product.discountRules[0].value}% OFF` : `R${product.discountRules[0].value} OFF`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tiny Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-10 border-t border-slate-50">
               <div className="flex gap-4">
                  <a 
                    href={product.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => logEvent('click', `Product: ${product.name}`)}
                    className="flex-grow py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    <span>{settings.productAcquisitionLabel || 'Secure Acquisition'}</span>
                    <ExternalLink size={16} />
                  </a>
               </div>
               <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-green-500" />
                  Direct Merchant Link Verified
               </div>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed font-light italic">
                "{product.description}"
              </p>
              
              {product.features && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
               <div className="border border-slate-100 rounded-3xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                    className="w-full px-8 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{settings.productSpecsLabel || 'Specifications'}</span>
                     <ChevronDown size={16} className={`transition-transform duration-500 ${openAccordion === 'specs' ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-700 overflow-hidden ${openAccordion === 'specs' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 py-6 bg-white grid grid-cols-2 gap-x-12 gap-y-4">
                       {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                             <span className="block text-[8px] font-black uppercase text-slate-400">{key}</span>
                             <span className="text-xs text-slate-700 font-medium">{value}</span>
                          </div>
                       ))}
                    </div>
                  </div>
               </div>
            )}

            {/* PERSPECTIVES SECTION */}
            <div className="pt-10 border-t border-slate-100">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-serif text-slate-900">Appraisals</h3>
                  <button onClick={() => setOpenAccordion(openAccordion === 'review' ? null : 'review')} className="px-4 py-1.5 rounded-full border border-slate-200 text-[8px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all">Write Perspective</button>
               </div>

               <div className={`transition-all duration-700 overflow-hidden ${openAccordion === 'review' ? 'max-h-[600px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
                 <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-400 ml-2">Rating</label>
                          <div className="flex gap-1 p-2 bg-white rounded-xl border border-slate-100 w-fit">
                             {[1,2,3,4,5].map(star => (
                                <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})}>
                                   <Star size={18} fill={star <= newReview.rating ? "#B76E79" : "none"} className={star <= newReview.rating ? "text-primary" : "text-slate-200"} />
                                </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-400 ml-2">Identity</label>
                          <input 
                           type="text" 
                           required
                           value={newReview.userName}
                           onChange={e => setNewReview({...newReview, userName: e.target.value})}
                           className="w-full px-4 py-2.5 rounded-xl border border-slate-100 text-xs bg-white outline-none"
                           placeholder="Guest"
                          />
                       </div>
                    </div>
                    <textarea 
                      rows={3}
                      required
                      value={newReview.comment}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-100 text-xs bg-white outline-none resize-none"
                      placeholder="Share your thoughts..."
                    />
                    <button disabled={isSubmittingReview} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-primary transition-all">
                       {isSubmittingReview ? 'Processing...' : 'Submit Appraisal'}
                    </button>
                 </form>
               </div>

               <div className="space-y-10">
                  {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                     <div key={review.id} className="text-left border-b border-slate-50 pb-8 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-slate-900 text-sm">{review.userName}</span>
                           <span className="text-[8px] text-slate-400 uppercase font-black">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-0.5 text-primary mb-3">
                           {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} />)}
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed font-light">{review.comment}</p>
                     </div>
                  )) : (
                     <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] py-10">No appraisals yet.</p>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Product Image Fullscreen Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
           
           {/* High-Contrast Back Arrow for the Modal (Top Left) */}
           <button 
             onClick={() => setIsImageModalOpen(false)}
             className="absolute top-8 left-8 z-[310] w-14 h-14 bg-white hover:bg-primary text-slate-900 hover:text-white rounded-full transition-all border border-white/10 flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.5)] group/return"
             title="Return to Product Details"
           >
             <ArrowLeft size={28} className="group-hover/return:-translate-x-1 transition-transform" />
           </button>

           {/* High-Contrast Close Button for the Modal (Top Right) */}
           <button 
             onClick={() => setIsImageModalOpen(false)}
             className="absolute top-8 right-8 z-[310] w-14 h-14 bg-white hover:bg-red-500 text-slate-900 hover:text-white rounded-full transition-all border border-white/10 flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
             title="Close Modal"
           >
             <X size={28} />
           </button>
           
           <div className="relative w-full h-full flex items-center justify-center">
             {media.length > 1 && (
               <>
                 <button 
                   onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                   className="absolute left-4 md:left-12 z-[310] w-14 h-14 bg-white/80 backdrop-blur-md hover:bg-white text-slate-900 rounded-full flex items-center justify-center transition-all border border-white/30 shadow-2xl"
                 >
                   <ChevronLeft size={32} />
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                   className="absolute right-4 md:right-12 z-[310] w-14 h-14 bg-white/80 backdrop-blur-md hover:bg-white text-slate-900 rounded-full flex items-center justify-center transition-all border border-white/30 shadow-2xl"
                 >
                   <ChevronRight size={32} />
                 </button>
               </>
             )}

             <div className="max-w-7xl max-h-full flex items-center justify-center animate-in zoom-in duration-500">
               {currentMedia.type.startsWith('video') ? (
                 <video 
                   src={currentMedia.url} 
                   autoPlay 
                   loop 
                   controls 
                   className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
                 />
               ) : (
                 <img 
                   src={currentMedia.url} 
                   alt={product.name} 
                   className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
                 />
               )}
             </div>

             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-center">
                <h3 className="text-white font-serif text-2xl md:text-3xl tracking-tight">{product.name}</h3>
                <span className="px-4 py-1 rounded-full bg-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  Slide {activeMediaIndex + 1} of {media.length}
                </span>
             </div>
           </div>
        </div>
      )}

      {/* Deploy Advert Modal - Optimized for perfect fit and scrolling */}
      {isShareOpen && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl relative shadow-2xl overflow-hidden flex flex-col md:flex-row modal-container custom-scrollbar">
               
               <button onClick={() => setIsShareOpen(false)} className="absolute top-4 right-4 z-[110] p-2 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-full transition-all">
                 <X size={18} />
               </button>

               {/* Preview Panel - Condensed */}
               <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                  <span className="text-[8px] font-black uppercase text-primary tracking-[0.5em] mb-4 md:mb-6">Deploy Preview</span>
                  
                  <div className="w-full max-w-[200px] md:max-w-[240px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 scale-95 md:scale-100">
                     <div className="p-2 flex items-center gap-2 border-b border-slate-50">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[7px] font-black">
                           {settings.companyLogo}
                        </div>
                        <span className="text-[8px] font-bold text-slate-900">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>
                     </div>
                     <div className="aspect-square bg-slate-100 overflow-hidden">
                        <img src={currentMedia?.url} className="w-full h-full object-cover" alt="Preview" />
                     </div>
                     <div className="p-3 text-left">
                        <p className="text-[9px] text-slate-600 line-clamp-3 leading-tight">
                           <span className="font-bold mr-1">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>
                           {adContent.pitch}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Actions Panel - Tighter Spacing */}
               <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-center text-left space-y-6">
                  <div>
                     <h3 className="text-xl md:text-3xl font-serif text-slate-900 mb-1">Deploy <span className="italic font-light text-primary">Advert</span></h3>
                     <p className="text-slate-500 text-[11px] font-light">Asset bundling is complete. Select a channel for deployment.</p>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                     {socialShares.map((s) => (
                        <a 
                         key={s.name} 
                         href={s.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex flex-col items-center gap-1.5 group"
                        >
                           <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm ${s.color} ${s.text} group-hover:scale-110 transition-all`}>
                              <s.icon size={18} />
                           </div>
                           <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{s.name}</span>
                        </a>
                     ))}
                  </div>

                  <div className="space-y-3">
                     <button 
                        onClick={executeNativeShare}
                        disabled={isPreparingBundle}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {isPreparingBundle ? <RefreshCcw size={16} className="animate-spin" /> : <Rocket size={16} />}
                        Launch Advert Bundle
                     </button>

                     <button 
                        onClick={handleCopyLink} 
                        className="w-full py-2.5 bg-white text-slate-400 rounded-lg font-black uppercase text-[7px] tracking-widest hover:text-slate-900 transition-all border border-slate-100 flex items-center justify-center gap-2"
                     >
                        {copySuccess ? <CheckCircle size={12} className="text-green-500"/> : <Copy size={12}/>}
                        {copySuccess ? 'Copied' : 'Manual Link Copy'}
                     </button>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-50 flex items-center gap-3">
                     <ShieldCheck size={14} className="text-green-500" />
                     <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest">Universal Handshake protocol active</span>
                  </div>
               </div>

            </div>
         </div>
      )}
    </main>
  );
};

export default ProductDetail;