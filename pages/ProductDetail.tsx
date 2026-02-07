
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
            console.warn("Media bundling failed", e);
          }
        }
        await navigator.share(shareData);
      } catch (err) {
        console.log("Native share failed", err);
      } finally {
        setIsPreparingBundle(false);
      }
    } else {
        handleCopyLink();
        setIsPreparingBundle(false);
        alert("Advert link copied!");
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
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-6 pt-32">
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
    <main className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* PERSISTENT BACK BUTTON - MOVED DOWN & INCREASED Z-INDEX TO CLEAR HEADER */}
      <button 
        onClick={() => navigate('/products')}
        className="fixed top-24 left-6 md:top-32 md:left-12 z-[100] w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-2xl border border-primary/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-2xl group shrink-fit"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden pt-16 md:pt-0">
        
        {/* Left Side: Cinematic Media Gallery with Poster Effect */}
        <div className="w-full lg:w-3/5 h-[70vh] md:h-[80vh] lg:h-full relative overflow-hidden group bg-slate-50/50">
          
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E5C1CD]/10 blur-[120px] rounded-full"></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent)] pointer-events-none"></div>
          </div>

          <div className="relative h-full w-full z-10 flex items-center justify-center p-8 md:p-12 lg:p-24 lg:pt-40 [perspective:1500px]">
            {currentMedia ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center transition-all duration-1000 [transform-style:preserve-3d] [transform:rotateY(-8deg)_rotateX(2deg)] group-hover:[transform:rotateY(-2deg)_rotateX(1deg)]">
                
                {/* Poster Content */}
                <div className="relative shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4),0_18px_36px_-18px_rgba(0,0,0,0.5)] rounded-[0.5rem] overflow-hidden bg-white max-w-full max-h-full">
                    {currentMedia.type.startsWith('video') ? (
                      <video 
                        key={currentMedia.id}
                        src={currentMedia.url} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-auto h-auto max-w-full max-h-[70vh] object-contain transition-all duration-1000"
                      />
                    ) : (
                      <img 
                        key={currentMedia.id}
                        src={currentMedia.url} 
                        alt={product.name} 
                        className="w-auto h-auto max-w-full max-h-[70vh] object-contain transition-all duration-1000"
                      />
                    )}
                </div>

                {/* Wall Contact Shadow */}
                <div className="absolute -bottom-10 w-[90%] h-8 bg-black/20 blur-2xl rounded-[100%] [transform:rotateX(90deg)_translateZ(-20px)] opacity-60"></div>
              </div>
            ) : (
              <div className="text-slate-200"><Package size={80}/></div>
            )}
          </div>

          {media.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-4 md:left-8 flex items-center justify-center z-20">
                <button onClick={prevMedia} className="w-10 h-10 md:w-14 md:h-14 bg-white/60 backdrop-blur-xl border border-primary/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-all shadow-xl">
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 md:right-8 flex items-center justify-center z-20">
                <button onClick={nextMedia} className="w-10 h-10 md:w-14 md:h-14 bg-white/60 backdrop-blur-xl border border-primary/20 rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-all shadow-xl">
                  <ChevronRight size={24} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Information */}
        <div className="w-full lg:w-2/5 lg:h-full lg:overflow-y-auto bg-white p-6 md:p-12 lg:pt-32 border-l border-slate-100 custom-scrollbar shrink-fit">
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
                <button onClick={handleShareTrigger} className="p-3 rounded-full bg-slate-50 hover:bg-primary/20 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                  <Share2 size={20} />
                </button>
              </div>

              <h1 className="font-serif text-slate-900 leading-[0.9] tracking-tighter text-balance" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                {product.name.split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
                <span className="italic font-light text-primary">{product.name.split(' ').slice(-1)}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Acquisition Value</span>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-slate-900">R {(product.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-10 border-t border-slate-50">
               <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href={product.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => logEvent('click', `Product: ${product.name}`)}
                    className="flex-grow py-5 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    <span>{settings.productAcquisitionLabel}</span>
                    <ExternalLink size={16} />
                  </a>
                  <button 
                    onClick={handleShareTrigger}
                    className="h-16 w-full sm:w-20 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-primary/20 transition-all border border-slate-100"
                  >
                    <Share2 size={24} />
                  </button>
               </div>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed font-light italic">"{product.description}"</p>
              {product.features && (
                <div className="grid grid-cols-1 gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                         <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
               <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50"
                  >
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">{settings.productSpecsLabel}</span>
                     <ChevronDown size={18} className={`transition-transform ${openAccordion === 'specs' ? 'rotate-180' : ''}`}/>
                  </button>
                  <div className={`transition-all duration-500 overflow-hidden ${openAccordion === 'specs' ? 'max-h-[500px]' : 'max-h-0'}`}>
                    <div className="px-6 py-5 bg-white grid grid-cols-2 gap-4">
                       {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key}>
                             <span className="block text-[7px] font-black uppercase text-slate-400">{key}</span>
                             <span className="text-xs text-slate-700 font-medium">{value}</span>
                          </div>
                       ))}
                    </div>
                  </div>
               </div>
            )}

            {/* PERSPECTIVES / REVIEWS */}
            <div className="pt-10 border-t border-slate-100 space-y-8 pb-10">
               <h3 className="text-xl font-serif text-slate-900">Appraisals</h3>
               <div className="space-y-8">
                  {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                     <div key={review.id} className="relative pl-12">
                        <div className="absolute left-0 top-0 w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase">
                           {review.userName.charAt(0)}
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{review.userName}</h4>
                        <div className="flex gap-0.5 text-primary mb-2">
                           {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} />)}
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed font-light">{review.comment}</p>
                     </div>
                  )) : (
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center py-10">Awaiting Curation Feedback</p>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* SHARE MODAL - OPTIMIZED FOR "SHRINK TO FIT" */}
      {isShareOpen && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-6 animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl relative shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto shrink-fit">
               
               <button onClick={() => setIsShareOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 z-[210] p-2 bg-slate-900/5 hover:bg-slate-900 hover:text-white rounded-full transition-all">
                 <X size={20} />
               </button>

               {/* Advert Preview */}
               <div className="w-full md:w-1/2 bg-[#FDFCFB] p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-black uppercase text-primary tracking-[0.4em] mb-6 block">Generation Preview</span>
                  
                  {/* The Scalable Ad Card */}
                  <div className="w-full max-w-[280px] bg-white rounded-[1.5rem] shadow-xl overflow-hidden border border-slate-100 shrink-fit">
                     <div className="p-3 flex items-center gap-2 border-b border-slate-50">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[8px] font-black">{settings.companyLogo}</div>
                        <span className="text-[9px] font-bold text-slate-900">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>
                     </div>
                     <div className="aspect-square bg-slate-50">
                        <img src={currentMedia?.url} className="w-full h-full object-cover" alt="Ad Preview" />
                     </div>
                     <div className="p-4 text-left">
                        <p className="text-[9px] text-slate-800 leading-relaxed line-clamp-4">
                           <span className="font-bold mr-1">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>
                           {adContent.pitch}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Actions */}
               <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-left space-y-6">
                  <div>
                     <h3 className="text-2xl font-serif text-slate-900 mb-1">Deploy <span className="italic font-light text-primary">Advert</span></h3>
                     <p className="text-slate-500 text-xs font-light">Asset bundling ready for distribution.</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                     {socialShares.map((s) => (
                        <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                           <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${s.color} ${s.text} transition-transform group-hover:scale-105`}>
                              <s.icon size={18} />
                           </div>
                           <span className="text-[7px] font-black text-slate-400 uppercase">{s.name}</span>
                        </a>
                     ))}
                  </div>

                  <div className="space-y-3">
                     <button 
                        onClick={executeNativeShare}
                        disabled={isPreparingBundle}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {isPreparingBundle ? <RefreshCcw size={14} className="animate-spin" /> : <Rocket size={14} />}
                        Launch Advert
                     </button>
                     <button onClick={handleCopyLink} className="w-full py-3 bg-white text-slate-500 rounded-xl font-black uppercase text-[8px] tracking-widest hover:text-slate-900 transition-all border border-slate-100">
                        {copySuccess ? 'Copied' : 'Copy Pitch Link'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
      <style>{`
        .shrink-fit {
           max-width: 100%;
        }
      `}</style>
    </main>
  );
};

export default ProductDetail;
