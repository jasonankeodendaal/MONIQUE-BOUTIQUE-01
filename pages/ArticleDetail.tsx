
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../App';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles } = useSettings();

  const article = articles.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-slate-900 mb-4">Article Not Found</h2>
          <Link to="/blog" className="text-primary font-bold uppercase tracking-widest text-xs border-b border-primary pb-0.5">Return to Journal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20">
      <article className="max-w-4xl mx-auto px-6">
        {/* Back Nav */}
        <button 
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-8"
        >
            <ArrowLeft size={14} /> Back to Journal
        </button>

        {/* Header */}
        <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <span className="flex items-center gap-2"><Calendar size={12}/> {new Date(article.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><User size={12}/> {article.author}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-8 text-balance">
                {article.title}
            </h1>
        </header>

        {/* Hero Image */}
        <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl mb-16 aspect-video relative group">
            <div className="absolute inset-0 bg-slate-200 animate-pulse -z-10"></div>
            <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-slate-900 font-serif italic mb-10 leading-relaxed text-center border-b border-slate-100 pb-10">
                {article.excerpt}
            </p>
            <div className="prose prose-slate prose-lg font-light text-slate-600 leading-loose whitespace-pre-wrap">
                {article.content}
            </div>
        </div>

        {/* Footer / Share */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-center">
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 rounded-full hover:bg-slate-100 transition-colors text-xs font-bold uppercase tracking-widest group">
                <Share2 size={16} className="group-hover:text-primary transition-colors"/> Share Story
            </button>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
