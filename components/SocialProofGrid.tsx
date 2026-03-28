import React from 'react';

const SocialProofGrid: React.FC = () => {
  const images = [
    'https://picsum.photos/seed/fashion1/600/600',
    'https://picsum.photos/seed/fashion2/600/600',
    'https://picsum.photos/seed/fashion3/600/600',
    'https://picsum.photos/seed/fashion4/600/600',
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900">Shop the <span className="italic font-light text-primary">Look</span></h2>
          <a href="#" className="text-primary font-bold uppercase tracking-widest hover:underline">Follow Us @YourBrand</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={src}
                alt={`Lifestyle ${i + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofGrid;
