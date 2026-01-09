
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { useSettings } from '../App';

const FounderEdit: React.FC = () => {
  const { products, settings } = useSettings();
  
  // Select the first product as the featured one (or logic to select specific one)
  const featuredProduct = products[0];

  if (!featuredProduct) return null;

  return (
    <section className="py-20 md:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Product Image Side */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-primary/20 transform rotate-3 rounded-[3rem] transition-transform group-hover:rotate-6"></div>
            <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl border border-white/10">
               <img 
                 src={featuredProduct.media?.[0]?.url || 'https://images.unsplash.com/photo-1539109136881-3be06109477e'} 
                 alt={featuredProduct.name}
                 className="w-full h-full object-cover transform transition-transform duration-[1.5s] group-hover:scale-110"
               />
               <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1">Price</span>
                  <span className="text-xl font-serif font-bold">R {featuredProduct.price}</span>
               </div>
            </div>
          </div>

          {/* Story Content Side */}
          <div className="w-full lg:w-1/2 text-left">
             <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-primary"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The Curator's Choice</span>
             </div>
             
             <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
               {featuredProduct.name}
             </h2>

             <div className="relative mb-10 pl-8 border-l-2 border-primary/30">
                <Quote size={32} className="absolute -top-4 -left-10 text-primary opacity-50 fill-current" />
                <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed italic">
                  "I chose this piece because it perfectly embodies the balance of structure and flow. It's not just a garment; it's a statement of quiet confidence that I believe every wardrobe needs."
                </p>
                <div className="mt-6 flex items-center gap-3">
                   {settings.companyLogoUrl ? (
                     <img src={settings.companyLogoUrl} alt="Curator" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                   ) : (
                     <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-slate-900 font-bold">{settings.companyLogo}</div>
                   )}
                   <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white">{settings.aboutFounderName || 'The Curator'}</p>
                      <p className="text-[10px] text-primary">Personal Recommendation</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-6">
                <a 
                  href={featuredProduct.affiliateLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-primary text-slate-900 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3"
                >
                   Acquire Now <ArrowRight size={16} />
                </a>
                <Link 
                  to={`/product/${featuredProduct.id}`}
                  className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                   View Details
                </Link>
             </div>

             <div className="mt-12 flex items-center gap-6 text-slate-500 text-xs font-medium uppercase tracking-widest">
                <div className="flex items-center gap-2">
                   <Star size={14} className="text-primary fill-current" /> Verified Quality
                </div>
                <div className="flex items-center gap-2">
                   <Star size={14} className="text-primary fill-current" /> Authentic
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FounderEdit;
