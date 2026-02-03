import React from 'react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useSettings } from '../App';

const TrustOverlay: React.FC<{ destination: string }> = ({ destination }) => {
  const { settings } = useSettings();

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-md w-full px-8 text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 bg-slate-900 rounded-3xl border border-primary/30 flex items-center justify-center text-primary shadow-2xl mx-auto">
            <ShieldCheck size={48} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-serif text-white tracking-tight">Verified Partnership</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Securing your bridge to <span className="text-primary font-bold">{destination}</span>. 
            We've personally vetted this collection for quality and service.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Redirecting in seconds <ArrowRight size={12} />
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-[9px] text-slate-600 uppercase tracking-widest leading-relaxed">
            This bridge is powered by {settings.companyName} Curation Services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustOverlay;