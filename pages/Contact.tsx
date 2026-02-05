
import React, { useState } from 'react';
import { Mail, MessageCircle, Send, ArrowLeft, ArrowRight, Globe, MapPin, Clock, HelpCircle, Plus, Minus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSettings } from '../App';
import { Enquiry } from '../types';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const { settings, updateData } = useSettings();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '', email: '', whatsapp: '', subject: 'Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const lastUpdatedDate = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newEnquiry: Enquiry = {
      id: Math.random().toString(36).substr(2, 9),
      ...formState,
      createdAt: Date.now(),
      status: 'unread'
    };

    await updateData('enquiries', newEnquiry);

    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', whatsapp: '', subject: 'Inquiry', message: '' });
    
    setTimeout(() => setSubmitted(false), 8000);
  };

  const faqs = settings.contactFaqs || [];

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-x-hidden">
       {/* Background Elements */}
       <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
       
       {/* Back Button - Scaled down for mobile */}
       <button 
            onClick={() => navigate('/')}
            className="fixed top-4 left-4 md:top-6 md:left-6 z-50 w-8 h-8 md:w-12 md:h-12 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-lg group"
        >
            <ArrowLeft size={16} className="md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

      <div className="pt-36 md:pt-60 pb-12 md:pb-32 max-w-7xl mx-auto px-4 lg:px-12 relative z-10">
        
        {/* Header Section - Side-by-Side on Mobile */}
        <div className="mb-8 md:mb-24">
          <div className="flex flex-row items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-green-500/10 text-green-600 text-[6px] md:text-[9px] font-black uppercase tracking-widest mb-2 md:mb-6 border border-green-500/20 whitespace-nowrap">
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
                </span>
                Concierge Active
              </div>
              <h1 className="font-serif text-slate-900 leading-[0.95] tracking-tighter mb-2 md:mb-6 text-pretty" style={{ fontSize: 'clamp(1.2rem, 8vw, 8rem)' }}>
                {settings.contactHeroTitle}
              </h1>
              <p className="text-[10px] md:text-xl text-slate-500 font-light max-w-xl leading-relaxed text-pretty">
                {settings.contactHeroSubtitle}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 shrink-0">
               <a href={`mailto:${settings.contactEmail}`} className="w-8 h-8 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-300">
                 <Mail size={14} className="md:w-6 md:h-6" />
               </a>
               <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="w-8 h-8 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm hover:bg-[#25D366] hover:text-white transition-all duration-300">
                 <MessageCircle size={14} className="md:w-6 md:h-6" />
               </a>
            </div>
          </div>
        </div>

        {/* Main Side-by-Side Body Section */}
        <div className="flex flex-row items-start gap-3 lg:gap-20">
          
          {/* Form Column - Narrowed for Side-by-Side */}
          <div className="w-[65%] md:w-7/12">
            <div className="bg-white p-4 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden min-h-[350px] md:min-h-[600px] flex flex-col justify-center transition-all">
               
               {submitted ? (
                 <div className="flex flex-col items-center justify-center py-4 text-center animate-in zoom-in duration-700">
                    <div className="relative mb-4 md:mb-10">
                       <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                       <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-primary relative z-10 border border-primary/10 shadow-2xl">
                          <CheckCircle2 size={32} strokeWidth={1} className="md:w-16 md:h-16" />
                       </div>
                    </div>
                    <h2 className="text-lg md:text-4xl font-serif text-slate-900 mb-2 tracking-tight">Sync Complete</h2>
                    <p className="text-[10px] md:text-base text-slate-500 mb-6 md:mb-10 max-w-sm mx-auto leading-relaxed">Secure transmission successful.</p>
                    <button onClick={() => setSubmitted(false)} className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary border-b border-primary/20 pb-0.5">New Message</button>
                 </div>
               ) : (
                 <form className="space-y-3 md:space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                      <div className="space-y-1">
                        <label className="text-[6px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">Name</label>
                        <input 
                          type="text" 
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          className="w-full px-3 py-2 md:px-6 md:py-4 bg-slate-50 border border-transparent focus:border-slate-900 rounded-lg md:rounded-2xl outline-none transition-all text-[10px] md:text-sm font-medium" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[6px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">Email</label>
                        <input 
                          type="email" 
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                          className="w-full px-3 py-2 md:px-6 md:py-4 bg-slate-50 border border-transparent focus:border-slate-900 rounded-lg md:rounded-2xl outline-none transition-all text-[10px] md:text-sm font-medium" 
                          placeholder="email@..." 
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[6px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">Message</label>
                      <textarea 
                        rows={4} 
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                        className="w-full px-3 py-2 md:px-6 md:py-4 bg-slate-50 border border-transparent focus:border-slate-900 rounded-lg md:rounded-2xl outline-none transition-all text-[10px] md:text-sm font-medium resize-none placeholder:text-slate-300" 
                        placeholder="Type here..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 md:py-6 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] rounded-lg md:rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-lg shadow-slate-900/5"
                    >
                      {isSubmitting ? (
                        <span className="w-3 h-3 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span className="truncate">{settings.contactFormButtonText}</span>
                          <Send size={10} className="md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                 </form>
               )}
            </div>
          </div>

          {/* Info Column - Very Compact Side-by-Side */}
          <div className="w-[35%] md:w-5/12 space-y-4 md:space-y-10">
             <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-10 text-white relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-primary/20 rounded-full blur-[30px] md:blur-[50px] -mr-5 -mt-5"></div>
                
                <h3 className="text-[10px] md:text-2xl font-serif mb-4 md:mb-8 flex items-center gap-2">
                  <Globe size={10} className="text-primary md:w-5 md:h-5"/> <span className="truncate">{settings.contactInfoTitle || 'Global HQ'}</span>
                </h3>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex gap-2 md:gap-4 items-start">
                     <MapPin className="text-slate-500 mt-0.5 shrink-0" size={12} />
                     <div className="min-w-0">
                       <span className="block text-[5px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Location</span>
                       <p className="text-[8px] md:text-lg leading-tight font-medium line-clamp-2">{settings.address || 'Global, Digital'}</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-2 md:gap-4 items-start">
                     <Clock className="text-slate-500 mt-0.5 shrink-0" size={12} />
                     <div className="min-w-0">
                       <span className="block text-[5px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Hours</span>
                       <p className="text-[7px] md:text-sm text-slate-300 leading-tight truncate">{settings.contactHoursWeekdays}</p>
                     </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-10 pt-4 md:pt-8 border-t border-slate-800 flex flex-wrap gap-1.5 md:gap-3">
                  {(settings.socialLinks || []).slice(0, 3).map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors shrink-0">
                      {link.iconUrl ? <img src={link.iconUrl} className="w-2.5 h-2.5 md:w-4 md:h-4 object-contain invert" alt={link.name}/> : <ArrowRight size={10} className="-rotate-45" />}
                    </a>
                  ))}
                </div>
             </div>

             {/* FAQ Section - Now visible on all devices with miniature typography for mobile sidebar */}
             <div className="space-y-4 pt-4 border-t border-slate-100 md:border-none">
                <h3 className="text-[10px] md:text-xl font-serif text-slate-900 px-2 md:px-4 flex items-center gap-2">
                  <HelpCircle size={10} className="text-primary md:w-5 md:h-5"/> FAQ
                </h3>
                <div className="space-y-1.5 md:space-y-2">
                   {faqs.slice(0, 3).map((faq, idx) => (
                     <div key={idx} className="bg-white border border-slate-100 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)} 
                          className="w-full px-2 py-2 md:px-4 md:py-3 flex items-center justify-between text-left"
                        >
                          <span className="text-[7px] md:text-[10px] font-bold text-slate-900 pr-2 line-clamp-1">{faq.question}</span>
                          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-slate-50 flex items-center justify-center shrink-0 ${openFaq === idx ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
                             {openFaq === idx ? <Minus size={6} className="md:w-2"/> : <Plus size={6} className="md:w-2"/>}
                          </div>
                        </button>
                        {openFaq === idx && (
                          <div className="px-2 pb-2 md:px-4 md:pb-4 opacity-100 transition-all">
                             <p className="text-[6px] md:text-[9px] text-slate-500 leading-relaxed font-light">{faq.answer}</p>
                          </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 md:mt-24 pt-6 md:pt-12 border-t border-slate-100 flex flex-row justify-between items-center opacity-30">
           <p className="text-[6px] md:text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">SYNC: {lastUpdatedDate}</p>
           <div className="flex items-center gap-2 text-[6px] md:text-[9px] font-bold text-slate-300 uppercase tracking-widest">
              <ShieldCheck size={10} className="text-green-500" />
              Verified Desk
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
