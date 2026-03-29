import React from 'react';
import { Instagram } from 'lucide-react';

const SocialProofGrid: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1550614000-4b95d41582e8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1434389678369-182cb144d6a5?auto=format&fit=crop&q=80&w=800',
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 block mb-4">Social Proof</span>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tight">Shop the <span className="italic font-light text-primary">Look</span></h2>
          </div>
          <a href="#" className="inline-flex items-center gap-3 px-6 py-3 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
            <Instagram size={16} />
            @YourBrand
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-[2.5rem] relative group">
            <img src={images[0]} alt="Lifestyle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
          </div>
          <div className="overflow-hidden rounded-[2rem] relative group">
            <img src={images[1]} alt="Lifestyle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
          </div>
          <div className="overflow-hidden rounded-[2rem] relative group">
            <img src={images[2]} alt="Lifestyle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
          </div>
          <div className="overflow-hidden rounded-[2rem] relative group">
            <img src={images[3]} alt="Lifestyle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
          </div>
          <div className="overflow-hidden rounded-[2rem] relative group">
            <img src={images[4]} alt="Lifestyle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofGrid;
