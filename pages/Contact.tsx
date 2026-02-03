import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Sparkles, MapPin, ArrowRight, CheckCircle2, ArrowLeft, Clock, HelpCircle, Plus, Minus, Globe, Quote, PenTool, ChevronDown } from 'lucide-react';
import { useSettings } from '../App';
import { Enquiry } from '../types';
import { useNavigate } from 'react-router-dom';
import Signature from '../components/Signature';

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
    
    const newEnquiry: Enquiry = {
      id: Math.random().toString(36).substr(2, 9),
      ...formState,
      createdAt: Date.now(),
      status: 'unread'
    };

    // Save to database
    await updateData('enquiries', newEnquiry);

    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', whatsapp: '', subject: 'Product Curation Inquiry', message: '' });
    
    // Smooth scroll to top of card on success
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      q: "Do you ship products directly?",
      a: "As a curation bridge page, I direct you to verified third-party luxury retailers. Shipping and returns are handled directly by the brand you purchase from, ensuring you get the authentic experience."
    },
    {
      q: "How do I book a styling consultation?",
      a: "Please select 'Styling Consultation' in the inquiry form. I personally review these requests to coordinate a virtual or in-person session tailored to your aesthetic needs."
    },
    {
      q: "Are the items truly vetted?",
      a: "Yes. Every piece on this platform is a result of my personal research and industry experience. I only link to products that meet my strict standards for material integrity and design."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative selection:bg-primary/30">
       {/* Ambient Background Decoration */}
       <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
       <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
       
       {/* Navigation / Back Button */}
       <button 
            onClick={() => navigate('/')}
            aria-label="Back to Home"
            className="fixed top-6 left-6 z-50 w-12 h-12 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-lg group active:scale-95"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

      <div className="pt-32 md:pt-48 pb-20 md:pb-32 max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Editorial Header */}
        <div className="mb-16 md:mb-24 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-primary/20 backdrop-blur-sm">
                <Sparkles size={12} className="animate-pulse" /> Direct Connection
              </div>
              <h1 className="font-serif text-slate-900 leading-[0.85] tracking-tighter mb-8 text-balance" style={{ fontSize: 'clamp(3.5rem, 10vw, 8.5rem)' }}>
                {settings.contactHeroTitle.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-primary">{settings.contactHeroTitle.split(' ').slice(-1)}</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-light max-w-xl leading-relaxed text-pretty border-l-2 border-primary/20 pl-8">
                {settings.contactHeroSubtitle}
              </p>
            </div>
            
            {/* Rapid Contact Shortcuts */}
            <div className="flex gap-4">
               <a href={`mailto:${settings.contactEmail}`} className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[2rem] flex flex-col items-center justify-center text-slate-900 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                 <Mail size={24} className="group-hover:scale-110 group-hover:text-primary transition-all" />
                 <span className="text-[8px] font-black uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Email</span>
               </a>
               <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[2rem] flex flex-col items-center justify-center text-slate-900 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-[#25D366]/30 transition-all duration-500 group">
                 <MessageCircle size={24} className="group-hover:scale-110 text-[#25D366] transition-all" />
                 <span className="text-[8px] font-black uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Chat</span>
               </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Form Interface */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 relative overflow-hidden group">
               {/* Decorative corner element */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] transition-transform group-hover:scale-110 duration-1000"></div>
               
               {submitted ? (
                 <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in duration-700">
                    <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-10 relative">
                       <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                       <CheckCircle2 size={56} className="relative z-10" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
                       {settings.contactSuccessTitle}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-sm mx-auto font-light leading-relaxed">
                       {settings.contactSuccessMessage}
                    </p>
                    <div className="space-y-6 flex flex-col items-center">
                       <button 
                        onClick={() => setSubmitted(false)} 
                        className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary hover:text-slate-900 transition-all shadow-xl active:scale-95"
                       >
                         Send Another Transmission
                       </button>
                       <Signature className="h-16 text-primary/40" />
                    </div>
                 </div>
               ) : (
                 <form className="space-y-10" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block">
                           {settings.contactFormNameLabel}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          className="w-full px-6 py-5 bg-slate-50 hover:bg-slate-100 focus:bg-white border-b-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block">
                           {settings.contactFormEmailLabel}
                        </label>
                        <input 
                          type="email" 
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                          className="w-full px-6 py-5 bg-slate-50 hover:bg-slate-100 focus:bg-white border-b-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                          placeholder="email@address.com" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block">
                           WhatsApp Connectivity
                        </label>
                        <input 
                          type="tel" 
                          value={formState.whatsapp}
                          onChange={(e) => setFormState({...formState, whatsapp: e.target.value})}
                          className="w-full px-6 py-5 bg-slate-50 hover:bg-slate-100 focus:bg-white border-b-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                          placeholder="+27..." 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block">
                           {settings.contactFormSubjectLabel}
                        </label>
                        <div className="relative">
                          <select 
                            value={formState.subject}
                            onChange={(e) => setFormState({...formState, subject: e.target.value})}
                            className="w-full px-6 py-5 bg-slate-50 hover:bg-slate-100 focus:bg-white border-b-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all text-slate-900 font-medium appearance-none cursor-pointer"
                          >
                            <option>Product Curation Inquiry</option>
                            <option>Styling Consultation</option>
                            <option>Brand Partnership</option>
                            <option>Bespoke Request</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block">
                         {settings.contactFormMessageLabel}
                      </label>
                      <textarea 
                        rows={6} 
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                        className="w-full px-6 py-5 bg-slate-50 hover:bg-slate-100 focus:bg-white border-b-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all text-slate-900 font-medium resize-none placeholder:text-slate-300" 
                        placeholder="In what way may I assist your curation journey?"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-5 group disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>{settings.contactFormButtonText}</span>
                          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                 </form>
               )}
            </div>
          </div>

          {/* Context & Info Sidebar */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-12">
             
             {/* Studio Details Block */}
             <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                {/* Abstract overlay */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                
                <h3 className="text-3xl font-serif mb-12 flex items-center gap-4">
                  <Globe size={24} className="text-primary"/> {settings.contactInfoTitle}
                </h3>
                
                <div className="space-y-10">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-primary" size={20} />
                     </div>
                     <div>
                       <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{settings.contactAddressLabel}</span>
                       <p className="text-xl leading-snug font-medium text-pretty">{settings.address}</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="text-primary" size={20} />
                     </div>
                     <div>
                       <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{settings.contactHoursLabel}</span>
                       <p className="text-sm text-slate-300 font-light">{settings.contactHoursWeekdays}</p>
                       <p className="text-sm text-slate-300 font-light mt-1">{settings.contactHoursWeekends}</p>
                     </div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap gap-4">
                  {(settings.socialLinks || []).map((link) => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      aria-label={`Visit my ${link.name}`}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all duration-300 hover:-translate-y-1"
                    >
                      {link.iconUrl ? <img src={link.iconUrl} alt="" className="w-5 h-5 object-contain invert"/> : <ArrowRight size={16} className="-rotate-45" />}
                    </a>
                  ))}
                </div>
             </div>

             {/* Personal Narrative Piece */}
             <div className="bg-primary/5 rounded-[3rem] p-10 border border-primary/10 relative overflow-hidden group">
                <Quote size={40} className="text-primary/10 absolute top-6 left-6" />
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                         <PenTool size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Note</span>
                   </div>
                   <p className="text-lg font-serif italic text-slate-700 leading-relaxed">
                      "My goal is to bridge the gap between discerning individuals and the world's most exceptional crafts. Whether you have a question about a piece or need a private consultation, I am here to ensure your collection reflects your story."
                   </p>
                   <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <Signature className="h-10 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Founder</span>
                        <span className="text-xs font-bold text-slate-900 leading-none">{settings.aboutFounderName}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* FAQ Accordion */}
             <div className="space-y-6">
                <h3 className="text-2xl font-serif text-slate-900 px-4 flex items-center gap-4">
                  <HelpCircle size={22} className="text-primary"/> Concise Intelligence
                </h3>
                <div className="space-y-3">
                   {faqs.map((faq, idx) => (
                     <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
                        <button 
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="w-full px-8 py-6 flex items-center justify-between text-left group"
                        >
                          <span className="text-sm font-bold text-slate-900 pr-4 group-hover:text-primary transition-colors">{faq.q}</span>
                          <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-all duration-500 ${openFaq === idx ? 'rotate-180 bg-slate-900 text-white' : 'text-slate-400 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                             {openFaq === idx ? <Minus size={14}/> : <Plus size={14}/>}
                          </div>
                        </button>
                        <div className={`px-8 overflow-hidden transition-all duration-500 ease-in-out ${openFaq === idx ? 'max-h-60 pb-8 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                           <p className="text-sm text-slate-500 leading-relaxed font-light pl-2 border-l-2 border-primary/20">{faq.a}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;