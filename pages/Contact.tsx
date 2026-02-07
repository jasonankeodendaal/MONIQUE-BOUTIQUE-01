
import React, { useState } from 'react';
import { Mail, MessageCircle, Send, ArrowLeft, ArrowRight, Globe, MapPin, Clock, HelpCircle, Plus, Minus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSettings } from '../App';
import { Enquiry } from '../types';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const { settings, updateData } = useSettings();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '', email: '', whatsapp: '', subject: 'Product Curation Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newEnquiry: Enquiry = { id: Math.random().toString(36).substr(2, 9), ...formState, createdAt: Date.now(), status: 'unread' };
    await updateData('enquiries', newEnquiry);
    setIsSubmitting(false); setSubmitted(true);
    setFormState({ name: '', email: '', whatsapp: '', subject: 'Product Curation Inquiry', message: '' });
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <div className="min-h-screen bg-[#FDF5F2] shrink-fit">
      <style>{` .shrink-fit { width: 100%; max-width: 100vw; } `}</style>
      
      {/* PERSISTENT BACK BUTTON - HEADER CLEARANCE */}
      <button 
          onClick={() => navigate('/')}
          className="fixed top-24 left-6 z-[100] w-12 h-12 bg-white/80 backdrop-blur-md border border-primary/10 rounded-full flex items-center justify-center text-slate-900 shadow-lg"
      >
          <ArrowLeft size={20} />
      </button>

      <div className="pt-32 md:pt-48 pb-20 max-w-7xl mx-auto px-6 relative z-10 shrink-fit">
        <div className="mb-16 md:mb-24 text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest mb-6 border border-green-500/20">Concierge Active</span>
          <h1 className="font-serif text-slate-900 leading-[0.9] tracking-tighter mb-6" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>{settings.contactHeroTitle}</h1>
          <p className="text-lg md:text-xl text-slate-500 font-light max-w-xl">{settings.contactHeroSubtitle}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-xl border border-white">
               {submitted ? (
                 <div className="py-20 text-center animate-in zoom-in duration-700">
                    <CheckCircle2 size={64} className="text-primary mx-auto mb-6" />
                    <h2 className="text-2xl font-serif text-slate-900 mb-2">Transmission Received</h2>
                    <p className="text-slate-500 text-sm">We will respond to your inquiry shortly.</p>
                 </div>
               ) : (
                 <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{settings.contactFormNameLabel}</label>
                        <input type="text" required value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:bg-white border-2 border-transparent focus:border-primary/20 transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{settings.contactFormEmailLabel}</label>
                        <input type="email" required value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:bg-white border-2 border-transparent focus:border-primary/20 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{settings.contactFormMessageLabel}</label>
                      <textarea rows={5} required value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:bg-white border-2 border-transparent focus:border-primary/20 transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-primary hover:text-slate-900 transition-all flex items-center justify-center gap-3">
                      {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                      {settings.contactFormButtonText}
                    </button>
                 </form>
               )}
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-8 text-left">
             <div className="bg-slate-900 rounded-[2rem] p-10 text-white">
                <h3 className="text-xl font-serif mb-8 flex items-center gap-3"><Globe size={20} className="text-primary"/> {settings.contactInfoTitle}</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                     <MapPin className="text-slate-500 shrink-0" size={20} />
                     <div><span className="block text-[8px] font-black uppercase text-slate-500 mb-1">{settings.contactAddressLabel}</span><p className="text-base font-medium">{settings.address}</p></div>
                  </div>
                  <div className="flex gap-4">
                     <Clock className="text-slate-500 shrink-0" size={20} />
                     <div><span className="block text-[8px] font-black uppercase text-slate-500 mb-1">{settings.contactHoursLabel}</span><p className="text-xs text-slate-300">{settings.contactHoursWeekdays}</p><p className="text-xs text-slate-300">{settings.contactHoursWeekends}</p></div>
                  </div>
                </div>
             </div>
             
             <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 px-2 flex items-center gap-2"><HelpCircle size={16} className="text-primary"/> FAQs</h4>
                {settings.contactFaqs?.map((faq, i) => (
                  <div key={i} className="bg-white/60 border border-primary/5 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-5 py-4 flex items-center justify-between text-left">
                      <span className="text-xs font-bold text-slate-800">{faq.question}</span>
                      {openFaq === i ? <Minus size={12}/> : <Plus size={12}/>}
                    </button>
                    <div className={`px-5 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-32 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
