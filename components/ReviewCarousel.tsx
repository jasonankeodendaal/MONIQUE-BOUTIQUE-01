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
    <section className="py-24 md:py-48 bg-white overflow-hidden relative border-y border-slate-100">
      {/* Decorative Background Element */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-32 text-center relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 block mb-6">Client Experiences</span>
        <h2 className="text-4xl md:text-7xl font-serif text-slate-900 tracking-tighter leading-none mb-12">
          Real feedback from our <span className="italic font-light text-primary">Curated Collection</span>
        </h2>
        
        <button 
          onClick={handleLeaveReviewClick}
          className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-slate-900 transition-all shadow-xl hover:shadow-primary/20"
        >
          <MessageSquarePlus size={16} /> Leave a Review
        </button>
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
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-2 tracking-tight">Share Your Experience</h3>
              <p className="text-sm text-slate-500 font-light">We value your feedback on our curated selection.</p>
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
                  className="absolute bottom-4 right-4 text-slate-400 hover:text-primary transition-colors"
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

      {allReviews.length > 0 && (
        <div className="relative w-full overflow-x-auto pb-12 hide-scrollbar">
          <div className="flex gap-8 px-6 md:px-12 w-max mx-auto">
            {allReviews.map((review, idx) => {
              const CardWrapper = review.type === 'product' ? Link : 'div';
              const wrapperProps = review.type === 'product' ? { to: `/product/${review.productId}` } : {};
              
              return (
                <CardWrapper
                  key={`${review.id}-${idx}`}
                  {...wrapperProps as any}
                  className={`flex-shrink-0 w-[260px] md:w-[300px] p-5 md:p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-500 group/card relative overflow-hidden ${review.type === 'product' ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' : ''}`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover/card:opacity-[0.04] transition-opacity text-slate-900">
                    <Quote size={60} />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-50 border border-slate-100 shadow-sm flex-shrink-0">
                      {review.productImage ? (
                        <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                          <Star size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-medium text-sm line-clamp-1 mb-0.5">{review.userName}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < review.rating ? "fill-primary text-primary" : "text-slate-200"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm font-light leading-relaxed mb-6 line-clamp-4 relative z-10">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate max-w-[60%]">
                      {review.productName}
                    </span>
                    <span className="text-[10px] text-slate-400">
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
