import React, { useState } from 'react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Thank you for joining our inner circle.');
  };

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 block mb-6">VIP Access</span>
        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 tracking-tight">Join the <span className="italic font-light text-primary">Inner Circle</span></h2>
        <p className="text-slate-700 mb-12 text-lg md:text-xl font-light max-w-xl mx-auto">Unlock private sales, early access to new collections, and exclusive editorial insights.</p>
        <form onSubmit={handleSubmit} className="flex flex-row gap-2 max-w-xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-grow px-4 md:px-8 py-3 md:py-5 rounded-full bg-white border border-slate-200 text-xs md:text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            required
          />
          <button
            type="submit"
            className="px-6 md:px-10 py-3 md:py-5 bg-slate-900 text-white rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-xl hover:shadow-primary/20 whitespace-nowrap"
          >
            Join
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
