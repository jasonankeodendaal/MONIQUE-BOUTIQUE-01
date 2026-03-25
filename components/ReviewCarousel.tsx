import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../App';
import { Star, Quote, MessageSquarePlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewCarousel: React.FC = () => {
  const { products, siteReviews, updateData, user } = useSettings();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    const reviewData = {
      id: crypto.randomUUID(),
      userId: user?.id,
      userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous Client',
      rating: newReview.rating,
      comment: newReview.comment,
      status: 'pending', // Requires admin approval
      createdAt: Date.now()
    };

    const success = await updateData('site_reviews', reviewData);
    if (success) {
      alert('Thank you for your review! It will be visible once approved by our team.');
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
    }
  };

  if (allReviews.length === 0 && !user) return null;

  // Duplicate reviews for infinite scroll effect
  const displayReviews = allReviews.length > 0 ? [...allReviews, ...allReviews, ...allReviews] : [];

  return (
    <section className="py-12 md:py-24 bg-copper-wash overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 italic tracking-tighter">
          Client Experiences
        </h2>
        <p className="text-slate-500 text-xs md:text-sm font-light uppercase tracking-[0.3em] mb-8">
          Real feedback from our curated collection
        </p>
        
        {user && (
          <button 
            onClick={() => setShowReviewForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-colors"
          >
            <MessageSquarePlus size={16} /> Leave a Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setShowReviewForm(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Share Your Experience</h3>
            <p className="text-sm text-slate-500 mb-6">Your feedback helps us maintain our elite standards.</p>
            
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={`${star <= newReview.rating ? 'fill-primary text-primary' : 'text-slate-200 hover:text-primary/50'} transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Tell us about your experience..."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-slate-900 transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {allReviews.length > 0 && (
        <div className="relative flex overflow-hidden group">
          <motion.div
            className="flex gap-6 py-4"
            animate={{
              x: [0, -100 * allReviews.length + "%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: Math.max(20, allReviews.length * 8), // Slow auto carousel
                ease: "linear",
              },
            }}
            style={{ width: "fit-content" }}
          >
            {displayReviews.map((review, idx) => {
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
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ReviewCarousel;
