import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../App';
import { Star, Quote, MessageSquarePlus, X, Smile } from 'lucide-react';
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
    <section className="py-12 md:py-24 bg-copper-wash overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 italic tracking-tighter">
          Client Experiences
        </h2>
        <p className="text-slate-500 text-xs md:text-sm font-light uppercase tracking-[0.3em] mb-8">
          Real feedback from our curated collection
        </p>
        
        <button 
          onClick={handleLeaveReviewClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-full text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <MessageSquarePlus size={14} /> Leave a Review
        </button>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full relative shadow-2xl border border-slate-100"
          >
            <button 
              onClick={() => setShowReviewForm(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">Leave a Review</h3>
              <p className="text-xs text-slate-500">We'd love to hear your thoughts.</p>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="focus:outline-none p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      size={24} 
                      className={`${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} transition-colors`} 
                    />
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                  placeholder={user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Your Name (Optional)"}
                />
              </div>
              
              <div className="relative">
                <textarea
                  required
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all resize-none pr-10"
                  placeholder="Share your experience..."
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute bottom-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Smile size={18} />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-50 shadow-xl rounded-xl overflow-hidden border border-slate-100">
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
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {allReviews.length > 0 && (
        <div className="relative w-full overflow-x-auto pb-8 hide-scrollbar">
          <div className="flex gap-6 px-4 md:px-6 w-max mx-auto">
            {allReviews.map((review, idx) => {
              const CardWrapper = review.type === 'product' ? Link : 'div';
              const wrapperProps = review.type === 'product' ? { to: `/product/${review.productId}` } : {};
              
              return (
                <CardWrapper
                  key={`${review.id}-${idx}`}
                  {...wrapperProps as any}
                  className={`flex-shrink-0 w-[300px] md:w-[400px] p-6 rounded-3xl backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl transition-all duration-500 group/card relative overflow-hidden ${review.type === 'product' ? 'hover:bg-white/50 cursor-pointer' : ''}`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                    <Quote size={60} />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 border border-white/50 shadow-inner flex-shrink-0">
                      {review.productImage ? (
                        <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                          <Star size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-sm line-clamp-1">{review.userName}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < review.rating ? "fill-primary text-primary" : "text-slate-300"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm md:text-base font-light leading-relaxed mb-6 italic line-clamp-3">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-900/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {review.productName}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewCarousel;
