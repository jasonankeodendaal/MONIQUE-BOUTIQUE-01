
import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useSettings } from '../App';
import { Subscriber } from '../types';
import { useLocation } from 'react-router-dom';

const NewsletterPopup: React.FC = () => {
  const { settings, updateData } = useSettings();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Don't show popup on admin or auth pages
  const isHiddenPage = location.pathname.startsWith('/admin') || 
                       location.pathname === '/login' || 
                       location.pathname === '/client-login';

  useEffect(() => {
    if (isHiddenPage) {
      setIsVisible(false);
      return;
    }

    const dismissed = sessionStorage.getItem('newsletter_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000); // Show after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [isHiddenPage]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('newsletter_popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    
    try {
      const newSubscriber: Subscriber = {
        id: Date.now().toString(),
        email,
        createdAt: Date.now(),
      };

      await updateData('subscribers', newSubscriber);
      setStatus('success');
      
      // Auto close after success
      setTimeout(() => {
        handleDismiss();
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isVisible || isHiddenPage) return null;

  // Extremely defensive logic for string splitting
  const popupTitle = String(settings?.newsletterPopupTitle || "Exclusive Access");
  const titleWords = popupTitle.split(' ');
  const mainPart = titleWords.length > 2 ? titleWords.slice(0, -2).join(' ') : (titleWords.length > 1 ? titleWords[0] : "");
  const accentPart = titleWords.length > 2 ? titleWords.slice(-2).join(' ') : (titleWords.length > 1 ? titleWords[1] : titleWords[0]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={handleDismiss}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 backdrop-blur-md text-slate-500 hover:text-slate-900 rounded-full transition-colors hover:bg-white/50"
        >
          <X size={20} />
        </button>

        {/* Visual Side */}
        <div className="w-full md:w-1/2 relative bg-slate-900 min-h-[200px] md:min-h-full overflow-hidden group">
           <img 
             src="https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&q=80&w=1000" 
             className="w-full h-full object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-110"
             alt="Fashion Editorial"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
           <div className="absolute bottom-8 left-8 text-white pr-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">{settings?.newsletterPopupBadge || "Member Only"}</p>
              <h3 className="text-3xl font-serif leading-none">
                {mainPart} <br/> 
                <span className="italic text-primary">{accentPart}</span>
              </h3>
           </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
           {status === 'success' ? (
             <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-500/20 animate-in zoom-in">
                   <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mb-2">Welcome Aboard</h3>
                <p className="text-slate-500 text-sm">You have been added to the list.</p>
             </div>
           ) : (
             <>
               <div className="mb-8 text-left">
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">Stay in the Loop</h3>
                 <p className="text-slate-500 font-light leading-relaxed text-sm">
                   {settings?.newsletterPopupSubtitle || "Join the circle for private updates and vetted arrivals."}
                 </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                       type="email" 
                       placeholder="your@email.com"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all text-sm placeholder:text-slate-400"
                     />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-primary hover:text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'submitting' ? <Loader2 size={16} className="animate-spin"/> : <><span>Subscribe</span> <ArrowRight size={16}/></>}
                  </button>
                  <p className="text-[9px] text-center text-slate-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
               </form>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
