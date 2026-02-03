import React from 'react';
import { useSettings } from '../App';

const SignatureHeader: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="flex flex-col items-start gap-2 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5 overflow-hidden animate-float">
          {/* Placeholder for the "speaking me" video circle */}
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
              src="https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-while-sitting-in-a-cafe-4416-large.mp4"
            />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block">Personal Message</span>
          <h4 className="text-3xl font-signature text-slate-800 -mt-1">
            {settings.aboutFounderName || "The Curator"}
          </h4>
        </div>
      </div>
      <div className="h-0.5 w-24 bg-gradient-to-r from-primary to-transparent opacity-30 ml-20"></div>
    </div>
  );
};

export default SignatureHeader;