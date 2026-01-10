

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, Package, Share2, Star, MessageCircle, ChevronDown, Minus, Plus, X, Facebook, Twitter, Mail, Copy, CheckCircle, Check, ShoppingBag, Download, Instagram } from 'lucide-react';
import { useSettings } from '../App';
import { Product, ProductStats, Review } from '../types';
import { upsertData, updateProductStats } from '../lib/supabase';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings, products, categories, refreshAllData } = useSettings();
  
  // Find product from global state
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setIsLoaded(true), 100);
    
    // ANALYTICS: Track view on mount
    if (id) {
       updateProductStats(id, 'view');
    }

    return () => clearTimeout(timeout);
  }, [id]);

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
    
    // Live update logic: Append to existing reviews and upsert the entire product record
    const updatedReviews = [review, ...(product.reviews || [])];
    const updatedProduct = { ...product, reviews: updatedReviews };

    try {
      const { error } = await upsertData('products', updatedProduct);
      if (error) {
        alert("Connection interrupted. Please try again.");
      } else {
        await refreshAllData();
        setNewReview({ userName: '', comment: '', rating: 5 });
        setOpenAccordion(null); // Close form
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    setIsShareOpen(true);
  };

  const handleAcquire = () => {
    if (product) {
       updateProductStats(product.id, 'click');
    }
  };

  const socialCaption = useMemo(() => {
    if (!product) return '';
    return `Just discovered this masterpiece: ${product.name} at ${settings.companyName}. \n\n${product.description.substring(0, 100)}...\n\nAvailable here: ${window.location.href}`;
  }, [product, settings]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(socialCaption);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const averageRating = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / product.reviews.length);
  }, [product?.reviews]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-6">
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
      
      {/* --- Breadcrumbs --- */}
      <div className="hidden lg:block absolute top-28 left-10 md:left-20 z-30">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <Link to="/" className="hover:text-primary transition-colors">Home</Link>
           <ChevronRight size={10} />
           <Link to="/products" className="hover:text-primary transition-colors">Collections</Link>
           {category && (
             <>
               <ChevronRight size={10} />
               <Link to={`/products?category=${category.id}`} className="hover:text-primary transition-colors">{category.name}</Link>
             </>
           )}
           <ChevronRight size={10} />
           <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">
        
        {/* Left Side: Cinematic Media Gallery */}
        <div className="w-full lg:w-3/5 h-[45vh] md:h-[55vh] lg:h-full relative bg-slate-100 overflow-hidden group">
          <button 
            onClick={() => navigate('/products')}
            className="absolute top-6 left-6 md:top-10 md:left-10 lg:hidden z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="absolute inset-0 flex items-center justify-center">
            {currentMedia ? (
              currentMedia.type.startsWith('video') ? (
                <video 
                  key={currentMedia.id}
                  src={currentMedia.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                />
              ) : (
                <img 
                  key={currentMedia.id}
                  src={currentMedia.url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                />
              )
            ) : (
              <div className="text-slate-200"><Package size={80} className="md:w-32 md:h-32"/></div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>

          {media.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={nextMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {media.map((_: any, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveMediaIndex(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${i === activeMediaIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Product Information */}
        <div className="w-full lg:w-2/5 lg:h-full lg:overflow-y-auto bg-white p-6 md:p-12 lg:pt-32">
          <div className="max-w-xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 text-primary">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= averageRating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">({product.reviews?.length || 0} Verified Reviews)</span>
                </div>
                <button onClick={handleShare} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-black text-slate-900">R {product.price.toLocaleString()}</span>
                {product.discountRules && product.discountRules.length > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
                  </span>
                )}
              </div>
            </div>

            {/* HIGH CONVERSION ACTION BUTTON */}
            <div className="flex flex-col gap-4 py-8 border-y border-slate-100">
               <a 
                 href={product.affiliateLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 onClick={handleAcquire}
                 className="w-full py-6 bg-primary text-slate-900 font-black uppercase tracking-[0.2em] text-sm rounded-full hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group animate-pulse hover:animate-none cursor-pointer"
               >
                 <span>Secure Acquisition</span>
                 <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
               </a>
               <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                 <ShoppingBag size={10} /> Transactions processed securely by retail partner
               </p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed font-light">{product.description}</p>
              {product.features && (
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Specifications Accordion */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
               <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                     <span className="text-xs font-black uppercase tracking-widest text-slate-900">Technical Specifications</span>
                     {openAccordion === 'specs' ? <Minus size={14}/> : <Plus size={14}/>}
                  </button>
                  {openAccordion === 'specs' && (
                    <div className="px-6 py-4 bg-white grid grid-cols-2 gap-4">
                       {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key}>
                             <span className="block text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{key}</span>
                             <span className="text-sm text-slate-700">{value}</span>
                          </div>
                       ))}
                    </div>
                  )}
               </div>
            )}

            {/* Reviews Section */}
            <div className="pt-8 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif text-slate-900">Client Perspectives</h3>
                  <button onClick={() => setOpenAccordion(openAccordion === 'review' ? null : 'review')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-slate-900 transition-colors">Write Review</button>
               </div>

               {/* Review Form */}
               {openAccordion === 'review' && (
                 <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 animate-in slide-in-from-top-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rating</label>
                       <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                             <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})} className="focus:outline-none">
                                <Star size={20} fill={star <= newReview.rating ? "#D4AF37" : "none"} className={star <= newReview.rating ? "text-primary" : "text-slate-300"} />
                             </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
                       <input 
                        type="text" 
                        required
                        value={newReview.userName}
                        onChange={e => setNewReview({...newReview, userName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none text-sm bg-white"
                        placeholder="Your Name"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Experience</label>
                       <textarea 
                        rows={3}
                        required
                        value={newReview.comment}
                        onChange={e => setNewReview({...newReview, comment: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none text-sm bg-white resize-none"
                        placeholder="Share your thoughts..."
                       />
                    </div>
                    <button disabled={isSubmittingReview} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-colors disabled:opacity-50">
                       {isSubmittingReview ? 'Publishing Live...' : 'Post Review'}
                    </button>
                 </form>
               )}

               <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                     <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-slate-900 text-sm">{review.userName}</span>
                           <span className="text-[10px] text-slate-400 uppercase font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-0.5 text-primary mb-2">
                           {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} />)}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                     </div>
                  )) : (
                     <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-xs">No reviews yet. Be the first to share your experience.</p>
                     </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Full Page Social Builder Overlay */}
      {isShareOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
            <button 
                onClick={() => setIsShareOpen(false)} 
                className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white hover:text-slate-900 transition-colors z-50"
            >
                <X size={24} />
            </button>
            
            <div className="w-full max-w-6xl h-full md:h-[80vh] flex flex-col md:flex-row rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-white/10 m-4 md:m-0">
                {/* Visual Side */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-slate-900">
                    <img 
                        src={currentMedia?.url} 
                        className="w-full h-full object-cover opacity-80" 
                        alt="Share Preview"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="inline-block px-3 py-1 bg-primary text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            Kasi Couture Selection
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-2 leading-tight">{product.name}</h2>
                        <p className="text-white/60 text-lg font-light">R {product.price.toLocaleString()}</p>
                    </div>
                </div>

                {/* Composer Side */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-slate-900 p-8 md:p-12 flex flex-col">
                    <h3 className="text-white font-bold text-xl md:text-2xl mb-2 flex items-center gap-3">
                        <Share2 size={24} className="text-primary"/> Social Builder
                    </h3>
                    <p className="text-slate-400 text-sm mb-8">Customize and broadcast this piece to your network.</p>

                    <div className="flex-grow space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Auto-Generated Caption</label>
                            <div className="relative group">
                                <textarea 
                                    readOnly 
                                    value={socialCaption}
                                    className="w-full h-40 bg-slate-800 border border-slate-700 rounded-2xl p-5 text-slate-300 text-sm leading-relaxed resize-none focus:outline-none focus:border-primary transition-colors"
                                />
                                <button 
                                    onClick={handleCopyCaption}
                                    className="absolute bottom-4 right-4 p-2 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg"
                                >
                                    {copySuccess ? <Check size={14}/> : <Copy size={14}/>} {copySuccess ? 'Copied' : 'Copy Text'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <a href={`https://wa.me/?text=${encodeURIComponent(socialCaption)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 p-4 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-xl hover:bg-[#25D366] hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                                <MessageCircle size={18} /> WhatsApp
                             </a>
                             <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(socialCaption)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 p-4 bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/30 rounded-xl hover:bg-[#1DA1F2] hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                                <Twitter size={18} /> X / Twitter
                             </a>
                             <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 p-4 bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 rounded-xl hover:bg-[#1877F2] hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                                <Facebook size={18} /> Facebook
                             </a>
                             <button className="flex items-center justify-center gap-3 p-4 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest cursor-not-allowed opacity-50" disabled>
                                <Instagram size={18} /> Story (Mobile)
                             </button>
                        </div>
                        
                        <a href={currentMedia?.url} download className="w-full flex items-center justify-center gap-3 p-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl hover:text-white hover:border-slate-500 transition-all font-bold text-xs uppercase tracking-widest mt-4">
                            <Download size={18} /> Download High-Res Asset
                        </a>
                    </div>
                </div>
            </div>
         </div>
      )}
    </main>
  );
};

export default ProductDetail;
