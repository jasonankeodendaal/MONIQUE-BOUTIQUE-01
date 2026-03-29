import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../App';
import { Star, Quote, MessageSquarePlus, X, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

const ReviewCarousel: React.FC = () => {
  const { products, siteReviews, updateData, user } = useSettings();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });

  const allReviews = useMemo(() => {
    const reviews: any[] = [];
    
    // Product reviews
    products.forEach(product => {
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach(review => {
          reviews.push({
            ...review,
            type: 'product',
            productName: product.name,
            productId: product.id,
            productImage: product.media?.[0]?.url
          });
        });
      }
    });

    // Site reviews (only approved ones)
    if (siteReviews && siteReviews.length > 0) {
      siteReviews.filter(r => r.status === 'approved').forEach(review => {
        reviews.push({
          ...review,
          type: 'site',
          productName: 'Site Review',
          productId: null,
          productImage: null
        });
      });
    }

    // Sort by date descending
    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  }, [products, siteReviews]);

  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (allReviews.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        let next = Math.floor(Math.random() * allReviews.length);
        while (next === prev && allReviews.length > 1) {
          next = Math.floor(Math.random() * allReviews.length);
        }
        return next;
      });
    }, 7000); // Soft and slow cycle
    
    return () => clearInterval(interval);
  }, [allReviews.length]);

  const currentReview = allReviews[activeIndex];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    const reviewData = {
      id: crypto.randomUUID(),
      userId: user?.id || null,
      userName: newReview.name.trim() || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous Client',
      rating: newReview.rating,
      comment: newReview.comment,
      status: 'pending', // Requires admin approval
      createdAt: Date.now()
    };

    const success = await updateData('site_reviews', reviewData);
    if (success) {
      alert('Thank you for your review! It will be visible once approved by our team.');
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '', name: '' });
    }
  };

  const handleLeaveReviewClick = () => {
    setShowReviewForm(true);
  };

  return (
    <section className="py-20 md:py-32 bg-[#FAF9F6] overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          
          {/* Carousel Column - Now a single flashing review (Moved to Left) */}
          <div className="w-full lg:w-2/3 relative min-h-[400px] flex items-center justify-center order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {currentReview && (
                <motion.div
                  key={currentReview.id}
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-xl"
                >
                  <div className="relative p-10 md:p-16 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-primary/5 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05] text-primary">
                      <Quote size={80} />
                    </div>
                    
                    <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-50 border border-slate-100 shadow-inner flex-shrink-0">
                        {currentReview.productImage ? (
                          <img src={currentReview.productImage} alt={currentReview.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-50">
                            <Star size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-serif text-xl mb-1">{currentReview.userName}</h4>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < currentReview.rating ? "fill-primary text-primary" : "text-slate-200"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-800 text-lg md:text-2xl font-light leading-relaxed mb-12 italic relative z-10 font-serif">
                      "{currentReview.comment}"
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80 mb-1">
                          {currentReview.type === 'product' ? 'Verified Purchase' : 'Community Voice'}
                        </span>
                        <span className="text-xs font-medium text-slate-800 truncate max-w-[200px]">
                          {currentReview.productName}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setActiveIndex(prev => (prev === 0 ? allReviews.length - 1 : prev - 1))}
                          className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-800 hover:text-primary hover:border-primary transition-all"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button 
                          onClick={() => setActiveIndex(prev => (prev === allReviews.length - 1 ? 0 : prev + 1))}
                          className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-800 hover:text-primary hover:border-primary transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {allReviews.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'bg-primary w-4' : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Column (Moved to Right) */}
          <div className="w-full lg:w-1/3 text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-primary/80">Client Experiences</span>
              <div className="h-[1px] w-12 bg-primary/20"></div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tighter leading-tight mb-8">
              Voices of <br/>
              <span className="italic font-light text-primary">Satisfaction</span>
            </h2>
            
            <p className="text-slate-700 font-light leading-relaxed mb-10 text-sm md:text-base">
              Discover what our community has to say about their journey with our curated collections.
            </p>
            
            <button 
              onClick={handleLeaveReviewClick}
              className="group inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900 hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary transition-colors">
                <MessageSquarePlus size={14} />
              </div>
              Leave a Review
            </button>
          </div>
        </div>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full relative shadow-2xl border border-slate-100"
          >
            <button 
              onClick={() => setShowReviewForm(false)}
              className="absolute top-8 right-8 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-2 tracking-tight">Share Your Experience</h3>
              <p className="text-sm text-slate-700 font-light">We value your feedback on our curated selection.</p>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="focus:outline-none p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      size={32} 
                      className={`${star <= newReview.rating ? 'fill-primary text-primary' : 'text-slate-200'} transition-colors`} 
                    />
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder={user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Your Name (Optional)"}
                />
              </div>
              
              <div className="relative">
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary/50 transition-all text-sm resize-none pr-12"
                  placeholder="Share your thoughts..."
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute bottom-4 right-4 text-slate-600 hover:text-primary transition-colors"
                >
                  <Smile size={20} />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
                    <EmojiPicker 
                      onEmojiClick={(emojiData) => {
                        setNewReview(prev => ({...prev, comment: prev.comment + emojiData.emoji}));
                        setShowEmojiPicker(false);
                      }}
                      width={300}
                      height={350}
                      searchDisabled
                      skinTonesDisabled
                    />
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:bg-primary hover:text-slate-900 transition-all shadow-xl hover:shadow-primary/20"
              >
                Submit Review
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ReviewCarousel;
