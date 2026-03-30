import React, { useState } from 'react';
import { X, User, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; email: string }) => void;
  title?: string;
  description?: string;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Complete Your Inquiry",
  description = "Please provide your details so we can assist you better on WhatsApp."
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onConfirm({ name, email });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>

            <div className="p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <MessageCircle size={24} />
              </div>

              <h3 className="text-2xl font-serif text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {description}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-primary hover:text-slate-900 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  Continue to WhatsApp
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
