import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../App';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewCarousel: React.FC = () => {
  const { products } = useSettings();

  const allReviews = useMemo(() => {
    const reviews: any[] = [];
    products.forEach(product => {
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach(review => {
          reviews.push({
            ...review,
            productName: product.name,
            productId: product.id,
            productImage: product.media?.[0]?.url
          });
        });
      }
    });
    // Sort by date descending
    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  }, [products]);

  if (allReviews.length === 0) return null;

  // Duplicate reviews for infinite scroll effect
  const displayReviews = [...allReviews, ...allReviews, ...allReviews];

  return (
    <section className="py-12 md:py-24 bg-copper-wash overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 italic tracking-tighter">
          Client Experiences
        </h2>
        <p className="text-slate-500 text-xs md:text-sm font-light uppercase tracking-[0.3em]">
          Real feedback from our curated collection
        </p>
      </div>

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
          {displayReviews.map((review, idx) => (
            <Link
              key={`${review.id}-${idx}`}
              to={`/product/${review.productId}`}
              className="flex-shrink-0 w-[300px] md:w-[400px] p-6 rounded-3xl backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl hover:bg-white/50 transition-all duration-500 group/card relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                <Quote size={60} />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 border border-white/50 shadow-inner">
                  {review.productImage ? (
                    <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
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
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewCarousel;
