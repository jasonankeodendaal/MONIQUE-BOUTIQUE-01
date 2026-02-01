
import React from 'react';
import { useSettings } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const { articles } = useSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
           <div className="space-y-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-4"
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
              <h1 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tight">The Journal</h1>
              <p className="text-slate-500 max-w-md font-light leading-relaxed">
                Insights, trends, and stories from the world of curated luxury.
              </p>
           </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {articles.map((article) => (
             <article key={article.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                <div className="aspect-[4/3] overflow-hidden relative">
                   <img 
                     src={article.image} 
                     alt={article.title} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                   <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(article.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><User size={12}/> {article.author}</span>
                   </div>
                   <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                     {article.title}
                   </h3>
                   <p className="text-slate-500 text-sm leading-relaxed font-light mb-6 line-clamp-3 flex-grow">
                     {article.excerpt}
                   </p>
                   <Link to={`/blog/${article.id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-primary transition-colors mt-auto">
                      Read Article <ArrowRight size={14} />
                   </Link>
                </div>
             </article>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;