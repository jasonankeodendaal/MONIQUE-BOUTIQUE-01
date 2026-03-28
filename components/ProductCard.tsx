import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, VideoIcon, FileText, Check } from 'lucide-react';
import { Product, Category, WishlistItem, SiteSettings } from '../types';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  settings: SiteSettings;
  user: any;
  wishlist: WishlistItem[];
  toggleWishlist: (e: React.MouseEvent, productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categories,
  settings,
  user,
  wishlist,
  toggleWishlist
}) => {
  const navigate = useNavigate();

  const renderProductMedia = (product: Product) => {
    const media = product.media || [];
    const primary = media[0];
    
    if (!primary) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><ShoppingBag size={32} /></div>;

    if (primary.type?.startsWith('image/')) {
      return <img src={primary.url} alt={primary.altText || product.name} loading={settings.seoEnableLazyLoading !== false ? "lazy" : undefined} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
    }
    
    if (primary.type?.startsWith('video/')) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
          <VideoIcon size={32} className="mb-2 opacity-30" />
          <span className="text-[8px] uppercase font-black tracking-widest text-white/50">Cinematic Preview</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
        <FileText size={32} />
        <span className="text-[8px] uppercase font-black tracking-widest mt-2">{primary.type.split('/')[1]}</span>
      </div>
    );
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-[#B76E79]/10 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(183,110,121,0.15)] transition-all duration-700 group hover:-translate-y-3 flex flex-col relative cursor-pointer h-full"
    >
      {product.discountRules && product.discountRules.length > 0 && (
        <div className="absolute top-3 right-3 md:top-5 md:right-5 bg-red-600 text-white px-3 py-1 rounded-full font-black text-[7px] md:text-[9px] uppercase tracking-widest shadow-lg z-20">
          {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
        </div>
      )}

      {/* Stock Status */}
      <div className="absolute top-3 left-3 md:top-5 md:left-5 z-20 flex flex-col gap-1">
        {product.stock === 0 ? (
          <div className="bg-red-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full font-black text-[6px] md:text-[8px] uppercase tracking-widest shadow-lg backdrop-blur-md">
            Out of Stock
          </div>
        ) : product.stock && product.stock <= 5 ? (
          <div className="bg-amber-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full font-black text-[6px] md:text-[8px] uppercase tracking-widest shadow-lg backdrop-blur-md">
            Limited: {product.stock} Left
          </div>
        ) : null}
      </div>
      
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {renderProductMedia(product)}
        <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 z-10 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl text-[10px] md:text-sm font-black text-slate-900 shadow-xl border border-white/50">
              R {(product.price || 0).toLocaleString()}
            </div>
            {product.wasPrice && product.wasPrice > 0 && (
              <div className="bg-slate-900/40 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[8px] md:text-[10px] font-bold text-slate-100 line-through decoration-primary decoration-1 shadow-lg border border-white/10">
                R {product.wasPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center z-10 gap-4">
           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 delay-75">
              <ShoppingBag size={20} />
           </div>
           <button 
             onClick={(e) => toggleWishlist(e, product.id)}
             className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 hover:bg-red-50"
           >
              <Heart 
                size={20} 
                className={user && wishlist.some(w => w.productId === product.id && w.userId === user.id) ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-500 transition-colors"} 
              />
           </button>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex-grow flex flex-col text-left">
        <span className="text-[7px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">
           {categories.find(c => c.id === product.categoryId)?.name}
        </span>
        <h3 className="text-[12px] md:text-base font-serif text-slate-900 mb-3 group-hover:text-primary transition-colors duration-500 leading-snug line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[7px] md:text-[8px] font-bold text-slate-300 font-mono tracking-tighter truncate max-w-[80px] uppercase">{settings.productRefLabel || 'Ref:'} {product.sku}</span>
          <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
             <Check size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};
