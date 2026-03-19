import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CustomIcons } from './CustomIcons';

interface IconRendererProps {
  icon: string;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ 
  icon, 
  size = 24, 
  className = "", 
  strokeWidth = 1 
}) => {
  if (!icon) return null;

  const isUrl = icon.startsWith('http') || icon.startsWith('data:image');

  if (isUrl) {
    return (
      <img 
        src={icon} 
        alt="icon" 
        style={{ width: size, height: size, objectFit: 'contain' }} 
        className={className}
        referrerPolicy="no-referrer"
      />
    );
  }

  const IconComponent = CustomIcons[icon] || (LucideIcons as any)[icon] || LucideIcons.Package;
  
  return (
    <IconComponent 
      size={size} 
      className={className} 
      strokeWidth={strokeWidth} 
    />
  );
};
