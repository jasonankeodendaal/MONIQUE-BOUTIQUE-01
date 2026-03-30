import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useSettings } from '../App';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string) => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { settings } = useSettings();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-2xl font-serif text-gray-900 mb-2">Send Inquiry</h3>
        <p className="text-gray-500 text-sm mb-6">
          Please provide your details so we can get back to you regarding your inquiry.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-black text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Send size={16} />
            Continue to WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
