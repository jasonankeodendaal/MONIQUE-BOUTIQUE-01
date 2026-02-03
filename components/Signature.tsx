
import React from 'react';

interface SignatureProps {
  className?: string;
  color?: string;
}

export const Signature: React.FC<SignatureProps> = ({ className = "h-12", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 200 60" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <path 
        d="M20 40C30 35 45 25 55 28C65 31 40 45 35 48C30 51 60 40 80 35C100 30 120 20 135 25C150 30 110 50 100 52C90 54 130 35 155 30C180 25 190 20 185 15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-[draw_2s_ease-out]"
      />
      <style>{`
        @keyframes draw {
          from { stroke-dasharray: 500; stroke-dashoffset: 500; }
          to { stroke-dasharray: 500; stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
};

export default Signature;
