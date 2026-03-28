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
    <section className="py-24 bg-slate-900 text-white text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-serif mb-6">Join the <span className="italic font-light text-primary">Inner Circle</span></h2>
        <p className="text-slate-400 mb-10 text-lg">Unlock private sales, early access to new collections, and editorial insights.</p>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-grow px-6 py-4 rounded-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            required
          />
          <button
            type="submit"
            className="px-10 py-4 bg-primary text-slate-900 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
